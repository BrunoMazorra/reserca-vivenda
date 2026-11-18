# Pàgina «Catalunya en relleu»

Mapa 3D dels municipis (alçada: densitat; color: canvi de població des de 1981) i, a sota,
gràfiques de població, llars i habitatge per anells de distància a Barcelona.

Es pot veure sencera a https://brunomazorra.github.io/reserca-vivenda/catalunya-relleu/, i també dins de l'[Atles de l'habitatge](https://brunomazorra.github.io/reserca-vivenda/#catalunya), a la pàgina `#catalunya`.
També n'hi ha una còpia a claude.ai, [Catalunya en relleu](https://claude.ai/artifact/B3wiAxGPoA7qySKwqr6puj),
privada fins que es comparteix des del seu menú.

- `template.html`: estils, mapa (three.js) i codi de les gràfiques. Té tres marques que
  omple `build.py`: `/*CHARTS*/`, `/*DATA*/` i `/*HDATA*/`.
- `charts.js`: funcions que dibuixen les gràfiques en SVG. Les fa servir la pàgina i també
  `../analisi/figures.mjs`.
- `build.py`: escriu `index.html`, la pàgina autònoma amb les dades dins.
- `index.html`: el resultat. `web/build.py` el llegeix d'aquí i el posa a l'Atles: el mapa
  ocupa la pantalla i les gràfiques van a sota.

```bash
python3 -I creixement/pagina/build.py
python3 -I web/build.py
```
