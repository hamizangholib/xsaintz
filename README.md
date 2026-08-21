# XSaintZ — link hub

Satu halaman statis yang mengumpulkan tools buatan sendiri.
Live di **https://xsaintz.my.id**.

HTML + CSS + vanilla JS. Tanpa framework, tanpa bundler, tanpa `npm install`,
tanpa build step. Push ke `main`, GitHub Pages langsung menyajikannya.

```
index.html      struktur + meta/Open Graph
styles.css      seluruh style, semua token warna di :root
main.js         render tools.json, reveal, ambient wash, custom cursor
tools.json      SUMBER DATA — satu-satunya file yang perlu diedit
CNAME           xsaintz.my.id
logo.svg        LOGO — kamu yang menaruh berkasnya, lihat bagian di bawah
.nojekyll       matikan pemrosesan Jekyll di GitHub Pages
favicon.svg     ikon tab
og-image.png    gambar preview WhatsApp/Facebook (1200x630)
og-image.svg    sumber vektor og-image, buat regenerate
```

---

## Menambah tool baru

Buka `tools.json`, tambah satu objek ke dalam array. **Tidak ada file lain
yang perlu disentuh** — nomor urut, lebar kolom, warna wash, dan animasi
reveal semuanya ikut menyesuaikan sendiri.

```json
{
  "id": "nama-unik",
  "name": "Nama Tool",
  "kind": "Web app",
  "tagline": "Satu kalimat, apa gunanya",
  "description": "Dua sampai tiga kalimat. Yang bikin orang paham dalam sekali baca.",
  "href": "https://alamat-tool-nya/",
  "action": "Buka",
  "accent": "#0B7A5E",
  "meta": ["Gratis", "Tanpa akun"]
}
```

### Field

| Field | Wajib | Isi |
|---|---|---|
| `id` | ya | slug unik, dipakai internal |
| `name` | ya | nama tool, tampil besar |
| `kind` | tidak | label kecil di atas nama, mis. `Web app`, `Aplikasi Windows` |
| `tagline` | tidak | satu baris ringkas di bawah nama |
| `description` | tidak | paragraf penjelas |
| `href` | ya | URL tujuan kartu |
| `action` | tidak | kata kerja di link + label custom cursor. Default `Buka` |
| `accent` | tidak | hex warna tool. Default `#3D2BFF` |
| `meta` | tidak | array string pendek, tampil sebagai spec row |
| `note` | tidak | peringatan penting, mis. syarat login |
| `downloads` | tidak | array `{ "label", "href" }` untuk tombol unduh tambahan |

### Aturan warna `accent`

Warna tool dipakai untuk teks display besar dan grafis, bukan body copy.
Tetap pastikan **kontras minimal 4.5:1 terhadap `#EEF0F4`** supaya nama tool
lolos WCAG AA. Cek cepat di https://webaim.org/resources/contrastchecker/
(foreground = accent, background = `EEF0F4`).

Warna yang sudah dipakai — jangan diulang supaya tiap tool tetap dikenali:

| Tool | Hex | Kontras |
|---|---|---|
| PDF Toolkit | `#C42350` | 5.0:1 |
| Saveflow | `#0B7A5E` | 4.7:1 |
| DocuDuo | `#5B3DF5` | 5.4:1 |
| CleanMark | `#A35400` | 4.8:1 |

Urutan objek di JSON = urutan tampil di halaman. Lebar kartu otomatis
menentukan **tone** dan **pola grafis** kartunya. Keduanya berulang tiap empat
kartu lewat `nth-child`, jadi jumlah tool berapa pun tetap dapat ritme yang
sama tanpa kamu mengatur apa pun:

| Urutan | Tone panel | Grafis kanan |
|---|---|---|
| 1, 5, 9, … | `#161A2B` gelap, teks putih | garis vertikal |
| 2, 6, 10, … | `#272C40` gelap, teks putih | chevron |
| 3, 7, 11, … | `#E3E7EF` terang, teks tinta | lingkaran konsentris |
| 4, 8, 12, … | `#FFFFFF` putih, teks tinta | grid titik |

Grafisnya gradien CSS yang diwarnai aksen tool — tidak ada berkas gambar sama
sekali, dan otomatis ikut warna yang kamu tulis di `accent`.

---

## ⚠️ Yang masih harus kamu isi: CleanMark

