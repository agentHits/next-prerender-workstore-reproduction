import type { Metadata } from 'next';
import { languages, fetchPageMetadata, type Locale } from '@/locales';

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = await fetchPageMetadata(lang, 'Streaming vs Static Comparison');
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <article>
      <h2>Streaming vs Static Comparison ({lang})</h2>
      <p>
        Demonstrating static generation, metadata resolution, and lightweight rendering in Next.js 16.
        Cold prerendering verifies whether workStore remains correctly initialized across worker threads.
      </p>
    </article>
  );
}
