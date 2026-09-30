/**
 * App.tsx — the landing page's header, its navigation drawer, and the hero.
 *
 * WHAT THIS FILE USED TO BE, AND WHY IT IS NOT ANY MORE
 * ----------------------------------------------------
 * It was the portal's app shell: a Supabase auth store, a login modal, a
 * registration modal, an admin AI copilot, a candidate-check modal, and a
 * bottom nav — plus a second, NON-hero header variant whose artwork was fetched
 * from the portal's Supabase Storage bucket on every page load.
 *
 * None of that survives, and the reason is not tidiness. Every one of those
 * features needs a backend that this repo does not have:
 *
 *   · the modals posted to `/.netlify/functions/*`, and `netlify/` was left
 *     behind on purpose — the same defect the contact form had (see
 *     `public/ContactForm.tsx`);
 *   · the auth store initialised a Supabase client with no project URL, so the
 *     build printed "[Supabase] Auth features will be disabled" and the whole
 *     surface was inert while still shipping 56.5 KB to every visitor.
 *
 * So they were REMOVABLE, not merely unused: measured by deleting them and
 * watching the build stay green, not by guessing from the import graph.
 *
 * WHY THE `hero` PROP IS GONE. It selected between two headers, and only one
 * was ever reachable: `index.astro` mounts `<App client:load hero />` and that
 * is the component's ONLY consumer — `404.astro` does not mount it at all. The
 * non-hero branch existed for `/loker`, `/admin`, `/candidate` and `/share`,
 * none of which exist in this repo. It is deleted rather than kept as an
 * unreachable option, and with it the Supabase banner artwork, `bannerStore`
 * and the hydration workaround that branch needed.
 *
 * THE DRAWER LINKS TO SECTIONS THAT EXIST. It used to link to `/loker`,
 * `/candidate`, `/admin` and `/public` — four routes this repo does not build,
 * so every one of them was a 404 dressed as navigation. The list below is the
 * page's own anchors, taken from `index.astro`, and nothing else.
 */
