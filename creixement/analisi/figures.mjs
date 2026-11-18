// Renders the README figures (figures/*.svg) with the same chart code the page uses.
//   node creixement/analisi/figures.mjs
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'pagina/charts.js'), 'utf8'), ctx);
const CH = ctx.RelleuCharts;
const D = JSON.parse(fs.readFileSync(path.join(root, 'dades/municipis.json'), 'utf8'));

// ---- population per ring, as in the page ----
const Y0 = D.y0, Y1 = D.y1, YRS = D.years, M = D.munis, NM = M.length;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function computePops(y, out) {
  let k = 0; while (k < YRS.length - 2 && YRS[k + 1] <= y) k++;
  const f = clamp((y - YRS[k]) / (YRS[k + 1] - YRS[k]), 0, 1);
  let s = 0; for (let m = 0; m < NM; m++) { const p = M[m].p; out[m] = p[k] + (p[k + 1] - p[k]) * f; s += out[m]; }
  const sc = D.totals[y - Y0] / s; for (let m = 0; m < NM; m++) out[m] *= sc;
}
const kx = 111.32 * Math.cos(41.7 * Math.PI / 180), ky = 110.57, PC = [(2.17 - 1.75) * kx, (41.387 - 41.7) * ky];
const EDGES = [0, 10, 20, 30, 40, 50, 60, 1e9];
const NAMES = ['Barcelona ciutat', '0–10 km', '10–20 km', '20–30 km', '30–40 km', '40–50 km', '50–60 km', 'Més de 60 km'];
const bcn = M.findIndex(m => m.n === 'Barcelona');
const band = M.map((m, i) => { const d = Math.hypot(m.c[0] - PC[0], m.c[1] - PC[1]); return i === bcn ? 0 : 1 + EDGES.findIndex((r, k) => d >= r && d < EDGES[k + 1]); });
const YEARS = [], ser = NAMES.map(() => []), w = new Float64Array(NM);
for (let y = Y0; y <= Y1; y++) { YEARS.push(y); computePops(y, w); const s = new Array(NAMES.length).fill(0); for (let m = 0; m < NM; m++) s[band[m]] += w[m]; s.forEach((v, b) => ser[b].push(v)); }

