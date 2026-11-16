"""Munta el web «Atles de l'habitatge» a partir de les pàgines existents.

Entrades (src/):
- leon/, bcn_mapes/: pàgines del tipus «Data» (page.html, datasets/*.json, assets/*).
- La pàgina de concentració del lloguer es llegeix directament de ../concentracio/pagina
  i ../concentracio/dades, per no tenir-ne dues còpies.
- catalunya/page.html: el mapa 3D, una pàgina normal amb les dades dins.
- capitals/: les fitxes de les 52 capitals (vegeu importa_capitals.py).

Sortida (dist/): index.html i data/<pàgina>/<dataset>.<ext>.
- dist/index.html és per a claude.ai, que hi afegeix la capçalera HTML.
- Amb --pages DIR, a més, escriu a DIR una versió autònoma (amb <!doctype>, <head> i
  .nojekyll) per servir des de GitHub Pages o qualsevol servidor estàtic.

Ús:
    python3 -I web/build.py
    python3 -I web/build.py --pages _site
"""

import argparse
import json
import re
import shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SRC = AQUI / "src"
CONC = AQUI.parent / "concentracio"
DIST = AQUI / "dist"


def split_data_page(html):
    html = html.replace('<meta name="dash-one-writer">', "")
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)
    scripts = re.findall(r"<script[^>]*>(.*?)</script>", html, re.S)
    body = re.sub(r"<style[^>]*>.*?</style>|<script[^>]*>.*?</script>", "", html, flags=re.S)
    return "\n".join(styles), scripts, body.strip()


def page_js(key, scripts, sources):
    parts = [f"SITE.pages[{json.dumps(key)}] = {{\n  sources: {json.dumps(sources, ensure_ascii=False)},\n  run: function (dash) {{"]
    for s in scripts:
        parts.append("(function () {\n" + s.strip("\n") + "\n})();")
    parts.append("  },\n};")
    js = "\n".join(parts)
    assert "</script" not in js.lower(), key
    return js


