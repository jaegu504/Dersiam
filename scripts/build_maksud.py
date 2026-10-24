# -*- coding: utf-8 -*-
import json
import re
import sys

# We will construct all 58 questions and answers.
# Let's write the complete dataset generator.

maksud_items = []

def add_item(id_num, chapter_id, ch_tr, ch_id, orig_num, q_tr, a_tr, q_id, a_id, cloze_tr, cloze_id, keywords):
    # Verify cloze words exist in answers
    if cloze_tr not in a_tr:
        print(f"WARNING TR: {id_num} cloze '{cloze_tr}' not in a_tr", file=sys.stderr)
    if cloze_id not in a_id:
        print(f"WARNING ID: {id_num} cloze '{cloze_id}' not in a_id", file=sys.stderr)
    
    maksud_items.append({
        "id": f"maksud-{id_num:03d}",
        "bookKey": "maksud",
        "chapterId": chapter_id,
        "chapterNameTr": ch_tr,
        "chapterNameId": ch_id,
        "originalNumber": orig_num,
        "question_tr": q_tr,
        "answer_tr": a_tr.strip(),
        "question_id": q_id,
        "answer_id": a_id.strip(),
        "clozeKeyWord_tr": cloze_tr,
        "clozeKeyWord_id": cloze_id,
        "keywords": keywords
    })

# --- CHAPTER 1: المقدمة و تقسيم الأفعال ---
CH1 = ("mukaddime-fiil", "المقدمة و تقسيم الأفعال", "Mukaddimah & Pembagian Fi'il")

# 1
add_item(
    1, *CH1, 1,
    "١- علم صرفك تعريفنى معناسيله برابر سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>علم صرفك برنجى تعريفى:</strong><br><span class="arabic-inline font-bold">وَهُوَ عِلْمٌ يُعْرَفُ بِهِ أَحْوَالُ الْكَلِمَةِ الْعَرَبِيَّةِ مِنْ حَيْثُ الإِعْلَالِ وَالإِدْغَامِ.</span><br><strong>معناسى:</strong> إعلال و إدغام جهتندن عربجه كلمه لرك حاللرى كنديسيله بيلينن علمدر.</p>
<p class="ans-p"><strong>علم صرفك ايكنجى تعريفى:</strong><br><span class="arabic-inline font-bold">وَهُوَ عِلْمٌ بِأُصُولٍ يُعْرَفُ بِهِ أَحْوَالُ أَبْنِيَةِ الْكَلِمَةِ الَّتِي لَيْسَتْ بِإِعْرَابٍ.</span><br><strong>معناسى:</strong> كلمه لرك إعراب حاللرى دكلده بنالرينك (ياپيلرينك) حاللرى كنديسيله بيلينن اصللرى بيلمكدر. (المطلوب في شرح المقصود، ص ١٢)</p>
<div class="v-tree">
  <div class="v-tree-root">علم صرف</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">جهت إعلال و إدغام</span>
      <span class="v-node-desc">حرف علتك دكيشمى و ادغام حاللرى</span>
      <span class="v-node-ex">قَالَ (اصل: قَوَلَ)، مَدَّ (اصل: مَدَدَ)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">جهت أبنية الكلمة</span>
      <span class="v-node-desc">كوكى، ياپيسى، اصلى، بناسى و معناسى</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">كوكى (مصدر)</span>
        <span class="v-leaf">ياپيسى (ماضى)</span>
        <span class="v-leaf">اصلى (ثلاثى/رباعى)</span>
        <span class="v-leaf">بناسى (متعدى/لازم)</span>
      </div>
    </div>
  </div>
</div>
</div>""",
    "1. Sebutkan definisi Ilmu Sharaf beserta artinya!",
    """<div class="ans-block">
<p class="ans-p"><strong>Definisi Pertama Ilmu Sharaf:</strong><br><span class="arabic-inline font-bold">وَهُوَ عِلْمٌ يُعْرَفُ بِهِ أَحْوَالُ الْكَلِمَةِ الْعَرَبِيَّةِ مِنْ حَيْثُ الإِعْلَالِ وَالإِدْغَامِ.</span><br><strong>Artinya:</strong> Ilmu yang dengannya diketahui keadaan kata-kata bahasa Arab ditinjau dari segi i'lal (perubahan huruf 'illat) dan idgham (peleburan dua huruf sejenis).</p>
<p class="ans-p"><strong>Definisi Kedua Ilmu Sharaf:</strong><br><span class="arabic-inline font-bold">وَهُوَ عِلْمٌ بِأُصُولٍ يُعْرَفُ بِهِ أَحْوَالُ أَبْنِيَةِ الْكَلِمَةِ الَّتِي لَيْسَتْ بِإِعْرَابٍ.</span><br><strong>Artinya:</strong> Ilmu tentang kaidah-kaidah pokok yang dengannya diketahui keadaan struktur (bina') kata yang bukan berupa i'rab (perubahan harakat akhir kata). <em>(Al-Mathlub fi Syarh al-Maqshud, hal. 12)</em></p>
<div class="v-tree">
  <div class="v-tree-root">Ilmu Sharaf</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Tinjauan I'lal & Idgham</span>
      <span class="v-node-desc">Kaidah perubahan huruf 'illat dan tasydid peleburan</span>
      <span class="v-node-ex">قَالَ (asal: قَوَلَ)، مَدَّ (asal: مَدَدَ)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Tinjauan Bangun Struktur Kata</span>
      <span class="v-node-desc">Akar kata, wazan, keaslian huruf, dan relasi makna</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">Akar (Mashdar)</span>
        <span class="v-leaf">Pola (Madhi)</span>
        <span class="v-leaf">Tsulatsi/Ruba'i</span>
        <span class="v-leaf">Muta'addi/Lazim</span>
      </div>
    </div>
  </div>
</div>
</div>""",
    "الإِدْغَامِ", "diketahui", ["علم", "صرف", "تعريف", "إعلال", "إدغام", "definisi", "sharaf"]
)

# 2
add_item(
    2, *CH1, 2,
    "٢- علم صرفك موضوعنى معناسيله برابر سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>علم صرفك موضوعى:</strong><br><span class="arabic-inline font-bold">هُوَ الْكَلِمَةُ الْعَرَبِيَّةُ الْوَاقِعَةُ فِي الْكَلَامِ.</span><br><strong>معناسى:</strong> كلامده واقع اولان عربجه كلمه لردر.</p>
<div class="v-tree">
  <div class="v-tree-root">موضوع علم صرف</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">الكلمة العربية المتصرفة</span>
      <span class="v-node-desc">متمكن اسملر و متصرف فعللر</span>
      <span class="v-node-ex">نَصَرَ، مَنْصُورٌ، عَالِمٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">خارج اولانلر</span>
      <span class="v-node-desc">حرفلر، مبنى اسملر و جامد فعللر</span>
      <span class="v-node-ex">مِنْ، هَذَا، لَيْسَ</span>
    </div>
  </div>
</div>
</div>""",
    "2. Sebutkan objek pembahasan (maudhu') Ilmu Sharaf beserta artinya!",
    """<div class="ans-block">
<p class="ans-p"><strong>Objek Pembahasan (Maudhu') Ilmu Sharaf:</strong><br><span class="arabic-inline font-bold">هُوَ الْكَلِمَةُ الْعَرَبِيَّةُ الْوَاقِعَةُ فِي الْكَلَامِ.</span><br><strong>Artinya:</strong> Kata-kata berbahasa Arab yang tersusun di dalam tuturan kalimat (kalam).</p>
<div class="v-tree">
  <div class="v-tree-root">Objek Kajian Sharaf</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Kata Arab yang Menerima Perubahan</span>
      <span class="v-node-desc">Isim mutamakkin (mu'rab) dan Fi'il mutasharrif</span>
      <span class="v-node-ex">نَصَرَ، مَنْصُورٌ، كَاتِبٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Di Luar Kajian Sharaf</span>
      <span class="v-node-desc">Huruf, isim mabni, dan fi'il jamid (statis tanpa tashrif)</span>
      <span class="v-node-ex">فِي، عَنْ، هَذَا، لَيْسَ</span>
    </div>
  </div>
</div>
</div>""",
    "الْوَاقِعَةُ", "tersusun", ["موضوع", "كلام", "عربية", "maudhu", "objek", "kalam"]
)

# 3
add_item(
    3, *CH1, 3,
    "٣- علم صرفك غايه سنك تعريفنى معناسيله برابر سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>علم صرفك غايه سى:</strong><br><span class="arabic-inline font-bold">الإِحْتِرَازُ عَنِ الْخَطَأِ فِي الإِعْلَالِ وَالإِدْغَامِ.</span><br><strong>معناسى:</strong> إعلال و إدغامده كى خطادن قاچينمقدر.</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">إعلالده خطا</span>
    <span class="v-grid-desc">حرف علتك يرينى و حركه سنى يانلش ياپمق</span>
    <span class="v-grid-val">قَالَ يرينه قَوَلَ ديمك</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">إدغامده خطا</span>
    <span class="v-grid-desc">واجب ادغامى ترك ايدوب لسانى آغيرلاتمق</span>
    <span class="v-grid-val">مَدَّ يرينه مَدَدَ ديمك</span>
  </div>
</div>
</div>""",
    "3. Sebutkan tujuan (ghayah) mempelajari Ilmu Sharaf beserta artinya!",
    """<div class="ans-block">
<p class="ans-p"><strong>Tujuan (Ghayah) Mempelajari Ilmu Sharaf:</strong><br><span class="arabic-inline font-bold">الإِحْتِرَازُ عَنِ الْخَطَأِ فِي الإِعْلَالِ وَالإِدْغَامِ.</span><br><strong>Artinya:</strong> Menjaga lisan dan pemahaman dari kekeliruan dalam kaidah i'lal (perubahan huruf 'illat) dan idgham (peleburan dua huruf sejenis).</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">Kekeliruan dalam I'lal</span>
    <span class="v-grid-desc">Salah mengubah, memindahkan, atau membuang huruf 'illat</span>
    <span class="v-grid-val">Mengucapkan قَوَلَ padahal harus قَالَ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">Kekeliruan dalam Idgham</span>
    <span class="v-grid-desc">Meninggalkan idgham wajib sehingga tuturan menjadi berat di lisan</span>
    <span class="v-grid-val">Mengucapkan مَدَدَ padahal harus مَدَّ</span>
  </div>
</div>
</div>""",
    "الْخَطَأِ", "kekeliruan", ["غاية", "احتراز", "خطأ", "إعلال", "إدغام", "tujuan", "ghayah"]
)

# 4
add_item(
    4, *CH1, 4,
    "٤- علم صرفك واضعى كيمدر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>علم صرفك واضعى:</strong> معاذ بن مسلم الهرّاء حضرتلريدر (كوفه لى مَشهور صرفى و نحوى، وفاتى: هجرى ١٨٧).</p>
<p class="ans-p">بعضيلرينه كوره ده علوم عربيه نك عمومى واضعى حضرت على كرم الله وجهه و اونك امرى ايله ابو الاسود الدؤلى حضرتلريدر؛ فقط علم صرفك مباحثنى مستقلاً تدوين ايدن معاذ بن مسلم در.</p>
</div>""",
    "4. Siapakah peletak dasar pertama (wadhi') Ilmu Sharaf?",
    """<div class="ans-block">
<p class="ans-p"><strong>Peletak dasar khusus Ilmu Sharaf:</strong> Al-Imam Mu'adz bin Muslim al-Harra' dari Kufah (wafat 187 H).</p>
<p class="ans-p">Adapun peletak dasar kaidah bahasa Arab secara umum adalah Khalifah 'Ali bin Abi Thalib karramallahu wajhah bersama Sayyidina Abu al-Aswad ad-Du'ali. Namun, Imam Mu'adz bin Muslim al-Harra' adalah ulama yang pertama kali menyusun bab-bab Sharaf secara mandiri terpisah dari Nahwu.</p>
</div>""",
    "الهرّاء", "pertama", ["واضع", "معاذ", "مسلم", "الهراء", "wadhi", "peletak"]
)

# 5
add_item(
    5, *CH1, 5,
    "٥- مقصود نه كلمه اولور، يكر مى دورت صيغه يه حكيگز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>مقصود كلمه سى:</strong> قصد اولونان معناسنده اولوب، ثلاثى مجردك ايكنجى بابندن اسم مفعول مفرد مذكردر. دليلى: ﴿وَاقْصِدْ فِي مَشْيِكَ﴾ (لقمان: ١٩) آيتنده كى امر حاضر اولان "اِقْصِدْ" كلمه سيدر.</p>
<div class="v-flow-box">
  <div class="v-flow-header">قَصَدَ - يَفْعُلُ بابندن ٢٤ صيغه</div>
  <div class="v-grid">
    <div class="v-grid-card"><span class="v-grid-label">ماضى معلوم</span><span class="v-grid-val">قَصَدَ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">مضارع معلوم</span><span class="v-grid-val">يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">مصدر غير ميمى</span><span class="v-grid-val">قَصْدًا</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم فاعل</span><span class="v-grid-val">فَهُوَ قَاصِدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم مفعول</span><span class="v-grid-val">وَذَاكَ مَقْصُودٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">جحد مطلق</span><span class="v-grid-val">لَمْ يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">جحد مستغرق</span><span class="v-grid-val">لَمَّا يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">نفى حال</span><span class="v-grid-val">مَا يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">نفى استقبال</span><span class="v-grid-val">لَا يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">تأكيد نفى استقبال</span><span class="v-grid-val">لَنْ يَقْصِدَ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">امر غائب</span><span class="v-grid-val">لِيَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">نهى غائب</span><span class="v-grid-val">لَا يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">امر حاضر</span><span class="v-grid-val">اِقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">نهى حاضر</span><span class="v-grid-val">لَا تَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم زمان و مكان</span><span class="v-grid-val">مَقْصِدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم آلت</span><span class="v-grid-val">مِقْصَدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">مصدر مرّه</span><span class="v-grid-val">قَصْدَةً</span></div>
    <div class="v-grid-card"><span class="v-grid-label">مصدر نوع</span><span class="v-grid-val">قِصْدَةً</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم تصغير</span><span class="v-grid-val">قُصَيْدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم منسوب</span><span class="v-grid-val">قَصْدِيٌّ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">مبالغه اسم فاعل</span><span class="v-grid-val">قَصَّادٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">اسم تفضيل</span><span class="v-grid-val">أَقْصَدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">فعل تعجب اول</span><span class="v-grid-val">مَا أَقْصَدَهُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">فعل تعجب ثانى</span><span class="v-grid-val">وَأَقْصِدْ بِهِ</span></div>
  </div>
</div>
</div>""",
    "5. Apa shighat kata 'Maqshud', dan bagaimana tashrif 24 shighat-nya?",
    """<div class="ans-block">
<p class="ans-p"><strong>Shighat kata 'Maqshud':</strong> Bermakna 'yang dituju / dimaksudkan', berkedudukan sebagai <em>Isim Maf'ul Mufrad Mudzakkar</em> dari fi'il Tsulatsi Mujarrad bab kedua (<span class="arabic-inline font-bold">قَصَدَ - يَقْصِدُ</span>). Dalilnya firman Allah Ta'ala: ﴿وَاقْصِدْ فِي مَشْيِكَ﴾ (QS. Luqman: 19) dari fi'il amar 'Iqshid'.</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tashrif 24 Shighat Lengkap (Bab II)</div>
  <div class="v-grid">
    <div class="v-grid-card"><span class="v-grid-label">Madhi Ma'lum</span><span class="v-grid-val">قَصَدَ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Mudhari' Ma'lum</span><span class="v-grid-val">يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Mashdar Ashli</span><span class="v-grid-val">قَصْدًا</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Fa'il</span><span class="v-grid-val">فَهُوَ قَاصِدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Maf'ul</span><span class="v-grid-val">وَذَاكَ مَقْصُودٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Jahad Muthlaq</span><span class="v-grid-val">لَمْ يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Jahad Mustaghraq</span><span class="v-grid-val">لَمَّا يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Nafi Hal</span><span class="v-grid-val">مَا يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Nafi Istiqbal</span><span class="v-grid-val">لَا يَقْصِدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Taukid Nafi Istiqbal</span><span class="v-grid-val">لَنْ يَقْصِدَ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Amar Ghaib</span><span class="v-grid-val">لِيَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Nahi Ghaib</span><span class="v-grid-val">لَا يَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Amar Hadhir</span><span class="v-grid-val">اِقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Nahi Hadhir</span><span class="v-grid-val">لَا تَقْصِدْ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Zaman & Makan</span><span class="v-grid-val">مَقْصِدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Alat</span><span class="v-grid-val">مِقْصَدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Mashdar Marrah</span><span class="v-grid-val">قَصْدَةً</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Mashdar Hai'ah (Jenis)</span><span class="v-grid-val">قِصْدَةً</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Tashghir</span><span class="v-grid-val">قُصَيْدٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Mansub</span><span class="v-grid-val">قَصْدِيٌّ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Mubalaghah Fa'il</span><span class="v-grid-val">قَصَّادٌ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Isim Tafdhil</span><span class="v-grid-val">أَقْصَدُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Fi'il Ta'ajjub I</span><span class="v-grid-val">مَا أَقْصَدَهُ</span></div>
    <div class="v-grid-card"><span class="v-grid-label">Fi'il Ta'ajjub II</span><span class="v-grid-val">وَأَقْصِدْ بِهِ</span></div>
  </div>
</div>
</div>""",
    "مَقْصُودٌ", "dimaksudkan", ["مقصود", "صيغه", "تصريف", "قصد", "tashrif", "shighat"]
)

# 6
add_item(
    6, *CH1, 6,
    "٦- مقصودك مصنفى كيمدر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>مقصودك مصنفى:</strong> امام اعظم ابو حنيفه حضرتلريدر.<br><strong>آدى:</strong> نعمان. <strong>باباسنك آدى:</strong> ثابت در.<br>ابو حنيفه؛ اهل حقك، يعنى باطلدن قاچوب حقه قوشانلرك باباسى و باشى ديمكدر. حنيفه ده كى {ة} مبالغه ته سيدر.</p>
<p class="ans-p">هجرى ٨٠ (ميلادى ٦٩٩) تاريخنده كوفه ده تولد ايتمش، هجرى ١٥٠ (ميلادى ٧٦٧) تاريخنده بغدادده وفات ايتمشدر. اللى بش دفعه حج ايتمشلر، قرق سنه ياتسى آبدستى ايله صباح نمازى قيلمشلردر.</p>
</div>""",
    "6. Siapakah pengarang (mushannif) Kitab Al-Maqshud?",
    """<div class="ans-block">
<p class="ans-p"><strong>Mushannif Kitab Al-Maqshud:</strong> Al-Imam Al-A'zham Abu Hanifah An-Nu'man bin Tsabit radhiyallahu 'anhu.<br>Nama beliau adalah Nu'man, dan nama ayah beliau adalah Tsabit. Gelar Abu Hanifah bermakna 'pelopor orang-orang yang lurus berpegang teguh pada kebenaran'. Huruf ta' pada kata Hanifah adalah ta' mubalaghah.</p>
<p class="ans-p">Beliau lahir di Kufah pada tahun 80 H (699 M) dan wafat di Baghdad pada tahun 150 H (767 M). Beliau menunaikan ibadah haji sebanyak 55 kali dan selama 40 tahun mendirikan shalat Subuh dengan wudhu shalat Isya'.</p>
</div>""",
    "نعمان", "Mushannif", ["مصنف", "ابو", "حنيفة", "نعمان", "ثابت", "mushannif", "pengarang"]
)

# 7
add_item(
    7, *CH1, 7,
    "٧- عربى و شرعى علملر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">عربى علملر شرعى علملرى اوكرنمه يه بر وسيله در.</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">عربى علملر (علوم آليه)</span>
    <span class="v-grid-desc">شرعى علملرى آكالمق ايچون واسطه و آلت اولان علملر</span>
    <div class="v-sub-leaves">
      <span class="v-leaf">لغت</span>
      <span class="v-leaf">صرف</span>
      <span class="v-leaf">نحو</span>
      <span class="v-leaf">منطق</span>
      <span class="v-leaf">معانى</span>
      <span class="v-leaf">بيان</span>
      <span class="v-leaf">بديع</span>
    </div>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">شرعى علملر (علوم عاليه)</span>
    <span class="v-grid-desc">اصلاً مقصود اولان يوكسك دين علملرى</span>
    <div class="v-sub-leaves">
      <span class="v-leaf">تفسير</span>
      <span class="v-leaf">حديث</span>
      <span class="v-leaf">كلام</span>
      <span class="v-leaf">اصول فقه</span>
      <span class="v-leaf">فقه</span>
      <span class="v-leaf">اخلاق</span>
    </div>
  </div>
</div>
</div>""",
    "7. Apakah yang dimaksud dengan ilmu-ilmu bahasa Arab dan ilmu-ilmu syar'i?",
    """<div class="ans-block">
<p class="ans-p">Ilmu-ilmu bahasa Arab adalah sarana mutlak untuk memahami ilmu-ilmu syari'at secara benar.</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">Ilmu Bahasa Arab ('Ulum Aliyyah / Alat)</span>
    <span class="v-grid-desc">Disiplin ilmu instrumen untuk mengkaji nash-nash wahyu</span>
    <div class="v-sub-leaves">
      <span class="v-leaf">Lughah (Kosakata)</span>
      <span class="v-leaf">Sharaf (Morfologi)</span>
      <span class="v-leaf">Nahwu (Sintaksis)</span>
      <span class="v-leaf">Manthiq (Logika)</span>
      <span class="v-leaf">Ma'ani, Bayan, Badi'</span>
    </div>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">Ilmu Syar'i ('Ulum 'Aliyyah / Tujuan Luhur)</span>
    <span class="v-grid-desc">Disiplin ilmu pokok yang menjadi tujuan akhir ibadah dan aqidah</span>
    <div class="v-sub-leaves">
      <span class="v-leaf">Tafsir</span>
      <span class="v-leaf">Hadits</span>
      <span class="v-leaf">Kalam / Akidah</span>
      <span class="v-leaf">Ushul Fiqh</span>
      <span class="v-leaf">Fikih</span>
      <span class="v-leaf">Akhlaq / Tasawuf</span>
    </div>
  </div>
