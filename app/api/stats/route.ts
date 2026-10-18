import { allSnapshots } from '@/lib/social';

export const dynamic = 'force-dynamic';

export async function GET() {
    const platforms = await allSnapshots();
    const viewPlatforms = platforms.filter(p => p.views !== null);
    const aggregateViews = viewPlatforms.length
        ? viewPlatforms.reduce((sum, p) => sum + (p.views || 0), 0)
        : null;

    return Response.json({
        platforms,
        aggregateViews,
        aggregateViewSources: viewPlatforms.length,
        totalSources: platforms.length,
    }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
}
