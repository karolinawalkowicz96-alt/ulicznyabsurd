import { product, validCart, type CartItem } from './catalog';
import { redis } from './server';
export type Order = {
    id: string;
    fingerprint: string;
    items: CartItem[];
    total: number;
    status: 'reserved' | 'paid' | 'failed' | 'expired';
    createdAt: string;
    sessionId?: string;
    url?: string;
};
export const stockKey = 'ua:stock:v1';
export function checkedItems(raw: unknown): CartItem[] {
    const items = validCart(raw);
    if (!Array.isArray(raw) || !items.length || raw.length !== items.length || raw.some((x, i) => x.id !== items[i].id || x.size !== items[i].size || x.quantity !== items[i].quantity))
        throw Error('Nieprawidłowy koszyk.');
    if (items.some(x => !product.variants.some(v => v.size === x.size && v.available)))
        throw Error('Wybrany wariant jest niedostępny.');
    return items;
}
export async function reserve(order: Order) {
    const lua = `local prior=redis.call('GET',KEYS[1]);if prior then local p=cjson.decode(prior);if p.fingerprint~=ARGV[2] then return 'conflict' end;return prior end
 local o=cjson.decode(ARGV[1]);for _,i in ipairs(o.items) do local stock=tonumber(redis.call('HGET',KEYS[2],i.id..':'..i.size) or '-1');if stock<i.quantity then return 'soldout' end end
 for _,i in ipairs(o.items) do redis.call('HINCRBY',KEYS[2],i.id..':'..i.size,-i.quantity) end
 redis.call('SET',KEYS[1],ARGV[1]);return ARGV[1]`;
    const result = await redis<string>('EVAL', lua, 2, `ua:order:${order.id}`, stockKey, JSON.stringify(order), order.fingerprint);
    if (result === 'soldout')
        throw Error('Brak wybranej ilości w magazynie.');
    if (result === 'conflict')
        throw Error('Koszyk zmienił się. Rozpocznij nową płatność.');
    return JSON.parse(result) as Order;
}
/** Atomically marks one order paid or releases its stock once. No fulfillment side effects here. */
export async function transition(id: string, status: 'paid' | 'failed' | 'expired', sessionId: string, total: number) {
    return redis<string>('EVAL', `local raw=redis.call('GET',KEYS[1]);if not raw then return 'missing' end;local o=cjson.decode(raw);
 if o.total~=tonumber(ARGV[3]) then return 'mismatch' end
 if o.sessionId and o.sessionId~=ARGV[2] then return 'mismatch' end
 if o.status==ARGV[1] then return 'duplicate' end
 if o.status~='reserved' then return 'conflict' end
 o.status=ARGV[1];o.sessionId=ARGV[2];if ARGV[1]~='paid' then for _,i in ipairs(o.items) do redis.call('HINCRBY',KEYS[2],i.id..':'..i.size,i.quantity) end end
 redis.call('SET',KEYS[1],cjson.encode(o));return 'ok'`, 2, `ua:order:${id}`, stockKey, status, sessionId, total);
}
export async function stripe(path: string, body: URLSearchParams, key: string) {
    const r = await fetch(`https://api.stripe.com/v1/${path}`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Idempotency-Key': key }, body, signal: AbortSignal.timeout(15000) });
    const result = await r.json() as {
        id: string;
        url: string;
    };
    if (!r.ok)
        throw Error('PAYMENT_PROVIDER_ERROR');
    return result;
}
export async function verifySignature(payload: string, signature: string, secret: string, now = Date.now()) {
    const entries = signature.split(',').map(x => x.split('='));
    const timestamp = entries.find(x => x[0] === 't')?.[1];
    const signatures = entries.filter(x => x[0] === 'v1').map(x => x[1]);
    if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300)
        return false;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    for (const sig of signatures) {
        if (!/^[0-9a-f]{64}$/i.test(sig))
            continue;
        const bytes = new Uint8Array(sig.match(/../g)!.map(x => parseInt(x, 16)));
        if (await crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(`${timestamp}.${payload}`)))
            return true;
    }
    return false;
}
