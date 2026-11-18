// Builds dades/habitatge-anells.json: households, household size and new dwellings by 10 km ring
// around Plaça de Catalunya, from the Idescat census tables by municipality.
//   node creixement/analisi/habitatge_anells.mjs            (downloads the tables from idescat.cat)
//
// Censuses 1991, 2001, 2011 and 2021:
//   n=7952  Llars (households)                      -> households per municipality
//   n=450   Grandària mitjana de la llar            -> persons per household
// Census 2021:
//   n=309   Habitatges principals per any de construcció -> dwellings built per decade
//           (only municipalities Idescat publishes; each ring is scaled up by its share of
//            households that are covered, and the Catalonia row is used for the total)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const D = JSON.parse(fs.readFileSync(path.join(root, 'dades/municipis.json'), 'utf8'));
const URL = (n, y) => `https://www.idescat.cat/pub/?id=censph&n=${n}&by=mun&lang=ca&f=ssv&t=${y}00`;
async function table(n, y) {
  const res = await fetch(URL(n, y));
  if (!res.ok) throw new Error(`${n} ${y}: HTTP ${res.status}`);
  const rows = (await res.text()).replace(/^﻿/, '').split(/\r?\n/);
  if (!rows[1].includes(String(y))) throw new Error(`${n} ${y}: got "${rows[1]}"`);
  const h = rows.findIndex(r => r.startsWith('Codi;'));
  const head = rows[h].split(';'), body = rows.slice(h + 1).map(r => r.split(';'));
  return { head, rows: body.filter(q => /^\d{6}$/.test(q[0])), cat: body.find(q => q[1] === 'Catalunya') };
}
const num = s => s == null || s === '' || s === '..' || s === '-' ? NaN : parseFloat(s.replace(/\./g, '').replace(',', '.'));

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
    const r = ringOf[q[0]]; if (r == null) { console.warn(y, 'no ring for', q[0], q[1]); continue; }
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
fs.writeFileSync(path.join(root, 'dades/habitatge-anells.json'), JSON.stringify(out) + '\n');
console.log('coverage', out.coverage.join(' '));
out.rings.forEach((n, r) => console.log(n.padEnd(17),
  YEARS.map((y, k) => `${y} llars ${Math.round(ll[k][r] / 1e3)}k pers/llar ${(hp[k][r] / ll[k][r]).toFixed(2)}`).join(' | '),
  '| nous', out.decades.map((d, k) => `${d}: ${Math.round(builtScaled[k][r] / 1e3)}k`).join(' ')));