</div>
</div>""",
    "وسيله", "sarana", ["علوم", "عربية", "شرعية", "آلية", "عالية", "ilmu", "syari"]
)

# 8
add_item(
    8, *CH1, 8,
    "٨- فعللر قاچ قسمدر؟",
    """<div class="ans-block">
<p class="ans-p">فعللر اصل اعتباريله ايكى قسمدر: <strong>اصلى (مجرد)</strong> و <strong>ذو زياده (مزيد)</strong>. بونلرك هر برى ده ثلاثى و رباعى اولارق قسيملره آيريلير.</p>
<div class="v-tree">
  <div class="v-tree-root">فعللر</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">اصلى (مجرد)</span>
      <span class="v-node-desc">حرفلرينك تمامى اصلندن اولور</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">ثلاثى مجرد (نَصَرَ)</span>
        <span class="v-leaf">رباعى مجرد (دَحْرَجَ)</span>
      </div>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ذو زياده (مزيد)</span>
      <span class="v-node-desc">حرفلرينك اوزرينه زائد حرف بولونور</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">ثلاثى مزيد (أَكْرَمَ)</span>
        <span class="v-leaf">رباعى مزيد (تَدَحْرَجَ)</span>
      </div>
    </div>
  </div>
</div>
<div class="v-badge-note">بناء كتابنده كى مجرد ايله مقصودده كى اصلى؛ بناء ده كى مزيد ايله مقصودده كى ذو زياده عينى شيدر.</div>
</div>""",
    "8. Ada berapa pembagian fi'il?",
    """<div class="ans-block">
<p class="ans-p">Fi'il ditinjau dari susunan hurufnya terbagi menjadi dua bagian pokok: <strong>Ashli (Mujarrad)</strong> dan <strong>Dzu Ziyadah (Mazid)</strong>. Masing-masing terbagi lagi menjadi Tsulatsi dan Ruba'i.</p>
<div class="v-tree">
  <div class="v-tree-root">Pembagian Fi'il</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Ashli (Mujarrad)</span>
      <span class="v-node-desc">Seluruh hurufnya murni asli tanpa ada huruf tambahan</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">Tsulatsi Mujarrad (نَصَرَ)</span>
        <span class="v-leaf">Ruba'i Mujarrad (دَحْرَجَ)</span>
      </div>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Dzu Ziyadah (Mazid)</span>
      <span class="v-node-desc">Memiliki huruf ziyadah tambahan di atas huruf aslinya</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">Tsulatsi Mazid (أَكْرَمَ)</span>
        <span class="v-leaf">Ruba'i Mazid (تَدَحْرَجَ)</span>
      </div>
    </div>
  </div>
</div>
<div class="v-badge-note">Istilah <em>Mujarrad</em> dalam Kitab Bina identik dengan <em>Ashli</em> dalam Kitab Al-Maqshud; dan istilah <em>Mazid</em> identik dengan <em>Dzu Ziyadah</em>.</div>
</div>""",
    "زياده", "susunan", ["فعللر", "اصلي", "مجرد", "مزيد", "ذوزياده", "fiil", "pembagian"]
)

# 9
add_item(
    9, *CH1, 9,
    "٩- ثلاثى و رباعى نك تعريفلوى و معنالرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>ثلاثى:</strong> ماضيسى اوچ حرف اوزرينه اولان فعلدر (نَصَرَ، ضَرَبَ).<br><strong>رباعى:</strong> ماضيسى دورت حرف اوزرينه اولان فعلدر (دَحْرَجَ، زَلْزَلَ).</p>
<p class="ans-p"><strong>مجرد (اصلى):</strong> حرفلرينك تمامى اصلندن اولوب زياده سى اولمايان فعلدر.<br><strong>مزيد (ذو زياده):</strong> اصل حرفلرى اوزرينه زائد حرف اكله نن فعلدر (أَكْرَمَ كبى، ماضينك اولنده كى همزه زياده در).</p>
</div>""",
    "9. Apa definisi dan pengertian Tsulatsi dan Ruba'i?",
    """<div class="ans-block">
<p class="ans-p"><strong>Tsulatsi:</strong> Fi'il yang huruf fi'il madhi aslinya terdiri dari 3 huruf (contoh: نَصَرَ, ضَرَبَ).<br><strong>Ruba'i:</strong> Fi'il yang huruf fi'il madhi aslinya terdiri dari 4 huruf (contoh: دَحْرَجَ, زَلْزَلَ).</p>
<p class="ans-p"><strong>Mujarrad (Ashli):</strong> Fi'il yang seluruh huruf pembentuknya adalah huruf pokok tanpa imbuhan tambahan.<br><strong>Mazid (Dzu Ziyadah):</strong> Fi'il yang memperoleh imbuhan satu atau lebih huruf tambahan di atas huruf aslinya (contoh: أَكْرَمَ di mana hamzah di awal adalah huruf tambahan).</p>
</div>""",
    "ماضيسى", "terdiri", ["ثلاثي", "رباعي", "تعريف", "مجرد", "مزيد", "tsulatsi", "rubai"]
)

print("Chapter 1 done (9 items).")

# --- CHAPTER 2: ١. فصل: المصدر و المشتقات ---
CH2 = ("fashl-1-mashdar", "١. فصل: المصدر و المشتقات", "Fashl 1: Mashdar & Derivasinya")

# 10
add_item(
    10, *CH2, 10,
    "١٠- مصدردن چيقاريلن وجهلر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">مصدردن چيقاريلمالرينه شدّتله احتياج دويولان آلتى وجه حقنده در:</p>
<div class="v-tree">
  <div class="v-tree-root">المصدر (نَصْرًا)</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">فعل ماضى</span>
      <span class="v-node-desc">كچمك زمانده ياپيلديغنى افاده ايچون</span>
      <span class="v-node-ex">نَصَرَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">فعل مضارع</span>
      <span class="v-node-desc">شيمديكى حال و يا كلجك زمانده ياپيلاجغنى افاده ايچون</span>
      <span class="v-node-ex">يَنْصُرُ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">اسم فاعل</span>
      <span class="v-node-desc">ايشى ياپانى افاده ايتمك ايچون</span>
      <span class="v-node-ex">نَاصِرٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">اسم مفعول</span>
      <span class="v-node-desc">ايش كنديسى اوزرينده ياپيلانى افاده ايچون</span>
      <span class="v-node-ex">مَنْصُورٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">امر</span>
      <span class="v-node-desc">بر ايشى امر ايتمك ايچون</span>
      <span class="v-node-ex">اُنْصُرْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">نهى</span>
      <span class="v-node-desc">بر ايشى منع ايتمك ايچون</span>
      <span class="v-node-ex">لَا تَنْصُرْ</span>
    </div>
  </div>
</div>
</div>""",
    "10. Apa sajakah bentuk-bentuk shighat yang diderivasikan keluar dari mashdar?",
    """<div class="ans-block">
<p class="ans-p">Terdapat 6 bentuk derivasi pokok yang sangat dibutuhkan keluar dari mashdar:</p>
<div class="v-tree">
  <div class="v-tree-root">Mashdar (نَصْرًا)</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Fi'il Madhi</span>
      <span class="v-node-desc">Menyatakan pekerjaan di masa lampau</span>
      <span class="v-node-ex">نَصَرَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Fi'il Mudhari'</span>
      <span class="v-node-desc">Menyatakan pekerjaan masa kini (hal) atau masa depan (istiqbal)</span>
      <span class="v-node-ex">يَنْصُرُ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Isim Fa'il</span>
      <span class="v-node-desc">Menyatakan pelaku pekerjaan</span>
      <span class="v-node-ex">نَاصِرٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Isim Maf'ul</span>
      <span class="v-node-desc">Menyatakan objek penderita pekerjaan</span>
      <span class="v-node-ex">مَنْصُورٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Amar</span>
      <span class="v-node-desc">Tuntutan perintah melaksanakan pekerjaan</span>
      <span class="v-node-ex">اُنْصُرْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Nahi</span>
      <span class="v-node-desc">Tuntutan larangan meninggalkan pekerjaan</span>
      <span class="v-node-ex">لَا تَنْصُرْ</span>
    </div>
  </div>
</div>
</div>""",
    "احتياج", "derivasi", ["مصدر", "مشتقات", "ماضي", "مضارع", "mashdar", "musytaqqat"]
)

# 11
add_item(
    11, *CH2, 11,
    "١١- سماعى و قياسى مصدر نه ديمكدر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>سماعى مصدر:</strong> بللى بر قاعده اوزرينه اولمايوب، فقط عربلردن ايشيتيلديكى كبى حفظ اولونان مصدردر. ثلاثى مجردك ميمسز مصدرلرى سماعيدر (نَصْرًا، خُرُوجًا، عِلْمًا كبى).</p>
<p class="ans-p"><strong>قياسى مصدر:</strong> بللى بر قاعده و وزن اوزرينه كلن مصدردر. ثلاثينك غيريسندن كلن ميمسز مصدرلر (إِفْعَالاً، تَفْعِيلاً، مُفَاعَلَةً) ايله بتون ميملى مصدرلر قياسيدر.</p>
<div class="v-tree">
  <div class="v-tree-root">المصدر</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">ثلاثى مجرد ميمسز</span>
      <span class="v-node-desc">سماعى (٣٢ وزندر)</span>
      <span class="v-node-ex">قَتْلٌ، طَلَبٌ، رَحْمَةٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ثلاثى غيرى ميمسز</span>
      <span class="v-node-desc">قياسى (بابلرينه كوره)</span>
      <span class="v-node-ex">إِكْرَامًا، تَفْرِيحًا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ثلاثى مجرد ميملى</span>
      <span class="v-node-desc">قياسى (مَفْعَلٌ / مَفْعِلٌ)</span>
      <span class="v-node-ex">مَفْتَحٌ، مَدْخَلٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ثلاثى غيرى ميملى</span>
      <span class="v-node-desc">قياسى (مضارع مجهول وزنده)</span>
      <span class="v-node-ex">مُكْرَمٌ، مُسْتَخْرَجٌ</span>
    </div>
  </div>
</div>
</div>""",
    "11. Apa pengertian mashdar sama'i dan mashdar qiyasi?",
    """<div class="ans-block">
<p class="ans-p"><strong>Mashdar Sama'i:</strong> Mashdar yang pola wazannya tidak memiliki kaidah analogis seragam, melainkan berpijak pada pendengaran dan penuturan bangsa Arab yang dihafal secara riwayat. Seluruh mashdar ghayru mimi dari fi'il Tsulatsi Mujarrad bersifat sama'i (contoh: نَصْرًا, خُرُوجًا, دِرَايَةً).</p>
<p class="ans-p"><strong>Mashdar Qiyasi:</strong> Mashdar yang memiliki kaidah wazan matematis dan teratur. Seluruh mashdar selain Tsulatsi Mujarrad (seperti bab If'al, Taf'il, Mufa'alah) serta seluruh Mashdar Mimi berstatus qiyasi.</p>
<div class="v-tree">
  <div class="v-tree-root">Pembagian 4 Kategori Mashdar</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Tsulatsi Tanpa Mim</span>
      <span class="v-node-desc">Sama'i (32 wazan)</span>
      <span class="v-node-ex">قَتْلٌ، فِسْقٌ، طَلَبٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Selain Tsulatsi Tanpa Mim</span>
      <span class="v-node-desc">Qiyasi (sesuai bab masing-masing)</span>
      <span class="v-node-ex">إِكْرَامًا، تَفْرِيحًا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Tsulatsi Mashdar Mimi</span>
      <span class="v-node-desc">Qiyasi (مَفْعَلٌ / مَفْعِلٌ)</span>
      <span class="v-node-ex">مَفْتَحٌ، مَوْعِدٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Selain Tsulatsi Mashdar Mimi</span>
      <span class="v-node-desc">Qiyasi (wazan mudhari' majhul)</span>
      <span class="v-node-ex">مُكْرَمٌ، مُسْتَخْرَجٌ</span>
    </div>
  </div>
</div>
</div>""",
    "ايشيتيلديكى", "analogis", ["سماعي", "قياسي", "مصدر", "samai", "qiyasi", "mashdar"]
)

# 12
add_item(
    12, *CH2, 12,
    "١٢- سماعى مصدرلر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">امام سيبويه حضرتلرينك ذكر ايتديكى ۳۲ سماعى مصدر وزنى و مثاللرى:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. فَعْلٌ</span><span class="v-grid-val">قَتْلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. فِعْلٌ</span><span class="v-grid-val">فِسْقٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. فُعْلٌ</span><span class="v-grid-val">شُغْلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. فَعْلَةٌ</span><span class="v-grid-val">رَحْمَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. فِعْلَةٌ</span><span class="v-grid-val">نِشْدَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. فُعْلَةٌ</span><span class="v-grid-val">كُدْرَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٧. فَعْلَى</span><span class="v-grid-val">دَعْوَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٨. فِعْلَى</span><span class="v-grid-val">ذِكْرَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٩. فُعْلَى</span><span class="v-grid-val">بُشْرَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٠. فَعْلَانٌ</span><span class="v-grid-val">لَيَّانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١١. فِعْلَانٌ</span><span class="v-grid-val">حِرْمَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٢. فُعْلَانٌ</span><span class="v-grid-val">غُفْرَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٣. فَعَلَانٌ</span><span class="v-grid-val">نَزَوَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٤. فَعَلٌ</span><span class="v-grid-val">طَلَبٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٥. فَعِلٌ</span><span class="v-grid-val">حَنَقٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٦. فَعُلٌ</span><span class="v-grid-val">صِغَرٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٧. فُعَلٌ</span><span class="v-grid-val">هُدًى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٨. فَعَلَةٌ</span><span class="v-grid-val">غَلَبَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٩. فَعِلَةٌ</span><span class="v-grid-val">سَرِقَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٠. فَعَالٌ</span><span class="v-grid-val">ذَهَابٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢١. فِعَالٌ</span><span class="v-grid-val">صِرَافٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٢. فُعَالٌ</span><span class="v-grid-val">سُؤَالٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٣. فَعَالَةٌ</span><span class="v-grid-val">زَهَادَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٤. فِعَالَةٌ</span><span class="v-grid-val">دِرَايَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٥. فُعُولٌ</span><span class="v-grid-val">دُخُولٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٦. فَعُولٌ</span><span class="v-grid-val">قَبُولٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٧. فَعِيلٌ</span><span class="v-grid-val">وَجِيفٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٨. فُعُولَةٌ</span><span class="v-grid-val">صُهُوبَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢٩. مَفْعَلٌ</span><span class="v-grid-val">مَدْخَلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣٠. مَفْعِلٌ</span><span class="v-grid-val">مَرْجِعٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣١. مَفْعَلَةٌ</span><span class="v-grid-val">مَسْعَاةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣٢. مَفْعِلَةٌ</span><span class="v-grid-val">مَحْمَدَةٌ</span></div>
</div>
</div>""",
    "12. Apa sajakah wazan-wazan mashdar sama'i?",
    """<div class="ans-block">
<p class="ans-p">Terdapat 32 wazan mashdar sama'i untuk Tsulatsi Mujarrad yang dirangkum oleh Imam Sibawaih rahimahullah:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. فَعْلٌ</span><span class="v-grid-val">قَتْلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. فِعْلٌ</span><span class="v-grid-val">فِسْقٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. فُعْلٌ</span><span class="v-grid-val">شُغْلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">4. فَعْلَةٌ</span><span class="v-grid-val">رَحْمَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">5. فِعْلَةٌ</span><span class="v-grid-val">نِشْدَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">6. فُعْلَةٌ</span><span class="v-grid-val">كُدْرَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">7. فَعْلَى</span><span class="v-grid-val">دَعْوَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">8. فِعْلَى</span><span class="v-grid-val">ذِكْرَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">9. فُعْلَى</span><span class="v-grid-val">بُشْرَى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">10. فَعْلَانٌ</span><span class="v-grid-val">لَيَّانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">11. فِعْلَانٌ</span><span class="v-grid-val">حِرْمَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">12. فُعْلَانٌ</span><span class="v-grid-val">غُفْرَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">13. فَعَلَانٌ</span><span class="v-grid-val">نَزَوَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">14. فَعَلٌ</span><span class="v-grid-val">طَلَبٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">15. فَعِلٌ</span><span class="v-grid-val">حَنَقٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">16. فَعُلٌ</span><span class="v-grid-val">صِغَرٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">17. فُعَلٌ</span><span class="v-grid-val">هُدًى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">18. فَعَلَةٌ</span><span class="v-grid-val">غَلَبَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">19. فَعِلَةٌ</span><span class="v-grid-val">سَرِقَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">20. فَعَالٌ</span><span class="v-grid-val">ذَهَابٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">21. فِعَالٌ</span><span class="v-grid-val">صِرَافٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">22. فُعَالٌ</span><span class="v-grid-val">سُؤَالٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">23. فَعَالَةٌ</span><span class="v-grid-val">زَهَادَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">24. فِعَالَةٌ</span><span class="v-grid-val">دِرَايَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">25. فُعُولٌ</span><span class="v-grid-val">دُخُولٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">26. فَعُولٌ</span><span class="v-grid-val">قَبُولٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">27. فَعِيلٌ</span><span class="v-grid-val">وَجِيفٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">28. فُعُولَةٌ</span><span class="v-grid-val">صُهُوبَةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">29. مَفْعَلٌ</span><span class="v-grid-val">مَدْخَلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">30. مَفْعِلٌ</span><span class="v-grid-val">مَرْجِعٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">31. مَفْعَلَةٌ</span><span class="v-grid-val">مَسْعَاةٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">32. مَفْعِلَةٌ</span><span class="v-grid-val">مَحْمَدَةٌ</span></div>
</div>
</div>""",
    "سيبويه", "Sibawaih", ["سيبويه", "سماعي", "أوزان", "المصدر", "wazan", "samai"]
)

# 13
add_item(
    13, *CH2, 13,
    "١٣- مصدر ميمى اسم زمان اسم مكان نصل كلير؟",
    """<div class="ans-block">
<p class="ans-p">مصدر ميمى، اسم زمان و اسم مكان قياسى اولوب فعل مضارعك عين الفعلنه و فعلنك قسمينه باقيلير:</p>
<div class="v-tree">
  <div class="v-tree-root">قواعد مصدر ميمى، زمان و مكان</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">مَفْعَلٌ وزنى</span>
      <span class="v-node-desc">مضارعك عين الفعلى مفتوح و يا مضموم اولورسه؛ و يا ناقص و لفيف مقرونده</span>
      <span class="v-node-ex">يَفْتَحُ -> مَفْتَحٌ، يَدْخُلُ -> مَدْخَلٌ، يَغْزُو -> مَغْزًى</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">مَفْعِلٌ وزنى</span>
      <span class="v-node-desc">مضارعك عين الفعلى مكسور ايسه زمان و مكان (يَضْرِبُ -> مَضْرِبٌ)، و مثالده تمامى</span>
      <span class="v-node-ex">يَعِدُ -> مَوْعِدٌ، يَقَعُ -> مَوْقِعٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ثلاثى غيريسى</span>
      <span class="v-node-desc">مضارع مجهول وزنى اوزرينه كلير</span>
      <span class="v-node-ex">يُكْرَمُ -> مُكْرَمٌ، يُسْتَخْرَجُ -> مُسْتَخْرَجٌ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">فائدہ: مضارعنك عين الفعلى مكسور اولان بابلرده مصدر ميمى قياساً "مَفْعَلٌ" اوزره كلير (يَضْرِبُ -> مَضْرَبٌ)، آنجق مَرْجِعٌ و مَصِيرٌ شاذ اولارق كسر ايله كَلير.</div>
</div>""",
    "13. Bagaimana cara membentuk mashdar mimi, isim zaman, dan isim makan?",
    """<div class="ans-block">
<p class="ans-p">Pembentukan Mashdar Mimi, Isim Zaman, dan Isim Makan bersifat qiyasi dengan melihat harakat 'ain fi'il mudhari' serta jenis bina' kata kerjanya:</p>
<div class="v-tree">
  <div class="v-tree-root">Ketentuan Wazan Mimi, Zaman & Makan</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Wazan مَفْعَلٌ (Fathah)</span>
      <span class="v-node-desc">Jika 'ain mudhari' fathah atau dhammah, serta pada fi'il Naqish & Lafif Maqrun</span>
      <span class="v-node-ex">يَفْتَحُ -> مَفْتَحٌ، يَدْخُلُ -> مَدْخَلٌ، يَغْزُو -> مَغْزًى</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Wazan مَفْعِلٌ (Kasrah)</span>
      <span class="v-node-desc">Jika 'ain mudhari' kasrah (untuk zaman & makan), serta pada seluruh fi'il Mitsal</span>
      <span class="v-node-ex">يَضْرِبُ -> مَضْرِبٌ، يَعِدُ -> مَوْعِدٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Selain Tsulatsi Mujarrad</span>
      <span class="v-node-desc">Mengikuti wazan fi'il mudhari' majhul (awalan mu- dan sebelum akhir fathah)</span>
      <span class="v-node-ex">يُكْرَمُ -> مُكْرَمٌ، يُسْتَخْرَجُ -> مُسْتَخْرَجٌ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Kaidah penting: Pada fi'il yang 'ain mudhari'-nya kasrah, mashdar mimi-nya secara qiyas tetap berwazan مَفْعَلٌ (مَضْرَبٌ), hanya saja lafazh مَرْجِعٌ dan مَصِيرٌ secara syadz datang dengan kasrah.</div>
</div>""",
    "مفتوح", "qiyasi", ["مصدر", "ميمي", "زمان", "مكان", "مفعل", "mimi", "zaman", "makan"]
)

# 14
add_item(
    14, *CH2, 14,
    "١٤- شاذ اوالن اون ايكى كلمه يى سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p">قياسه كوره مَفْعَلٌ اولمسى لازم ايكن، عين الفعلنك كسرى ايله "مَفْعِلٌ" شكلنده كلوب شاذ اولان اون ايكى كلمه:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. الْمَطْلِعُ</span><span class="v-grid-val">طُلُوع ير/زمانى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. الْمَغْرِبُ</span><span class="v-grid-val">غروب ير/زمانى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. الْمَسْجِدُ</span><span class="v-grid-val">سجده ير/زمانى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. الْمَنْسِكُ</span><span class="v-grid-val">عبادت ير/زمانى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. الْمَشْرِقُ</span><span class="v-grid-val">گونشك دوغدوغو ير</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. الْمَسْكِنُ</span><span class="v-grid-val">اقامتگاه، اول</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٧. الْمَنْبِتُ</span><span class="v-grid-val">بيتين ير، توپراق</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٨. الْمَفْرِقُ</span><span class="v-grid-val">صاچ آيريلان ير</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٩. الْمَحْشِرُ</span><span class="v-grid-val">توپلانمه يرى</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٠. الْمَسْقِطُ</span><span class="v-grid-val">دوشولن ير (مسقط رأس)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١١. الْمَجْزِرُ</span><span class="v-grid-val">دوه كسيلن ير</span></div>
  <div class="v-grid-card"><span class="v-grid-label">١٢. الْمَجْمِعُ</span><span class="v-grid-val">توپلانيلان ير (٣. بابدن)</span></div>
</div>
<div class="v-badge-note">بو كلمه لرك اوك برى ١. بابدن اولوب، يالكز "الْمَجْمِعُ" ٣. بابدندر. بعضى يرlerde قياس اوزره فتحه ايله ده روايت اولونموشدر (مَطْلَعِ الْفَجْرِ، مَنْسَكًا).</div>
</div>""",
    "14. Sebutkan 12 kata isim zaman/makan yang syadz (menyalahi qiyas wazan maf'al menjadi maf'il)!",
    """<div class="ans-block">
<p class="ans-p">12 kata isim zaman dan isim makan yang menurut kaidah qiyas seharusnya berwazan <span class="arabic-inline font-bold">مَفْعَلٌ</span> (fathah), namun diriwayatkan secara <em>syadz</em> dengan harakat kasrah (<span class="arabic-inline font-bold">مَفْعِلٌ</span>):</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. Al-Mathli' (الْمَطْلِعُ)</span><span class="v-grid-val">Tempat/waktu terbit</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. Al-Maghrib (الْمَغْرِبُ)</span><span class="v-grid-val">Tempat/waktu terbenam</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. Al-Masjid (الْمَسْجِدُ)</span><span class="v-grid-val">Tempat/waktu sujud</span></div>
  <div class="v-grid-card"><span class="v-grid-label">4. Al-Mansik (الْمَنْسِكُ)</span><span class="v-grid-val">Tempat/waktu ibadah</span></div>
  <div class="v-grid-card"><span class="v-grid-label">5. Al-Masyriq (الْمَشْرِقُ)</span><span class="v-grid-val">Arah timur</span></div>
  <div class="v-grid-card"><span class="v-grid-label">6. Al-Maskin (الْمَسْكِنُ)</span><span class="v-grid-val">Tempat tinggal</span></div>
  <div class="v-grid-card"><span class="v-grid-label">7. Al-Manbit (الْمَنْبِتُ)</span><span class="v-grid-val">Tempat tumbuh tanaman</span></div>
  <div class="v-grid-card"><span class="v-grid-label">8. Al-Mafriq (الْمَفْرِقُ)</span><span class="v-grid-val">Belahan rambut/persimpangan</span></div>
  <div class="v-grid-card"><span class="v-grid-label">9. Al-Mahsyir (الْمَحْشِرُ)</span><span class="v-grid-val">Tempat berhimpun</span></div>
  <div class="v-grid-card"><span class="v-grid-label">10. Al-Masqith (الْمَسْقِطُ)</span><span class="v-grid-val">Tempat jatuh/kelahiran</span></div>
  <div class="v-grid-card"><span class="v-grid-label">11. Al-Majzir (الْمَجْزِرُ)</span><span class="v-grid-val">Tempat sembelihan unta</span></div>
  <div class="v-grid-card"><span class="v-grid-label">12. Al-Majmi' (الْمَجْمِعُ)</span><span class="v-grid-val">Tempat berkumpul (bab 3)</span></div>
</div>
<div class="v-badge-note">Sebelas kata pertama berasal dari fi'il Tsulatsi bab I (yadhul-u), dan Al-Majmi' dari bab III (yajma'-u). Pada beberapa qira'at Al-Qur'an, kata-kata tersebut juga datang sesuai qiyas dengan fathah (seperti مَطْلَعِ الْفَجْرِ dan مَنْسَكًا).</div>
</div>""",
    "الْمَسْجِدُ", "terbenam", ["شاذ", "مفعل", "المسجد", "المشرق", "المغرب", "syadz", "mafil"]
)

