"""Export the Fathul Mu'in map into Dersiam data files.

Reads the map built in the Fathul Muin folder:
  fathul-muin.txt          full text, pages "===== [hlm N | cetak M] ====="
  kitab/NN-<bab>/NN-<fasal>.md
                           "### <Indonesian> | <Arabic>" topics with
                           "> hlm N · kata kunci: ..." and "> ringkas: ..."
Writes:
  src/data/fathul/corpus.json     chapters, topics, pages
  src/data/fathul/questions.json  Dersiam question items (with --questions)
  src/data/fathul/meta.js         small static counts for the home card
  scripts/fathul/report.txt       topics whose ibarah was not found on its page

Usage (from the repo root):
  python3 -I scripts/build_fathul_data.py --source "/Users/sp/Documents/Fathul Muin" [--questions]
"""
import argparse
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO, "src", "data", "fathul")
QUESTIONS_DIR = os.path.join(REPO, "scripts", "fathul", "questions")
REPORT = os.path.join(REPO, "scripts", "fathul", "report.txt")

CHAPTER_NAMES_ID = {
    "01": "Mukadimah",
    "02": "Shalat",
    "03": "Zakat",
    "04": "Puasa",
    "05": "Haji dan Umrah",
    "06": "Jual Beli",
    "07": "Nikah",
    "08": "Jinayah",
    "09": "Riddah",
    "10": "Hudud",
    "11": "Jihad",
    "12": "Qadha",
    "13": "Dakwa dan Bayyinah",
    "14": "I'taq",
}

PAGE_RE = re.compile(r"^===== \[hlm (\d+) \| cetak (\d+)\] =====$", re.M)
TOPIC_RE = re.compile(r"^### (.+?) \| (.+)$")
META_RE = re.compile(r"^> hlm (\d+) · kata kunci: (.*)$")
RINGKAS_RE = re.compile(r"^> ringkas: (.*)$")

HARAKAT = re.compile(r"[ً-ٰٟـ]")
NON_ARABIC = re.compile(r"[^؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿0-9٠-٩۰-۹\s]")
PUNCT = re.compile(r"[،؛؟٪٫٬«»\.,:;!'\"\(\)\[\]\{\}/\\<>\-_+=*&^%$#@~`|]")
ARABIC_WORD = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+")


def normalize_arabic(text):
    """Same rules as normalizeArabic in src/services/search.js."""
    text = HARAKAT.sub("", text)
    text = re.sub("[أإآٱ]", "ا", text)
    text = re.sub("[ةۀ]", "ه", text)
    text = re.sub("[ىی]", "ي", text)
    text = text.replace("ک", "ك").replace("ؤ", "و")
    text = re.sub("[ءـ]", "", text)
    text = PUNCT.sub(" ", text)
    text = NON_ARABIC.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_pages(path):
    raw = open(path, encoding="utf-8").read()
    marks = list(PAGE_RE.finditer(raw))
    pages = {}
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(raw)
        lines = [l.strip() for l in raw[m.end():end].split("\n")]
        lines = [l for l in lines if l]
        matn, syarah, footnotes = [], [], []
        if "ــ" in lines:
            cut = lines.index("ــ")
            matn, body = lines[:cut], lines[cut + 1:]
        else:
            body = lines
        target = syarah
        for l in body:
            if re.fullmatch(r"_{5,}", l):
                target = footnotes
                continue
            target.append(l)
        hlm = int(m.group(1))
        pages[hlm] = {"hlm": hlm, "cetak": int(m.group(2)), "matn": matn, "syarah": syarah, "footnotes": footnotes}
    return pages


def fragments(ibarah):
    out = []
    for line in ibarah.split("\n"):
        for part in re.split(r"\.\.\.|…", line):
            n = normalize_arabic(part)
            if len(n) >= 8:
                out.append(n)
    return out


