"""Genera els fitxers JSON que fa servir la pàgina web de la secció.

Cada fitxer és {rows, meta}. `meta` porta el codi que l'ha generat i les fonts, perquè
qui llegeixi la pàgina pugui comprovar-ho.

- panell_barris.json: lloguer, contractes i preus per barri i any (Portal Barcelona Dades).
- p3_estudi_esdeveniment.json: coeficients de l'estudi d'esdeveniment del topall del 2024.
- p4_coeficients.json: coeficients de la secció creuada del 2023.

Ús:
    python concentracio/analisi/exporta_pagina.py
"""

import json
import math
from pathlib import Path

import numpy as np

import barris as b

AQUI = Path(__file__).resolve().parent
SORTIDA = AQUI.parent / "pagina"

FONTS_PORTAL = [
    {"label": "Lloguer i contractes",
     "value": "Generalitat de Catalunya, Secretaria d'Habitatge, fiances de l'INCASÒL, via Portal "
              "Barcelona Dades (estadístiques b37xv8wcjh, 5ibudgqbrb i 7i0g4usm60)"},
    {"label": "Preu de compravenda",
     "value": "Ajuntament de Barcelona, Oficina Municipal de Dades, registres notarials, via Portal "
              "Barcelona Dades (estadística bxtvnxvukh)"},
]


def net(v):
    if v is None:
        return None
    if isinstance(v, (float, np.floating)) and (math.isnan(v) or math.isinf(v)):
        return None
    if isinstance(v, np.integer):
        return int(v)
    if isinstance(v, np.floating):
        return float(v)
    return v


def codi(*fitxers):
    return [{"label": f, "value": (AQUI / f).read_text(encoding="utf-8"), "type": "code",
             "lang": "python"} for f in fitxers]


def desa(nom, files, meta):
    SORTIDA.mkdir(exist_ok=True)
    rows = [{k: net(v) for k, v in f.items()} for f in files]
    (SORTIDA / nom).write_text(json.dumps({"rows": rows, "meta": meta}, ensure_ascii=False),
                               encoding="utf-8")
    print(nom, len(rows))


def main():
    p = b.panell()
    e = b.exposicio()

    desa("panell_barris.json", p.to_dict("records"),
         codi("barris.py", "exporta_pagina.py") + FONTS_PORTAL)

    files = []
    for expo, nom in [("expo_priv", "privat_5_o_mes"), ("emp_2023", "empreses_2023")]:
        for y in ["contractes", "lloguer", "preu_m2"]:
            coefs, n = b.event_study(p, e, y, expo, list(b.ANYS))
            for a in sorted(coefs):
                beta, se = coefs[a]
                files.append({"exposicio": nom, "variable": y, "any": a,
                              "beta_pct": round(100 * beta, 2), "se_pct": round(100 * se, 2),
                              "n_barris": n})
    desa("p3_estudi_esdeveniment.json", files,
         codi("barris.py", "exporta_pagina.py") + FONTS_PORTAL +
         [{"label": "Model", "value": "log y = EF barri + EF any + Σ βₜ·(exposició/10)·1[any=t], "
                                      "base 2023, errors agrupats per barri, barris amb ≥100 "
                                      "contractes nous el 2023"}])

    d = p[p["any"] == b.ANY_BASE].merge(e, on="codi_barri")
    d = d[d.contractes >= b.MIN_CONTRACTES].copy()
    d["ln_lloguer_m2"] = np.log(d.lloguer_m2)
    d["ln_preu_m2"] = np.log(d.preu_m2)
    d["ln_ratio"] = np.log(d.preu_m2 / (12 * d.lloguer_m2))
    d["expo10"] = d.expo_priv / 10
    d["emp10"] = d.emp_2023 / 10
    files = []
    for y in ["ln_lloguer_m2", "ln_preu_m2", "ln_ratio"]:
        for x, nom in [("expo10", "privat_5_o_mes"), ("emp10", "empreses_2023")]:
            for ef in (False, True):
                r = b.ols(d, f"{y} ~ {x}" + (" + C(districte)" if ef else ""))
                files.append({"variable": y.removeprefix("ln_"), "exposicio": nom,
                              "efectes_districte": "si" if ef else "no",
                              "coef_pct": round(100 * r.params[x], 1),
                              "se_pct": round(100 * r.bse[x], 1), "n_barris": len(d)})
    desa("p4_coeficients.json", files,
         codi("barris.py", "exporta_pagina.py") + FONTS_PORTAL +
         [{"label": "Model", "value": "MCO per barri, 2023, errors robustos HC1. Coeficient "
                                      "per cada 10 punts d'exposició, en punts logarítmics ×100"}])


if __name__ == "__main__":
    main()
