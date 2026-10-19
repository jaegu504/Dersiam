# Spesifikasi Desain: Portal Soru Cevap 5 Kitab Klasik

**Tanggal Dokumen:** 19 Oktober 2026  
**Status:** Rancangan Siap Tinjau (Draft for Builder Check)  
**Target Platform:** Mobile-First & Desktop Web Application (PWA Offline-Ready)  
**Teknologi Utama:** Modern Responsive SPA (Single Page Application), Neumorphism Soft UI, Local-First Architecture

---

## 1. Latar Belakang & Tujuan (Intent & The Why)

### 1.1 Latar Belakang
Pengguna memiliki beberapa repositori web terpisah untuk latihan soal-jawab dan hafalan kitab madrasah klasik (*Mukhtasar al-Quduri*, *Talkhis al-Miftah*, *Al-Kafiyah*, *Manar al-Anwar*, dan *Matn al-'Aqa'id*). Sebagian kitab memiliki data dwibahasa (Osmanlıca dan Indonesia), namun terpencar dalam repositori yang berbeda dengan tampilan web sederhana.

### 1.2 Tujuan Utama (The Why)
Mempersatukan seluruh 5 kitab kurikulum klasik madrasah ke dalam **satu portal web modern terintegrasi** yang memukau secara visual ("*Wah, bagus dan rapi ya!*") dan ergonomis saat digunakan muthala'ah berjam-jam oleh para santri dan thalabul ilmi, baik di Turki maupun di Indonesia.

---

## 2. Sasaran, Batasan & Anti-Goals

### 2.1 Sasaran (Goals)
1. **Penyatuan 5 Kitab Inti:** Mengintegrasikan seluruh database soal dan jawaban dari *Kudûrî Şerîf* (Fikih), *Telhîsu'l-Miftâh* (Balaghah), *el-Kâfiye* (Nahwu), *Menâru'l-Envâr* (Ushul Fiqh), dan *Metn-i Akāid* (Akidah).
2. **Dwi-Bahasa Penuh (Osmanlıca ⇄ Bahasa Indonesia Santri):** Seluruh antarmuka UI, menu navigasi, penjelasan fitur, serta materi pertanyaan dan jawaban kitab dapat beralih secara mulus dan akurat antara teks Osmanlıca (Turki Utsmani) dan Bahasa Indonesia santri yang mudah dipahami.
3. **Desain Taktil Neumorphic (Soft UI) Dwitarget:**
   * *Light Mode:* Nuansa kertas perkamen hangat (*Warm Ivory & Sand* `#F5F2EA`) dengan bayangan timbul lembut ganda.
   * *Dark Mode:* Nuansa batu obsidian gelap pekat (*Obsidian Cyber-Slate* `#0F141F`) dengan *rim-lighting* tipis dan aksen glow halus.
   * Peralihan mode dilakukan melalui **satu tombol matahari/bulan** yang anggun.
4. **Alur Navigasi 2 Layar (Beranda ⇄ Ruang Belajar):**
   * *Layar Beranda (Home / Kitap Seçimi):* Kartu timbul 5 kitab besar. Pada layar ini, tombol Home dan nama kitab **sama sekali tidak muncul**.
   * *Layar Ruang Belajar (Study View):* Begitu salah satu kitab dipilih, bar atas menampilkan tombol `[ 🏠 Ana Sayfa ]` dan di samping kanannya langsung tertulis nama kitab yang sedang dipelajari.
