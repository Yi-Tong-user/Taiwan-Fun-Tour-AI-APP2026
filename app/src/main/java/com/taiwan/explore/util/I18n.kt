package com.taiwan.explore.util

import android.content.Context
import android.content.SharedPreferences

enum class AppLanguage(val code: String, val label: String, val flag: String) {
    ZH_TW("zh-TW", "繁體中文", "🇹🇼"),
    EN("en", "English", "🇺🇸"),
    JA("ja", "日本語", "🇯🇵");

    companion object {
        fun fromCode(code: String): AppLanguage {
            return entries.find { it.code == code } ?: ZH_TW
        }
    }
}

object I18nManager {
    private const val PREFS_NAME = "taiwan_explore_prefs"
    private const val KEY_LANG = "selected_language"

    fun getSavedLanguage(context: Context): AppLanguage {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val code = prefs.getString(KEY_LANG, AppLanguage.ZH_TW.code) ?: AppLanguage.ZH_TW.code
        return AppLanguage.fromCode(code)
    }

    fun saveLanguage(context: Context, lang: AppLanguage) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_LANG, lang.code).apply()
    }
}

data class Strings(
    val appName: String,
    val appSubtitle: String,
    val tabDiscover: String,
    val tabRecommend: String,
    val tabAITour: String,
    val tabSaved: String,
    val tabSettings: String,

    // Regions
    val regionAll: String,
    val regionNorth: String,
    val regionCentral: String,
    val regionSouth: String,
    val regionEast: String,
    val regionIslands: String,

    // Discover & Map
    val randomCityBtn: String,
    val randomSelecting: String,
    val exploreCities: String,
    val agriculturalProduce: String,
    val fisheryProduce: String,
    val livestockProduce: String,
    val searchCityPlaceholder: String,

    // Recommendations
    val highlightsTitle: String,
    val tourismFactoriesTitle: String,
    val accommodationsTitle: String,
    val openNavigation: String,
    val saveSpot: String,
    val savedSpot: String,
    val priceRange: String,

    // AI Tour
    val aiTourTitle: String,
    val aiTourSubtitle: String,
    val selectCity: String,
    val planDays: String,
    val travelStyle: String,
    val transportMethod: String,
    val stayPreference: String,
    val specialRequests: String,
    val specialRequestsHint: String,
    val generateBtn: String,
    val regenerateBtn: String,
    val generatingPlan: String,
    val generatingPlanSub: String,
    val saveFullItinerary: String,
    val savedFullItinerary: String,
    val saveDayItinerary: String,
    val savedDayItinerary: String,
    val dayN: String,
    val stayHotel: String,

    // Saved
    val savedTitle: String,
    val tabFullItinerary: String,
    val tabDayItinerary: String,
    val tabSingleSpot: String,
    val emptySavedFull: String,
    val emptySavedDay: String,
    val emptySavedSpot: String,
    val deleteItem: String,
    val clearAllSpots: String,
    val clearAllConfirm: String,

    // Settings & Modals
    val settingsTitle: String,
    val languageSection: String,
    val disclaimerSection: String,
    val guideSection: String,
    val openFullDisclaimer: String,
    val openFullGuide: String,
    val locationRequestTitle: String,
    val locationRequestMessage: String,
    val locationRequestPrivacy: String,
    val allowLocationBtn: String,
    val disallowBtn: String,
    val disclaimerTitle: String,
    val disclaimerSubtitle: String,
    val disclaimerText1: String,
    val disclaimerText2: String,
    val understandBtn: String,
    val guideTitle: String,
    val close: String
)

