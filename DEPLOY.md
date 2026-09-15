# Deploying Ruang Aksara Keyboard

The site is a **fully static export**. `npm run build` produces an `out/` folder
of plain HTML, CSS, JS and images. There is no server, no database, no API route
and no runtime environment variable — whatever host serves `out/` is enough.

---

## Where it is hosted, and why

**Cloudflare Pages (free plan).**

| | Cloudflare Pages | Netlify | Vercel | GitHub Pages |
| --- | --- | --- | --- | --- |
| Commercial use on free tier | Allowed | Allowed | **Not allowed** (Hobby is non-commercial personal use only) | **Not allowed** for sites "primarily directed at facilitating commercial transactions" |
| Bandwidth | Unlimited on static assets | 100 GB / month | ~100 GB / month guideline | 100 GB / month (soft) |
| Builds | 500 / month | 300 build-minutes / month | 100 deploys / day | 10 / hour (soft) |
| Preview per branch | Yes, unlimited | Yes | Yes | No |
| Password-gate a preview | Yes, free (Cloudflare Access, up to 50 users) | Paid plan only | Paid add-on | Not possible |
| Custom domain + TLS | Free | Free | Free | Free |

The deciding factor is the **commercial-use clause**. Meetup tickets are paid,
and Vercel's fair-use policy defines commercial usage as including "any method
of requesting or processing payment from visitors of the site". Even with
ticketing moved off-site, a site that sells access to a paid event sits close
enough to that line that the free Hobby plan is a risk not worth taking — the
penalty is a paused deployment, usually at the worst moment. GitHub Pages has
comparable wording. Cloudflare Pages and Netlify have no such clause; Cloudflare
wins on bandwidth, build allowance, and free password protection for staging.

Limits worth knowing on the Cloudflare free plan: 20,000 files per site and
25 MiB per file. The current build is ~7 MB across a few hundred files, so
there is a lot of headroom — but keep dropping raw camera exports into
`public/` and the file-size limit is the one you will hit first.

---

## One-time setup

Cloudflare folded Pages into **Workers**. New Git-connected static sites go
through the Workers Builds flow now, not the classic Pages "framework preset +
output directory" form — the dashboard drives everything off `wrangler.toml`
in this repo instead. That file is already committed (`wrangler.toml`), so the
wizard mostly configures itself.

1. Cloudflare dashboard → **Workers & Pages** → **Create** → connect the
   `snggh/rakb` GitHub repo.
2. **Production branch: pick `develop`, not `main`.** `main` hasn't received
   the security/static-export work yet (no `wrangler.toml`, and it still has
   the old registration form that collected and discarded personal data) —
   pointing Cloudflare at it now would either fail to build or, worse, later
   ship that old code. Once `develop` has been reviewed and is ready to go
   live, merge it into `main` and repoint this setting.
3. Deploy settings (the wizard reads most of this from `wrangler.toml`
   automatically):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (leave as the default — do not add
     `--assets`; the directory is already set in `wrangler.toml`)
   - **Builds for non-production branches**: leave checked. This is what
     gives every other branch (feature branches, PRs) its own preview build.