5. **Dashboard Evaluasi Belajar (Sidebar Kiri di Desktop / Menu di Mobile):**
   * Menampilkan metrik belajar berbasis formula pasti:
     * Persentase khatam (**% Tamamlanma**): `(jumlah soal unik yang telah dipelajari / total soal dalam kitab atau bab aktif) * 100%`.
     * Rasio penguasaan hafalan (**Kavrama Oranı**): `rememberedIds.length / (rememberedIds.length + repeatIds.length) * 100%`. Jika belum ada evaluasi, bernilai 0%.
     * Bilah progres per bab (*bölüm ilerleme çubukları*) dan filter soal berbintang (*Yıldızlılar*).
     * Status `rememberedIds` dan `repeatIds` bersifat **mutually exclusive**: jika pengguna menandai suatu soal sebagai `Hatırladım`, ID soal tersebut otomatis dihapus dari daftar `repeatIds`, begitu juga sebaliknya.
6. **Kontrol Interaksi Taktil (Floating Action Dock & Evaluasi Cepat):**
   * Dock kontrol bawah yang mudah dijangkau jempol: `[ ◀ Geri ]`, tombol utama timbul `[ 👁️ Cevabı Gör / Gizle ]`, dan `[ İleri ▶ ]`.
   * **Tombol Evaluasi Hafalan Mandiri:** Begitu tombol `Cevabı Gör` ditekan dan jawaban terbuka, dua tombol evaluasi taktil muncul di dalam kotak jawaban:
     * `[ ✕ Tekrar Et ]` (aksen merah lembut): mencatat soal ke `repeatIds` untuk diulang kembali.
     * `[ ✓ Hatırladım ]` (aksen hijau zamrud): mencatat soal ke `rememberedIds` sebagai soal yang sudah dikuasai.
     * Pengguna tidak dipaksa auto-advance secara mendadak agar sempat membaca jawaban dengan tenang, lalu dapat menekan `[ İleri ▶ ]` atau shortcut keyboard (Panah Kanan) saat siap.
   * Mendukung gestur usap (*swipe left/right*) di layar sentuh HP dan shortcut keyboard (Spasi / Panah Kanan-Kiri) di desktop.
7. **Pilihan Algoritma Pengacakan di Menu Pengaturan (Ayarlar):**
   * *Opsi 1 (Orijinal Rastgele - Bawaan):* Menggunakan algoritma kode asli lama berbasis pelacak riwayat (`displayedQuestionIndices`), menjamin tidak ada soal yang berulang sebelum seluruh soal dalam bab/kitab habis.
   * *Opsi 2 (Sıralı Mod):* Menampilkan soal berurutan dari nomor 1 sampai akhir.
   * *Opsi 3 (Akıllı Tekrar / Spaced Repetition):* Memprioritaskan soal-soal sulit yang berada di dalam daftar `repeatIds` (bobot kemunculan 3x lipat).
   * Dilengkapi tombol tanda tanya **`(?)`** yang memunculkan pop-up penjelasan alur kerja masing-masing algoritma secara detail dalam dua bahasa (Turki dan Indonesia).
8. **Pencarian Global Antar-Kitab (Universal Global Search):**
   * Ikon kaca pembesar SVG di bar atas membuka dialog pencarian instan ke seluruh database 5 kitab sekaligus.
   * Mengetik kata kunci (Arab, Turki, atau Indonesia) langsung memfilter hasil secara instan.
   * **Alur Deep-Jump:** Mengeklik hasil pencarian akan langsung menutup modal pencarian, beralih ke kitab terkait (`activeBook`), mengatur bab terkait, memuat kartu soal tersebut, dan mencatatnya ke antrean riwayat agar tidak langsung muncul berulang.
