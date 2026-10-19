/** Shared request helpers. */
export function sameOrigin(r: Request) { const origin = r.headers.get('origin'); return !!origin && origin === new URL(r.url).origin; }
export async function readBody(r: Request, max = 20000) { if (Number(r.headers.get('content-length') || 0) > max)
    throw Error('BODY_TOO_LARGE'); const text = await r.text(); if (text.length > max)
    throw Error('BODY_TOO_LARGE'); return JSON.parse(text); }
export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function sha256(s: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))).map(x => x.toString(16).padStart(2, '0')).join(''); }
