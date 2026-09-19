/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeKey =
  | 'leisure_family'
  | 'culture_and_lifestyle'
  | 'outdoor_nature'
  | 'local_gourmet';

export interface ThemeDefinition {
  key: ThemeKey;
  name: string; // 繁體中文名稱
  englishKey: string;
  tag: string;
  icon: string;
  badgeLabel: string;
  shortLabel: string;
  summary: string;
  audience: string;
  coverage: string;
  exclusion?: string;
  factoryPrinciple: string;
  factoryFocus: 'entertainment' | 'craft_knowledge' | 'nature_scenic' | 'gourmet_product';
}

export const THEME_DEFINITIONS: Record<ThemeKey, ThemeDefinition> = {
  leisure_family: {
    key: 'leisure_family',
    name: '休閒遊憩',
    englishKey: 'leisure_family',
    tag: '休閒遊憩',
    icon: '🎡',
    badgeLabel: '全齡親子・室內舒適',
    shortLabel: '休閒遊憩（全齡親子・娛樂手作體驗）',
    summary: '適合全齡家庭、長輩與幼童。精選動線平緩之主題園區與甜點手作DIY娛樂觀光工廠。',
    audience: '適合全齡家庭、長輩與幼童同遊，兼顧舒適度與手作趣味。',
    coverage: '主題樂園、室內互動遊樂館、水族館/科學館，以及娛樂型觀光工廠。',
    factoryPrinciple: '挑選具備高互動娛樂性、甜點/玩具手作DIY、適合全家放鬆同樂的園區。',
    factoryFocus: 'entertainment'
  },
  culture_and_lifestyle: {
    key: 'culture_and_lifestyle',
    name: '文化生活',
    englishKey: 'culture_and_lifestyle',
    tag: '文化生活',
    icon: '🏛️',
    badgeLabel: '文史聚落・職人工藝',
    shortLabel: '文化生活（文史古蹟・藝文街區・職人工藝見學）',
    summary: '文史脈絡、工藝傳承、老街聚落、美術館文創、酒廠/陶瓷/老茶廠產業見學。',
    audience: '喜愛文史脈絡、工藝傳承、街區氛圍與美學深度的旅人。',
    coverage: '古蹟老街、歷史聚落、美術館、文創園區，以及產業見學型觀光工廠。',
    factoryPrinciple: '挑選著重地方產業歷史、製程導覽、釀造/工藝技術展示或深度手作見學的工廠園區。',
    factoryFocus: 'craft_knowledge'
  },
  outdoor_nature: {
    key: 'outdoor_nature',
    name: '戶外漫遊',
    englishKey: 'outdoor_nature',
    tag: '戶外漫遊',
    icon: '🌲',
    badgeLabel: '開闊視野・自然山海',
    shortLabel: '戶外漫遊（開闊視野・國家風景區・山海步道）',
    summary: '親近自然、開闊視野、國家風景區、海岸海岬與森林步道。',
    audience: '親近自然、開闊視野、戶外放鬆。',
    coverage: '國家風景區、海岸景緻、森林步道、自然生態地貌。',
    exclusion: '排除室內人工封閉場所。',
    factoryPrinciple: '以開闊自然景點與生態地貌為主。',
    factoryFocus: 'nature_scenic'
  },
  local_gourmet: {
    key: 'local_gourmet',
    name: '美食尋味',
    englishKey: 'local_gourmet',
    tag: '美食尋味',
    icon: '🍜',
    badgeLabel: '排隊老店・市場夜市',
    shortLabel: '美食尋味（在地小吃・傳統市場・老饕採買）',
    summary: '在地飲食體驗、排隊老店、傳統市場、觀光夜市與在地農漁特產展售。',
    audience: '以在地飲食體驗與採買為導向。',
    coverage: '經典排隊老店、在地傳統市場、夜市、農漁特產展售中心。',
    factoryPrinciple: '優先挑選農漁特產展售、名產試吃試飲與傳統美食工藝工坊。',
    factoryFocus: 'gourmet_product'
  }
};

export const THEME_LIST: ThemeDefinition[] = [
  THEME_DEFINITIONS.leisure_family,
  THEME_DEFINITIONS.culture_and_lifestyle,
  THEME_DEFINITIONS.outdoor_nature,
  THEME_DEFINITIONS.local_gourmet
];

/**
 * Normalizes any incoming travelStyle string (including legacy values)
 * into one of the 4 standard ThemeKey values.
 */
export function resolveThemeKey(style: string = ''): ThemeKey {
  const s = String(style).trim();

  // Exact match on keys
  if (s === 'leisure_family' || s === 'culture_and_lifestyle' || s === 'outdoor_nature' || s === 'local_gourmet') {
    return s as ThemeKey;
  }

  // Exact match on Chinese names
  if (s === '休閒遊憩') return 'leisure_family';
  if (s === '文化生活') return 'culture_and_lifestyle';
  if (s === '戶外漫遊') return 'outdoor_nature';
  if (s === '美食尋味') return 'local_gourmet';

  // Substring match
  if (s.includes('休閒') || s.includes('親子') || s.includes('遊憩') || s.includes('leisure')) {
    return 'leisure_family';
  }
  if (s.includes('文化') || s.includes('生活') || s.includes('文青') || s.includes('歷史') || s.includes('古蹟') || s.includes('工藝') || s.includes('見學') || s.includes('culture')) {
    return 'culture_and_lifestyle';
  }
  if (s.includes('戶外') || s.includes('漫遊') || s.includes('自然') || s.includes('生態') || s.includes('山海') || s.includes('outdoor') || s.includes('nature')) {
    return 'outdoor_nature';
  }
  if (s.includes('美食') || s.includes('尋味') || s.includes('老饕') || s.includes('特產') || s.includes('小吃') || s.includes('市場') || s.includes('gourmet')) {
    return 'local_gourmet';
  }

  return 'leisure_family';
}

