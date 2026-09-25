/**
 * Server-side configuration for the ecosystem map.
 *
 * SERVER ONLY. Never import this from a client component — it reads credentials from the
 * environment. It is imported only by the route handlers under app/ecosystem/api/ and by the
 * server component at app/ecosystem/page.tsx.
 *
 * Access is controlled by one explicit switch, ECOSYSTEM_MAP_ACCESS:
 *
 *   public   (default) — anyone with the URL can view the map. No sign-in.
 *   password           — shared username and password, verified server-side.
 *
 * The switch is explicit rather than inferred from whether credentials happen to be present,
 * so the intent is always visible in configuration and nobody can turn the gate off by
 * accident. In `password` mode with credentials missing or weak the map fails CLOSED and
 * becomes unavailable, rather than silently falling back to public.
 */

export const ECOSYSTEM_SESSION_COOKIE = 'maltiti_ecosystem_session';
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface EcosystemAuthConfig {
  username: string;
  password: string;
  secret: string;
}

export type EcosystemAccess =
  | { mode: 'public' }
  | { mode: 'password'; config: EcosystemAuthConfig }
  | { mode: 'misconfigured'; reason: string };

/** Resolves how the map should be served right now. */
export function resolveEcosystemAccess(): EcosystemAccess {
  const requested = process.env.ECOSYSTEM_MAP_ACCESS?.trim().toLowerCase();
  if (requested !== 'password') {
    return { mode: 'public' };
  }

  const username = process.env.ECOSYSTEM_MAP_USERNAME;
  const password = process.env.ECOSYSTEM_MAP_PASSWORD;
  const secret = process.env.ECOSYSTEM_MAP_SECRET;

  if (!username || !password || !secret) {
    return {
      mode: 'misconfigured',
      reason:
        'ECOSYSTEM_MAP_ACCESS is set to "password" but ECOSYSTEM_MAP_USERNAME, ECOSYSTEM_MAP_PASSWORD or ECOSYSTEM_MAP_SECRET is missing.',
    };
  }
  if (secret.length < 32) {
    return {
      mode: 'misconfigured',
      reason: 'ECOSYSTEM_MAP_SECRET must be at least 32 characters.',
    };
  }
  return { mode: 'password', config: { username, password, secret } };
}

/** Convenience for the route handlers: the credentials, or null when not in password mode. */
export function readEcosystemAuthConfig(): EcosystemAuthConfig | null {
  const access = resolveEcosystemAccess();
  return access.mode === 'password' ? access.config : null;
}

/**
 * Best-effort brute-force throttle.
 *
 * A single shared password is guessable given enough attempts, so attempts are capped. This is
 * in-memory, which means on a serverless platform each instance keeps its own counter and the
 * effective limit is looser than it looks. It raises the cost of a guessing attack; it does not
 * eliminate it. If the map ever holds anything genuinely sensitive, move to per-user accounts
 * using the auth already in this app.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function registerFailedAttempt(key: string): void {
  const now = Date.now();
  const existing = attempts.get(key);
  if (!existing || existing.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  existing.count += 1;
}

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) {
    return false;
  }
  if (entry.resetAt < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
