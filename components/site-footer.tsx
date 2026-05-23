import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site-config';
import { EldenSigil } from './site-header';

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-deepest border-t border-edge mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Top section */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <EldenSigil className="w-5 h-5 text-gold" />
              <span className="font-gothic text-gold text-sm tracking-gothic">
                {dict.site.name.toUpperCase()}
              </span>
            </Link>
            <p className="text-ink-subtle text-sm font-serif italic max-w-xs">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Contact / Feedback */}
          <div className="flex flex-col gap-2">
            <h3 className="font-gothic text-xs uppercase tracking-widest text-gold mb-1">
              {dict.footer.contact}
            </h3>
            <Link
              href={`/${locale}/contact`}
              className="text-ink-body hover:text-gold text-sm transition-colors inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6 L20 6 L20 18 L4 18 Z" />
                <path d="M4 6 L12 13 L20 6" />
              </svg>
              {dict.footer.feedback}
            </Link>
            <p className="text-ink-faint text-xs font-serif italic">
              {/* All feedback routed through tagged form → user inbox */}
              {locale === 'en'
                ? 'Spotted a mistake? Want to collaborate? Let us know.'
                : '发现错误?想要合作?随时告诉我们。'}
            </p>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h3 className="font-gothic text-xs uppercase tracking-widest text-gold mb-1">
              {locale === 'en' ? 'Legal' : '法律'}
            </h3>
            <Link href={`/${locale}/about`} className="text-ink-body hover:text-gold text-sm transition-colors">
              {locale === 'en' ? 'About' : '关于'}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-ink-body hover:text-gold text-sm transition-colors">
              {locale === 'en' ? 'Privacy Policy' : '隐私政策'}
            </Link>
            <Link href={`/${locale}/terms`} className="text-ink-body hover:text-gold text-sm transition-colors">
              {locale === 'en' ? 'Terms of Service' : '服务条款'}
            </Link>
          </div>
        </div>

        {/* Ornament divider */}
        <div className="ornament my-8">
          <span>◆ ❦ ◆</span>
        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-ink-faint">
          <p>© {year} {siteConfig.projectName}</p>
          <p className="font-serif italic max-w-2xl">{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
