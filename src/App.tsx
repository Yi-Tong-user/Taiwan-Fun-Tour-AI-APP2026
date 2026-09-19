/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TAIWAN_CITIES } from './data/taiwanCities';
import {
  CitySpecialty,
  SavedItinerary,
  SavedDayItinerary,
  SavedSpotItem,
  AIItineraryResponse
} from './types';
import { TaiwanMap } from './components/TaiwanMap';
import { CityDetailSheet } from './components/CityDetailSheet';
import { LocationRequestModal } from './components/LocationRequestModal';
import { LocationCorrectionModal } from './components/LocationCorrectionModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { HowToUseModal } from './components/HowToUseModal';
import { SavedItinerariesModal } from './components/SavedItinerariesModal';
import { SettingsModal } from './components/SettingsModal';
import { getTransitGuide } from './utils/transitGuide';
import { SupportedLanguage, LANGUAGE_STORAGE_KEY, translations } from './utils/i18n';
import { getLocalizedCityName, getLocalizedSavedItinerary } from './utils/cityLocalization';
import {
  getSavedItineraries,
  removeSavedItinerary,
  getSavedDayItineraries,
  removeSavedDayItinerary,
  getSavedSpots,
  removeSavedSpotItem,
  clearAllSavedSpots,
  syncSavedItinerariesLanguage,
  SAVED_ITINERARIES_EVENT
} from './utils/savedItineraries';
import {
  MapPin,
  Compass,
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Locate,
  Navigation,
  CheckCircle2,
  Calendar,
  Hotel,
  BookOpen,
  Car,
  Rocket,
  Bookmark,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Settings
} from 'lucide-react';

