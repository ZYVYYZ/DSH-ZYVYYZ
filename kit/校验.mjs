#!/usr/bin/env node
// 校验本包有没有被改过。用法：node 校验.mjs
// 原理：清单.sha256 记每个文件的哈希；这里重算一遍对比。清单本身不参与。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(ROOT, '清单.sha256');
const SKIP = new Set(['清单.sha256', '校验.mjs']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  return out;
}
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const files = walk(ROOT).filter((f) => !SKIP.has(f)).sort();

if (process.argv.includes('--write')) {
  const lines = files.map((f) => `${sha(path.join(ROOT, f))}  ${f}`);
  fs.writeFileSync(MANIFEST, lines.join('\n') + '\n');
  console.log(`已写清单：${files.length} 个文件`);
  process.exit(0);
}

if (!fs.existsSync(MANIFEST)) { console.error('没有 清单.sha256（先跑 node 校验.mjs --write）'); process.exit(2); }
const want = new Map(fs.readFileSync(MANIFEST, 'utf8').trim().split('\n').map((l) => {
  const i = l.indexOf('  ');
  return [l.slice(i + 2), l.slice(0, i)];
}));

let bad = 0, extra = 0;
for (const [f, h] of want) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log('缺失  ' + f); bad++; continue; }
  if (sha(p) !== h) { console.log('被改  ' + f); bad++; }
}
for (const f of files) if (!want.has(f)) { console.log('多出  ' + f); extra++; }


// —— 引用检查：正文里提到的 .md 路径必须真实存在（2026-11-16 加，起因：引言指向了一个改过名的模板）
let refBad = 0;
for (const f of files) {
  const text = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of text.matchAll(/`([^`\s]+\.md)`/g)) {
    const ref = m[1];
    if (ref.startsWith("../") || ref.startsWith("http")) continue; // 跨包引用不查
    if (!ref.includes("/")) continue;        // 只查带目录的引用（顶层文件名多是示例/占位）
    if (/[<>{}]/.test(ref)) continue;         // <名字> 这类占位符跳过
    if (!fs.existsSync(path.join(ROOT, ref))) { console.log("引用不存在  " + f + " -> " + ref); refBad++; }
  }
}
if (refBad > 0) { console.log("\n引用检查不通过：" + refBad + " 处指向不存在的文件。"); process.exitCode = 1; }
console.log('');
if (bad === 0 && extra === 0) console.log(`通过：${want.size} 个文件，与清单一致。`);
else { console.log(`不通过：${bad} 处不符 / ${extra} 处多出。**这不是原件。**`); process.exitCode = 1; }