9. **Fitur Pendukung Khusus Santri & Mode Belajar Alternatif:**
   * **Mode Ujian (İmtihan Modu):** Tampilan ruang ujian khusus dengan tombol keluar kapan saja `[ İmtihandan Çık ✕ ]`.
     * *Sub-mode 1: Sözlü İmtihan (Simulasi Ujian Lisan Syafahi):* Pengatur waktu hitung mundur 30 detik untuk menjawab secara lisan mandiri sebelum memeriksa kunci jawaban. Menekan tombol `[ Cevabı Kontrol Et ✓ ]` akan menampilkan kunci jawaban yang benar.
     * *Sub-mode 2: Boşluk Doldurma (Tebak Kata Kunci):*
       * **State Awal (Tersembunyi):** Kata kunci pada jawaban disembunyikan dan diganti dengan placeholder kotak titik-titik oranye `[ • • • ? • • • ]`. Santri ditantang mengingat kata yang hilang.
       * **State Terbuka:** Menekan tombol `[ Eksik Kelimeyi Göster / Tampilkan Kata Hilang ]` akan memunculkan kata kunci yang benar dengan highlight hijau berkilau `[ kata ]`.
       * **Mekanisme Fallback Otomatis:** Jika ada butir soal di database yang belum memiliki metadata `clozeKeyWord` eksplisit, sistem secara otomatis mengambil kata kunci istilah terpenting (kata benda/istilah terpanjang) sebagai target yang dikosongkan.
     * *Navigasi Berkelanjutan (Continuous Multi-Question Practice):* Pada kedua sub-mode ujian, tersedia tombol `[ Sonraki Soru ▶ / Soal Selanjutnya ▶ ]`. Setelah santri memeriksa kunci jawaban atau menampilkan kata yang hilang, menekan tombol ini akan langsung memuat soal berikutnya dalam antrean ujian, menyetel ulang hitung mundur 30 detik, menyamarkan kembali kata kunci ke bentuk titik-titik `[ • • • ? • • • ]`, dan menyembunyikan jawaban sebelumnya sehingga santri dapat menguji kemampuan hafalannya secara terus-menerus tanpa batas.
   * **Mode Düz Okuma (Raw Reader List):** Tampilan membaca mengalir satu halaman tanpa perlu mengacak kartu, dilengkapi tombol keluar `[ Okumadan Çık ✕ ]`.
   * **Catatan Faidah Pribadi (Not Ekle):** Kotak catatan per soal untuk mencatat faidah penjelasan guru yang otomatis tersimpan di memori lokal (*localStorage*).
   * **Tombol Salin Teks (Metni Kopyala):** Satu klik untuk menyalin teks soal dan jawaban ke clipboard.
   * **Pengatur Ukuran Font Teks Arab/Latin:** Pilihan ukuran font di pengaturan dan toolbar.
   * **Audio Haptik & Mute:** Efek suara klik/flip kartu dengan sakelar bisu (*mute*).
10. **Pemilihan Lingkup Belajar (Study Scope):**
    * Pengguna dapat memilih belajar **Satu Kitab Penuh (Semua Bab)** atau **Bab Tertentu** melalui dropdown bab di atas kartu.
    * Ketika filter bab atau filter bintang diubah, antrean acak `displayedQuestionIndices` direset otomatis agar siklus belajar berjalan segar sesuai lingkup yang baru.
11. **Tipografi & Aset Visual:**
    * Font teks Latin menggunakan **Plus Jakarta Sans** (bobot Regular, SemiBold, Bold, dan ExtraBold).
    * Font teks Arab/Osmanlıca menggunakan font klasik yang jelas dan berharakat (**Amiri** / **Scheherazade New**).
    * **100% Bebas Emoji:** Seluruh ikon navigasi, status, bintang, grafik, dan tombol menggunakan path **SVG Vektor murni**.

### 2.2 Non-Goals (Hal yang Dikecualikan)
* Tidak menggunakan backend server dinamis atau database cloud (portal bekerja murni di sisi browser pengguna / *client-side*).
* Tidak memerlukan sistem autentikasi, akun pengguna, atau login (seluruh progres belajar, catatan, dan bintang disimpan di *localStorage* peramban pengguna).
* Tidak menyediakan tombol cetak lembaran fisik (*Print Cheatsheet*) sesuai instruksi pengguna.
* Tidak menyediakan rujukan kutipan matan asli terpisah di bawah kartu soal sesuai instruksi pengguna.

