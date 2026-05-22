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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.baseUrl,
    title: siteConfig.projectName,
    description: 'Every boss, every path, every secret of the Lands Between.',
    siteName: siteConfig.projectName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.projectName,
    description: 'Every boss, every path, every secret of the Lands Between.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
