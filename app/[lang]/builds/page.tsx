import { type Locale } from '@/lib/i18n';

export const metadata = {
  title: 'Builds — Coming Soon',
};

export default function BuildsPage({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="reading-area min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="ornament mb-4"><span>◆ ❦ ◆</span></div>
        <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-4">
          {lang === 'en' ? 'BUILDS' : '流派'}
        </h1>
        <p className="text-ink-muted font-serif italic">
          {lang === 'en'
            ? 'Build guides coming soon. Sign up for updates at the contact page.'
            : '流派攻略即将上线。在联系页面订阅更新。'}
        </p>
        <div className="text-center mt-8 ornament"><span>◆</span></div>
      </div>
    </div>
  );
}
