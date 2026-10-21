import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import { CartProvider } from '@/components/shop/Shop';
import './globals.css';
import { profiles } from '@/lib/content';
import { jsonLd } from '@/lib/seo';

const origin='https://www.ulicznyabsurd.pl';

export const metadata:Metadata={
  metadataBase:new URL(origin),
  title:{default:'Śmieszne koszulki z nadrukiem | Uliczny Absurd',template:'%s | Uliczny Absurd'},
  description:'Koszulki z zabawnymi napisami i oryginalnymi ilustracjami Uliczny Absurd. Poznaj kolekcję, sprawdź rozmiary i znajdź pomysł na prezent z humorem.',
  alternates:{canonical:'/'},
  robots:{index:process.env.SEO_INDEXABLE==='true',follow:true,'max-image-preview':'large'},
  openGraph:{title:'Uliczny Absurd — śmieszne koszulki z nadrukiem',description:'Nosi się niepoważnie. Oryginalne koszulki z humorem.',url:origin,siteName:'Uliczny Absurd',locale:'pl_PL',type:'website',images:[{url:'/koszulka.webp',width:1215,height:1295}]},
  twitter:{card:'summary_large_image',title:'Uliczny Absurd — koszulki z humorem',images:['/koszulka.webp']},
  icons:{icon:'/favicon.png'},
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined}
};

export default function Layout({children}:{children:ReactNode}){
  const websiteSchema={'@context':'https://schema.org','@type':'WebSite','@id':origin+'/#website',url:origin,name:'Uliczny Absurd',inLanguage:'pl-PL'};
  const organizationSchema={'@context':'https://schema.org','@type':'OnlineStore','@id':origin+'/#store',name:'Uliczny Absurd',url:origin,logo:origin+'/logo-texture.webp',email:'ulicznyabsurd@gmail.com',telephone:'+48513258296',sameAs:Object.values(profiles)};
  return <html lang="pl"><body><CartProvider>{children}</CartProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd([websiteSchema,organizationSchema])}}/></body></html>;
}
