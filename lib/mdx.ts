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

export function readBossContent(slug: string, locale: Locale): BossContent | null {
  const filePath = path.join(CONTENT_ROOT, 'bosses', locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: data as BossFrontmatter,
    body: content,
  };
}

export function listAllBossSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_ROOT, 'bosses', locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