### 2.3 Anti-Goals (Hal yang Dilarang Keras)
* **Dilarang menggunakan ikon emotikon/emoji** pada antarmuka aplikasi.
* **Dilarang memunculkan tombol Home atau nama kitab di layar Beranda utama.**
* **Dilarang mencampuradukkan tata letak mobile dan desktop**; tata letak harus beradaptasi secara elegan dan terpisah menggunakan *CSS media queries* yang ketat.
* **Dilarang mengubah logika algoritma pengacakan asli** pada mode *Orijinal Rastgele*; perilakunya harus persis sama dengan kode repositori lama.

---

## 3. Arsitektur Antarmuka & Alur Pengguna (User Flow)

```mermaid
flowchart TD
    A["Layar 1: Beranda Utama (Kitap Seçimi)<br>• 5 Kartu Kitab Besar<br>• Logo Portal & Pencarian Global<br>• (Tombol Home & Nama Kitab Tersembunyi)"] -->|Pilih Salah Satu Kitab| B["Layar 2: Ruang Belajar Kitab (Study View)<br>• Header: [🏠 Ana Sayfa] + Nama Kitab Terpilih<br>• Sidebar Kiri: Dashboard Evaluasi<br>• Area Kanan: Kartu Soal & Controller Taktil"]
    
    B -->|Klik 🏠 Ana Sayfa| A
    B -->|Klik İmtihan Modu| C["Layar 3: Mode Ujian (İmtihan Modu)<br>• Tab 1: Sözlü İmtihan (Timer 30s)<br>• Tab 2: Boşluk Doldurma (Tebak Kata Kunci)<br>• Tombol [İmtihandan Çık ✕]"]
    C -->|Klik İmtihandan Çık| B

    B -->|Klik Düz Okuma Modu| D["Layar 4: Mode Baca Mentahan (Raw Reader List)<br>• Daftar Soal-Jawab Mengalir 1 Halaman<br>• Tombol [Okumadan Çık ✕]"]
    D -->|Klik Okumadan Çık| B

    B -->|Klik 🔍 Pencarian Global| G["Modal Pencarian Global<br>• Cari ke 5 Kitab Sekaligus<br>• Deep-jump langsung ke kartu soal terpilih"]
    G -->|Pilih Hasil Soal| B

    B -->|Klik ⚙️ Ayarlar| E["Dialog Modal: Pengaturan (Ayarlar)<br>• Tema: Warm Light ⇄ Obsidian Dark<br>• Pilihan Algoritma Pengacakan + Tombol (?)<br>• Ukuran Font Teks<br>• Reset Riwayat Belajar"]
    E -->|Klik Tombol (?) Pada Algoritma| F["Pop-up Window: Penjelasan Detail Cara Kerja Algoritma"]
```

---

## 4. Struktur Data (Data Schema)

Setiap kitab dikelola dalam struktur data TypeScript / JSON terstandarisasi:

```typescript
interface SoruCevapItem {
  id: string;               // ID unik, misal: "quduri-001"
  bookKey: "quduri" | "talhis" | "kafiye" | "menar" | "akaid";
  category: string;          // Kategori bab (misal: "mukaddimah", "taharah")
  chapterNameTr: string;    // Nama bab versi Turki (misal: "Mukaddime")
  chapterNameId: string;    // Nama bab versi Indonesia (misal: "Mukaddimah")
  originalNumber: number;   // Nomor urut soal asli di kitab
  question_tr: string;      // Pertanyaan Osmanlıca (aksara Arab/Utsmani)
  answer_tr: string;        // Jawaban Osmanlıca (aksara Arab/Utsmani)
  clozeKeyWord_tr?: string; // Kata kunci yang disamarkan dalam mode tebak kata (TR)
  question_id: string;      // Pertanyaan terjemahan Bahasa Indonesia santri
  answer_id: string;        // Jawaban terjemahan Bahasa Indonesia santri
  clozeKeyWord_id?: string; // Kata kunci yang disamarkan dalam mode tebak kata (ID)
}

interface UserBookProgress {
  bookKey: string;
  viewedIds: string[];      // ID soal unik yang pernah dibuka/dilihat
  rememberedIds: string[];  // ID soal yang ditandai "Hatırladım" (mutually exclusive)
  repeatIds: string[];      // ID soal yang ditandai "Tekrar Et" (mutually exclusive)
  starredIds: string[];     // ID soal yang ditandai bintang (Favorit)
  notes: Record<string, string>; // ID soal -> catatan faidah pribadi santri
  algorithm: "original" | "sequential" | "spaced";
  activeChapterFilter: string;   // "all" atau nama kategori bab tertentu
}
```