val zhTwStrings = Strings(
    appName = "臺灣好好玩",
    appSubtitle = "探索臺灣 22 縣市・農漁牧特產・AI 行程規劃",
    tabDiscover = "發現",
    tabRecommend = "推薦",
    tabAITour = "AI智慧旅程",
    tabSaved = "收藏",
    tabSettings = "設定",

    regionAll = "全部",
    regionNorth = "北部",
    regionCentral = "中部",
    regionSouth = "南部",
    regionEast = "東部",
    regionIslands = "離島",

    randomCityBtn = "隨機出發一座城市",
    randomSelecting = "正在為您挑選城市...",
    exploreCities = "探索縣市清單",
    agriculturalProduce = "農產特產",
    fisheryProduce = "漁業水產",
    livestockProduce = "畜牧特產",
    searchCityPlaceholder = "搜尋縣市或特產...",

    highlightsTitle = "必遊景點",
    tourismFactoriesTitle = "觀光工廠",
    accommodationsTitle = "住宿推薦",
    openNavigation = "導航路線",
    saveSpot = "收藏景點",
    savedSpot = "已收藏",
    priceRange = "價格參考",

    aiTourTitle = "Gemini AI 智能行程規劃",
    aiTourSubtitle = "針對各縣市在地特色、農漁牧產與順向動線，客製專屬行程與住宿規劃。",
    selectCity = "遊玩縣市",
    planDays = "規劃天數",
    travelStyle = "旅遊風格",
    transportMethod = "交通方式",
    stayPreference = "住宿偏好",
    specialRequests = "特殊需求",
    specialRequestsHint = "如：帶長輩小孩、需室內避雨吹冷氣、蔬食素食等",
    generateBtn = "立即產生行程規劃",
    regenerateBtn = "再次生成",
    generatingPlan = "Gemini 正在智慧規劃行程...",
    generatingPlanSub = "分析在地特色、順向動線與推薦住宿中",
    saveFullItinerary = "收藏整套旅程",
    savedFullItinerary = "已收藏整套",
    saveDayItinerary = "收藏此日行程",
    savedDayItinerary = "已收藏單日",
    dayN = "第 %d 天",
    stayHotel = "推薦住宿",

    savedTitle = "我的收藏",
    tabFullItinerary = "全旅程",
    tabDayItinerary = "單日旅程",
    tabSingleSpot = "景點收藏",
    emptySavedFull = "目前尚無收藏的完整旅程",
    emptySavedDay = "目前尚無收藏的單日旅程",
    emptySavedSpot = "目前尚無收藏的景點",
    deleteItem = "刪除",
    clearAllSpots = "清空所有景點",
    clearAllConfirm = "確定清空所有收藏的景點嗎？",

    settingsTitle = "應用程式設定",
    languageSection = "介面語言切換",
    disclaimerSection = "AI 智慧生成免責聲明",
    guideSection = "臺灣好好玩・使用說明指南",
    openFullDisclaimer = "查看完整免責聲明",
    openFullGuide = "查看完整使用指南",
    locationRequestTitle = "定位服務說明與請求",
    locationRequestMessage = "本應用程式希望能取得您的目前位置，以便為您計算離您最近的臺灣縣市，並規劃最順暢的交通出發路線。",
    locationRequestPrivacy = "您的地理位置僅在手機本機運算，絕不會上傳或儲存至任何遠端伺服器，請安心使用。",
    allowLocationBtn = "允許開啟定位",
    disallowBtn = "暫不開啟",
    disclaimerTitle = "AI 智慧生成內容免責聲明",
    disclaimerSubtitle = "AI Generated Content Disclaimer",
    disclaimerText1 = "本應用程式的行程規劃、交通建議與景點介紹由 Google Gemini 人工智慧模型即時運算生成。景點營業時間、門票價格、大眾運輸班次及路況等資訊可能隨時調整。",
    disclaimerText2 = "出發前請務必透過官方網站或 Google Maps 再次核對店家與景點之最新營業狀態，以確保行程順利。",
    understandBtn = "我已瞭解並同意",
    guideTitle = "臺灣好好玩・使用說明",
    close = "關閉"
)

