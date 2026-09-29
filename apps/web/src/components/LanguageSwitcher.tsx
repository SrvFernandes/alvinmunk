'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function LanguageSwitcher({ variant = 'full' }: { variant?: 'full' | 'icon' }) {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith('/app');

  const switchLanguage = (lang: string) => {
    const nextLocale = lang === 'en' ? 'tr' : 'en';
    const newPath = pathname?.replace(/^\/\w{2}/, `/${nextLocale}`) || `/${nextLocale}`;
    window.location.href = newPath;
  };

  if (variant === 'icon') {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLanguage('en')}
          className="text-sm"
          lang="en"
        >
          English
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLanguage('tr')}
          className="text-sm"
          lang="tr"
        >
          Türkçe
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link href={pathname?.replace(/^\/\w{2}/, '/en') || '/en'} lang="en" className="text-sm hover:underline">
        English
      </Link>
      <Link href={pathname?.replace(/^\/\w{2}/, '/tr') || '/tr'} lang="tr" className="text-sm hover:underline">
        Türkçe
      </Link>
    </div>
  );
}
