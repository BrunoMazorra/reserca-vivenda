# Atles de l'habitatge (web)

El web que reuneix les pàgines del projecte. És públic a
**https://brunomazorra.github.io/reserca-vivenda/** i es torna a publicar sol cada vegada
que canvia `web/` o la pàgina de Barcelona (workflow `.github/workflows/pages.yml`).

També n'hi ha una còpia a claude.ai,
[Atles de l'habitatge](https://claude.ai/artifact/ESAu2nXLjeUhZ2DngwFbL9), privada fins que
es comparteix des del seu menú.

## Pàgines

| Ruta | Contingut | Origen |
|---|---|---|
| `#inici` | Presentació i accés a les tres escales | `shell.html` |
| `#ciutats`, `#ciutat-<nom>` | Fitxa de cada capital de província, amb selector (per exemple `#ciutat-girona`) | `src/capitals/` |
| `#ciutat-leon-ampliada` | Fitxa ampliada de León (en castellà) | `src/leon/` |
| `#catalunya` | Mapa 3D «Catalunya en relleu» i, a sota, gràfiques de població, llars i habitatge per anells | `../creixement/pagina/` |
| `catalunya-relleu/` | La mateixa pàgina de Catalunya sencera, a pantalla completa: https://brunomazorra.github.io/reserca-vivenda/catalunya-relleu/ (només a la versió de GitHub Pages) | `../creixement/pagina/index.html` |
| `#barcelona` | Concentració del lloguer i grans propietaris | `../concentracio/pagina/` |
| `#barcelona-mapes` | Propietat per barris, amb mapes (en castellà) | `src/bcn_mapes/` |

## Com està fet

- `shell.html`: la plantilla. Hi ha la barra de navegació, la pàgina d'inici, els estils
  comuns, una petita capa que fa funcionar les pàgines del tipus «Data» de claude.ai
  (`dash.data`, `dash.calc`, `dash.draw`, `dash.colors`) i el router per hash.
- `build.py`: munta `dist/index.html` i copia les dades a `dist/data/`.
  - Pàgines «Data» (León, Barcelona): separa estils, contingut i guions. Cada pàgina corre
    amb la seva pròpia instància de `dash`, de manera que els noms de dibuixos i dades no
    xoquen.
  - Mapa de Catalunya: llegeix `../creixement/pagina/index.html`. Prefixa els estils amb
    `#pg-catalunya` (les variables de color es queden a `:root`, perquè el codi del mapa les
    llegeix d'allà), treu les dades del mapa a `data/catalunya.json`, posa les de llars i
    habitatge dins del codi i carrega Three.js només quan s'obre la pàgina. El mapa va dins
    de l'escenari (`.cat-stage`) i les gràfiques, a sota.
  - Comprova que no hi hagi identificadors repetits entre pàgines.
- `src/`: còpies de les pàgines originals i dels seus fitxers de dades, baixades dels
  artefactes el 16/11/2026.
- `src/capitals/`: les 52 fitxes de ciutat, sortides del framework *vivienda_capitales*
  (`python ejecutar.py --todas`). Per actualitzar-les:
  `python3 -I web/importa_capitals.py /ruta/a/vivienda_capitales`.
- `dist/`: el resultat. No es guarda al repositori.

## Regenerar i publicar

```bash
python3 -I web/build.py
```

Després es publica `dist/index.html` amb els fitxers de `dist/data/` al mateix artefacte.

Per a un servidor estàtic (per exemple GitHub Pages), la versió autònoma:

```bash
python3 -I web/build.py --pages _site
```

Si es torna a exportar la pàgina de Barcelona (`concentracio/analisi/exporta_pagina.py`)
o es torna a muntar la de Catalunya (`creixement/pagina/build.py`), n'hi ha prou amb tornar
a executar `build.py`.
