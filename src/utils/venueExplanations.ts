import { getTieredAccommodation, TieredHotel } from '../data/tieredAccommodations';
import { resolveThemeKey, THEME_DEFINITIONS } from '../utils/themeClassifier';

export interface VenueExplanation {
  badge: string;
  title: string;
  hotel: TieredHotel;
  itineraryFit: string;
  themeFeature: string;
}

export function getSameStayVenueExplanation(
  cityName: string,
  days: number,
  themeOrStyle: string,
  budgetTier: 'budget' | 'standard' | 'luxury',
  language: 'zh-TW' | 'en' | 'ja' | string = 'zh-TW',
  keepSameHotel: boolean = true,
  hotelIndexOrPreferred?: number | TieredHotel,
  excludedHotels?: string[]
): VenueExplanation {
  const l = (language === 'en' || language === 'ja') ? language : 'zh-TW';
  const themeKey = resolveThemeKey(themeOrStyle);
  const themeDef = THEME_DEFINITIONS[themeKey];
  
  let hotel: TieredHotel;
  if (typeof hotelIndexOrPreferred === 'object' && hotelIndexOrPreferred && 'name' in hotelIndexOrPreferred) {
    hotel = hotelIndexOrPreferred;
  } else {
    const idx = typeof hotelIndexOrPreferred === 'number' ? hotelIndexOrPreferred : 0;
    const usedSet = new Set<string>(Array.isArray(excludedHotels) ? excludedHotels : []);
    hotel = getTieredAccommodation(cityName, budgetTier, idx, l, usedSet.size > 0 ? usedSet : undefined);
  }

  const budgetLabel = budgetTier === 'budget'
    ? (l === 'en' ? 'Budget Choice' : l === 'ja' ? 'エコノミー' : '經濟小資首選')
    : budgetTier === 'luxury'
    ? (l === 'en' ? 'Luxury Premier' : l === 'ja' ? 'ラグジュアリー' : '尊榮奢華首選')
    : (l === 'en' ? 'Standard Boutique' : l === 'ja' ? 'スタンダード' : '經典質感首選');

  const themeLabel = l === 'en'
    ? themeDef.englishKey
    : l === 'ja'
    ? (themeKey === 'leisure_family' ? 'ファミリーレジャー' : themeKey === 'culture_and_lifestyle' ? '歴史文化' : themeKey === 'outdoor_nature' ? '大自然' : '名物グルメ')
    : themeDef.name;

  const badge = days === 2
    ? `${budgetLabel} • ${themeLabel}`
    : days >= 3 && !keepSameHotel
    ? `${l === 'en' ? 'Multi-Stay' : l === 'ja' ? '日替わり宿泊' : '自由換宿'} • ${themeLabel}`
    : `${budgetLabel} • ${themeLabel}`;

  const title = l === 'en'
    ? (days === 1
        ? 'Day-Trip Central Hub Venue Guide'
        : days === 2
        ? 'Accommodation Venue Recommendation'
        : keepSameHotel
        ? 'Trip Consecutive Stay Venue Guide'
        : 'Flexible Multi-Stay Accommodation Recommendations')
    : l === 'ja'
    ? (days === 1
        ? '日帰り拠点施設のご案内'
        : days === 2
        ? 'おすすめ宿泊施設のご案内'
        : keepSameHotel
        ? '旅行中同一宿泊施設のご案内（連泊）'
        : '行程に合わせた日別おすすめ宿泊施設')
    : (days === 1
        ? '單日探索中心場館說明'
        : days === 2
        ? '住宿場館建議'
        : keepSameHotel
        ? '全程入住同一住宿場館說明'
        : '依每日行程靈活更換住宿建議');

  let itineraryFit = '';
  if (l === 'en') {
    if (days === 1) {
      itineraryFit = `Situated in ${hotel.locationType} of ${cityName}, "${hotel.name}" serves as the ideal central base for daytime luggage drop-off, midday relaxation, and comfortable freshening up without traveling heavy.`;
    } else if (days === 2) {
      itineraryFit = `For this 2-day 1-night trip, we recommend staying at "${hotel.name}" (${hotel.type}), conveniently located in ${hotel.locationType} for relaxing rest after Day 1 and seamless departure on Day 2.`;
    } else if (keepSameHotel) {
      itineraryFit = `For this ${days}-day itinerary, all nights are designated at "${hotel.name}" as your single hub. This eliminates the hassle of daily luggage packing and hotel check-in transfers. Daily routes radiate smoothly from here, allowing you to return to familiar comfort each night.`;
    } else {
      itineraryFit = `For this ${days}-day ${days - 1}-night trip, ${days - 1} distinct accommodations are arranged per night (Nights 1 through ${days - 1}; no hotel needed on the final day), matching each day's route without backtracking.`;
    }
  } else if (l === 'ja') {
    if (days === 1) {
      itineraryFit = `『${hotel.name}』は${cityName}の${hotel.locationType}に位置し、日帰り観光中の手荷物預かりや散策合間の小休憩・リフレッシュ拠点として快適にご利用いただけます。`;
    } else if (days === 2) {
      itineraryFit = `1泊2日の旅程には、${hotel.locationType}に位置する「${hotel.name}」（${hotel.type}）がおすすめ。初日の観光後に快適にチェックインでき、2日目も無理のない動線で観光を楽しめます。`;
    } else if (keepSameHotel) {
      itineraryFit = `本${days}日間の周遊では、全日程『${hotel.name}』に連泊するスマートな行程を採用。毎日の荷造りやチェックインの煩わしさを解消し、当館を起点に無理のない放射状ルートで観光を満喫、夜は落ち着いた空間で上質な休息をお過ごしいただけます。`;
    } else {
      itineraryFit = `本${days}日間（${days - 1}泊）の周遊程では、第1日から第${days - 1}日までの各夜に合わせて計${days - 1}軒の特色ある宿泊施設を手配（最終日は帰路のため宿泊なし）。移動ロスを防ぎ、各地の夜の魅力を存分にお楽しみいただけます。`;
    }
  } else {
    if (days === 1) {
      itineraryFit = `座落於${cityName}${hotel.locationType}之「${hotel.name}」，作為一日遊之市區核心基地，提供便捷的日間行李暫存、梳洗與小憩服務，免去隨身負重之累。`;
    } else if (days === 2) {
      itineraryFit = `2 天 1 夜行程推薦下榻「${hotel.name}」（${hotel.type}）。座落於${hotel.locationType}，首日行程充實探訪後可便捷辦理入住與獲得深度休憩，次日出發各景點動線流暢順向。`;
    } else if (keepSameHotel) {
      itineraryFit = `全行程 ${days} 天特別規劃全程維持入住「${hotel.name}」，免去每日早起收拾大包小包行李與退房搬遷的舟車勞頓。以本館為核心基地，每日景點順向放射狀出發，夜間返回熟悉的舒適客房深度休息。`;
    } else {
      itineraryFit = `全行程 ${days} 天 ${days - 1} 夜依每日遊程動線與探訪分區，規劃 ${days - 1} 間特色旅宿（第 1 天至第 ${days - 1} 天每晚各安排 1 間，最後一天第 ${days} 天返程不需住宿），免除長途折返拉車，深度體驗不同鄉鎮聚落夜間風情。`;
    }
  }

  let themeFeature = '';
  if (l === 'en') {
    switch (themeKey) {
      case 'leisure_family':
        themeFeature = `[Family & Leisure Friendly Venue] Curated "${hotel.name}" (${hotel.type}) provides spacious guestrooms, gentle barrier-free circulation, quiet soundproofing, and comfortable air-conditioned common areas. Its convenient transit access ensures both children and senior travelers enjoy a restful, carefree stay.`;
        break;
      case 'culture_and_lifestyle':
        themeFeature = `[Heritage & Cultural Living Venue] Curated "${hotel.name}" (${hotel.type}) is immersed in ${cityName}'s historic quarter, blending artisanal craftsmanship with contemporary design. Historic alleyways, artisan workshops, and galleries are just steps away for authentic cultural immersion.`;
        break;
      case 'outdoor_nature':
        themeFeature = `[Nature & Scenic Retreat Venue] Curated "${hotel.name}" (${hotel.type}) commands sweeping scenic views and serene open surroundings. After daytime coastal strolls or forest trail hikes, return to tranquil rooms designed for deep restorative rest.`;
        break;
      case 'local_gourmet':
      default:
        themeFeature = `[Culinary Hub & Foodie Haven Venue] Curated "${hotel.name}" (${hotel.type}) is situated right by celebrated local food streets and evening night markets. Walk to historic morning markets for authentic breakfast and wander back from night market feasts with utmost ease.`;
        break;
    }
  } else if (l === 'ja') {
    switch (themeKey) {
      case 'leisure_family':
        themeFeature = `【ファミリー・レジャー特化施設】厳選された『${hotel.name}』（${hotel.type}）は、ゆとりのある客室、段差の少ない快適な動線、優れた遮音性を備えています。交通アクセスも良好で、お子様やご年配の方も連泊で安心してくつろげる理想的な宿泊環境です。`;
        break;
      case 'culture_and_lifestyle':
        themeFeature = `【歴史・文化ライフスタイル施設】『${hotel.name}』（${hotel.type}）は地域の歴史的景観や文化街区に寄り添い、伝統の温もりと洗練された美意識が調和。宿を一歩出れば古い町並みやアートスポットが広がり、深みのある街の息づかいを肌で感じられます。`;
        break;
      case 'outdoor_nature':
        themeFeature = `【自然・ネイチャーリトリート施設】豊かな自然や美しい景観に恵まれた『${hotel.name}』（${hotel.type}）。日中の山海トレッキングや岬巡りの後は、静寂に包まれた館内で心身を心地よく解きほぐし、翌日の大自然探索への活力を養えます。` ;
        break;
      case 'local_gourmet':
      default:
        themeFeature = `【グルメ探訪・名物料理特化施設】伝統的な名店街や人気夜市エリア至近の『${hotel.name}』（${hotel.type}）を厳選。朝は名物の朝食店へ、夜は活気ある夜市グルメを気軽に満喫でき、移動のストレスなく台湾本場の美食を心ゆくまで堪能できます。`;
        break;
    }
  } else {
    switch (themeKey) {
      case 'leisure_family':
        themeFeature = `【親子家庭友善專屬場館】精選「${hotel.name}」（${hotel.type}），館內具備寬敞客房、平緩無障礙動線與優良隔音，公共空間環境清爽舒適。鄰近主要交通幹道，讓長幼同樂時無須奔波換宿，回到旅宿即可徹底放鬆享受天倫時光。`;
        break;
      case 'culture_and_lifestyle':
        themeFeature = `【人文生活美學特色場館】精選「${hotel.name}」（${hotel.type}），座落於${cityName}深厚文化生活圈，建築設計兼具在地人文韻味與生活美學。步出旅店即可漫步走訪古蹟街廓與獨立文創空間，深度感受老城特有的生活底蘊。`;
        break;
      case 'outdoor_nature':
        themeFeature = `【山海自然舒壓特色場館】精選「${hotel.name}」（${hotel.type}），坐擁開闊景觀或鄰近自然綠意，提供清幽純淨的休憩氛圍與完善的戶外裝備打理便利。日間徜徉山海步道，夜間返回靜謐居所舒展身心，在微風與星空下重蓄滿滿元氣。`;
        break;
      case 'local_gourmet':
      default:
        themeFeature = `【老饕美食巡禮黃金場館】精選「${hotel.name}」（${hotel.type}），緊鄰${cityName}老字號名店商圈與知名夜市。晨起可悠閒散步品嚐在地熱門早點，入夜更能輕鬆漫步探訪人氣小吃，盡享道地舌尖饗宴，免受遠距交通阻隔。`;
        break;
    }
  }

  return {
    badge,
    title,
    hotel,
    itineraryFit,
    themeFeature
  };
}
