"""
Script to generate src/data/menar.js
Manar al-Anwar (Ushul Fiqh) - 60 Authentic Madrasah Q&A Items
Zero emojis - 100% Bilingual (Osmanlıca & Santri Indonesian)
"""

import json
import re

menar_questions_raw = [
    # --- Mukaddimah (Q1 - Q6) ---
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "١- \"علم اصول فقه\"ك تعريفى، موضوعى و غايه سى ندر؟",
        "a_tr": "تعريفى: شرعى فرعى حكم لرك تفصيلى دلائللردن استنباطنه يارايان قاعدەلرى بيلمكدر.\nموضوعى: شرعى حكم لرى اثبات ايتمك حيثيتندن شرعى دلائلدر.\nغايه سى: شرعى حكم لرى استنباط ايدوب ايكي جهان سعادتنه نائل اولمقدر.",
        "q_id": "Apa definisi, pokok bahasan (maudhu'), dan tujuan (ghayah) Ilmu Ushul Fiqh?",
        "a_id": "Definisi: Mengetahui kaidah-kaidah yang menjadi sarana untuk mengistinbath (menggali) hukum-hukum syar'i far'i dari dalil-dalilnya yang terperinci (tafshili).\nPokok bahasan: Dalil-dalil syar'i ditinjau dari sisi penetapan hukum syariat.\nTujuan: Mampu menggali hukum syar'i guna meraih kebahagiaan dunia dan akhirat."
    },
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "٢- منار الانوار كتابنك مصنفى كيمدر؟",
        "a_tr": "مصنفى: امام حافظ الدين ابو البركات عبد الله بن احمد النسفى حضرتلريدر (وفاتى ٧١٠ هـ).",
        "q_id": "Siapakah pengarang (mushannif) Kitab Manar al-Anwar?",
        "a_id": "Pengarangnya adalah Al-Imam Hafizhud Din Abul Barakat Abdullah bin Ahmad an-Nasafi rahimahullah (wafat 710 H)."
    },
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "٣- شريعتك اصلى دلائللرى قاچدر و نەلردر؟",
        "a_tr": "درتدر: كتاب الله، سنت رسول الله، اجماع امت و قياس شرعى در.",
        "q_id": "Ada berapa pokok dalil syariat (Adillatusy Syari'ah) dan apa sajakah itu?",
        "a_id": "Ada 4 dalil pokok: Kitabullah (Al-Qur'an), Sunnah Rasulullah (Hadits), Ijma' Ummat, dan Qiyas Syar'i."
    },
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "٤- \"كتاب الله\"ك اصولجيلر ياننده تعريفى ندر؟",
        "a_tr": "كتاب الله: رسول الله صلى الله عليه و سلم حضرتلرينه انزال قلنان، مصاحفده مكتوب اولان و تواتر يولي ايله نقل ايديلن نظم و معنانك اسميدر.",
        "q_id": "Apa definisi Kitabullah (Al-Qur'an) menurut para ulama ushul fiqh?",
        "a_id": "Kitabullah adalah nama bagi kesatuan nazham (lafaz) dan makna yang diturunkan kepada Rasulullah shallallahu 'alaihi wa sallam, termaktub dalam mushaf-mushaf, dan dinukil secara mutawatir."
    },
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "٥- قرآن كريمك نظمي ايله معناسي آره سنده كى علاقه ندر؟",
        "a_tr": "نظم ايله معنا آيريلمز بر بتوندر. يالكز معنى قرآن اولماديغي كبي يالكز نظم ده قرآن صاييلماز؛ حكم لر هر ايكيسندن چيقاريلير.",
        "q_id": "Bagaimana hubungan antara nazham (lafaz) dan makna di dalam Al-Qur'an?",
        "a_id": "Nazham dan makna merupakan satu kesatuan yang tidak terpisahkan. Makna semata tanpa lafaz bukanlah Al-Qur'an, dan lafaz tanpa makna juga bukan tujuan utama; hukum-hukum syariat digali dari kesatuan keduanya."
    },
    {
        "chapterId": "mukaddime",
        "chapterNameTr": "مقدمة و اصول شريعت",
        "chapterNameId": "Mukaddimah & Dalil Ushul Fiqh",
        "q_tr": "٦- منارده كتاب اللهك لفظلري قاچ جهتله تقسيم اولنمشدر؟",
        "a_tr": "درت جهتله تقسيم اولنمشدر: وضع اولنديغي معنى جهتندن، استعمالي جهتندن، ظهور و خفاسي جهتندن، و معنى يه دلالت طريقى جهتندن.",
        "q_id": "Berdasarkan Kitab Manar, dari berapa segi pembagian lafaz Al-Qur'an ditinjau?",
        "a_id": "Ditinjau dari 4 segi: Dari segi peletakan untuk makna (wadh'), penggunaannya (isti'mal), kejelasan dan kesamarannya (zhuhur wa khafa'), serta metode penunjukan lafaz terhadap makna (thuruq ad-dalalah)."
    },

    # --- Khas & 'Am (Q7 - Q13) ---
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "٧- \"خاص\"ك اصول فقهده كى تعريفى ندر؟",
        "a_tr": "خاص: معلوم و منفرد بر معنى ايچون وضع اولنان هر بر لفظدر؛ خواه شخص اولسون (زيد كبى)، خواه جنس اولسون (انسان كبى).",
        "q_id": "Apa definisi Al-Khas dalam istilah Ushul Fiqh?",
        "a_id": "Al-Khas adalah setiap lafaz yang diletakkan untuk menunjukkan makna tertentu yang mandiri secara tunggal, baik berupa individu (seperti Zaid) maupun jenis tertentu (seperti manusia)."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "٨- خاصك شرعى حكمى ندر؟",
        "a_tr": "خاصك حكمى: قطعيت اوزره كنديسيله عمل ايتمكك لزوميدر؛ باشقه بر دليله محتاج اولماقسزن موجبي ايله عمل واجب اولور.",
        "q_id": "Apakah hukum syar'i bagi lafaz Khas?",
        "a_id": "Hukum lafaz Khas adalah wajib diamalkan ketetapannya secara qath'i (pasti) tanpa membutuhkan dalil penjelas lain."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "٩- \"عام\"ك تعريفى ندر؟",
        "a_tr": "عام: بر دفعه ده حصر اولمقسزن لفظا كندي فردلرينك هپسنى شامل اولان لفظدر (انسانلر، هر كيم كبى).",
        "q_id": "Apa definisi Al-'Am dalam Ushul Fiqh?",
        "a_id": "Al-'Am adalah lafaz yang mencakup seluruh satuan individu maknanya sekaligus secara bahasa tanpa pembatasan jumlah tertentu (seperti lafaz sekalian manusia, barang siapa)."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "١٠- عامك الفاظي (صيغه لرى) نەلردر؟",
        "a_tr": "جمع معرف باللام، مفرد معرف باللام، نكره در سياق نفى، \"كل\" و \"جميع\" لفظلرى، و شرط اسملرى عام صيغه لريدر.",
        "q_id": "Apa sajakah shighat (bentuk lafaz) yang menunjukkan makna 'Am?",
        "a_id": "Bentuk isim jamak beralif-lam, isim mufrod beralif-lam jenis, isim nakirah dalam konteks nafi (peniadaan), lafaz 'kullun' dan 'jami'un', serta isim syarat dan isim istifham."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "١١- حنفى مذهبنده عامك دلالتى قطعى ميدر يوخسه ظنى ميدر؟",
        "a_tr": "حنفى لره كوره عام؛ تخصيصه اوغراماديغى مدّتجه دلالتنده قطعى در، خاص كبى حكم ايفاده ايدر.",
        "q_id": "Menurut madzhab Hanafi, apakah penunjukan lafaz 'Am bersifat qath'i atau zhanni?",
        "a_id": "Menurut ulama Hanafi, lafaz 'Am bersifat qath'i al-dalalah (pasti) selagi belum terkena takhshis (pengkhususan), sehingga kedudukan kekuatannya setara dengan lafaz Khas."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "١٢- تخصيص نه ديمكدر و شرطى ندر؟",
        "a_tr": "تخصيص: عامك بعض فرادلرينى حكمدن چيقارمقدر. شرطى: تخصيص ايدن دليلك عام ايله برابر ياخود متصل اولماسيدر.",
        "q_id": "Apa arti Takhshis dan apa syarat sahnya menurut madzhab Hanafi?",
        "a_id": "Takhshis adalah mengeluarkan sebagian satuan individu dari cakupan hukum lafaz 'Am. Syaratnya dalil penakhsis harus bersamaan atau bersambung (muttashil) dengan lafaz 'Am tersebut."
    },
    {
        "chapterId": "khas-am",
        "chapterNameTr": "مباحث الكتاب: خاص و عام",
        "chapterNameId": "Mabahits al-Kitab: Khas & 'Am",
        "q_tr": "١٣- تخصيصه اوغرادقدن صكره عامك حكمى ندر؟",
        "a_tr": "تخصيصه اوغرايان عامك باقي قالان فرادلرنده دلالتى ظنى اولور؛ آرتيق قياس و خبر واحد ايله تخصيص ايديلمسي جائز اولور.",
        "q_id": "Bagaimana hukum kekuatan lafaz 'Am setelah terkena takhshis?",
        "a_id": "Setelah sebagian satuannya ditakhsis, kekuatan sisa cakupan lafaz 'Am berubah menjadi zhanni, sehingga boleh ditakhsis lebih lanjut menggunakan qiyas atau khabar ahad."
    },

    # --- Musytarak & Mu'awwal (Q14 - Q18) ---
    {
        "chapterId": "musytarak-muawwal",
        "chapterNameTr": "مشترك و مؤول",
        "chapterNameId": "Musytarak & Mu'awwal",
        "q_tr": "١٤- \"مشترك\"ك تعريفى ندر؟",
        "a_tr": "مشترك: آيري آيري واضع ايله ياخود بردن فضله معنا ايچون بدل طريقى ايله وضع اولنان لفظدر (عين و قرء كبى).",
        "q_id": "Apa definisi Al-Musytarak dalam Ushul Fiqh?",
        "a_id": "Al-Musytarak adalah satu lafaz yang diletakkan untuk beberapa makna yang berbeda secara bergantian menurut asal penetapan bahasa (seperti kata 'Ain yang bermakna mata, mata air, atau emas; dan kata Quru' yang bermakna suci atau haidh)."
    },
    {
        "chapterId": "musytarak-muawwal",
        "chapterNameTr": "مشترك و مؤول",
        "chapterNameId": "Musytarak & Mu'awwal",
        "q_tr": "١٥- مشتركك حكمى ندر؟",
        "a_tr": "حكمى: معنالريندن برينى تعيين ايده جك بر قرينه و دليل بولونونجه يه قدر توقف ايتمك واجب اولور.",
        "q_id": "Apakah hukum pengamalan lafaz Musytarak?",
        "a_id": "Hukumnya adalah tawaqquf (menahan diri) sampai ditemukan dalil atau qarinah yang menguatkan dan menentukan salah satu maknanya."
    },
    {
        "chapterId": "musytarak-muawwal",
        "chapterNameTr": "مشترك و مؤول",
        "chapterNameId": "Musytarak & Mu'awwal",
        "q_tr": "١٦- \"مؤول\"ك تعريفى ندر؟",
        "a_tr": "مؤول: مشترك اولان لفظك معنالرندن برينك بر دليل و يا اجتهاد ايله ترجيح ايديلمسيدر.",
        "q_id": "Apa definisi Al-Mu'awwal?",
        "a_id": "Al-Mu'awwal adalah lafaz musytarak yang ditarjih (dikuatkan) salah satu dari kemungkinan maknanya berdasarkan dalil atau ijtihad mujtahid."
    },
    {
        "chapterId": "musytarak-muawwal",
        "chapterNameTr": "مشترك و مؤول",
        "chapterNameId": "Musytarak & Mu'awwal",
        "q_tr": "١٧- مؤولك حكمى ندر؟",
        "a_tr": "مؤولك حكمى: ظن غالب اوزره عملك واجب اولماسيدر؛ لابد خطاء احتمالى ده باقي قالير.",
        "q_id": "Apakah hukum pengamalan lafaz Mu'awwal?",
        "a_id": "Hukumnya adalah wajib diamalkan berdasarkan dugaan kuat (zhann ghalib), disertai adanya kemungkinan kekeliruan secara ijtihadi."
    },
    {
        "chapterId": "musytarak-muawwal",
        "chapterNameTr": "مشترك و مؤول",
        "chapterNameId": "Musytarak & Mu'awwal",
        "q_tr": "١٨- بر لفظدن عين آنده هم حقيقت هم مجاز مراد ايديله بيلير مى؟",
        "a_tr": "حنفى لره كوره بر لفظدن عين آنده هم حقيقي هم ده مجازي معناسنك برلكده اراده ايديلمسي جائز دكلدر.",
        "q_id": "Bolehkah menghendaki makna hakikat dan majaz secara bersamaan dari satu lafaz?",
        "a_id": "Menurut ulama madzhab Hanafi, tidak boleh menghimpun makna hakikat dan majaz sekaligus dari satu lafaz dalam satu konteks kalimat."
    },

    # --- Haqiqah, Majaz, Sarih & Kinayah (Q19 - Q25) ---
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "١٩- \"حقيقت\"ك تعريفى و قسملرى ندر؟",
        "a_tr": "حقيقت: اصل واضعنده كنديسي ايچون قونولمش اولديغي معنى ده قوللانيلان لفظدر. لغويه، شرعيه و عرفيه اولارق اوچه آيريلير.",
        "q_id": "Apa definisi Al-Haqiqah dan sebutkan pembagiannya?",
        "a_id": "Al-Haqiqah adalah lafaz yang digunakan pada makna asalnya sebagaimana ditetapkan oleh pembuat bahasa. Terbagi menjadi 3: Haqiqah Lughawiyyah, Haqiqah Syar'iyyah, dan Haqiqah 'Urfiyyah."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢٠- \"مجاز\"ك تعريفى و شرطى ندر؟",
        "a_tr": "مجاز: بر علاقه و قرينه سببي ايله اصل معناسنك غيرنده قوللانيلان لفظدر. شرطى: حقيقت ايله آره سنده بر علاقه نك وار اولماسيدر.",
        "q_id": "Apa definisi Al-Majaz dan apa syarat sahnya?",
        "a_id": "Al-Majaz adalah lafaz yang dialihkan dari makna aslinya ke makna lain karena adanya keterkaitan ('alaqah) serta tanda penyerta (qarinah) yang mencegah pemahaman makna hakiki."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢١- حقيقت ايله مجاز تعارض ايدرسه هانكسى مقدم اولور؟",
        "a_tr": "اصل اولان حقيقتدر؛ حقيقت ايله عمل ممكن اولدوغي مدّتجه مجازه كچيلمز، مگر كه حقيقت مهجور اولسون.",
        "q_id": "Jika terjadi pertentangan antara hakikat dan majaz, manakah yang didahulukan?",
        "a_id": "Kaidah asalnya hakikat yang didahulukan; selama makna hakiki masih memungkinkan untuk diamalkan maka tidak boleh beralih ke majaz, kecuali jika makna hakiki tersebut telah ditinggalkan dalam kebiasaan ('urf mahjur)."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢٢- \"صريح\"ك تعريفى ندر؟",
        "a_tr": "صريح: كثرت استعمال سببي ايله مراد اولنان معنى سى آچيق و پنهان سز اولان لفظدر (بيع، نكاح، طلاق كبى).",
        "q_id": "Apa definisi As-Sarih dalam hukum lafaz?",
        "a_id": "As-Sarih adalah lafaz yang terang maksud maknanya karena seringnya digunakan sehingga tidak memerlukan niat khusus (seperti kata jual, nikah, dan talak)."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢٣- صريحك حكمى ندر؟",
        "a_tr": "صريحك حكمى: نيته محتاج اولماقسزن حكمك ثبوتيدر؛ نيت ايديلمسه بيله حكم واقع اولور.",
        "q_id": "Apakah hukum pengamalan lafaz Sarih?",
        "a_id": "Hukum lafaz Sarih adalah hukum langsung berlaku secara sah tanpa tergantung pada niat hati si pengucap."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢٤- \"كنايه\"نك تعريفى ندر؟",
        "a_tr": "كنايه: مراد اولنان معنى سى كنديسنده كيزلي اولوب يالكز نيت و يا دلالت حال ايله آنلاشيلان لفظدر.",
        "q_id": "Apa definisi Al-Kinayah?",
        "a_id": "Al-Kinayah adalah lafaz yang maksud hakikinya tertutup atau tersamar, sehingga hukumnya tidak berlaku kecuali disertai niat atau indikator situasi pembicaraan."
    },
    {
        "chapterId": "haqiqah-majaz",
        "chapterNameTr": "حقيقت، مجاز، صريح و كنايه",
        "chapterNameId": "Haqiqah, Majaz, Sarih & Kinayah",
        "q_tr": "٢٥- كنايه نك حكمى ندر؟",
        "a_tr": "كنايه نك حكمى: حكمك ثبوتى نيت ايله و يا حالك دلالتى ايله مشروط اولماسيدر.",
        "q_id": "Apakah hukum pengamalan lafaz Kinayah?",
        "a_id": "Hukum lafaz Kinayah adalah keberlakuan hukumnya disyaratkan adanya niat yang tegas atau qarinah situasi pembicaraan."
    },

    # --- Amr & Nahy (Q26 - Q31) ---
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٢٦- \"امر\"ك تعريفى و اصل موجبي ندر؟",
        "a_tr": "امر: يو قاريدن آشاغييه دوغرو استعلا يولي ايله بر فعلڭ ايشلنمشسنى طلب ايتمكدر. اصل موجبي قطعى اولارق وجوبدر.",
        "q_id": "Apa definisi Al-Amr (Perintah) dan konsekuensi hukum asalnya?",
        "a_id": "Al-Amr adalah tuntutan untuk melakukan suatu perbuatan dari pihak yang lebih tinggi kedudukannya kepada pihak yang lebih rendah secara isti'la'. Konsekuensi hukum asalnya adalah menuntut kewajiban (wujub)."
    },
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٢٧- امر صيغه سى تكرار ايجاب ايدر مى؟",
        "a_tr": "حنفى لره كوره امرك مطلق صيغه سى تكرار ايجاب ايتمز؛ بر دفعه ياپيلماسيله امر يريئه كتيريلمش اولور، مگر كه بر شرطه باغلانسون.",
        "q_id": "Apakah shighat Amr (perintah) menuntut pengulangan (tikrar)?",
        "a_id": "Menurut ulama Hanafi, shighat perintah yang mutlak tidak menuntut pengulangan perbuatan; kewajiban telah gugur dengan melakukannya satu kali, kecuali jika dikaitkan dengan sebab yang berulang."
    },
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٢٨- امر فور (درهال ياپمق) ايجاب ايدر مى يوخسه تراخى (كيجيكديرمك) جائز ميدر؟",
        "a_tr": "مطلق امر فوري ايجاب ايتمز؛ عمرك هر هانكي بر وقتنده ياپيلماسي ايله امر صاقط اولور، لابد درهال ياپمق مستحبدر.",
        "q_id": "Apakah Amr menuntut pelaksanaan seketika (faur) ataukah boleh ditunda (tarakhi)?",
        "a_id": "Perintah mutlak pada asalnya tidak mewajibkan pelaksanaan seketika; kewajiban sah ditunaikan pada waktu kapan pun selama masa hidup, meskipun bersegera melaksanakannya dianjurkan."
    },
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٢٩- \"نهى\"ك تعريفى و اصل موجبي ندر؟",
        "a_tr": "نهى: استعلا يولي ايله بر فعلدن كف و ترك طلب ايتمكدر. اصل موجبي تحريمدير.",
        "q_id": "Apa definisi An-Nahy (Larangan) dan konsekuensi hukum asalnya?",
        "a_id": "An-Nahy adalah tuntutan dari pihak atasan untuk mencegah atau menahan diri dari suatu perbuatan. Konsekuensi hukum asalnya adalah keharaman mutlak (tahrim)."
    },
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٣٠- نهى فعلده فسادى اقتضا ايدر مى؟",
        "a_tr": "نهى ايديلمش شي عباداتده ايسه بطلانه سبب اولور؛ معاملاتده ايسه عيننه راجع ايسه باطل، وصفنه راجع ايسه فاسد اولور.",
        "q_id": "Apakah larangan (nahy) berkonsekuensi rusaknya (fasad/batal) perbuatan tersebut?",
        "a_id": "Dalam perkara ibadah larangan berkonsekuensi batalnya ibadah tersebut. Dalam mu'amalah jika larangan tertuju pada substansi akad maka akad batal, dan jika tertuju pada sifat luaran maka akad berstatus fasid."
    },
    {
        "chapterId": "amr-nahy",
        "chapterNameTr": "امر و نهى",
        "chapterNameId": "Amr & Nahy",
        "q_tr": "٣١- نهى دن صكره امر كليرسه نه ايفاده ايدر؟",
        "a_tr": "حظر و ياسقدن صكره كلن امر صيغه سى اباحه (مباحلق) ايفاده ايدر (آولانيكز آيتنده اولديغي كبى).",
        "q_id": "Apa faedah hukum perintah yang datang setelah adanya larangan?",
        "a_id": "Perintah yang datang sesudah adanya larangan berfungsi mengembalikan hukum ke status semula yaitu kebolehan (ibahah)."
    },

    # --- Tingkatan Kejelasan Lafaz (Q32 - Q39) ---
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٢- معنى نك ظهورى جهتندن الفاظ قاچ مرتبه در؟",
        "a_tr": "درت مرتبه در: ظاهر، نص، مفسر و محكم.",
        "q_id": "Ada berapa tingkatan lafaz Al-Qur'an ditinjau dari segi kejelasan maknanya?",
        "a_id": "Ada 4 tingkatan dari yang paling dasar hingga paling kuat: Azh-Zhahir, An-Nass, Al-Mufassar, dan Al-Muhkam."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٣- \"ظاهر\"ك تعريفى و حكمى ندر؟",
        "a_tr": "ظاهر: سياقك اصلى مقصودى اولمقسزن لفظك كنديسندن معنى سى آچيقجا آنلاشيلان لفظدر. حكمى: تاويل و تخصيص احتماليله برابر عملك وجوبيدر.",
        "q_id": "Apa definisi dan hukum lafaz Azh-Zhahir?",
        "a_id": "Azh-Zhahir adalah lafaz yang jelas maknanya dari pendengaran semata tanpa perlu penalaran mendalam, namun bukan menjadi tujuan utama susunan kalimat. Hukumnya wajib diamalkan seraya masih terbuka kemungkinan takwil dan takhshis."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٤- \"نص\"ك تعريفى و حكمى ندر؟",
        "a_tr": "نص: سياق كلامك اصلى مقصودى اولارق معنى سى آچيق اولان لفظدر. حكمى: ظاهردن قوي اولوب تاويل احتمالى اولارق عملك وجوبيدر.",
        "q_id": "Apa definisi dan hukum lafaz An-Nass?",
        "a_id": "An-Nass adalah lafaz yang maknanya sangat jelas dan susunan kalimat memang sengaja diungkapkan untuk menjelaskan makna tersebut. Kedudukannya lebih kuat dari zhahir dan wajib diamalkan."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٥- \"مفسر\"ك تعريفى و حكمى ندر؟",
        "a_tr": "مفسر: قطعى اولارق تاويل و تخصيص احتمالنى قالديران بر بيان ايله آچيقلا نمش لفظدر. حكمى: قطعى عمل اولوب يالكز عصر رسالتده نسخ قبول ايدردي.",
        "q_id": "Apa definisi dan hukum lafaz Al-Mufassar?",
        "a_id": "Al-Mufassar adalah lafaz yang maknanya dijelaskan secara tuntas sehingga menutup kemungkinan takwil dan takhshis. Wajib diamalkan secara pasti dan hanya menerima nasakh pada zaman kenabian."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٦- \"محكم\"ك تعريفى و حكمى ندر؟",
        "a_tr": "محكم: آچيقليغي سون درجه ده اولوب اصلاً تاويل، تخصيص و نسخه احتمال بولونمايان لفظدر (توحيد و ادلت حكم لرى كبى). حكمى: ابدى قطعى لزومدر.",
        "q_id": "Apa definisi dan hukum lafaz Al-Muhkam?",
        "a_id": "Al-Muhkam adalah tingkatan lafaz paling kuat yang maknanya sangat jelas dan sama sekali tidak menerima takwil, takhshis, maupun nasakh (seperti prinsip keadilan dan keesaan Allah). Hukumnya wajib diamalkan selamanya."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٧- معنى نك خفاسى (كيزليلك) جهتندن الفاظ قاچ مرتبه در؟",
        "a_tr": "درت مرتبه در: خفى، مشكل، مجمل و متشابه.",
        "q_id": "Ada berapa tingkatan lafaz Al-Qur'an ditinjau dari segi kesamaran maknanya?",
        "a_id": "Ada 4 tingkatan dari yang paling ringan hingga paling tersamar: Al-Khafi, Al-Musykil, Al-Mujmal, dan Al-Mutasyabih."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٨- \"خفى\" و \"مشكل\" نه ديمكدر؟",
        "a_tr": "خفى: بر عارض سببي ايله مرادى كيزلي قالان لفظدر (طرار و نباشه سارق دينلوب دينلمه مه سى كبى). مشكل: آنجاق طلب و تامل ايله آنلاشيلان درين لفظدر.",
        "q_id": "Apakah perbedaan antara Al-Khafi dan Al-Musykil?",
        "a_id": "Al-Khafi adalah lafaz yang tersamar maknanya karena faktor luar yang menempel pada objek (seperti penerapan istilah pencuri bagi pencopet). Al-Musykil adalah lafaz yang membutuhkan pencarian dan perenungan mendalam untuk memahaminya."
    },
    {
        "chapterId": "wujuh-al-bayan",
        "chapterNameTr": "وجوه بيان و خفا",
        "chapterNameId": "Kejelasan & Kesamaran Lafaz",
        "q_tr": "٣٩- \"مجمل\" و \"متشابه\" نه ديمكدر؟",
        "a_tr": "مجمل: يالكز شارعك بيانى ايله بيلينه بيلن لفظدر (صلوة و ربا كبى). متشابه: بشريك علمندن كيزلي اولوب معناسني يالكز اللهك بيلديگي لفظدر (حروف مقطعه كبى).",
        "q_id": "Apakah perbedaan antara Al-Mujmal dan Al-Mutasyabih?",
        "a_id": "Al-Mujmal adalah lafaz yang tidak dapat diketahui hakikat maknanya kecuali melalui penjelasan dari pembuat syariat (seperti rincian shalat). Al-Mutasyabih adalah lafaz yang maknanya tertutup dan hanya diketahui oleh Allah (seperti huruf muqatha'ah)."
    },

    # --- Thuruq ad-Dalalah (Dalalat) (Q40 - Q45) ---
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤٠- نظمك معناه دلالت يولي (طرق دلالة) قاچدر؟",
        "a_tr": "درتدر: عبارة النص، إشارة النص، دلالة النص، و اقتضاء النص.",
        "q_id": "Berapa metode penunjukan lafaz terhadap makna (Thuruq ad-Dalalah)?",
        "a_id": "Ada 4 metode: 'Ibaratun Nass, Isyaratun Nass, Dalalatun Nass, dan Iqtidha'un Nass."
    },
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤١- \"عبارة النص\" نه ديمكدر؟",
        "a_tr": "عبارة النص: كلامك اصلى ياخود تبعى اولارق كندي سياقنده مقصود اولان حكمه دلالت ايتمسيدر.",
        "q_id": "Apa yang dimaksud dengan 'Ibaratun Nass?",
        "a_id": "'Ibaratun Nass adalah penunjukan lafaz terhadap hukum yang memang sengaja menjadi maksud utama atau maksud turunan dari susunan kalimat tersebut."
    },
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤٢- \"إشارة النص\" نه ديمكدر؟",
        "a_tr": "إشارة النص: كلامك اصلى سياقنده مقصود اولماديغي حالده، لازم بر معنايه دلالت ايتمسيدر (مثلا اك آز حمل مدتنك آلتـى آي اولديغنى آيتلردن چيقارمق كبى).",
        "q_id": "Apa yang dimaksud dengan Isyaratun Nass?",
        "a_id": "Isyaratun Nass adalah penunjukan lafaz terhadap suatu hukum yang merupakan kelaziman dari makna kalimat, meskipun bukan menjadi maksud utama pembicaraan (seperti penetapan masa minimal kehamilan 6 bulan)."
    },
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤٣- \"دلالة النص\" نه ديمكدر؟",
        "a_tr": "دلالة النص: لغت و معنا جهتندن حكمك علتنك مفهوم اولماسي ايله سكو ت اولنان يرده كى حكمك اثباتيدر (آنا بابايا \"اوف\" ديمكك حراملغندن اورمقك ده حرام اولمسي كبى).",
        "q_id": "Apa yang dimaksud dengan Dalalatun Nass (Mafhum Muwafaqah)?",
        "a_id": "Dalalatun Nass adalah penunjukan hukum terhadap perkara yang tidak disebutkan karena kesamaan 'illat yang dipahami langsung dari bahasa (seperti keharaman memukul orang tua yang dipahami dari larangan berkata 'ah')."
    },
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤٤- \"اقتضاء النص\" نه ديمكدر؟",
        "a_tr": "اقتضاء النص: كلامك صدق و يا شرعى صحتنك تصحيحي ايچون تقديراً بر كلمهنك وار صاييلماسيدر (\"امتمك خطا و اونوتماسي قالديريلدي\" حديثنده \"كوناهى\" تقديرا وار صاييلير).",
        "q_id": "Apa yang dimaksud dengan Iqtidha'un Nass?",
        "a_id": "Iqtidha'un Nass adalah penunjukan lafaz yang menuntut adanya suatu kata yang wajib diandaikan (taqdir) agar kalimat menjadi benar secara syariat atau akal (seperti takdir kata 'dosa' dalam hadits terangkatnya kekeliruan dan lupa)."
    },
    {
        "chapterId": "turuq-ad-dalalah",
        "chapterNameTr": "طرق دلالة",
        "chapterNameId": "Metode Penunjukan Makna (Dalalat)",
        "q_tr": "٤٥- دلالتلر آره سنده تعارض اولورسه ترتيب نصلدر؟",
        "a_tr": "عبارة النص مقدمدر، صكره إشارة النص، صكره دلالة النص، صكره اقتضاء النص كلير.",
        "q_id": "Bagaimana urutan kekuatan jika terjadi pertentangan di antara keempat dalalat tersebut?",
        "a_id": "Urutan kekuatannya: 'Ibaratun Nass didahulukan, kemudian Isyaratun Nass, kemudian Dalalatun Nass, dan terakhir Iqtidha'un Nass."
    },

    # --- Mabahits as-Sunnah (Q46 - Q50) ---
    {
        "chapterId": "sunnah",
        "chapterNameTr": "مباحث السنه",
        "chapterNameId": "Mabahits as-Sunnah",
        "q_tr": "٤٦- سنتك متواتر قسمى ندر و نه ايفاده ايدر؟",
        "a_tr": "متواتر: يالان اوزرينه اتفاقلرى عادتاً محال اولان بر جماعتك نقل ايتديگي سنتدر. علم يقين و قطعى ايجاب ايدر.",
        "q_id": "Apa definisi Hadits Mutawatir dan konsekuensi pengetahuannya?",
        "a_id": "Mutawatir adalah hadits yang diriwayatkan oleh orang banyak pada setiap tingkatan generasi yang secara adat mustahil bersepakat untuk berdusta. Menghasilkan ilmu yaqin (keyakinan pasti)."
    },
    {
        "chapterId": "sunnah",
        "chapterNameTr": "مباحث السنه",
        "chapterNameId": "Mabahits as-Sunnah",
        "q_tr": "٤٧- سنتك مشهور قسمى ندر؟",
        "a_tr": "مشهور: اصلنده آحاد اولوب صحابه دن صكره تواتر درجه سينه اولاشان سنتدر. علم طمأنينه ايفاده ايدر.",
        "q_id": "Apa definisi Hadits Masyhur menurut ulama Hanafi?",
        "a_id": "Masyhur adalah hadits yang pada generasi sahabat berstatus ahad, namun kemudian menjadi mutawatir pada generasi tabi'in dan sesudahnya. Menghasilkan ilmu thuma'ninah (ketenangan jiwa)."
    },
    {
        "chapterId": "sunnah",
        "chapterNameTr": "مباحث السنه",
        "chapterNameId": "Mabahits as-Sunnah",
        "q_tr": "٤٨- خبر واحد نه ايفاده ايدر و حكمى ندر؟",
        "a_tr": "خبر واحد: تواتر و شهرت درجه سينه اولاشمايان سنتدر. علم ظنى ايفاده ايدر و عمل ايتمك واجب اولور.",
        "q_id": "Apa konsekuensi faedah dan hukum beramal dengan Khabar Ahad?",
        "a_id": "Khabar Ahad adalah hadits yang tidak mencapai derajat mutawatir maupun masyhur. Menghasilkan ilmu zhanni dan wajib diamalkan dalam ranah hukum amaliyah."
    },
    {
        "chapterId": "sunnah",
        "chapterNameTr": "مباحث السنه",
        "chapterNameId": "Mabahits as-Sunnah",
        "q_tr": "٤٩- حنفى لره كوره راوينك شرطلرى نەلردر؟",
        "a_tr": "عقل، اسلام، ضبط و عدالت راوينك اساسى شرطلريدر. فقيه اولان راوينك روايتى قياسه مقدم توتولور.",
        "q_id": "Apa saja syarat-syarat perawi hadits menurut ulama Hanafi?",
        "a_id": "Syarat perawi: Berakal, beragama Islam, dhabith (kuat hafalan), dan adil. Riwayat perawi yang faqih didahulukan atas qiyas."
    },
    {
        "chapterId": "sunnah",
        "chapterNameTr": "مباحث السنه",
        "chapterNameId": "Mabahits as-Sunnah",
        "q_tr": "٥٠- خبر واحد عموم بلوا اولان مسئله لرده قبول ايديلير مى؟",
        "a_tr": "حنفى لره كوره عموم بلوا (هركسك هر كون احتيج طويدوغي) مسئله لرده خبر واحد قبول ايديلمز.",
        "q_id": "Apakah Khabar Ahad diterima dalam perkara yang menjadi 'Umum al-Balwa'?",
        "a_id": "Menurut ulama Hanafi, khabar ahad tidak diterima dalam perkara yang bersifat 'Umum al-Balwa' (perkara lumrah yang dialami semua orang setiap hari)."
    },

    # --- Mabahits al-Ijma' (Q51 - Q53) ---
    {
        "chapterId": "ijma",
        "chapterNameTr": "مباحث الإجماع",
        "chapterNameId": "Mabahits al-Ijma'",
        "q_tr": "٥١- \"اجماع\"ك تعريفى و ركنى ندر؟",
        "a_tr": "اجماع: رسول اللهك وفاتندن صكره بر عصرده كى محمد امتنك مجتهدلرينك شرعى بر حكم اوزرينه اتفاق اتمه لريدر. ركنى: قولى و يا فعلى عزمدر.",
        "q_id": "Apa definisi Al-Ijma' dan apa rukunnya?",
        "a_id": "Al-Ijma' adalah kesepakatan seluruh mujtahid dari umat Nabi Muhammad shallallahu 'alaihi wa sallam pada suatu masa setelah wafatnya beliau atas suatu hukum syar'i. Rukunnya adalah tekad kesepakatan baik lisan maupun perbuatan."
    },
    {
        "chapterId": "ijma",
        "chapterNameTr": "مباحث الإجماع",
        "chapterNameId": "Mabahits al-Ijma'",
        "q_tr": "٥٢- اجماعك مرتبه لرى نەلردر؟",
        "a_tr": "صحابه نك قولى اجماعى اك يوكسكدر (آيت كبى)، صكره سكوتى اجماع، صكره تابعين و داها صكره كى مجتهدلرين اجماعى كلير.",
        "q_id": "Sebutkan tingkatan-tingkatan derajat Al-Ijma'!",
        "a_id": "Tingkatan tertinggi adalah ijma' qawli sahabat (setara ayat Al-Qur'an), diikuti oleh ijma' sukuti sahabat, lalu ijma' generasi tabi'in dan para mujtahid sesudahnya."
    },
    {
        "chapterId": "ijma",
        "chapterNameTr": "مباحث الإجماع",
        "chapterNameId": "Mabahits al-Ijma'",
        "q_tr": "٥٣- اجماعه مخالفت ايتمكك حكمى ندر؟",
        "a_tr": "قطعى صحابه اجماعنى انكار ايدن تكفير اولنور؛ ظنى اولان سكوتى اجماعه مخالفت ايسه ضلالت و بدعت صاييلير.",
        "q_id": "Apakah konsekuensi hukum bagi orang yang mengingkari Al-Ijma'?",
        "a_id": "Mengingkari ijma' sahabat yang qath'i dapat mengkafirkan, sedangkan mengingkari ijma' yang zhanni (seperti sukuti) dinilai sebagai kesesatan dan bid'ah."
    },

    # --- Mabahits al-Qiyas & Ahliyyah (Q54 - Q60) ---
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٤- \"قياس\"ك اصول فقهده كى تعريفى ندر؟",
        "a_tr": "قياس: نصده حكمى بولونمايان فرعى بر مسئله يى، مشترَك علّت سببي ايله نصده حكمى بولونان اصل مسئله يه ملحق ايتمكدر.",
        "q_id": "Apa definisi Al-Qiyas dalam istilah Ushul Fiqh?",
        "a_id": "Al-Qiyas adalah menyamakan suatu kasus cabang (far') yang belum ada ketetapan nashnya dengan kasus pokok (ashl) yang ada nashnya karena adanya kesamaan 'illat hukum pada keduanya."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٥- قياسك درت ركنى نەلردر؟",
        "a_tr": "درت ركنى واردر: اصل (حكمى نصده اولان)، فرع (حكمى آرانان)، حكم اصل (شرعى حكم)، و علة (حكمك مناط اولديغي وصف).",
        "q_id": "Sebutkan 4 rukun Al-Qiyas!",
        "a_id": "Empat rukun qiyas adalah: Al-Ashl (kasus pokok), Al-Far' (kasus cabang), Hukmul Ashl (hukum asal yang ada nashnya), dan Al-'Illah (sifat pengikat hukum)."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٦- علتك اساسى شرطلرى ندر؟",
        "a_tr": "علت: ظاهر، منضبط و متعدى بر وصف اولماليدر؛ حكمك اصل مقصودينه مناسب اولوب قاصره اولماماليديـر.",
        "q_id": "Apa syarat-syarat pokok bagi suatu 'Illat hukum?",
        "a_id": "Syarat 'illat harus berupa sifat yang zhahir (nyata), mundhabith (jelas terukur), dan muta'addiyah (dapat meluas ke kasus cabang), serta selaras dengan maksud pensyariatan hukum."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٧- \"اهلية الوجوب\" نه ديمكدر؟",
        "a_tr": "اهلية الوجوب: كيشينك لهنه و عليهنه اولان حقوقك ثبوتنه صلاحيتيدر (انسانك ذمتى اولماسيدر، جنينده بيله واردر).",
        "q_id": "Apa yang dimaksud dengan Ahliyyatul Wujub?",
        "a_id": "Ahliyyatul Wujub adalah kelayakan seseorang untuk menerima hak dan kewajiban hukum syariat. Landasannya adalah hakikat kemanusiaan (dzimmah), yang bahkan telah dimiliki oleh janin di dalam kandungan."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٨- \"اهلية الاداء\" نه ديمكدر؟",
        "a_tr": "اهلية الاداء: كيشينك سوز و فعللرينك شرعا معتبر صاييلمسي صلاحيتيدر (عقل و تمييز ايله ثابت اولور).",
        "q_id": "Apa yang dimaksud dengan Ahliyyatul Ada'?",
        "a_id": "Ahliyyatul Ada' adalah kelayakan seseorang agar ucapan dan perbuatannya dinilai sah secara hukum syariat. Landasannya adalah akal yang sempurna dan kemampuan tamyiz."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٥٩- اهلتى بوزان \"عوارض سماويه\" نەلردر؟",
        "a_tr": "انسانك كندي اراده سي طشنده كلن كنعلكردر: جنون، عته (بونامق)، اغماء (باييلماق)، اويقو، اونوتماق و اولومدر.",
        "q_id": "Apa yang dimaksud dengan 'Awaridh Samawiyyah penghalang ahliyyah?",
        "a_id": "'Awaridh Samawiyyah adalah faktor penghalang kelayakan yang datang di luar kehendak manusia, seperti gila, hilang akal/pikun, pingsan, tidur, lupa, sakit berat, dan kematian."
    },
    {
        "chapterId": "qiyas-ahliyyah",
        "chapterNameTr": "مباحث القياس و الأهلية",
        "chapterNameId": "Mabahits al-Qiyas & Ahliyyah",
        "q_tr": "٦٠- اهلتى اتكيلين \"عوارض مكتسبه\" نەلردر؟",
        "a_tr": "انسانك كندي كسبي ايله اورتايه چيقان حاللردر: جهل، سكر (سروشلق)، هزل، سفه، خطا و اكراه (زورلاماق) در.",
        "q_id": "Apa yang dimaksud dengan 'Awaridh Muktasabah?",
        "a_id": "'Awaridh Muktasabah adalah faktor penghalang kelayakan yang timbul akibat usaha atau perbuatan manusia itu sendiri, seperti mabuk, kebodohan, bersenda gurau (hazl), pemborosan (safah), keliru, dan paksaan (ikrah)."
    }
]

