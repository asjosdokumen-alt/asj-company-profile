/**
 * i18n.ts - Language toggle store (123 keys)
 */
import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/preact';

export type Lang = "id" | "jp";

export const langStore = persistentAtom<Lang>("asj_lang", "id", {
  encode: JSON.stringify,
  decode: (v: string): Lang => {
    try {
      const p = JSON.parse(v);
      return p === "id" || p === "jp" ? p : "id";
    } catch {
      return "id";
    }
  },
});

// P9 fix: jp translations lazy-loaded from separate chunk (~670 lines, ~20KB).
// Only loaded when user switches to Japanese, cutting initial bundle by ~50%.
// P9b: dict install is async while renders are sync — without a notify after the
// chunk arrives, the first JP switch renders Indonesian fallbacks and stays stuck
// until an unrelated re-render. jpReady bumps subscribers once the dict is in.
export const jpReady = atom(false);
let _jpTranslations: Record<string, string> | null = null;
async function loadJp(): Promise<Record<string, string>> {
  if (_jpTranslations) return _jpTranslations;
  const mod = await import('./i18n-jp');
  _jpTranslations = mod.jpTranslations;
  translations.jp = _jpTranslations;
  return _jpTranslations;
}

/** Ensure the JP dict is loaded AND installed before a JP render reads it. */
export async function ensureJpLoaded(): Promise<void> {
  if (Object.keys(translations.jp).length > 0) return;
  await loadJp();
}