def find_anchor(ibarah, hlm, pages, norm_cache):
    frags = fragments(ibarah)
    for frag in frags:
        for h in (hlm, hlm + 1):
            for i, para in enumerate(norm_cache.get(h, {}).get("syarah", [])):
                if frag in para:
                    return {"hlm": h, "para": i}
    for frag in frags:
        for h in (hlm, hlm + 1):
            if any(frag in p for p in norm_cache.get(h, {}).get("matn", [])):
                return {"hlm": h, "para": 0 if pages[h]["syarah"] else -1}
    return None


def parse_topics(kitab_dir, pages):
    norm_cache = {h: {"syarah": [normalize_arabic(p) for p in pg["syarah"]], "matn": [normalize_arabic(p) for p in pg["matn"]]} for h, pg in pages.items()}
    chapters, topics, unanchored = [], [], []
    for chap_dir in sorted(glob.glob(os.path.join(kitab_dir, "*"))):
        if not os.path.isdir(chap_dir):
            continue
        cname = os.path.basename(chap_dir)
        cid = cname[:2]
        chapter = {"id": cid, "nameAr": cname[3:], "nameId": CHAPTER_NAMES_ID[cid], "fasals": []}
        for fpath in sorted(glob.glob(os.path.join(chap_dir, "*.md"))):
            fname = os.path.basename(fpath)[:-3]
            fasal = {"id": f"{cid}-{fname[:2]}", "nameAr": fname[3:], "topicIds": []}
            current = None

            pending = []  # back-to-back headings share the passage that follows them

            def close(t):
                t["ibarah"] = "\n".join(t.pop("_lines")).strip()
                t.pop("_in_footnote", None)
                if not t["ibarah"]:
                    pending.append(t)
                    return
                for u in pending + [t]:
                    u["ibarah"] = t["ibarah"]
                    u["anchor"] = find_anchor(u["ibarah"], u["hlm"], pages, norm_cache)
                    if u["anchor"] is None:
                        unanchored.append(u)
                pending.clear()

            for line in open(fpath, encoding="utf-8").read().split("\n"):
                line = line.rstrip()
                m = TOPIC_RE.match(line)
                if m or line.startswith("#"):
                    if current:
                        close(current)
                        current = None
                    if m:
                        tid = f"fm-{len(topics) + 1:04d}"
                        current = {"id": tid, "chapterId": cid, "fasalId": fasal["id"], "titleId": m.group(1).strip(), "titleAr": m.group(2).strip(), "hlm": None, "cetak": None, "keywords": [], "ringkas": "", "_lines": []}
                        topics.append(current)
                        fasal["topicIds"].append(tid)
                    continue
                if not current:
                    continue
                mm = META_RE.match(line)
                if mm:
                    current["hlm"] = int(mm.group(1))
                    current["cetak"] = pages[current["hlm"]]["cetak"]
                    current["keywords"] = [k.strip() for k in mm.group(2).split(",") if k.strip()]
                    continue
                mr = RINGKAS_RE.match(line)
                if mr:
                    current["ringkas"] = mr.group(1).strip()
                    continue
                s = line.strip()
                if re.fullmatch(r"_{5,}", s):
                    current["_in_footnote"] = True  # footnotes run to the next heading
                if s and s != "ــ" and not current.get("_in_footnote"):
                    current["_lines"].append(s)
            if current:
                close(current)
            chapter["fasals"].append(fasal)
        chapters.append(chapter)
    return chapters, topics, unanchored


CLOZE_STOP = {normalize_arabic(w) for w in "من إلى على في عن بعد قبل مع أو ثم هو هي إن أن لا ما كان قال ذلك هذا التي الذي حتى مرة كل غير بين عند لو إذا".split()}


def arabic_words(text):
    # ARABIC_WORD also matches Arabic punctuation (، ؛ ؟); strip it from the edges
    return [w.strip("،؛؟٪٫٬«»") for w in ARABIC_WORD.findall(text) if w.strip("،؛؟٪٫٬«»")]


