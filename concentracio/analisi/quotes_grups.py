"""Quota de cada grup sobre el parc de lloguer de Barcelona i marge implícit.

Llegeix concentracio/dades/grups_lloguer_bcn.csv. Només fa servir les files amb
`ambit == "ciutat"`. Suma per grup i calcula:

- quota s = habitatges / parc de lloguer de la ciutat
- contribució a l'HHI (s², escala 0–10.000)
- marge del model de propietari dominant amb franja competitiva,
  L = s / (ε_d + ε_f · (1 − s)), per a diversos valors de ε_f

Ús:
    python3 concentracio/analisi/quotes_grups.py
"""

import csv
import sys
from collections import defaultdict
from pathlib import Path

# Habitatges llogats a la ciutat de Barcelona, 1/1/2023 (O-HB, a partir del
# Registre de fiances de l'INCASÒL). Infraestima el parc real perquè hi ha
# contractes sense fiança dipositada.
PARC_LLOGUER_BCN = 240_369

EPS_D = 0.5
EPS_F = (0, 1, 2, 5)
LLINDAR_QUOTA = 0.025  # marge del 5 % amb ε_f = 0

CSV_PATH = Path(__file__).resolve().parent.parent / "dades" / "grups_lloguer_bcn.csv"


def marge(s: float, eps_f: float, eps_d: float = EPS_D) -> float:
    return s / (eps_d + eps_f * (1 - s))


def main() -> int:
    per_grup: dict[str, int] = defaultdict(int)
    tipus: dict[str, str] = {}
    with CSV_PATH.open(encoding="utf-8") as f:
        for fila in csv.DictReader(f):
            if fila["ambit"] != "ciutat" or not fila["habitatges"].strip():
                continue
            per_grup[fila["grup"]] += int(fila["habitatges"])
            tipus[fila["grup"]] = fila["tipus"]

    grups = sorted(per_grup.items(), key=lambda kv: -kv[1])
    capcalera = ["Grup", "Tipus", "Habitatges", "Quota", "HHI"] + [
        f"L (ε_f={e})" for e in EPS_F
    ]
    print("| " + " | ".join(capcalera) + " |")
    print("|" + "---|" * len(capcalera))
    hhi = 0.0
    for grup, n in grups:
        s = n / PARC_LLOGUER_BCN
        hhi += s * s
        marca = " ⚠" if s >= LLINDAR_QUOTA else ""
        cel = [grup + marca, tipus[grup], f"{n:,}".replace(",", "."), f"{100 * s:.2f} %",
               f"{1e4 * s * s:.1f}"]
        cel += [f"{100 * marge(s, e):.1f} %" for e in EPS_F]
        print("| " + " | ".join(cel) + " |")
    print()
    print(f"Parc de lloguer de referència: {PARC_LLOGUER_BCN:,} habitatges".replace(",", "."))
    print(f"HHI dels grups llistats: {1e4 * hhi:.1f} (sobre 10.000)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
