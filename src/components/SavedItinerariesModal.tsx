import React, { useState, useRef } from 'react';
import {
  SavedItinerary,
  SavedDayItinerary,
  SavedSpotItem,
  ItinerarySpot
} from '../types';
import { TransitIcon } from './TransitIcon';
import { MAX_SAVED_LIMIT, updateSavedSpotItem } from '../utils/savedItineraries';
import { SupportedLanguage, translations } from '../utils/i18n';
import {
  getLocalizedCityName,
  getLocalizedSpotName,
  getLocalizedTheme,
  getLocalizedTransport,
  getLocalizedSavedItinerary,
  getLocalizedSavedDay,
  getLocalizedSavedSpot
} from '../utils/cityLocalization';
import { sanitizeAirConditioningText } from '../utils/themeClassifier';
import {
  Bookmark,
  Calendar,
  Compass,
  Trash2,
  X,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Hotel,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface SavedItinerariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedFullList: SavedItinerary[];
  savedDayList: SavedDayItinerary[];
  savedSpotList: SavedSpotItem[];
  onSelectFullItinerary: (saved: SavedItinerary) => void;
  onDeleteFullItinerary: (id: string) => void;
  onDeleteDayItinerary: (id: string) => void;
  onDeleteSpotItem: (id: string) => void;
  onClearAllSpots: () => void;
  language?: SupportedLanguage;
}

type TabType = 'full' | 'day' | 'spot';

/**
 * 景點詳細觀看與修改彈窗 (SpotDetailEditModal)
 */
interface SpotDetailEditModalProps {
  item: SavedSpotItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SavedSpotItem>) => void;
  onDelete: (id: string) => void;
  lang: SupportedLanguage;
}

