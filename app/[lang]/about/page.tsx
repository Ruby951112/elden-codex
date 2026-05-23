import { type Locale } from '@/lib/i18n';
import Link from 'next/link';

export const metadata = {
  title: 'About — Elden Codex',
  description: 'The story behind Elden Codex — why it exists and how it works.',
};

export default function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  if (lang === 'zh') {
    return (
      <main className="reading-area min-h-screen">
        <article className="max-w-2xl mx-auto px-4 md:px-6 py-12 prose-codex">
          <header className="mb-10 text-center">
            <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
            <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">关于 Elden Codex</h1>
            <p className="text-ink-muted font-serif italic">褪色者的指南,由褪色者书写。</p>
          </header>

          <h2>我们的使命</h2>
          <p>Elden Codex 致力于成为最深入、最准确、最具阅读价值的 Elden Ring 攻略网站。我们相信好的攻略不是数据搬运,而是**经验的提炼**——告诉你为什么这个 Boss 难,告诉你哪个时机最该闪避,告诉你这把武器值不值得练。</p>

          <h2>内容来源</h2>
          <p>本站攻略由两部分构成:</p>
          <ul>
            <li><strong>核心 Boss 攻略</strong>(玛尔基特、葛瑞克、玛莲妮亚等)由站长亲笔撰写,基于数百小时游戏经验和多周目通关验证</li>
            <li><strong>其他攻略内容</strong>通过 AI 辅助生成 + 人工校对的方式产出。我们使用 Anthropic Claude 模型,并以站长手写的核心攻略作为"质量锚点"训练模型,确保内容风格统一</li>
          </ul>
          <p>所有 AI 辅助生成的内容均经过站长审校,但可能仍有遗漏。<strong>发现错误请通过 <Link href={`/${lang}/contact`}>联系页</Link> 反馈</strong>,我们承诺 48 小时内回复并修正。</p>

          <h2>关于站长</h2>
          <p>本站由一名独立程序员运营,常年混迹 Souls 系列(《黑魂》1-3、《血源》、《只狼》、《艾尔登法环》、《黑神话:悟空》),目前定居迪拜。</p>

          <h2>为什么没有广告(目前)</h2>
          <p>站点刚刚上线,我们暂时不展示展示型广告(banner),希望给读者最干净的阅读体验。未来如果接入广告(可能是 Google AdSense),会优先选择不干扰阅读的格式。</p>
          <p>当前的变现方式是<strong>上下文相关的联盟推荐</strong>——比如在 Malenia 攻略页底部推荐一款适合精确反击的低延迟手柄。<strong>对你的购买价格无任何影响</strong>。</p>

          <h2>如何支持我们</h2>
          <p>如果这个站点帮到了你,你可以:</p>
          <ul>
            <li><strong>分享单篇攻略链接</strong>给 Souls 系玩家朋友</li>
            <li>在 Reddit / 小红书 / B 站等社区<strong>提到 Elden Codex</strong></li>
            <li>通过站内的联盟链接<strong>购买你本来就要买的游戏外设</strong>(零成本支持)</li>
            <li>发现内容错误时,<strong>通过反馈表单告诉我们</strong></li>
          </ul>

          <h2>路线图</h2>
          <ul>
            <li>✅ Boss 攻略(68 个,含 SOTE DLC)</li>
            <li>✅ 区域流程攻略(11 个区域)</li>
            <li>✅ 流派构筑攻略(10+ 种主流流派)</li>
            <li>⏳ 武器数据库(2027 Q1)</li>
            <li>⏳ 交互地图(长期规划)</li>
            <li>⏳ 多游戏扩展:黑神话悟空、未来的 FromSoft 新作</li>
          </ul>

          <h2>免责</h2>
          <p>Elden Codex 是非官方粉丝站。Elden Ring © FromSoftware Inc. & Bandai Namco Entertainment。</p>

          <div className="text-center mt-12 ornament"><span>◆</span></div>
        </article>
      </main>
    );
  }

  return (
    <main className="reading-area min-h-screen">
      <article className="max-w-2xl mx-auto px-4 md:px-6 py-12 prose-codex">
        <header className="mb-10 text-center">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">About Elden Codex</h1>
          <p className="text-ink-muted font-serif italic">A guide for Tarnished, by Tarnished.</p>
        </header>

        <h2>Our Mission</h2>
        <p>Elden Codex aims to be the deepest, most accurate, and most readable Elden Ring strategy site. We believe great guides aren't data dumps — they're <strong>experience distilled</strong>. They tell you why a boss is hard, when to dodge, and whether a weapon is worth upgrading.</p>

        <h2>Where the Content Comes From</h2>
        <p>Our guides come from two sources:</p>
        <ul>
          <li><strong>Core boss guides</strong> (Margit, Godrick, Malenia, etc.) are hand-written by the site owner, based on hundreds of hours of playtime and multi-NG playthroughs.</li>
          <li><strong>Other content</strong> is produced via AI-assisted generation with human review. We use Anthropic's Claude model, anchored on our hand-written guides as the quality reference, to ensure consistent voice and depth.</li>
        </ul>
        <p>All AI-assisted content is reviewed before publishing, but errors may still slip through. <strong>Found a mistake? Please flag it via our <Link href={`/${lang}/contact`}>contact page</Link></strong> — we commit to responding within 48 hours and correcting the issue.</p>

        <h2>About the Author</h2>
        <p>Elden Codex is run by an independent developer based in Dubai, with deep experience across the Souls series — Dark Souls 1-3, Bloodborne, Sekiro, Elden Ring, and Black Myth: Wukong.</p>

        <h2>Why No Ads (Currently)</h2>
        <p>The site just launched, and we're holding off on display ads (banners) to give readers a clean reading experience. If we add ads in the future (likely Google AdSense), we'll prioritize formats that don't interrupt reading.</p>
        <p>Our current monetization is <strong>context-relevant affiliate recommendations</strong> — for example, recommending a low-latency controller at the bottom of the Malenia guide. <strong>These never affect the price you pay.</strong></p>

        <h2>How to Support Us</h2>
        <p>If this site has helped you, you can:</p>
        <ul>
          <li><strong>Share individual guide URLs</strong> with fellow Souls players</li>
          <li>Mention <strong>Elden Codex</strong> on Reddit / Discord / YouTube communities</li>
          <li>Use our affiliate links when <strong>buying gear you'd buy anyway</strong> (zero-cost support)</li>
          <li>Report content errors via the <strong>contact form</strong></li>
        </ul>

        <h2>Roadmap</h2>
        <ul>
          <li>✅ Boss guides (68 covering SOTE DLC)</li>
          <li>✅ Region walkthroughs (11 areas)</li>
          <li>✅ Build guides (10+ core archetypes)</li>
          <li>⏳ Weapons database (Q1 2027)</li>
          <li>⏳ Interactive map (long-term)</li>
          <li>⏳ Expansion to other Souls-likes: Black Myth Wukong, future FromSoft titles</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>Elden Codex is an unofficial fan site. Elden Ring © FromSoftware Inc. & Bandai Namco Entertainment.</p>

        <div className="text-center mt-12 ornament"><span>◆</span></div>
      </article>
    </main>
  );
}
