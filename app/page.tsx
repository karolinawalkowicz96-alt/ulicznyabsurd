import Store from '@/components/brand/Store';
import { getCatalog } from '@/lib/shop-service';
import { jsonLd, siteOrigin } from '@/lib/seo';
export const dynamic='force-dynamic';
export default async function Page(){
 const catalog=await getCatalog();
 const collection={'@context':'https://schema.org','@type':'ItemList',name:'Koszulki z nadrukiem Uliczny Absurd',itemListElement:catalog.products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:siteOrigin+'/produkt/'+p.slug}))};
 return <><Store initialCatalog={catalog} contactEnabled={process.env.CONTACT_ENABLED==='true'&&Boolean(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM&&process.env.CONTACT_TO)}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(collection)}}/></>;
}
