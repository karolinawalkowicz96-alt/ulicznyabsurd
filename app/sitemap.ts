import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/shop-service';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base='https://www.ulicznyabsurd.pl';const {products}=await getCatalog();return [...['','/kontakt','/sprzedawca','/dostawa','/zwroty','/reklamacje','/regulamin','/prywatnosc','/cookies','/odstapienie'].map(path=>({url:base+path})),...products.filter(p=>!p.hidden).map(p=>({url:base+'/produkt/'+p.slug,images:[new URL(p.image,base).href]}))];}
