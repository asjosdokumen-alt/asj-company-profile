/**
 * ContactForm.tsx — the public contact form in the `#kontak` section.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 * --------------------------------
 * This is the ONLY unauthenticated WRITE in the deployment. A visitor has no
 * account — that is the whole point of a company contact form, because requiring
 * one would mean only existing users could ask how to become one. This file owns
 * only what the visitor sees.
 *
 * WHERE THE SUBMISSION GOES NOW — CHANGED 2026-09-30, AND WHY
 * ----------------------------------------------------------
 * It used to go to `netlify/functions/contexts/contact/service.ts`, which held
 * the validation, the length bounds, the per-number rate limiting and the
 * honeypot decision. THAT FILE IS NOT IN THIS REPO. `netlify/` is the portal's
 * backend and the split deliberately left it behind (README, "Yang SENGAJA tidak
 * dibawa"), so `apiClient` was posting to `/.netlify/functions/kirimPesanKontak`
 * on a site that has no Functions — the form rendered correctly and failed on
 * every submit. That is a live defect, not a theoretical one, and the README
 * already listed "Netlify Forms" as the cheapest of the three available fixes.
 *
 * The owner chose it. So the POST now goes to `/` as
 * `application/x-www-form-urlencoded` with a `form-name` field, which is how
 * Netlify Forms receives an AJAX submission, and Netlify stores the entry and
 * emails the site owner. No Function, no server to keep alive.
 *
 * WHAT THAT COSTS, STATED PLAINLY. The server used to enforce things the browser
 * cannot: per-number rate limiting and length bounds that survive a crafted
 * request. Those are GONE — anyone can POST to `/` directly with any body. What
 * replaces them is Netlify's own spam filtering plus the honeypot below, and the
 * validation in `submit()` is now a COURTESY to the visitor rather than a
 * control: it stops an honest person typing a number we cannot call back, and
 * stops nothing else. Do not read the `MAX` constants as enforcement.
 *
 * WHY THE FORM IS DETECTED AT ALL. Netlify's build bot scans the DEPLOYED HTML
 * for forms; it does not run JavaScript. This island is mounted with
 * `client:visible`, which Astro still server-renders, so the `<form>` and all
 * five inputs are really present in `dist/index.html` — verified there, not
 * assumed. A `client:only` directive here would have produced a form Netlify
 * never sees, and every submission would 404. Do not change that directive.
 *
 * THE HONEYPOT, AND WHY ITS LABEL IS INVISIBLE RATHER THAN ABSENT
 * --------------------------------------------------------------
 * A bot fills every input it can find; a person never sees this one. Two
 * consequences shape the markup:
 *
 *   - It is NOT `type="hidden"`. A naive scraper is often smart enough to skip
 *     explicitly hidden fields, which would defeat the trap. It is a normal text
 *     input that is visually hidden and removed from the tab order, so it looks
 *     like an ordinary field to anything parsing the DOM and like nothing at all
 *     to a person.
 *   - It carries `tabIndex={-1}` AND `aria-hidden`. Without both, a keyboard
 *     user would tab into an invisible box and a screen reader would announce a
 *     field that has no meaning. `autocomplete="off"` keeps a password manager
 *     from helpfully filling it in and getting an honest visitor silently
 *     blackholed — which is the one failure mode of a honeypot that actually
 *     harms someone.
 *
 * WHY THE HONEYPOT FIELD IS NAMED `perusahaan`, AND WHY NETLIFY AGREES
 * -------------------------------------------------------------------
 * The name is `perusahaan` ("company"), plausible enough to attract a bot that
 * scrapes field names for something business-shaped. Netlify's own spam filter
 * is told to watch that same field via `netlify-honeypot="perusahaan"` on the
 * `<form>`, so the trap now has TWO jaws: this component short-circuits a filled
 * honeypot client-side (below), and Netlify discards a submission whose honeypot
 * arrived non-empty. The second one is the one that holds, because it does not
 * depend on our JavaScript running.
 *
 * WHY THERE IS NO LONGER AN `apiClient` CALL HERE
 * ----------------------------------------------
 * `apiClient` defaults to `requireAuth: true` and `onSessionInvalid: 'logout'`,
 * which had to be overridden because this page is public. All of that is moot
 * now: the submission is a plain `fetch` to `/`, so there is no session to
 * invalidate and no client-level toast to suppress. The import was removed
 * rather than left dangling — `noUnusedImports` is on for `.tsx` in
 * `biome.json`, and an unused import of the Supabase-backed client is exactly
 * the kind of thing that quietly drags it back into the bundle.
 *
 * WHY A SUCCESS STATE RATHER THAN A RESET FORM
 * -------------------------------------------
 * A cleared form looks identical to one that failed silently. Replacing it with
 * a confirmation removes that ambiguity, states when a reply can be expected,
 * and offers the WhatsApp route for anyone who needs an answer sooner. The
 * confirmation is a live region (`role="status"`) so a screen-reader user hears
 * it instead of being left on a form that apparently did nothing.
 */
