/**
 * Staging flag.
 *
 * Set `NEXT_PUBLIC_SITE_ENV=staging` on the preview/staging branch. It makes the
 * build emit `noindex` on every page and a blanket `Disallow: /` in robots.txt,
 * so the review copy never turns up in search results next to the real site.
 * Production leaves the variable unset (or sets it to `production`).
 */
export const siteEnv = process.env.NEXT_PUBLIC_SITE_ENV ?? "production";

export const isStaging = siteEnv !== "production";
