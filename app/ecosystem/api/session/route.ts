import { NextRequest, NextResponse } from 'next/server';
import {
  ECOSYSTEM_SESSION_COOKIE,
  SESSION_TTL_MS,
  clearAttempts,
  isRateLimited,
  readEcosystemAuthConfig,
  registerFailedAttempt,
} from '@/lib/ecosystem/config';
import { createSessionToken, timingSafeEqual } from '@/lib/ecosystem/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

/** Sign in with the shared credentials. Only meaningful when access mode is `password`. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const config = readEcosystemAuthConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Sign-in is not enabled for the ecosystem map on this environment.' },
      { status: 503 },
    );
  }

  const key = clientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429 },
    );
  }

  let username = '';
  let password = '';
  try {
    const body: unknown = await request.json();
    if (typeof body === 'object' && body !== null) {
      const parsed = body as { username?: unknown; password?: unknown };
      username = typeof parsed.username === 'string' ? parsed.username : '';
      password = typeof parsed.password === 'string' ? parsed.password : '';
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  /* Both comparisons always run, so a wrong username and a wrong password take the same time
     and neither can be distinguished from the outside. */
  const usernameOk = timingSafeEqual(username, config.username);
  const passwordOk = timingSafeEqual(password, config.password);

  if (!usernameOk || !passwordOk) {
    registerFailedAttempt(key);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  clearAttempts(key);
  const token = await createSessionToken(config.secret, SESSION_TTL_MS);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ECOSYSTEM_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return response;
}

/** Sign out. */
export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ECOSYSTEM_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
