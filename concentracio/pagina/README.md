# Pàgina interactiva

Font de la pàgina [Concentració del lloguer a Barcelona](https://claude.ai/artifact/FNWRr3ABf554HLh3gRhRnn).
És una pàgina de claude.ai i és privada fins que es comparteix des del seu menú.

- `index.html`: la pàgina (gràfics d3 i animacions). Funciona dins del tipus de pàgina «Data»
  de claude.ai, que li dona les dades a través de `dash.data`.
- `*.json`: les dades que llegeix. `panell_barris.json`, `p3_estudi_esdeveniment.json` i
  `p4_coeficients.json` es generen amb `../analisi/exporta_pagina.py`. Els altres dos són
  `../dades/grups_lloguer_bcn.csv` i `../dades/cadastre_propietaris_barri.csv` passats a JSON.
  També llegeix `../dades/ohb_lloguer_ciutat_2023.csv` i `../dades/ohb_2025_barris.csv`.

Per regenerar les dades:

```bash
python concentracio/analisi/exporta_pagina.py
```