export const translations: Record<Lang, Record<string, string>> = {
  id: {
    // ─── PRUNED 2026-09-30 ───────────────────────────────────────────────
    // 1745 -> 295 keys. This dictionary carried the whole portal: every
    // string for /admin, /candidate, /apply, /ai-cv, /siswa-baru, the forms and
    // the tables. Those routes are not built here, so the keys were weight with
    // no reader — 178 KB raw across both dictionaries, about half the page.
    //
    // WHAT IS KEPT: keys referenced by a quoted literal anywhere under src/,
    // which covers t(…), data-lang attributes and `labelKey`/`.key` values in
    // data objects. Re-derive with .tmp-i18n-prune.mjs (the `i18n-dict-prune`
    // skill) after removing a section; do not hand-delete keys, because a key
    // that t() cannot resolve is rendered VERBATIM to the visitor.
    //
    // Japanese lives in i18n-jp.ts and is pruned to the SAME key set — a key in
    // one dictionary and not the other renders Indonesian to a JP reader.
    "ui.install_app": "Install App",
    "ui.menu": "Menu",
    "ui.close": "Tutup",
    "ui.language": "Bahasa",
    // `ui.loader_title`, `ui.loader_msg` and `ui.force_close_loading` were here.
    // Removed 2026-09-30 with `#global-loader` itself — the element carried an
    // inline `display: none !important` and nothing in src/ ever showed it, so
    // these three strings were being translated for a screen no visitor could
    // reach. See the note where that markup used to sit in BaseLayout.astro.
    "ui.skip_to_content": "Lewati ke konten utama",

    // Guard ekstensi pemberkasan (#10 parity legacy cekEkstensiFile) — teks
    // persis legacy (`i18n/locales/id/ui.js`).
    "landing.class_badge": "Dibuka Kelas Baru",
    "landing.class_title": "Penerimaan Siswa Angkatan K",
    "landing.class_subtitle": "Mulai Bulan Oktober 2026",
    "landing.class_desc": "Wujudkan mimpimu berkarir di Jepang lewat jalur resmi. Tersedia program Tokutei Ginou (SSW) dan Magang (SO Swasta) dengan kuota eksklusif terbatas 25-30 anak per angkatan agar belajar lebih fokus.",
    "landing.class_dana_title": "Tersedia Dana Talang",
    "landing.class_dana_desc": "Biaya keberangkatan bisa ditalangi TANPA BUNGA / RIBA. Cukup jaminan sertifikat/dokumen yang aman & bisa dicek kapan saja di LPK. Uang kembali full jika ada pembatalan sepihak dari Kaisha Jepang (kecuali MCU).",
    "landing.class_fee_title": "Rincian Biaya",
    "landing.class_fac_title": "Fasilitas Asrama Gratis",
    "landing.class_btn_wa": "Grup WA",
    "landing.class_btn_form": "Form Daftar Siswa",
    "landing.visa_title": "Pengurusan Visa",
    "landing.visa_subtitle": "Tokutei Ginou & Magang",
    "landing.visa_desc": "Menerima pembuatan dokumen dan Visa Jepang (TG & Magang). Melayani proses pemberkasan untuk kandidat di area/domisili Surabaya, Jakarta, dan Medan.",
    "landing.visa_btn": "Konsultasi Visa",
    "landing.exam_title": "Pendaftaran Ujian",
    "landing.exam_subtitle": "JFT Basic & SSW Prometric",
    "landing.exam_desc": "Solusi cepat dapat jadwal ujian! Kami bantu pendaftaran resmi akun Prometric Anda untuk seluruh titik lokasi di Indonesia (Bandung, Jakarta, Surabaya, Bali, dll).",
    "landing.exam_btn": "Booking Jadwal Ujian",
    "landing.maps_title": "Kunjungi LPK Amanah Sakura Japan",
  "landing.class_fac_kasur": "Kasur",
  "landing.class_fac_wifi": "WiFi",
  "landing.class_fac_dapur": "Dapur",
  "landing.class_fac_cuci": "Cuci",
  "landing.class_fac_motor": "Motor",
  "landing.class_fac_or": "OR",
  "landing.class_fac_note": "Hanya Biaya Asrama Rp 50.000/Bulan",
  "landing.visa_list_1": "Proses Cepat & Terpercaya",
  "landing.visa_list_2": "Legal & Resmi sesuai Prosedur",
  "landing.visa_list_3": "Pendampingan Penuh sampai Berangkat",
  "landing.exam_list_1": "Jadwal fleksibel",
  "landing.exam_list_2": "Lokasi seluruh Indonesia",
  "landing.exam_list_3": "Bimbingan persiapan ujian",

  // ── Profil perusahaan: hero + pita CTA (landing page L2) ──────────────
  // Namespace `profile` is declared in the NS list of i18n.keys.test.ts, so every
  // key below is validated against BOTH dictionaries. Values are either the
  // verbatim company-profile text or a proposed headline; the ones that are
  // proposals are the only strings on this page an editor may rewrite freely.
  "profile.hero_eyebrow": "PT AMANAH SAKURA JAPAN",

  // Verbatim from the company profile (cover and letterhead). Not a proposal.
  "profile.hero_tagline": "LET'S BUILD OUR FUTURE",
  "profile.hero_title": "Karier ke Jepang, dimulai dari sini.",
  "profile.hero_sub": "LPK pelatihan bahasa & budaya kerja Jepang di Ponorogo. Program, lowongan, dan pendampingan sampai siap berangkat — keberangkatan dijalankan bersama mitra LPK dan PT (SO).",
  "profile.hero_cta_secondary": "Daftar sebagai Pelamar",
  "profile.hero_chip_ssw": "SSW",
  "profile.hero_chip_magang": "Magang",
  "profile.hero_chip_penempatan": "Penempatan",

  // The three hero stats are the ones the company profile actually proves:
  // founded 2023 (deed 15 Aug 2023), five placement sectors and four destination
  // prefectures (pages 3, 13 and 14). The counts a mockup showed — 500+
  // candidates, 200+ departures, 50+ partners — are NOT in the document and are
  // deliberately absent; see docs/COMPANY_PROFILE_DATA.md §13.
  "profile.stat_since": "Berdiri sejak",
  "profile.stat_sectors": "Bidang penempatan",
  "profile.stat_prefectures": "Prefektur di Jepang",
  "profile.cta_title": "Siap memulai perjalanan ke Jepang?",
  // DIUBAH 2026-09-30. Bunyi sebelumnya: "Lihat lowongan yang tersedia atau
  // daftar sebagai pelamar hari ini." Kalimat itu menyuruh pembaca MELIHAT
  // LOWONGAN, sementara tombol di bawahnya tidak lagi menuju daftar lowongan —
  // tombolnya sekarang `#kontak`, karena `/loker` bukan rute yang dibangun repo
  // ini. Teks yang menjanjikan tujuan yang tidak ada lebih buruk daripada teks
  // yang lebih sederhana, jadi salinannya sekarang menyebut apa yang benar-benar
  // terjadi saat tombolnya ditekan.
  "profile.cta_sub": "Sampaikan pertanyaan atau minat Anda — tim kami akan menjelaskan program, biaya, dan alur pendaftarannya.",
  "profile.cta_secondary": "Daftar Pelamar",

  // ── Profil perusahaan: section (landing page L3) ──────────────────────
  // Values MUST match the `text` fallback in src/lib/companyProfile.ts verbatim.
  // A mismatch is not a gate failure — it is a visible swap, because
  // translateDataLang() overwrites the server-rendered literal once the language
  // store is read. The two files are the same content in two shapes.
  //
  // `profile.layanan_title` belongs to the `#layanan` section (index.astro:156),
  // which no longer has a tab panel — it is a plain Section whose heading falls
  // back to "Program & Layanan ASJ". MISSING SINCE e9317cf: the key was written
  // at the call site and never added here. The fallback text is the source of the
  // value, so the translated string and the no-JS literal cannot drift apart.
  "profile.layanan_title": "Program & Layanan ASJ",
  "profile.why_title": "Kenapa Jepang?",
  "profile.why_desc": "Tiga alasan yang paling sering disebut kandidat.",
  "profile.why_wage_title": "Gaji",
  "profile.why_wage_body": "Upah minimum 15–25 juta per bulan, berbanding lurus dengan biaya hidup dibanding Indonesia.",
  "profile.why_exp_title": "Pengalaman dan tantangan baru",
  "profile.why_exp_body": "Gaya hidup, budaya, dan kedisiplinan yang berbeda dari Indonesia.",
  "profile.why_season_title": "Kehidupan empat musim",
  "profile.why_season_body": "Musim semi, panas, gugur, dan dingin — Indonesia hanya punya dua.",
  "profile.why_tip": "Tekanan kerja di Jepang lebih besar: pilih pekerjaan sesuai kemampuan yang paling dikuasai, dan galilah bahasa Jepang sedalam mungkin.",
  "profile.prog_title": "Program ASJ",
  "profile.prog_desc": "Dua jalur resmi ke Jepang, plus pelatihan bahasanya.",
  "profile.prog_magang_title": "Magang",
  "profile.prog_magang_body": "Pendampingan dari pendaftaran sampai keberangkatan.",
  "profile.prog_tg_title": "Tokutei Ginou",
  "profile.prog_tg_body": "Perawat Lansia (Kaigo), Pengolahan Makanan, Restoran, Pertanian, Peternakan.",
  "profile.prog_bahasa_title": "Bahasa Jepang",
  "profile.prog_bahasa_body": "Pelatihan bahasa, keterampilan, dan pengenalan budaya Jepang.",
  "profile.prog_price_label": "Biaya program",
  "profile.prog_payment": "Bisa dicicil, dan tersedia dana talang untuk biaya keberangkatan.",
  "profile.prog_includes_title": "Sudah termasuk",
  "profile.prog_inc_module": "Modul Pembelajaran & Kamus",
  "profile.prog_inc_uniform": "Seragam Lembaga",
  "profile.prog_inc_dorm": "Asrama",
  "profile.prog_inc_exam": "Ujian JFT & SSW masing-masing 1 kali",
  "profile.step_title": "Bagaimana Prosesnya?",
  "profile.step_desc": "Enam langkah dari pendaftaran sampai berangkat.",
  "profile.step_reg_title": "Registration",
  "profile.step_reg_body": "Pemeriksaan kesehatan, dokumen, dan mengisi form pendaftaran.",
  "profile.step_train_title": "Training & Education",
  "profile.step_train_body": "Pelatihan bahasa Jepang, keterampilan, dan pengenalan budaya Jepang.",
  "profile.step_interview_title": "Interview",
  "profile.step_interview_body": "Wawancara kerja dengan perusahaan Jepang.",
  "profile.step_doc_title": "Employment Document",
  "profile.step_doc_body": "Kepengurusan berkas di Indonesia.",
  "profile.step_prep_title": "Document Preparing",
  "profile.step_prep_body": "Pemeriksaan kesehatan (MCU) dan tanda tangan kontrak kerja, lalu kepengurusan berkas imigrasi Jepang (COE).",
  "profile.step_go_title": "GO TO JAPAN",
  "profile.step_go_body": "Pengurusan paspor, visa, dan EKTLN di Indonesia.",
  "profile.req_title": "Persyaratan & Dokumen",
  "profile.req_desc": "Pastikan semuanya siap sebelum mendaftar.",
  "profile.req_age": "Pria/wanita, umur 18–28 tahun",
  "profile.req_edu": "Pendidikan minimal SMA/SMK sederajat",
  "profile.req_marital": "Belum atau sudah menikah",
  "profile.req_body": "Tinggi badan minimal pria 160 cm, berat badan 50 kg",
  "profile.req_health": "Sehat jasmani dan rohani",
  "profile.req_tattoo": "Tidak bertato dan bertindik",
  "profile.req_vision": "Tidak buta warna dan bebas TBC",
  "profile.req_docs_title": "Berkas yang disiapkan",
  "profile.doc_form": "Mengisi form yang sudah disediakan",
  "profile.doc_consent": "Surat izin orang tua",
  "profile.doc_ktp": "Scan/foto copy KTP",
  "profile.doc_birth": "Scan/foto copy akta lahir",
  "profile.doc_kk": "Scan/foto copy Kartu Keluarga",
  "profile.doc_diploma": "Scan/foto copy ijazah (SD/MI, SMP/MTS, SMA/SMK)",
  "profile.doc_photo": "Pas foto 3×4 sebanyak 2 lembar",
  "profile.vision_title": "Visi & Misi",
  "profile.vision_heading": "Visi",
  "profile.vision_body": "Menjadikan PT AMANAH SAKURA JAPAN sebagai lembaga pendidikan yang profesional dan berkualitas yang dapat menghasilkan sumber daya manusia yang mampu berkompetisi di era global serta mampu menjawab tantangan sesuai dengan perkembangan ilmu pengetahuan dan teknologi melalui pengembangan pembelajaran Bahasa asing.",
  "profile.mission_heading": "Misi",
  "profile.mission_1": "Menyelenggarakan program pendidikan dan pelatihan bahasa Jepang secara profesional",
  "profile.mission_2": "Mencetak sumber daya manusia yang terampil dan profesional",
  "profile.mission_3": "Membangun kerja sama dengan dunia usaha dan industri di dalam dan luar negeri",
  "profile.mission_4": "Membuka peluang bekerja di luar negeri agar terciptanya lapangan pekerjaan",
  "profile.legal_title": "Legalitas & Izin Resmi",
  "profile.legal_desc": "Badan hukum dan nomor pendaftaran yang bisa diperiksa.",
  "profile.legal_form": "Badan hukum",
  "profile.legal_sk": "SK Kemenkumham",
  "profile.legal_deed": "Akta Notaris",
  "profile.legal_regno": "Nomor pendaftaran",
  "profile.legal_register": "Daftar Perseroan",
  "profile.legal_seat": "Kedudukan",

  // The LEGAL_FACTS values that are not identifiers — see the note on
  // LEGAL_FACTS in companyProfile.ts for why exactly these three and not the
  // other three. A legal description, a date with a month name, and a place.
  "profile.legal_form_value": "Perseroan Terbatas (PT), Swasta Nasional",
  "profile.legal_deed_value": "Nomor 09, 15 Agustus 2023 — Notaris Setya Budhi, S.H.",
  "profile.legal_seat_value": "Kabupaten Ponorogo, Jawa Timur",
  "profile.contact_located_value": "Kabupaten Ponorogo, Jawa Timur",

  // Alamat jalan. Nilai `id` di sini adalah ALAMAT RESMI (yang ditulis di amplop);
  // versi JP di kamus jp hanyalah bantuan baca. Lihat komentar CONTACT_ADDRESS
  // di companyProfile.ts — alamat adalah NAME, bukan identifier, jadi ia ikut
  // diterjemahkan; sedangkan email dan nomor telepon tidak.
  "profile.contact_address_value": "Jl. Kyai Ageng Musakaf, Rw 03 Rt 03, Dukuh Ngujung, Desa Gandu Kepuh, Kec. Sukorejo, Kab. Ponorogo, Jawa Timur",

  // Jam operasional — dijawab pemilik 2026-09-30 (COMPANY_PROFILE_DATA.md P-4).
  // Dua kunci terpisah: yang satu JAM BUKA, yang lain apa yang terjadi DI LUAR
  // jam itu. Digabung jadi satu kalimat akan mengubur "slow respon", padahal
  // itulah yang perlu dipahami penelepon SEBELUM ia menelepon.
  "profile.contact_hours": "Jam Operasional",
  "profile.contact_hours_value": "Senin – Sabtu, 08.00 – 16.00 WIB",
  "profile.contact_hours_note": "Tanggal merah / hari libur, dan di luar jam kerja: respons lebih lambat.",
  "profile.fac_title": "Fasilitas & Dukungan",
  "profile.fac_desc": "Yang kandidat dapatkan selama pelatihan.",
  "profile.fac_class_title": "Kelas Bahasa Jepang",
  "profile.fac_class_body": "Kelas tatap muka dengan pengajar bersertifikat JLPT N1.",
  "profile.fac_office_title": "Ruang Kantor",
  "profile.fac_office_body": "Kantor operasional di Ponorogo, Jawa Timur.",
  "profile.fac_guest_title": "Ruang Tamu",
  "profile.fac_guest_body": "Ruang penerimaan untuk wali dan calon peserta.",
  "profile.fac_dorm_title": "Asrama",
  "profile.fac_dorm_body": "Kasur, WiFi, dapur, tempat cuci, dan kendaraan operasional.",
  "profile.fac_uniform_title": "Seragam & Modul",
  "profile.fac_uniform_body": "Seragam lembaga serta modul pembelajaran dan kamus.",
  "profile.fac_exam_title": "Ujian JFT & SSW",
  "profile.fac_exam_body": "Masing-masing satu kali ujian, termasuk dalam biaya program.",
  "profile.place_food": "Pengolahan Makanan",
  "profile.place_farm": "Pertanian",
  "profile.place_livestock": "Peternakan",

  // The VALUES of the placement rows. These were hardcoded romanised strings
  // until 2026-09-27 — see the `Fact.value` note in companyProfile.ts. A
  // prefecture is a name, so it localises; the middle dot separates two
  // prefectures and is the same glyph in both languages.
  "profile.place_food_area": "Miyazaki · Okayama",
  "profile.place_farm_area": "Miyazaki · Nagano",
  "profile.place_livestock_area": "Kagoshima",

  // The price. `juta` is a word and the reader may not parse it, so only the
  // LABEL being translated (as it was) left the number unreadable.
  "profile.prog_price": "6 JUTA",

  // ── Penempatan Kami (R4, halaman 13 & 14) ─────────────────────────────
  // The mockup filled this slot with TESTIMONIALS. The company profile
  // contains none, so it shows what it DOES contain and can be checked:
  // four prefectures read off the dated interview banners. Replacing
  // invented quotes with provable evidence is the trade the spec asks for
  // (docs/LANDING_PAGE_SPEC.md §4).
  "profile.place_title": "Penempatan Kami",
  "profile.place_desc": "Bidang dan prefektur tujuan yang tercatat pada dokumen perusahaan.",
  "profile.place_note": "Nama prefektur ditulis dalam huruf Latin, sesuai dokumen resmi.",

  // ── Mitra Kami (slot mitra MoU — model sponsor) ───────────────────────
  // Owner's request 2026-09-27. ASJ is a small LPK without SO status, so the
  // departure is executed by partner LPKs/PTs (SOs) under an MoU. This section
  // shows WHERE that authority lives, which is the honest answer to "then who
  // sends me?" — and the one place the network is visible to a prospective
  // partner.
  //
  // The names WERE slots; the owner supplied the six MoU partners 2026-09-29, so
  // each now has its own key. `profile.mitra_slot_pending` STAYS: it is the
  // rendering for a slot with no name yet, and a seventh partner would take it —
  // a key removed because nothing currently renders it is a key the next slot
  // has to reinvent.
  //
  // The Indonesian value is the partner's own LEGAL NAME, not a translation:
  // a company called "PT Flora Talent Indonesia" is that name in both languages.
  // The JP dictionary carries the same string for the same reason a proper noun
  // is not translated — see that file for the note.
  "profile.mitra_title": "Mitra Kami",
  "profile.mitra_desc": "Keberangkatan ke Jepang dijalankan bersama mitra LPK dan PT (SO) berikut.",
  "profile.mitra_note": "Kami belum berstatus SO, sehingga keberangkatan peserta ke Jepang dilaksanakan oleh mitra LPK dan PT (SO) yang telah menandatangani MoU dengan kami.",
  "profile.mitra_kind_gloss": "Keterangan: badge di bawah nama adalah STATUS IZIN keberangkatan (SO = Sending Organization, berwenang memberangkatkan), bukan bentuk badan hukum. Nama mitra tetap memakai sebutan yang mereka pakai sendiri, sehingga ada mitra yang berbunyi \"LPK\" namun berizin SO.",
  "profile.mitra_cta_desc": "Ingin menjadi mitra penempatan (MoU) kami? Silakan hubungi kami melalui bagian Kontak di bawah.",
  "profile.mitra_slot_pending": "Slot belum diisi",
  "profile.mitra_1_name": "PT Flora Talent Indonesia",
  "profile.mitra_2_name": "PT Human Mandiri Indonesia",
  "profile.mitra_3_name": "LPK Japanesia",
  "profile.mitra_4_name": "PT JIPA",
  "profile.mitra_5_name": "LPK Jinzai Servis Indonesia",
  "profile.mitra_6_name": "PT Hibiki Cendekia Mandala",

  // ── Kata Alumni (testimonial model, added 2026-09-29) ──────────────────
  // The review QUOTES are not here yet — they arrive with the owner's real
  // reviews (see src/lib/testimonials.ts). These are the section's own labels.
  "profile.review_title": "Kata Alumni",
  "profile.review_desc": "Cerita peserta yang telah belajar dan berangkat bersama kami.",
  "profile.review_count_from": "dari",
  "profile.review_count_of": "ulasan di Google Maps",
  "profile.review_open_maps": "Lihat di Google Maps",
  "profile.review_cta_desc": "Sudah pernah belajar atau berangkat bersama kami? Bagikan cerita Anda melalui kontak di bawah.",
  "profile.review_slot_pending": "Review belum tayang",
  "profile.review_pending_author": "Menunggu review",

  // ── FAQ (#faq) — ADDED 2026-09-29 ─────────────────────────────────────
  // Every ANSWER below is transcribed from docs/COMPANY_PROFILE_DATA.md, the
  // company's own printed profile. See src/lib/faq.ts for the per-entry source.
  // ⚠ Do NOT add a question whose answer is not in that document — and in
  // particular do not add the minimum-height figure, which is still contradictory
  // between printed pages (§12 K-3) and is a selection criterion.
  "profile.faq_title": "Pertanyaan Umum",
  "profile.faq_desc": "Pertanyaan yang paling sering ditanyakan calon peserta, dijawab dari dokumen resmi lembaga.",
  "profile.faq_q_cost": "Berapa biaya programnya?",
  "profile.faq_a_cost": "Biaya program adalah 6 juta rupiah.",
  "profile.faq_q_includes": "Biaya 6 juta itu untuk apa saja?",
  "profile.faq_a_includes": "Mencakup empat hal: modul pembelajaran dan kamus, seragam lembaga, asrama, serta ujian JFT dan SSW masing-masing satu kali.",
  "profile.faq_q_installment": "Apakah biayanya bisa dicicil?",
  "profile.faq_a_installment": "Bisa. Pembayaran dapat dilakukan secara bertahap (dicicil).",
  "profile.faq_q_bridge": "Bagaimana kalau belum ada biaya keberangkatan?",
  "profile.faq_a_bridge": "Tersedia dana talang untuk membantu biaya keberangkatan.",
  "profile.faq_q_requirements": "Apa syarat untuk ikut program?",
  "profile.faq_a_requirements": "Usia 18–28 tahun, pendidikan minimal SMA/SMK sederajat, sehat jasmani dan rohani, serta tidak bertato dan tidak bertindik. Untuk tinggi badan minimum dan syarat lain, silakan hubungi kami karena ada ketentuan yang berbeda antar jalur program.",
  "profile.faq_q_process": "Berapa lama prosesnya, dan tahapannya apa saja?",
  "profile.faq_a_process": "Enam tahap: pendaftaran dan pemeriksaan dokumen, pelatihan bahasa dan budaya Jepang, wawancara kerja dengan perusahaan Jepang, pengurusan berkas di Indonesia, pemeriksaan kesehatan (MCU) dan tanda tangan kontrak beserta pengurusan COE, lalu keberangkatan ke Jepang.",

  // ── Lowongan Ringkas (R2, rail) — REMOVED 2026-09-24 ───────────────────
  // The `profile.mini_*` keys (`mini_title`, `mini_desc`, `mini_all`,
  // `mini_cta`) were deleted together with the `#loker-ringkas` section and its
  // `JobMiniList` primitive. Owner ruling: `/` is a company profile for
  // MoU/business partners, not a job board. Do not restore the keys without
  // restoring the section.
  // ── Tentang Kami (S7, halaman 2) ──────────────────────────────────────
  // The welcome is reproduced VERBATIM, spelling included. An official
  // statement is not ours to tidy; correcting it needs the owner's approval
  // (docs/COMPANY_PROFILE_DATA.md §3).
  "profile.about_title": "Tentang Kami",
  "profile.about_desc": "Lembaga pelatihan bahasa & budaya kerja Jepang di Ponorogo.",
  "profile.about_welcome": "Kami berkomitmen meningkatkan kemampuan sumber daya manusia untuk memperdayakan diri sendiri dan mampu menghadapi dunia kerja dan untuk meningkatkan keahlian.",
  "profile.about_p1": "PT Amanah Sakura Japan adalah LPK — Lembaga Pelatihan Kerja — yang berkedudukan di Kabupaten Ponorogo, Jawa Timur. Kami menyiapkan calon pekerja migran Indonesia lewat pelatihan bahasa Jepang, keterampilan kerja, dan pengenalan budaya Jepang, untuk jalur magang maupun Tokutei Ginou.",
  "profile.about_p2": "Kami adalah LPK kecil dan belum berstatus SO (Sending Organization), sehingga belum berwenang memberangkatkan peserta ke Jepang secara langsung. Keberangkatan dan penempatan di Jepang dijalankan bersama jaringan mitra LPK dan PT (SO) yang telah kami ikat dengan perjanjian kerja sama (MoU). Peran kami adalah menyiapkan pesertanya sampai siap — mulai dari pendaftaran, pelatihan bahasa, ujian JFT dan SSW, hingga seluruh berkas — lalu menyerahkannya ke mitra SO yang memberangkatkan. Setiap tahap punya pengajarnya sendiri, dan struktur organisasi kami bisa diperiksa di bagian Tim.",
  "profile.about_caption": "Peserta dan staf di kantor LPK Amanah Sakura Japan — Ponorogo, Jawa Timur",
  "profile.about_cta": "Tentang Program Kami",

  // A short, unmissable statement of what ASJ is and is not. The owner's ruling
  // (2026-09-27): the page must not imply ASJ sends workers to Japan directly.
  // ASJ is a small LPK WITHOUT SO status; the departure is executed by the MoU
  // partner SOs. Stated as its own line rather than buried in a paragraph,
  // because it is the single fact a prospective partner or candidate most needs
  // to read correctly, and a misreading here is the one that misleads.
  "profile.about_so_note": "Kami belum berstatus SO. Keberangkatan ke Jepang dijalankan bersama mitra LPK dan PT (SO) yang bekerja sama dengan kami melalui MoU.",
  "profile.about_so_note_label": "Status SO (Sending Organization)",

  // ── Sejarah (S9, `#tentang`) ──────────────────────────────────────────
  // ADDED because the brief for "Tentang Kami" asks for visi, misi, sejarah and
  // tim, and the page had three of the four. Each entry carries its document
  // reference, so a reader can verify the date rather than take it on faith.
  "profile.history_1_title": "15 Agustus 2023 — Pendirian",
  "profile.history_1_body": "PT Amanah Sakura Japan didirikan di Kabupaten Ponorogo berdasarkan Akta Notaris Nomor 09 tanggal 15 Agustus 2023, dibuat di hadapan Notaris Setya Budhi, S.H.",
  "profile.history_2_title": "28 Agustus 2023 — Pengesahan Badan Hukum",
  "profile.history_2_body": "Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia mengesahkan pendirian badan hukum perseroan melalui keputusan AHU-0063921.AH.01.01.TAHUN 2023, dengan nomor pendaftaran 4023082735107914.",
  "profile.history_3_title": "2023 — Pelatihan Berbasis Kompetensi",
  "profile.history_3_body": "Lembaga menyelenggarakan Program Pelatihan Berbasis Kompetensi dengan judul Pelatihan Bahasa Jepang, dan menyiapkan pengajar bersertifikat JLPT N1 untuk membimbing peserta hingga siap bekerja di Jepang.",

  // ── Galeri (R3) ───────────────────────────────────────────────────────
  // Captions only. The `alt` text for each photo lives in src/lib/gallery.ts,
  // because it describes one specific picture and cannot be a shared key — the
  // same reason a licence number is not translatable.
  "profile.gallery_title": "Galeri Kegiatan",
  "profile.gallery_desc": "Suasana pelatihan, kantor, dan keberangkatan peserta.",
  "profile.gal_gedung": "Kantor & peserta di Ponorogo",
  "profile.gal_staf": "Tim pengajar dan pengurus",
  "profile.gal_kelas": "Persiapan wawancara kerja",
  "profile.gal_tamu": "Penyerahan dokumen peserta",
  "profile.gal_siswa": "Angkatan peserta pelatihan",
  "profile.gal_berangkat": "Pelepasan keberangkatan",
  "profile.gal_n1": "Pengajar bersertifikat JLPT N1",
  "profile.gal_layanan": "Peserta dengan dokumen",

  // ── Tim & Kredensial (S10, halaman 8 dan 10) ─────────────────────────
  "profile.team_title": "Tim & Kredensial",
  "profile.team_desc": "Struktur organisasi dan kualifikasi pengajar kami.",
  "profile.team_komisaris": "Komisaris",
  "profile.team_direktur": "Direktur",
  "profile.team_edu_manager": "Education & Training Manager",
  "profile.team_admin": "Staf Administrasi",
  "profile.team_instructor": "Pengajar Bahasa Jepang",
  "profile.team_instructor_2": "Pengajar Bahasa Jepang",
  "profile.team_n1_note": "Pemegang JLPT N1, sertifikat N1A225127J",
  "profile.cred_title": "Kredensial pengajar",
  "profile.cred_jlpt_label": "Sertifikasi pengajar",
  "profile.team_name_pending": "Belum dipublikasikan",

  // ── Nama orang (dipakai sebagai KEY, bukan literal) ──────────────────
  // Aturan yang dipakai di repo ini: "an identifier is invariant; a NAME or a
  // QUANTITY is not." Nomor registrasi, alamat email dan nomor AHU WAJIB sama
  // di kedua bahasa karena itu kunci rujukan. NAMA ORANG justru sebaliknya:
  // perusahaan menerbitkan bentuk kana-nya sendiri, dan pembaca Jepang harus
  // mengenali nama itu di bagan struktur. Sebelum ini nama ditulis sebagai
  // literal di TEAM, sehingga halaman JP menampilkan enam ejaan Latin di
  // tengah seksi yang seluruhnya berbahasa Jepang.
  "profile.team_name_direktur": "Koirul Mustakim",
  "profile.team_name_komisaris": "Triya Sumaryati",
  "profile.team_name_edu_manager": "Hadi Prasojo",
  "profile.team_name_admin": "Ayok Wahyu Saputro",
  "profile.team_name_instructor": "Rian Hari Wijaya",
  "profile.team_name_instructor_2": "Wiwit T Syafitri",

  // ── Kontak & Lokasi (R1/R5, halaman 5, 8, 9) ─────────────────────────
  "profile.contact_title": "Informasi Kontak",
  "profile.contact_desc": "Silakan hubungi kami melalui telepon, surel, atau formulir.",
  "profile.contact_address": "Alamat",
  "profile.contact_phone": "Telepon",
  "profile.contact_email": "Surel",
  "profile.contact_located": "Lokasi",
  "profile.loc_title": "Lokasi Kami",
  "profile.loc_desc": "Kantor kami di Kabupaten Ponorogo, Jawa Timur.",
  "profile.loc_open_maps": "Buka di Google Maps",

  // ── Kode QR kanal kontak (#kontak) ───────────────────────────────────
  // Three tile labels plus the three link names. The labels are brand names —
  // identical in both languages — but they are keyed anyway so the coverage
  // gate (i18n.keys.test.ts) validates them and a future rename is one edit.
  // The `_aria` keys are the anchors' accessible names (data-lang-aria); the
  // <img> `alt` is a description of the specific code and, like every gallery
  // alt in this repo, is not a shared key.
  "profile.qr_whatsapp": "WhatsApp",
  "profile.qr_instagram": "Instagram",
  "profile.qr_tiktok": "TikTok",
  "profile.qr_whatsapp_aria": "Buka WhatsApp PT Amanah Sakura Japan",
  "profile.qr_instagram_aria": "Buka Instagram PT Amanah Sakura Japan",
  "profile.qr_tiktok_aria": "Buka TikTok PT Amanah Sakura Japan",

  // ── Formulir kontak (public, unauthenticated) ────────────────────────
  // Copy for the ONE unauthenticated write in the deployment. The tone is
  // deliberately formal-Indonesian throughout, matching the rest of the page.
  // `contact.privacy` states what happens to the number rather than asserting a
  // policy the company has not published — it says the reply comes via WhatsApp,
  // which is true and useful, and makes no claim about storage or sharing.
  "contact.title": "Kirim Pesan",
  "contact.desc": "Sampaikan pertanyaan Anda melalui formulir di bawah ini.",
  "contact.field_nama": "Nama Lengkap",
  "contact.field_wa": "Nomor WhatsApp",
  "contact.field_subjek": "Subjek",
  "contact.field_pesan": "Pesan",
  "contact.send": "Kirim Pesan",
  "contact.sending": "Mengirim...",
  "contact.sent_title": "Pesan Anda sudah kami terima.",

  // Kept on ONE line deliberately: the coverage gate (i18n.keys.test.ts) reads
  // `"key": "value"` pairs textually, and a value split across lines reads as a
  // key with no value — which is how this key was reported missing while the
  // other eleven in the same block passed. Do not prettier-wrap it.
  "contact.sent_body": "Tim kami akan menindaklanjuti melalui WhatsApp pada hari kerja. Jika Anda memerlukan jawaban lebih cepat, silakan menghubungi nomor yang tertera di samping.",
  "contact.failed": "Pesan gagal dikirim. Silakan coba lagi atau hubungi kami melalui WhatsApp.",

  // Validasi sisi klien — DITAMBAHKAN 2026-09-30 bersama perpindahan ke Netlify
  // Forms. Server yang dulu memiliki kedua pesan ini tidak ada di repo ini, jadi
  // formulirnya harus memproduksinya sendiri. Keduanya satu baris dengan alasan
  // yang sama seperti `contact.sent_body`: gate cakupan membaca `"key": "value"`
  // secara tekstual, sehingga nilai yang terlipat terbaca sebagai kunci tanpa nilai.
  "contact.err_required": "Mohon lengkapi kolom Nama, Nomor WhatsApp, Subjek, dan Pesan.",
  "contact.err_wa": "Nomor WhatsApp tidak valid. Contoh: 0812-3456-7890.",
  "contact.privacy": "Balasan dikirim melalui WhatsApp pada hari kerja.",

  // ── Navigasi section (drawer App.tsx) ─────────────────────────────────
  // DITAMBAHKAN 2026-09-30, menggantikan empat tautan mati ke rute yang tidak
  // dibangun repo ini (/loker, /candidate, /admin, /public).
  //
  // Sengaja PENDEK: ini label navigasi, bukan judul section. Memakai ulang
  // `profile.*_title` akan membuat drawer berisi kalimat utuh ("Kenapa Memilih
  // Jepang?") alih-alih menu, dan judul-judul itu memang sudah punya rumahnya
  // sendiri di heading masing-masing section.
  //
  // Setiap kunci di sini harus punya padanan href di konstanta `NAV`
  // (`src/components/App.tsx`), dan href itu harus punya id yang benar-benar ada
  // di `index.astro` — tanpa itu, tautannya jadi anchor mati.
  "nav.layanan": "Layanan",
  "nav.program": "Program",
  "nav.alur": "Alur Pendaftaran",
  "nav.galeri": "Galeri",
  "nav.legal": "Legalitas",
  "nav.tim": "Tim",
  "nav.mitra": "Mitra",
  "nav.faq": "FAQ",
  "nav.kontak": "Kontak",

  // `#layanan` resolves as of e9317cf, which turned the Layanan tab panel into a
  // plain Section (index.astro:156). NOTE 2026-09-25: the section bar that read
  // `data-nav-link="layanan"` is gone (owner deleted the whole band below the
  // hero), so nothing scroll-spies this target any more — the anchor still
  // resolves, there is simply no rail pointing at it. Left as the reason this key
  // exists; do not read it as a live contract.
  // The key went in at the call site only; the dictionaries never got it.
  "public.layanan_magang": "Program Magang",
  "public.layanan_magang_desc": "Magang di perusahaan Jepang",
  "public.layanan_tg_desc": "Tokutei Ginou SSW",
  "public.layanan_tg_ssw": "Program SSW",

    // ── Pemandu langkah (StepGuide.tsx) ──
    // Satu kartu yang menjawab "apa satu hal berikutnya?". Tidak ada angka skor
    // di sini: kata-katanya menyebut FORMULIR, bukan penilaian. Jangan tambahkan
    // "skor", "peringkat", "peluang", atau "lolos" — lihat §6.2 di
    // docs/ILLUSTRATION_SPEC.md dan catatan di StepGuide.tsx.
    "footer.copyright": "© 2026 PT AMANAH SAKURA JAPAN. ALL RIGHTS RESERVED.",

  // ── Footer: navigasi cepat ────────────────────────────────────────────
  // Five links and three column headings that carried NO key at all — the footer
  // switch to Japanese left them in Indonesian. Only `Lowongan Kerja` was caught,
  // because `i18n.keys.test.ts`'s bare-text scan reports the odd one out and the
  // other seven read as "Indonesian copy that was never translated" rather than
  // as a defect. They are the same defect; all eight get keys.
  //
  // Values match the visible literals verbatim. `Alur Pendaftaran` is shortened
  // from the nav's `Alur` deliberately: the footer link is a wider column and the
  // longer label is what the footer shipped with.
  "footer.nav_heading": "Navigasi",
  "footer.nav_program": "Program",
  "footer.nav_alur": "Alur Pendaftaran",
  "footer.nav_fasilitas": "Fasilitas",
  "footer.nav_tentang": "Tentang Kami",
  "footer.social_heading": "Sosial Media",
  "footer.contact_heading": "Kontak",

  // The paragraph directly UNDER the tagline. It rendered on every page with
  // `showFooter` and carried no key, so it stayed Indonesian in Japanese mode
  // even though the tagline above it is Japanese-only by design — the two sit
  // six lines apart in Footer.astro. Found 2026-09-27 by the bilingual probe.
  "footer.blurb": "LPK pelatihan bahasa & budaya kerja Jepang di Ponorogo. Penempatan dijalankan bersama mitra LPK dan PT (SO) melalui MoU.",
    "footer.tagline": "夢を日本へ",
    "footer.title": "PT Amanah Sakura Japan",

    // ─── Password / CV mini / misc helpers ───────────────────────────────────
    "ui.crash_title": "Terjadi Kesalahan (Crash)",

    // ─── 404 (src/pages/404.astro) ───────────────────────────────────────────
    // Added with the page itself. Every data-lang key must exist in BOTH
    // dictionaries or i18n.keys.test.ts fails, which is the point: a key that
    // only exists in `id` renders the key string itself in Japanese.
    "notfound.title": "Halaman tidak ditemukan",
    "notfound.body": "Alamat yang Anda buka tidak ada atau sudah dipindahkan. Periksa kembali tautannya, atau mulai dari halaman utama.",
    "notfound.home": "Ke Beranda",

    // `notfound.jobs` DIHAPUS 2026-09-30 bersama tautannya. Tombolnya menuju
    // `/public/`, rute portal yang tidak dibangun di repo ini — jadi halaman 404
    // menawarkan jalan buntu kedua kepada orang yang baru saja mengikuti tautan
    // rusak. Digantikan tautan ke bagian kontak, yang benar-benar ada.
    "notfound.contact": "Hubungi Kami",

    // ─── Document titles / <title> ───────────────────────────────────────────
    // WHY THESE EXIST SEPARATELY FROM THE `title=` PROP ON BaseLayout.
    //
    // The <title> tag is SERVER-RENDERED on purpose (see BaseLayout.astro): a
    // crawler and a shared link preview need it in the HTML, and
    // translateDataLang() only runs in the browser. So the server-rendered
    // value stays Indonesian, and that part is correct and unchanged.
    //
    // But nothing ever updated it AFTER hydration, so a reader who chose
    // Japanese kept an Indonesian title in the tab, the bookmark and the
    // history entry — verified 2026-09-27 by loading all 7 routes twice and
    // comparing document.title: 7 of 7 were identical. That is why these keys
    // exist: BaseLayout reads `data-title-key` off <html> and assigns
    // document.title from this dictionary on boot and on every toggle.
    //
    // THE KEY LIVES ON <html>, NOT ON <title>. i18n.keys.test.ts does not parse
    // <title>, but another gate matches `/<title>([\s\S]*?)<\/title>/`, and
    // adding an attribute to that tag would break it. Same reasoning the skill
    // for this defect class records.
    // "Job Portal" WAS WRONG, and it was wrong in the one place a visitor sees
    // before the page loads — the browser tab, the bookmark and the search
    // result. `index.astro` renders `<title>PT Amanah Sakura Japan — Profil
    // Perusahaan</title>` server-side, but `applyDocTitle()` REPLACES it after
    // hydration from this key, so the correct string survived only until JS ran.
    // Caught by loading the built page in a real browser and reading
    // `document.title`, not by grepping the source.
    "doc.title_home": "PT Amanah Sakura Japan — Profil Perusahaan",
    "doc.title_notfound": "Halaman tidak ditemukan — PT Amanah Sakura Japan",
  },
  jp: {} as Record<string, string>, // P9: lazy-loaded from i18n-jp.ts

};

