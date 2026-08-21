# Prompt untuk Claude Code

> Salin seluruh isi di bawah garis ini ke Claude Code.
> **Sebelum mengirim, isi dulu bagian `[ISI SENDIRI]`.** Kalau dibiarkan kosong, Claude Code akan menebak dan hasilnya kemungkinan generik.

---

Bangun sebuah **link hub statis** — satu halaman yang mengumpulkan tools yang sudah saya buat — untuk di-deploy ke GitHub Pages dengan custom domain `xsaintz.my.id`.

## Konteks

Saya mahasiswa akuntansi sektor publik yang membangun web tools untuk kebutuhan kerja/institusi. Halaman ini adalah pintu masuk tunggal ke semua tools itu. Pengunjungnya: rekan kerja, dosen, teman, dan orang yang saya kirimi link lewat WhatsApp.

**Satu tugas halaman ini:** membuat pengunjung menemukan dan membuka tool yang mereka cari secepat mungkin — sambil terlihat seperti dibuat oleh orang yang tahu desain.

## Data tools

[ISI SENDIRI — daftar tool kamu di sini, format bebas. Contoh:]

- PDF Split Merge (namanya PDF Toolkit), websitenya https://hamizangholib.github.io/pdf_split_merge/. tolong cek sendiri isinya biar kamu bisa tentuin
- Sosmed Video Downloader (namanya Saveflow), websitenya https://hamizangholib.github.io/sosmed-downloader/. tolong cek sendiri isinya biar kamu bisa tentuin
- AI asisted document belajar (namanya DocuDuo), websitenya https://docu-duo.vercel.app/. tolong cek sendiri isinya biar kamu bisa tentuin
- Watermark AI Text remover (namanya CleanMark), ini aplikasi windows, aku punya portabel exe dan installernya, jadi aku berencana untuk menaruhnya di websiteku itu.

Nama/branding halaman: XSaintZ

## Arahan desain

Referensi arah rasa: **cuberto.com** — tipografi besar, whitespace lega, hover state yang terasa hidup, custom cursor.

**Penting:** ambil prinsipnya, jangan salin. Jangan meniru layout, warna, copywriting, atau mengunduh asset apa pun dari Cuberto. Buat sistem visual sendiri.

Sebelum menulis kode, susun dulu design plan singkat: 4–6 warna dengan nilai hex bernama, pilihan typeface untuk display dan body, konsep layout, dan satu elemen "signature" yang membuat halaman ini diingat. Tunjukkan plan itu ke saya dan tunggu persetujuan sebelum lanjut ke implementasi.

Hindari default yang sudah terlalu sering muncul: background cream hangat + serif kontras tinggi + aksen terracotta; atau near-black + satu aksen acid green. Kalau kamu memilih salah satunya, jelaskan alasannya secara spesifik untuk brief ini.

## Batasan teknis (wajib)

- **Static murni.** HTML + CSS + vanilla JS. **Tanpa framework, tanpa build step, tanpa bundler, tanpa npm install.** Push ke repo → langsung jalan di GitHub Pages. Library eksternal lewat CDN saja.
- Data tools disimpan di **`tools.json`** terpisah, dirender ke DOM lewat JS. Menambah tool baru harus cukup dengan mengedit satu objek JSON — tanpa menyentuh HTML.
- Sertakan file `CNAME` berisi `xsaintz.my.id`.
- Sertakan `.nojekyll`.
- Satu halaman saja. Tanpa router, tanpa page transition antar halaman.

## Animasi

**Kerjakan:**
- Custom cursor + efek magnetic pada kartu tool (boleh pakai library `Cuberto/mouse-follower` dari CDN — periksa dulu file LICENSE-nya dan beri tahu saya hasilnya; kalau lisensinya tidak cocok, tulis sendiri, kodenya tidak panjang).
- Reveal bertahap (stagger) saat kartu masuk viewport.
- Hover state yang jelas pada tiap kartu: pergeseran, perubahan warna, dan cursor berubah menjadi label aksi.
- Smooth scroll (Lenis via CDN) — **hanya kalau** halamannya cukup panjang untuk membuatnya berarti. Kalau tidak, lewati.

**Jangan kerjakan:**
- Preloader atau splash screen. Tidak ada aset berat, jadi itu murni delay buatan.
- WebGL / Three.js.
- Video atau file media besar apa pun.
- Animasi yang menunda munculnya link. Konten utama harus bisa diklik dalam waktu di bawah 1 detik.

## Mobile dan aksesibilitas (jangan dikerjakan belakangan)

Mayoritas pengunjung pertama kemungkinan datang dari HP lewat link chat. Jadi:

- Bungkus semua inisialisasi cursor di `matchMedia('(pointer: fine)')`. Jangan pernah jalankan di perangkat sentuh.
- **Versi mobile harus tetap terasa hidup lewat cara lain** — scroll reveal, tap feedback, transisi warna. Jangan sekadar mematikan animasi lalu menyisakan daftar link datar.
- Hormati `prefers-reduced-motion: reduce`.
- Focus state keyboard yang terlihat jelas pada setiap link.
- Tiap kartu adalah elemen `<a>` sungguhan dengan `href` valid — bukan `div` dengan `onclick`. Harus bisa dibuka di tab baru dan disalin alamatnya.
- Kontras teks minimal WCAG AA.

## Meta

Sertakan `<title>`, meta description, dan Open Graph tags (`og:title`, `og:description`, `og:image`) supaya preview-nya rapi saat di-share di WhatsApp. Buat juga `og-image` sederhana sebagai SVG di repo dan konversikan/rujuk sesuai kebutuhan — kalau tidak memungkinkan tanpa build step, beri tahu saya opsinya.

## Struktur file yang saya harapkan

```
index.html
styles.css
main.js
tools.json
CNAME
.nojekyll
README.md   → cara menambah tool baru + langkah setup DNS
```

## Kriteria selesai

1. Buka `index.html` langsung dari filesystem (`file://`) — halaman tampil dan berfungsi. [Kalau `fetch` ke `tools.json` terhalang CORS di `file://`, beri tahu saya dan usulkan solusinya — jangan diam-diam pindah ke inline data tanpa memberi tahu.]
2. Menambah satu tool = menambah satu objek di `tools.json`, tidak ada file lain yang disentuh.
3. Rapi di lebar 375px dan 1440px.
4. Bisa dinavigasi penuh dengan keyboard.
5. Total ukuran halaman di bawah 300KB termasuk font dan library.

## Cara kerja yang saya minta

- Kalau ada yang ambigu di brief ini, **tanya dulu**, jangan berasumsi.
- Tunjukkan design plan lebih dulu, tunggu persetujuan saya, baru menulis kode.
- Setelah kode jadi, kritik hasilmu sendiri: sebutkan satu hal yang terasa generik dan perbaiki.
- Jangan menambahkan dependency di luar yang disebut tanpa bertanya.