val enStrings = Strings(
    appName = "Taiwan Fun Tour",
    appSubtitle = "Explore 22 Taiwan Cities・Local Specialties・AI Tour Planner",
    tabDiscover = "Discover",
    tabRecommend = "Recommend",
    tabAITour = "AI Tour",
    tabSaved = "Saved",
    tabSettings = "Settings",

    regionAll = "All",
    regionNorth = "North",
    regionCentral = "Central",
    regionSouth = "South",
    regionEast = "East",
    regionIslands = "Islands",

    randomCityBtn = "Random City Adventure",
    randomSelecting = "Picking a city for you...",
    exploreCities = "Taiwan Cities & Counties",
    agriculturalProduce = "Agriculture",
    fisheryProduce = "Fishery",
    livestockProduce = "Livestock",
    searchCityPlaceholder = "Search city or specialty...",

    highlightsTitle = "Must-Visit Highlights",
    tourismFactoriesTitle = "Tourism Factories",
    accommodationsTitle = "Recommended Stays",
    openNavigation = "Navigate",
    saveSpot = "Save Spot",
    savedSpot = "Saved",
    priceRange = "Price Guide",

    aiTourTitle = "Gemini AI Smart Itinerary Planner",
    aiTourSubtitle = "Customized travel schedules based on local specialties, geography, and smooth routes.",
    selectCity = "Destination City",
    planDays = "Duration",
    travelStyle = "Travel Style",
    transportMethod = "Transportation",
    stayPreference = "Accommodation Preference",
    specialRequests = "Special Requests",
    specialRequestsHint = "e.g., family-friendly, indoor/air-conditioned, vegetarian dining",
    generateBtn = "Generate Itinerary Now",
    regenerateBtn = "Regenerate",
    generatingPlan = "Gemini is designing your tour...",
    generatingPlanSub = "Analyzing local attractions, routes, and hotels",
    saveFullItinerary = "Save Full Trip",
    savedFullItinerary = "Trip Saved",
    saveDayItinerary = "Save This Day",
    savedDayItinerary = "Day Saved",
    dayN = "Day %d",
    stayHotel = "Recommended Stay",

    savedTitle = "My Saved Collections",
    tabFullItinerary = "Full Trips",
    tabDayItinerary = "Day Trips",
    tabSingleSpot = "Spots",
    emptySavedFull = "No saved full trips yet",
    emptySavedDay = "No saved day itineraries yet",
    emptySavedSpot = "No saved spots yet",
    deleteItem = "Delete",
    clearAllSpots = "Clear All Spots",
    clearAllConfirm = "Are you sure you want to clear all saved spots?",

    settingsTitle = "Application Settings",
    languageSection = "Language Selection",
    disclaimerSection = "AI Generation Disclaimer",
    guideSection = "User Guide & Help",
    openFullDisclaimer = "View Full Disclaimer",
    openFullGuide = "View User Guide",
    locationRequestTitle = "Location Permission & Guide",
    locationRequestMessage = "This app requests your device location to compute the nearest Taiwan city and suggest optimal departure transit routes.",
    locationRequestPrivacy = "Your location is processed solely on your device and is never uploaded or saved to remote servers.",
    allowLocationBtn = "Enable Location",
    disallowBtn = "Not Now",
    disclaimerTitle = "AI Content Disclaimer",
    disclaimerSubtitle = "AI Generated Content Disclaimer",
    disclaimerText1 = "Itineraries, transit suggestions, and attraction details are generated by Google Gemini AI. Operating hours, ticket prices, transit schedules, and road conditions may vary.",
    disclaimerText2 = "Please verify opening hours with official websites or Google Maps before your trip to ensure a seamless experience.",
    understandBtn = "I Understand & Agree",
    guideTitle = "Taiwan Fun Tour User Guide",
    close = "Close"
)

