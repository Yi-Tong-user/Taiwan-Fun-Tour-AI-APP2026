import React from 'react';
import { MapPin, X, Check, Navigation } from 'lucide-react';
import { CitySpecialty } from '../types';
import { SupportedLanguage, translations } from '../utils/i18n';
import { getLocalizedCityName } from '../utils/cityLocalization';

interface LocationCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: CitySpecialty[];
  currentCityName?: string;
  onSelectCity: (city: CitySpecialty) => void;
  language?: SupportedLanguage;
}

export const LocationCorrectionModal: React.FC<LocationCorrectionModalProps> = ({
  isOpen,
  onClose,
  cities,
  currentCityName,
  onSelectCity,
  language = 'zh-TW'
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations['zh-TW'];

  const regions = [
    { name: t.northRegion, list: cities.filter((c) => c.region === '北部') },
    { name: t.centralRegion, list: cities.filter((c) => c.region === '中部') },
    { name: t.southRegion, list: cities.filter((c) => c.region === '南部') },
    { name: t.eastRegion, list: cities.filter((c) => c.region === '東部') },
    { name: t.islandRegion, list: cities.filter((c) => c.region === '離島') }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="correction-modal-title"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Navigation className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 id="correction-modal-title" className="text-base sm:text-lg font-bold">
                {language === 'en' ? 'Select / Correct Location' : language === 'ja' ? '現在地の選択・修正' : '選擇或更正目前所在縣市'}
              </h3>
              <p className="text-xs text-blue-100">
                {language === 'en' 
                  ? 'If automatic detection is inaccurate, please select your actual city:'
                  : language === 'ja'
                  ? '自動測位が不正確な場合は、実際の滞在先を選択してください：'
                  : '若自動定位或網路 IP 偏差，請直接點選您目前所在的真實縣市：'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selection List */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {regions.map((reg) => (
            <div key={reg.name} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 tracking-wider">
                {reg.name}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {reg.list.map((c) => {
                  const isCurrent = currentCityName === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        onSelectCity(c);
                        onClose();
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-400'
                          : 'bg-slate-50/70 hover:bg-blue-50/50 border-slate-200 hover:border-blue-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{getLocalizedCityName(c.name, language)}</span>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