4. **Environment variables** — expand **Advanced settings** before deploying
   (or Settings → Variables and Secrets after the project exists) and set,
   for **both** the Production and Preview environments:

   | Variable | Value (this project is the staging/review site) |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_ENV` | `staging` |
   | `NEXT_PUBLIC_SITE_URL` | leave unset, or the `*.workers.dev` URL Cloudflare assigns after first deploy |

   `NEXT_PUBLIC_SITE_ENV=staging` is what makes the build emit
   `<meta name="robots" content="noindex, nofollow">` on every page and a
   blanket `Disallow: /` in `robots.txt`. Without it, Google will index this
   review copy next to the real site once it's live. Because this whole
   Cloudflare project is the staging site for now, set `staging` everywhere —
   there's no real "production" environment here yet.

5. Custom domain (only once this project is repointed at `main` for real
   production): project → **Settings → Domains & Routes** → add
   `ruangaksarakeyboard.com`. TLS is issued automatically.

## What this costs at scale: nothing

The free-forever property does **not** come from using Pages instead of Workers.
It comes from serving *static assets* rather than executing Worker code. Since
Cloudflare merged Pages into Workers, that property came along with it.

Cloudflare's pricing docs, verbatim:

> Requests to static assets are free and unlimited.

> There are no additional charges for data transfer (egress) or throughput
> (bandwidth).

The Free plan's **100,000 requests/day** cap applies to *Worker invocations* —
requests that run your code. This project has no `main` entry point and does
not set `run_worker_first`, so a page view invokes nothing: Cloudflare matches
the URL to a file in `out/` and serves it. Zero invocations, nothing metered,
no bandwidth bill, at any traffic volume.

### The limits that do exist

| Limit | Free plan | Where this project sits |
| --- | --- | --- |
| Static asset requests | unlimited | — |
| Bandwidth / egress | unlimited, never billed | — |
| Files per deployment | 20,000 | ~100 |
| Individual file size | 25 MiB | largest is a ~280 KB photo |
| Worker invocations | 100,000/day | **0** |
| Builds | 500/month | a handful |

The only one with a realistic path to being hit is the file count, and only if
someone commits a few thousand raw photos into `public/`. Keep exporting the
gallery to compressed WebP and it is not close.

### What would silently end it

Each of these puts Worker code in the request path, converting every page view
into a metered invocation against the 100,000/day cap:

- Adding an API route, a Server Action, or middleware — any of these makes
  `output: "export"` impossible and forces a server runtime.
- Setting `assets.run_worker_first`.
- Letting Wrangler auto-configure **OpenNext**. This is not hypothetical: it
  is exactly what the first failed deploy did, because `wrangler.toml` was
  missing and Wrangler fell back to detecting Next.js and building an SSR
  Worker. `wrangler.toml` existing is what prevents it.

So `output: "export"` in `next.config.ts` is not a stylistic choice — it is the
budget. If a future feature seems to need a server, price the change before
building it.

## Domains

| Domain | Worker | Branch | `NEXT_PUBLIC_SITE_ENV` |
| --- | --- | --- | --- |
| `rakb.co.id` (+ `www`) | `rakb` | `main` | `production` |
| `dev.rakb.co.id` | `rakb-dev` | `develop` | `staging` |

Two Workers, not one. A Worker serves exactly one live version at a time, so
production and dev cannot be two versions of the same Worker. `wrangler.toml`
carries an `[env.dev]` block; the dev project deploys with
`npx wrangler deploy --env dev`, which publishes the `rakb-dev` Worker.

### Prerequisite: the zone has to be on Cloudflare

`rakb.co.id` is registered elsewhere, and Cloudflare Custom Domains require
"an active Cloudflare zone" — a domain whose DNS Cloudflare actually serves.
There is no way to point a third-party-hosted domain at a Worker with a plain
CNAME on the free plan, because Cloudflare has to terminate TLS and route the
request itself.

So, once:

1. Cloudflare dashboard → **Add a domain** → `rakb.co.id` → Free plan.
2. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`).
3. At the `.co.id` registrar's control panel, replace the existing
   nameservers with those two. Keep the domain registered there — only DNS
   moves.
4. Wait for Cloudflare to report the zone **Active**. Usually under an hour;
   `.co.id` can take longer.

This is the slow step and everything else depends on it, so start it first.

### Attaching the domains

Once the zone is Active, per Worker: **Settings → Domains & Routes → Add →
Custom domain**. Cloudflare creates the DNS record and issues the certificate
itself — do not add an A or CNAME record by hand.

- `rakb-dev` → `dev.rakb.co.id`
- `rakb` → `rakb.co.id` and `www.rakb.co.id`

### `dev.rakb.co.id` must be noindex, and now it really matters

Every certificate Cloudflare issues is published to public Certificate
Transparency logs, and crawlers mine those logs for hostnames. A
`*.workers.dev` URL nobody links to is obscure; `dev.rakb.co.id` will be
discoverable within days of the certificate being issued.

So the dev project's build variables are not optional:

| Variable | `rakb-dev` | `rakb` |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_ENV` | `staging` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://dev.rakb.co.id` | `https://rakb.co.id` |

These are **build** variables, not runtime ones — Next inlines `NEXT_PUBLIC_*`
at build time, so they belong in the Workers Builds settings, not in
`wrangler.toml` `[vars]`.