val jaStrings = Strings(
    appName = "台湾満喫ツアー",
    appSubtitle = "台湾22県市・特産品・AIスマート旅行プランナー",
    tabDiscover = "発見",
    tabRecommend = "おすすめ",
    tabAITour = "AI旅程",
    tabSaved = "お気に入り",
    tabSettings = "設定",

    regionAll = "すべて",
    regionNorth = "北部",
    regionCentral = "中部",
    regionSouth = "南部",
    regionEast = "東部",
    regionIslands = "離島",

    randomCityBtn = "ランダムで街へ出発",
    randomSelecting = "旅先を選んでいます...",
    exploreCities = "台湾県市一覧",
    agriculturalProduce = "農産物",
    fisheryProduce = "水産物",
    livestockProduce = "畜産物",
    searchCityPlaceholder = "県市や特産を検索...",

    highlightsTitle = "必見スポット",
    tourismFactoriesTitle = "観光工場",
    accommodationsTitle = "おすすめ宿泊施設",
    openNavigation = "ルート案内",
    saveSpot = "スポット保存",
    savedSpot = "保存済み",
    priceRange = "料金目安",

    aiTourTitle = "Gemini AI 旅程プランナー",
    aiTourSubtitle = "特産品や名所、効率的なルートを考慮したカスタム旅程と宿泊プラン。",
    selectCity = "旅行先県市",
    planDays = "旅行日数",
    travelStyle = "旅行スタイル",
    transportMethod = "移動手段",
    stayPreference = "宿泊の好み",
    specialRequests = "特別なご要望",
    specialRequestsHint = "例：子供・高齢者向け、雨天・室内希望、ベジタリアンなど",
    generateBtn = "旅程を作成する",
    regenerateBtn = "再生成",
    generatingPlan = "Gemini が旅程を設計中...",
    generatingPlanSub = "観光地、移動ルート、ホテルを分析しています",
    saveFullItinerary = "旅程全体を保存",
    savedFullItinerary = "保存完了",
    saveDayItinerary = "この日を保存",
    savedDayItinerary = "保存完了",
    dayN = "%d日目",
    stayHotel = "おすすめホテル",

    savedTitle = "保存したコレクション",
    tabFullItinerary = "全旅程",
    tabDayItinerary = "日別旅程",
    tabSingleSpot = "スポット",
    emptySavedFull = "保存された全旅程はありません",
    emptySavedDay = "保存された日別旅程はありません",
    emptySavedSpot = "保存されたスポットはありません",
    deleteItem = "削除",
    clearAllSpots = "スポットをすべて削除",
    clearAllConfirm = "保存したスポットをすべて削除してもよろしいですか？",

    settingsTitle = "アプリ設定",
    languageSection = "言語切り替え",
    disclaimerSection = "AI生成コンテンツ免責事項",
    guideSection = "ご利用ガイド",
    openFullDisclaimer = "免責事項の詳細を見る",
    openFullGuide = "ご利用ガイドを見る",
    locationRequestTitle = "位置情報の利用説明",
    locationRequestMessage = "最寄りの県市を算出し最適な出発ルートをご提案するため、位置情報の利用を求めています。",
    locationRequestPrivacy = "位置情報は端末内でのみ計算され、外部サーバーへ送信・保存されることはありません。",
    allowLocationBtn = "位置情報を許可",
    disallowBtn = "今は許可しない",
    disclaimerTitle = "AI生成コンテンツの免責事項",
    disclaimerSubtitle = "AI Generated Content Disclaimer",
    disclaimerText1 = "本アプリの旅程・交通・観光地情報は Google Gemini AI により生成されています。営業時間や運賃、交通ダイヤは変更される場合があります。",
    disclaimerText2 = "ご出発前に公式サイトまたは Google マップで最新の営業状況をご確認ください。",
    understandBtn = "同意して利用する",
    guideTitle = "ご利用ガイド",
    close = "閉じる"
)

fun getStrings(lang: AppLanguage): Strings {
    return when (lang) {
        AppLanguage.ZH_TW -> zhTwStrings
        AppLanguage.EN -> enStrings
        AppLanguage.JA -> jaStrings
    }
}

fun getLocalizedCityName(name: String, lang: AppLanguage): String {
    if (lang == AppLanguage.ZH_TW) return name
    val enMap = mapOf(
        "臺北市" to "Taipei City",
        "新北市" to "New Taipei City",
        "基隆市" to "Keelung City",
        "宜蘭縣" to "Yilan County",
        "臺中市" to "Taichung City",
        "臺南市" to "Tainan City",
        "高雄市" to "Kaohsiung City",
        "花蓮縣" to "Hualien County",
        "臺東縣" to "Taitung County",
        "桃園市" to "Taoyuan City",
        "新竹市" to "Hsinchu City",
        "新竹縣" to "Hsinchu County",
        "苗栗縣" to "Miaoli County",
        "彰化縣" to "Changhua County",
        "南投縣" to "Nantou County",
        "雲林縣" to "Yunlin County",
        "嘉義市" to "Chiayi City",
        "嘉義縣" to "Chiayi County",
        "屏東縣" to "Pingtung County",
        "澎湖縣" to "Penghu County",
        "金門縣" to "Kinmen County",
        "連江縣（馬祖）" to "Lienchiang County (Matsu)"
    )
    val jaMap = mapOf(
        "臺北市" to "台北市",
        "新北市" to "新北市",
        "基隆市" to "基隆市",
        "宜蘭縣" to "宜蘭県",
        "臺中市" to "台中市",
        "臺南市" to "台南市",
        "高雄市" to "高雄市",
        "花蓮縣" to "花蓮県",
        "臺東縣" to "台東県",
        "桃園市" to "桃園市",
        "新竹市" to "新竹市",
        "新竹縣" to "新竹県",
        "苗栗縣" to "苗栗県",
        "彰化縣" to "彰化県",
        "南投縣" to "南投県",
        "雲林縣" to "雲林県",
        "嘉義市" to "嘉義市",
        "嘉義縣" to "嘉義県",
        "屏東縣" to "屏東県",
        "澎湖縣" to "澎湖県",
        "金門縣" to "金門県",
        "連江縣（馬祖）" to "連江県（馬祖）"
    )
    return when (lang) {
        AppLanguage.EN -> enMap[name] ?: name
        AppLanguage.JA -> jaMap[name] ?: name
        else -> name
    }
}
