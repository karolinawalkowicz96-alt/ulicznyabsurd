import { youtube } from './youtube';
import { tiktok } from './tiktok';
import { facebook } from './facebook';
import { instagram } from './instagram';
import { empty, type Adapter, type SocialSnapshot } from './types';
import { hasRedis, redis } from '../server';

type MemoryEntry = { value: SocialSnapshot; expires: number };
const globalSocial = globalThis as typeof globalThis & { __uaSocialCache?: Map<string, MemoryEntry> };
const memoryCache = globalSocial.__uaSocialCache ??= new Map<string, MemoryEntry>();
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
    const key = `social:v2:${adapter.platform}`;
    if (!hasRedis()) {
        const cached = memoryCache.get(key);
        if (cached && cached.expires > Date.now()) return cached.value;
        try {
            const fresh = await adapter.fetch();
            memoryCache.set(key, { value: fresh, expires: Date.now() + adapter.ttl * 1000 });
            return fresh;
        }
        catch (e) {
            return cached?.value ? { ...cached.value, status: 'stale' } : empty(adapter.platform, (e as Error).message === 'unauthorized' ? 'unauthorized' : 'unavailable');
        }
    }
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
export async function allSnapshots() { return Promise.all([facebook, instagram, youtube, tiktok].map(snapshot)); }
