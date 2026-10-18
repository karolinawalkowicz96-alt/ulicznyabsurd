import {allSnapshots} from '@/lib/social';
export async function GET(){return Response.json({platforms:await allSnapshots(),aggregateViews:null},{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}});}
