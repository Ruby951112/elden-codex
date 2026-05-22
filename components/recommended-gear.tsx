import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/i18n';

/**
 * Context-aware gear recommendations.
 *
 * Pulls from a recommendation catalog and outputs affiliate links.
 * Each link is tagged with the source page (`context`) so user can
 * track which Boss pages convert best.
 *
 * To configure:
 *   1. Set NEXT_PUBLIC_AMAZON_ENABLED=true and NEXT_PUBLIC_AMAZON_TAG=yourtag-20
 *   2. Set NEXT_PUBLIC_FANATICAL_ID for Steam key affiliate
 *   3. Customize the catalog below with your actual affiliate URLs
 */

interface GearItem {
  id: string;
  name_en: string;
  name_zh: string;
  category: 'controller' | 'headset' | 'chair' | 'game' | 'vpn';
  /** Templates with {tag} or {id} placeholders for affiliate params */
  amazonAsin?: string;
  steamKeyUrl?: string;
  reason_en: string;
  reason_zh: string;
}

const GEAR_CATALOG: GearItem[] = [
  {
    id: 'xbox-elite-controller',
    name_en: 'Xbox Elite Series 2 Controller',
    name_zh: 'Xbox 精英手柄 2 代',
    category: 'controller',
    amazonAsin: 'B07SFKTLZQ', // placeholder ASIN
    reason_en: 'Hair-trigger locks let you fire spells faster. The paddles handle item swapping mid-combat.',
    reason_zh: '极敏扳机能让你更快释放魔法。背部按键便于战斗中切换道具。',
  },
  {
    id: 'sennheiser-game-one',
    name_en: 'Sennheiser GAME ONE Headset',
    name_zh: '森海塞尔 GAME ONE 耳机',
    category: 'headset',
    amazonAsin: 'B00JJUXFD4',
    reason_en: 'Footstep cues and ambush audio are crucial in Souls games. Open-back design prevents fatigue in long sessions.',
    reason_zh: '魂系游戏中脚步声和伏击音效至关重要。开放式设计长时间佩戴不疲劳。',
  },
  {
    id: 'elden-ring-shadow-erdtree',
    name_en: 'Shadow of the Erdtree DLC (Steam Key)',
    name_zh: '黄金树幽影 DLC (Steam 激活码)',
    category: 'game',
    steamKeyUrl: 'https://www.fanatical.com/en/dlc/elden-ring-shadow-of-the-erdtree',
    reason_en: 'The DLC expansion. 60+ hours of new content, new weapons, and the hardest boss FromSoftware has ever made.',
    reason_zh: 'DLC 大型扩展。60+ 小时新内容、新武器,以及 FromSoftware 历史最难 Boss。',
  },
];

function buildAmazonUrl(asin: string, tag: string, context: string): string {
  if (!asin || !tag) return '#';
  // Amazon affiliate link with custom tracking ID per source page
  return `https://www.amazon.com/dp/${asin}/?tag=${tag}&ref=${encodeURIComponent(context)}`;
}

function buildSteamKeyUrl(baseUrl: string, partnerId: string, context: string): string {
  if (!baseUrl) return '#';
  // Fanatical affiliate format — adapt for GMG/Eneba similarly
  const url = new URL(baseUrl);
  if (partnerId) url.searchParams.set('aid', partnerId);
  url.searchParams.set('utm_source', siteConfig.projectId);
  url.searchParams.set('utm_campaign', context);
  return url.toString();
}

/**
 * Returns 2-3 contextually relevant items.
 * Future: use boss difficulty / phase to pick (e.g. high difficulty → headset for audio cues).
 * For now, returns curated default set.
 */
function pickGearForContext(context: string): GearItem[] {
  // Simple heuristic: every boss page gets controller + headset + DLC
  // Customize per-boss in catalog later
  return GEAR_CATALOG.slice(0, 3);
}

export function RecommendedGear({ locale, context }: { locale: Locale; context: string }) {
  const items = pickGearForContext(context);
  const amazonTag = siteConfig.monetization.amazon.affiliateTag;
  const fanaticalId = siteConfig.monetization.steamKey.fanatical;

  // Note in dev / before user configures affiliate IDs, links go to '#'
  // but cards still render — user can preview the visual

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item) => {
        const url = item.amazonAsin
          ? buildAmazonUrl(item.amazonAsin, amazonTag, context)
          : item.steamKeyUrl
            ? buildSteamKeyUrl(item.steamKeyUrl, fanaticalId, context)
            : '#';

        const name = locale === 'en' ? item.name_en : item.name_zh;
        const reason = locale === 'en' ? item.reason_en : item.reason_zh;

        return (
          <a
            key={item.id}
            href={url}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="block bg-bg-raised border border-edge rounded-md p-3 hover:border-edge-strong transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold text-base">◆</span>
              <h3 className="font-gothic text-xs text-ink-primary tracking-widest uppercase leading-tight">
                {name}
              </h3>
            </div>
            <p className="text-xs text-ink-muted font-serif italic leading-snug">{reason}</p>
            <div className="text-[9px] text-ink-faint mt-2 font-gothic uppercase tracking-widest">
              {locale === 'en' ? 'View on store →' : '前往商店 →'}
            </div>
          </a>
        );
      })}
    </div>
  );
}