import { useState } from 'preact/hooks';
import { showToast } from '../Toast';
import { t, useLang } from '../../store/i18n';
import Icon from '../ui/Icon';

/**
 * The name Netlify Forms files this submission under.
 *
 * The same string appears in three places that MUST agree: the `name` attribute
 * on the `<form>`, the hidden `form-name` input, and the `form-name` field of
 * the AJAX body. Netlify matches the POST to the form definition it discovered
 * in the deployed HTML by this value, and a mismatch is silent — the request
 * returns 200 and the entry simply never appears in the dashboard. Named once
 * here so there is one place to be wrong, and the two attribute sites below
 * interpolate it rather than repeating the literal.
 */
const FORM_NAME = 'kontak';

interface Fields {
  nama: string;
  noWa: string;
  subjek: string;
  pesan: string;
  /** The honeypot. Always empty for a person; a bot fills it. */
  perusahaan: string;
}

const EMPTY: Fields = { nama: '', noWa: '', subjek: '', pesan: '', perusahaan: '' };

/**
 * Client-side limits, carried over from the portal's `service.ts`
 * (MAX_NAMA 120, MAX_WA 40, MAX_SUBJEK 160, MAX_PESAN 4000).
 *
 * ⚠ THESE ARE NO LONGER ENFORCEMENT. They used to mirror a server that rejected
 * an over-long field; that server is not in this repo (see the header), so
 * nothing downstream rejects anything. What is left is a `maxLength` on the
 * input, which is a courtesy to the visitor — it stops someone pasting a
 * paragraph into the subject line and losing it — and no obstacle whatsoever to
 * a crafted POST. Kept at the original numbers so a future move back to a real
 * backend does not have to re-derive them from the printed profile.
 */
const MAX = { nama: 120, noWa: 40, subjek: 160, pesan: 4000 } as const;

/**
 * A deliberately loose WhatsApp/phone shape: a digit or `+` first, then digits
 * and the separators a person actually types.
 *
 * WHY LOOSE. The server used to own this rule and it is gone, so the only job
 * left is catching a typo a human would want caught — a letter where a digit
 * belongs. Anything stricter starts rejecting numbers this company can really be
 * reached on: `+81 90-1234-5678`, `0812-3456-7890`, `(0352) 123456` and a
 * leading country code `62` are all real. A rejected honest enquiry is a worse
 * failure than an accepted malformed one, because only the second is visible to
 * the owner and fixable by a reply.
 */
