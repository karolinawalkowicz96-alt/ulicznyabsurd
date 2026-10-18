import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Uliczny Absurd — nosi się niepoważnie',
  description: 'Humor z ulicy. Absurd w internecie. Koszulki z charakterem.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pl"><body>{children}</body></html>;
}
