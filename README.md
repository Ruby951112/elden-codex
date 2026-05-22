# Elden Codex ⚔

> Every boss, every path, every secret of the Lands Between.

A bilingual (English / 简体中文) Elden Ring strategy site built with Next.js 14, MDX, and AI-assisted content generation. Designed for long reading sessions with a dark-bronze + matte-gold theme.

**Live demo:** _(set your domain after deploying)_

---

## 📚 Table of Contents

- [What This Is](#what-this-is)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Content Generation Pipeline](#content-generation-pipeline)
- [Customization](#customization)
- [Monetization Setup](#monetization-setup)
- [Deployment](#deployment)
- [Bilingual Editing](#bilingual-editing)
- [License & Attribution](#license--attribution)

---

## What This Is

A production-ready Elden Ring guide site, scaffolded as a template:

- ⚔️ **165 boss pages** (you generate the content via AI pipeline)
- 🗺️ **8 region walkthroughs**
- 🌏 **Full EN/ZH bilingual** (one source of truth, two language outputs)
- 📱 **Mobile-first responsive** (hamburger + bottom-tab nav)
- 💰 **Built-in monetization slots** (AdSense + Amazon + Steam key affiliates)
- 📩 **Contact form** with auto-tagged subject (`[Elden Codex] ...`) for cross-project inbox routing
- 🤖 **AI generation pipeline** for boss + walkthrough content
- 🚀 **One-click Vercel deploy**

The repo ships with **3 hand-written reference guides** (Margit, Godrick, Malenia) in both languages. The pipeline uses these as quality anchors to generate the remaining 162 bosses to a consistent standard.

---

## Quick Start

### Prerequisites

- **Node.js 18.17+** (`node --version`)
- **Git** installed
- Account at **Anthropic Console** (for content generation): https://console.anthropic.com
- Account at **Resend** (for contact form): https://resend.com
- (Later) Account at **Vercel** for deployment

### Install

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local with your real keys
#    (at minimum: ANTHROPIC_API_KEY, RESEND_API_KEY, CONTACT_RECIPIENT_EMAIL)

# 4. Start dev server
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/en`.

The 3 reference boss pages will work immediately (Margit, Godrick, Malenia). Other boss pages will show a placeholder until you run the generation pipeline.

---

## Project Structure

```
elden-codex/
├── app/                          # Next.js 14 App Router
│   ├── [lang]/                   # i18n route segment (en | zh)
│   │   ├── layout.tsx            # Header + Footer + MobileBottomNav wrapper
│   │   ├── page.tsx              # Homepage (hero + featured bosses)
│   │   ├── bosses/
│   │   │   ├── page.tsx          # Boss list + filters
│   │   │   └── [slug]/page.tsx   # Individual boss guide
│   │   ├── walkthrough/
│   │   │   ├── page.tsx          # Region overview
│   │   │   └── [region]/page.tsx # Per-region walkthrough
│   │   └── contact/page.tsx      # Feedback form
│   ├── api/contact/route.ts      # Form handler → Resend email
│   ├── layout.tsx                # Root layout (fonts, analytics)
│   ├── page.tsx                  # Redirects to /en
│   ├── sitemap.ts                # Dynamic sitemap.xml
│   └── robots.ts                 # robots.txt
│
├── components/
│   ├── site-header.tsx           # Desktop nav + mobile hamburger
│   ├── site-footer.tsx           # Footer with feedback link
│   ├── mobile-bottom-nav.tsx     # Mobile bottom tab bar
│   ├── boss-card.tsx             # Reusable boss preview card
│   ├── ad-slot.tsx               # AdSense slot (toggleable)
│   ├── recommended-gear.tsx      # Affiliate gear recommendations
│   └── contact-form.tsx          # Client-side form
│
├── content/
│   ├── bosses/
│   │   ├── en/*.mdx              # English boss guides
│   │   └── zh/*.mdx              # Chinese boss guides
│   └── walkthrough/
│       ├── en/*.mdx              # English region walkthroughs
│       └── zh/*.mdx              # Chinese region walkthroughs
│
├── data/
│   └── bosses.json               # Boss + region metadata (single source of truth)
│
├── lib/
│   ├── i18n.ts                   # Locale config + translation dictionary
│   ├── site-config.ts            # Project metadata + monetization config
│   ├── mdx.ts                    # MDX reader utilities
│   └── utils.ts                  # cn() class helper
│
├── scripts/
│   ├── generate-bosses.ts        # AI boss content pipeline
│   └── generate-walkthrough.ts   # AI walkthrough pipeline
│
├── styles/globals.css            # Theme tokens + ornaments + MDX styling
├── public/images/                # Hero image, OG tags
│
├── tailwind.config.ts            # Custom theme (bg/ink/gold/edge/danger/dlc)
├── next.config.js
├── tsconfig.json
├── package.json
├── .env.example                  # Env var template
└── README.md                     # ← you are here
```

---

## Content Generation Pipeline

The killer feature. Run the AI pipeline to fill in all 165 boss pages × 2 languages.

### How it works

1. Reads `data/bosses.json` (boss metadata: name, location, stats, weakness)
2. Loads the 3 reference MDX files (Margit, Godrick, Malenia) as **in-context style anchors**
3. Calls Claude Sonnet 4.5 with strict structural rules
4. Writes the output to `content/bosses/{en|zh}/{slug}.mdx`

### Commands

```bash
# Generate ONE boss (recommended for testing)
npm run generate:bosses -- --slug=starscourge-radahn

# Generate all bosses in a region
npm run generate:bosses -- --region=limgrave

# Generate only Chinese versions
npm run generate:bosses -- --lang=zh

# Generate everything (all 165 × 2 = 330 files)
npm run generate:bosses

# Force overwrite existing files
npm run generate:bosses -- --force

# Cap your spending
npm run generate:bosses -- --max-cost=5

# Dry-run (cost estimate without API calls)
npm run generate:bosses -- --dry-run

# Same flags work for walkthrough:
npm run generate:walkthrough -- --region=caelid --lang=en
```

### Cost estimates

Approximate cost using Claude Sonnet 4.5 (`$3 / 1M input tokens, $15 / 1M output tokens`):

| Scope | Files | Est. cost |
|-------|-------|-----------|
| 1 boss × 1 lang | 1 | $0.05 - $0.15 |
| All 165 × EN only | 162 | $10 - $25 |
| All 165 × EN + ZH | 324 | $20 - $50 |
| 8 walkthrough × 2 lang | 16 | $1.50 - $4 |

The pipeline always prints the running total. Use `--max-cost=N` as a hard ceiling.

### After generation: spot-check

Don't trust 100% of AI output. Open 10-20 random generated files and verify:

- Are weapon names, talisman names, item locations correct?
- Do phase transitions match the actual game?
- Does the Chinese version use official localized names (玛尔基特, not 玛吉特)?

Anything wrong → edit the MDX directly. The reference files (Margit/Godrick/Malenia) are great examples of the bar.

---

## Customization

### Add a new boss

1. Append to `data/bosses.json` with all fields
2. Run `npm run generate:bosses -- --slug=your-new-slug`
3. Page automatically appears at `/{lang}/bosses/your-new-slug`

### Change the visual theme

All theme tokens live in `tailwind.config.ts`. To shift the entire palette:

- `bg.*` controls background tones (deepest → reading)
- `ink.*` controls text colors (primary → faint)
- `gold.*` controls accent colors
- `edge.*` controls borders

For typography, edit `styles/globals.css` and `tailwind.config.ts → fontFamily`.

### Adjust translations

`lib/i18n.ts` has the full nav/UI dictionary. Add a third language by:

1. Adding it to the `locales` array
2. Adding its translations to the `dictionaries` object
3. Updating the language toggle in `components/site-header.tsx`

### Add a new content type (e.g. Builds, Weapons)

Mirror the existing pattern:

1. Create `app/[lang]/builds/page.tsx` (list)
2. Create `app/[lang]/builds/[slug]/page.tsx` (detail)
3. Create `content/builds/{en|zh}/*.mdx`
4. Add metadata to `data/builds.json`
5. Optionally: create `scripts/generate-builds.ts` (copy `generate-bosses.ts` structure)

---

## Monetization Setup

All monetization is **toggleable via env vars** — disabled by default until you're ready.

### Phase 1: Amazon Associates (start here)

- Apply at https://affiliate-program.amazon.com
- No traffic requirement initially (but you must make 3 qualifying sales in 180 days)
- Set `NEXT_PUBLIC_AMAZON_ENABLED=true` and `NEXT_PUBLIC_AMAZON_TAG=yourtag-20`
- Edit the catalog in `components/recommended-gear.tsx` to use real ASINs of products you'd recommend

### Phase 2: Steam Key Affiliates (when you have any traffic)

- **Fanatical**: https://www.fanatical.com/affiliates (5-15% commission)
- **GreenManGaming**: https://greenmangaming.com/affiliates
- Apply for one or both, get partner ID, set in `.env.local`

### Phase 3: AdSense (after 1+ months of content)

- Apply at https://adsense.google.com
- Approval typically takes 1-4 weeks; you need a meaningful amount of original content first
- Once approved, set `NEXT_PUBLIC_ADSENSE_ENABLED=true` and your `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- Create ad units in AdSense dashboard, paste slot IDs into the `_SLOT_*` env vars
- **Add the AdSense script to `app/layout.tsx`** (see commented section in `components/ad-slot.tsx`)

### Phase 4: Mediavine / Raptive (when you hit ~50k sessions/month)

- Much higher RPMs ($20-50 vs $2-8 for AdSense)
- Apply at https://www.mediavine.com or https://raptive.com
- They handle ad placement; you just swap providers

### Why no subscriptions

Decided against subscriptions for MVP. Content sites monetize best via ads + affiliates because:

- Lower friction (no signup wall)
- SEO benefit (more indexable content)
- Aligned with reader expectation of free guides

You can always add Pro features (premium build tools, downloadable PDFs) later.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions including domain setup, DNS, and env var configuration.

**TL;DR for the impatient:**

```bash
# Push to GitHub, then:
# 1. Go to vercel.com → New Project → Import your repo
# 2. Add env vars from .env.example
# 3. Click Deploy
# 4. Add your domain in Vercel → Domains
```

---

## Bilingual Editing

The site is fully bilingual. To keep both languages in sync:

| Layer | Where | How to translate |
|-------|-------|------------------|
| UI strings (nav, buttons, labels) | `lib/i18n.ts` | Edit the `dictionaries.en` and `dictionaries.zh` objects |
| Boss / region metadata | `data/bosses.json` | Each item has `name_en` and `name_zh` fields |
| Long-form guides | `content/bosses/{en\|zh}/` | Separate MDX file per language, same slug |
| Page metadata (title, description) | Each `page.tsx` has a `generateMetadata()` | Use `params.lang` to switch |

When adding a new boss, fill in **both** `_en` and `_zh` fields in `bosses.json`, then generate MDX for both languages.

---

## Performance

- Static generation for all pages (SSG via `generateStaticParams`)
- Lighthouse score target: 95+ Performance, 100 SEO, 100 Accessibility
- Image optimization via Next.js `<Image>`
- Font preloading via `next/font` (Cinzel + EB Garamond)

---

## License & Attribution

This is a fan project. Elden Ring, all character names, locations, and game art are © FromSoftware and Bandai Namco Entertainment.

This site uses official game imagery under fair use for the purpose of editorial commentary and strategy guides. No game files are redistributed.

The **codebase itself** is provided as a template — modify and use as you wish for your own projects.

---

## Credits

- Design: Custom dark-bronze theme inspired by Elden Ring's UI aesthetics
- Fonts: Cinzel (Open Font License), EB Garamond (Open Font License)
- Code generation: Claude Sonnet 4.5

Built with care, for Tarnished, by Tarnished.

> *Rise now, ye Tarnished.*
