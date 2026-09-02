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

### Close or open registration

In `src/content/event.ts`:

```ts
registrationOpen: true,
```

Set `false` to change the home CTA and disable submit.

### Site URL (SEO)

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the production domain. Used for sitemap, robots, and Open Graph.

## Registration (v1)

The register page looks complete (terms scroll-to-accept, success state) but **does not save submissions**. Persistence can be added later by replacing `src/lib/submit-registration.ts` with a Server Action.

The original HTML mockup is in `design/` for visual reference.
