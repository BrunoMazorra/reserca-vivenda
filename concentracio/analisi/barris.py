"""Anàlisi per barri amb dades públiques: P8, P1c/P4 (secció creuada) i P3 (topall 2024).

Entrades (concentracio/dades/):
- portal_dades/*.tsv: lloguer, contractes i preus de compravenda per barri
  (Portal Barcelona Dades).
- ohb_2025_barris.csv: concentració de la propietat per barri (O-HB 2025, annexos 1 i 2).
- cadastre_propietaris_barri.csv: tipus de propietari per barri, 2009–2026.

Sortides: taules per pantalla (markdown) i figures a concentracio/figures/.

Ús (cal pandas, statsmodels i matplotlib; vegeu requirements.txt):
    python concentracio/analisi/barris.py
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402
import statsmodels.formula.api as smf  # noqa: E402

BASE = Path(__file__).resolve().parent.parent
DADES = BASE / "dades"
PORTAL = DADES / "portal_dades"
FIGURES = BASE / "figures"

DISTRICTES = ["Ciutat Vella", "Eixample", "Sants-Montjuïc", "Les Corts", "Sarrià-Sant Gervasi",
              "Gràcia", "Horta-Guinardó", "Nou Barris", "Sant Andreu (Districte)", "Sant Martí"]
AGREGATS = {"Catalunya", "Metropolità de Barcelona", "Barcelona"}

ANY_BASE = 2023          # últim any sencer abans del topall (març 2024)
ANYS = range(2017, 2026)  # 2026 és parcial i es deixa fora
MIN_CONTRACTES = 100     # barris amb almenys 100 contractes nous el 2023

# Paleta de referència (tema clar)
SUPERFICIE, TEXT, TEXT2, GRAELLA = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3de"
SERIE1, SERIE2 = "#2a78d6", "#eb6834"


# ---------------------------------------------------------------- lectura

def num(v: str) -> float:
    v = v.strip()
    return np.nan if v in ("-", "") else float(v.replace(".", "").replace(",", "."))


def llegeix_portal(nom: str, variable: str) -> pd.DataFrame:
    """Taula del portal -> format llarg (codi_barri, districte, any, variable).

    Les files venen ordenades per codi de barri, amb els districtes intercalats.
    """
    df = pd.read_csv(PORTAL / nom, sep="\t", comment="#", dtype=str)
    files, codi, districte = [], 0, None
    for _, fila in df.iterrows():
        t = fila["Territori"]
        if t in AGREGATS:
            continue
        if t in DISTRICTES:
            districte = t
            continue
        codi += 1
        for col in df.columns[1:]:
            files.append((codi, t, districte, int(col), num(fila[col])))
    assert codi == 73, (nom, codi)
    return pd.DataFrame(files, columns=["codi_barri", "barri", "districte", "any", variable])


def panell() -> pd.DataFrame:
    p = llegeix_portal("lloguer_mitja_barri.tsv", "lloguer")
    for nom, var in [("contractes_lloguer_barri.tsv", "contractes"),
                     ("preu_compravenda_m2_barri.tsv", "preu_m2"),
                     ("lloguer_m2_barri.tsv", "lloguer_m2")]:
        p = p.merge(llegeix_portal(nom, var).drop(columns=["barri", "districte"]),
                    on=["codi_barri", "any"], how="left")
    return p


def exposicio() -> pd.DataFrame:
    ohb = pd.read_csv(DADES / "ohb_2025_barris.csv")
    # L'annex 1 inclou l'administració pública dins dels propietaris de ≥5 habitatges.
    # L'exposició privada resta el pes del parc públic.
    ohb["expo_priv"] = (ohb["pct_5_o_mes"] - ohb["pct_administracio"]).clip(lower=0)
    cad = pd.read_csv(DADES / "cadastre_propietaris_barri.csv")
    cad = cad[(cad.codi_barri <= 73) & (cad["any"] == ANY_BASE)].copy()
    cad["emp_2023"] = 100 * cad["empreses"] / (cad["fisica"] + cad["juridica"])
    return ohb.merge(cad[["codi_barri", "emp_2023"]], on="codi_barri")


# ---------------------------------------------------------------- figures

def estil(ax):
    ax.set_facecolor(SUPERFICIE)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color(GRAELLA)
    ax.tick_params(colors=TEXT2, labelsize=9)
    ax.grid(axis="y", color=GRAELLA, linewidth=0.8)
    ax.set_axisbelow(True)


def figura(nfil=1, ncol=1, mida=(7, 4)):
    fig, axs = plt.subplots(nfil, ncol, figsize=mida, facecolor=SUPERFICIE, squeeze=False)
    for ax in axs.flat:
        estil(ax)
    return fig, axs


def desa(fig, nom):
    FIGURES.mkdir(exist_ok=True)
    fig.savefig(FIGURES / nom, dpi=160, bbox_inches="tight", facecolor=SUPERFICIE)
    plt.close(fig)


# ---------------------------------------------------------------- P8

def p8_serie():
    cad = pd.read_csv(DADES / "cadastre_propietaris_barri.csv")
    cad = cad[cad.codi_barri <= 73]
    city = cad.groupby("any")[["fisica", "juridica", "empreses"]].sum(min_count=1)
    city["pct_juridica"] = 100 * city.juridica / (city.fisica + city.juridica)
    city["pct_empreses"] = 100 * city.empreses / (city.fisica + city.juridica)
    city.loc[city.index < 2018, "pct_empreses"] = np.nan

    print("\n## P8. Pes de les persones jurídiques al cadastre (ciutat)\n")
    print("| Any | Persones jurídiques | Empreses |\n|---|---|---|")
    for a, f in city.iterrows():
        emp = "" if np.isnan(f.pct_empreses) else f"{f.pct_empreses:.1f} %"
        print(f"| {a} | {f.pct_juridica:.1f} % | {emp} |")

    b = cad.copy()
    b["pct"] = 100 * b.juridica / (b.fisica + b.juridica)
    w = b.pivot_table(index=["codi_barri", "nom_barri"], columns="any", values="pct")
    canvi = (w[2026] - w[2009]).sort_values()
    print(f"\nCanvi 2009–2026 per barri (punts): mediana {canvi.median():.1f}; "
          f"{(canvi > 0).sum()} de {canvi.notna().sum()} barris pugen.")
    print("Més pujada:", ", ".join(f"{n} (+{v:.1f})" for (c, n), v in canvi.tail(5)[::-1].items()))
    print("Més baixada:", ", ".join(f"{n} ({v:.1f})" for (c, n), v in canvi.head(3).items()))

    fig, axs = figura(mida=(7, 3.6))
    ax = axs[0, 0]
    ax.plot(city.index, city.pct_juridica, color=SERIE1, lw=2, marker="o", ms=4)
    ax.plot(city.index, city.pct_empreses, color=SERIE2, lw=2, marker="o", ms=4)
    ax.annotate("Persones jurídiques", (2026, city.pct_juridica[2026]), xytext=(6, 0),
                textcoords="offset points", va="center", color=TEXT, fontsize=9)
    ax.annotate("Empreses (des del 2018)", (2026, city.pct_empreses[2026]), xytext=(6, 0),
                textcoords="offset points", va="center", color=TEXT, fontsize=9)
    ax.set_ylim(0, 18)
    ax.set_xlim(2008.5, 2030.5)
    ax.set_xticks(range(2009, 2027, 2))
    ax.set_ylabel("% dels habitatges amb titular conegut", color=TEXT2, fontsize=9)
    ax.set_title("Barcelona: habitatges en mans de persones jurídiques (cadastre)",
                 loc="left", color=TEXT, fontsize=11)
    desa(fig, "p8_persones_juridiques.png")


# ---------------------------------------------------------------- P4 / P1c

def ols(df, formula, pes=None):
    m = smf.wls(formula, df, weights=pes) if pes is not None else smf.ols(formula, df)
    return m.fit(cov_type="HC1")


def seccio_creuada(p, e):
    d = p[p["any"] == ANY_BASE].merge(e, on="codi_barri")
    d = d[d.contractes >= MIN_CONTRACTES].copy()
    d["anys_lloguer"] = d.preu_m2 / (12 * d.lloguer_m2)
    d["ln_lloguer_m2"] = np.log(d.lloguer_m2)
    d["ln_preu_m2"] = np.log(d.preu_m2)
    d["ln_ratio"] = np.log(d.anys_lloguer)
    d["expo10"] = d.expo_priv / 10
    d["emp10"] = d.emp_2023 / 10

    print(f"\n## P4. Secció creuada {ANY_BASE} ({len(d)} barris amb ≥{MIN_CONTRACTES} contractes)\n")
    print(f"Correlació entre les dues mesures d'exposició: {d.expo_priv.corr(d.emp_2023):.2f}")
    print("\nCoeficient per cada 10 punts d'exposició (errors robustos). "
          "Sense i amb efectes fixos de districte:\n")
    print("| Variable | Exposició | Sense EF | Amb EF districte |\n|---|---|---|---|")
    for y, etiqueta in [("ln_lloguer_m2", "log lloguer €/m²"), ("ln_preu_m2", "log preu €/m²"),
                        ("ln_ratio", "log ràtio preu/lloguer")]:
        for x, nom in [("expo10", "≥5 habitatges (privat, O-HB)"), ("emp10", "empreses (cadastre)")]:
            r0 = ols(d, f"{y} ~ {x}")
            r1 = ols(d, f"{y} ~ {x} + C(districte)")
            print(f"| {etiqueta} | {nom} | {r0.params[x]:+.3f} ({r0.bse[x]:.3f}) | "
                  f"{r1.params[x]:+.3f} ({r1.bse[x]:.3f}) |")
    print(f"\nRàtio preu/lloguer (anys de lloguer): mediana {d.anys_lloguer.median():.1f}, "
          f"rang {d.anys_lloguer.min():.1f}–{d.anys_lloguer.max():.1f}")

    fig, axs = figura(1, 2, mida=(9, 3.8))
    for ax, (y, titol) in zip(axs[0], [("lloguer_m2", "Lloguer (€/m² al mes)"),
                                        ("anys_lloguer", "Preu / lloguer anual (anys)")]):
        ax.scatter(d.expo_priv, d[y], s=28, color=SERIE1, alpha=0.85, edgecolor=SUPERFICIE,
                   linewidth=1)
        b = np.polyfit(d.expo_priv, d[y], 1)
        xs = np.linspace(d.expo_priv.min(), d.expo_priv.max(), 50)
        ax.plot(xs, np.polyval(b, xs), color=TEXT2, lw=1.5, ls="--")
        ax.set_title(titol, loc="left", color=TEXT, fontsize=10)
        ax.set_xlabel("% d'habitatges de propietaris privats amb ≥5 (O-HB 2025)",
                      color=TEXT2, fontsize=9)
    fig.suptitle(f"Barris de Barcelona, {ANY_BASE}: concentració de la propietat, lloguer i ràtio",
                 x=0.01, ha="left", color=TEXT, fontsize=11)
    fig.tight_layout()
    desa(fig, "p4_seccio_creuada.png")


# ---------------------------------------------------------------- P3

def event_study(p, e, y, expo, anys):
    d = p.merge(e, on="codi_barri")
    grans = d[(d["any"] == ANY_BASE) & (d.contractes >= MIN_CONTRACTES)].codi_barri
    d = d[d.codi_barri.isin(grans) & d["any"].isin(anys)].copy()
    d["ln_y"] = np.log(d[y])
    d = d[np.isfinite(d.ln_y)]
    termes = []
    for a in anys:
        if a == ANY_BASE:
            continue
        col = f"e{a}"
        d[col] = (d[expo] / 10) * (d["any"] == a)
        termes.append(col)
    r = smf.ols(f"ln_y ~ C(codi_barri) + C(any) + {' + '.join(termes)}", d).fit(
        cov_type="cluster", cov_kwds={"groups": d.codi_barri})
    coefs = {ANY_BASE: (0.0, 0.0)}
    for a in anys:
        if a != ANY_BASE:
            coefs[a] = (r.params[f"e{a}"], r.bse[f"e{a}"])
    return coefs, d.codi_barri.nunique()


def p3_topall(p, e):
    sortides = [("contractes", "Contractes nous", list(ANYS)),
                ("lloguer", "Lloguer (€/mes)", list(ANYS)),
                ("preu_m2", "Preu de compravenda (€/m²)", list(ANYS))]
    print("\n## P3. Estudi d'esdeveniment del topall del 2024\n")
    print("Coeficient de (exposició/10) × any, base 2023, efectes fixos de barri i any, "
          "errors agrupats per barri. Unitats: punts logarítmics (×100 ≈ %).\n")
    resultats = {}
    for expo, nom in [("expo_priv", "≥5 habitatges (privat, O-HB 2025)"),
                      ("emp_2023", "empreses (cadastre 2023)")]:
        print(f"\n### Exposició: {nom}\n")
        print("| Any | " + " | ".join(s[1] for s in sortides) + " |")
        print("|---|" + "---|" * len(sortides))
        files = {}
        for y, _, anys in sortides:
            files[y], n = event_study(p, e, y, expo, anys)
        for a in ANYS:
            cel = []
            for y, _, _ in sortides:
                b, s = files[y].get(a, (np.nan, np.nan))
                cel.append("—" if a == ANY_BASE else f"{b:+.3f} ({s:.3f})")
            print(f"| {a} | " + " | ".join(cel) + " |")
        print(f"\n{n} barris.")
        resultats[expo] = files

    fig, axs = figura(1, 3, mida=(11, 3.6))
    for ax, (y, titol, anys) in zip(axs[0], sortides):
        c = resultats["expo_priv"][y]
        xs = sorted(c)
        bs = np.array([c[a][0] for a in xs])
        ss = np.array([c[a][1] for a in xs])
        ax.axhline(0, color=TEXT2, lw=0.8)
        ax.axvline(ANY_BASE + 0.5, color=TEXT2, lw=0.8, ls=":")
        ax.fill_between(xs, bs - 1.96 * ss, bs + 1.96 * ss, color=SERIE1, alpha=0.15, lw=0)
        ax.plot(xs, bs, color=SERIE1, lw=2, marker="o", ms=4)
        ax.set_title(titol, loc="left", color=TEXT, fontsize=10)
        ax.set_xticks(xs[::2])
    axs[0, 0].set_ylabel("Efecte de +10 punts d'exposició\n(punts log, base 2023)",
                         color=TEXT2, fontsize=9)
    axs[0, 0].annotate("topall (març 2024)", (ANY_BASE + 0.5, axs[0, 0].get_ylim()[1]),
                       xytext=(4, -10), textcoords="offset points", color=TEXT2, fontsize=8)
    fig.suptitle("Barris més exposats als grans tenidors privats, abans i després del topall",
                 x=0.01, ha="left", color=TEXT, fontsize=11)
    fig.tight_layout()
    desa(fig, "p3_topall_2024.png")


def main():
    p = panell()
    e = exposicio()
    p8_serie()
    seccio_creuada(p, e)
    p3_topall(p, e)


if __name__ == "__main__":
    main()