---

## 5. Logika Algoritma Pengacakan

### 5.1 Algoritma 1: Orijinal Rastgele (Bawaan Kode Asli Repositori)
```javascript
// Memilih indeks acak yang belum pernah keluar dalam siklus aktif
function getNextOriginalRandomQuestion(activeQuestions, displayedIndices) {
  if (displayedIndices.length >= activeQuestions.length) {
    displayedIndices.length = 0; // Reset siklus jika seluruh soal telah keluar
  }
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * activeQuestions.length);
  } while (displayedIndices.includes(randomIndex) && displayedIndices.length < activeQuestions.length);
  
  displayedIndices.push(randomIndex);
  return activeQuestions[randomIndex];
}
```

### 5.2 Algoritma 2: Sıralı Mod (Berurutan)
Menampilkan soal secara sekuensial berdasarkan `originalNumber` dari soal 1 sampai akhir.

### 5.3 Algoritma 3: Akıllı Tekrar (Spaced Repetition)
Memberikan peluang kemunculan 3x lipat lebih tinggi untuk butir soal yang berada di dalam daftar `repeatIds` atau `starredIds`, mempercepat pemantapan hafalan pada bagian-bagian yang masih sulit bagi santri.

---

## 6. Desain Visual & Sistem Warna (Neumorphism Soft UI)

### 6.1 Mode Terang (Warm Ivory Neumorphism)
* **Latar Belakang & Kartu:** `#F5F2EA` (Kertas perkamen hangat madrasah)
* **Bayangan Timbul (Raised):** `-6px -6px 14px rgba(255, 255, 255, 0.95), 6px 6px 14px rgba(198, 190, 178, 0.65)`
* **Bayangan Tekan (Debossed/Inset):** `inset 3px 3px 6px rgba(198, 190, 178, 0.7), inset -3px -3px 6px rgba(255, 255, 255, 0.95)`
* **Warna Teks Utama:** `#1E1B18` (Kontras tinggi memenuhi standar WCAG AAA)
* **Aksen Aktif:** `#059669` (Hijau zamrud klasik) & `#4F46E5` (Indigo tombol utama)

### 6.2 Mode Gelap (Obsidian Cyber-Slate Neumorphism)
* **Latar Belakang:** `#0F141F`
* **Permukaan Kartu:** `#131A29`
* **Bayangan Timbul (Raised):** `-5px -5px 12px rgba(255, 255, 255, 0.04), 6px 6px 16px rgba(0, 0, 0, 0.7)`
* **Bayangan Tekan (Debossed/Inset):** `inset 3px 3px 6px rgba(0, 0, 0, 0.8), inset -3px -3px 6px rgba(255, 255, 255, 0.05)`
* **Glow Aksen:** `rgba(56, 189, 248, 0.35)` (Cyan rim light) & `#10B981` (Emerald glow)

---

## 7. Keputusan Arsitektur & Resolusi Builder Check

Berikut adalah keputusan arsitektur final untuk menjawab 6 pertanyaan krusial dari *Builder Check*:

