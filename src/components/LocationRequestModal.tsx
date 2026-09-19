import React from 'react';
import { Navigation, X, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

interface LocationRequestModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDisallow: () => void;
  language?: SupportedLanguage;
}

export const LocationRequestModal: React.FC<LocationRequestModalProps> = ({
  isOpen,
  onAllow,
  onDisallow,
  language = 'zh-TW'
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations['zh-TW'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
    >
      {/* Container styled exactly after image.png replacing image (2).png */}
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all animate-scale-up"
      >
        {/* Header with Title and Close 'X' */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
              <Navigation className="w-5 h-5 text-blue-600 fill-blue-600" />
            </div>
            <h3 id="location-dialog-title" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {t.locationRequestTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onDisallow}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-3.5 space-y-3.5 text-slate-700 text-sm leading-relaxed">
          <p className="font-medium text-slate-800 text-[14px] sm:text-[15px] leading-relaxed">
            {t.locationRequestMessage}
          </p>

          {/* Privacy Guarantee Box (image.png style) */}
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700">
              {t.locationRequestPrivacy}
            </p>
          </div>
        </div>

        {/* Actions (matching image (2).png layout: Disallow on left, Allow on right) */}
        <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDisallow}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.disallowBtn}
          </button>
          
          <button
            type="button"
            onClick={onAllow}
            className="px-5 py-2.5 border border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/60 text-slate-800 hover:text-blue-700 font-bold rounded-2xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Navigation className="w-4 h-4 fill-current text-blue-600" />
            <span>{t.allowLocationBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
