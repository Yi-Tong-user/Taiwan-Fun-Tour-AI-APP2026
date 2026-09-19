import React from 'react';
import { 
  Settings, 
  X, 
  Languages, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenDisclaimer: () => void;
  onOpenHowToUse: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onOpenDisclaimer,
  onOpenHowToUse,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLanguage];

  const languages: { id: SupportedLanguage; label: string; subLabel: string; flag: string }[] = [
    { id: 'zh-TW', label: '繁體中文', subLabel: 'Traditional Chinese', flag: '🇹🇼' },
    { id: 'en', label: 'English', subLabel: 'English', flag: '🇺🇸' },
    { id: 'ja', label: '日本語', subLabel: 'Japanese', flag: '🇯🇵' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-lg font-black tracking-wide">
                {t.settingsTitle}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          
          {/* Section 1: 切換語言 - Label strictly updated to '語言' per user request */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Languages className="w-4 h-4 text-blue-600" />
              <span>{t.languageSelect}</span>
            </div>
            <p className="text-xs text-slate-500">
              {t.languageSelectSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {languages.map((item) => {
                const isSelected = currentLanguage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onLanguageChange(item.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{item.flag}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {item.subLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-200/80" />

          {/* Section 2: AI 智慧生成內容免責聲明 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.disclaimerModalTitle}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                {t.disclaimerBadgeText}
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs space-y-2.5 text-amber-950">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.disclaimerText1}
                </p>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ⚠️ {t.disclaimerText2}
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenDisclaimer();
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.openFullDisclaimer}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200/80" />

          {/* Section 3: 臺灣好好玩・應用程式完整使用說明 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{t.userGuideSectionTitle}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                {t.guideBadgeText}
              </span>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-xs space-y-3 text-indigo-950">
              <p className="leading-relaxed">
                {t.guideModalSubtitle}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/80 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.privacyBadge}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.exploreItinerary}</span>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenHowToUse();
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.openFullGuide}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {t.settingsDone}
          </button>
        </div>
      </div>
    </div>
  );
};
