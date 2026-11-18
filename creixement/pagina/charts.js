/* Catalunya en relleu: chart drawing shared by the page (index.html) and the README image script.
   Pure functions: they take sizes, series and colours and return SVG markup plus the scales,
   so the page can add its moving year cursor and tooltips on top. */
(function (root) {
  const f1 = v => String(Math.round(v * 10) / 10);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const line = pts => 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L');

  function gradient(id, x0, x1, n, colorAt) {
    let s = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(x0)}" y1="0" x2="${f1(x1)}" y2="0">`;
    for (let i = 0; i < n; i++) s += `<stop offset="${(i / (n - 1)).toFixed(4)}" stop-color="${colorAt(i)}"/>`;
    return s + '</linearGradient>';
  }
  function xAxis(years, ticks, X, y, x0, x1) {
    const Y0 = years[0];
    return ticks.map(t => {
      const x = X(t - Y0), anchor = x - x0 < 14 ? 'start' : x1 - x < 14 ? 'end' : 'middle';
      return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${t}</text>`;
    }).join('');
  }

  /* Stacked population by distance ring. The top edge of layer b is everyone living
     up to that ring (Barcelona, up to 10 km, up to 20 km ...).
     o = { id, w, h, years, layers: [{ label, ser }], color(b, i), surface, fmtVal(v), fmtTick(v),
           labelW, ticks, step } */
  function stack(o) {
    const n = o.years.length, L = o.layers.length;
    const cum = [];
    for (let b = 0; b < L; b++) cum.push(o.layers[b].ser.map((v, i) => v + (b ? cum[b - 1][i] : 0)));
    const top = Math.max(...cum[L - 1]), step = o.step || 1e6;
    const hi = top * 1.05;
    const m = { l: 40, r: o.labelW, t: 10, b: 24 };
    const x0 = m.l, x1 = o.w - m.r, y0 = m.t, y1 = o.h - m.b;
    const X = i => x0 + (x1 - x0) * i / (n - 1), Y = v => y1 - (y1 - y0) * v / hi;
    let s = '<defs>';
    for (let b = 0; b < L; b++) s += gradient(`${o.id}g${b}`, x0, x1, n, i => o.color(b, i));
    s += '</defs>';
    for (let v = step; v <= hi; v += step) s += `<line class="grid" x1="${x0}" x2="${f1(x1)}" y1="${f1(Y(v))}" y2="${f1(Y(v))}"/>`;
    for (let v = 0; v <= hi; v += step) s += `<text x="${x0 - 6}" y="${f1(Y(v) + 3.5)}" text-anchor="end">${o.fmtTick(v)}</text>`;
    for (let b = 0; b < L; b++) {
      const upper = cum[b].map((v, i) => [X(i), Y(v)]);
      const lower = (b ? cum[b - 1] : cum[b].map(() => 0)).map((v, i) => [X(i), Y(v)]).reverse();
      s += `<path d="${line(upper.concat(lower))}Z" fill="url(#${o.id}g${b})"/>`;
    }
    // 2px surface gap between neighbouring rings, then the outer edge in ink
    for (let b = 0; b < L - 1; b++) s += `<path fill="none" stroke="${o.surface}" stroke-width="2" stroke-linejoin="round" d="${line(cum[b].map((v, i) => [X(i), Y(v)]))}"/>`;
    s += `<path class="edge" d="${line(cum[L - 1].map((v, i) => [X(i), Y(v)]))}"/>`;
    s += `<line class="zero" x1="${x0}" x2="${f1(x1)}" y1="${f1(y1)}" y2="${f1(y1)}"/>`;
    s += xAxis(o.years, o.ticks, X, y1 + 16, x0, x1);
    // end labels: cumulative totals, nudged apart with a short leader where they crowd
    const edgeY = cum.map(c => Y(c[n - 1])), ly = edgeY.slice(), gap = 14;
    for (let b = 1; b < L; b++) if (ly[b] > ly[b - 1] - gap) ly[b] = ly[b - 1] - gap;
    const over = y0 + 4 - ly[L - 1];
    if (over > 0) for (let b = 0; b < L; b++) ly[b] += over;
    for (let b = 0; b < L; b++) {
      s += `<path class="leader" d="M${f1(x1 + 2)} ${f1(edgeY[b])}L${f1(x1 + 7)} ${f1(ly[b])}L${f1(x1 + 9)} ${f1(ly[b])}"/>`;
      s += `<text x="${f1(x1 + 12)}" y="${f1(ly[b] + 4)}"><tspan class="nm">${esc(o.layers[b].label)}</tspan><tspan class="vl" dx="5">${esc(o.fmtVal(cum[b][n - 1]))}</tspan></text>`;
    }
    s += `<g class="cur" id="${o.id}cur"><line class="cursor" x1="0" x2="0" y1="${y0}" y2="${f1(y1)}"/>`;
    for (let b = 0; b < L; b++) s += `<circle class="dot" r="3.5" cx="0" cy="0" stroke="${o.surface}" stroke-width="2"/>`;
    s += '</g>';
    return { svg: s, X, Y, x0, x1, y0, y1, cum, hi };
  }

  /* One ring: % change since the first year, same vertical scale in every panel.
     o = { id, w, h, years, ser, color(i), surface, lo, hi, grid, ticks } */
  function mini(o) {
    const n = o.years.length, pct = o.ser.map(v => 100 * (v / o.ser[0] - 1));
    const m = { l: 30, r: 6, t: 8, b: 18 };
    const x0 = m.l, x1 = o.w - m.r, y0 = m.t, y1 = o.h - m.b;
    const X = i => x0 + (x1 - x0) * i / (n - 1), Y = v => y1 - (y1 - y0) * (v - o.lo) / (o.hi - o.lo);
    let s = `<defs>${gradient(o.id + 'g', x0, x1, n, o.color)}</defs>`;
    for (const v of o.grid) s += `<line class="${v === 0 ? 'zero' : 'grid'}" x1="${x0}" x2="${f1(x1)}" y1="${f1(Y(v))}" y2="${f1(Y(v))}"/><text x="${x0 - 4}" y="${f1(Y(v) + 3.5)}" text-anchor="end">${v > 0 ? '+' + v : v}</text>`;
    const pts = pct.map((v, i) => [X(i), Y(v)]);
    s += `<path class="wash" fill="url(#${o.id}g)" d="${line(pts.concat([[X(n - 1), Y(0)], [X(0), Y(0)]]))}Z"/>`;
    s += `<path class="ln" d="${line(pts)}"/>`;
    s += xAxis(o.years, o.ticks, X, y1 + 14, x0, x1);
    s += `<g class="cur" id="${o.id}cur"><line class="cursor" x1="0" x2="0" y1="${y0}" y2="${f1(y1)}"/><circle class="dot" r="4" cx="0" cy="0" stroke="${o.surface}" stroke-width="2"/></g>`;
    return { svg: s, X, Y, x0, x1, y0, y1, pct };
  }

  /* Dot plot: one row per ring, one dot per series (a decade or a census year).
     o = { w, rows: [label], series: [{ name, color, values: [] }], lo, hi, ticks, fmtTick, labelW, rowH, surface } */
  function dots(o) {
    const R = o.rows.length, rowH = o.rowH || 30, m = { l: o.labelW, r: 14, t: 24, b: 22 };
    const x0 = m.l, x1 = o.w - m.r, h = m.t + R * rowH + m.b;
    const X = v => x0 + (x1 - x0) * (v - o.lo) / (o.hi - o.lo), RY = i => m.t + i * rowH + rowH / 2;
    let s = '';
    for (const t of o.ticks) s += `<line class="grid" x1="${f1(X(t))}" x2="${f1(X(t))}" y1="${m.t - 6}" y2="${f1(m.t + R * rowH)}"/><text x="${f1(X(t))}" y="${f1(m.t + R * rowH + 15)}" text-anchor="middle">${o.fmtTick(t)}</text>`;
    // direct labels go on the row whose dots are furthest apart, if they fit
    let best = -1, bestGap = 0;
    o.rows.forEach((_, i) => {
      const xs = o.series.map(se => X(se.values[i])).sort((a, b) => a - b);
      let g = Infinity; for (let k = 1; k < xs.length; k++) g = Math.min(g, xs[k] - xs[k - 1]);
      if (g > bestGap) { bestGap = g; best = i; }
    });
    o.rows.forEach((label, i) => {
      const y = RY(i), xs = o.series.map(se => X(se.values[i]));
      s += `<text class="nm" x="0" y="${f1(y + 4)}">${esc(label)}</text>`;
      s += `<line class="leader" x1="${f1(Math.min(...xs))}" x2="${f1(Math.max(...xs))}" y1="${f1(y)}" y2="${f1(y)}"/>`;
      o.series.forEach((se, k) => { s += `<circle cx="${f1(xs[k])}" cy="${f1(y)}" r="5.5" fill="${se.color}" stroke="${o.surface}" stroke-width="2"/>`; });
      if (i === best && bestGap >= 58) o.series.forEach((se, k) => { s += `<text x="${f1(xs[k])}" y="${f1(y - 11)}" text-anchor="middle">${esc(se.name)}</text>`; });
    });
    return { svg: s, h, X, RY, x0, x1, t: m.t, rowH };
  }

  /* Bars that split one change into two parts (which may have opposite signs), plus a tick for a third value.
     o = { w, rows: [label], a: [], b: [], mark: [], lo, hi, ticks, fmtTick, colors: { a, b }, labelW, valueW, rowH, surface, value(i) } */
  function split(o) {
    const R = o.rows.length, rowH = o.rowH || 36, m = { l: o.labelW, r: o.valueW, t: 8, b: 22 };
    const x0 = m.l, x1 = o.w - m.r, h = m.t + R * rowH + m.b, bh = 14;
    const X = v => x0 + (x1 - x0) * (v - o.lo) / (o.hi - o.lo), RY = i => m.t + i * rowH + rowH / 2, z = X(0);
    let s = '';
    for (const t of o.ticks) s += `<line class="${t === 0 ? 'zero' : 'grid'}" x1="${f1(X(t))}" x2="${f1(X(t))}" y1="${m.t}" y2="${f1(m.t + R * rowH)}"/><text x="${f1(X(t))}" y="${f1(m.t + R * rowH + 15)}" text-anchor="middle">${o.fmtTick(t)}</text>`;
    o.rows.forEach((label, i) => {
      const y = RY(i), a = o.a[i], b = o.b[i], same = a === 0 || Math.sign(a) === Math.sign(b);
      const bs = same ? a : 0;
      const rect = (v0, v1, fill) => { const xa = Math.min(X(v0), X(v1)), w = Math.abs(X(v1) - X(v0)); return w < 0.5 ? '' : `<rect x="${f1(xa)}" y="${f1(y - bh / 2)}" width="${f1(w)}" height="${bh}" rx="2" fill="${fill}"/>`; };
      s += `<text class="nm" x="0" y="${f1(y + 4)}">${esc(label)}</text>`;
      s += rect(0, a, o.colors.a) + rect(bs, bs + b, o.colors.b);
      const jx = same ? X(a) : z;
      s += `<line x1="${f1(jx)}" x2="${f1(jx)}" y1="${f1(y - bh / 2 - 1)}" y2="${f1(y + bh / 2 + 1)}" stroke="${o.surface}" stroke-width="2"/>`;
      s += `<line class="mark" x1="${f1(X(o.mark[i]))}" x2="${f1(X(o.mark[i]))}" y1="${f1(y - 11)}" y2="${f1(y + 11)}"/>`;
      s += `<text x="${f1(x1 + 10)}" y="${f1(y + 4)}">${o.value(i)}</text>`;
    });
    return { svg: s, h, X, RY, x0, x1, t: m.t, rowH };
  }

  root.RelleuCharts = { stack, mini, dots, split, esc };
})(typeof window !== 'undefined' ? window : globalThis);