// Distance calculation using Haversine formula (km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  // State management: 在 APP 執行先行顯示地理位置存取請求，再跳出 AI 智慧生成免責聲明
  const [showLocationRequest, setShowLocationRequest] = useState<boolean>(true);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [isRunningRandom, setIsRunningRandom] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<CitySpecialty | null>(null);
  const [stoppedCity, setStoppedCity] = useState<CitySpecialty | null>(null);
  const [rollingCityName, setRollingCityName] = useState<string>('');
  const [showResultSheet, setShowResultSheet] = useState<boolean>(false);

  // User Geolocation (with strict local privacy protection)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [closestCityInfo, setClosestCityInfo] = useState<{ city: CitySpecialty; distance: number } | null>(null);
  const [isDepartureBannerCollapsed, setIsDepartureBannerCollapsed] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);
  const locationToastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showLocationCorrectionModal, setShowLocationCorrectionModal] = useState<boolean>(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState<boolean>(false);
  const [showHowToUseModal, setShowHowToUseModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Language settings: default to zh-TW (繁體中文)
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === 'zh-TW' || saved === 'en' || saved === 'ja')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'zh-TW';
  });

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // fallback
    }
    // 切換不同語言時，收藏夾也要更換之前儲存的所有語言，依照使用者切換語言同步更改
    syncSavedItinerariesLanguage(newLang);
    refreshAllSaved();
  };

  const t = translations[language];

  // Saved Itineraries State (localStorage: full, day, spot)
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [savedDayItineraries, setSavedDayItineraries] = useState<SavedDayItinerary[]>([]);
  const [savedSpots, setSavedSpots] = useState<SavedSpotItem[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [selectedSavedItinerary, setSelectedSavedItinerary] = useState<AIItineraryResponse | null>(null);

  const refreshAllSaved = () => {
    setSavedItineraries(getSavedItineraries());
    setSavedDayItineraries(getSavedDayItineraries());
    setSavedSpots(getSavedSpots());
  };

  useEffect(() => {
    refreshAllSaved();
    window.addEventListener(SAVED_ITINERARIES_EVENT, refreshAllSaved);
    return () => {
      window.removeEventListener(SAVED_ITINERARIES_EVENT, refreshAllSaved);
    };
  }, []);

  const totalSavedCount = savedItineraries.length + savedDayItineraries.length + savedSpots.length;

  const handleSelectSavedItinerary = (saved: SavedItinerary) => {
    const locSaved = getLocalizedSavedItinerary(saved, language);
    const targetCity =
      TAIWAN_CITIES.find((c) => c.name === saved.cityName || c.name === locSaved.cityName) ||
      TAIWAN_CITIES[0];
    setSelectedCity(targetCity);
    setStoppedCity(targetCity);
    setSelectedSavedItinerary(locSaved.data || saved.data);
    setShowSavedModal(false);
    setShowResultSheet(true);
  };

  useEffect(() => {
    // Register Service Worker for offline capability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('PWA Service Worker registered'))
        .catch((err) => console.log('Service Worker registration skipped:', err));
    }
  }, []);

  // 3-second random picking logic:
  // "在隨機選擇的狀態中需要沿著地圖邊框跑動，三秒鐘後停下"
  // "顏色方框框選隨機跑動畫區塊，直到3秒鐘停止移動的方塊地理位置則放大跳出縣市名稱"
  const handleRandomPick = () => {
    if (isRunningRandom) return;

    setSelectedSavedItinerary(null);
    setIsRunningRandom(true);
    setStoppedCity(null);
    setShowResultSheet(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const randomCity = TAIWAN_CITIES[Math.floor(Math.random() * TAIWAN_CITIES.length)];
      setRollingCityName(randomCity.name);

      // Stop exactly after 3000ms (3 seconds)
      if (elapsed >= 3000) {
        clearInterval(interval);
        const finalChoice = TAIWAN_CITIES[Math.floor(Math.random() * TAIWAN_CITIES.length)];
        setRollingCityName(finalChoice.name);
        setSelectedCity(finalChoice);
        setStoppedCity(finalChoice);
        setIsRunningRandom(false);

        // Allow 700ms for user to admire the magnified geographic popout before sheet opens
        setTimeout(() => {
          setShowResultSheet(true);
        }, 700);
      }
    }, 90);
  };

  // Device-only Geolocation with privacy protection and manual correction support
  const handleGetLocation = () => {
    setIsLocating(true);

    const show5sLocationToast = (msg: string) => {
      if (locationToastTimerRef.current) {
        clearTimeout(locationToastTimerRef.current);
      }
      setLocationToast(msg);
      locationToastTimerRef.current = setTimeout(() => {
        setLocationToast(null);
        locationToastTimerRef.current = null;
      }, 5000);
    };

    const applyLocationCoords = (lat: number, lng: number) => {
      const loc = { lat, lng };
      setUserLocation(loc);
      setIsLocating(false);

      // Find nearest Taiwan city
      let nearest = TAIWAN_CITIES[0];
      let minDis = 999999;
      TAIWAN_CITIES.forEach((c) => {
        const d = getDistanceKm(loc.lat, loc.lng, c.lat, c.lng);
        if (d < minDis) {
          minDis = d;
          nearest = c;
        }
      });
      const roundedDis = Math.round(minDis * 10) / 10;
      setClosestCityInfo({ city: nearest, distance: roundedDis });

      // Visual confirmation toast (顯示5秒之後自動隱藏)
      const localizedCity = getLocalizedCityName(nearest.name, language);
      const toastMsg = language === 'en'
        ? `📍 Located: nearest ${localizedCity} (${roundedDis} km). Tap 'Edit' to change.`
        : language === 'ja'
        ? `📍 位置情報を取得しました：最寄り ${localizedCity} (${roundedDis} km)。異なる場合は「修正」をタップ。`
        : `📍 已完成定位！離您最近：${nearest.name} (${roundedDis} 公里)。若有偏差可點擊「更正」調整。`;

      show5sLocationToast(toastMsg);
    };

    if (!navigator.geolocation) {
      setIsLocating(false);
      setShowLocationCorrectionModal(true);
      return;
    }

    // Step 1: Use standard geolocation with 12s timeout to allow user interaction
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocationCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err1) => {
        console.warn('High-accuracy geolocation failed, falling back to network positioning:', err1);
        // Step 2: Fallback to low-accuracy Wi-Fi / IP positioning
        navigator.geolocation.getCurrentPosition(
          (pos2) => {
            applyLocationCoords(pos2.coords.latitude, pos2.coords.longitude);
          },
          (err2) => {
            console.warn('Geolocation unavailable or denied:', err2);
            setIsLocating(false);
            // If location failed or was blocked, open manual correction modal so user can pick their actual county
            setShowLocationCorrectionModal(true);
            show5sLocationToast(
              language === 'en'
                ? '⚠️ Unable to acquire exact GPS location. Please select your current county.'
                : language === 'ja'
                ? '⚠️ 正確な位置情報を取得できませんでした。滞在先の県市を選択してください。'
                : '⚠️ 未能取得瀏覽器精確定位，請直接點選您目前所在的縣市：'
            );
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 }
    );
  };

  // Manual city selection for user location (顯示5秒之後自動隱藏)
  const handleManualSelectLocation = (city: CitySpecialty) => {
    setUserLocation({ lat: city.lat, lng: city.lng });
    setClosestCityInfo({ city, distance: 0 });
    const localizedCity = getLocalizedCityName(city.name, language);

    if (locationToastTimerRef.current) {
      clearTimeout(locationToastTimerRef.current);
    }
    setLocationToast(
      language === 'en'
        ? `📍 Location set to: ${localizedCity}`
        : language === 'ja'
        ? `📍 現在地を設定しました：${localizedCity}`
        : `📍 已手動設定所在位置：${city.name}`
    );
    locationToastTimerRef.current = setTimeout(() => {
      setLocationToast(null);
      locationToastTimerRef.current = null;
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. 先行顯示地理位置存取請求 (以 image.png 取代 image (2).png，繁體中文呈現，點擊允許自動開啟定位) */}
      <LocationRequestModal
        isOpen={showLocationRequest}
        onAllow={() => {
          setShowLocationRequest(false);
          handleGetLocation();
          setShowDisclaimer(true);
        }}
        onDisallow={() => {
          setShowLocationRequest(false);
          setShowDisclaimer(true);
        }}
        language={language}
      />

      {/* 2. 再跳出 AI 智慧生成內容免責聲明 */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onConfirm={() => setShowDisclaimer(false)}
        language={language}
      />

      {/* 2.1 Location Activation Feedback Toast (黑色色塊UI顯示5秒自動隱藏，亦提供✕手動關閉) */}
      {locationToast && (
        <div 
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-blue-400/40 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in max-w-[92vw]"
          role="status"
          aria-live="polite"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="leading-snug">{locationToast}</span>
          <button
            type="button"
            onClick={() => {
              if (locationToastTimerRef.current) {
                clearTimeout(locationToastTimerRef.current);
                locationToastTimerRef.current = null;
              }
              setLocationToast(null);
            }}
            className="ml-1 p-0.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer shrink-0"
            aria-label={t.close}
            title={t.close}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Top Action Header & City Dropdown */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Brand Identity & City Dropdown */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 px-1.5 py-1 text-left select-none">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm text-sm shrink-0">
                臺
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                  {t.appName}
                </span>
                <span className="text-[10px] text-slate-500 block -mt-0.5">
                  {t.mapExplore}
                </span>
              </div>
            </div>

            {/* Requirement: 增加在臺灣好好玩的下拉選單 客製化旅程安排 選定遊玩縣市 與 應用程式完整使用說明 */}
            <div className="relative">
              <select
                id="city-dropdown-select"
                aria-label={t.selectCity}
                value={selectedCity?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const targetCity = TAIWAN_CITIES.find((c) => c.name === val);
                  if (targetCity) {
                    setSelectedSavedItinerary(null);
                    setSelectedCity(targetCity);
                    setStoppedCity(targetCity);
                    setShowResultSheet(true);
                  }
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs sm:text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer shadow-xs"
              >
                <option value="">{t.selectCityDropdownPrompt}</option>
                <optgroup label={t.northRegion}>
                  {TAIWAN_CITIES.filter((c) => c.region === '北部').map((c) => (
                    <option key={c.name} value={c.name}>
                      {getLocalizedCityName(c.name, language)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.centralRegion}>
                  {TAIWAN_CITIES.filter((c) => c.region === '中部').map((c) => (
                    <option key={c.name} value={c.name}>
                      {getLocalizedCityName(c.name, language)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.southRegion}>
                  {TAIWAN_CITIES.filter((c) => c.region === '南部').map((c) => (
                    <option key={c.name} value={c.name}>
                      {getLocalizedCityName(c.name, language)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.eastRegion}>
                  {TAIWAN_CITIES.filter((c) => c.region === '東部').map((c) => (
                    <option key={c.name} value={c.name}>
                      {getLocalizedCityName(c.name, language)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.islandRegion}>
                  {TAIWAN_CITIES.filter((c) => c.region === '離島').map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name === '琉球嶼'
                        ? (language === 'en' ? 'Liuqiu Island (Lambai)' : language === 'ja' ? '琉球嶼（小琉球）' : '琉球嶼（小琉球）')
                        : `${getLocalizedCityName(c.name, language)} (${t.islandNote})`}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Requirement: UI介面保留查看完整圖文使用指南 */}
            <button
              id="view-guide-top-btn"
              onClick={() => setShowHowToUseModal(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0 outline-none focus:outline-none select-none overflow-hidden"
              title={t.viewGuide}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-100" />
              <span>{t.viewGuide}</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 我的收藏按鈕 */}
            <button
              onClick={() => setShowSavedModal(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer outline-none focus:outline-none select-none overflow-hidden"
              title={t.savedItineraries}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-700 fill-amber-600/30" />
              <span>{t.savedItineraries}</span>
              {totalSavedCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {totalSavedCount}
                </span>
              )}
            </button>

            {/* Requirement: 開啟定位的功能與更正機制 (若自動定位有誤可隨時一鍵手動更正) */}
            <div className="flex items-center gap-1">
              <button
                id="header-location-btn"
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-xs cursor-pointer ${
                  userLocation
                    ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title={userLocation && closestCityInfo ? `${t.located}: ${closestCityInfo.city.name}` : t.openLocation}
              >
                <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : (userLocation ? 'text-emerald-600' : 'text-blue-600')}`} />
                <span className="inline">
                  {isLocating 
                    ? (language === 'en' ? 'Locating...' : language === 'ja' ? '測位中...' : '定位中...') 
                    : (userLocation && closestCityInfo 
                        ? getLocalizedCityName(closestCityInfo.city.name, language) 
                        : t.openLocation)}
                </span>
              </button>

              {userLocation && (
                <button
                  type="button"
                  onClick={() => setShowLocationCorrectionModal(true)}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  title={language === 'en' ? 'Location inaccurate? Click to correct.' : language === 'ja' ? '位置が異なる場合はクリックして修正' : '定位資訊有誤？點此手動更正真實縣市'}
                >
                  {language === 'en' ? 'Edit' : language === 'ja' ? '修正' : '更正'}
                </button>
              )}
            </div>

            {/* Privacy Guarantee Info Button */}
            <button
              onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              title={t.privacyBadge}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </button>

            {/* Requirement: 增加一個設定按鈕 在畫面右上角 */}
            <button
              id="settings-top-btn"
              onClick={() => setShowSettingsModal(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-slate-700 shrink-0"
              title={t.settings}
            >
              <Settings className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">{t.settings}</span>
            </button>
          </div>
        </div>

        {/* Privacy Notice Banner if triggered */}
        {showPrivacyNotice && (
          <div className="bg-emerald-50 border-t border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 animate-fade-in">
            <div className="max-w-6xl mx-auto flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <b>{t.privacyNoticeHeader}</b>：{t.privacyNoticeContent}
                </p>
              </div>
              <button
                onClick={() => setShowPrivacyNotice(false)}
                className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Nearest City & Departure Transit Card with Collapse / Expand functionality */}
        {closestCityInfo && isDepartureBannerCollapsed && (
          <div className="bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-blue-50/95 border-t border-blue-200 px-3 sm:px-4 py-1.5 text-xs text-slate-800 shadow-2xs">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-slate-700">
                <Locate className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="font-bold text-blue-900 truncate">
                  {t.departurePoint}：【{getLocalizedCityName(closestCityInfo.city.name, language)}】（{closestCityInfo.distance} km）
                </span>
                {selectedCity && (
                  <span className="hidden sm:inline-block text-indigo-700 font-semibold bg-indigo-100/80 px-1.5 py-0.2 rounded text-[11px] truncate">
                    ➔ 【{getLocalizedCityName(selectedCity.name, language)}】
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${
                    userLocation
                      ? `${userLocation.lat},${userLocation.lng}`
                      : encodeURIComponent(closestCityInfo.city.name)
                  }&destination=${encodeURIComponent(
                    (selectedCity || closestCityInfo.city).name + ' 政府'
                  )}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all shadow-2xs active:scale-98"
                  title={t.launchNavigation}
                >
                  <Rocket className="w-3 h-3 text-amber-300" />
                  <span className="hidden xs:inline">{t.launchNavigation}</span>
                </a>
                <button
                  type="button"
                  id="expand-departure-banner-btn"
                  onClick={() => setIsDepartureBannerCollapsed(false)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-700 font-bold rounded-lg text-xs border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title={t.expandBanner}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>{t.expandBanner}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {closestCityInfo && !isDepartureBannerCollapsed && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-t border-blue-200 px-4 py-3 text-xs text-slate-800 animate-fade-in shadow-xs">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <Locate className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    {t.departurePoint}：【{getLocalizedCityName(closestCityInfo.city.name, language)}】（{closestCityInfo.distance} km）
                  </span>
                </div>
                <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                  <span>{t.recommendedRoute}</span>
                  {selectedCity && (
                    <span className="text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded">
                      {t.targetCityLabel}：【{getLocalizedCityName(selectedCity.name, language)}】
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Requirement: 需要即刻起動的UI Botton 告訴觀眾從定位點可以怎麼去旅遊 */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${
                    userLocation
                      ? `${userLocation.lat},${userLocation.lng}`
                      : encodeURIComponent(closestCityInfo.city.name)
                  }&destination=${encodeURIComponent(
                    (selectedCity || closestCityInfo.city).name + ' 政府'
                  )}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-98"
                  title={t.launchNavigation}
                >
                  <Rocket className="w-4 h-4 text-amber-300" />
                  <span>{t.launchNavigation}</span>
                </a>

                <button
                  onClick={() => {
                    const target = selectedCity || closestCityInfo.city;
                    setSelectedCity(target);
                    setStoppedCity(target);
                    setShowResultSheet(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t.exploreItinerary} →</span>
                </button>

                {/* Requirement: 定位出發點需要增加收合功能按鍵 */}
                <button
                  type="button"
                  id="collapse-departure-banner-btn"
                  onClick={() => setIsDepartureBannerCollapsed(true)}
                  className="px-2.5 py-2 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title={t.collapseBanner}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{t.collapseBanner}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 4. Main Body: Proportional Taiwan Map Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 flex flex-col justify-center items-center">
        <TaiwanMap
          cities={TAIWAN_CITIES}
          selectedCity={selectedCity}
          onSelectCity={(city) => {
            setSelectedSavedItinerary(null);
            setSelectedCity(city);
            setStoppedCity(city);
            setShowResultSheet(true);
          }}
          isRunningRandom={isRunningRandom}
          rollingCityName={rollingCityName}
          userLocation={userLocation}
          stoppedCity={stoppedCity}
          onOpenStoppedCity={(city) => {
            setSelectedSavedItinerary(null);
            setSelectedCity(city);
            setShowResultSheet(true);
          }}
          language={language}
        />
      </main>

      {/* 5. Bottom Sticky Action Area: UI Button 隨機出發一座城市 */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <button
            onClick={handleRandomPick}
            disabled={isRunningRandom}
            className={`w-full h-14 rounded-full font-bold text-lg shadow-lg transition-all transform flex items-center justify-center gap-2 text-white active:scale-98 ${
              isRunningRandom
                ? 'bg-blue-500 cursor-not-allowed opacity-90'
                : 'bg-[#1976D2] hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isRunningRandom ? (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                <span>{t.randomSelecting}</span>
              </>
            ) : (
              <>
                <span className="text-xl">🎲</span>
                <span>{t.randomCity}</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* 6. City Detail & AI Itinerary Modal / Bottom Sheet */}
      <CityDetailSheet
        city={selectedCity}
        isOpen={showResultSheet}
        onClose={() => {
          setShowResultSheet(false);
          setSelectedSavedItinerary(null);
        }}
        userLocation={userLocation}
        closestCity={closestCityInfo?.city || null}
        onTriggerLocation={handleGetLocation}
        initialItinerary={selectedSavedItinerary}
        language={language}
        onOpenSavedModal={() => setShowSavedModal(true)}
      />

      {/* 7. How to Use Modal */}
      <HowToUseModal
        isOpen={showHowToUseModal}
        onClose={() => setShowHowToUseModal(false)}
        language={language}
      />

      {/* 8. Saved Itineraries Modal (我的收藏列表：整套、單日、單一景點) */}
      <SavedItinerariesModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        savedFullList={savedItineraries}
        savedDayList={savedDayItineraries}
        savedSpotList={savedSpots}
        onSelectFullItinerary={handleSelectSavedItinerary}
        onDeleteFullItinerary={(id) => {
          removeSavedItinerary(id);
          refreshAllSaved();
        }}
        onDeleteDayItinerary={(id) => {
          removeSavedDayItinerary(id);
          refreshAllSaved();
        }}
        onDeleteSpotItem={(id) => {
          removeSavedSpotItem(id);
          refreshAllSaved();
        }}
        onClearAllSpots={() => {
          clearAllSavedSpots();
          refreshAllSaved();
        }}
        language={language}
      />

      {/* 9. Settings Modal (包含 AI 免責聲明、使用說明 ICON 及內容、語言切換) */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onOpenDisclaimer={() => setShowDisclaimer(true)}
        onOpenHowToUse={() => setShowHowToUseModal(true)}
      />

      {/* 10. Location Correction Modal (定位資訊更正彈窗) */}
      <LocationCorrectionModal
        isOpen={showLocationCorrectionModal}
        onClose={() => setShowLocationCorrectionModal(false)}
        cities={TAIWAN_CITIES}
        currentCityName={closestCityInfo?.city.name}
        onSelectCity={handleManualSelectLocation}
        language={language}
      />
    </div>
  );
}
