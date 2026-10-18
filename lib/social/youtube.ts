import { api, empty, number, type Adapter } from './types';
export const youtube: Adapter = { platform: 'YouTube', ttl: 3600, configured: () => !!(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID), fetch: async () => {
        const q = new URLSearchParams({ part: 'statistics', id: process.env.YOUTUBE_CHANNEL_ID!, key: process.env.YOUTUBE_API_KEY! });
        const d = await api<{
            items?: {
                statistics?: {
                    hiddenSubscriberCount: boolean;
                    subscriberCount?: string;
                    viewCount?: string;
                };
            }[];
        }>(`https://www.googleapis.com/youtube/v3/channels?${q}`);
        const s = d.items?.[0]?.statistics;
        if (!s)
            throw Error('unavailable');
        return { ...empty('YouTube'), followers: s.hiddenSubscriberCount ? null : number(s.subscriberCount), views: number(s.viewCount), viewsScope: 'Skumulowane wyświetlenia kanału YouTube; definicja obejmuje zmiany liczenia Shorts.', updatedAt: new Date().toISOString(), status: s.hiddenSubscriberCount ? 'partial' : 'live', note: 'Liczba subskrybentów zaokrąglona przez YouTube.' };
    } };