# 15
add_item(
    15, *CH2, 15,
    "١٥- زائد بابلردن اسم فاعل و مفعول نصل كلير؟",
    """<div class="ans-block">
<p class="ans-p">ثلاثى مجرد اوزرينه زائد اولان بابلرده (رباعى مجرد، ملحقلر، خماسى و سداسى):</p>
<p class="ans-p">مضارعت حرفى مضموم بر ميم حرفنه تبديل اولونور (مُـ).</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin">
    <span class="v-step-word">يُكْرِمُ</span>
    <span class="v-step-tag">مضارع معلوم</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">مُكْرِمٌ</span>
    <span class="v-step-tag">اسم فاعل (كسر ايله)</span>
  </div>
  <span class="v-step-arrow">|</span>
  <div class="v-step-card is-final">
    <span class="v-step-word">مُكْرَمٌ</span>
    <span class="v-step-tag">اسم مفعول (فتح ايله)</span>
  </div>
</div>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">اسم فاعل</span>
    <span class="v-grid-desc">عين الفعل مكسوردر</span>
    <span class="v-grid-val">مُدَحْرِجٌ، مُنْطَلِقٌ، مُسْتَغْفِرٌ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">اسم مفعول، مصدر ميمى، زمان، مكان</span>
    <span class="v-grid-desc">عين الفعل مفتوحدر (مضارع مجهول وزنده)</span>
    <span class="v-grid-val">مُدَحْرَجٌ، مُنْطَلَقٌ، مُسْتَغْفَرٌ</span>
  </div>
</div>
</div>""",
    "15. Bagaimana cara membentuk isim fa'il dan isim maf'ul dari bab-bab fi'il mazid?",
    """<div class="ans-block">
<p class="ans-p">Pada bab-bab yang memiliki tambahan huruf (Ruba'i Mujarrad, Mulhaq, Khumasi, dan Sudasi):</p>
<p class="ans-p">Huruf mudhara'ah di awal diganti dengan huruf Mim yang berharakat dhammah (<span class="arabic-inline font-bold">مُـ</span>).</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin">
    <span class="v-step-word">يُكْرِمُ</span>
    <span class="v-step-tag">Mudhari' Ma'lum</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">مُكْرِمٌ</span>
    <span class="v-step-tag">Isim Fa'il (Kasrah)</span>
  </div>
  <span class="v-step-arrow">|</span>
  <div class="v-step-card is-final">
    <span class="v-step-word">مُكْرَمٌ</span>
    <span class="v-step-tag">Isim Maf'ul (Fathah)</span>
  </div>
</div>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">Isim Fa'il</span>
    <span class="v-grid-desc">Huruf sebelum akhir berharakat kasrah</span>
    <span class="v-grid-val">مُدَحْرِجٌ، مُسْتَخْرِجٌ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">Isim Maf'ul / Mimi / Zaman / Makan</span>
    <span class="v-grid-desc">Huruf sebelum akhir berharakat fathah (mengikuti wazan mudhari' majhul)</span>
    <span class="v-grid-val">مُدَحْرَجٌ، مُسْتَخْرَجٌ</span>
  </div>
</div>
</div>""",
    "مُكْرَمٌ", "tambahan", ["اسم", "فاعل", "مفعول", "زائد", "مزيد", "isim fail", "isim maful"]
)

# 16
add_item(
    16, *CH2, 16,
    "١٦- فعل ماضى نه در و قاچ قسمدر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>فعل ماضى:</strong> بر ايشك كچمك زمانده ياپيلديغنى افاده ايدن فعلدر. معلوم و مجهول اولارق ايكى قسمدر:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">ماضى معلوم (نَصَرَ)</span>
    <span class="v-grid-desc">فاعلى معلوم اولان فعل</span>
    <span class="v-grid-val">نَصَرَ زَيْدٌ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">ماضى مجهول (نُصِرَ)</span>
    <span class="v-grid-desc">نائب فاعله اسناد اولونان فعل</span>
    <span class="v-grid-val">نُصِرَ عَمْرٌو</span>
  </div>
</div>
<p class="ans-p"><strong>ماضى معلومك آخر حرفنك حركه لرى:</strong></p>
<div class="v-tree">
  <div class="v-tree-root">حركات آخر الماضى</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">فتح اوزره مبنى</span>
      <span class="v-node-desc">مفرد و تثنيه غائب و غائبه ده</span>
      <span class="v-node-ex">نَصَرَ، نَصَرَا، نَصَرَتْ، نَصَرَتَا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">ضم اوزره مبنى</span>
      <span class="v-node-desc">جمع مذكر غائبده</span>
      <span class="v-node-ex">نَصَرُوا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">سكون اوزره مبنى</span>
      <span class="v-node-desc">جمع مؤنث غائبه دن صوكوكه قدر</span>
      <span class="v-node-ex">نَصَرْنَ، نَصَرْتَ ... نَصَرْنَا</span>
    </div>
  </div>
</div>
</div>""",
    "16. Apakah fi'il madhi dan berapa macam pembagian serta hukum harakat akhirnya?",
    """<div class="ans-block">
<p class="ans-p"><strong>Fi'il Madhi:</strong> Kata kerja yang menunjukkan bahwa suatu pekerjaan telah selesai dilaksanakan pada masa lampau. Terbagi menjadi 2: Ma'lum (نَصَرَ) dan Majhul (نُصِرَ).</p>
<div class="v-tree">
  <div class="v-tree-root">Hukum Mabni Huruf Akhir Fi'il Madhi</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Mabni Fathah</span>
      <span class="v-node-desc">Mufrad & tatsniyah ghaib serta ghaibah</span>
      <span class="v-node-ex">نَصَرَ، نَصَرَا، نَصَرَتْ، نَصَرَتَا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Mabni Dhammah</span>
      <span class="v-node-desc">Jama' mudzakkar ghaib karena bertemu wawu jama'ah</span>
      <span class="v-node-ex">نَصَرُوا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Mabni Sukun</span>
      <span class="v-node-desc">Mulai jama' muannats ghaibah sampai akhir tashrif</span>
      <span class="v-node-ex">نَصَرْنَ، نَصَرْتَ، نَصَرْتُمَا ... نَصَرْنَا</span>
    </div>
  </div>
</div>
</div>""",
    "مجهول", "selesai", ["ماضي", "معلوم", "مجهول", "مبني", "madhi", "hukum"]
)

# 17
add_item(
    17, *CH2, 17,
    "١٧- همزهء وصللر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>همزهء وصل:</strong> ابتدا حالنده (باشلاركن) ثابت اولوب، درج (كچيش) حالنده دوشن همزه در. ايكى قسمدر:</p>
<div class="v-tree">
  <div class="v-tree-root">همزهء وصل</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">١. قياسى همزهء وصللر</span>
      <span class="v-node-desc">قاعده ايله بيلينن بابلرده</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">خماسى و سداسى ماضى، مصدر و امرى (اِنْطَلَقَ، اِسْتَغْفَرَ)</span>
        <span class="v-leaf">ثلاثى نك امر حاضرى (اُنْصُرْ، اِضْرِبْ)</span>
        <span class="v-leaf">لام تعريف همزه سى (الْحَمْدُ)</span>
      </div>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٢. سماعى همزهء وصللر</span>
      <span class="v-node-desc">عربدن اون كلمه ده ايشيتيلن</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">اِبْنٌ (اوغول)</span>
        <span class="v-leaf">اِبْنَمٌ (اوغول)</span>
        <span class="v-leaf">اِبْنَةٌ (قيز)</span>
        <span class="v-leaf">اِمْرُؤٌ (كيشى)</span>
        <span class="v-leaf">اِمْرَأَةٌ (قادين)</span>
        <span class="v-leaf">اِثْنَانِ (ايكى)</span>
        <span class="v-leaf">اِثْنَتَانِ (ايكى)</span>
        <span class="v-leaf">اِسْمٌ (آد)</span>
        <span class="v-leaf">اِسْتٌ (اوتوراق)</span>
        <span class="v-leaf">اَيْمُنٌ (يمينلر)</span>
      </div>
    </div>
  </div>
</div>
</div>""",
    "17. Apakah yang dimaksud dengan hamzah washal dan apa sajakah jenisnya?",
    """<div class="ans-block">
<p class="ans-p"><strong>Hamzah Washal:</strong> Hamzah yang tetap terbaca saat di awal ucapan (ibtida') dan gugur dalam penyambungan bacaan (darj). Terbagi menjadi dua kategori:</p>
<div class="v-tree">
  <div class="v-tree-root">Hamzah Washal</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">1. Hamzah Washal Qiyasi</span>
      <span class="v-node-desc">Ditetapkan berdasarkan kaidah keteraturan sharaf</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">Madhi, mashdar, amar bab Khumasi & Sudasi</span>
        <span class="v-leaf">Amar hadhir tsulatsi mujarrad (اُنْصُرْ، اِضْرِبْ)</span>
        <span class="v-leaf">Alif Lam ma'rifah (الْـ)</span>
      </div>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">2. Hamzah Washal Sama'i</span>
      <span class="v-node-desc">Hanya berlaku pada 10 isim sima'i dari bangsa Arab</span>
      <div class="v-sub-leaves">
        <span class="v-leaf">اِبْنٌ (anak laki-laki)</span>
        <span class="v-leaf">اِبْنَمٌ (anak laki-laki)</span>
        <span class="v-leaf">اِبْنَةٌ (anak perempuan)</span>
        <span class="v-leaf">اِمْرُؤٌ (lelaki)</span>
        <span class="v-leaf">اِمْرَأَةٌ (wanita)</span>
        <span class="v-leaf">اِثْنَانِ (dua lk)</span>
        <span class="v-leaf">اِثْنَتَانِ (dua pr)</span>
        <span class="v-leaf">اِسْمٌ (nama)</span>
        <span class="v-leaf">اِسْتٌ (pantat)</span>
        <span class="v-leaf">اَيْمُنٌ (sumpah)</span>
      </div>
    </div>
  </div>
</div>
</div>""",
    "ابتدا", "terbaca", ["همزة", "وصل", "قياسي", "سماعي", "hamzah", "washal"]
)

# 18
add_item(
    18, *CH2, 18,
    "١٨- همزهء وصللرك حركه لرى نصلدر؟",
    """<div class="ans-block">
<p class="ans-p">همزهء وصل كچيشده دوشر، ابتدا حالنده ايسه اوچ شكلده حركه لنير:</p>
<div class="v-tree">
  <div class="v-tree-root">حركات همزة الوصل</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">مفتوح (فَتْحَه)</span>
      <span class="v-node-desc">لام تعريفه بيتيشن همزه و "اَيْمُنُ" كلمه سنك همزه سى</span>
      <span class="v-node-ex">الْحَمْدُ، اَيْمُنُ اللهِ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">مضموم (ضَمَّه)</span>
      <span class="v-node-desc">ثلاثى ١ و ٥. بابلرك امر حاضرى و خماسى/سداسى ماضى مجهولى</span>
      <span class="v-node-ex">اُنْصُرْ، اُحْسُنْ، اُسْتُخْرِجَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">مكسور (كَسْرَه)</span>
      <span class="v-node-desc">بونلرك ديشنده كى بتون همزهء وصللر</span>
      <span class="v-node-ex">اِضْرِبْ، اِعْلَمْ، اِنْطَلِقْ، اِبْنٌ، اِسْمٌ</span>
    </div>
  </div>
</div>
</div>""",
    "18. Bagaimanakah ketentuan harakat hamzah washal?",
    """<div class="ans-block">
<p class="ans-p">Hamzah washal gugur saat washal dan saat ibtida' (dibaca di awal) memiliki 3 macam harakat:</p>
<div class="v-tree">
  <div class="v-tree-root">Harakat Hamzah Washal</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Fathah</span>
      <span class="v-node-desc">Hanya pada alif lam ma'rifah dan kata sumpah اَيْمُنُ</span>
      <span class="v-node-ex">الْحَمْدُ، اَيْمُنُ اللهِ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Dhammah</span>
      <span class="v-node-desc">Amar hadhir bab 1 & 5 serta madhi majhul khumasi/sudasi</span>
      <span class="v-node-ex">اُنْصُرْ، اُحْسُنْ، اُسْتُخْرِجَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Kasrah</span>
      <span class="v-node-desc">Pada seluruh sisa hamzah washal lainnya</span>
      <span class="v-node-ex">اِضْرِبْ، اِفْتَحْ، اِسْتَغْفَرَ، اِبْنٌ، اِسْمٌ</span>
    </div>
  </div>
</div>
</div>""",
    "اُسْتُخْرِجَ", "harakat", ["حركات", "همزة", "الوصل", "harakat", "washal"]
)

# 19
add_item(
    19, *CH2, 19,
    "١٩- همزهء قطعلر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>همزهء قطع:</strong> هم ابتدا هم ده وصل حالنده ثابت اولوب اصال دوشمه ين همزه لردر. باشليجه همزهء قطعلر:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. إفعال بابى</span><span class="v-grid-val">أَكْرَمَ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. متكلم وحده</span><span class="v-grid-val">أَنْصُرُ، أُكْرِمُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. جمع تكثير</span><span class="v-grid-val">أَفْعَالٌ، أَقْوَالٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. استفهام همزه سى</span><span class="v-grid-val">أَرَجُلٌ فِي الدَّارِ؟</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. اسم تفضيل</span><span class="v-grid-val">أَنْصَرُ، أَعْلَمُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. صفت مشبهه</span><span class="v-grid-val">أَحْمَرُ، أَصْفَرُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٧. ندا اولونان اسم جلال</span><span class="v-grid-val">يَا أَللهُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٨. ماضينك اصلى همزه سى</span><span class="v-grid-val">أَخَذَ، أَمَرَ، أَكَلَ</span></div>
</div>
</div>""",
    "19. Apakah yang dimaksud dengan hamzah qatha' dan apa sajakah contohnya?",
    """<div class="ans-block">
<p class="ans-p"><strong>Hamzah Qatha':</strong> Hamzah yang tetap terbaca baik saat mengawali bacaan (ibtida') maupun saat disambung (washal). Di antaranya:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. Bab If'al</span><span class="v-grid-val">أَكْرَمَ، يُكْرِمُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. Mutakallim Wahdah</span><span class="v-grid-val">أَنْصُرُ، أُعَلِّمُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. Jama' Taksir</span><span class="v-grid-val">أَقْوَالٌ، أَنْفُسٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">4. Hamzah Tanya (Istifham)</span><span class="v-grid-val">أَزَيْدٌ فِي الدَّارِ؟</span></div>
  <div class="v-grid-card"><span class="v-grid-label">5. Isim Tafdhil</span><span class="v-grid-val">أَعْلَمُ، أَكْبَرُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">6. Shifat Musyabbahah</span><span class="v-grid-val">أَحْمَرُ، أَبْيَضُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">7. Lafazh Jalalah Munada</span><span class="v-grid-val">يَا أَللهُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">8. Huruf Asli Fi'il Madhi</span><span class="v-grid-val">أَخَذَ، أَمَرَ، أَكَلَ</span></div>
