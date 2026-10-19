import Store from '@/components/brand/Store';
import { getCatalog } from '@/lib/shop-service';
export const dynamic='force-dynamic';
export default async function Page(){return <Store initialCatalog={await getCatalog()}/>;}