Repo `hamizangholib/cleanmark` **belum ada** saat halaman ini dibuat, jadi tiga
URL berikut di `tools.json` masih tebakan berpola dan wajib dikonfirmasi:

```
https://github.com/hamizangholib/cleanmark/releases/latest
https://github.com/hamizangholib/cleanmark/releases/latest/download/CleanMark-Portable.exe
https://github.com/hamizangholib/cleanmark/releases/latest/download/CleanMark-Setup.exe
```

Langkah:

1. Bikin repo untuk CleanMark, lalu **Releases → Draft a new release**.
2. Upload `.exe` portable dan installer sebagai **release asset**.
3. Samakan nama file asset dengan yang ada di `tools.json`, atau sebaliknya —
   edit `tools.json` mengikuti nama asset yang kamu upload.

URL `/releases/latest/download/<nama-file>` selalu menunjuk ke rilis terbaru,
jadi setiap kamu rilis versi baru, situs tidak perlu diubah sama sekali.

Binary sengaja **tidak** ditaruh di repo ini: GitHub Pages punya batas 1 GB per
situs dan sangat tidak nyaman menyimpan riwayat file besar di git.

---

## Logo

```
logo/                 berkas asli, jangan dihapus
  logo website.png      ikon situs   128x128   23 KB
  pdf toolkit.png       PDF Toolkit  512x512   18 KB
  saveflow.png          Saveflow    1254x1254 147 KB
  Cleanmark.png         CleanMark   1024x1024 950 KB
  docuduo.svg           DocuDuo, lockup ikon + wordmark
logo/web/             salinan terpakai halaman, sudah diperkecil
  xsaintz.png    96x96    12.5 KB
  pdf-toolkit.png 128x128  8.9 KB
  saveflow.png   128x128  12.6 KB
  cleanmark.png  128x128  38.4 KB
  docuduo.svg    ikon saja, wordmark dibuang
```

**Halaman hanya memuat isi `logo/web/`.** Berkas asli berjumlah 1,14 MB —
`Cleanmark.png` sendirian 950 KB, hampir empat kali seluruh budget halaman.
Versi web totalnya 74 KB.

Kalau kamu mengganti salah satu logo, perkecil dulu ke 128x128 dan simpan ke
`logo/web/` dengan nama yang sama. Lalu **cek ulang ukuran totalnya** — logo
adalah satu-satunya bagian situs ini yang gampang membengkak tanpa terasa.

`docuduo.svg` asli berformat potret dan sudah memuat wordmark "DocuDuo", jadi
tidak cocok jadi badge kotak. Versi `logo/web/` memakai `viewBox` yang
dirapatkan ke marknya saja dan grup wordmark-nya dibuang.

Tiap logo duduk di atas **ubin putih beradius**. Ini bukan hiasan: logo tool
datang dengan latar yang berbeda-beda — Saveflow terang, CleanMark gelap —
jadi tanpa ubin itu salah satunya pasti hilang di salah satu tone kartu.

Menambah logo untuk tool baru cukup lewat `tools.json`:

```json
"logo": "logo/web/nama-tool.png"
```

Field `logo` opsional. Kalau kosong atau berkasnya hilang, kartunya tampil
tanpa badge — `onerror` menghapus elemen gambarnya, tidak ada ikon rusak.

Masthead memakai `logo/web/xsaintz.png` **berdampingan dengan wordmark teks**,
karena berkas ikonnya tidak memuat tulisan. Kalau berkasnya hilang, teksnya
berdiri sendiri.

## Preview lokal

`index.html` membaca `tools.json` lewat `fetch()`. Saat dibuka langsung sebagai
berkas (`file://`), browser memblokir pembacaan itu karena aturan CORS —
batas keamanan browser, bukan bug. Halaman tetap tampil, tapi grid diganti
notice yang menjelaskan ini.

Jalankan server kecil dari folder repo, lalu buka http://localhost:8000 :

```bash
python -m http.server 8000
```

Di GitHub Pages dan di `xsaintz.my.id` semuanya jalan normal tanpa syarat apa pun.

---

## Regenerate og-image

`og-image.png` adalah gambar yang muncul saat link dishare di WhatsApp,
Facebook, Telegram, dan X. Harus PNG/JPG — **SVG tidak dirender** oleh
scraper mereka.

`og-image.svg` adalah sumber vektornya (memakai font sistem supaya berdiri
sendiri tanpa jaringan). Untuk membuat ulang PNG-nya tanpa build step, render
`og-image.svg` pakai Chrome yang sudah terpasang:

