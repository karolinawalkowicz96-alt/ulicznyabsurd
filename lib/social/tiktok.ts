import { api, empty, number, type Adapter } from './types';
export const tiktok: Adapter = { platform: 'TikTok', ttl: 3600, configured: () => !!process.env.TIKTOK_ACCESS_TOKEN, fetch: async () => {
        const d = await api<{
            error?: {
                code: string;
            };
            data?: {
                user?: {
                    follower_count?: number;
                };
            };
        }>('https://open.tiktokapis.com/v2/user/info/?fields=follower_count', { 'Authorization': `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}` });
        if (d.error?.code && d.error.code !== 'ok')
            throw Error('unauthorized');
        const followers = number(d.data?.user?.follower_count);
        if (followers === null)
            throw Error('unavailable');
        return { ...empty('TikTok'), followers, updatedAt: new Date().toISOString(), status: 'live' };
    } };
