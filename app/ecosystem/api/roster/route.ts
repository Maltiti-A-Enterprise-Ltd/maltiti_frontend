import { NextRequest, NextResponse } from 'next/server';
import { ECOSYSTEM_SESSION_COOKIE, resolveEcosystemAccess } from '@/lib/ecosystem/config';
import { verifySessionToken } from '@/lib/ecosystem/session';
import { BANDS, CENTRES, TOTALS } from '@/lib/ecosystem/data/roster';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves the certified-women roster to the map.
 *
 * In `password` mode this is the real gate. The roster is deliberately fetched
 * rather than imported into the view: importing it would bundle the names and
 * headcounts of every community into a client chunk, where an unauthenticated
 * browser would receive them whatever the gate said.
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

  return NextResponse.json(
    { centres: CENTRES, totals: TOTALS, bands: BANDS },
    {
      headers: {
        'Cache-Control':
          access.mode === 'public' ? 'public, max-age=300' : 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  );
}