def sources_from_datasets(key, folder):
    """Copia els fitxers d'un tipus «Data» i retorna {dataset: {url, format}}."""
    out = {}
    for f in sorted((folder / "datasets").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        d = d.get("data", d)
        s = d["source"]
        assert s["kind"] == "file", (key, f.name)
        asset_id = s["url"].split("/_blob/")[1]
        src = next((folder / "assets").glob(asset_id + ".*"))
        dst = DIST / "data" / key / (f.stem + src.suffix)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        out[f.stem] = {"url": f"data/{key}/{dst.name}", "format": s["format"]}
    return out


def parse_css_blocks(css):
    blocks, i, n = [], 0, len(css)
    while i < n:
        m = re.match(r"\s+|/\*.*?\*/", css[i:], re.S)
        if m:
            i += m.end()
            continue
        j = css.find("{", i)
        if j < 0:
            break
        head = css[i:j].strip()
        depth, k = 0, j
        while k < n:
            if css[k] == "{":
                depth += 1
            elif css[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        blocks.append((head, css[j + 1:k]))
        i = k + 1
    return blocks


def scope_css(css, prefix, stage):
    """Prefixa els selectors amb `prefix`. Deixa :root (variables) com està."""
    def emit(blocks):
        out = []
        for head, body in blocks:
            if head.startswith("@media") or head.startswith("@supports"):
                out.append(head + " {\n" + emit(parse_css_blocks(body)) + "\n}")
            elif head.startswith("@"):
                out.append(head + " {" + body + "}")
            else:
                sels = []
                if all(x.strip() in ("html", "body") for x in head.split(",")):
                    # L'escenari ja té l'alçada que li toca dins del web.
                    body = re.sub(r"(?<![-\w])height\s*:\s*[^;}]+;?", "", body)
                for s in (x.strip() for x in head.split(",")):
                    if s.startswith(":root"):
                        sels.append(s)
                    elif s in ("html", "body"):
                        sels.append(f"{prefix} {stage}")
                    else:
                        sels.append(f"{prefix} {s}")
                out.append(", ".join(dict.fromkeys(sels)) + " {" + body + "}")
        return "\n".join(out)
    return emit(parse_css_blocks(css))


def build_catalunya():
    html = (SRC / "catalunya" / "page.html").read_text(encoding="utf-8")
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)
    scripts = re.findall(r"<script[^>]*>(.*?)</script>", html, re.S)
    data_script = next(s for s in scripts if s.lstrip().startswith("{"))
    code = next(s for s in scripts if "JSON.parse(document.getElementById('data').textContent)" in s)
    # El primer <style> és el reset de la plantilla d'artefacte; el segon, el del mapa.
    css = scope_css(styles[-1], "#pg-catalunya", ".cat-stage")
    body = re.sub(r"<script[^>]*>.*?</script>|<style[^>]*>.*?</style>", "", html, flags=re.S)
    start = body.index('<div id="app">')
    markup = body[start:].replace("</body>", "").replace("</html>", "").strip()
    code = code.replace("JSON.parse(document.getElementById('data').textContent)", "window.__CAT_DATA__")
    js = "window.initCatalunya = function () {\n" + code.strip("\n") + "\n};"
    assert "</script" not in js.lower()
    out = DIST / "data" / "catalunya.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    json.loads(data_script)
    out.write_text(data_script.strip(), encoding="utf-8")
    return css, markup, js


HEAD = (
    '<!doctype html>\n<html lang="ca">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);'
    'padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}'
    '[hidden]{display:none!important}</style>\n'
)


def standalone(shell, out):
    """Versió autònoma: el que hi ha abans de la barra superior va al <head>."""
    i = shell.index('<header class="site-top">')
    html = HEAD + shell[:i].strip() + "\n</head>\n<body>\n" + shell[i:].strip() + "\n</body>\n</html>\n"
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(DIST / "data", out / "data")
    (out / "index.html").write_text(html, encoding="utf-8")
    (out / ".nojekyll").write_text("", encoding="utf-8")
    print(f"versió autònoma -> {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pages", type=Path, help="carpeta on escriure la versió autònoma")
    args = ap.parse_args()
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shell = (AQUI / "shell.html").read_text(encoding="utf-8")
    css_parts, js_parts = [], []

    # León
    css, scripts, body = split_data_page((SRC / "leon" / "page.html").read_text(encoding="utf-8"))
    css_parts.append(css)
    js_parts.append(page_js("leon", scripts, sources_from_datasets("leon", SRC / "leon")))
    body = body.replace("Cada cifra lleva a su fuente en «Fuentes».", "La fuente de cada gráfico está debajo de él.")
    shell = shell.replace("<!--__LEON__-->", body)

    # Barcelona: propietat per barris (pàgina antiga)
    css, scripts, body = split_data_page((SRC / "bcn_mapes" / "page.html").read_text(encoding="utf-8"))
    body = body.replace('id="cabecera"', 'id="bc-cabecera"').replace('id="notas"', 'id="bc-notas"')
    css_parts.append(css)
    js_parts.append(page_js("bcn_mapes", scripts, sources_from_datasets("bcn_mapes", SRC / "bcn_mapes")))
    shell = shell.replace("<!--__BCN_MAPES__-->", body)

    # Barcelona: concentració del lloguer
    css, scripts, body = split_data_page((CONC / "pagina" / "index.html").read_text(encoding="utf-8"))
    files = {"lloguer_ciutat": ("ohb_lloguer_ciutat_2023.csv", "csv"), "grups": ("grups_lloguer_bcn.json", "json"),
             "ohb_barris": ("ohb_2025_barris.csv", "csv"), "cadastre": ("cadastre_propietaris_barri.json", "json"),
             "panell": ("panell_barris.json", "json"), "p3": ("p3_estudi_esdeveniment.json", "json"),
             "p4": ("p4_coeficients.json", "json")}
    sources = {}
    for k, (name, fmt) in files.items():
        dst = DIST / "data" / "bcn_lloguer" / name
        dst.parent.mkdir(parents=True, exist_ok=True)
        origen = CONC / ("dades" if name.endswith(".csv") else "pagina") / name
        shutil.copyfile(origen, dst)
        sources[k] = {"url": f"data/bcn_lloguer/{name}", "format": fmt}
    css_parts.append(css)
    js_parts.append(page_js("bcn_lloguer", scripts, sources))
    body = body.replace("Cada xifra porta a la seva font al panell de fonts.", "La font de cada gràfic és a sota.")
    shell = shell.replace("<!--__BCN_LLOGUER__-->", body)

    # Fitxes de ciutat: una per capital, generades amb vivienda_capitales (importa_capitals.py)
    shutil.copytree(SRC / "capitals", DIST / "data" / "capitals")

    # Catalunya
    css, markup, js = build_catalunya()
    css_parts.append(css)
    js_parts.append(js)
    shell = shell.replace("<!--__CATALUNYA__-->", markup)

    shell = shell.replace("/*__PAGE_CSS__*/", "\n".join(css_parts))
    shell = shell.replace("/*__PAGE_JS__*/", "\n\n".join(js_parts))
    for marker in ["<!--__", "/*__PAGE"]:
        assert marker not in shell, marker

    ids = re.findall(r'\sid="([^"]+)"', re.sub(r"<script.*?</script>", "", shell, flags=re.S))
    dup = sorted({i for i in ids if ids.count(i) > 1})
    assert not dup, dup

    (DIST / "index.html").write_text(shell, encoding="utf-8")
    total = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    print(f"index.html {len(shell) / 1024:.0f} KB, {len(list(DIST.rglob('*.*')))} fitxers, {total / 1024 / 1024:.1f} MB")
    if args.pages:
        standalone(shell, args.pages.resolve())


if __name__ == "__main__":
    main()
