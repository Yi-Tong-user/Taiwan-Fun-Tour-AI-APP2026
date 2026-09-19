export interface TourismFactory {
  name: string;
  intro: string;
  googleMapsQuery: string;
}

export interface CitySpecialty {
  name: string;
  lat: number;
  lng: number;
  agriculture: string; // 農產
  fishery: string;     // 漁產
  livestock: string;   // 畜牧
  description: string; // 地方特色介紹
  region: '北部' | '中部' | '南部' | '東部' | '離島';
  highlights: {
    name: string;
    intro: string;
    googleMapsQuery: string;
  }[];
  tourismFactories: TourismFactory[]; // 觀光工廠專區
  accommodations: {
    name: string;
    type: string;
    description: string;
    googleMapsQuery: string;
  }[];
  famousFood: string[];
  islandNotice?: string;
  svgCoords: {
    x: number;
    y: number;
  };
}

export interface InterHotelTransit {
  prevHotelName: string;
  nextHotelName: string;
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  mapsUrl: string;
}

export interface MorningDepartureFromStay {
  hotelName: string;
  toSpotName: string;
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  mapsUrl: string;
}

export interface DayStayRecommendation {
  hotel_name: string;
  location_type: string; // 地理走訪軸線分區（例：海線濱海漁港、山城茶鄉聚落、舊城核心商圈）
  property_type?: string; // 場館住宿屬性（例：海景特色民宿、山林溫泉度假飯店、文創設計旅宿、背包客棧）
  feature: string; // 旅店特色亮點與客房設施說明
  price_range?: string; // 房間大概價位區間（例如：NT$ 2,800 - 4,500/晚）
  geographic_continuity?: string; // 地理位置連貫性與動線銜接說明（距晚間終點車程與次日動線順向優勢）
  distanceKm?: number; // 自當日最後景點前往住宿之距離公里
  durationMin?: number; // 前往住宿之交通時間（分鐘）
  durationText?: string; // 前往住宿之交通時間文字（如「開車約 15 分鐘 (約 5.2 公里)」）
  googleMapsUrl?: string; // 前往住宿之 Google Maps 路線導航專屬連結
  googleMapsQuery?: string; // Google Maps 搜尋關鍵字
  checkInTime?: string; // 建議入住休息時間 (如 20:00 起 / 晚間入住休息)
  isDifferentFromPrev?: boolean; // 是否為更換不同間住宿
  transitFromPrevHotel?: InterHotelTransit; // 若不同間結合 Google Maps 計算好之交通時間與距離
}

export interface ItinerarySpot {
  time: string; // 推薦遊玩時間 (如 09:30 - 11:30, 17:30 - 20:30)
  timeSlot?: 'morning' | 'afternoon' | 'evening'; // 時段分類
  name: string; // 完整景點/場館/夜市官方名稱
  intro: string; // 特色簡介
  activityPlayStyle?: string; // 在此處推薦的具體玩法與體驗
  indoorAc?: boolean; // 部分場館是否有提供冷氣
  foodRecommendation?: string; // 周邊或內部推薦品嚐項目
  transportTip?: string; // 移動建議（自駕/客運/步行時間）
  duration: string; // 建議停留時長
  operatingHours?: string; // 場館或景點官方營業時間 (如 09:00 - 17:00 或 17:30 - 24:00)
  isNightSpot?: boolean; // 是否為夜間適遊景點
  transportToNext: string;
  googleMapsKeyword: string;
  // Google Maps Inter-Spot Transit fields
  nextSpotName?: string; // 下一個景點名稱
  nextLegDistanceKm?: number; // 景點間正確距離（公里）
  nextLegDurationMin?: number; // 交通時間（分鐘）
  nextLegDurationText?: string; // 交通時間文字（如「開車約 1 小時 11 分鐘 (60.0 公里)」）
  nextLegMapsUrl?: string; // 景點至景點 Google Maps 路線導航專屬連結
  nextLegWarning?: string; // 若此段距離過長之超時提醒
}

export interface DayReturnTrip {
  destinationName: string; // 返程終點（例如「您的目前出發定位點」或出發城市中心/飯店）
  distanceKm: number; // 返程距離公里
  durationText: string; // 返程交通時間（如「開車約 1 小時 12 分鐘」）
  googleMapsUrl: string; // 返程 Google Maps 即時路線導航
  notice?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  routeArea?: string; // 當日探索主要區域（例：台東成功至長濱海線、苗栗山城南庄三義）
  stayHotel?: string;
  stayRecommendation?: DayStayRecommendation; // 依走訪軸線延伸之流暢特色旅宿
  spots: ItinerarySpot[];
  returnTrip?: DayReturnTrip; // 定位點返程距離與交通時間
  morningDepartureFromStay?: MorningDepartureFromStay; // 晨間自住宿出發至本日首站之交通時間與 Google Maps 導航
}

