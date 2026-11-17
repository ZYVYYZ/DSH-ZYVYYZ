#!/usr/bin/env node
// 零宽水印：把「作者+版本+日期」编进不可见字符。
// 用法：
//   node 水印.mjs --write   把水印写进 00-引言.md / 署名与许可.md / 起壳.md（每页末尾）
//   node 水印.mjs --read    读出这些文件里的水印
// 说明：水印 = 零宽空格(U+200B)=0 与 零宽连字(U+200C)=1，用 U+2060 包起来。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TARGETS = ['00-引言.md', '署名与许可.md', '起壳.md'];
const PAYLOAD = 'ZYVYYZ+7fish v0.2 2026-11-16';
const Z0 = '\u200B', Z1 = '\u200C', WRAP = '\u2060';

function encode(s) {
  const bytes = [...Buffer.from(s, 'utf8')];
  return WRAP + bytes.map((b) => b.toString(2).padStart(8, '0').split('').map((bit) => (bit === '1' ? Z1 : Z0)).join('')).join('') + WRAP;
}
function decode(text) {
  const m = text.match(/\u2060([\u200b\u200c]+)\u2060/);
  if (!m) return null;
  const bits = [...m[1]].map((c) => (c === Z1 ? '1' : '0')).join('');
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes).toString('utf8');
}

if (process.argv.includes('--write')) {
  const wm = encode(PAYLOAD);
  for (const f of TARGETS) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { console.log('缺文件', f); continue; }
    let t = fs.readFileSync(p, 'utf8');
    t = t.replace(/\u2060[\u200b\u200c]+\u2060/g, ''); // 先清旧的
    if (!t.endsWith('\n')) t += '\n';
    fs.writeFileSync(p, t + wm + '\n');
    console.log('写入水印', f);
  }
} else {
  for (const f of TARGETS) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const got = decode(fs.readFileSync(p, 'utf8'));
    console.log(f, '→', got || '（无水印）');
  }
}
