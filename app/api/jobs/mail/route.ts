import { releaseAbandonedStripeReservations } from '@/lib/shop-stripe';
export const maxDuration = 60;
import { timingSafeEqual } from 'node:crypto';
import { retryNotifications } from '@/lib/shop-mail';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){const expected=process.env.CRON_SECRET;const got=req.headers.get('authorization')||'';if(!expected||got.length!==expected.length+7||!timingSafeEqual(Buffer.from(got),Buffer.from(`Bearer ${expected}`)))return Response.json({error:'Unauthorized'},{status:401});const releasedReservations=await releaseAbandonedStripeReservations();return Response.json({...await retryNotifications(),releasedReservations});}
