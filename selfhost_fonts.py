#!/usr/bin/env python3
"""Self-host the Google Fonts used by the site (no more requests to Google).

Run once from the site folder, with internet access:
    python3 tools/selfhost_fonts.py

It downloads the .woff2 files into fonts/, writes fonts.css, swaps the Google
<link> tags in every page for <link rel="stylesheet" href="fonts.css">, and
removes the "Google Fonts" line from privacy.html. Safe to run twice.
"""
import re, sys, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS_URL = ("https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800"
           "&family=Outfit:wght@400;500;600&family=DM+Sans:wght@400;500;700&display=swap")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
KEEP = {"latin", "latin-ext"}  # enough for English and Afrikaans


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def build(css, download):
    """Return rewritten CSS. `download(url, filename)` fetches each font file."""
    out = []
    for subset, block in re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S):
        if subset not in KEEP:
            continue
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        name = "%s-%s-%s.woff2" % (family.lower().replace(" ", "-"), weight, subset)
        download(url, name)
        out.append(block.replace(url, "fonts/" + name))
    return "\n".join(out) + "\n"


def rewrite_html():
    link = '<link rel="stylesheet" href="fonts.css">'
    for p in ROOT.glob("*.html"):
        s = p.read_text(encoding="utf-8")
        o = s
        s = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>', "", s)
        if "fonts.googleapis.com/css2" in s:
            s = re.sub(r'<link href="https://fonts\.googleapis\.com/css2[^"]*" rel="stylesheet">', link, s)
        if p.name == "privacy.html":
            s = re.sub(r"\s*<li><strong>Google Fonts\.</strong>.*?</li>", "", s, flags=re.S)
        if s != o:
            p.write_text(s, encoding="utf-8")
            print("updated", p.name)


def main():
    (ROOT / "fonts").mkdir(exist_ok=True)

    def download(url, name):
        dest = ROOT / "fonts" / name
        if not dest.exists():
            dest.write_bytes(get(url))
            print("downloaded", name)

    css = build(get(CSS_URL).decode("utf-8"), download)
    (ROOT / "fonts.css").write_text("/* Self-hosted Manrope, Outfit and DM Sans */\n" + css, encoding="utf-8")
    rewrite_html()
    print("Done. Commit fonts/ and fonts.css, then reload the site.")


def selftest():
    sample = ("/* latin-ext */\n@font-face {\n  font-family: 'Outfit';\n  font-style: normal;\n  font-weight: 400;\n"
              "  src: url(https://fonts.gstatic.com/s/outfit/v11/abc.woff2) format('woff2');\n}\n"
              "/* vietnamese */\n@font-face {\n  font-family: 'Outfit';\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/outfit/v11/viet.woff2) format('woff2');\n}\n"
              "/* latin */\n@font-face {\n  font-family: 'DM Sans';\n  font-weight: 700;\n  src: url(https://fonts.gstatic.com/s/dmsans/v1/def.woff2) format('woff2');\n}\n")
    got = []
    res = build(sample, lambda u, n: got.append(n))
    assert got == ["outfit-400-latin-ext.woff2", "dm-sans-700-latin.woff2"], got
    assert "fonts/dm-sans-700-latin.woff2" in res and "gstatic" not in res
    print("selftest ok")


if __name__ == "__main__":
    selftest() if "--selftest" in sys.argv else main()
