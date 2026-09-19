import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CitySpecialty, AIItineraryResponse, ItineraryDay, ItinerarySpot } from '../types';
import { getTransitGuide, TransitRecommendation } from '../utils/transitGuide';
import {
  saveItinerary,
  removeSavedItinerary,
  findSavedItineraryId,
  saveDayItinerary,
  removeSavedDayItinerary,
  findSavedDayId,
  saveSpotItem,
  removeSavedSpotItem,
  findSavedSpotId,
  getSavedSpots,
  getTotalSavedCount,
  MAX_SAVED_LIMIT,
  SAVED_ITINERARIES_EVENT
} from '../utils/savedItineraries';
import { TransitIcon } from './TransitIcon';
import { SupportedLanguage, translations } from '../utils/i18n';
import {
  getLocalizedCity,
  getLocalizedCityName,
  getLocalizedTheme,
  getLocalizedTransport,
  getLocalizedItinerary
} from '../utils/cityLocalization';
import { generateCuratedFallback, enrichItineraryWithRealTransit } from '../utils/itineraryPlanner';
import { getTieredAccommodation, findHotelDetails, findTieredHotelObject } from '../data/tieredAccommodations';
import { getSameStayVenueExplanation } from '../utils/venueExplanations';
import { sanitizeAirConditioningText } from '../utils/themeClassifier';
import {
  MapPin,
  Compass,
  Sparkles,
  Hotel,
  Calendar,
  Clock,
  Car,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  UtensilsCrossed,
  Building2,
  Ship,
  Plane,
  Moon,
  Train,
  Bike,
  Navigation,
  Info,
  Rocket,
  Bookmark,
  BookmarkCheck,
  RotateCw
} from 'lucide-react';

// Cities with scheduled domestic passenger flights (含直飛/離島機場)
const CITIES_WITH_FLIGHTS = new Set([
  '澎湖縣', '金門縣', '連江縣', '綠島', '蘭嶼', '臺東縣', '花蓮縣', '臺北市', '臺中市', '高雄市', '嘉義縣', '臺南市'
]);

// Cities with scheduled passenger ferry terminals (含離島渡輪碼頭)
const CITIES_WITH_FERRIES = new Set([
  '澎湖縣', '連江縣', '金門縣', '綠島', '蘭嶼', '琉球嶼', '屏東縣', '臺東縣', '宜蘭縣', '新北市', '高雄市', '基隆市'
]);

// Strict Island Territories set (離島範圍)
const ISLAND_TERRITORIES = new Set(['澎湖縣', '金門縣', '連江縣', '綠島', '蘭嶼', '琉球嶼']);

interface CityDetailSheetProps {
  city: CitySpecialty | null;
  isOpen: boolean;
  onClose: () => void;
  initialDays?: number;
  userLocation?: { lat: number; lng: number } | null;
  closestCity?: CitySpecialty | null;
  onTriggerLocation?: () => void;
  initialItinerary?: AIItineraryResponse | null;
  language?: SupportedLanguage;
  onOpenSavedModal?: () => void;
}

