import { youtube } from './youtube';
import { tiktok } from './tiktok';
import { facebook } from './facebook';
import { instagram } from './instagram';
import { empty, type Adapter, type SocialSnapshot } from './types';
import { hasRedis, redis } from '../server';
/** Only verified values with an ISO date. null means unknown, never zero. */
export const manual: Partial<Record<SocialSnapshot['platform'], {
    followers: number;
    updatedAt: string;
}>> = {};
async function snapshot(adapter: Adapter): Promise<SocialSnapshot> {
    const fallback = manual[adapter.platform];
    if (fallback && Number.isFinite(fallback.followers) && !Number.isNaN(Date.parse(fallback.updatedAt)))
        return { ...empty(adapter.platform), ...fallback, status: 'manual' };
    if (!adapter.configured())
        return empty(adapter.platform);
    if (!hasRedis())
        return { ...empty(adapter.platform, 'unavailable'), note: 'Trwały cache nie został podłączony.' };
    const key = `social:v1:${adapter.platform}`;
    let last: SocialSnapshot | null = null;
    try {
        const saved = await redis<string | null>('GET', key);
        last = saved ? JSON.parse(saved) : null;
        if (last?.updatedAt && Date.now() - Date.parse(last.updatedAt) < adapter.ttl * 1000)
            return last;
        const lock = await redis<string | null>('SET', `${key}:refresh`, '1', 'NX', 'EX', 60);
        if (!lock)
            return last ? { ...last, status: 'stale' } : empty(adapter.platform, 'unavailable');
        const fresh = await adapter.fetch();
        await redis('SET', key, JSON.stringify(fresh));
        return fresh;
    }
    catch (e) {
        return last ? { ...last, status: 'stale' } : empty(adapter.platform, (e as Error).message === 'unauthorized' ? 'unauthorized' : 'unavailable');
    }
}
export async function allSnapshots() { return Promise.all([facebook, tiktok, youtube, instagram].map(snapshot)); }
