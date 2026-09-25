# Ecosystem Map (`/ecosystem`)

An interactive map of the Maltiti A. Enterprise ecosystem — organisations, communities,
facilities, farms, materials, products, processes, supply chains, markets and customers, and the
relationships between them.

## The one rule

**This page renders the model. It cannot change it.**

The source of truth is the separate `Maltiti-Ecosystem` knowledge-model repository. This app
receives a single generated JSON file and draws it. There is deliberately no editing surface and
no write path back. If something on the map is wrong, fix it in the model repository and re-sync —
editing `lib/ecosystem/data/ecosystem-graph.json` by hand puts the site out of step with the
source of truth and will be silently overwritten on the next sync.

## Access

Access is controlled by one explicit switch, `ECOSYSTEM_MAP_ACCESS`:

| Value | Behaviour |
|---|---|
| `public` *(current default)* | Anyone with the URL can view the map. No sign-in. |
| `password` | Shared username and password, verified server-side. |

The switch is explicit rather than inferred from whether credentials happen to be set, so the
intent is always visible in configuration and the gate cannot be disabled by accident. In
`password` mode with credentials missing or a weak secret, the map **fails closed** and becomes
unavailable rather than quietly falling back to public.

### Currently: public

The map is intentionally open. Be aware of what that means:

- It shows internal operational detail — supplier relationships, community sourcing networks,
  customer segments — and roughly a third of the entities are inferred, unverified or unknown.
  Several are placeholders for things nobody has confirmed exist.
- Anyone with the URL, including competitors, can read all of it, and the JSON is directly
  fetchable at `/ecosystem/api/graph`.

It is still excluded from `robots.txt`, from the sitemap, and carries `noindex, nofollow`, so it
will not turn up in search results. Making it *reachable* and making it *indexed* are separate
decisions; only the first has been taken.

### Re-enabling the password

Set `ECOSYSTEM_MAP_ACCESS=password` along with the three credential variables and redeploy. No
code changes — the gate is intact and tested, just switched off.

When it is on:

| Step | What happens |
|---|---|
| `POST /ecosystem/api/session` | Credentials compared server-side in constant time. On success the server issues an HMAC-signed, `httpOnly` session cookie (12h). |
| `GET /ecosystem/api/graph` | Returns the model **only** to a request carrying a valid signed cookie. Otherwise `401`. |
| `GET /ecosystem` | Server component checks the same cookie and redirects to `/ecosystem/login`. |

The data file lives outside `public/`, is imported only by the route handler, and is never bundled
into a client chunk — so in password mode an unauthenticated browser receives no model data at
all, not even hidden in the page source.

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

## Updating the map

From the `Maltiti-Ecosystem` repository:

```bash
npm run release     # validate the model, rebuild everything, sync into this repo
```

That writes `lib/ecosystem/data/ecosystem-graph.json` here. Commit it with a message naming the
model change it reflects, and deploy. `lib/ecosystem/data/SOURCE.md` records which model revision
the committed data came from.

If your checkout of this repo is not at the default path, set `MALTITI_FRONTEND_PATH` before
running the sync.

## What is in the payload

One file, ~140 KB, containing the graph plus everything needed to explain itself:

- **nodes** with truth status, confidence, provenance, and every recorded fact with its own source
  and date
- **edges** with status, confidence and, for inferred links, the stated basis of the inference
- **precomputed 2D and 3D layout coordinates**, so the browser needs no layout library and the map
  looks identical on every load — people build spatial memory of it
- the **eleven curated view presets** that the printed diagrams also use, so the website and the
  documents cannot drift apart
- the **governance registers** (sources with reliability grades, knowledge gaps, assumptions,
  validation questions) that the detail panel reads from

## Reading the map

Every node carries a truth status, and the markers are baked into the labels so they survive being
screenshotted:

| Marker | Meaning |
|---|---|
| *(none)* | Confirmed — verified against an attributable source |
| `~` | Partially confirmed — it exists, the detail is unverified |
| `~~` | Inferred — nobody said this; it was worked out, and the basis is recorded |
| `?` | Unverified — asserted, unchecked |
| `??` | Unknown — the question is recorded, the answer is not |
| `*` + dashed outer ring | **Provisional** — suspected, not confirmed. Must be confirmed, merged or retired |
| double ring | **Class placeholder** — stands for many real things not yet individually identified |

Solid arrows are established links; dotted arrows are inferred or unverified.

**Do not circulate a screenshot without the legend.** A clean box-and-arrow picture is persuasive
in a way a table is not, and a viewer who cannot see which boxes are guesses will believe all of
them. Clicking any node shows its sources, its open gaps and the assumptions it rests on — that
is the main reason this exists as an interactive page rather than a static image.

## Files

| Path | |
|---|---|
| `app/ecosystem/page.tsx` | The map page (server component; checks the cookie in password mode) |
| `app/ecosystem/login/page.tsx` | Sign-in page (redirects to the map when access is public) |
| `app/ecosystem/api/session/route.ts` | Sign in / sign out |
| `app/ecosystem/api/graph/route.ts` | Serves the model; the real gate when password mode is on |
| `lib/ecosystem/session.ts` | HMAC session tokens (Web Crypto, runtime-agnostic) |
| `lib/ecosystem/config.ts` | Access mode switch, fail-closed credentials, rate limiting |
| `lib/ecosystem/data/` | Synced model data. Generated — do not edit |
| `components/ecosystem/` | Explorer, 2D canvas, 3D scene, detail panel, legend, toolbar |

Route handlers live under `app/ecosystem/api/` rather than `app/api/` on purpose: `app/api/` is the
output directory for `yarn openapi-ts`, which cleans it on regeneration and would delete them.

## The 3D view

three.js, loaded lazily — the 2D path never downloads it. It uses the same precomputed coordinates
in three dimensions.

2D is the default, and should stay the default. 3D is genuinely harder to read: nodes occlude each
other, labels compete for space, and there is no stable spatial memory. The 3D view compensates by
showing labels only for what you are pointing at or have selected, and fading everything unrelated
to the current focus. It is excellent for conveying the scale and interconnectedness of the
ecosystem; it is worse for answering a specific question.
