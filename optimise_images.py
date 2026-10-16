#!/usr/bin/env python3
"""Create WebP copies of the site images and serve them with a safe fallback.

Run once from the site folder (needs:  pip install pillow):
    python3 tools/optimise_images.py

For every images/*.jpg|jpeg|png it writes a smaller images/<same-name>.webp
(max 1600px wide) and wraps the matching <img> in each page with
<picture><source type="image/webp">...</picture>. The original files stay as
the fallback, so nothing breaks. Safe to run twice.
"""
import re, sys, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX_W, QUALITY = 1600, 80


def convert():
    saved = 0
    for src in sorted((ROOT / "images").glob("*")):
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        dest = src.with_suffix(".webp")
        with Image.open(src) as im:
            if im.width > MAX_W:
                im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
            im.save(dest, "WEBP", quality=QUALITY, method=6)
        saved += src.stat().st_size - dest.stat().st_size
        print("%-28s %6d KB -> %5d KB" % (src.name, src.stat().st_size // 1024, dest.stat().st_size // 1024))
    print("Saved about %d KB in total" % (saved // 1024))


IMG = re.compile(r'<img\b[^>]*\bsrc="(images/[^"]+)\.(?:jpg|jpeg|png)"[^>]*>')


def wrap_html():
    def sub(m):
        if not (ROOT / (m.group(1) + ".webp")).exists():
            return m.group(0)
        return '<picture><source srcset="%s.webp" type="image/webp">%s</picture>' % (m.group(1), m.group(0))

    for p in ROOT.glob("*.html"):
        s = p.read_text(encoding="utf-8")
        out, pos = [], 0
        for m in IMG.finditer(s):
            out.append(s[pos:m.start()])
            out.append(m.group(0) if s[:m.start()].endswith("<picture>") or s[:m.start()].endswith('type="image/webp">') else sub(m))
            pos = m.end()
        out.append(s[pos:])
        new = "".join(out)
        if new != s:
            p.write_text(new, encoding="utf-8")
            print("updated", p.name)


if __name__ == "__main__":
    convert()
    wrap_html()
    print("Done.")
