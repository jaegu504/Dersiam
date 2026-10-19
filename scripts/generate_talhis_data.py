import json
import re

with open(".temp_sources/talhis_extracted.json", "r", encoding="utf-8") as f:
    raw_items = json.load(f)

talhis_chapters = {
    "مقدمه": {"id": "mukaddime", "tr": "مقدمه", "id_name": "Mukaddimah (Fashahah & Balaghah)"},
    "۱. فن؛ علمِ معانى": {"id": "ilm-maani", "tr": "علمِ معانى", "id_name": "Fan 1: Pengantar Ilmu Ma'ani"},
    "احوالِ اسنادِ خبرى": {"id": "isnad-khabari", "tr": "احوالِ اسنادِ خبرى", "id_name": "Ahwal Isnad Khabari"},
    "احوالِ مسند اليه": {"id": "musnad-ilaih", "tr": "احوالِ مسند اليه", "id_name": "Ahwal Musnad Ilaih"},
    "احوال مسند": {"id": "musnad", "tr": "احوال مسند", "id_name": "Ahwal Musnad"},
    "اَحوالِ متعلِّقات الفعل": {"id": "mutaallaqat-fil", "tr": "اَحوالِ متعلِّقات الفعل", "id_name": "Ahwal Muta'allaqat al-Fi'l"},
    "قصر": {"id": "qashr", "tr": "قصر", "id_name": "Al-Qashr (Pengkhususan)"},
    "إنشاء": {"id": "insya", "tr": "إنشاء", "id_name": "Al-Insya' (Kalimat Non-Khabar)"},
    "فصل، وصل": {"id": "fashl-washl", "tr": "فصل، وصل", "id_name": "Al-Fashl wal Washl"},
    "ايجاز، اطناب، مساوات": {"id": "ijaz-ithnab", "tr": "ايجاز، اطناب، مساوات", "id_name": "Al-Ijaz, Al-Ithnab & Al-Musawat"}
}

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

from talhis_translations import get_talhis_translation

items = []
for i, item in enumerate(raw_items):
    ch_raw = item.get("chapter", "")
    ch_info = talhis_chapters.get(ch_raw, {"id": "talhis-bab", "tr": ch_raw, "id_name": ch_raw})
    
    q_tr = item.get("question", "")
    a_tr = item.get("answer", "")
    orig_num = i + 1
    
    q_id, a_id = get_talhis_translation(i + 1, q_tr, a_tr)
    
    cloze_tr = pick_cloze(a_tr, osm_stopwords)
    cloze_id = pick_cloze(a_id, ind_stopwords)
    
    kw_tr = [w for w in clean_words(q_tr + " " + a_tr) if len(w) >= 3 and w not in osm_stopwords][:6]
    kw_id = [w for w in clean_words(q_id + " " + a_id) if len(w) >= 3 and w.lower() not in ind_stopwords][:6]
    keywords = list(dict.fromkeys(kw_tr + kw_id))
    
    items.append({
        "id": f"talhis-{str(i + 1).zfill(3)}",
        "bookKey": "talhis",
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
 * Talkhis al-Miftah (Balaghah) Dataset
 * 144 Classical Q&A Items (Osmanlıca & Santri Indonesian)
 * Zero emojis - 100% Bilingual
 */

export const talhisData = {json.dumps(items, ensure_ascii=False, indent=2)};
"""

with open("src/data/talhis.js", "w", encoding="utf-8") as f:
    f.write(output_code)

print(f"talhis.js generated successfully with {len(items)} items.")
