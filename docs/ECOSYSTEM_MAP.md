# The certified women (`/ecosystem`)

Every woman certified under Maltiti A. Enterprise Ltd, by centre and community: one head
office, seven shea butter processing centres and ten collector communities, rolling up to
2,252.

## Where the data comes from

**This repository owns the roster.** It is authored in `lib/ecosystem/data/roster.ts`, edited
here, and reviewed here. Nothing syncs into it and nothing overwrites it.

That is a change. This page used to render a generated knowledge-graph file copied in from a
separate `Maltiti-Ecosystem` model repository, which carried a "do not edit — will be silently
overwritten" contract. That repository could not be located when the real roster arrived, and a
contract pointing at something nobody can find is worse than no contract: it stops people fixing
the data without giving them anywhere else to fix it. So ownership moved here, and the warning
went with it.

The source document is the company roster "Maltiti Total certified women", kept at
`.ai/context/map.jpeg`.

### The rule that replaced it

**Every total is derived from the rows.** `TOTALS` and `BANDS` are computed from `CENTRES`; no
subtotal is typed in twice, so no figure on the page can drift from the rows it summarises. To
change what the page says, change a row.

The source sheet's own arithmetic was checked against the derived values and agreed exactly —
80, 340, 470, 1,136, 646, 1,782, 2,252.

One correction was made in transcription: Gizaa N-nabya is written `MPo3` on the sheet, with a
letter `o` where every sibling code uses a zero. It is recorded as `MP03`.

### Codes are not all identifiers

`MP01`–`MP08` identify one centre each. `MCFC` and `MOFC` are *category* codes — conventional
and organic Fairtrade collectors — and repeat down the collector rows. The ten collector
communities have no unique code of their own, so `id` is a slug, never the code.

## How it is drawn

The data's job is magnitude and part-to-whole across named places, so the page is a hero figure,
a stat row, one stacked bar for the split, two runs of horizontal bars, and a table.

- **Horizontal** bars because the names are long. "Zugu Suglo N-boribuni shea butter processing
  centre" has nowhere to go under a vertical column.
- **A table, not just charts.** Eighteen named classes is well past the point where colour can
  carry identity. The table is the form that answers "which centre?", and doubles as the
  accessible view of every bar.
- **Two hues, assigned by certification** — conventional and organic — in the documented fixed
  slot order. The head office wears muted ink rather than a third hue: it holds no certification,
  and a series colour would imply it were a third category.

### The second view: the diagram

A toggle above the bars switches to **Diagram** — the same eighteen rows read for shape instead
of magnitude. One head office at the centre, seven processing centres on an inner ring, ten
collector communities on an outer one; circle area is headcount, colour is certification.

Three things about it are deliberate:

- **It is not a geographic map.** The roster has no coordinates (see *Known gap*). Angle carries
  no meaning at all — it is spacing, nothing else.
- **It has no edges.** Which community supplies which processing centre is not recorded anywhere,
  and a drawn line would assert a route nobody has.
- **Only the five largest communities are named on the figure.** Eighteen labels will not fit
  around two rings without colliding. The rest are named on hover and in the table.

Radius goes as the square root of headcount, because the eye reads circle *area*. Scaling the
radius directly would make Kpendua's 445 look thirty times Katariga's 14 rather than five.

Two constants control the layout and are worth knowing before you edit it: `CAPTION_WEDGE` keeps
an empty arc at the top of each ring for that ring's caption — without it the first node, always
the largest since rings sort descending, lands straight on the caption — and the inner ring needs
roughly the wider wedge because at half the radius the same angle buys half the clearance. The
origin sits left of centre in the viewBox because every direct label ends up on the right.

### The palette was measured, not chosen

Both modes were run through the data-viz palette validator against this site's own surfaces
(`#ffffff` light, `#101828` dark). Blue + orange passes every check with no warnings — CVD ΔE
24.7 light / 26.8 dark against a target of 8.

A green-for-organic palette was the intuitive first choice and was measured first. It cost a
sub-3:1 contrast warning and roughly a third of the CVD separation, so it was dropped. If you
re-colour this page, re-run the validator rather than eyeballing it.

Dark steps are included and validated, though the site has no working theme toggle today — they
activate if one is ever added.

## Access

Access is controlled by one explicit switch, `ECOSYSTEM_MAP_ACCESS`:

