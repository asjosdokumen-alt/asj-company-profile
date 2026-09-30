# asj-company-profile

Halaman **profil perusahaan** PT Amanah Sakura Japan — lembaga pelatihan dan
penempatan kerja ke Jepang di Kabupaten Ponorogo, Jawa Timur.

Situs statis. Satu rute (`/`) plus halaman 404, dua bahasa (Indonesia dan
Jepang), dan satu-satunya bagian yang butuh server adalah formulir kontak —
yang ditangani Netlify Forms, bukan backend sendiri.

**Belum di-deploy.** Alamatnya ditentukan nanti; panduan ada di
[`docs/DEPLOY_NETLIFY.md`](docs/DEPLOY_NETLIFY.md).

---

## Menjalankan

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # → dist/  (statis)
npm run preview        # menyajikan dist/ apa adanya
npm run typecheck      # harus hijau
npm run verify:assets  # gate §11.2 — lihat di bawah
```

### `npm run build` menjalankan DUA hal, dan urutannya penting

`astro build` dulu, baru `node scripts/build-sw-manifest.mjs`. Skrip kedua
menulis ulang daftar precache service worker dari artefak yang **baru saja**
dibangun. Membalik urutannya, atau menjalankan `astro build` saja, akan
mengirim `sw.js` dengan blok precache kosong — situsnya tetap hidup, tapi tidak
lagi benar-benar bisa dipakai offline, dan tidak ada yang terlihat salah.

### Kalau `npm install` gagal di esbuild

Di lingkungan bersandbox, postinstall `esbuild` tidak bisa men-`spawn` binernya
(`pid: 0`) dan install berhenti:

```bash
npm install --ignore-scripts
```

Aman di sini: postinstall esbuild hanya **memverifikasi** binernya, sedangkan
binernya sendiri datang dari paket platform `@esbuild/win32-x64`, yang tetap
terpasang. Di mesin biasa tanpa sandbox, `npm install` biasa seharusnya cukup.

### `npm run lint` sengaja belum dijadikan gerbang

`biome check .` melaporkan sejumlah diagnostik a11y (`useButtonType`,
`noSvgWithoutTitle`) pada komponen yang belum disentuh. Repo ini melaporkan utang
itu apa adanya alih-alih menyembunyikannya. Dua pilihan, keduanya pekerjaan yang
belum diambil: beresi diagnostiknya sampai `npm run lint` benar-benar hijau, atau
pasang ratchet per-berkas seperti yang dipakai repo asalnya. Yang **jangan**
dilakukan: menghapus script-nya supaya terlihat hijau.

---

## Teknologi

| | |
|---|---|
| Framework | Astro 5.12 (`output: static`), satu island Preact per bagian interaktif |
| UI | Preact 10 + Tailwind CSS 4 (lewat plugin Vite, bukan integrasi Astro) |
| State | Nanostores (`@nanostores/persistent` untuk tema dan bahasa) |
| Font | Inter (UI) + Instrument Serif (judul display), di-host sendiri lewat `@fontsource` |
| PWA | `manifest.webmanifest` + service worker dengan daftar precache yang dihasilkan saat build |
| Form | Netlify Forms (tanpa Functions) |

Tidak ada backend, tidak ada database, tidak ada SSR. `@astrojs/netlify` sengaja
**tidak** dipakai: situs ini tidak punya Functions dan tidak punya permukaan SSR,
jadi adapter itu hanya jadi dependensi yang tidak membeli apa pun.

---

## Struktur

```
src/
  pages/index.astro          halaman profil perusahaan — satu-satunya rute
  pages/404.astro            halaman tidak-ditemukan
  layouts/BaseLayout.astro   <head>, tema, i18n, service worker, JSON-LD, hreflang
  components/App.tsx         hero, header, dan drawer navigasi (island)
  components/public/*        seksi-seksi halaman (galeri, mitra, FAQ, kontak, …)
  components/ui/*            Icon, Button, dan primitif bersama
  lib/companyProfile.ts      DATA perusahaan — sumber kebenaran untuk teks
  lib/{gallery,partners,faq,testimonials,siteMeta}.ts
  store/i18n.ts, i18n-jp.ts  kamus Indonesia + Jepang
  styles/*.css               global, theme, layout, motion
public/
  assets/                    foto fasilitas & galeri, ilustrasi, logo mitra
  icons/                     favicon, ikon PWA, lambang ASJ, sprite
docs/
  COMPANY_PROFILE_DATA.md    data resmi perusahaan + aturan §11.2
  ILLUSTRATION_SPEC.md       spek ukuran & isi ilustrasi
  DEPLOY_NETLIFY.md          panduan deploy, langkah demi langkah
netlify.toml                 konfigurasi build + header cache
scripts/
  build/strip-html-comments.mjs   pangkas komentar HTML dari build produksi
  build-sw-manifest.mjs           tulis ulang precache service worker
  ci/verify-assets.mjs            gate §11.2
```

---

## Data perusahaan — satu sumber kebenaran

Semua teks faktual tentang perusahaan berasal dari
`docs/COMPANY_PROFILE_DATA.md` dan masuk ke halaman lewat
`src/lib/companyProfile.ts`. **Jangan menulis angka perusahaan langsung di
markup.**

Yang khusus: **tidak ada angka yang boleh dikarang.** Halaman ini tidak memuat
jumlah kandidat, jumlah keberangkatan, atau jumlah mitra yang tidak tercatat di
dokumen resmi — angka yang dikarang di halaman perusahaan adalah klaim hukum,
bukan dekorasi. Tiga angka di hero (tahun pendirian, jumlah bidang penempatan,
jumlah prefektur tujuan) ada karena ketiganya tercatat di dokumen.

---

## 🔴 Aturan foto — §11.2

Repo ini **publik**, dan `public/assets/` memuat foto yang menampilkan wajah yang
bisa dikenali. Aturan di `docs/COMPANY_PROFILE_DATA.md` §11.2: foto seperti itu
**tidak boleh** masuk repo, karena publikasi lewat repo tidak bisa ditarik
kembali.

`.gitignore` menyebut **satu per satu** nama berkas yang dilarang — bukan satu
pola direktori, karena `!` di bawah pola direktori adalah jaminan palsu: git
tidak bisa me-*re-include* berkas bila direktori induknya sudah di-*exclude*.
Ini sudah dibuktikan, bukan diasumsikan.

Konsekuensinya disengaja: berkas baru di `public/assets/` **tidak pernah**
otomatis ter-commit. Menambahkannya harus keputusan sadar, dan setiap penambahan
harus lewat gate:

```bash
npm run verify:assets
```

Gate itu memerahkan build bila daftar ignore, isi folder, dan yang benar-benar
dirender `src/lib/gallery.ts` tidak lagi sinkron. Jalankan sebelum commit apa pun
yang menyentuh `public/assets/`.

---

## Formulir kontak

`src/components/public/ContactForm.tsx` mengirim ke **Netlify Forms**: POST
url-encoded ke `/` dengan field `form-name`, tanpa Functions. `<form>` membawa
`data-netlify="true"` dan `netlify-honeypot="perusahaan"`.

Dua hal yang mudah dirusak tanpa sadar:

- **Form ini harus tetap ter-SSR.** Netlify mendeteksi form dengan memindai HTML
  yang di-deploy dan **tidak** menjalankan JavaScript. Island-nya dipasang dengan
  `client:visible`, yang tetap di-SSR Astro — jadi markup-nya benar-benar ada di
  `dist/index.html`. Mengubahnya ke `client:only` akan mengirim form yang tidak
  pernah dilihat Netlify, dan setiap kiriman hilang dengan status 200.
- **Validasi di sisi klien itu sopan-santun, bukan pengamanan.** Tidak ada server
  yang memaksa batas panjang atau rate limit di repo ini. Yang tersisa: penyaring
  spam Netlify + honeypot.

Cara mengaktifkan notifikasi email dan melihat kiriman ada di
[`docs/DEPLOY_NETLIFY.md`](docs/DEPLOY_NETLIFY.md) §6.

---

## Deploy

Netlify, dan seluruh konfigurasinya ada di `netlify.toml` — bukan di dashboard.
Kalau dashboard menampilkan nilai yang berbeda, berkasnya yang benar.

Satu hal di situ bukan pilihan gaya: `/assets/*` dan `/icons/*` memakai
`max-age=0`, sementara `/_astro/*` memakai `immutable`. Aset di `/_astro/` ber-hash
di namanya sehingga aman di-cache selamanya; yang di `/assets/` tidak. Dan
`max-age=0` di sana adalah **syarat** agar service worker tetap benar, bukan
kehati-hatian: handler-nya melayani aset statis dengan pola
stale-while-revalidate lewat `fetch()`, dan panggilan itu ikut melewati HTTP
cache — jadi `max-age` panjang akan membuat separuh "revalidate"-nya
mengembalikan salinan basi dari cache browser sendiri.

Langkah lengkapnya: [`docs/DEPLOY_NETLIFY.md`](docs/DEPLOY_NETLIFY.md).

---

## Lisensi & kontak

Kode di repo ini milik PT Amanah Sakura Japan. Foto dan logo perusahaan tidak
dilisensikan untuk dipakai ulang.

- Situs: belum di-deploy
- Email: lihat `CONTACT_EMAIL` di `src/lib/companyProfile.ts`
