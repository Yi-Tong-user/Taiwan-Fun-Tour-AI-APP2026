import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';

interface DisclaimerModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  language?: SupportedLanguage;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ 
  isOpen, 
  onConfirm,
  language = 'zh-TW'
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations['zh-TW'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center gap-3 text-white">
          <div className="p-2 bg-white/15 rounded-xl shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 id="disclaimer-title" className="text-base sm:text-lg font-bold">
              {t.disclaimerModalTitle}
            </h3>
            <p className="text-xs text-blue-100">{t.disclaimerModalSubtitle}</p>
          </div>
        </div>

        <div className="p-6 space-y-3.5 text-slate-700 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
          <p className="font-medium text-slate-800">
            {t.disclaimerText1}
          </p>
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-2">
            <p>
              {t.disclaimerText2}
            </p>
            <p className="text-amber-800">
              {t.disclaimerText3}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.understandBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
