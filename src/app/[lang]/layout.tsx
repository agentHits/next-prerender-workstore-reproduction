import type { ReactNode } from 'react';
import Link from 'next/link';
import { languages, type Locale } from '@/locales';

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <Link href={`/${lang}`}>Home</Link>
        <Link href={`/${lang}/benchmark`}>Benchmark</Link>
        <Link href={`/${lang}/manifesto`}>Manifesto</Link>
        <Link href={`/${lang}/architecture`}>Architecture</Link>
        <Link href={`/${lang}/performance`}>Performance</Link>
        <Link href={`/${lang}/turbopack`}>Turbopack</Link>
      </nav>
      {children}
    </div>
  );
}
