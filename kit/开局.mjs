#!/usr/bin/env node
// 开局检查 · 起来先跑这一条，只看四样，不做任何修改。
// 用法：node 开局.mjs [根目录]        默认当前目录
import fs from 'node:fs';
import path from 'node:path';

const argRoot = path.resolve(process.argv[2] || '.');
// 兼容两种摆法：档在根目录，或在 .whale-craft/_global/ 下面
const cands = [argRoot, path.join(argRoot, 'kit'), path.join(argRoot, '.whale-craft/_global')];
const root = cands.find((d) => fs.existsSync(path.join(d, '起壳.md')) || fs.existsSync(path.join(d, '现场.md'))) || argRoot;
const pendingFile = [path.join(root, '待备份.txt'), path.join(argRoot, '03-系统备份/备份/待备份.txt')].find((p) => fs.existsSync(p));
const line = (s) => console.log(s);
const has = (p) => fs.existsSync(path.join(root, p));

line(`今天是 ${new Date().toLocaleDateString('zh-CN')}，根目录：${root}`);
line('');

// 1. 该读哪四份
const missing = ['起壳.md'].filter((f) => !has(f));
line('1. 该读的四份：现场 → 判断层最后一节 → 提货单两节 → 上一班日志');
line(missing.length ? `   这里缺：${missing.join('、')}（缺就跳过，不猜）` : '   入口在，从“现场那一行”开始。');
line('');

// 2. 现场那一行（可能在 现场.md，也可能写在入口页里）
const liveFile = [path.join(root, '现场.md'), path.join(root, '起壳.md')].find((p) => fs.existsSync(p));
if (liveFile) {
  const text = fs.readFileSync(liveFile, 'utf8');
  const lm = text.split('\n').find((l) => /^\*\*\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(l));
  line(`2. 现场那一行：${lm ? lm.replace(/\*\*/g, '').slice(0, 100) : '（没找到带时刻的那一行）'}`);
  line('   读完能不能说出「我在哪儿停下的 + 现在谁在负责」？说不出就别动文件。');
} else {
  line('2. 现场那一行：**没有**。没有它，第一问答不出来——先建一行再干活。');
}
line('');

// 3. 待备份
let pending = 0;
if (pendingFile) {
  pending = fs.readFileSync(pendingFile, 'utf8').split('\n').filter((l) => /^\d{4}-/.test(l)).length;
  line(`3. 待备份：${pending} 条${pending ? '（记得找时间打包）' : '（账是空的）'}`);
} else {
  line('3. 待备份：没有这个文件（小规模可以不记，但别假装记了）');
}
line('');

// 4. 待办清没清
if (has('待办.md')) {
  const open = fs.readFileSync(path.join(root, '待办.md'), 'utf8').split('\n').filter((l) => l.trim().startsWith('- [ ]')).length;
  line(`4. 待办：${open} 条没勾${open > 6 ? '（有点多，先挑一条）' : ''}`);
} else {
  line('4. 待办：没有这个文件');
}
line('');
line('—— 以上只读。要动手，先答出「我在哪儿 + 谁值班」。');
