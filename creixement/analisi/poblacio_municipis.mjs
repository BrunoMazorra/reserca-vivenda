// Construeix creixement/dades/municipis.json: població de cada municipi de Catalunya (1981–2026),
// el seu contorn, la superfície i el centre, a partir de fonts públiques.
//
//   node creixement/analisi/poblacio_municipis.mjs              baixa el que falti i escriu el fitxer
//   node creixement/analisi/poblacio_municipis.mjs --comprova   no escriu res: diu si surt igual que el guardat
//   node creixement/analisi/poblacio_municipis.mjs --refresca   torna a baixar totes les fonts
//
// Requereix Node 18 o més nou (fetch). No fa servir cap paquet extern.
// Els passos i les decisions estan explicats a creixement/REPRODUCIBILITAT.md.
import fs from 'fs';
import path from 'path';
import { TEMA, baixa, llegeixSsv, num, comprova } from './descarrega.mjs';

const SORTIDA = path.join(TEMA, 'dades/municipis.json');
const Y_PADRO = Array.from({ length: 2025 - 1998 + 1 }, (_, i) => 1998 + i);
const ANYS = [1981, 1986, 1991, ...Y_PADRO];

// ---------- 1. Fonts ----------
const codis = llegeixSsv(await baixa('codis_municipis.ssv', 'https://www.idescat.cat/codis/?id=50&n=9&f=ssv'));
const shd = llegeixSsv(await baixa('shd1341_poblacio_fet_municipis.ssv', 'https://www.idescat.cat/pub/?id=shd&n=1341&by=mun&lang=ca&f=ssv'));
const padro = {};
for (const y of Y_PADRO) {
  const t = await baixa(`pmh446_${y}.ssv`, `https://www.idescat.cat/pub/?id=pmh&n=446&by=mun&lang=ca&f=ssv&t=${y}00`);
  const taula = llegeixSsv(t);
  if (!taula.meta.some(r => r.includes(String(y)))) throw new Error(`El padró baixat no és del ${y}`);
  padro[y] = taula;
}
const totals = [];
for (let y = 1981; y <= 2025; y++) {
  const taula = llegeixSsv(await baixa(`aec15224_comarques_${y}.ssv`, `https://www.idescat.cat/indicadors/?id=aec&n=15224&t=${y}00&lang=ca&f=ssv`), ';');
  const cat = taula.files.find(q => q[0] === 'Catalunya');
  if (!cat) throw new Error('Sense total de Catalunya el ' + y);
  totals.push(num(cat[1]));
}
const prov = llegeixSsv(await baixa('aec15223_provincies.ssv', 'https://www.idescat.cat/indicadors/?id=aec&n=15223&lang=ca&f=ssv'), ';');
const fila = etiqueta => { const q = prov.files.find(r => r[0] === etiqueta); if (!q) throw new Error('Sense fila ' + etiqueta + ' a la taula de províncies'); return Object.fromEntries(prov.cap.map((c, i) => [c, num(q[i])])); };
const p26 = fila('2026 (p)'), p25 = fila('2025');
totals.push(p26.Catalunya);
const FACTOR_2026 = { '08': p26.Barcelona / p25.Barcelona, '17': p26.Girona / p25.Girona, '25': p26.Lleida / p25.Lleida, '43': p26.Tarragona / p25.Tarragona };
const grans = llegeixSsv(await baixa('aec15228_superficie_municipis_grans.ssv', 'https://www.idescat.cat/indicadors/?id=aec&n=15228&lang=ca&f=ssv'), ';');
const topo = JSON.parse(await baixa('es-atlas-0.6.0_municipalities.json', 'https://cdn.jsdelivr.net/npm/es-atlas@0.6.0/es/municipalities.json'));