// P9 fix: Preload jp translations when user switches to Japanese.
// On init, if lang is already jp, preload immediately so translations
// are available before first render.
// P9b: once the dict is installed, notify subscribers (jpReady -> App re-render)
// and re-patch static [data-lang] nodes so the UI actually switches to Japanese.
const RAW_STRING_TRANSLATIONS: Record<Lang, Record<string, string>> = {
  id: {},
  // EMPTIED 2026-09-30 — the 24 entries that were here are all unreachable.
  //
  // This dictionary translated Indonesian SENTENCES used as lookup keys, for
  // the portal's toast messages ("Gagal upload", "Sesi tidak valid. Silakan
  // login kembali.", "Supabase belum dikonfigurasi"). Every one of them came
  // from a route or a backend call this repo does not have.
  //
  // CHECKED, NOT ASSUMED: every `data-lang`, `data-lang-aria`,
  // `data-lang-placeholder` and `data-lang-title` value in src/ is a dotted key
  // (verified by filtering the collected attribute values against the key
  // pattern — zero non-key values), and the four lookup sites below all read
  // their key from those attributes. So no sentence is ever looked up, and this
  // map is never consulted.
  //
  // The MECHANISM is kept rather than deleted: the fallback chain in
  // `translateDataLang()` and `t()` still reads it, so if a sentence-keyed
  // string is ever needed again it can be filled in without re-plumbing. An
  // empty object costs nothing; the 24 dead sentences did not.
  jp: {},
};

