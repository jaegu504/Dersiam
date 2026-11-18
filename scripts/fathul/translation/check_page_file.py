"""Check a translation page file against the corpus: python3 check_page_file.py pages/<first>-<last>.json"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FIELDS = ("matn", "syarah", "footnotes")


def problems(tr, corpus):
    out = []
    for hlm, page in tr.items():
        src = corpus.get(hlm)
        if src is None:
            out.append(f"hlm {hlm}: not in corpus")
            continue
        for f in FIELDS:
            got = page.get(f)
            if not isinstance(got, list) or len(got) != len(src[f]):
                out.append(f"hlm {hlm} {f}: {len(got) if isinstance(got, list) else got!r} lines, Arabic has {len(src[f])}")
            elif any(not isinstance(x, str) or not x.strip() for x in got):
                out.append(f"hlm {hlm} {f}: empty line")
    return out


if __name__ == "__main__":
    corpus = json.loads((ROOT / "src/data/fathul/corpus.json").read_text())["pages"]
    path = Path(sys.argv[1])
    tr = json.loads(path.read_text())
    if path.stem.count("-") == 1:
        a, b = map(int, path.stem.split("-"))
        sample = json.loads((ROOT / "scripts/fathul/translation/sample.json").read_text())
        want = {str(h) for h in range(a, b + 1)} - set(sample)
        if set(tr) != want:
            print("pages missing:", sorted(want - set(tr), key=int), "extra:", sorted(set(tr) - want, key=int))
            sys.exit(1)
    p = problems(tr, corpus)
    print("\n".join(p) or f"OK {len(tr)} pages")
    sys.exit(1 if p else 0)
