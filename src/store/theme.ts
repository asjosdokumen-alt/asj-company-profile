/**
 * theme.ts — Single source of truth for dark/light theme (Nanostores)
 *
 * WHY THIS EXISTS
 * ---------------
 * There were three independent `toggleTheme()` implementations
 * (App.tsx, public/LokerTable.tsx, forms/FormToolbar.tsx), each holding
 * its own `isDark` useState. Toggling from one left the others stale —
 * the header banner and the moon/sun icon would disagree with the page
 * you actually toggled from.
 *
 * This module owns the theme. Components read `themeStore` and call
 * `toggleTheme()`; nobody keeps local state.
 *
 * MIGRATION NOTE (dual-write)
 * ---------------------------
 * We write `data-theme` (new token system, see styles/theme.css).
 * The legacy `.light` class has been removed — all light-mode styles
 * now flow through semantic CSS variables defined in theme.css.
 *
 * ─── THE BANNER HALF WAS REMOVED 2026-09-30 ──────────────────────────────────
 * This file used to also own a `bannerStore` (`SAKURA` / `TOKYO` / `INTER_VIP`),
 * a `bannerExplicitStore` flag, `bannerFollowsTheme()`, `setBanner()` and
 * `clearBannerChoice()`. All of it existed to swap the NON-HERO header's artwork
 * — an `<img>` pointed at the portal's Supabase Storage bucket.
 *
 * That header is gone (see `src/components/App.tsx`): it was a branch for
 * routes this repo does not build, so the artwork had no element to paint into.
 * Verified by grep before deleting rather than inferred: after `App.tsx`
 * changed, `bannerStore` had ZERO consumers outside this file, and `setBanner`
 * and `clearBannerChoice` had zero anywhere including this file.
 *
 * What is LEFT is the part with a live consumer: `themeStore` is subscribed by
 * `BaseLayout.astro` to drive the sakura-petal effect, which is keyed off the
 * mode. That is why this file still exists at all.
 */
import { persistentAtom } from '@nanostores/persistent';

export type ThemeMode = 'dark' | 'light';

/**
 * Default theme.
 *
 * OWNER DECISION 2026-09-20: the landing page ships LIGHT, with the pink sakura
 * palette, to match the approved design mockup. Dark mode is KEPT — it is a
 * supported mode reached through the toggle, not a removed feature — it is only
 * the first-paint default that changed.
 *
 * This constant exists because the default was previously the literal 'dark' in
 * FOUR independent places (this store, `decode` below, BaseLayout's inline
 * restore script, and the tests). Changing one and not the others produces a
 * page that flashes dark and then settles light, which is exactly the class of
 * bug this file was created to kill. Keep them in sync:
 *   1. `theme.ts`          DEFAULT_THEME (below) + `decode`
 *   2. `BaseLayout.astro`  the inline restore script — MUST stay inline
 */
export const DEFAULT_THEME: ThemeMode = 'light';

/** Legacy key used by BaseLayout.astro's restore script — keep in sync. */
const STORAGE_KEY = 'asjTheme';

export const themeStore = persistentAtom<ThemeMode>(STORAGE_KEY, DEFAULT_THEME, {
  encode: (v) => v,
  decode: (v) => (v === 'light' ? 'light' : v === 'dark' ? 'dark' : DEFAULT_THEME),
});

/**
 * Apply the theme to the DOM. Call this on load and on every change.
 * Exported so the inline restore script can be mirrored from TS.
 */
export function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', mode);
}

/** Flip the theme. This is the ONLY place that should mutate it. */
export function toggleTheme() {
  const next: ThemeMode = themeStore.get() === 'light' ? 'dark' : 'light';
  setTheme(next);
}

export function setTheme(mode: ThemeMode) {
  themeStore.set(mode);
}

/** Initialise from persisted state. Safe to call more than once. */
export function initTheme() {
  applyTheme(themeStore.get());
}

if (typeof window !== 'undefined') {
  // React to store changes from any component.
  themeStore.subscribe((mode) => {
    applyTheme(mode);
    window.dispatchEvent(new Event('asj-theme-change'));
  });

  // Cross-tab sync: persistentAtom writes localStorage, mirror the DOM.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) applyTheme(themeStore.get());
  });

  initTheme();
}