| Value | Behaviour |
|---|---|
| `public` *(current default)* | Anyone with the URL can view the roster. No sign-in. |
| `password` | Shared username and password, verified server-side. |

The switch is explicit rather than inferred from whether credentials happen to be set, so the
intent is always visible in configuration and the gate cannot be disabled by accident. In
`password` mode with credentials missing or a weak secret, the page **fails closed**.

### Currently: public

Consider what that means now that the data is real. This is no longer a map of inferred
placeholders — it is the names of eighteen communities and how many women work in each. It is
excluded from `robots.txt` and the sitemap and carries `noindex, nofollow`, so it will not turn
up in search results, but anyone with the URL can read it and the JSON is fetchable at
`/ecosystem/api/roster`.

Making it *reachable* and making it *indexed* are separate decisions; only the first has been
taken. If this should be private, set `ECOSYSTEM_MAP_ACCESS=password` — the gate is intact and
needs no code change.

When it is on:

| Step | What happens |
|---|---|
| `POST /ecosystem/api/session` | Credentials compared server-side in constant time. On success the server issues an HMAC-signed, `httpOnly` session cookie (12h). |
| `GET /ecosystem/api/roster` | Returns the roster **only** to a request carrying a valid signed cookie. Otherwise `401`. |
| `GET /ecosystem` | Server component checks the same cookie and redirects to `/ecosystem/login`. |

The roster is **fetched rather than imported** by the view for exactly this reason: importing it
into a client component would bundle every community name and headcount into a client chunk,
where an unauthenticated browser would receive them whatever the gate said.

> **Limits of a shared credential, if you turn it back on.** No per-person revocation, no audit
> trail of who looked at what, and a forwarded password grants access to anyone. Login attempts
> are rate-limited per IP, but that limiter is in-memory, so on a serverless platform each
> instance counts separately. For anything genuinely sensitive, move to the per-user auth this app
> already has (`app/auth/*` + the backend) and gate on a role.

## Environment variables

```bash
# Access mode: "public" (default) or "password"
ECOSYSTEM_MAP_ACCESS=public

# Only needed when ECOSYSTEM_MAP_ACCESS=password
ECOSYSTEM_MAP_USERNAME=maltiti
ECOSYSTEM_MAP_PASSWORD=<strong shared password>
ECOSYSTEM_MAP_SECRET=<random string, at least 32 characters>
```

Generate the secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`ECOSYSTEM_MAP_SECRET` signs the session cookie. Changing it invalidates every existing session,
which is how you force everyone to sign in again after rotating the password.

For local development these live in `.env.local` (gitignored). For production set them in the
Netlify site environment.

## Updating the roster

Edit `lib/ecosystem/data/roster.ts` and open a pull request. Totals recompute themselves.

When adding a centre: give it a slug `id`, the roster `code`, the `role` that decides which
section it appears in, and the `certification` that decides its colour. A centre with no
certification uses `'none'` and renders in muted ink.

## Files

| Path | |
|---|---|
| `app/ecosystem/page.tsx` | The page (server component; checks the cookie in password mode) |
| `app/ecosystem/login/page.tsx` | Sign-in page (redirects when access is public) |
| `app/ecosystem/api/session/route.ts` | Sign in / sign out |
| `app/ecosystem/api/roster/route.ts` | Serves the roster; the real gate when password mode is on |
| `lib/ecosystem/session.ts` | HMAC session tokens (Web Crypto, runtime-agnostic) |
| `lib/ecosystem/config.ts` | Access mode switch, fail-closed credentials, rate limiting |
| `lib/ecosystem/data/roster.ts` | **The roster. Owned here — edit it.** |
| `components/ecosystem/roster-explorer.tsx` | Page composition: hero, stats, split, view toggle, table |
| `components/ecosystem/roster-chart.tsx` | The bars, the series colours, the tooltip |
| `components/ecosystem/roster-map.tsx` | The diagram view: rings, bubbles, hover readout |

Route handlers live under `app/ecosystem/api/` rather than `app/api/` on purpose: `app/api/` is the
output directory for `yarn openapi-ts`, which cleans it on regeneration and would delete them.

## Known gap

The roster has no coordinates, so neither view is a geographic map. These are real communities
around Tamale; plotting them needs real latitudes and longitudes, and inventing positions for
places where actual people work is not an acceptable substitute.

If that data ever arrives, a geographic view can join the toggle as a third option. Until then
the diagram's angles are spacing and nothing more, and the caption under it says so.
