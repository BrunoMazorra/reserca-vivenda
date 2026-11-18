#!/usr/bin/env python3
"""Munta la pàgina «Catalunya en relleu» (creixement/pagina/index.html).

Junta template.html, charts.js, ../dades/municipis.json i ../dades/habitatge-anells.json
en una sola pàgina autònoma. web/build.py la llegeix d'aquí per posar-la a l'Atles.

    python3 -I creixement/pagina/build.py                  escriu index.html
    python3 -I creixement/pagina/build.py --fragment OUT   també la versió sense <html>/<head>/<body>
                                                           (la que es publica com a artefacte de claude.ai)
"""
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
TEMA = AQUI.parent
template = (AQUI / 'template.html').read_text(encoding='utf-8')
charts = (AQUI / 'charts.js').read_text(encoding='utf-8')
data = (TEMA / 'dades/municipis.json').read_text(encoding='utf-8')
housing = (TEMA / 'dades/habitatge-anells.json').read_text(encoding='utf-8').strip()
assert '</' not in data and '</' not in housing and '</script' not in charts.lower()

page = template.replace('/*CHARTS*/', charts, 1).replace('/*DATA*/', data, 1).replace('/*HDATA*/', housing, 1)
head, body = page.split('<div id="app">', 1)
doc = (
    '<!doctype html>\n<html lang="ca">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<meta name="description" content="Mapa 3D de la població dels municipis de Catalunya, 1981–2026, '
    'amb població, llars i habitatge per anells de distància a Barcelona.">\n'
    '<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}'
    'body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style>\n'
    + head.rstrip() + '\n</head>\n<body>\n<div id="app">' + body.rstrip() + '\n</body>\n</html>\n'
)
(AQUI / 'index.html').write_text(doc, encoding='utf-8')
print('index.html', len(doc.encode('utf-8')), 'bytes')

if '--fragment' in sys.argv:
    out = pathlib.Path(sys.argv[sys.argv.index('--fragment') + 1])
    out.write_text(page, encoding='utf-8')
    print(out.name, len(page.encode('utf-8')), 'bytes')
