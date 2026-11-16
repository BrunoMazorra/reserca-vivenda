"""Sèrie 2009–2026 de locals d'habitatge per tipus de propietari i barri (cadastre).

Font: Open Data BCN, conjunt `est-cadastre-habitatges-propietari`.
Hi ha dos formats:
- 2009–2017: per barri, 4 categories (persona física espanyola / estrangera,
  persona jurídica, "no procedeix").
- 2018–2026: per secció censal, 19 categories de propietari.

Per tenir una sèrie homogènia es calcula, per barri i any:
- fisica: persones físiques
- juridica: tota la resta, excepte "no procedeix" / "no consta"
- per al 2018–2026, també: empreses (SL, SA, comanditàries, col·lectives, entitats
  estrangeres, establiments permanents), administracio i altres_juridica.

Ús:
    python3 -I concentracio/analisi/cadastre_serie.py
Escriu concentracio/dades/cadastre_propietaris_barri.csv.
"""

import csv
import io
import json
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

API = ("https://opendata-ajuntament.barcelona.cat/data/api/3/action/package_show"
       "?id=est-cadastre-habitatges-propietari")
SORTIDA = Path(__file__).resolve().parent.parent / "dades" / "cadastre_propietaris_barri.csv"

# 2018–2022 fan servir noms abreujats ("Soc. responsabilitat limitada / civil", "Soc. anònimes").
EMPRESA = ("societats responsabilitat limitada", "societats anònimes", "societats comanditàries",
           "societats col·lectives", "entitats estrangeres", "establiments permanents",
           "soc. responsabilitat limitada", "soc. anònimes")
ADMIN = ("corporacions locals", "organismes públics", "òrgans de l'administració")
SENSE_DADA = ("no procedeix", "no consta")


def classifica(tipus: str) -> str:
    t = " ".join(tipus.lower().split())
    if "física" in t or "fisica" in t:
        return "fisica"
    if any(t.startswith(s) for s in SENSE_DADA):
        return "no_consta"
    if any(t.startswith(s) for s in EMPRESA):
        return "empreses"
    if any(t.startswith(s) for s in ADMIN):
        return "administracio"
    if t == "persona jurídica":
        return "juridica_sense_detall"
    return "altres_juridica"


def baixa(url: str) -> list[dict]:
    with urllib.request.urlopen(url, timeout=120) as r:
        text = r.read().decode("utf-8-sig")
    return list(csv.DictReader(io.StringIO(text)))


def main() -> int:
    with urllib.request.urlopen(API, timeout=60) as r:
        recursos = json.load(r)["result"]["resources"]
    acc: dict[tuple, dict] = defaultdict(lambda: defaultdict(int))
    noms: dict[int, str] = {}
    for rec in recursos:
        files = baixa(rec["url"])
        for f in files:
            f = {k.lower(): v for k, v in f.items()}
            if f.get("concepte", "Nombre") != "Nombre":
                continue
            tipus = f.get("tipus_propietari") or f.get("desc_tipus_propietari") or ""
            valor = (f["nombre"] or "").strip()
            if not valor or valor.upper() == "NA":
                continue
            n = int(float(valor))
            any_, barri = int(f["any"]), int(f["codi_barri"])
            noms[barri] = f["nom_barri"]
            acc[(any_, barri)][classifica(tipus)] += n
        print(rec["name"], len(files), file=sys.stderr)

    camps = ["any", "codi_barri", "nom_barri", "fisica", "juridica", "empreses",
             "administracio", "altres_juridica", "no_consta"]
    with SORTIDA.open("w", encoding="utf-8", newline="") as out:
        w = csv.writer(out)
        w.writerow(camps)
        for (any_, barri), d in sorted(acc.items()):
            detall = any_ >= 2018
            juridica = (d["empreses"] + d["administracio"] + d["altres_juridica"]
                        + d["juridica_sense_detall"])
            w.writerow([any_, barri, noms[barri], d["fisica"], juridica,
                        d["empreses"] if detall else "", d["administracio"] if detall else "",
                        d["altres_juridica"] if detall else "", d["no_consta"]])
    print(f"-> {SORTIDA}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
