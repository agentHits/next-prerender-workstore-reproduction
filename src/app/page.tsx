import Link from 'next/link';
import { languages } from '@/locales';

export default function RootPage() {
  return (
    <main>
      <h1>Next.js Lightweight Architecture Benchmark</h1>
      <p>Select a localized route to view benchmarks and prerendering performance:</p>
      <ul>
        {languages.map(lang => (
          <li key={lang}>
            <Link href={`/${lang}`}>View {lang.toUpperCase()} Benchmark</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
