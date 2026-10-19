import json
import re

with open(".temp_sources/kafiye_extracted.json", "r", encoding="utf-8") as f:
    raw_items = json.load(f)

kafiye_chapters = {
    "كلمه، كلام و اعراب": {"id": "kalimah-kalam-irab", "tr": "كلمه، كلام و اعراب", "id_name": "Kalimah, Kalam & I'rab"},
    "غير منصرف": {"id": "ghair-munsharif", "tr": "غير منصرف", "id_name": "Isim Ghair Munsharif"},
    "مرفوعات": {"id": "marfuat", "tr": "مرفوعات", "id_name": "Marfu'at (Isim-isim Rafa')"},
    "منصوبات": {"id": "manshubat", "tr": "منصوبات", "id_name": "Manshubat (Isim-isim Nashab)"},
    "مجرورات": {"id": "majrurat", "tr": "مجرورات", "id_name": "Majrurat (Isim-isim Jar)"},
    "توابع و مَبْنِيَّات": {"id": "tawabi-mabniyyat", "tr": "توابع و مَبْنِيَّات", "id_name": "Tawabi' & Isim Mabni"},
    "فِعْل": {"id": "fiil", "tr": "فِعْل", "id_name": "Fi'il & Kaidahnya"},
    "حَرْفْلَر و خَاتِمَه": {"id": "huruf-khatimah", "tr": "حَرْفْلَر و خَاتِمَه", "id_name": "Huruf & Khatimah"}
}

osm_stopwords = {"در", "لر", "ايله", "اولان", "بر", "دن", "ده", "كه", "اوچون", "كبى", "ايتمك", "اولور", "ويريلن", "شيدر", "اولوب", "ايدر", "معناسى", "ندر", "هانكى", "كيمدر", "قاچدر"}
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

# Pre-defined Indonesian translations for Kafiyah questions and answers (santri style)
# We will create mapping dictionaries based on question numbers and content
from kafiye_translations import get_kafiye_translation

items = []
for i, item in enumerate(raw_items):
    ch_raw = item.get("chapter", "")
    ch_info = kafiye_chapters.get(ch_raw, {"id": "kafiye-bab", "tr": ch_raw, "id_name": ch_raw})
    
    q_tr = item.get("question", "")
    a_tr = item.get("answer", "")
    
    # Extract original number from question (e.g. ١-, 116-, etc)
    num_match = re.search(r"(\d+|[\u0660-\u0669]+)", q_tr)
    orig_num = i + 1
    
    q_id, a_id = get_kafiye_translation(i + 1, q_tr, a_tr)
    
    cloze_tr = pick_cloze(a_tr, osm_stopwords)
    cloze_id = pick_cloze(a_id, ind_stopwords)
    
    # Generate search keywords
    kw_tr = [w for w in clean_words(q_tr + " " + a_tr) if len(w) >= 3 and w not in osm_stopwords][:6]
    kw_id = [w for w in clean_words(q_id + " " + a_id) if len(w) >= 3 and w.lower() not in ind_stopwords][:6]
    keywords = list(dict.fromkeys(kw_tr + kw_id))
    
    items.append({
        "id": f"kafiye-{str(i + 1).zfill(3)}",
        "bookKey": "kafiye",
        "chapterId": ch_info["id"],
        "chapterNameTr": ch_info["tr"],
        "chapterNameId": ch_info["id_name"],
        "originalNumber": orig_num,
        "question_tr": q_tr,
        "answer_tr": a_tr,
        "question_id": q_id,
        "answer_id": a_id,
        "clozeKeyWord_tr": cloze_tr,
        "clozeKeyWord_id": cloze_id,
        "keywords": keywords
    })

output_code = f"""/**
 * Al-Kafiyah (Nahwu) Dataset
 * 200 Classical Q&A Items (Osmanlıca & Santri Indonesian)
 * Zero emojis - 100% Bilingual
 */

export const kafiyeData = {json.dumps(items, ensure_ascii=False, indent=2)};
"""

with open("src/data/kafiye.js", "w", encoding="utf-8") as f:
    f.write(output_code)

print(f"kafiye.js generated successfully with {len(items)} items.")
