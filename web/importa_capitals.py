"""Importa les sortides del framework vivienda_capitales per a les fitxes de ciutat.

El framework (python ejecutar.py --todas) genera, per a cada capital de província,
salida/<codi>_<nom>/datos.json, i a més salida/resumen_capitales.csv i capitales.csv.

Aquest script copia, sense tocar les dades:
- web/src/capitals/<slug>.json: el datos.json de cada capital.
- web/src/capitals/index.json: llista de capitals (codi, nom, província, comunitat, slug)
  amb el resum de l'últim any.

Ús:
    python3 -I web/importa_capitals.py /ruta/a/vivienda_capitales
"""

import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

AQUI = Path(__file__).resolve().parent
OUT = AQUI / "src" / "capitals"

NUM = {"poblacion", "anio_poblacion", "anio", "compras", "pct_estricta_min", "pct_estricta_max",
       "pct_amplia_min", "pct_amplia_max", "pct_estricta_media_5_anios", "pct_empresas_privadas"}


def slug(text):
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def num(v):
    if v in ("", None):
        return None
    f = float(v)
    return int(f) if f.is_integer() else f


def main():
    base = Path(sys.argv[1])
    salida = base / "salida"
    with (base / "capitales.csv").open(encoding="utf-8") as f:
        caps = {r["codigo"]: r for r in csv.DictReader(f, delimiter=";")}
    with (salida / "resumen_capitales.csv").open(encoding="utf-8") as f:
        res = {r["codigo"]: r for r in csv.DictReader(f)}
    OUT.mkdir(parents=True, exist_ok=True)
    index = []
    for folder in sorted(p for p in salida.iterdir() if p.is_dir()):
        codigo = folder.name.split("_", 1)[0]
        cap = caps[codigo]
        s = slug(cap["capital"])
        datos = json.loads((folder / "datos.json").read_text(encoding="utf-8"))
        (OUT / f"{s}.json").write_text(json.dumps(datos, ensure_ascii=False, separators=(",", ":")),
                                        encoding="utf-8")
        r = res.get(codigo, {})
        row = {"codigo": codigo, "capital": cap["capital"], "provincia": cap["provincia"],
               "ccaa": cap["ccaa"], "slug": s}
        for k in NUM:
            row[k] = num(r.get(k))
        row["notas"] = r.get("notas", "")
        row["avisos"] = r.get("avisos", "")
        index.append(row)
    index.sort(key=lambda r: r["capital"])
    (OUT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"{len(index)} capitals -> {OUT}")


if __name__ == "__main__":
    main()
