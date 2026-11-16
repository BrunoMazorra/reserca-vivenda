# Atles de l'habitatge (web)

El web que reuneix les pàgines del projecte:
[Atles de l'habitatge](https://claude.ai/artifact/ESAu2nXLjeUhZ2DngwFbL9).
És una pàgina de claude.ai i és privada fins que es comparteix des del seu menú.

## Pàgines

| Ruta | Contingut | Origen |
|---|---|---|
| `#inici` | Presentació i accés a les tres escales | `shell.html` |
| `#ciutats` | Fitxa de León (en castellà) | `src/leon/` |
| `#catalunya` | Mapa 3D «Catalunya en relleu» | `src/catalunya/` |
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
  - Mapa de Catalunya: prefixa els estils amb `#pg-catalunya` (les variables de color es
    queden a `:root`, perquè el codi del mapa les llegeix d'allà), treu les dades a
    `data/catalunya.json` i carrega Three.js només quan s'obre la pàgina.
  - Comprova que no hi hagi identificadors repetits entre pàgines.
- `src/`: còpies de les pàgines originals i dels seus fitxers de dades, baixades dels
  artefactes el 16/11/2026.
- `dist/`: el resultat. No es guarda al repositori.

## Regenerar i publicar

```bash
python3 -I web/build.py
```

Després es publica `dist/index.html` amb els fitxers de `dist/data/` al mateix artefacte.
Si es torna a exportar la pàgina de Barcelona (`concentracio/analisi/exporta_pagina.py`),
n'hi ha prou amb tornar a executar `build.py`.
