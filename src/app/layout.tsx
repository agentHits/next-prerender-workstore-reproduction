import type { ReactNode } from 'react';

export const metadata = {
  title: 'Next.js Prerender & Turbopack Benchmark',
  description: 'Reproduction test project for App Router static prerendering performance',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {children}
      </body>
    </html>
  );
}