function onJpReady() {
  jpReady.set(true);
  translateDataLang();
  // MUST re-apply the title here too, and the reason is a COLD-LOAD RACE that
  // makes the first attempt fail silently.
  //
  // Order of events on a cold load with lang=jp:
  //   1. langStore.subscribe fires. `translations.jp` is still EMPTY, so the
  //      branch calls loadJp() (async) and SKIPS translateDataLang().
  //   2. It dispatches `asj-lang-change` immediately, so BaseLayout's listener
  //      runs applyDocTitle() — while the JP dict is still in flight.
  //   3. t() therefore falls back to the INDONESIAN entry, which is the same
  //      string already in the DOM, so the assignment is a silent no-op.
  //   4. The chunk lands and onJpReady() runs. Before this line existed it
  //      refreshed only [data-lang] ELEMENTS; `document.title` is not an
  //      element, so nothing ever re-applied it.
  // Net effect: the title stayed Indonesian for every Japanese reader, while
  // every other string on the page translated correctly — which is exactly the
  // asymmetry the probe measured.
  applyDocTitle();
}

/**
 * Preload the JP dictionary — but ONLY when Japanese is already the active
 * language.
 *
 * CHANGED 2026-09-30. This used to load unconditionally, and so did the
 * module-scope block below, which meant EVERY visitor downloaded the Japanese
 * dictionary whether or not they ever left Indonesian. Measured: 29.6 KB gzip —
 * about a quarter of the page's total transfer — for a language most visitors
 * never select.
 *
 * WHAT IS GIVEN UP: only the pre-warming. The first switch to Japanese now
 * waits for one chunk fetch. It does not land untranslated, because
 * `toggleLang()` awaits `ensureJpLoaded()` BEFORE it flips the store, so the
 * dictionary is in memory by the time anything reads it.
 */
