import type { Platform } from '../content';
export type SocialSnapshot = {
    platform: Platform;
    followers: number | null;
    views: number | null;
    viewsScope: string | null;
    updatedAt: string | null;
    status: 'live' | 'manual' | 'unauthorized' | 'unavailable' | 'stale' | 'partial';
    note?: string;
};
export type Adapter = {
    platform: Platform;
    ttl: number;
    configured: () => boolean;
    fetch: () => Promise<SocialSnapshot>;
};
export const empty = (platform: Platform, status: SocialSnapshot['status'] = 'unauthorized'): SocialSnapshot => ({ platform, followers: null, views: null, viewsScope: null, updatedAt: null, status });
export async function api<T>(url: string, headers: Record<string, string> = {}) { const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000), cache: 'no-store' }); if (!r.ok)
    throw Error(r.status === 401 || r.status === 403 ? 'unauthorized' : 'unavailable'); return r.json() as Promise<T>; }
export function number(value: unknown): number | null { const n = Number(value); return value !== null && value !== undefined && Number.isFinite(n) && n >= 0 ? n : null; }