```bash
chrome --headless=new --window-size=1200,630 --screenshot=og-image.png og-image.svg
```

Atau cara termudah: buka `og-image.svg` di browser, screenshot, crop ke 1200x630.

Setelah mengganti gambar, minta WhatsApp/Facebook membaca ulang lewat
https://developers.facebook.com/tools/debug/ — kalau tidak, preview lama
bisa bertahan di cache berhari-hari.

---

## Setup DNS untuk xsaintz.my.id

Domain `.my.id` dikelola lewat registrar tempat kamu beli (Niagahoster,
Rumahweb, Domainesia, dan sejenisnya). Masuk ke panel DNS-nya.

### 1. Arahkan apex domain ke GitHub Pages

Tambah **empat** A record. Keempatnya wajib ada — itu alamat IP GitHub Pages,
dipakai bergantian untuk keandalan.

| Type | Host / Name | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

Kalau panelmu mendukung IPv6, tambahkan juga AAAA record ke
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
`2606:50c0:8003::153`.

### 2. Arahkan subdomain www

| Type | Host / Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `hamizangholib.github.io.` | 3600 |

Ganti `hamizangholib` kalau repo ini ada di akun lain. Titik di akhir itu
memang bagian dari nilainya, jangan dihapus.

### 3. Setel di GitHub

Repo → **Settings → Pages**:

- **Source**: `Deploy from a branch`, branch `main`, folder `/ (root)`.
- **Custom domain**: isi `xsaintz.my.id`, klik Save.
  File `CNAME` di repo ini sudah berisi nilai itu, jadi biasanya GitHub
  langsung mengisinya sendiri.
- Tunggu sampai muncul centang **DNS check successful**.
- Baru setelah centang itu muncul, centang **Enforce HTTPS**.

### 4. Sabar

Propagasi DNS butuh 10 menit sampai 48 jam. Sertifikat HTTPS-nya diterbitkan
GitHub otomatis lewat Let's Encrypt setelah DNS terverifikasi — kalau
**Enforce HTTPS** masih abu-abu, itu artinya sertifikat belum jadi, bukan
salah setting. Cek propagasi di https://dnschecker.org.

---

## Animasinya tidak jalan?

Kalau halaman terasa diam total — kartu langsung terbuka semua, pita tidak
berjalan, tidak ada parallax — hampir pasti **bukan** bug. Sistemmu sedang
meminta agar animasi dikurangi, dan halaman ini menuruti permintaan itu.

Cek di browser, tempel di Console (F12):

```js
matchMedia('(prefers-reduced-motion: reduce)').matches
```

`true` artinya animasi memang sengaja dimatikan. Menyalakannya kembali:

- **Windows** — Settings > Accessibility > Visual effects > **Animation effects**: nyalakan.
- **Chrome** juga mematikannya kalau flag `chrome://flags` > *Force prefers-reduced-motion* aktif.
- Sesudah mengubah setelan, **reload halamannya**.

Perlu diingat: ini perilaku yang benar dan sengaja dipertahankan. Orang yang
menyalakan setelan itu biasanya punya alasan — mabuk gerak, migrain, gangguan
vestibular. Jangan dihapus penanganannya supaya animasinya "selalu jalan".

## Catatan teknis

### Bahasa visual

Daftar tool disusun sebagai **baris full-width bertumpuk**, bukan grid dua
kolom: judul besar di kiri, nomor urut di tepi kanan pada baseline yang sama,
kolom teks sempit di bawahnya, dan grafis dekoratif mengisi sisi kanan. Tone
panelnya menurun dari gelap ke terang lalu berulang.

Nomor urut **tidak** boleh diposisikan absolut terhadap `.card` — kolom teks
dibatasi lebarnya, jadi nomornya akan menempel ke ujung teks, bukan ke tepi
kartu. Ia duduk di baris flex `.card__head` bersama judul. Label `kind` sengaja
berada di luar baris itu: kalau ikut masuk, baseline flex mengunci ke baris
kecil itu dan nomornya melayang di atas judul.

**Aksen tool tidak dipakai untuk teks saat kartu diam.** Di atas dua tone gelap,
kontrasnya cuma 2.26–3.25:1 — gagal AA. Aksen baru muncul saat ink fill, di situ
teksnya putih di atas aksen (5.30:1 ke atas).