import { useState, useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { toggleLang, t, useLang } from '../store/i18n';
import { showToast } from './Toast';
import Icon from './ui/Icon';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * The drawer's section list — and the ONLY hrefs in this file.
 *
 * WHY IT IS NOT DERIVED FROM `index.astro`. The page composes its sections in
 * an `.astro` file and this is a Preact island; there is no shared module
 * between them without inventing one, and a generated list would need a build
 * step for nine strings. What keeps the two in sync instead is that the ids
 * here are checked against the page — a mismatch is a dead anchor, which is the
 * defect this list was written to remove, so it is worth re-checking by grep
 * whenever a section id changes:
 *
 *     grep -oE 'id="[^"]*"' src/pages/index.astro
 */
const NAV: ReadonlyArray<{ href: string; key: string }> = [
  { href: '#layanan', key: 'nav.layanan' },
  { href: '#program', key: 'nav.program' },
  { href: '#alur', key: 'nav.alur' },
  { href: '#galeri', key: 'nav.galeri' },
  { href: '#legalitas', key: 'nav.legal' },
  { href: '#tim', key: 'nav.tim' },
  { href: '#mitra', key: 'nav.mitra' },
  { href: '#faq', key: 'nav.faq' },
  { href: '#kontak', key: 'nav.kontak' },
];

/**
 * Hero statistics — the three the company profile actually proves.
 *
 * WHY THESE THREE AND NOT FOUR. A design mockup showed 500+ candidates, 200+
 * departures and 50+ partners. NONE of those numbers appears anywhere in the
 * official company profile, and a fabricated statistic on a company page is a
 * legal claim, not decoration (docs/COMPANY_PROFILE_DATA.md §12, §13). These
 * three ARE documented: the deed is dated 15 August 2023 (page 6), and the
 * profile lists five placement sectors (page 3) and four destination prefectures
 * — Miyazaki, Okayama, Nagano, Kagoshima (pages 13-14).
 *
 * When the owner supplies the real counts, a fourth tile is added here and the
 * grid already accommodates it (`sm:grid-cols-3` is a row, not a fixed count).
 */
const HERO_STATS: ReadonlyArray<{ value: string; labelKey: string }> = [
  { value: '2023', labelKey: 'profile.stat_since' },
  { value: '5', labelKey: 'profile.stat_sectors' },
  { value: '4', labelKey: 'profile.stat_prefectures' },
];

export default function App() {
  // useLang() re-renders once the lazy JP dict lands (e.g. a cold load with
  // lang=jp) so every t() consumer in this subtree stops showing the Indonesian
  // fallback — the same subscription every island root needs.
  const lang = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() { setMenuOpen((v) => !v); }
  function closeMenu() { setMenuOpen(false); }
  function installApp() {
    showToast('Install: Chrome > Menu > Home Screen', 'info');
    setMenuOpen(false);
  }

  /* ─── Drawer keyboard contract ────────────────────────────────────────
     MEASURED 2026-09-16 on the built artifact at 390x844, BEFORE this block
     existed:

       CLOSED (fresh load)      nav rect.x = 390 = viewport width, i.e. fully
                                off-screen; aria-hidden null; inert false.
                                Tab-walk from the hamburger: 7 of 22 stops
                                landed INSIDE the closed drawer. The ring is
                                painted off-screen, so the user sees nothing
                                happen and has to Tab through six invisible
                                controls.
       Escape while open        no effect (nav still at rect.x = 102)
       Tab while open           19 of 30 stops escaped to the page BEHIND,
                                where the ring lands under the 288 px drawer
       body[inert]              false; [aria-modal] count 0

     Three fixes, all of them the drawer's OWN contract. The page behind is
     deliberately NOT made inert: App renders a fragment and does not own the
     page content, and the scrim already makes the background pointer-inert —
     so keyboard-inerting it is a product decision, reported rather than taken
     silently. */
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  /* `inert` in a LAYOUT effect, not a deferred one: under useEffect the
     attribute lands a frame after paint, which leaves a window where the
     drawer is visually closed but still holds six Tab stops — the exact defect
     this closes. `inert` covers the accessibility tree too, so no separate
     `aria-hidden` is written. */
  useLayoutEffect(() => {
    const el = drawerRef.current;
    if (el) el.inert = !menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const el = drawerRef.current;

    // Focus moves INTO the drawer on open. Without this the ring stays on the
    // hamburger, which the open drawer (288 of 390 px) then covers.
    el?.querySelector<HTMLElement>('button, a[href]')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      // Return focus to the trigger — but ONLY when it is about to be lost,
      // i.e. still inside the drawer, or already fallen to <body> (writing
      // `inert` blurs whatever was inside it). Without this guard the ring
      // would be yanked out of a control the visitor had just focused.
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || !!el?.contains(active);
      const trigger = hamburgerRef.current;
      if (lost && trigger && document.contains(trigger)) trigger.focus();
    };
  }, [menuOpen]);

  /* One logo element for the header.
     LOCAL FILE AS OF 2026-09-30, and the `onError` handler went with the
     hotlink. This pointed at
     `…supabase.co/storage/v1/object/public/asj-files/assets/logo-removebg-preview.webp`
     — 66.140 B, 500x500, drawn at 48/64 px, so **7,8x more pixels than any
     screen could show**, fetched from a third-party CDN on EVERY page.
     `/icons/logo-asj.webp` is the same emblem WITH an alpha channel, so it
     drops onto the header gradient with no white box, and it is already
     committed and already published — no new asset, no new §11.2 decision.
     `onError` existed so a failed CDN fetch would not show a broken icon; a
     file that ships with the build cannot fail that way, and silently hiding
     the brand mark is the wrong behaviour for it. */
  const brandLogo = (
    <img
      id="logo-asj"
      src="/icons/logo-asj.webp"
      alt="Logo ASJ"
      width={500}
      height={500}
      class="w-12 h-12 md:w-16 md:h-16 shrink-0 object-contain drop-shadow-2xl"
    />
  );

  return (
    <ErrorBoundary>
      {/* HERO (`#atas`). The hero had no id and no accessible name, which made
          "kembali ke atas" impossible to express as a link and left the landing
          page's topmost band as its only unnamed landmark.

          `id="atas"` is on the <header> itself, so the anchor IS the band you
          see; no extra element and no extra nesting.

          `scroll-mt-24` is load-bearing, not cosmetic: the site nav is fixed, so
          without it an in-page jump parks the hero's eyebrow under the nav bar.

          The page's single h1 lives inside this hero. */}
      <header
        id="atas"
        class="hero-band scroll-mt-24 hero-gradient relative text-white flex items-end p-6 md:p-10"
      >
        {/* Hero illustration. It sits UNDER the content because the band's
            children are not positioned, so a plain absolutely-positioned sibling
            paints first and the flex row of text lands on top.

            `aria-hidden` + `alt=""` is deliberate: the hero already states its
            meaning in the h1, so the scene restates it. Announcing it again
            would make a screen reader read the same idea twice.

            The gradient is kept as the fallback and the image fades over it via
            opacity, rather than replacing it: the band's gradient and the
            artwork share the same dusk palette, so the two blend into one
            surface instead of meeting at a hard edge. `object-cover` lets the
            art fill a band whose height varies without distorting.

            `loading="eager"` because this is the LCP element's backdrop; lazy
            here would delay the largest paint on the page the visitor sees
            first. */}
        <picture class="hero-art hero-layer -z-0 pointer-events-none">
          <source
            type="image/avif"
            srcset="/assets/ilustrasi/hero-sakura.avif 1x, /assets/ilustrasi/hero-sakura@2x.avif 2x"
          />
          <source
            type="image/webp"
            srcset="/assets/ilustrasi/hero-sakura.webp 1x, /assets/ilustrasi/hero-sakura@2x.webp 2x"
          />
          <img
            src="/assets/ilustrasi/hero-sakura.webp"
            alt=""
            aria-hidden="true"
            width={1600}
            height={582}
            loading="eager"
            decoding="async"
            class="w-full h-full object-cover opacity-60"
          />
        </picture>

        {/* The NEAR parallax plane (motion.css §9e) — a second copy of the
            band's own `--hero-glow` token, re-positioned and enlarged, drifting
            further than the artwork above it. The depth cue is the DIFFERENCE IN
            RATE, not the direction.

            WHY IT IS IN THE UPPER-RIGHT (`background-position: 80% 30%`, set in
            CSS). The hero copy sits at the bottom-left and the `.header-overlay`
            scrim exists to hold its contrast. A pink bloom behind a white
            headline raises the backdrop's luminance and eats exactly that
            contrast — and because this plane drifts, it would carry that bloom
            in and out of the copy's row across the scroll range.

            `pointer-events-none` for the same reason the artwork and the
            overlay carry it: it covers the whole band and must never intercept
            a click meant for the CTA. */}
        <div class="hero-haze hero-layer pointer-events-none" aria-hidden="true" />

        {/* The artwork overlay — DESIGN.md §3.6's level-2 "overlay gradien".
            It is a DIRECTIONAL gradient, not a scrim: transparent over the far
            side of the band, dark only where the copy sits (bottom on a phone,
            left at `lg`). `.header-overlay` in global.css is re-aimed to the
            text's side and darkens in BOTH themes, because the hero copy stays
            white in both.

            It is required by the artwork, not by the bare gradient: with the
            class orphaned (0 elements), the headline measured a worst
            glyph-background of 2.36-2.88:1 in light mode, under the 3:1 floor.
            It is decorative, so `aria-hidden` + `pointer-events-none`. */}
        <div class="absolute inset-0 header-overlay pointer-events-none" aria-hidden="true" />

        {/* ─── The header controls, sized to the project's own touch floor.
             MEASURED 2026-09-22, at a 390px viewport, before this change: the
             hamburger rendered 40x40 and the language toggle 36x36, while
             DESIGN.md:582 ("Tinggi minimum | 44 px") and DESIGN.md:691
             ("Target sentuh | >=44 px, idealnya 48 px") both require 44. The rule
             was already gate-enforced, but only for the shared Button.astro —
             hand-rolled buttons like these two were outside that gate's reach,
             which is exactly how they drifted under the floor unnoticed.

             Sizes are literal 11 (44px) rather than a min-h, because these are
             fixed icon buttons inside a rounded-full pill: a min-height would
             let the circle stay 40px tall while only the tap box grew, which
             reads as a misaligned control. `gap-2` keeps them on one baseline. */}
        <div class="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Toggle language"
            class="w-11 h-11 flex items-center justify-center bg-black/70 hover:bg-zinc-800 text-white rounded-full border border-white/60 transition shadow-lg"
          >
            <Icon name="language" class="text-lg" />
          </button>
          <button
            ref={hamburgerRef}
            type="button"
            onClick={toggleMenu}
            class="w-11 h-11 flex items-center justify-center bg-black/70 hover:bg-zinc-800 text-white rounded-full border border-white/60 transition shadow-lg hamburger-btn"
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'times' : 'bars'} class="text-lg" />
          </button>
        </div>

        <div class="relative z-10 w-full grid gap-6 lg:grid-cols-12 lg:items-end">
          <div class="lg:col-span-7 min-w-0">
            <div class="flex items-center gap-3 min-w-0">
              {brandLogo}
              <span class="text-pink-300 text-eyebrow font-bold uppercase truncate" data-lang="profile.hero_eyebrow">
                {t('profile.hero_eyebrow')}
              </span>
            </div>
            <p class="text-pink-300 text-eyebrow font-bold uppercase mt-5" data-lang="profile.hero_tagline">
              {t('profile.hero_tagline')}
            </p>

            {/* `text-white` IS EXPLICIT HERE, and that is load-bearing — do not
                delete it because "the hero is dark anyway".

                This h1 carried no colour class until 2026-09-20 and inherited
                `--color-fg` from the theme. That worked only while light mode's
                `--color-fg` happened to be near-white, which came from the wrong
                place: it is the PAGE text token, and the light palette was later
                retuned to `#16121c` so body copy reads on the white canvas.

                Measured consequence, in a browser against a real server: the
                hero h1 resolved to `rgb(31, 29, 28)` on a
                `linear-gradient(135deg, rgb(42,18,53) …)` band — contrast
                **1.01:1**, i.e. effectively invisible. The h1 of the landing
                page. The band is deliberately dark in BOTH themes, so the
                heading's colour must not be derived from the theme at all. */}
            <h1 class="text-display font-display font-normal text-white drop-shadow-lg mt-2">
              {t('profile.hero_title')}
            </h1>
            <p class="text-body text-slate-200 mt-4 max-w-[52ch] leading-relaxed">
              {t('profile.hero_sub')}
            </p>

            {/* The hero's CTA. It used to be `openRegister`, which opened the
                registration modal — a modal that posted to a Netlify Function
                this repo does not have. It now points at the contact section,
                which is the page's own conversion surface and actually works:
                `#kontak` carries the phone number, the three channel QR codes
                and the form. Pointing at WhatsApp directly was the alternative
                and was not taken, because it would presume a channel the section
                itself already offers alongside the others. */}
            <div class="flex flex-wrap gap-3 mt-8">
              <a
                href="#kontak"
                class="inline-flex items-center px-7 py-3.5 rounded-pill bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-sm transition"
              >
                <Icon name="user-plus" class="mr-2" />
                {t('profile.hero_cta_secondary')}
              </a>
            </div>
            <div class="flex flex-wrap gap-2 mt-6">
              {[t('profile.hero_chip_ssw'), t('profile.hero_chip_magang'), t('profile.hero_chip_penempatan')].map((label) => (
                <span key={label} class="px-3.5 py-1.5 rounded-pill bg-white/10 border border-white/15 text-caption font-bold text-slate-200 backdrop-blur-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Glass tiles: the ONLY place besides the closing band that uses a
              translucent surface, and the only one over artwork. Kept to one
              area per screen — `backdrop-filter` costs per frame.

              COLUMN COUNT — measured, not guessed. This used to read
              `grid gap-3 sm:grid-cols-3 lg:grid-cols-1`, so the lg tier
              overrode the row and the three tiles STACKED on desktop, which is
              the opposite of the intent: one strip became a 479px-wide column
              three deep. Measured with e2e/measure-hero-stats.mjs before the
              fix — 700px ONE ROW (209px x3), 1280px STACKED (479px x1,
              y=235/325/416).

              WHY `sm:grid-cols-3` AND NOT `grid-cols-3`. Forcing three columns
              at every width fixed the desktop stack and BROKE mobile: at 390px
              the tiles became 106px wide and 106px tall (from 73px), and
              "Bidang penempatan" wrapped mid-word to "penempata/n". Below `sm`
              the tiles now sit one per row at full width, which is the reading
              order a phone actually wants. */}
          <div class="lg:col-span-5 grid gap-3 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.labelKey}
                class="rounded-card bg-white/10 border border-white/15 backdrop-blur-sm px-5 py-4 flex sm:block items-center justify-between gap-3 hover:bg-white/15 transition-colors"
              >
                <div class="text-section font-black text-pink-300 leading-none">{stat.value}</div>
                <div class="text-caption text-slate-200 mt-0 sm:mt-2">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Scrim only, and deliberately presentational. It is a pointer-only
          convenience: the drawer carries its own labelled close button and the
          hamburger toggles, so nothing is lost by keeping it out of the a11y
          tree. Left as a bare clickable div it measured as a nameless
          `u-modal-shell` overlay — indistinguishable, to a screen reader, from
          a real modal.

          `.js-scrim` IS LOAD-BEARING — do not remove it. The light-theme shim
          in global.css remaps `bg-black/NN` to a pale surface for cards, and it
          exempts real scrims via `:not(.inset-0)`. This scrim gets its geometry
          from `.u-viewport-fixed`, NOT `inset-0`, so it slipped the exemption
          and was repainted OPAQUE. MEASURED light-theme, drawer open: computed
          background was `rgb(239,233,239)` (opacity 1) hiding the whole page;
          dark theme was correct. `.js-scrim` is the explicit, named opt-out for
          exactly this case. */}
      {menuOpen && (
        <div
          aria-hidden="true"
          class="u-viewport-fixed u-modal-shell bg-black/70 js-scrim z-scrim"
          onClick={closeMenu}
        />
      )}

      {/* ─── Drawer ───
          `u-viewport-fixed--right` rather than `fixed top-0 right-0 h-full`:
          with `scrollbar-gutter: stable` on <html>, a plain `right: 0` on a
          fixed element is resolved against the initial containing block, which
          EXCLUDES the reserved gutter — so on desktop the drawer stopped 15px
          short of the screen edge (measured: innerWidth 1280, nav.right 1265).
          The utility pins it to the physical viewport. */}
      <nav
        ref={drawerRef}
        class={
          'u-viewport-fixed--right z-drawer w-72 md:w-96 bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col transition-transform duration-300 transform ' +
          (menuOpen ? 'translate-x-0' : 'translate-x-full')
        }
        aria-label="Primary navigation"
      >
        <div class="flex items-center justify-between p-4 border-b border-slate-700">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Icon name="bars" class="mr-2 text-sky-400" /> {t('ui.menu')}
          </span>
          <button
            type="button"
            onClick={closeMenu}
            class="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <Icon name="times" class="text-xl" />
          </button>
        </div>

        <div class="flex-1 u-scroll-area p-4 space-y-3">
          <div class="space-y-3 pb-3 mb-3 border-b border-slate-700">
            <button
              type="button"
              onClick={installApp}
              class="w-full py-3 bg-gradient-to-r from-emerald-700 to-sky-700 hover:from-emerald-800 hover:to-sky-800 text-white rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center"
            >
              <Icon name="mobile-alt" class="mr-2" /> {t('ui.install_app')}
            </button>
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Toggle language"
              class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Icon name="language" /> {t('ui.language')} <span>{lang === 'id' ? 'ID' : 'JP'}</span>
            </button>
          </div>

          {/* The section list. Every href here is an anchor that exists on `/`
              — see the note on NAV at the top of this file. The links close the
              drawer so the jump is visible; without that the drawer stays over
              the section it just scrolled to. */}
          <div class="space-y-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                class="block w-full px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold text-sm"
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </ErrorBoundary>
  );
}