</div>
</div>""",
    "أَكْرَمَ", "terbaca", ["همزة", "قطع", "إفعال", "استفهام", "hamzah", "qatha"]
)

print("Chapter 2 done (19 items).")

# --- CHAPTER 3: ٢. فصل: تصريف الصحيح و نون التأكيد ---
CH3 = ("fashl-2-tasrif-shahih", "٢. فصل: تصريف الصحيح و نون التأكيد", "Fashl 2: Tashrif Shahih & Nun Taukid")

# 20
add_item(
    20, *CH3, 20,
    "٢٠- امر و نهى ده جزم علامتلوى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">امر و نهى ده جزم علامتلرى اوچدر:</p>
<div class="v-tree">
  <div class="v-tree-root">جزم علامتلرى</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">نونك دوشمه سى</span>
      <span class="v-node-desc">تثنيه، جمع مذكر و مفرد مؤنث مخاطبه ده</span>
      <span class="v-node-ex">لِيَنْصُرَا، لِيَنْصُرُوا، لَا تَنْصُرِي</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">سكون (آخرينك سكونى)</span>
      <span class="v-node-desc">صحيح لام الفعلى اولان مفردلرده</span>
      <span class="v-node-ex">لِيَنْصُرْ، لَا تَنْصُرْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">علت حرفينك دوشمه سى</span>
      <span class="v-node-desc">معتل لام اولان ناقص فعللرده</span>
      <span class="v-node-ex">لِيَغْزُ (يَغْزُو دن)، لِيَرْمِ (يَرْمِي دن)</span>
    </div>
  </div>
</div>
<div class="v-badge-note">استثناء: جمع مؤنث نونى فاعل اولدوغى ايچون جزم حالنده ده اصال دوشمز، ثابتدر (لِيَنْصُرْنَ، لَا تَنْصُرْنَ).</div>
</div>""",
    "20. Apa sajakah tanda-tanda jazm pada shighat fi'il amar dan nahi?",
    """<div class="ans-block">
<p class="ans-p">Tanda jazm pada shighat fi'il amar dan nahi ada 3 macam:</p>
<div class="v-tree">
  <div class="v-tree-root">Tanda-tanda Jazm</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Gugurnya Huruf Nun (Hadzfun Nun)</span>
      <span class="v-node-desc">Pada tatsniyah, jama' mudzakkar, dan mufrad muannats mukhatabah</span>
      <span class="v-node-ex">لِيَنْصُرَا، لِيَنْصُرُوا، لَا تَنْصُرِي</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Sukun Huruf Akhir</span>
      <span class="v-node-desc">Pada fi'il mufrad yang berhuruf akhir shahih</span>
      <span class="v-node-ex">لِيَنْصُرْ، لَا تَنْصُرْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Gugurnya Huruf 'Illat</span>
      <span class="v-node-desc">Pada fi'il mu'tal lam (naqish)</span>
      <span class="v-node-ex">لِيَغْزُ (dari يَغْزُو)، لِيَرْمِ (dari يَرْمِي)</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Pengecualian: Nun jama' muannats (niswah) adalah isim dhamir berkedudukan sebagai fa'il, sehingga mabni dan tidak pernah gugur dalam keadaan jazm (contoh: لِيَنْصُرْنَ).</div>
</div>""",
    "لِيَنْصُرْنَ", "Pengecualian", ["جزم", "علامات", "امر", "نهي", "jazm", "tanda"]
)

# 21
add_item(
    21, *CH3, 21,
    "٢١- امر حاضر نصل ياپيلير؟",
    """<div class="ans-block">
<p class="ans-p"><strong>امر حاضر:</strong> فعل مضارع معلوم مفرد مذكر مخاطب صيغه سندن ياپيلير (تَنْصُرُ):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin">
    <span class="v-step-word">تَنْصُرُ</span>
    <span class="v-step-tag">مضارع مخاطب</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">نْصُرُ</span>
    <span class="v-step-tag">مضارعت "ت" حذفى</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">اُنْصُرُ</span>
    <span class="v-step-tag">همزهء وصل اكله نمسى</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final">
    <span class="v-step-word">اُنْصُرْ</span>
    <span class="v-step-tag">آخرينك وقف/سكونى</span>
  </div>
</div>
<div class="v-badge-note">اگر مضارعت حرفندن صوكره كى حرف حركه لى ايسه همزه يه كرك قالماز، فقط آخرى ساكن قيلينير: تُفَرِّحُ -> فَرِّحْ، تُقَاتِلُ -> قَاتِلْ.</div>
</div>""",
    "21. Bagaimanakah tata cara membuat Fi'il Amar Hadhir?",
    """<div class="ans-block">
<p class="ans-p"><strong>Cara Pembentukan Amar Hadhir:</strong> Dibentuk dari Fi'il Mudhari' Ma'lum Mufrad Mudzakkar Mukhatab (<span class="arabic-inline font-bold">تَنْصُرُ</span>):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin">
    <span class="v-step-word">تَنْصُرُ</span>
    <span class="v-step-tag">Mudhari' Mukhatab</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">نْصُرُ</span>
    <span class="v-step-tag">Buang Huruf Mudhara'ah 'Ta'</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card">
    <span class="v-step-word">اُنْصُرُ</span>
    <span class="v-step-tag">Tambah Hamzah Washal</span>
  </div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final">
    <span class="v-step-word">اُنْصُرْ</span>
    <span class="v-step-tag">Sukunkan Huruf Akhir</span>
  </div>
</div>
<div class="v-badge-note">Jika huruf setelah huruf mudhara'ah sudah berharakat, maka tidak memerlukan hamzah washal, cukup sukunkan huruf akhirnya saja: تُفَرِّحُ $\rightarrow$ فَرِّحْ، تُقَاتِلُ $\rightarrow$ قَاتِلْ.</div>
</div>""",
    "مضارعت", "Pembentukan", ["امر", "حاضر", "تَنْصُرُ", "اُنْصُرْ", "amar", "hadhir"]
)

