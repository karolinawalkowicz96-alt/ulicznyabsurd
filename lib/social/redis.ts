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