osm_stopwords = {"در", "لر", "ايله", "اولان", "بر", "دن", "ده", "كه", "اوچون", "كبى", "ايتمك", "اولور", "ويريلن", "شيدر", "اولوب", "ايدر", "معناسى", "ندر", "نەلردر", "قاچدر"}
ind_stopwords = {"yang", "dan", "di", "ke", "dari", "adalah", "ini", "itu", "dengan", "untuk", "pada", "atau", "tidak", "bisa", "harus", "yaitu", "secara", "oleh", "dalam", "artinya", "definisi", "apa", "siapa", "mengapa", "bagaimana"}

def clean_words(text):
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[.,\/#!$%\^&\*;:{}=\-_`~()،؛؟\"'\n\r]", " ", text)
    return [w for w in text.split() if w]

def pick_cloze(text, stopwords):
    words = [w for w in clean_words(text) if len(w) >= 3 and w.lower() not in stopwords]
    if words:
        words.sort(key=lambda x: len(x), reverse=True)
        for w in words:
            if w in text:
                return w
    all_words = clean_words(text)
    for w in all_words:
        if w in text:
            return w
    return text[:5]

items = []
for i, d in enumerate(menar_questions_raw):
    q_tr = d["q_tr"]
    a_tr = d["a_tr"]
    q_id = d["q_id"]
    a_id = d["a_id"]
    
    cloze_tr = pick_cloze(a_tr, osm_stopwords)
    cloze_id = pick_cloze(a_id, ind_stopwords)
    
    kw_tr = [w for w in clean_words(q_tr + " " + a_tr) if len(w) >= 3 and w not in osm_stopwords][:6]
    kw_id = [w for w in clean_words(q_id + " " + a_id) if len(w) >= 3 and w.lower() not in ind_stopwords][:6]
    keywords = list(dict.fromkeys(kw_tr + kw_id))
    
    items.append({
        "id": f"menar-{str(i + 1).zfill(3)}",
        "bookKey": "menar",
        "chapterId": d["chapterId"],
        "chapterNameTr": d["chapterNameTr"],
        "chapterNameId": d["chapterNameId"],
        "originalNumber": i + 1,
        "question_tr": q_tr,
        "answer_tr": a_tr,
        "question_id": q_id,
        "answer_id": a_id,
        "clozeKeyWord_tr": cloze_tr,
        "clozeKeyWord_id": cloze_id,
        "keywords": keywords
    })

output_code = f"""/**
 * Manar al-Anwar (Ushul Fiqh) Dataset
 * 60 Classical Q&A Items (Osmanlıca & Santri Indonesian)
 * Zero emojis - 100% Bilingual
 */

export const menarData = {json.dumps(items, ensure_ascii=False, indent=2)};
"""

with open("src/data/menar.js", "w", encoding="utf-8") as f:
    f.write(output_code)

print(f"menar.js generated successfully with {len(items)} items.")
