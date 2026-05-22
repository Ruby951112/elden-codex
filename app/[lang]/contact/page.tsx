import { getDictionary, type Locale } from '@/lib/i18n';
import { ContactForm } from '@/components/contact-form';
import { siteConfig } from '@/lib/site-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Feedback',
  description: 'Send feedback, corrections, or collaboration inquiries.',
};

export default function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);

  return (
    <div className="reading-area min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="text-center mb-8">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-3">
            {dict.contact.title.toUpperCase()}
          </h1>
          <p className="text-ink-muted font-serif italic text-sm">
            {dict.contact.subtitle}
          </p>
        </div>

        <ContactForm locale={lang} />

        <div className="text-center mt-8 text-xs text-ink-faint font-serif italic">
          {lang === 'en'
            ? `All messages auto-tagged with ${siteConfig.emailSubjectPrefix} for easy routing.`
            : `所有留言自动添加 ${siteConfig.emailSubjectPrefix} 标记便于分类。`}
        </div>
      </div>
    </div>
  );
}
