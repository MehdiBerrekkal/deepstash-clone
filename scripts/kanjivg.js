#!/usr/bin/env node
/**
 * Builds src/data/learn/kana-strokes.json: stroke centre lines for hiragana, katakana and a few starter kanji, from
 * KanjiVG (© Ulrich Apel, CC BY-SA 3.0, https://kanjivg.tagaini.net). Each stroke is a list of points in KanjiVG's
 * 109×109 box, in drawing order. The data file keeps KanjiVG's licence (see the app's Credits screen).
 *   node scripts/kanjivg.js
 */
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'src', 'data', 'learn', 'kana-strokes.json');
const HIRAGANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const KANJI = '一二三四五六七八九十人日月山川水火木金土口目手大小上下中本学生先年何今';

/** Points along an SVG path (M/L/C/S/Q/Z, absolute and relative), about every 2 units. */
function sample(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const pts = [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  const num = () => Number(tokens[i++]);
  const push = (px, py) => {
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(px - last[0], py - last[1]) >= 1.5) pts.push([px, py]);
  };
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    for (let t = 0.1; t <= 1.0001; t += 0.1) {
      const u = 1 - t;
      push(u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3);
    }
    cx = x2;
    cy = y2;
    x = x3;
    y = y3;
  };
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case 'M':
        x = ox + num();
        y = oy + num();
        push(x, y);
        cmd = rel ? 'l' : 'L';
        break;
      case 'L':
        x = ox + num();
        y = oy + num();
        push(x, y);
        break;
      case 'C': {
        const x1 = ox + num(), y1 = oy + num(), x2 = ox + num(), y2 = oy + num(), x3 = ox + num(), y3 = oy + num();
        cubic(x1, y1, x2, y2, x3, y3);
        break;
      }
      case 'S': {
        const x1 = 2 * x - cx, y1 = 2 * y - cy;
        const x2 = ox + num(), y2 = oy + num(), x3 = ox + num(), y3 = oy + num();
        cubic(x1, y1, x2, y2, x3, y3);
        break;
      }
      case 'Z':
        break;
      default:
        throw new Error(`Unsupported path command ${cmd}`);
    }
  }
  return pts.map(([a, b]) => [Math.round(a * 10) / 10, Math.round(b * 10) / 10]);
}

(async () => {
  const data = {};
  for (const ch of [...HIRAGANA, ...KATAKANA, ...KANJI]) {
    const code = ch.codePointAt(0).toString(16).padStart(5, '0');
    const res = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${code}.svg`);
    if (!res.ok) {
      console.log('missing', ch);
      continue;
    }
    const svg = await res.text();
    const strokes = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
      .sort((a, b) => Number(a[1]) - Number(b[1]))
      .map((m) => sample(m[2]));
    data[ch] = strokes;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data));
  console.log(`${Object.keys(data).length} characters → ${path.relative(process.cwd(), out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
})();
