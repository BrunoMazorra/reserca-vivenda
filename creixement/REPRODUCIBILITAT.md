# Com reproduir les dades i la pàgina

Tot el que surt a la pàgina [Catalunya en relleu](https://brunomazorra.github.io/reserca-vivenda/catalunya-relleu/)
i al [README del tema](README.md) es pot refer des de zero, amb dades públiques i cinc ordres.
No cal cap compte, clau d'accés ni paquet extern.

## Què cal

- **Node.js 18 o més nou**, per a `fetch`. No cal `npm install`.
- **Python 3.8 o més nou**, només amb la biblioteca estàndard.
- **Accés a internet** a `www.idescat.cat`, `api.idescat.cat` i `cdn.jsdelivr.net`. La primera vegada es baixen
  uns 80 fitxers (3,3 MB) i triga aproximadament un minut.

## Les cinc ordres

Des de l'arrel del repositori:

```bash
node creixement/analisi/poblacio_municipis.mjs   # 1. població, contorns i superfícies → dades/municipis.json
node creixement/analisi/habitatge_anells.mjs     # 2. llars i habitatge per anells   → dades/habitatge-anells.json
node creixement/analisi/figures.mjs              # 3. gràfics estàtics               → figures/*.svg
python3 -I creixement/pagina/build.py            # 4. la pàgina                      → pagina/index.html
python3 -I web/build.py --pages _site            # 5. el web sencer                  → _site/
```

El pas 2 llegeix el resultat del pas 1, i els passos 3 i 4 llegeixen tots dos. L'ordre importa.

Per veure el resultat:

```bash
python3 -m http.server 8000 --directory _site
```

Després obre http://localhost:8000/catalunya-relleu/ (la pàgina sola) o http://localhost:8000/#catalunya
(dins de l'Atles).

**Comprovar sense sobreescriure.** Els passos 1 i 2 accepten `--comprova`. Fan tot el càlcul però no escriuen
res: comparen el resultat amb el fitxer guardat al repositori i diuen si és idèntic o què ha canviat. Si hi
ha diferències, acaben amb codi 1.

```bash
node creixement/analisi/poblacio_municipis.mjs --comprova
node creixement/analisi/habitatge_anells.mjs --comprova
```

**Tornar a baixar.** Les descàrregues es desen a `creixement/dades/brut/`, que no es guarda al repositori, i es
reaprofiten. Amb `--refresca` es tornen a baixar totes.

**Publicació.** No cal fer el pas 5 a mà per publicar. Quan arriba a `main` un canvi a `web/`,
`creixement/pagina/` o `creixement/dades/`, GitHub Actions (`.github/workflows/pages.yml`) fa el pas 5 i
publica `_site/` a https://brunomazorra.github.io/reserca-vivenda/. Els passos 1 a 4 sí que s'han de fer a mà, i
després cal fer commit dels fitxers que generen.

## Fonts

Totes es baixen soles. A `dades/brut/` cada una es desa amb el nom de la primera columna.

| Fitxer a `dades/brut/` | Font | Adreça | Què se'n fa servir |
|---|---|---|---|
| `codis_municipis.ssv` | Idescat, codis de municipis | https://www.idescat.cat/codis/?id=50&n=9&f=ssv | Llista dels 947 municipis actuals, amb el nom i la comarca |
| `shd1341_poblacio_fet_municipis.ssv` | Idescat, evolució de la població de fet (sèries històriques) | https://www.idescat.cat/pub/?id=shd&n=1341&by=mun&lang=ca&f=ssv | Població de 1981, 1986 i 1991 |
| `pmh446_<any>.ssv`, 1998–2025 | Idescat, padró municipal d'habitants | `https://www.idescat.cat/pub/?id=pmh&n=446&by=mun&lang=ca&f=ssv&t=<any>00` | Població total a 1 de gener |
| `aec15224_comarques_<any>.ssv`, 1981–2025 | Idescat, població a 1 de gener per comarques (estimacions de població) | `https://www.idescat.cat/indicadors/?id=aec&n=15224&t=<any>00&lang=ca&f=ssv` | Fila «Catalunya»: total de cada any |
| `aec15223_provincies.ssv` | Idescat, població a 1 de gener per províncies | https://www.idescat.cat/indicadors/?id=aec&n=15223&lang=ca&f=ssv | 2025 i 2026 (provisional) de cada província, i el total de Catalunya del 2026 |
| `aec15228_superficie_municipis_grans.ssv` | Idescat, densitat de població dels municipis de més de 20.000 habitants | https://www.idescat.cat/indicadors/?id=aec&n=15228&lang=ca&f=ssv | Superfície oficial (km²) |
| `emex_<codi>.json` | Idescat, El municipi en xifres (API) | `https://api.idescat.cat/emex/v1/dades.json?id=<codi>&lang=ca` | Superfície oficial (indicador f271), només per als 3 municipis de què es parla més avall |
| `es-atlas-0.6.0_municipalities.json` | INE, contorns municipals, via [es-atlas](https://github.com/martgnz/es-atlas) 0.6.0 | https://cdn.jsdelivr.net/npm/es-atlas@0.6.0/es/municipalities.json | Contorn de cada municipi |
| `censph7952_<any>.ssv`, 1991, 2001, 2011 i 2021 | Idescat, cens de població i habitatges: llars | `https://www.idescat.cat/pub/?id=censph&n=7952&by=mun&lang=ca&f=ssv&t=<any>00` | Nombre de llars |
| `censph450_<any>.ssv`, els mateixos anys | Idescat, cens: grandària mitjana de la llar | Igual, amb `n=450` | Persones per llar |
| `censph309_2021.ssv` | Idescat, cens del 2021: habitatges principals per any de construcció | Igual, amb `n=309` i `t=202100` | Habitatges construïts en cada dècada |

## Què fa cada pas

### 1. `poblacio_municipis.mjs`: població, contorns i superfícies

- **Municipis.** Els 947 actuals, amb el codi d'Idescat de 6 dígits. Els contorns d'es-atlas porten el codi de
  l'INE, que són els 5 primers dígits del d'Idescat.
- **Població.** Les dades per municipi són de 1981, 1986 i 1991 (població de fet) i de 1998 a 2025 (padró a
  1 de gener). Els anys entremig no es guarden: els interpola la pàgina.
- **Municipis creats després de 1981.** N'hi ha 12. Mentre no existien, la població del municipi del qual es
  van separar es reparteix entre tots dos segons la superfície, és a dir, amb la mateixa densitat:
  Salt i Sarrià de Ter (de Girona), Sant Julià del Llor i Bonmatí (d'Amer), Gimenells i el Pla de la Font
  (de Lleida), Riu de Cerdanya (d'Urús), l'Aldea (de Tortosa), Salou (de Vila-seca), l'Ampolla (del Perelló),
  la Canonja (de Tarragona), Badia del Vallès (de Cerdanyola del Vallès), la Palma de Cervelló (de Cervelló)
  i Sant Julià de Cerdanyola (de Guardiola de Berguedà).
- **2026.** És l'avanç provisional, que només es publica per províncies. Cada municipi creix entre 2025 i 2026
  igual que la seva província.
- **Totals de Catalunya.** Es guarden les estimacions de població d'Idescat de cada any, de 1981 a 2025, i
  l'avanç del 2026. La pàgina ajusta cada any la suma dels municipis a aquest total. Les dues fonts difereixen
  una mica: el 2025 la suma dels padrons és 8.146.265 i l'estimació, 8.124.126.
- **Contorns.** Es passen a una projecció plana en km: x = (longitud − 1,75) · 111,32 · cos 41,7° i
  y = (latitud − 41,7) · 110,57. Es guarden arrodonits a 20 m.
- **Superfície.**
  - En general, la del contorn.
  - Per als municipis de més de 20.000 habitants, l'oficial d'Idescat.
  - Per a tres municipis amb el contorn buit a es-atlas (Puigdàlber, Sant Hipòlit de Voltregà i Castellfollit
    de la Roca), l'oficial d'El municipi en xifres. A la pàgina es dibuixen com un hexàgon d'aquesta
    superfície.
- **Centre.** El centroide del polígon més gran del municipi. Serveix per posar l'etiqueta i per mesurar la
  distància a Barcelona.

### 2. `habitatge_anells.mjs`: llars i habitatge per anells

- **Anells.**
  - Es mesura la distància en línia recta des de la plaça de Catalunya (2,17° E, 41,387° N) fins al centre de
    cada municipi.
  - Els talls són a 10, 20, 30, 40, 50 i 60 km.
  - Barcelona ciutat es compta a part.
  - Cada municipi va sencer a l'anell on cau el seu centre.
- **Llars.** Una llar és el grup de persones que viuen habitualment al mateix habitatge, siguin família o no.
  És la definició del cens.
- **Persones per llar d'un anell.**
  - Per a cada municipi, llars × persones per llar dona la gent que viu en llars. Se suma i es divideix pel
    total de llars de l'anell.
  - No hi compta qui viu en establiments col·lectius: residències, convents, casernes o presons.
  - Si un municipi no té la mida publicada en un cens (12 de petits el 2011), es fa servir la mitjana dels seus
    altres censos.
  - El cens del 1991 encara té Palmerola, que després es va unir a les Llosses. Com que no és a la llista de
    municipis actuals, no es compta. L'script ho avisa; eren 8 llars.
- **Habitatges nous.**
  - Són els habitatges que el 2021 eren primera residència, segons la dècada en què es van construir.
  - Idescat només publica aquesta taula per als municipis més grans. Cada anell s'escala segons la part de les
    seves llars del 2021 que hi surt: fins a 60 km, més del 99 %.

### 3–5. Figures, pàgina i web

- `figures.mjs` dibuixa els SVG amb el mateix codi de gràfics que la pàgina (`pagina/charts.js`).
- `pagina/build.py` posa dins de `pagina/template.html` el codi de les gràfiques i els dos fitxers de dades.
  La pàgina fa la resta de càlculs quan s'obre:
  - la interpolació entre anys i l'ajust al total de Catalunya;
  - les sumes per anells i els percentatges;
  - els habitatges nous per 1.000 habitants i any: habitatges de la dècada ÷ població mitjana de l'anell en
    aquella dècada ÷ 10 × 1.000;
  - la partició del creixement de les llars: creixement de la població en llars + la resta, que ve del canvi en
    el nombre de persones per llar.
- `web/build.py --pages _site` munta l'Atles i hi copia la pàgina sencera a `_site/catalunya-relleu/`.

## Si no surt igual

- **Idescat pot revisar les dades.** Els fitxers del repositori es van fer amb descàrregues del 18/11/2026.
  Quan l'avanç provisional del 2026 sigui definitiu, o si es revisa algun padró o estimació, `--comprova` dirà
  exactament quins valors han canviat.
- **Els contorns són d'una versió fixa** d'es-atlas (0.6.0), de manera que no canvien.
- **Les taules d'Idescat porten l'any a la capçalera.** Els scripts comproven que cada fitxer baixat sigui de
  l'any demanat i s'aturen amb un missatge si no ho és.
