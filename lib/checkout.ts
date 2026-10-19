/** Stripe webhook signature verification. Orders live in PostgreSQL. */
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
