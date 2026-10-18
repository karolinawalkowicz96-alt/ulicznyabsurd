import { api, empty, number, type Adapter } from './types';
export const instagram: Adapter = { platform: 'Instagram', ttl: 1800, configured: () => !!(process.env.META_GRAPH_VERSION && process.env.INSTAGRAM_ACCOUNT_ID && process.env.INSTAGRAM_ACCESS_TOKEN), fetch: async () => {
        // Facebook Login path for a linked professional Instagram account.
        const d = await api<{
            followers_count?: number;
        }>(`https://graph.facebook.com/${process.env.META_GRAPH_VERSION}/${encodeURIComponent(process.env.INSTAGRAM_ACCOUNT_ID!)}?fields=followers_count`, { Authorization: `Bearer ${process.env.INSTAGRAM_ACCESS_TOKEN}` });
        const followers = number(d.followers_count);
        if (followers === null)
            throw Error('unavailable');
        return { ...empty('Instagram'), followers, updatedAt: new Date().toISOString(), status: 'live' };
    } };
