export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const dictionaries = {
  en: {
    site: {
      name: 'Elden Codex',
      tagline: 'Every boss, every path, every secret of the Lands Between.',
      hero_title: 'Rise, Tarnished',
      hero_cta_primary: 'Begin Your Journey',
      hero_cta_secondary: 'DLC Guide',
    },
    nav: {
      bosses: 'Bosses',
      walkthrough: 'Walkthrough',
      builds: 'Builds',
      weapons: 'Weapons',
      map: 'Map',
      contact: 'Contact',
      more: 'More',
    },
    stats: {
      bosses: 'Bosses',
      bosses_sub: 'Phase-by-phase strategies',
      regions: 'Regions',
      regions_sub: 'Optimal walkthroughs',
      dlc: 'DLC',
      dlc_sub: 'Shadow of the Erdtree',
    },
    sections: {
      featured_bosses: 'Featured Bosses',
      all_bosses: 'All Bosses',
      phase_strategy: 'Phase Strategy',
      attacks_counters: 'Attacks & Counters',
      recommended_loadout: 'Recommended Loadout',
      related_bosses: 'Related Bosses',
      recommended_gear: 'Recommended Gear',
    },
    boss: {
      location: 'Location',
      runes: 'Runes',
      hp: 'HP (NG)',
      difficulty: 'Difficulty',
      legend: 'Legend',
      optional: 'Optional',
      field: 'Field',
      dlc: 'DLC',
      final: 'Final',
      main_story: 'Main Story',
    },
    contact: {
      title: 'Send Feedback',
      subtitle: 'Spotted a mistake? Want to collaborate? Got a build to share?',
      name: 'Your Name',
      email: 'Your Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending…',
      success: 'Message sent. We will get back to you soon.',
      error: 'Something went wrong. Please try again.',
    },
    footer: {
      tagline: 'A guide for Tarnished, by Tarnished.',
      copyright: 'Elden Codex is an unofficial fan site. Elden Ring is © FromSoftware & Bandai Namco.',
      feedback: 'Feedback',
      contact: 'Contact',
    },
  },
  zh: {
    site: {
      name: '褪色者法典',
      tagline: '交界地的每个 Boss、每条路径、每个秘密',
      hero_title: '起身吧,褪色者',
      hero_cta_primary: '开始旅程',
      hero_cta_secondary: 'DLC 攻略',
    },
    nav: {
      bosses: 'Boss',
      walkthrough: '流程',
      builds: '流派',
      weapons: '武器',
      map: '地图',
      contact: '联系',
      more: '更多',
    },
    stats: {
      bosses: 'Boss',
      bosses_sub: '逐阶段策略',
      regions: '区域',
      regions_sub: '最优路线',
      dlc: 'DLC',
      dlc_sub: '黄金树幽影',
    },
    sections: {
      featured_bosses: '精选 Boss',
      all_bosses: '全部 Boss',
      phase_strategy: '阶段策略',
      attacks_counters: '招式与应对',
      recommended_loadout: '推荐配装',
      related_bosses: '相关 Boss',
      recommended_gear: '装备推荐',
    },
    boss: {
      location: '位置',
      runes: '卢恩',
      hp: 'HP (一周目)',
      difficulty: '难度',
      legend: '传说',
      optional: '选择',
      field: '野外',
      dlc: 'DLC',
      final: '最终',
      main_story: '主线',
    },
    contact: {
      title: '发送反馈',
      subtitle: '发现错误?想要合作?有 Build 想分享?',
      name: '您的称呼',
      email: '您的邮箱',
      message: '留言内容',
      send: '发送留言',
      sending: '发送中…',
      success: '留言已发送,我们会尽快回复。',
      error: '出错了,请重试。',
    },
    footer: {
      tagline: '褪色者写给褪色者的攻略',
      copyright: '褪色者法典为非官方粉丝站。艾尔登法环 © FromSoftware & 万代南梦宫',
      feedback: '反馈',
      contact: '联系',
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