// ---- colour: change since 1981, light theme stops of the page ----
const P = ['#2c5d99', '#8fb0d6', '#e8e4d8', '#f3d27a', '#ee9442', '#c9412d', '#6b1531'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
const STOPS = [0.7, 0.9, 1, 1.25, 1.75, 3, 5].map(Math.log2);
function chg(r) {
  const v = Math.log2(Math.max(r, 0.01));
  if (v <= STOPS[0]) return `rgb(${P[0]})`; if (v >= STOPS[6]) return `rgb(${P[6]})`;
  let k = 0; while (v > STOPS[k + 1]) k++;
  const t = (v - STOPS[k]) / (STOPS[k + 1] - STOPS[k]);
  return `rgb(${P[k].map((c, j) => Math.round(c + (P[k + 1][j] - c) * t))})`;
}

const fmt = new Intl.NumberFormat('ca-ES'), fmt2 = new Intl.NumberFormat('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = r => { const v = Math.round(100 * (r - 1)); return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' %'; };
const short = v => v >= 1e6 ? fmt2.format(v / 1e6) + ' M' : fmt.format(Math.round(v / 1000)) + ' mil';
const CARD = '#f5f7f6', SANS = '-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif';
const STYLE = `<style>text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;fill:#5a6561}
.t{font-family:${SANS};fill:#1c2321}.h{font-size:17px;font-weight:700}.s{font-size:12.5px;fill:#5a6561}.b{font-size:20px;font-weight:700}.n{font-size:13px;font-weight:650}
tspan.nm{font-family:${SANS};fill:#1c2321;font-size:12px;font-weight:600}text.nm{font-family:${SANS};fill:#1c2321;font-size:12px}tspan.vl{fill:#5a6561}
.grid{stroke:rgba(28,35,33,.14)}.zero{stroke:#5a6561}.edge{fill:none;stroke:#1c2321;stroke-width:1.5}.leader{fill:none;stroke:#5a6561}
.cur{display:none}.ln{fill:none;stroke:#1c2321;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.wash{fill-opacity:.6}</style>`;
const wrap = (W, H, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${STYLE}<rect width="${W}" height="${H}" rx="12" fill="${CARD}"/>${body}</svg>\n`;
const last = YEARS.length - 1;

// 1) stacked population up to 60 km
{
  const W = 960, H = 470, cw = W - 40;
  const g = CH.stack({
    id: 'st', w: cw, h: 400, years: YEARS, ticks: [1981, 1991, 2001, 2011, 2021, 2026], labelW: 162, step: 1e6, surface: CARD,
    layers: NAMES.slice(0, 7).map((n, b) => ({ label: b === 0 ? 'Barcelona' : 'fins a ' + EDGES[b] + ' km', ser: ser[b] })),
    color: (b, i) => chg(ser[b][i] / ser[b][0]), fmtVal: v => fmt2.format(v / 1e6) + ' M', fmtTick: v => v ? fmt.format(v / 1e6) + ' M' : '0'
  });
  const tot = i => g.cum[6][i];
  const body = `<text class="t h" x="20" y="32">Quanta gent viu fins a 10, 20, 30… 60 km de la plaça de Catalunya</text>` +
    `<text class="t s" x="20" y="52">Franges: anells de 10 km. Color: canvi de l'anell des de 1981. Fins a 60 km: ${short(tot(0))} (1981) → ${short(tot(last))} (2026 p), ${pct(tot(last) / tot(0))}.</text>` +
    `<g transform="translate(20 62)">${g.svg}</g>`;
  fs.writeFileSync(path.join(root, 'figures/poblacio-fins-60km.svg'), wrap(W, H, body));
}

// 2) change since 1981, one panel per ring
{
  const cols = 4, pw = 215, ph = 128, gx = 18, gy = 34, W = 20 * 2 + cols * pw + (cols - 1) * gx, top = 64;
  let body = `<text class="t h" x="20" y="32">Canvi de població des de 1981, anell per anell</text><text class="t s" x="20" y="52">Percentatge respecte a 1981, mateixa escala a tots els gràfics. Dades: Idescat; 2026 provisional.</text>`;
  NAMES.forEach((n, k) => {
    const x = 20 + (k % cols) * (pw + gx), y = top + Math.floor(k / cols) * (ph + 40 + gy);
    const g = CH.mini({ id: 'm' + k, w: pw, h: ph, years: YEARS, ser: ser[k], color: i => chg(ser[k][i] / ser[k][0]), surface: CARD, lo: -25, hi: 165, grid: [0, 50, 100, 150], ticks: [1981, 2026] });
    body += `<text class="t n" x="${x}" y="${y + 14}">${n}</text><text class="t b" x="${x + pw}" y="${y + 16}" text-anchor="end">${pct(ser[k][last] / ser[k][0])}</text>`;
    body += `<text x="${x}" y="${y + 32}">${short(ser[k][0])} → ${short(ser[k][last])}</text><g transform="translate(${x} ${y + 38})">${g.svg}</g>`;
  });
  const H = top + 2 * (ph + 40) + gy;
  fs.writeFileSync(path.join(root, 'figures/canvi-per-anells.svg'), wrap(W, H, body));
}
// 3) households 1991–2021 split into population growth and household size, with new dwellings
{
  const HD = JSON.parse(fs.readFileSync(path.join(root, 'dades/habitatge-anells.json'), 'utf8'));
  const sum = a => a.slice(0, 7).reduce((x, y) => x + y, 0);
  const pick = a => a.slice(0, 7).concat([sum(a), a[7]]);
  const ll0 = pick(HD.households[0]), ll1 = pick(HD.households[3]), p0 = pick(HD.householdPop[0]), p1 = pick(HD.householdPop[3]);
  const nb = pick(HD.built[1].map((v, r) => v + HD.built[2][r] + HD.built[3][r]));
  const rows = NAMES.slice(0, 7).map((n, k) => k === 0 ? 'Barcelona' : n).concat(['Fins a 60 km', 'Més de 60 km']);
  const pop = rows.map((_, i) => 100 * (p1[i] / p0[i] - 1)), hh = rows.map((_, i) => 100 * (ll1[i] / ll0[i] - 1));
  const p1s = v => (v >= 0 ? '+' : '−') + Math.round(Math.abs(v)) + ' %';
  const W = 960, g = CH.split({ w: W - 40, rows, labelW: 110, valueW: 190, rowH: 34, surface: CARD, lo: -20, hi: 160, ticks: [-20, 0, 20, 40, 60, 80, 100, 120, 140, 160], fmtTick: v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' %',
    colors: { a: '#6250d6', b: '#eda100' }, a: pop, b: rows.map((_, i) => hh[i] - pop[i]), mark: rows.map((_, i) => 100 * nb[i] / ll0[i]),
    value: i => `<tspan class="vl">llars </tspan><tspan class="vv">${p1s(hh[i])}</tspan><tspan class="vl" dx="10">habitatges </tspan><tspan class="vv">${p1s(100 * nb[i] / ll0[i])}</tspan>` });
  const H = 92 + g.h + 10;
  const key = `<rect x="20" y="66" width="12" height="10" rx="2" fill="#6250d6"/><text class="t s" x="38" y="75">Creixement de la població</text><rect x="210" y="66" width="12" height="10" rx="2" fill="#eda100"/><text class="t s" x="228" y="75">Llars més petites</text><rect x="360" y="64" width="2.5" height="14" rx="1" fill="#1c2321"/><text class="t s" x="370" y="75">Habitatges nous (primeres residències del 2021 construïdes 1991–2020)</text>`;
  const body = `<text class="t h" x="20" y="32">Llars noves i habitatges nous, 1991–2021, en % de les llars del 1991</text><text class="t s" x="20" y="52">Censos 1991 i 2021 (Idescat). Les llars han crescut més que la població perquè cada llar té menys gent.</text>${key}` +
    `<g transform="translate(20 92)">${g.svg}</g>`;
  fs.writeFileSync(path.join(root, 'figures/llars-i-habitatges.svg'), wrap(W, H, body).replace('.cur{display:none}', '.cur{display:none}.mark{stroke:#1c2321;stroke-width:2.5;stroke-linecap:round}tspan.vv{fill:#1c2321;font-weight:600}'));
}
console.log('ok', NAMES.map((n, k) => n + ' ' + pct(ser[k][last] / ser[k][0])).join(' | '));