# 22
add_item(
    22, *CH3, 22,
    "٢٢- اسم فاعل نصل كلير معنالرى ايله سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p">اسم فاعل، فعل ماضينك عين الفعلنه باقيلير:</p>
<div class="v-tree">
  <div class="v-tree-root">اسم فاعل وزنلرى</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">عين الفعل مفتوح ايسه</span>
      <span class="v-node-desc">١، ٢، و ٣. بابلردن: "فَاعِلٌ" وزنده كلير</span>
      <span class="v-node-ex">نَاصِرٌ، ضَارِبٌ، فَتَّاحٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">عين الفعل مضموم ايسه</span>
      <span class="v-node-desc">٥. بابدن: "فَعِيلٌ" و "فَعْلٌ" وزنده كلير</span>
      <span class="v-node-ex">عَظِيمٌ، ضَخْمٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">عين الفعل مكسور ايسه</span>
      <span class="v-node-desc">متعدى دن: "فَاعِلٌ" (عَالِمٌ)، لازمدن ٤ وزن اوزره كلير</span>
      <span class="v-node-ex">مَرِيضٌ، زَمِنٌ، أَحْمَرُ، عَطْشَانُ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">معنا فرقى: اسم فاعل حدوث معناسينه در (كلوب كچيجيدر؛ ضَارِبٌ: او آنده اوران). صفة مشبهه ايسه ثبوت معناسينه در (ثابت و دائم صفتدر؛ حَسَنٌ، كَرِيمٌ).</div>
</div>""",
    "22. Bagaimana pembentukan Isim Fa'il beserta makna dan perbedaannya?",
    """<div class="ans-block">
<p class="ans-p">Pembentukan Isim Fa'il ditentukan oleh harakat 'ain fi'il madhi-nya:</p>
<div class="v-tree">
  <div class="v-tree-root">Wazan Isim Fa'il</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">'Ain Fathah (Bab 1, 2, 3)</span>
      <span class="v-node-desc">Mengikuti wazan فَاعِلٌ</span>
      <span class="v-node-ex">نَاصِرٌ، ضَارِبٌ، عَابِدٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">'Ain Dhammah (Bab 5)</span>
      <span class="v-node-desc">Mengikuti wazan فَعِيلٌ dan فَعْلٌ</span>
      <span class="v-node-ex">عَظِيمٌ، ضَخْمٌ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">'Ain Kasrah (Bab 4, 6)</span>
      <span class="v-node-desc">Muta'addi berwazan فَاعِلٌ (عَالِمٌ); lazim mengikuti 4 wazan sifat</span>
      <span class="v-node-ex">مَرِيضٌ، زَمِنٌ، أَحْمَرُ، عَطْشَانُ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Perbedaan makna: Isim Fa'il bermakna <em>huduts</em> (perbuatan temporer yang baru terjadi), sedangkan Shifat Musyabbahah bermakna <em>tsubut</em> (sifat permanen yang melekat kuat pada diri subjek).</div>
</div>""",
    "حدوث", "ditentukan", ["اسم", "فاعل", "حدوث", "ثبوت", "isim", "fail"]
)

# 23
add_item(
    23, *CH3, 23,
    "٢٣- اسم فاعل لازم فعلدن هانگى وزنلر اوزره كلير؟",
    """<div class="ans-block">
<p class="ans-p">لازم فعلدن كلن اسم فاعل (صفة مشبهه)، خصوصيله ٤. بابدن دورت اصل وزن اوزره كلير:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">١. فَعِيلٌ</span>
    <span class="v-grid-desc">خسته لق و آغرى معناسنده</span>
    <span class="v-grid-val">مَرِيضٌ (جمعى: مَرْضَى)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢. فَعِلٌ</span>
    <span class="v-grid-desc">سكتليك و كوتوروملك معناسنده</span>
    <span class="v-grid-val">زَمِنٌ (جمعى: زَمْنَى)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٣. أَفْعَلُ (مؤنثى: فَعْلَاءُ)</span>
    <span class="v-grid-desc">رنكلر و عيبلر</span>
    <span class="v-grid-val">أَحْمَرُ (حَمْرَاءُ، جمع: حُمْرٌ)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٤. فَعْلَانُ (مؤنثى: فَعْلَى)</span>
    <span class="v-grid-desc">بوشلوق و طولولوك حاللرى</span>
    <span class="v-grid-val">عَطْشَانُ (عَطْشَى، جمع: عِطَاشٌ)</span>
  </div>
</div>
</div>""",
    "23. Pada fi'il lazim, wazan apa sajakah yang digunakan untuk isim fa'il (shifat musyabbahah)?",
    """<div class="ans-block">
<p class="ans-p">Pada fi'il lazim (khususnya dari bab ke-4), isim fa'il yang berfaedah shifat musyabbahah datang dengan 4 wazan utama:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">1. فَعِيلٌ</span>
    <span class="v-grid-desc">Menyatakan penyakit/derita</span>
    <span class="v-grid-val">مَرِيضٌ (jama': مَرْضَى)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">2. فَعِلٌ</span>
    <span class="v-grid-desc">Menyatakan cacat kronis/kelumpuhan</span>
    <span class="v-grid-val">زَمِنٌ (jama': زَمْنَى)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">3. أَفْعَلُ (muannats: فَعْلَاءُ)</span>
    <span class="v-grid-desc">Warna dan cacat fisik tampak</span>
    <span class="v-grid-val">أَحْمَرُ (merah, jama': حُمْرٌ)</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">4. فَعْلَانُ (muannats: فَعْلَى)</span>
    <span class="v-grid-desc">Kondisi haus, dahaga, dan kepenuhan</span>
    <span class="v-grid-val">عَطْشَانُ (haus, jama': عِطَاشٌ)</span>
  </div>
</div>
</div>""",
    "مَرِيضٌ", "derita", ["لازم", "فعيل", "فعل", "أفعل", "فعلان", "lazim", "sifat"]
)

# 24
add_item(
    24, *CH3, 24,
    "٢٤- صفة مشبهه وزنلرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">صفة مشبهه ثبوت معناسينه در (دائم و صفت صفتلردير). باشليجه وزنلرى:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">فَعَلٌ</span><span class="v-grid-val">حَسَنٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعْلٌ</span><span class="v-grid-val">صُلْبٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فِعْلٌ</span><span class="v-grid-val">مِلْحٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِلٌ</span><span class="v-grid-val">خَشِنٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعُلٌ</span><span class="v-grid-val">عَجُلٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعُلٌ</span><span class="v-grid-val">جُنُبٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَالٌ</span><span class="v-grid-val">جَبَانٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعَالٌ</span><span class="v-grid-val">شُجَاعٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِيلٌ</span><span class="v-grid-val">كَرِيمٌ، سَلِيمٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعُولٌ</span><span class="v-grid-val">غَيُورٌ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">أَفْعَلُ</span><span class="v-grid-val">أَبْلَجُ، أَحْمَرُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعْلَانُ</span><span class="v-grid-val">غَضْبَانُ، عَطْشَانُ</span></div>
</div>
</div>""",
    "24. Apa sajakah wazan-wazan shifat musyabbahah?",
    """<div class="ans-block">
<p class="ans-p">Shifat Musyabbahah bermakna <em>tsubut</em> (sifat watak/kondisi yang melekat kuat). Wazan-wazannya yang paling masyhur:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">فَعَلٌ</span><span class="v-grid-val">حَسَنٌ (elok/tampan)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعْلٌ</span><span class="v-grid-val">صُلْبٌ (kokoh/keras)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فِعْلٌ</span><span class="v-grid-val">مِلْحٌ (asin)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِلٌ</span><span class="v-grid-val">خَشِنٌ (kasar)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعُلٌ</span><span class="v-grid-val">عَجُلٌ (tergesa-gesa)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعُلٌ</span><span class="v-grid-val">جُنُبٌ (junub)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَالٌ</span><span class="v-grid-val">جَبَانٌ (pengecut)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعَالٌ</span><span class="v-grid-val">شُجَاعٌ (pemberani)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِيلٌ</span><span class="v-grid-val">كَرِيمٌ (mulia)، سَلِيمٌ (selamat)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعُولٌ</span><span class="v-grid-val">غَيُورٌ (pencemburu)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">أَفْعَلُ</span><span class="v-grid-val">أَبْلَجُ (berseri)، أَحْمَرُ (merah)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعْلَانُ</span><span class="v-grid-val">غَضْبَانُ (murka)، عَطْشَانُ (haus)</span></div>
</div>
</div>""",
    "شُجَاعٌ", "pemberani", ["صفة", "مشبهة", "حسن", "شجاع", "كريم", "sifat", "musyabbahah"]
)

# 25
add_item(
    25, *CH3, 25,
    "٢٥- اسم مفعول وزنلرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">ثلاثى مجردك بتون بابلرندن اسم مفعول ايكى شكلده كلير:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">١. قياسى وزن: مَفْعُولٌ</span>
    <span class="v-grid-desc">قاعده اوزره بتون ثلاثيلردن گلن اصل وزندر</span>
    <span class="v-grid-val">مَنْصُورٌ، مَجْبُورٌ، مَكْتُوبٌ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢. سماعى وزن: فَعِيلٌ</span>
    <span class="v-grid-desc">مفعول معناسنده سماعاً كلن وزندر</span>
    <span class="v-grid-val">كَسِيرٌ (مَكْسُورٌ)، جَرِيحٌ (مَجْرُوحٌ)</span>
  </div>
</div>
<div class="v-badge-note">نُسخه تنبيهى: بعضى كتابلرده كچن "كَثِيرٌ" لفظى خطالى اولوب، دوغروسى "كَسِيرٌ" شكلنده در؛ چونكه كَثُرَ فعلى لازمدر، مجهولى و اسم مفعولى كرمز.</div>
</div>""",
    "25. Apa sajakah wazan isim maf'ul pada tsulatsi mujarrad?",
    """<div class="ans-block">
<p class="ans-p">Bagi fi'il Tsulatsi Mujarrad, isim maf'ul datang dalam dua wazan:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">1. Wazan Qiyasi: مَفْعُولٌ</span>
    <span class="v-grid-desc">Wazan standar analogis seragam dari seluruh bab</span>
    <span class="v-grid-val">مَنْصُورٌ، مَجْبُورٌ، مَضْرُوبٌ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">2. Wazan Sama'i: فَعِيلٌ</span>
    <span class="v-grid-desc">Wazan fa'il yang bermakna maf'ul secara riwayat</span>
    <span class="v-grid-val">كَسِيرٌ (yang patah)، جَرِيحٌ (yang luka)</span>
  </div>
</div>
<div class="v-badge-note">Catatan koreksi matan: Sebagian naskah tertulis كَثِيرٌ, itu adalah salah cetak. Yang benar adalah كَسِيرٌ (patah), karena كَثُرَ adalah fi'il lazim yang tidak memiliki isim maf'ul.</div>
</div>""",
    "مَجْبُورٌ", "standar", ["اسم", "مفعول", "مجبور", "كسير", "maful", "wazan"]
)

# 26
add_item(
    26, *CH3, 26,
    "٢٦- مبالغه اسم فاعل وزنلرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">مبالغه اسم فاعل؛ بر ايشى چوق و شدّتلى ياپانى افاده ايدر. باشليجه وزنلرى:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">فَعُولٌ</span><span class="v-grid-val">جَهُولٌ (چوق جاهل)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فِعِّيلٌ</span><span class="v-grid-val">صِدِّيقٌ (چوق صادق)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَّالٌ</span><span class="v-grid-val">كَذَّابٌ (چوق يالانجى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعُلٌ</span><span class="v-grid-val">غُفُلٌ (چوق غافل)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِلٌ</span><span class="v-grid-val">يَقُظٌ (چوق اويانيق)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مِفْعَالٌ</span><span class="v-grid-val">مِدْرَارٌ (بول ياغديران)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مِفْعِيلٌ</span><span class="v-grid-val">مِكْثِيرٌ (چوق قونوشان)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعَلَةٌ</span><span class="v-grid-val">لُعَنَةٌ (چوق لعنت ايدن)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَّالَةٌ</span><span class="v-grid-val">عَلَّامَةٌ (چوق بيلن)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَاعُولٌ</span><span class="v-grid-val">فَارُوقٌ (حقّ ايله باطلى آييريجى)</span></div>
</div>
<div class="v-badge-note">فائدہ: اگر عين الفعل ساكن اولوب "لُعْنَةٌ" اوقونورسه، اسم مفعول اولور (چوق لعنت اولونان ديمكدر).</div>
</div>""",
    "26. Apa sajakah wazan-wazan shighat mubalaghah isim fa'il?",
    """<div class="ans-block">
<p class="ans-p">Shighat Mubalaghah menunjukkan intensitas pelaku yang melakukan pekerjaan secara berulang-ulang atau sangat dahsyat:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">فَعُولٌ</span><span class="v-grid-val">جَهُولٌ (sangat bodoh)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فِعِّيلٌ</span><span class="v-grid-val">صِدِّيقٌ (sangat membenarkan)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَّالٌ</span><span class="v-grid-val">كَذَّابٌ (sangat pendusta)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعُلٌ</span><span class="v-grid-val">غُفُلٌ (sangat lalai)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعِلٌ</span><span class="v-grid-val">يَقُظٌ (sangat terjaga/waspada)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مِفْعَالٌ</span><span class="v-grid-val">مِدْرَارٌ (hujan sangat lebat)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مِفْعِيلٌ</span><span class="v-grid-val">مِكْثِيرٌ (sangat cerewet)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فُعَلَةٌ</span><span class="v-grid-val">لُعَنَةٌ (suka melaknat orang)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَعَّالَةٌ</span><span class="v-grid-val">عَلَّامَةٌ (amat luas ilmunya)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">فَاعُولٌ</span><span class="v-grid-val">فَارُوقٌ (pembeda haq dan bathil)</span></div>
</div>
<div class="v-badge-note">Catatan penting: Jika 'ain fi'ilnya sukun seperti لُعْنَةٌ, maknanya bergeser menjadi isim maf'ul (orang yang banyak dilaknat).</div>
</div>""",
    "صِدِّيقٌ", "intensitas", ["مبالغة", "جهول", "صديق", "كذاب", "علامة", "mubalaghah", "wazan"]
)

# 27
add_item(
    27, *CH3, 27,
    "٢٧- نون مشدّده و مخففه نه لره داخل اولور؟",
    """<div class="ans-block">
<p class="ans-p">نون تأكيد ايكيدر: <strong>نون مشدده (ثقيله)</strong> و <strong>نون مخففه (خفيفه)</strong>.</p>
<div class="v-tree">
  <div class="v-tree-root">دخول نون التأكيد</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">نون مشدده (١٤ صيغه)</span>
      <span class="v-node-desc">معلوم و مجهولدن مضارع، امر و نهى نك تمامنه داخل اولور</span>
      <span class="v-node-ex">يَنْصُرَنَّ، لِيَنْصُرَنَّ، اِضْرِبَنَّ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">نون مخففه (٨ صيغه)</span>
      <span class="v-node-desc">تثنيه و جمع مؤنثلره داخل اولماز؛ فقط مفرد و جمع مذكرلره كلير</span>
      <span class="v-node-ex">يَنْصُرَنْ، لِيَنْصُرَنْ، اِضْرِبَنْ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">سبق: نون مخففه نك تثنيه و جمع مؤنثلره كيرمه مه سببي؛ تثنيه ده ايكى ساكنك غير حدنده اجتماعندن، جمع مؤنثده ايسه اوچ نونك آرد آرده كَلمه سندن قاچينمقدر.</div>
</div>""",
    "27. Ke manakah Nun Taukid Musyaddadah dan Mukhaffafah dapat masuk?",
    """<div class="ans-block">
<p class="ans-p">Nun Taukid berfungsi mengokohkan makna dan terbagi menjadi dua:</p>
<div class="v-tree">
  <div class="v-tree-root">Cakupan Masuknya Nun Taukid</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Nun Musyaddadah (14 Shighat)</span>
      <span class="v-node-desc">Dapat masuk ke seluruh shighat Fi'il Mudhari', Amar, dan Nahi</span>
      <span class="v-node-ex">يَنْصُرَنَّ، لِيَنْصُرَنَّ، اُنْصُرَنَّ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Nun Mukhaffafah (8 Shighat)</span>
      <span class="v-node-desc">Hanya masuk ke mufrad dan jama' mudzakkar; TIDAK masuk ke tatsniyah & jama' muannats</span>
      <span class="v-node-ex">يَنْصُرَنْ، لِيَنْصُرَنْ، اُنْصُرَنْ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Alasan penolakan: Pada tatsniyah ditolak karena pertemuan dua huruf sukun bukan pada tempatnya (setelah alif), dan pada jama' muannats ditolak karena berturut-turutnya tiga huruf nun.</div>
</div>""",
    "مشدده", "mengokohkan", ["نون", "تأكيد", "مشددة", "مخففة", "nun", "taukid"]
)

# 28
add_item(
    28, *CH3, 28,
    "٢٨- نون مشدّده و مخففه نك حركه لرى نصلدر؟",
    """<div class="ans-block">
<p class="ans-p">نون تأكيدك كندى حركه سى و ما قبلى نك حركه سى:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">نونك كندى حركه سى</span>
    <span class="v-grid-desc">مشدده مفتوحدر (نَّ)، آنجق تثنيه و جمع مؤنثده كسرليدر (نِّ). مخففه ايسه هميشه ساكندر (نْ).</span>
    <span class="v-grid-val">يَنْصُرَنَّ / يَنْصُرَانِّ / يَنْصُرَنْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">نونك ما قبلى نك حركه سى</span>
    <span class="v-grid-desc">جمع مذكرده ضمه (تَنْصُرُنَّ)، مفرد مؤنثده كسره (تَنْصُرِنَّ)، كريه قالانده فتحه در.</span>
    <span class="v-grid-val">تَنْصُرَنَّ / تَنْصُرُنَّ / تَنْصُرِنَّ</span>
  </div>
</div>
</div>""",
    "28. Bagaimanakah harakat Nun Taukid Musyaddadah & Mukhaffafah serta huruf sebelumnya?",
    """<div class="ans-block">
<p class="ans-p">Ketentuan harakat Nun Taukid dan huruf tepat sebelum Nun Taukid:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">Harakat Nun itu Sendiri</span>
    <span class="v-grid-desc">Musyaddadah berharakat fathah (نَّ), kecuali setelah alif berharakat kasrah (نِّ). Mukhaffafah selalu sukun (نْ).</span>
    <span class="v-grid-val">يَنْصُرَنَّ / يَنْصُرَانِّ / يَنْصُرَنْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">Harakat Huruf Sebelum Nun</span>
    <span class="v-grid-desc">Dhammah pada jama' mudzakkar (tanda wawu gugur), kasrah pada muannats mukhatabah (tanda ya' gugur), dan fathah pada selainnya.</span>
    <span class="v-grid-val">تَنْصُرَنَّ / تَنْصُرُنَّ / تَنْصُرِنَّ</span>
  </div>
</div>
</div>""",
    "تَنْصُرُنَّ", "Musyaddadah", ["حركات", "نون", "تأكيد", "مشددة", "harakat", "sebelumnya"]
)

# 29
add_item(
    29, *CH3, 29,
    "٢٩- \"اُنْصُرْ\" فعلنى نون مشدده و نون مخففه ايله چكيگز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>امر حاضر نون مشدده ايله (٦ صيغه):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">مفرد مذكر مخاطب</span><span class="v-grid-val">اُنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">تثنيه مذكر مخاطب</span><span class="v-grid-val">اُنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مذكر مخاطب</span><span class="v-grid-val">اُنْصُرُنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مفرد مؤنث مخاطبه</span><span class="v-grid-val">اُنْصُرِنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">تثنيه مؤنث مخاطبه</span><span class="v-grid-val">اُنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مؤنث مخاطبه</span><span class="v-grid-val">اُنْصُرْنَانِّ</span></div>
</div>
<p class="ans-p"><strong>امر حاضر نون مخففه ايله (٣ صيغه):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">مفرد مذكر مخاطب</span><span class="v-grid-val">اُنْصُرَنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مذكر مخاطب</span><span class="v-grid-val">اُنْصُرُنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مفرد مؤنث مخاطبه</span><span class="v-grid-val">اُنْصُرِنْ</span></div>
</div>
</div>""",
    "29. Tashrif-lah fi'il amar 'اُنْصُرْ' dengan Nun Taukid Musyaddadah dan Mukhaffafah!",
    """<div class="ans-block">
<p class="ans-p"><strong>Tashrif Amar Hadhir dengan Nun Taukid Musyaddadah (6 Shighat):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Mudzakkar</span><span class="v-grid-val">اُنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Tatsniyah Mudzakkar</span><span class="v-grid-val">اُنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Mudzakkar</span><span class="v-grid-val">اُنْصُرُنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Muannats</span><span class="v-grid-val">اُنْصُرِنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Tatsniyah Muannats</span><span class="v-grid-val">اُنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Muannats</span><span class="v-grid-val">اُنْصُرْنَانِّ</span></div>
</div>
<p class="ans-p"><strong>Tashrif Amar Hadhir dengan Nun Taukid Mukhaffafah (3 Shighat):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Mudzakkar</span><span class="v-grid-val">اُنْصُرَنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Mudzakkar</span><span class="v-grid-val">اُنْصُرُنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Muannats</span><span class="v-grid-val">اُنْصُرِنْ</span></div>
</div>
</div>""",
    "اُنْصُرْنَانِّ", "Musyaddadah", ["اُنْصُرْ", "تأكيد", "تصريف", "مشددة", "unshur", "tashrif"]
)

# 30
add_item(
    30, *CH3, 30,
    "٣٠- \"لِيَنْصُرْ\" فعلنى نون مشدده و نون مخففه ايله چكيگز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>امر غائب نون مشدده ايله (٦ صيغه):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">مفرد مذكر غائب</span><span class="v-grid-val">لِيَنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">تثنيه مذكر غائب</span><span class="v-grid-val">لِيَنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مذكر غائب</span><span class="v-grid-val">لِيَنْصُرُنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مفرد مؤنث غائبه</span><span class="v-grid-val">لِتَنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">تثنيه مؤنث غائبه</span><span class="v-grid-val">لِتَنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مؤنث غائبه</span><span class="v-grid-val">لِيَنْصُرْنَانِّ</span></div>
</div>
<p class="ans-p"><strong>امر غائب نون مخففه ايله (٣ صيغه):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">مفرد مذكر غائب</span><span class="v-grid-val">لِيَنْصُرَنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">جمع مذكر غائب</span><span class="v-grid-val">لِيَنْصُرُنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">مفرد مؤنث غائبه</span><span class="v-grid-val">لِتَنْصُرَنْ</span></div>
</div>
</div>""",
    "30. Tashrif-lah fi'il amar ghaib 'لِيَنْصُرْ' dengan Nun Taukid Musyaddadah dan Mukhaffafah!",
    """<div class="ans-block">
<p class="ans-p"><strong>Tashrif Amar Ghaib dengan Nun Taukid Musyaddadah (6 Shighat):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Mudzakkar Ghaib</span><span class="v-grid-val">لِيَنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Tatsniyah Mudzakkar Ghaib</span><span class="v-grid-val">لِيَنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Mudzakkar Ghaib</span><span class="v-grid-val">لِيَنْصُرُنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Muannats Ghaibah</span><span class="v-grid-val">لِتَنْصُرَنَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Tatsniyah Muannats Ghaibah</span><span class="v-grid-val">لِتَنْصُرَانِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Muannats Ghaibah</span><span class="v-grid-val">لِيَنْصُرْنَانِّ</span></div>
</div>
<p class="ans-p"><strong>Tashrif Amar Ghaib dengan Nun Taukid Mukhaffafah (3 Shighat):</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Mudzakkar Ghaib</span><span class="v-grid-val">لِيَنْصُرَنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Jama' Mudzakkar Ghaib</span><span class="v-grid-val">لِيَنْصُرُنْ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Mufrad Muannats Ghaibah</span><span class="v-grid-val">لِتَنْصُرَنْ</span></div>
</div>
</div>""",
    "لِيَنْصُرْنَانِّ", "Tashrif", ["لينصر", "امر", "غائب", "تأكيد", "liyanshur", "amar"]
)

# 31
add_item(
    31, *CH3, 31,
    "٣١- ادّثّر و اثّاقل فعللرينك اعلاللوى نصل ياپيلير؟",
    """<div class="ans-block">
<p class="ans-p">تفعل و تفاعل بابلرنده كى فاء الفعل مخرججه تاء يه ياقين اولدوغنده ياپيلان ابدال و ادغام:</p>
<div class="v-flow-box">
  <div class="v-flow-header">١. اِدَّثَّرَ نك اعلالى</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">تَدَثَّرَ</span><span class="v-step-tag">اصل</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">دْدَثَّرَ</span><span class="v-step-tag">ت داله قلب اولوندى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">اِدَّثَّرَ</span><span class="v-step-tag">همزهء وصل و ادغام</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">٢. اِثَّاقَلَ نك اعلالى</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">تَثَاقَلَ</span><span class="v-step-tag">اصل</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">ثْثَاقَلَ</span><span class="v-step-tag">ت ثايه قلب اولوندى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">اِثَّاقَلَ</span><span class="v-step-tag">همزهء وصل و ادغام</span></div>
  </div>
</div>
</div>""",
    "31. Bagaimanakah proses i'lal/idgham pada fi'il 'اِدَّثَّرَ' dan 'اِثَّاقَلَ'?",
    """<div class="ans-block">
<p class="ans-p">Pada bab Tafa''ul dan Tafa'ul, apabila fa' fi'ilnya berdekatan makhraj dengan huruf Ta' (seperti د atau ث), huruf Ta' diganti menjadi huruf sejenis lalu di-idghamkan:</p>
<div class="v-flow-box">
  <div class="v-flow-header">1. Tahapan I'lal اِدَّثَّرَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">تَدَثَّرَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">دْدَثَّرَ</span><span class="v-step-tag">Ta' diganti Dal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">اِدَّثَّرَ</span><span class="v-step-tag">Tambah Hamzah & Idgham</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">2. Tahapan I'lal اِثَّاقَلَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">تَثَاقَلَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">ثْثَاقَلَ</span><span class="v-step-tag">Ta' diganti Tsa'</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">اِثَّاقَلَ</span><span class="v-step-tag">Tambah Hamzah & Idgham</span></div>
  </div>
</div>
</div>""",
    "تَدَثَّرَ", "makhraj", ["ادثر", "اثاقل", "ابدال", "ادغام", "iddatsara", "itstsaqala"]
)

print("Chapter 3 done (31 items).")

# --- CHAPTER 4: ٣. فصل: أسباب التعدية، الإعلال، الإدغام و المهموز ---
CH4 = ("fashl-3-ta'diyah-ilal-idgham", "٣. فصل: أسباب التعدية، الإعلال، الإدغام و المهموز", "Fashl 3: Ta'diyah, Kaidah I'lal, Idgham & Mahmuz")

# 32
add_item(
    32, *CH4, 32,
    "٣٢- لازم فعلى متعدى، ياپمه سببلرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">لازم فعل، اوچ وجودى و بر عدمى سببدن بريله متعدى اولور:</p>
<div class="v-tree">
  <div class="v-tree-root">أسباب تعدية الفعل اللازم</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">١. إفعال بابى همزه سى</span>
      <span class="v-node-desc">اولنه همزه اكله نمكله</span>
      <span class="v-node-ex">خَرَجَ -> أَخْرَجْتُهُ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٢. حرف جر زياده سى</span>
      <span class="v-node-desc">آخرينه حرف جر اكله نمكله</span>
      <span class="v-node-ex">خَرَجْتُ بِهِ مِنَ الدَّارِ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٣. تفعيل بابنه نقل</span>
      <span class="v-node-desc">عين الفعلنى شدّه له مكله</span>
      <span class="v-node-ex">خَرَجَ -> خَرَّجْتُهُ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٤. تاء حذفى (عدمى)</span>
      <span class="v-node-desc">تَفَعَّلَ و تَفَعْلَلَ دن ت حذفيله</span>
      <span class="v-node-ex">تَعَلَّمَ -> عَلَّمَ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">نوط: همزه و شدّه ايله تعديه يالكز ثلاثيه مخصوصدر؛ حرف جر ايله تعديه ايسه هم ثلاثى ده هم غيريسنده كچرليدر.</div>
</div>""",
    "32. Apa sajakah sebab-sebab yang mengubah fi'il lazim menjadi muta'addi?",
    """<div class="ans-block">
<p class="ans-p">Fi'il lazim dapat berubah menjadi fi'il muta'addi melalui 4 cara (3 sebab wujudi/penambahan, 1 sebab 'adami/penghapusan):</p>
<div class="v-tree">
  <div class="v-tree-root">Sebab-Sebab Ta'diyah</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">1. Hamzah Bab If'al</span>
      <span class="v-node-desc">Menambah hamzah qatha' di awal kata</span>
      <span class="v-node-ex">خَرَجَ -> أَخْرَجْتُهُ (Saya mengeluarkannya)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">2. Huruf Jar</span>
      <span class="v-node-desc">Menghubungkan fi'il dengan maf'ul bih perantara</span>
      <span class="v-node-ex">خَرَجْتُ بِهِ (Saya membawanya keluar)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">3. Bab Taf'il (Tasydid)</span>
      <span class="v-node-desc">Mentasydid 'ain fi'il</span>
      <span class="v-node-ex">خَرَّجْتُهُ (Saya mengeluarkannya)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">4. Menghapus Huruf Ta'</span>
      <span class="v-node-desc">Sebab 'adami dari bab Tafa''ul atau Tafa'lul</span>
      <span class="v-node-ex">تَعَلَّمَ -> عَلَّمَ</span>
    </div>
  </div>
</div>
</div>""",
    "أَخْرَجْتُهُ", "perantara", ["تعدية", "لازم", "متعدي", "إفعال", "حرف جر", "tadiyah", "lazim"]
)

# 33
add_item(
    33, *CH4, 33,
    "٣٣- متعدى فعلى لازم ياپمه سببلرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">متعدى فعلى لازم ياپمانك اوچ اصلى يولى واردر:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">١. تعديت سببلرينى حذف ايتمك</span>
    <span class="v-grid-desc">همزه و يا شدّه يى قالديروب مجرده دونمك</span>
    <span class="v-grid-val">أَخْرَجَ -> خَرَجَ، فَرَّحَ -> فَرِحَ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢. انفعال بابنه نقل ايتمك</span>
    <span class="v-grid-desc">مطاوعت حاصل اولوب فعل لازم اولور</span>
    <span class="v-grid-val">كَسَرْتُهُ فَانْكَسَرَ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٣. اولنه تاء اكله يه رك تفعلل بابنه نقل</span>
    <span class="v-grid-desc">فعلل بابينك اولنه تاء زياده سيله مطاوعت</span>
    <span class="v-grid-val">دَحْرَجْتُ الْحَجَرَ فَتَدَحْرَجَ</span>
  </div>
</div>
</div>""",
    "33. Apa sajakah sebab-sebab mengubah fi'il muta'addi menjadi fi'il lazim?",
    """<div class="ans-block">
<p class="ans-p">Fi'il muta'addi dapat diubah kembali menjadi fi'il lazim melalui 3 cara pokok:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">1. Menghapus Sebab Ta'diyah</span>
    <span class="v-grid-desc">Membuang hamzah atau tasydid kembali ke mujarrad</span>
    <span class="v-grid-val">أَخْرَجَ -> خَرَجَ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">2. Memindahkan ke Bab Infi'al</span>
    <span class="v-grid-desc">Menghasilkan makna muthawa'ah (penerimaan akibat tindakan)</span>
    <span class="v-grid-val">كَسَرْتُ الزُّجَاجَ فَانْكَسَرَ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">3. Memindahkan ke Bab Tafa'lul</span>
    <span class="v-grid-desc">Menambahkan huruf Ta' pada wazan Fa'lala untuk muthawa'ah</span>
    <span class="v-grid-val">دَحْرَجْتُهُ فَتَدَحْرَجَ</span>
  </div>
</div>
</div>""",
    "فَانْكَسَرَ", "muthawa'ah", ["متعدي", "لازم", "انفعال", "مطاوعة", "mutaaddi", "lazim"]
)

# 34
add_item(
    34, *CH4, 34,
    "٣٤- افتعال بابى نك فاعل فعلنك حكمى نه در؟",
    """<div class="ans-block">
<p class="ans-p">افتعال بابينك فاء الفعلنده حروف اطباقدن (ص، ض، ط، ظ) برى اولورسه، افتعالك زائد "ت" حرفى "ط" يه قلب اولونور:</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">صَبَرَ</span><span class="v-step-tag">فاء الفعل ص</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">اِصْتَبَرَ</span><span class="v-step-tag">افتعال وزنى</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">اِصْطَبَرَ</span><span class="v-step-tag">ت -> ط قلبى</span></div>
</div>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">ضَرَبَ</span><span class="v-grid-val">اِضْتَرَبَ -> اِضْطَرَبَ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">طَرَدَ</span><span class="v-grid-val">اِطْتَرَدَ -> اِطَّرَدَ (ادغام ايله)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">ظَهَرَ</span><span class="v-grid-val">اِظْتَهَرَ -> اِظْطَهَرَ (و اِظَّهَرَ، اِطَّهَرَ)</span></div>
</div>
</div>""",
    "34. Bagaimana hukum huruf Ta' bab Ifti'al jika fa' fi'ilnya berupa huruf ithbaq?",
    """<div class="ans-block">
<p class="ans-p">Jika fa' fi'il bab Ifti'al berupa salah satu dari 4 huruf ithbaq (<span class="arabic-inline font-bold">ص، ض، ط، ظ</span>), maka huruf Ta' (<span class="arabic-inline font-bold">ت</span>) tambahan bab Ifti'al wajib diganti menjadi Tha' (<span class="arabic-inline font-bold">ط</span>):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">صَبَرَ</span><span class="v-step-tag">Fa' Fi'il ص</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">اِصْتَبَرَ</span><span class="v-step-tag">Wazan Ifti'al</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">اِصْطَبَرَ</span><span class="v-step-tag">Ganti Ta' ke Tha'</span></div>
</div>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">ضَرَبَ</span><span class="v-grid-val">اِضْتَرَبَ -> اِضْطَرَبَ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">طَرَدَ</span><span class="v-grid-val">اِطْتَرَدَ -> اِطَّرَدَ (disertai idgham)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">ظَهَرَ</span><span class="v-grid-val">اِظْتَهَرَ -> اِظْطَهَرَ (atau اِظَّهَرَ / اِطَّهَرَ)</span></div>
</div>
</div>""",
    "اِصْطَبَرَ", "ithbaq", ["افتعال", "اطباق", "اصطبر", "اضطرب", "iftial", "ithbaq"]
)

# 35 (PDF #27)
add_item(
    35, *CH4, 27,
    "٢٧- افتعل نك فاء الفعلنده؛ دال، ذال و زا\" دن برى بولونورسه حكم نه در؟",
    """<div class="ans-block">
<p class="ans-p">افتعل نك فاء الفعلنده "دال، ذال، زا" (د، ذ، ز) اولورسه، افتعالك زائد "ت" حرفى "دال" ه قلب اولونور:</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">دَمَعَ</span><span class="v-step-tag">فاء الفعل د</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">اِدْتَمَعَ</span><span class="v-step-tag">ت داله دوندرلدى</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">اِدَّمَعَ</span><span class="v-step-tag">دال داله ادغام اولدى</span></div>
</div>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">ذَكَرَ (ذال حرفى)</span>
    <span class="v-grid-desc">اِذْتَكَرَ -> اِذْدَكَرَ -> اِذَّكَرَ (و اِدَّكَرَ ده جائزدر)</span>
    <span class="v-grid-val">﴿فَهَلْ مِنْ مُدَّكِرٍ﴾</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">زَجَرَ (زا حرفى)</span>
    <span class="v-grid-desc">اِزْتَجَرَ -> ت داله قلب اولنوب اِزْدَجَرَ اولدى</span>
    <span class="v-grid-val">﴿وَازْدُجِرَ﴾</span>
  </div>
</div>
</div>""",
    "35. (Soal No. 27 Hal. 2) Bagaimana hukumnya jika fa' fi'il bab Ifti'al berupa huruf Dal, Dzal, atau Zai (د، ذ، ز)?",
    """<div class="ans-block">
<p class="ans-p">Jika fa' fi'il bab Ifti'al berupa huruf Dal, Dzal, atau Zai (<span class="arabic-inline font-bold">د، ذ، ز</span>), maka huruf Ta' (<span class="arabic-inline font-bold">ت</span>) bab Ifti'al wajib diganti menjadi Dal (<span class="arabic-inline font-bold">د</span>):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">دَمَعَ</span><span class="v-step-tag">Fa' Fi'il د</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">اِدْتَمَعَ</span><span class="v-step-tag">Ganti Ta' ke Dal</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">اِدَّمَعَ</span><span class="v-step-tag">Idgham Dal ke Dal</span></div>
</div>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">ذَكَرَ (Huruf Dzal)</span>
    <span class="v-grid-desc">اِذْتَكَرَ -> اِذْدَكَرَ -> اِذَّكَرَ (juga boleh اِدَّكَرَ)</span>
    <span class="v-grid-val">﴿فَهَلْ مِنْ مُدَّكِرٍ﴾</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">زَجَرَ (Huruf Zai)</span>
    <span class="v-grid-desc">اِزْتَجَرَ -> Ta' diganti Dal menjadi اِزْدَجَرَ</span>
    <span class="v-grid-val">﴿وَازْدُجِرَ﴾</span>
  </div>
</div>
</div>""",
    "اِدَّمَعَ", "Ifti'al", ["افتعال", "دال", "ذال", "زا", "ازدجر", "ادكر", "iftial"]
)

# 36 (PDF #28)
add_item(
    36, *CH4, 28,
    "٢٨- افتعل نك فاء الفعلنده واو\" يا\" ثا\"دن برى بولونورسه حكم نه در؟",
    """<div class="ans-block">
<p class="ans-p">افتعل نك فاء الفعلنده واو، ياء، و يا ثاء (و، ي، ث) بولونورسه، بو حرفلر "ت" يه قلب اولونور و افتعالك تاء سينه ادغام ايديلير:</p>
<div class="v-flow-box">
  <div class="v-flow-header">امثله قلب و ادغام تاء</div>
  <div class="v-grid">
    <div class="v-grid-card">
      <span class="v-grid-label">وَقَى (واو حرفى)</span>
      <span class="v-grid-val">اِوْتَقَى -> اِتْتَقَى -> اِتَّقَى</span>
    </div>
    <div class="v-grid-card">
      <span class="v-grid-label">يَسَرَ (ياء حرفى)</span>
      <span class="v-grid-val">اِيْتَسَرَ -> اِتْتَسَرَ -> اِتَّسَرَ</span>
    </div>
    <div class="v-grid-card">
      <span class="v-grid-label">ثَغَرَ (ثاء حرفى)</span>
      <span class="v-grid-val">اِثْتَغَرَ -> اِتْتَغَرَ -> اِتَّغَرَ</span>
    </div>
  </div>
</div>
</div>""",
    "36. (Soal No. 28 Hal. 2) Bagaimana hukumnya jika fa' fi'il bab Ifti'al berupa Wawu, Ya', atau Tsa' (و، ي، ث)?",
    """<div class="ans-block">
<p class="ans-p">Jika fa' fi'il bab Ifti'al berupa Wawu, Ya', atau Tsa' (<span class="arabic-inline font-bold">و، ي، ث</span>), maka huruf-huruf tersebut wajib diganti menjadi Ta' (<span class="arabic-inline font-bold">ت</span>) lalu di-idghamkan ke dalam Ta' bab Ifti'al:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Contoh Transformasi Huruf ke Ta'</div>
  <div class="v-grid">
    <div class="v-grid-card">
      <span class="v-grid-label">وَقَى (Huruf Wawu)</span>
      <span class="v-grid-val">اِوْتَقَى -> اِتْتَقَى -> اِتَّقَى</span>
    </div>
    <div class="v-grid-card">
      <span class="v-grid-label">يَسَرَ (Huruf Ya')</span>
      <span class="v-grid-val">اِيْتَسَرَ -> اِتْتَسَرَ -> اِتَّسَرَ</span>
    </div>
    <div class="v-grid-card">
      <span class="v-grid-label">ثَغَرَ (Huruf Tsa')</span>
      <span class="v-grid-val">اِثْتَغَرَ -> اِتْتَغَرَ -> اِتَّغَرَ</span>
    </div>
  </div>
</div>
</div>""",
    "اِتَّقَى", "di-idghamkan", ["افتعال", "واو", "ياء", "ثاء", "اتقى", "اتسر", "ittaqa"]
)

# 37 (PDF #29)
add_item(
    37, *CH4, 29,
    "٢٩- اسملر وفعللر اوزرينه زائد اولان حرفلر نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">اسم و فعللره زياده قيلينان اون حرف: <span class="arabic-inline font-bold">الْيَوْمَ تَنْسَاهُ</span> (ا، ل، ي، و، م، ت، ن، س، ا، هـ) جمله سنك حرفلريدر. ديگر بر فرمول ايسه: <span class="arabic-inline font-bold">سَأَلْتُمُونِيهَا</span> در.</p>
<p class="ans-p">بر كلمه حرفلرينك عددى اوچ اوزرينه زائد اولدوغى و كندسنده شو حرفلردن برى بولوندوغى زمان او حرفك زائد اولدوغنه حكم ايديلير (خَرَجَ -> أَخْرَجَ، عَلِمَ -> أَعْلَمَ كبى).</p>
<div class="v-badge-note">تنبيه: اگر او حرف آلنديغنده كلمه نك اصلى معناسى بوزولورسه زائد دكل، اصل حرفدر (وَسْوَسَ ده كى واو و سينلر كبى).</div>
</div>""",
    "37. (Soal No. 29 Hal. 2) Apa sajakah 10 huruf tambahan (ziyadah) yang bisa masuk ke dalam isim dan fi'il?",
    """<div class="ans-block">
<p class="ans-p">Huruf-huruf ziyadah (tambahan) yang dapat masuk ke dalam isim dan fi'il berjumlah 10 huruf, terangkum dalam ungkapan: <span class="arabic-inline font-bold">الْيَوْمَ تَنْسَاهُ</span> ("Hari ini engkau melupakannya") atau <span class="arabic-inline font-bold">سَأَلْتُمُونِيهَا</span> ("Kalian menanyakannya kepadaku").</p>
<p class="ans-p">Jika sebuah kata memiliki huruf lebih dari tiga dan terdapat huruf-huruf ini, maka huruf tersebut dihukumi sebagai huruf tambahan ziyadah (contoh: أَخْرَجَ dan أَعْلَمَ, hamzah di awal adalah ziyadah).</p>
<div class="v-badge-note">Peringatan: Jika huruf tersebut dihilangkan mengakibatkan rusaknya makna pokok kata, maka huruf tersebut adalah huruf asli, bukan ziyadah (seperti huruf Wawu dan Sin pada kata وَسْوَسَ).</div>
</div>""",
    "تَنْسَاهُ", "ziyadah", ["حروف", "زيادة", "اليوم تنساه", "سألتمونيها", "huruf", "ziyadah"]
)

# 38 (PDF #30)
add_item(
    38, *CH4, 30,
    "٣٠- افعال بابنك همزه سى هانگى معنالره كلير مثاللرى ايله برابر سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p">إفعال بابينك همزه سى يدّى معنانك برينه كلير:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. تعديه</span><span class="v-grid-desc">لازمى متعدى ياپمق</span><span class="v-grid-val">أَكْرَمْتُهُ، أَخْرَجْتُهُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. صيرورت</span><span class="v-grid-desc">صاحب اولمق</span><span class="v-grid-val">أَمْشَى الرَّجُلُ (دوه صاحبي اولدى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. وجدان</span><span class="v-grid-desc">بر حال اوزره بولمق</span><span class="v-grid-val">أَبْخَلْتُهُ (اونو جيمرى بولدم)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. حينونت</span><span class="v-grid-desc">وقتى ياقالشمق</span><span class="v-grid-val">أَحْصَدَ الزَّرْعُ (بيچمه وقتى كلدى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. ازاله</span><span class="v-grid-desc">كيدرمك</span><span class="v-grid-val">أَشْكَيْتُهُ (شكايتى كيدردم)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. دخول</span><span class="v-grid-desc">بر يره/زمانه كيرمك</span><span class="v-grid-val">أَصْبَحَ (صباحه كيردى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٧. كثرت</span><span class="v-grid-desc">چوقلق معناسى</span><span class="v-grid-val">أَلْبَنَ الرَّجُلُ (سودى چوقالدى)</span></div>
</div>
</div>""",
    "38. (Soal No. 30 Hal. 2) Sebutkan makna-makna yang ditimbulkan oleh Hamzah bab If'al beserta contohnya!",
    """<div class="ans-block">
<p class="ans-p">Hamzah tambahan pada bab If'al berfaedah mendatangkan salah satu dari 7 makna:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. Ta'diyah</span><span class="v-grid-desc">Memuta'addikan fi'il lazim</span><span class="v-grid-val">أَكْرَمْتُهُ، أَخْرَجْتُهُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. Shairurah</span><span class="v-grid-desc">Menjadi pemilik sesuatu</span><span class="v-grid-val">أَمْشَى الرَّجُلُ (memiliki kawanan ternak)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. Wijdan</span><span class="v-grid-desc">Menjumpai dalam sifat tertentu</span><span class="v-grid-val">أَبْخَلْتُهُ (kudapati ia kikir)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">4. Hainunah</span><span class="v-grid-desc">Tiba waktu pekerjaan</span><span class="v-grid-val">أَحْصَدَ الزَّرْعُ (tiba masa panen)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">5. Izalah</span><span class="v-grid-desc">Menghilangkan sesuatu</span><span class="v-grid-val">أَشْكَيْتُهُ (kuhilangkan keluhannya)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">6. Dukhul</span><span class="v-grid-desc">Masuk ke tempat/waktu</span><span class="v-grid-val">أَصْبَحَ (masuk waktu shubuh)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">7. Katsrah</span><span class="v-grid-desc">Menjadi banyak berlimpah</span><span class="v-grid-val">أَلْبَنَ الرَّجُلُ (banyak susunya)</span></div>
</div>
</div>""",
    "أَبْخَلْتُهُ", "Shairurah", ["إفعال", "معاني", "تعدية", "صيرورة", "وجدان", "ifal", "makna"]
)

# 39 (PDF #31)
add_item(
    39, *CH4, 31,
    "٣١- استفعال بابنك سينى هانگى معنالره كلير مثاللرى ايله برابر سويله يكز؟",
    """<div class="ans-block">
<p class="ans-p">استفعال بابينك سين حرفى آلتى معنانك برينه كلير:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. طلب</span><span class="v-grid-desc">ايستمك معناسنده</span><span class="v-grid-val">اِسْتَغْفَرْتُ اللهَ (مغفرت طلب ايتدم)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. سؤال</span><span class="v-grid-desc">صورو صورمق</span><span class="v-grid-val">اِسْتَخْبَرَ (خبر صوردى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. تحول</span><span class="v-grid-desc">دونوشمك</span><span class="v-grid-val">اِسْتَخَلَّ الْخَمْرُ (شراب سيركه يه دونوشدى)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. اعتقاد</span><span class="v-grid-desc">اينانمق، اويله سانمق</span><span class="v-grid-val">اِسْتَكْرَمْتُهُ (جومرد اولدوغنه ايناندم)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. وجدان</span><span class="v-grid-desc">بولمق</span><span class="v-grid-val">اِسْتَجَدْتُ الشَّيْءَ (اونى ينى و يا ايى بولدم)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. تسليم</span><span class="v-grid-desc">قبول و تسليم ايتمك</span><span class="v-grid-val">اِسْتَرْجَعَ (انّا لله ديدي)</span></div>
</div>
</div>""",
    "39. (Soal No. 31 Hal. 2) Sebutkan makna-makna yang ditimbulkan oleh huruf Sin bab Istif'al beserta contohnya!",
    """<div class="ans-block">
<p class="ans-p">Huruf Sin tambahan pada bab Istif'al mendatangkan salah satu dari 6 makna:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. Thalab</span><span class="v-grid-desc">Menuntut / meminta sesuatu</span><span class="v-grid-val">اِسْتَغْفَرْتُ اللهَ (kuharap ampunan Allah)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. Su'al</span><span class="v-grid-desc">Bertanya meminta penjelasan</span><span class="v-grid-val">اِسْتَخْبَرَ (ia menanyakan kabar)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. Tahawwul</span><span class="v-grid-desc">Berubah keadaan secara fisik/sifat</span><span class="v-grid-val">اِسْتَخَلَّ الْخَمْرُ (khamar berubah jadi cuka)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">4. I'tiqad</span><span class="v-grid-desc">Meyakini sifat pada objek</span><span class="v-grid-val">اِسْتَكْرَمْتُهُ (kuyakini ia mulia)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">5. Wijdan</span><span class="v-grid-desc">Menjumpai sesuatu dalam suatu sifat</span><span class="v-grid-val">اِسْتَجَدْتُهُ (kudapati ia berkualitas baik)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">6. Taslim</span><span class="v-grid-desc">Berserah diri menerima ketetapan</span><span class="v-grid-val">اِسْتَرْجَعَ (mengucapkan istirja' inna lillah)</span></div>
</div>
</div>""",
    "اِسْتَخَلَّ", "Tahawwul", ["استفعال", "سين", "طلب", "تحول", "اعتقاد", "istifal", "makna"]
)

# 40 (PDF #32)
add_item(
    40, *CH4, 32,
    "٣٢- برنجى، ايكنجى، اوچنجى، دورتنجى، بشنجى، آلتنجى، يدنجى، سكزنجى، طقوزنجى اعلال قاعده لرينى مثاللرى ايله برابر آگلاتيگز؟",
    """<div class="ans-block">
<p class="ans-p"><strong>مقصود كتابنده كى ٩ اصلى اعلال قاعده سى:</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. قاعده</span><span class="v-grid-desc">و و ي متحرك، ماقبلى مفتوح ايسه، الفه قلب اولونور</span><span class="v-grid-val">قَالَ (قَوَلَ)، غَزَا (غَزَوَ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. قاعده</span><span class="v-grid-desc">ي ساكن و يا مفتوح، ماقبلى مكسور ايسه، حالى اوزره ترك ايديلير</span><span class="v-grid-val">خَشِيَ، رَمَيْتُ</span>
  </div>
  <div class="v-grid-card"><span class="v-grid-label">٣. قاعده</span><span class="v-grid-desc">ي ساكن، ماقبلى مضموم ايسه، واوه قلب اولونور</span><span class="v-grid-val">يُوسِرُ (اصلنده: يُيْسِرُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٤. قاعده</span><span class="v-grid-desc">و ساكن، ماقبلى مكسور ايسه، يايه قلب اولونور</span><span class="v-grid-val">قِيلَ (اصلنده: قُوِلَ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٥. قاعده</span><span class="v-grid-desc">و كلمه نك آخرنده متحرك، ماقبلى مكسور ايسه، يايه قلب اولونور</span><span class="v-grid-val">غَبِيَ (غَبِوَ)، دُعِيَ (دُعِوَ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٦. قاعده</span><span class="v-grid-desc">و و ي متحرك، ماقبلى صحيح ساكن ايسه، حركه سى ماقبلنه نقل اولونور</span><span class="v-grid-val">يَقُولُ (يَقْوُلُ)، يَبِيعُ (يَبْيِعُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٧. قاعده</span><span class="v-grid-desc">و و ي آخرده اولوب ماقبلى ده حركه لى ايسه، ضمه و كسره ثقلندن ساكن قيلينير</span><span class="v-grid-val">يَغْزُو (يَغْزُوُ)، يَرْمِي (يَرْمِيُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٨. قاعده</span><span class="v-grid-desc">ايكى واو اجتماع ايدوب برنجيسى ساكن ايكنجيسى حركه لى ايسه، ادغام اولونور</span><span class="v-grid-val">مَغْزُوٌّ (مَغْزُووٌ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٩. قاعده</span><span class="v-grid-desc">واو و يا بر كلمه ده اجتماع ايدوب برنجيسى ساكن ايسه، واو يايه قلب اولونوب ادغام ايديلير</span><span class="v-grid-val">مَرْمِيٌّ (مَرْمُويٌ)، مَيِّتٌ</span></div>
</div>
</div>""",
    "40. (Soal No. 32 Hal. 2) Jelaskan 9 Kaidah I'lal lengkap beserta contohnya masing-masing!",
    """<div class="ans-block">
<p class="ans-p"><strong>9 Kaidah Emas I'lal dalam Kitab Al-Maqshud:</strong></p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 1</span><span class="v-grid-desc">Wawu/Ya' berharakat jatuh setelah fathah diganti Alif</span><span class="v-grid-val">قَالَ (asal: قَوَلَ)، غَزَا</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 2</span><span class="v-grid-desc">Ya' sukun/fathah setelah kasrah tetap dibiarkan pada asalnya</span><span class="v-grid-val">خَشِيَ، رَمَيْتُ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 3</span><span class="v-grid-desc">Ya' sukun setelah huruf berharakat dhammah diganti Wawu</span><span class="v-grid-val">يُوسِرُ (asal: يُيْسِرُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 4</span><span class="v-grid-desc">Wawu sukun setelah huruf berharakat kasrah diganti Ya'</span><span class="v-grid-val">قِيلَ (asal: قُوِلَ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 5</span><span class="v-grid-desc">Wawu berharakat di ujung kata setelah kasrah diganti Ya'</span><span class="v-grid-val">غَبِيَ (asal: غَبِوَ)، دُعِيَ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 6</span><span class="v-grid-desc">Wawu/Ya' berharakat setelah huruf shahih sukun dipindah harakatnya</span><span class="v-grid-val">يَقُولُ (asal: يَقْوُلُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 7</span><span class="v-grid-desc">Wawu/Ya' di akhir kata setelah huruf berharakat disukunkan karena berat dhammah/kasrah</span><span class="v-grid-val">يَغْزُو (asal: يَغْزُوُ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 8</span><span class="v-grid-desc">Dua Wawu bertemu (pertama sukun, kedua hidup) wajib di-idghamkan</span><span class="v-grid-val">مَغْزُوٌّ (asal: مَغْزُووٌ)</span></div>
  <div class="v-grid-card"><span class="v-grid-label">Kaidah 9</span><span class="v-grid-desc">Wawu dan Ya' berkumpul (huruf pertama sukun), Wawu ditukar Ya' lalu di-idghamkan</span><span class="v-grid-val">مَرْمِيٌّ (asal: مَرْمُويٌ)</span></div>
</div>
</div>""",
    "مَغْزُوٌّ", "dibiarkan", ["إعلال", "تسعة", "قواعد", "واو", "ياء", "ilal", "kaidah"]
)

# 41 (PDF #33)
add_item(
    41, *CH4, 33,
    "٣٣- اَقَامَ و اَبَاعَ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<p class="ans-p">أَقَامَ و أَبَاعَ فعللرينده ٦. و ١. اعلال قاعده لرى تطبيقي:</p>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال أَقَامَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">أَقْوَمَ</span><span class="v-step-tag">اصل (إفعال)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">أَقَوْمَ</span><span class="v-step-tag">٦. قاعده (نقل حركه)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">أَقَامَ</span><span class="v-step-tag">١. قاعده (واو الفه قلب)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال أَبَاعَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">أَبْيَعَ</span><span class="v-step-tag">اصل (إفعال)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">أَبَيْعَ</span><span class="v-step-tag">٦. قاعده (نقل حركه)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">أَبَاعَ</span><span class="v-step-tag">١. قاعده (ياء الفه قلب)</span></div>
  </div>
</div>
</div>""",
    "41. (Soal No. 33 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'أَقَامَ' dan 'أَبَاعَ'?",
    """<div class="ans-block">
<p class="ans-p">I'lal pada kata أَقَامَ dan أَبَاعَ merupakan paduan Kaidah ke-6 (pemindahan harakat) dan Kaidah ke-1 (penggantian ke Alif):</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal أَقَامَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">أَقْوَمَ</span><span class="v-step-tag">Bentuk Asal Bab If'al</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">أَقَوْمَ</span><span class="v-step-tag">Kaidah 6 (Pindah Fathah ke Qaf)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">أَقَامَ</span><span class="v-step-tag">Kaidah 1 (Wawu diganti Alif)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal أَبَاعَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">أَبْيَعَ</span><span class="v-step-tag">Bentuk Asal Bab If'al</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">أَبَيْعَ</span><span class="v-step-tag">Kaidah 6 (Pindah Fathah ke Ba')</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">أَبَاعَ</span><span class="v-step-tag">Kaidah 1 (Ya' diganti Alif)</span></div>
  </div>
</div>
</div>""",
    "أَقْوَمَ", "pemindahan", ["أقام", "أباع", "أقوم", "أبيع", "إعلال", "aqama", "abaa"]
)

# 42 (PDF #35)
add_item(
    42, *CH4, 35,
    "٣٥- غَزَوْا و رَمَوْا فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال غَزَوْا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غَزَوُوا</span><span class="v-step-tag">اصل جمع مذكر</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غَزَاوْا</span><span class="v-step-tag">١. قاعده (واو الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غَزَوْا</span><span class="v-step-tag">التقاء ساكنيندن الف حذفى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال رَمَوْا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">رَمَيُوا</span><span class="v-step-tag">اصل جمع مذكر</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">رَمَاوْا</span><span class="v-step-tag">١. قاعده (ياء الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">رَمَوْا</span><span class="v-step-tag">التقاء ساكنيندن الف حذفى</span></div>
  </div>
</div>
<div class="v-badge-note">جمع واوى فاعل و علامت اولدوغى ايچون حذف ايديلمز، اونك يرينه الف مقلوبه حذف ايديلير.</div>
</div>""",
    "42. (Soal No. 35 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'غَزَوْا' dan 'رَمَوْا'?",
    """<div class="ans-block">
<p class="ans-p">Proses i'lal pada jama' mudzakkar ghaib fi'il naqish:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal غَزَوْا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غَزَوُوا</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غَزَاوْا</span><span class="v-step-tag">Kaidah 1 (Wawu ditukar Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غَزَوْا</span><span class="v-step-tag">Iltiqa' Sakinain (Alif Dibuang)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal رَمَوْا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">رَمَيُوا</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">رَمَاوْا</span><span class="v-step-tag">Kaidah 1 (Ya' ditukar Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">رَمَوْا</span><span class="v-step-tag">Iltiqa' Sakinain (Alif Dibuang)</span></div>
  </div>
</div>
<div class="v-badge-note">Wawu jama'ah adalah tanda fa'il yang tidak boleh dibuang, sehingga huruf Alif hasil perubahan yang digugurkan.</div>
</div>""",
    "غَزَوُوا", "perubahan", ["غزوا", "رموا", "إعلال", "التقاء ساكنين", "ghazawa", "ramawa"]
)

# 43 (PDF #43)
add_item(
    43, *CH4, 43,
    "٤٣- غَزَتَا و رَمَتَا فعلنك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال غَزَتَا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غَزَوَتَا</span><span class="v-step-tag">اصل تثنيه مؤنث</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غَزَاتَا</span><span class="v-step-tag">١. قاعده (واو الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غَزَتَا</span><span class="v-step-tag">الف حذف ايديلدى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال رَمَتَا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">رَمَيَتَا</span><span class="v-step-tag">اصل تثنيه مؤنث</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">رَمَاتَا</span><span class="v-step-tag">١. قاعده (ياء الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">رَمَتَا</span><span class="v-step-tag">الف حذف ايديلدى</span></div>
  </div>
</div>
<div class="v-badge-note">ت نك اصل سكونى مؤنث علامتيدر؛ تثنيه الفى كَلنجه ت حركه لنمشدر فقط بو حركه عارضى اولدوغوندن يوق كبيدر، الف حذف اولونور.</div>
</div>""",
    "43. (Soal No. 43 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'غَزَتَا' dan 'رَمَتَا'?",
    """<div class="ans-block">
<p class="ans-p">Proses i'lal pada tatsniyah muannats ghaibah:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal غَزَتَا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غَزَوَتَا</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غَزَاتَا</span><span class="v-step-tag">Kaidah 1 (Wawu ditukar Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غَزَتَا</span><span class="v-step-tag">Alif Dibuang</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal رَمَتَا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">رَمَيَتَا</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">رَمَاتَا</span><span class="v-step-tag">Kaidah 1 (Ya' ditukar Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">رَمَتَا</span><span class="v-step-tag">Alif Dibuang</span></div>
  </div>
</div>
<div class="v-badge-note">Huruf Ta' ta'nits sejatinya sukun, harakat fathah padanya semata-mata karena menyambut alif tatsniyah (sukun 'aridhi). Karenanya Alif tetap digugurkan karena bertemunya dua sukun.</div>
</div>""",
    "غَزَوَتَا", "muannats", ["غزتا", "رمتا", "تثنية", "مؤنث", "ghazata", "ramata"]
)

# 44 (PDF #36)
add_item(
    44, *CH4, 36,
    "٣٦- قُلْنَ و كِلْنَ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال قُلْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">قَوَلْنَ</span><span class="v-step-tag">اصل جمع مؤنث</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قَالْنَ</span><span class="v-step-tag">١. قاعده (واو الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قَلْنَ</span><span class="v-step-tag">التقاء ساكنيندن الف حذفى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قُلْنَ</span><span class="v-step-tag">واوه دلالت ايچون ق ضمه لندى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال كِلْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">كَيَلْنَ</span><span class="v-step-tag">اصل جمع مؤنث</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">كَالْنَ</span><span class="v-step-tag">١. قاعده (ياء الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">كَلْنَ</span><span class="v-step-tag">التقاء ساكنيندن الف حذفى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">كِلْنَ</span><span class="v-step-tag">يايه دلالت ايچون ك كسرلندى</span></div>
  </div>
</div>
</div>""",
    "44. (Soal No. 36 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'قُلْنَ' dan 'كِلْنَ'?",
    """<div class="ans-block">
<p class="ans-p">I'lal pada jama' muannats fi'il ajwaf wawi dan ya'i:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal قُلْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">قَوَلْنَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قَالْنَ</span><span class="v-step-tag">Kaidah 1 (Wawu jadi Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قَلْنَ</span><span class="v-step-tag">Alif Gugur (Iltiqa' Sakinain)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قُلْنَ</span><span class="v-step-tag">Qaf di-dhammah (tanda Wawu)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal كِلْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">كَيَلْنَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">كَالْنَ</span><span class="v-step-tag">Kaidah 1 (Ya' jadi Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">كَلْنَ</span><span class="v-step-tag">Alif Gugur (Iltiqa' Sakinain)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">كِلْنَ</span><span class="v-step-tag">Kaf di-kasrah (tanda Ya')</span></div>
  </div>
</div>
</div>""",
    "قَوَلْنَ", "muannats", ["قلن", "كلن", "أجوف", "إعلال", "qulna", "kilna"]
)

# 45 (PDF #37)
add_item(
    45, *CH4, 37,
    "٣٧- قِيلَ و دُعِيَ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال قِيلَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">قُوِلَ</span><span class="v-step-tag">ماضى مجهول اصلى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قِوْلَ</span><span class="v-step-tag">٦. قاعده (كسره قافه ويريلدى)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قِيلَ</span><span class="v-step-tag">٤. قاعده (واو يايه دوندرلدى)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال دُعِيَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">دُعِوَ</span><span class="v-step-tag">ماضى مجهول اصلى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">دُعِيَ</span><span class="v-step-tag">٥. قاعده (آخرده كسر صوكراسى واو -> يا)</span></div>
  </div>
</div>
</div>""",
    "45. (Soal No. 37 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'قِيلَ' dan 'دُعِيَ'?",
    """<div class="ans-block">
<p class="ans-p">I'lal pada bentuk madhi majhul ajwaf dan naqish:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal قِيلَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">قُوِلَ</span><span class="v-step-tag">Asal Madhi Majhul</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قِوْلَ</span><span class="v-step-tag">Kaidah 6 (Pindah Kasrah ke Qaf)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قِيلَ</span><span class="v-step-tag">Kaidah 4 (Wawu sukun setelah kasrah jadi Ya')</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal دُعِيَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">دُعِوَ</span><span class="v-step-tag">Asal Madhi Majhul</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">دُعِيَ</span><span class="v-step-tag">Kaidah 5 (Wawu ujung kata setelah kasrah jadi Ya')</span></div>
  </div>
</div>
</div>""",
    "قُوِلَ", "majhul", ["قيل", "دعي", "قول", "دعو", "إعلال", "qila", "duiya"]
)

# 46 (PDF #38)
add_item(
    46, *CH4, 38,
    "٣٨- غَزُوا و يَخَافُ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال غُزُوا (مجهول جمع مذكر)</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غُزِوُوا</span><span class="v-step-tag">اصل</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غُزِيُوا</span><span class="v-step-tag">٥. قاعده (واو -> يا)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غُزُيْوَا</span><span class="v-step-tag">ضمه زاء يه نقل اولوندى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غُزُوا</span><span class="v-step-tag">التقاء ساكنيندن ياء حذفى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال يَخَافُ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَخْوَفُ</span><span class="v-step-tag">اصل مضارع</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَخَوْفُ</span><span class="v-step-tag">٦. قاعده (فتحه خاء يه نقل)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَخَافُ</span><span class="v-step-tag">١. قاعده (واو الفه قلب)</span></div>
  </div>
</div>
</div>""",
    "46. (Soal No. 38 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'غُزُوا' dan 'يَخَافُ'?",
    """<div class="ans-block">
<p class="ans-p">Transformasi kata غُزُوا (madhi majhul naqish) dan يَخَافُ (mudhari' ajwaf):</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal غُزُوا</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">غُزِوُوا</span><span class="v-step-tag">Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غُزِيُوا</span><span class="v-step-tag">Kaidah 5 (Wawu jadi Ya')</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">غُزُيْوَا</span><span class="v-step-tag">Pindah Dhammah ke Zai</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">غُزُوا</span><span class="v-step-tag">Buang Ya' (Iltiqa' Sakinain)</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal يَخَافُ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَخْوَفُ</span><span class="v-step-tag">Asal Mudhari' Bab 4</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَخَوْفُ</span><span class="v-step-tag">Kaidah 6 (Pindah Fathah ke Kha')</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَخَافُ</span><span class="v-step-tag">Kaidah 1 (Wawu jadi Alif)</span></div>
  </div>
</div>
</div>""",
    "غُزِوُوا", "Transformasi", ["غزوا", "يخاف", "يخوف", "إعلال", "ghuzu", "yakhafu"]
)

# 47 (PDF #40)
add_item(
    47, *CH4, 40,
    "٤٠- يَرْمُونَ و يَخْشَوْنَ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">اعلال يَرْمُونَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَرْمِيُونَ</span><span class="v-step-tag">اصل مضارع جمع</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَرْمِيْوْنَ</span><span class="v-step-tag">٧. قاعده (ياء ساكن قيليندى)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَرْمِوْنَ</span><span class="v-step-tag">التقاء ساكنيندن ياء حذفى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَرْمُونَ</span><span class="v-step-tag">واوك بناسى ايچون ميم ضمه لندى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">اعلال يَخْشَوْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَخْشَيُونَ</span><span class="v-step-tag">اصل مضارع جمع</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَخْشَاوْنَ</span><span class="v-step-tag">١. قاعده (ياء الفه قلب)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَخْشَوْنَ</span><span class="v-step-tag">التقاء ساكنيندن الف حذفى</span></div>
  </div>
</div>
</div>""",
    "47. (Soal No. 40 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'يَرْمُونَ' dan 'يَخْشَوْنَ'?",
    """<div class="ans-block">
<p class="ans-p">I'lal jama' mudzakkar mudhari' fi'il naqish:</p>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal يَرْمُونَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَرْمِيُونَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَرْمِيْوْنَ</span><span class="v-step-tag">Kaidah 7 (Sukunkan Ya')</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَرْمِوْنَ</span><span class="v-step-tag">Buang Ya' (Iltiqa' Sakinain)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَرْمُونَ</span><span class="v-step-tag">Mim di-dhammah agar Wawu selamat</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">Tahapan I'lal يَخْشَوْنَ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">يَخْشَيُونَ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">يَخْشَاوْنَ</span><span class="v-step-tag">Kaidah 1 (Ya' jadi Alif)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">يَخْشَوْنَ</span><span class="v-step-tag">Buang Alif (Iltiqa' Sakinain)</span></div>
  </div>
</div>
</div>""",
    "يَرْمِيُونَ", "mudhari", ["يرمون", "يخشون", "إعلall", "ناقص", "yarmuna", "yakhsyawna"]
)

# 48 (PDF #39)
add_item(
    48, *CH4, 39,
    "٣٩- تَغْزِينَ فعلنك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<p class="ans-p"><strong>تَغْزِينَ</strong> (فعل مضارع مفرد مؤنث مخاطبه):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">تَغْزُوِينَ</span><span class="v-step-tag">اصل مخاطبه</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">تَغْزِوْيْنَ</span><span class="v-step-tag">٦. قاعده (كسره زاء يه ويريلدى)</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">تَغْزِينَ</span><span class="v-step-tag">التقاء ساكنيندن علت واوى حذفى</span></div>
</div>
<div class="v-badge-note">مخاطبه ياء سى فاعل و علامت اولدوغى ايچون حذف ايديلمز، اونك يرينه علت واوى حذف اولونور.</div>
</div>""",
    "48. (Soal No. 39 Hal. 2) Bagaimanakah proses i'lal pada fi'il 'تَغْزِينَ'?",
    """<div class="ans-block">
<p class="ans-p"><strong>تَغْزِينَ</strong> (Fi'il Mudhari' Mufrad Muannats Mukhatabah):</p>
<div class="v-flow-chain">
  <div class="v-step-card is-origin"><span class="v-step-word">تَغْزُوِينَ</span><span class="v-step-tag">Bentuk Asal</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card"><span class="v-step-word">تَغْزِوْيْنَ</span><span class="v-step-tag">Kaidah 6 (Kasrah dipindah ke Zai)</span></div>
  <span class="v-step-arrow">-></span>
  <div class="v-step-card is-final"><span class="v-step-word">تَغْزِينَ</span><span class="v-step-tag">Wawu 'Illat Dibuang</span></div>
</div>
<div class="v-badge-note">Huruf Ya' mukhatabah adalah dhamir fa'il sehingga tidak boleh dibuang; yang digugurkan adalah huruf Wawu 'illat aslinya.</div>
</div>""",
    "تَغْزُوِينَ", "mukhatabah", ["تغزين", "إعلال", "ناقص", "taghzina", "naqish"]
)

# 49 (PDF #41)
add_item(
    49, *CH4, 41,
    "٤١- غَازٍ رَامٍ و مَرْمِيٌّ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">١. اعلال غَازٍ و رَامٍ</div>
  <p class="ans-p">غَازٍ اصلنده "غَازِوٌ" ايدى. ٥. قاعده ايله واو يايه قلب اولوندى (غَازِيٌ). ٧. قاعده ايله ياء ساكن قيليندى. التقاء ساكنيندن (ياء و تنوين) ياء حذف اولوندى: <strong>غَازٍ</strong> اولدى. رَامٍ ده عيناً بويله در (رَامِيٌ -> رَامٍ).</p>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">٢. اعلال مَرْمِيٌّ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">مَرْمُويٌ</span><span class="v-step-tag">اصل اسم مفعول</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">مَرْمُيْيٌ</span><span class="v-step-tag">٩. قاعده (واو يايه قلب اولوندى)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">مَرْمِيٌّ</span><span class="v-step-tag">ادغام و ماقبلى كسرلندى</span></div>
  </div>
</div>
</div>""",
    "49. (Soal No. 41 Hal. 2) Bagaimanakah proses i'lal pada kata 'غَازٍ', 'رَامٍ', dan 'مَرْمِيٌّ'?",
    """<div class="ans-block">
<p class="ans-p">Proses i'lal pada isim fa'il manqush dan isim maf'ul fi'il naqish:</p>
<div class="v-flow-box">
  <div class="v-flow-header">1. I'lal غَازٍ dan رَامٍ</div>
  <p class="ans-p">غَازٍ asalnya <span class="arabic-inline font-bold">غَازِوٌ</span>. Kaidah 5 mengubah Wawu jadi Ya' (غَازِيٌ). Kaidah 7 men-sukunkan Ya'. Karena bertemunya dua sukun antara Ya' dan tanwin (nun sukun), Ya' digugurkan sehingga menjadi <strong>غَازٍ</strong>. Begitu pula رَامِيٌ menjadi <strong>رَامٍ</strong>.</p>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">2. I'lal مَرْمِيٌّ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">مَرْمُويٌ</span><span class="v-step-tag">Asal Isim Maf'ul</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">مَرْمُيْيٌ</span><span class="v-step-tag">Kaidah 9 (Wawu ditukar Ya')</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">مَرْمِيٌّ</span><span class="v-step-tag">Idgham & Kasrahkan Mim</span></div>
  </div>
</div>
</div>""",
    "مَرْمُويٌ", "manqush", ["غاز", "رام", "مرمي", "إعلال", "ghazin", "ramin", "marmiyyun"]
)

# 50 (PDF #42)
add_item(
    50, *CH4, 42,
    "٤٢- قُلْ، قَائِلٌ و كَائِلٌ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">١. اعلال قُلْ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">اُقْوُلْ</span><span class="v-step-tag">اصل امر حاضر</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">اُقُوْلْ</span><span class="v-step-tag">٦. قاعده (ضمه قافه نقل)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قُلْ</span><span class="v-step-tag">واو و همزه حذف اولوندى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">٢. اعلال قَائِلٌ و كَائِلٌ</div>
  <p class="ans-p">قَائِلٌ اصلنده "قَاوِلٌ" ايدى. اسم فاعلده فاء الفعل ايله عين الفعل آراسنه اسم فاعل الفى اكله نينجه ايكى الف اجتماع ايتدى (قَاالٌ). عين الفعلدن قلب اولان الف همزه يه چويريلدى: <strong>قَائِلٌ</strong> اولدى. كَائِلٌ ده اصلنده "كَايِلٌ" اولوب عينى شكلده در.</p>
</div>
</div>""",
    "50. (Soal No. 42 Hal. 2) Bagaimanakah proses i'lal pada 'قُلْ', 'قَائِلٌ', dan 'كَائِلٌ'?",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">1. Tahapan I'lal قُلْ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">اُقْوُلْ</span><span class="v-step-tag">Asal Amar Hadhir</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">اُقُوْلْ</span><span class="v-step-tag">Kaidah 6 (Pindah Dhammah ke Qaf)</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قُلْ</span><span class="v-step-tag">Buang Wawu & Gugur Hamzah</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">2. Tahapan I'lal قَائِلٌ dan كَائِلٌ</div>
  <p class="ans-p">قَائِلٌ asalnya <span class="arabic-inline font-bold">قَاوِلٌ</span>. Saat alif isim fa'il disisipkan, bertemu dua alif (قَاالٌ). Alif kedua yang merupakan jelmaan 'ain fi'il diganti menjadi hamzah demi mencegah iltiqa' sakinain: <strong>قَائِلٌ</strong>. Demikian pula كَائِلٌ dari asalnya <span class="arabic-inline font-bold">كَايِلٌ</span>.</p>
</div>
</div>""",
    "اُقْوُلْ", "disisipkan", ["قل", "قائل", "كائل", "إعلال", "qul", "qail", "kail"]
)

# 51 (PDF #43)
add_item(
    51, *CH4, 43,
    "٤٣- مثال فعلك فاء الفعلنك حكمى نه در؟",
    """<div class="ans-block">
<p class="ans-p"><strong>مثال واوى نك فاء الفعلى (واو):</strong></p>
<div class="v-tree">
  <div class="v-tree-root">حكم فاء الفعل (مثال واوى)</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">معلوم مضارع و امرده دوشر</span>
      <span class="v-node-desc">٢، ٣، و ٦. بابلردن كلديكنده</span>
      <span class="v-node-ex">وَعَدَ -> يَعِدُ، عِدْ | وَهَبَ -> يَهَبُ، هَبْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">مجهولنده ثابت قالير</span>
      <span class="v-node-desc">واو حذف اولنماز</span>
      <span class="v-node-ex">يُوعَدُ، لِتُوعَدْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">فِعْلَةٌ وزنى مصدرنده</span>
      <span class="v-node-desc">واو حذف اولونوب آخيرينه تاء اكله نير</span>
      <span class="v-node-ex">عِدَةٌ، هِبَةٌ، صِلَةٌ، جِهَةٌ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">٤. بابدن فقط ايكى لفظده واو دوشر: وَطِئَ يَطَأُ و وَسِعَ يَسَعُ.</div>
</div>""",
    "51. (Soal No. 43 Hal. 2) Bagaimanakah hukum huruf fa' fi'il (wawu) pada Fi'il Mitsal?",
    """<div class="ans-block">
<p class="ans-p"><strong>Hukum Fa' Fi'il (Wawu) pada Fi'il Mitsal Wawi:</strong></p>
<div class="v-tree">
  <div class="v-tree-root">Kaidah Huruf Fa' Fi'il Mitsal</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">Gugur pada Mudhari' & Amar Ma'lum</span>
      <span class="v-node-desc">Pada bab 2, 3, dan 6</span>
      <span class="v-node-ex">وَعَدَ -> يَعِدُ، عِدْ | وَهَبَ -> يَهَبُ، هَبْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Tetap Ada pada Bentuk Majhul</span>
      <span class="v-node-desc">Huruf Wawu tidak dibuang</span>
      <span class="v-node-ex">يُوعَدُ، لِتُوعَدْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">Pada Mashdar Wazan فِعْلَةٌ</span>
      <span class="v-node-desc">Wawu diganti ta' marbuthah di akhir</span>
      <span class="v-node-ex">عِدَةٌ، هِبَةٌ، صِلَةٌ، جِهَةٌ</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Pada bab ke-4, hanya ada dua kata kerja yang huruf wawunya gugur, yaitu: وَطِئَ يَطَأُ dan وَسِعَ يَسَعُ.</div>
</div>""",
    "يُوعَدُ", "Mitsal", ["مثال", "واو", "فاء", "وعد", "يعـد", "mitsal", "wawu"]
)

# 52 (PDF #44)
add_item(
    52, *CH4, 44,
    "٤٤- لفيف مقرون و مفروقك حكملوى نه در؟",
    """<div class="ans-block">
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">١. لفيف مقرون (رَوَى، طَوَى)</span>
    <span class="v-grid-desc">عين الفعلى: صحيحك عين الفعلى كبيدير، اعلال اولماز. لام الفعلى: ناقصك لام الفعلى كبى اعلال اولور.</span>
    <span class="v-grid-val">رَوَى يَرْوِي اِرْوِ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢. لفيف مفروق (وَقَى)</span>
    <span class="v-grid-desc">فاء الفعلى: مثالك فاء الفعلى كبيدير (واو دوشر). لام الفعلى: ناقصك لام الفعلى كبيدير (جزمده دوشر).</span>
    <span class="v-grid-val">وَقَى يَقِي قِ (وقفده: قِهْ)</span>
  </div>
</div>
</div>""",
    "52. (Soal No. 44 Hal. 2) Bagaimanakah hukum fi'il Lafif Maqrun dan Lafif Mafruq?",
    """<div class="ans-block">
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">1. Lafif Maqrun (رَوَى، طَوَى)</span>
    <span class="v-grid-desc">'Ain fi'ilnya dihukumi seperti fi'il shahih (tidak di-i'lal); sedangkan Lam fi'ilnya dihukumi seperti fi'il naqish.</span>
    <span class="v-grid-val">رَوَى يَرْوِي اِرْوِ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">2. Lafif Mafruq (وَقَى)</span>
    <span class="v-grid-desc">Fa' fi'ilnya dihukumi seperti fi'il mitsal (wawu gugur); Lam fi'ilnya dihukumi seperti fi'il naqish (gugur saat jazm).</span>
    <span class="v-grid-val">وَقَى يَقِي قِ (saat waqaf: قِهْ)</span>
  </div>
</div>
</div>""",
    "مفروق", "Lafif", ["لفيف", "مقرون", "مفروق", "روى", "وقى", "lafif", "maqrun"]
)

# 53 (PDF #45)
add_item(
    53, *CH4, 45,
    "٤٥- قِهْ، مَقُولٌ و مَكِيلٌ فعللرينك اعلالى نصل ياپيلير؟",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">١. اعلال قِهْ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">اِوْقِ</span><span class="v-step-tag">اصل امر حاضر</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قِ</span><span class="v-step-tag">واو، همزه و ياء دوشدى</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قِهْ</span><span class="v-step-tag">وقفده هاء السكت اكله ندى</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">٢. اعلال مَقُولٌ و مَكِيلٌ</div>
  <p class="ans-p"><strong>مَقُولٌ:</strong> اصلنده "مَقْوُولٌ" ايدى. ٦. قاعده ايله واوك ضمه سى قافه ويريلدى (مَقُوْولٌ). ايكى ساكن اجتماعندن علت واوى حذف اولوندى: <strong>مَقُولٌ</strong> اولدى.</p>
  <p class="ans-p"><strong>مَكِيلٌ:</strong> اصلنده "مَكْيُولٌ" ايدى. ٦. قاعده ايله ياء نك كسره سى كافه ويريلدى (مَكِيْولٌ). التقاء ساكنيندن ياء حذف ايديلدى (مَكُوْلٌ). حذف اولونان يايه دلالت ايچون كاف كسرلندى، ٤. قاعده ايله مفعول واوى يايه دوندرلدى: <strong>مَكِيلٌ</strong> اولدى.</p>
</div>
</div>""",
    "53. (Soal No. 45 Hal. 2) Bagaimanakah proses i'lal pada 'قِهْ', 'مَقُولٌ', dan 'مَكِيلٌ'?",
    """<div class="ans-block">
<div class="v-flow-box">
  <div class="v-flow-header">1. Tahapan I'lal قِهْ</div>
  <div class="v-flow-chain">
    <div class="v-step-card is-origin"><span class="v-step-word">اِوْقِ</span><span class="v-step-tag">Bentuk Asal</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card"><span class="v-step-word">قِ</span><span class="v-step-tag">Wawu, Hamzah & Ya' Gugur</span></div>
    <span class="v-step-arrow">-></span>
    <div class="v-step-card is-final"><span class="v-step-word">قِهْ</span><span class="v-step-tag">Tambah Ha' Saktah Saat Waqaf</span></div>
  </div>
</div>
<div class="v-flow-box">
  <div class="v-flow-header">2. Tahapan I'lal مَقُولٌ dan مَكِيلٌ</div>
  <p class="ans-p"><strong>مَقُولٌ:</strong> Asalnya <span class="arabic-inline font-bold">مَقْوُولٌ</span>. Kaidah 6 memindah dhammah ke Qaf (مَقُوْولٌ). Wawu 'illat dibuang karena iltiqa' sakinain: <strong>مَقُولٌ</strong>.</p>
  <p class="ans-p"><strong>مَكِيلٌ:</strong> Asalnya <span class="arabic-inline font-bold">مَكْيُولٌ</span>. Kaidah 6 memindah kasrah ke Kaf (مَكِيْولٌ). Ya' dibuang karena iltiqa' sakinain (مَكُوْلٌ). Kaf di-kasrah kembali sebagai tanda Ya', lalu Kaidah 4 mengubah Wawu maf'ul menjadi Ya': <strong>مَكِيلٌ</strong>.</p>
</div>
</div>""",
    "مَقْوُولٌ", "Saktah", ["قه", "مقول", "مكيل", "إعلال", "qih", "maqul", "makil"]
)

# 54 (PDF #46)
add_item(
    54, *CH4, 46,
    "٤٦- ادغام نه در؟ قاچ قسمدر؟",
    """<div class="ans-block">
<p class="ans-p"><strong>إدغام:</strong> عيني جنسدن اولان ايكى حرفدن برنجيسنى ايكنجيسنه قاتيپ شدّه لى بر حرف كبى اوقومقدر. اوچ قسمدر:</p>
<div class="v-tree">
  <div class="v-tree-root">أقسام الإدغام</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">١. إدغام واجب</span>
      <span class="v-node-desc">ادغام ايتمك حتماً لازمدر</span>
      <span class="v-node-ex">مَدَّ، يَمُدُّ، مَدًّا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٢. إدغام جائز</span>
      <span class="v-node-desc">هم ادغام هم فك (اظهار) جائزدر</span>
      <span class="v-node-ex">لَمْ يَمُدَّ / لَمْ يَمْدُدْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٣. إدغام ممتنع</span>
      <span class="v-node-desc">ادغام ممتنع اولوب اظهار واجبدر</span>
      <span class="v-node-ex">مَدَدْنَ، مَدَدْتَ، مَدَدْتُ</span>
    </div>
  </div>
</div>
</div>""",
    "54. (Soal No. 46 Hal. 2) Apakah pengertian idgham dan berapa pembagian hukumnya?",
    """<div class="ans-block">
<p class="ans-p"><strong>Idgham:</strong> Meleburkan huruf pertama ke dalam huruf kedua yang sejenis sehingga diucapkan laksana satu huruf yang bertasydid. Terbagi menjadi 3 hukum:</p>
<div class="v-tree">
  <div class="v-tree-root">Pembagian Hukum Idgham</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">1. Idgham Wajib</span>
      <span class="v-node-desc">Wajib di-idghamkan tanpa boleh diurai</span>
      <span class="v-node-ex">مَدَّ، يَمُدُّ، مَدًّا</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">2. Idgham Jaiz</span>
      <span class="v-node-desc">Boleh di-idghamkan dan boleh di-fakk (izhhar)</span>
      <span class="v-node-ex">لَمْ يَمُدَّ / لَمْ يَمْدُدْ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">3. Idgham Mumtani'</span>
      <span class="v-node-desc">Terlarang idgham, wajib dibaca izhhar</span>
      <span class="v-node-ex">مَدَدْنَ، مَدَدْتَ، مَدَدْنَا</span>
    </div>
  </div>
</div>
</div>""",
    "شدّه", "Meleburkan", ["إدغام", "واجب", "جائز", "ممتنع", "idgham", "hukum"]
)

# 55 (PDF #47)
add_item(
    55, *CH4, 47,
    "٤٧- ادغام واجب وادغام جائز وممتنع نه در؟",
    """<div class="ans-block">
<p class="ans-p">إدغامك اوچ حكمنك قاعـده لرى:</p>
<div class="v-grid">
  <div class="v-grid-card">
    <span class="v-grid-label">١. إدغام واجب</span>
    <span class="v-grid-desc">عيني جنسدن ايكى حرفدن هر ايكيسى ده حركه لى ايسه (مَدَّ اصلنده مَدَدَ)، و يا برنجيسى ساكن ايكنجيسى حركه لى ايسه</span>
    <span class="v-grid-val">مَدَّ، يَمُدُّ، مَدًّا</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢. إدغام جائز</span>
    <span class="v-grid-desc">برنجيسى حركه لى، ايكنجيسى سكون عارض ايله ساكن ايسه (جزم كيرنجه)</span>
    <span class="v-grid-val">لَمْ يَمُدَّ / لَمْ يَمْدُدْ، مُدَّ / اُمْدُدْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٣. إدغام ممتنع</span>
    <span class="v-grid-desc">برنجيسى حركه لى، ايكنجيسى سكون اصلى ايله ساكن ايسه (ضمير رفع متحرك بيتيشنجه)</span>
    <span class="v-grid-val">مَدَدْنَ، مَدَدْتَ، مَدَدْتُ، مَدَدْنَا</span>
  </div>
</div>
</div>""",
    "55. (Soal No. 47 Hal. 2) Jelaskan syarat Idgham Wajib, Idgham Jaiz, dan Idgham Mumtani'!",
    """<div class="ans-block">
<p class="ans-p">Rincian syarat ketiga hukum idgham:</p>
<div class="v-grid">
  <div class="v-grid-card">
    <span class="v-grid-label">1. Idgham Wajib</span>
    <span class="v-grid-desc">Apabila kedua huruf sejenis sama-sama berharakat (مَدَّ asalnya مَدَدَ), atau huruf pertama sukun dan kedua berharakat</span>
    <span class="v-grid-val">مَدَّ، يَمُدُّ، مَدًّا</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">2. Idgham Jaiz</span>
    <span class="v-grid-desc">Apabila huruf pertama berharakat dan huruf kedua sukun karena sukun 'aridhi (akibat jazm atau waqaf)</span>
    <span class="v-grid-val">لَمْ يَمُدَّ / لَمْ يَمْدُدْ | مُدَّ / اُمْدُدْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">3. Idgham Mumtani'</span>
    <span class="v-grid-desc">Apabila huruf kedua sukun dengan sukun ashli karena bersambung dhamir rafa' mutaharrik</span>
    <span class="v-grid-val">مَدَدْنَ، مَدَدْتَ، مَدَدْتُ، مَدَدْنَا</span>
  </div>
</div>
</div>""",
    "سكون عارض", "bersambung", ["إدغام", "واجب", "جائز", "ممتنع", "سكون", "idgham", "syarat"]
)

# 56 (PDF #48)
add_item(
    56, *CH4, 48,
    "٤٨- لَمْ يَمُدَّ نك ادغامى نصل ياپيلير؟",
    """<div class="ans-block">
<p class="ans-p"><strong>لَمْ يَمُدَّ:</strong> اصلنده "لَمْ يَمْدُدْ" ايدى. برنجى دالك ضمه سى ماقبلنده كى ميمه ويريلدى (لَمْ يَمُدْدْ). ايكى ساكن دال اجتماع ايتدى. ادغام ايچون ايكنجى دال حركه لنديريلدى. اوچ وجه جائزدر:</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">١. فتحه ايله</span><span class="v-grid-desc">حركه لرك اك خفيفى اولدوغى ايچون</span><span class="v-grid-val">لَمْ يَمُدَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٢. كسره ايله</span><span class="v-grid-desc">الساكن اذا حرك حرك بالكسر قاعـده سيله</span><span class="v-grid-val">لَمْ يَمُدِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">٣. ضمه ايله</span><span class="v-grid-desc">عين الفعلى نك حركه سينه تبعاً</span><span class="v-grid-val">لَمْ يَمُدُّ</span></div>
</div>
<div class="v-badge-note">ادغامى ترك ايدوب فك (اظهار) ايله "لَمْ يَمْدُدْ" اوقومق ده جائزدر.</div>
</div>""",
    "56. (Soal No. 48 Hal. 2) Bagaimanakah cara melakukan idgham pada 'لَمْ يَمُدَّ'?",
    """<div class="ans-block">
<p class="ans-p">Kata <span class="arabic-inline font-bold">لَمْ يَمُدَّ</span> asalnya adalah <span class="arabic-inline font-bold">لَمْ يَمْدُدْ</span>. Dhammah Dal pertama dipindahkan ke huruf Mim sebelumnya (لَمْ يَمُدْدْ). Bertemu dua Dal sukun, maka Dal kedua diberi harakat agar dapat di-idghamkan dengan 3 kemungkinan harakat (ditambah 1 wajah fakk/izhhar):</p>
<div class="v-grid">
  <div class="v-grid-card"><span class="v-grid-label">1. Fathah (أَخَفُّ الْحَرَكَاتِ)</span><span class="v-grid-desc">Karena fathah adalah harakat teringan</span><span class="v-grid-val">لَمْ يَمُدَّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">2. Kasrah (حُرِّكَ بِالْكَسْرِ)</span><span class="v-grid-desc">Kaidah: huruf sukun jika diharakati, diharakati kasrah</span><span class="v-grid-val">لَمْ يَمُدِّ</span></div>
  <div class="v-grid-card"><span class="v-grid-label">3. Dhammah (تَبَعًا لِلْعَيْنِ)</span><span class="v-grid-desc">Mengikuti harakat 'ain fi'il aslinya</span><span class="v-grid-val">لَمْ يَمُدُّ</span></div>
</div>
<div class="v-badge-note">Di samping ketiga wajah idgham di atas, boleh juga dibaca tanpa idgham (izhhar / fakk): لَمْ يَمْدُدْ.</div>
</div>""",
    "لَمْ يَمْدُدْ", "kemungkinan", ["لم يمد", "إدغام", "وجه", "فتحة", "كسرة", "ضمة", "yamudda"]
)

# 57 (PDF #49)
add_item(
    57, *CH4, 49,
    "٤٩- مضاعف فعللرك امر حاضرنده قاچ وجه واردر؟",
    """<div class="ans-block">
<p class="ans-p">مضاعف فعللرك امر حاضرنده بابلرينه كوره وجهلر:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">١ و ٥. بابلر (عين الفعل مضموم)</span>
    <span class="v-grid-desc">دورت وجه جائزدر (اوچى ادغام، برى اظهار)</span>
    <span class="v-grid-val">مُدَّ، مُدِّ، مُدُّ، اُُمْدُدْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">٢، ٤. بابلر و ثلاثى غيريسى</span>
    <span class="v-grid-desc">اوچ وجه جائزدر (ايكيسى ادغام، برى اظهار)</span>
    <span class="v-grid-val">فِرَّ، فِرِّ، اِفْرِرْ | عَضَّ، عَضِّ، اِعْضَضْ | أَحِبَّ، أَحِبِّ، أَحْبِبْ</span>
  </div>
</div>
</div>""",
    "57. (Soal No. 49 Hal. 2) Ada berapa wajah bacaan pada Fi'il Amar Hadhir fi'il mudha'af?",
    """<div class="ans-block">
<p class="ans-p">Pada shighat Amar Hadhir fi'il mudha'af, jumlah wajah bacaan tergantung pada babnya:</p>
<div class="v-grid-2">
  <div class="v-grid-card">
    <span class="v-grid-label">Bab 1 & Bab 5 ('Ain Mudhari' Dhammah)</span>
    <span class="v-grid-desc">Boleh 4 wajah bacaan (3 wajah idgham + 1 izhhar)</span>
    <span class="v-grid-val">مُدَّ، مُدِّ، مُدُّ، اُُمْدُدْ</span>
  </div>
  <div class="v-grid-card">
    <span class="v-grid-label">Bab 2, Bab 4, dan Selain Tsulatsi</span>
    <span class="v-grid-desc">Boleh 3 wajah bacaan (2 wajah idgham + 1 izhhar)</span>
    <span class="v-grid-val">فِرَّ، فِرِّ، اِفْرِرْ | عَضَّ، عَضِّ، اِعْضَضْ | أَحِبَّ، أَحِبِّ، أَحْبِبْ</span>
  </div>
</div>
</div>""",
    "اُُمْدُدْ", "tergantung", ["مضاعف", "امر", "حاضر", "مد", "امدد", "mudhaaf", "amar"]
)

# 58 (PDF #50)
add_item(
    58, *CH4, 50,
    "٥٠- مهموزك قاعده لرى نه لردر؟",
    """<div class="ans-block">
<p class="ans-p">مهموزك اوچ اصلى قاعده سى واردر:</p>
<div class="v-tree">
  <div class="v-tree-root">قواعد المهموز</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">١. همزه ساكن، ماقبلى حركه لى</span>
      <span class="v-node-desc">حالى اوزره بوراAlternative اولارق ماقبلنك حركه سنه كوره قلب جائزدر؛ ماقبلى ده همزه ايسه قلب واجبدر</span>
      <span class="v-node-ex">يَأْكُلُ -> يَاكُلُ | آمَنَ (اصل: أَأْمَنَ)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٢. همزه حركه لى، ماقبلى حركه لى</span>
      <span class="v-node-desc">همزه دكيشمز، حالى اوزره قالير</span>
      <span class="v-node-ex">قَرَأَ، سَأَلَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">٣. همزه حركه لى، ماقبلى ساكن</span>
      <span class="v-node-desc">همزه نك حركه سى ماقبلنه نقل اولونابيلير</span>
      <span class="v-node-ex">سَلْ (اصلنده: اِسْأَلْ)</span>
    </div>
  </div>
</div>
<div class="v-badge-note">قاعده ديشى امرلر: أَخَذَ، أَكَلَ، أَمَرَ فعللرينك امر حاضرى كثرت استعمال سببيyle قياسه مخالف اولارق: خُذْ، كُلْ، مُرْ شكلنده كلير.</div>
</div>""",
    "58. (Soal No. 50 Hal. 2) Apakah kaidah-kaidah fi'il mahmuz?",
    """<div class="ans-block">
<p class="ans-p">Terdapat 3 kaidah pokok fi'il mahmuz:</p>
<div class="v-tree">
  <div class="v-tree-root">Kaidah Pokok Mahmuz</div>
  <div class="v-tree-stem"></div>
  <div class="v-tree-branches">
    <div class="v-tree-branch">
      <span class="v-node-title">1. Hamzah Sukun Setelah Huruf Berharakat</span>
      <span class="v-node-desc">Boleh dibiarkan atau ditukar huruf mad sesuai harakat sebelumnya. Jika huruf sebelumnya juga hamzah, wajib ditukar</span>
      <span class="v-node-ex">يَأْكُلُ -> يَاكُلُ | آمَنَ (asal: أَأْمَنَ)</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">2. Hamzah Berharakat Setelah Huruf Berharakat</span>
      <span class="v-node-desc">Hamzah tetap pada asalnya tanpa mengalami perubahan</span>
      <span class="v-node-ex">قَرَأَ، سَأَلَ</span>
    </div>
    <div class="v-tree-branch">
      <span class="v-node-title">3. Hamzah Berharakat Setelah Huruf Sukun</span>
      <span class="v-node-desc">Boleh memindahkan harakat hamzah ke huruf sukun sebelumnya</span>
      <span class="v-node-ex">سَلْ (asal: اِسْأَلْ)</span>
    </div>
  </div>
</div>
<div class="v-badge-note">Bentuk Amar Khusus: Pada fi'il أَخَذَ, أَكَلَ, dan أَمَرَ, amar hadhir-nya menyalahi qiyas karena saking seringnya digunakan: خُذْ, كُلْ, dan مُرْ (bukan اُؤْخُذْ).</div>
</div>""",
    "يَاكُلُ", "dibiarkan", ["مهموز", "همزة", "أخذ", "أكل", "أمر", "خذ", "mahmuz", "kaidah"]
)

print(f"Total items generated: {len(maksud_items)}")

# Output to src/data/maksud.js
header = """/**
 * Kitab Al-Maqshud (Sarf) Dataset
 * 58 Classical Q&A Items (Osmanlıca & Santri Indonesian)
 * Extracted from Kitab Al-Maqshud questions with comprehensive answers & visual explanations.
 * Zero emojis - 100% Bilingual
 */

export const maksudData = """

js_code = header + json.dumps(maksud_items, ensure_ascii=False, indent=2) + ";\n"

with open("/Users/sp/Documents/Soru cevap sitesi/src/data/maksud.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Successfully written to src/data/maksud.js")
