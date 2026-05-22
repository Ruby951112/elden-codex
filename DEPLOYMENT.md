# Deployment Guide — Elden Codex

Complete step-by-step guide to go from local code to a live, monetized website. Estimated total time: **2-3 hours** (most of it waiting for DNS / accounts).

## Overview

```
[Your code]  →  [GitHub]  →  [Vercel]  →  [Your domain]
                                ↓
                         [Anthropic API]
                         [Resend API]
                         [AdSense / Amazon]
```

---

## Step 1 — Set Up Accounts (do these in parallel, ~30 min)

Open these all in tabs:

| Service | URL | What you need |
|---------|-----|---------------|
| GitHub | https://github.com | Free account |
| Vercel | https://vercel.com | Sign up with GitHub |
| Anthropic Console | https://console.anthropic.com | Sign up + add $10 credit |
| Resend | https://resend.com | Free account (3,000 emails/mo) |
| Cloudflare | https://www.cloudflare.com | Free account (for domain) |

---

## Step 2 — Buy a Domain (~$10/year)

**Recommended: Cloudflare Registrar** (no markup, includes free DNS + privacy + email forwarding).

1. Go to https://dash.cloudflare.com → "Domain Registration" → "Register Domains"
2. Search for your desired name (e.g. `eldencodex.com`, `eldenguide.io`, `tarnishedcodex.net`)
3. Pay (~$10/year for `.com`)
4. Domain takes 5-30 minutes to register

**Alternatives**: Namecheap, Porkbun. Avoid GoDaddy (overpriced + upsell-heavy).

---

## Step 3 — Push Code to GitHub (~5 min)

```bash
# In the elden-codex/ folder
git init
git add .
git commit -m "Initial commit"

# Create new repo on GitHub (e.g. github.com/<you>/elden-codex)
git remote add origin https://github.com/<your-username>/elden-codex.git
git branch -M main
git push -u origin main
```

> **Important**: Make sure `.env.local` is in `.gitignore` (it is, by default). Never commit API keys.

---

## Step 4 — Get Your API Keys (~10 min)

### Anthropic API Key

1. Go to https://console.anthropic.com → "API Keys"
2. Click "Create Key" → name it `elden-codex-prod`
3. Copy the key (starts with `sk-ant-...`) — **save it now, you can't view it again**
4. In "Billing" → add at least $10 credit (enough for ~3,000 boss generations)

### Resend API Key

1. Go to https://resend.com → "API Keys"
2. Click "Create API Key" → name it `elden-codex`
3. Copy the key (starts with `re_...`)

### (Optional now, required later) Verify your sending domain in Resend

For production, you want emails to come `from: hello@eldencodex.com` instead of the default Resend address:

1. In Resend → "Domains" → "Add Domain" → enter your domain
2. Resend gives you DNS records (TXT, MX) to add
3. In Cloudflare → DNS → add those records
4. Wait 5-30 min for verification

You can skip this initially — emails will work from `onboarding@resend.dev`, just less professional.

---

## Step 5 — Deploy to Vercel (~10 min)

1. Go to https://vercel.com/new
2. Click "Import Git Repository" → select your `elden-codex` repo
3. Vercel auto-detects Next.js — keep all defaults
4. **Before clicking Deploy**, expand "Environment Variables" and add:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (from step 4) |
| `RESEND_API_KEY` | `re_...` (from step 4) |
| `CONTACT_RECIPIENT_EMAIL` | Your real email |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` (for now) |
| `NEXT_PUBLIC_SITE_DOMAIN` | `eldencodex.com` (your domain, no protocol) |

5. Click **Deploy**
6. Wait ~2 min — Vercel gives you a temp URL like `elden-codex-xyz.vercel.app`

Visit the URL — you should see your homepage!

---

## Step 6 — Connect Your Domain (~15 min + DNS wait)

In Vercel:

1. Go to your project → **Settings** → **Domains**
2. Click "Add" → enter `eldencodex.com`
3. Vercel shows DNS records you need to add

In Cloudflare (DNS):

1. Go to your domain → **DNS** → **Records**
2. Add the records Vercel gave you:
   - Type `A`, Name `@`, Value `76.76.21.21` (Vercel's IP)
   - Type `CNAME`, Name `www`, Value `cname.vercel-dns.com`
3. Make sure both records have the orange cloud icon **OFF** (DNS-only mode initially)
4. Wait 5-30 min for DNS propagation

Back in Vercel — domain should show ✓ "Valid Configuration" within an hour.

Visit `https://eldencodex.com` — your site is live with HTTPS! 🎉

---

## Step 7 — Generate Content (~1-2 hours, mostly waiting)

Now fill in the 165 boss pages. **Do this locally**, not on Vercel (long-running script).

```bash
# Make sure .env.local has ANTHROPIC_API_KEY
cp .env.example .env.local
# Edit .env.local — add your real ANTHROPIC_API_KEY

# Test with one boss first
npm run generate:bosses -- --slug=starscourge-radahn

# Check the output looks good
cat content/bosses/en/starscourge-radahn.mdx
cat content/bosses/zh/starscourge-radahn.mdx

# Spot-check the rendered page locally
npm run dev
# Visit http://localhost:3000/en/bosses/starscourge-radahn

# Happy with quality? Generate everything:
npm run generate:bosses

# Then walkthroughs:
npm run generate:walkthrough

# Commit the generated content
git add content/
git commit -m "Generate all boss + walkthrough content"
git push
```

