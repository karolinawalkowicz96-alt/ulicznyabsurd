/** Server-only HTTP integrations. Never import into a client component. */
export async function redis<T = unknown>(...command: (string | number)[]): Promise<T> {
    const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token)
        throw new Error('STORE_UNAVAILABLE');
    const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(8000), cache: 'no-store' });
    if (!r.ok)
        throw new Error('STORE_UNAVAILABLE');
    const d = await r.json() as {
        error?: string;
        result: T;
    };
    if (d.error)
        throw new Error('STORE_ERROR');
    return d.result;
}
export const hasRedis = () => Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
export async function limited(key: string, limit: number, seconds: number) {
    const count = await redis<number>('EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n", 1, `rate:${key}`, seconds);
    return count > limit;
}
export function sameOrigin(r: Request) { const origin = r.headers.get('origin'); return !!origin && origin === new URL(r.url).origin; }
export async function readBody(r: Request, max = 20000) { if (Number(r.headers.get('content-length') || 0) > max)
    throw Error('BODY_TOO_LARGE'); const text = await r.text(); if (text.length > max)
    throw Error('BODY_TOO_LARGE'); return JSON.parse(text); }
export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function sha256(s: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))).map(x => x.toString(16).padStart(2, '0')).join(''); }
