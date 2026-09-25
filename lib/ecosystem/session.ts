/**
 * Signed session tokens for the ecosystem map gate.
 *
 * The map is protected by a single shared username and password, but the check happens on the
 * SERVER. The browser never receives the credentials and never receives the graph data until it
 * presents a valid signed cookie. A client-side password check would not be protection at all —
 * the data would ship with the page and be readable from the network tab.
 *
 * Built on Web Crypto only, so this works unchanged in Node and Edge runtimes.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/**
 * Compares two strings in time independent of where they first differ, so an attacker cannot
 * learn a secret one character at a time by measuring how long the comparison took.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function createSessionToken(secret: string, ttlMs: number): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp: Date.now() + ttlMs })));
  const signature = await hmac(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
): Promise<boolean> {
  if (!token) {
    return false;
  }
  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return false;
  }

  const expected = await hmac(payload, secret);
  if (!timingSafeEqual(signature, expected)) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(decoder.decode(fromBase64Url(payload)));
    if (typeof parsed !== 'object' || parsed === null) {
      return false;
    }
    const { exp } = parsed as { exp?: unknown };
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}
