/**
 * Single source of truth for project metadata.
 * All placeholders use NEXT_PUBLIC_* env vars so user can configure
 * without touching code.
 */
export const siteConfig = {
  /** Project identifier — used in email subjects, analytics, etc. */
  projectId: 'elden-codex',

  /** Project name shown to humans */
  projectName: 'Elden Codex',

  /** Domain — fill in after user picks. Used for canonical URLs, OG, sitemap. */
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'eldencodex.com',

  /** Full base URL */
  get baseUrl() {
    return `https://${this.domain}`;
  },

  /** Contact form recipient — user's real email, kept server-side only */
  contactRecipient: process.env.CONTACT_RECIPIENT_EMAIL || '',

  /** Email subject prefix — auto-tags inbox so user can route across projects */
  emailSubjectPrefix: '[Elden Codex]',

  /** Game cover image path — user drops their image here */
  heroImage: '/images/elden-ring-cover.png',

  /** Monetization config — all toggle-able via env */
  monetization: {
    adsense: {
      enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
      clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    },
    amazon: {
      enabled: process.env.NEXT_PUBLIC_AMAZON_ENABLED === 'true',
      affiliateTag: process.env.NEXT_PUBLIC_AMAZON_TAG || '',
    },
    steamKey: {
      enabled: process.env.NEXT_PUBLIC_STEAM_KEY_ENABLED === 'true',
      // affiliate IDs per partner
      fanatical: process.env.NEXT_PUBLIC_FANATICAL_ID || '',
      gmg: process.env.NEXT_PUBLIC_GMG_ID || '',
      eneba: process.env.NEXT_PUBLIC_ENEBA_ID || '',
    },
  },

  /** Social / external */
  links: {
    github: '',
    twitter: '',
    discord: '',
  },
} as const;
