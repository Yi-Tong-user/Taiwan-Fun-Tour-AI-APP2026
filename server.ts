import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { TAIWAN_CITIES } from './src/data/taiwanCities';
import {
  THEME_DEFINITIONS,
  resolveThemeKey,
  sanitizeAirConditioningText
} from './src/utils/themeClassifier';
import {
  enrichItineraryWithRealTransit,
  generateCuratedFallback
} from './src/utils/itineraryPlanner';
import { getTieredAccommodation } from './src/data/tieredAccommodations';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily using server-side process.env.GEMINI_API_KEY
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not configured. Falling back to local high-fidelity intelligence.');
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Endpoint: Generate AI travel itinerary
app.post('/api/generate-itinerary', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  const {
    target_region,
    cityName: legacyCityName,
    theme_mode,
    travelStyle: legacyTravelStyle,
    days = 1,
    budget_level = 'standard',
    language = 'zh-TW',
    transport = '開車自駕',
    keepSameHotel = true,
    specialRequirements = '',
    userLocation = null,
    closestCityName = null,
    variationId = undefined,
    excludedSpots = [],
    excludedHotels = []
  } = req.body || {};

  const effectiveRegion = (target_region || legacyCityName || '臺北市').trim();
  const effectiveTheme = theme_mode || legacyTravelStyle || 'leisure_family';
  const numDays = Math.min(Math.max(Number(days) || 1, 1), 5);
  const seedNum = typeof variationId === 'number'
    ? variationId
    : typeof variationId === 'string'
    ? Number(variationId.replace(/\D/g, '').slice(-6)) || Date.now()
    : Date.now();
  const excludedList: string[] = Array.isArray(excludedSpots) ? excludedSpots.filter((s: any) => typeof s === 'string' && s.trim()) : [];
  const excludedHotelList: string[] = Array.isArray(excludedHotels) ? excludedHotels.filter((h: any) => typeof h === 'string' && h.trim()) : [];

  try {
    if (!effectiveRegion) {
      return res.status(400).json({ error: '請提供縣市名稱 (target_region)' });
    }

    const isIsland = ['澎湖縣', '金門縣', '連江縣', '綠島', '蘭嶼', '琉球嶼'].includes(effectiveRegion);

    const selectedThemeKey = resolveThemeKey(effectiveTheme);
    const selectedThemeDef = THEME_DEFINITIONS[selectedThemeKey];

    const budgetText = budget_level === 'budget'
      ? '經濟小資 (青年旅館/背包客棧/銅板小吃)'
      : budget_level === 'luxury'
      ? '尊榮奢華 (五星級飯店/溫泉渡假村/景觀私廚)'
      : '經典舒適 (優質商旅/設計旅宿/特色人氣餐廳)';

    const accommodationRule = numDays === 1
      ? '一日遊當日往返，無需住宿場館。'
      : numDays === 2
      ? '2天1夜行程僅需推薦第1晚下榻之住宿場館（共1間），次日遊程結束賦歸返家，第2天無需住宿。若使用者不打算住在同一間場所或連續兩天行程安排，連續兩天之活動與景點規劃絕對不能重複！'
      : keepSameHotel
      ? `【使用者選擇維持原住宿（全行程連泊同一場館）】：${numDays}天${numDays - 1}夜行程共需安排 ${numDays - 1} 晚住宿（連泊同一間核心優質住宿場館，hotel_name 全程一致），第 ${numDays} 天當日賦歸無需住宿。特別注意：連住同場所時，連續兩天的行程規劃活動安排 (activity_play_style) 與景點 (spot_name) 絕對不能重複！`
      : `【使用者選擇不維持原住宿（隨行程更換住宿）】：${numDays}天${numDays - 1}夜行程只需要推薦 ${numDays - 1} 間住宿場館（第1天至第${numDays - 1}天每晚各推薦1間緊鄰當日活動區域之不同風格旅宿；最後一天第 ${numDays} 天行程結束後當日賦歸返家，第 ${numDays} 天不需安排住宿場館）！特別注意：使用者不打算住在同一間場所，若安排到相同飯店或住宿場域，或者即使是連續兩天的行程規劃，各天之間的景點與具體活動安排 (activity_play_style) 絕對不能重複，必須完全不同！`;

    const systemPrompt = `### 角色定位 (Role)
你是「臺灣好好玩」智慧行程規劃引擎。專注於規劃全台（含六都及各縣市）具備深度生活感、非市區外鄉鎮小眾探索且地理動線流暢的完整行程。

---

### 核心輸入參數 (Input Parameters)
- target_region: ${effectiveRegion}
- theme_mode: "${selectedThemeKey}" (${selectedThemeDef.name})
- days: ${numDays} 天 (${numDays > 1 ? `${numDays - 1} 晚住宿` : '一日遊當天賦歸'})
- 住宿偏好 (accommodation_preference): "${budget_level}" (${budgetText})
- 多日住宿策略: ${accommodationRule}
- language: "${language}"

---

### 行程組合原則 (Itinerary Assembly Rules)
1. 完整生態打包：每日行程必須同時包含【深度景點】+【推薦具體玩法 (activity_play_style)】+【在地餐飲/點心 (food_recommendation)】+【銜接流暢的旅店 (stay_recommendation)】。
2. 住宿偏好 (budget_level: "${budget_level}") 推薦準則：
   - 當 budget_level === 'budget' 時：
     * 住宿【必須且只能】推薦青年旅館、背包客棧、文青平價旅社或特色小資民宿（每晚 700~1,800 元），嚴格禁止推薦昂貴五星大飯店或高價渡假村！
     * 餐飲推薦夜市銅板排隊小吃、在地傳統老字號平價攤商。
   - 當 budget_level === 'standard' 時：
     * 住宿推薦中高階質感商旅、文化設計文旅或優質特色民宿（每晚 2,500~4,500 元）。
     * 餐飲推薦排隊知名老店、在地特色餐廳。
   - 當 budget_level === 'luxury' 時：
     * 住宿【必須推薦】頂級知名五星級大飯店、景觀溫泉渡假村或頂級奢華 Villa（每晚 6,000 元以上）。
     * 餐飲推薦主廚私房料理、星級精緻饗宴或景觀海鮮料理。
3. 【城鄉全域覆蓋與市區外鄉鎮深度探索鐵則（最核心要求）】：
   - 【嚴禁只侷限在市中心核心蛋黃區】：每次規劃與每次「再次生成」時，必須大幅擴展至市區以外的各特色鄉鎮行政區，隨機探索不同城鄉與山海平原聚落！
   - 以各縣市市區外鄉鎮為例（每次生成隨機輪替組合不同鄉鎮軸線）：
     * 臺南市：除中西區/安平外，必須隨機深入【六甲區】（六甲落羽松秘境/赤山龍湖巖/媽祖廟百年麵茶冰）、【官田區】（西拉雅官田遊客中心/水雉生態教育園區/葫蘆埤自然公園/菱角田）、【柳營區】（德元埤荷蘭村/八翁酪農區鮮乳/劉啟祥美術紀念館/尖山埤江南渡假村）、【後壁區】（菁寮無米樂老街/割稻飯）、【白河區/東山區】（關子嶺泥漿溫泉/水火同源/蓮花田/東山175咖啡公路）、【楠西區/玉井區】（玉井愛文芒果冰/楠西梅嶺梅子雞/玄空法寺/曾文水庫）、【山上區/新化區/左鎮區】（山上花園水道博物館/新化老街大目降/左鎮化石園區）、【七股區/北門區/將軍區】（七股潟湖烤蚵/北門井仔腳瓦盤鹽田夕陽/青鯤鯓扇形鹽田）等。
     * 新北市：深度涵蓋【石碇】千島湖、【坪林】茶業博物館、【雙溪/貢寮】草嶺古道與福隆、【金山/萬里】磺港金包里老街與野柳、【三芝/石門】淺水灣與富貴角、【平溪】望古與十分瀑布等。
     * 臺中市：深度涵蓋【外埔】忘憂谷、【后里】泰安落羽松與糖廠、【東勢】林場與客家聚落、【石岡】水壩與東豐綠廊、【和平】谷關溫泉與八仙山、【霧峰】光復新村與林家花園等。
     * 高雄市：深度涵蓋【美濃】客家紙傘與粄條、【旗山】糖鐵老街、【六龜】寶來不老溫泉、【甲仙】芋頭老街、【田寮】月世界惡地、【阿蓮】大崗山一線天、【永安/彌陀】海岸光廊與石斑魚故鄉等。
     * 屏東縣：深度涵蓋【萬巒】豬腳與萬金聖母聖殿、【潮州】林後四林平地森林與冷熱冰、【三地門/霧台】原鄉琉璃與岩板巷、【車城/四重溪】福安宮與溫泉、【滿州】佳樂水、【枋山】海景芒果咖啡等。
     * 彰化縣：深度涵蓋【田尾】公路花園、【芳苑】海空步道海牛採蚵、【二林】葡萄酒莊、【社頭】織襪芭樂、【田中】米倉綠意、【二水】八堡圳自行車道等。
     * 南投縣：深度涵蓋【信義】梅子夢工廠、【仁愛】清境高空步道與奧萬大、【竹山】紫南宮與竹海、【水里/集集】車埕木業與蛇窯、【魚池】紅茶與日月潭等。
     * 雲林縣：深度涵蓋【古坑】華山咖啡與綠色隧道、【西螺】大橋與醬油文化、【虎尾】糖廠與布袋戲館、【口湖】成龍濕地與鰻魚養殖等。
     * 嘉義縣：深度涵蓋【梅山】太平雲梯、【阿里山/奮起湖】鐵道與巨木群、【東石/布袋】漁人碼頭蚵田與高跟鞋教堂、【六腳/太保】蒜頭糖廠與南故宮等。
     * 新竹縣：深度涵蓋【北埔】老街擂茶、【峨眉】峨眉湖細茅埔吊橋、【橫山】內灣老街、【關西】仙草博物館與東安古橋、【尖石】青蛙石步道等。
     * 苗栗縣：深度涵蓋【南庄】向天湖與老街、【三義】勝興鐵道自行車、【大湖】草莓園、【泰安】清安豆腐街與溫泉、【通霄/苑裡】白沙屯飛牛牧場與藺草工坊等。
     * 宜蘭縣：深度涵蓋【大同】清水地熱、【三星】蔥田拔蔥體驗、【冬山】生態綠舟與梅花湖、【員山】金車威士忌酒廠、【南澳】東澳粉鳥林等。
     * 花蓮縣：深度涵蓋【光復】糖廠與大農大富森林、【瑞穗】溫泉與牧場、【玉里】客城鐵橋與玉里麵、【富里】六十石山、【豐濱】石梯坪海岸等。
     * 臺東縣：深度涵蓋【池上】伯朗大道稻浪、【關山】米國學校、【鹿野】高台茶鄉、【長濱】金剛大道、【成功】三仙台、【太麻里】多良與金針山等。
4. 【旅宿推薦與地理連貫規則（最核心要求：住宿推薦必須與次日/第二天旅遊景點距離極近）】：
   - ${accommodationRule}
   - 【住宿與次日旅遊距離極近鐵則】：每日推薦之住宿場館 (stay_recommendation)，其地理位置【必須與次日（第二天）一早預計走訪之首站景點/鄉鎮區域極為接近（車程 5~15 分鐘以內）】！
     * 第 1 天晚上的住宿推薦，必須直接位於「第 2 天上午預計走訪之鄉鎮行政區」或緊鄰之核心生活圈，讓旅人當晚入住後，次日早晨醒來即可就近抵達第 2 天第一站，徹底省去晨間長途拉車之苦！
     * 第 d 天（d = 1 到 N-1）之住宿，均需直接銜接並緊鄰「第 d+1 天」首個景點之所在鄉鎮！
   - 【JSON 輸出欄位明確區分】：每日 stay_recommendation 必須完整且明確區分以下資訊：
     * hotel_name: 旅宿場館官方正式名稱（真實存在於次日走訪鄉鎮軸線）
     * location_type: 地理走訪軸線與所在分區（例：「柳營/六甲/官田水庫生態圈」、「白河/東山/關子嶺溫泉生活圈」、「美濃客家文化聚落」、「礁溪溫泉觀光核心區」）
     * property_type: 場館住宿屬性分類（例：「湖畔渡假會館」、「山林溫泉渡假飯店」、「老宅改建文旅」、「質感設計風格旅宿」、「文青背包客棧」）
     * feature: 場館核心特色亮點、客房風格與專屬休閒設施說明
     * geographic_continuity: 地理位置連貫性說明（明確具體說明緊鄰次日/第二天首站之車程時間 5~15 分鐘與晨間順向出發優勢）
   - 同時嚴格遵守住宿偏好 (budget_level: "${budget_level}") 的價位定位。
5. 在地性與高隨機多樣性加權：
   - 拒絕單純堆砌市中心千篇一律的打卡熱點；每次生成時，請優先挑選 50% 以上「鄉鎮在地特色、市區外小眾私房、地方生活脈絡」的景點。
   - 觀光工廠分流：
     * 使用者選 leisure_family 派發具冷氣與親子甜點/玩具互動工廠。
     * 使用者選 culture_and_lifestyle 派發傳產文化、釀造、陶瓷或工藝見學工廠。
     * 使用者選 outdoor_nature 避免室內人造封閉工廠，以大自然風景步道為主。
     * 使用者選 local_gourmet 派發在地名產手作、在地農產展售與特色手路美食工坊。
6. 語言輸出嚴格準則 (language: "${language}")：
   - 若 language === 'en'：JSON 裡面的所有字串（包含 itinerary_title, route_area, spot_name, activity_play_style, food_recommendation, transport_tip, hotel_name, location_type, property_type, feature, geographic_continuity）必須全部使用自然流暢的英文 (English) 輸出！景點與飯店可採雙語（如 "Jiufen Old Street (九份老街)"）。
   - 若 language === 'ja'：JSON 裡面的所有字串必須全部使用道地、自然流暢的日文 (Japanese) 輸出！
   - 若 language === 'zh-TW'：JSON 裡面的所有字串使用台灣繁體中文輸出。
7. 【極致隨機與非重複原則】：
   - 每一次觸發或再次生成時，必須依據隨機變體序號隨機切換完全不同的行政區與鄉鎮軸線組合（包含市區外各小鎮），每次都推薦截然不同的驚喜旅程！
   - 全行程之景點 (spot_name) 絕對不可重複。
   - 連續天數之活動安排 (activity_play_style) 絕對不可重複，即使安排到相同飯店或住宿場域，連續兩天活動規劃也必須完全不同！
   - 若使用者不打算住在同一間場所（更換住宿），每日推薦之旅宿場館 (hotel_name) 必須各不相同。
8. 【最高營業時間匹配鐵則】：白天安排 17:00 打烊之觀光工廠與展館；晚間 (evening) 17:30 - 21:30 嚴禁安排已打烊場館，必須安排知名夜市、在地人氣晚餐商圈或星光璀璨夜景！
9. 【最高鐵則：因為夜市沒有冷氣，所以不能有「全程」，只能寫「部分場館有提供冷氣」】：
   - 行程介紹、玩法與所有說明中，嚴禁出現「全程鎖定室內冷氣」、「全程冷氣」等字樣！
   - 涉及冷氣之描述，一律只能寫「部分場館有提供冷氣」。夜市或戶外景點之 indoor_ac 必須為 false！
10. 【本島與離島區域嚴格隔離鐵則】：
   - 若為臺灣本島縣市（如屏東縣、臺東縣、宜蘭縣、新北市、花蓮縣等）：嚴格禁止在行程中安排小琉球、綠島、蘭嶼、龜山島、澎湖、金門、馬祖等需搭乘飛機或客輪才能抵達之離島景點！所有景點、玩法與住宿必須 100% 位於該本島縣市之陸地範圍。
   - 若為離島縣市/區域（澎湖縣、金門縣、連江縣、綠島、蘭嶼、琉球嶼）：行程【必須且只能限定在該離島範圍內】，嚴禁穿插臺灣本島景點，並詳細說明往返航班與客輪交通方式。
11. 【縣市行政轄區 100% 絕對歸屬鐵則（最核心要求）】：
   - 行程中規劃的所有景點、店家、餐廳美饌與住宿，【必須 100% 真實隸屬於使用者所選定的目標縣市（${effectiveRegion}）行政轄區內】，嚴禁跨縣市混淆或將鄰近縣市之鄉鎮景點誤植入！
   - 例如：
     * 目標為【嘉義縣】時：只能規劃嘉義縣轄下鄉鎮（如阿里山、奮起湖、梅山、太保、六腳、朴子、東石、布袋、大林、民雄、竹崎、番路、大埔等），絕對不可出現六甲、官田、柳營、後壁、白河等臺南市鄉鎮！
     * 目標為【臺南市】時：才可規劃六甲、官田、柳營、後壁、白河、東山、楠西、玉井、山上、新化、左鎮、七股、北門、將軍、安平、中西區、仁德等臺南市轄區景點！
     * 目標為【高雄市】時：只能規劃美濃、旗山、六龜、甲仙、田寮、阿蓮、梓官、大樹、旗津、鹽埕等高雄轄區景點！
   - 所有推薦之排隊店家、午晚餐餐廳，均必須經過嚴格驗證確實座落於該目標縣市，杜絕任何跨縣市景點或店家誤列。
12. 【輸出格式規範】：輸出符合以下標準 JSON 格式，不要包含任何額外 markdown 標籤或對話文字。`;

    const userPrompt = `請為我規劃「${effectiveRegion}」的 ${numDays} 日遊深度生活感專屬推薦行程。
目標縣市 (target_region)：${effectiveRegion}
主題風格 (theme_mode)：${selectedThemeKey} (${selectedThemeDef.name})
旅遊天數 (days)：${numDays}
住宿偏好 (accommodation_preference)：${budget_level}
語言 (language)：${language}
交通工具：${transport}
【城鄉全域與市區外鄉鎮深度探索要求】：
請特別注重多樣性與高隨機性！切勿只安排熱門市中心商圈，必須積極規劃擴展至「${effectiveRegion}」市區以外的特色鄉鎮（例如臺南市請廣泛結合六甲、官田、柳營、後壁、白河、東山、楠西、玉井、新化、左鎮、山上、七股、北門等市區外各鄉鎮區；其他各縣市亦務必深度走訪各鄉鎮小鎮與山海自然生態聚落）。
【本島與離島地理範圍嚴格規範】：
${isIsland
  ? `【離島專屬行程】：此為離島區域「${effectiveRegion}」，所有行程、景點與住宿必須 100% 限定在該離島範圍內，並明確說明搭乘飛機或客輪之往返與島上交通方式！`
  : `【本島陸地專屬行程】：此為臺灣本島縣市「${effectiveRegion}」，所有景點與住宿必須 100% 位於該縣市之本島陸地，嚴格禁止安排小琉球、綠島、蘭嶼、龜山島等需要搭乘飛機或客輪才能到達之離島景點！`}
【住宿場館推薦原則】：
${accommodationRule}
在 JSON 的 stay_recommendation 中，必須明確包含 hotel_name、location_type、property_type、feature 與 geographic_continuity 五項完整欄位資訊！
${isIsland ? '【離島交通提醒】：此為離島縣市，請務必詳細說明往返之航班或客輪交通建議。' : ''}
${excludedList.length > 0 ? `【嚴格非重複景點指令（再次生成）】：使用者正在進行「再次生成全新旅遊行程」，本次規劃【絕對不可包含】以下前次已安排過的景點：${excludedList.join('、')}。請務必挑選「${effectiveRegion}」中全新、不同鄉鎮區域軸線（特別是市區以外之鄉鎮）之特色景點與在地體驗！` : ''}
${excludedHotelList.length > 0 ? `【嚴格非重複旅宿指令（再次生成）】：本次為再次生成行程，推薦住宿場館【絕對不可重複使用】以下前次已安排過之旅宿：${excludedHotelList.join('、')}。請務必推薦全新精選旅宿！` : ''}
【隨機生成變體序號】：${seedNum}（請提供全新、不同鄉鎮行政區軸線與市區外小眾私房景點組合）
【重要提示】：每次推薦不同的組合旅程，挑選 50% 以上市區外鄉鎮在地特色與小眾私房生活脈絡景點，各日探索不同行政區域軸線，完整生態打包景點、具體玩法、在地美食與流暢旅店！`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = getGeminiClient();
      const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
      let responseText = '';

      for (let i = 0; i < candidateModels.length; i++) {
        const targetModel = candidateModels[i];
        try {
          const modelCallPromise = ai.models.generateContent({
            model: targetModel,
            contents: [
              { role: 'user', parts: [{ text: userPrompt }] }
            ],
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  itinerary_title: { type: Type.STRING, description: '行程主題標題' },
                  selected_region: { type: Type.STRING, description: '縣市名稱' },
                  theme: { type: Type.STRING, description: '輸入的主題' },
                  daily_plans: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.INTEGER },
                        route_area: { type: Type.STRING, description: '當日探索主要區域（例：台東成功至長濱海線）' },
                        schedule: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              time_slot: { type: Type.STRING, description: 'morning | afternoon | evening' },
                              spot_name: { type: Type.STRING, description: '景點官方正式名稱' },
                              activity_play_style: { type: Type.STRING, description: '在此處推薦的具體玩法與體驗' },
                              indoor_ac: { type: Type.BOOLEAN, description: '部分場館是否有提供冷氣（夜市戶外為false）' },
                              food_recommendation: { type: Type.STRING, description: '周邊或內部推薦品嚐項目' },
                              transport_tip: { type: Type.STRING, description: '移動建議（自駕/客運/步行時間）' }
                            },
                            required: ['time_slot', 'spot_name', 'activity_play_style', 'indoor_ac', 'food_recommendation', 'transport_tip']
                          }
                        },
                        stay_recommendation: {
                          type: Type.OBJECT,
                          properties: {
                            hotel_name: { type: Type.STRING, description: '旅宿場館正式名稱（真實存在，依走訪軸線安排）' },
                            location_type: { type: Type.STRING, description: '地理走訪軸線分區（例：海線濱海漁港、山城茶鄉聚落、舊城核心商圈）' },
                            property_type: { type: Type.STRING, description: '場館住宿屬性分類（例：海景特色民宿、山林溫泉渡假飯店、老宅風格客棧、設計商旅、背包客棧）' },
                            feature: { type: Type.STRING, description: '場館特色亮點與客房設施說明' },
                            geographic_continuity: { type: Type.STRING, description: '地理位置連貫性說明（距本日晚間終點車程與次日動線順向銜接優勢）' }
                          },
                          required: ['hotel_name', 'location_type', 'property_type', 'feature', 'geographic_continuity']
                        }
                      },
                      required: ['day', 'route_area', 'schedule', 'stay_recommendation']
                    }
                  },
                  disclaimer: { type: Type.STRING, description: '本行程由 AI 即時生成，實際營業時間、門票與住宿預約請依各官方公告為準。' }
                },
                required: ['itinerary_title', 'selected_region', 'theme', 'daily_plans', 'disclaimer']
              }
            }
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timed out')), 20000)
          );

          const response = await Promise.race([modelCallPromise, timeoutPromise]);

          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (modelErr: any) {
          console.log(`[AI Planner] ${targetModel} notice:`, modelErr?.status || modelErr?.message || 'proceeding to fallback');
          if (i < candidateModels.length - 1) {
            await new Promise(res => setTimeout(res, 200));
          }
        }
      }

      let parsed: any = null;
      if (responseText) {
        try {
          parsed = JSON.parse(responseText.trim());
        } catch (e) {
          try {
            const clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(clean);
          } catch (cleanErr) {
            parsed = null;
          }
        }
      }

      if (!parsed || !Array.isArray(parsed.daily_plans) || parsed.daily_plans.length === 0) {
        const fallbackResult = generateCuratedFallback(effectiveRegion, numDays, legacyTravelStyle || selectedThemeDef.name, transport, keepSameHotel, budget_level, language, seedNum, excludedList, excludedHotelList);
        const enriched = enrichItineraryWithRealTransit(fallbackResult, effectiveRegion, numDays, transport, userLocation, closestCityName);
        return res.json(enriched);
      }

      // Map daily_plans to standard itinerary format for seamless app rendering & map routing (N days = N-1 nights/stays)
      parsed.itinerary = parsed.daily_plans.map((plan: any) => {
        const isLastDay = plan.day === numDays;
        const shouldHaveStay = numDays > 1 && !isLastDay;
        const stayHotelName = shouldHaveStay ? (plan.stay_recommendation?.hotel_name || '') : undefined;
        return {
          day: plan.day,
          title: plan.route_area
            ? (language === 'en' ? `Day ${plan.day}: ${plan.route_area} In-Depth Exploration` : language === 'ja' ? `第${plan.day}日：${plan.route_area} 探訪` : `${plan.route_area} 深度探索`)
            : (language === 'en' ? `Day ${plan.day}: ${effectiveRegion} Highlights` : language === 'ja' ? `第${plan.day}日：${effectiveRegion} 厳選` : `${effectiveRegion} 第 ${plan.day} 天深度精選`),
          routeArea: plan.route_area,
          stayHotel: stayHotelName,
          stayRecommendation: shouldHaveStay && plan.stay_recommendation ? {
            hotel_name: plan.stay_recommendation.hotel_name || '',
            location_type: plan.stay_recommendation.location_type || '',
            property_type: plan.stay_recommendation.property_type || '',
            feature: plan.stay_recommendation.feature || '',
            geographic_continuity: plan.stay_recommendation.geographic_continuity || ''
          } : undefined,
          spots: (plan.schedule || []).map((s: any) => {
            const isNightKeyword = /(夜市|鐵花村|市集夜色|星光|夜景|光雕|酒吧|居酒屋|宵夜|夜遊|夜探|夜間|聽濤泡湯|藍眼淚)/.test(`${s.spot_name} ${s.activity_play_style}`);
            const isEvening = s.time_slot === 'evening' || isNightKeyword;
            const timeRange = s.time || (s.time_slot === 'morning' ? '09:00 - 11:30' : s.time_slot === 'afternoon' ? '14:00 - 16:30' : '17:30 - 20:30');
            const sanitizedPlayStyle = sanitizeAirConditioningText(s.activity_play_style || '');
            let opHours = '09:00 - 17:00';
            if (isEvening) {
              if (s.spot_name.includes('鐵花村')) {
                opHours = '17:00 - 22:00 (慢市集與音樂表演)';
              } else if (s.spot_name.includes('夜市')) {
                opHours = '17:30 - 24:00 (夜市熱鬧營業中)';
              } else if (/夜景|星光|光雕|星空|月影/.test(s.spot_name)) {
                opHours = '全天開放（夜間照明點燈）';
              } else {
                opHours = '17:30 - 24:00 (夜間營業中)';
              }
            } else if (s.time_slot === 'morning') {
              opHours = '09:00 - 17:00 (日間場館開放)';
            } else if (s.time_slot === 'afternoon') {
              opHours = '09:00 - 17:00 (日間場館・17:00 打烊前參觀完畢)';
            }
            return {
              time: timeRange,
              timeSlot: isEvening ? 'evening' : s.time_slot,
              name: (s.spot_name || '').trim(),
              intro: sanitizedPlayStyle,
              activityPlayStyle: sanitizedPlayStyle,
              indoorAc: isEvening ? false : Boolean(s.indoor_ac),
              foodRecommendation: s.food_recommendation || '',
              transportTip: s.transport_tip || '',
              duration: isEvening ? (language === 'en' ? '2.5 - 3 hrs' : language === 'ja' ? '2.5〜3時間' : '2.5 - 3 小時') : (language === 'en' ? '2.5 hrs' : language === 'ja' ? '2.5時間' : '2.5 小時'),
              operatingHours: opHours,
              isNightSpot: isEvening,
              transportToNext: s.transport_tip || (language === 'en' ? 'To next stop' : language === 'ja' ? '次のスポットへ' : '前往下一站'),
              googleMapsKeyword: (s.spot_name || '').trim()
            };
          })
        };
      });

      parsed.cityName = parsed.selected_region || effectiveRegion;
      parsed.days = numDays;
      parsed.travelStyle = parsed.theme || selectedThemeDef.name;
      parsed.transportMode = transport;
      parsed.keepSameHotel = keepSameHotel;

      // Synchronize accommodation recommendations with tiered accommodations for this region and budget_level
      const hotelOffset = seedNum > 0 ? (Math.abs(seedNum) % 10) : 0;
      const seenHotelNames = new Set<string>(excludedHotelList);
      const baseTierHotel = getTieredAccommodation(effectiveRegion, budget_level, hotelOffset, (language === 'en' || language === 'ja') ? language : 'zh-TW', seenHotelNames);
      parsed.baseHotelName = baseTierHotel.name;
      parsed.budgetLevel = budget_level;

      parsed.itinerary.forEach((day: any, dIdx: number) => {
        const isLastDay = day.day === numDays;
        if (numDays > 1 && !isLastDay) {
          const nextDay = parsed.itinerary[dIdx + 1];
          const nextTargetArea = nextDay?.routeArea || (nextDay?.spots?.[0]?.name) || day.routeArea || '';
          const nextSpotName = nextDay?.spots?.[0]?.name || nextTargetArea;

          const assignedHotel = keepSameHotel
            ? baseTierHotel
            : getTieredAccommodation(effectiveRegion, budget_level, hotelOffset + dIdx, (language === 'en' || language === 'ja') ? language : 'zh-TW', seenHotelNames, nextTargetArea);
          seenHotelNames.add(assignedHotel.name);

          day.stayHotel = `${assignedHotel.name} (${assignedHotel.type})`;
          day.stayRecommendation = {
            hotel_name: assignedHotel.name,
            location_type: assignedHotel.locationType || `${effectiveRegion}精華生活圈`,
            property_type: assignedHotel.type || '優質特色旅宿',
            feature: assignedHotel.description || day.stayRecommendation?.feature || '',
            geographic_continuity: language === 'en'
              ? `Strategically situated right next to Day ${day.day + 1}'s 1st destination [${nextSpotName}], only ~5-15 mins drive, ensuring seamless morning departure.`
              : language === 'ja'
              ? `翌日（第${day.day + 1}日）の最初の訪問地【${nextSpotName}】に極めて近く、車で約5〜15分。朝の移動が非常にスムーズで快適です。`
              : `地理位置緊鄰次日（第 ${day.day + 1} 天）首站【${nextSpotName}】，車程僅約 5~15 分鐘，晨間出發極度便捷省時。`
          };
        } else {
          day.stayHotel = undefined;
          day.stayRecommendation = undefined;
        }
      });

      if (Array.isArray(parsed.daily_plans)) {
        parsed.daily_plans.forEach((plan: any, pIdx: number) => {
          const isLastDay = plan.day === numDays;
          if (numDays > 1 && !isLastDay) {
            const assigned = parsed.itinerary[pIdx]?.stayRecommendation;
            if (assigned) {
              plan.stay_recommendation = { ...assigned };
            }
          } else {
            delete plan.stay_recommendation;
          }
        });
      }

      parsed.disclaimer = parsed.disclaimer || (language === 'en'
        ? 'Generated by AI in real time. Please verify opening hours, admission, and hotel bookings with official announcements.'
        : language === 'ja'
        ? '本行程はAIによりリアルタイム生成されたものです。営業時間、入場料、宿泊予約は各施設の最新公式情報をご確認ください。'
        : '本行程由 AI 即時生成，實際營業時間、門票與住宿預約請依各官方公告為準。');

      if (language === 'en') {
        parsed.overview = sanitizeAirConditioningText(
          `[${parsed.itinerary_title || `${effectiveRegion} Curated Tour`}] Exclusively designed based on "${parsed.theme || selectedThemeDef.name}" and ${budget_level === 'budget' ? 'budget-friendly' : budget_level === 'luxury' ? 'luxury premier' : 'standard comfort'} style. Daytime highlights paired with authentic evening night market street food! Accommodations seamlessly connect with each day's route.`
        );
        parsed.hotelAdvice = numDays === 1
          ? ''
          : keepSameHotel
          ? `[Single Stay Guarantee]: All nights reserved at "${parsed.baseHotelName}", radiating out daily without luggage repacking hassle.`
          : `[Dynamic Axis Accommodations]: Recommended stays along each day's exploration axis. Night 1 at "${parsed.baseHotelName}".`;
        parsed.transitNotice = isIsland
          ? `[Island Transit Guide]: Please monitor flight and ferry schedules for ${effectiveRegion} and check in ahead of time.`
          : `[Transit Route Guide]: Recommended transit via ${transport} paired with local walking routes without backtracks.`;
      } else if (language === 'ja') {
        parsed.overview = sanitizeAirConditioningText(
          `【${parsed.itinerary_title || `${effectiveRegion}カスタムツアー`}】「${parsed.theme || selectedThemeDef.name}」と${budget_level === 'budget' ? 'エコノミー' : budget_level === 'luxury' ? 'プレミアム贅沢' : '定番快適'}スタイルに合わせて設計。昼の文化名所と夜の絶品夜市グルメを満喫！日ごとの探索軸に合わせた宿泊を厳選。`
        );
        parsed.hotelAdvice = numDays === 1
          ? ''
          : keepSameHotel
          ? `【同一施設連泊】：全日程「${parsed.baseHotelName}」に連泊し、移動負担なく快適に周遊できます。`
          : `【エリア別おすすめ宿】：日ごとの周遊軸に合わせて特色宿を提案。初日は「${parsed.baseHotelName}」に宿泊。`;
        parsed.transitNotice = isIsland
          ? `【離島交通案内】：${effectiveRegion}発着の航空便および最終フェリーの運航状況に注意し、余裕をもってお手続きください。`
          : `【交通動線案内】：${transport}と徒歩を組み合わせ、効率よく巡るルート。`;
      } else {
        parsed.overview = sanitizeAirConditioningText(
          `【${parsed.itinerary_title || `${effectiveRegion}客製專屬行程`}】專為您依據「${parsed.theme || selectedThemeDef.name}」風格精心規劃。日間深度造訪代表性景點與在地體驗，晚間走訪特色夜市美食。各日安排不同區域軸線，景點順向串聯不折返，住宿依照走訪動線精準銜接！`
        );
        parsed.hotelAdvice = numDays === 1
          ? ''
          : keepSameHotel
          ? `【全程入住同間旅宿】：全程下榻『${parsed.baseHotelName}』，行程放射狀探訪。`
          : `【每日軸線特色旅宿推薦】：住宿依走訪軸線延伸至海線、山城、茶鄉或近郊，不重複推薦同間旅店。首日下榻『${parsed.baseHotelName}』。`;
        parsed.transitNotice = isIsland
          ? `【離島交通指引】：請留意往返${effectiveRegion}之航班或末班客輪動態，建議提前抵達港口或機場辦理登機劃位手續。`
          : `【交通動線指引】：建議以${transport}搭配在地步行動線，景點順向串聯不折返。`;
      }

      // Strict post-processing deduplication guarantee: No attraction or activity can repeat across any days
      const cityData = TAIWAN_CITIES.find(c => c.name === effectiveRegion) || TAIWAN_CITIES[0];
      const allCitySpots = [...cityData.highlights, ...cityData.tourismFactories];
      const seenSpotNames = new Set<string>();
      if (Array.isArray(excludedList) && excludedList.length > 0 && allCitySpots.length > (excludedList.length + numDays * 2)) {
        excludedList.forEach(s => seenSpotNames.add(s.trim()));
      }
      const seenPlayStyles = new Set<string>();

      const dynamicDayActivities = [
        [
          language === 'en' ? 'Stroll and admire heritage street facades and neighborhood vitality.' : language === 'ja' ? '歴史的な町並みや建築美をじっくり鑑賞。' : '漫步欣賞老街紋理與經典建築立面，細讀歷史地景與生活聚落風采。',
          language === 'en' ? 'Savor century-old culinary recipes and traditional local flavors.' : language === 'ja' ? '伝統の郷土料理や老舗名店の味を堪能。' : '品嚐傳承百年老手藝名點與招牌在地滋味，感受甘醇古早層次。',
          language === 'en' ? 'Listen to artisanal manufacturing storytelling and heritage crafts.' : language === 'ja' ? '職人の技と文化展示をガイドとともに見学。' : '聆聽專業製程導覽解說，探索在地職人技術傳承與工藝美學。',
          language === 'en' ? 'Explore vibrant evening markets, hunting for popular street food stalls.' : language === 'ja' ? '活気ある夜市を巡り、人気屋台グルメを満喫。' : '夜幕低垂穿梭熱鬧人氣商圈，逐攤尋訪必吃排隊銅板小吃。'
        ],
        [
          language === 'en' ? 'Enjoy a refreshing morning walk along scenic green pathways.' : language === 'ja' ? '緑あふれる朝の遊歩道を爽快にウォーキング。' : '晨間沿著綠意步道悠閒漫遊，深呼吸清爽空氣並欣賞開闊地貌。',
          language === 'en' ? 'Feast on farm-to-table seasonal delicacies at a private kitchen.' : language === 'ja' ? '地元旬の農産物を使った創作料理に舌鼓。' : '探訪主廚私房食堂，大啖時令農特產風味合菜，享受產地直送甘美。',
          language === 'en' ? 'Learn about regional industrial transformation and hands-on crafts.' : language === 'ja' ? '伝統産業の革新を学び、体験型ワークショップに参加。' : '走入在地文化工坊探索產業轉型故事，體驗特色選物與手作樂趣。',
          language === 'en' ? 'Stroll along breezy waterfront boardwalks enjoying shimmering night lights.' : language === 'ja' ? '心地よい水辺の夜風を感じながら夜景を鑑賞。' : '微風徐徐沿著水岸木棧走廊悠閒散步，眺望璀璨光廊與百萬夜景。'
        ],
        [
          language === 'en' ? 'Deep-dive into community traditions and vintage alleys.' : language === 'ja' ? '昔ながらの路地裏を散策し、土地の生活文化を体感。' : '深度走訪地方常民生活聚落，穿梭歷史街廓老宅，感受慢活步調。',
          language === 'en' ? 'Indulge in harbor-fresh seafood or slow-cooked specialty broth.' : language === 'ja' ? '港直送の新鮮な海の幸や秘伝スープを美味しく賞味。' : '品味港灣直送現流海味或古法高湯煨煮料理，甘鮮風味回味無窮。',
          language === 'en' ? 'Inspect artisanal fermentation and craft production persistence.' : language === 'ja' ? '発酵や醸造の職人技を見学し、奥深い世界を体感。' : '參訪獨家釀造研發工藝，了解地方風土轉化為精品的職人堅持。',
          language === 'en' ? 'Browse evening night markets, picking creative souvenirs and late-night eats.' : language === 'ja' ? '夜市で手作り雑貨や名物夜食を散策・発見。' : '夜晚踏入人氣夜市市集，挑選文創手作小物並品嚐特色宵夜點心。'
        ],
        [
          language === 'en' ? 'Ascend scenic viewing decks capturing panoramic landscapes.' : language === 'ja' ? '展望台に登り、雄大な自然のパノラマビューを満喫。' : '登上景觀眺望平台俯瞰壯麗山水全景，捕捉大自然鬼斧神工之美。',
          language === 'en' ? 'Dine at pastoral garden bistros serving organic farm harvest.' : language === 'ja' ? '田園風景広がるレストランでオーガニックランチを堪能。' : '造訪田園景觀餐坊品嚐在地小農無毒時令料理，享受純樸健康滋味。',
          language === 'en' ? 'Browse curated design spaces, savoring high-mountain tea brews.' : language === 'ja' ? 'デザイン空間で地元文化に触れ、淹れたて銘茶を味わう。' : '漫步於特色展售空間細賞文創商品，品嚐現泡高山香茗與茶點。',
          language === 'en' ? 'Immerse in illuminated art installations under starlight.' : language === 'ja' ? '星空と光のアートが織りなす幻想的な夜景を堪能。' : '置身於星空璀璨的夜間藝術造景之中，享受悠閒微醺的浪漫夜晚。'
        ],
        [
          language === 'en' ? 'Capture serene early morning landmarks bathed in dawn light.' : language === 'ja' ? '朝日に包まれた象徴的な名所を記念撮影。' : '清晨在晨曦灑落間欣賞代表性地標地貌，拍照留存此行最動人的風貌。',
          language === 'en' ? 'Celebrate journey milestones with a regional celebratory banquet.' : language === 'ja' ? '贅沢な名物料理を囲み、旅のフィナーレを祝福。' : '享用精緻澎湃的慶祝盛宴，結合在地經典名產合菜為旅程畫下句點。',
          language === 'en' ? 'Pick distinctive farm gifts and mastercraft mementos.' : language === 'ja' ? '特産品や職人の手作り記念品を選び、充実した旅を完結。' : '前往特色場館選購產地直送伴手禮與職人手作紀念品，滿載而歸。',
          language === 'en' ? 'Reflect on trip memories during a gentle evening twilight walk.' : language === 'ja' ? '心地よい余韻に浸りながら家路へ。' : '在溫柔夜色中漫步整理心情，帶著滿滿的回憶與收穫平安賦歸。'
        ]
      ];

      const OFFSHORE_ISLAND_KEYWORDS = [
        '小琉球', '琉球嶼', '花瓶岩', '美人洞', '山豬溝', '烏鬼洞', '蛤板灣', '落日亭', '厚石裙礁', '龍蝦洞', '鹿粼',
        '綠島', '朝日溫泉', '南寮漁港', '綠島燈塔', '哈巴狗岩', '睡美人岩', '帆船鼻',
        '蘭嶼', '東清灣', '情人洞', '野銀地下屋', '紅頭村', '椰油部落', '開元港',
        '龜山島', '七美', '雙心石滬', '望安', '吉貝', '得月樓', '翟山坑道', '莒光樓', '沙美老街', '烈嶼', '小金門',
        '芹壁', '北海坑道', '媽祖巨神像', '東犬燈塔', '安東坑道'
      ];

      parsed.itinerary.forEach((day: any, dIdx: number) => {
        if (Array.isArray(day.spots)) {
          day.spots.forEach((spot: any, sIdx: number) => {
            let spotName = (spot.name || '').trim();
            const containsIslandKeyword = !isIsland && OFFSHORE_ISLAND_KEYWORDS.some(kw => spotName.includes(kw) || (spot.intro || '').includes(kw));

            if (seenSpotNames.has(spotName) || containsIslandKeyword) {
              const replacement = allCitySpots.find(s => !seenSpotNames.has(s.name.trim()) && (!OFFSHORE_ISLAND_KEYWORDS.some(kw => s.name.includes(kw))));
              if (replacement) {
                spot.name = replacement.name;
                spot.intro = replacement.intro;
                spot.googleMapsKeyword = replacement.googleMapsQuery || replacement.name;
                spotName = replacement.name.trim();
                seenSpotNames.add(spotName);
              } else {
                spot.name = `${effectiveRegion}地方精華景點（第${day.day}日第${sIdx + 1}站）`;
                spot.googleMapsKeyword = `${effectiveRegion} 景點`;
                spotName = spot.name;
                seenSpotNames.add(spotName);
              }
            } else if (spotName) {
              seenSpotNames.add(spotName);
            }

            // Ensure activity play style and routine is 100% distinct across consecutive days and regenerated sets
            const dayOffset = Math.abs(seedNum) % dynamicDayActivities.length;
            const dayAct = dynamicDayActivities[(dIdx + dayOffset) % dynamicDayActivities.length];
            const uniqueAct = dayAct[sIdx % dayAct.length];
            spot.activityPlayStyle = sanitizeAirConditioningText(uniqueAct);
            if (!spot.intro || spot.intro.length < 15 || seenPlayStyles.has(spot.intro.trim())) {
              spot.intro = spot.activityPlayStyle;
            }
            seenPlayStyles.add(spot.intro.trim());
            seenPlayStyles.add(spot.activityPlayStyle.trim());
          });
        }
      });

      const enriched = enrichItineraryWithRealTransit(parsed, effectiveRegion, numDays, transport, userLocation, closestCityName);
      return res.json(enriched);
    } else {
      const fallbackResult = generateCuratedFallback(effectiveRegion, numDays, legacyTravelStyle || selectedThemeDef.name, transport, keepSameHotel, budget_level, language, seedNum);
      const enriched = enrichItineraryWithRealTransit(fallbackResult, effectiveRegion, numDays, transport, userLocation, closestCityName);
      return res.json(enriched);
    }
  } catch (error: any) {
    console.warn('[Itinerary Generation] Gracefully handled request with curated fallback:', error?.message || error);
    const fallback = generateCuratedFallback(effectiveRegion, numDays, legacyTravelStyle || effectiveTheme, transport, Boolean(keepSameHotel), budget_level, language, seedNum);
    const enriched = enrichItineraryWithRealTransit(fallback, effectiveRegion, numDays, transport, userLocation, closestCityName);
    return res.json(enriched);
  }
});


// Start Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
