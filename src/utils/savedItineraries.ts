import {
  AIItineraryResponse,
  ItineraryDay,
  ItinerarySpot,
  SavedItinerary,
  SavedDayItinerary,
  SavedSpotItem
} from '../types';
import { sanitizeAirConditioningText } from './themeClassifier';
import { SupportedLanguage } from './i18n';
import {
  getLocalizedSavedItinerary,
  getLocalizedSavedDay,
  getLocalizedSavedSpot
} from './cityLocalization';

const STORAGE_KEY_FULL = 'taiwan_travel_saved_itineraries';
const STORAGE_KEY_DAYS = 'taiwan_travel_saved_day_itineraries';
const STORAGE_KEY_SPOTS = 'taiwan_travel_saved_spots';

export const MAX_SAVED_LIMIT = 20;

export const SAVED_ITINERARIES_EVENT = 'taiwan_travel_saved_itineraries_changed';

/**
 * 計算目前收藏庫中所有類型（整套、單日、景點）的總筆數
 */
export function getTotalSavedCount(): number {
  return (
    getSavedItineraries().length +
    getSavedDayItineraries().length +
    getSavedSpots().length
  );
}

/**
 * 格式化當前日期時間為繁體中文友善字串 (例：2026/09/14 14:30)
 */
function formatCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${mins}`;
}

// ==================== 1. 整套行程（全部收藏） ====================

export function getSavedItineraries(): SavedItinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FULL);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load saved itineraries from localStorage:', err);
    return [];
  }
}

export function findSavedItineraryId(itinerary: AIItineraryResponse | null): string | null {
  if (!itinerary) return null;
  const list = getSavedItineraries();
  const found = list.find((item) => {
    return (
      item.cityName === itinerary.cityName &&
      item.days === itinerary.days &&
      item.travelStyle === itinerary.travelStyle &&
      item.transportMode === itinerary.transportMode &&
      item.overview === itinerary.overview
    );
  });
  return found ? found.id : null;
}

export function saveItinerary(itinerary: AIItineraryResponse): SavedItinerary | null {
  const list = getSavedItineraries();
  const existingId = findSavedItineraryId(itinerary);

  if (existingId) {
    return list.find((item) => item.id === existingId)!;
  }

  // 檢查收藏上限是否達到 20 筆
  if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
    return null;
  }

  const newSaved: SavedItinerary = {
    id: `itin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    savedAt: formatCurrentDateTime(),
    cityName: itinerary.cityName,
    days: itinerary.days,
    travelStyle: itinerary.travelStyle,
    transportMode: itinerary.transportMode,
    overview: sanitizeAirConditioningText(itinerary.overview),
    generationId: itinerary.generationId,
    data: {
      ...itinerary,
      overview: sanitizeAirConditioningText(itinerary.overview)
    },
    tripId: `itin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `${itinerary.cityName} ${itinerary.days} 日遊最佳化路線`,
    theme: itinerary.travelStyle,
    transportType: itinerary.transportMode
  };

  const updatedList = [newSaved, ...list];
  try {
    localStorage.setItem(STORAGE_KEY_FULL, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to save itinerary to localStorage:', err);
  }

  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
  return newSaved;
}

export function removeSavedItinerary(id: string): void {
  const list = getSavedItineraries();
  const filtered = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_FULL, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to remove saved itinerary from localStorage:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
}

// ==================== 2. 當天一整個行程全部收藏（單日行程） ====================

export function getSavedDayItineraries(): SavedDayItinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAYS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load saved day itineraries:', err);
    return [];
  }
}

export function findSavedDayId(
  cityName: string,
  dayNumber: number,
  dayTitle: string,
  generationId?: string,
  spotNames?: string[]
): string | null {
  const list = getSavedDayItineraries();
  const found = list.find((item) => {
    if (generationId && item.generationId) {
      return (
        item.cityName === cityName &&
        item.dayNumber === dayNumber &&
        item.generationId === generationId
      );
    }
    // If generationId is given for a newly generated itinerary, do not falsely inherit old saved items from different sessions
    if (generationId) {
      return false;
    }
    // Fallback for saved-modal views or legacy queries
    const matchesBasic = item.cityName === cityName && item.dayNumber === dayNumber && item.dayTitle === dayTitle;
    if (!matchesBasic) return false;
    if (spotNames && spotNames.length > 0 && item.spots && item.spots.length > 0) {
      const itemSpots = item.spots.map((s) => s.name).sort().join(',');
      const currSpots = spotNames.slice().sort().join(',');
      return itemSpots === currSpots;
    }
    return true;
  });
  return found ? found.id : null;
}

export function saveDayItinerary(
  cityName: string,
  dayItem: ItineraryDay,
  travelStyle: string,
  transportMode: string,
  generationId?: string
): SavedDayItinerary | null {
  const list = getSavedDayItineraries();
  const existingId = findSavedDayId(
    cityName,
    dayItem.day,
    dayItem.title,
    generationId,
    dayItem.spots?.map((s) => s.name)
  );

  if (existingId) {
    return list.find((item) => item.id === existingId)!;
  }

  // 檢查收藏上限是否達到 20 筆
  if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
    return null;
  }

  const newSavedDay: SavedDayItinerary = {
    id: `day_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    savedAt: formatCurrentDateTime(),
    cityName,
    dayNumber: dayItem.day,
    dayTitle: dayItem.title,
    stayHotel: dayItem.stayHotel,
    travelStyle,
    transportMode,
    spots: dayItem.spots || [],
    generationId,
    dayId: `day_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    parentTripTitle: `${cityName}行程`,
    dayIndex: dayItem.day,
    dayThemeAxis: dayItem.routeArea || dayItem.title,
    schedule: (dayItem.spots || []).map((s) => ({
      spotName: s.name,
      timeRange: s.time,
      description: s.intro,
      transitToNext: s.transportToNext
    }))
  };

  const updatedList = [newSavedDay, ...list];
  try {
    localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to save day itinerary to localStorage:', err);
  }

  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
  return newSavedDay;
}

export function removeSavedDayItinerary(id: string): void {
  const list = getSavedDayItineraries();
  const filtered = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to remove saved day itinerary:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
}

// ==================== 3. 單一景點收藏 ====================

export function getSavedSpots(): SavedSpotItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPOTS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to load saved spots:', err);
    return [];
  }
}

export function findSavedSpotId(cityName: string, spotName: string): string | null {
  const list = getSavedSpots();
  const found = list.find((item) => item.cityName === cityName && item.spot.name === spotName);
  return found ? found.id : null;
}

export function saveSpotItem(cityName: string, spot: ItinerarySpot, dayNumber?: number): SavedSpotItem | null {
  const list = getSavedSpots();
  const existingId = findSavedSpotId(cityName, spot.name);

  if (existingId) {
    return list.find((item) => item.id === existingId)!;
  }

  // 檢查收藏上限是否達到 20 筆
  if (getTotalSavedCount() >= MAX_SAVED_LIMIT) {
    return null;
  }

  const googleMapsUrl = spot.nextLegMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((spot.googleMapsKeyword || spot.name) + ' ' + cityName)}`;
  const newSavedSpot: SavedSpotItem = {
    id: `spot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    savedAt: formatCurrentDateTime(),
    cityName,
    dayNumber,
    spot,
    spotName: spot.name,
    county: cityName,
    suggestedTime: spot.time,
    googleMapsUrl
  };

  const updatedList = [newSavedSpot, ...list];
  try {
    localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Failed to save spot to localStorage:', err);
  }

  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
  return newSavedSpot;
}

export function removeSavedSpotItem(id: string): void {
  const list = getSavedSpots();
  const filtered = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to remove saved spot:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
}

/**
 * 修改或更新單一收藏景點資訊（如修改備忘筆記、標籤、已踩點狀態）
 */
export function updateSavedSpotItem(
  id: string,
  updates: Partial<SavedSpotItem>
): SavedSpotItem | null {
  const list = getSavedSpots();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: SavedSpotItem = {
    ...list[index],
    ...updates,
    // 若有修改，保持 id 與 savedAt 核心識別不變
    id: list[index].id,
    savedAt: list[index].savedAt
  };

  list[index] = updated;
  try {
    localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to update saved spot in localStorage:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
  return updated;
}

/**
 * 一鍵刪除/清空收藏夾中所有收藏景點 (附防呆機制)
 */
export function clearAllSavedSpots(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SPOTS);
  } catch (err) {
    console.error('Failed to clear saved spots:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
}

/**
 * 切換不同語言時，將收藏庫中所有儲存的行程、單日與景點同步轉換為使用者所選擇之目標語言
 * 依照使用者切換語言同步更改
 */
export function syncSavedItinerariesLanguage(targetLang: SupportedLanguage): void {
  try {
    const fullList = getSavedItineraries();
    const localizedFullList = fullList.map((item) => getLocalizedSavedItinerary(item, targetLang));
    localStorage.setItem(STORAGE_KEY_FULL, JSON.stringify(localizedFullList));

    const dayList = getSavedDayItineraries();
    const localizedDayList = dayList.map((item) => getLocalizedSavedDay(item, targetLang));
    localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(localizedDayList));

    const spotList = getSavedSpots();
    const localizedSpotList = spotList.map((item) => getLocalizedSavedSpot(item, targetLang));
    localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(localizedSpotList));
  } catch (err) {
    console.error('Failed to sync saved items language in localStorage:', err);
  }
  window.dispatchEvent(new Event(SAVED_ITINERARIES_EVENT));
}