def cloze_word(topic):
    def usable(w):
        n = normalize_arabic(w)
        return len(n) >= 3 and n not in CLOZE_STOP and not n.isdigit()

    title_words = {normalize_arabic(w) for w in arabic_words(topic["titleAr"])}
    words = [w for w in arabic_words(topic["ibarah"]) if usable(w)]
    for w in words:
        if normalize_arabic(w) in title_words:
            return w
    first_line = [w for w in arabic_words(topic["ibarah"].split("\n")[0]) if usable(w)] or words
    return max(first_line, key=lambda w: len(normalize_arabic(w)))


def build_questions(topics, chapters):
    authored = {}
    for path in sorted(glob.glob(os.path.join(QUESTIONS_DIR, "*.json"))):
        for row in json.load(open(path, encoding="utf-8")):
            if row["topicId"] in authored:
                sys.exit(f"duplicate question for {row['topicId']} in {path}")
            authored[row["topicId"]] = row["question"].strip()
    by_chapter = {c["id"]: c for c in chapters}
    items = []
    for n, t in enumerate(topics, 1):
        q = authored.get(t["id"])
        if not q:
            continue
        c = by_chapter[t["chapterId"]]
        ibarah_html = t["ibarah"].replace("\n", "<br>")
        answer = f"{t['ringkas']}<br><span lang='ar' dir='rtl'>{ibarah_html}</span><br><small>Fathul Mu'in hlm {t['hlm']} · cetak {t['cetak']}</small>"
        cloze = cloze_word(t)
        items.append({
            "id": f"fathul-{n:04d}", "bookKey": "fathul", "chapterId": t["chapterId"],
            "chapterNameTr": c["nameAr"], "chapterNameId": c["nameId"], "originalNumber": n,
            "question_id": q, "answer_id": answer, "question_tr": q, "answer_tr": answer,
            "clozeKeyWord_id": cloze, "clozeKeyWord_tr": cloze,
            "keywords": ",".join(t["keywords"]), "topicId": t["id"], "hlm": t["hlm"],
        })
    unknown = set(authored) - {t["id"] for t in topics}
    if unknown:
        sys.exit(f"questions for unknown topics: {sorted(unknown)[:5]}")
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True)
    ap.add_argument("--questions", action="store_true")
    args = ap.parse_args()

    pages = parse_pages(os.path.join(args.source, "fathul-muin.txt"))
    chapters, topics, unanchored = parse_topics(os.path.join(args.source, "kitab"), pages)
    missing = [t["id"] for t in topics if t["hlm"] is None or not t["ringkas"] or not t["ibarah"]]
    if missing:
        sys.exit(f"topics missing hlm/ringkas/ibarah: {missing[:10]}")

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    corpus = {"chapters": chapters, "topics": topics, "pages": {str(h): pages[h] for h in sorted(pages)}}
    json.dump(corpus, open(os.path.join(OUT_DIR, "corpus.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

    qpath = os.path.join(OUT_DIR, "questions.json")
    if args.questions:
        questions = build_questions(topics, chapters)
        json.dump(questions, open(qpath, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    total_questions = len(json.load(open(qpath, encoding="utf-8"))) if os.path.exists(qpath) else 0

    with open(os.path.join(OUT_DIR, "meta.js"), "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_fathul_data.py. Do not edit.\n")
        f.write(f"export const fathulMeta = {{ totalTopics: {len(topics)}, totalPages: {len(pages)}, totalChapters: {len(chapters)}, totalQuestions: {total_questions} }};\n")

    with open(REPORT, "w", encoding="utf-8") as f:
        f.write(f"# Topics whose ibarah was not found on hlm or hlm+1 ({len(unanchored)})\n")
        for t in unanchored:
            f.write(f"{t['id']}\thlm {t['hlm']}\t{t['titleId']}\n")

    print(f"topics {len(topics)}, pages {len(pages)}, chapters {len(chapters)}, anchored {len(topics) - len(unanchored)}, unanchored {len(unanchored)}, questions {total_questions} / {len(topics)}")


if __name__ == "__main__":
    main()
