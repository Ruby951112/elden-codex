#!/usr/bin/env tsx
/**
 * Region Walkthrough Generation Pipeline
 *
 * Generates per-region walkthrough MDX in EN/ZH.
 *
 * Usage:
 *   npm run generate:walkthrough                        # all regions, both langs
 *   npm run generate:walkthrough -- --region=limgrave   # one region
 *   npm run generate:walkthrough -- --lang=en --force   # English only, overwrite
 *
 * Each walkthrough covers: optimal path through the region, key items to grab,
 * which bosses to fight in which order, recommended level range.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const ROOT = process.cwd();
const BOSSES_JSON = path.join(ROOT, 'data', 'bosses.json');
const OUTPUT_DIR = path.join(ROOT, 'content', 'walkthrough');

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4000;
const COST_PER_INPUT_TOKEN = 3 / 1_000_000;
const COST_PER_OUTPUT_TOKEN = 15 / 1_000_000;

interface Args {
  region?: string;
  lang?: 'en' | 'zh';
  force: boolean;
  dryRun: boolean;
}

function parseArgs(): Args {
  const args: Args = { force: false, dryRun: false };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--force') args.force = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--region=')) args.region = arg.slice(9);
    else if (arg.startsWith('--lang=')) {
      const v = arg.slice(7);
      if (v === 'en' || v === 'zh') args.lang = v;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !args.dryRun) {
    console.error('ANTHROPIC_API_KEY required. Add to .env.local.');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const data = JSON.parse(fs.readFileSync(BOSSES_JSON, 'utf-8'));
  let regions = data.regions;
  if (args.region) regions = regions.filter((r: any) => r.slug === args.region);

  const langs: ('en' | 'zh')[] = args.lang ? [args.lang] : ['en', 'zh'];

  console.log(`\n❦  Walkthrough Generation Pipeline\n`);
  console.log(`   Regions: ${regions.length}, Languages: ${langs.join(', ')}\n`);

  let totalCost = 0;
  let generated = 0;
  let skipped = 0;

  for (const lang of langs) {
    for (const region of regions) {
      const outPath = path.join(OUTPUT_DIR, lang, `${region.slug}.mdx`);
      if (fs.existsSync(outPath) && !args.force) {
        console.log(`◌ [${lang}] ${region.name_en} — skipped (exists)`);
        skipped++;
        continue;
      }
      if (args.dryRun) {
        console.log(`◌ [${lang}] ${region.name_en} — dry-run`);
        continue;
      }

      const bossesInRegion = data.bosses.filter((b: any) => b.region === region.slug);
      const bossListText = bossesInRegion
        .map((b: any) => `- ${lang === 'en' ? b.name_en : b.name_zh} (${b.type}, difficulty ${b.difficulty}/10)`)
        .join('\n');

      const systemPrompt = `You are writing a region walkthrough for Elden Ring in ${lang === 'en' ? 'fluent English' : 'simplified Chinese (简体中文 — use official localized names)'}.

Output ONLY MDX content. Begin with YAML frontmatter.

Structure:
1. ## Overview — what this region is, vibe, threat level
2. ## Recommended Approach — what to do when you arrive
3. ## Key Items — 3-5 must-grab items in this region
4. ## Boss Order — recommended order to tackle bosses
5. ## Exit Path — where to go next

Length: 600-1000 words. Be specific, not generic. Reference actual items, NPCs, locations.`;

      const userPrompt = `Region: ${lang === 'en' ? region.name_en : region.name_zh}
Level range: ${region.level_range}

Bosses in this region:
${bossListText}

Frontmatter fields:
- title
- slug: "${region.slug}"
- description (SEO, ~150 chars)
- keywords (5-8 SEO keywords)
- updated: "${new Date().toISOString().slice(0, 10)}"`;

      try {
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          // Match prior Sonnet 4.5 behavior (no thinking) — 4.6 defaults to `high` effort.
          thinking: { type: 'disabled' },
          output_config: { effort: 'low' },
          // System prompt is identical across regions in a language. NOTE: it's
          // short (~200 tokens) — below Sonnet 4.6's 2048-token cache minimum —
          // so this won't actually cache until the prompt grows. Marked anyway
          // so caching kicks in automatically if it does.
          system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: userPrompt }],
        });
        const usage = response.usage;
        const cost =
          usage.input_tokens * COST_PER_INPUT_TOKEN +
          (usage.cache_creation_input_tokens ?? 0) * COST_PER_INPUT_TOKEN * 1.25 +
          (usage.cache_read_input_tokens ?? 0) * COST_PER_INPUT_TOKEN * 0.1 +
          usage.output_tokens * COST_PER_OUTPUT_TOKEN;
        totalCost += cost;

        const text = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('')
          .replace(/^```(?:mdx|markdown)?\s*\n/, '')
          .replace(/\n```\s*$/, '')
          .trim();

        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, text + '\n', 'utf-8');
        console.log(`✓ [${lang}] ${region.name_en} — $${cost.toFixed(4)}`);
        generated++;
      } catch (err) {
        console.error(`✗ [${lang}] ${region.name_en} —`, err instanceof Error ? err.message : err);
      }
    }
  }

  console.log(`\nGenerated: ${generated}, Skipped: ${skipped}, Cost: $${totalCost.toFixed(4)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
