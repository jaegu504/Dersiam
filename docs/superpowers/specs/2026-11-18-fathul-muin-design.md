# Fathul Mu'in di Dersiam: desain

Tanggal: 2026-11-18. Status: draf, menunggu persetujuan.

## Maksud

Santri berbahasa Indonesia ingin mencari jawaban fikih Syafi'i langsung dari Fathul Mu'in. Mereka mengetik satu kata, misalnya "basmalah", "najis", atau "qashar". Hasilnya harus langsung menunjukkan:

- mas'alah yang terkait;
- ringkasan hukumnya;
- ibarah Arab dengan kata yang dicari disorot;
- nomor halaman.

Dari hasil itu mereka bisa membuka halaman kitab yang utuh. Kitabnya tebal, sekitar 673 halaman, jadi mencari harus lebih cepat daripada membolak-balik halaman.

Pemilik proyek juga ingin ada soal-jawab Fathul Mu'in di mode latihan Dersiam (flashcard, ujian, cloze, baca). Tetapi fitur itu **bukan fitur utama**.

Bahan sumbernya sudah ada: peta kitab di `/Users/sp/Documents/Fathul Muin/`. Isinya:

- 1.698 topik, masing-masing dengan judul Indonesia, judul Arab, kata kunci, ringkasan, dan ibarahnya;
- teks lengkap per halaman.

## Tujuan

1. Kitab baru **Fathul Mu'in** di Dersiam, ditandai jelas sebagai **Mazhab Syafi'i**. Enam kitab yang sudah ada bermazhab Hanafi atau ilmu alat.
2. **Cari Mas'alah** sebagai layar pertama saat kitab dibuka. Pencarian satu kata, bahasa Indonesia atau Arab (berharakat atau gundul), yang menampilkan kartu hasil berisi:
   - judul topik dengan kata yang dicari disorot;
   - lencana **hlm** dan nama bab · fasal;
   - ringkasan hukum dengan kata yang dicari disorot;
   - **penggalan ibarah Arab langsung di kartu**, dengan kata yang dicari disorot. Ini pilihan B yang dipilih pemilik.
   - tombol **"Baca halaman lengkap"**.
3. **Lembar halaman lengkap.** Lembar ini terbuka dari kartu hasil, dan juga dari Telusur Bab. Isinya:
   - teks utuh satu halaman: **matan** di kotak atas, **syarah** di bawahnya, sesuai susunan halaman asli;
   - paragraf yang dirujuk diberi latar sorot, kata yang dicari ditandai lebih tegas, dan lembar otomatis bergulir ke paragraf itu;
   - tombol **‹ hlm sebelumnya / hlm berikutnya ›**;
   - tombol **Salin ibarah + hlm** dan **Perbesar huruf** (usulan Claude, diterima pemilik);
   - daftar **topik lain di fasal ini**, yang masing-masing bisa diketuk.
4. **Telusur Bab.** Urutannya: bab, lalu fasal, lalu topik, lalu lembar halaman. Isinya 13 bab ditambah mukadimah, sesuai folder `kitab/`.
5. **Latihan Soal.** Semua **1.698 topik** dijadikan soal-jawab dalam skema data Dersiam, supaya bisa dipakai di mode flashcard, ujian, cloze, dan baca yang sudah ada.
6. Layar pertama kitab mengikuti mockup `pintu-kitab.html` (di `.superpowers/brainstorm/`):
   - judul Arab dan Latin, pengarang, label mazhab;
   - kotak cari;
   - beberapa contoh kata yang bisa diketuk;
   - di bagian "Cara lain": tombol **Telusur Bab** dan **Latihan Soal**.

## Bukan tujuan

- Tanpa AI dan tanpa backend. Pemilik sudah memutuskan tidak memakai Tahap 2. Semua berjalan statis di browser.
- Tanpa konten bahasa Turki. Pengguna utama adalah santri berbahasa Indonesia.
- Tidak mengubah enam kitab lain.
- Tidak mengunggah ke Netlify. Unggah hanya dilakukan kalau pemilik memintanya secara terpisah.

