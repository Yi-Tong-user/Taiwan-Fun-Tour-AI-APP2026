import React, { useMemo } from 'react';
import { CitySpecialty } from '../types';
import { MapPin, Navigation, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, translations } from '../utils/i18n';
import { getLocalizedCityName } from '../utils/cityLocalization';

interface TaiwanMapProps {
  cities: CitySpecialty[];
  selectedCity: CitySpecialty | null;
  onSelectCity: (city: CitySpecialty) => void;
  isRunningRandom: boolean;
  rollingCityName: string;
  userLocation?: { lat: number; lng: number } | null;
  stoppedCity?: CitySpecialty | null;
  onOpenStoppedCity?: (city: CitySpecialty) => void;
  language?: SupportedLanguage;
}

export const TaiwanMap: React.FC<TaiwanMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  isRunningRandom,
  rollingCityName,
  userLocation,
  stoppedCity,
  onOpenStoppedCity,
  language = 'zh-TW'
}) => {
  const t = translations[language] || translations['zh-TW'];

  // Find current rolling city to position the moving color bounding box
  const activeRollingCity = useMemo(() => {
    if (!rollingCityName) return null;
    return cities.find((c) => c.name === rollingCityName) || null;
  }, [cities, rollingCityName]);

  // Project user geolocation (lat, lng) to SVG coordinates accurately using known anchor cities
  const userSvgCoords = useMemo(() => {
    if (!userLocation || !cities.length) return null;
    const { lat, lng } = userLocation;

    // Calculate distance to each anchor city
    const distances = cities.map((c) => {
      const dLat = c.lat - lat;
      const dLng = c.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { city: c, dist };
    });

    distances.sort((a, b) => a.dist - b.dist);

    // If extremely close to an anchor city (< 0.05 deg, ~5km), align directly with the anchor
    if (distances[0].dist < 0.05) {
      return distances[0].city.svgCoords;
    }

    // Interpolate using the 4 closest cities with inverse-distance weighting
    const topClosest = distances.slice(0, 4);
    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;

    for (const item of topClosest) {
      const weight = 1 / Math.max(item.dist * item.dist, 0.0001);
      totalWeight += weight;
      weightedX += item.city.svgCoords.x * weight;
      weightedY += item.city.svgCoords.y * weight;
    }

    return {
      x: Math.round(weightedX / totalWeight),
      y: Math.round(weightedY / totalWeight)
    };
  }, [userLocation, cities]);

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden transition-all duration-500 shadow-xl ${
        isRunningRandom
          ? 'p-[5px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 shadow-2xl shadow-cyan-500/30 ring-4 ring-cyan-300'
          : 'border-2 border-slate-200/80 bg-white shadow-slate-200/60'
      }`}
    >
      {/* Animated Sweep Border Effect during random selection */}
      {isRunningRandom && (
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-20">
          <div className="absolute -inset-[100%] animate-spin-sweep bg-[conic-gradient(from_0deg,#00E5FF,#FF007F,#76FF03,#00E5FF)] opacity-90 blur-sm" />
          <div className="absolute inset-[4px] bg-slate-950/20 rounded-[22px]" />
        </div>
      )}

      {/* Map Canvas Container - Strictly Proportional SVG */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] max-h-[72vh] flex items-center justify-center p-2 sm:p-4 z-10">
        <svg
          viewBox="0 0 850 1080"
          className="w-full h-full object-contain filter drop-shadow-md select-none"
          style={{ maxHeight: '100%' }}
        >
          <defs>
            {/* Ocean & Land Gradients */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="islandMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="50%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>

            <linearGradient id="ridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#166534" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.1" />
            </linearGradient>

            {/* Neon Border Glow */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00E5FF" floodOpacity="0.8"/>
            </filter>

            <filter id="boxGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f59e0b" floodOpacity="0.9"/>
            </filter>

            <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background Ocean Subtle Grid / Compass */}
          <rect width="850" height="1080" rx="24" fill="url(#oceanGrad)" />

          {/* Compass Rose in upper right */}
          <g transform="translate(740, 70)" opacity="0.4">
            <circle cx="0" cy="0" r="32" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="0,-28 6,-8 0,0 -6,-8" fill="#0284c7" />
            <polygon points="0,28 6,8 0,0 -6,8" fill="#94a3b8" />
            <text x="0" y="-32" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">N</text>
          </g>

          {/* Offshore Islands Bounding Boxes matching official map */}
          {/* Matsu / Lienchiang Box (Top-Left) */}
          <g>
            <rect x="30" y="25" width="220" height="135" rx="12" fill="#ffffff" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="45" y="48" fontSize="13" fontWeight="bold" fill="#334155">{t.lienchiangBoxTitle}</text>
            <path
              d="M 65 65 q 15 -10 30 5 t 25 15 t -10 20 z M 140 85 q 12 -8 20 8 t -8 18 z M 180 50 q 10 -5 18 5 t -10 12 z"
              fill="#a7f3d0"
              stroke="#059669"
              strokeWidth="1.5"
            />
          </g>

          {/* Kinmen Box (Mid-Left) */}
          <g>
            <rect x="30" y="175" width="220" height="135" rx="12" fill="#ffffff" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="45" y="198" fontSize="13" fontWeight="bold" fill="#334155">{t.kinmenBoxTitle}</text>
            <path
              d="M 70 240 q 25 -25 55 -5 t 30 25 t -45 5 t -30 -15 z M 55 245 q 12 -10 22 5 t -10 15 z M 180 205 q 8 -5 14 3 t -8 8 z"
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="1.5"
            />
          </g>

          {/* Penghu Archipelago (West Coast) */}
          <g>
            <rect x="65" y="420" width="185" height="195" rx="12" fill="#ffffff" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="80" y="445" fontSize="13" fontWeight="bold" fill="#334155">{t.penghuBoxTitle}</text>
            <path
              d="M 120 480 q 20 -15 35 10 t -10 35 t -25 -10 z M 155 525 q 15 5 20 25 t -20 15 z M 135 565 q 15 -8 25 12 t -15 20 z"
              fill="#fbcfe8"
              stroke="#db2777"
              strokeWidth="1.5"
            />
          </g>

          {/* Southeast Pacific Offshore Islands: Green Island & Orchid Island (臺東外海離島) */}
          <g id="pacific-offshore-islands">
            {/* Nautical Inset Box */}
            <rect
              x="635"
              y="650"
              width="200"
              height="365"
              rx="14"
              fill="#ffffff"
              fillOpacity="0.88"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            {/* Header Ribbon */}
            <rect x="635" y="650" width="200" height="28" rx="14" fill="#e0f2fe" fillOpacity="0.95" />
            <text x="735" y="669" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0369a1">
              {t.pacificIslandsTitle}
            </text>

            {/* --- 綠島 (Green Island / 火燒島) Realistic Island Silhouette --- */}
            <g id="green-island-contour" transform="translate(740, 740)">
              {/* Coral reef shallow water halo */}
              <path
                d="M -24 -14 C -12 -22 18 -20 26 -8 C 32 4 22 18 10 22 C -6 24 -26 14 -28 0 C -30 -8 -26 -12 -24 -14 Z"
                fill="#bae6fd"
                fillOpacity="0.45"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Volcanic island main body with realistic contours */}
              <path
                d="M -18 -10
                   C -8 -16, 12 -15, 20 -6
                   C 25 2, 17 14, 8 16
                   C -4 18, -19 10, -22 -1
                   C -23 -6, -21 -9, -18 -10 Z"
                fill="#86efac"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Central hill elevation */}
              <ellipse cx="0" cy="1" rx="8" ry="4.5" fill="#16a34a" fillOpacity="0.25" />
              {/* Nanliao Harbor dot & Asahi Hot Spring dot */}
              <circle cx="-19" cy="0" r="2.5" fill="#0284c7" />
              <circle cx="12" cy="12" r="2.5" fill="#ea580c" />
            </g>

            {/* 綠島 Info Tag & Feature Icons */}
            <text x="740" y="776" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#065f46">
              {language === 'en' ? 'Green Island' : language === 'ja' ? '緑島（火焼島）' : '綠島（火燒島）'}
            </text>
            <text x="740" y="790" textAnchor="middle" fontSize="8.5" fontWeight="500" fill="#047857">
              {language === 'en' ? '♨️ Asahi Hot Spring 🤿 Snorkeling' : language === 'ja' ? '♨️ 朝日海底温泉 🤿 スノーケリング' : '♨️ 朝日海底溫泉 🤿 柴口浮潛'}
            </text>

            {/* Subtle Divider */}
            <line x1="655" y1="808" x2="815" y2="808" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

            {/* --- 蘭嶼 (Orchid Island / 達悟族之島) Realistic Island Silhouette --- */}
            <g id="orchid-island-contour" transform="translate(725, 895)">
              {/* Coral reef shallow water halo */}
              <path
                d="M -22 -28 C -6 -35 20 -28 26 -12 C 30 6 22 26 8 32 C -8 36 -24 24 -28 6 C -30 -10 -28 -22 -22 -28 Z"
                fill="#bae6fd"
                fillOpacity="0.45"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Volcanic island main body with realistic contours */}
              <path
                d="M -16 -22
                   C -4 -28, 14 -22, 19 -10
                   C 23 2, 16 12, 19 20
                   C 14 26, 4 28, -6 24
                   C -18 18, -22 6, -20 -8
                   C -20 -16, -18 -20, -16 -22 Z"
                fill="#5eead4"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Mountain ridge elevation (Hongtou mountain 552m) */}
              <path
                d="M -4 -14 Q 5 0 -2 14"
                fill="none"
                stroke="#0f766e"
                strokeWidth="2"
                opacity="0.35"
              />
              {/* Kaiyuan Port & Dongqing Bay dots */}
              <circle cx="-18" cy="-7" r="2.5" fill="#0284c7" />
              <circle cx="16" cy="-3" r="2.5" fill="#e11d48" />

              {/* 小蘭嶼 (Lesser Orchid Island) Islet */}
              <ellipse cx="14" cy="38" rx="5" ry="3.5" fill="#2dd4bf" stroke="#0f766e" strokeWidth="1.2" />
              <text x="23" y="41" fontSize="8" fontWeight="600" fill="#475569">
                {language === 'en' ? 'Lesser Orchid' : language === 'ja' ? '小蘭嶼' : '小蘭嶼'}
              </text>
            </g>

            {/* 蘭嶼 Info Tag & Feature Icons */}
            <text x="725" y="955" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#115e59">
              {language === 'en' ? 'Orchid Island (Yami/Tao)' : language === 'ja' ? '蘭嶼（タオ族の島）' : '蘭嶼（達悟族之島）'}
            </text>
            <text x="725" y="969" textAnchor="middle" fontSize="8.5" fontWeight="500" fill="#0f766e">
              {language === 'en' ? '🛶 Tatala Boat 🏠 Underground House 🐟 Flying Fish' : language === 'ja' ? '🛶 チタラカヌー 🏠 地下家屋 🐟 トビウオ' : '🛶 拼板舟 🏠 野銀地下屋 🐟 飛魚季'}
            </text>
            <text x="735" y="995" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#0284c7">
              {language === 'en' ? '✈️ Daily flights from Taitung' : language === 'ja' ? '✈️ 台東直行便 15分〜25分' : '✈️ 德安航空臺東直飛 15m / 25m'}
            </text>
          </g>

          {/* --- 琉球嶼（小琉球・屏東離島） Realistic Coral Reef Island Silhouette --- */}
          <g id="liuqiu-island-contour" transform="translate(360, 815)">
            {/* Shallow coral reef water halo */}
            <path
              d="M -22 -14 C -10 -20 16 -18 24 -6 C 30 6 20 18 8 22 C -6 24 -24 16 -26 2 C -28 -6 -24 -11 -22 -14 Z"
              fill="#bae6fd"
              fillOpacity="0.5"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Coral reef limestone island silhouette (approx 4km long, oriented NE-SW) */}
            <path
              d="M -16 -8
                 C -6 -14, 12 -12, 18 -4
                 C 22 4, 16 14, 6 16
                 C -4 18, -18 10, -20 0
                 C -21 -4, -19 -7, -16 -8 Z"
              fill="#86efac"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Coral plateau elevation */}
            <ellipse cx="0" cy="1" rx="7" ry="4" fill="#16a34a" fillOpacity="0.25" />
            {/* Baisha Port dot (blue) & Flower Vase Rock mark */}
            <circle cx="10" cy="-6" r="2.2" fill="#0284c7" />
            <circle cx="12" cy="-9" r="1.5" fill="#f59e0b" />
          </g>
          {/* 琉球嶼 Info Tag under the silhouette */}
          <text x="360" y="845" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#065f46">
            {t.liuqiuBoxTitle}
          </text>
          <text x="360" y="857" textAnchor="middle" fontSize="8" fontWeight="500" fill="#047857">
            {t.liuqiuFeatures}
          </text>

          {/* Main Taiwan Island Detailed Contour (Equal Proportional Geometry) */}
          <g id="main-island-contour">
            {/* Base Island Silhouette */}
            <path
              d="M 640 100
                 C 680 95, 750 110, 755 130
                 C 760 145, 730 180, 715 230
                 C 700 280, 695 340, 680 430
                 C 660 540, 635 680, 595 780
                 C 570 840, 530 920, 500 970
                 C 485 995, 475 995, 465 965
                 C 445 905, 430 850, 420 800
                 C 400 710, 360 670, 335 600
                 C 310 530, 335 480, 360 420
                 C 385 360, 430 300, 470 240
                 C 510 180, 560 130, 640 100 Z"
              fill="url(#islandMainGrad)"
              stroke="#059669"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Central Mountain Range (Shading & Depth) */}
            <path
              d="M 640 160
                 C 645 220, 610 320, 570 420
                 C 540 490, 530 580, 505 680
                 C 485 760, 465 840, 475 920
                 C 460 840, 480 750, 510 650
                 C 540 550, 570 450, 600 350
                 C 625 260, 645 190, 640 160 Z"
              fill="url(#ridgeGrad)"
            />

            {/* Sub-region divisions for visual texture */}
            <path
              d="M 470 240 Q 560 210 690 280"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <path
              d="M 360 420 Q 520 400 680 430"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <path
              d="M 335 600 Q 500 620 635 680"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </g>

          {/* Running Animated Perimeter when Random Choosing is Active */}
          {isRunningRandom && (
            <rect
              x="15"
              y="15"
              width="820"
              height="1050"
              rx="20"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="6"
              strokeDasharray="40 20"
              className="animate-border-dash"
              filter="url(#neonGlow)"
            />
          )}

          {/* Dynamic Moving Color Bounding Box leaping across cities during 3s random run */}
          {isRunningRandom && activeRollingCity && (
            <g
              transform={`translate(${activeRollingCity.svgCoords.x}, ${activeRollingCity.svgCoords.y})`}
              className="transition-transform duration-100 ease-out pointer-events-none"
            >
              {/* Pulsing neon target box */}
              <rect
                x="-58"
                y="-46"
                width="116"
                height="78"
                rx="14"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray="8 4"
                filter="url(#boxGlow)"
              />
              <rect
                x="-64"
                y="-52"
                width="128"
                height="90"
                rx="18"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Corner crosshairs */}
              <path
                d="M -58 -32 L -58 -46 L -44 -46"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 44 -46 L 58 -46 L 58 -32"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M -58 18 L -58 32 L -44 32"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 44 32 L 58 32 L 58 18"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Interactive City Nodes & Badges */}
          {cities.map((city) => {
            const isSelected = selectedCity?.name === city.name;
            const isHighlighted = isRunningRandom && rollingCityName === city.name;
            const localizedName = getLocalizedCityName(city.name, language);
            const badgeWidth = Math.max(54, localizedName.length * (language === 'en' ? 7.8 : 15) + 16);
            const badgeX = -badgeWidth / 2;

            return (
              <g
                key={city.name}
                transform={`translate(${city.svgCoords.x}, ${city.svgCoords.y})`}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => onSelectCity(city)}
              >
                {/* Active or Rolling Wave Ring */}
                {(isSelected || isHighlighted) && (
                  <circle
                    r="26"
                    fill="none"
                    stroke={isSelected ? "#2563eb" : "#00E5FF"}
                    strokeWidth="3.5"
                    className="animate-ping"
                    opacity="0.75"
                  />
                )}

                {/* Marker Outer Glow Shadow */}
                <circle
                  r={isSelected ? "15" : "10"}
                  fill={
                    isSelected
                      ? "#1d4ed8"
                      : isHighlighted
                      ? "#facc15"
                      : "#ffffff"
                  }
                  stroke={
                    isSelected
                      ? "#ffffff"
                      : isHighlighted
                      ? "#b45309"
                      : "#0f766e"
                  }
                  strokeWidth={isSelected ? "3" : "2"}
                  filter="url(#pinShadow)"
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? "6" : "4"}
                  fill={isSelected ? "#ffffff" : isHighlighted ? "#b45309" : "#0f766e"}
                />

                {/* City Name Badge */}
                <g transform="translate(0, -18)">
                  <rect
                    x={badgeX}
                    y="-15"
                    width={badgeWidth}
                    height="24"
                    rx="12"
                    fill={
                      isSelected
                        ? "#1d4ed8"
                        : isHighlighted
                        ? "#f59e0b"
                        : "#ffffff"
                    }
                    stroke={
                      isSelected
                        ? "#3b82f6"
                        : isHighlighted
                        ? "#d97706"
                        : "#94a3b8"
                    }
                    strokeWidth="1.5"
                    filter="url(#pinShadow)"
                    className="transition-colors group-hover:fill-blue-600 group-hover:stroke-blue-400"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fontSize={language === 'en' ? "11.5" : "13"}
                    fontWeight="bold"
                    fill={
                      isSelected
                        ? "#ffffff"
                        : isHighlighted
                        ? "#ffffff"
                        : "#1e293b"
                    }
                    className="transition-colors group-hover:fill-white select-none pointer-events-none"
                  >
                    {localizedName}
                  </text>
                </g>
              </g>
            );
          })}

          {/* User Geolocation Pulse Beacon (Clean GPS dot without overlapping duplicate pins or text) */}
          {userSvgCoords && (
            <g
              transform={`translate(${userSvgCoords.x}, ${userSvgCoords.y})`}
              className="cursor-default pointer-events-none"
            >
              {/* Subtle pulsing GPS beacon */}
              <circle r="16" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
              <circle r="12" fill="#3b82f6" fillOpacity="0.15" />
              {/* Inner crisp GPS location dot */}
              <circle r="7.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              <circle r="2.5" fill="#ffffff" />
            </g>
          )}

          {/* Magnified Stopped Geographic Location Popout: "停止移動的方塊地理位置則放大跳出縣市名稱" */}
          {stoppedCity && !isRunningRandom && (
            <g
              transform={`translate(${stoppedCity.svgCoords.x}, ${stoppedCity.svgCoords.y - 75})`}
              className="cursor-pointer z-50 filter drop-shadow-2xl"
              onClick={() => onOpenStoppedCity && onOpenStoppedCity(stoppedCity)}
            >
              {/* Outer Glow Card */}
              <rect
                x="-125"
                y="-45"
                width="250"
                height="80"
                rx="20"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="3"
              />
              {/* Arrow pointing down to city pin */}
              <polygon
                points="-12,35 12,35 0,50"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Top Tag */}
              <text
                x="0"
                y="-23"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#38bdf8"
                letterSpacing="1"
              >
                ✨ {t.exploreItinerary}
              </text>
              {/* Enlarged City Name */}
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fontSize={language === 'en' ? "18" : "22"}
                fontWeight="900"
                fill="#facc15"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              >
                {getLocalizedCityName(stoppedCity.name, language)}
              </text>
              {/* Feature summary hint */}
              <text
                x="0"
                y="24"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="600"
                fill="#94a3b8"
              >
                {t.cityFeatureHint}
              </text>
            </g>
          )}
        </svg>

        {/* Center Flash HUD during Random 3-second selection */}
        {isRunningRandom && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="bg-slate-950/95 border-2 border-yellow-400 text-center px-8 py-6 rounded-3xl shadow-2xl backdrop-blur-md w-72 sm:w-80">
              <div className="flex items-center justify-center gap-2 text-yellow-300 text-xs font-bold tracking-widest uppercase mb-1">
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span className="truncate">{t.randomSelectingCenter}</span>
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] tracking-wider truncate py-1">
                {rollingCityName ? getLocalizedCityName(rollingCityName, language) : t.appName}
              </div>
              <p className="text-slate-300 text-xs mt-1 font-medium truncate">
                {t.randomSelectingSubtitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Map Hint Footer info */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{t.mapClickHint}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            {t.mapExplore22Cities}
          </span>
        </div>
      </div>
    </div>
  );
};

