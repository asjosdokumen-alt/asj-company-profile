/**
 * robots.txt — served from `/robots.txt`.
 *
 * WHY AN ENDPOINT AND NOT A STATIC `public/robots.txt`
 * ---------------------------------------------------
 * A static file cannot know the origin, and the one thing this file should say
 * beyond "you may crawl everything" is where the sitemap lives — which is an
 * ABSOLUTE URL. `siteOrigin()` is the repo's single source for that, and it
 * returns `null` when `PUBLIC_SITE_URL` is unset, so the `Sitemap:` line is
 * emitted only when there is a real origin to point at.
 *
 * WHY THERE IS NO `Disallow` AND NO `Crawl-delay`
 * ----------------------------------------------
 * There is nothing to hide: this site is one public page, and the 404 page is
 * reachable only by requesting a URL that does not exist. A `Disallow` for
 * `/404.html` would be cargo-culted — crawlers only reach it by following a
 * broken link, and blocking it removes the one signal that tells them the link
 * is broken. `Crawl-delay` is ignored by Google and Bing and would only slow
 * down the crawlers that do honour it.
 *
 * WHAT IS DELIBERATELY ABSENT: a `Sitemap:` line pointing at a guessed host.
 * The origin in this project has moved twice (see `src/lib/siteMeta.ts`), and a
 * robots.txt advertising a sitemap on a frozen deployment is worse than one
 * that stays quiet — it sends crawlers somewhere the content is not.
 */
import type { APIRoute } from 'astro';
import { siteOrigin } from '../lib/siteMeta';

export const GET: APIRoute = () => {
  const origin = siteOrigin();

  const lines = [
    '# PT Amanah Sakura Japan — company profile',
    '# Everything here is public and meant to be indexed.',
    'User-agent: *',
    'Allow: /',
  ];

  if (origin) {
    lines.push('', `Sitemap: ${origin}/sitemap.xml`);
  } else {
    // No origin: say so in the file rather than inventing one. This branch is
    // what every local build takes, and it is visible in `curl /robots.txt`.
    lines.push(
      '',
      '# Sitemap line omitted: PUBLIC_SITE_URL is not set for this build, so the',
      '# absolute origin is unknown. Set it in Netlify and redeploy — see',
      '# docs/DEPLOY_NETLIFY.md §4.',
    );
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
