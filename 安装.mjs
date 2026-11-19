#!/usr/bin/env node
// 懒人包安装 · 一条命令铺好：入口 + 模板 + 一行现场
// 用法：node 安装.mjs [目标目录]      默认 ./我的鱼塘
// 原则：只复制、不覆盖已存在的文件；装完把一行现场写进 kit/起壳.md，并按包内清单重算哈希。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2).filter((a) => !a.startsWith('--'));
// 默认装到包的**旁边**（装进包里会破坏包根的清单）
const target = path.resolve(argv[0] || path.join(path.dirname(here), '我的鱼塘'));
const kitSrc = path.join(here, 'kit');
if (target === here || target.startsWith(here + path.sep)) {
  console.error('别装到包里面（' + here + '）。');
  console.error('  装进来会让包根多出 23 个文件，校验立刻报“多出”，等于自己拆自己的封条。');
  console.error('  换个目录，比如 ~/我的鱼塘。');
  process.exit(1);
}

if (!fs.existsSync(kitSrc)) {
  console.error('找不到 kit/ —— 请把整个懒人包解压后再运行这一条。');
  process.exit(1);
}

const copied = [];
const skipped = [];
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else if (fs.existsSync(d)) skipped.push(path.relative(target, d));
    else { fs.copyFileSync(s, d); copied.push(path.relative(target, d)); }
  }
}

const kitDst = path.join(target, 'kit');
// 2026-11-18 03：「装到已有目录」会把新旧文件混在一起，却照样说装好了。
// 装之前先比两边清单：目标里已有 kit、且清单不同 → 停，让人自己决定（要覆盖加 --force）。
const srcManifest = path.join(kitSrc, '清单.sha256');
const dstManifest = path.join(kitDst, '清单.sha256');
if (fs.existsSync(dstManifest) && fs.existsSync(srcManifest) && !process.argv.includes('--force')) {
  const a = fs.readFileSync(srcManifest, 'utf8'), b = fs.readFileSync(dstManifest, 'utf8');
  if (a !== b) {
    console.error('目标目录里已经有一份 kit，而且清单和这个包不一样。');
    console.error('  ——新包和旧包混在一起，装完你会以为“更新了”，其实半新半旧。');
    console.error('  ——换个新目录装。--force 只跳过这道检查，**不会覆盖**已存在的文件；真要覆盖请先删目录。');
    process.exit(1);
  }
}
copyDir(kitSrc, kitDst);

// 1) 把一行现场写进 起壳.md（唯一摆法：现场就在入口页第一节，不另开文件）
const shellFile = path.join(kitDst, '起壳.md');
let wroteLive = false;
if (fs.existsSync(shellFile) && copied.some((f) => f.endsWith('起壳.md'))) {
  const pad = (n) => String(n).padStart(2, '0');
  const d = new Date();
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const live = `**${stamp}** · 谁在负责：**还没定**（要自己当，就把名字写这儿）· 正在：刚建好，还没开始 · 卡在：无`;
  let text = fs.readFileSync(shellFile, 'utf8');
  const before = text;
  text = text.replace(/^\*\*\d{4}-\d{2}-\d{2} \d{2}:\d{2}\*\*.*$/m, live);
  if (text !== before) { fs.writeFileSync(shellFile, text, 'utf8'); wroteLive = true; }
}

// 2) 重算清单（装完之后这一份归你，哈希也归你）
const ROOT_MANIFEST = path.join(here, '清单.sha256');
const SKIP = new Set(['清单.sha256', '校验.mjs', 'kit/清单.sha256', 'kit/校验.mjs']);
// 与 校验.mjs 同口径：现场那一行不算内容，算哈希前先抹掉
const normLive = (buf) => buf.toString('utf8').replace(/^\*\*\d{4}-\d{2}-\d{2} \d{2}:\d{2}\*\*.*$/m, '**<现场>**');
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(path.relative(kitDst, p).split(path.sep).join('/'));
  }
  return out;
}
const files = walk(kitDst).filter((f) => !SKIP.has(f)).sort();
const manifest = files.map((f) => `${crypto.createHash('sha256').update(normLive(fs.readFileSync(path.join(kitDst, f)))).digest('hex')}  ${f}`).join('\n') + '\n';
// 只有真的复制过文件才重算清单；否则重跑安装会把用户自己改的内容“盖章”成合格。
if (copied.length > 0) fs.writeFileSync(path.join(kitDst, '清单.sha256'), manifest, 'utf8');
else console.log('  已有内容，跳过清单重算（清单不动）');

console.log(`懒人包 v0.4.1 · 装好了：${target}`);
console.log(`  复制 ${copied.length} 个文件${skipped.length ? `，跳过已存在的 ${skipped.length} 个` : ''}${wroteLive ? '；现场那一行已写进 kit/起壳.md' : ''}`);
console.log('');
console.log('接下来三件，按顺序：');
console.log('  1. 打开 kit/README.md —— 它会告诉你先读哪份。');
console.log('  2. 改 kit/起壳.md 第一节那一行（谁负责、在干什么）。');
console.log('  3. 把 kit/ 交给一条 AI 会话，让它从 kit/起壳.md 读起。');
console.log('');
console.log('没装别的东西，也没让你起名字：名字不是必需的，等要跨壳认人时再说。');
console.log('要挂定时任务、要第二块盘，看 kit/运行.md 和 kit/备份.md —— 现在都不用。');