Vercel auto-deploys on every push. Your site updates in ~2 min.

---

## Step 8 — Set Up Monetization (incremental)

### Now (with 0 traffic)

**Amazon Associates** — apply at https://affiliate-program.amazon.com

- Approval is fast (24-48h) but conditional: must make 3 sales in 180 days
- Once approved, in Vercel env vars set:
  - `NEXT_PUBLIC_AMAZON_ENABLED=true`
  - `NEXT_PUBLIC_AMAZON_TAG=yourtag-20`
- Edit `components/recommended-gear.tsx` to use real ASINs (Amazon product IDs)

### When you have any traffic (~100 visitors/day)

**Fanatical Steam key affiliate** — apply at https://www.fanatical.com/affiliates

- Approval ~3-7 days
- Once approved, set `NEXT_PUBLIC_STEAM_KEY_ENABLED=true` and `NEXT_PUBLIC_FANATICAL_ID=...`

### When you have ~1-3 months of content (~30+ guides published)

**Google AdSense** — apply at https://adsense.google.com

- Approval takes 1-4 weeks, sometimes rejected on first try
- Once approved:
  - Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` and `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...`
  - Add the AdSense `<script>` tag in `app/layout.tsx` (see `components/ad-slot.tsx` for the snippet)
  - Create ad units in AdSense dashboard → paste their slot IDs into `NEXT_PUBLIC_ADSENSE_SLOT_*` env vars

### When you hit ~50k sessions/month

**Mediavine** — apply at https://www.mediavine.com (RPM is 5-10x higher than AdSense)

---

## Step 9 — Promote (the actual hard part)

Building the site is the easy 20%. Getting traffic is the hard 80%. Some channels that work for game guide sites:

### Reddit (best ROI)

- r/Eldenring (1.4M members) — share a useful, non-spammy post (e.g. "I made a tool that shows Malenia's Waterfowl dodge timings by distance")
- r/fromsoftware, r/shittydarksouls (for humor + cross-pollination)
- **Rule**: 90% non-promotional engagement, 10% sharing your stuff

### YouTube

- Create short faceless walkthroughs (5-10 min each) → link to your detailed guide in description
- Focus on long-tail bosses ("how to cheese Astel Naturalborn"), not Malenia (oversaturated)

### Discord communities

- Join /r/Eldenring's Discord, FromSoftware Souls discord
- Be helpful in #help-and-advice channels
- Drop your link only when directly relevant

### SEO (slow but compounding)

- Submit `eldencodex.com/sitemap.xml` to Google Search Console
- Pages take 2-8 weeks to start ranking
- Long-tail keywords are easier ("malenia waterfowl dodge distance" > "elden ring malenia")

### B站 / 小红书 (Chinese audience)

- Bilibili: post a short 3-min boss strategy video → link to your Chinese page
- 小红书: post screenshot carousels of your most beautiful guide pages
- These platforms reward consistent posting more than initial reach

---

## Troubleshooting

### "Build failed on Vercel"

- Check the build log. Most common: missing env var, or `next-env.d.ts` missing. Run `npm run build` locally to reproduce.

### "Contact form returns 503"

- Means `RESEND_API_KEY` or `CONTACT_RECIPIENT_EMAIL` env var is not set. Check Vercel → Settings → Environment Variables.
- Also check Resend dashboard for delivery logs.

### "Generated MDX is broken / weird"

- Check `data/bosses.json` — does the boss have all required fields?
- Try with `--force` to regenerate
- If a specific boss keeps producing bad output, add more detail to its `summary_en` / `summary_zh` for richer context to the AI

### "Site looks ugly on mobile"

- The site is mobile-first responsive. If something looks off, check Chrome DevTools mobile preview. Common cause: custom CSS overriding Tailwind utilities.

### "AdSense won't approve me"

- Most common reasons: not enough original content (<20 pages), domain too new (<1 month), traffic too low (<100/day). Wait, generate more content, then reapply.

---

## Cost Summary (Year 1)

| Item | Cost |
|------|------|
| Domain (Cloudflare) | $10/year |
| Vercel hosting | $0 (free tier handles up to ~100GB/mo bandwidth) |
| Anthropic API (content gen, one-time) | $20-50 |
| Resend (contact form) | $0 (3k emails/mo free) |
| AdSense / Amazon / Steam Key | $0 (revenue share) |
| **Total Year 1** | **~$30-60** |

If the site grows past ~100k visits/month, you'll want to upgrade Vercel to Pro ($20/mo) or migrate to Cloudflare Pages (free).

---

## What's Next After Launch

1. **Add Builds section** (`content/builds/`) — high-traffic SEO target
2. **Add an interactive boss difficulty filter** to `/bosses` page
3. **Add an interactive map** with boss markers (use Leaflet + game map image)
4. **Add a build planner tool** (the "Mobalytics for Elden Ring" angle)
5. **Build the Steam new-game scoring tool** as `eldencodex.com/radar` or a separate domain

---

Good luck out there, Tarnished. 🗡️
