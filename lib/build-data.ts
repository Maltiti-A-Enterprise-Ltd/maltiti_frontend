/**
 * Bounded data fetching for build-time route generation.
 *
 * Routes that enumerate content at build time (the sitemap, `generateStaticParams`) call the
 * backend. Those calls had no timeout, and a `try/catch` does nothing about a request that never
 * settles — it only catches errors. A slow or stalled backend therefore held a route open past
 * the host's per-route budget (60s on Netlify) and failed the entire deploy, even though the
 * data is optional and the code already had a fallback for it.
 *
 * This bounds the wait, aborts the request, and falls back — so a backend problem degrades one
 * route instead of blocking the release. The failure is logged loudly rather than swallowed,
 * because silently shipping a sitemap with no product URLs is an SEO regression nobody would
 * otherwise notice.
 */

const DEFAULT_TIMEOUT_MS = 15_000;

function timeoutMs(): number {
  const configured = Number(process.env.BUILD_DATA_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_TIMEOUT_MS;
}

/**
 * Runs a build-time fetch with an abort signal and a fallback.
 *
 * @param label  what is being fetched, for the build log
 * @param run    receives an AbortSignal to pass to the API client
 * @param fallback returned if the call fails, times out or yields no data
 */
export async function fetchForBuild<T>(
  label: string,
  run: (signal: AbortSignal) => Promise<T>,
  fallback: T,
): Promise<T> {
  const budget = timeoutMs();
  try {
    return await run(AbortSignal.timeout(budget));
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    console.warn(
      `[build] ${label}: unavailable after ${budget}ms (${reason}). ` +
        'Continuing with a fallback — this route will be incomplete for this build.',
    );
    return fallback;
  }
}