Panel beradius besar di atas ground abu-biru dingin. Tiap kartu punya
**ink fill**: lingkaran warna tool yang mekar dari titik persis tempat pointer
masuk, lalu teksnya membalik jadi putih. Diameter lingkaran dihitung dari
diagonal kartu (`setInk()` di `main.js`), bukan persentase lebar — persentase
lebar menyisakan sudut yang tak pernah tertutup di kartu tinggi.

Judul dan nama tool masuk **per baris dari balik mask**, bukan sekadar fade.
Semua yang bergerak memakai easing pegas `cubic-bezier(.34, 1.56, .64, 1)`
yang sedikit melewati tujuan sebelum menetap; warna tetap memakai ease-out
biasa supaya tidak berkedip.

### Lebar dan gerak

Semua seksi memakai token `--wrap` (2000px) plus `margin-inline: auto`. Di layar
1080p dan 1440p pembatas itu tidak bekerja sama sekali, jadi konten terisi penuh
sampai tepi; barunya membatasi di monitor ultrawide. **Jangan memberi seksi
`max-width` tanpa `margin-inline: auto`** — bloknya akan menempel ke kiri dan
menyisakan celah kosong di kanan.

Gerak tidak hanya bergantung hover, supaya halaman tetap hidup di laptop tanpa
menyentuh apa pun:

- bar progres scroll tipis di puncak halaman;
- pita nama tool yang berjalan terus, dan **tertarik searah scroll** lalu balik
  pelan ke tempatnya;
- grid kartu **miring sedikit mengikuti kecepatan scroll**, dibatasi 2,2 derajat
  supaya teks tetap enak dibaca;
- judul hero dan paragrafnya melayang dengan laju berbeda saat scroll;
- tiap kartu bergeser halus, kolom kiri dan kanan dengan laju berbeda;
- numeral hantu di tiap kartu melayang berlawanan arah scroll;
- wordmark footer menggeser masuk.

Pita berjalan dibangun dari `tools.json` juga, jadi tool baru otomatis ikut
muncul di sana. Jalannya dianimasikan CSS murni supaya ditangani compositor;
JS hanya menggeser lapisan pembungkusnya saat scroll. Dua lapisan itu sengaja
dipisah — kalau digabung, animasi CSS akan menimpa transform dari JS.

Seluruh transform kartu **disusun dari variabel** (`--lift` hover, `--par`
scroll, `--rev` reveal) lalu digabung di satu deklarasi `transform`. Kalau salah
satu efek menulis `transform` langsung, dua efek lainnya mati tertimpa.

### Kartu membuka saat discroll

Tiap kartu mulai sebagai **strip terlipat**: hanya logo, label, judul, dan
nomor, semuanya di atas tone terang yang sama. Begitu kartu masuk cukup dalam
ke viewport, ia membuka ke tinggi penuh, tone aslinya muncul, dan isinya
naik masuk.

Tinggi terlipat dan tinggi penuh **diukur sekali** oleh `measureHeights()` lalu
disimpan sebagai `--h-collapsed` dan `--h-full`. Transisi tingginya ditangani
CSS, satu kali per kartu.

**Jangan mengubahnya jadi height yang ditulis tiap frame scroll.** Menulis
`height` per frame memaksa reflow seluruh dokumen di tiap frame — itu persis
penyebab halaman ini pernah terasa berat. Efek yang terikat scroll secara
kontinu (parallax, skew, pita) semuanya hanya menyentuh `transform`.

Pengukuran diulang saat font selesai dimuat, saat tiap logo selesai dimuat,
dan saat resize — ketiganya mengubah tinggi kartu. Saat kartu membuka, kartu
di bawahnya bergeser, jadi posisi yang dipakai parallax diukur ulang lewat
`transitionend`.

Jaring pengamannya punya **dua** syarat: observer tidak pernah menembak **dan**
ada kartu yang sudah melewati garis pemicu. Tanpa syarat kedua, saat halaman
baru dimuat semua kartu masih di bawah layar, jaring itu membuka semuanya, dan
efek membukanya hilang sama sekali.

### Performa

Halaman ini pernah terasa berat. Penyebab dan perbaikannya, supaya tidak
terulang kalau nanti diubah-ubah:

- **`filter: blur(30px)` pada `.wash` dibuang.** Elemen fixed seukuran 160%
  viewport yang di-blur *dan* ditransform tiap frame scroll memaksa GPU
  mem-blur ulang permukaan raksasa terus-menerus. Gradiennya sendiri sudah
  lembut — blur-nya nyaris tak terlihat tapi paling mahal di seluruh halaman.
  Jangan menambahkannya kembali.
