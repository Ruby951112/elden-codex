import { type Locale } from '@/lib/i18n';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Elden Codex',
  description: 'The terms governing your use of Elden Codex.',
};

export default function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const lastUpdated = '2026-05-22';

  if (lang === 'zh') {
    return (
      <main className="reading-area min-h-screen">
        <article className="max-w-2xl mx-auto px-4 md:px-6 py-12 prose-codex">
          <header className="mb-8 text-center">
            <div className="ornament mb-3"><span>◆</span></div>
            <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">服务条款</h1>
            <p className="text-ink-faint text-sm font-mono">最后更新:{lastUpdated}</p>
          </header>

          <h2>1. 关于本站</h2>
          <p>Elden Codex 是一个由玩家社区独立运营的 Elden Ring 攻略网站,<strong>与 FromSoftware、Bandai Namco 没有任何官方关联</strong>。所有 Elden Ring 相关名称、角色、艺术作品和文本均为其各自所有者的财产。</p>

          <h2>2. 内容许可</h2>
          <p>本站的原创攻略文本、网站设计、代码等内容采用 <strong>个人非商业用途免费使用</strong> 政策:</p>
          <ul>
            <li>欢迎你为个人参考阅读、分享单篇 URL 到社交媒体</li>
            <li><strong>禁止</strong> 大量抓取、整站复制、未注明出处的二次发布</li>
            <li>商业转载请联系我们</li>
          </ul>

          <h2>3. 内容准确性</h2>
          <p>我们尽力保证攻略内容的准确性,但 Elden Ring 持续更新,部分招式数值可能与最新版游戏存在差异。<strong>本站内容仅供参考,不构成游戏建议的保证</strong>。如发现错误,欢迎通过 <Link href={`/${lang}/contact`}>联系页</Link> 反馈。</p>

          <h2>4. 联盟链接</h2>
          <p>本站包含联盟营销链接(Amazon、Fanatical 等)。通过这些链接购买,我们可能获得佣金,但<strong>对你的购买价格无任何影响</strong>。详见 <Link href={`/${lang}/privacy`}>隐私政策</Link>。</p>

          <h2>5. 用户行为</h2>
          <p>使用本站时,你同意:</p>
          <ul>
            <li>不发送恶意、仇恨、骚扰性内容到联系表单</li>
            <li>不尝试入侵、攻击或干扰本站服务</li>
            <li>不利用本站从事任何违法或有害活动</li>
          </ul>

          <h2>6. 免责声明</h2>
          <p>本站内容按"现状"提供,不附带任何明示或暗示的保证。在适用法律允许的最大范围内,Elden Codex 及其运营者<strong>不对</strong>因使用本站造成的任何直接、间接、附带、特殊或后果性损失承担责任。</p>

          <h2>7. 适用法律</h2>
          <p>本服务条款受阿拉伯联合酋长国法律管辖。任何争议应在阿联酋有管辖权的法院解决。</p>

          <h2>8. 条款变更</h2>
          <p>我们保留随时修改这些条款的权利。重大变更将在首页公告。继续使用本站即表示你接受最新条款。</p>

          <h2>9. 联系</h2>
          <p>对服务条款有疑问?请通过 <Link href={`/${lang}/contact`}>联系页</Link> 反馈。</p>

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
          <h1 className="font-gothic text-3xl text-gold tracking-gothic mb-2">Terms of Service</h1>
          <p className="text-ink-faint text-sm font-mono">Last updated: {lastUpdated}</p>
        </header>

        <h2>1. About This Site</h2>
        <p>Elden Codex is an independent community-run Elden Ring strategy site, <strong>with no official affiliation to FromSoftware or Bandai Namco</strong>. All Elden Ring names, characters, artwork, and text are the property of their respective owners.</p>

        <h2>2. Content License</h2>
        <p>Our original strategy text, site design, and code are licensed for <strong>personal, non-commercial use</strong>:</p>
        <ul>
          <li>You may read for personal reference and share individual URLs on social media</li>
          <li><strong>Do not</strong> scrape at scale, mirror the whole site, or republish without attribution</li>
          <li>For commercial use, please contact us</li>
        </ul>

        <h2>3. Content Accuracy</h2>
        <p>We strive to keep our guides accurate, but Elden Ring is continuously patched and some move values may differ from the latest version. <strong>Site content is for reference only and does not constitute a guarantee of in-game outcomes</strong>. Found an error? Please flag it via our <Link href={`/${lang}/contact`}>contact page</Link>.</p>

        <h2>4. Affiliate Links</h2>
        <p>This site contains affiliate marketing links (Amazon, Fanatical, etc.). Purchases through these links may earn us a commission <strong>at no extra cost to you</strong>. See our <Link href={`/${lang}/privacy`}>Privacy Policy</Link> for details.</p>

        <h2>5. User Conduct</h2>
        <p>By using this site, you agree not to:</p>
        <ul>
          <li>Submit malicious, hateful, or harassing content to the contact form</li>
          <li>Attempt to hack, attack, or disrupt site services</li>
          <li>Use this site for any illegal or harmful activity</li>
        </ul>

        <h2>6. Disclaimer of Warranties</h2>
        <p>Site content is provided "as-is" without warranty of any kind, express or implied. To the maximum extent permitted by law, Elden Codex and its operators <strong>shall not be liable</strong> for any direct, indirect, incidental, special, or consequential damages arising from your use of the site.</p>

        <h2>7. Governing Law</h2>
        <p>These Terms are governed by the laws of the United Arab Emirates. Any dispute shall be resolved in the courts of competent jurisdiction in the UAE.</p>

        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Material changes will be announced on the homepage. Continued use of the site after changes constitutes acceptance.</p>

        <h2>9. Contact</h2>
        <p>Questions about these terms? Please reach out via our <Link href={`/${lang}/contact`}>contact page</Link>.</p>

        <div className="text-center mt-12 ornament"><span>◆</span></div>
      </article>
    </main>
  );
}
