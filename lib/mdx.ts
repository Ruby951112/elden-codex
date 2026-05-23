import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from './i18n';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export interface BossFrontmatter {
  title: string;
  slug: string;
  description: string;
  keywords?: string[];
  updated?: string;
}

export interface BossContent {
  frontmatter: BossFrontmatter;
  body: string;
}

/**
 * Escape a bare `<` that the model used as a "less than" sign (e.g. `< 60%`,
 * `HP<40%`, `<= 5m`). MDX otherwise reads `<4` as the start of a JSX tag and
 * throws "Unexpected character ... before name", failing the production build.
 * Only `<` followed by whitespace, a digit, or `=` is escaped, so real HTML
 * tags (`<div>`, `</p>`, `<!--`) and markdown autolinks (`<https://…>`) are
 * left intact.
 */
function sanitizeMdx(body: string): string {
  return body.replace(/<(?=[\s0-9=])/g, '&lt;');
}

function readMdxFile(filePath: string, label: string): BossContent | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const { data, content } = matter(raw);
    return {
      frontmatter: data as BossFrontmatter,
      body: sanitizeMdx(content),
    };
  } catch (err) {
    // A single generated file with malformed YAML frontmatter shouldn't fail the
    // whole production build — degrade to the "content being generated" placeholder.
    console.warn(
      `[mdx] Skipping ${label} — frontmatter parse failed:`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export function readBossContent(slug: string, locale: Locale): BossContent | null {
  const filePath = path.join(CONTENT_ROOT, 'bosses', locale, `${slug}.mdx`);
  return readMdxFile(filePath, `${locale}/${slug}.mdx`);
}

export function readWalkthroughContent(slug: string, locale: Locale): BossContent | null {
  const filePath = path.join(CONTENT_ROOT, 'walkthrough', locale, `${slug}.mdx`);
  return readMdxFile(filePath, `walkthrough/${locale}/${slug}.mdx`);
}

/**
 * Rough reading-time estimate in minutes. CJK is counted by character
 * (~400 chars/min), Latin scripts by whitespace-delimited word (~200 words/min).
 * Markdown punctuation is stripped first so syntax doesn't inflate the count.
 */
export function estimateReadingMinutes(body: string, locale: Locale): number {
  const text = body.replace(/[#>*`_|~\-]+/g, ' ');
  if (locale === 'zh') {
    const cjk = (text.match(/[一-鿿]/g) || []).length;
    return Math.max(1, Math.round(cjk / 400));
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function listAllBossSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_ROOT, 'bosses', locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