- **Parallax `.wash` dihapus.** Menggeser lapisan sebesar itu tiap frame adalah
  repaint, bukan sekadar composite.
- **rAF cursor berhenti saat pointer diam** dan dinyalakan lagi oleh
  `mousemove`. Loop yang berputar terus tanpa ada yang berubah membuat laptop
  bekerja sia-sia.
- **Satu rAF untuk semua efek scroll**, dan posisi elemen diukur sekali lalu
  disimpan. Memanggil `getBoundingClientRect` tiap frame memaksa layout ulang.
  Pengukuran diulang saat resize (dengan jeda) dan setelah kartu dirender.
- **Efek scroll hanya menyentuh `transform`**, tidak pernah `top`/`left`/
  `width` — properti itu memicu layout, transform tidak.
- **`transition-delay` stagger dibersihkan** 1.2 detik setelah tiap kartu
  tampil. Kalau dibiarkan, delay-nya ikut menempel di hover dan kartu keempat
  baru terangkat 240ms setelah pointer masuk — persis terasa seperti halaman
  lambat.

### Aksesibilitas dan ketahanan

- **Keadaan awal yang menyembunyikan teks digantung pada kelas `.js`** di
  `<html>`, dan kelas itu baru dipasang oleh `main.js`. Kalau JS gagal dimuat,
  `.mask__in` tidak pernah tersembunyi dan semua teks tetap terbaca.
- **Reveal kartu punya pengaman 1.5 detik.** Kalau IntersectionObserver tidak
  pernah menembak padahal ada kartu di viewport, mekanisme reveal dibuang dan
  semua kartu ditampilkan. Lebih baik kehilangan animasi daripada meninggalkan
  link yang tidak pernah terlihat.
- **Custom cursor hanya jalan di `matchMedia('(pointer: fine)')`.** Di perangkat
  sentuh tidak pernah diinisialisasi sama sekali. Sebagai gantinya, di HP kartu
  yang berada di tengah viewport yang menyalakan ink fill dan mewarnai halaman,
  jadi signature-nya tetap hidup.
- **`prefers-reduced-motion: reduce` dihormati**: transisi dimatikan, Lenis tidak
  diinisialisasi, kartu langsung tampil, custom cursor tidak muncul.
- **Kontras minimum 5.30:1** di seluruh keadaan, termasuk saat kartu terisi warna.
  Teks sekunder memakai warna penuh, bukan `opacity` — menurunkan opacity teks
  menjatuhkan kontras diam-diam. Chip pada kartu aktif memakai latar
  `rgba(0,0,0,.22)` yang menggelapkan accent; menerangkannya dengan putih
  transparan menjatuhkan kontras ke bawah 3.5:1.
- **Tiap kartu adalah `<a href>` sungguhan**, bukan `div` ber-onclick — bisa
  dibuka di tab baru, disalin alamatnya, dan dijelajahi penuh dengan keyboard.
  Fokus keyboard memicu ink fill yang sama dengan hover.

### Bobot dan dependency

- **Total transfer 149 KB**, sudah termasuk font dan library. HTML+CSS+JS+JSON+favicon
  13.6 KB setelah gzip, Lenis 4.7 KB, sisanya webfont (130.6 KB).
- **Satu-satunya dependency: Lenis 1.3.11** (smooth scroll, dipin versinya
  lewat unpkg). Custom cursor, efek magnetic/sticky, ink fill, stagger reveal,
  dan ambient wash semuanya ditulis tangan di `main.js` (406 baris).
- Lenis aktif **di semua device** atas permintaan. Kalau scroll di HP terasa
  berat, batasi ke desktop dengan mengganti syarat di `setupScroll()` menjadi
  `if (!reduced && fine && typeof window.Lenis === "function")`.
- **Axis Bricolage dibatasi `wght@700..800`.** Memakai `opsz,wdth,wght` penuh
  membengkakkan file font dari 40 KB jadi 128 KB padahal axis itu tidak dipakai.
  Kalau suatu saat menambah bobot atau axis di URL Google Fonts, cek lagi
  ukurannya.
- **`favicon.svg` harus tetap kecil** (223 byte). Kalau ada tool yang
  menggantinya dengan versi ratusan KB, kembalikan — favicon ikut diunduh
  tiap kunjungan.
