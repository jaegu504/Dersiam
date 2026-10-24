# Dersiam (درس عام) - 6-Kitab Klasik Medrese Soru Cevap Portali

[![Live Site](https://img.shields.io/badge/Live-dersiam.netlify.app-8E5028?style=for-the-badge)](https://dersiam.netlify.app)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-169%20Passing-success?style=for-the-badge)](https://vitest.dev/)
[![Bilingual](https://img.shields.io/badge/I18N-Osmanlıca%20%7C%20Türkçe%20%7C%20Indonesia-D48B47?style=for-the-badge)](#dwibahasa-santri-penuh)

**Dersiam** adalah platform web interaktif muthala'ah (mütalaa) dan pengujian hafalan modern berbasis flashcard yang didesain khusus bagi para santri, thalabul ilmi, dan pelajar madrasah klasik Islam (*Osmanlı medrese geleneği*). 

Aplikasi ini menyajikan 786 butir tanya-jawab otentik dari 6 kitab mu'tabar dalam satu portal yang cepat, elegan, dan ramah seluler (*mobile-first*).

---

## 6 Kitab Rujukan Utama

1. **Mukhtasar al-Quduri (مختصر القدوري)** — *Fikih Mazhab Hanafi* (268 Soal-Jawab, 9 Bab Lengkap: Mukaddimah, Thaharah, Shalat, Zakat, Puasa, Haji, Muamalat, Nikah, Uqubat).
2. **Talkhis al-Miftah (تلخيص المفتاح)** — *Balaghah: Ma'ani, Bayan, Badi'* (182 Soal-Jawab, 7 Bab Lengkap).
3. **Al-Kafiyah fi an-Nahwi (الكافية في النحو)** — *Ilmu Nahwu* (140 Soal-Jawab, 5 Bab Lengkap: Isim Mu'rab, Mabni, Fi'il, Huruf, Mukaddimah).
4. **Manar al-Anwar (منار الأنوار)** — *Ushul Fiqh* (77 Soal-Jawab, 5 Bab Lengkap: Khas/Aam, Amar/Nahi, Hakikat/Majaz, Sunnah, Qiyas).
5. **Matn al-'Aqa'id an-Nasafiyyah (متن العقائد النسفية)** — *Akidah & Ilmu Kalam* (61 Soal-Jawab, 4 Bab Lengkap: Haqaiq al-Asyya', Huduts al-'Alam, Sifat Ilahiyyah, Nubuwah).
6. **Kitab al-Maqshud (كتاب المقصود)** — *Ilmu Sharaf* (58 Soal-Jawab, 4 Bab Lengkap).

---

## Fitur Utama

### 1. 100% Dwibahasa Penuh (Türkçe / Osmanlıca ⇄ Bahasa Indonesia)
* Seluruh teks tanya-jawab tersedia dalam dua bahasa: teks asli berhuruf Arab/Osmanlıca (*Amiri & Scheherazade New*) dan terjemahan Bahasa Indonesia santri yang mudah dipahami.
* Antarmuka aplikasi (header, tombol kontrol, lencana bab, dialog pengaturan, hingga modal penjelasan algoritma) berganti bahasa secara instan dalam 1 klik tanpa memuat ulang halaman (*zero page reload*).

### 2. Tiga Mode Pembelajaran Fleksibel
* **Mode Kartu Muthala'ah (Flashcard)**: 
  * Buka/tutup jawaban dengan animasi lembut.
  * Tombol evaluasi mandiri di dalam jawaban (*Hatırladım / Dihafal* vs *Tekrar Et / Perlu Diulang*).
  * Tanda bintang (*Starred*) untuk menandai soal penting/sulit.
  * Catatan faidah (*Faide Notu*) pribadi yang tersimpan otomatis di perangkat.
  * Tombol salin teks soal dan jawaban dengan format rapi.
* **Mode Simulasi Ujian Lisan (Sözlü İmtihan 30 Detik)**:
  * Hitung mundur 30 detik dengan indikator warna dan nada pengingat haptic Web Audio API.
  * Tombol periksa jawaban dan navigasi soal berkelanjutan (*continuous exam flow*).
* **Mode Tebak Kata Kunci (Boşluk Doldurma / Cloze Deletion)**:
  * Menyamarkan kata kunci penting ibarat matan menjadi `[ • • • ? • • • ]`.
  * Tombol intip kata kunci hilang dengan efek sorot cahaya (*glowing highlight*).
* **Mode Baca Berkelanjutan (Düz Okuma Feed)**:
  * Alur vertikal membaca mentahan seluruh soal dan jawaban kitab dalam satu halaman.
  * Dilengkapi filter pencarian teks cepat langsung di feed.

### 3. Mesin Pencari Cerdas Universal (Bilingual Search)
* Cari soal dari seluruh kitab secara serentak (*cross-book search*).
* Mendukung pengetikan bahasa Indonesia maupun bahasa Turki/Arab (otomatis menormalkan teks Arab berharakat maupun gundul).
* Fitur *Deep Jump*: Mengklik hasil pencarian langsung membuka kartu soal terkait di bab yang sesuai.

### 4. Tiga Algoritma Pengacakan Soal
* **Original Random**: Algoritma acak klasik berbasis siklus anti-duplikasi, menjamin seluruh soal dalam cakupan muncul sebelum ada pengulangan.
* **Sequential**: Membaca soal secara berurutan sesuai nomor asli kitab dan bab.
* **Spaced Repetition**: Memberikan bobot 3x lebih sering pada soal yang ditandai *Perlu Diulang* (*Tekrar Et*) dan soal berbintang.
* Tersedia tombol penjelasan matematika dan alur kerja algoritma `(?)` di menu pengaturan.

### 5. Desain Tactile Neumorphism (Dual-Theme)
* **Warm Ivory (Mode Terang)**: Nuansa kertas perkamen kitab kuno yang lembut dan nyaman di mata (`#F5F2EA`).
* **Obsidian Cyber-Scholar (Mode Gelap)**: Nuansa gelap elegan hemat baterai dengan aksen tembikar/emas (`#0F141F`).
* **100% Bebas Emoji**: Seluruh ikon menggunakan vektor SVG inline murni yang bersih dan profesional.

### 6. Synthesizer Audio Haptic Murni (Web Audio API)
* Efek suara sintetis langsung dihasilkan oleh Web Audio API peramban (*click*, *flip*, dan *chime*) dengan ukuran 0 KB (tanpa membebani kuota internet santri).
* Dilengkapi tombol pengatur mode hening (*Mute*).

---

## Arsitektur Teknis

* **Frontend**: Vanilla ES Modules (Modern JavaScript ES2022) — *Zero heavy frameworks, blazing fast*.
* **Styling**: Pure Modern CSS dengan CSS Variables, Fluid Typography (`clamp`), Soft Neumorphic Shadows, dan Mobile-First Media Queries.
* **Bundler & Dev Server**: Vite 5.
* **Pengujian Otomatis**: Vitest + Happy-DOM (169 unit & integration tests).
* **Penyimpanan Lokal**: `localStorage` terstruktur dengan auto-save progress dan reset data.
* **Continuous Deployment**: Terhubung langsung ke Netlify melalui repository GitHub (`jaegu504/Dersiam`). Setiap push ke branch `main` langsung memicu automated production build.

---

## Menjalankan Proyek Secara Lokal

### Prasyarat
* Node.js versi 18 atau lebih tinggi
* npm / pnpm / yarn

### Langkah Instalasi
```bash
# Clone repository
git clone https://github.com/jaegu504/Dersiam.git
cd Dersiam

# Pasang dependensi
npm install

# Jalankan server pengembangan lokal (Vite)
npm run dev

# Jalankan seluruh rangkaian tes otomatis
npm test

# Buat berkas produksi yang dioptimasi
npm run build
```

---

## Lisensi
Didistribusikan untuk kemaslahatan santri dan penuntut ilmu agama Islam. Bebas digunakan, dipelajari, dan dikembangkan kembali.
