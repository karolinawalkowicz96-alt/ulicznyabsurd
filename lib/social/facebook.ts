import { api, empty, number, type Adapter } from './types';
export const facebook: Adapter = { platform: 'Facebook', ttl: 1800, configured: () => !!(process.env.META_GRAPH_VERSION && process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN), fetch: async () => {
        const d = await api<{
            followers_count?: number;
        }>(`https://graph.facebook.com/${process.env.META_GRAPH_VERSION}/${encodeURIComponent(process.env.FACEBOOK_PAGE_ID!)}?fields=followers_count`, { Authorization: `Bearer ${process.env.FACEBOOK_PAGE_TOKEN}` });
        const followers = number(d.followers_count);
        if (followers === null)
            throw Error('unavailable');
        return { ...empty('Facebook'), followers, updatedAt: new Date().toISOString(), status: 'live' };
    } };
