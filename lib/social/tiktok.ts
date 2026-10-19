import { api, empty, number, type Adapter } from './types';

type TikTokVideoPage = {
    data?: {
        videos?: Array<{ view_count?: number }>;
        cursor?: number;
        has_more?: boolean;
    };
    error?: { code?: string; message?: string };
};

async function totalVideoViews(token: string) {
    let cursor: number | undefined;
    let total = 0;
    let pages = 0;

    do {
        const r = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=view_count', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ max_count: 20, ...(cursor ? { cursor } : {}) }),
            signal: AbortSignal.timeout(8000),
            cache: 'no-store',
        });
        if (!r.ok)
            throw Error(r.status === 401 || r.status === 403 ? 'unauthorized' : 'unavailable');
        const d = await r.json() as TikTokVideoPage;
        if (d.error?.code && d.error.code !== 'ok')
            throw Error(d.error.code === 'access_token_invalid' ? 'unauthorized' : 'unavailable');
        for (const video of d.data?.videos || []) {
            const views = number(video.view_count);
            if (views !== null) total += views;
        }
        cursor = d.data?.cursor;
        pages += 1;
        if (!d.data?.has_more) break;
    } while (cursor && pages < 100);

    return total;
}

export const tiktok: Adapter = {
    platform: 'TikTok',
    ttl: 900,
    configured: () => !!process.env.TIKTOK_ACCESS_TOKEN,
    fetch: async () => {
        const token = process.env.TIKTOK_ACCESS_TOKEN!;
        const [user, views] = await Promise.all([
            api<{
                error?: { code: string };
                data?: { user?: { follower_count?: number } };
            }>('https://open.tiktokapis.com/v2/user/info/?fields=follower_count', { Authorization: `Bearer ${token}` }),
            totalVideoViews(token),
        ]);
        if (user.error?.code && user.error.code !== 'ok')
            throw Error('unauthorized');
        const followers = number(user.data?.user?.follower_count);
        return {
            ...empty('TikTok'),
            followers,
            views,
            viewsScope: 'Suma wyświetleń publicznych filmów dostępnych przez TikTok Display API.',
            updatedAt: new Date().toISOString(),
            status: followers === null ? 'partial' : 'live',
        };
    },
};
