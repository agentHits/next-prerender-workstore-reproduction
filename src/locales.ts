export const languages = ['en', 'es', 'fr', 'de', 'ja', 'ru', 'zh', 'it', 'pt', 'ko'] as const;
export type Locale = typeof languages[number];
export const defaultLanguage: Locale = 'en';

export async function fetchPageMetadata(lang: string, section: string) {
  // Simulate async I/O / database fetch for metadata
  await new Promise(resolve => setTimeout(resolve, 5));
  return {
    title: `Next.js Lightweight Benchmark - ${section} (${lang})`,
    description: `Exploring how Next.js 16 and Turbopack can deliver lighter HTML and faster prerendering across global architectures.`,
  };
}