/**
 * Classifies a tourism factory into either entertainment-oriented or craft/knowledge-oriented
 */
export function classifyTourismFactory(factory: { name: string; intro: string }): 'entertainment' | 'craft_knowledge' | 'gourmet_product' {
  const text = `${factory.name} ${factory.intro}`;

  // Craft, Knowledge, Industrial Heritage, Brewery, Tea, Ceramic, Wood, Glass
  const craftKeywords = [
    '酒廠', '威士忌', '啤酒', '釀造', '陶瓷', '蛇窯', '陶藝',
    '老茶廠', '茶業', '茶葉', '製茶', '玻璃', '木雕', '木業',
    '紙寮', '衛浴', '衛浴文化', '紡織機', '古董', '工藝', '歷史',
    '文化館', '博物館', '展示館', '製程'
  ];

  // Entertainment, Sweets, DIY, Toys, Kids interactive
  const entertainmentKeywords = [
    '手作', 'DIY', '蛋糕', '糕餅', '甜點', '巧克力', '和菓子',
    '和果子', '餅乾', '烘焙', '玩具', '襪子', '冰品', '冰淇淋',
    '童玩', '互動', '溜滑梯', '釣魚', '想像力', '公仔', '珍珠奶茶',
    '珍奶', '可口可樂', '果凍', '糖果', '樂園', '水族'
  ];

  const hasCraft = craftKeywords.some(k => text.includes(k));
  const hasEntertainment = entertainmentKeywords.some(k => text.includes(k));

  if (hasCraft && !hasEntertainment) {
    return 'craft_knowledge';
  }
  if (hasEntertainment && !hasCraft) {
    return 'entertainment';
  }
  // If both, check dominant traits:
  if (hasCraft && /(酒廠|陶瓷|茶廠|蛇窯|木雕|紙寮|玻璃)/.test(text)) {
    return 'craft_knowledge';
  }
  if (hasEntertainment) {
    return 'entertainment';
  }
  return 'gourmet_product';
}

/**
 * 嚴格文字過濾：因晚間夜市為戶外開放空間並無冷氣，
 * 嚴禁出現「全程冷氣」或「全程鎖定室內冷氣」等字眼，
 * 並全面過濾系統規則、提示詞字串、內部需求判斷等不當敘述。
 */
export function sanitizeAirConditioningText(text: string): string {
  if (!text) return text;
  let cleaned = text
    // 移除提示詞與規則洩漏語句（如：因夜市等晚間景點無冷氣...、切勿宣稱...、之需求、預算定位為...）
    .replace(/（因夜市等晚間景點無冷氣[^）)]*）[。、，]?/g, '')
    .replace(/\(因夜市等晚間景點無冷氣[^)]*\)[。、，]?/g, '')
    .replace(/切勿宣稱[^。、，\n]*[。、，]?/g, '')
    .replace(/只能寫[^。、，\n]*[。、，]?/g, '')
    .replace(/本行程精準實踐「?[^」\n]*」?之需求[，、。]?/g, '')
    .replace(/本行程精準實踐[^，、。\n]*之需求[，、。]?/g, '')
    .replace(/精準實踐「?[^」\n]*」?之需求[，、。]?/g, '')
    .replace(/預算定位為「?[^」\n]*」?[，、。]?/g, '')
    .replace(/預算定位為[^，、。\n]*[，、。]?/g, '')
    // 嚴禁出現全程冷氣
    .replace(/全程鎖定室內冷氣充足[、，]/g, '部分場館有提供冷氣、')
    .replace(/全程鎖定室內冷氣充足/g, '部分場館有提供冷氣')
    .replace(/全程鎖定室內冷氣/g, '部分場館有提供冷氣')
    .replace(/全程鎖定室內/g, '日間精選室內')
    .replace(/全程以室內冷氣空間為主/g, '日間精選部分提供冷氣之室內場館')
    .replace(/全程以室內冷氣為主/g, '日間精選部分提供冷氣之場館')
    .replace(/全程室內冷氣充足/g, '部分場館有提供冷氣')
    .replace(/全程室內冷氣開放/g, '部分場館有提供冷氣')
    .replace(/全程室內冷氣/g, '部分場館有提供冷氣')
    .replace(/全程冷氣開放/g, '部分場館有提供冷氣')
    .replace(/全程冷氣/g, '部分場館提供冷氣')
    .replace(/全程皆有冷氣/g, '部分場館有提供冷氣')
    .replace(/全程提供冷氣/g, '部分場館有提供冷氣')
    .replace(/全程具備冷氣/g, '部分場館有提供冷氣')
    .replace(/全程室內/g, '日間室內')
    .replace(/「」之需求[，、。]?/g, '')
    .replace(/之需求[，、。]/g, '，')
    .replace(/，，/g, '，')
    .replace(/、、/g, '、')
    .trim();

  return cleaned;
}

