import React from 'react';
import { 
  X, 
  Compass, 
  Locate, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Clock, 
  Hotel, 
  ShieldCheck, 
  Bookmark, 
  Check 
} from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: SupportedLanguage;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose, language = 'zh-TW' }) => {
  if (!isOpen) return null;

  const t = translations[language] || translations['zh-TW'];

  const guideSteps = {
    'zh-TW': [
      {
        num: 1,
        icon: Locate,
        iconColor: 'text-blue-600',
        bgBox: 'bg-blue-50/70 border-blue-100',
        title: '開啟本機定位（個資保護無上傳）',
        desc: '點擊上方導覽列的「開啟定位」，系統會直接在您的瀏覽器端計算出離您最近的縣市作為出發起點。經緯度座標絕不上傳至任何外部伺服器或第三方資料庫，百分之百保護您的隱私。'
      },
      {
        num: 2,
        icon: Navigation,
        iconColor: 'text-emerald-600',
        bgBox: 'bg-emerald-50/70 border-emerald-100',
        title: '即刻啟動出發交通（從定位點出發指南）',
        desc: '每當鎖定旅遊城市時，系統會立即分析由您定位點出發前往該城市的最佳交通方式（高鐵、台鐵、國道自駕、國內航班或離島客輪）。點選醒目的「🚀 即刻啟動出發導航」UI 按鈕，即可一鍵開啟 Google Maps 直達目的地路線！'
      },
      {
        num: 3,
        icon: MapPin,
        iconColor: 'text-amber-600',
        bgBox: 'bg-amber-50/70 border-amber-100',
        title: '探索全臺 22 縣市與農漁牧特產',
        desc: '您可以點選互動式臺灣地圖、使用右上角「選定遊玩縣市」下拉選單，或點擊底部的「🎲 隨機出發一座城市」，瀏覽該縣市的在地代表性農產、生猛海鮮漁獲、優質畜產、指標景點與合法立案觀光工廠。'
      },
      {
        num: 4,
        icon: Hotel,
        iconColor: 'text-indigo-600',
        bgBox: 'bg-indigo-50/70 border-indigo-100',
        title: '精選住宿與更多推薦展開',
        desc: '各縣市預設推薦綜合評分最高的首選 2 間特色旅宿，維持版面俐落。若需要更多選擇，點擊「查看更多精選住宿」即可展開其餘精選飯店與風格民宿，並提供 Google Maps 定位連結。'
      },
      {
        num: 5,
        icon: Clock,
        iconColor: 'text-purple-600',
        bgBox: 'bg-purple-50/70 border-purple-100',
        title: '智慧客製化旅程（營業時間精準搭配・景點絕不重複）',
        desc: '自由選擇天數（1~5 天）、風格、交通工具與連住不換房設定。系統嚴密落實場館營業時間搭配：博物館、文化館、觀光工廠等 17:00 打烊之景點一律安排在白天；晚間 17:30 之後一律專屬安排觀光夜市、璀璨夜景觀景台或老街晚餐，絕不排入已打烊場館！'
      },
      {
        num: 6,
        icon: Bookmark,
        iconColor: 'text-rose-600',
        bgBox: 'bg-rose-50/70 border-rose-100',
        title: '我的收藏庫管理（上限 20 筆・左滑刪除・一鍵清空防呆）',
        desc: '支援「整套旅程」、「當天單日行程」或「個別景點」三種收藏維度。全應用程式收藏總額上限為 20 筆。對於已去過的景點，可在收藏夾中直接點擊「已去過刪除」或「向左滑動卡片」即可手動移除；右下角並提供「一鍵刪除收藏景點」按鈕，具備二次確認防呆機制，避免誤觸清空。'
      }
    ],
    'en': [
      {
        num: 1,
        icon: Locate,
        iconColor: 'text-blue-600',
        bgBox: 'bg-blue-50/70 border-blue-100',
        title: 'Enable Local Location (Strict Privacy Protection)',
        desc: 'Click "Locate Me" in the top bar. The system calculates the closest county or city directly inside your browser. Your coordinates are never uploaded to any remote server or third-party database.'
      },
      {
        num: 2,
        icon: Navigation,
        iconColor: 'text-emerald-600',
        bgBox: 'bg-emerald-50/70 border-emerald-100',
        title: 'Instant Transit Launch (From Departure Point)',
        desc: 'Whenever a city is selected, the app analyzes the optimal transit mode (High Speed Rail, TRA trains, driving, domestic flights, or island ferries). Click the "🚀 Start Navigation" button to launch Google Maps directly.'
      },
      {
        num: 3,
        icon: MapPin,
        iconColor: 'text-amber-600',
        bgBox: 'bg-amber-50/70 border-amber-100',
        title: 'Explore All 22 Cities & Agricultural Specialties',
        desc: 'Click on the interactive map, use the dropdown menu, or hit "Pick a Random City" at the bottom to explore local produce, fresh seafood, landmark attractions, and certified tourism factories.'
      },
      {
        num: 4,
        icon: Hotel,
        iconColor: 'text-indigo-600',
        bgBox: 'bg-indigo-50/70 border-indigo-100',
        title: 'Curated Stays & Expandable Options',
        desc: 'The app showcases the top 2 highest-rated accommodations for a clean layout. Expand "View More Stays" to browse boutique B&Bs and luxury hotels with direct Google Maps links.'
      },
      {
        num: 5,
        icon: Clock,
        iconColor: 'text-purple-600',
        bgBox: 'bg-purple-50/70 border-purple-100',
        title: 'Smart Custom Itineraries with Exact Business Hours',
        desc: 'Customize 1-5 days, travel styles, and transport modes. Day slots are reserved for museums and factories closing at 17:00, while evenings are reserved for night markets, dinners, and scenic vistas.'
      },
      {
        num: 6,
        icon: Bookmark,
        iconColor: 'text-rose-600',
        bgBox: 'bg-rose-50/70 border-rose-100',
        title: 'Saved Library (20 Items Limit, Swipe to Delete & Clear All)',
        desc: 'Bookmark full multi-day trips, single-day plans, or individual spots up to a 20-item cap. Swipe left to delete or click "Remove Visited". A "Delete All Saved Spots" button with safety confirmation is available.'
      }
    ],
    'ja': [
      {
        num: 1,
        icon: Locate,
        iconColor: 'text-blue-600',
        bgBox: 'bg-blue-50/70 border-blue-100',
        title: '現在地測位（プライバシー完全保護・送信なし）',
        desc: 'ヘッダーの「現在地取得」を押すと、端末ブラウザ内で最寄りの県市を出発点として即座に算出します。緯度経度情報は外部サーバーへ一切送信されず、個人情報を安全に守ります。'
      },
      {
        num: 2,
        icon: Navigation,
        iconColor: 'text-emerald-600',
        bgBox: 'bg-emerald-50/70 border-emerald-100',
        title: '出発ナビゲーション即時起動',
        desc: '目的地が決定すると、現在地からの最適な移動手段（台湾新幹線、台湾鉄道、高速道路、国内線、定期フェリーなど）を案内。「🚀 今すぐナビ開始」ボタンを押せばGoogleマップで目的地まで直行ルートを表示します。'
      },
      {
        num: 3,
        icon: MapPin,
        iconColor: 'text-amber-600',
        bgBox: 'bg-amber-50/70 border-amber-100',
        title: '台湾全22県市と特産品・観光工場の探索',
        desc: 'インタラクティブな台湾地図、上部の県市選択プルダウン、または下部の「🎲 ランダムで都市を出発」から、各県市の名産品や新鮮な海鮮、認定観光工場を閲覧できます。'
      },
      {
        num: 4,
        icon: Hotel,
        iconColor: 'text-indigo-600',
        bgBox: 'bg-indigo-50/70 border-indigo-100',
        title: '厳選おすすめ宿泊施設',
        desc: '各都市評価トップ2の厳選ホテル・民宿をすっきり表示。「さらに宿泊施設を見る」からより多彩な宿情報とGoogleマップリンクを展開できます。'
      },
      {
        num: 5,
        icon: Clock,
        iconColor: 'text-purple-600',
        bgBox: 'bg-purple-50/70 border-purple-100',
        title: '営業時間連動のスマート観光プラン',
        desc: '1〜5日間の日程、観光スタイル、交通機関を自由に設定。17:00に閉館する博物館や観光工場は必ず日中に配分し、夜は夜市や展望スポットを最適に配置します。'
      },
      {
        num: 6,
        icon: Bookmark,
        iconColor: 'text-rose-600',
        bgBox: 'bg-rose-50/70 border-rose-100',
        title: 'お気に入り管理（上限20件・左スワイプ削除・一括消去確認）',
        desc: '全日程プラン・1日プラン・単体スポットの3通りで最大20件まで保存可能。左スワイプまたは「訪問済み削除」で手動削除でき、「お気に入りスポットを一括削除」機能も完備。'
      }
    ]
  };

  const currentSteps = guideSteps[language] || guideSteps['zh-TW'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-wide">
                {t.guideModalTitle}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {t.guideTopHint}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/90 hover:text-white cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 sm:space-y-5 text-slate-700 text-sm leading-relaxed">
          {currentSteps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.num} className={`flex items-start gap-4 p-4 rounded-2xl border ${step.bgBox}`}>
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <StepIcon className={`w-4 h-4 ${step.iconColor}`} />
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Privacy Footnote */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <b>{t.privacyNoticeHeader}</b>：{t.privacyNoticeContent}
            </span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            {t.understandBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
