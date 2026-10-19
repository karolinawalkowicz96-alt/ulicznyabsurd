import Store from '@/components/brand/Store';
import { getCatalog } from '@/lib/shop-service';
export const dynamic='force-dynamic';
export default async function Page(){return <Store initialCatalog={await getCatalog()} contactEnabled={process.env.CONTACT_ENABLED==='true'&&Boolean(process.env.RESEND_API_KEY&&process.env.CONTACT_FROM&&process.env.CONTACT_TO)}/>;}
