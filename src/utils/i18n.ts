export type SupportedLanguage = 'zh-TW' | 'en' | 'ja';

export const LANGUAGE_STORAGE_KEY = 'taiwan_travel_app_language';

export interface Translations {
  appName: string;
  appSubtitle: string;
  mapExplore: string;
  howToUse: string;
  viewGuide: string;
  savedList: string;
  savedItineraries: string;
  locateMe: string;
  located: string;
  locating: string;
  openLocation: string;
  privacyBadge: string;
  viewMap: string;
  disclaimer: string;
  settings: string;
  selectCityDropdownPrompt: string;
  selectCity: string;
  allCities: string;
  randomCity: string;
  randomSelecting: string;
  randomSelectingCenter: string;
  randomSelectingSubtitle: string;
  departurePoint: string;
  recommendedRoute: string;
  launchNavigation: string;
  exploreItinerary: string;
  themeTitle: string;
  transportTitle: string;
  themeLeisure: string;
  themeCulture: string;
  themeOutdoor: string;
  themeGourmet: string;
  disclaimerModalTitle: string;
  disclaimerModalSubtitle: string;
  disclaimerText1: string;
  disclaimerText2: string;
  disclaimerText3: string;
  understandBtn: string;
  locationRequestTitle: string;
  locationRequestSubtitle: string;
  locationRequestMessage: string;
  locationRequestPrivacy: string;
  disallowBtn: string;
  allowLocationBtn: string;
  agreeAndLocateBtn: string;
  agreeOnlyBtn: string;
  guideModalTitle: string;
  guideModalSubtitle: string;
  guideTopHint: string;
  languageSelect: string;
  languageSelectSubtitle: string;
  langZhTW: string;
  langEn: string;
  langJa: string;
  close: string;
  settingsTitle: string;
  settingsSubtitle: string;
  settingsDone: string;
  userGuideSectionTitle: string;
  guideBadgeText: string;
  disclaimerBadgeText: string;
  openFullDisclaimer: string;
  openFullGuide: string;

  // Saved modal keys
  savedModalTitle: string;
  savedLimitTotal: string;
  savedLimitReached: string;
  savedLimitMax: string;
  savedUsed: string;
  tabFullItinerary: string;
  tabDayItinerary: string;
  tabSingleSpot: string;
  emptyFullTitle: string;
  emptyFullDesc: string;
  emptyDayTitle: string;
  emptyDayDesc: string;
  emptySpotTitle: string;
  emptySpotDesc: string;
  swipeToDelete: string;
  swipeToDeleteHint: string;
  clearAllSpotsBtn: string;
  clearAllSpotsPromptTitle: string;
  clearAllSpotsPromptDesc: string;
  clearAllSpotsCancel: string;
  clearAllSpotsConfirm: string;
  clearAllSpotsEmptyTooltip: string;
  clearAllSpotsActionTooltip: string;
  visitedManagementTitle: string;
  visitedManagementHint: string;
  visitedDeleteBtn: string;
  visitedDeleteTooltip: string;
  saveDayFullSet: string;
  plannedSpotsCount: string;
  navigationBtn: string;
  openSavedFullItinerary: string;
  deleteBtn: string;

  // Map & Regions
  mapClickHint: string;
  mapExplore22Cities: string;
  cityFeatureHint: string;
  privacyNoticeHeader: string;
  privacyNoticeContent: string;
  targetCityLabel: string;
  northRegion: string;
  centralRegion: string;
  southRegion: string;
  eastRegion: string;
  islandRegion: string;
  islandNote: string;
  dayN: string;
  lienchiangBoxTitle: string;
  kinmenBoxTitle: string;
  penghuBoxTitle: string;
  pacificIslandsTitle: string;
  liuqiuBoxTitle: string;
  userLocationMarker: string;
  stoppedCityPrompt: string;
  stoppedCityClickDetail: string;