const WA_SHAPE = /^[+(\d][\d\s()+.-]{6,}$/;

/**
 * The shared class for the four text fields.
 *
 * WHY IT IS A CONSTANT AND NOT REPEATED FOUR TIMES. It was repeated four times,
 * byte-identically, which is how the field height drifted out of compliance
 * without anyone noticing: there was no single place that represented "the field
 * height", so there was nothing to check.
 *
 * MEASURED 2026-09-22 at a 390px viewport, before this change: each field
 * rendered 295x40. DESIGN.md:582 sets the minimum at 44px and, for buttons
 * inside a mobile form, at 48px. Submitting this form is the single conversion
 * the contact section exists for, so it gets the 48px tier rather than the 44px
 * floor. The submit button beside these fields already carried
 * `min-h-[44px]` (see the comment on it below), so the fields were the only
 * controls in this form under the standard.
 *
 * `min-h-12` (48px) and not `h-12`: the `pesan` field is a `resize-y` textarea
 * and a fixed height would fight the resize handle.
 */
const FIELD_CLASS =
  'min-h-12 rounded-control border border-line bg-surface px-3 py-2 text-body-sm text-fg';

export default function ContactForm() {
  const _lang = useLang();
  const [f, setF] = useState<Fields>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof Fields) => (e: Event) =>
    setF((prev) => ({ ...prev, [k]: (e.target as HTMLInputElement | HTMLTextAreaElement).value }));

  const submit = async (e: Event) => {
    e.preventDefault();
    if (sending) return;

    // The visitor never sees the honeypot, so this branch is only reachable by
    // something that filled it programmatically. Report the same success the
    // honest path reports — a bot that gets an error learns to retry, a bot that
    // gets "sent" does not. Nothing is transmitted, so this costs one round trip
    // less than the real path.
    //
    // This is the SECOND jaw of the trap, not the only one. The `<form>` also
    // carries `netlify-honeypot="perusahaan"`, so a bot that posts straight to
    // `/` — skipping this handler entirely — is discarded by Netlify instead.
    if (f.perusahaan.trim() !== '') {
      setSent(true);
      return;
    }

    // Validation, for the visitor's benefit only (see the MAX note above).
    // `noValidate` is on the form, so the browser will NOT do this for us — and
    // that is the right call here, because the page has its own language toggle
    // while native validation messages follow the BROWSER's locale. A JP reader
    // on an ID browser would otherwise get ID errors from Chrome and JP errors
    // from this component, in the same form.
    if (!f.nama.trim() || !f.noWa.trim() || !f.subjek.trim() || !f.pesan.trim()) {
      const msg = t('contact.err_required');
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    if (!WA_SHAPE.test(f.noWa.trim())) {
      const msg = t('contact.err_wa');
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setError('');
    setSending(true);
    try {
      // Netlify Forms over AJAX: a url-encoded body POSTed to `/`, with
      // `form-name` naming the form definition Netlify found in the deployed
      // HTML. The content type is NOT optional — Netlify parses url-encoded and
      // multipart bodies, and a JSON body is not read as a submission at all.
      //
      // The honeypot is deliberately absent from the body. It is empty for every
      // human, and Netlify reads a MISSING honeypot field the same as an empty
      // one; sending it would only add a field for a scraper to notice.
      const body = new URLSearchParams({
        'form-name': FORM_NAME,
        nama: f.nama,
        no_wa: f.noWa,
        subjek: f.subjek,
        pesan: f.pesan,
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(t('contact.failed'));
      setSent(true);
      setF(EMPTY);
    } catch (err) {
      // Netlify answers an accepted submission with a 2xx, so a non-2xx here
      // means the POST itself failed — offline, blocked, or a 5xx. There is no
      // server message to surface any more, so the generic string IS the answer
      // rather than a fallback from something more specific.
      const msg = err instanceof Error && err.message ? err.message : t('contact.failed');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        class="flex flex-col items-start gap-3 rounded-card border border-emerald-500/40 bg-emerald-900/15 p-6"
      >
        <span class="inline-flex items-center gap-2 text-card-title font-bold text-emerald-400">
          <Icon name="check-circle" />
          <span data-lang="contact.sent_title">{t('contact.sent_title')}</span>
        </span>
        <p class="text-body-sm text-fg-muted" data-lang="contact.sent_body">
          {t('contact.sent_body')}
        </p>
      </div>
    );
  }

  // Every control's id is derived from its own binding key, so the id, the
  // `for` and the `id` on the error message cannot drift apart. `e2e/test-labels.mjs`
  // fails on an unassociated label, and a hand-written id is how that happens.
  const idOf = (k: string) => `kontak-${k}`;

  return (
    <form
      name={FORM_NAME}
      onSubmit={submit}
      method="POST"
      action="/"
      data-netlify="true"
      netlify-honeypot="perusahaan"
      noValidate
      class="flex flex-col gap-4"
    >
      {/* ── The Netlify Forms contract, in one place ────────────────────────
          `data-netlify="true"` plus a `name` are what Netlify's build bot looks
          for while scanning the DEPLOYED HTML. Without them no form called
          `kontak` is ever registered, and the AJAX POST below is answered with a
          200 and silently discarded — the worst failure shape there is, because
          nothing looks broken.

          `method` and `action` are not decoration. They are the NO-JAVASCRIPT
          path: this island hydrates on scroll, so a visitor who submits before
          the bundle arrives — or with JS disabled — gets a real browser POST
          instead of a dead button. That path reaches the right form only because
          the hidden `form-name` input below travels with it.

          `netlify-honeypot="perusahaan"` names the field Netlify's spam filter
          watches. It MUST match the honeypot input further down; a mismatch
          makes the filter watch a field that does not exist, which is a trap
          that never fires and never reports. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1.5" for={idOf('nama')}>
          <span class="text-caption font-bold uppercase text-fg" data-lang="contact.field_nama">
            {t('contact.field_nama')}
          </span>
          <input
            id={idOf('nama')}
            name="nama"
            type="text"
            required
            maxLength={MAX.nama}
            autocomplete="name"
            value={f.nama}
            onInput={set('nama')}
            class={FIELD_CLASS}
          />
        </label>

        <label class="flex flex-col gap-1.5" for={idOf('noWa')}>
          <span class="text-caption font-bold uppercase text-fg" data-lang="contact.field_wa">
            {t('contact.field_wa')}
          </span>
          <input
            id={idOf('noWa')}
            name="no_wa"
            type="tel"
            required
            maxLength={MAX.noWa}
            autocomplete="tel"
            inputMode="tel"
            placeholder="08xx-xxxx-xxxx"
            value={f.noWa}
            onInput={set('noWa')}
            class={FIELD_CLASS}
          />
        </label>
      </div>

      <label class="flex flex-col gap-1.5" for={idOf('subjek')}>
        <span class="text-caption font-bold uppercase text-fg" data-lang="contact.field_subjek">
          {t('contact.field_subjek')}
        </span>
        <input
          id={idOf('subjek')}
          name="subjek"
          type="text"
          required
          maxLength={MAX.subjek}
          value={f.subjek}
          onInput={set('subjek')}
          class={FIELD_CLASS}
        />
      </label>

      <label class="flex flex-col gap-1.5" for={idOf('pesan')}>
        <span class="text-caption font-bold uppercase text-fg" data-lang="contact.field_pesan">
          {t('contact.field_pesan')}
        </span>
        <textarea
          id={idOf('pesan')}
          name="pesan"
          required
          rows={5}
          maxLength={MAX.pesan}
          value={f.pesan}
          onInput={set('pesan')}
          class={`${FIELD_CLASS} resize-y`}
        />
      </label>

      {/* ── Honeypot ────────────────────────────────────────────────────────
          Read the note at the top of this file before changing anything here.
          The three attributes that matter are `tabIndex={-1}` (keyboard users
          cannot land in it), `aria-hidden` (screen readers do not announce it)
          and `autocomplete="off"` (a password manager does not fill it and so
          does not get an honest visitor silently discarded). Removing any one of
          them turns a bot trap into an accessibility defect. */}
      <div class="hidden" aria-hidden="true">
        <label class="flex flex-col gap-1.5" for={idOf('perusahaan')}>
          <span>Perusahaan</span>
          <input
            id={idOf('perusahaan')}
            name="perusahaan"
            type="text"
            tabIndex={-1}
            autocomplete="off"
            value={f.perusahaan}
            onInput={set('perusahaan')}
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          class="rounded-card border border-rose-500/40 bg-rose-900/15 px-4 py-3 text-body-sm text-rose-300"
        >
          {error}
        </p>
      ) : null}

      {/* ── The submit control ──────────────────────────────────────────────
          The classes are the `primary` variant of Button.astro transcribed,
          NOT invented, because `Button.astro` is an `.astro` component and
          cannot be imported into this `.tsx` island.

          The first version of this button used `bg-accent text-accent-fg`, and
          `verify:classes` failed it: `text-accent-fg` has no rule, so the label
          would have rendered unstyled. That gate was right and the cause is a
          documented trap — DESIGN.md §3.2 and `button.test.ts` are both explicit
          that `--color-accent` is the LIGHT accent for text and icons on a dark
          surface, and is far below AA as a SOLID FILL. The solid tiers are the
          -600/-700 steps; pink-600 is measured at 4.60:1 against white.

          The two rules Button.astro also enforces and this must keep:
            - `min-h-[44px]` — the §6.4 touch minimum as a min-height, so a later
              padding trim cannot push the target below the floor;
            - hover DARKENS (-600 -> -700). Every other button in the repo does;
              a control that lightens on hover reads as disabled. */}
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-control bg-pink-600 px-5 py-2.5 text-body-sm font-bold text-white transition select-none hover:bg-pink-700 disabled:opacity-50 disabled:pointer-events-none motion-reduce:transition-none"
        >
          <Icon name={sending ? 'spinner' : 'paper-plane'} spin={sending} />
          <span data-lang={sending ? 'contact.sending' : 'contact.send'}>
            {sending ? t('contact.sending') : t('contact.send')}
          </span>
        </button>
        <span class="text-caption text-fg-muted" data-lang="contact.privacy">
          {t('contact.privacy')}
        </span>
      </div>
    </form>
  );
}
