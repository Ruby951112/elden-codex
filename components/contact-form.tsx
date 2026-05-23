'use client';

import { useState } from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';

export function ContactForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      website: (formData.get('website') as string) || '', // honeypot
      locale,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-bg-raised border border-gold-dim rounded-md p-8 text-center">
        <div className="text-gold text-3xl mb-3">◆</div>
        <p className="font-gothic text-sm text-gold tracking-widest mb-2">
          {locale === 'en' ? 'MESSAGE RECEIVED' : '留言已收到'}
        </p>
        <p className="text-ink-muted font-serif italic text-sm">{dict.contact.success}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 font-gothic text-xs uppercase tracking-widest text-ink-subtle hover:text-gold"
        >
          {locale === 'en' ? '← Send another' : '← 再发一条'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-raised border border-edge rounded-md p-6 md:p-8 flex flex-col gap-4">
      {/* Honeypot — invisible to humans; bots that fill it are silently dropped server-side */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden" tabIndex={-1}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-gothic text-[11px] uppercase tracking-widest text-ink-subtle">
          {dict.contact.name}
        </label>
        <input
          type="text"
          name="name"
          required
          minLength={2}
          maxLength={100}
          className="bg-bg-deepest border border-edge rounded px-3 py-2 text-ink-body font-serif focus:border-gold-dim focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-gothic text-[11px] uppercase tracking-widest text-ink-subtle">
          {dict.contact.email}
        </label>
        <input
          type="email"
          name="email"
          required
          className="bg-bg-deepest border border-edge rounded px-3 py-2 text-ink-body font-serif focus:border-gold-dim focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-gothic text-[11px] uppercase tracking-widest text-ink-subtle">
          {dict.contact.message}
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="bg-bg-deepest border border-edge rounded px-3 py-2 text-ink-body font-serif focus:border-gold-dim focus:outline-none transition-colors resize-y"
        />
      </div>

      {status === 'error' && (
        <div className="bg-danger-bg border border-danger-border rounded px-3 py-2 text-sm text-danger font-serif italic">
          {dict.contact.error}
          {errorMsg && <span className="block text-xs text-ink-muted mt-1">{errorMsg}</span>}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="font-gothic text-xs uppercase tracking-widest px-6 py-3 mt-2 bg-gold/10 border border-gold-dim text-gold hover:bg-gold/20 hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? dict.contact.sending : dict.contact.send}
      </button>
    </form>
  );
}
