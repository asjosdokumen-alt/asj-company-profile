# Deploy ke Netlify — panduan langkah demi langkah

Ditulis 2026-09-30, saat repo ini disiapkan untuk deploy pertamanya.

**Kenapa akun baru.** Portal asal (`asjastro.netlify.app`) beku sejak 2026-09-24
karena kredit akun Netlify-nya habis — setiap deploy setelah itu di-skip. Situs
ini tidak mewarisi masalah itu, tapi juga tidak bisa menumpang akun yang sama.
Karena itu alamat email baru, dan karena itu pula dokumen ini ditulis dari nol.

---

## 0. Yang sudah selesai, dan tidak perlu diulang

| Sudah ada | Di mana |
|---|---|
| Perintah build + folder publish | `netlify.toml` (di root) |
| Versi Node dipatok ke 22 | `netlify.toml`, sama dengan `.nvmrc` |
| Header cache untuk `sw.js`, `/_astro/*`, `/assets/*`, `/icons/*` | `netlify.toml` |
| Form kontak terhubung ke Netlify Forms | `src/components/public/ContactForm.tsx` |

`netlify.toml` membuat seluruh konfigurasi build ikut ter-commit. Artinya di
dashboard Netlify nanti **tidak ada yang perlu diisi manual** — Netlify membaca
berkas itu. Kalau dashboard menampilkan nilai yang berbeda, dashboard-nya yang
salah.

---

## 1. Repo GitHub

Repo sudah dibuat: **`asjosdokumen-alt/asj-company-profile`**, publik, branch
default `main`.

Publik itu keputusan sadar, dan gate-nya sudah dijalankan sebelum push:
`npm run verify:assets` **PASS** — 18 berkas berwajah yang dilarang §11.2
terblokir dari git, dan tidak ada satu pun yang bocor ke tracked files (diperiksa
dengan membandingkan `git ls-files` terhadap `git check-ignore`, bukan
diasumsikan).

```bash
git push origin main
```

---

## 2. Buat akun Netlify dengan email baru

1. Buka <https://app.netlify.com/signup>, daftar dengan **alamat email baru**.
2. Pilih **Sign up with email** (bukan GitHub) kalau ingin akunnya benar-benar
   terpisah dari identitas GitHub — kalau memakai GitHub, akun Netlify-nya
   menempel pada akun GitHub yang sama dan tidak benar-benar independen.
3. Verifikasi emailnya, lalu login.

> **Kuota.** Paket gratis Netlify memberi kuota baru per akun: 100 GB bandwidth
> dan 300 menit build per bulan. Ini bukan "kredit tambahan" — ia mulai dari nol
> karena akunnya baru. Kalau akun lama masih menyimpan situs, situs itu tidak
> ikut pindah dan tetap beku; matikan saja supaya tidak membingungkan.

---

## 3. Hubungkan repo ke Netlify

1. **Add new site → Import an existing project**.
2. Pilih **GitHub**, izinkan Netlify membaca repo. Repo publik tetap butuh izin
   GitHub App ini sekali; tanpa itu Netlify tidak bisa memasang webhook.
3. Pilih `asj-company-profile`.
4. Di layar pengaturan build, **biarkan semua apa adanya**. Netlify akan
   menampilkan `npm run build` dan `dist` karena membaca `netlify.toml`. Kalau
   kolomnya kosong, isi manual persis seperti itu.
5. **Deploy site**.

Deploy pertama akan gagal atau berhasil dengan peringatan Supabase — itu normal,
lihat bagian 5.

---

## 4. Set `PUBLIC_SITE_URL` — setelah deploy pertama, bukan sebelumnya

Ini urutan yang tidak bisa dibalik, dan alasannya nyata.

`src/lib/siteMeta.ts` membaca `PUBLIC_SITE_URL` **saat build**. Kalau kosong, ia
sengaja tidak mengeluarkan canonical, hreflang, maupun JSON-LD sama sekali —
karena canonical yang menunjuk origin yang salah lebih buruk daripada tidak ada
canonical: ia menyuruh mesin pencari mengindeks URL yang tidak menyajikan halaman
ini.

Masalahnya: URL `*.netlify.app` baru diketahui **setelah** deploy pertama. Jadi:

1. Setelah deploy pertama, salin URL-nya (mis. `https://asj-company-profile.netlify.app`).
2. **Site configuration → Environment variables → Add a variable**:
   - Key: `PUBLIC_SITE_URL`
   - Value: origin-nya saja, tanpa trailing slash — `https://asj-company-profile.netlify.app`
   - Scopes: centang **Builds** (wajib) — kalau hanya Runtime dicentang, build
     tidak akan melihatnya dan canonical-nya tetap kosong.
3. **Deploys → Trigger deploy → Clear cache and deploy site.**

Verifikasi setelah selesai:

```bash
curl -s https://<situs-anda>.netlify.app/ | grep -o '<link rel="canonical"[^>]*>'
```