## Anti-tujuan (gagal walaupun jalan)

- **Desain beranda rusak.** Pemilik secara eksplisit meminta beranda tidak diubah. Fathul Mu'in masuk lewat templat kartu kitab yang sudah ada (`homeView.js`, data dari `booksMetadata`). Tidak boleh ada tata letak baru, gaya kartu baru, atau penanda kartu baru di beranda. Label mazhab ditampilkan lewat field yang sudah dirender kartu, misalnya kategori "Fikih Syafi'i".
- **Hukum tanpa sumber.** Setiap ringkasan dan setiap jawaban soal harus membawa halaman dan ibarah yang benar-benar ada di halaman itu.
- **Situs jadi lambat.** Data Fathul Mu'in, sekitar 1 MB atau lebih, tidak boleh ikut dimuat di bundel awal atau saat kitab lain dibuka.
- **Mazhab tercampur.** Pengguna di halaman Fathul Mu'in harus selalu tahu ini Syafi'i.

## Batasan

- Dersiam memakai Vite 5, JavaScript biasa (tanpa framework), GSAP, dan Vitest. Ada sekitar 169 tes yang sudah lulus, dan semuanya harus tetap lulus. Situs di-hosting di Netlify sebagai SPA (`netlify.toml`).
- Desain mengikuti token yang ada di `src/styles/neumorphism.css`: hijau Taman Ilmu, `--sun` untuk sorotan, kelas `neu-card` dan `neu-button`. Tidak memakai palet baru.
- Teks Arab memakai font Arab yang sudah dipakai Dersiam (Amiri / Scheherazade New).
- Normalisasi Arab memakai `normalizeArabic` dan `normalizeLatin` dari `src/services/search.js`.
- Skema soal Dersiam: `id, bookKey, chapterId, chapterNameTr, chapterNameId, originalNumber, question_tr, answer_tr, question_id, answer_id, clozeKeyWord_tr, clozeKeyWord_id, keywords`. Lihat `src/data/akaid.js`.
- Navigasi: `store.setState({ currentView })` dan `mountView` di `src/main.js`. Saat ini, mengklik kitab di `homeView.js` langsung membuka `currentView: 'study'`.

### Format sumber

**Topik** ada di `/Users/sp/Documents/Fathul Muin/kitab/<NN-bab>/<NN-fasal>.md`:

```
## hlm 70 (cetak 99)
...
### Basmalah dan tasydid dalam Fatihah | البسملة والتشديدات

> hlm 70 · kata kunci: ...
> ringkas: ...

<paragraf ibarah Arab, satu atau lebih baris>
```

Paragraf di bawah heading `###`, sampai heading berikutnya, adalah ibarah topik itu.

**Teks lengkap per halaman** ada di `/Users/sp/Documents/Fathul Muin/fathul-muin.txt`. Setiap halaman diawali `===== [hlm N | cetak M] =====`. Di dalam satu halaman:
- baris sebelum pemisah `ــ` adalah matan;
- baris sesudahnya adalah syarah.

Nomor `hlm` adalah id halaman turath. `cetak` adalah nomor halaman cetakan. Keduanya ditampilkan, misalnya "hlm 70 · cetak 99".

## Keputusan yang sudah diambil pemilik

- Hanya Tahap 1. Tanpa AI.
- Bahasa: Indonesia dan Arab. Tanpa Turki.
- Kartu hasil memakai pilihan **B**: ibarah langsung tampil di kartu.
- Kartu dan lembar bisa membuka **ibarah lengkap satu halaman**.
- Soal-jawab dibuat, tetapi sebagai pilihan sekunder di layar kitab.
- **1.698 soal**, sejumlah topik.
- **Sampel soal dicek pemilik dulu.** Sekitar 30 soal dari beberapa bab (ibadah, muamalah, nikah, jinayah) dibuat lebih dulu dan ditunjukkan ke pemilik. Gaya pertanyaan dan ringkasan disesuaikan dengan masukan pemilik. Setelah pemilik setuju, sisanya dibuat dengan gaya yang sama. UI boleh dikerjakan bersamaan, karena tidak bergantung pada isi soal.
- Beranda tidak boleh rusak.

