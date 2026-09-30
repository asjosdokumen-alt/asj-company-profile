# asj-company-profile

Halaman **profil perusahaan** PT Amanah Sakura Japan — satu rute: `/`.

Repo ini adalah **pemisahan dari portal** (`asj-astro`). Portal memuat 11 rute
(halaman depan, loker, kandidat, admin, pendaftaran, AI CV, master, dsb.) plus
backend Netlify Functions, indexer kode, dan migrasi database. Repo ini memuat
**halaman profilnya saja**.

---

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/  (static)
npm run preview
npm run typecheck    # hijau
npm run lint         # MERAH — lihat catatan di bawah
npm run verify:assets   # gate §11.2 — lihat di bawah
```

`npm run build` menjalankan dua hal: `astro build`, lalu
`node scripts/build-sw-manifest.mjs` yang menulis ulang daftar precache service
worker dari artefak yang baru saja dibangun. Urutannya penting — manifest yang
dihitung dari build lama akan mem-precache nama berkas ber-hash yang tidak ada lagi.

### Kalau `npm install` gagal di esbuild

Di lingkungan bersandbox ini postinstall `esbuild` tidak bisa men-`spawn`
binernya (`pid: 0`), dan install berhenti. Obatnya:

```bash
npm install --ignore-scripts
```

Aman di sini: postinstall esbuild hanya **memverifikasi** binernya, sedangkan
binernya sendiri datang dari paket platform `@esbuild/win32-x64`, yang tetap
terpasang. `@tailwindcss/oxide-win32-x64-msvc` juga tidak butuh script.
Di mesin biasa tanpa sandbox, `npm install` biasa seharusnya cukup.

### `npm run lint` merah, dan itu bukan dari pemisahan ini

`biome check .` melaporkan **73 error** — hampir semuanya
`lint/a11y/useButtonType` dan `noSvgWithoutTitle` pada komponen yang **tidak
diubah sama sekali** saat repo ini dibuat. Repo portal (`asj-astro`) juga
`exit 1` untuk perintah yang sama; di sana lint **tidak** digerbangi dengan
`biome check`, melainkan dengan `scripts/ci/lint-ratchet.mjs` yang membandingkan
jumlah diagnostik per berkas terhadap baseline `.ci/biome-baseline.json`.

Baseline itu **belum dibawa ke sini**, jadi `npm run lint` di repo ini
melaporkan utang apa adanya. Dua pilihan, keduanya untuk tahap berikutnya:
port `lint-ratchet` + baseline-nya, atau beresi 73 error itu dan jadikan
`npm run lint` gerbang yang benar-benar hijau. Yang **jangan** dilakukan:
menghapus script-nya supaya terlihat hijau.


---

## Asal-usul (provenance)

Disalin **2026-09-30** dari working tree `asj-astro` (`github.com/asjosdokumen-alt/asj-astro`),
HEAD `58efe33`, **termasuk perubahan yang saat itu belum di-commit**: pass polish
halaman profil pada hari yang sama (13 gambar di-encode ulang ke lebar tampilnya,
11 berkas sumber disunting). Jadi repo ini **bukan** snapshot dari commit mana pun
di portal — ia snapshot dari working tree.

`git log` di sini dimulai dari nol dan **tidak** memuat riwayat portal. Riwayat
lengkapnya tetap ada di `asj-astro`.

---

## Yang SENGAJA tidak dibawa

| Tidak ada di sini | Alasan |
|---|---|
| `netlify/` (Functions) | Backend portal. Halaman profil tidak punya backend sendiri — lihat catatan form di bawah. |
| `src/pages/*.astro` selain `index` + `404` | Rute lain portal (loker, kandidat, admin, apply, ai-cv, master, siswa-baru, public, share). |
| `src/components/{admin,candidate,forms}/`, `src/lib/cv-template-factory/` | Hanya dipakai rute-rute itu. |
| `indexer/` | Toolchain indeks kode portal, termasuk tujuh counter berkas yang dibekukan. |
| `e2e/` | Gate browser portal — semuanya mengukur rute yang tidak ada di sini. |
| `migrations/`, `docs/` (sebagian besar), `deliverables/` | Skema database dan dokumentasi portal. |

Yang **dibawa** dari `docs/`: `COMPANY_PROFILE_DATA.md` (sumber kebenaran data
perusahaan) dan `ILLUSTRATION_SPEC.md` (spek aset ilustrasi). Keduanya dirujuk
langsung oleh `src/lib/companyProfile.ts`, `src/lib/gallery.ts`, dan
`scripts/ci/verify-assets.mjs`, jadi membuangnya akan meninggalkan rujukan
menggantung.

### Yang MASIH terbawa dan layak dirampingkan (tahap berikutnya)

Ini salinan setia, bukan versi ramping — jadi beberapa hal masih ikut yang
sebenarnya milik portal:

- **`@supabase/supabase-js` + `src/lib/supabase.ts` + `src/lib/apiClient.ts` +
  `src/store/userStore.ts` + `src/store/authReactive.ts`.** Terukur di portal:
  klien Supabase **56,5 KB** ikut terunduh di rute publik. Ia masuk karena
  `App.tsx` → `userStore` → `supabase` semuanya impor statis.
- **`LoginModal.tsx`, `CekSiswaModal.tsx`, `components/admin/AdminAiCopilot.tsx`.**
  Dirender oleh `App.tsx`; tidak ada gunanya di situs profil.
- **Tautan header ke `/loker`, `/candidate`, `/admin`, `/public`** di `App.tsx`
  dan `BottomNav.tsx` — keempat rute itu **tidak ada di repo ini**, jadi
  tautannya menuju 404.
- **`zod`** (lewat `schemas.ts`) dan `src/lib/fcm.ts`.

### ✅ Form kontak — SELESAI 2026-09-30, lewat Netlify Forms

Catatan ini dulu berbunyi "tidak punya backend" dan itu benar sampai
2026-09-30: `ContactForm.tsx` mengirim lewat `apiClient` ke
`/.netlify/functions/kirimPesanKontak`, sementara `netlify/` sengaja tidak
dibawa dari portal. Formulirnya merender dengan benar dan gagal di setiap
pengiriman.

Pemilik memilih opsi 1 dari tiga pilihan yang dulu tercantum di sini. Sekarang
formulirnya POST url-encoded ke `/` dengan field `form-name`, yang merupakan
cara Netlify Forms menerima kiriman AJAX. `<form>` membawa
`data-netlify="true"`, `name="kontak"`, dan `netlify-honeypot="perusahaan"`.

Dua hal yang ikut berubah dan perlu diketahui:

- **Validasi pindah ke klien.** Server portal yang dulu memaksa batas panjang
  dan **rate limit per nomor** tidak ada di sini, jadi keduanya hilang. Yang
  tersisa: penyaring spam Netlify + honeypot, dan validasi di `submit()` yang
  sopan-santun ke pengunjung, bukan kontrol. Dua kunci i18n baru
  (`contact.err_required`, `contact.err_wa`) menampung pesannya.
- **Form ini harus tetap ter-SSR.** Netlify mendeteksi form dengan memindai HTML
  yang di-deploy, bukan dengan menjalankan JavaScript. `client:visible` tetap
  di-SSR Astro sehingga markup-nya benar-benar ada di `dist/index.html` —
  diperiksa di sana, bukan diasumsikan. Mengubahnya ke `client:only` akan
  menghasilkan form yang tidak pernah dilihat Netlify.

Panduan deploy lengkapnya, termasuk cara mengaktifkan notifikasi email:
**`docs/DEPLOY_NETLIFY.md`**.

---

## 🔴 Aturan foto — §11.2

Repo ini **publik**, dan `public/assets/` memuat foto yang menampilkan wajah yang
bisa dikenali — sebagian besar kandidat muda, sebagian mungkin di bawah umur.
Aturan di `docs/COMPANY_PROFILE_DATA.md` §11.2: foto seperti itu **tidak boleh**
masuk repo, karena publikasi lewat repo tidak bisa ditarik kembali.

`.gitignore` menyebut **satu per satu** nama berkas yang dilarang — bukan satu pola
direktori, karena `!` di bawah pola direktori adalah jaminan palsu (git tidak bisa
me-*re-include* berkas bila direktori induknya sudah di-*exclude*; ini sudah
dibuktikan, bukan diasumsikan).

Gate-nya: **`npm run verify:assets`** — memerahkan build bila daftar ignore, isi
folder, dan yang benar-benar dirender `src/lib/gallery.ts` tidak lagi sinkron.
Jalankan sebelum commit apa pun yang menyentuh `public/assets/`.

Tiga belas foto yang ter-commit di sini sudah punya dasar publikasi yang tercatat
di `src/lib/gallery.ts` (keputusan pemilik 2026-09-23). **Jangan menambah foto
wajah baru tanpa keputusan itu.**

---

## Status deploy

**Siap deploy, belum di-deploy.** Konfigurasinya sudah ada dan sudah di-commit:
`netlify.toml` di root memuat perintah build, folder publish, versi Node, dan
seluruh header cache — jadi dashboard Netlify tidak perlu diisi manual.

Portal asalnya (`asjastro.netlify.app`) **beku sejak 2026-09-24** karena kredit
akun Netlify habis; setiap deploy setelahnya di-skip. Karena itu situs ini
disiapkan untuk **akun Netlify dengan alamat email baru** dan kuota yang mulai
dari nol, bukan menumpang akun yang sudah mentok.

Langkah berikutnya, berurutan, ada di **`docs/DEPLOY_NETLIFY.md`** — termasuk
alasan `PUBLIC_SITE_URL` baru boleh diisi **setelah** deploy pertama (nilainya
dibaca saat build, dan canonical yang menunjuk origin yang salah lebih buruk
daripada tidak ada canonical).

---

## Peta berkas

```
src/
  pages/index.astro          halaman profil perusahaan — satu-satunya rute
  pages/404.astro            halaman 404
  layouts/BaseLayout.astro   <head>, tema, i18n, SW, JSON-LD, hreflang
  components/App.tsx         shell: header, hero, drawer, BottomNav, modal
  components/public/*        seksi-seksi halaman (galeri, mitra, FAQ, kontak, …)
  lib/companyProfile.ts      DATA perusahaan — sumber kebenaran untuk teks
  lib/{gallery,partners,faq,testimonials,siteMeta}.ts
  store/i18n.ts, i18n-jp.ts  kamus ID + JP
  styles/{global,theme,motion,layout}.css
public/
  assets/                    13 foto + ilustrasi (lihat §11.2 di atas)
  icons/                     favicon, ikon PWA, lambang ASJ, sprite
docs/
  COMPANY_PROFILE_DATA.md    data resmi perusahaan + aturan §11.2
  ILLUSTRATION_SPEC.md       spek ukuran & isi ilustrasi
  DEPLOY_NETLIFY.md          panduan deploy ke Netlify, langkah demi langkah
netlify.toml                 konfigurasi build + header cache (sumber kebenaran,
                             bukan dashboard Netlify)
scripts/
  build/strip-html-comments.mjs   pangkas komentar HTML dari build produksi
  build-sw-manifest.mjs           tulis ulang precache service worker
  ci/verify-assets.mjs            gate §11.2
```