1. **Model Interaksi Tombol Evaluasi Hafalan ("Hatırlandı" vs "Tekrar Et"):**
   * Tombol `[ ✕ Tekrar Et ]` dan `[ ✓ Hatırladım ]` muncul di dalam area jawaban yang telah dibuka (`revealed-ans-box`).
   * Menekan salah satu tombol akan langsung mencatat status hafalan dan memunculkan konfirmasi feedback taktil ringkas. Transisi kartu berikutnya dilakukan saat pengguna siap dengan menekan `[ İleri ▶ ]` atau shortcut keyboard (Panah Kanan), sehingga santri tidak terburu-buru.
   * `rememberedIds` dan `repeatIds` bersifat **mutually exclusive**.

2. **Strategi Data Dwibahasa & Mekanisme Fallback Tebak Kata Kunci (Cloze):**
   * Seluruh database 5 kitab klasik akan diekstraksi dan disiapkan 100% lengkap dalam dwibahasa (Osmanlıca dan Bahasa Indonesia santri yang akurat).
   * Pada mode *Boşluk Doldurma*, jika suatu butir soal belum memiliki `clozeKeyWord` eksplisit, modul data memiliki *fallback auto-blanking*: sistem otomatis menyaring kata istilah terpenting (kata terpanjang yang bukan stopword) sebagai kata yang disamarkan.

3. **Formula Metrik Evaluasi Dashboard:**
   * **% Tamamlanma (Khatam):** `(viewedIds.length / totalQuestionsInScope) * 100%`.
   * **Kavrama Oranı (Tingkat Penguasaan):** `(rememberedIds.length / (rememberedIds.length + repeatIds.length)) * 100%`.

4. **Lingkup Belajar (Study Scope) & Pemilihan Bab:**
   * Pengguna dapat memilih belajar lintas kitab utuh (`Tüm Kitap`) atau per bab tertentu (`Bölüm Seçimi`).
   * Mengganti bab atau mengaktifkan filter bintang akan mereset antrean acak `displayedQuestionIndices` untuk cakupan yang baru.

5. **Siklus Sesi Mode Ujian (İmtihan Modu & Navigasi Antar-Soal):**
   * Mode Ujian bersifat latihan fokus mandiri (*self-paced practice*) berkelanjutan dengan tombol keluar instan `[ İmtihandan Çık ✕ ]`.
   * Pada *Sözlü İmtihan*, hitung mundur 30 detik memberikan tantangan spontanitas hafalan lisan, diikuti tombol periksa kunci jawaban.
   * Pada *Boşluk Doldurma*, kata kunci disembunyikan dalam placeholder titik-titik dan dibuka dengan tombol tampilkan kata.
   * Kedua sub-mode dilengkapi tombol `[ Sonraki Soru ▶ / Soal Selanjutnya ▶ ]` yang menyajikan butir-butir soal berikutnya secara terus-menerus dengan reset timer 30 detik otomatis, auto-masking kata kunci yang rapi, dan reset tampilan jawaban.

6. **Transisi Navigasi Pencarian Global:**
   * Mengeklik hasil pencarian akan langsung menutup modal pencarian, beralih ke kitab yang bersangkutan (`activeBook`), menyetel bab terkait, dan menampilkan kartu soal tersebut secara instan.
   * Soal tersebut dicatat ke dalam daftar kemunculan agar siklus acak tetap terjaga konsistensinya.

---

## 8. Hal yang Diserahkan kepada Builder (What's Left to the Builder)
1. Penataan struktur berkas modular di `src/data/` untuk masing-masing 5 kitab (`quduri.js`, `talhis.js`, `kafiye.js`, `menar.js`, `akaid.js`).
2. Implementasi Web Audio API sintetis (osilator frekuensi nada) untuk efek suara *click*, *flip*, dan *chime* yang taktil dan lembut.
3. Konfigurasi Service Worker dan `manifest.json` agar portal dapat diinstal sebagai Progressive Web App (PWA) dan berfungsi penuh saat offline tanpa koneksi internet.