## Keputusan Claude (silakan dikoreksi)

- **Pintu kitab:** hanya Fathul Mu'in yang membuka view baru, misalnya `currentView: 'fathul'`, dengan Cari Mas'alah sebagai layar pertama. Tombol **Latihan Soal** membuka `study` yang sudah ada dengan `activeBook: 'fathul'`. Dari sana, ujian dan baca tetap bisa dicapai seperti di kitab lain.
- **Bahasa antarmuka Turki:** label tombol di view baru diterjemahkan lewat `dictionary.js` seperti view lain. Isinya tetap Indonesia dan Arab. Untuk soal, field `_tr` diisi salinan field `_id`, supaya skema tetap lengkap.
- **Pencarian global di header** (`searchAllBooks`): data Fathul Mu'in tidak ikut dimuat di awal. Jadi pencarian global hanya mencakup Fathul Mu'in setelah datanya dimuat. Pencarian utamanya tetap Cari Mas'alah di dalam kitab.
- **Peringkat hasil:** kecocokan di judul paling tinggi, lalu kata kunci, lalu ringkasan, lalu ibarah. Kata Indonesia bisa menemukan topik Arab lewat kata kunci peta, yang berisi istilah Indonesia dan Arab.
- **Sorotan Arab:** pencocokan dilakukan pada teks yang sudah dinormalkan (tanpa harakat). Sorotan dipasang pada teks asli, termasuk harakat, lewat pemetaan posisi karakter.
- **Contoh kata di layar pertama:** basmalah, jamak shalat, zakat fitrah, talak, ihram. Bisa diganti.
- **Pembuatan soal:** setiap topik menjadi satu soal.
  - `question_id`: pertanyaan kasus dalam bahasa Indonesia yang wajar, misalnya "Bagaimana kalau ragu sudah membaca basmalah di tengah Fatihah?", bukan sekadar judul.
  - `answer_id`: ringkasan, lalu ibarah dalam `<span lang='ar' dir='rtl'>`, lalu "Fathul Mu'in hlm N".
  - `clozeKeyWord`: satu kata Arab kunci dari ibarah.
  - `chapterId`: bab.
  - Pertanyaan ditulis oleh subagen secara bertahap. Hasilnya dicek dengan skrip: ibarah harus ada di halaman `hlm` itu, dan setiap topik harus punya tepat satu soal. Topik yang tidak lolos ditulis ulang.
- **Ekspor data:** skrip Python baru di `scripts/`, sejalan dengan `generate_*_data` yang sudah ada. Skrip ini membaca peta dan teks kitab, lalu menulis:
  - data topik dan halaman untuk Cari Mas'alah dan lembar halaman;
  - data soal.
  
  Keduanya dimuat dengan `import()` dinamis hanya saat kitab dibuka.

### Keputusan rinci setelah tinjauan (keputusan Claude)

- **Arti "beranda tidak berubah":** tampilannya tidak berubah. Pemilik berkata "biarkan saja sama, tinggal tambahkan pilihan kitab Fathul Mu'in". Kode `homeView.js` boleh diubah sedikit: tambahkan satu cabang di handler klik kartu, supaya `fathul` membuka `currentView: 'fathul'`. Kitab lain tetap ke `study`.
- **Pemuatan data:**
  - Skrip ekspor menulis file metadata kecil yang diimpor statis, berisi jumlah soal dan jumlah bab. Dengan begitu kartu beranda menampilkan angka yang benar tanpa memuat data besar.
  - Data topik, halaman, dan soal dimuat lewat `import()` dinamis. Ada pembungkus khusus Fathul Mu'in: ia menampilkan status memuat, mendaftarkan soal ke `booksData` / `bookSources`, lalu memasang view `study`/`exam`/`reader` yang sudah ada. View-view itu tidak dibuat async, sehingga enam kitab lain tidak tersentuh.