export function preloadJpDict(): void {
  if (typeof window === 'undefined') return;
  if (langStore.get() !== 'jp') return;
  loadJp().then(onJpReady).catch(() => {});
}

if (typeof window !== 'undefined') {
  // Same condition as preloadJpDict above, and for the same reason: the
  // persisted language is known synchronously here (`langStore` is a
  // `persistentAtom`, which reads storage on construction), so a JP visitor
  // still gets the dictionary at boot — and an ID visitor gets nothing.
  if (langStore.get() === 'jp') loadJp().then(onJpReady).catch(() => {});

  langStore.subscribe((lang) => {
    if (lang === 'jp' && Object.keys(translations.jp).length === 0) {
      loadJp().then(onJpReady).catch(() => {});
    } else {
      translateDataLang();
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'jp' ? 'ja' : 'id';
      window.dispatchEvent(new CustomEvent('asj-lang-change', { detail: { lang } }));
    }
  });
}

/** Translate all [data-lang], [data-lang-placeholder], [data-lang-title], and [data-lang-aria] elements in the DOM */
export function translateDataLang() {
  if (typeof document === "undefined") return;
  const lang = langStore.get();
  const dict = translations[lang] || translations.id;
  const fallback = translations.id;

  document.querySelectorAll("[data-lang]").forEach((el) => {
    const key = el.getAttribute("data-lang");
    if (key) {
      const text = dict[key] || fallback[key] || RAW_STRING_TRANSLATIONS[lang]?.[key] || key;
      if (text !== key) el.textContent = text;
    }
  });

  document.querySelectorAll("[data-lang-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-lang-placeholder");
    if (key) {
      const text = dict[key] || fallback[key] || RAW_STRING_TRANSLATIONS[lang]?.[key] || key;
      if (text !== key) el.setAttribute("placeholder", text);
    }
  });

  document.querySelectorAll("[data-lang-title]").forEach((el) => {
    const key = el.getAttribute("data-lang-title");
    if (key) {
      const text = dict[key] || fallback[key] || RAW_STRING_TRANSLATIONS[lang]?.[key] || key;
      if (text !== key) el.setAttribute("title", text);
    }
  });

  document.querySelectorAll("[data-lang-aria]").forEach((el) => {
    const key = el.getAttribute("data-lang-aria");
    if (key) {
      const text = dict[key] || fallback[key] || RAW_STRING_TRANSLATIONS[lang]?.[key] || key;
      if (text !== key) el.setAttribute("aria-label", text);
    }
  });
}

