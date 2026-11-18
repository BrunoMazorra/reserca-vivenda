// Descàrregues compartides pels scripts d'anàlisi de creixement/.
// Cada fitxer es desa a creixement/dades/brut/ la primera vegada; després es llegeix d'allà.
// Amb --refresca es tornen a baixar tots. La carpeta brut/ no es guarda al repositori.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const TEMA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const BRUT = path.join(TEMA, 'dades/brut');
const REFRESCA = process.argv.includes('--refresca');
const espera = ms => new Promise(r => setTimeout(r, ms));

export async function baixa(nom, url) {
  const fitxer = path.join(BRUT, nom);
  if (!REFRESCA && fs.existsSync(fitxer)) return fs.readFileSync(fitxer, 'utf8');
  fs.mkdirSync(BRUT, { recursive: true });
  for (let intent = 1; ; intent++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'reserca-vivenda (dades obertes)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      fs.writeFileSync(fitxer, text);
      await espera(300); // sense pressa: no carreguem el servidor
      return text;
    } catch (e) {
      if (intent >= 4) throw new Error(`No s'ha pogut baixar ${url}: ${e.message}`);
      await espera(2000 * intent);
    }
  }
}

// Taules SSV d'Idescat: punt i coma, capçalera a la fila que comença per "Codi;" (o ";").
export function llegeixSsv(text, capcalera = 'Codi;') {
  const files = text.replace(/^﻿/, '').split(/\r?\n/);
  const i = files.findIndex(r => r.startsWith(capcalera));
  if (i < 0) throw new Error('Taula sense capçalera ' + capcalera);
  return { meta: files.slice(0, i), cap: files[i].split(';'), files: files.slice(i + 1).filter(r => r.trim()).map(r => r.split(';')) };
}
export const num = s => s == null || s === '' || s === '..' || s === '-' ? NaN : parseFloat(s.replace(/\./g, '').replace(',', '.'));

// Compara el resultat amb el fitxer guardat al repositori i diu què ha canviat.
export function comprova(nouObj, fitxer) {
  if (!fs.existsSync(fitxer)) { console.log(`(no hi ha ${path.basename(fitxer)} per comparar)`); return true; }
  const vell = JSON.parse(fs.readFileSync(fitxer, 'utf8'));
  const difs = [];
  (function camina(a, b, ruta) {
    if (difs.length > 40) return;
    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) { difs.push(`${ruta}: tipus diferent`); return; }
    if (Array.isArray(a)) { if (a.length !== b.length) difs.push(`${ruta}: ${b.length} elements, abans ${a.length}`); for (let i = 0; i < Math.min(a.length, b.length); i++) camina(a[i], b[i], `${ruta}[${i}]`); return; }
    if (a && typeof a === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { if (!(k in a)) difs.push(`${ruta}.${k}: nou`); else if (!(k in b)) difs.push(`${ruta}.${k}: ja no hi és`); else camina(a[k], b[k], `${ruta}.${k}`); } return; }
    if (a !== b) difs.push(`${ruta}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
  })(vell, nouObj, path.basename(fitxer));
  if (!difs.length) { console.log(`✓ ${path.basename(fitxer)}: idèntic al del repositori`); return true; }
  console.log(`✗ ${path.basename(fitxer)}: ${difs.length > 40 ? 'més de 40' : difs.length} diferències`);
  difs.slice(0, 40).forEach(d => console.log('   ' + d));
  return false;
}