export const CityDetailSheet: React.FC<CityDetailSheetProps> = ({
  city,
  isOpen,
  onClose,
  initialDays = 2,
  userLocation,
  closestCity,
  onTriggerLocation,
  initialItinerary,
  language = 'zh-TW',
  onOpenSavedModal
}) => {
  const t = translations[language] || translations['zh-TW'];
  const locCity = useMemo(() => city ? getLocalizedCity(city, language) : null, [city, language]);
  const locClosestCityName = closestCity ? getLocalizedCityName(closestCity.name, language) : null;

  const [selectedDays, setSelectedDays] = useState<number>(initialDays);
  const [travelStyle, setTravelStyle] = useState<string>('休閒遊憩');
  const [transport, setTransport] = useState<string>('汽車自駕');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'standard' | 'luxury'>('standard');
  const [keepSameHotel, setKeepSameHotel] = useState<boolean>(true);
  const [showAllAccommodations, setShowAllAccommodations] = useState<boolean>(false);
  const [showAllFactories, setShowAllFactories] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<AIItineraryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savedDayMap, setSavedDayMap] = useState<Record<number, string | null>>({});
  const [savedSpotMap, setSavedSpotMap] = useState<Record<string, string | null>>({});
  const [saveToast, setSaveToast] = useState<string>('');
  const [currentTotalSaved, setCurrentTotalSaved] = useState<number>(() => getTotalSavedCount());
  const [showLimitReachedModal, setShowLimitReachedModal] = useState<boolean>(false);

  const prevCityRef = useRef<string | null>(city?.name || null);

  const effectiveKeepSameHotel = itinerary && typeof itinerary.keepSameHotel === 'boolean'
    ? itinerary.keepSameHotel
    : keepSameHotel;

  const sameStayVenue = useMemo(() => {
    if (!city) return null;
    const daysToUse = itinerary ? itinerary.days : selectedDays;
    return getSameStayVenueExplanation(city.name, daysToUse, travelStyle, budgetLevel, language, effectiveKeepSameHotel);
  }, [city, itinerary, selectedDays, travelStyle, budgetLevel, language, effectiveKeepSameHotel]);

  const locItinerary = useMemo(() => itinerary ? getLocalizedItinerary(itinerary, language) : null, [itinerary, language]);

  const hasFlight = city ? CITIES_WITH_FLIGHTS.has(city.name) : false;
  const hasFerry = city ? CITIES_WITH_FERRIES.has(city.name) : false;

  // Transit Recommendation from user's location (or default starting city)
  const transitInfo = useMemo(() => {
    if (!city) return null;
    const originLat = userLocation?.lat ?? 25.0330;
    const originLng = userLocation?.lng ?? 121.5654;
    const originName = locClosestCityName || (userLocation ? (language === 'en' ? 'Current Location' : language === 'ja' ? '現在地' : '目前所在位置') : (language === 'en' ? 'Departure Point' : language === 'ja' ? '出発地' : '出發地'));
    return getTransitGuide(originLat, originLng, originName, city);
  }, [city, userLocation, locClosestCityName, language]);

  // Auto-adjust transport and lock unavailable modes
  // Rule: 在單一城市移動不能出現飛機或船的選項，除非是離島縣市或即刻啟動抵達離島
  const isDestIsland = city ? ISLAND_TERRITORIES.has(city.name) : false;

  useEffect(() => {
    if (city) {
      const isCityChanged = prevCityRef.current !== city.name;
      prevCityRef.current = city.name;

      if (initialItinerary && initialItinerary.cityName === city.name) {
        setItinerary(initialItinerary);
        setSelectedDays(initialItinerary.days);
        if (initialItinerary.travelStyle) setTravelStyle(initialItinerary.travelStyle);
        if (initialItinerary.transportMode) setTransport(initialItinerary.transportMode);
        if (typeof initialItinerary.keepSameHotel === 'boolean') setKeepSameHotel(initialItinerary.keepSameHotel);
      } else if (isCityChanged) {
        // Requirement: 更改收藏的景點時絕不讓生成的內容消失，只有真正切換縣市才清空
        setItinerary(null);
      }
      setErrorMsg('');
      setSaveToast('');
      setShowAllAccommodations(false);
      setShowAllFactories(false);
      const isIsland = ISLAND_TERRITORIES.has(city.name);
      if (isIsland) {
        setTransport('飛機（國內航班直飛）');
      } else {
        // 在單一城市移動不能出現飛機或船的選項
        if (transport.includes('飛機') || transport.includes('船')) {
          setTransport('汽車自駕');
        }
      }
    }
  }, [city, initialItinerary]);

  // Synchronize saved status (Full, Day, Spot) with localStorage
  const refreshSavedStatus = () => {
    setSavedId(findSavedItineraryId(itinerary));
    setCurrentTotalSaved(getTotalSavedCount());
    if (itinerary && itinerary.itinerary) {
      const dayMap: Record<number, string | null> = {};
      const spotMap: Record<string, string | null> = {};
      itinerary.itinerary.forEach((dayItem) => {
        dayMap[dayItem.day] = findSavedDayId(
          itinerary.cityName,
          dayItem.day,
          dayItem.title,
          itinerary.generationId,
          dayItem.spots?.map((s) => s.name)
        );
        dayItem.spots?.forEach((spot) => {
          spotMap[spot.name] = findSavedSpotId(itinerary.cityName, spot.name);
        });
      });
      setSavedDayMap(dayMap);
      setSavedSpotMap(spotMap);
    } else {
      setSavedDayMap({});
      setSavedSpotMap({});
    }
  };

  useEffect(() => {
    refreshSavedStatus();
  }, [itinerary]);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshSavedStatus();
      setCurrentTotalSaved(getTotalSavedCount());
    };
    window.addEventListener(SAVED_ITINERARIES_EVENT, handleStorageChange);
    return () => window.removeEventListener(SAVED_ITINERARIES_EVENT, handleStorageChange);
  }, [itinerary]);

  // 1. 全部行程收藏（多日行程收藏，僅點擊此處時儲存整份總覽）
  const handleToggleSave = () => {
    if (!itinerary) return;
    if (savedId) {
      removeSavedItinerary(savedId);
      setSavedId(null);
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? 'Removed full itinerary from bookmarks'
          : language === 'ja'
          ? '旅程全体の保存を解除しました'
          : '已從「我的收藏」中移除整套行程'
      );
      setTimeout(() => setSaveToast(''), 3000);
    } else {
      if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
        setShowLimitReachedModal(true);
        return;
      }
      const saved = saveItinerary(itinerary);
      if (!saved) {
        setShowLimitReachedModal(true);
        return;
      }
      setSavedId(saved.id);
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? `Saved [${locCity?.name || itinerary.cityName} ${itinerary.days}-Day Tour]! (${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : language === 'ja'
          ? `【${locCity?.name || itinerary.cityName} ${itinerary.days}日間の旅】を保存しました！(${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : `已成功收藏【${itinerary.cityName} ${itinerary.days} 日遊】最佳化路線！(目前收藏 ${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
      );
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  // 2. 當天一整個行程全部收藏（單日行程收藏，僅點擊「收藏當天行程」時儲存整包當日資料）
  const handleToggleSaveDay = (dayItem: ItineraryDay) => {
    if (!itinerary) return;
    const existingId = savedDayMap[dayItem.day];
    if (existingId) {
      removeSavedDayItinerary(existingId);
      setSavedDayMap((prev) => ({ ...prev, [dayItem.day]: null }));
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? `Unsaved Day ${dayItem.day}`
          : language === 'ja'
          ? `${dayItem.day}日目の保存を解除しました`
          : `已取消收藏「第 ${dayItem.day} 天行程」`
      );
      setTimeout(() => setSaveToast(''), 3000);
    } else {
      if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
        setShowLimitReachedModal(true);
        return;
      }
      const saved = saveDayItinerary(
        itinerary.cityName,
        dayItem,
        itinerary.travelStyle,
        itinerary.transportMode,
        itinerary.generationId
      );
      if (!saved) {
        setShowLimitReachedModal(true);
        return;
      }
      setSavedDayMap((prev) => ({ ...prev, [dayItem.day]: saved.id }));
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? `Saved [Day ${dayItem.day}: ${dayItem.title}]! (${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : language === 'ja'
          ? `【${dayItem.day}日目：${dayItem.title}】を保存しました！(${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : `已收藏【第 ${dayItem.day} 天：${dayItem.title}】當日行程！(目前收藏 ${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
      );
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  // 3. 單一景點收藏
  const handleToggleSaveSpot = (spot: ItinerarySpot, dayNumber: number) => {
    if (!itinerary) return;
    const existingId = savedSpotMap[spot.name];
    if (existingId) {
      removeSavedSpotItem(existingId);
      setSavedSpotMap((prev) => ({ ...prev, [spot.name]: null }));
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? `Unsaved spot "${spot.name}"`
          : language === 'ja'
          ? `スポット「${spot.name}」の保存を解除しました`
          : `已取消收藏景點「${spot.name}」`
      );
      setTimeout(() => setSaveToast(''), 3000);
    } else {
      if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
        setShowLimitReachedModal(true);
        return;
      }
      const saved = saveSpotItem(itinerary.cityName, spot, dayNumber);
      if (!saved) {
        setShowLimitReachedModal(true);
        return;
      }
      setSavedSpotMap((prev) => ({ ...prev, [spot.name]: saved.id }));
      setCurrentTotalSaved(getTotalSavedCount());
      setSaveToast(
        language === 'en'
          ? `Saved spot "${spot.name}" to favorites! (${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : language === 'ja'
          ? `スポット「${spot.name}」をお気に入りに保存しました！(${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
          : `已將景點「${spot.name}」收藏至景點庫！(目前收藏 ${getTotalSavedCount()}/${MAX_SAVED_LIMIT})`
      );
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  // 4. 縣市名稱旁邊的收藏ICON符號功能與主頁我的收藏相同功能，開啟我的收藏管理庫
  const handleCityHeaderBookmarkClick = () => {
    onOpenSavedModal?.();
  };

  if (!isOpen || !city) return null;

  // Real-time accommodation update when budget level changes
  const handleBudgetLevelChange = (newBudget: 'budget' | 'standard' | 'luxury') => {
    setBudgetLevel(newBudget);
    if (itinerary && city) {
      const updatedItinerary = { ...itinerary, budgetLevel: newBudget };
      const venueExplanation = getSameStayVenueExplanation(city.name, itinerary.days, travelStyle, newBudget, language, effectiveKeepSameHotel);
      const baseHotel = venueExplanation.hotel;
      updatedItinerary.baseHotelName = baseHotel.name;

      const seenHotelNames = new Set<string>();
      if (Array.isArray(updatedItinerary.itinerary)) {
        updatedItinerary.itinerary = updatedItinerary.itinerary.map((day, dIdx) => {
          const isLastDay = day.day === updatedItinerary.days;
          if (isLastDay || updatedItinerary.days === 1) {
            return {
              ...day,
              stayHotel: undefined,
              stayRecommendation: undefined
            };
          }
          const dayHotel = effectiveKeepSameHotel
            ? baseHotel
            : getTieredAccommodation(city.name, newBudget, dIdx, (language === 'en' || language === 'ja') ? language : 'zh-TW', seenHotelNames);
          seenHotelNames.add(dayHotel.name);
          return {
            ...day,
            stayHotel: `${dayHotel.name} (${dayHotel.type})`,
            stayRecommendation: {
              hotel_name: dayHotel.name,
              location_type: dayHotel.locationType,
              property_type: dayHotel.type,
              feature: dayHotel.description,
              geographic_continuity: language === 'en'
                ? `Coherently aligned with Day ${day.day}'s axis, smooth onward transit.`
                : language === 'ja'
                ? `第${day.day}日の探索軸エリアに直結し、翌日の動線もスムーズ。`
                : `緊鄰第 ${day.day} 天探索生活軸線，便於次日順向銜接出發。`
            }
          };
        });
      }

      if (Array.isArray(updatedItinerary.daily_plans)) {
        const seenPlanHotelNames = new Set<string>();
        updatedItinerary.daily_plans = updatedItinerary.daily_plans.map((plan, pIdx) => {
          const isLastDay = plan.day === updatedItinerary.days;
          if (isLastDay || updatedItinerary.days === 1) {
            const { stay_recommendation, ...rest } = plan;
            return rest;
          }
          const dayHotel = effectiveKeepSameHotel
            ? baseHotel
            : getTieredAccommodation(city.name, newBudget, pIdx, (language === 'en' || language === 'ja') ? language : 'zh-TW', seenPlanHotelNames);
          seenPlanHotelNames.add(dayHotel.name);
          return {
            ...plan,
            stay_recommendation: {
              hotel_name: dayHotel.name,
              location_type: dayHotel.locationType,
              property_type: dayHotel.type,
              feature: dayHotel.description,
              geographic_continuity: language === 'en'
                ? `Coherently aligned with Day ${plan.day}'s axis, smooth onward transit.`
                : language === 'ja'
                ? `第${plan.day}日の探索軸エリアに直結し、翌日の動線もスムーズ。`
                : `緊鄰第 ${plan.day} 天探索生活軸線，便於次日順向銜接出發。`
            }
          };
        });
      }

      const budgetLabel = newBudget === 'budget'
        ? (language === 'en' ? 'Budget' : language === 'ja' ? 'エコノミー' : '經濟小資')
        : newBudget === 'luxury'
        ? (language === 'en' ? 'Luxury' : language === 'ja' ? 'ラグジュアリー' : '尊榮奢華')
        : (language === 'en' ? 'Standard' : language === 'ja' ? 'スタンダード' : '經典舒適');

      updatedItinerary.hotelAdvice = (itinerary.days === 1)
        ? ''
        : (itinerary.days === 2)
        ? (language === 'en'
            ? `[Accommodation Venue Recommendation (${budgetLabel})]: Reserved at "${baseHotel.name}". ${venueExplanation.themeFeature}`
            : language === 'ja'
            ? `【おすすめ宿泊施設のご案内（${budgetLabel}）】：「${baseHotel.name}」に滞在。${venueExplanation.themeFeature}`
            : `【住宿場館建議（${budgetLabel}）】：下榻『${baseHotel.name}』。${venueExplanation.themeFeature}`)
        : effectiveKeepSameHotel
        ? (language === 'en'
            ? `[Trip Consecutive Stay Venue Guide (${budgetLabel})]: All nights reserved at "${baseHotel.name}". ${venueExplanation.themeFeature}`
            : language === 'ja'
            ? `【旅行中同一宿泊施設のご案内（${budgetLabel}）】：全日程「${baseHotel.name}」に連泊。${venueExplanation.themeFeature}`
            : `【全程入住同一住宿場館說明（${budgetLabel}）】：全程下榻『${baseHotel.name}』。${venueExplanation.themeFeature}`)
        : (language === 'en'
            ? `[Flexible Multi-Stay Accommodation Guide (${budgetLabel})]: Varied accommodations per night tailored to each day's route.`
            : language === 'ja'
            ? `【日替わりおすすめ宿泊施設（${budgetLabel}）】：各日の観光エリアに合わせて異なるホテル・民宿へ宿泊。`
            : `【依每日遊程更換住宿建議（${budgetLabel}）】：每日行程依地理軸線安排不同特色旅宿。`);

      const enrichedItinerary = enrichItineraryWithRealTransit(
        updatedItinerary,
        city.name,
        updatedItinerary.days,
        transport,
        userLocation || null,
        closestCity?.name || null
      );
      setItinerary(enrichedItinerary);
    }
  };

  // Toggle Keep Same Hotel with instant recalculation of transit and accommodations
  const handleKeepSameHotelToggle = (newKeepSame: boolean) => {
    setKeepSameHotel(newKeepSame);
    if (itinerary && city) {
      const updatedItinerary = { ...itinerary, keepSameHotel: newKeepSame };
      const venueExplanation = getSameStayVenueExplanation(
        city.name,
        itinerary.days,
        travelStyle,
        budgetLevel,
        language,
        newKeepSame
      );
      const baseHotel = venueExplanation.hotel;
      updatedItinerary.baseHotelName = baseHotel.name;

      const seenHotelNames = new Set<string>();
      if (Array.isArray(updatedItinerary.itinerary)) {
        updatedItinerary.itinerary = updatedItinerary.itinerary.map((day, dIdx) => {
          const isLastDay = day.day === updatedItinerary.days;
          if (isLastDay || updatedItinerary.days === 1) {
            return {
              ...day,
              stayHotel: undefined,
              stayRecommendation: undefined
            };
          }
          const dayHotel = newKeepSame
            ? baseHotel
            : getTieredAccommodation(
                city.name,
                budgetLevel,
                dIdx,
                (language === 'en' || language === 'ja') ? language : 'zh-TW',
                seenHotelNames
              );
          seenHotelNames.add(dayHotel.name);
          return {
            ...day,
            stayHotel: `${dayHotel.name} (${dayHotel.type})`,
            stayRecommendation: {
              hotel_name: dayHotel.name,
              location_type: dayHotel.locationType,
              property_type: dayHotel.type,
              feature: dayHotel.description,
              geographic_continuity: language === 'en'
                ? `Coherently aligned with Day ${day.day}'s axis, smooth onward transit.`
                : language === 'ja'
                ? `第${day.day}日の探索軸エリアに直結し、翌日の動線もスムーズ。`
                : `緊鄰第 ${day.day} 天探索生活軸線，便於次日順向銜接出發。`
            }
          };
        });
      }

      if (Array.isArray(updatedItinerary.daily_plans)) {
        const seenPlanHotelNames = new Set<string>();
        updatedItinerary.daily_plans = updatedItinerary.daily_plans.map((plan, pIdx) => {
          const isLastDay = plan.day === updatedItinerary.days;
          if (isLastDay || updatedItinerary.days === 1) {
            const { stay_recommendation, ...rest } = plan;
            return rest;
          }
          const dayHotel = newKeepSame
            ? baseHotel
            : getTieredAccommodation(
                city.name,
                budgetLevel,
                pIdx,
                (language === 'en' || language === 'ja') ? language : 'zh-TW',
                seenPlanHotelNames
              );
          seenPlanHotelNames.add(dayHotel.name);
          return {
            ...plan,
            stay_recommendation: {
              hotel_name: dayHotel.name,
              location_type: dayHotel.locationType,
              property_type: dayHotel.type,
              feature: dayHotel.description,
              geographic_continuity: language === 'en'
                ? `Coherently aligned with Day ${plan.day}'s axis, smooth onward transit.`
                : language === 'ja'
                ? `第${plan.day}日の探索軸エリアに直結し、翌日の動線もスムーズ。`
                : `緊鄰第 ${plan.day} 天探索生活軸線，便於次日順向銜接出發。`
            }
          };
        });
      }

      const budgetLabel = budgetLevel === 'budget'
        ? (language === 'en' ? 'Budget' : language === 'ja' ? 'エコノミー' : '經濟小資')
        : budgetLevel === 'luxury'
        ? (language === 'en' ? 'Luxury' : language === 'ja' ? 'ラグジュアリー' : '尊榮奢華')
        : (language === 'en' ? 'Standard' : language === 'ja' ? 'スタンダード' : '經典舒適');

      updatedItinerary.hotelAdvice = (itinerary.days === 1)
        ? ''
        : (itinerary.days === 2)
        ? (language === 'en'
            ? `[Accommodation Venue Recommendation (${budgetLabel})]: Reserved at "${baseHotel.name}". ${venueExplanation.themeFeature}`
            : language === 'ja'
            ? `【おすすめ宿泊施設のご案内（${budgetLabel}）】：「${baseHotel.name}」に滞在。${venueExplanation.themeFeature}`
            : `【住宿場館建議（${budgetLabel}）】：下榻『${baseHotel.name}』。${venueExplanation.themeFeature}`)
        : newKeepSame
        ? (language === 'en'
            ? `[Trip Consecutive Stay Venue Guide (${budgetLabel})]: All nights reserved at "${baseHotel.name}". ${venueExplanation.themeFeature}`
            : language === 'ja'
            ? `【旅行中同一宿泊施設のご案内（${budgetLabel}）】：全日程「${baseHotel.name}」に連泊。${venueExplanation.themeFeature}`
            : `【全程入住同一住宿場館說明（${budgetLabel}）】：全程下榻『${baseHotel.name}』。${venueExplanation.themeFeature}`)
        : (language === 'en'
            ? `[Flexible Multi-Stay Accommodation Guide (${budgetLabel})]: Varied accommodations per night tailored to each day's route.`
            : language === 'ja'
            ? `【日替わりおすすめ宿泊施設（${budgetLabel}）】：各日の観光エリアに合わせて異なるホテル・民宿へ宿泊。`
            : `【依每日遊程更換住宿建議（${budgetLabel}）】：每日行程依地理軸線安排不同特色旅宿。`);

      const enrichedItinerary = enrichItineraryWithRealTransit(
        updatedItinerary,
        city.name,
        updatedItinerary.days,
        transport,
        userLocation || null,
        closestCity?.name || null
      );
      setItinerary(enrichedItinerary);
    }
  };

  // Generate Itinerary via server-side Gemini endpoint with robust client fallback
  const handleGenerateItinerary = async (overrideTransport?: string, isRegenerate: boolean = false) => {
    const activeTransport = typeof overrideTransport === 'string' && overrideTransport ? overrideTransport : transport;
    setIsGenerating(true);
    setErrorMsg('');
    const variationId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const variationSeed = Date.now();

    // Collect current spots and hotels to avoid repeating them on regeneration
    const currentSpots = itinerary && Array.isArray(itinerary.itinerary)
      ? itinerary.itinerary.flatMap(d => (d.spots || []).map(s => (s.name || '').trim()).filter(Boolean))
      : [];

    const currentHotels = itinerary && Array.isArray(itinerary.itinerary)
      ? itinerary.itinerary.flatMap(d => [
          d.stayRecommendation?.hotel_name,
          d.stayHotel,
          itinerary.baseHotelName
        ]).filter((h): h is string => Boolean(h && typeof h === 'string')).map(h => h.split('(')[0].trim())
      : [];

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_region: city.name,
          cityName: city.name,
          days: selectedDays,
          theme_mode: travelStyle,
          travelStyle,
          budget_level: budgetLevel,
          language,
          transport: activeTransport,
          keepSameHotel,
          userLocation: userLocation || null,
          closestCityName: closestCity?.name || null,
          variationId,
          excludedSpots: currentSpots,
          excludedHotels: currentHotels
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        // Fall back gracefully to curated local plan if server returned HTML error or non-JSON
        const fallback = generateCuratedFallback(city.name, selectedDays, travelStyle, activeTransport, keepSameHotel, budgetLevel, language, variationSeed, currentSpots, currentHotels);
        const enriched = enrichItineraryWithRealTransit(fallback, city.name, selectedDays, activeTransport, userLocation || null, closestCity?.name || null);
        enriched.generationId = `gen_${variationId}`;
        setItinerary(enriched);
        setSavedId(null);
        setSavedDayMap({});
        return;
      }

      const text = await response.text();
      let data: AIItineraryResponse;
      try {
        data = JSON.parse(text);
      } catch {
        const fallback = generateCuratedFallback(city.name, selectedDays, travelStyle, activeTransport, keepSameHotel, budgetLevel, language, variationSeed, currentSpots, currentHotels);
        const enriched = enrichItineraryWithRealTransit(fallback, city.name, selectedDays, activeTransport, userLocation || null, closestCity?.name || null);
        enriched.generationId = `gen_${variationId}`;
        setItinerary(enriched);
        setSavedId(null);
        setSavedDayMap({});
        return;
      }

      if (!data || !Array.isArray(data.itinerary) || data.itinerary.length === 0) {
        const fallback = generateCuratedFallback(city.name, selectedDays, travelStyle, activeTransport, keepSameHotel, budgetLevel, language, variationSeed, currentSpots, currentHotels);
        const enriched = enrichItineraryWithRealTransit(fallback, city.name, selectedDays, activeTransport, userLocation || null, closestCity?.name || null);
        enriched.generationId = `gen_${variationId}`;
        setItinerary(enriched);
        setSavedId(null);
        setSavedDayMap({});
        return;
      }

      if (data) {
        data.generationId = `gen_${variationId}`;
        if (typeof data.keepSameHotel !== 'boolean') {
          data.keepSameHotel = keepSameHotel;
        }
        data.budgetLevel = budgetLevel;
        if (typeof data.overview === 'string') {
          data.overview = sanitizeAirConditioningText(data.overview);
        }
        const customHotelObj = data.baseHotelName
          ? findTieredHotelObject(city.name, data.baseHotelName, language)
          : undefined;
        const venueExplanation = getSameStayVenueExplanation(
          city.name,
          data.days,
          travelStyle,
          budgetLevel,
          language,
          keepSameHotel,
          customHotelObj
        );
        data.baseHotelName = customHotelObj?.name || venueExplanation.hotel.name;
      }
      setItinerary(data);
      setSavedId(null);
      setSavedDayMap({});
    } catch (err: any) {
      console.warn('Network issue during itinerary fetch, using curated planner fallback:', err);
      // Fallback seamlessly so the user gets an instant, high-quality itinerary
      const fallback = generateCuratedFallback(city.name, selectedDays, travelStyle, activeTransport, keepSameHotel, budgetLevel, language, variationSeed, currentSpots, currentHotels);
      const enriched = enrichItineraryWithRealTransit(fallback, city.name, selectedDays, activeTransport, userLocation || null, closestCity?.name || null);
      enriched.generationId = `gen_${variationId}`;
      setItinerary(enriched);
      setSavedId(null);
      setSavedDayMap({});
    } finally {
      setIsGenerating(false);
    }
  };

  // Build Google Maps Multi-Stop Directions URL (including accommodation stop on overnight days)
  const getGoogleMapsDirectionsUrl = (
    spots: { googleMapsKeyword: string; name: string }[],
    hotelName?: string
  ) => {
    const allSpots = [...(spots || [])];
    if (hotelName) {
      allSpots.push({
        name: hotelName,
        googleMapsKeyword: `${hotelName} ${city.name}`
      });
    }

    if (!allSpots || allSpots.length === 0) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.name)}`;
    }

    const origin = encodeURIComponent(allSpots[0].googleMapsKeyword || allSpots[0].name);
    const destination = encodeURIComponent(
      allSpots[allSpots.length - 1].googleMapsKeyword || allSpots[allSpots.length - 1].name
    );

    if (allSpots.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${origin}`;
    }

    const waypoints = allSpots
      .slice(1, -1)
      .map((s) => encodeURIComponent(s.googleMapsKeyword || s.name))
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=driving`;
  };

  // Open single city full-region map in Google Maps
  const handleOpenGoogleMapsCity = () => {
    const targetQuery = encodeURIComponent(city.name);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${targetQuery}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `geo:0,0?q=${targetQuery}`;
      setTimeout(() => {
        window.open(mapsUrl, '_blank');
      }, 500);
    } else {
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-4 sm:px-6 py-4 text-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-white/20 text-blue-100 rounded-full text-xs font-semibold">
                  {locCity?.region || city.region}
                </span>
                <span className="text-xs text-blue-100 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-rose-300" />
                  {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                </span>
              </div>

              {/* Title & Category Navigation UI in one row next to city name */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-1.5 shrink-0">
                    {t.smartCustomTour}：{locCity?.name || city.name}
                  </h2>

                  {/* 縣市名稱旁邊的收藏ICON符號功能與主頁我的收藏相同功能 */}
                  <button
                    type="button"
                    onClick={handleCityHeaderBookmarkClick}
                    className="px-2.5 sm:px-3 py-1 inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-all border shrink-0 whitespace-nowrap cursor-pointer outline-none focus:outline-none select-none overflow-hidden bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-300 shadow-sm active:scale-95"
                    title={t.savedItineraries}
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-950 fill-amber-500/80 shrink-0" />
                    <span className="whitespace-nowrap">{t.savedItineraries}</span>
                    {currentTotalSaved > 0 && (
                      <span className="bg-amber-950 text-amber-200 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {currentTotalSaved}
                      </span>
                    )}
                  </button>
                </div>

                {/* 項目分類 UI 放置在縣市名稱旁邊 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-blue-200 shrink-0">
                    {language === 'en' ? 'Category:' : language === 'ja' ? '分類：' : '項目分類：'}
                  </span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('city-section-culture')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border border-white/25 cursor-pointer shadow-2xs"
                  >
                    <span>🌾</span>
                    <span>{language === 'en' ? 'Culture & Produce' : language === 'ja' ? '風土・特産' : '風土與特產'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('city-section-factories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border border-white/25 cursor-pointer shadow-2xs"
                  >
                    <span>🏭</span>
                    <span>{language === 'en' ? 'Tourism Factories' : language === 'ja' ? '観光工場' : '觀光工廠'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('city-section-highlights')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border border-white/25 cursor-pointer shadow-2xs"
                  >
                    <span>🌟</span>
                    <span>{language === 'en' ? 'Spots & Hotels' : language === 'ja' ? '名所・宿泊' : '景點與住宿'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('city-section-planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>🧭</span>
                    <span>{language === 'en' ? 'Itinerary Planner' : language === 'ja' ? '行程プラン' : '智慧行程規劃'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer shrink-0"
              title={t.close}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Requirement: 從開啟定位到推薦遊玩城市以及智慧客製化旅程都需要的交通方式 需要即刻起動的UI Button */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-blue-50/80 to-slate-50 border-2 border-indigo-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    {language === 'en'
                      ? `Transit Guide to [${locCity?.name || city.name}]`
                      : language === 'ja'
                      ? `現在地から【${locCity?.name || city.name}】へのアクセス指引`
                      : `從定位點前往【${city.name}】交通指引`}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {userLocation ? (
                      <span>
                        {t.departureLocLabel}：<b>{locClosestCityName || (language === 'en' ? 'Current Location' : language === 'ja' ? '現在地' : '您的目前所在位置')}</b>
                        （{language === 'en' ? `approx. ${transitInfo?.distanceKm} km straight-line` : language === 'ja' ? `直線距離 約${transitInfo?.distanceKm} km` : `直線約 ${transitInfo?.distanceKm} 公里`}）
                      </span>
                    ) : (
                      <span>{t.notLocatedGuide}</span>
                    )}
                  </p>
                </div>
              </div>

              {!userLocation && onTriggerLocation && (
                <button
                  onClick={onTriggerLocation}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {language === 'en'
                      ? 'Locate Me for Route'
                      : language === 'ja'
                      ? '現在地取得でルート表示'
                      : '開啟定位獲取路徑'}
                  </span>
                </button>
              )}
            </div>

            {/* Detailed Transit Options (高鐵、台鐵、自駕、航線客輪) - 圖示保留一個簡約的 */}
            {transitInfo && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Driving */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'en'
                        ? 'Car Driving / Highway Route'
                        : language === 'ja'
                        ? '自動車運転 / 高速道路ルート'
                        : '汽車自駕 / 國道路線'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {transitInfo.drivingEstimate}
                    {transitInfo.highwayRoute ? `。建議行經：${transitInfo.highwayRoute}` : ''}。
                  </p>
                </div>

                {/* HSR */}
                {transitInfo.hsrEstimate && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Train className="w-4 h-4 text-orange-600" />
                      <span>
                        {language === 'en'
                          ? 'Taiwan High Speed Rail (THSR)'
                          : language === 'ja'
                          ? '台湾新幹線（台湾高鐵）'
                          : '台灣高鐵'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {transitInfo.hsrEstimate}
                    </p>
                  </div>
                )}

                {/* Train */}
                {transitInfo.trainEstimate && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Train className="w-4 h-4 text-blue-600" />
                      <span>
                        {language === 'en'
                          ? 'Taiwan Railway (TRA Train)'
                          : language === 'ja'
                          ? '台湾鉄道（台鉄列車）'
                          : '台鐵列車'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {transitInfo.trainEstimate}
                    </p>
                  </div>
                )}

                {/* Flight / Ferry - 圖示保留一個簡約的 */}
                {transitInfo.flightFerryEstimate && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between sm:col-span-2">
                    <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span>
                        {language === 'en'
                          ? 'Domestic Direct Flights & Scheduled Ferries'
                          : language === 'ja'
                          ? '国内線直行便＆定期フェリー旅客船'
                          : '國內航空直飛與定期客輪渡輪'}
                      </span>
                    </div>
                    <p className="text-amber-900 text-[11px] leading-relaxed">
                      {transitInfo.flightFerryEstimate}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Requirement: 需要即刻起動的UI Button - 圖示保留一個火箭，簡約 */}
            <div className="pt-1">
              <a
                href={
                  transitInfo?.googleMapsDirUrl ||
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    city.name + ' 政府'
                  )}&travelmode=driving`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
                title={language === 'en' ? 'Launch Navigation' : language === 'ja' ? 'ナビ開始' : '即刻啟動出發導航'}
              >
                <Rocket className="w-4 h-4 text-amber-300" />
                <span>
                  {language === 'en'
                    ? `Launch: Google Maps Route from Location to [${locCity?.name || city.name}]`
                    : language === 'ja'
                    ? `今すぐナビ開始：現在地から【${locCity?.name || city.name}】へのGoogleマップルート案内`
                    : `即刻啟動：開啟從定位點前往【${city.name}】Google Maps 即時路線導航`}
                </span>
              </a>
            </div>
          </div>

          {/* Island Transportation Guide Notice if applicable */}
          {locCity?.islandNotice && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">
                  {language === 'en'
                    ? '【Outlying Island Transit Notice: Flights & Ferries】'
                    : language === 'ja'
                    ? '【離島交通のご案内：航空便・旅客船アクセス】'
                    : '【離島專屬交通提示：航班與客輪指引】'}
                </p>
                <p>{locCity.islandNotice}</p>
              </div>
            </div>
          )}

          {/* Section 1: 地方介紹 (風土特色與地理人文) */}
          <div id="city-section-culture" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Compass className="w-4 h-4 text-blue-600" />
              {t.localCultureTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {locCity?.description || city.description}
            </p>
          </div>

          {/* Section 2: 各地農漁牧特色產品 (4 Cards: 農、漁、牧、美食) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                {t.localProduceTitle}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Agriculture Card */}
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-3xl mb-1.5">🌾</div>
                  <h4 className="font-bold text-emerald-950 text-sm">{t.agricultureLabel}</h4>
                </div>
                <p className="text-xs text-emerald-800 font-medium mt-2 leading-relaxed">
                  {locCity?.agriculture || city.agriculture}
                </p>
              </div>

              {/* Fishery Card */}
              <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-3xl mb-1.5">🐟</div>
                  <h4 className="font-bold text-sky-950 text-sm">{t.fisheryLabel}</h4>
                </div>
                <p className="text-xs text-sky-800 font-medium mt-2 leading-relaxed">
                  {locCity?.fishery || city.fishery}
                </p>
              </div>

              {/* Livestock Card */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-3xl mb-1.5">🐄</div>
                  <h4 className="font-bold text-amber-950 text-sm">{t.livestockLabel}</h4>
                </div>
                <p className="text-xs text-amber-800 font-medium mt-2 leading-relaxed">
                  {locCity?.livestock || city.livestock}
                </p>
              </div>

              {/* Famous Food Card */}
              <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-3xl mb-1.5">🍜</div>
                  <h4 className="font-bold text-rose-950 text-sm">{t.famousFoodLabel}</h4>
                </div>
                <p className="text-xs text-rose-800 font-medium mt-2 leading-relaxed">
                  {(locCity?.famousFood || city.famousFood).join(language === 'en' ? ', ' : '、')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: 觀光工廠專區 (在 Google Map 顯示，超過4間提供查看更多) */}
          {(() => {
            const rawFactories = locCity?.tourismFactories || city.tourismFactories || [];
            const displayFactories = showAllFactories ? rawFactories : rawFactories.slice(0, 4);
            const hasMoreFactories = rawFactories.length > 4;

            return (
              <div id="city-section-factories" className="border border-indigo-200 bg-indigo-50/40 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      {language === 'en'
                        ? 'Certified Tourism Factories & Craft Studios (Google Maps Navigation)'
                        : language === 'ja'
                        ? '公認観光工場・手作り体験館 (Googleマップ即時ナビ)'
                        : '觀光工廠與手作產業體驗館 (Google Maps 即時導航)'}
                    </span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((city?.name || '') + ' 觀光工廠 手作體驗')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold bg-white/90 hover:bg-white border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                      title={language === 'en' ? 'Explore all factories in city on Google Maps' : language === 'ja' ? 'Googleマップで全域探索' : '在 Google 地圖探索全域觀光工廠'}
                    >
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{language === 'en' ? 'Explore on Google Maps' : language === 'ja' ? 'Googleマップで探索' : '在 Google 地圖探索全域'}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
                    </a>
                    <span className="text-[11px] text-indigo-700 font-medium bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                      {rawFactories.length} {language === 'en' ? 'Certified Factories' : language === 'ja' ? '箇所の公認工場' : '間推薦工廠'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayFactories.map((factory, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {factory.name}
                          </span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">
                            {language === 'en' ? 'Tourism Factory' : language === 'ja' ? '観光工場' : '觀光工廠'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {factory.intro}
                        </p>
                      </div>
                      <div className="pt-2 flex justify-end border-t border-slate-100">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            factory.googleMapsQuery || (factory.name + ' ' + (city?.name || ''))
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{language === 'en' ? 'View on Google Maps' : language === 'ja' ? 'Googleマップで見る' : '在 Google Maps 查看'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreFactories && (
                  <div className="pt-3 flex justify-center">
                    <button
                      type="button"
                      id="toggle-more-factories-btn"
                      onClick={() => setShowAllFactories(prev => !prev)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
                    >
                      {showAllFactories ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-indigo-200" />
                          <span>
                            {language === 'en'
                              ? 'Show Less Factories (Display Top 4)'
                              : language === 'ja'
                              ? '表示を折りたたむ（主要4箇所を表示）'
                              : '收起觀光工廠（顯示精選前 4 間）'}
                          </span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-indigo-200" />
                          <span>
                            {language === 'en'
                              ? `View More Tourism Factories (${rawFactories.length} total, expand remaining ${rawFactories.length - 4})`
                              : language === 'ja'
                              ? `他の観光工場をもっと見る（全${rawFactories.length}箇所、残り${rawFactories.length - 4}箇所を展開）`
                              : `查看更多觀光工廠（共 ${rawFactories.length} 間，展開剩餘 ${rawFactories.length - 4} 間）`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section 4: 熱門景點地標與精選住宿推薦 */}
          <div id="city-section-highlights" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sightseeing Spots */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {t.highlightsTitle}
                </h4>
                <ul className="space-y-2.5">
                  {(locCity?.highlights || city.highlights).map((spot, idx) => (
                    <li
                      key={idx}
                      className="text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {spot.name}
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            spot.googleMapsQuery || spot.name
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 hover:bg-blue-100 rounded"
                          title={language === 'en' ? 'View on Google Maps' : language === 'ja' ? 'Googleマップで見る' : '在 Google Maps 查看'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {spot.intro}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accommodations */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-indigo-500" />
                    {t.accommodationsTitle}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'en'
                      ? `${city.accommodations.length} recommended stays`
                      : language === 'ja'
                      ? `全 ${city.accommodations.length} 軒のおすすめ宿泊施設`
                      : `共 ${city.accommodations.length} 間推薦`}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {(locCity?.accommodations || city.accommodations)
                    .slice(0, showAllAccommodations ? city.accommodations.length : 2)
                    .map((hotel, idx) => (
                      <li
                        key={idx}
                        className="text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {hotel.name}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-semibold text-[10px]">
                            {hotel.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {hotel.description}
                        </p>
                        <div className="pt-1 flex justify-end">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              hotel.googleMapsQuery || hotel.name
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px] font-medium"
                          >
                            {language === 'en' ? 'Google Maps Location' : language === 'ja' ? 'Googleマップで位置確認' : 'Google Maps 定位'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </li>
                    ))}
                </ul>

                {/* Requirement: 精選住宿推薦2間之外，也請提供查看更多的選項 */}
                {city.accommodations.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAccommodations(!showAllAccommodations)}
                    className="w-full mt-2.5 py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Hotel className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {showAllAccommodations
                        ? (language === 'en' ? 'Collapse Stays (Show Top 2 Only)' : language === 'ja' ? '宿泊施設を折りたたむ（トップ2軒のみ表示）' : t.collapseAccommodations)
                        : (language === 'en' ? `View More Stays (${city.accommodations.length - 2} more recommended stays)` : language === 'ja' ? `さらに宿泊施設を表示（他 ${city.accommodations.length - 2} 軒）` : `查看更多精選住宿（展開另外 ${city.accommodations.length - 2} 間推薦特色旅宿）`)}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showAllAccommodations ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}

                {/* Google Maps Search Link for More Accommodations */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    city.name + ' 精選住宿 飯店 民宿'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {language === 'en'
                      ? `View more hotels & B&Bs in [${locCity?.name || city.name}] on Google Maps`
                      : language === 'ja'
                      ? `Googleマップで「${locCity?.name || city.name}」のホテル・宿をさらに検索`
                      : `在 Google Maps 查看更多「${city.name}」飯店與特色旅宿`}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 5: 智慧客製化旅程規劃助手 (天數、風格、交通鎖定、維持同一住宿) */}
          <div id="city-section-planner" className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 border border-blue-200 rounded-3xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.smartCustomTour}（{language === 'en' ? 'Custom Route Planning' : language === 'ja' ? 'カスタムルート立案' : '客製化路線規劃'}）
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'en'
                      ? 'Optimal non-backtracking 1~5 day routes based on time, distance & transit'
                      : language === 'ja'
                      ? '所要時間と交通動線を考慮した、無駄な往復のない1〜5日間最適化旅程'
                      : '以時間距離與交通做為主要考量，規劃順行無折返之 1~5 天行程'}
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Preferences Controls */}
            <div className="space-y-4 text-xs">
              {/* Day selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {language === 'en'
                      ? 'Trip Duration (Max 5 Days, 4 Nights)'
                      : language === 'ja'
                      ? '滞在日数選択（最大5日間）'
                      : '規劃遊玩天數（最多五天四夜）'}
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { days: 1, label: language === 'en' ? '1 Day' : language === 'ja' ? '日帰り' : '1 日遊' },
                    { days: 2, label: language === 'en' ? '2D 1N' : language === 'ja' ? '2日1泊' : '2 天 1 夜' },
                    { days: 3, label: language === 'en' ? '3D 2N' : language === 'ja' ? '3日2泊' : '3 天 2 夜' },
                    { days: 4, label: language === 'en' ? '4D 3N' : language === 'ja' ? '4日3泊' : '4 天 3 夜' },
                    { days: 5, label: language === 'en' ? '5D 4N' : language === 'ja' ? '5日4泊' : '5 天 4 夜' }
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setSelectedDays(item.days)}
                      className={`py-2 px-3 rounded-xl font-bold transition-colors text-center border cursor-pointer outline-none focus:outline-none select-none overflow-hidden ${
                        selectedDays === item.days
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style and Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span>{language === 'en' ? 'Theme & Travel Style' : language === 'ja' ? 'テーマ＆スタイル' : '主題分類與風格 (Theme)'}</span>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">
                      {language === 'en' ? '4 Core Styles' : language === 'ja' ? '4大スタイル' : '4 大主題風格'}
                    </span>
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                  >
                    <option value="休閒遊憩">
                      🎡 {getLocalizedTheme('休閒遊憩', language)}
                      {language === 'en' ? ' (All-Ages Family・Indoor Comfort)' : language === 'ja' ? '（全世代ファミリー・屋内快適）' : '（全齡親子・室內舒適）'}
                    </option>
                    <option value="文化生活">
                      🏛️ {getLocalizedTheme('文化生活', language)}
                      {language === 'en' ? ' (Heritage & Artisan Craft)' : language === 'ja' ? '（歴史文化・職人工芸）' : '（文史聚落・職人工藝）'}
                    </option>
                    <option value="戶外漫遊">
                      🌲 {getLocalizedTheme('戶外漫遊', language)}
                      {language === 'en' ? ' (Nature, Coast & Mountain)' : language === 'ja' ? '（自然景観・親山ハイキング）' : '（自然景觀・親山踏青）'}
                    </option>
                    <option value="美食尋味">
                      🍜 {getLocalizedTheme('美食尋味', language)}
                      {language === 'en' ? ' (Local Eats & Specialties)' : language === 'ja' ? '（ご当地グルメ・名店めぐり）' : '（在地小吃・名產名店）'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span>{language === 'en' ? 'Transportation Mode' : language === 'ja' ? '交通移動手段' : '交通運輸工具選項'}</span>
                    {isDestIsland && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                        {language === 'en' ? 'Flight/Ferry recommended for islands' : language === 'ja' ? '離島は航空便・船を推奨' : '離島推薦飛機或船'}
                      </span>
                    )}
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                  >
                    <option value="汽車自駕">🚗 {language === 'en' ? 'Car Driving / Rental Car' : language === 'ja' ? 'レンタカー・自動車自駕' : '汽車自駕 / 租車自由行'}</option>
                    <option value="台灣高鐵（站前轉乘/租車）">🚄 {language === 'en' ? 'Taiwan High Speed Rail (THSR)' : language === 'ja' ? '台湾高鐵（新幹線+駅前レンタカー/シャトル）' : '台灣高鐵（站前轉乘/租車）'}</option>
                    <option value="台鐵火車（鐵道慢旅漫遊）">🚆 {language === 'en' ? 'Taiwan Railway (TRA Slow Train)' : language === 'ja' ? '台鉄列車（ローカル鉄道旅）' : '台鐵火車（鐵道慢旅漫遊）'}</option>
                    <option value="公車客運（大眾運輸好行路線）">🚌 {language === 'en' ? 'Bus & Shuttle (Taiwan Tourist Shuttle)' : language === 'ja' ? '路線バス・台湾好行観光バス' : '公車客運（大眾運輸好行路線）'}</option>
                    <option value="機車慢遊（巷弄穿梭）">🛵 {language === 'en' ? 'Motorcycle / Scooter Exploration' : language === 'ja' ? 'スクーターレンタル（市街地探索）' : '機車漫遊（市區巷弄靈活穿梭）'}</option>
                    <option value="腳踏車自行車慢騎">🚲 {language === 'en' ? 'Bicycle / Cycling Slow Travel' : language === 'ja' ? 'サイクリング・自転車散策' : '腳踏車自行車慢騎'}</option>
                    {/* User requirement: 在單一城市移動不能出現飛機或船的選項，除了即刻啟動能夠提供船和飛機抵達離島縣市，或者隨機抽到的縣市是離島範圍才適用 */}
                    {isDestIsland && (
                      <>
                        <option value="飛機（國內航班直飛）" disabled={!hasFlight}>
                          {hasFlight
                            ? (language === 'en' ? '✈️ Domestic Flight (Scheduled Flights Available)' : language === 'ja' ? '✈️ 国内線航空便（定期便運航中）' : '✈️ 飛機（國內航班直飛・有民航航班）')
                            : (language === 'en' ? '✈️ Flight (No direct flights - Locked)' : language === 'ja' ? '✈️ 航空便（直行定期便なし・ロック）' : '✈️ 飛機（無直達民航定期航班・已鎖定）')}
                        </option>
                        <option value="船（客輪渡輪航行）" disabled={!hasFerry}>
                          {hasFerry
                            ? (language === 'en' ? '🚢 Ferry / Passenger Ship (Scheduled Ferries Available)' : language === 'ja' ? '🚢 定期フェリー船（定期航路運航中）' : '🚢 船（客輪渡輪航行・有定期客輪）')
                            : (language === 'en' ? '🚢 Ferry (No scheduled ferries - Locked)' : language === 'ja' ? '🚢 旅客船（直行定期航路なし・ロック）' : '🚢 船（無定期客輪渡輪航線・已鎖定）')}
                        </option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Accommodation Preference Selection (僅在 2 天以上行程顯示，一日遊當日往返隱藏) */}
              {selectedDays >= 2 && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span className="text-xs sm:text-sm">
                      {language === 'en'
                        ? 'Accommodation Preference'
                        : language === 'ja'
                        ? '宿泊の好み'
                        : '住宿偏好'}
                    </span>
                    <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-1.5 py-0.5 rounded">
                      {budgetLevel === 'budget'
                        ? (language === 'en' ? 'Budget / High-CP' : language === 'ja' ? '高コスパ・お得' : '小資高CP值')
                        : budgetLevel === 'luxury'
                        ? (language === 'en' ? 'Luxury Experience' : language === 'ja' ? 'プレミアム贅沢' : '尊榮質感享樂')
                        : (language === 'en' ? 'Comfort / Standard' : language === 'ja' ? '定番快適' : '經典舒適推薦')}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        key: 'budget',
                        label: language === 'en' ? 'Budget' : language === 'ja' ? 'エコノミー' : '小資經濟',
                        sub: language === 'en' ? 'Hostels & Budget Stays' : language === 'ja' ? '民宿・ホステル' : '青年旅館/特色平價旅宿'
                      },
                      {
                        key: 'standard',
                        label: language === 'en' ? 'Standard' : language === 'ja' ? 'スタンダード' : '經典舒適',
                        sub: language === 'en' ? 'Boutique & Quality Hotels' : language === 'ja' ? '定評ホテル・優良宿' : '優質商旅/特色質感文旅'
                      },
                      {
                        key: 'luxury',
                        label: language === 'en' ? 'Luxury' : language === 'ja' ? 'ラグジュアリー' : '尊榮輕奢',
                        sub: language === 'en' ? 'Resorts & 5-Star Luxury' : language === 'ja' ? '高級リゾート・上質宿' : '星級渡假村/景觀頂級酒店'
                      }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleBudgetLevelChange(item.key as any)}
                        className={`p-2 rounded-xl text-left transition-colors cursor-pointer outline-none focus:outline-none select-none overflow-hidden ${
                          budgetLevel === item.key
                            ? 'bg-indigo-50 border-2 border-indigo-600 shadow-2xs'
                            : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`font-bold text-xs ${budgetLevel === item.key ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {item.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirement: 3天以上的天數安排要顯示維持原住宿或不維持的選項及功能 */}
              {selectedDays >= 3 && (
                <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-indigo-50/80 p-3 rounded-2xl border border-indigo-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <Hotel className="w-4 h-4 text-indigo-600" />
                      <span>
                        {language === 'en'
                          ? 'Multi-Day Accommodation Arrangement'
                          : language === 'ja'
                          ? '連泊・宿泊先の手配方法'
                          : '多日遊住宿安排方式'}
                      </span>
                    </label>
                    <span className="text-[10px] text-indigo-700 font-semibold bg-white/90 px-1.5 py-0.5 rounded border border-indigo-200">
                      {keepSameHotel
                        ? (language === 'en' ? 'Consecutive Stay' : language === 'ja' ? '同一宿連泊' : '維持原住宿')
                        : (language === 'en' ? 'Change Daily' : language === 'ja' ? '日替わり宿泊' : '隨行程換宿')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleKeepSameHotelToggle(true)}
                      className={`p-2.5 rounded-xl text-left transition-colors cursor-pointer outline-none focus:outline-none select-none overflow-hidden ${
                        keepSameHotel
                          ? 'bg-white border-2 border-indigo-600 shadow-2xs'
                          : 'bg-white/60 border border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950">
                        <span>🏨</span>
                        <span>{language === 'en' ? 'Keep Same Stay' : language === 'ja' ? '元の宿泊先を維持（連泊）' : '維持原住宿（全程連泊）'}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                        {language === 'en'
                          ? 'Stay at the same hotel without daily repacking.'
                          : language === 'ja'
                          ? '全日程同じ宿に滞在。毎日の荷造りや移動の負担を軽減。'
                          : '全程入住同一間優質飯店，免去每日收拾行李與退房搬遷之累。'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleKeepSameHotelToggle(false)}
                      className={`p-2.5 rounded-xl text-left transition-colors cursor-pointer outline-none focus:outline-none select-none overflow-hidden ${
                        !keepSameHotel
                          ? 'bg-white border-2 border-indigo-600 shadow-2xs'
                          : 'bg-white/60 border border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950">
                        <span>🔄</span>
                        <span>{language === 'en' ? 'Change Daily' : language === 'ja' ? '維持しない（毎日別の宿へ）' : '不維持原住宿（隨行程換宿）'}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                        {language === 'en'
                          ? 'Experience varied local accommodations tailored to each day.'
                          : language === 'ja'
                          ? '日ごとの観光エリアに合わせて異なる宿・温泉ホテルを体験。'
                          : '依每日遊程分區就近入住特色旅宿或溫泉會館，體驗多元風情。'}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Requirement: 關於交通工具在定位之後，需要鎖定船和飛機是否有航班，若沒有要顯示請改用其他交通工具旅遊的提示 */}
              <div
                className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                  !isDestIsland
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : !hasFlight || !hasFerry
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-blue-50/90 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-4 h-4 ${!isDestIsland ? 'text-blue-600' : !hasFlight || !hasFerry ? 'text-amber-600' : 'text-blue-600'}`}
                    />
                    <span>{language === 'en' ? 'Transit Routing Guidelines' : language === 'ja' ? '交通手段プランニング指引' : '交通運具規劃指引'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 font-medium">
                    {isDestIsland
                      ? (language === 'en' ? 'Island Sea/Air Direct' : language === 'ja' ? '離島空海直結' : '離島海空直達')
                      : (language === 'en' ? 'Mainland Land Transport' : language === 'ja' ? '本島陸路移動' : '本島陸運順行')}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {!isDestIsland ? (
                    language === 'en' ? (
                      <>
                        <b>[{locCity?.name || city.name}]</b> is on the main island of Taiwan. Intra-city travel does not include flights or ferries. Moving around attractions is recommended via <b>driving/rental car, THSR, TRA train, bus, or scooter</b> for seamless travel.
                      </>
                    ) : language === 'ja' ? (
                      <>
                        <b>【{locCity?.name || city.name}】</b>は台湾本島に位置するため、市内移動における航空便や旅客船の選択肢は制限されています。観光スポット間の移動は<b>自動車・レンタカー、新幹線、在来線台鉄、観光バス、またはスクーター</b>の利用が最もスムーズです。
                      </>
                    ) : (
                      <>
                        <b>【{city.name}】</b>為臺灣本島縣市，在城市內部移動依規<b>不提供飛機或客輪</b>選項（海空交通僅保留於本島跨海抵達離島、或目標縣市為離島範圍時適用）。市區與各大景點移動建議以<b>汽車自駕、高鐵接駁、台鐵幹線、公車客運或租借機車慢遊</b>，動線更為流暢無縫。
                      </>
                    )
                  ) : !hasFlight && !hasFerry ? (
                    language === 'en' ? (
                      <>
                        Routing check: <b>[{locCity?.name || city.name}]</b> currently has no direct scheduled flights or ferries. Options have been locked. Please use alternative transportation.
                      </>
                    ) : language === 'ja' ? (
                      <>
                        航路確認結果：<b>【{locCity?.name || city.name}】</b>への直行定期航空便および定期船の運航が確認できないため、選択肢をロックしました。他の交通手段をご検討ください。
                      </>
                    ) : (
                      <>
                        經航線即時查核，<b>【{city.name}】</b>目前無直達定期民航客運航班與定期客輪渡輪航線，系統已自動為您<b>鎖定「飛機」與「船」</b>選項。<b>請改用其他交通工具</b>進行旅遊路線規劃。
                      </>
                    )
                  ) : !hasFlight ? (
                    language === 'en' ? (
                      <>
                        Routing check: <b>[{locCity?.name || city.name}]</b> has no direct flights. Flight option locked. Please take scheduled ferries from transit ports.
                      </>
                    ) : language === 'ja' ? (
                      <>
                        航路確認結果：<b>【{locCity?.name || city.name}】</b>への定期航空便がないため、航空便をロックしました。定期フェリーまたは連絡港からの客船をご利用ください。
                      </>
                    ) : (
                      <>
                        經航線即時查核，<b>【{city.name}】</b>無直達定期民航客運航班，已為您<b>鎖定「飛機」</b>選項。<b>請改用定期客輪</b>或由轉運港口搭船前往。
                      </>
                    )
                  ) : !hasFerry ? (
                    language === 'en' ? (
                      <>
                        Routing check: <b>[{locCity?.name || city.name}]</b> has no direct ferries. Ferry option locked. Please take domestic direct flights.
                      </>
                    ) : language === 'ja' ? (
                      <>
                        航路確認結果：<b>【{locCity?.name || city.name}】</b>への定期フェリー航路がないため、船便をロックしました。国内線直行航空便をご利用ください。
                      </>
                    ) : (
                      <>
                        經航線即時查核，<b>【{city.name}】</b>無直達定期客輪渡輪航線，已為您<b>鎖定「船」</b>選項。<b>請改搭國內航班直飛</b>前往。
                      </>
                    )
                  ) : (
                    language === 'en' ? (
                      <>
                        Routing verified: <b>[{locCity?.name || city.name}]</b> is an outlying island with both scheduled domestic flights and passenger ferries!
                      </>
                    ) : language === 'ja' ? (
                      <>
                        航路確認完了：<b>【{locCity?.name || city.name}】</b>は離島エリアであり、定期航空便と定期船の両方に対応しています。
                      </>
                    ) : (
                      <>
                        航線查核完成：<b>【{city.name}】</b>為離島範圍，支援定期國內航班與客輪渡輪直達！您可自由選擇搭機快速抵達或搭船賞海景。
                      </>
                    )
                  )}
                </p>
              </div>
            </div>

            {/* Generator Action Button */}
            <div className="pt-1">
              <button
                onClick={() => handleGenerateItinerary()}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer outline-none focus:outline-none select-none overflow-hidden"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-300" />
                )}
                <span>
                  {isGenerating
                    ? (language === 'en'
                        ? `Calculating optimal ${selectedDays}-day route for ${locCity?.name || city.name}...`
                        : language === 'ja'
                        ? `所要時間と交通を考慮し【${locCity?.name || city.name}】${selectedDays}日間ルートを計算中...`
                        : `正在以時間距離與交通考量計算 ${city.name} ${selectedDays} 天最佳路線...`)
                    : (language === 'en'
                        ? `Generate ${selectedDays}-Day Smart Custom Itinerary for ${locCity?.name || city.name}`
                        : language === 'ja'
                        ? `【${locCity?.name || city.name}】${selectedDays}日間スマート旅程を生成`
                        : `一鍵生成 ${city.name} ${selectedDays} 天智慧客製化旅程`)}
                </span>
              </button>
            </div>

            {/* Generating State */}
            {isGenerating && (
              <div className="p-6 bg-white rounded-2xl border border-blue-200 text-center space-y-2 shadow-xs">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  {language === 'en'
                    ? `AI Engine is computing the optimal non-backtracking route for ${locCity?.name || city.name}...`
                    : language === 'ja'
                    ? `Geminiエンジンが【${locCity?.name || city.name}】の最適化順路を精算中...`
                    : `Gemini 伺服器端引擎正在精算 ${city.name} 順向無折返最佳動線...`}
                </p>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? `Harmonizing certified venues, local produce, factory workshops & seamless transport${keepSameHotel ? ' with consecutive stay' : ''}`
                    : language === 'ja'
                    ? `公認施設、農水畜産物、観光工場体験、交通乗り継ぎを総合調和${keepSameHotel ? '（連泊設定適用）' : ''}`
                    : `融合特定場館正式名稱、在地農漁牧特產、觀光工廠手作、交通工具銜接${keepSameHotel ? '與連住不換房配置' : ''}`}
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Generated Itinerary Display */}
            {itinerary && !isGenerating && (
              <div className="space-y-4 pt-2 animate-fade-in">
                {/* Overview Card: 本次行程規劃 */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {locItinerary?.cityName || itinerary.cityName}{' '}
                        {language === 'en'
                          ? `${itinerary.days}-Day Optimized Route`
                          : language === 'ja'
                          ? `${itinerary.days}日間 最適化ルート`
                          : `${itinerary.days} 日遊最佳化路線`}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {locItinerary?.travelStyle || itinerary.travelStyle} • {locItinerary?.transportMode || itinerary.transportMode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 再次生成行程 按鈕 */}
                      <button
                        type="button"
                        onClick={() => handleGenerateItinerary(undefined, true)}
                        disabled={isGenerating}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 text-indigo-700 border border-indigo-200 hover:border-indigo-300"
                        title={language === 'en' ? 'Regenerate Itinerary' : language === 'ja' ? '別のプランを再生成' : '再次生成行程'}
                      >
                        <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>
                          {isGenerating
                            ? (language === 'en' ? 'Generating...' : language === 'ja' ? '生成中...' : '生成中...')
                            : (language === 'en'
                                ? 'Regenerate'
                                : language === 'ja'
                                ? '再生成'
                                : '再次生成行程')}
                        </span>
                      </button>

                      {/* 收藏此行程 按鈕 (全部整套收藏) */}
                      <button
                        onClick={handleToggleSave}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                          savedId
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300'
                        }`}
                        title={savedId ? t.removeSaved : t.saveItinerary}
                      >
                        {savedId ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                            <span>
                              {language === 'en'
                                ? `Saved (${itinerary.days}-Day Trip)`
                                : language === 'ja'
                                ? `全日程保存済み (${itinerary.days}日間)`
                                : `已全部收藏 (${itinerary.days}日遊)`}
                            </span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4 text-blue-600" />
                            <span>
                              {language === 'en'
                                ? 'Save Entire Trip'
                                : language === 'ja'
                                ? '旅程全体を保存'
                                : '全部收藏此行程'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Save Toast Notification */}
                  {saveToast && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-medium animate-fade-in">
                      <BookmarkCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{saveToast}</span>
                    </div>
                  )}

                  {/* Itinerary Overview (Clean and sanitized without redundant prompt/meta labels) */}
                  {(locItinerary?.overview || itinerary.overview) && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-100/80 p-3 rounded-xl border border-slate-200/80">
                      {sanitizeAirConditioningText(locItinerary?.overview || itinerary.overview)}
                    </p>
                  )}

                  {(locItinerary?.transitNotice || itinerary.transitNotice) && (
                    <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{locItinerary?.transitNotice || itinerary.transitNotice}</span>
                    </p>
                  )}

                  {/* Requirement: 離島縣市有要有晚上航班或船的交通方式 */}
                  {itinerary.islandNightTransit && (
                    <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl text-xs space-y-2">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                        <Moon className="w-4 h-4 text-purple-700 shrink-0" />
                        <span>
                          {language === 'en'
                            ? `Evening Ferry & Flight Return Guide (${locItinerary?.islandNightTransit?.destinationName || itinerary.islandNightTransit.destinationName})`
                            : language === 'ja'
                            ? `離島夜間便・復路時刻案内（${locItinerary?.islandNightTransit?.destinationName || itinerary.islandNightTransit.destinationName}）`
                            : `離島晚間航班與船班返程時刻指引（${itinerary.islandNightTransit.destinationName}）`}
                        </span>
                      </div>
                      {(locItinerary?.islandNightTransit?.flightNightNotice || itinerary.islandNightTransit.flightNightNotice) && (
                        <div className="p-2.5 bg-white/90 rounded-xl border border-purple-100 text-slate-700 flex items-start gap-2">
                          <Plane className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>
                            {(locItinerary?.islandNightTransit?.flightNightNotice || itinerary.islandNightTransit.flightNightNotice)?.replace(/^[✈️\s]+/, '')}
                          </span>
                        </div>
                      )}
                      {(locItinerary?.islandNightTransit?.ferryNightNotice || itinerary.islandNightTransit.ferryNightNotice) && (
                        <div className="p-2.5 bg-white/90 rounded-xl border border-purple-100 text-slate-700 flex items-start gap-2">
                          <Ship className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                          <span>
                            {(locItinerary?.islandNightTransit?.ferryNightNotice || itinerary.islandNightTransit.ferryNightNotice)?.replace(/^[🚢\s]+/, '')}
                          </span>
                        </div>
                      )}
                      {(locItinerary?.islandNightTransit?.generalAdvice || itinerary.islandNightTransit.generalAdvice) && (
                        <div className="text-[11px] text-purple-950 font-medium px-2.5 py-1.5 bg-purple-100/70 rounded-lg flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                          <span>
                            {(locItinerary?.islandNightTransit?.generalAdvice || itinerary.islandNightTransit.generalAdvice)?.replace(/^[💡⚠️\s]+/, '')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Day-by-Day Timeline */}
                {(locItinerary?.itinerary || itinerary.itinerary).map((dayItem) => (
                  <div
                    key={dayItem.day}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                  >
                    <div className="bg-slate-100 px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-200 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                          {dayItem.day}
                        </span>
                        <span className="font-bold text-sm text-slate-800">{dayItem.title}</span>
                        {/* Requirement: 當使用者選擇一日遊不要顯示首晚建議入住 */}
                        {itinerary.days === 1 ? (
                          <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                            <Car className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {language === 'en'
                                ? 'Day trip returns home (No stay needed)'
                                : language === 'ja'
                                ? '日帰り旅行（宿泊不要）'
                                : '一日遊圓滿賦歸（無住宿需求）'}
                            </span>
                          </span>
                        ) : dayItem.stayHotel ? (
                          <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-indigo-200">
                            <Hotel className="w-3.5 h-3.5" />
                            <span>{dayItem.stayHotel}</span>
                          </span>
                        ) : null}
                      </div>

                      {/* UI Button: 當天一整天行程收藏 */}
                      <button
                        onClick={() => handleToggleSaveDay(dayItem)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                          savedDayMap[dayItem.day]
                            ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
                        }`}
                        title={savedDayMap[dayItem.day] ? t.removeSaved : t.saveDayItinerary}
                      >
                        {savedDayMap[dayItem.day] ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-700 fill-indigo-600" />
                            <span>
                              {language === 'en'
                                ? `Saved Day ${dayItem.day}`
                                : language === 'ja'
                                ? `第${dayItem.day}日を保存済み`
                                : `已收藏第 ${dayItem.day} 天整日`}
                            </span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              {language === 'en'
                                ? 'Save Day'
                                : language === 'ja'
                                ? 'この日の行程を保存'
                                : '收藏當天行程'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {dayItem.routeArea && (
                      <div className="px-4 py-2.5 bg-sky-50/80 border-b border-sky-100 flex items-center gap-2 text-xs text-sky-950 font-semibold">
                        <Compass className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{language === 'en' ? 'Exploration Axis: ' : language === 'ja' ? '当日探索軸エリア：' : '當日探索軸線區域：'}{dayItem.routeArea}</span>
                      </div>
                    )}

                    <div className="p-4 space-y-4">
                      {/* Morning departure from previous night's hotel (for Day 2+) */}
                      {dayItem.morningDepartureFromStay && (
                        <div className="p-3 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-amber-950">
                              <Hotel className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>
                                {language === 'en'
                                  ? `Morning Departure from Stay: [${dayItem.morningDepartureFromStay.hotelName}]`
                                  : language === 'ja'
                                  ? `朝の出発・昨宿より：【${dayItem.morningDepartureFromStay.hotelName}】`
                                  : `晨間啟程・自昨宿出發：【${dayItem.morningDepartureFromStay.hotelName}】`}
                              </span>
                            </div>
                            <span className="font-extrabold text-amber-800 bg-white/90 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                              {dayItem.morningDepartureFromStay.durationText}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600 text-[11px]">
                            <span>
                              {language === 'en'
                                ? `Transit to 1st stop [${dayItem.morningDepartureFromStay.toSpotName}], approx. ${dayItem.morningDepartureFromStay.distanceKm} km.`
                                : language === 'ja'
                                ? `第1スポット【${dayItem.morningDepartureFromStay.toSpotName}】へ移動（約${dayItem.morningDepartureFromStay.distanceKm} km）。`
                                : `前往本日第一站【${dayItem.morningDepartureFromStay.toSpotName}】，預估行車距離約 ${dayItem.morningDepartureFromStay.distanceKm} 公里。`}
                            </span>
                            <a
                              href={dayItem.morningDepartureFromStay.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-md transition-colors"
                            >
                              <MapPin className="w-3 h-3 text-amber-800" />
                              <span>{language === 'en' ? 'Google Maps Route' : language === 'ja' ? 'Googleマップ案内' : 'Google Maps 路線導航'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {dayItem.spots.map((spot, sIdx) => {
                        const hasEveningStay = Boolean(dayItem.stayRecommendation && itinerary.days > 1 && dayItem.day < itinerary.days);
                        const isLastSpot = sIdx === dayItem.spots.length - 1;
                        return (
                        <div
                          key={sIdx}
                          className={`relative pl-6 border-l-2 ${(!isLastSpot || hasEveningStay) ? 'border-blue-300 pb-4' : 'border-transparent pb-0'}`}
                        >
                          <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3 text-blue-600" />
                                <span>
                                  {language === 'en' ? 'Suggested Time: ' : language === 'ja' ? 'おすすめ時間：' : '建議遊玩：'}{spot.time}
                                </span>
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {language === 'en'
                                  ? `Stay approx. ${spot.duration}`
                                  : language === 'ja'
                                  ? `滞在約 ${spot.duration}`
                                  : `停留約 ${spot.duration}`}
                              </span>
                            </div>

                            {/* Requirement: 場館的營業時間和推薦遊玩時間需要搭配 不能景點17點打烊 推薦行程安排在21點 */}
                            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                              {spot.timeSlot && (
                                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                  {spot.timeSlot === 'morning'
                                    ? (language === 'en' ? '🌅 Morning' : language === 'ja' ? '🌅 午前' : '🌅 早晨時段')
                                    : spot.timeSlot === 'afternoon'
                                    ? (language === 'en' ? '☀️ Afternoon' : language === 'ja' ? '☀️ 午後' : '☀️ 午後時段')
                                    : (language === 'en' ? '🌙 Evening' : language === 'ja' ? '🌙 夜間' : '🌙 夜間時段')}
                                </span>
                              )}
                              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {language === 'en' ? 'Hours: ' : language === 'ja' ? '営業時間：' : '營業時間：'}
                                {spot.operatingHours || '09:00 - 17:00'}
                              </span>
                              {spot.indoorAc && (
                                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-cyan-100 text-cyan-900 border border-cyan-200 flex items-center gap-1">
                                  <span>❄️</span>
                                  <span>{language === 'en' ? 'Air-Conditioned' : language === 'ja' ? '冷房完備（屋内）' : '部分場館有提供冷氣'}</span>
                                </span>
                              )}
                              {spot.isNightSpot ? (
                                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                  {language === 'en'
                                    ? '🌙 Night Venue・Open late into evening'
                                    : language === 'ja'
                                    ? '🌙 夜間スポット・深夜まで営業'
                                    : '🌙 夜晚特色行程・熱鬧營業至深夜'}
                                </span>
                              ) : (
                                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  {language === 'en'
                                    ? '☀️ Daytime Venue・Closes around 17:00'
                                    : language === 'ja'
                                    ? '☀️ 昼間スポット・17:00閉館'
                                    : '☀️ 日間場館・17:00 打烊前準時參觀完畢'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-black text-slate-900 text-sm sm:text-base">
                                {spot.name}
                              </h5>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSaveSpot(spot, dayItem.day);
                                }}
                                className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-2xs active:scale-95 ${
                                  savedSpotMap[spot.name]
                                    ? 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200'
                                }`}
                                title={savedSpotMap[spot.name] ? '取消收藏景點' : '收藏此景點至收藏夾'}
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${
                                    savedSpotMap[spot.name] ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
                                  }`}
                                />
                                <span className="text-[11px]">
                                  {savedSpotMap[spot.name]
                                    ? (language === 'en' ? 'Saved' : language === 'ja' ? '保存済' : '已收藏')
                                    : (language === 'en' ? 'Save Spot' : language === 'ja' ? 'スポット保存' : '收藏景點')}
                                </span>
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {spot.intro}
                            </p>

                            {/* Requirement: 移動建議 */}
                            {spot.transportTip && (
                              <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                                <Car className="w-3 h-3 text-slate-400" />
                                <span>
                                  {language === 'en' ? 'Transit Advice: ' : language === 'ja' ? '移動アドバイス：' : '移動動線建議：'}
                                  {spot.transportTip}
                                </span>
                              </div>
                            )}

                            {/* Spot Location Search Link */}
                            <div className="pt-0.5">
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  spot.googleMapsKeyword || spot.name
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold bg-blue-50/70 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                <MapPin className="w-3 h-3 text-rose-500" />
                                <span>{language === 'en' ? 'View info on Google Maps' : language === 'ja' ? 'Googleマップでスポット情報を見る' : '在 Google Maps 查看本景點資訊'}</span>
                                <ExternalLink className="w-3 h-3 text-blue-400" />
                              </a>
                            </div>

                            {/* Requirement: 景點到景點的交通時間需連動 Google Map，依照正確的交通時間調整 */}
                            {sIdx < dayItem.spots.length - 1 && (
                              <div className="mt-2.5 p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 space-y-2 transition-colors">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-wrap text-xs">
                                    <TransitIcon text={spot.transportToNext} className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="font-bold text-slate-700">
                                      {spot.nextSpotName
                                        ? (language === 'en' ? `To next stop [${spot.nextSpotName}]: ` : language === 'ja' ? `次のスポット【${spot.nextSpotName}】へ：` : `前往下一站【${spot.nextSpotName}】：`)
                                        : (language === 'en' ? 'Transit to next stop: ' : language === 'ja' ? '次のスポットへの交通：' : '前往下一站交通：')}
                                    </span>
                                    <span className="font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md text-xs">
                                      {spot.nextLegDurationText || spot.transportToNext}
                                    </span>
                                  </div>

                                  {spot.nextLegMapsUrl && (
                                    <a
                                      href={spot.nextLegMapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                                      title={language === 'en' ? 'Live Google Maps Route' : language === 'ja' ? 'Googleマップ即時ナビ連動' : '連動 Google Maps 即時路線導航'}
                                    >
                                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>{language === 'en' ? 'Live Google Maps Route' : language === 'ja' ? 'Googleマップ即時ナビ連動' : '連動 Google Maps 即時路線導航'}</span>
                                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                                    </a>
                                  )}
                                </div>

                                {spot.nextLegWarning && (
                                  <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>{spot.nextLegWarning}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );})}

                      {/* Requirement: 若遊玩有住宿需要標記住宿地點和交通時間；若使用者維持同住宿，也要在每天的最後行程加入住宿休息場館；若不同間也要結合 google map 計算好交通時間距離和住宿場域 */}
                      {dayItem.stayRecommendation && itinerary.days > 1 && dayItem.day < itinerary.days && (
                        <div className="relative pl-6 border-l-2 border-transparent pt-1">
                          {/* Timeline node icon */}
                          <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                            <Hotel className="w-2.5 h-2.5" />
                          </div>

                          <div className="p-4 bg-gradient-to-br from-indigo-50/95 via-purple-50/40 to-blue-50/60 border-2 border-indigo-200/90 rounded-2xl shadow-xs space-y-3">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-indigo-900 bg-indigo-100/90 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-indigo-200/70">
                                  <Moon className="w-3.5 h-3.5 text-indigo-700" />
                                  <span>
                                    {language === 'en'
                                      ? 'Evening Stay & Rest Venue (20:00+)'
                                      : language === 'ja'
                                      ? '夜宿・宿泊休憩施設（20:00〜）'
                                      : '夜宿休息場館（20:00 起入住休息）'}
                                  </span>
                                </span>
                                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                                  {effectiveKeepSameHotel
                                    ? (language === 'en' ? 'Consecutive Stay' : language === 'ja' ? '連泊宿' : '維持原宿・連泊')
                                    : (language === 'en' ? 'Daily Axis Stay' : language === 'ja' ? 'エリア特色宿' : '探索軸線特色旅宿')}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200/70">
                                  📍 {dayItem.stayRecommendation.location_type}
                                </span>
                                {dayItem.stayRecommendation.property_type && (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200/70">
                                    🏨 {dayItem.stayRecommendation.property_type}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Hotel Name, Price Range & Features */}
                            {(() => {
                              const hotelDetails = findHotelDetails(city.name, dayItem.stayRecommendation.hotel_name, language);
                              const hotelPrice = dayItem.stayRecommendation.price_range || hotelDetails.priceRange;
                              const hotelMapsQuery = dayItem.stayRecommendation.googleMapsQuery || `${dayItem.stayRecommendation.hotel_name} ${city.name}`;
                              const hotelMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelMapsQuery)}`;

                              return (
                                <>
                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <h4 className="text-base font-black text-indigo-950 flex items-center gap-2">
                                        <span>🏨 {dayItem.stayRecommendation.hotel_name}</span>
                                      </h4>
                                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-950 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                                        <span className="text-amber-700 font-medium">
                                          {language === 'en' ? 'Est. Price:' : language === 'ja' ? '参考価格:' : '房間大概價位:'}
                                        </span>
                                        <span className="font-extrabold text-amber-950">{hotelPrice}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                      {dayItem.stayRecommendation.feature}
                                    </p>
                                  </div>

                                  {/* Transit details from last spot to hotel */}
                                  <div className="p-3 bg-white/95 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                      <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
                                        <Car className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span>
                                          {dayItem.spots && dayItem.spots.length > 0
                                            ? (language === 'en'
                                                ? `Transit from last stop [${dayItem.spots[dayItem.spots.length - 1]?.name}]:`
                                                : language === 'ja'
                                                ? `最終スポット【${dayItem.spots[dayItem.spots.length - 1]?.name}】からの移動：`
                                                : `自本日最後一站【${dayItem.spots[dayItem.spots.length - 1]?.name}】前往：`)
                                            : (language === 'en' ? 'Transit to Stay:' : language === 'ja' ? '宿泊先への交通：' : '前往住宿交通：')}
                                        </span>
                                      </div>
                                      <span className="font-extrabold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                                        {dayItem.stayRecommendation.durationText
                                          ? dayItem.stayRecommendation.durationText
                                          : (language === 'en' ? 'Est. drive 12-18 mins' : language === 'ja' ? '車で約12〜18分' : '預估車程約 12-18 分鐘')}
                                      </span>
                                    </div>

                                    {dayItem.stayRecommendation.geographic_continuity && (
                                      <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1.5 border-t border-slate-100">
                                        <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                        <span>
                                          <span className="font-semibold text-slate-800">
                                            {language === 'en' ? 'Transit Advantage: ' : language === 'ja' ? '動線メリット：' : '動線銜接優勢：'}
                                          </span>
                                          {dayItem.stayRecommendation.geographic_continuity}
                                        </span>
                                      </div>
                                    )}

                                    {/* Google Maps link directly to hotel */}
                                    <div className="pt-1.5 flex flex-wrap gap-2">
                                      <a
                                        href={hotelMapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                                      >
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span>
                                          {language === 'en' ? 'View Hotel on Google Maps' : language === 'ja' ? 'Googleマップで宿を見る' : '在 Google Maps 查看旅宿資訊'}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                                      </a>

                                      <a
                                        href={
                                          dayItem.stayRecommendation.googleMapsUrl ||
                                          `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(dayItem.spots[dayItem.spots.length - 1]?.name || city.name)}&destination=${encodeURIComponent(`${dayItem.stayRecommendation.hotel_name} ${city.name}`)}&travelmode=driving`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-98"
                                      >
                                        <Navigation className="w-3.5 h-3.5 text-white" />
                                        <span>
                                          {language === 'en'
                                            ? `Navigate to [${dayItem.stayRecommendation.hotel_name}] on Google Maps`
                                            : language === 'ja'
                                            ? `【${dayItem.stayRecommendation.hotel_name}】へのGoogleマップナビを開始`
                                            : `開啟前往【${dayItem.stayRecommendation.hotel_name}】Google Maps 即時路線導航`}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-indigo-200" />
                                      </a>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}

                            {/* 若更換不同間住宿，結合 Google Maps 計算好交通時間距離 */}
                            {dayItem.stayRecommendation.transitFromPrevHotel && (
                              <div className="p-3 bg-gradient-to-r from-teal-50/90 via-cyan-50/70 to-indigo-50/90 rounded-xl border border-teal-200 text-xs space-y-2 shadow-2xs">
                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                  <div className="flex items-center gap-1.5 font-bold text-teal-950">
                                    <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    <span>
                                      {language === 'en'
                                        ? 'Different Hotel Transfer (Google Maps Transit & Distance)'
                                        : language === 'ja'
                                        ? '異なる宿泊施設への移動（Googleマップ所要時間・距離計算）'
                                        : '更換不同間住宿（結合 Google Maps 計算交通時間與距離）'}
                                    </span>
                                  </div>
                                  <span className="font-extrabold text-teal-800 bg-white/90 border border-teal-200 px-2.5 py-0.5 rounded-md text-[11px]">
                                    {dayItem.stayRecommendation.transitFromPrevHotel.durationText}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-700 leading-relaxed">
                                  {language === 'en'
                                    ? `Direct route between accommodations: from [${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}] to [${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}], total road distance approx. ${dayItem.stayRecommendation.transitFromPrevHotel.distanceKm} km.`
                                    : language === 'ja'
                                    ? `宿泊施設間の移動ルート：【${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}】から【${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}】まで、走行距離約 ${dayItem.stayRecommendation.transitFromPrevHotel.distanceKm} km。`
                                    : `旅宿間直接移動路徑：自前晚【${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}】前往本晚【${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}】，總行車距離約 ${dayItem.stayRecommendation.transitFromPrevHotel.distanceKm} 公里。`}
                                </p>
                                <a
                                  href={dayItem.stayRecommendation.transitFromPrevHotel.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 bg-white hover:bg-teal-100 border border-teal-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                                  <span>
                                    {language === 'en'
                                      ? `View [${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}] ➔ [${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}] on Google Maps`
                                      : language === 'ja'
                                      ? `【${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}】➔【${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}】のGoogleマップルートを見る`
                                      : `在 Google Maps 查看【${dayItem.stayRecommendation.transitFromPrevHotel.prevHotelName}】➔【${dayItem.stayRecommendation.transitFromPrevHotel.nextHotelName}】路線導航`}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-teal-500" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirement: 旅程中若一日往返或旅程最後一天，才增加定位返程路線指引 */}
                      {dayItem.returnTrip && (itinerary.days === 1 || dayItem.day === itinerary.days) && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200 shadow-xs space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-blue-950 font-bold text-xs sm:text-sm">
                              <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>
                                {language === 'en'
                                  ? `Return Route to Departure Point (Back to [${dayItem.returnTrip.destinationName}])`
                                  : language === 'ja'
                                  ? `出発地への復路ルート案内（【${dayItem.returnTrip.destinationName}】へ戻る）`
                                  : `定位點返程路線指引（返回【${dayItem.returnTrip.destinationName}】）`}
                              </span>
                            </div>
                            <span className="text-xs font-black text-blue-800 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                              {language === 'en'
                                ? `Est. ${dayItem.returnTrip.durationText}`
                                : language === 'ja'
                                ? `推定 ${dayItem.returnTrip.durationText}`
                                : `預估 ${dayItem.returnTrip.durationText}`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {language === 'en'
                              ? `After the last stop [${dayItem.spots[dayItem.spots.length - 1]?.name}], return to departure point [${dayItem.returnTrip.destinationName}], total driving distance approx. ${dayItem.returnTrip.distanceKm} km.`
                              : language === 'ja'
                              ? `本日の最終スポット【${dayItem.spots[dayItem.spots.length - 1]?.name}】から出発地【${dayItem.returnTrip.destinationName}】への復路、総走行距離は約 ${dayItem.returnTrip.distanceKm} km です。`
                              : `今日最後一站【${dayItem.spots[dayItem.spots.length - 1]?.name}】結束後，由該景點出發返抵出發定位點【${dayItem.returnTrip.destinationName}】，總行車距離約 ${dayItem.returnTrip.distanceKm} 公里。`}
                          </p>
                          <a
                            href={dayItem.returnTrip.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-98"
                          >
                            <MapPin className="w-3.5 h-3.5 text-white" />
                            <span>
                              {language === 'en'
                                ? 'Open Return Route on Google Maps'
                                : language === 'ja'
                                ? '出発地への復路Googleマップナビを開始'
                                : '開啟返回定位點之 Google Maps 即時路線導航'}
                            </span>
                            <ExternalLink className="w-3 h-3 text-blue-200" />
                          </a>
                        </div>
                      )}

                      {/* Required Feature: UI Button to view full day route in Google Maps */}
                      <div className="pt-2">
                        <a
                          href={getGoogleMapsDirectionsUrl(
                            dayItem.spots,
                            dayItem.day < itinerary.days && itinerary.days > 1 ? dayItem.stayRecommendation?.hotel_name : undefined
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm active:scale-98"
                        >
                          <MapPin className="w-4 h-4 text-white" />
                          <span>
                            {language === 'en'
                              ? `Open Day ${dayItem.day} Full Day Multi-Stop Route on Google Maps`
                              : language === 'ja'
                              ? `Googleマップで第${dayItem.day}日の周遊ルートナビを開く`
                              : `在 Google Maps 中開啟第 ${dayItem.day} 天全天多點行程路線導航`}
                          </span>
                          <ExternalLink className="w-4 h-4 text-emerald-200" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 再次生成行程 Action Card */}
                <div className="p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 rounded-2xl border border-indigo-200/80 text-center space-y-2.5">
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'en'
                      ? 'Looking for more options? Generate a brand new plan tailored to your chosen days, theme, and accommodations.'
                      : language === 'ja'
                      ? '他のスポットも見てみたいですか？選択した日数・テーマ・宿泊条件に合わせて旅程を再生成します。'
                      : '想看看其他景點安排嗎？依照您選擇的天數、主題與住宿偏好再次生成全新旅遊行程！'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleGenerateItinerary(undefined, true)}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                  >
                    <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>
                      {isGenerating
                        ? (language === 'en' ? 'Generating...' : language === 'ja' ? '生成中...' : '生成中...')
                        : (language === 'en'
                            ? 'Regenerate Itinerary'
                            : language === 'ja'
                            ? '旅程を再生成'
                            : '再次生成')}
                    </span>
                  </button>
                </div>

                {/* Itinerary Disclaimer */}
                {itinerary.disclaimer && (
                  <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center border border-slate-200">
                    {itinerary.disclaimer}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center shrink-0">
          <button
            onClick={handleOpenGoogleMapsCity}
            className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>
              {language === 'en'
                ? `Explore all attractions in ${locCity?.name || city.name} on Google Maps`
                : language === 'ja'
                ? `Googleマップで【${locCity?.name || city.name}】全域を探索`
                : `在 Google 地圖上探索 ${city.name} 全域景點`}
            </span>
          </button>
        </div>
      </div>

      {/* 收藏夾已額滿 (20/20) 專屬 UI 彈窗 */}
      {showLimitReachedModal && (
        <div className="fixed inset-0 z-[90] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowLimitReachedModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>
                  {language === 'en'
                    ? 'Favorites Limit Reached (20/20)'
                    : language === 'ja'
                    ? 'お気に入り保存上限（20/20件）'
                    : '收藏夾已額滿（20 / 20 筆上限）'}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Your favorites collection has reached the maximum of 20 items. To bookmark new itineraries or spots, please manage or remove existing items first.'
                  : language === 'ja'
                  ? 'お気に入りの保存数が最大上限の20件に達しました。新しい旅程やスポットを保存するには、不要な項目を削除・整理してください。'
                  : '您的個人收藏夾已達到 20 筆上限（包含整套行程、單日規劃與精選景點）。若想收藏新的景點或行程，請先整理或移除已不需要的項目。'}
              </p>
            </div>

            {/* 容量使用量進度條 */}
            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200/90 space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-950">
                <span>{language === 'en' ? 'Storage Status' : language === 'ja' ? '保存容量' : '收藏庫狀態'}</span>
                <span className="font-mono text-amber-800">
                  {currentTotalSaved} / {MAX_SAVED_LIMIT} ({language === 'en' ? 'Full' : language === 'ja' ? '満杯' : '已額滿'})
                </span>
              </div>
              <div className="w-full h-2.5 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-full"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {onOpenSavedModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowLimitReachedModal(false);
                    onOpenSavedModal();
                  }}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>
                    {language === 'en'
                      ? 'Manage Saved Spots'
                      : language === 'ja'
                      ? 'お気に入りを整理'
                      : '立即前往更改/整理景點'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowLimitReachedModal(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                {language === 'en' ? 'Close' : language === 'ja' ? '閉じる' : '關閉'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
