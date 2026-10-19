import { getCatalog } from '@/lib/shop-service';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await getCatalog(),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Katalog chwilowo niedostępny.'},{status:503});}}
