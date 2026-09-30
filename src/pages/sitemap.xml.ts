/**
 * sitemap.xml — served from `/sitemap.xml`.
 *
 * WHY IT LISTS EXACTLY ONE URL
 * ---------------------------
 * This site has one indexable document, `/`. The 404 page is deliberately
 * absent: a sitemap is a list of pages you WANT indexed, and asking Google to
 * index an error page is a defect, not thoroughness.
 *
 * `/?lang=jp` IS ALSO ABSENT, and that is a judgement rather than an oversight.
 * The Japanese version is the SAME HTML document with the language applied
 * client-side — `BaseLayout.astro` declares it as an `hreflang` alternate, which
 * is the correct mechanism for "one page, two languages, one URL". Listing it in
 * the sitemap as well would present one document as two URLs and invite exactly
 * the duplicate-content question the `hreflang` pair exists to answer.
 *
 * WHY `<lastmod>`, `<changefreq>` AND `<priority>` ARE ALL OMITTED
 * ---------------------------------------------------------------
 * `<changefreq>` and `<priority>` have been ignored by Google for years; writing
 * them is noise that reads as signal. `<lastmod>` is honoured, which is precisely
 * why it is not written here: the only date this endpoint can know is the build
 * time, and a `lastmod` that changes on every deploy — including deploys that
 * touch no copy — teaches a crawler to distrust the field entirely. Omitting it
 * is the honest option until there is a real per-page modification date to use.
 *
 * THE ORIGIN CONTRACT. `siteOrigin()` returns `null` when `PUBLIC_SITE_URL` is
 * unset, and a sitemap REQUIRES absolute URLs — the spec has no relative form. So
 * the file is emitted empty with an XML comment saying why, rather than filled
 * with a guessed host. See `src/lib/siteMeta.ts` for the reasoning, and
 * `docs/DEPLOY_NETLIFY.md` §4 for the one-line fix.
 */
import type { APIRoute } from 'astro';
import { siteOrigin, absoluteUrl } from '../lib/siteMeta';

/** The site's only indexable route. */
const ROUTES = ['/'];

export const GET: APIRoute = () => {
  const origin = siteOrigin();

  const urls = ROUTES.map((path) => absoluteUrl(path, origin)).filter(
    (u): u is string => u !== null,
  );

  if (urls.length === 0) {
    console.warn(
      '[sitemap] PUBLIC_SITE_URL is not set, so no absolute origin is known and ' +
        '/sitemap.xml was emitted EMPTY. Set PUBLIC_SITE_URL in Netlify (scope: ' +
        'Builds) and redeploy — docs/DEPLOY_NETLIFY.md §4.',
    );
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    urls.length === 0
      ? '<!-- Empty on purpose: PUBLIC_SITE_URL is unset, so no absolute origin is\n' +
        '     known. A sitemap requires absolute URLs and this project refuses to\n' +
        '     guess a host (it has moved twice). See docs/DEPLOY_NETLIFY.md section 4. -->'
      : '',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`),
    '</urlset>',
  ]
    .filter((l) => l !== '')
    .join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