// ---------- 2. Municipis actuals ----------
const iCodi = codis.cap.indexOf('Codi'), iNom = codis.cap.indexOf('Nom'), iCom = codis.cap.indexOf('Nom comarca');
const mun = Object.fromEntries(codis.files.filter(q => /^\d{6}$/.test(q[iCodi])).map(q => [q[iCodi], { nom: q[iNom], com: q[iCom] }]));
const CODIS = Object.keys(mun).sort();
// "Hospitalet de Llobregat, l'" -> "l'Hospitalet de Llobregat"
const nomVisible = n => { const m = n.match(/^(.*), (el|la|els|les|l')$/); return m ? (m[2] === "l'" ? "l'" + m[1] : m[2] + ' ' + m[1]) : n; };

// ---------- 3. Contorns (TopoJSON d'es-atlas, mateix algorisme que topojson-client) ----------
function contorns(geom) {
  const tr = topo.transform, arcs = topo.arcs; let x0 = 0, y0 = 0;
  const punt = (p, i) => { if (!i) x0 = y0 = 0; return tr ? [(x0 += p[0]) * tr.scale[0] + tr.translate[0], (y0 += p[1]) * tr.scale[1] + tr.translate[1]] : [p[0], p[1]]; };
  const inverteix = (a, n) => { let t, j = a.length, i = j - n; while (i < --j) t = a[i], a[i++] = a[j], a[j] = t; };
  const arc = (i, pts) => { if (pts.length) pts.pop(); const a = arcs[i < 0 ? ~i : i]; for (let k = 0; k < a.length; k++) pts.push(punt(a[k], k)); if (i < 0) inverteix(pts, a.length); };
  const anell = as => { const pts = []; for (const i of as) arc(i, pts); if (pts.length < 2) pts.push(pts[0]); while (pts.length < 4) pts.push(pts[0]); return pts; };
  if (geom.type === 'Polygon') return [geom.arcs.map(anell)];
  if (geom.type === 'MultiPolygon') return geom.arcs.map(p => p.map(anell));
  return [];
}
// Projecció plana local en km, centrada a Catalunya
const LON0 = 1.75, LAT0 = 41.7, KX = 111.32 * Math.cos(LAT0 * Math.PI / 180), KY = 110.57, Q = 50; // Q: 1/50 km = 20 m
const projecta = ([lon, lat]) => [(lon - LON0) * KX, (lat - LAT0) * KY];
const area = r => { let a = 0; for (let i = 0, n = r.length; i < n; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % n]; a += x1 * y2 - x2 * y1; } return a / 2; };
const perId = {}; for (const g of topo.objects.municipalities.geometries) perId[g.id] = g;

const geo = {};
for (const c of CODIS) {
  const g = perId[c.slice(0, 5)]; // es-atlas fa servir el codi INE: els 5 primers dígits del codi Idescat
  if (!g) throw new Error('Sense contorn per a ' + c + ' ' + mun[c].nom);
  const lonlat = contorns(g), polys = lonlat.map(p => p.map(r => r.map(projecta)));
  // superfície (km²) i centre (centroide del polígon exterior més gran)
  let sup = 0, millor = null, millorA = 0;
  for (const p of polys) { const a = Math.abs(area(p[0])) - p.slice(1).reduce((s, h) => s + Math.abs(area(h)), 0); sup += a; if (a > millorA) { millorA = a; millor = p[0]; } }
  let centre, degenerat = false;
  if (!millor) { // contorn sense àrea a es-atlas
    degenerat = true; const pts = polys.flat(2);
    centre = [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length];
  } else {
    let cx = 0, cy = 0, A = 0;
    for (let i = 0, n = millor.length; i < n; i++) { const [x1, y1] = millor[i], [x2, y2] = millor[(i + 1) % n]; const f = x1 * y2 - x2 * y1; cx += (x1 + x2) * f; cy += (y1 + y2) * f; A += f; }
    centre = [cx / (3 * A), cy / (3 * A)];
  }
  // contorn quantificat a 20 m i codificat per diferències (el que llegeix la pàgina)
  const gq = [];
  for (const poly of lonlat) {
    const anells = [];
    for (const r of poly) {
      const q = []; let px = null, py = null;
      for (const [lon, lat] of r) { const x = Math.round((lon - LON0) * KX * Q), y = Math.round((lat - LAT0) * KY * Q); if (x === px && y === py) continue; q.push([x, y]); px = x; py = y; }
      if (q.length > 1 && q[0][0] === q[q.length - 1][0] && q[0][1] === q[q.length - 1][1]) q.pop();
      if (q.length < 3 || Math.abs(area(q)) < 1) continue;
      const pla = [q[0][0], q[0][1]]; for (let i = 1; i < q.length; i++) pla.push(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
      anells.push(pla);
    }
    if (anells.length) gq.push(anells);
  }
  geo[c] = { sup: degenerat ? 0.5 : sup, centre, degenerat, g: gq };
}

// ---------- 4. Població ----------
const iShd = Object.fromEntries(shd.files.map(q => [q[0], q])), colShd = y => shd.cap.indexOf(String(y));
const iPadro = Object.fromEntries(Y_PADRO.map(y => [y, Object.fromEntries(padro[y].files.map(q => [q[0], q[padro[y].cap.indexOf('Total')]]))]));
const enter = v => v && /^\d+$/.test(v) ? +v : null;
const pob = {};
for (const c of CODIS) pob[c] = ANYS.map(y => enter(y < 1998 ? iShd[c]?.[colShd(y)] : iPadro[y][c]));
// Municipis creats després de 1981: mentre no existien, la població del municipi del qual es van
// segregar es reparteix entre tots dos segons la superfície (la mateixa densitat).
const SEGREGATS = { // municipi nou: municipi d'origen
  '439044': '431554', '439060': '431042', '089045': '082665', '439076': '431482', '259123': '251207', '089058': '080689',
  '259139': '172060', '439057': '431711', '171557': '170792', '171864': '170792', '089030': '080996', '179032': '170078'
};
for (const [fill, pare] of Object.entries(SEGREGATS)) {
  ANYS.forEach((y, k) => {
    if (pob[fill][k] == null) { const P = pob[pare][k], af = geo[fill].sup, ap = geo[pare].sup; pob[fill][k] = Math.round(P * af / (af + ap)); pob[pare][k] = P - pob[fill][k]; }
  });
}
// Si encara falta algun any, es fa servir el primer valor conegut.
const omplerts = CODIS.filter(c => pob[c].some(v => v == null));
for (const c of omplerts) { const k0 = pob[c].findIndex(v => v != null); pob[c] = pob[c].map(v => v ?? pob[c][k0]); }
// 2026: avanç provisional. Cada municipi creix com la seva província entre 2025 i 2026.
for (const c of CODIS) pob[c].push(Math.round(pob[c][pob[c].length - 1] * FACTOR_2026[c.slice(0, 2)]));

// ---------- 5. Superfícies oficials ----------
// Municipis de més de 20.000 habitants: superfície de la taula d'Idescat (aec 15228).
const iSup = grans.cap.findIndex(c => c.startsWith('Superfície'));
const supGrans = Object.fromEntries(grans.files.filter(q => q[iSup]).map(q => [nomVisible(q[0]), num(q[iSup])]));
// Municipis amb el contorn degenerat a es-atlas: superfície d'El municipi en xifres (Idescat, indicador f271).
for (const c of CODIS.filter(c => geo[c].degenerat)) {
  const fitxa = JSON.parse(await baixa(`emex_${c}.json`, `https://api.idescat.cat/emex/v1/dades.json?id=${c}&lang=ca`));
  const f = JSON.stringify(fitxa).match(/"v":"([0-9.]+),[^"]*","calt":"Superfície","id":"f271"/);
  if (!f) throw new Error('Sense superfície oficial per a ' + c);
  geo[c].supOficial = +f[1];
}

// ---------- 6. Sortida ----------
const r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
const munis = CODIS.map(c => {
  const n = nomVisible(mun[c].nom);
  const a = supGrans[n] ?? geo[c].supOficial ?? r2(geo[c].sup);
  return { id: c, n, com: mun[c].com, a, c: [r1(geo[c].centre[0]), r1(geo[c].centre[1])], p: pob[c], g: geo[c].g };
});
const sortida = { y0: 1981, y1: 2026, years: [...ANYS, 2026], totals, Q, munis };

const nomsGrans = Object.keys(supGrans).filter(n => !munis.some(m => m.n === n));
if (nomsGrans.length) console.warn('Superfícies oficials sense municipi:', nomsGrans.join(', '));
console.log(`${munis.length} municipis; ${omplerts.length} amb anys sense dada (${omplerts.map(c => mun[c].nom).join(', ') || 'cap'}); ` +
  `contorn degenerat: ${CODIS.filter(c => geo[c].degenerat).map(c => `${mun[c].nom} (${geo[c].supOficial} km²)`).join(', ')}`);
const suma = k => munis.reduce((s, m) => s + m.p[k], 0);
console.log(`Suma dels municipis: 1981 ${suma(0)}, 2025 ${suma(ANYS.length - 1)}, 2026 ${suma(ANYS.length)}. Total de Catalunya 2026 (p): ${totals[totals.length - 1]}`);

if (process.argv.includes('--comprova')) process.exitCode = comprova(sortida, SORTIDA) ? 0 : 1;
else { fs.writeFileSync(SORTIDA, JSON.stringify(sortida)); console.log('escrit', path.relative(process.cwd(), SORTIDA), fs.statSync(SORTIDA).size, 'bytes'); }
