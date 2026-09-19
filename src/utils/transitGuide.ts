import { CitySpecialty } from '../types';

export interface TransitRecommendation {
  originName: string;
  destinationName: string;
  distanceKm: number;
  drivingEstimate: string;
  highwayRoute: string;
  hsrEstimate?: string;
  trainEstimate?: string;
  flightFerryEstimate?: string;
  bestMode: string;
  googleMapsDirUrl: string;
}

// Calculate straight-line distance in kilometers (Haversine formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const HSR_CITIES = new Set([
  '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市'
]);

const ISLAND_CITIES = new Set(['澎湖縣', '金門縣', '連江縣', '綠島', '蘭嶼', '琉球嶼']);

export function getTransitGuide(
  originLat: number,
  originLng: number,
  originCityName: string,
  destCity: CitySpecialty
): TransitRecommendation {
  const dist = calculateDistanceKm(originLat, originLng, destCity.lat, destCity.lng);
  const destName = destCity.name;

  let drivingEstimate = '';
  let highwayRoute = '';
  let hsrEstimate: string | undefined;
  let trainEstimate: string | undefined;
  let flightFerryEstimate: string | undefined;
  let bestMode = '汽車自駕';

  const isDestIsland = ISLAND_CITIES.has(destName);
  const isOriginIsland = ISLAND_CITIES.has(originCityName);

  if (isDestIsland) {
    if (destName === '澎湖縣') {
      flightFerryEstimate = '國內航班：臺北松山/臺中/高雄直飛澎湖馬公機場（約 45~55 分鐘）｜ 定期客輪：嘉義布袋港搭客輪直達馬公港（約 80 分鐘）';
      bestMode = '國內航班直飛或布袋港客輪';
      drivingEstimate = '需先駕車至嘉義布袋商港或搭乘接駁車，轉乘客輪航向澎湖';
    } else if (destName === '金門縣') {
      flightFerryEstimate = '國內航班：臺北松山/臺中/臺南/高雄/嘉義直飛金門尚義機場（約 55~70 分鐘）';
      bestMode = '國內航班直飛';
      drivingEstimate = '需先抵達臺灣各航空站，轉乘定期客運航班飛抵金門';
    } else if (destName === '連江縣') {
      flightFerryEstimate = '國內航班：臺北松山/臺中直飛南竿/北竿機場（約 50 分鐘）｜ 定期客輪：基隆港搭乘「新臺馬輪」或「臺馬之星」臥鋪客輪直達';
      bestMode = '國內航班或基隆客輪';
      drivingEstimate = '需先前往臺北松山機場或基隆港西碼頭，轉搭海空運航線';
    } else if (destName === '綠島') {
      flightFerryEstimate = '國內航班：德安航空臺東豐年機場直飛綠島航空站（19人座小客機，約 15 分鐘）｜ 高速客輪：臺東富岡漁港搭乘高速客輪直達綠島南寮漁港（約 50 分鐘）';
      bestMode = '臺東富岡高速客輪或德安航空小客機';
      drivingEstimate = '需自駕或搭乘台鐵至臺東火車站，轉乘台灣好行接駁公車或計程車至富岡漁港登船';
    } else if (destName === '蘭嶼') {
      flightFerryEstimate = '國內航班：德安航空臺東豐年機場直飛蘭嶼航空站（約 25 分鐘，需提早預約）｜ 高速客輪：臺東富岡漁港或屏東恆春後壁湖遊艇港搭乘客輪直達蘭嶼開元港（約 2~2.5 小時）';
      bestMode = '臺東富岡/恆春後壁湖客輪或德安航空';
      drivingEstimate = '需前往臺東富岡漁港或屏東恆春後壁湖港搭乘高速客輪直達蘭嶼開元港';
    } else if (destName === '琉球嶼') {
      flightFerryEstimate = '定期高速客船：由屏東東港渡船碼頭（東琉線聯營處、泰富航運、藍白航運、大福航運）搭乘客輪直達琉球白沙觀光港或大福漁港（民營航程約 20~25 分鐘，公營船約 35~40 分鐘）';
      bestMode = '東港渡船碼頭搭乘高速客輪（航程僅約 20 分鐘）';
      drivingEstimate = '開車自駕至屏東東港碼頭周邊停車，或自高鐵左營站/高雄火車站轉乘「台灣好行大鵬灣琉球線（9127D）」客運直達東港碼頭登船';
    }
  } else {
    // Mainland Taiwan
    const estDriveMinutes = Math.round(dist * 1.3); // Driving takes about 1.3 min per direct km on average
    const driveHours = Math.floor(estDriveMinutes / 60);
    const driveMins = estDriveMinutes % 60;
    drivingEstimate = driveHours > 0 ? `約 ${driveHours} 小時 ${driveMins} 分鐘` : `約 ${driveMins} 分鐘`;

    if (destCity.region === '東部') {
      highwayRoute = '經國道五號（雪山隧道）接蘇花改（台9線）或台11線花東海岸公路';
      trainEstimate = '台鐵新自強號（EMU3000）或普悠瑪號直達，宜蘭約 1 小時、花蓮約 2 小時、臺東約 3.5~4 小時';
      bestMode = '台鐵新自強號或自駕行駛雪隧蘇花改';
    } else if (destCity.region === '北部' && (originCityName.includes('臺北') || originCityName.includes('新北') || originCityName.includes('基隆') || originCityName.includes('桃園'))) {
      highwayRoute = '行駛國道一號、國道三號或台64/65快速道路';
      bestMode = '開車自駕或都會捷運/公車';
    } else {
      highwayRoute = '行駛國道一號（中山高）或國道三號（福高），亦可利用台61線西濱快速公路暢遊濱海景點';
      if (HSR_CITIES.has(originCityName) && HSR_CITIES.has(destName)) {
        let hsrMins = 40;
        if (dist > 250) hsrMins = 90;
        else if (dist > 150) hsrMins = 60;
        hsrEstimate = `🚄 台灣高鐵：自出發站搭乘高鐵至${destName}高鐵站（車程約 ${hsrMins} 分鐘），出站轉乘快捷公車 BRT 或排班計程車即可抵達市區。`;
        bestMode = '台灣高鐵（最省時）或自駕國道';
      }
      trainEstimate = '🚆 台鐵西部幹線：搭乘自強號/莒光號直達各市區中心車站，下車即抵達鬧區商圈。';
    }
  }

  // Google Maps Directions link from coordinates (or city) to destination
  const originParam = `${originLat},${originLng}`;
  const destParam = encodeURIComponent(destName === '琉球嶼' ? '小琉球 白沙觀光港' : `${destName} 政府`);
  const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${isDestIsland ? 'transit' : 'driving'}`;

  return {
    originName: originCityName || '您的目前定位點',
    destinationName: destName,
    distanceKm: dist,
    drivingEstimate,
    highwayRoute,
    hsrEstimate,
    trainEstimate,
    flightFerryEstimate,
    bestMode,
    googleMapsDirUrl
  };
}