Harus keluar satu baris. Kalau tidak keluar apa pun, variabelnya tidak terbaca
saat build.

> Kalau nanti ada domain sendiri, ubah `PUBLIC_SITE_URL` ke domain itu dan
> deploy ulang. Jangan menebak host dari ingatan — origin portal ini sudah
> berpindah dua kali.

---

## 5. Peringatan Supabase saat build — aman, tapi ketahui isinya

Build akan mencetak:

```
[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in environment.
Auth features will be disabled. Copy .env.example to .env and fill in values.
```

Ini **tidak** menggagalkan build, dan halaman profil tetap dirender sepenuhnya.
Klien Supabase masih ikut terbawa dari portal dan masih menginisialisasi dirinya;
menghapusnya adalah pekerjaan tahap berikutnya (tercatat di README, "Yang MASIH
terbawa"). **Jangan** mengisi variabel itu untuk situs ini — tidak ada fitur auth
di sini yang membutuhkannya, dan mengisi kredensial berarti menghidupkan kembali
permukaan yang justru sedang dirampingkan.

---

## 6. Form kontak — aktifkan notifikasi email

Formnya sudah terpasang. Netlify mendeteksinya dari HTML yang di-deploy (bot-nya
**tidak** menjalankan JavaScript, dan itu sebabnya form ini di-SSR — lihat catatan
di `ContactForm.tsx`). Yang belum ada: pemberitahuan bahwa ada yang mengirim.

1. **Site configuration → Forms → Form notifications**.
2. **Add notification → Email notification**.
3. Kirim ke alamat email yang benar-benar dibaca — **bukan** email pendaftaran
   Netlify kalau email itu jarang dibuka.
4. Simpan, lalu kirim satu pesan percobaan dari situs yang sudah live.

**Di mana kirimannya bisa dilihat:** **Site → Forms → `kontak`**. Ada dua tab:
*Verified submissions* dan *Spam submissions*. Honeypot bekerja dengan mengisi
field `perusahaan`; bot yang mengisinya masuk ke tab Spam, bukan dibuang.

**Batas kuota:** paket gratis menampung **100 kiriman per bulan**; lewat dari itu
Netlify menolaknya. Kalau volume mendekati angka itu, form ini perlu backend
sungguhan — bukan masalah yang perlu dipecahkan sekarang.

### Yang hilang, dan sebaiknya diketahui sekarang

Server lama (`netlify/functions/contexts/contact/service.ts` di repo portal)
memaksa validasi, batas panjang, **dan rate limit per nomor**. Server itu tidak
ada di repo ini, jadi ketiganya hilang. Yang tersisa: penyaring spam Netlify +
honeypot, dan validasi di `submit()` yang murni sopan-santun ke pengunjung —
siapa pun bisa POST langsung ke `/` dengan isi apa pun.

Untuk formulir kontak perusahaan kecil, ini pertukaran yang wajar. Yang tidak
boleh terjadi adalah membacanya sebagai pengamanan. Kalau nanti spam benar-benar
masuk, urutan penanganannya: filter Netlify → tambah field wajib → baru backend.

---

## 7. Verifikasi setelah deploy

```bash
SITE=https://<situs-anda>.netlify.app

# 1. Halaman hidup
curl -s -o /dev/null -w '%{http_code}\n' $SITE/          # 200

# 2. Form terdeteksi Netlify (harus ada ketiganya)
curl -s $SITE/ | grep -o 'data-netlify="true"\|netlify-honeypot="perusahaan"\|name="form-name"'

# 3. Header cache service worker (harus max-age=0)
curl -sI $SITE/sw.js | grep -i cache-control

# 4. Aset ber-hash (harus immutable)
curl -sI $SITE/_astro/index.CuzFoBn5.css | grep -i cache-control

# 5. 404 memakai halaman sendiri, bukan 404 Netlify
curl -s -o /dev/null -w '%{http_code}\n' $SITE/halaman-yang-tidak-ada   # 404
```

Nomor 3 dan 4 adalah dua yang paling mudah salah, dan keduanya gagal dengan cara
yang tidak terlihat: `sw.js` yang ter-cache membuat pengunjung lama tertahan di
versi lama tanpa cara keluar selain hard-reload; aset ber-hash yang tidak
`immutable` hanya membuat situs lebih lambat dari seharusnya.

---

## 8. Setelah live

- **Nama situs.** Dashboard menamai situs baru dengan nama acak. Ubah lewat
  **Site configuration → Site details → Change site name** — lakukan **sebelum**
  mengatur `PUBLIC_SITE_URL`, supaya tidak perlu dua kali deploy.
- **Portal lama.** Kalau `asjastro.netlify.app` masih ada di akun lama, ia tidak
  otomatis mati. Kedua situs akan bersaing di hasil pencarian untuk kata kunci
  yang sama. Matikan salah satu, atau beri canonical yang jelas — jangan
  dibiarkan keduanya hidup tanpa keputusan.
