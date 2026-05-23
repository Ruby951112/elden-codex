import { type Locale } from '@/lib/i18n';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Elden Codex',
  description: 'How Elden Codex handles your data, cookies, and affiliate links.',
};

export default function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const lastUpdated = '2026-05-22';

  if (lang === 'zh') {
    return (
      <main className="reading-area min-h-screen">
        <article className="max-w-2xl mx-auto px-4 md:px-6 py-12 prose-codex">
          <header className="mb-8 text-center">
            <div className="ornament mb-3"><span>◆</span></div>
            <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">隐私政策</h1>
            <p className="text-ink-faint text-sm font-mono">最后更新:{lastUpdated}</p>
          </header>

          <h2>1. 我们收集什么</h2>
          <p>Elden Codex 是一个 Elden Ring 攻略内容网站。我们收集的信息如下:</p>
          <ul>
            <li><strong>访问数据</strong>:浏览器类型、设备类型、访问页面、停留时间。来自 Vercel Analytics(匿名,不识别个人身份)。</li>
            <li><strong>联系表单</strong>:仅当你主动提交反馈表单时,我们收集你提供的姓名、邮箱、消息内容。</li>
            <li><strong>Cookie</strong>:我们使用必要的 Cookie 来记住你的语言偏好。第三方广告(未来上线)和联盟链接可能设置追踪 Cookie。</li>
          </ul>

          <h2>2. 我们如何使用</h2>
          <ul>
            <li>分析数据用于改进网站内容和性能</li>
            <li>联系表单内容仅用于回复你的反馈</li>
            <li>我们 <strong>从不</strong> 出售或与第三方分享你的个人信息</li>
          </ul>

          <h2>3. 联盟链接与广告披露</h2>
          <p>本站包含联盟链接,即当你通过我们的链接购买商品时,我们可能会获得一定佣金,<strong>对你的购买价格没有任何影响</strong>。具体合作方包括:</p>
          <ul>
            <li>Amazon Associates(amazon.com)</li>
            <li>Fanatical / Awin Network</li>
            <li>未来可能加入的其他游戏相关联盟项目</li>
          </ul>
          <p>所有联盟链接均带有 <code>rel="sponsored noopener"</code> 标识,符合搜索引擎合规要求。</p>

          <h2>4. 第三方服务</h2>
          <ul>
            <li><strong>Vercel</strong> — 网站托管。隐私政策见 <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>。</li>
            <li><strong>Vercel Analytics</strong> — 匿名访问统计。</li>
            <li><strong>Resend</strong> — 邮件发送服务,用于处理你的反馈表单。</li>
            <li><strong>Google AdSense</strong>(未来)— 显示广告。Google 可能使用 Cookie 投放相关广告,你可在 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> 管理。</li>
          </ul>

          <h2>5. 你的权利</h2>
          <p>你可以:</p>
          <ul>
            <li>通过浏览器设置禁用 Cookie</li>
            <li>请求删除你提交的联系表单数据 — 邮件 <Link href={`/${lang}/contact`}>联系我们</Link></li>
            <li>使用 Ad Blocker / Privacy Badger 等工具屏蔽追踪</li>
          </ul>

          <h2>6. 儿童隐私</h2>
          <p>Elden Codex 不针对 13 岁以下儿童,也不主动收集其个人信息。Elden Ring 游戏本身为 16+ 评级。</p>

          <h2>7. 政策变更</h2>
          <p>本政策可能不定期更新。重大变更将在网站首页公告至少 7 天。</p>

          <h2>8. 联系</h2>
          <p>对本隐私政策有疑问?请通过 <Link href={`/${lang}/contact`}>联系页</Link> 反馈。</p>

          <div className="text-center mt-12 ornament"><span>◆</span></div>
        </article>
      </main>
    );
  }

  return (
    <main className="reading-area min-h-screen">
      <article className="max-w-2xl mx-auto px-4 md:px-6 py-12 prose-codex">
        <header className="mb-8 text-center">
          <div className="ornament mb-3"><span>◆</span></div>
          <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">Privacy Policy</h1>
          <p className="text-ink-faint text-sm font-mono">Last updated: {lastUpdated}</p>
        </header>

        <h2>1. What We Collect</h2>
        <p>Elden Codex is an Elden Ring strategy content site. We collect:</p>
        <ul>
          <li><strong>Visit data</strong>: browser type, device type, pages visited, time on site. Sourced from Vercel Analytics (anonymous, not personally identifying).</li>
          <li><strong>Contact form submissions</strong>: only when you proactively submit the feedback form, we collect the name, email, and message you provide.</li>
          <li><strong>Cookies</strong>: we use essential cookies to remember your language preference. Third-party ads (future) and affiliate links may set tracking cookies.</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>Analytics is used to improve site content and performance</li>
          <li>Contact form content is used only to reply to your feedback</li>
          <li>We <strong>never</strong> sell or share your personal information with third parties</li>
        </ul>

        <h2>3. Affiliate Links & Ad Disclosure</h2>
        <p>This site contains affiliate links, meaning we may earn a commission when you purchase through our links, <strong>at no extra cost to you</strong>. Specific partners include:</p>
        <ul>
          <li>Amazon Associates (amazon.com)</li>
          <li>Fanatical / Awin Network (Steam keys)</li>
          <li>Other gaming-related affiliate programs we may add</li>
        </ul>
        <p>All affiliate links carry <code>rel="sponsored noopener"</code> attributes, in compliance with search engine guidelines.</p>

        <h2>4. Third-Party Services</h2>
        <ul>
          <li><strong>Vercel</strong> — website hosting. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.</li>
          <li><strong>Vercel Analytics</strong> — anonymous visit statistics.</li>
          <li><strong>Resend</strong> — email delivery service for your feedback form.</li>
          <li><strong>Google AdSense</strong> (future) — ad display. Google may use cookies for personalized ads. Manage at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>You may:</p>
        <ul>
          <li>Disable cookies via your browser settings</li>
          <li>Request deletion of contact form data — reach out via <Link href={`/${lang}/contact`}>our contact page</Link></li>
          <li>Use ad blockers / Privacy Badger to block tracking</li>
        </ul>

        <h2>6. Children's Privacy</h2>
        <p>Elden Codex is not directed at children under 13, and we do not knowingly collect their personal information. Elden Ring itself is rated 16+.</p>

        <h2>7. Policy Changes</h2>
        <p>This policy may be updated periodically. Material changes will be announced on the homepage for at least 7 days.</p>

        <h2>8. Contact</h2>
        <p>Questions about this Privacy Policy? Reach out via our <Link href={`/${lang}/contact`}>contact page</Link>.</p>

        <div className="text-center mt-12 ornament"><span>◆</span></div>
      </article>
    </main>
  );
}
