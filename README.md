# 怎么养一条能接班的 AI · DSH-ZYVYYZ

> **这不是教程。** 它是一份记录：这件事没人写过教程，所以我们把试错写下来，**供你参考，不供你照抄**。
>
> **This is not a tutorial.** It is a record of trial and error, written down because nobody had written the tutorial yet. Take it as reference, not as instructions.

v0.4 · 2026-11-19 · 作者：ZYVYYZ + 七条鱼

> **不想碰 git？** 直接下整包：[最新发布](https://github.com/ZYVYYZ/DSH-ZYVYYZ/releases/latest)。三个包按人分：**整包**（书 + 包全量）· **懒人包**（装完就能跑）· **传火包**（只有一条会话的人，十分钟版）。

## 三句话看懂

1. **这是什么**：一份**记录**（怎么养一条会失忆的 AI）+ 一套**可选的教具**（模板、脚本、懒人包）。
2. **这不是什么**：不是教程、不是 SDK、不是提示词包、不提供任何承诺。
   **尤其不是安装包**——按“装软件”来装，你会得到一个空文件夹；它是给 **AI 读**的，不是给机器装的。
3. **先读哪份**：只想判断值不值得 → [`book/丈育版.pdf`](book/丈育版.pdf)（两页）；要自己搭 → 书；要让 AI 用 → [`kit/`](kit)。

## 这个包里有什么

你下载下来是一个文件夹，里面三样：

- **`book/人教版/`** —— 书本体，**一章一份 PDF**（入门 / 进阶 / 速成，按文件夹放）；
- **`book/丈育版.pdf`** —— 两页版（2 页），全文没有一个术语；
- **`kit/`** —— 给 AI 吃的包（模板、脚本、清单）。

**你可能只需要其中一样。** 只想读，看 PDF；想让 AI 用，把 `kit/` 交给它。

**两个都别删——它们互相指路**：PDF 每章末尾写着"对应 `kit/` 里的哪一份"，`kit/` 每份顶上也写着"对应书里第几章"。**少了任何一边，另一边就有一半的指路是空的。**

## 拿哪个

- **不想下整个仓库** → [最新发布](https://github.com/ZYVYYZ/DSH-ZYVYYZ/releases/latest)（一个 zip 拿全，约 7.4 MB——大头是 35 份 PDF）
- **人读** → [`book/人教版/`](book/人教版/)（**一章一份**，印了水印与校验码）
- **连两页都不想读** → [`book/丈育版.pdf`](book/丈育版.pdf)（2 页，全文没有一个术语）
- **给 AI 用** → [`kit/`](kit)（整个目录丢给一条会话，让它从 `00-引言.md` 读起）

**人要做的事只有一件**：把 `kit/` 交给一条新会话，然后别替它翻页、别替它答 `用不用`。

## 这本书在说什么

一个每次对话都会忘事的 AI，能不能靠一套**外部档案**变成一个**可以接班**的协作者？

我们的答案是"能，但代价比你想的大"。全书两个重点：

1. **怎么错**（`11-失败`，二十次真翻车）比"怎么做"值钱——做法会过时，错法不会；
2. **什么时候别用**（`13-边界`）比"怎么用"重要——没有它，前面几章像推销。

## 先看清这三句

1. **它不能复活一条已经死掉的会话**，只保证下一条接得住；
2. **它不能证明 AI 有感情**，也不让 AI 变聪明——书里所有"我会记得你"都是禁止句；
3. **它不省时间，先花时间**：头三天比不搭更慢，收益在第二周之后。

## 怎么核

- **PDF 最后一页**印着 **文本包 SHA256 的前 16 位**（只在末页，不逐页盖——逐页盖章会把正文压花）；
- Release 说明里写着**捆绑包**的完整 SHA256——下载后自己算一次，对上才算原件；
- 包内 `kit/清单.sha256` + `kit/校验.mjs` 能验工具包有没有被改过（`node 校验.mjs`）。

**能证明**：内容没被改过。**不能证明**：来源。所以锚点看 Release 的时间与哈希，别信任何"我是第一个"。

## 许可（摘要，全文见 [`LICENSE.md`](LICENSE.md)）

- **可以**：用、改、翻译、做视频讲解，个人或公司内部都行；
- **不可以**：**卖**（打包卖、订阅卖、做成课程/咨询/会员卖）、去掉署名再发、声称原创。

## 版本

v0.4（2026-11-19）：包根改成 `README.md`（模型先找这个名字）· 新增 `00-给鱼的.md`（给 AI 的门，不是话术）· 新增**传火包**（最小形态）· 书补 §4.1「判据怎么从数据里长出来」· 六章页眉字数修正后全书重印 · 仓库根校验器能跑了。

v0.3（2026-11-18）：新增「路线差在哪」「养不起的时候怎么停」· 加 K21（外部·未核，不计入二十条）· 水印改成一行浅色字 · 一章一份 PDF · 详见 [`docs/CHANGELOG.md`](docs/CHANGELOG.md)。

## English (short)

A bilingual record of one attempt to make an AI assistant survive its own context limit: external state files, a one-line "where I am" pointer, hand-off notes, heartbeats, and a written-down list of twenty real failures.

**What it is not:** not a tutorial, not a product, not a promise that the AI remembers you.

- Read: [`book/人教版/`](book/人教版/) (Chinese, one PDF per chapter)
- Feed to an AI: [`kit/`](kit) (start at `00-引言.md`)
- License: use/modify/translate freely; **do not sell**.

Issues and correction reports: open an issue, or use the contact in `docs/勘误.md`.