export function t(key: string): string {
  const lang = langStore.get();
  return translations[lang]?.[key] || translations.id[key] || RAW_STRING_TRANSLATIONS[lang]?.[key] || key;
}

/**
 * applyDocTitle() — keep `document.title` in step with the active language.
 *
 * THE DEFECT THIS FIXES, measured 2026-09-27. `BaseLayout.astro` renders
 * `<title>{title}</title>` on the server, deliberately: a crawler and a shared
 * link preview need the title in the HTML, and this function cannot run for
 * them. But NOTHING re-applied it after hydration, so the server-rendered
 * Indonesian string was also the only string a Japanese reader ever saw — in
 * the tab, the bookmark and the history entry. Loading all 7 public routes in
 * both languages and diffing `document.title` gave **7 of 7 identical**.
 *
 * `i18n.keys.test.ts` had this covered and explicitly exempted it, on the
 * reasoning that "translateDataLang() only runs in the browser, so it cannot
 * fix these — deliberately out of scope, not a false negative". The mechanism
 * was described correctly and the conclusion did not follow: the title is not
 * unfixable, it just needs its own writer. The exemption is what let this
 * survive every gate.
 *
 * WHY THE KEY IS READ FROM <html> AND NOT <title>. A separate gate matches
 * `/<title>([\s\S]*?)<\/title>/`; putting an attribute on that tag would break
 * it. `data-title-key` on the root element is invisible to that regex and is
 * already the idiom this layout uses for its other i18n attributes.
 *
 * THE SERVER-RENDERED VALUE IS NOT OVERWRITTEN UNTIL A TRANSLATION EXISTS. If
 * the JP dictionary chunk has not arrived yet, `t()` falls back to the
 * Indonesian entry — which is the same string already in the DOM, so assigning
 * it is a no-op rather than a flash of a raw key. A missing key is skipped for
 * the same reason: better an Indonesian title than the literal `doc.title_x`.
 */
