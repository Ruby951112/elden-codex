import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { matchLocale } from '@/lib/i18n';

export default function Root() {
  const acceptLanguage = headers().get('accept-language');
  redirect(`/${matchLocale(acceptLanguage)}`);
}
