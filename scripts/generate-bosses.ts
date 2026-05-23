#!/usr/bin/env tsx
/**
 * Boss Guide Generation Pipeline (v2 — interleaved bilingual)
 *
 * For each boss, generates BOTH the English and Chinese MDX before moving on.
 * If interrupted, just re-run — already-generated files are skipped.
 *
 * Usage:
 *   npm run generate:bosses                       # all bosses, both langs
 *   npm run generate:bosses -- --limit=5          # only first 5 unprocessed bosses
 *   npm run generate:bosses -- --slug=malenia     # one boss
 *   npm run generate:bosses -- --region=limgrave  # all bosses in one region
 *   npm run generate:bosses -- --lang=zh          # only Chinese
 *   npm run generate:bosses -- --force            # overwrite existing
 *   npm run generate:bosses -- --max-cost=5       # stop after spending $5
 *   npm run generate:bosses -- --dry-run          # estimate without API calls
 *
 * Cost estimate: ~$0.05-0.08 per language. Full run ≈ $6-8.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config(); // also try .env

// ---------- Config ----------

const ROOT = process.cwd();
const BOSSES_JSON = path.join(ROOT, 'data', 'bosses.json');
const REFERENCE_DIR = path.join(ROOT, 'content', 'bosses');
const OUTPUT_DIR = path.join(ROOT, 'content', 'bosses');

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 4000;

const REFERENCE_SLUGS = [
  'margit-the-fell-omen',
  'godrick-the-grafted',
  'malenia-blade-of-miquella',
];

const COST_PER_INPUT_TOKEN = 3 / 1_000_000;
const COST_PER_OUTPUT_TOKEN = 15 / 1_000_000;

const MAX_RETRIES = 3;

// ---------- Graceful shutdown ----------

let interrupted = false;
process.on('SIGINT', () => {
  if (interrupted) {
    console.log('\n\nForce exiting…');
    process.exit(130);
  }
  interrupted = true;
  console.log('\n\n⚠  Interrupt received. Finishing current task then stopping…');
  console.log('   (Press Ctrl+C again to force quit.)');
});

// ---------- Arg parsing ----------

interface Args {
  slug?: string;
  region?: string;
  lang?: 'en' | 'zh';
  force: boolean;
  maxCost: number;
  dryRun: boolean;
  limit: number;
}

function parseArgs(): Args {
  const args: Args = { force: false, maxCost: Infinity, dryRun: false, limit: Infinity };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--force') args.force = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--slug=')) args.slug = arg.slice(7);
    else if (arg.startsWith('--region=')) args.region = arg.slice(9);
    else if (arg.startsWith('--lang=')) {
      const v = arg.slice(7);
      if (v === 'en' || v === 'zh') args.lang = v;
    } else if (arg.startsWith('--max-cost=')) {
      args.maxCost = parseFloat(arg.slice(11));
    } else if (arg.startsWith('--limit=')) {
      args.limit = parseInt(arg.slice(8), 10);
    }
  }
  return args;
}

// ---------- Types ----------

interface Boss {
  slug: string;
  name_en: string;
  name_zh: string;
  location_en: string;
  location_zh: string;
  region: string;
  type: string;
  runes: number;
  hp?: number | string;
  difficulty: number;
  phases: number;
  weakness: string[];
  summary_en: string;
  summary_zh: string;
}

// ---------- Reference loading ----------

function loadReferences(lang: 'en' | 'zh'): string {
  const examples: string[] = [];
  for (const slug of REFERENCE_SLUGS) {
    const filePath = path.join(REFERENCE_DIR, lang, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      examples.push(`<example slug="${slug}">\n${content}\n</example>`);
    }
  }
  return examples.join('\n\n');
}

// ---------- Prompt builders ----------

function buildSystemPrompt(lang: 'en' | 'zh', referenceContent: string): string {
  const langLabel = lang === 'en' ? 'English' : 'Simplified Chinese (简体中文)';

  return `You are an expert Elden Ring strategist and guide writer. Your job is to produce a single MDX (Markdown + frontmatter) file containing a phase-by-phase Elden Ring boss strategy guide in ${langLabel}.

## Quality Standard

Below are reference guides written by hand to set the tone, depth, and structure. Match their quality, voice, and section structure exactly. Do not invent new section headings beyond what the references use.

${referenceContent}

## Rules

1. Output ONLY the MDX file content — no preamble, no commentary, no markdown code fences.
2. Begin with YAML frontmatter (--- fenced).
3. ${lang === 'en'
      ? 'Write in fluent, evocative English. Tone: knowledgeable veteran who respects the reader.'
      : '使用流畅、有韵味的简体中文。语气:尊重读者的资深玩家。直接使用游戏官方简体中文译名(例如:玛尔基特、葛瑞克、米凯拉之刃、绯红腐败、卢恩、赐福、褪色者)。不要使用繁体字。'}
4. Use section headings exactly matching the references (Phase Strategy, Attacks & Counters, Recommended Loadout, etc.). ${lang === 'zh' ? '将标题适当翻译为中文(阶段策略、招式与应对、推荐配装).' : ''}
5. Include 3-6 concrete attack patterns with specific counters.
6. Be specific: name actual weapons, talismans, ashes of war, items.
7. NEVER fabricate game mechanics. If you are unsure about a detail, omit it rather than guess.
8. Use blockquotes for critical warnings: > **Critical:** ...
9. Length: 800-1500 words of actual content (not including frontmatter).
10. The MDX will be embedded in a styled page that already shows the boss's stats — do NOT repeat those at the top. Start directly with strategy.`;
}

function buildUserPrompt(boss: Boss, lang: 'en' | 'zh'): string {
  const name = lang === 'en' ? boss.name_en : boss.name_zh;
  const location = lang === 'en' ? boss.location_en : boss.location_zh;
  const summary = lang === 'en' ? boss.summary_en : boss.summary_zh;
  const weaknessStr = boss.weakness.join(', ');

  return `Generate the MDX guide for this boss:

- Name: ${name}
- Slug: ${boss.slug}
- Location: ${location}
- Type: ${boss.type}
- Region: ${boss.region}
- Phases: ${boss.phases}
- HP (NG): ${boss.hp ?? 'unknown'}
- Runes: ${boss.runes}
- Difficulty: ${boss.difficulty}/5
- Weakness: ${weaknessStr}
- Quick summary: ${summary}

Required frontmatter fields:
- title: "${name} — ${lang === 'en' ? 'Boss Guide' : '攻略'}"
- slug: "${boss.slug}"
- description: <one sentence SEO description, ~150 chars>
- keywords: [list of 5-8 relevant SEO keywords for ${lang === 'en' ? 'English' : 'Chinese'} search]
- updated: "${new Date().toISOString().slice(0, 10)}"

Begin output now.`;
}

// ---------- Generation with retry ----------

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAnthropicWithRetry(
  client: Anthropic,
  systemPrompt: string,
  userPrompt: string
): Promise<Anthropic.Message> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`     retry ${attempt}/${MAX_RETRIES} in ${wait}ms…`);
        await sleep(wait);
      }
    }
  }
  throw lastError;
}

async function generateOne(
  client: Anthropic,
  boss: Boss,
  lang: 'en' | 'zh',
  referenceContent: string,
  args: Args,
  costTracker: { spent: number }
): Promise<{ skipped: boolean; cost: number; reason?: string }> {
  const outPath = path.join(OUTPUT_DIR, lang, `${boss.slug}.mdx`);

  if (REFERENCE_SLUGS.includes(boss.slug) && !args.force) {
    return { skipped: true, cost: 0, reason: 'reference' };
  }
  if (fs.existsSync(outPath) && !args.force) {
    return { skipped: true, cost: 0, reason: 'exists' };
  }

  if (args.dryRun) {
    const est = 3000 * COST_PER_INPUT_TOKEN + 2000 * COST_PER_OUTPUT_TOKEN;
    return { skipped: true, cost: est, reason: 'dry-run' };
  }

  if (costTracker.spent >= args.maxCost) {
    return { skipped: true, cost: 0, reason: 'cost cap' };
  }

  const systemPrompt = buildSystemPrompt(lang, referenceContent);
  const userPrompt = buildUserPrompt(boss, lang);

  const response = await callAnthropicWithRetry(client, systemPrompt, userPrompt);

  const cost =
    response.usage.input_tokens * COST_PER_INPUT_TOKEN +
    response.usage.output_tokens * COST_PER_OUTPUT_TOKEN;
  costTracker.spent += cost;

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const cleaned = text
    .replace(/^```(?:mdx|markdown)?\s*\n/, '')
    .replace(/\n```\s*$/, '')
    .trim();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, cleaned + '\n', 'utf-8');

  return { skipped: false, cost };
}

// ---------- Main ----------

async function main() {
  const args = parseArgs();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !args.dryRun) {
    console.error('Error: ANTHROPIC_API_KEY env var is not set.');
    console.error('Add it to .env.local — get a key at https://console.anthropic.com');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const data = JSON.parse(fs.readFileSync(BOSSES_JSON, 'utf-8'));
  let bosses: Boss[] = data.bosses;

  // Filters
  if (args.slug) bosses = bosses.filter((b) => b.slug === args.slug);
  if (args.region) bosses = bosses.filter((b) => b.region === args.region);

  if (bosses.length === 0) {
    console.error('No matching bosses found.');
    process.exit(1);
  }

  const langs: ('en' | 'zh')[] = args.lang ? [args.lang] : ['en', 'zh'];

  // Apply limit AFTER filtering — limit applies to # of bosses we'll touch
  if (Number.isFinite(args.limit)) {
    // Find first N bosses that have at least one pending language
    const filtered: Boss[] = [];
    for (const boss of bosses) {
      if (filtered.length >= args.limit) break;
      const hasPending = langs.some((lang) => {
        if (REFERENCE_SLUGS.includes(boss.slug) && !args.force) return false;
        const out = path.join(OUTPUT_DIR, lang, `${boss.slug}.mdx`);
        return !fs.existsSync(out) || args.force;
      });
      if (hasPending) filtered.push(boss);
    }
    bosses = filtered;
  }

  console.log(`\n⚔  Elden Codex — Boss Generation Pipeline (v2)\n`);
  console.log(`   Bosses to process: ${bosses.length}`);
  console.log(`   Languages: ${langs.join(', ')}`);
  console.log(`   Total tasks: ${bosses.length * langs.length}`);
  if (args.maxCost !== Infinity) console.log(`   Cost cap: $${args.maxCost}`);
  if (args.limit !== Infinity) console.log(`   Limit: ${args.limit} bosses`);
  if (args.dryRun) console.log(`   Mode: DRY RUN`);
  console.log('');

  const costTracker = { spent: 0 };
  const stats = { generated: 0, skipped: 0, errors: 0 };

  const refs = {
    en: loadReferences('en'),
    zh: loadReferences('zh'),
  };

  // INTERLEAVED: for each boss, run all langs in sequence before moving on
  outer: for (const boss of bosses) {
    for (const lang of langs) {
      if (interrupted) break outer;

      const tag = `[${lang}] ${boss.name_en}`;
      try {
        const result = await generateOne(client, boss, lang, refs[lang], args, costTracker);
        if (result.skipped) {
          console.log(`◌ ${tag} — skipped (${result.reason})`);
          stats.skipped++;
        } else {
          console.log(
            `✓ ${tag} — $${result.cost.toFixed(4)} (running total: $${costTracker.spent.toFixed(2)})`
          );
          stats.generated++;
        }
      } catch (err) {
        console.error(`✗ ${tag} — ERROR:`, err instanceof Error ? err.message : err);
        stats.errors++;
      }
    }
  }

  console.log('\n────────────────────────────────────────');
  console.log(`Generated: ${stats.generated}`);
  console.log(`Skipped:   ${stats.skipped}`);
  console.log(`Errors:    ${stats.errors}`);
  console.log(`Total cost: $${costTracker.spent.toFixed(4)}`);
  if (interrupted) console.log(`Status:    INTERRUPTED — re-run to continue`);
  console.log('────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});