import { NextRequest, NextResponse } from 'next/server';
import { ECOSYSTEM_SESSION_COOKIE, resolveEcosystemAccess } from '@/lib/ecosystem/config';
import { verifySessionToken } from '@/lib/ecosystem/session';
import graph from '@/lib/ecosystem/data/ecosystem-graph.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves the knowledge model to the map.
 *
 * In `password` mode this is the real gate: the data lives outside public/ and is returned only
 * to a request carrying a valid signed session cookie, so an unauthenticated browser never
 * receives it. In `public` mode it is served to anyone with the URL, which is the deliberate
 * current setting — see docs/ECOSYSTEM_MAP.md.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const access = resolveEcosystemAccess();

  if (access.mode === 'misconfigured') {
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  if (access.mode === 'password') {
    const token = request.cookies.get(ECOSYSTEM_SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token, access.config.secret))) {
      return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
    }
  }

  return NextResponse.json(graph, {
    headers: {
      'Cache-Control':
        access.mode === 'public' ? 'public, max-age=300' : 'private, no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