export interface TransitFeasibility {
  isFeasible: boolean; // 是否可在合理時間內參觀
  issueReason?: string; // 無法安排或超時原因說明
  suggestedMode?: string; // 建議交通工具（如 汽車自駕 / 機車租借）
  suggestedModeReason?: string; // 建議理由
  affectedSpots?: string[]; // 受影響無法在閉館前參觀之景點
  carTimeText?: string; // 若改用汽車自駕所需時間
}

export interface IslandNightTransitInfo {
  destinationName: string;
  hasFlight: boolean;
  hasFerry: boolean;
  flightNightNotice?: string; // 晚間末班航班資訊
  ferryNightNotice?: string; // 晚間/傍晚末班客輪資訊
  generalAdvice: string; // 返程叮嚀
}

export interface AIItineraryResponse {
  itinerary_title?: string; // 行程主題標題
  selected_region?: string; // 縣市名稱
  theme?: string; // 輸入的主題
  budget_level?: 'budget' | 'standard' | 'luxury'; // 預算等級
  budgetLevel?: 'budget' | 'standard' | 'luxury'; // 預算等級 (駝峰命名相容)
  daily_plans?: any[]; // 每日深度規劃結構
  disclaimer?: string; // 官方公告免責警語
  cityName: string;
  days: number;
  travelStyle: string;
  transportMode: string;
  keepSameHotel?: boolean;
  baseHotelName?: string;
  overview: string;
  transitNotice?: string;
  hotelAdvice?: string;
  itinerary: ItineraryDay[];
  transitFeasibility?: TransitFeasibility; // 交通可行性檢測與運具推薦
  islandNightTransit?: IslandNightTransitInfo; // 離島晚間航班/船班指引
  generationId?: string; // 本次生成之唯一識別碼
}

// 景點收藏（僅使用者單獨點擊「收藏景點」時新增）
export interface FavoriteSpot {
  id: string;
  spotName: string;
  county: string;
  suggestedTime: string;
  googleMapsUrl: string;
}

// 單日行程收藏（點擊「收藏當天行程」時儲存整包當日資料）
export interface FavoriteDayPlan {
  dayId: string;
  parentTripTitle?: string;
  dayIndex: number;
  dayThemeAxis: string; // 例：池上伯朗大道與海端部落 深度探索
  startLocationRoute?: string;
  schedule: Array<{
    spotName: string;
    timeRange: string;
    description: string;
    transitToNext?: string;
  }>;
}

// 多日行程收藏（點擊「全部收藏此行程」時儲存整份總覽）
export interface FavoriteFullTrip {
  tripId: string;
  title: string; // 例：南投縣 4 日遊最佳化路線
  theme: string;
  transportType: string;
  days: FavoriteDayPlan[];
}

export interface SavedItinerary {
  id: string;
  savedAt: string;
  cityName: string;
  days: number;
  travelStyle: string;
  transportMode: string;
  overview: string;
  data: AIItineraryResponse;
  generationId?: string;
  // FavoriteFullTrip compatibility fields
  tripId?: string;
  title?: string;
  theme?: string;
  transportType?: string;
}

export interface SavedDayItinerary {
  id: string;
  savedAt: string;
  cityName: string;
  dayNumber: number;
  dayTitle: string;
  stayHotel?: string;
  travelStyle: string;
  transportMode: string;
  spots: ItinerarySpot[];
  generationId?: string;
  // FavoriteDayPlan compatibility fields
  dayId?: string;
  parentTripTitle?: string;
  dayIndex?: number;
  dayThemeAxis?: string;
  startLocationRoute?: string;
  schedule?: Array<{
    spotName: string;
    timeRange: string;
    description: string;
    transitToNext?: string;
  }>;
}

export interface SavedSpotItem {
  id: string;
  savedAt: string;
  cityName: string;
  dayNumber?: number;
  spot: ItinerarySpot;
  // FavoriteSpot compatibility fields
  spotName?: string;
  county?: string;
  suggestedTime?: string;
  googleMapsUrl?: string;
  userNote?: string; // 使用者自訂備忘筆記
  customTag?: string; // 使用者自訂標籤 (如: 必去打卡、必吃美食、已預約)
  visited?: boolean; // 是否已踩點/已去過
}

