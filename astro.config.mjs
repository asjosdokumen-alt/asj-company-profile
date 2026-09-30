import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import stripHtmlComments from './scripts/build/strip-html-comments.mjs';

/**
 * CONFIG FOR THE COMPANY-PROFILE SITE ONLY.
 *
 * This is the portal's config with the portal's parts removed. What changed and
 * why — so nobody has to diff it against `asj-astro` to find out:
 *
 *   REMOVED  `@astrojs/netlify` import and the commented-out `output: 'server'` /
 *            `adapter: netlify()`. This repo has no Netlify Functions and no SSR
 *            surface, so the adapter was a dependency that bought nothing.
 *
 *   REMOVED  the `/.netlify/functions` dev proxy. It existed so `astro dev` could
 *            talk to a DEPLOYED backend while running locally. There is no backend
 *            here, and a proxy pointing at another site's API is worse than none:
 *            it makes local look like it works.
 *
 *   KEPT     `stripHtmlComments`. This is not cosmetic — MEASURED 2026-09-29 in
 *            the portal, `dist/index.html` shipped 18,412 B of authored comments
 *            (8.6% of the page, 55 blocks). The comments are the repo's rationale
 *            notes and belong in SOURCE; a visitor should not download them.
 *
 *   KEPT     the preact/tailwind/react-alias wiring, byte for byte. The page is
 *            built from the same components, so the same resolution rules apply.
 */
export default defineConfig({
  integrations: [preact({ compat: true }), stripHtmlComments()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['preact', 'preact/hooks', '@nanostores/persistent', 'nanostores'],
      exclude: ['@astrojs/preact', '@nanostores/preact'],
    },
    resolve: {
      alias: { react: 'preact/compat', 'react-dom': 'preact/compat' },
      dedupe: ['preact', 'preact/compat', 'preact/hooks', '@nanostores/preact', 'react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['preact'],
          },
        },
      },
    },
  },
});
