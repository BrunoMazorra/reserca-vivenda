// Construeix creixement/dades/habitatge-anells.json: llars, persones per llar i habitatges nous
// per anells de 10 km al voltant de la plaça de Catalunya, a partir dels censos d'Idescat per municipis.
//
//   node creixement/analisi/habitatge_anells.mjs              baixa el que falti i escriu el fitxer
//   node creixement/analisi/habitatge_anells.mjs --comprova   no escriu res: diu si surt igual que el guardat
//   node creixement/analisi/habitatge_anells.mjs --refresca   torna a baixar totes les taules
//
// Fa servir dades/municipis.json (codi i centre de cada municipi): primer cal poblacio_municipis.mjs.
// Taules (Idescat, Cens de població i habitatges, per municipis):
//   censph 7952  Llars                                         1991, 2001, 2011, 2021
//   censph 450   Grandària mitjana de la llar                  1991, 2001, 2011, 2021
//   censph 309   Habitatges principals per any de construcció  2021 (només els municipis que publica
//                Idescat: cada anell s'escala segons la part de les seves llars que hi surt)
import fs from 'fs';
import path from 'path';
import { TEMA, baixa, llegeixSsv, num, comprova } from './descarrega.mjs';

const root = TEMA;
const D = JSON.parse(fs.readFileSync(path.join(root, 'dades/municipis.json'), 'utf8'));
async function table(n, y) {
  const text = await baixa(`censph${n}_${y}.ssv`, `https://www.idescat.cat/pub/?id=censph&n=${n}&by=mun&lang=ca&f=ssv&t=${y}00`);
  const T = llegeixSsv(text);
  if (!T.meta.some(r => r.includes(String(y)))) throw new Error(`censph ${n}: la taula baixada no és del ${y}`);
  return { head: T.cap, rows: T.files.filter(q => /^\d{6}$/.test(q[0])), cat: T.files.find(q => q[1] === 'Catalunya') };
}

// ring of each municipality: same projection and distances as the page
const kx = 111.32 * Math.cos(41.7 * Math.PI / 180), ky = 110.57, PC = [(2.17 - 1.75) * kx, (41.387 - 41.7) * ky];
const EDGES = [0, 10, 20, 30, 40, 50, 60, 1e9], NR = 8;
const ringOf = {};
for (const m of D.munis) {
  const d = Math.hypot(m.c[0] - PC[0], m.c[1] - PC[1]);
  ringOf[m.id] = m.n === 'Barcelona' ? 0 : 1 + EDGES.findIndex((r, k) => d >= r && d < EDGES[k + 1]);
}

const YEARS = [1991, 2001, 2011, 2021];
const ll = YEARS.map(() => Array(NR).fill(0)), hp = YEARS.map(() => Array(NR).fill(0));
const T = {}, sizes = {};
for (const y of YEARS) T[y] = { L: await table(7952, y), G: await table(450, y) };
for (const y of YEARS) for (const q of T[y].G.rows) { const v = num(q[2]); if (v > 0) (sizes[q[0]] ||= {})[y] = v; }
for (const [k, y] of YEARS.entries()) {
  for (const q of T[y].L.rows) {
    const r = ringOf[q[0]]; if (r == null) { console.warn(`${y}: ${q[1]} (${q[0]}) ja no és un municipi; no es compta`); continue; }
    const n = num(q[2]); if (!(n > 0)) continue;
    // a few small municipalities have no published household size (2011): use the mean of their other censuses
    let s = sizes[q[0]]?.[y];
    if (!(s > 0)) { const o = Object.values(sizes[q[0]] || {}); s = o.length ? o.reduce((a, b) => a + b, 0) / o.length : 2.6; }
    ll[k][r] += n; hp[k][r] += n * s;
  }
}

const B = await table(309, 2021);
const DEC = ['De 1981 a 1990', 'De 1991 a 2000', 'De 2001 a 2010', 'De 2011 a 2020'];
const cols = DEC.map(d => B.head.indexOf(d));
if (cols.some(c => c < 0)) throw new Error('construction-year columns changed: ' + B.head.join('|'));
const built = DEC.map(() => Array(NR).fill(0)), covered = Array(NR).fill(0);
const ll21 = Object.fromEntries(T[2021].L.rows.map(q => [q[0], num(q[2])]));
for (const q of B.rows) {
  const r = ringOf[q[0]]; if (r == null) continue;
  cols.forEach((c, d) => { built[d][r] += num(q[c]) || 0; });
  covered[r] += ll21[q[0]] || 0;
}
const cov = covered.map((c, r) => c / ll[3][r]);
const builtScaled = built.map(row => row.map((v, r) => Math.round(v / cov[r])));

const round = a => a.map(row => row.map(v => Math.round(v)));
const out = {
  source: 'Idescat, Cens de població i habitatges (taules censph 7952, 450 i 309 per municipis)',
  rings: ['Barcelona ciutat', '0–10 km', '10–20 km', '20–30 km', '30–40 km', '40–50 km', '50–60 km', 'Més de 60 km'],
  years: YEARS, households: round(ll), householdPop: round(hp),
  decades: ['1981–1990', '1991–2000', '2001–2010', '2011–2020'], built: builtScaled,
  coverage: cov.map(v => Math.round(v * 1000) / 1000),
  builtCatalunya: cols.map(c => num(B.cat[c]))
};
const SORTIDA = path.join(root, 'dades/habitatge-anells.json');
if (process.argv.includes('--comprova')) process.exitCode = comprova(out, SORTIDA) ? 0 : 1;
else fs.writeFileSync(SORTIDA, JSON.stringify(out) + '\n');
console.log('coverage', out.coverage.join(' '));
out.rings.forEach((n, r) => console.log(n.padEnd(17),
  YEARS.map((y, k) => `${y} llars ${Math.round(ll[k][r] / 1e3)}k pers/llar ${(hp[k][r] / ll[k][r]).toFixed(2)}`).join(' | '),
  '| nous', out.decades.map((d, k) => `${d}: ${Math.round(builtScaled[k][r] / 1e3)}k`).join(' ')));
