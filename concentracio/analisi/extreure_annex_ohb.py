"""Extreu les taules per barri dels annexos 1 i 2 de l'informe de l'O-HB 2025.

Informe: O-HB, "Estructura i concentració de la propietat d'habitatges a la ciutat
de Barcelona 2025" (desembre 2025).
- Annex 1, Taula A: % d'habitatges de titulars amb ≥5, >10 i >15 habitatges.
  No inclou els habitatges de l'administració pública.
- Annex 2, Taula B: % d'habitatges de persones físiques, administració pública i
  empreses.

Necessita `pdftotext` (poppler). Ús:
    python3 concentracio/analisi/extreure_annex_ohb.py [ruta_al_pdf]
Sense argument, baixa el PDF a un directori temporal.
"""

import csv
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

URL = "https://recam.amb.cat/bitstreams/03203c5f-f1ec-49cd-ad2c-56dc55eb3135/download"
SORTIDA = Path(__file__).resolve().parent.parent / "dades" / "ohb_2025_barris.csv"

NUM = re.compile(r"(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?%?")


def text_pdf(pdf: Path) -> list[str]:
    out = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True,
                         text=True, check=True).stdout
    return [l for l in out.splitlines() if l.strip()]


def seccio(linies: list[str], inici: str, fi: str) -> list[str]:
    i = next(k for k, l in enumerate(linies) if l.strip().startswith(inici) and k > 100)
    j = next(k for k, l in enumerate(linies) if l.strip().startswith(fi) and k > i)
    return linies[i:j]


def files_barri(linies: list[str], n_valors: int) -> dict[int, list[float]]:
    """Retorna {codi_barri: [total, pct1, pct2, ...]}."""
    res = {}
    for l in linies:
        m = re.match(r"^\s*(\d{2})\b(.*)$", l)
        if not m:
            continue
        codi = int(m.group(1))
        valors = []
        for tok in re.findall(r"\d{1,3}(?:\.\d{3})+|\d+,\d+%|\d+%|\b\d+\b", m.group(2)):
            if tok.endswith("%"):
                valors.append(float(tok[:-1].replace(",", ".")))
            else:
                valors.append(float(tok.replace(".", "")))
        valors = valors[-n_valors:]
        if len(valors) == n_valors and 1 <= codi <= 73:
            res[codi] = valors
    return res


def main() -> int:
    if len(sys.argv) > 1:
        pdf = Path(sys.argv[1])
    else:
        pdf = Path(tempfile.mkdtemp()) / "ohb_2025.pdf"
        urllib.request.urlretrieve(URL, pdf)
    linies = text_pdf(pdf)
    a1 = files_barri(seccio(linies, "Annex 1. Multipropietaris", "Annex 2. Tipus"), 4)
    a2 = files_barri(seccio(linies, "Annex 2. Tipus", "Annex 3. Els contribuents"), 4)
    codis = sorted(set(a1) | set(a2))
    with SORTIDA.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["codi_barri", "habitatges", "pct_5_o_mes", "pct_mes_10", "pct_mes_15",
                    "pct_persones_fisiques", "pct_administracio", "pct_empreses"])
        for c in codis:
            v1 = a1.get(c, [None] * 4)
            v2 = a2.get(c, [None] * 4)
            w.writerow([c, int(v1[0] or v2[0])] + v1[1:] + v2[1:])
    print(f"{len(codis)} barris -> {SORTIDA}")
    falten = [c for c in range(1, 74) if c not in a1 or c not in a2]
    if falten:
        print("Falten barris:", falten)
    return 0


if __name__ == "__main__":
    sys.exit(main())
