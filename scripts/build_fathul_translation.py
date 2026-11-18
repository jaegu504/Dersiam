"""Merge scripts/fathul/translation/{sample.json,pages/*.json} into src/data/fathul/translation-id.json,
and turn the RAGU bullets of CHECK-LOG.md into src/data/fathul/ragu.json ({hlm: {field: [line, ...]}}).

Fails if any corpus page is missing, duplicated, or has a line count that differs from the Arabic.
Run: python3 scripts/build_fathul_translation.py
"""
import json
import re
import sys
from pathlib import Path

ARABIC_LETTER = re.compile(r"[\u0621-\u064A]")
ROOT = Path(__file__).resolve().parents[1]
TR = ROOT / "scripts/fathul/translation"
sys.path.insert(0, str(TR))
from check_page_file import FIELDS, problems  # noqa: E402


def main():
    corpus = json.loads((ROOT / "src/data/fathul/corpus.json").read_text())["pages"]
    merged, errors = {}, []
    for f in [TR / "sample.json", *sorted((TR / "pages").glob("*.json"))]:
        for hlm, page in json.loads(f.read_text()).items():
            if hlm in merged:
                errors.append(f"hlm {hlm} appears twice ({f.name})")
            merged[hlm] = {k: page.get(k) for k in FIELDS}
    errors += problems(merged, corpus)
    missing = sorted(set(corpus) - set(merged), key=int)
    if missing:
        errors.append(f"{len(missing)} pages missing: {missing[:20]}{' ...' if len(missing) > 20 else ''}")
    if errors:
        sys.exit("translation export failed:\n" + "\n".join(errors))
    # Arabic lines that are only page filler (٠٠٠, ...) get no translation line in the UI.
    for h, page in merged.items():
        for k in FIELDS:
            page[k] = [t if ARABIC_LETTER.search(a) else "" for a, t in zip(corpus[h][k], page[k])]
    out = {h: merged[h] for h in sorted(merged, key=int)}
    (ROOT / "src/data/fathul/translation-id.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote translation-id.json: {len(out)} pages")

    ragu = ragu_lines((TR / "CHECK-LOG.md").read_text(), corpus)
    (ROOT / "src/data/fathul/ragu.json").write_text(json.dumps(ragu, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote ragu.json: {sum(len(v) for p in ragu.values() for v in p.values())} uncertain lines")


RAGU_REF = re.compile(r"hlm (\d+) (matn|syarah|footnotes)\[(\d+)(?:-(\d+))?\]")


def ragu_lines(log, corpus):
    """Lines the meaning check marked RAGU; bullets without a line index (style notes) are skipped."""
    out = {}
    for bullet in re.findall(r"^\s*-\s*\**RAGU.*$", log, re.M):
        for hlm, field, a, b in RAGU_REF.findall(bullet):
            for i in range(int(a), int(b or a) + 1):
                if i >= len(corpus[hlm][field]):
                    sys.exit(f"RAGU points past the Arabic: hlm {hlm} {field}[{i}]")
                lines = out.setdefault(hlm, {}).setdefault(field, [])
                if i not in lines:
                    lines.append(i)
    return {h: {f: sorted(v) for f, v in p.items()} for h, p in sorted(out.items(), key=lambda kv: int(kv[0]))}


if __name__ == "__main__":
    main()