Verify after the first deploy:

```bash
curl -s https://dev.rakb.co.id/robots.txt        # must be: Disallow: /
curl -s https://rakb.co.id/robots.txt            # must be: Allow: /
```

### Password-gating staging later

If you decide the review copy should not be open to anyone with the URL:
Cloudflare **Zero Trust** → **Access** → **Applications** → add the assigned
hostname, policy "emails in this list". Free for up to 50 users, no code
change.

### Why `wrangler.toml` and not a dashboard field

The Workers Builds dashboard has no "build output directory" field anymore —
that's `assets.directory` in `wrangler.toml` instead:

```toml
name = "rakb"
compatibility_date = "2026-09-12"

[assets]
directory = "./out"
not_found_handling = "404-page"   # serve the real out/404.html
html_handling = "auto-trailing-slash"  # matches trailingSlash: true below
```

There's no `main` (Worker script) field — this is a pure static site, so
Cloudflare serves files from `out/` directly with no Worker code in the
request path. `public/_headers` still applies unchanged.

---

## Day-to-day flow

```
feature branch  →  PR into develop  →  CI runs  →  merge
     develop     →  auto-deploys to the staging preview URL  (noindex)
     main        →  auto-deploys to production
```

Cloudflare posts the preview URL on the PR, so reviewers click straight through
from GitHub.

## CI

`.github/workflows/ci.yml` runs on every PR and every push to `main` / `develop`:

- `npm ci`
- `npm run lint`
- `npm run typecheck` (`tsc --noEmit`)
- `npm run build` — a static export that fails to build never reaches a review
- `npm audit --audit-level=high`
- a gitleaks scan of the **full** git history for committed secrets

Cloudflare Pages handles deployment itself through the Git integration, so no
deploy tokens live in GitHub. That is deliberate: the fewer long-lived secrets
in repository settings, the less there is to leak.

`.github/dependabot.yml` opens a weekly grouped PR for npm updates and a monthly
one for the actions themselves.

### Branch protection worth turning on

GitHub → Settings → Branches → add a rule for `main`:
require a pull request, require the `Lint, typecheck, build` and `Secret scan`
checks to pass, and require branches to be up to date. Same for `develop` if you
want the staging site to stay green.

---

## Running a production build locally

```bash
npm ci
NEXT_PUBLIC_SITE_ENV=staging npm run build
npx serve out          # or any static file server
```

The build fetches the Geist fonts from Google Fonts at build time (`next/font`
self-hosts them into the bundle afterwards, so the live site makes no
third-party font request). A machine without access to `fonts.googleapis.com`
cannot build the site — if you ever need offline builds, switch `next/font/google`
to `next/font/local` and commit the woff2 files.

---

## Security headers

`public/_headers` ships with the build and is read by Cloudflare Pages (and
Netlify, same format). It sets HSTS, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, a restrictive `Permissions-Policy`, and a
Content Security Policy.

One honest caveat on the CSP: `script-src` keeps `'unsafe-inline'`. Next's App
Router streams its payload through inline `<script>` tags whose contents change
on every build, so a hash allowlist would break each deploy and a nonce needs a
server that a static export does not have. `'self'` still blocks every external
script origin, which is the injection path that actually matters for a site with
no user input. If the CSP ever needs to be strict, that is the moment to move off
static export.

After the first deploy, check the headers actually arrived:

```bash
curl -sI https://<your-site> | grep -iE 'content-security|strict-transport|x-frame|x-content|referrer|permissions'
```

---

## What this site deliberately does *not* do

- **It collects no personal data.** No forms, no analytics, no cookies, no
  `localStorage` beyond the light/dark preference (`rakb-legend`). Registration —
  names, emails, WhatsApp numbers, payment proof — happens entirely on the
  external ticketing platform. Set `event.ticketUrl` in `src/content/event.ts`
  and every "Register" button points there.
- **It has no secrets.** The only environment variables are `NEXT_PUBLIC_*`,
  which are public by definition; both are non-sensitive. Nothing in this repo
  needs to stay private, which is why a public repo is fine.
- **It makes one third-party request:** the Google Maps venue embed on
  `/getting-there`. That iframe is the only external origin in the CSP.
