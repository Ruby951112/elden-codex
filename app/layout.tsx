import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { siteConfig } from '@/lib/site-config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.projectName} — Elden Ring Boss Guides & Walkthroughs`,
    template: `%s | ${siteConfig.projectName}`,
  },
  description:
    'Phase-by-phase Elden Ring boss strategies, optimal walkthroughs, and build guides. Every boss, every path, every secret of the Lands Between.',
  keywords: [
    'Elden Ring',
    'Elden Ring guide',
    'Elden Ring bosses',
    'Elden Ring walkthrough',
    'Shadow of the Erdtree',
    'Malenia',
    'Margit',
    'Souls-like',
  ],
  authors: [{ name: siteConfig.projectName }],
  creator: siteConfig.projectName,
  publisher: siteConfig.projectName,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: siteConfig.baseUrl,
    title: `${siteConfig.projectName} — Elden Ring Boss Guides & Walkthroughs`,
    description: 'Every boss, every path, every secret of the Lands Between.',
    siteName: siteConfig.projectName,
    images: [
      {
        url: '/images/elden-ring-cover.png',
        width: 1200,
        height: 630,
        alt: 'Elden Codex — Elden Ring strategy site',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.projectName} — Elden Ring Strategy`,
    description: 'Every boss, every path, every secret of the Lands Between.',
    images: ['/images/elden-ring-cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
