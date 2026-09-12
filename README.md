# Ruang Aksara Keyboard

Website for the Ruang Aksara Keyboard community and Meetup Vol. 2.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content (no React required)

All meetup copy lives in `src/content/`. Change a file, save, and the pages that use it update together.

| File | What it controls |
| --- | --- |
| `src/content/event.ts` | Date, venue, capacity, announcement, `registrationOpen`, hero image path |
| `src/content/schedule.ts` | Rundown table |
| `src/content/transport.ts` | How to get there + arrival notes |
| `src/content/rules.ts` | House rules / terms |
| `src/content/faqs.ts` | FAQ |
| `src/content/members.ts` | Team names, roles, photo paths |
| `src/content/gallery.ts` | Gallery captions and photo paths |
| `src/content/pillars.ts` | Community profile text |
| `src/content/sponsors.ts` | Sponsor logo paths |
| `src/content/vendors.ts` | Stub for the future vendor directory |
| `src/content/calculator.ts` | Stub for the future build calculator |

### Photos

1. Drop files in `public/gallery/`, `public/team/`, or `public/sponsors/`.
2. Set the matching `src` / `photo` / `logo` field, e.g. `src: "/gallery/01.jpg"`.

Until a path is set, the site shows a paper keycap-grid placeholder.

## Theme

The site has two legend modes, named the way keycaps are:

| Mode | Meaning | Was |
| --- | --- | --- |
| **WoB** | White on Black — light legends, dark board | dark mode |
| **BoW** | Black on White — dark legends, light board | light mode |

The switch lives in the header. First visit follows the operating system; once
someone picks a mode it is remembered (`localStorage`, key `rakb-legend`) and a
small inline script in `src/app/layout.tsx` applies it before the first paint,
so the page never flashes the wrong board colour.

### Colorways

On top of the legend mode sits a **colorway** — the palette the whole site is
dressed in, one per meetup theme. It is set in one place:

```ts
// src/content/theme.ts
export const activeColorway = "a";
```

Shipping now: `default` (Aksara — plain black, plain white, one blue accent),
`foundation` (warm greige and cream, colourful alphas) and `a` (GMK A — deep
teal-blue on a cool grey plate, red accent). The last two also recolour the logo.

To add the next one:

1. Add an entry to `colorways` in `src/content/theme.ts`.
2. Copy the template at the end of the theme layer in `src/app/globals.css` and
   fill in the two blocks — `[data-colorway="<id>"][data-theme="wob"]` and
   `[data-colorway="<id>"][data-theme="bow"]`. Only the tokens that actually
   change need listing; the rest fall through to the default colorway.
3. Point `activeColorway` at it.

No component names a colour — everything reads CSS variables — so the whole
site, the logo and the hero shader follow from those two blocks.

### Logo

`src/components/logo.tsx` is generated from `public/logo/rakb-logo-themeable.svg`
and draws with `--logo-*` tokens, so one component covers every theme and
colorway.

- **`LogoBadge`** — the full badge, tagline and all. Used in the header
  (`.logo-lockup`, 2.75rem tall) and the footer (`.logo-badge`, column width).
  The tagline is roughly 1.7% of the badge width, so **2.75rem tall is the floor**
  — below that it stops resolving. If the header ever gets shorter, shrink the
  header, not the badge.
- **`LogoMark`** — the RAKB; pill on its own, no tagline. For anywhere too small
  for the badge; it is also the shape behind the app icons.

Because the badge already sets the name, neither the header nor the footer
repeats it as text. The static variants in `public/logo/` are kept for anything
outside the site (social, stickers, print).

### Close or open registration

In `src/content/event.ts`:

```ts
registrationOpen: true,
```

Set `false` to change the home CTA and disable submit.

## Registration

Registration runs on an **external ticketing platform** — this site never asks
for names, emails, phone numbers or payment proof.

Set the ticket page URL in `src/content/event.ts`:

```ts
ticketUrl: "https://tickets.example.com/rakb-vol-2",
```

Every "Register" button on the site then points there (new tab). While it is
`null`, the buttons lead to `/register`, which says the link is not live yet.

## Site URL and staging

Copy `.env.example` to `.env.local`:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production domain. Used for sitemap, robots and Open Graph. |
| `NEXT_PUBLIC_SITE_ENV` | `staging` on preview builds — makes every page `noindex` and `robots.txt` disallow everything. `production` otherwise. |

## Deploying

See [DEPLOY.md](DEPLOY.md). Short version: `npm run build` writes a static
`out/` folder, which Cloudflare Pages serves. `develop` is staging, `main` is
production.

The original HTML mockup is in `design/` for visual reference.