const SpotDetailEditModal: React.FC<SpotDetailEditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  lang
}) => {
  if (!isOpen || !item) return null;
  const [note, setNote] = useState<string>(item.userNote || '');
  const [tag, setTag] = useState<string>(item.customTag || '');
  const [visited, setVisited] = useState<boolean>(item.visited || false);
  const t = translations[lang] || translations['zh-TW'];

  const presetTags = ['⭐ 必訪推薦', '🍜 必吃在地美食', '📷 拍照打卡', '👨‍👩‍👧 親子同遊', '☔ 雨天備案', '🌿 自然漫活'];

  const handleSave = () => {
    onSave(item.id, {
      userNote: note.trim(),
      customTag: tag.trim(),
      visited
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[95] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <MapPin className="w-5 h-5 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {getLocalizedCityName(item.cityName, lang)}
                  {item.dayNumber ? ` • 第 ${item.dayNumber} 天` : ''}
                </span>
                {visited && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>已去過踩點</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {getLocalizedSpotName(item.spot.name, lang)}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Spot Quick Info */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
              <span className="flex items-center gap-1 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.spot.time}（停留約 {item.spot.duration}）</span>
              </span>
              {item.spot.operatingHours && (
                <span className="font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  🕒 營業時間：{item.spot.operatingHours}
                </span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {item.spot.intro}
            </p>
            <div className="pt-1 flex items-center justify-between">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  item.spot.googleMapsKeyword || item.spot.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-blue-200 text-xs shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>在 Google Maps 查看地標與即時導航</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-3.5 pt-1">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-rose-500" />
              <span>觀看與修改個人收藏資料</span>
            </h4>

            {/* 1. Visited Status */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div>
                <span className="font-bold text-slate-900 text-xs block">踩點打卡標記</span>
                <span className="text-[11px] text-slate-500">記錄您是否已親自到訪此景點</span>
              </div>
              <button
                type="button"
                onClick={() => setVisited(!visited)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  visited
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{visited ? '✓ 已造訪踩點' : '尚未造訪'}</span>
              </button>
            </div>

            {/* 2. Custom Tag */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>自訂分類標籤</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="例如：必去、排隊美食、拍照景點..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
              {/* Preset Tag chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {presetTags.map((pTag) => (
                  <button
                    key={pTag}
                    type="button"
                    onClick={() => setTag(pTag)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      tag === pTag
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pTag}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. User Note */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                個人備忘筆記 / 心得備註
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="記錄您的備忘事項（如：需提前線上預約、建議下午4點看夕陽、周邊必喝牛肉湯、門票優惠注意事項...）"
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onDelete(item.id);
              onClose();
            }}
            className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>移出收藏</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              儲存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 支援「向左滑動刪除」與「點擊觀看修改」的景點卡片
 */
interface SwipeableSpotCardProps {
  item: SavedSpotItem;
  onDelete: (id: string) => void;
  onEdit: (item: SavedSpotItem) => void;
  lang: SupportedLanguage;
}

const SwipeableSpotCard: React.FC<SwipeableSpotCardProps> = ({ item, onDelete, onEdit, lang }) => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const t = translations[lang] || translations['zh-TW'];

  // 手機觸控事件
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(item.id);
    } else {
      setOffsetX(0);
    }
  };

  // 滑鼠拖曳相容
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(item.id);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 select-none bg-rose-600"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {/* 往左滑動時露出的紅色刪除底層 */}
      <div
        onClick={() => onDelete(item.id)}
        className="absolute inset-y-0 right-0 w-28 bg-rose-600 text-white flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-rose-700 z-0 pr-2 active:bg-rose-800"
        title={t.visitedDeleteTooltip}
      >
        <Trash2 className="w-5 h-5 mb-1" />
        <span className="text-[11px] font-black tracking-wider">{t.visitedDeleteBtn}</span>
      </div>

      {/* 正面卡片層 */}
      <div
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        onClick={() => {
          if (offsetX === 0) {
            onEdit(item);
          }
        }}
        className="relative z-10 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-2.5 h-full cursor-pointer hover:border-rose-300 hover:shadow-sm transition-all"
      >
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-1.5">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  {getLocalizedCityName(item.cityName, lang)}
                </span>
                {item.dayNumber && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t.dayN.replace('{n}', String(item.dayNumber))}
                  </span>
                )}
                {item.visited && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>已造訪</span>
                  </span>
                )}
                {item.customTag && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-0.5">
                    <Tag className="w-2.5 h-2.5 text-amber-600" />
                    <span>{item.customTag}</span>
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-1">
                {getLocalizedSpotName(item.spot.name, lang)}
              </h4>
            </div>

            {/* 手動刪除按鈕 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="px-2 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 flex items-center gap-1 text-[11px] font-bold border border-slate-200 hover:border-rose-200 cursor-pointer"
              title={t.visitedDeleteTooltip}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.visitedDeleteBtn}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {item.spot.duration}
            </span>
            {item.spot.operatingHours && (
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                {item.spot.operatingHours}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.spot.intro}
          </p>

          {/* 備忘筆記預覽 */}
          {item.userNote && (
            <div className="text-[11px] bg-amber-50/90 border border-amber-200/90 rounded-xl p-2 text-amber-950 flex items-start gap-1.5">
              <span className="shrink-0 text-amber-600">📝</span>
              <span className="line-clamp-2 italic font-medium">{item.userNote}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer border border-amber-200 shadow-2xs"
            title="點擊觀看並修改景點資訊與備忘"
          >
            <Edit3 className="w-3 h-3 text-amber-600" />
            <span>觀看與修改</span>
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              item.spot.googleMapsKeyword || item.spot.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer border border-blue-200 shadow-2xs"
          >
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>{t.navigationBtn}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * 支援「向左滑動刪除」的整套旅程卡片
 */
interface SwipeableFullItineraryCardProps {
  item: SavedItinerary;
  onSelect: (saved: SavedItinerary) => void;
  onDelete: (id: string) => void;
  lang: SupportedLanguage;
}

const SwipeableFullItineraryCard: React.FC<SwipeableFullItineraryCardProps> = ({
  item,
  onSelect,
  onDelete,
  lang
}) => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const t = translations[lang] || translations['zh-TW'];

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(item.id);
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(item.id);
    } else {
      setOffsetX(0);
    }
  };

  const spotCount = item.data.itinerary?.reduce(
    (acc, day) => acc + (day.spots?.length || 0),
    0
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 select-none bg-rose-600"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {/* 往左滑動時露出的紅色刪除底層 */}
      <div
        onClick={() => onDelete(item.id)}
        className="absolute inset-y-0 right-0 w-28 bg-rose-600 text-white flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-rose-700 z-0 pr-2 active:bg-rose-800"
        title={t.deleteBtn}
      >
        <Trash2 className="w-5 h-5 mb-1" />
        <span className="text-[11px] font-black tracking-wider">{t.swipeToDelete}</span>
      </div>

      {/* 正面卡片層 */}
      <div
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        className="relative z-10 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3 cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                【{getLocalizedCityName(item.cityName, lang)}】{item.days} {t.dayTourUnit}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {getLocalizedTheme(item.travelStyle, lang)}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                <TransitIcon text={item.transportMode} className="w-3 h-3 text-emerald-600" />
                <span>{getLocalizedTransport(item.transportMode, lang)}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.savedAt}</span>
              </span>
              <span>•</span>
              <span>{spotCount} {t.plannedSpotsCount}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title={t.deleteBtn}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          {sanitizeAirConditioningText(item.overview)}
        </p>

        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="text-[11px] text-slate-400 font-medium truncate max-w-[60%] flex items-center gap-1">
            <span>{t.swipeToDeleteHint}</span>
            {item.data.itinerary[0]?.spots?.[0]?.name ? (
              <span className="text-slate-500">• {item.data.itinerary[0].spots[0].name}</span>
            ) : null}
          </div>
          <button
            onClick={() => onSelect(item)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <span>{t.openSavedFullItinerary}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 支援「向左滑動刪除」的單日行程卡片
 */
interface SwipeableDayItineraryCardProps {
  dayItem: SavedDayItinerary;
  onDelete: (id: string) => void;
  getDirectionsUrl: (spots: ItinerarySpot[]) => string;
  lang: SupportedLanguage;
}

const SwipeableDayItineraryCard: React.FC<SwipeableDayItineraryCardProps> = ({
  dayItem,
  onDelete,
  getDirectionsUrl,
  lang
}) => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const t = translations[lang] || translations['zh-TW'];

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(dayItem.id);
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -110));
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (offsetX < -70) {
      onDelete(dayItem.id);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 select-none bg-rose-600"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {/* 往左滑動時露出的紅色刪除底層 */}
      <div
        onClick={() => onDelete(dayItem.id)}
        className="absolute inset-y-0 right-0 w-28 bg-rose-600 text-white flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-rose-700 z-0 pr-2 active:bg-rose-800"
        title={t.deleteBtn}
      >
        <Trash2 className="w-5 h-5 mb-1" />
        <span className="text-[11px] font-black tracking-wider">{t.swipeToDelete}</span>
      </div>

      {/* 正面卡片層 */}
      <div
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        className="relative z-10 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3 cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-black text-slate-900">
                【{getLocalizedCityName(dayItem.cityName, lang)}】{t.dayN.replace('{n}', String(dayItem.dayNumber))}：{dayItem.dayTitle}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                {t.saveDayFullSet}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{dayItem.savedAt}</span>
              </span>
              <span>•</span>
              <span>{dayItem.spots.length} {t.plannedSpotsCount}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(dayItem.id);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title={t.deleteBtn}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* 當日住宿 */}
        {dayItem.stayHotel && (
          <div className="text-xs text-indigo-900 bg-indigo-50/80 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5">
            <Hotel className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-semibold">{dayItem.stayHotel}</span>
          </div>
        )}

        {/* 景點順序流 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
          <div className="space-y-1.5">
            {dayItem.spots.map((spot, idx) => (
              <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900">{getLocalizedSpotName(spot.name, lang)}</span>
                  <span className="text-slate-500 ml-1.5 text-[11px]">({spot.time})</span>
                  {spot.transportToNext && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <TransitIcon text={spot.transportToNext} className="w-3 h-3 text-slate-400" />
                      <span>{getLocalizedTransport(spot.transportToNext, lang)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部說明與導航按鈕 */}
        <div className="pt-1 flex flex-col gap-2">
          <span className="text-[10px] text-slate-400">
            {t.swipeToDeleteHint}
          </span>
          <a
            href={getDirectionsUrl(dayItem.spots)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span>Google Maps {t.navigationBtn}</span>
            <ExternalLink className="w-3 h-3 text-emerald-200" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const SavedItinerariesModal: React.FC<SavedItinerariesModalProps> = ({
  isOpen,
  onClose,
  savedFullList,
  savedDayList,
  savedSpotList,
  onSelectFullItinerary,
  onDeleteFullItinerary,
  onDeleteDayItinerary,
  onDeleteSpotItem,
  onClearAllSpots,
  language = 'zh-TW'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('full');
  const [showConfirmClearSpots, setShowConfirmClearSpots] = useState<boolean>(false);
  const [editingSpot, setEditingSpot] = useState<SavedSpotItem | null>(null);
  const t = translations[language] || translations['zh-TW'];

  if (!isOpen) return null;

  const totalSavedCount = savedFullList.length + savedDayList.length + savedSpotList.length;
  const isLimitReached = totalSavedCount >= MAX_SAVED_LIMIT;

  const handleSaveSpotEdit = (id: string, updates: Partial<SavedSpotItem>) => {
    updateSavedSpotItem(id, updates);
    if (editingSpot && editingSpot.id === id) {
      setEditingSpot((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const getGoogleMapsDirectionsUrl = (spots: ItinerarySpot[]) => {
    if (!spots || spots.length === 0) return 'https://www.google.com/maps';
    const origin = encodeURIComponent(spots[0].googleMapsKeyword || spots[0].name);
    const destination = encodeURIComponent(
      spots[spots.length - 1].googleMapsKeyword || spots[spots.length - 1].name
    );
    const waypoints = spots
      .slice(1, -1)
      .map((s) => encodeURIComponent(s.googleMapsKeyword || s.name))
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=driving`;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Bookmark className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight">{t.savedModalTitle}</h2>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      isLimitReached
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {t.savedLimitTotal} {totalSavedCount} / {MAX_SAVED_LIMIT} {isLimitReached && `(${t.savedLimitReached})`}
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium">
                  {t.savedLimitMax}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/90 hover:text-white cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="bg-slate-100 p-2 sm:px-5 border-b border-slate-200 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('full')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'full'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.tabFullItinerary}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'full' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {savedFullList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('day')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'day'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.tabDayItinerary}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'day' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {savedDayList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('spot')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'spot'
                  ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{t.tabSingleSpot || '景點收藏'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'spot' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {savedSpotList.length}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50">
            {/* TAB 1: 全部旅程 */}
            {activeTab === 'full' && (
              <>
                {savedFullList.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Layers className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{t.emptyFullTitle}</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      {t.emptyFullDesc}
                    </p>
                  </div>
                ) : (
                  savedFullList.map((item) => {
                    const locItem = getLocalizedSavedItinerary(item, language);
                    return (
                      <SwipeableFullItineraryCard
                        key={locItem.id}
                        item={locItem}
                        onSelect={onSelectFullItinerary}
                        onDelete={onDeleteFullItinerary}
                        lang={language}
                      />
                    );
                  })
                )}
              </>
            )}

            {/* TAB 2: 當天單日行程 */}
            {activeTab === 'day' && (
              <>
                {savedDayList.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{t.emptyDayTitle}</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      {t.emptyDayDesc}
                    </p>
                  </div>
                ) : (
                  savedDayList.map((dayItem) => {
                    const locDay = getLocalizedSavedDay(dayItem, language);
                    return (
                      <SwipeableDayItineraryCard
                        key={locDay.id}
                        dayItem={locDay}
                        onDelete={onDeleteDayItinerary}
                        getDirectionsUrl={getGoogleMapsDirectionsUrl}
                        lang={language}
                      />
                    );
                  })
                )}
              </>
            )}

            {/* TAB 3: 單一景點收藏 */}
            {activeTab === 'spot' && (
              <>
                {savedSpotList.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{t.emptySpotTitle}</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      {t.emptySpotDesc}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* 操作提示條 */}
                    <div className="p-2.5 bg-rose-50/80 border border-rose-200/70 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <b>{t.visitedManagementTitle}</b>：{t.visitedManagementHint}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedSpotList.map((item) => {
                        const locSpot = getLocalizedSavedSpot(item, language);
                        return (
                          <SwipeableSpotCard
                            key={locSpot.id}
                            item={locSpot}
                            onDelete={onDeleteSpotItem}
                            onEdit={(spot) => setEditingSpot(spot)}
                            lang={language}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">{t.savedLimitMax}</span>
              <span
                className={`font-black px-2 py-0.5 rounded-full ${
                  isLimitReached ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t.savedUsed} {totalSavedCount} / {MAX_SAVED_LIMIT}
              </span>
            </div>

            {/* 右下角：一鍵刪除收藏景點按鈕 (防呆機制) & 關閉 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearSpots(true)}
                disabled={savedSpotList.length === 0}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                  savedSpotList.length === 0
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 hover:border-rose-400 active:scale-95 cursor-pointer'
                }`}
                title={savedSpotList.length === 0 ? t.clearAllSpotsEmptyTooltip : t.clearAllSpotsActionTooltip}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{t.clearAllSpotsBtn} {savedSpotList.length > 0 ? `(${savedSpotList.length})` : ''}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 防呆機制對話框: 獨立置於頂層 Portal 結構，避免點擊穿透或 overflow 限制 */}
      {showConfirmClearSpots && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowConfirmClearSpots(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                {t.clearAllSpotsPromptTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.clearAllSpotsPromptDesc}
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearSpots(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {t.clearAllSpotsCancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllSpots();
                  setShowConfirmClearSpots(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                {t.clearAllSpotsConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 景點詳細觀看與修改彈窗 */}
      {editingSpot && (
        <SpotDetailEditModal
          item={editingSpot}
          isOpen={Boolean(editingSpot)}
          onClose={() => setEditingSpot(null)}
          onSave={handleSaveSpotEdit}
          onDelete={(id) => {
            onDeleteSpotItem(id);
            setEditingSpot(null);
          }}
          lang={language}
        />
      )}
    </>
  );
};
