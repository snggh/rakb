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

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick `snggh/rakb`.
2. Build settings:
   - Framework preset: **None** (do *not* pick "Next.js" — that preset assumes
     a server runtime; this project exports static files)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
3. Production branch: **`main`**. Every other branch gets an automatic preview
   deployment, so `develop` becomes the staging site.
4. Environment variables — set them in **both** scopes:

   | Variable | Production | Preview (staging) |
   | --- | --- | --- |
   | `NODE_VERSION` | `22` | `22` |
   | `NEXT_PUBLIC_SITE_URL` | `https://ruangaksarakeyboard.com` | the `*.pages.dev` preview URL |
   | `NEXT_PUBLIC_SITE_ENV` | `production` | `staging` |

   `NEXT_PUBLIC_SITE_ENV=staging` is what makes the build emit
   `<meta name="robots" content="noindex, nofollow">` on every page and a
   blanket `Disallow: /` in `robots.txt`. Without it, Google will index the
   staging copy next to the real site and split your search results.

5. Custom domain (when ready): Pages project → **Custom domains** → add
   `ruangaksarakeyboard.com`. TLS is issued automatically.

### Password-gating staging later

If you decide the review copy should not be open to anyone with the URL:
Cloudflare **Zero Trust** → **Access** → **Applications** → add the preview
hostname, policy "emails in this list". Free for up to 50 users, no code change.

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
