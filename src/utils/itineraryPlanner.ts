import { TAIWAN_CITIES } from '../data/taiwanCities';
import { getTieredAccommodation } from '../data/tieredAccommodations';
import { getSameStayVenueExplanation } from './venueExplanations';
import {
  calculateLegTransit,
  evaluateItineraryFeasibility,
  calculateReturnTrip,
  getIslandNightTransitInfo
} from './transitCalculator';
import {
  THEME_DEFINITIONS,
  resolveThemeKey,
  classifyTourismFactory,
  ThemeKey,
  sanitizeAirConditioningText
} from './themeClassifier';
import { AIItineraryResponse } from '../types';

export function isNightSpot(name: string, intro: string = ''): boolean {
  return /(夜市|鐵花村|市集夜色|星光|夜景|光雕|酒吧|居酒屋|宵夜|夜遊|夜探|夜間|聽濤泡湯|藍眼淚)/.test(`${name} ${intro}`);
}

// Specific famous night spots by city (open 17:30 - 24:00 or late night)
export const CITY_NIGHT_SPOTS: Record<string, Array<{ name: string; intro: string; googleMapsKeyword: string; operatingHours: string }>> = {
  '臺北市': [
    { name: '士林國際觀光夜市', intro: '全臺最具規模與國際知名度的觀光夜市，豪大大雞排、生炒花枝名聞遐邇。', googleMapsKeyword: '士林夜市', operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: '饒河街觀光夜市', intro: '古色古香牌樓迎賓，福州胡椒餅、藥燉排骨與百年老街美食薈萃。', googleMapsKeyword: '饒河街夜市', operatingHours: '17:00 - 24:00 (夜市營業中)' },
    { name: '大稻埕碼頭貨櫃市集夕陽夜色', intro: '淡水河畔貨櫃酒吧市集，晚風徐徐欣賞水岸燈火與落日暮色。', googleMapsKeyword: '大稻埕碼頭貨櫃市集', operatingHours: '16:00 - 24:00 (晚間營業)' },
    { name: '象山親山步道星光夜景六巨石', intro: '登高俯瞰台北101與信義區繁華璀璨燈海，經典國際級百萬夜景。', googleMapsKeyword: '象山六巨石', operatingHours: '全天開放（步道夜間安全點燈）' }
  ],
  '新北市': [
    { name: '樂華觀光夜市', intro: '永和在地老字號美食天堂，排骨酥、三鮮羹與甘蔗汁超人氣。', googleMapsKeyword: '樂華夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '板橋湳雅觀光夜市', intro: '新北代表性夜市，麻油雞、手工小籠湯包與銅板小吃雲集。', googleMapsKeyword: '湳雅夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '淡水漁人碼頭情人橋璀璨夜景', intro: '漫步白色風帆情人橋，晚風吹拂欣賞出海口璀璨港灣夜色。', googleMapsKeyword: '淡水情人橋', operatingHours: '全天開放（夜間景觀點燈至 22:30）' }
  ],
  '基隆市': [
    { name: '基隆廟口夜市', intro: '百年奠濟宮前的美食寶庫，鼎邊趺、營養三明治、泡泡冰名揚全臺。', googleMapsKeyword: '基隆廟口夜市', operatingHours: '17:00 - 24:00 (夜市熱鬧營業中)' },
    { name: '基隆港海洋廣場夜景', intro: '倚靠木棧道迎著海風，欣賞國際郵輪靠泊與基隆港灣萬家燈火。', googleMapsKeyword: '基隆海洋廣場', operatingHours: '全天開放（夜間水岸照明）' }
  ],
  '宜蘭縣': [
    { name: '羅東觀光夜市', intro: '全臺票選人氣夜市，三星蔥肉串、阿躁羊肉湯、卜肉美味滿溢。', googleMapsKeyword: '羅東夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '礁溪湯圍溝溫泉公園夜間足湯', intro: '檜木涼亭與天然溫泉水道，晚間免費體驗戶外露天暖心足湯。', googleMapsKeyword: '湯圍溝溫泉公園', operatingHours: '全天開放（公園夜間點燈）' }
  ],
  '桃園市': [
    { name: '中壢觀光夜市', intro: '桃園最具代表性夜市，溫家豆花、麻辣臭豆腐、夜市牛排老味道。', googleMapsKeyword: '中壢夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '虎頭山環保公園星光夜景', intro: '桃園最高地標夜景公園，俯瞰大桃園平原萬家星火璀璨如畫。', googleMapsKeyword: '虎頭山環保公園', operatingHours: '全天開放（夜間景觀設施點燈）' }
  ],
  '新竹市': [
    { name: '新竹都城隍廟廟口小吃商圈', intro: '百年都城隍廟廣場周邊，米粉、貢丸湯、肉圓等正宗風城美味齊聚。', googleMapsKeyword: '新竹城隍廟', operatingHours: '17:00 - 22:30 (商圈晚市營業中)' },
    { name: '南寮漁港波光市集夕陽晚霞', intro: '黃金海岸波浪建築市集，傍晚品嚐海鮮炸物欣賞落日與水岸光影。', googleMapsKeyword: '南寮波光市集', operatingHours: '16:00 - 21:00 (晚市營業中)' }
  ],
  '新竹縣': [
    { name: '竹東中央市場晚間在地美食街', intro: '品嚐客家粄條、客家鹹豬肉與在地宵夜手路菜。', googleMapsKeyword: '竹東中央市場', operatingHours: '17:30 - 22:30 (晚市餐飲營業中)' }
  ],
  '苗栗縣': [
    { name: '苗栗英才觀光夜市', intro: '在地人每逢夜晚必逛的排隊夜市，地瓜球、原木烤肉與特色冰品。', googleMapsKeyword: '苗栗英才夜市', operatingHours: '17:30 - 23:30 (夜市熱鬧營業中)' }
  ],
  '臺中市': [
    { name: '逢甲國際觀光夜市', intro: '全臺流行美食發源地，大腸包小腸、明倫蛋餅、章魚小丸子創新美味。', googleMapsKeyword: '逢甲夜市', operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: '一中商圈在地美食街', intro: '青春洋溢的學區商圈，豪大雞排、豐仁冰與各式文青手搖茶飲。', googleMapsKeyword: '一中街商圈', operatingHours: '16:00 - 23:00 (商圈營業中)' },
    { name: '望高寮夜景公園', intro: '臺中版百萬夜景展望台，木棧道眺望臺中都會區與彰化平原燈火。', googleMapsKeyword: '望高寮夜景公園', operatingHours: '全天開放（公園安全照明點燈）' }
  ],
  '彰化縣': [
    { name: '精誠觀光夜市', intro: '彰化規模最大人氣夜市，排骨酥、涼圓與在地特色銅板美食匯集。', googleMapsKeyword: '精誠夜市', operatingHours: '17:30 - 23:30 (夜市營業中)' },
    { name: '八卦山天空步道夜間星光光雕', intro: '漫步綠林高架步道，夜間遠眺彰化市街燦爛星火。', googleMapsKeyword: '八卦山天空步道', operatingHours: '全天開放（夜間光雕點燈至 22:00）' }
  ],
  '南投縣': [
    { name: '日月潭水社碼頭湖畔夜色漫步', intro: '夜幕降臨湖面波光粼粼，遠眺對岸飯店星光，微風拂面沉澱心靈。', googleMapsKeyword: '日月潭水社碼頭', operatingHours: '全天開放（湖畔步道夜間點燈）' },
    { name: '草屯草鞋墩人文觀光夜市', intro: '南投最大觀光夜市，傳統古早味小吃與在地農產市集。', googleMapsKeyword: '草鞋墩夜市', operatingHours: '17:30 - 23:30 (夜市營業中)' }
  ],
  '雲林縣': [
    { name: '斗六人文觀光夜市', intro: '雲林最盛大觀光夜市，千坪攤位匯聚全臺流行小吃與在地美味。', googleMapsKeyword: '斗六人文夜市', operatingHours: '17:30 - 23:30 (夜市營業中)' },
    { name: '虎尾鐵橋夜間璀璨光雕', intro: '百年鋼桁架歷史鐵橋，夜間投射七彩魔幻燈光，浪漫非凡。', googleMapsKeyword: '虎尾鐵橋', operatingHours: '全天開放（光雕點燈至 22:00）' }
  ],
  '嘉義市': [
    { name: '文化路觀光夜市', intro: '嘉義美食心臟！正宗嘉義火雞肉飯、林聰明沙鍋魚頭、豆花熱鬧非凡。', googleMapsKeyword: '文化路夜市', operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: '蘭潭月影潭心璀璨水舞光影', intro: '全臺最大水舞噴泉之一，鋁片編織鏤空鳥巢造型與彩色光影交織。', googleMapsKeyword: '蘭潭月影潭心', operatingHours: '全天開放（水舞音樂表演至 21:00）' },
    { name: '森林之歌夜間奇幻光影', intro: '由在地藝術家以木材、鐵軌打造如鳥巢之藝術巨蛋，夜間點燈夢幻。', googleMapsKeyword: '森林之歌', operatingHours: '全天開放（夜間景觀光雕點燈）' }
  ],
  '嘉義縣': [
    { name: '朴子夜市', intro: '在地人激推的傳統夜市，排隊蒜頭餅、東石海鮮炸物與燒烤香氣四溢。', googleMapsKeyword: '朴子夜市', operatingHours: '17:30 - 23:30 (夜市營業中)' },
    { name: '太平雲梯星空夜景景觀台', intro: '海拔千米的高山單塔斜張吊橋，俯瞰嘉南平原萬家燈火與浩瀚星空。', googleMapsKeyword: '太平雲梯', operatingHours: '全天開放（戶外觀景平台）' }
  ],
  '臺南市': [
    { name: '花園觀光夜市', intro: '全臺指標性超大規模夜市，旗海飄揚，二師兄滷味、統大碳烤香雞排。', googleMapsKeyword: '花園夜市', operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: '神農街老屋文青夜間漫步', intro: '清代古街紅燈籠搖曳，斑駁磚木老屋改建的特色咖啡館與酒吧。', googleMapsKeyword: '神農街', operatingHours: '全天開放（店家營業至深夜）' },
    { name: '十鼓夜間星光糖廠魔幻散步', intro: '夜幕降臨後的百年老糖廠天空步道與巨大糖蜜罐，點燈後宛如魔幻工業城堡。', googleMapsKeyword: '十鼓仁糖文創園區 夜景', operatingHours: '18:00 - 20:30 (夜間星光票入場)' },
    { name: '大東觀光夜市', intro: '在地人每週一人潮鼎沸之經典夜市，原作杏仁豆腐、拔絲地瓜與延陵溫體牛肉湯。', googleMapsKeyword: '大東夜市', operatingHours: '18:00 - 23:30 (夜市營業中)' },
    { name: '安平運河金色流域遊船夜景', intro: '沿著安平運河漫步或搭乘遊船，七彩LED橋樑光雕倒映水面極盡浪漫。', googleMapsKeyword: '安平運河金色流域', operatingHours: '全天開放（運河光廊點燈至 23:00）' }
  ],
  '高雄市': [
    { name: '六合國際觀光夜市', intro: '高雄知名度最高夜市，正老牌木瓜牛奶、海產粥、烤肉之家享譽國際。', googleMapsKeyword: '六合夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '瑞豐觀光夜市', intro: '在地年輕人最愛夜市，千攤聚集，流行美食與排隊點心應有盡有。', googleMapsKeyword: '瑞豐夜市', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '大港橋水岸旋轉光雕夜景', intro: '全臺首座水平旋轉橋，結合駁二藝術特區水岸港灣萬家燈火。', googleMapsKeyword: '高雄大港橋', operatingHours: '全天開放（港灣夜間景觀點燈）' },
    { name: '愛河之心愛之船浪漫夜遊', intro: '如心型之水岸湖泊，搭乘太陽能愛之船穿梭於七彩虹橋之間。', googleMapsKeyword: '愛河之心', operatingHours: '全天開放（水岸照明點燈）' }
  ],
  '屏東縣': [
    { name: '墾丁大街觀光夜市', intro: '國境之南南洋風情不夜城，熱炒海鮮、泰式調酒與沙灘漫遊。', googleMapsKeyword: '墾丁大街', operatingHours: '17:30 - 24:00 (夜市營業中)' },
    { name: '屏東觀光夜市', intro: '民族路老牌夜市，肉圓、香菇肉羹、愛玉冰與土魠魚羹在地老滋味。', googleMapsKeyword: '屏東觀光夜市', operatingHours: '17:00 - 24:00 (夜市營業中)' }
  ],
  '花蓮縣': [
    { name: '東大門國際觀光夜市', intro: '四大主題街區匯聚四百攤，原住民風味料理、海鮮燒烤與街頭表演。', googleMapsKeyword: '花蓮東大門夜市', operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: '太平洋公園海風星空漫步', intro: '太平洋海岸浪花拍打，晚間沿著濱海步道遠眺花蓮港船燈與浩瀚繁星。', googleMapsKeyword: '花蓮太平洋公園', operatingHours: '全天開放（步道安全照明）' }
  ],
  '臺東縣': [
    { name: '鐵花村音樂聚落慢市集夜色', intro: '彩繪熱氣球燈海如繁星點點，草地音樂會與在地手作小農市集。', googleMapsKeyword: '鐵花村音樂聚落', operatingHours: '17:00 - 22:00 (市集與音樂表演)' },
    { name: '臺東正氣路觀光夜市', intro: '週四至週六熱鬧登場，東河包子、炸海鮮與台東在地水果冰品。', googleMapsKeyword: '臺東觀光夜市', operatingHours: '17:30 - 23:30 (夜市營業中)' }
  ],
  '澎湖縣': [
    { name: '馬公中正路夜市商圈', intro: '澎湖夜晚最熱鬧市街，仙人掌冰、黑糖糕、小管麵線與海鮮炸物。', googleMapsKeyword: '馬公中正路商圈', operatingHours: '17:30 - 23:30 (商圈營業中)' },
    { name: '觀音亭西瀛虹橋璀璨七彩夜景', intro: '花火節主場地，七彩虹橋燈光倒映平靜海面，海風吹拂無比放鬆。', googleMapsKeyword: '觀音亭西瀛虹橋', operatingHours: '全天開放（虹橋夜間點燈至 22:00）' }
  ],
  '金門縣': [
    { name: '後浦十六藝文特區夜間市集', intro: '陳氏宗祠旁閩南古厝群，老屋酒吧、金門高粱調酒與文創聚落。', googleMapsKeyword: '後浦十六藝文特區', operatingHours: '17:30 - 22:30 (晚間營業中)' },
    { name: '莒光樓夜間金門海峽璀璨光雕秀', intro: '登上莒光樓遠眺廈門燦爛天際線，園區定時上演震撼夜間雷射燈光秀。', googleMapsKeyword: '莒光樓', operatingHours: '08:00 - 22:00 (夜間開放參觀)' }
  ],
  '連江縣': [
    { name: '南竿介壽村在地海鮮晚餐名店商圈', intro: '品嚐現撈淡菜、老酒黃魚、紅糟肉與馬祖特產老酒麵線。', googleMapsKeyword: '南竿介壽村', operatingHours: '17:30 - 21:30 (晚市餐飲營業中)' },
    { name: '鐵堡海崖星空與藍眼淚夜探', intro: '入夜後漫步海崖軍事坑道堡壘，迎風仰望零光害銀河與夢幻藍眼淚。', googleMapsKeyword: '馬祖鐵堡', operatingHours: '全天開放（戶外夜空觀星）' }
  ],
  '綠島': [
    { name: '朝日溫泉夜間星空聽濤泡湯', intro: '世界三大海底鹹水溫泉之一，夜晚沐浴於溫潤暖泉中仰望無光害銀河繁星與聽太平洋海濤。', googleMapsKeyword: '綠島朝日溫泉', operatingHours: '18:00 - 24:00 (夜間露天溫泉開放)' },
    { name: '綠島南寮大街晚市美食小吃商圈', intro: '綠島夜晚最熱鬧大街，品嚐海草冰品、現烤鹿肉乾、炸鬼頭刀與在地文創小店。', googleMapsKeyword: '綠島南寮大街', operatingHours: '17:00 - 23:00 (商圈營業中)' }
  ],
  '蘭嶼': [
    { name: '東清灣海灘夜間星空銀河觀賞', intro: '全島零光害，坐在珊瑚礁礫石灘上，仰望繁星燦爛的銀河拱橋與拼板舟剪影相映。', googleMapsKeyword: '東清灣', operatingHours: '全天開放（戶外零光害觀星）' },
    { name: '紅頭村與野銀部落夜間特色風味小酒館', intro: '海邊露天木棧平台，品嚐在地酥炸飛魚乾、林投果飲品與特調雞尾酒，享受海風微醺。', googleMapsKeyword: '蘭嶼 紅頭村 美食', operatingHours: '18:00 - 23:30 (夜間餐飲營業中)' }
  ],
  '琉球嶼': [
    { name: '民生路白沙觀光港夜市小吃商圈', intro: '小琉球夜晚最熱鬧大街，品嚐現炸飛魚卵香腸、海龜燒、現烤起司蔥餅與現做香脆麻花捲。', googleMapsKeyword: '小琉球民生路美食', operatingHours: '17:30 - 23:00 (夜間商圈營業中)' },
    { name: '落日亭海崖夜間潮汐聽濤觀星', intro: '小琉球西南端零光害海崖觀景平台，仰望浩瀚銀河繁星與落月，聆聽巴士海峽潮聲。', googleMapsKeyword: '小琉球落日亭', operatingHours: '全天開放（戶外零光害夜空觀星）' }
  ]
};

// Helper: Enrich itinerary with verified Google Maps routing, return trip, and feasibility
export function enrichItineraryWithRealTransit(
  result: any,
  cityName: string,
  numDays: number,
  transport: string,
  userLocation: { lat: number; lng: number } | null = null,
  closestCityName: string | null = null
): AIItineraryResponse {
  const cityData = TAIWAN_CITIES.find(c => c.name === cityName) || TAIWAN_CITIES[0];

  // Requirement: 當使用者選擇一日遊不要顯示首晚建議入住
  if (numDays === 1) {
    result.hotelAdvice = '';
    if (Array.isArray(result.itinerary) && result.itinerary[0]) {
      result.itinerary[0].stayHotel = undefined;
    }
  } else if (numDays === 2 && result.hotelAdvice) {
    result.hotelAdvice = result.hotelAdvice.replace(/，後續亦可體驗.*$/, '，感受晨昏景致與在地人文風情。')
                                           .replace(/，後續亦可入住.*$/, '，享受悠閒渡假時光。')
                                           .replace(/【靈活深度住宿推薦】/g, '【精選深度住宿推薦】');
  }

  // Calculate real inter-spot travel times & Google Maps navigation links
  if (Array.isArray(result.itinerary)) {
    result.itinerary.forEach((day: any, dIdx: number) => {
      if (Array.isArray(day.spots)) {
        day.spots.forEach((spot: any, sIdx: number) => {
          if (sIdx < day.spots.length - 1) {
            const nextSpot = day.spots[sIdx + 1];
            const leg = calculateLegTransit(spot, nextSpot, cityData, transport);
            spot.nextSpotName = nextSpot.name;
            spot.nextLegDistanceKm = leg.distanceKm;
            spot.nextLegDurationMin = leg.durationMinutes;
            spot.nextLegDurationText = leg.durationText;
            spot.nextLegMapsUrl = leg.mapsUrl;
            spot.nextLegWarning = leg.warning;
            spot.transportToNext = leg.durationText;
          } else {
            // Last spot of the day
            spot.nextSpotName = undefined;
            spot.nextLegDistanceKm = undefined;
            spot.nextLegDurationMin = undefined;
            spot.nextLegDurationText = undefined;
            spot.nextLegMapsUrl = undefined;
          }
        });

        // User requirement:
        // 1. 旅程中若一日往返或旅程最後一天，才增加定位返程路線指引
        // 2. 若遊玩有住宿需要標記住宿地點和交通時間
        // 3. 若使用者維持同住宿，也要在每天的最後行程加入住宿休息得場館
        // 4. 若不同間也要結合 google map 計算好交通時間距離和住宿場域
        const isSingleDay = result.itinerary.length === 1;
        const isFinalDay = dIdx === result.itinerary.length - 1;

        // Morning departure from previous night's hotel (for Day 2+)
        if (dIdx > 0 && day.spots && day.spots.length > 0) {
          const prevDay = result.itinerary[dIdx - 1];
          const prevHotelName =
            prevDay?.stayRecommendation?.hotel_name ||
            prevDay?.stayHotel ||
            result.baseHotelName;

          if (prevHotelName) {
            const firstSpot = day.spots[0];
            const hotelOrigin = {
              name: prevHotelName,
              googleMapsKeyword: `${prevHotelName} ${cityData.name}`
            };
            const morningLeg = calculateLegTransit(hotelOrigin, firstSpot, cityData, transport);
            day.morningDepartureFromStay = {
              hotelName: prevHotelName,
              toSpotName: firstSpot.name,
              distanceKm: morningLeg.distanceKm,
              durationMinutes: morningLeg.durationMinutes,
              durationText: morningLeg.durationText,
              mapsUrl: morningLeg.mapsUrl
            };
          }
        } else {
          day.morningDepartureFromStay = undefined;
        }

        if (isSingleDay || isFinalDay) {
          // One-day round trip or final day: No stay venue at night, provide departure return route guidance
          day.stayHotel = undefined;
          day.stayRecommendation = undefined;

          if (day.spots.length > 0) {
            const lastSpot = day.spots[day.spots.length - 1];
            const returnTrip = calculateReturnTrip(
              lastSpot,
              cityData,
              userLocation,
              closestCityName,
              transport,
              true
            );
            day.returnTrip = returnTrip;
          }
        } else {
          // Intermediate days (N days = N - 1 nights):
          // NO return trip to departure point on non-final days
          day.returnTrip = undefined;

          // Connect last daytime spot to the evening accommodation venue
          const hotelName = day.stayRecommendation?.hotel_name || day.stayHotel;
          if (hotelName && day.spots.length > 0) {
            const lastSpot = day.spots[day.spots.length - 1];
            const hotelSpot = {
              name: hotelName,
              googleMapsKeyword: `${hotelName} ${cityData.name}`
            };
            const stayLeg = calculateLegTransit(lastSpot, hotelSpot, cityData, transport);

            // Check if staying at a different accommodation from previous night
            let isDifferentFromPrev = false;
            let interHotelTransit = undefined;

            if (dIdx > 0) {
              const prevDay = result.itinerary[dIdx - 1];
              const prevHotelName =
                prevDay?.stayRecommendation?.hotel_name ||
                prevDay?.stayHotel ||
                result.baseHotelName;

              if (prevHotelName && prevHotelName !== hotelName) {
                isDifferentFromPrev = true;
                const prevHotelSpot = {
                  name: prevHotelName,
                  googleMapsKeyword: `${prevHotelName} ${cityData.name}`
                };
                const interHotelLeg = calculateLegTransit(prevHotelSpot, hotelSpot, cityData, transport);
                interHotelTransit = {
                  prevHotelName,
                  nextHotelName: hotelName,
                  distanceKm: interHotelLeg.distanceKm,
                  durationMinutes: interHotelLeg.durationMinutes,
                  durationText: interHotelLeg.durationText,
                  mapsUrl: interHotelLeg.mapsUrl
                };
              }
            }

            day.stayRecommendation = {
              ...(day.stayRecommendation || {
                hotel_name: hotelName,
                location_type: '探索軸線生活圈',
                feature: '優質舒適住宿，提供旅人充沛放鬆與休憩時光。'
              }),
              hotel_name: hotelName,
              distanceKm: stayLeg.distanceKm,
              durationMin: stayLeg.durationMinutes,
              durationText: stayLeg.durationText,
              googleMapsUrl: stayLeg.mapsUrl,
              checkInTime: '20:00 起 / 晚間入住休息',
              isDifferentFromPrev,
              transitFromPrevHotel: interHotelTransit
            };

            // Link last daytime spot to hotel navigation
            lastSpot.nextSpotName = hotelName;
            lastSpot.nextLegDistanceKm = stayLeg.distanceKm;
            lastSpot.nextLegDurationMin = stayLeg.durationMinutes;
            lastSpot.nextLegDurationText = stayLeg.durationText;
            lastSpot.nextLegMapsUrl = stayLeg.mapsUrl;
            lastSpot.transportToNext = stayLeg.durationText;
          }
        }
      }
    });
  }

  // Feasibility Check & Alternative transport recommendations
  const feasibility = evaluateItineraryFeasibility(result.itinerary, transport, cityName);
  result.transitFeasibility = feasibility;

  // Island Night Flight and Ferry Schedule Guidance
  const islandInfo = getIslandNightTransitInfo(cityName);
  if (islandInfo) {
    result.islandNightTransit = islandInfo;
    const nightNote = `${islandInfo.flightNightNotice || ''} ${islandInfo.ferryNightNotice || ''} ${islandInfo.generalAdvice || ''}`.trim();
    if (!result.transitNotice || !result.transitNotice.includes('末班')) {
      result.transitNotice = result.transitNotice
        ? `${result.transitNotice}\n\n【離島晚間航班與船班返程指引】：${nightNote}`
        : `【離島晚間航班與船班返程指引】：${nightNote}`;
    }
  }

  // Sanitize air conditioning mentions: Night markets don't have AC, so never say "全程", only "部分場館有提供冷氣"
  if (result) {
    if (typeof result.overview === 'string') {
      result.overview = sanitizeAirConditioningText(result.overview);
    }
    if (typeof result.transitNotice === 'string') {
      result.transitNotice = sanitizeAirConditioningText(result.transitNotice);
    }
    if (Array.isArray(result.itinerary)) {
      result.itinerary.forEach((day: any) => {
        if (Array.isArray(day.spots)) {
          day.spots.forEach((spot: any) => {
            if (typeof spot.intro === 'string') {
              spot.intro = sanitizeAirConditioningText(spot.intro);
            }
            if (typeof spot.activityPlayStyle === 'string') {
              spot.activityPlayStyle = sanitizeAirConditioningText(spot.activityPlayStyle);
            }
            const isNight = spot.isNightSpot || isNightSpot(spot.name || '', spot.intro || '');
            if (isNight) {
              spot.isNightSpot = true;
              if (spot.name.includes('鐵花村')) {
                spot.operatingHours = '17:00 - 22:00 (慢市集與音樂表演)';
              } else if (spot.name.includes('夜市')) {
                spot.operatingHours = '17:30 - 24:00 (夜市熱鬧營業中)';
              } else if (/夜景|星光|光雕|星空|月影/.test(spot.name)) {
                spot.operatingHours = '全天開放（夜間照明點燈）';
              } else if (!spot.operatingHours || spot.operatingHours.startsWith('09:00 - 17:00')) {
                spot.operatingHours = '17:30 - 24:00 (夜間營業中)';
              }
            } else {
              spot.isNightSpot = false;
              if (spot.timeSlot === 'morning') {
                if (!spot.operatingHours || spot.operatingHours.includes('夜市') || spot.operatingHours.includes('夜間')) {
                  spot.operatingHours = '09:00 - 17:00 (日間場館開放)';
                }
              } else if (spot.timeSlot === 'afternoon') {
                if (!spot.operatingHours || spot.operatingHours.includes('夜市') || spot.operatingHours.includes('夜間')) {
                  spot.operatingHours = '09:00 - 17:00 (日間場館・17:00 打烊前參觀完畢)';
                }
              }
            }
            if (typeof spot.operatingHours === 'string') {
              spot.operatingHours = sanitizeAirConditioningText(spot.operatingHours);
            }
          });
        }
      });
    }
  }

  return result;
}

export const CITY_AXIS_REGIONS: Record<string, string[]> = {
  '臺北市': [
    '大稻埕與淡水河左岸人文生活線',
    '北投溫泉與陽明山竹子湖幽境',
    '信義象山與松山文創光影廊道',
    '貓空茶香與文山老街古道',
    '萬華艋舺傳統老字號美饌線',
    '士林天母異國風情與芝山岩生態'
  ],
  '新北市': [
    '金山萬里北海岸海風生活線',
    '石碇千島湖與坪林茶香老街秘境',
    '瑞芳九份與平溪望古鐵道瀑布',
    '雙溪貢寮草嶺古道與福隆山海線',
    '三峽鶯歌文史老街與陶瓷傳產',
    '三芝石門淺水灣梯田與富貴角燈塔',
    '淡水八里水岸漁火夕陽漫步',
    '烏來原鄉瀑布與泰雅溫泉體驗'
  ],
  '基隆市': [
    '基隆廟口與正濱漁港彩虹水岸',
    '和平島地質奇岩與八斗子潮境',
    '白米甕砲台與西岸秘境燈塔',
    '外木山濱海大道與大武崙砲台'
  ],
  '宜蘭縣': [
    '頭城外澳烏石港衝浪海風線',
    '大同清水地熱與九寮溪生態步道',
    '三星蔥田手作與員山金車生態線',
    '冬山梅花湖生態綠舟與老街茶園',
    '礁溪湯圍溫泉與五峰旗飛瀑漫遊',
    '南澳東澳粉鳥林秘境與泰雅文化',
    '蘇澳南方澳鯖魚港灣海味巡禮'
  ],
  '桃園市': [
    '大溪老街木藝與慈湖茶廠山城',
    '復興角板山北橫入口與拉拉山神木',
    '龍潭三坑老街與石門活魚生態',
    '新屋觀音濱海綠色隧道與永安海螺館',
    '中壢觀光夜市與馬祖新村文創眷村',
    '蘆竹大園坑口彩繪村與竹圍漁港'
  ],
  '新竹市': [
    '舊城都城隍廟與東門城文青巷弄',
    '南寮波光市集與十七公里黃金海岸',
    '青草湖水岸與十八尖山綠意步道',
    '香山濕地賞蟹步道與海山漁港夕陽'
  ],
  '新竹縣': [
    '北埔峨眉客家膨風茶鄉與細茅埔吊橋',
    '竹東中央市場與內灣鐵道客家山城',
    '關西仙草博物館與東安古橋歷史線',
    '尖石青蛙石天空步道與原鄉溫泉',
    '新豐紅樹林木棧道與湖口老街巡禮',
    '五峰清泉張學良故居與霞喀羅古道'
  ],
  '苗栗縣': [
    '南庄向天湖與蓬萊杉林秘境老街',
    '三義木雕工藝與舊山線鐵道自行車',
    '通霄白沙屯拱天宮與飛牛牧場草原',
    '苑裡山腳國小日治宿舍與藺草編織',
    '大湖草莓田園與泰安清安豆腐街溫泉',
    '獅潭鳴鳳古道與仙山仙草茶鄉',
    '銅鑼客家大院與杭菊花海鐵道線'
  ],
  '臺中市': [
    '外埔忘憂谷稻浪與大甲鎮瀾宮海線',
    '后里泰安落羽松與月眉百年糖廠',
    '東勢客家文化園區與林場生態步道',
    '石岡水壩與東豐綠廊鐵馬道',
    '和平谷關溫泉與八仙山森林浴',
    '霧峰林家花園與光復新村文青聚落',
    '清水梧棲高美濕地與海線漁火生活',
    '西區草悟道美學與審計眷村聚落'
  ],
  '彰化縣': [
    '鹿港小鎮九曲巷百年工藝生活線',
    '田尾公路花園花卉園藝與永靖老街',
    '芳苑海空步道海牛採蚵潮間帶體驗',
    '二林葡萄酒莊聚落與蕎麥花海',
    '社頭織襪芭樂之鄉與清水岩步道',
    '田中米倉綠意廊道與森林公園',
    '二水八堡圳自行車道與螺溪硯文史',
    '八卦山天空步道與大佛星光文化線'
  ],
  '南投縣': [
    '信義梅子夢工廠與風櫃斗梅鄉秘境',
    '仁愛清境高空步道與奧萬大楓林',
    '竹山紫南宮與大鞍竹海天梯',
    '水里車埕鐵道木業與蛇窯陶藝',
    '國姓糯米橋與客家咖啡莊園',
    '中寮石龍宮泡麵土地公與龍鳳瀑布',
    '日月潭水社向山環湖水岸悠境',
    '鹿谷溪頭銀杏茶鄉林間漫步',
    '埔里酒廠工坊與桃米紙教堂生態'
  ],
  '雲林縣': [
    '古坑華山咖啡公路與綠色隧道',
    '西螺延平老街百年醬油與西螺大橋',
    '虎尾糖廠鐵道與布袋戲文創生活館',
    '口湖成龍濕地夕陽與鰻魚產業故事',
    '北港朝天宮廟宇工藝與老街麻油糕餅',
    '崙背酪農千巧谷與二崙褒忠文化線',
    '林內落羽松農田與林中龍過脈步道'
  ],
  '嘉義市': [
    '檜意森活村與阿里山林業鐵道記憶',
    '嘉義東市場傳統手路菜與桃城老街',
    '蘭潭月影潭心與後山步道舒活漫遊',
    '嘉義市立美術館與文化路歷史散步'
  ],
  '嘉義縣': [
    '梅山太平雲梯與三十六彎茶鄉',
    '阿里山奮起湖老街便當與巨木神木群',
    '布袋東石海線外傘頂洲蚵田生態風情',
    '太保六腳蒜頭糖廠與南故宮藝文廊道',
    '大林佐登妮絲城堡與蓋婭歐風莊園聚落',
    '民雄金桔觀光工廠與旺萊山鳳梨之鄉',
    '竹崎親水公園與獨立山螺旋鐵道',
    '番路半天岩紫雲寺與逐鹿部落射箭',
    '大埔曾文水庫湖光山色尋幽'
  ],
  '臺南市': [
    '六甲官田柳營落羽松水雉與荷蘭村酪農牧野線',
    '官田隆田chacha文化資產與水雉生態悠活線',
    '柳營德元埤荷蘭村與八翁酪農牧場巡禮',
    '白河關子嶺水火同源泥漿溫泉與蓮花田園線',
    '後壁菁寮無米樂老街與割稻飯文化慢遊線',
    '東山175咖啡公路與楠西梅嶺山林美饌線',
    '玉井芒果之鄉與山上花園水道博物館線',
    '新化大目降文化園區與左鎮化石博物館線',
    '七股北門將軍濱海鹽田夕照與扇形鹽田線',
    '麻豆文旦柚香總爺與鹽水八角樓老街線',
    '中西區安平舊城老巷弄古蹟人文巡禮',
    '仁德都會文創十鼓糖廠與奇美藝術殿堂巡禮'
  ],
  '高雄市': [
    '美濃客家紙傘粄條與旗山糖鐵老街山城',
    '六龜寶來不老溫泉與甲仙芋頭老街',
    '田寮月世界泥火山惡地與阿蓮大崗山一線天',
    '永安石斑魚故鄉與彌陀海岸光廊海風線',
    '梓官蚵仔寮觀光漁市與茄萣情人碼頭',
    '大樹舊鐵橋濕地與佛光山佛陀紀念館',
    '鹽埕哈瑪星旗津舊港生活與渡輪',
    '左營蓮池潭舊城眷村歷史巡禮'
  ],
  '屏東縣': [
    '萬巒客家豬腳老街與萬金聖母聖殿',
    '潮州林後四林平地森林與冷熱冰美食',
    '三地門霧台排灣魯凱琉璃山林部落',
    '車城福安宮與四重溪溫泉日式足湯',
    '滿州佳樂水奇岩與港口村海景茶香',
    '枋山愛文芒果海景咖啡與枋寮鐵道藝術',
    '佳冬蕭家古厝客家聚落與林邊黑珍珠蓮霧',
    '恆春後壁湖落山風半島海景線',
    '東港海港黑鮪魚與大鵬灣潟湖單車'
  ],
  '花蓮縣': [
    '新城秀林太魯閣峽谷壯景與七星潭海灣',
    '壽豐鯉魚潭與光復大農大富平地森林',
    '光復糖廠冰品與瑞穗黃金溫泉茶香',
    '玉里客城鐵橋玉里麵與富里六十石山金針花',
    '豐濱石梯坪海蝕奇岩與濱海生活線',
    '花蓮吉安慶修院日式文史與太平洋水岸'
  ],
  '臺東縣': [
    '成功長濱金剛大道與蔚藍太平洋海線生活',
    '池上伯朗大道稻浪與關山米國學校鐵馬線',
    '鹿野高台熱氣球茶鄉與延平布農部落',
    '太麻里金針山日出與多良最美火車站',
    '東河金尊衝浪水岸與都蘭糖廠文創聚落',
    '知本溫泉美人湯與卑南文化公園'
  ],
  '澎湖縣': [
    '馬公篤行十村文創與老街天后宮人文',
    '白沙西嶼跨海大橋與外垵漁火夕照',
    '湖西奎壁山摩西分海與在地特色石滬',
    '七美望安雙心石滬與綠蠵龜跳島'
  ],
  '金門縣': [
    '金城水頭得月樓閩南古厝生活群',
    '金沙沙美摩洛哥老街與洋樓歷史記憶',
    '金湖太湖漂浮斑馬線與戰地坑道秘境',
    '烈嶼小金門芋頭香與地雷主題園區'
  ],
  '連江縣': [
    '南竿北海坑道與媽祖巨神像星空巡禮',
    '北竿芹壁地中海石屋與坂里沙灘漫步',
    '東莒大埔聚落東犬燈塔水岸慢活',
    '東引安東坑道與東湧燈塔天涯海角'
  ],
  '綠島': [
    '綠島環島海岸奇岩與燈塔潟湖',
    '朝日溫泉海潮聽濤與大白沙珊瑚礁',
    '柚子湖古厝秘境與海蝕門探索'
  ],
  '蘭嶼': [
    '東清灣拼板舟晨曦與情人洞海蝕門',
    '青青草原浩瀚海崖夕陽與野銀地下屋',
    '紅頭村文化巡禮與氣象站制高點'
  ],
  '琉球嶼': [
    '花瓶岩與美人洞珊瑚礁步道生態',
    '山豬溝熱帶原始雨林與一線天秘境',
    '烏鬼洞海蝕岩穴與落日亭海崖晚霞'
  ],
  '小琉球': [
    '花瓶岩與美人洞珊瑚礁步道生態',
    '山豬溝熱帶原始雨林與一線天秘境',
    '烏鬼洞海蝕岩穴與落日亭海崖晚霞'
  ]
};

// Fallback curated itinerary generator with strict non-repeating attractions guarantee
export function generateCuratedFallback(
  cityName: string,
  days: number,
  style: string,
  transport: string,
  keepSameHotel: boolean = false,
  budgetLevel: 'budget' | 'standard' | 'luxury' = 'standard',
  language: string = 'zh-TW',
  variationSeed: number = 0,
  excludedSpots: string[] = [],
  excludedHotels: string[] = []
): AIItineraryResponse {
  const cityData = TAIWAN_CITIES.find(c => c.name === cityName) || TAIWAN_CITIES[0];
  const l = (language === 'en' || language === 'ja') ? language : 'zh-TW';

  let transitNotice = '';
  if (cityData.islandNotice) {
    transitNotice = cityData.islandNotice;
  } else if (['搭飛機', '國內班機直飛'].includes(transport)) {
    transitNotice = l === 'en'
      ? `[${cityName} Flight Guide] Take domestic flight to the nearest airport, then transfer via taxi or shuttle to top attractions.`
      : l === 'ja'
      ? `【${cityName}航空ガイド】国内線で最寄り空港到着後、タクシーまたは連絡バスで主要観光スポットへアクセス。`
      : `【${cityName}航空指南】搭乘國內班機抵達鄰近機場後，轉乘排班計程車或接駁車前往市區熱門景點。`;
  } else if (['高鐵', '台灣高鐵'].some(k => transport.includes(k))) {
    transitNotice = l === 'en'
      ? `[${cityName} High-Speed Rail Guide] Arrive at the nearest HSR station, then seamlessly connect via rental car, Taiwan Tourist Shuttle, or local TRA train.`
      : l === 'ja'
      ? `【${cityName}台湾新幹線ガイド】最寄り台湾高鐵駅到着後、レンタカーや台湾好行シャトルバス・在来線で各スポットをスムーズに周遊。`
      : `【${cityName}高鐵轉乘指引】搭乘台灣高鐵抵達最近高鐵站後，於站前租車或轉乘台灣好行公車、台鐵區間車無縫串聯各主要景點。`;
  } else {
    transitNotice = l === 'en'
      ? `[${cityName} Transit Guide] Primarily traveling by ${transport}, planned sequentially along geographic lines without backtrack.`
      : l === 'ja'
      ? `【${cityName}交通案内】${transport}を中心に、地理的順序に沿って効率よく周遊するルート。`
      : `【${cityName}交通指南】以${transport}為主，依照地理順序規劃路線，車程順行不折返，兼顧時間效益與漫遊樂趣。`;
  }

  const hotelOffset = variationSeed > 0 ? (Math.abs(variationSeed) % 10) : 0;
  const initialExcludedHotels = new Set<string>(
    Array.isArray(excludedHotels) ? excludedHotels.filter(h => typeof h === 'string' && h.trim()) : []
  );
  const baseHotel = getTieredAccommodation(cityName, budgetLevel, hotelOffset, language, initialExcludedHotels);

  const budgetLabel = budgetLevel === 'budget'
    ? (l === 'en' ? 'Budget-friendly' : l === 'ja' ? 'エコノミー' : '小資經濟高CP值')
    : budgetLevel === 'luxury'
    ? (l === 'en' ? 'Luxury Premier' : l === 'ja' ? 'プレミアム贅沢' : '尊榮輕奢頂級')
    : (l === 'en' ? 'Standard Comfort' : l === 'ja' ? '定番快適' : '經典質感舒適');

  let hotelAdvice = '';
  if (days > 1) {
    const venueExplanation = getSameStayVenueExplanation(cityName, days, style, budgetLevel, language, keepSameHotel, baseHotel);
    if (days === 2) {
      if (l === 'en') {
        hotelAdvice = `[Accommodation Venue Recommendation (${budgetLabel})]: Reserved at "${baseHotel.name}" (${baseHotel.type}, approx. ${baseHotel.priceRange}). ${venueExplanation.themeFeature}`;
      } else if (l === 'ja') {
        hotelAdvice = `【おすすめ宿泊施設のご案内（${budgetLabel}）】：「${baseHotel.name}」（${baseHotel.type}、参考価格：${baseHotel.priceRange}）に滞在。${venueExplanation.themeFeature}`;
      } else {
        hotelAdvice = `【住宿場館建議（${budgetLabel}）】：下榻『${baseHotel.name}』（${baseHotel.type}，預算參考：${baseHotel.priceRange}）。${venueExplanation.themeFeature}`;
      }
    } else if (keepSameHotel) {
      if (l === 'en') {
        hotelAdvice = `[Trip Consecutive Stay Venue Guide (${budgetLabel})]: All nights reserved at "${baseHotel.name}" (${baseHotel.type}, approx. ${baseHotel.priceRange}). ${venueExplanation.themeFeature}`;
      } else if (l === 'ja') {
        hotelAdvice = `【旅行中同一宿泊施設のご案内（${budgetLabel}）】：全日程「${baseHotel.name}」（${baseHotel.type}、参考価格：${baseHotel.priceRange}）に連泊。${venueExplanation.themeFeature}`;
      } else {
        hotelAdvice = `【全程入住同一住宿場館說明（${budgetLabel}）】：全程下榻『${baseHotel.name}』（${baseHotel.type}，預算參考：${baseHotel.priceRange}）。${venueExplanation.themeFeature}`;
      }
    } else {
      if (l === 'en') {
        hotelAdvice = `[Flexible Multi-Stay Accommodation Guide (${budgetLabel})]: Experience different distinct accommodations per night tailored to each day's route, discovering local charms across regions.`;
      } else if (l === 'ja') {
        hotelAdvice = `【日替わりおすすめ宿泊施設（${budgetLabel}）】：各日の観光エリアに合わせて異なるホテル・民宿へ宿泊。地域ごとの魅力をより深く体験できます。`;
      } else {
        hotelAdvice = `【依每日遊程更換住宿建議（${budgetLabel}）】：每日行程依地理軸線安排不同特色旅宿，就近休息並深度體驗不同鄉鎮風情。`;
      }
    }
  }

  const themeKey = resolveThemeKey(style);
  const themeDef = THEME_DEFINITIONS[themeKey];

  const THEME_DAY_TITLES: Record<ThemeKey, string[]> = {
    leisure_family: [
      `${cityName}室內涼爽放電與全齡親子互動體驗`,
      `${cityName}歡樂娛樂型觀光工廠DIY手作巡禮`,
      `${cityName}寓教於樂水族科普與平緩綠地慢遊`,
      `${cityName}甜點烘焙工廠與長幼同樂舒活渡假`,
      `${cityName}友善步道園區與全家滿載伴手禮賦歸`
    ],
    culture_and_lifestyle: [
      `${cityName}歷史聚落風華與文史古蹟街區尋訪`,
      `${cityName}產業見學觀光工廠與職人工藝美學深度見習`,
      `${cityName}百年古法釀造與傳統文化老茶廠巡禮`,
      `${cityName}現代美術館藏展覽與特色官舍漫步`,
      `${cityName}文創設計聚落選物與在地歷史記憶賦歸`
    ],
    outdoor_nature: [
      `${cityName}國家風景區壯麗地貌與開闊視野巡禮`,
      `${cityName}森林步道漫步芬多精浴與群山綠意`,
      `${cityName}蔚藍海岸岬灣步道與海風潮音洗禮`,
      `${cityName}天然奇岩地質與水岸生態秘境探訪`,
      `${cityName}開闊高台遠眺大景與大自然能量賦歸`
    ],
    local_gourmet: [
      `${cityName}經典老饕排隊名店與百年道地小吃巡味`,
      `${cityName}傳統生鮮早市巡禮與港灣現撈海鮮饗宴`,
      `${cityName}產地直送小農特產與產銷伴手禮採買`,
      `${cityName}傳承手作美饌與人氣老字號特色小吃`,
      `${cityName}人氣文青小吃聚落與在地老饕特色伴手禮返程`
    ]
  };

  const dayTitles = THEME_DAY_TITLES[themeKey];

  const daytimePool: Array<{ name: string; intro: string; googleMapsKeyword: string; operatingHours: string }> = [];
  const rawHighlights = cityData.highlights || [];
  const allHighlights = rawHighlights.filter(h => !isNightSpot(h.name, h.intro));
  const nightHighlights = rawHighlights.filter(h => isNightSpot(h.name, h.intro));
  const allFactories = cityData.tourismFactories || [];

  const entertainmentFactories = allFactories.filter(f => classifyTourismFactory(f) === 'entertainment');
  const craftFactories = allFactories.filter(f => classifyTourismFactory(f) === 'craft_knowledge');
  const gourmetFactories = allFactories.filter(f => classifyTourismFactory(f) === 'gourmet_product' || classifyTourismFactory(f) === 'entertainment');

  if (themeKey === 'outdoor_nature') {
    const outdoorHighlights = allHighlights.filter(h => {
      const text = `${h.name} ${h.intro}`;
      const isIndoor = /(室內|水生公園|眼科|電影院|展覽館|商場|百貨)/.test(text);
      const isOutdoor = /(步道|風景區|公園|瀑布|海灘|海岸|水庫|草原|森林|神木|海岬|湖|濕地|綠舟|自然|山|海|花田|生態|地質|天鵝船|露天|觀景台)/.test(text);
      return !isIndoor && isOutdoor;
    });

    outdoorHighlights.forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '08:30 - 17:00 (戶外自然景觀開放)'
      });
    });

    const natureExtras = [
      { name: `${cityName}國家風景區全景步道`, intro: `漫步於國家級風景區開闊自然地貌，遠眺山海全景，盡情吸收天然大自然芬多精。`, googleMapsKeyword: `${cityName} 國家風景區`, operatingHours: '08:00 - 17:00' },
      { name: `${cityName}森林綠意生態景觀步道`, intro: `高聳林木環抱，沿平緩木棧道漫行，享受清風吹拂與大自然純淨氣息。`, googleMapsKeyword: `${cityName} 森林步道`, operatingHours: '08:00 - 17:00' },
      { name: `${cityName}水岸岬灣自然地貌生態區`, intro: `水岸波光粼粼，欣賞億萬年潮汐沖刷之天然特殊奇岩與豐富潮間帶地貌。`, googleMapsKeyword: `${cityName} 自然生態`, operatingHours: '08:30 - 17:00' }
    ];
    natureExtras.forEach(ne => daytimePool.push(ne));

    allHighlights.filter(h => !outdoorHighlights.includes(h) && !/(室內|商場|百貨)/.test(h.name + h.intro)).forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00'
      });
    });

  } else if (themeKey === 'culture_and_lifestyle') {
    const cultureHighlights = allHighlights.filter(h => {
      const text = `${h.name} ${h.intro}`;
      return /(老街|古蹟|聚落|美術館|文創|園區|博物館|廟|寺|故居|書院|歌劇院|城門|鐵道|車庫|眷村|雕塑|行館|官舍)/.test(text);
    });

    cultureHighlights.forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00 (文藝展館開放)'
      });
    });

    if (craftFactories.length > 0) {
      craftFactories.forEach(f => {
        daytimePool.push({
          name: f.name,
          intro: `【產業見學工廠】：${f.intro}`,
          googleMapsKeyword: f.googleMapsQuery || f.name,
          operatingHours: '09:00 - 17:00 (地方產業歷史與製程導覽)'
        });
      });
    } else {
      daytimePool.push({
        name: `${cityName}在地百年產業歷史見學工坊`,
        intro: `探索${cityName}在地產業發展史、傳統製造製程展示與職人工藝精神傳承。`,
        googleMapsKeyword: `${cityName} 文化工藝`,
        operatingHours: '09:00 - 17:00'
      });
    }

    const cultureExtras = [
      { name: `${cityName}文化藝術中心特展園區`, intro: `探索${cityName}歷史記憶、在地藝術特展與戶外公共藝術裝置。`, googleMapsKeyword: `${cityName} 文化園區`, operatingHours: '09:00 - 17:00' },
      { name: `${cityName}歷史鐵道文化記憶園區`, intro: `保留昔日鐵道月台、木造候車室與老火車頭歷史遺跡。`, googleMapsKeyword: `${cityName} 鐵道園區`, operatingHours: '09:00 - 17:00' }
    ];
    cultureExtras.forEach(ce => daytimePool.push(ce));

    allHighlights.filter(h => !cultureHighlights.includes(h)).forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00'
      });
    });

  } else if (themeKey === 'leisure_family') {
    const leisureHighlights = allHighlights.filter(h => {
      const text = `${h.name} ${h.intro}`;
      return /(水族館|遊樂|主題樂園|動物園|科學館|親水|園區|故事館|博物館|美術館|草坪|牧場|地熱|平緩|公園|室內)/.test(text);
    });

    leisureHighlights.forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00 (冷氣舒適・全齡友善開放)'
      });
    });

    if (entertainmentFactories.length > 0) {
      entertainmentFactories.forEach(f => {
        daytimePool.push({
          name: f.name,
          intro: `【娛樂DIY工廠】：${f.intro}`,
          googleMapsKeyword: f.googleMapsQuery || f.name,
          operatingHours: '09:00 - 17:00 (室內冷氣開放・全家同樂DIY)'
        });
      });
    } else {
      const fallbackFactory = allFactories[0];
      if (fallbackFactory) {
        daytimePool.push({
          name: fallbackFactory.name,
          intro: `【親子休閒體驗】：${fallbackFactory.intro}`,
          googleMapsKeyword: fallbackFactory.googleMapsQuery || fallbackFactory.name,
          operatingHours: '09:00 - 17:00'
        });
      } else {
        daytimePool.push({
          name: `${cityName}全齡休閒室內手作DIY生活館`,
          intro: `室內冷氣開放、動線平緩好走，提供趣味甜點烘焙與創意手作DIY體驗。`,
          googleMapsKeyword: `${cityName} DIY觀光工廠`,
          operatingHours: '09:00 - 17:00'
        });
      }
    }

    const leisureExtras = [
      { name: `${cityName}全齡友善綠意親水休閒園區`, intro: `平緩好走的綠茵草坪與遮蔭步道，適合長輩坐下休憩、孩童歡樂奔跑。`, googleMapsKeyword: `${cityName} 親水公園`, operatingHours: '09:00 - 17:00' },
      { name: `${cityName}室內科普互動探索育樂館`, intro: `高舒適度室內空調環境，提供寓教於樂的多媒體互動科技展覽。`, googleMapsKeyword: `${cityName} 科普館`, operatingHours: '09:00 - 17:00' }
    ];
    leisureExtras.forEach(le => daytimePool.push(le));

    allHighlights.filter(h => !leisureHighlights.includes(h)).forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00'
      });
    });

  } else {
    const gourmetHighlights = allHighlights.filter(h => {
      const text = `${h.name} ${h.intro}`;
      return /(老街|夜市|漁港|市場|碼頭|美食|商圈|特產|農會|活魚|小吃|柑桔|茶花|柿餅|草莓)/.test(text);
    });

    gourmetHighlights.forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00 (在地名特產美食商圈)'
      });
    });

    if (gourmetFactories.length > 0) {
      gourmetFactories.forEach(f => {
        daytimePool.push({
          name: f.name,
          intro: `【特產美味工坊】：${f.intro}`,
          googleMapsKeyword: f.googleMapsQuery || f.name,
          operatingHours: '09:00 - 17:00 (特色美饌試吃展售)'
        });
      });
    }

    const gourmetExtras = [
      { name: `${cityName}在地農特產展售中心與小農良食市集`, intro: `產地直送「${cityData.agriculture || '在地農特產'}」，提供經典農會伴手禮採買與現泡茶飲品嚐。`, googleMapsKeyword: `${cityName} 農會展售館`, operatingHours: '09:00 - 17:00' },
      { name: `${cityName}在地百年傳承糕點伴手禮老舖總店`, intro: `品嚐新鮮現烤出爐的在地名產伴手禮，古早手作風味滿溢。`, googleMapsKeyword: `${cityName} 伴手禮名店`, operatingHours: '09:00 - 17:30' }
    ];
    gourmetExtras.forEach(ge => daytimePool.push(ge));

    allHighlights.filter(h => !gourmetHighlights.includes(h)).forEach(h => {
      daytimePool.push({
        name: h.name,
        intro: h.intro,
        googleMapsKeyword: h.googleMapsQuery || h.name,
        operatingHours: '09:00 - 17:00'
      });
    });
  }

  // Lunch spot generator
  const lunchFoodList = cityData.famousFood || ['在地道地小吃', '招牌料理'];
  const lunchSpots = [
    { name: `${cityName}老街傳承百年名店`, intro: `正午品嚐正宗「${lunchFoodList[0] || '招牌料理'}」，體驗傳統老滋味。`, googleMapsKeyword: `${cityName} 美食名店`, operatingHours: '11:00 - 14:30 (午間餐飲供應)' },
    { name: `${cityName}在地風味特色餐館`, intro: `品味主廚以「${cityData.agriculture || '在地食材'}」入菜的豐盛風味合菜。`, googleMapsKeyword: `${cityName} 在地餐館`, operatingHours: '11:30 - 14:00 (午餐時段)' },
    { name: `${cityName}小農田園風味餐廳`, intro: `產地直送產銷履歷「${lunchFoodList[1] || '精緻鮮食'}」，健康美味無負擔。`, googleMapsKeyword: `${cityName} 風味餐廳`, operatingHours: '11:00 - 14:30' },
    { name: `${cityName}港灣生猛海鮮料理名店`, intro: `品味現撈海鮮直送「${cityData.fishery || '鮮甜海味'}」清蒸、香煎極致饗宴。`, googleMapsKeyword: `${cityName} 海鮮餐廳`, operatingHours: '11:00 - 14:30' },
    { name: `${cityName}傳承手作古早味食堂`, intro: `熱氣騰騰的古早味「${lunchFoodList[2] || '傳統手路菜'}」，在地人讚不絕口。`, googleMapsKeyword: `${cityName} 古早味美食`, operatingHours: '11:00 - 14:00' }
  ];

  // Apply variation rotation if variationSeed > 0 for different generation sets
  if (variationSeed > 0) {
    if (daytimePool.length > 0) {
      const shift = Math.abs(variationSeed) % daytimePool.length;
      daytimePool.push(...daytimePool.splice(0, shift));
    }
    if (lunchSpots.length > 0) {
      const shift = Math.abs(variationSeed) % lunchSpots.length;
      lunchSpots.push(...lunchSpots.splice(0, shift));
    }
  }

  // Night spot pool for this city
  const customNightSpots = nightHighlights.map(nh => ({
    name: nh.name,
    intro: nh.intro,
    googleMapsKeyword: nh.googleMapsQuery || nh.name,
    operatingHours: nh.name.includes('鐵花村')
      ? '17:00 - 22:00 (慢市集與音樂表演)'
      : nh.name.includes('夜市')
      ? '17:30 - 24:00 (夜市熱鬧營業中)'
      : '全天開放（夜間照明點燈）'
  }));

  const defaultNightList = CITY_NIGHT_SPOTS[cityName] || [
    { name: `${cityName}在地觀光夜市商圈`, intro: `夜幕低垂，品嚐排隊銅板小吃、在地甜品與體驗熱鬧市集氛圍。`, googleMapsKeyword: `${cityName} 夜市`, operatingHours: '17:30 - 24:00 (夜市熱鬧營業中)' },
    { name: `${cityName}星光璀璨高空觀景台`, intro: `登高俯瞰萬家燈火與城市夜色天際線，沉澱身心享受靜謐浪漫時光。`, googleMapsKeyword: `${cityName} 夜景`, operatingHours: '全天開放（夜間景觀設施點燈至 22:30）' },
    { name: `${cityName}水岸光廊河畔散步步道`, intro: `晚風徐徐吹拂，漫步於七彩LED光影水岸，洗滌一日旅途疲憊。`, googleMapsKeyword: `${cityName} 水岸步道`, operatingHours: '全天開放（戶外夜間點燈）' }
  ];

  const nightList = [...customNightSpots, ...defaultNightList];

  const usedSpotNames = new Set<string>();
  if (Array.isArray(excludedSpots) && excludedSpots.length > 0) {
    excludedSpots.forEach(s => {
      if (typeof s === 'string' && s.trim()) {
        usedSpotNames.add(s.trim());
      }
    });
  }
  let dayPoolIndex = 0;
  let nightPoolIndex = 0;

  function getNextDaytimeSpot(targetArea?: string) {
    if (targetArea) {
      const isAnpingCentral = /中西區|安平|舊城/.test(targetArea);
      const isRende = /仁德|奇美|十鼓|文創園區/.test(targetArea);
      const isQigu = /七股|安南|海風|濱海|北門|將軍|鹽田/.test(targetArea);
      const isXinhuaZuozhen = /新化|左鎮|山上|化石|水道/.test(targetArea);
      const isBaiheHoubi = /白河|關子嶺|東山|後壁|無米樂|菁寮|蓮花/.test(targetArea);
      const isLiujiaGuantianLiuying = /六甲|官田|柳營|落羽松|水雉|荷蘭村|酪農|八翁|尖山埤|隆田/.test(targetArea);
      const isYujingNanxi = /玉井|楠西|梅嶺|芒果|咖啡公路/.test(targetArea);
      const isMadouYanshui = /麻豆|鹽水|學甲|佳里|總爺|八角樓/.test(targetArea);

      for (let i = 0; i < daytimePool.length; i++) {
        const candidate = daytimePool[i];
        if (usedSpotNames.has(candidate.name)) continue;

        let matched = false;
        if (isLiujiaGuantianLiuying) {
          if (/十鼓|奇美|萬國|四草|安平|赤崁|神農/.test(candidate.name)) continue;
          matched = /六甲|官田|柳營|落羽松|水雉|荷蘭村|酪農|八翁|尖山埤|隆田|烏山頭|赤山龍湖巖|劉啟祥/.test(candidate.name + ' ' + candidate.intro);
        } else if (isBaiheHoubi) {
          if (/十鼓|奇美|安平|四草|七股|赤崁/.test(candidate.name)) continue;
          matched = /關子嶺|水火|白河|東山|後壁|菁寮|無米樂|大仙寺|碧雲寺|蓮花/.test(candidate.name + ' ' + candidate.intro);
        } else if (isYujingNanxi) {
          if (/十鼓|奇美|安平|四草|七股/.test(candidate.name)) continue;
          matched = /玉井|楠西|梅嶺|玄空法寺|龜丹|曾文水庫|梅峰|芒果/.test(candidate.name + ' ' + candidate.intro);
        } else if (isMadouYanshui) {
          if (/十鼓|奇美|安平|四草|七股/.test(candidate.name)) continue;
          matched = /麻豆|鹽水|學甲|總爺|代天府|八角樓|頑皮世界|月津港/.test(candidate.name + ' ' + candidate.intro);
        } else if (isXinhuaZuozhen) {
          if (/十鼓|奇美|安平|四草|七股/.test(candidate.name)) continue;
          matched = /新化|左鎮|山上|水道|化石|虎頭埤|大目降/.test(candidate.name + ' ' + candidate.intro);
        } else if (isQigu) {
          if (/十鼓|奇美|神農|赤崁|關子嶺|水道/.test(candidate.name)) continue;
          matched = /七股|四草|鹽山|台江|北門|井仔腳|將軍|青鯤鯓|扇形鹽田/.test(candidate.name + ' ' + candidate.intro);
        } else if (isRende) {
          if (/安平|赤崁|神農|四草|七股|關子嶺|水道|左鎮|六甲|官田/.test(candidate.name)) continue;
          matched = /十鼓|奇美|萬國|仁德|牛稠子/.test(candidate.name + ' ' + candidate.intro);
        } else if (isAnpingCentral) {
          if (/十鼓|奇美|萬國|七股|四草|關子嶺|水道|左鎮|六甲|官田|柳營/.test(candidate.name)) continue;
          matched = /安平|赤崁|神農|美術館|中西區|孔廟|國華|德記|黑橋牌/.test(candidate.name + ' ' + candidate.intro);
        }

        if (matched) {
          usedSpotNames.add(candidate.name);
          return candidate;
        }
      }
    }

    // Default sequential fallback with cross-district guard
    for (let i = 0; i < daytimePool.length; i++) {
      const candidate = daytimePool[i];
      if (usedSpotNames.has(candidate.name)) continue;
      if (targetArea && /中西區|安平/.test(targetArea) && /十鼓|奇美|仁德|六甲|官田|柳營/.test(candidate.name)) {
        continue;
      }
      if (targetArea && /仁德/.test(targetArea) && /安平|赤崁|神農|六甲|官田/.test(candidate.name)) {
        continue;
      }
      if (targetArea && /六甲|官田|柳營/.test(targetArea) && /十鼓|奇美|安平|神農/.test(candidate.name)) {
        continue;
      }
      usedSpotNames.add(candidate.name);
      return candidate;
    }

    const fallbackName = targetArea
      ? `${cityName}${targetArea.replace(/巡禮|線|地帶|秘境/g, '')}文化景點（第${usedSpotNames.size + 1}站）`
      : `${cityName}地方文化名勝館（第${usedSpotNames.size + 1}站）`;
    usedSpotNames.add(fallbackName);
    return {
      name: fallbackName,
      intro: `深入走訪${cityName}歷史紋理與文化底蘊。`,
      googleMapsKeyword: `${cityName} 景點`,
      operatingHours: '09:00 - 17:00'
    };
  }

  function getNextNightSpot(targetArea?: string) {
    if (targetArea) {
      const isRende = /仁德|奇美|十鼓/.test(targetArea);
      const isAnpingCentral = /中西區|安平/.test(targetArea);
      const isQigu = /七股|安南/.test(targetArea);

      for (let i = 0; i < nightList.length; i++) {
        const candidate = nightList[i];
        if (usedSpotNames.has(candidate.name)) continue;

        let matched = false;
        if (isRende) {
          matched = /十鼓|大東|仁德/.test(candidate.name + ' ' + candidate.intro);
        } else if (isAnpingCentral) {
          matched = /神農|安平|海安/.test(candidate.name + ' ' + candidate.intro);
        } else if (isQigu) {
          matched = /花園|武聖/.test(candidate.name + ' ' + candidate.intro);
        }

        if (matched) {
          usedSpotNames.add(candidate.name);
          return candidate;
        }
      }
    }

    while (nightPoolIndex < nightList.length) {
      const candidate = nightList[nightPoolIndex++];
      if (!usedSpotNames.has(candidate.name)) {
        usedSpotNames.add(candidate.name);
        return candidate;
      }
    }
    const nightFallbacks = [
      `${cityName}水岸光廊夜景漫步`,
      `${cityName}老街星光漫遊商圈`,
      `${cityName}星空高空觀景瞭望台`,
      `${cityName}港灣微風夜色走廊`,
      `${cityName}夜間漫活光影聚落`
    ];
    for (const fb of nightFallbacks) {
      if (!usedSpotNames.has(fb)) {
        usedSpotNames.add(fb);
        return {
          name: fb,
          intro: `享受${cityName}迷人夜色與在地生活夜晚漫活。`,
          googleMapsKeyword: `${cityName} 夜景`,
          operatingHours: '全天開放（夜間照明點燈）'
        };
      }
    }
    const fallbackName = `${cityName}星光夜遊秘境（第${usedSpotNames.size + 1}站）`;
    usedSpotNames.add(fallbackName);
    return {
      name: fallbackName,
      intro: `享受${cityName}迷人夜色與在地生活夜晚漫活。`,
      googleMapsKeyword: `${cityName} 夜景`,
      operatingHours: '全天開放（夜間照明點燈）'
    };
  }

  const itinerary = [];
  const daily_plans = [];
  const usedHotelNames = new Set<string>(initialExcludedHotels);

  const rawCityRegions = CITY_AXIS_REGIONS[cityName] || [
    `${cityName}海線生活聚落與在地名產`,
    `${cityName}山城秘境與工藝見學`,
    `${cityName}舊城歷史街區與文創新境`,
    `${cityName}田園茶香與生態漫步`,
    `${cityName}水岸微風與星空夜景`
  ];

  // Rotate/shuffle regions deterministically according to variationSeed for high randomness across regenerations
  const cityRegions = [...rawCityRegions];
  if (variationSeed > 0) {
    for (let i = cityRegions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(variationSeed * 997 + i * 137)) * 10000) % (i + 1);
      [cityRegions[i], cityRegions[j]] = [cityRegions[j], cityRegions[i]];
    }
  }

  for (let d = 1; d <= days; d++) {
    const spots = [];
    const schedule = [];
    const routeArea = cityRegions[(d - 1) % cityRegions.length];
    const nextRouteArea = cityRegions[d % cityRegions.length];

    // Pick distinct hotel per day along the next day's morning axis (N days = N - 1 nights/stays, last day returns home)
    const isLastDay = d === days;
    const shouldHaveStay = days > 1 && !isLastDay;
    const dayHotel = keepSameHotel
      ? baseHotel
      : getTieredAccommodation(cityName, budgetLevel, hotelOffset + d - 1, language, usedHotelNames, nextRouteArea);
    if (!keepSameHotel) {
      usedHotelNames.add(dayHotel.name);
    }

    const stayRecommendation = !shouldHaveStay
      ? undefined
      : {
          hotel_name: dayHotel.name,
          location_type: dayHotel.locationType || (d === 1 ? (l === 'en' ? 'Coastal & Harbor' : l === 'ja' ? '海岸・漁港エリア' : '海線漁港生活圈') : d === 2 ? (l === 'en' ? 'Mountain & Tea Country' : l === 'ja' ? '山間・茶郷エリア' : '山城茶鄉聚落') : (l === 'en' ? 'Historic Cultural District' : l === 'ja' ? '歴史文化エリア' : '舊城文化生活圈')),
          property_type: dayHotel.type || (d === 1 ? (l === 'en' ? 'Coastal Boutique B&B' : l === 'ja' ? '海辺の特色民宿' : '濱海特色民宿') : d === 2 ? (l === 'en' ? 'Hot Spring / Mountain Resort' : l === 'ja' ? '温泉・山荘リゾート' : '山林溫泉渡假旅店') : (l === 'en' ? 'Heritage Design Hotel' : l === 'ja' ? '古民家デザインホテル' : '老宅文創設計旅宿')),
          price_range: dayHotel.priceRange || 'NT$ 2,500 - 4,500/晚',
          googleMapsQuery: dayHotel.googleMapsQuery || dayHotel.name,
          feature: dayHotel.description
            ? `${dayHotel.description}（緊鄰次日【${nextRouteArea}】探索軸線，晨間出發極度便捷）`
            : (l === 'en'
                ? `Strategically near Day ${d + 1}'s destination [${nextRouteArea}], only ~5-15 mins away for seamless morning start.`
                : l === 'ja'
                ? `翌日（第${d + 1}日）の目的地【${nextRouteArea}】に極めて近く、車で約5〜15分。朝の出発が非常にスムーズです。`
                : `緊鄰次日（第 ${d + 1} 天）走訪重點【${nextRouteArea}】，車程僅約 5~15 分鐘，晨間出發極度便捷省時。`),
          geographic_continuity: l === 'en'
            ? `Strategically situated right next to Day ${d + 1}'s 1st destination [${nextRouteArea}], only ~5-15 mins drive, ensuring effortless morning departure.`
            : l === 'ja'
            ? `翌日（第${d + 1}日）の最初の訪問地【${nextRouteArea}】に極めて近く、車で約5〜15分。朝の移動が非常にスムーズで快適です。`
            : `地理位置緊鄰次日（第 ${d + 1} 天）首站【${nextRouteArea}】，車程僅約 5~15 分鐘，晨間出發極度便捷省時。`
        };

    const stayDesc = !shouldHaveStay
      ? undefined
      : keepSameHotel
      ? (l === 'en'
          ? `Return to "${baseHotel.name}" (Single stay mode)`
          : l === 'ja'
          ? `「${baseHotel.name}」へ戻り宿泊（連泊）`
          : `返回「${baseHotel.name}」休息（全程連住不換房）`)
      : (l === 'en'
          ? `Stay at "${dayHotel.name}" (${dayHotel.locationType || dayHotel.type})`
          : l === 'ja'
          ? `「${dayHotel.name}」に宿泊（${dayHotel.locationType || dayHotel.type}）`
          : `入住「${dayHotel.name}」（${stayRecommendation?.location_type || '優質旅宿'}）`);

    // Food pool for the day
    const foodList = cityData.famousFood || ['在地排隊經典小吃', '產地時令手作美食'];
    const lunchFood = foodList[(d * 2 - 2) % foodList.length] || '在地招牌美饌';
    const eveningFood = foodList[(d * 2 - 1) % foodList.length] || '夜市老字號銅板小吃';

    // Daily spot 1: Morning (09:00 - 11:30) - Daytime venue (opens 09:00, closes 17:00)
    const s1 = getNextDaytimeSpot(routeArea);
    const ac1 = themeKey === 'leisure_family' || /(館|中心|展覽|工廠|室內)/.test(s1.name);

    // Daily spot 2: Noon (12:00 - 13:30) - Lunch dining (opens 11:00 - 14:30)
    let s2: { name: string; intro: string; googleMapsKeyword: string; operatingHours: string };
    if (cityName === '臺南市' && /六甲|官田|柳營/.test(routeArea)) {
      s2 = {
        name: "六甲媽祖廟口豆菜麵與官田菱角排隊名店",
        intro: "正午品嚐六甲招牌古早味豆菜麵、肉羹湯與官田產地直送鮮甜菱角排骨酥湯。",
        googleMapsKeyword: "六甲 豆菜麵 官田菱角",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /後壁|白河|關子嶺/.test(routeArea)) {
      s2 = {
        name: "後壁菁寮老街無米樂割稻飯與白河蓮子大餐",
        intro: "正午在大碗公內品嚐古早味割稻飯，搭配白河時令鮮甜蓮子排骨湯與產地農家合菜。",
        googleMapsKeyword: "後壁 割稻飯 菁寮老街",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /東山|楠西|梅嶺|玉井/.test(routeArea)) {
      s2 = {
        name: "楠西梅嶺正宗薑黃梅子雞與玉井在地風味餐廳",
        intro: "正午在山林間品嚐酸香開胃的招牌梅子雞、薑黃土雞煲與產地新鮮蔬食。",
        googleMapsKeyword: "楠西 梅嶺 梅子雞",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /麻豆|鹽水|佳里/.test(routeArea)) {
      s2 = {
        name: "麻豆阿蘭碗粿與鹽水意麵傳統老店",
        intro: "正午品嚐麻豆傳承數十年油蔥香濃碗粿、花生豬腳湯與鹽水Q彈手工意麵。",
        googleMapsKeyword: "麻豆 阿蘭碗粿",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /仁德|奇美|十鼓/.test(routeArea)) {
      s2 = {
        name: "仁德阿裕牛肉湯/在地溫體牛排隊名店",
        intro: "正午探訪仁德傳奇溫體牛肉湯名店，品嚐鮮甜現切薄片牛肉與特製牛肉燥飯。",
        googleMapsKeyword: "阿裕牛肉涮涮鍋 仁德",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /安平|中西區/.test(routeArea)) {
      s2 = {
        name: "安平老街傳承百年名店（周氏蝦捲與安平豆花）",
        intro: "正午品嚐安平現炸酥脆金黃蝦捲、鮮美蚵仔煎與古法天然甘蔗糖水豆花。",
        googleMapsKeyword: "安平老街 周氏蝦捲",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '臺南市' && /七股|安南|北門|將軍/.test(routeArea)) {
      s2 = {
        name: "七股將軍海產街鮮甜虱目魚與青鯤鯓蚵嗲名店",
        intro: "正午品味產地現撈無刺虱目魚肚、酥脆現炸蚵嗲與產地白蝦海鮮饗宴。",
        googleMapsKeyword: "七股 海鮮 餐廳",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '嘉義縣' && /梅山|阿里山|奮起湖/.test(routeArea)) {
      s2 = {
        name: "奮起湖百年鐵路便當與梅山茶香苦茶油雞風味餐",
        intro: "正午品嚐奮起湖經典懷舊鐵路雙主菜便當，搭配梅山三十六彎產地高山茶與香醇苦茶油雞。",
        googleMapsKeyword: "奮起湖 鐵路便當 梅山",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '嘉義縣' && /布袋|東石/.test(routeArea)) {
      s2 = {
        name: "東石漁人碼頭現烤鮮蚵與布袋觀光漁港海味餐廳",
        intro: "正午大啖東石產地直送肥美現烤鮮蚵、海鮮粥、蚵仔煎與鮮甜野生海味合菜。",
        googleMapsKeyword: "東石 烤蚵 布袋 餐廳",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else if (cityName === '嘉義縣' && /太保|六腳|朴子|蒜頭/.test(routeArea)) {
      s2 = {
        name: "朴子配天宮前古早味鴨肉羹與黑白切排隊老店",
        intro: "正午品嚐大火快炒焦香鴨肉羹、魯肉飯與六腳蒜頭在地傳統手作小吃。",
        googleMapsKeyword: "朴子 配天宮 鴨肉羹",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '嘉義縣' && /民雄|大林|竹崎|番路/.test(routeArea)) {
      s2 = {
        name: "民雄正宗鵝肉一條街老字號鵝肉名店",
        intro: "正午享用民雄火車站前鮮嫩多汁白斬鵝肉、煙燻鵝肉拼盤與米血冬粉湯。",
        googleMapsKeyword: "民雄 鵝肉 正宗",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '嘉義市') {
      s2 = {
        name: "嘉義東市場王家祖傳牛雜湯與在地火雞肉飯名店",
        intro: "正午品嚐嘉義東市場清甜祖傳牛雜湯、鮮嫩多汁在地火雞肉飯與老字號手工豆花。",
        googleMapsKeyword: "嘉義 東市場 王家牛雜湯",
        operatingHours: "11:00 - 14:00 (午間餐飲供應)"
      };
    } else if (cityName === '高雄市' && /美濃|旗山/.test(routeArea)) {
      s2 = {
        name: "美濃傳統客家粄條與旗山老街香蕉冰名店",
        intro: "正午品嚐手作柴燒油蔥客家粄條、冬瓜封、高麗菜封與旗山傳統枝仔冰。",
        googleMapsKeyword: "美濃 客家粄條 旗山",
        operatingHours: "11:00 - 14:30 (午間餐飲供應)"
      };
    } else {
      let candidate = lunchSpots[(d - 1) % lunchSpots.length];
      if (usedSpotNames.has(candidate.name)) {
        const unusedLunch = lunchSpots.find(ls => !usedSpotNames.has(ls.name));
        if (unusedLunch) {
          candidate = unusedLunch;
        } else {
          const dish = lunchFoodList[(d - 1) % lunchFoodList.length] || '老街名物料理';
          candidate = {
            name: `${cityName}在地${dish}排隊名店（第${d}日美饌）`,
            intro: `正午品嚐在地老饕力薦之正宗「${dish}」，古法手作香氣四溢。`,
            googleMapsKeyword: `${cityName} ${dish}`,
            operatingHours: '11:00 - 14:30 (午間餐飲供應)'
          };
        }
      }
      s2 = candidate;
    }
    usedSpotNames.add(s2.name);

    // Daily spot 3: Afternoon (14:00 - 16:30) - Tourism factory / Museum (opens 09:00 - 17:00, finishes before 17:00!)
    const s3 = getNextDaytimeSpot(routeArea);
    const ac3 = themeKey === 'leisure_family' || /(館|工廠|園區|故事館)/.test(s3.name);

    // Daily spot 4: Evening / Night (17:30 - 20:30)
    const s4 = (d < 5 || days < 5) ? getNextNightSpot(routeArea) : null;

    // Consecutive day activity arrangements: 100% differentiated across days 1~5
    const dayActivities = [
      {
        morning: l === 'en'
          ? `Walk through "${s1.name}", appreciating heritage facades and neighborhood streetscapes in a relaxed pace.`
          : l === 'ja'
          ? `「${s1.name}」を散策し、歴史的な町並みや集落の生活文化をじっくり体感。`
          : `漫步穿梭於「${s1.name}」，細讀歷史地景與老街紋理，打卡經典建築立面與人文生活聚落。`,
        lunch: l === 'en'
          ? `Savor authentic local specialty "${lunchFood}" at a historic dining eatery, enjoying century-old flavors.`
          : l === 'ja'
          ? `老舗名店にて本場の名物「${lunchFood}」を堪能し、伝統の味わいを満喫。`
          : `正午探訪排隊名店，品嚐正宗在地傳承好手藝「${lunchFood}」，細細感受濃醇古早層次。`,
        afternoon: themeKey === 'leisure_family'
          ? (l === 'en'
              ? `Engage in hands-on DIY baking and family interactive displays at "${s3.name}", with A/C in selected halls.`
              : l === 'ja'
              ? `「${s3.name}」で手作りDIYや親子体験に参加。一部の館内には冷房があり快適。`
              : `參與「${s3.name}」手作DIY與親子互動體驗，部分場館有提供冷氣，寓教於樂舒適自在。`)
          : (l === 'en'
              ? `Join a guided craft tour at "${s3.name}", learning the heritage and artisanal techniques.`
              : l === 'ja'
              ? `「${s3.name}」で職人技と製造工程のガイドツアーに参加し、伝統工芸の奥深さに触れる。`
              : `於「${s3.name}」聆聽專業導覽解說，近距離觀察匠人技藝傳承與文化展陳，收穫豐富工藝見學。`),
        evening: l === 'en'
          ? `Stroll through the vibrant evening market of "${s4?.name || ''}", hunting for popular street food stalls.`
          : l === 'ja'
          ? `「${s4?.name || ''}」の活気ある夜市を巡り、人気屋台グルメを食べ歩き。`
          : `夜幕低垂來到「${s4?.name || ''}」，穿梭於熱鬧人氣商圈，逐攤尋訪必吃銅板排隊美食。`
      },
      {
        morning: l === 'en'
          ? `Embark on a refreshing morning walk around "${s1.name}", taking in natural scenery and fresh air.`
          : l === 'ja'
          ? `朝の澄んだ空気の中「${s1.name}」へ向かい、豊かな自然と広々とした景色を満喫。`
          : `晨間出發抵達「${s1.name}」，沿著綠意步道悠閒漫遊，深呼吸清爽空氣並欣賞開闊地貌。`,
        lunch: l === 'en'
          ? `Feast on seasonal farm-to-table cuisine prepared with fresh local produce at a cozy bistro.`
          : l === 'ja'
          ? `旬の採れたて地元食材を活かしたシェフ自慢の郷土料理を味わい、エネルギーを補給。`
          : `探訪主廚私房食堂，大啖以在地時令農特產入菜的風味合菜，享受產地直送的純淨鮮美。`,
        afternoon: themeKey === 'leisure_family'
          ? (l === 'en'
              ? `Immerse in interactive storytelling and playful exhibitions at "${s3.name}", with A/C in selected halls.`
              : l === 'ja'
              ? `「${s3.name}」で科学・文化の体験型展示を楽しみ、一部館内の冷房で涼しくリフレッシュ。`
              : `體驗「${s3.name}」沉浸式科普互動與主題展演，部分場館有提供冷氣，親子同樂清涼舒活。`)
          : (l === 'en'
              ? `Explore industrial transformation and creative design showcases at "${s3.name}".`
              : l === 'ja'
              ? `「${s3.name}」で伝統産業のイノベーションとデザイン展示を見学し、限定土産を吟味。`
              : `深入走入「${s3.name}」探索在地傳統產業轉型故事，體驗文創選物與特色紀念手作。`),
        evening: l === 'en'
          ? `Unwind alongside the waterfront or elevated viewpoints at "${s4?.name || ''}", marveling at romantic city lights.`
          : l === 'ja'
          ? `夕暮れの「${s4?.name || ''}」を散策し、ロマンチックな水辺のライトアップと夜景を一望。`
          : `微風徐徐時來到「${s4?.name || ''}」，沿著水岸木棧走廊悠閒漫步，眺望璀璨光廊與浪漫夜景倒影。`
      },
      {
        morning: l === 'en'
          ? `Deep-dive into community history at "${s1.name}", tracing cultural roots and artisanal spots.`
          : l === 'ja'
          ? `「${s1.name}」で地域の歴史や伝統ある建築群を訪ね、土地に根付く文化を体感。`
          : `走入「${s1.name}」深度探索地方常民生活脈絡，穿梭歷史街廓與古蹟老宅，感受時光慢活節奏。`,
        lunch: l === 'en'
          ? `Indulge in harbor-fresh seafood specialties or authentic broth noodles beloved by local foodies.`
          : l === 'ja'
          ? `港直送の新鮮な魚介料理や、地元の人々に愛される伝統スープ麺を美味しく味わう。`
          : `享用在地老饕盛讚的現煮名物料理與熱騰騰風味小吃，甘醇鮮美滋味令人回味再三。`,
        afternoon: themeKey === 'leisure_family'
          ? (l === 'en'
              ? `Participate in hands-on crafting and themed puzzle adventures at "${s3.name}", with A/C in selected halls.`
              : l === 'ja'
              ? `「${s3.name}」でクラフト作りやクイズラリーに挑戦。一部館内の冷房で快適に満喫。`
              : `在「${s3.name}」享受親子創客手作DIY與主題探索遊戲，部分場館有提供冷氣，寓教於樂放鬆心靈。`)
          : (l === 'en'
              ? `Gain insights into artisanal production processes and heritage craftsmanship at "${s3.name}".`
              : l === 'ja'
              ? `「${s3.name}」で独自の醸造や製造ノウハウを学び、こだわり抜かれた製品の魅力に迫る。`
              : `參訪「${s3.name}」獨家發酵釀造與專業製程工藝，了解在地農工物產轉化為精品的職人堅持。`),
        evening: l === 'en'
          ? `Soak in the night atmosphere at "${s4?.name || ''}", discovering creative arts craft booths and late-night treats.`
          : l === 'ja'
          ? `「${s4?.name || ''}」のナイトマーケットで、地元の雑貨やユニークな夜食を探して楽しむ。`
          : `夜晚踏入「${s4?.name || ''}」，感受熱絡的市井煙火氣息，挑選在地文創小品並品味特色宵夜小點。`
      },
      {
        morning: l === 'en'
          ? `Ascend to scenic overlooks at "${s1.name}", taking in expansive panoramic vistas of nature.`
          : l === 'ja'
          ? `「${s1.name}」の展望スポットを訪れ、壮大な大自然のパノラマビューをカメラに収める。`
          : `造訪自然名勝「${s1.name}」，登上景觀眺望平台俯瞰壯麗山水全景，捕捉大自然鬼斧神工之美。`,
        lunch: l === 'en'
          ? `Dine at a picturesque garden restaurant, savoring healthy dishes made from organic farm produce.`
          : l === 'ja'
          ? `緑に囲まれたガーデンレストランで、無農薬野菜やヘルシーな自然派ランチに舌鼓。`
          : `造訪田園蔬果香氣縈繞的特色景觀餐坊，品嚐在地小農無毒時令料理，感受純樸自然的健康滋味。`,
        afternoon: themeKey === 'leisure_family'
          ? (l === 'en'
              ? `Experience interactive sensory exhibits at "${s3.name}", with A/C in selected halls.`
              : l === 'ja'
              ? `「${s3.name}」で五感を使って楽しむ体験型プログラムに参加。一部館内は冷房完備。`
              : `於「${s3.name}」進行五感感官探索體驗，部分場館有提供冷氣，吹拂冷氣舒活自在。`)
          : (l === 'en'
              ? `Browse distinctive local specialty stores at "${s3.name}", tasting high-mountain tea brews.`
              : l === 'ja'
              ? `「${s3.name}」の特産ギャラリーを見学し、淹れたての銘茶と和洋スイーツを堪能。`
              : `漫步於「${s3.name}」特色展售空間，細賞在地文化創意商品，品嚐現泡高山香茗。`),
        evening: l === 'en'
          ? `Take a romantic evening stroll through illuminated installations at "${s4?.name || ''}".`
          : l === 'ja'
          ? `「${s4?.name || ''}」の光のアートインスタレーションを眺めながら、静かで贅沢な夜を満喫。`
          : `入夜漫步「${s4?.name || ''}」，置身於星空璀璨的夜間藝術造景之中，享受悠閒微醺的浪漫夜晚。`
      },
      {
        morning: l === 'en'
          ? `Capture memorable early morning moments at "${s1.name}", admiring signature landmark architecture.`
          : l === 'ja'
          ? `朝一番に「${s1.name}」を訪れ、象徴的なランドマークを背景に旅の記念写真を撮影。`
          : `清晨前往「${s1.name}」，在晨曦灑落間欣賞代表性地標地貌，拍照留存此行最動人的風貌。`,
        lunch: l === 'en'
          ? `Celebrate the journey's finale with a banquet feast featuring local award-winning culinary masterworks.`
          : l === 'ja'
          ? `旅のフィナーレにふさわしいごちそう料理を囲み、思い出話に花を咲かせる。`
          : `享用精緻澎湃的慶祝盛宴，結合在地經典名產合菜，為多日旅行畫下豐盛難忘的味蕾句點。`,
        afternoon: themeKey === 'leisure_family'
          ? (l === 'en'
              ? `Pick up souvenir mementos and handmade gifts at "${s3.name}", with A/C in selected halls.`
              : l === 'ja'
              ? `「${s3.name}」で旅のお土産や記念品を選び、一部館内の冷房でゆったり休憩。`
              : `走訪「${s3.name}」選購伴手禮名物，部分場館有提供冷氣，悠然回味多日深度旅程的點滴。`)
          : (l === 'en'
              ? `Select regional specialties and artisan products at "${s3.name}", wrapping up an enriching journey.`
              : l === 'ja'
              ? `「${s3.name}」で産地直送の特産品をじっくり選び、充実した見学の旅を締めくくる。`
              : `前往「${s3.name}」選購產地直送特產伴手禮與職人手作紀念物，部分場館有提供冷氣，滿載而歸。`),
        evening: l === 'en'
          ? `Enjoy a gentle evening stroll, reflecting on the trip's highlights before heading home safely.`
          : l === 'ja'
          ? `夜風を感じながら旅のハイライトを振り返り、心地よい余韻とともに家路へ。`
          : `在溫柔夜色中漫步整理心情，沉澱心靈，帶著滿滿的回憶與收穫平安賦歸。`
      }
    ];

    const curAct = dayActivities[(d - 1) % dayActivities.length];

    spots.push({
      time: '09:00 - 11:30',
      timeSlot: 'morning' as const,
      name: s1.name,
      intro: sanitizeAirConditioningText(s1.intro),
      activityPlayStyle: sanitizeAirConditioningText(curAct.morning),
      indoorAc: ac1,
      foodRecommendation: `周邊品嚐${lunchFood}`,
      transportTip: `${transport}約 15 分鐘`,
      duration: '2.5 小時',
      operatingHours: s1.operatingHours,
      transportToNext: `${transport}約 15 分鐘`,
      googleMapsKeyword: s1.googleMapsKeyword
    });
    schedule.push({
      time_slot: 'morning',
      spot_name: s1.name,
      activity_play_style: sanitizeAirConditioningText(curAct.morning),
      indoor_ac: ac1,
      food_recommendation: `周邊品嚐${lunchFood}`,
      transport_tip: `${transport}約 15 分鐘`
    });

    spots.push({
      time: '12:00 - 13:30',
      timeSlot: 'afternoon' as const,
      name: s2.name,
      intro: sanitizeAirConditioningText(s2.intro),
      activityPlayStyle: sanitizeAirConditioningText(curAct.lunch),
      indoorAc: true,
      foodRecommendation: `${s2.name}招牌料理與周邊點心`,
      transportTip: `${transport}約 15-20 分鐘`,
      duration: '1.5 小時',
      operatingHours: s2.operatingHours,
      transportToNext: `${transport}約 20 分鐘`,
      googleMapsKeyword: s2.googleMapsKeyword
    });
    schedule.push({
      time_slot: 'afternoon',
      spot_name: s2.name,
      activity_play_style: sanitizeAirConditioningText(curAct.lunch),
      indoor_ac: true,
      food_recommendation: `${s2.name}招牌料理與周邊點心`,
      transport_tip: `${transport}約 15-20 分鐘`
    });

    spots.push({
      time: '14:00 - 16:30',
      timeSlot: 'afternoon' as const,
      name: s3.name,
      intro: sanitizeAirConditioningText(s3.intro),
      activityPlayStyle: sanitizeAirConditioningText(curAct.afternoon),
      indoorAc: ac3,
      foodRecommendation: `館內特色伴手禮或茶點試吃`,
      transportTip: `${transport}約 20-25 分鐘`,
      duration: '2.5 小時',
      operatingHours: s3.operatingHours,
      transportToNext: `${transport}約 25 分鐘`,
      googleMapsKeyword: s3.googleMapsKeyword
    });
    schedule.push({
      time_slot: 'afternoon',
      spot_name: s3.name,
      activity_play_style: sanitizeAirConditioningText(curAct.afternoon),
      indoor_ac: ac3,
      food_recommendation: `館內特色伴手禮或茶點試吃`,
      transport_tip: `${transport}約 20-25 分鐘`
    });

    // Daily spot 4: Evening / Night (17:30 - 20:30) - Night market, night view, open late!
    if (s4) {
      spots.push({
        time: '17:30 - 20:30',
        timeSlot: 'evening' as const,
        name: s4.name,
        intro: sanitizeAirConditioningText(s4.intro),
        activityPlayStyle: sanitizeAirConditioningText(curAct.evening),
        indoorAc: false, // 夜市與戶外景點無冷氣，嚴格遵循鐵則
        foodRecommendation: `特色夜市小吃、${eveningFood}`,
        transportTip: `${transport}約 15 分鐘`,
        duration: l === 'en' ? '3 hrs' : l === 'ja' ? '3時間' : '3 小時',
        operatingHours: s4.operatingHours,
        isNightSpot: true,
        transportToNext: keepSameHotel
          ? (l === 'en' ? `Return to "${baseHotel.name}" via ${transport}` : l === 'ja' ? `${transport}で「${baseHotel.name}」へ戻り連泊` : `搭乘${transport}返回「${baseHotel.name}」連住`)
          : (d === days ? (l === 'en' ? 'Conclude journey and return home' : l === 'ja' ? '旅程を終え帰路へ' : '整理行裝平安賦歸') : (l === 'en' ? `Head to "${dayHotel.name}" for check-in` : l === 'ja' ? `「${dayHotel.name}」へ向かいチェックイン` : `前往「${dayHotel.name}」下榻`)),
        googleMapsKeyword: s4.googleMapsKeyword
      });
      schedule.push({
        time_slot: 'evening',
        spot_name: s4.name,
        activity_play_style: sanitizeAirConditioningText(curAct.evening),
        indoor_ac: false,
        food_recommendation: l === 'en' ? `Night market street eats, ${eveningFood}` : l === 'ja' ? `名物夜市グルメ、${eveningFood}` : `特色夜市小吃、${eveningFood}`,
        transport_tip: l === 'en' ? `${transport} approx. 15 mins` : l === 'ja' ? `${transport}約15分` : `${transport}約 15 分鐘`
      });
    }

    itinerary.push({
      day: d,
      title: l === 'en' ? `Day ${d}: ${routeArea} In-Depth Exploration` : l === 'ja' ? `第${d}日：${routeArea} 探訪` : `${routeArea} 深度探索`,
      routeArea,
      stayHotel: stayDesc,
      stayRecommendation,
      spots
    });

    const dailyPlanItem: any = {
      day: d,
      route_area: routeArea,
      schedule
    };
    if (stayRecommendation) {
      dailyPlanItem.stay_recommendation = stayRecommendation;
    }
    daily_plans.push(dailyPlanItem);
  }

  const title = l === 'en'
    ? `${cityName} Authentic Living: ${themeDef.name} (${themeDef.englishKey}) Curated Tour`
    : l === 'ja'
    ? `${cityName}ディープ体験・${themeDef.name} カスタム探索の旅`
    : `${cityName}深度生活感・${themeDef.name}客製探索之旅`;

  const overview = l === 'en'
    ? `[${themeDef.name} Curated Plan] Tailored for ${cityName} ${days}-day exploration via ${transport}. Prioritizing geographically smooth transit without backtracks, pairing morning/afternoon highlights with vibrant evening night market delights and recommended accommodations!`
    : l === 'ja'
    ? `【${themeDef.name} カスタムプラン】${transport}で巡る「${cityName}」${days}日間の周遊プラン。無理のない順路で、昼の見どころから夜の名物夜市まで快適に満喫できます。`
    : sanitizeAirConditioningText(`【${themeDef.name}客製專屬行程】為您依據「${themeDef.name}」主題與${transport}方式精心規劃「${cityName}」${days} 日遊。${
      themeKey === 'leisure_family'
        ? '日間精選動線平緩且舒適之優質空間與手作DIY觀光工廠，晚間漫步在地特色夜市美食，讓全家同樂悠閒無負擔。'
        : themeKey === 'culture_and_lifestyle'
        ? '深入文史脈絡與工藝傳承，精選歷史聚落、美術館文創與產業見學型觀光工廠。'
        : themeKey === 'outdoor_nature'
        ? '聚焦國家風景區、海岸岬灣與森林步道等開闊大自然地貌，盡享純淨山海。'
        : '以在地飲食體驗與老饕採買為核心導向，串聯排隊老店、傳統市場、觀光夜市與在地特產。'
    }各站景點順向串聯不折返，住宿依照走訪動線精準銜接！`);

  const disclaimer = l === 'en'
    ? 'Generated by AI in real time. Please verify opening hours, admission, and hotel bookings with official announcements.'
    : l === 'ja'
    ? '本行程はAIによりリアルタイム生成されたものです。営業時間、入場料、宿泊予約は各施設の最新公式情報をご確認ください。'
    : '本行程由 AI 即時生成，實際營業時間、門票與住宿預約請依各官方公告為準。';

  return {
    itinerary_title: title,
    selected_region: cityName,
    theme: themeDef.name,
    daily_plans,
    disclaimer,
    cityName,
    days,
    travelStyle: style,
    transportMode: transport,
    keepSameHotel,
    baseHotelName: baseHotel.name,
    overview,
    transitNotice,
    hotelAdvice,
    itinerary
  };
}
