import { assertOrigin,hash,rateLimit } from '@/lib/shop-auth';
import { startStripePayment } from '@/lib/shop-stripe';
import { readBody } from '@/lib/server';
export async function POST(r:Request){try{assertOrigin(r);await rateLimit(`pay:${hash(r.headers.get('x-vercel-forwarded-for')||'unknown')}`,30,3600);const d=await readBody(r);if(!/^[a-f\d-]{36}$/i.test(d.orderId)||typeof d.token!=='string'||d.token.length!==64)return Response.json({error:'Nieprawidłowe dane.'},{status:400});return Response.json(await startStripePayment(d.orderId,d.token),{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'Nie udało się utworzyć płatności.'},{status:400});}}