export function applyDocTitle(): void {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  const key = el.getAttribute("data-title-key");
  if (!key) return;
  const text = t(key);
  // t() returns the key itself when it is in NO dictionary — never render that.
  if (text && text !== key) document.title = text;
}

/**
 * useLang() — the ONE way an island subscribes to the active language.
 *
 * WHY IT SUBSCRIBES TO TWO STORES. `langStore` already reads "jp" the instant
 * the page boots (it comes from localStorage), but `translations.jp` is a lazy
 * chunk that lands LATER. An island that subscribes only to `langStore`
 * therefore renders the Indonesian fallback on a COLD load with lang=jp, and
 * never re-renders when the chunk arrives — because nothing it listens to
 * changes. Toggling the language by hand hides this: the toggle mutates
 * `langStore`, which re-renders every island, so every interactive test passes
 * on a page that is wrong for a returning Japanese reader. `jpReady` bumps
 * exactly once, when the dictionary is installed, and is the missing signal.
 *
 * WHY A HOOK AND NOT A `jpReady.subscribe` IN EACH ROOT. An island root is the
 * component handed to `client:only`/`client:load`; its children re-render with
 * it, so only the root needs the subscription. But a raw subscribe line is
 * exactly what the next island forgets. This hook is exported from the same
 * module an island already imports `t` from, so following the existing pattern
 * (`const lang = useLang()`) gets the fix for free.
 *
 * Prefer this over `useStore(langStore)` anywhere a component renders `t()`.
 */
export function useLang(): Lang {
  const lang = useStore(langStore);
  useStore(jpReady); // re-render when the lazy JP dictionary finishes loading
  return lang;
}

/** Centralized instant language toggle helper */
export async function toggleLang(): Promise<Lang> {
  const current = langStore.get();
  const next: Lang = current === "id" ? "jp" : "id";
  if (next === "jp") {
    await ensureJpLoaded();
  }
  langStore.set(next);
  return next;
}