import React from 'react';
import {
  Car,
  Motorbike,
  Bike,
  Footprints,
  Ship,
  Train,
  Bus,
  Plane,
  Navigation
} from 'lucide-react';

interface TransitIconProps {
  text?: string;
  className?: string;
}

/**
 * 依據交通描述動態選取最貼切的交通圖示
 * 特別針對機車、自行車、步行、船班、鐵道進行細緻區分
 */
export const TransitIcon: React.FC<TransitIconProps> = ({ text = '', className = 'w-3.5 h-3.5' }) => {
  const lower = text.toLowerCase();

  // 機車 / 摩托車 / 租機車 / Gogoro
  if (
    text.includes('機車') ||
    text.includes('摩托車') ||
    text.includes('騎車') ||
    text.includes('gogoro') ||
    lower.includes('scooter') ||
    lower.includes('motorbike')
  ) {
    return <Motorbike className={className} />;
  }

  // 腳踏車 / 自行車 / 單車 / YouBike
  if (
    text.includes('腳踏車') ||
    text.includes('自行車') ||
    text.includes('單車') ||
    text.includes('youbike') ||
    text.includes('鐵馬') ||
    lower.includes('bike')
  ) {
    return <Bike className={className} />;
  }

  // 步行 / 徒步 / 漫步
  if (text.includes('步行') || text.includes('徒步') || text.includes('漫步') || text.includes('走路')) {
    return <Footprints className={className} />;
  }

  // 船班 / 渡輪 / 客輪
  if (text.includes('船') || text.includes('輪') || text.includes('航行') || lower.includes('ferry') || lower.includes('ship')) {
    return <Ship className={className} />;
  }

  // 飛機 / 航班
  if (text.includes('飛機') || text.includes('航班') || text.includes('航空') || lower.includes('flight')) {
    return <Plane className={className} />;
  }

  // 高鐵 / 火車 / 台鐵 / 捷運 / 輕軌
  if (
    text.includes('高鐵') ||
    text.includes('火車') ||
    text.includes('台鐵') ||
    text.includes('捷運') ||
    text.includes('輕軌') ||
    text.includes('列車') ||
    lower.includes('train')
  ) {
    return <Train className={className} />;
  }

  // 公車 / 客運 / 巴士 / 台灣好行 / 接駁
  if (
    text.includes('公車') ||
    text.includes('客運') ||
    text.includes('巴士') ||
    text.includes('好行') ||
    text.includes('接駁') ||
    lower.includes('bus')
  ) {
    return <Bus className={className} />;
  }

  // 預設為汽車或導航圖示
  return <Car className={className} />;
};
