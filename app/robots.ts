import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:process.env.SEO_INDEXABLE==='true'?{userAgent:'*',allow:'/',disallow:['/admin','/api/','/zamowienie','/koszyk']}:{userAgent:'*',disallow:'/'},sitemap:'https://www.ulicznyabsurd.pl/sitemap.xml',host:'https://www.ulicznyabsurd.pl'};}
