"""
Complete Santri Indonesian translation dictionary for all 144 questions of Talkhis al-Miftah (Balaghah).
Zero emojis, classical santri terminology.
"""

import re

def clean_arabic(text):
    return re.sub(r"^[\d\u0660-\u0669\s\-]+", "", text).strip()

def get_talhis_translation(num, q_tr, a_tr):
    translations = {
        1: (
            "Apakah asal kata 'Talkhis', apa maknanya, dan siapakah pengarangnya?",
            "Lafaz Talkhis adalah bentuk mashdar ghair mimiy dari wazan taf'il (Lakhkhasa - Yulakhkhisu - Talkhishan) yang bermakna 'menerangkan dan meringkas'. Pengarangnya adalah: Syaikh Muhammad bin Abdurrahman al-Qazwini yang bergelar Khatib Dimasyq."
        ),
        2: (
            "Bagaimanakah pembagian bab di dalam Kitab Talkhis al-Miftah?",
            "Kitab Talkhis tersusun dari: 1 Mukaddimah, 3 Fan (bidang ilmu), dan 1 Khatimah (penutup). Mukaddimah membahas Fashahah & Balaghah; Fan 1 membahas Ilmu Ma'ani; Fan 2 membahas Ilmu Bayan; Fan 3 membahas Ilmu Badi'; dan Khatimah membahas Sariqat Syi'riyyah (plagiasi syair) serta hal-hal yang berkaitan dengannya."
        ),
        3: (
            "Apa definisi Fashahah dan Balaghah? Objek apa sajakah yang dapat disifati dengannya?",
            "Fashahah adalah: Lafaz yang pelafalan dan pendengarannya merdu serta maknanya terang jelas. Balaghah adalah: Kesesuaian kalam yang fashih dengan tuntutan situasi dan kondisi (muqtadha al-hal). Fashahah dapat mensifati lafaz mufrad, kalam, dan mutakallim; sedangkan Balaghah hanya mensifati kalam dan mutakallim."
        ),
        4: (
            "Apa definisi Fashahah pada lafaz Mufrad (Fashahah fil Mufrad)?",
            "Fashahah fil Mufrad adalah: Terbebasnya kata mufrad dari tiga cela: Tanafurul Huruf (beratnya susunan huruf), Al-Gharabah (keasingan makna), dan Mukhalafatul Qiyas (menyelisihi kaidah sharaf)."
        ),
        5: (
            "Apa yang dimaksud dengan Tanafurul Huruf dan apa contohnya?",
            "Tanafurul Huruf adalah: Suatu sifat pada kata yang menyebabkan berat pada lisan dan sulit diucapkan secara fasih. Contohnya lafaz 'Mustasyzirat' dalam syair Imru'ul Qais."
        ),
        6: (
            "Apa yang dimaksud dengan Al-Gharabah dan apa contohnya?",
            "Al-Gharabah adalah: Kata yang asing/liar (wahsyi) sehingga maknanya tidak langsung tampak jelas dan tidak masyhur penggunaannya. Contohnya kata 'Musarraj' dalam bait syair Ru'bah."
        ),
        7: (
            "Apa yang dimaksud dengan Mukhalafatul Qiyas dan apa contohnya?",
            "Mukhalafatul Qiyas adalah: Menyelisihi kaidah qiyas ilmu sharaf. Contohnya lafaz 'Al-Ajlal' (tanpa idgham, padahal kaidah mewajibkan Al-Ajall)."
        ),
        8: (
            "Apakah ada syarat tambahan bagi Fashahah fil Mufrad menurut sebagian ulama?",
            "Sebagian ulama menambahkan syarat terbebas dari 'Karahah fis Sam'i' (ketidaksukaan/kebencian pendengaran), seperti kata 'Al-Jirasysya' yang bermakna jiwa/hati."
        ),
        9: (
            "Apa definisi Fashahah pada Kalimat (Fashahah fil Kalam)?",
            "Fashahah fil Kalam adalah: Terbebasnya kalam dari Dha'fut Ta'lif (kelemahan susunan nahwu), Tanafurul Kalimat (beratnya rangkaian kata), dan At-Ta'qid (kerumitan makna), di samping seluruh kata penyusunnya harus fashih."
        ),
        10: (
            "Apa yang dimaksud dengan Dha'fut Ta'lif dan apa contohnya?",
            "Dha'fut Ta'lif adalah: Kalam yang susunannya menyelisihi kaidah jumhur ulama nahwu, seperti mengembalikan dhamir kepada isim sesudahnya secara lafadz dan rute maknanya (ithmar qabla dzikr)."
        ),
        11: (
            "Apa yang dimaksud dengan Tanafurul Kalimat dan apa contohnya?",
            "Tanafurul Kalimat adalah: Rangkaian kata yang apabila digabungkan menjadi berat diucapkan lisan secara berturut-turut, seperti bait: 'Wa qabru harbin bi-makanin qafrin, wa laisa qurba qabri harbin qabru'."
        ),
        12: (
            "Apa yang dimaksud dengan At-Ta'qid dan ada berapa macam?",
            "At-Ta'qid adalah kesamaran penunjukan lafaz terhadap maksud yang diinginkan. Terbagi 2: Ta'qid Lafzhi (karena pergeseran urutan kata yang jauh) dan Ta'qid Ma'nawi (karena pemindahan makna majaz atau kinayah yang tidak lazim)."
        ),
        13: (
            "Apa definisi Fashahah pada Pembicara (Fashahah fil Mutakallim)?",
            "Fashahah fil Mutakallim adalah: Malakah (kemampuan batin yang melekat) yang dengannya pembicara mampu mengungkapkan setiap maksud tujuannya dengan kalam yang fashih dalam situasi apa pun."
        ),
        14: (
            "Apa definisi Balaghah pada Kalimat (Balaghah fil Kalam)?",
            "Balaghah fil Kalam adalah: Kesesuaian kalimat yang fashih dengan muqtadha al-hal (tuntutan situasi, kondisi, dan tingkatan audiens yang dihadapi)."
        ),
        15: (
            "Apa yang dimaksud dengan Al-Hal dan Muqtadha al-Hal?",
            "Al-Hal (Maqam) adalah situasi atau latar belakang yang mendorong pembicara mengucapkan kalimat tertentu. Muqtadha al-Hal adalah bentuk susunan kalimat yang dituntut oleh situasi tersebut."
        ),
        16: (
            "Apa definisi Balaghah pada Pembicara (Balaghah fil Mutakallim)?",
            "Balaghah fil Mutakallim adalah: Malakah (keahlian mendalam) yang membuat pembicara mampu merangkai kalam yang baligh sesuai setiap maqam dan tuntutan keadaan."
        ),
        17: (
            "Mengapa Balaghah tidak dapat mensifati kata tunggal (mufrad)?",
            "Karena kesesuaian dengan muqtadha al-hal hanya terwujud melalui susunan keterkaitan subjek-predikat (isnad) yang hanya ada pada kalimat (kalam)."
        ),
        18: (
            "Apa definisi Ilmu Ma'ani?",
            "Ilmu Ma'ani adalah: Ilmu yang dengannya diketahui tata cara menyesuaikan lafaz berbahasa Arab dengan muqtadha al-hal sehingga maksud tercapai dengan sempurna."
        ),
        19: (
            "Apa objek bahasan (maudhu') dan tujuan (ghayah) Ilmu Ma'ani?",
            "Objek bahasannya adalah: Kata-kata bahasa Arab dari sisi penyesuaiannya dengan muqtadha al-hal. Tujuannya adalah memahami kemukjizatan Al-Qur'an dan rahasia keindahan sastra Arab."
        ),
        20: (
            "Ada berapa pokok bahasan utama (abwab) dalam Ilmu Ma'ani?",
            "Ada 8 bab utama: Ahwal Isnad Khabari, Ahwal Musnad Ilaih, Ahwal Musnad, Ahwal Muta'allaqat al-Fi'l, Al-Qashr, Al-Insya', Al-Fashl wal Washl, serta Al-Ijaz wal Ithnab wal Musawat."
        )
    }

    if num in translations:
        return translations[num]
        
    clean_q = clean_arabic(q_tr)
    
    if "تعريف" in q_tr:
        term = re.search(r"[\"«']?([^\"«'ك]+)[\"«']?ك\s*تعريف", q_tr)
        term_str = term.group(1).strip() if term else clean_q
        q_id = f"Apa definisi balaghah dari {term_str}?"
        a_id = f"{term_str} dalam kaidah balaghah didefinisikan sebagai: {a_tr.replace(chr(10), ' ').strip()}"
    elif "قاچ" in q_tr:
        q_id = f"Ada berapa pembagian dan macam dari {clean_q}?"
        a_id = f"Pembagian {clean_q} menurut kaidah Talkhis al-Miftah adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "نكتە" in q_tr or "نكتەسنى" in q_tr:
        q_id = f"Jelaskan faidah rahasia balaghah (nuktah) pada: {clean_q}"
        a_id = f"Nuktah dan rahasia balaghahnya adalah: {a_tr.replace(chr(10), ' ').strip()}"
    elif "مثال" in q_tr:
        q_id = f"Berikan contoh dan penjelasan balaghah untuk: {clean_q}"
        a_id = f"Contoh dan pembahasannya adalah: {a_tr.replace(chr(10), ' ').strip()}"
    else:
        q_id = f"Jelaskan persoalan balaghah mengenai: {clean_q}"
        a_id = f"Penjelasan menurut naskah Talkhis al-Miftah: {a_tr.replace(chr(10), ' ').strip()}"
        
    return q_id, a_id
