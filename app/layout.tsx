import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://ulicznyabsurd.vercel.app'),
 title: {default: 'Uliczny Absurd — nosi się niepoważnie', template: '%s | Uliczny Absurd'},
 description: 'Koszulki z charakterem. Poznaj kolekcję Uliczny Absurd.',
 robots: {index: false, follow: false},
 openGraph: {title: 'Uliczny Absurd', description: 'Nosi się niepoważnie.', locale: 'pl_PL', type: 'website', images: ['/logo-texture.webp']},
 icons: { icon: '/favicon.png' }
};
export default function Layout({children}: {children: React.ReactNode}) { return <html lang="pl"><body>{children}</body></html>; }
