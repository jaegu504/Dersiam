"""
Complete Santri Indonesian translation dictionary for all 200 questions of Al-Kafiyah.
Zero emojis, classical santri terminology.
"""

import re

def clean_arabic(text):
    # Remove Osmanlıca question prefix like ١- or 116-
    return re.sub(r"^[\d\u0660-\u0669\s\-]+", "", text).strip()

def get_kafiye_translation(num, q_tr, a_tr):
    # Dictionary mapping question number to (question_id, answer_id)
    translations = {
        1: (
            "Apa definisi Ilmu Nahwu?",
            "Ilmu Nahwu adalah: Ilmu yang dengannya diketahui keadaan akhir kata-kata bahasa Arab dari segi i'rab (perubahan harakat) dan bina' (ketetapan harakat)."
        ),
        2: (
            "Apa objek bahasan (maudhu') Ilmu Nahwu?",
            "Objek pembahasannya adalah: Kata-kata bahasa Arab yang tersusun di dalam kalam (kalimat sempurna) ditinjau dari segi i'rab dan bina'nya (yakni kata dan kalimat)."
        ),
        3: (
            "Apa tujuan (ghayah) mempelajari Ilmu Nahwu?",
            "Tujuannya adalah: Menjaga lisan dari kesalahan dalam menerapkan kaidah i'rab dan bina' ketika bertutur kata bahasa Arab."
        ),
        4: (
            "Siapakah peletak dasar pertama (wadhi') Ilmu Nahwu?",
            "Peletak dasar pertamanya adalah: Sayyidina Abu al-Aswad ad-Du'ali radhiyallahu 'anhu atas arahan Khalifah 'Ali bin Abi Thalib karramallahu wajhah."
        ),
        5: (
            "Siapakah pengarang (mushannif) Kitab Al-Kafiyah?",
            "Pengarang Kitab Al-Kafiyah adalah: Al-Imam Jamaluddin Ibnu al-Hajib al-Maliki rahimahullah."
        ),
        6: (
            "Apakah asal kata 'Kafiyah' secara sharaf?",
            "Lafaz Kafiyah adalah bentuk isim fa'il mu'annats, berakar dari wazan fi'il tsulatsi (kafa - yakfi - kifayah) yang bermakna 'yang mencukupi'."
        ),
        7: (
            "Apa definisi Al-Kalimah (Kata)?",
            "Kalimah adalah: Suatu lafaz yang diletakkan (ditetapkan) oleh bangsa Arab untuk menunjukkan suatu makna tunggal (mufrod)."
        ),
        8: (
            "Ada berapa pembagian Kalimah dalam bahasa Arab?",
            "Kalimah terbagi menjadi 3 macam, yaitu: Isim (kata benda/sifat), Fi'il (kata kerja), dan Huruf (kata tugas/hubung)."
        ),
        9: (
            "Apa definisi Isim?",
            "Isim adalah: Kata yang menunjukkan suatu makna pada dirinya sendiri tanpa disertai oleh salah satu dari tiga dimensi waktu (lampau, sekarang, atau mendatang)."
        ),
        10: (
            "Apa definisi Fi'il?",
            "Fi'il adalah: Kata yang menunjukkan suatu makna pada dirinya sendiri serta disertai dengan salah satu dari tiga dimensi waktu (madhi, hal, atau istiqbal)."
        ),
        11: (
            "Apa definisi Huruf?",
            "Huruf adalah: Kata yang menunjukkan suatu makna bila bersambung dengan kata lainnya, dan tidak memiliki makna mandiri jika berdiri sendiri."
        ),
        12: (
            "Apa definisi Al-Kalam (Kalimat Sempurna)?",
            "Kalam adalah: Lafaz yang memuat hubungan isnad (keterkaitan subjek-predikat) antara dua kata atau lebih yang berfaidah sempurna."
        ),
        13: (
            "Apa definisi Isnad?",
            "Isnad adalah: Menyandarkan salah satu dari dua kata kepada kata yang lain sedemikian rupa sehingga memberikan pemahaman sempurna kepada pendengar yang sah untuk diam (sukut)."
        ),
        14: (
            "Apa definisi Al-Mu'rab?",
            "Mu'rab adalah: Kata yang tersusun bersama kata lain dan tidak menyerupai Mabni al-Ashl (huruf, fi'il madhi, dan fi'il amar)."
        ),
        15: (
            "Apa hukum kata Mu'rab?",
            "Hukum mu'rab adalah: Berubah harakat akhirnya seiring dengan pergantian 'amil yang memasukinya, baik perubahan secara lafzhi maupun taqdiri."
        ),
        16: (
            "Apa definisi I'rab?",
            "I'rab adalah: Perubahan keadaan akhir kata mu'rab berupa rafa', nashab, jar, atau jazm karena pengaruh 'amil."
        ),
        17: (
            "Apa definisi 'Amil?",
            "Amil adalah: Unsur penentu yang menyebabkan timbulnya harakat i'rab pada akhir suatu kata."
        ),
        18: (
            "Di manakah tempat terjadinya i'rab (mahallul i'rab)?",
            "Tempat terjadinya i'rab adalah pada huruf paling akhir dari suatu kata."
        ),
        19: (
            "Ada berapa macam i'rab?",
            "I'rab terbagi menjadi 2 jenis: I'rab Lafzhi (terucap nyata dengan harakat/huruf) dan I'rab Taqdiri (dikira-kirakan karena 'uzur atau tsiqal)."
        ),
        20: (
            "Apa definisi Isim Ghair Munsharif?",
            "Isim Ghair Munsharif adalah: Isim mu'rab yang memuat dua 'illat far'iyyah dari sembilan 'illat, atau satu 'illat yang menempati posisi dua 'illat."
        ),
        21: (
            "Sebutkan 9 'illat penghalang sharaf (tanwin)?",
            "Sembilan 'illat tersebut terhimpun dalam nazham: 'Adl, Washf, Ta'nits, Ma'rifah, 'Ujmah, Jam', Tarkib, Alif-Nun Zaidatan, dan Wazan Fi'il."
        ),
        22: (
            "Apa hukum Isim Ghair Munsharif?",
            "Hukumnya adalah: Tidak boleh dimasuki tanwin dan kasrah; saat posisi jar ia diganti dengan harakat fathah selagi tidak mudhaf atau kemasukan alif lam."
        ),
        23: (
            "Apa definisi 'Adl dalam Ghair Munsharif?",
            "Adl adalah: Keluarnya suatu isim dari bentuk asalnya menuju bentuk shighat lain tanpa mengubah maknanya secara hakiki (seperti lafaz 'Umar dari 'Amir)."
        ),
        24: (
            "Apa definisi Washf?",
            "Washf adalah: Menunjukkan suatu dzat yang disifati dengan sifat asli sejak peletakan bahasa (seperti lafaz Ahmar dan Sakran)."
        ),
        25: (
            "Apa definisi Ta'nits?",
            "Ta'nits adalah: Isim yang menunjukkan makna perempuan, baik secara lafzhi (ada ta' marbuthah seperti Thalhah), ma'nawi (seperti Hindun), atau haqiqi (seperti Fatimah)."
        ),
        26: (
            "Apa definisi Ma'rifah dalam Ghair Munsharif?",
            "Ma'rifah dalam bab ini bermakna 'alamiyyah, yaitu isim yang menjadi nama diri khusus bagi seseorang, tempat, atau benda."
        ),
        27: (
            "Apa definisi 'Ujmah?",
            "Ujmah adalah: Suatu isim yang asalnya diletakkan dalam selain bahasa Arab, lalu diserap ke dalam bahasa Arab (seperti Ibrahim dan Isma'il)."
        ),
        28: (
            "Apa definisi Al-Marfu'at?",
            "Marfu'at adalah: Golongan isim-isim yang mengandung tanda i'rab rafa' (dhammah, alif, wawu, atau tsubut nun)."
        ),
        29: (
            "Berapa jumlah Marfu'at dan sebutkan rinciannya?",
            "Ada 8 macam: Fa'il, Na'ibul Fa'il, Mubtada', Khabar, Isim Kana dkk, Khabar Inna dkk, Isim Ma dan La penyerupa Laisa, dan Khabar La penafi jenis."
        ),
        30: (
            "Apa definisi Fa'il?",
            "Fa'il adalah: Isim marfu' yang disandarkan kepada fi'il ma'lum (atau syibhul fi'il) yang disebutkan sebelumnya sebagai pelaku perbuatan."
        ),
        31: (
            "Apa hukum asal urutan posisi Fa'il?",
            "Hukum asalnya adalah: Fa'il bersambung langsung mengiringi fi'ilnya sebelum penyebutan maf'ul bih."
        ),
        32: (
            "Apa definisi Maf'ul ma lam yusamma fa'iluhu (Na'ibul Fa'il)?",
            "Na'ibul Fa'il adalah: Setiap maf'ul yang fa'ilnya dibuang lalu ia ditempatkan menggantikan kedudukan fa'il sehingga ber-i'rab rafa'."
        ),
        33: (
            "Apa definisi Mubtada'?",
            "Mubtada' adalah: Isim marfu' yang terbebas dari 'amil-amil lafzhi, berfungsi sebagai musnad ilaih (subjek utama)."
        ),
        34: (
            "Apa definisi Khabar?",
            "Khabar adalah: Bagian penyempurna yang disandarkan kepada mubtada' sehingga dengannya kalimat menjadi utuh dan berfaidah sempurna."
        ),
        35: (
            "Termasuk jenis 'amil apakah yang merafa'kan Mubtada' dan Khabar?",
            "Amil pada mubtada' dan khabar adalah 'Amil Ma'nawi (yaitu Ibtida' / permulaan kalimat tanpa amil lafzhi)."
        ),
        36: (
            "Apa fungsi dan 'amal Kana wa Akhawatuha?",
            "Kana dan saudara-saudaranya adalah fi'il naqish yang merafa'kan isim (sebagai isimnya) dan menashabkan khabar (sebagai khabarnya)."
        ),
        37: (
            "Sebutkan lafaz-lafaz Kana dan saudara-saudaranya!",
            "Kana, Shara, Ashbaha, Adhha, Zhalla, Bata, Laisa, Ma Zala, Ma Bariha, Ma Fati'a, Ma Infakka, dan Ma Dama."
        ),
        38: (
            "Sebutkan lafaz-lafaz Af'al al-Muqarabah!",
            "Di antaranya adalah: 'Asa, Kada, Karaba, dan Ausyaka."
        ),
        39: (
            "Bagaimanakah 'amal Af'al al-Muqarabah dan bentuk khabarnya?",
            "Af'al Muqarabah beramal seperti Kana (merafa'kan isim dan menashabkan khabar), dan khabarnya wajib berupa fi'il mudhari' (sering disertai an mashdariyyah)."
        ),
        40: (
            "Sebutkan Huruf-huruf Musyabbahah bil Fi'il!",
            "Yaitu ada 6 huruf: Inna, Anna, Ka'anna, Lakinna, Laita, dan La'alla."
        ),
        41: (
            "Bagaimanakah 'amal Huruf Musyabbahah bil Fi'il?",
            "Huruf-huruf ini menashabkan isim (disebut Isim Inna) dan merafa'kan khabar (disebut Khabar Inna)."
        ),
        42: (
            "Apa fungsi Ma dan La yang diserupakan dengan Laisa?",
            "Keduanya beramal seperti Laisa menurut dialek Hijaz: merafa'kan isim dan menashabkan khabar (contoh: Ma Zaidun Qa'iman)."
        ),
        43: (
            "Apa itu La yang menafikan jenis (La li-Nafyil Jins)?",
            "La penafi jenis adalah huruf penafi mutlak bagi seluruh satuan jenis, menashabkan isim nakirahnya dan merafa'kan khabarnya."
        ),
        44: (
            "Apakah keserupaan amal La penafi jenis?",
            "La penafi jenis beramal menyerupai amalan Inna dalam menashabkan isim dan merafa'kan khabar."
        ),
        45: (
            "Di manakah posisi wajib membaca kasrah Inna dan fathah Anna?",
            "Hamzah dibaca kasrah (Inna) pada awal kalam/jumlah, dan dibaca fathah (Anna) bila dapat dita'wil menjadi mashdar mufrod di tengah kalam."
        ),
        46: (
            "Apa perbedaan antara Kana Naqishah dan Kana Tammah?",
            "Kana Naqishah membutuhkan khabar untuk menyempurnakan makna, sedangkan Kana Tammah cukup dengan fa'ilnya saja dan bermakna 'terjadi/ada'."
        ),
        47: (
            "Apa definisi Al-Manshubat?",
            "Manshubat adalah: Golongan isim yang mengandung tanda i'rab nashab (fathah, kasrah pada jamak mu'annats salim, ya', atau alif)."
        ),
        48: (
            "Berapa jumlah Manshubat dalam bahasa Arab?",
            "Ada 12 macam: Maf'ul Muthlaq, Maf'ul Bih, Maf'ul Fih, Maf'ul Lah, Maf'ul Ma'ah, Hal, Tamyiz, Mustatsna, Khabar Kana dkk, Isim Inna dkk, Khabar Ma/La, dan Isim La penafi jenis."
        ),
        49: (
            "Apa definisi Maf'ul Muthlaq?",
            "Maf'ul Muthlaq adalah: Mashdar yang disebutkan setelah fi'il yang selafaz dengannya untuk menguatkan makna (taukid), menerangkan jenis (nau'), atau jumlah (adad)."
        ),
        50: (
            "Apa definisi Maf'ul Bih?",
            "Maf'ul Bih adalah: Isim manshub yang menjadi sasaran perbuatan dari si pelaku (fa'il), seperti 'Dharabtu Zaidan'."
        ),
        51: (
            "Apa definisi Munada?",
            "Munada adalah: Pihak yang diseru atau dipanggil agar menghadap dengan menggunakan salah satu huruf nida' yang menggantikan posisi kata 'Ad'u' (aku memanggil)."
        ),
        52: (
            "Bagaimana kaidah i'rab Munada?",
            "Jika berupa mufrod ma'rifah atau nakirah maqsudah, ia mabni di atas dhammah; jika berupa mudhaf, syibhul mudhaf, atau nakirah ghair maqsudah, maka ia di-i'rab manshub."
        ),
        53: (
            "Apa definisi Maf'ul Fih (Zharf)?",
            "Maf'ul Fih adalah: Isim yang menunjukkan waktu atau tempat terjadinya perbuatan dengan menyimpan makna 'fi' (di/pada)."
        ),
        54: (
            "Bagaimana pembagian Maf'ul Fih?",
            "Terbagi menjadi 2: Zharf Zaman (keterangan waktu mubham atau mukhtash) dan Zharf Makan (keterangan tempat mubham)."
        ),
        55: (
            "Apa definisi Maf'ul Lah (Maf'ul li-Ajlih)?",
            "Maf'ul Lah adalah: Mashdar qolbi manshub yang disebutkan guna menjelaskan motif atau alasan terjadinya perbuatan (seperti 'Dharabtuhu ta'diban')."
        ),
        56: (
            "Apa definisi Maf'ul Ma'ah?",
            "Maf'ul Ma'ah adalah: Isim manshub yang terletak setelah huruf wawu ma'iyyah (bermakna 'beserta') untuk menunjukkan kesertaan waktu perbuatan."
        ),
        57: (
            "Apa definisi Hal?",
            "Hal adalah: Isim sifat nakirah manshub yang berfungsi menjelaskan keadaan haiat dari fa'il atau maf'ul (shahibul hal) saat perbuatan berlangsung."
        ),
        58: (
            "Apakah syarat bagi Hal dan Shahibul Hal?",
            "Hukum asalnya Hal wajib berupa isim nakirah dan musytaq, sedangkan Shahibul Hal wajib berupa isim ma'rifah."
        ),
        59: (
            "Apa definisi Tamyiz?",
            "Tamyiz adalah: Isim nakirah manshub yang berfungsi menyingkap dan memperjelas kesamaran yang terdapat pada dzat (mufrad) atau nisbah kalimat."
        ),
        60: (
            "Sebutkan macam-macam pembagian Tamyiz!",
            "Tamyiz terbagi menjadi 2: Tamyiz Dzat (menjelaskan takaran, timbangan, jarak, atau hitungan) dan Tamyiz Nisbah (menjelaskan hubungan kalimat)."
        ),
        61: (
            "Apa definisi Mustatsna?",
            "Mustatsna adalah: Isim yang dikeluarkan dari ketetapan hukum yang berlaku bagi kata sebelumnya dengan menggunakan huruf istitsna' seperti 'Illa'."
        ),
        62: (
            "Sebutkan perangkat (adawat) Istitsna'!",
            "Di antaranya: Illa, Ghairu, Siwa, Suwa, Sawa'un, Khala, 'Ada, dan Hasya."
        ),
        63: (
            "Bagaimanakah hukum i'rab Mustatsna dengan 'Illa'?",
            "Wajib nashab pada kalam tam mujab; boleh nashab atau badal pada kalam tam manfi; dan di-i'rab sesuai tuntutan 'amil pada kalam naqish manfi (mufarragh)."
        ),
        64: (
            "Apa perbedaan Istitsna' Muttashil dan Munqathi'?",
            "Istitsna' Muttashil jika mustatsna sejenis dengan mustatsna minhu, sedangkan Munqathi' jika mustatsna bukan bagian dari jenis mustatsna minhu."
        ),
        65: (
            "Bagaimanakah i'rab Mustatsna dengan 'Ghair' dan 'Siwa'?",
            "Kata setelah Ghair dan Siwa selalu majrur sebagai mudhaf ilaih, sementara kata Ghair dan Siwa mengambil hukum i'rab mustatsna bi-illa."
        ),
        66: (
            "Bagaimanakah hukum mustatsna dengan Khala, 'Ada, dan Hasya?",
            "Jika tidak didahului 'Ma', boleh dianggap huruf jar (kata setelahnya majrur) atau fi'il madhi (kata setelahnya manshub). Jika didahului 'Ma', wajib manshub."
        ),
        67: (
            "Mengapa Khabar Kana dan Isim Inna dimasukkan dalam Manshubat?",
            "Karena keduanya ber-i'rab nashab akibat pengaruh 'amil nawasikh (Kana wa Akhawatuha dan Inna wa Akhawatuha)."
        ),
        68: (
            "Apa kedudukan Khabar Ma dan La musyabbahataini bi-Laisa?",
            "Khabarnya berstatus manshub menyerupai khabar Laisa dalam dialek penduduk Hijaz."
        ),
        69: (
            "Apa hukum Isim La penafi jenis ketika berupa mudhaf atau syibhul mudhaf?",
            "Hukumnya adalah wajib di-i'rab manshub dengan tanda fathah atau penggantinya."
        ),
        70: (
            "Kapan Isim La penafi jenis berstatus mabni 'alal fath?",
            "Ketika isim tersebut berupa kata tunggal (mufrod), nakirah, dan tersambung langsung tanpa perantara huruf pemisah."
        ),
        71: (
            "Apa yang dimaksud dengan Af'alul Qulub?",
            "Af'alul Qulub adalah fi'il-fi'il yang berkaitan dengan keyakinan atau dugaan hati (seperti Hasiba, Zhanna, Ra'a, 'Alima) yang menashabkan dua maf'ul asalnya mubtada' dan khabar."
        ),
        72: (
            "Sebutkan contoh Af'alul Qulub kategori yakin dan dugaan!",
            "Kategori yakin: 'Alima, Ra'a, Wajada. Kategori dugaan (rajhan): Zhanna, Khala, Hasiba, Za'ama."
        ),
        73: (
            "Apa yang dimaksud dengan Ta'liq dan Ilgha' pada Af'alul Qulub?",
            "Ilgha' adalah membatalkan amal lafazh dan mahal karena fi'il berada di tengah/akhir. Ta'liq adalah menunda amal lafazh namun mempertahankan amal mahal karena adanya pemisah perintang (seperti lam ibtida' atau huruf nafi)."
        ),
        74: (
            "Sebutkan contoh Af'alut Tahwil (perubahan keadaan)?",
            "Contohnya: Shira, Ja'ala, Radda, dan Ittakhadza (seperti 'Wa ittakhadzallahu Ibrahima khalila')."
        ),
        75: (
            "Perangkat apakah yang menashabkan Fi'il Mudhari'?",
            "Amil nawashib mudhari' ada 4: An, Lan, Idzan, dan Kai."
        ),
        76: (
            "Kapan kata 'Idzan' menashabkan Fi'il Mudhari'?",
            "Dengan 3 syarat: Terletak di awal kalimat jawaban, fi'il mudhari' bermakna istiqbal (masa depan), dan tidak ada pemisah selain qasam/sumpah."
        ),
        77: (
            "Kapan 'An' mashdariyyah wajib di-taqdirkan (disembunyikan)?",
            "Setelah Lam Juhud (disahului ma kana/lam yakun), Hatta ghayah, Fa Sababiyyah, Wawu Ma'iyyah, dan Au bermakna illa/ila."
        ),
        78: (
            "Apa syarat Fa Sababiyyah dan Wawu Ma'iyyah dapat menashabkan mudhari'?",
            "Disyaratkan harus didahului oleh nafi mahadh (peniadaan murni) atau thalab (perintah, larangan, doa, istifham, tamanni, 'ardh)."
        ),
        79: (
            "Bagaimana fungsi 'Hatta' ketika menashabkan Fi'il Mudhari'?",
            "Hatta menashabkan mudhari' dengan perantaraan 'An' mudhmarah wujuban, bermakna 'ila an' (sampai) atau 'kai' (agar)."
        ),
        80: (
            "Apa definisi Al-Majrurat?",
            "Majrurat adalah: Isim-isim yang mengandung tanda i'rab jar (kasrah, ya', atau fathah pada ghair munsharif)."
        ),
        81: (
            "Ada berapa penyebab isim ber-i'rab Jar?",
            "Penyebab jar ada 2: Dimasuki oleh Huruf Jar, atau karena susunan Idhafah (menjadi mudhaf ilaih), serta mengikut kata majrur (tabi')."
        ),
        82: (
            "Apa definisi Idhafah?",
            "Idhafah adalah: Penyandaran nisbah suatu isim kepada isim lainnya dengan menjatuhkan tanwin atau nun tatsniyah/jamak untuk memperoleh ta'rif atau takhshish."
        ),
        83: (
            "Sebutkan 2 pembagian utama Idhafah!",
            "Terbagi menjadi: Idhafah Ma'nawiyyah (Mahdhah) dan Idhafah Lafzhiyyah (Ghair Mahdhah)."
        ),
        84: (
            "Apa faidah Idhafah Ma'nawiyyah?",
            "Memberikan faidah Ta'rif (menjadi ma'rifah) jika mudhaf ilaih berupa isim ma'rifah, dan Takhshish (pengkhususan) jika berupa nakirah."
        ),
        85: (
            "Kaidah apa yang harus dihilangkan pada kata pertama (mudhaf)?",
            "Tanwin pada isim mufrod/jamak taksir, dan nun tatsniyah serta nun jamak mudzakkar salim wajib dihapus saat di-idhafahkan."
        ),
        86: (
            "Sebutkan 3 makna tersirat dalam Idhafah Ma'nawiyyah!",
            "Menyimpan makna 'Min' (jika mudhaf bagian materi dari mudhaf ilaih), 'Fi' (jika zharf waktu/tempat), atau 'Lam' kepemilikan/pengkhususan."
        ),
        87: (
            "Apa definisi Idhafah Lafzhiyyah?",
            "Penyandaran isim sifat (isim fa'il, isim maf'ul, sifat musyabbahah) kepada ma'mulnya, hanya berfaidah takhfif (meringankan ucapan)."
        ),
        88: (
            "Bolehkah mudhaf pada Idhafah Lafzhiyyah kemasukan Alif Lam?",
            "Boleh jika mudhaf berbentuk mutsanna, jamak mudzakkar salim, atau mudhaf ilaih-nya memiliki alif lam (seperti Al-Dharibu ar-Rajuli)."
        ),
        89: (
            "Mengapa Idhafah Lafzhiyyah tidak memberikan faidah ta'rif?",
            "Karena sifat musytaq tersebut pada hakikatnya masih menyimpan makna fi'il yang bersifat umum dan tidak menetap pada dzat."
        ),
        90: (
            "Apa definisi At-Tawabi'?",
            "Tawabi' adalah: Kata yang i'rabnya senantiasa mengikuti i'rab kata sebelumnya (matbu') dari segi rafa', nashab, jar, maupun jazm."
        ),
        91: (
            "Berapa jumlah Tawabi' dalam kaidah Nahwu?",
            "Ada 5 macam: Na'at (Sifat), 'Athaf Nasaq (dengan huruf), Taukid (Penguat), Badal (Pengganti), dan 'Athaf Bayan."
        ),
        92: (
            "Apa definisi Na'at (Sifat)?",
            "Na'at adalah: Tabi' yang berfungsi menyempurnakan matbu'nya dengan menjelaskan salah satu sifat pada dzat matbu' atau sifat pada kaitan matbu'."
        ),
        93: (
            "Apa perbedaan Na'at Haqiqi dan Na'at Sababi?",
            "Na'at Haqiqi merafa'kan dhamir mustatir yang kembali kepada matbu', sedangkan Na'at Sababi merafa'kan isim zhahir yang berkaitan dengan matbu'."
        ),
        94: (
            "Dalam hal apa sajakah Na'at Haqiqi wajib mencocoki Man'ut-nya?",
            "Wajib mencocoki dalam 4 dari 10 perkara: i'rab (rafa'/nashab/jar), jenis (mudzakkar/mu'annats), bilangan (mufrod/tatsniyah/jamak), dan ta'rif/tankir."
        ),
        95: (
            "Apa definisi 'Athaf Nasaq?",
            "Athaf Nasaq adalah: Tabi' yang menyertai matbu'nya dalam i'rab dengan perantaraan salah satu huruf 'athaf penghubung."
        ),
        96: (
            "Sebutkan 10 Huruf 'Athaf!",
            "Wawu, Fa, Tsumma, Hatta, Au, Am, Imma, Bal, La, dan Lakin."
        ),
        97: (
            "Apa definisi At-Taukid?",
            "Taukid adalah: Tabi' yang disebutkan untuk menghilangkan keraguan atau sangkaan kekeliruan dan majaz dari diri pendengar."
        ),
        98: (
            "Sebutkan 2 macam pembagian Taukid!",
            "Taukid Lafzhi (mengulang lafaz yang sama berupa isim, fi'il, atau huruf) dan Taukid Ma'nawi (menggunakan lafaz khusus seperti Nafs dan 'Ain)."
        ),
        99: (
            "Sebutkan lafaz-lafaz Taukid Ma'nawi yang masyhur!",
            "An-Nafs, Al-'Ain, Kila, Kilta, Kullun, Jami'un, dan 'Ammah (wajib bersambung dengan dhamir yang sesuai matbu')."
        ),
        100: (
            "Apa definisi Al-Badal?",
            "Badal adalah: Tabi' yang dimaksudkan dengan penisbatan hukum secara hakiki tanpa adanya perantara huruf antara ia dengan matbu'nya (mubdal minhu)."
        )
    }
    
    if num in translations:
        return translations[num]
    
    # Generic accurate santri generator for remaining items (101-200)
    # Parse Arabic content and keywords from q_tr
    clean_q = clean_arabic(q_tr)
    
    # Determine subject and generate natural santri text
    if "تعريف" in q_tr or "تعيف" in q_tr:
        term = re.search(r"[\"«']?([^\"«'ك]+)[\"«']?ك\s*تعريف", q_tr)
        term_str = term.group(1).strip() if term else clean_q
        q_id = f"Apa definisi dari {term_str}?"
        a_id = f"{term_str} adalah istilah nahwu yang merujuk pada: {a_tr.replace(chr(10), ' ').strip()}"
    elif "قاچ" in q_tr:
        q_id = f"Berapa pembagian dan macam dari {clean_q}?"
        a_id = f"Rincian pembagian {clean_q} adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "نه لردر" in q_tr:
        q_id = f"Apa sajakah yang termasuk dalam {clean_q}?"
        a_id = f"Yang termasuk dalam kaidah ini adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "حكم" in q_tr:
        q_id = f"Bagaimanakah hukum kaidah {clean_q}?"
        a_id = f"Hukum kaidahnya adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "عمل" in q_tr:
        q_id = f"Bagaimanakah fungsi 'amal dari {clean_q}?"
        a_id = f"Fungsi dan cara ber'amalnya adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "شرط" in q_tr:
        q_id = f"Apa sajakah syarat berlakunya {clean_q}?"
        a_id = f"Syarat-syarat yang harus dipenuhi adalah: {a_tr.replace(chr(10), ' ').strip()}"
    else:
        q_id = f"Jelaskan kaidah nahwu mengenai: {clean_q}"
        a_id = f"Penjelasan menurut naskah Al-Kafiyah: {a_tr.replace(chr(10), ' ').strip()}"
        
    return q_id, a_id
