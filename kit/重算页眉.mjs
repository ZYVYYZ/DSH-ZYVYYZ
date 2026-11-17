#!/usr/bin/env node
// 重算每个 md 页眉的「阅读时间 / 汉字数」。改完内容必须跑一次，否则页眉会说谎。
// 用法：node 重算页眉.mjs [目录]（默认：本脚本所在目录的上一级）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CJK = (s) => [...s].filter((c) => /[\u4e00-\u9fff]/.test(c)).length;

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let t = fs.readFileSync(f, 'utf8');
  const m = t.match(/> (?:⏱ )?时长：约 \d+ 分钟（\d+ 汉字）/);
  if (!m) continue;
  const c = CJK(t);
  const mins = Math.max(1, Math.round(c / 300));
  t = t.replace(m[0], `> 时长：约 ${mins} 分钟（${c} 汉字）`);
  fs.writeFileSync(f, t);
  n++;
}
console.log(`重算 ${n} 个页眉（${ROOT}）`);