- **Riwayat dan lanjutkan sesi:** view `fathul` masuk ke history state `{view, book}` seperti view lain, jadi tombol back browser berfungsi. Kartu "lanjutkan" untuk sesi Fathul Mu'in memuat data dulu, lalu membuka Latihan Soal.
- **Halaman tanpa pemisah `ــ`:** ada 7 halaman seperti ini (372, 424, 426, 513, 514, 550, 569). Halaman-halaman itu ditampilkan sebagai satu blok syarah tanpa kotak matan.
- **Catatan kaki:** blok `_________` beserta baris di bawahnya ada di 112 halaman. Blok ini ditampilkan terpisah di bawah syarah, dengan judul kecil "Catatan kaki" dan huruf lebih kecil (minimal 11px di UI). Catatan kaki tidak dibuang.
- **Pencocokan ibarah dengan halaman:**
  - Pencocokan dilakukan pada teks yang sudah dinormalkan (tanpa harakat, spasi diringkas). Ibarah dipecah per baris dan per penanda `...` / `…`. Setiap potongan harus ditemukan di halaman `hlm` itu atau halaman berikutnya, karena ada ibarah yang melewati batas halaman.
  - Paragraf yang disorot di lembar adalah paragraf yang memuat potongan pertama.
  - Topik yang gagal dicocokkan tidak mengubah data peta. Topik itu dicatat di laporan ekspor, dan di situs tetap membuka halamannya tanpa sorotan paragraf.
- **Kata cloze:** satu kata Arab dari ibarah, diambil persis seperti tertulis di teks yang ditampilkan.
- **Soal disimpan statis:** soal ditulis subagen satu kali, lalu disimpan sebagai file data di repo. Build tidak membuat ulang soal, jadi hasilnya bisa diulang.
- **Metadata Turki untuk kartu:** isinya singkat supaya kartu tidak kosong di mode Turki: `titleTr` "Fethu'l-Muîn", `categoryTr` "Şâfiî Fıkhı", `descTr` dan `authorTr` satu kalimat. Isi kitab tetap Indonesia dan Arab. `chapterNameTr` diisi judul bab dalam bahasa Arab. `themeColor` dipilih dari hijau yang sudah ada di palet.
- **Mockup acuan:** `.superpowers/brainstorm/6255-1794993527/content/`, yaitu `halaman-lengkap.html` (kartu B dan lembar) dan `pintu-kitab.html` (layar pertama). Kartu beranda di mockup hanya sketsa. Yang dipakai adalah kartu asli Dersiam.

## Diserahkan ke pembangun

- Struktur file dan nama modul di `src/` (view baru, servis pencarian khusus Fathul Mu'in, komponen lembar).
- Format JSON hasil ekspor dan pembagian chunk.
- Detail gerak memakai `src/services/motion.js` yang sudah ada.
- Tes Vitest untuk: validasi ekspor (jumlah topik, setiap ibarah ada di halamannya), peringkat dan sorotan pencarian (termasuk Arab berharakat dan gundul), navigasi halaman, dan tidak berubahnya beranda.

## Selesai berarti

- `npm test` lulus, termasuk semua tes lama dan tes baru.
- `npm run build` berhasil.
- Bundel awal tidak membesar secara berarti.
- Mencari "basmalah", "البسملة", dan "بسملة" memberi hasil yang sama untuk topik hlm 70 dan 72, dengan sorotan di ketiga tempat (judul, ringkasan, ibarah).
- Lembar hlm 70 menampilkan matan, syarah lengkap, paragraf basmalah yang tersorot, dan tombol ke hlm 69 dan 71.
- 1.698 soal muncul di Latihan Soal, dan setiap jawabannya membawa hlm yang benar.
- Beranda terlihat sama seperti sebelumnya, dengan tambahan satu kartu kitab.