  // CityDetailSheet UI keys
  smartCustomTour: string;
  transitGuideTitle: string;
  departureLocLabel: string;
  departureStraightDist: string;
  notLocatedGuide: string;
  instantStartNav: string;
  openCityInMaps: string;
  localCultureTitle: string;
  localProduceTitle: string;
  agricultureLabel: string;
  fisheryLabel: string;
  livestockLabel: string;
  famousFoodLabel: string;
  highlightsTitle: string;
  tourismFactoriesTitle: string;
  accommodationsTitle: string;
  viewMoreAccommodations: string;
  collapseAccommodations: string;
  collapseBanner: string;
  expandBanner: string;
  itineraryGeneratorTitle: string;
  selectDaysLabel: string;
  daysUnit: string;
  dayTourUnit: string;
  selectStyleLabel: string;
  selectTransportLabel: string;
  keepSameHotelLabel: string;
  islandNightNoticeTitle: string;
  generateItineraryBtn: string;
  generatingItinerary: string;
  itineraryOverview: string;
  saveEntireItinerary: string;
  entireItinerarySaved: string;
  saveThisDay: string;
  thisDaySaved: string;
  saveThisSpot: string;
  thisSpotSaved: string;
  recommendedDuration: string;
  operatingHours: string;
  transitToNext: string;
  routeNavigation: string;
  dayReturnTitle: string;
  returnToOrigin: string;
  feasibilityWarningTitle: string;
  toastSavedEntire: string;
  toastSavedDay: string;
  toastSavedSpot: string;
  toastRemovedSaved: string;
  toastLimitReached: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  'zh-TW': {
    appName: '臺灣好好玩',
    appSubtitle: '全臺 22 縣市・農漁特產與合法觀光工廠智慧導覽',
    mapExplore: '全台22縣市地圖探索旅程',
    howToUse: '查看完整圖文使用指南',
    viewGuide: '查看使用說明',
    savedList: '我的收藏',
    savedItineraries: '我的收藏',
    locateMe: '開啟定位',
    located: '已定位',
    locating: '定位中...',
    openLocation: '開啟定位',
    privacyBadge: '個資隱私保護宣告',
    viewMap: '在 Google 地圖上探索 各縣市 全域景點',
    disclaimer: '查看 AI 免責聲明',
    settings: '設定',
    selectCityDropdownPrompt: '🗺️ 選定遊玩縣市・離島（下拉選單）',
    selectCity: '選定遊玩縣市',
    allCities: '全臺 22 縣市總覽',
    randomCity: '隨機出發一座城市',
    randomSelecting: '隨機選定中...',
    randomSelectingCenter: '全臺城市隨機抽取中',
    randomSelectingSubtitle: '⏱️ 正在為您挑選最佳旅遊目的地...',
    departurePoint: '定位出發點',
    recommendedRoute: '🚗 最佳路線推薦：可搭乘台灣高鐵、台鐵幹線或經由國道自駕前往全臺各縣市。',
    launchNavigation: '即刻啟動出發導航',
    exploreItinerary: '探索客製行程',
    themeTitle: '主題分類與情境',
    transportTitle: '交通運輸工具選項',
    themeLeisure: '休閒遊憩',
    themeCulture: '文化生活',
    themeOutdoor: '戶外漫遊',
    themeGourmet: '美食尋味',
    disclaimerModalTitle: 'AI 智慧生成內容免責聲明',
    disclaimerModalSubtitle: '臺灣好好玩 使用須知與安全提醒',
    disclaimerText1: '本應用程式「臺灣好好玩」提供之所有旅遊行程、推薦景點、觀光工廠、時間動線與轉乘預估，皆由 AI 語言模型自動計算規劃，僅供個人觀光休閒之參考輔助。',
    disclaimerText2: '景點營業時間、公休日、門票收費標準及交通路況，可能因天候變化、公定假期或店家營運政策調整而有所變動，出發前請務必點擊行程中之「Google Maps」按鈕或洽詢官方店家查證最新即時營運資訊。',
    disclaimerText3: '若遇豪雨、強風、道路施工或天災等不可抗力因素，請以現場實際情況與人身安全為首要考量。',
    understandBtn: '我了解了',
    locationRequestTitle: '地理位置存取請求',
    locationRequestSubtitle: '提供鄰近縣市探索與最佳旅遊路線規劃',
    locationRequestMessage: '本應用程式需要存取您的地理位置以提供最佳的定位與最近縣市推薦服務。您是否允許存取地理位置？',
    locationRequestPrivacy: '個資隱私保護宣告：位置資料僅於您的瀏覽器本機端即時運算，絕不會上傳或儲存至任何遠端伺服器。',
    disallowBtn: '不允許',
    allowLocationBtn: '允許存取地理位置',
    agreeAndLocateBtn: '同意免責聲明並開啟定位',
    agreeOnlyBtn: '暫不開啟定位（僅同意聲明）',
    guideModalTitle: '臺灣好好玩・應用程式完整使用說明',
    guideModalSubtitle: '隨時隨地開啟臺灣 22 縣市最佳旅遊旅程',
    guideTopHint: '可隨時於右上方「設定」中再次打開本指南',
    languageSelect: '語言',
    languageSelectSubtitle: '預設為繁體中文，支援英文與日文介面切換。',
    langZhTW: '繁體中文',
    langEn: 'English',
    langJa: '日本語',
    close: '關閉',
    settingsTitle: '系統設定與使用說明',
    settingsSubtitle: '語言切換 • AI 免責聲明 • 完整圖文使用指南',
    settingsDone: '完成設定',
    userGuideSectionTitle: '臺灣好好玩・應用程式完整使用說明',
    guideBadgeText: '圖文指南',
    disclaimerBadgeText: '使用須知',
    openFullDisclaimer: '開啟完整免責聲明彈窗',
    openFullGuide: '打開完整圖文使用指南',
    savedModalTitle: '我的行程與景點收藏庫',
    savedLimitTotal: '總計',
    savedLimitReached: '已達上限',
    savedLimitMax: '收藏上限：20 筆',
    savedUsed: '已用',
    tabFullItinerary: '全部旅程',
    tabDayItinerary: '當天單日行程',
    tabSingleSpot: '單一景點',
    emptyFullTitle: '尚無整套旅程收藏',
    emptyFullDesc: '在選定城市並生成路線後，點擊概覽卡片右上方的「全部收藏此行程」，即可保存整套多日旅程！',
    emptyDayTitle: '尚無單日行程收藏',
    emptyDayDesc: '在生成的每日行程卡片中，點擊每天標題旁的「收藏當天行程」按鈕，即可將特定一整天的完整路線保存於此！',
    emptySpotTitle: '尚無單一景點收藏',
    emptySpotDesc: '在任何推薦景點卡片上，點擊「收藏景點」按鈕，即可將心儀景點收藏至此。已去過的景點可手動點擊刪除，或「向左滑動」直接手動移除！',
    swipeToDelete: '滑動刪除',
    swipeToDeleteHint: '👈 向左滑動可刪除',
    clearAllSpotsBtn: '一鍵刪除收藏景點',
    clearAllSpotsPromptTitle: '確定刪除所有收藏景點嗎？',
    clearAllSpotsPromptDesc: '此操作將會清空收藏夾中所有已收藏的景點，包含去過與未去過的景點。刪除後資料將無法復原，請再次確認。',
    clearAllSpotsCancel: '取消',
    clearAllSpotsConfirm: '確定刪除所有景點',
    clearAllSpotsEmptyTooltip: '目前無收藏景點',
    clearAllSpotsActionTooltip: '一鍵刪除收藏夾所有景點',
    visitedManagementTitle: '去過管理',
    visitedManagementHint: '點擊「已去過刪除」或在卡片上「向左滑動」即可手動刪除移除。',
    visitedDeleteBtn: '已去過刪除',
    visitedDeleteTooltip: '已去過的景點手動刪除',
    saveDayFullSet: '單日全套',
    plannedSpotsCount: '個規劃景點',
    navigationBtn: '導航',
    openSavedFullItinerary: '打開整套旅程',
    deleteBtn: '刪除',
    mapClickHint: '點選任一縣市地標即可直接查看地方特色與農漁牧產物',
    mapExplore22Cities: '全台22縣市地圖探索旅程',
    cityFeatureHint: '點擊查看地方特色、農產、觀光工廠與住宿',
    privacyNoticeHeader: '使用者個資隱私保護保證',
    privacyNoticeContent: '本 App 定位功能完全在您的瀏覽器端（本機端）運算，經緯度僅用於計算最近之遊玩縣市與在地地圖導覽，絕不上傳、儲存或傳送至任何遠端伺服器或第三方資料庫，請安心使用。',
    targetCityLabel: '目標',
    northRegion: '北部地區',
    centralRegion: '中部地區',
    southRegion: '南部地區',
    eastRegion: '東部地區',
    islandRegion: '離島地區（航班客輪直達）',
    islandNote: '離島',
    dayN: '第 {n} 天',
    lienchiangBoxTitle: '連江縣（馬祖列島）',
    kinmenBoxTitle: '金門縣（大金門・小金門）',
    penghuBoxTitle: '澎湖縣（群島）',
    pacificIslandsTitle: '綠島・蘭嶼（臺東外海離島）',
    liuqiuBoxTitle: '琉球嶼（小琉球・珊瑚礁島）',
    userLocationMarker: '📍 您的目前位置',
    stoppedCityPrompt: '🎲 幸運選定旅遊城市',
    stoppedCityClickDetail: '點擊開啟詳細介紹與客製行程 ➔',
    smartCustomTour: '智慧客製化旅程',
    transitGuideTitle: '從定位點前往【{city}】交通指引',
    departureLocLabel: '出發定位：',
    departureStraightDist: '（直線約 {dist} 公里）',
    notLocatedGuide: '尚未啟用定位，建議點選開啟以取得最精準出發地路線',
    instantStartNav: '即刻啟動出發導航',
    openCityInMaps: '在 Google Maps 查看此城市',
    localCultureTitle: '地方特色與文化背景',
    localProduceTitle: '在地特產與農漁畜產',
    agricultureLabel: '特色農產',
    fisheryLabel: '生猛漁產',
    livestockLabel: '優質畜牧',
    famousFoodLabel: '地方必嚐代表美食',
    highlightsTitle: '指標性代表景點',
    tourismFactoriesTitle: '合法立案觀光工廠',
    accommodationsTitle: '精選推薦優質住宿',
    viewMoreAccommodations: '查看更多精選住宿',
    collapseAccommodations: '收合更多推薦',
    collapseBanner: '收合',
    expandBanner: '展開',
    itineraryGeneratorTitle: '智慧客製化行程規劃',
    selectDaysLabel: '1. 選擇旅遊天數',
    daysUnit: '{n} 天',
    dayTourUnit: '{n} 日遊',
    selectStyleLabel: '2. 選擇旅遊風格',
    selectTransportLabel: '3. 選擇交通工具',
    keepSameHotelLabel: '全程入住同一家住宿飯店（不換房）',
    islandNightNoticeTitle: '離島晚間航班與船班特別指引',
    generateItineraryBtn: '🚀 開始規劃客製化行程',
    generatingItinerary: 'AI 智慧規劃中，正在精準排程...',
    itineraryOverview: '行程總覽',
    saveEntireItinerary: '全部收藏此行程',
    entireItinerarySaved: '已收藏整套旅程',
    saveThisDay: '收藏當天行程',
    thisDaySaved: '已收藏當日',
    saveThisSpot: '收藏景點',
    thisSpotSaved: '已收藏',
    recommendedDuration: '建議停留：',
    operatingHours: '營業時間：',
    transitToNext: '前往下一站交通：',
    routeNavigation: 'Google Maps 路線導航',
    dayReturnTitle: '當日返程路線指引',
    returnToOrigin: '返程終點：',
    feasibilityWarningTitle: '交通可行性提醒',
    toastSavedEntire: '🎉 已成功收藏整套旅程！',
    toastSavedDay: '🎉 已成功收藏當日行程！',
    toastSavedSpot: '🎉 已成功收藏此景點！',
    toastRemovedSaved: '已取消收藏',
    toastLimitReached: '⚠️ 已達收藏上限 20 筆！請先至我的收藏庫刪除部分項目。'
  },
  'en': {
    appName: 'Taiwan Fun Tour',
    appSubtitle: 'All 22 Counties & Cities • Agriculture, Seafood & Tourism Factories Guide',
    mapExplore: 'Taiwan 22 Cities Map Journey',
    howToUse: 'User Guide',
    viewGuide: 'User Guide',
    savedList: 'Saved',
    savedItineraries: 'Saved',
    locateMe: 'Locate Me',
    located: 'Located',
    locating: 'Locating...',
    openLocation: 'Locate Me',
    privacyBadge: 'Privacy Guarantee',
    viewMap: 'Explore All County Scenic Spots on Google Maps',
    disclaimer: 'AI Disclaimer',
    settings: 'Settings',
    selectCityDropdownPrompt: '🗺️ Select City or Outlying Island (Dropdown)',
    selectCity: 'Select City',
    allCities: 'All 22 Cities & Counties',
    randomCity: 'Pick a Random City',
    randomSelecting: 'Selecting...',
    randomSelectingCenter: 'Randomly Selecting a City in Taiwan',
    randomSelectingSubtitle: '⏱️ Picking the best travel destination for you...',
    departurePoint: 'Departure Point',
    recommendedRoute: '🚗 Recommended Route: Accessible via High Speed Rail, Taiwan Railways, or Highway driving.',
    launchNavigation: 'Start Navigation Now',
    exploreItinerary: 'Explore Custom Itinerary',
    themeTitle: 'Travel Theme & Context',
    transportTitle: 'Transportation Mode',
    themeLeisure: 'Leisure & Family',
    themeCulture: 'Culture & Heritage',
    themeOutdoor: 'Nature & Outdoor',
    themeGourmet: 'Local Gourmet',
    disclaimerModalTitle: 'AI-Generated Content Disclaimer',
    disclaimerModalSubtitle: 'Important Travel Notice & Safety Guidelines',
    disclaimerText1: 'All travel itineraries, suggested spots, tourism factories, timelines, and transit estimates in "Taiwan Fun Tour" are algorithmically planned by AI language models for recreational reference only.',
    disclaimerText2: 'Opening hours, holidays, admission fees, and road conditions may vary due to weather, public holidays, or operational policies. Always check live official details on Google Maps or with merchants before departing.',
    disclaimerText3: 'In case of severe rain, typhoons, road repairs, or other force majeure events, prioritize your personal safety and current local conditions above all else.',
    understandBtn: 'I Understand',
    locationRequestTitle: 'Geographic location access request',
    locationRequestSubtitle: 'Provides nearby cities exploration and smart routing',
    locationRequestMessage: 'This app requests access to Geographic location to work properly. Do you want to allow Geographic location access?',
    locationRequestPrivacy: 'Privacy Guarantee: Your coordinates are processed entirely inside your local browser and never uploaded to any remote server.',
    disallowBtn: 'Disallow',
    allowLocationBtn: 'Allow Geographic location access',
    agreeAndLocateBtn: 'Agree & Enable Location',
    agreeOnlyBtn: 'Not Now (Agree Disclaimer Only)',
    guideModalTitle: 'Taiwan Fun Tour • Complete User Guide',
    guideModalSubtitle: 'Discover the best itineraries across Taiwan anytime, anywhere',
    guideTopHint: 'You can reopen this guide anytime from the top-right Settings menu',
    languageSelect: 'Language',
    languageSelectSubtitle: 'Default is Traditional Chinese. Switch between English and Japanese anytime.',
    langZhTW: '繁體中文',
    langEn: 'English',
    langJa: '日本語',
    close: 'Close',
    settingsTitle: 'Settings & User Guide',
    settingsSubtitle: 'Language Switcher • AI Disclaimer • Complete User Guide',
    settingsDone: 'Done',
    userGuideSectionTitle: 'Taiwan Fun Tour • Complete User Guide',
    guideBadgeText: 'Guide',
    disclaimerBadgeText: 'Notice',
    openFullDisclaimer: 'Open Full Disclaimer Modal',
    openFullGuide: 'Open Complete User Guide',
    savedModalTitle: 'Saved Itineraries & Spots Library',
    savedLimitTotal: 'Total',
    savedLimitReached: 'Limit Reached',
    savedLimitMax: 'Storage Limit: 20 Items',
    savedUsed: 'Used',
    tabFullItinerary: 'All Itineraries',
    tabDayItinerary: 'Single Day Plans',
    tabSingleSpot: 'Single Spots',
    emptyFullTitle: 'No Full Itineraries Saved Yet',
    emptyFullDesc: 'After picking a city and generating a route, click "Save Entire Itinerary" on the overview card to store multi-day journeys!',
    emptyDayTitle: 'No Day Itineraries Saved Yet',
    emptyDayDesc: 'In the daily schedule cards, click "Save Day" next to any day header to store that specific full day route!',
    emptySpotTitle: 'No Saved Spots Yet',
    emptySpotDesc: 'On any attraction card, click "Save Spot" to bookmark it here. Swipe left on any card to delete it quickly!',
    swipeToDelete: 'Swipe Delete',
    swipeToDeleteHint: '👈 Swipe left to delete',
    clearAllSpotsBtn: 'Clear All Saved Spots',
    clearAllSpotsPromptTitle: 'Clear all saved spots?',
    clearAllSpotsPromptDesc: 'This will delete all saved spots from your bookmark list. This action cannot be undone. Please confirm.',
    clearAllSpotsCancel: 'Cancel',
    clearAllSpotsConfirm: 'Yes, Clear All Spots',
    clearAllSpotsEmptyTooltip: 'No spots saved currently',
    clearAllSpotsActionTooltip: 'Clear all spots in your bookmark library',
    visitedManagementTitle: 'Visited Management',
    visitedManagementHint: 'Click "Delete Visited" or swipe left on the card to remove visited spots.',
    visitedDeleteBtn: 'Delete Visited',
    visitedDeleteTooltip: 'Manually delete visited spots',
    saveDayFullSet: 'Day Set',
    plannedSpotsCount: 'planned spots',
    navigationBtn: 'Navigate',
    openSavedFullItinerary: 'Open Full Itinerary',
    deleteBtn: 'Delete',
    mapClickHint: 'Click any city pin to view local specialties and produce',
    mapExplore22Cities: 'Taiwan 22 Cities Map Journey',
    cityFeatureHint: 'Click to explore local highlights, produce, factories, and hotels',
    privacyNoticeHeader: 'User Privacy & Data Protection Guarantee',
    privacyNoticeContent: 'Geolocation is computed entirely inside your browser locally. Coordinates are only used for nearby city discovery and are never uploaded to any remote server.',
    targetCityLabel: 'Target',
    northRegion: 'Northern Region',
    centralRegion: 'Central Region',
    southRegion: 'Southern Region',
    eastRegion: 'Eastern Region',
    islandRegion: 'Outlying Islands (Direct Flights/Ferries)',
    islandNote: 'Islands',
    dayN: 'Day {n}',
    lienchiangBoxTitle: 'Lienchiang County (Matsu Islands)',
    kinmenBoxTitle: 'Kinmen County (Greater & Lesser Kinmen)',
    penghuBoxTitle: 'Penghu Archipelago',
    pacificIslandsTitle: 'Green Island & Orchid Island (Taitung)',
    liuqiuBoxTitle: 'Xiaoliuqiu (Coral Reef Island)',
    userLocationMarker: '📍 Your Current Location',
    stoppedCityPrompt: '🎲 Selected Destination',
    stoppedCityClickDetail: 'Click to view details & customize trip ➔',
    smartCustomTour: 'Smart Custom Tour',
    transitGuideTitle: 'Transit Guide from Origin to 【{city}】',
    departureLocLabel: 'Departure: ',
    departureStraightDist: ' (Approx. {dist} km straight)',
    notLocatedGuide: 'Location not enabled. Turn on location for optimal route calculation.',
    instantStartNav: 'Start Navigation Now',
    openCityInMaps: 'View City on Google Maps',
    localCultureTitle: 'Local Culture & Heritage',
    localProduceTitle: 'Local Agriculture, Marine & Livestock Produce',
    agricultureLabel: 'Agriculture',
    fisheryLabel: 'Marine & Seafood',
    livestockLabel: 'Livestock',
    famousFoodLabel: 'Iconic Local Delicacies',
    highlightsTitle: 'Signature Attractions',
    tourismFactoriesTitle: 'Certified Tourism Factories',
    accommodationsTitle: 'Recommended Accommodations',
    viewMoreAccommodations: 'View More Accommodations',
    collapseAccommodations: 'Collapse',
    collapseBanner: 'Collapse',
    expandBanner: 'Expand',
    itineraryGeneratorTitle: 'Smart Custom Itinerary Planner',
    selectDaysLabel: '1. Select Trip Duration',
    daysUnit: '{n} Days',
    dayTourUnit: '{n}-Day Tour',
    selectStyleLabel: '2. Select Travel Style',
    selectTransportLabel: '3. Select Transport Mode',
    keepSameHotelLabel: 'Stay at the same accommodation throughout',
    islandNightNoticeTitle: 'Island Night Flight & Ferry Schedule Notice',
    generateItineraryBtn: '🚀 Generate Custom Itinerary',
    generatingItinerary: 'AI is planning your schedule with accurate operating hours...',
    itineraryOverview: 'Trip Overview',
    saveEntireItinerary: 'Save Entire Itinerary',
    entireItinerarySaved: 'Entire Itinerary Saved',
    saveThisDay: 'Save Day Itinerary',
    thisDaySaved: 'Day Saved',
    saveThisSpot: 'Save Spot',
    thisSpotSaved: 'Saved',
    recommendedDuration: 'Suggested Duration: ',
    operatingHours: 'Operating Hours: ',
    transitToNext: 'Transit to Next: ',
    routeNavigation: 'Google Maps Navigation',
    dayReturnTitle: 'End-of-Day Return Route',
    returnToOrigin: 'Destination: ',
    feasibilityWarningTitle: 'Transit Feasibility Notice',
    toastSavedEntire: '🎉 Successfully saved entire itinerary!',
    toastSavedDay: '🎉 Successfully saved day itinerary!',
    toastSavedSpot: '🎉 Successfully saved spot to favorites!',
    toastRemovedSaved: 'Removed from saved items',
    toastLimitReached: '⚠️ Storage limit of 20 items reached! Please delete some items first.'
  },
  'ja': {
    appName: '台湾まるごと旅',
    appSubtitle: '全22県市・特産品と公認観光工場スマートガイド',
    mapExplore: '台湾全22県市マップ探訪',
    howToUse: '完全利用ガイドを見る',
    viewGuide: '利用ガイドを見る',
    savedList: 'お気に入り',
    savedItineraries: 'お気に入り',
    locateMe: '現在地を取得',
    located: '位置取得完了',
    locating: '位置取得中...',
    openLocation: '現在地を取得',
    privacyBadge: 'プライバシー保護宣言',
    viewMap: 'Googleマップで全県市の広域観光地を探索',
    disclaimer: 'AI 免責事項',
    settings: '設定',
    selectCityDropdownPrompt: '🗺️ 観光する県市・離島を選択（一覧）',
    selectCity: '観光する県市を選択',
    allCities: '台湾全22県市一覧',
    randomCity: 'ランダムで都市を決める',
    randomSelecting: '選定中...',
    randomSelectingCenter: '台湾全土からランダム抽選中',
    randomSelectingSubtitle: '⏱️ あなたにぴったりの旅行先を選んでいます...',
    departurePoint: '出発地',
    recommendedRoute: '🚗 おすすめルート：台湾新幹線、台湾鉄道、または高速道路レンタカーでスムーズにアクセス可能です。',
    launchNavigation: '今すぐナビを開始',
    exploreItinerary: 'カスタム旅程を探索',
    themeTitle: 'テーマ分類とシチュエーション',
    transportTitle: '移動手段の選択',
    themeLeisure: 'レジャー・ファミリー',
    themeCulture: '文化・歴史散策',
    themeOutdoor: '自然・アウトドア',
    themeGourmet: 'ご当地グルメ巡り',
    disclaimerModalTitle: 'AI生成コンテンツに関する免責事項',
    disclaimerModalSubtitle: '台湾まるごと旅 ご利用上の注意と安全確認',
    disclaimerText1: '本アプリ「台湾まるごと旅」が提供するすべての旅程、おすすめスポット、観光工場、所要時間および移動手段の目安は、AI言語モデルによって自動設計されたものであり、観光の参考情報として提供されています。',
    disclaimerText2: '施設の営業時間、定休日、入場料金、道路交通状況は天候や祝日、現地の運営方針により変更される場合があります。出発前にGoogle Mapsのリンクまたは公式情報で最新情報をご確認ください。',
    disclaimerText3: '悪天候、台風、道路工事などの不可抗力が発生した場合は、現地の状況とご自身の安全を最優先に行動してください。',
    understandBtn: '了解しました',
    locationRequestTitle: '位置情報の利用許可リクエスト',
    locationRequestSubtitle: '現在地周辺の県市探索と最適な観光ルートをご案内',
    locationRequestMessage: '当アプリでは最適な案内および最寄り都市の案內のため、位置情報へのアクセスをリクエストしています。位置情報の利用を許可しますか？',
    locationRequestPrivacy: 'プライバシー保護：位置情報はお使いのブラウザ内でのみ安全に処理され、外部サーバーに保存されることはありません。',
    disallowBtn: '許可しない',
    allowLocationBtn: '位置情報のアクセスを許可',
    agreeAndLocateBtn: '同意して位置情報を有効化',
    agreeOnlyBtn: '今は利用しない（免責事項のみ同意）',
    guideModalTitle: '台湾まるごと旅・アプリ完全利用ガイド',
    guideModalSubtitle: '台湾全22県市の魅力的な観光プランをいつでも満喫',
    guideTopHint: '画面右上の「設定」メニューからいつでもこのガイドを再表示できます',
    languageSelect: '言語',
    languageSelectSubtitle: 'デフォルトは繁体中文です。英語・日本語へ瞬時に切り替え可能です。',
    langZhTW: '繁體中文',
    langEn: 'English',
    langJa: '日本語',
    close: '閉じる',
    settingsTitle: 'システム設定と利用案内',
    settingsSubtitle: '言語切替 • AI免責事項 • 完全図解利用ガイド',
    settingsDone: '設定完了',
    userGuideSectionTitle: '台湾まるごと旅・アプリ完全利用ガイド',
    guideBadgeText: '利用ガイド',
    disclaimerBadgeText: '免責事項',
    openFullDisclaimer: '免責事項の全文を開く',
    openFullGuide: '完全図解利用ガイドを開く',
    savedModalTitle: '旅程とお気に入りの保存ライブラリ',
    savedLimitTotal: '合計',
    savedLimitReached: '上限到達',
    savedLimitMax: '保存上限：最大20件',
    savedUsed: '使用済み',
    tabFullItinerary: '全日程の旅程',
    tabDayItinerary: '日別プラン',
    tabSingleSpot: 'スポット単体',
    emptyFullTitle: '保存された全日程の旅程はありません',
    emptyFullDesc: '都市を選択してプランを作成後、概要カードの「この旅程をまるごと保存」を押すと全日程が保存されます！',
    emptyDayTitle: '保存された日別プランはありません',
    emptyDayDesc: '作成された日程カードで、各日のタイトル横にある「この日の予定を保存」を押すと1日分のルートが保存されます！',
    emptySpotTitle: '保存されたスポットはありません',
    emptySpotDesc: '観光スポットカードの「スポット保存」を押すとブックマークできます。左スワイプで即座に削除も可能です！',
    swipeToDelete: 'スワイプ削除',
    swipeToDeleteHint: '👈 左スワイプで削除可能',
    clearAllSpotsBtn: '保存スポットを一括削除',
    clearAllSpotsPromptTitle: 'すべての保存スポットを削除しますか？',
    clearAllSpotsPromptDesc: 'この操作を行うとお気に入りのスポットがすべて削除されます。削除したデータは復元できません。',
    clearAllSpotsCancel: 'キャンセル',
    clearAllSpotsConfirm: 'すべて削除する',
    clearAllSpotsEmptyTooltip: '現在保存されているスポットはありません',
    clearAllSpotsActionTooltip: '保存されているすべてのスポットを一括消去',
    visitedManagementTitle: '訪問済み管理',
    visitedManagementHint: '「訪問済み削除」またはカードを「左にスワイプ」して手動で削除できます。',
    visitedDeleteBtn: '訪問済み削除',
    visitedDeleteTooltip: '訪問済みスポットを手動で削除',
    saveDayFullSet: '1日セット',
    plannedSpotsCount: '件のスポット',
    navigationBtn: 'ナビ開始',
    openSavedFullItinerary: '旅程全体を開く',
    deleteBtn: '削除',
    mapClickHint: '地図上の都市ピンをタップすると特産品や観光地をすぐ確認できます',
    mapExplore22Cities: '台湾全22県市マップ探訪',
    cityFeatureHint: 'タップして名所、農産品、観光工場、ホテルを確認',
    privacyNoticeHeader: 'プライバシーと個人情報保護のお約束',
    privacyNoticeContent: '本アプリの位置情報機能はお使いのブラウザ（端末内）でのみ安全に計算されます。最寄りの県市探索とナビにのみ使用され、外部サーバーや第三者データベースへ送信されることは一切ありません。',
    targetCityLabel: '目的地',
    northRegion: '北部エリア',
    centralRegion: '中部エリア',
    southRegion: '南部エリア',
    eastRegion: '東部エリア',
    islandRegion: '離島エリア（直行便・高速船）',
    islandNote: '離島',
    dayN: '{n}日目',
    lienchiangBoxTitle: '連江県（馬祖列島）',
    kinmenBoxTitle: '金門県（大金門・小金門）',
    penghuBoxTitle: '澎湖県（諸島）',
    pacificIslandsTitle: '緑島・蘭嶼（台東沖離島）',
    liuqiuBoxTitle: '小琉球（サンゴ礁の島）',
    userLocationMarker: '📍 あなたの現在地',
    stoppedCityPrompt: '🎲 おすすめの観光地が決定！',
    stoppedCityClickDetail: 'タップして詳細と旅行プランを見る ➔',
    smartCustomTour: 'スマート観光プラン',
    transitGuideTitle: '現在地から【{city}】へのアクセス指引',
    departureLocLabel: '出発地：',
    departureStraightDist: '（直線距離 約{dist} km）',
    notLocatedGuide: '位置情報がオフです。オンにすると最適な出発ルートが表示されます。',
    instantStartNav: '今すぐナビを開始',
    openCityInMaps: 'Google Mapsで都市を見る',
    localCultureTitle: '地域の特色と歴史文化',
    localProduceTitle: 'ご当地の特産品（農水産・畜産）',
    agricultureLabel: '特色農産品',
    fisheryLabel: '新鮮水産品',
    livestockLabel: '優良畜産',
    famousFoodLabel: 'ご当地代表グルメ',
    highlightsTitle: '代表的な人気観光スポット',
    tourismFactoriesTitle: '公認・体験型観光工場',
    accommodationsTitle: '厳選おすすめ宿泊施設',
    viewMoreAccommodations: '宿泊施設をもっと見る',
    collapseAccommodations: '閉じる',
    collapseBanner: '折りたたむ',
    expandBanner: '展開',
    itineraryGeneratorTitle: 'スマート旅程プラン作成',
    selectDaysLabel: '1. 旅行日数を選択',
    daysUnit: '{n} 日間',
    dayTourUnit: '{n} 日間ツアー',
    selectStyleLabel: '2. 旅行スタイルを選択',
    selectTransportLabel: '3. 移動手段を選択',
    keepSameHotelLabel: '全日程同じ宿泊先に連泊（部屋移動なし）',
    islandNightNoticeTitle: '離島の夜間フライト・最終船便特別案内',
    generateItineraryBtn: '🚀 カスタム旅程を作成する',
    generatingItinerary: 'AIが営業時間に合わせて最適な旅程を作成中...',
    itineraryOverview: '旅程の概要',
    saveEntireItinerary: 'この旅程をまるごと保存',
    entireItinerarySaved: '旅程保存済み',
    saveThisDay: 'この日の予定を保存',
    thisDaySaved: '保存済み',
    saveThisSpot: 'スポット保存',
    thisSpotSaved: '保存済み',
    recommendedDuration: 'おすすめ滞在時間：',
    operatingHours: '営業時間：',
    transitToNext: '次のスポットへ：',
    routeNavigation: 'Google Maps ルート案内',
    dayReturnTitle: '当日の帰着ルート案内',
    returnToOrigin: '帰着先：',
    feasibilityWarningTitle: '移動時間・所要時間の注意点',
    toastSavedEntire: '🎉 旅程全体をお気に入りに保存しました！',
    toastSavedDay: '🎉 当日の旅程を保存しました！',
    toastSavedSpot: '🎉 スポットをお気に入りに保存しました！',
    toastRemovedSaved: 'お気に入りから削除しました',
    toastLimitReached: '⚠️ 保存上限（最大20件）に達しました。不要な項目を先に削除してください。'
  }
};
