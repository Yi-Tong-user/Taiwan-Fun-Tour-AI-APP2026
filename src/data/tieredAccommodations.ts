export interface TieredHotel {
  name: string;
  type: string;
  tier: 'budget' | 'standard' | 'luxury';
  description: string;
  locationType: string;
  priceRange: string;
  googleMapsQuery: string;
  enName: string;
  enType: string;
  enDescription: string;
  jaName: string;
  jaType: string;
  jaDescription: string;
}

export const CITY_TIERED_ACCOMMODATIONS: Record<string, Record<'budget' | 'standard' | 'luxury', TieredHotel[]>> = {
  "臺北市": {
    budget: [
      {
        name: "漫步台北青年旅舍 Meander Taipei Hostel",
        type: "小資青年背包客棧",
        tier: "budget",
        description: "鄰近西門町商圈與捷運，設計極具文青社交氛圍，提供乾淨床位與交誼廳。",
        locationType: "市中心/西門捷運站",
        priceRange: "NT$ 700 - 1,400/晚",
        googleMapsQuery: "Meander Taipei Hostel",
        enName: "Meander Taipei Hostel",
        enType: "Social Backpacker Hostel",
        enDescription: "Near Ximending and MRT, stylish communal lounge with clean dorms and friendly vibe.",
        jaName: "ミアンダー台北ユースホステル",
        jaType: "バックパッカーズホステル",
        jaDescription: "西門町エリア至近、清潔なドミトリーと国際的な交流ラウンジが人気。"
      },
      {
        name: "夾腳拖的家 Flip Flop Hostel - 台北車站館",
        type: "人文平價青年旅舍",
        tier: "budget",
        description: "老屋改造文創天井旅宿，步行3分鐘抵達台北車站，交通極其便捷。",
        locationType: "市中心/台北車站",
        priceRange: "NT$ 800 - 1,600/晚",
        googleMapsQuery: "Flip Flop Hostel Taipei Main Station",
        enName: "Flip Flop Hostel - Taipei Main Station",
        enType: "Boutique Eco Hostel",
        enDescription: "Heritage building with sunlit atrium, 3 mins walk from Taipei Main Station.",
        jaName: "フリップフロップホステル 台北駅館",
        jaType: "エコデザインホステル",
        jaDescription: "台北駅から徒歩3分、歴史ある建物をリノベした自然光あふれる人気ホステル。"
      }
    ],
    standard: [
      {
        name: "和苑三井花園飯店 台北忠孝",
        type: "日系質感商旅",
        tier: "standard",
        description: "頂樓大浴場俯瞰台北市景，緊鄰捷運忠孝新生站，日式細膩服務。",
        locationType: "市中心/忠孝新生",
        priceRange: "NT$ 3,200 - 4,800/晚",
        googleMapsQuery: "MGH Mitsui Garden Hotel Taipei Zhongxiao",
        enName: "MGH Mitsui Garden Hotel Taipei Zhongxiao",
        enType: "Japanese Premium Business Hotel",
        enDescription: "Rooftop communal bath with skyline views, directly outside Zhongxiao Xinsheng MRT.",
        jaName: "和苑三井ガーデンホテル台北忠孝",
        jaType: "日系ハイクラスビジネスホテル",
        jaDescription: "最上階大浴場から台北のスカイラインを一望。忠孝新生駅直結の極上快適ホテル。"
      },
      {
        name: "台北時代寓所 Hotel Resonance Taipei",
        type: "希爾頓風格文旅",
        tier: "standard",
        description: "摩登膠卷積木建築外觀，星巴克典藏門市進駐，善導寺站旁交通極佳。",
        locationType: "市中心/善導寺站",
        priceRange: "NT$ 3,800 - 5,500/晚",
        googleMapsQuery: "Hotel Resonance Taipei Tapestry Collection by Hilton",
        enName: "Hotel Resonance Taipei",
        enType: "Modern Design Hotel",
        enDescription: "Sleek film-roll architecture with exclusive in-house Starbucks Reserve, next to Shandao Temple MRT.",
        jaName: "ホテル レゾナンス 台北",
        jaType: "モダンデザインホテル",
        jaDescription: "フィルムロールを模した洗練された外観。スターバックスリザーブ併設の上質ホテル。"
      }
    ],
    luxury: [
      {
        name: "台北晶華酒店 Regent Taipei",
        type: "五星奢華地標",
        tier: "luxury",
        description: "中山旗艦名品商圈，米其林一星牛排館與世界級露天溫水泳池服務。",
        locationType: "市中心/中山精品商圈",
        priceRange: "NT$ 6,800 - 15,000/晚",
        googleMapsQuery: "Regent Taipei",
        enName: "Regent Taipei",
        enType: "5-Star Luxury Landmark",
        enDescription: "Prestigious Zhongshan luxury avenue, Michelin-starred steakhouse, and heated rooftop pool.",
        jaName: "リージェント台北（台北晶華酒店）",
        jaType: "5つ星最高級ラグジュアリーホテル",
        jaDescription: "中山ブティック街に位置し、ミシュラン星付きダイニングと温水屋上プールを完備。"
      },
      {
        name: "北投麗禧溫泉酒店 Grand View Resort Beitou",
        type: "頂級白磺溫泉度假村",
        tier: "luxury",
        description: "北投制高點俯瞰丹鳳群山，私密天然第一口白磺泉，李祖原大師自然美學。",
        locationType: "山區/北投溫泉鄉",
        priceRange: "NT$ 12,000 - 24,000/晚",
        googleMapsQuery: "Grand View Resort Beitou",
        enName: "Grand View Resort Beitou",
        enType: "Premier Hot Spring Resort",
        enDescription: "Perched on Beitou hillside with pure white sulfur springs and serene mountain views.",
        jaName: "グランドビューリゾート北投（北投麗禧温泉酒店）",
        jaType: "最高級天然温泉リゾート",
        jaDescription: "北投温泉の高台に位置し、良質な白硫黄泉と美しい丹鳳山のパノラマを堪能。"
      }
    ]
  },
  "新北市": {
    budget: [
      {
        name: "九份小城故事民宿 (Jiufen Backpacker Stay)",
        type: "老街平價山景青旅",
        tier: "budget",
        description: "近九份老街石階，提供舒適平價床位與山海遠眺觀景露台。",
        locationType: "山城/九份老街",
        priceRange: "NT$ 750 - 1,500/晚",
        googleMapsQuery: "Jiufen Corner Inn",
        enName: "Jiufen Corner Backpacker Inn",
        enType: "Cozy Mountain Hostel",
        enDescription: "Steps from Jiufen Old Street with rooftop terrace overlooking coastal mountains.",
        jaName: "九份コーナーホステル",
        jaType: "山間ゲストハウス",
        jaDescription: "九份老街近く、海と山を一望できるルーフトップテラス付きの格安ゲストハウス。"
      },
      {
        name: "淡水單車輕旅青年旅店",
        type: "河畔單車背包旅舍",
        tier: "budget",
        description: "淡水捷運站旁，河岸夕陽第一排，專為單車環島與小資旅人打造。",
        locationType: "水岸/淡水老街",
        priceRange: "NT$ 800 - 1,600/晚",
        googleMapsQuery: "Tamsui Backpacker Hostel",
        enName: "Tamsui Cycling Backpacker Hostel",
        enType: "Riverfront Cycle Hostel",
        enDescription: "Next to Tamsui MRT, riverside cycling friendly with comfortable dorms.",
        jaName: "淡水サイクリングホステル",
        jaType: "リバーサイドホステル",
        jaDescription: "淡水駅徒歩圏内、夕日と川風を感じられるサイクリスト・個人旅行向けホステル。"
      }
    ],
    standard: [
      {
        name: "板橋凱撒大飯店 Caesar Park Hotel Banqiao",
        type: "都會旗艦高空泳池",
        tier: "standard",
        description: "新板特區三鐵共構，高空無邊際景觀露天溫水泳池，客房寬敞明亮。",
        locationType: "市中心/新板三鐵樞紐",
        priceRange: "NT$ 3,000 - 4,800/晚",
        googleMapsQuery: "Caesar Park Hotel Banqiao",
        enName: "Caesar Park Hotel Banqiao",
        enType: "Urban Hub Hotel with Infinity Pool",
        enDescription: "Next to Banqiao Station with stunning rooftop infinity pool and spacious rooms.",
        jaName: "シーザーパークホテル板橋",
        jaType: "ハイクラスシティホテル",
        jaDescription: "板橋駅徒歩3分。SNSで話題のルーフトップインフィニティプールを併設。"
      },
      {
        name: "九份山經民宿 Jiufen The Ore Inn",
        type: "九份金礦美學文旅",
        tier: "standard",
        description: "依山傍海礦業歷史宅邸改裝，夜間專人九份文史導覽，私密景觀陽台。",
        locationType: "山城/九份老街",
        priceRange: "NT$ 2,800 - 4,500/晚",
        googleMapsQuery: "九份山經民宿",
        enName: "Jiufen The Ore Inn",
        enType: "Mining Heritage Boutique B&B",
        enDescription: "Mining history aesthetic with sea views and night guided tours through quiet alleys.",
        jaName: "九份山経（The Ore Inn）",
        jaType: "歴史リノベブティック宿",
        jaDescription: "金鉱山の歴史美学を取り入れた客室。夜の九份路地裏散策ツアーが好評。"
      }
    ],
    luxury: [
      {
        name: "烏來馥蘭朵渡假酒店 Volando Urai Spring Spa & Resort",
        type: "山林頂級藝術湯泉",
        tier: "luxury",
        description: "南勢溪碧綠溪畔，私人露天湯池搭配心靈藝術儀式演出，極致私密假期。",
        locationType: "山區/烏來溫泉祕境",
        priceRange: "NT$ 11,000 - 22,000/晚",
        googleMapsQuery: "Volando Urai Spring Spa & Resort",
        enName: "Volando Urai Spring Spa & Resort",
        enType: "Relais & Châteaux Hot Spring Resort",
        enDescription: "Nestled along emerald Nanshi River, offering private spring tubs and transcendent art performances.",
        jaName: "ヴォランド烏来（馥蘭朵渡假酒店）",
        jaType: "ルレ・エ・シャトー認定極上温泉宿",
        jaDescription: "エメラルドグリーンの清流沿い。専用温泉風呂と静寂の芸術パフォーマンスが魅力。"
      },
      {
        name: "福容大飯店 淡水漁人碼頭",
        type: "巨型郵輪景觀度假村",
        tier: "luxury",
        description: "郵輪造型外觀坐擁淡水夕陽海景，黃金美人湯溫泉與百米旋轉情人塔。",
        locationType: "海線/淡水漁人碼頭",
        priceRange: "NT$ 5,800 - 12,000/晚",
        googleMapsQuery: "Fullon Hotel Tamsui Fishermen's Wharf",
        enName: "Fullon Hotel Tamsui Fisherman's Wharf",
        enType: "Cruise-themed Seaside Resort",
        enDescription: "Cruise ship architecture fronting spectacular Taiwan Strait sunsets and hot spring spa.",
        jaName: "フーロンホテル淡水フィッシャーマンズワーフ",
        jaType: "豪華客船型シーサイドリゾート",
        jaDescription: "夕日の絶景に包まれる豪華客船型ホテル。天然黄金温泉と回転展望タワーを併設。"
      }
    ]
  },
  "苗栗縣": {
    budget: [
      {
        name: "三義綠呆背包客棧 Green Stay Hostel",
        type: "森林平價青年客棧",
        tier: "budget",
        description: "座落三義木雕老街旁，提供簡約舒適床位與共享廚房，單車鐵道小資首選。",
        locationType: "山城/三義木雕聚落",
        priceRange: "NT$ 650 - 1,200/晚",
        googleMapsQuery: "三義綠呆背包客棧",
        enName: "Sanyi Green Stay Hostel",
        enType: "Forest Backpacker Hostel",
        enDescription: "Near Sanyi Woodcarving Old Street, budget dorms, shared kitchen, and bicycle storage.",
        jaName: "三義グリーンスティホステル",
        jaType: "エコノミーバックパッカーズ",
        jaDescription: "木彫りの町・三義に位置し、鉄道自転車やサイクリング旅に最適な清潔ホステル。"
      },
      {
        name: "苗栗老家青年旅宿",
        type: "老屋青年文創旅社",
        tier: "budget",
        description: "老洋房改裝咖啡青年旅宿，步行抵達苗栗火車站，濃郁在地人情味與手沖咖啡。",
        locationType: "市中心/苗栗車站",
        priceRange: "NT$ 700 - 1,400/晚",
        googleMapsQuery: "苗栗老家咖啡旅舍",
        enName: "Miaoli Old House Youth Hostel",
        enType: "Vintage Coffee Hostel",
        enDescription: "Renovated vintage townhome with in-house cafe near Miaoli Train Station.",
        jaName: "苗栗オールドハウスホステル",
        jaType: "古民家カフェホステル",
        jaDescription: "苗栗駅近くのレトロ洋館をリノベ。自家焙煎珈琲の香る温かいゲストハウス。"
      }
    ],
    standard: [
      {
        name: "卓也小屋度假園區 Zhuo Ye Cottage",
        type: "客家藍染傳統聚落",
        tier: "standard",
        description: "仿古穀倉木造客房，林蔭流水環抱，可親自體驗手作客家植物藍染藝術。",
        locationType: "山區/三義山林客莊",
        priceRange: "NT$ 3,000 - 4,800/晚",
        googleMapsQuery: "卓也小屋",
        enName: "Zhuo Ye Cottage",
        enType: "Hakka Indigo Dyeing Eco-Resort",
        enDescription: "Traditional barn-style chalets surrounded by forest, featuring hands-on indigo dyeing workshops.",
        jaName: "卓也小屋（ジョーイエコテージ）",
        jaType: "客家藍染め伝統エコビレッジ",
        jaDescription: "昔ながらの穀倉を模した木造宿。敷地内で本格的な客家藍染め体験が可能。"
      },
      {
        name: "南庄普羅旺斯鄉村民宿",
        type: "南庄莊園歐風民宿",
        tier: "standard",
        description: "高處俯瞰南庄山城梯田，黃色南法鄉村風情建築，提供現做健康農家早餐。",
        locationType: "山城/南庄桂花巷",
        priceRange: "NT$ 2,600 - 4,200/晚",
        googleMapsQuery: "南庄普羅旺斯鄉村民宿",
        enName: "Nanzhuang Provence Country Villa",
        enType: "Country Garden B&B",
        enDescription: "French-provencal villa perched above Nanzhuang with sweeping valley vistas and fresh farm breakfast.",
        jaName: "南庄プロヴァンスカントリーヴィラ",
        jaType: "欧風ガーデンペンション",
        jaDescription: "南庄の山並みを見下ろす南仏風ペンション。手作り朝食と静寂の星空が自慢。"
      }
    ],
    luxury: [
      {
        name: "泰安觀止溫泉會館 Onsen Papawaqa",
        type: "清水模山林溫泉會館",
        tier: "luxury",
        description: "汶水溪畔清水模與鐵木共構，冷熱天然無邊際大眾湯與私密觀景湯池。",
        locationType: "山區/泰安溫泉深谷",
        priceRange: "NT$ 7,500 - 16,000/晚",
        googleMapsQuery: "泰安觀止溫泉會館",
        enName: "Onsen Papawaqa",
        enType: "Architectural Hot Spring Luxury",
        enDescription: "Exposed concrete and ironwood design on Wenshui River, with scenic open-air hot spring pools.",
        jaName: "泰安観止温泉会館（Onsen Papawaqa）",
        jaType: "高級山岳温泉リゾート",
        jaDescription: "打ち放しコンクリートと銘木が調和した名建築。天然温泉インフィニティ風呂を満喫。"
      },
      {
        name: "享沐時光莊園渡假酒店 Shine Mood Resort Yuanli",
        type: "苑裡頂級美人湯泉",
        tier: "luxury",
        description: "700坪露天風呂水療、大面窗眺望火炎山與沖積平原，精緻私廚料理。",
        locationType: "海線郊區/苑裡溫泉",
        priceRange: "NT$ 6,000 - 13,000/晚",
        googleMapsQuery: "享沐時光莊園渡假酒店",
        enName: "Shine Mood Resort Yuanli",
        enType: "Luxury Hot Spring & Spa Resort",
        enDescription: "Expansive 700-ping open-air hydrotherapy spa overlooking Huoyan Mountain and coastal plains.",
        jaName: "享沐時光リゾート苑裡",
        jaType: "ラグジュアリー温泉リゾート",
        jaDescription: "広大な露天風呂スパ施設と火炎山を望む絶景。美人湯として名高い名宿。"
      }
    ]
  },
  "金門縣": {
    budget: [
      {
        name: "金門北山古洋樓背包客棧 Beishan Ancient Western Hostel",
        type: "戰役彈孔歷史背包客棧",
        tier: "budget",
        description: "古寧頭戰役彈痕歷史洋樓改裝，天井交誼、平價床位，青年旅人探索金門首選。",
        locationType: "古聚落/古寧頭北山",
        priceRange: "NT$ 650 - 1,200/晚",
        googleMapsQuery: "金門北山古洋樓背包客棧",
        enName: "Beishan Ancient Western-style Backpacker Hostel",
        enType: "Historic Heritage Hostel",
        enDescription: "Stay in a genuine historic mansion bearing battle scars, cozy dorms, and vibrant backpacker vibe.",
        jaName: "金門北山古洋館バックパッカーズ",
        jaType: "歴史遺産ゲストハウス",
        jaDescription: "古寧頭戦役の弾痕が残る歴史的洋館をリノベ。世界中の一人旅が集まる人気宿。"
      },
      {
        name: "金門救國團青年活動中心",
        type: "全齡平價青年客棧",
        tier: "budget",
        description: "緊鄰金城鎮金門高中，環境清幽安全，提供小資個人與雙人高CP值平價客房。",
        locationType: "市中心/金城鎮",
        priceRange: "NT$ 800 - 1,500/晚",
        googleMapsQuery: "金門青年活動中心",
        enName: "Kinmen Youth Activity Center",
        enType: "Affordable Community Lodge",
        enDescription: "Clean, quiet, and secure budget lodging in Jincheng town, great value for money.",
        jaName: "金門ユースアクティビティセンター",
        jaType: "公共エコノミーロッジ",
        jaDescription: "金城镇に位置し、安全清潔でリーズナブルな宿泊施設。観光拠点に最適。"
      }
    ],
    standard: [
      {
        name: "金門珠山大院閩南古厝民宿",
        type: "百年燕尾雙落大厝文旅",
        tier: "standard",
        description: "六百年珠山聚落核心，石雕木構精緻雕琢，夜間觀星品嚐高粱調酒慢活。",
        locationType: "古聚落/珠山傳統建築群",
        priceRange: "NT$ 2,400 - 3,800/晚",
        googleMapsQuery: "珠山大院民宿",
        enName: "Zhushan Courtyard Minnan Heritage B&B",
        enType: "Traditional Swallowtail Courtyard Inn",
        enDescription: "Authentic 600-year-old Minnan courtyard home with exquisite masonry, courtyard stargazing, and tea.",
        jaName: "珠山大院（伝統閩南古民家宿）",
        jaType: "伝統建築ヘリテージB&B",
        jaDescription: "600年の歴史を持つ珠山集落の燕尾型古民家。中庭での星空鑑賞とお茶の時間が格別。"
      },
      {
        name: "海福商務飯店 Hai Fu Hotel",
        type: "金城市區精緻商旅",
        tier: "standard",
        description: "金城鎮熱鬧商圈中心，步行可達模範街與總兵署，提供現代化舒適隔音客房。",
        locationType: "市中心/金城模範街商圈",
        priceRange: "NT$ 2,200 - 3,500/晚",
        googleMapsQuery: "金門海福商務飯店",
        enName: "Hai Fu Hotel Kinmen",
        enType: "Modern Downtown Boutique Hotel",
        enDescription: "In the heart of Jincheng town, walking distance to Mofan Street and Historic Military Headquarters.",
        jaName: "ハイフービジネスホテル金門（海福商務飯店）",
        jaType: "市街地コンフォートホテル",
        jaDescription: "金城模範街や総兵署へ徒歩圏内。最新設備と静かな防音客室で快適ステイ。"
      }
    ],
    luxury: [
      {
        name: "金湖飯店 Golden Lake Hotel",
        type: "五星太湖景觀旗艦大飯店",
        tier: "luxury",
        description: "金門首座五星級國際觀光飯店，緊鄰昇恆昌免稅廣場，坐擁太湖天鵝湖景與恆溫水療。",
        locationType: "湖畔/金湖太湖風景區",
        priceRange: "NT$ 5,200 - 11,000/晚",
        googleMapsQuery: "Golden Lake Hotel",
        enName: "Golden Lake Hotel Kinmen",
        enType: "5-Star Premier Lakefront Hotel",
        enDescription: "Kinmen's top 5-star international hotel overlooking scenic Lake Tai, adjacent to Ever Rich Plaza.",
        jaName: "ゴールデンレイクホテル（金湖飯店）",
        jaType: "5つ星レイクサイド最高級ホテル",
        jaDescription: "金門島随一の5つ星国際ホテル。風光明媚な太湖に隣接し、免税店直結。"
      },
      {
        name: "昇恆昌金湖大飯店 典雅行政套房",
        type: "免稅購物奢華度假殿堂",
        tier: "luxury",
        description: "極致奢華尊榮禮賓，尊享行政酒廊、頂級湖景水療，國際名品購物一站滿足。",
        locationType: "湖畔/金湖商圈",
        priceRange: "NT$ 6,800 - 15,000/晚",
        googleMapsQuery: "昇恆昌金湖大飯店",
        enName: "Ever Rich Golden Lake Executive Suites",
        enType: "Luxury Duty-Free Resort Suites",
        enDescription: "VIP executive lounge access, infinity lake views, spa sanctuary, and seamless duty-free shopping.",
        jaName: "エバーリッチゴールデンレイク エグゼクティブスイート",
        jaType: "免税店直結ラグジュアリースイート",
        jaDescription: "最上級のエグゼクティブラウンジと湖畔スパ。免税ショッピングと最高峰のホスピタリティ。"
      }
    ]
  },
  "臺中市": {
    budget: [
      {
        name: "路得行旅 國際青年旅館 台中站前館 Norden Ruder Hostel",
        type: "無印簡約植物青年旅舍",
        tier: "budget",
        description: "台中火車站前，天井採光滿植綠意，提供隱私單人房與背包床位，質感極高。",
        locationType: "市中心/台中車站",
        priceRange: "NT$ 750 - 1,500/晚",
        googleMapsQuery: "Norden Ruder Hostel Taichung",
        enName: "Norden Ruder Hostel Taichung",
        enType: "Nordic Minimalist Green Hostel",
        enDescription: "Across Taichung Railway Station, sunlit indoor atrium garden with ultra-clean private pods.",
        jaName: "ノルデンルーダーホステル台中駅前館",
        jaType: "北欧ナチュラルホステル",
        jaDescription: "台中駅正面、吹き抜けの中庭に緑が溢れる洗練された大人気ホステル。"
      },
      {
        name: "新驛旅店 台中車站店 CityInn Hotel Plus",
        type: "高CP值插畫設計商旅",
        tier: "budget",
        description: "台中火車站復興路出口旁，多彩現代文創插畫，服務親切貼心、設施新穎。",
        locationType: "市中心/台中車站後站",
        priceRange: "NT$ 1,200 - 2,000/晚",
        googleMapsQuery: "CityInn Hotel Plus Taichung Station Branch",
        enName: "CityInn Hotel Plus Taichung Station",
        enType: "Vibrant Pop-Art Value Hotel",
        enDescription: "Right behind Taichung Station with creative art murals, free self-service laundry, and great value.",
        jaName: "シティインホテルプラス台中駅店",
        jaType: "高コスパポップアートホテル",
        jaDescription: "台中駅裏口すぐ。ポップな現代アートと無料ランドリー完備の快適エコノミーホテル。"
      }
    ],
    standard: [
      {
        name: "逢甲商旅 La Vida Hotel",
        type: "北歐原木質感商旅",
        tier: "standard",
        description: "步行3分鐘直抵逢甲夜市，原木簡約北歐設計，客房寬敞且安靜隔音優良。",
        locationType: "市中心/逢甲夜市商圈",
        priceRange: "NT$ 2,800 - 4,200/晚",
        googleMapsQuery: "逢甲商旅 La Vida Hotel",
        enName: "La Vida Hotel Fengjia",
        enType: "Nordic Wood Boutique Hotel",
        enDescription: "3 minutes walk to Fengjia Night Market, quiet acoustic rooms with natural wood accents.",
        jaName: "ラ・ヴィーダホテル（逢甲商旅）",
        jaType: "北欧モダンブティックホテル",
        jaDescription: "逢甲夜市まで徒歩3分。天然木の温もりと高い遮音性を誇る人気ホテル。"
      },
      {
        name: "大毅老爺行旅 The Place Taichung",
        type: "草悟道美學設計行旅",
        tier: "standard",
        description: "座落國立台灣美術館與草悟道旁，菱形幾何觀景窗，當代藝術策展融入客房。",
        locationType: "市中心/美術館草悟道",
        priceRange: "NT$ 3,200 - 4,800/晚",
        googleMapsQuery: "The Place Taichung",
        enName: "The Place Taichung by Royal Group",
        enType: "Contemporary Art & Gallery Hotel",
        enDescription: "Next to National Taiwan Museum of Fine Arts with geometric skylight windows and art installations.",
        jaName: "ザ・プレイス台中（大毅老爺行旅）",
        jaType: "現代アートデザインホテル",
        jaDescription: "国立台湾美術館と草悟道に隣接。幾何学デザインの窓から街の緑を望む美学ホテル。"
      }
    ],
    luxury: [
      {
        name: "虹夕諾雅 谷關 HOSHINOYA Guguan",
        type: "頂級日式溫泉度假村",
        tier: "luxury",
        description: "星野集團在台首座奢華溫泉度假殿堂，群山環抱無邊際溪谷露天溫泉，專屬私人樓中樓湯殿。",
        locationType: "山區/谷關溫泉仙境",
        priceRange: "NT$ 18,000 - 38,000/晚",
        googleMapsQuery: "HOSHINOYA Guguan",
        enName: "HOSHINOYA Guguan",
        enType: "Ultra-Luxury Onsen Sanctuary",
        enDescription: "Hoshino Resorts premier Taiwan property, secluded mountain valley with pure restorative onsen waters.",
        jaName: "星のやグーグァン（虹夕諾雅 谷關）",
        jaType: "極上ラグジュアリー温泉リゾート",
        jaDescription: "星野リゾートが手掛ける山岳秘境。全室半露天風呂付きの極上和モダンリゾート。"
      },
      {
        name: "台中日月千禧酒店 Millennium Hotel Taichung",
        type: "七期政經都會五星旗艦",
        tier: "luxury",
        description: "台中七期市政核心，頂樓極炙牛排館俯瞰歌劇院天際線，戶外恆溫露天泳池。",
        locationType: "市中心/七期市政特區",
        priceRange: "NT$ 5,800 - 13,000/晚",
        googleMapsQuery: "Millennium Hotel Taichung",
        enName: "Millennium Hotel Taichung",
        enType: "5-Star Financial Hub Luxury",
        enDescription: "Heart of 7th Redevelopment Zone with rooftop grill overlooking the Opera House skyline.",
        jaName: "ミレニアムホテル台中（台中日月千禧酒店）",
        jaType: "5つ星都心ランドマークホテル",
        jaDescription: "台中国家歌劇院を望む好立地。屋外温水プールと極上ステーキハウスを完備。"
      }
    ]
  },
  "臺南市": {
    budget: [
      {
        name: "艸祭二手書店青旅 Cao Ji Book Inn",
        type: "二手書香青年旅舍",
        tier: "budget",
        description: "孔廟對面老書店改造，上萬本藏書環抱的閱讀床位，安靜且充滿老城詩意。",
        locationType: "市中心/孔廟府中街",
        priceRange: "NT$ 650 - 1,300/晚",
        googleMapsQuery: "艸祭二手書店青旅",
        enName: "Cao Ji Book Inn",
        enType: "Literary Bookshop Hostel",
        enDescription: "Sleeping among tens of thousands of books opposite the Confucian Temple in historic Tainan.",
        jaName: "ソウサイブックイン（艸祭二手書店青旅）",
        jaType: "ブックカフェホステル",
        jaDescription: "台南孔子廟の向かい。無数の古書に囲まれて眠る、本好き必見の静寂ホステル。"
      },
      {
        name: "快活慢行 青年旅宿 H& 台南館",
        type: "藍晒圖文青背包旅店",
        tier: "budget",
        description: "藍晒圖文創園區旁，簡約工業設計與綠植挑高天井，漫步國華街美食極近。",
        locationType: "市中心/藍晒圖園區",
        priceRange: "NT$ 750 - 1,400/晚",
        googleMapsQuery: "快活慢行 台南",
        enName: "HiLoft Youth Hostel Tainan",
        enType: "Industrial Chic Backpacker Hostel",
        enDescription: "Next to Blueprint Cultural Park and Guohua Street foodie haven with spacious common areas.",
        jaName: "ハイロフトホステル台南",
        jaType: "インダストリアルデザインホステル",
        jaDescription: "藍晒図文創園区近く。國華街のローカルフード巡りに最適な高コスパホステル。"
      },
      {
        name: "後壁菁寮無米樂漫活客棧",
        type: "後壁老街農村文青小棧",
        tier: "budget",
        description: "菁寮無米樂老街旁，老屋紅磚天井與農家純樸人情味，鄰近白河蓮花田與後壁車站。",
        locationType: "後壁/白河無米樂農村生活圈",
        priceRange: "NT$ 800 - 1,500/晚",
        googleMapsQuery: "菁寮 老街 民宿",
        enName: "Jingliao Rural Heritage Inn",
        enType: "Rural Village Hostel",
        enDescription: "Near Jingliao Old Street in Houbi, experience tranquil countryside living and local hospitality.",
        jaName: "菁寮農村ゲストハウス",
        jaType: "農村カルチャーホステル",
        jaDescription: "後壁・菁寮の歴史ある農村エリアに位置し、素朴で温かいおもてなしと田園風景を満喫。"
      },
      {
        name: "北門井仔腳鹽鄉休閒民宿",
        type: "北門海風瓦盤鹽田民宿",
        tier: "budget",
        description: "井仔腳瓦盤鹽田第一排，推窗即賞鹽田夕陽暮色，品嚐產地現撈虱目魚與蚵仔風味餐。",
        locationType: "北門/七股濱海鹽田風景區",
        priceRange: "NT$ 900 - 1,800/晚",
        googleMapsQuery: "北門 井仔腳 鹽鄉民宿",
        enName: "Beimen Salt Fields Country House",
        enType: "Coastal Salt Field B&B",
        enDescription: "Front row at Jingzijiao Salt Fields with iconic salt field sunset views and fresh seafood.",
        jaName: "北門塩田ゲストハウス",
        jaType: "海辺の塩田民宿",
        jaDescription: "井仔腳瓦盤塩田の目の前。夕日の絶景と獲れたてシーフードを味わえる海辺の宿。"
      }
    ],
    standard: [
      {
        name: "烏山頭湖境渡假會館 Hoya Resort Wushantou",
        type: "官田水庫湖畔親水會館",
        tier: "standard",
        description: "坐落烏山頭水庫風景區內，緊鄰八田與一紀念園區、六甲落羽松與官田西拉雅遊客中心，綠意湖光環抱。",
        locationType: "官田/六甲/柳營水庫生態圈",
        priceRange: "NT$ 2,800 - 4,200/晚",
        googleMapsQuery: "烏山頭湖境渡假會館",
        enName: "Hoya Resort Hotel Wushantou",
        enType: "Lakeside Eco Resort",
        enDescription: "Located inside Wushantou Reservoir scenic area, steps away from Hatta Yoichi Memorial Park and Liujia.",
        jaName: "烏山頭湖境リゾート（烏山頭湖境渡假會館）",
        jaType: "レイクサイドエコホテル",
        jaDescription: "烏山頭ダム風景区内に位置。八田與一記念公園や六甲・官田エリアの散策に最適な湖畔の宿。"
      },
      {
        name: "新營南瀛綠意商旅 Nan Ying Business Hotel",
        type: "北台南交通門戶商旅",
        tier: "standard",
        description: "鄰近新營車站與新營鐵道文化園區，迅速銜接柳營德元埤荷蘭村、六甲、官田與後壁，交通極為便捷。",
        locationType: "柳營/六甲/後壁生活圈樞紐",
        priceRange: "NT$ 2,400 - 3,800/晚",
        googleMapsQuery: "新營 商旅 飯店",
        enName: "Nan Ying Business Hotel Xinying",
        enType: "North Tainan Transit Hotel",
        enDescription: "Convenient hub near Xinying station, smoothly connecting to Liuying Dutch Village, Liujia, and Houbi.",
        jaName: "新営ビジネスホテル",
        jaType: "北台南トランジットホテル",
        jaDescription: "新営駅近く。柳営オランダ村や六甲、後壁などの観光地へスムーズに直結する快適ホテル。"
      },
      {
        name: "台南友愛街旅館 U.I.J Hotel & Hostel",
        type: "黑膠文青跨界設計旅店",
        tier: "standard",
        description: "黑膠音樂大廳、全天候共享開放廚房與露天發呆露台，文青旅人指名第一。",
        locationType: "市中心/友愛市場旁",
        priceRange: "NT$ 2,800 - 4,500/晚",
        googleMapsQuery: "U.I.J Hotel & Hostel 友愛街旅館",
        enName: "U.I.J Hotel & Hostel",
        enType: "Vinyl Music & Lifestyle Design Hotel",
        enDescription: "Vinyl listening lounge, 24/7 communal chef kitchen, and expansive open-air breeze terrace.",
        jaName: "UIJホテル＆ホステル（友愛街旅館）",
        jaType: "レコード＆カルチャーデザインホテル",
        jaDescription: "レコードの流れるロビー、広大なルーフトップテラス、共用オープンキッチンが話題。"
      },
      {
        name: "捷絲旅台南虎山館 Just Sleep Tainan Ten-Drum",
        type: "十鼓奇美糖廠藝術旅宿",
        tier: "standard",
        description: "緊鄰十鼓仁糖文創園區與奇美博物館，復古工業風糖廠設計與戶外景觀泳池，文化氣息濃郁。",
        locationType: "仁德/十鼓奇美文化園區旁",
        priceRange: "NT$ 3,000 - 4,800/晚",
        googleMapsQuery: "捷絲旅台南虎山館",
        enName: "Just Sleep Tainan Ten-Drum",
        enType: "Art & Sugar Mill Heritage Hotel",
        enDescription: "Adjacent to Ten Drum Cultural Village and Chimei Museum, featuring industrial heritage design and pool.",
        jaName: "ジャストスリープ台南虎山館",
        jaType: "アート＆デザインホテル",
        jaDescription: "十鼓文化村と奇美博物館に隣接。歴史ある製糖工場をオマージュしたスタイリッシュな人気ホテル。"
      },
      {
        name: "台南老爺行旅 The Place Tainan",
        type: "紅磚花磚在地美學行旅",
        tier: "standard",
        description: "南紡購物中心共構，將荷蘭幾何與台南傳統花磚紅磚巧妙融合，餐飲口碑極佳。",
        locationType: "市中心/東區南紡商圈",
        priceRange: "NT$ 2,900 - 4,600/晚",
        googleMapsQuery: "The Place Tainan 台南老爺行旅",
        enName: "The Place Tainan",
        enType: "Cultural Heritage Design Hotel",
        enDescription: "Blending Dutch colonial geometry with Minnan red brick and vintage tiles, linked to T.S. Mall.",
        jaName: "ザ・プレイス台南（台南老爺行旅）",
        jaType: "台湾レトロモダンホテル",
        jaDescription: "台南の伝統レンガやマジョリカタイルを現代的に昇華させた洗練ホテル。"
      },
      {
        name: "煙波大飯店台南館 Lakeside Hotel Tainan",
        type: "市心首選星級商旅",
        tier: "standard",
        description: "正對台南美術館二館，配備完善露天溫水泳池與三溫暖水療，早餐府城小吃名宴薈萃。",
        locationType: "市中心/南美館正對面",
        priceRange: "NT$ 3,100 - 4,800/晚",
        googleMapsQuery: "煙波大飯店台南館",
        enName: "Lakeside Hotel Tainan",
        enType: "City Center Premium Hotel",
        enDescription: "Opposite Tainan Art Museum Building 2, featuring open-air pool and authentic local breakfast.",
        jaName: "レイクサイドホテル台南（煙波大飯店台南館）",
        jaType: "プレミアムシティホテル",
        jaDescription: "台南市美術館2館の真向かい。温水プールやサウナ完備、地元グルメ朝食が好評。"
      },
      {
        name: "和逸飯店台南西門館 Hotel Cozzi Ximen Tainan",
        type: "親子都會設計休閒旅宿",
        tier: "standard",
        description: "五百坪奇趣操場戶外遊戲區與卡通頻道主題房，臨近新光三越與藍晒圖園區。",
        locationType: "市中心/西門新光三越旁",
        priceRange: "NT$ 3,200 - 5,200/晚",
        googleMapsQuery: "和逸飯店 台南西門館",
        enName: "Hotel Cozzi Ximen Tainan",
        enType: "Urban Family Leisure Hotel",
        enDescription: "Adjacent to Shin Kong Mitsukoshi and Blueprint Park, featuring a 500-ping outdoor leisure playground.",
        jaName: "ホテルコッツィ台南西門館",
        jaType: "ファミリーレジャーデザインホテル",
        jaDescription: "新光三越と藍晒図文創園区に隣接。広大な屋外プレイエリアを備えた人気ホテル。"
      }
    ],
    luxury: [
      {
        name: "柳營尖山埤渡假村 Jianshanpi Jiangnan Resort",
        type: "五星江南水岸渡假名邸",
        tier: "luxury",
        description: "百甲湖光山色生態水岸，擁有醉月小樓水上Villa、江南畫舫遊湖與露天親水泳池，直通柳營六甲官田。",
        locationType: "柳營/六甲/官田湖畔風景區",
        priceRange: "NT$ 5,200 - 11,000/晚",
        googleMapsQuery: "柳營尖山埤渡假村",
        enName: "Jianshanpi Resort Tainan",
        enType: "5-Star Lakeside Villa Resort",
        enDescription: "Scenic lakefront resort in Liuying with overwater villas, traditional boat cruises, and tranquil nature.",
        jaName: "尖山埤江南リゾート（柳營尖山埤渡假村）",
        jaType: "5つ星水上ヴィラリゾート",
        jaDescription: "柳営の広大な湖畔に佇む高級リゾート。水上ヴィラや遊覧船があり、六甲や官田へのアクセス抜群。"
      },
      {
        name: "關子嶺景大渡假莊園 King's Garden Villa",
        type: "白河泥漿溫泉歐風莊園",
        tier: "luxury",
        description: "世界三大泥漿溫泉之一，八百坪歐洲莊園露天百草精油泥漿風呂，養顏舒壓聖境。",
        locationType: "白河/東山/關子嶺泥漿溫泉區",
        priceRange: "NT$ 5,800 - 13,000/晚",
        googleMapsQuery: "關子嶺景大渡假莊園",
        enName: "King's Garden Villa Guanziling",
        enType: "Rare Mud Spring European Manor",
        enDescription: "World-famous rare mineral mud hot springs with expansive 800-ping botanical spa pools.",
        jaName: "景大リゾートヴィラ（關子嶺景大渡假莊園）",
        jaType: "世界三大泥温泉リゾート",
        jaDescription: "世界屈指の天然泥温泉（泥湯）を満喫。広大なヨーロッパ風ハーブスパガーデン併設。"
      },
      {
        name: "台南晶英酒店 Silks Place Tainan",
        type: "儒風府城五星文化旗艦",
        tier: "luxury",
        description: "融入儒家書院與鼓藝文化，戶外高空恆溫泳池直面古城天際線，烤鴨名饌馳名。",
        locationType: "市中心/西門新光商圈",
        priceRange: "NT$ 5,600 - 12,000/晚",
        googleMapsQuery: "Silks Place Tainan",
        enName: "Silks Place Tainan",
        enType: "5-Star Confucius Academy Luxury",
        enDescription: "Infusing Confucian heritage with contemporary luxury, heated outdoor pool, and renowned roast duck.",
        jaName: "シルクスプレイス台南（台南晶英酒店）",
        jaType: "5つ星最高級カルチャーホテル",
        jaDescription: "儒教の書院文化を取り入れた重厚な空間。屋外温水プールと絶品ローストダックが人気。"
      },
      {
        name: "台南大員皇冠假日酒店 Crowne Plaza Tainan",
        type: "安平水岸自然景觀五星",
        tier: "luxury",
        description: "緊鄰安平國家歷史風景區與鹽水溪出海口，客房飽覽台江國家公園水鳥濕地夕照。",
        locationType: "安平水岸/台江國家公園旁",
        priceRange: "NT$ 5,500 - 12,000/晚",
        googleMapsQuery: "台南大員皇冠假日酒店",
        enName: "Crowne Plaza Tainan",
        enType: "5-Star Waterfront Nature Resort",
        enDescription: "Near Anping historic zone and Taijiang wetlands, spectacular river-mouth sunset views.",
        jaName: "クラウンプラザ台南（台南大員皇冠假日酒店）",
        jaType: "5つ星ウォーターフロントリゾート",
        jaDescription: "安平の歴史地区と台江国立公園に隣接。夕日と湿地帯の絶景を楽しめる高級ホテル。"
      },
      {
        name: "台南遠東香格里拉 Shangri-La Far Eastern Tainan",
        type: "火車站地標天際五星",
        tier: "luxury",
        description: "臺南第一高樓圓形地標，直通後火車站，心型戶外池畔與全景醉月樓江浙美饌。",
        locationType: "市中心/火車站商圈",
        priceRange: "NT$ 5,200 - 11,000/晚",
        googleMapsQuery: "台南遠東香格里拉",
        enName: "Shangri-La Far Eastern Tainan",
        enType: "5-Star Skyline Landmark Hotel",
        enDescription: "Iconic circular high-rise next to Tainan Station with heart-shaped pool and 38th-floor panoramic dining.",
        jaName: "シャングリ・ラ ファーイースタン台南",
        jaType: "5つ星スカイラインランドマークホテル",
        jaDescription: "台南最高層ランドマーク。駅直結、ハート型プールと最上階パノラマ中華レストランが自慢。"
      }
    ]
  },
  "高雄市": {
    budget: [
      {
        name: "飛行家青年旅館 Aviator Hostel",
        type: "捷運三多平價背包客棧",
        tier: "budget",
        description: "三多商圈捷運站出口旁，航空飛鏢主題交誼廳，乾淨通風的實木隔音床位。",
        locationType: "市中心/三多商圈站",
        priceRange: "NT$ 650 - 1,200/晚",
        googleMapsQuery: "飛行家青年旅館 高雄",
        enName: "Aviator Hostel Kaohsiung",
        enType: "Aviation-Themed Backpacker Hostel",
        enDescription: "Right beside Sanduo Shopping District MRT with clean solid-wood capsule-style pods.",
        jaName: "アビエイターホステル高雄",
        jaType: "空港テーマカプセルホステル",
        jaDescription: "三多商圏駅すぐ。清潔なプライベート木製ドミトリーと広い交流ラウンジ完備。"
      },
      {
        name: "頭等艙飯店 高雄站前館 Airline Inn",
        type: "火車站前高CP經濟商旅",
        tier: "budget",
        description: "高雄車站步行2分鐘，機艙座艙流線設計，配備乾濕分離衛浴與豐盛自助早餐。",
        locationType: "市中心/高雄車站",
        priceRange: "NT$ 1,100 - 1,900/晚",
        googleMapsQuery: "Airline Inn Kaohsiung Station",
        enName: "Airline Inn Kaohsiung Station",
        enType: "Sleek Cabin-Style Value Hotel",
        enDescription: "2 mins from Kaohsiung Main Station, cabin-inspired aesthetic with hearty breakfast.",
        jaName: "エアラインイン高雄駅前館",
        jaType: "キャビンスタイルエコノミーホテル",
        jaDescription: "高雄駅徒歩2分。飛行機のファーストクラスをイメージした機能的で快適な客室。"
      }
    ],
    standard: [
      {
        name: "城市商旅 高雄真愛館 City Suites Kaohsiung",
        type: "駁二港灣景觀商旅",
        tier: "standard",
        description: "緊鄰駁二藝術特區與大港橋，落地大窗直面高雄港水岸，輕軌真愛碼頭站旁。",
        locationType: "海港/駁二大港橋水岸",
        priceRange: "NT$ 2,300 - 3,800/晚",
        googleMapsQuery: "城市商旅 高雄真愛館",
        enName: "City Suites - Kaohsiung Chenai",
        enType: "Harbor Pier-2 View Hotel",
        enDescription: "Fronting Kaohsiung Harbor and the Great Harbor Bridge, footsteps from Pier-2 Art Center.",
        jaName: "シティスイーツ高雄真愛館",
        jaType: "ウォーターフロントハーバーホテル",
        jaDescription: "駁二アート特区と大港橋の目の前。ライトレール駅至近で港の夜景を一望。"
      },
      {
        name: "喜迎旅店 Greet Inn",
        type: "工業貨櫃海洋文旅",
        tier: "standard",
        description: "前金區市議會站旁，將貨櫃與港灣工業風融為一體，下午茶免費點心吧極受歡迎。",
        locationType: "市中心/市議會捷運站",
        priceRange: "NT$ 2,500 - 4,000/晚",
        googleMapsQuery: "喜迎旅店 Greet Inn",
        enName: "Greet Inn Kaohsiung",
        enType: "Maritime Container Design Hotel",
        enDescription: "Stylish container chic next to City Council MRT, featuring complimentary afternoon snack bar.",
        jaName: "グリートイン高雄（喜迎旅店）",
        jaType: "港湾コンテナデザインホテル",
        jaDescription: "コンテナをモチーフにした港町らしいデザイン。無料アフタヌーンティーが好評。"
      }
    ],
    luxury: [
      {
        name: "高雄洲際酒店 InterContinental Kaohsiung",
        type: "亞洲新灣區頂級奢華旗艦",
        tier: "luxury",
        description: "座落亞灣核心摩天大樓，引進智慧奢華客房、WA-RA日式酒吧與高空無邊際水療池。",
        locationType: "海港市中心/亞灣經貿特區",
        priceRange: "NT$ 6,500 - 15,000/晚",
        googleMapsQuery: "InterContinental Kaohsiung",
        enName: "InterContinental Kaohsiung",
        enType: "5-Star New Bay Area Luxury Icon",
        enDescription: "Inside modern skyscraper in Asia New Bay Area, smart voice controls, and WA-RA Japanese grill.",
        jaName: "インターコンチネンタル高雄",
        jaType: "5つ星国際最高級ホテル",
        jaDescription: "アジア新湾区のランドマーク。最新スマート客室と本格日本料理・BARを完備。"
      },
      {
        name: "晶英國際行館 Silks Club",
        type: "全行政套房頂級私人行館",
        tier: "luxury",
        description: "全館專為頂級菁英設計，Ukai-tei米其林鐵板燒進駐，極致寧靜與藝術微風氛圍。",
        locationType: "市中心/三多亞灣區",
        priceRange: "NT$ 8,500 - 22,000/晚",
        googleMapsQuery: "Silks Club 高雄",
        enName: "Silks Club Kaohsiung",
        enType: "All-Suite Ultra-Luxury Art Sanctuary",
        enDescription: "All-suite sanctuary home to Michelin-starred UKAI Teppanyaki, curated art, and infinity pool.",
        jaName: "シルクスクラブ（晶英國際行館）",
        jaType: "全室スイート最高峰プライベートホテル",
        jaDescription: "世界的名店「うかい亭」を誘致。静寂と現代アートが息づく最高峰スイートホテル。"
      }
    ]
  },
  "臺東縣": {
    budget: [
      {
        name: "路得行旅 國際青年旅館 台東館",
        type: "純白天井小資背包客棧",
        tier: "budget",
        description: "純白極簡天井採光設計，步行即達鐵花村與觀光夜市，提供質感背包床位與寬敞交誼廳。",
        locationType: "市中心/鐵花生活圈",
        priceRange: "NT$ 750 - 1,500/晚",
        googleMapsQuery: "路得行旅 台東館",
        enName: "Norden Ruder Hostel Taitung",
        enType: "Minimalist Atrium Youth Hostel",
        enDescription: "Sunlit minimalist atrium near Tiehua Music Village and Night Market, offering chic dorms and social lounge.",
        jaName: "ノルデンルーダーホステル台東館",
        jaType: "アトリウムデザインユースホステル",
        jaDescription: "吹き抜けのアトリウムが開放的な人気ホステル。鉄花村や夜市まで徒歩圏内でアクセス抜群。"
      },
      {
        name: "途中台東青年旅舍 On My Way Taitung Hostel",
        type: "站前人文溫馨背包客棧",
        tier: "budget",
        description: "緊鄰台東火車站前，乾淨舒適單人床位與旅人地圖牆，深受國內外自由行背包客喜愛。",
        locationType: "台東車站特區",
        priceRange: "NT$ 650 - 1,350/晚",
        googleMapsQuery: "途中台東青年旅舍",
        enName: "On My Way Taitung Hostel",
        enType: "Cozy Station-side Backpacker Hostel",
        enDescription: "Conveniently in front of Taitung Station, clean dorms, travel books, and welcoming community vibe.",
        jaName: "途中台東ユースホステル",
        jaType: "アットホームな駅前ホステル",
        jaDescription: "台東駅の目の前に位置し、清潔なベッドと親しみやすいスタッフが好評。"
      }
    ],
    standard: [
      {
        name: "The GAYA Hotel 潮渡假酒店",
        type: "文創設計風格精品文旅",
        tier: "standard",
        description: "頂樓無邊際泳池眺望台東山海景觀，融入在地人文原創元素，步行可達鐵花市集與美食商圈。",
        locationType: "鐵花村文創商圈",
        priceRange: "NT$ 3,200 - 4,800/晚",
        googleMapsQuery: "The GAYA Hotel 潮渡假酒店",
        enName: "The GAYA Hotel Taitung",
        enType: "Boutique Cultural Design Hotel",
        enDescription: "Rooftop infinity pool with Pacific and mountain views, blending aboriginal arts with modern luxury.",
        jaName: "THE GAYA HOTEL 潮リゾート台東",
        jaType: "ブティックデザインリゾート",
        jaDescription: "屋上インフィニティプールから山と海のパノラマを一望。鉄花村のアートスポットに隣接。"
      },
      {
        name: "台東南豐鐵花棧",
        type: "優質商旅文創飯店",
        tier: "standard",
        description: "緊鄰鐵花步道與轉運站，現代極簡舒適客房與鐵花食坊，周邊在地小吃林立、交通便捷。",
        locationType: "市中心/鐵花音樂聚落",
        priceRange: "NT$ 2,600 - 3,900/晚",
        googleMapsQuery: "台東南豐鐵花棧",
        enName: "Inn By the Village Taitung",
        enType: "Contemporary Urban Comfort Hotel",
        enDescription: "Adjacent to Tiehua pedestrian path and bus station, comfortable modern rooms with easy food walk.",
        jaName: "イン バイ ザ ヴィレッジ（台東南豊鉄花桟）",
        jaType: "モダンシティホテル",
        jaDescription: "鉄花音楽村のすぐそばに位置し、観光とグルメ散策の拠点として極めて便利な快適ホテル。"
      }
    ],
    luxury: [
      {
        name: "知本老爺酒店 Hotel Royal Chihpen",
        type: "五星溫泉頂級渡假大飯店",
        tier: "luxury",
        description: "座落知本山林間，坐擁美人湯天幕風呂、四面翠綠環山，享受頂級原湯水療與原住民風味饗宴。",
        locationType: "知本溫泉風景特區",
        priceRange: "NT$ 6,800 - 16,800/晚",
        googleMapsQuery: "知本老爺酒店",
        enName: "Hotel Royal Chihpen",
        enType: "5-Star Hot Spring Sanctuary Resort",
        enDescription: "Nestled in verdant Chihpen mountains with premier sodium bicarbonate hot spring pools and spa retreats.",
        jaName: "ホテルロイヤル知本（知本老爺大酒店）",
        jaType: "5つ星最高級温泉リゾートホテル",
        jaDescription: "大自然に抱かれた知本温泉の名門。名湯「美人湯」の露天風呂と先住民族の伝統文化体験が魅力。"
      },
      {
        name: "台東桂田喜來登酒店 Sheraton Taitung Hotel",
        type: "國際星級市心地標奢華酒店",
        tier: "luxury",
        description: "台東市中心第一高樓，坐擁絕佳市景與太平洋晨曦，配備露天泳池與阿力海百匯星級私廚餐廳。",
        locationType: "市中心/正氣路商圈",
        priceRange: "NT$ 5,800 - 13,800/晚",
        googleMapsQuery: "台東桂田喜來登酒店",
        enName: "Sheraton Taitung Hotel",
        enType: "International 5-Star Landmark Hotel",
        enDescription: "Landmark high-rise in Taitung city center with open-air pool, premium bedding, and famous seafood buffet.",
        jaName: "シェラトン台東ホテル（台東桂田喜来登酒店）",
        jaType: "国際5つ星ランドマークホテル",
        jaDescription: "台東市街地随一の高層ホテル。市内と太平洋の景色を一望し、豪華ビュッフェとスパを完備。"
      },
      {
        name: "鹿鳴溫泉酒店 Luminous Hot Spring Resort",
        type: "縱谷景觀溫泉渡假村",
        tier: "luxury",
        description: "座落花東縱谷鹿野溪畔，每間客房均享觀音石私家溫泉浴池，環境純淨幽靜，鄰近熱氣球鹿野高台。",
        locationType: "鹿野高台風景特區",
        priceRange: "NT$ 6,200 - 15,000/晚",
        googleMapsQuery: "鹿鳴溫泉酒店",
        enName: "Luminous Hot Spring Resort & Spa",
        enType: "Valley View Hot Spring Resort",
        enDescription: "Set in East Rift Valley by Luye River, in-room private stone hot spring tubs near Hot Air Balloon terrace.",
        jaName: "ルミナスホットスプリングリゾート＆スパ（鹿鳴温泉酒店）",
        jaType: "花東縦谷マウンテン温泉リゾート",
        jaDescription: "全室に天然温泉風呂を備えた静寂のリゾート。鹿野高台の熱気球フェスティバル会場至近。"
      }
    ]
  },
  "花蓮縣": {
    budget: [
      {
        name: "島花青年旅舍 Hualien Wow Hostel",
        type: "站前工業文青背包客棧",
        tier: "budget",
        description: "花蓮火車站正對面，工業風設計與溫馨木質交誼廳，提供舒適單人床位與豐富旅遊資訊。",
        locationType: "花蓮車站前",
        priceRange: "NT$ 700 - 1,400/晚",
        googleMapsQuery: "Hualien Wow Hostel",
        enName: "Hualien Wow Hostel",
        enType: "Industrial Chic Youth Hostel",
        enDescription: "Directly facing Hualien Railway Station, chic communal space, clean dorms, and great local tips.",
        jaName: "花蓮ワオホステル（花蓮WOW）",
        jaType: "インダストリアルデザインホステル",
        jaDescription: "花蓮駅の真正面に位置し、抜群の立地と洗練された共用ラウンジで国際的な旅人に大人気。"
      }
    ],
    standard: [
      {
        name: "煙波大飯店 花蓮館 Lakeshore Hotel Hualien",
        type: "太平洋海景景觀商旅",
        tier: "standard",
        description: "座落美崙山畔，客房可遠眺太平洋碧海藍天，館內三溫暖水療與海線美饌一應俱全。",
        locationType: "美崙海景商圈",
        priceRange: "NT$ 3,000 - 4,600/晚",
        googleMapsQuery: "煙波大飯店 花蓮館",
        enName: "Lakeshore Hotel Hualien",
        enType: "Pacific Seaview Comfort Hotel",
        enDescription: "Overlooking the Pacific Ocean from Meilun district, featuring rejuvenating spa facilities and sea-view rooms.",
        jaName: "レイクショアホテル花蓮（煙波大飯店 花蓮館）",
        jaType: "パシフィックオーシャンビューホテル",
        jaDescription: "太平洋を見下ろす絶好のロケーション。スパサウナ施設も充実した快適なホテル。"
      }
    ],
    luxury: [
      {
        name: "太魯閣晶英酒店 Silks Place Taroko",
        type: "國家公園峽谷五星奢華度假殿堂",
        tier: "luxury",
        description: "座落太魯閣國家公園峽谷心臟地帶，頂樓無邊際峽谷泳池直面大理石岩壁，全台頂級渡假首選。",
        locationType: "太魯閣國家公園/天祥",
        priceRange: "NT$ 9,500 - 25,000/晚",
        googleMapsQuery: "太魯閣晶英酒店",
        enName: "Silks Place Taroko",
        enType: "5-Star Gorge Luxury Resort",
        enDescription: "The only luxury resort within Taroko Gorge National Park, rooftop canyon infinity pool and Michelin-level dining.",
        jaName: "シルクスプレイス太魯閣（太魯閣晶英酒店）",
        jaType: "太魯閣峡谷5つ星最高峰リゾート",
        jaDescription: "太魯閣国立公園内の絶壁に佇むラグジュアリーホテル。渓谷を見下ろす屋上プールは息をのむ絶景。"
      },
      {
        name: "遠雄悅來大飯店 Farglory Hotel Hualien",
        type: "維多利亞海景五星度假飯店",
        tier: "luxury",
        description: "雄踞壽豐海岸山脈，東臨太平洋無垠海景，西俯瞰花東縱谷，英倫維多利亞貴族度假氛圍。",
        locationType: "壽豐太平洋海景特區",
        priceRange: "NT$ 6,500 - 16,000/晚",
        googleMapsQuery: "遠雄悅來大飯店",
        enName: "Farglory Hotel Hualien",
        enType: "Victorian Seaview 5-Star Resort",
        enDescription: "Perched atop coastal range with dual views of Pacific Ocean and East Rift Valley, Victorian elegance.",
        jaName: "ファーグローリーホテル花蓮（遠雄悅來大飯店）",
        jaType: "ビクトリア調オーシャンビューリゾート",
        jaDescription: "太平洋と花東縦谷を同時に見渡す山頂リゾート。豪華な洋館建築と充実のアクティビティ。"
      }
    ]
  },
  "宜蘭縣": {
    budget: [
      {
        name: "東旅背包客 East Hostel Jiaoxi",
        type: "礁溪溫泉小資青旅",
        tier: "budget",
        description: "緊鄰礁溪火車站與轉運站，館內設有日式天然溫泉泡湯池，小資也能享受純正美人湯。",
        locationType: "礁溪溫泉特區",
        priceRange: "NT$ 800 - 1,600/晚",
        googleMapsQuery: "東旅背包客 礁溪",
        enName: "East Hostel Jiaoxi",
        enType: "Hot Spring Backpacker Hostel",
        enDescription: "Next to Jiaoxi Station, features authentic natural Japanese hot spring onsen for budget travelers.",
        jaName: "イーストホステル礁渓（東旅背包客）",
        jaType: "天然温泉付きユースホステル",
        jaDescription: "礁渓駅から徒歩圏内。館内で天然温泉に浸かることができる高コスパな人気ホステル。"
      }
    ],
    standard: [
      {
        name: "捷絲旅 宜蘭礁溪館 Just Sleep Jiaoxi",
        type: "日系獨立風呂精品文旅",
        tier: "standard",
        description: "每間客房均配有超大磨石子溫泉湯池，更設有傳統日式男女大眾風呂，晶華酒店集團精緻之作。",
        locationType: "礁溪溫泉商圈核心",
        priceRange: "NT$ 3,200 - 4,900/晚",
        googleMapsQuery: "捷絲旅 宜蘭礁溪館",
        enName: "Just Sleep Jiaoxi",
        enType: "Japanese Onsen Boutique Hotel",
        enDescription: "Oversized in-room stone hot spring tubs and traditional onsen baths by Silks Hotel Group.",
        jaName: "ジャストスリープ礁渓（捷絲旅 宜蘭礁溪館）",
        jaType: "デザイナーズ温泉ブティックホテル",
        jaDescription: "全室に広々とした石造り温泉風呂を完備。リージェントグループの洗練されたおもてなし。"
      }
    ],
    luxury: [
      {
        name: "礁溪老爺酒店 Hotel Royal Chiaohsi",
        type: "五星日式野天風呂頂級酒店",
        tier: "luxury",
        description: "俯瞰蘭陽平原夜景，坐擁無邊際野天風呂與洞天男女風呂，日式細膩待客之道與米其林級旬味饗宴。",
        locationType: "五峰旗風景區",
        priceRange: "NT$ 9,000 - 22,000/晚",
        googleMapsQuery: "礁溪老爺酒店",
        enName: "Hotel Royal Chiaohsi",
        enType: "5-Star Open-Air Onsen Luxury Resort",
        enDescription: "Panoramic view over Lanyang Plain, renowned open-air mountain hot spring baths and kaiseki dining.",
        jaName: "ホテルロイヤル礁渓（礁溪老爺酒店）",
        jaType: "5つ星最高級和風温泉旅館",
        jaDescription: "蘭陽平野を一望する露天風呂と極上の会席料理。台湾屈指のクオリティを誇る温泉宿。"
      },
      {
        name: "蘭城晶英酒店 Silks Place Yilan",
        type: "親子與櫻桃鴨名饌星級酒店",
        tier: "luxury",
        description: "宜蘭市中心核心地標，名列全台頂級渡假飯店，紅樓中餐廳櫻桃烤鴨名震全台。",
        locationType: "宜蘭市中心新月廣場",
        priceRange: "NT$ 7,500 - 18,000/晚",
        googleMapsQuery: "蘭城晶英酒店",
        enName: "Silks Place Yilan",
        enType: "Premier 5-Star City Resort",
        enDescription: "Downtown Yilan landmark, home to legendary Red Lantern Cherry Duck dining and lavish amenities.",
        jaName: "シルクスプレイス宜蘭（蘭城晶英酒店）",
        jaType: "5つ星名門シティリゾートホテル",
        jaDescription: "台湾一有名なローストダックの名店を擁する高級ホテル。充実したレジャー施設。"
      }
    ]
  },
  "屏東縣": {
    budget: [
      {
        name: "恆春恆8聯排青旅 Hengchun 8 Hostel",
        type: "古城文化文青客棧",
        tier: "budget",
        description: "座落恆春百年古城旁，陽光灑落的交誼天井，漫步可達西門與老街傳統小吃。",
        locationType: "恆春古城西門商圈",
        priceRange: "NT$ 650 - 1,300/晚",
        googleMapsQuery: "恆春 青年旅館",
        enName: "Hengchun 8 Backpacker Hostel",
        enType: "Historic Old Town Youth Hostel",
        enDescription: "Next to centuries-old Hengchun ancient city gates, sunny social courtyard and authentic street food.",
        jaName: "恒春エイトホステル",
        jaType: "古城歴史街区ホステル",
        jaDescription: "100年の歴史を持つ恒春古城のすぐそば。レトロな街並みと南国のスローライフを満喫。"
      }
    ],
    standard: [
      {
        name: "承億文旅 墾丁雅客小半島 Hotelday+ Kenting",
        type: "熱帶渡假美學精品文旅",
        tier: "standard",
        description: "隱身於墾丁大街入口的熱帶綠意綠洲，落地窗花園泳池與波西米亞原木風格，鬧中取靜。",
        locationType: "墾丁大街前緣",
        priceRange: "NT$ 2,800 - 4,500/晚",
        googleMapsQuery: "承億文旅 墾丁雅客小半島",
        enName: "Hotelday+ Kenting",
        enType: "Tropical Bohemian Boutique Resort",
        enDescription: "An oasis of lush greenery at the entrance of Kenting Main Street, with garden pool and bohemian chic.",
        jaName: "ホテルデイプラス墾丁（承億文旅 墾丁雅客小半島）",
        jaType: "トロピカルブティックリゾート",
        jaDescription: "墾丁メインストリート入口に位置する南国オアシス。リゾート感あふれるプールとボヘミアンデザイン。"
      }
    ],
    luxury: [
      {
        name: "墾丁凱撒大飯店 Caesar Park Hotel Kenting",
        type: "五星南洋海濱頂級度假村",
        tier: "luxury",
        description: "直通小灣天然沙灘，棕櫚椰林圍繞南洋風無邊際泳池，享受國境之南最高規格濱海渡假禮遇。",
        locationType: "小灣沙灘第一排",
        priceRange: "NT$ 6,800 - 18,000/晚",
        googleMapsQuery: "墾丁凱撒大飯店",
        enName: "Caesar Park Hotel Kenting",
        enType: "5-Star Tropical Beachfront Sanctuary",
        enDescription: "Direct beach path to Xiaowan Beach, lush palm tree lagoon pools, premier tropical holiday retreat.",
        jaName: "シーザーパークホテル墾丁（墾丁凱撒大飯店）",
        jaType: "5つ星南国ビーチフロントリゾート",
        jaDescription: "美しい小湾ビーチへ直結。ヤシの木に囲まれたラグジュアリープールと極上のトロピカルリゾート。"
      },
      {
        name: "華泰瑞苑 墾丁賓館 Gloria Manor",
        type: "大尖山國家森林秘境奢華行館",
        tier: "luxury",
        description: "昔日蔣公行館改建，座落墾丁國家森林遊樂區，坐擁大尖山壯麗全景與無邊際海天山景泳池。",
        locationType: "墾丁大尖山森林特區",
        priceRange: "NT$ 8,800 - 24,000/晚",
        googleMapsQuery: "華泰瑞苑 墾丁賓館",
        enName: "Gloria Manor Kenting",
        enType: "Exclusive Luxury Forest Sanctuary",
        enDescription: "Former presidential villa surrounded by Kenting National Forest, facing majestic Mount Dajian.",
        jaName: "グロリアマナー（華泰瑞苑 墾丁賓館）",
        jaType: "大尖山を望む最高峰隠れ家リゾート",
        jaDescription: "旧総統行館をリノベした高級ホテル。大尖山の雄大な景観と静寂の自然美に包まれた名門宿。"
      }
    ]
  },
  "南投縣": {
    budget: [
      {
        name: "日月潭日光青旅 Sun Moon Lake Hostel",
        type: "水社湖畔小資青年旅舍",
        tier: "budget",
        description: "步行3分鐘抵達水社碼頭與客運站，舒適背包床位與湖景露台，單車環湖起點極佳。",
        locationType: "日月潭水社碼頭商圈",
        priceRange: "NT$ 750 - 1,500/晚",
        googleMapsQuery: "日月潭 青年旅館",
        enName: "Sun Moon Lake Backpacker Hostel",
        enType: "Lake Pier Youth Hostel",
        enDescription: "3 mins walk to Shuishe Pier and bus terminal, clean dorms, ideal for cycling around the lake.",
        jaName: "日月潭サンムーンホステル",
        jaType: "湖畔ユースホステル",
        jaDescription: "水社埠頭から徒歩3分。日月潭サイクリングロードの拠点に最適な快適ホステル。"
      }
    ],
    standard: [
      {
        name: "日月潭力麗哲園日潭館 The Richforest Sun Moon Lake",
        type: "伊達邵原民風情湖畔飯店",
        tier: "standard",
        description: "座落伊達邵老街商圈與碼頭旁，融入邵族原住民文化語彙，開窗即可感受湖光微風。",
        locationType: "伊達邵老街商圈",
        priceRange: "NT$ 3,200 - 4,800/晚",
        googleMapsQuery: "力麗哲園 日潭館",
        enName: "The Richforest Hotel Sun Moon Lake",
        enType: "Ita Thao Lakeside Culture Hotel",
        enDescription: "Next to Ita Thao Pier and aboriginal market, warm wood aesthetics with scenic lake air.",
        jaName: "リッチフォレストホテル日月潭 日潭館",
        jaType: "伊達邵湖畔ホテル",
        jaDescription: "サオ族の文化が息づく伊達邵エリアに位置。ロープウェイや商店街へのアクセスが便利。"
      }
    ],
    luxury: [
      {
        name: "涵碧樓酒店 The Lalu Sun Moon Lake",
        type: "日月潭極簡禪風世界級頂級酒店",
        tier: "luxury",
        description: "座落涵碧半島湖景第一排，由安藤忠雄風格設計師打造，全台無可取代的頂級奢華湖景地標。",
        locationType: "涵碧半島湖景核心",
        priceRange: "NT$ 18,000 - 38,000/晚",
        googleMapsQuery: "涵碧樓酒店 日月潭",
        enName: "The Lalu Sun Moon Lake",
        enType: "World-Class Zen Luxury Sanctuary",
        enDescription: "Perched on Lalu Peninsula, world-famous minimalist architecture with breathtaking lake panorama.",
        jaName: "ザ・ラルー（涵碧樓 日月潭）",
        jaType: "世界最高峰禅スタイルラグジュアリーホテル",
        jaDescription: "日月潭の特等席・涵碧半島に佇む台湾屈指の名門ホテル。鏡のようなインフィニティプールと静寂の美。"
      },
      {
        name: "雲品溫泉酒店 Fleur de Chine Hotel",
        type: "日月潭五星天然溫泉度假酒店",
        tier: "luxury",
        description: "日月潭唯一擁有天然碳酸氫鈉美人湯的五星飯店，客房大面落地窗直面壯麗湖景，米其林推薦美饌。",
        locationType: "日月潭北灣湖畔",
        priceRange: "NT$ 12,000 - 26,000/晚",
        googleMapsQuery: "雲品溫泉酒店",
        enName: "Fleur de Chine Hotel Sun Moon Lake",
        enType: "5-Star Hot Spring Lakeside Resort",
        enDescription: "The only 5-star resort in Sun Moon Lake with natural onsen springs, private lakeview balconies.",
        jaName: "フルールドシンホテル（雲品溫泉酒店）",
        jaType: "5つ星天然温泉レイクビューリゾート",
        jaDescription: "全室に天然温泉と湖を望むバルコニーを完備。ミシュラン推奨レストランと上質のスパ。"
      }
    ]
  },
  "澎湖縣": {
    budget: [
      {
        name: "澎湖背包客青年旅舍 Penghu Backpacker Hostel",
        type: "馬公市中心海島青旅",
        tier: "budget",
        description: "緊鄰馬公老街與天后宮商圈，提供跳島潛水客專屬裝備整理區與乾淨舒適單人床位。",
        locationType: "馬公舊城核心商圈",
        priceRange: "NT$ 650 - 1,350/晚",
        googleMapsQuery: "澎湖 青年旅館",
        enName: "Penghu Island Youth Hostel",
        enType: "Island Diving Youth Hostel",
        enDescription: "Near Magong Old Street and Tianhou Temple, gear storage for island hoppers, friendly vibe.",
        jaName: "ポンフーアイランドホステル",
        jaType: "アイランドダイバーズホステル",
        jaDescription: "馬公旧市街の中心部にあり、天后宮や海鮮グルメ通りへの散策に最適なバックパッカーズ宿。"
      }
    ],
    standard: [
      {
        name: "和田大飯店 MF Hotel Penghu",
        type: "港灣極簡生活質感商旅",
        tier: "standard",
        description: "座落馬公第一漁港旁，日式簡約無印風格，步行可達中正路商圈與南海遊客中心搭船出海。",
        locationType: "馬公第一漁港商圈",
        priceRange: "NT$ 2,500 - 3,900/晚",
        googleMapsQuery: "和田大飯店 澎湖",
        enName: "MF Hotel Penghu",
        enType: "Harbor Lifestyle Boutique Hotel",
        enDescription: "Harbor-side simplicity near Zhongzheng commercial street and South Sea Island Ferry Pier.",
        jaName: "MFホテル澎湖（和田大飯店）",
        jaType: "ハーバーサイドデザインホテル",
        jaDescription: "馬公港そばの洗練された北欧風ホテル。離島ツアーの出航ターミナルにも徒歩圏内。"
      }
    ],
    luxury: [
      {
        name: "澎湖福朋喜來登酒店 Four Points by Sheraton Penghu",
        type: "國際五星港灣景觀奢華地標",
        tier: "luxury",
        description: "澎湖唯一國際萬豪集團五星奢華酒店，超大海景無邊際泳池、國際海鮮百匯與頂級SPA水療。",
        locationType: "馬公第三漁港特區",
        priceRange: "NT$ 5,800 - 14,000/晚",
        googleMapsQuery: "澎湖福朋喜來登酒店",
        enName: "Four Points by Sheraton Penghu",
        enType: "International 5-Star Harbor Resort",
        enDescription: "The only international 5-star brand in Penghu, grand infinity pool overlooking fishing boats.",
        jaName: "フォーポイントバイシェラトン澎湖（澎湖福朋喜來登酒店）",
        jaType: "国際5つ星ハーバーリゾートホテル",
        jaDescription: "澎湖唯一のマリオット系5つ星ホテル。絶景のインフィニティプールと豪華シーフード料理。"
      },
      {
        name: "澎澄飯店 Discovery Hotel Penghu",
        type: "海洋探險精品五星渡假飯店",
        tier: "luxury",
        description: "緊鄰南海遊客中心與Pier3三號港免稅購物中心，以航海探險為設計概念，配備極限運動場與無邊際港景池。",
        locationType: "Pier3三號港免稅特區",
        priceRange: "NT$ 5,200 - 12,800/晚",
        googleMapsQuery: "澎澄飯店",
        enName: "Discovery Hotel Penghu",
        enType: "Nautical Luxury Adventure Hotel",
        enDescription: "Adjacent to Pier3 Duty Free Mall and South Sea Pier, nautical styling, infinity pool and climbing arena.",
        jaName: "ディスカバリーホテル（澎澄飯店）",
        jaType: "マリーナアドベンチャーリゾート",
        jaDescription: "免税ショッピングモールとフェリー乗り場に直結。航海をテーマにしたハイセンスな客室。"
      }
    ]
  },
  "連江縣": {
    budget: [
      {
        name: "馬祖南竿背包客棧 Matsu Backpacker Hostel",
        type: "閩東石屋聚落青年旅舍",
        tier: "budget",
        description: "座落南竿介壽村政經商圈，提供藍眼淚導覽諮詢與乾淨溫馨床位，小資探索戰地文化最佳據點。",
        locationType: "南竿介壽生活圈",
        priceRange: "NT$ 700 - 1,400/晚",
        googleMapsQuery: "馬祖 青年旅館",
        enName: "Matsu Backpacker Hostel",
        enType: "Stone Village Youth Hostel",
        enDescription: "In Jieshou village near restaurants, Blue Tears guidance, clean dorms for adventurous travelers.",
        jaName: "馬祖バックパッカーズホステル",
        jaType: "伝統石造り集落ホステル",
        jaDescription: "南竿島の中心街に位置。青い涙（夜光虫）鑑賞のアドバイスや戦地観光の拠点に最適。"
      }
    ],
    standard: [
      {
        name: "日光春墾 日光海岸海景旅宿 Solar Coast Hotel",
        type: "清水模懸崖海景設計文旅",
        tier: "standard",
        description: "矗立於南竿仁愛村海崖之上，極簡清水模建築與大面落地窗，直面夕陽落日與無垠海平面。",
        locationType: "南竿仁愛鐵堡海崖",
        priceRange: "NT$ 3,200 - 4,800/晚",
        googleMapsQuery: "日光海岸 馬祖",
        enName: "Solar Coast Hotel Matsu",
        enType: "Cliff-top Minimalist Seaview Hotel",
        enDescription: "Minimalist fair-faced concrete on cliff tops of Renai village, floor-to-ceiling sunset ocean views.",
        jaName: "ソーラーコーストホテル馬祖（日光海岸）",
        jaType: "絶壁オーシャンビューデザイン宿",
        jaDescription: "コンクリート打ち放しのモダン建築が海を見下ろす断崖に建つ。静寂と夕日のパノラマ。"
      }
    ],
    luxury: [
      {
        name: "馬祖巨神貓海景渡假酒店 Matsu Seaview Resort",
        type: "媽祖巨神像海景星級會館",
        tier: "luxury",
        description: "近眺媽祖巨神像與蔚藍海灣，五星級精緻客房與海景餐廳，提供老酒麵線星級私廚與高粱調酒體驗。",
        locationType: "馬祖巨神像/福澳港特區",
        priceRange: "NT$ 5,800 - 12,000/晚",
        googleMapsQuery: "馬祖 飯店",
        enName: "Matsu Seaview Landmark Resort",
        enType: "Premier Seaview Island Resort",
        enDescription: "Panoramic vistas of Matsu Colossus and harbor, luxury bedding, and aged Matsu liquor culinary pairings.",
        jaName: "馬祖シービューリゾートホテル",
        jaType: "ハーバーラグジュアリーリゾート",
        jaDescription: "マーズー巨神像と港を一望。地元の伝統老酒料理や特産品を贅沢に味わえる高級ホテル。"
      }
    ]
  },
  "桃園市": {
    budget: [
      {
        name: "168 Inn 桃園館",
        type: "藝文特區小資商務設計旅店",
        tier: "budget",
        description: "鄰近桃園藝文特區，簡約舒適客房與免費自助現磨咖啡吧，商務小資高CP值首選。",
        locationType: "桃園藝文特區",
        priceRange: "NT$ 1,200 - 1,800/晚",
        googleMapsQuery: "168 Inn 桃園館",
        enName: "168 Inn Taoyuan",
        enType: "Smart Budget Urban Inn",
        enDescription: "Near Taoyuan Arts District, modern clean rooms, free coffee bar, superior value.",
        jaName: "168イン桃園館",
        jaType: "スマートビジネスイン",
        jaDescription: "桃園アート地区近く、清潔でコストパフォーマンスに優れた快適ホテル。"
      }
    ],
    standard: [
      {
        name: "古華花園飯店 Hotel Kuva Chateau",
        type: "法式新古典風格精緻飯店",
        tier: "standard",
        description: "緊鄰中壢光明公園與中壢觀光夜市，法式典雅裝潢與多間星級中西餐廳，享受尊榮商旅時光。",
        locationType: "中壢光明公園/夜市商圈",
        priceRange: "NT$ 2,800 - 4,200/晚",
        googleMapsQuery: "古華花園飯店",
        enName: "Hotel Kuva Chateau",
        enType: "French Neo-Classical Hotel",
        enDescription: "Adjacent to Guangming Park and Zhongli Night Market, French neoclassical charm with fine dining.",
        jaName: "ホテルクーバシャトー（古華花園飯店）",
        jaType: "フレンチクラシックホテル",
        jaDescription: "中壢夜市と公園に隣接する優雅な洋館ホテル。落ち着いた客室と美味しいレストラン。"
      }
    ],
    luxury: [
      {
        name: "和逸飯店 桃園館 COZZI Blu",
        type: "海洋探險國際星級奢華飯店",
        tier: "luxury",
        description: "高鐵青埔站特區核心，直通Xpark水族館與華泰名品城Outlet，以白鯨與海洋為主題的頂級星級飯店。",
        locationType: "高鐵桃園青埔特區",
        priceRange: "NT$ 5,500 - 13,000/晚",
        googleMapsQuery: "COZZI Blu 和逸飯店 桃園館",
        enName: "COZZI Blu Taoyuan",
        enType: "Nautical International Luxury Hotel",
        enDescription: "Connected to Xpark Aquarium and Gloria Outlets, ocean voyage theme with lavish amenities.",
        jaName: "コッツィBlu 桃園館（和逸飯店 桃園館）",
        jaType: "海洋テーマ国際高級リゾート",
        jaDescription: "高鉄桃園駅前の巨大モールや水族館に直結。海の世界をモチーフにした洗練ホテル。"
      },
      {
        name: "大溪笠復威斯汀度假酒店 The Westin Tashee",
        type: "南洋渡假村五星頂級酒店",
        tier: "luxury",
        description: "大溪高爾夫球場旁，擁有全台最美戶外棕櫚泉泳池與天夢之床(Heavenly Bed)，國際頂級渡假殿堂。",
        locationType: "大溪風景特定區",
        priceRange: "NT$ 8,800 - 22,000/晚",
        googleMapsQuery: "大溪笠復威斯汀度假酒店",
        enName: "The Westin Tashee Resort Taoyuan",
        enType: "5-Star Tropical Luxury Resort",
        enDescription: "World-class palm tree pools and signature Heavenly Bed, next to Tashee Golf Course.",
        jaName: "ウェスティン大渓リゾート桃園（大溪笠復威斯汀）",
        jaType: "5つ星トロピカルゴルフリゾート",
        jaDescription: "バリ島を思わせるヤシの木プールとヘブンリーベッド。台湾屈指のラグジュアリーリゾート。"
      }
    ]
  },
  "新竹市": {
    budget: [
      {
        name: "新竹福泰商務飯店 Forte Hotel Hsinchu",
        type: "護城河文青舒適商旅",
        tier: "budget",
        description: "座落新竹護城河畔，緊鄰東門圓環與城隍廟商圈，位置絕佳、交通四通八達。",
        locationType: "市中心/護城河商圈",
        priceRange: "NT$ 1,500 - 2,200/晚",
        googleMapsQuery: "新竹福泰商務飯店",
        enName: "Forte Hotel Hsinchu",
        enType: "City Moat Commercial Inn",
        enDescription: "Set by the historic Hsinchu Moat near City God Temple, prime downtown convenience.",
        jaName: "フォルテホテル新竹（新竹福泰商務飯店）",
        jaType: "お堀端シティビジネスホテル",
        jaDescription: "新竹のお堀端緑道に面し、東門市場や城隍廟の美食街まで徒歩すぐの好立地。"
      }
    ],
    standard: [
      {
        name: "新竹老爺酒店 Hotel Royal Hsinchu",
        type: "都會日系尊榮五星商旅",
        tier: "standard",
        description: "緊鄰新竹科學園區門戶，日式尊榮禮賓與精緻鐵板燒、室內溫水泳池，園區商務旅行首選。",
        locationType: "竹科經貿特區",
        priceRange: "NT$ 3,600 - 5,200/晚",
        googleMapsQuery: "新竹老爺酒店",
        enName: "Hotel Royal Hsinchu",
        enType: "Japanese Hospitality Business Hotel",
        enDescription: "At the doorstep of Hsinchu Science Park, Japanese hospitality with heated indoor pool and spa.",
        jaName: "ホテルロイヤル新竹（新竹老爺酒店）",
        jaType: "日系ハイクラスビジネスホテル",
        jaDescription: "新竹サイエンスパーク至近。日系ならではのきめ細やかなおもてなしと充実した施設。"
      }
    ],
    luxury: [
      {
        name: "新竹國賓大飯店 Ambassador Hotel Hsinchu",
        type: "五星高空景觀奢華酒店",
        tier: "luxury",
        description: "新竹市中心摩天高樓，坐擁24層高空中庭與景觀客房，全台首屈一指的八方燴百匯美饌。",
        locationType: "市中心/巨城生活圈",
        priceRange: "NT$ 4,800 - 11,000/晚",
        googleMapsQuery: "新竹國賓大飯店",
        enName: "Ambassador Hotel Hsinchu",
        enType: "Skyline 5-Star Luxury Landmark",
        enDescription: "High-rise landmark with soaring 24-story atrium, panoramic rooms, and renowned Promenoir buffet.",
        jaName: "アンバサダーホテル新竹（新竹國賓大飯店）",
        jaType: "5つ星高層ランドマークホテル",
        jaDescription: "新竹市内中心部の高層タワー。吹き抜けのアトリウムと上質なスカイライン客室。"
      }
    ]
  },
  "新竹縣": {
    budget: [
      {
        name: "新竹豐邑喜來登小資文旅分館",
        type: "竹北高鐵生活圈舒適旅店",
        tier: "budget",
        description: "竹北光明商圈生活聚落，提供乾淨舒適床位，便利前往新瓦屋客家文化保存區。",
        locationType: "竹北高鐵生活圈",
        priceRange: "NT$ 1,400 - 2,000/晚",
        googleMapsQuery: "竹北 旅宿",
        enName: "Zhubei Station Inn",
        enType: "Modern Comfort High-Speed Rail Inn",
        enDescription: "Close to Zhubei HSR station and Guangming Food District, easy access to Hakka village.",
        jaName: "竹北ステーションイン",
        jaType: "新幹線駅前コンフォートイン",
        jaDescription: "竹北の高鉄駅エリアに位置し、客家文化村へのアクセスも便利な清潔なホテル。"
      }
    ],
    standard: [
      {
        name: "六福莊生態渡假旅館 Leofoo Resort Guanshi",
        type: "非洲草食動物生態渡假村",
        tier: "standard",
        description: "亞洲唯一草食動物生態度假旅館，打開陽台窗戶即可零距離俯瞰長頸鹿、犀牛與斑馬悠閒漫步。",
        locationType: "關西生態渡假特區",
        priceRange: "NT$ 4,800 - 8,500/晚",
        googleMapsQuery: "關西六福莊",
        enName: "Leofoo Resort Guanshi",
        enType: "African Safari Eco Resort",
        enDescription: "Asia's only safari resort where giraffes and zebras roam beneath your room balconies.",
        jaName: "レオフーリゾート関西（關西六福莊）",
        jaType: "アフリカンサファリエコリゾート",
        jaDescription: "キリンやシマウマが中庭を歩くアジア唯一のサファリ体験型リゾートホテル。"
      }
    ],
    luxury: [
      {
        name: "新竹豐邑喜來登大飯店 Sheraton Hsinchu Hotel",
        type: "國際五星奢華旗艦地標",
        tier: "luxury",
        description: "竹北核心地標，挑高奢華大廳與恆溫室內泳池，配備國際萬豪行政酒廊與頂級牛排館饗宴。",
        locationType: "竹北光明商圈核心",
        priceRange: "NT$ 5,800 - 15,000/晚",
        googleMapsQuery: "新竹豐邑喜來登大飯店",
        enName: "Sheraton Hsinchu Hotel",
        enType: "International 5-Star Luxury Flagship",
        enDescription: "Towering flagship in Zhubei with grand atrium, heated pool, and premier steakhouse.",
        jaName: "シェラトン新竹ホテル（新竹豐邑喜來登大飯店）",
        jaType: "国際5つ星ランドマークホテル",
        jaDescription: "竹北のランドマークタワー。広大なロビーと温水プール、洗練されたクラブラウンジ。"
      }
    ]
  },
  "基隆市": {
    budget: [
      {
        name: "基隆廟口輕旅 Keelung Light Inn",
        type: "廟口夜市小資文青旅舍",
        tier: "budget",
        description: "步行3分鐘抵達聞名全台的基隆廟口夜市與海洋廣場，提供簡約乾淨床位與交誼空間。",
        locationType: "基隆廟口夜市商圈",
        priceRange: "NT$ 800 - 1,500/晚",
        googleMapsQuery: "基隆 青年旅館",
        enName: "Keelung Night Market Light Inn",
        enType: "Night Market Youth Inn",
        enDescription: "3 mins walk to legendary Keelung Night Market and Maritime Plaza, clean beds for foodies.",
        jaName: "基隆ナイトマーケットライトイン",
        jaType: "夜市徒歩圏ユースイン",
        jaDescription: "基隆廟口夜市まで徒歩3分。夜遅くまで港町のB級グルメを食べ歩くのに最適な立地。"
      }
    ],
    standard: [
      {
        name: "集好旅店 Keebe Hotel",
        type: "現代設計質感精品文旅",
        tier: "standard",
        description: "座落廟口夜市旁靜巷，以沉穩黑灰鋼鐵與木質融合出港都設計感，客房隔音優良、備品細緻。",
        locationType: "廟口商圈核心靜巷",
        priceRange: "NT$ 2,500 - 3,900/晚",
        googleMapsQuery: "集好旅店",
        enName: "Keebe Hotel Keelung",
        enType: "Contemporary Urban Boutique Hotel",
        enDescription: "Quiet lane steps away from the bustling night market, sleek soundproof rooms with modern design.",
        jaName: "キーベホテル基隆（集好旅店）",
        jaType: "アーバンデザインブティックホテル",
        jaDescription: "夜市のすぐ裏手にあるスタイリッシュなデザイナーズホテル。高い防音性で静かな眠り。"
      }
    ],
    luxury: [
      {
        name: "長榮桂冠酒店 基隆 Evergreen Laurel Hotel Keelung",
        type: "國際海港景觀五星地標飯店",
        tier: "luxury",
        description: "面迎基隆港第一排，無死角俯瞰大型國際郵輪進出港口壯闊景觀，室內溫水海景泳池與頂級咖啡廳。",
        locationType: "基隆港水岸第一排",
        priceRange: "NT$ 4,500 - 10,000/晚",
        googleMapsQuery: "長榮桂冠酒店 基隆",
        enName: "Evergreen Laurel Hotel Keelung",
        enType: "Harborfront 5-Star Luxury Landmark",
        enDescription: "Prime waterfront location fronting international cruise port, ocean-view pool and grand buffet.",
        jaName: "エバーグリーンローレルホテル基隆（長榮桂冠酒店 基隆）",
        jaType: "港湾フロント5つ星名門ホテル",
        jaDescription: "基隆港の目の前に建ち、豪華客船の出入港を客室から一望。屋内温水プールも完備。"
      }
    ]
  },
  "嘉義市": {
    budget: [
      {
        name: "安蘭居青年旅館 An Lan Jie Hostel",
        type: "站前文青環保背包客棧",
        tier: "budget",
        description: "嘉義火車站步行5分鐘，以阿里山木質與綠意彩繪為設計，提供廚房、交誼廳與溫馨上下鋪。",
        locationType: "嘉義車站前商圈",
        priceRange: "NT$ 650 - 1,350/晚",
        googleMapsQuery: "安蘭居青年旅館",
        enName: "An Lan Jie Hostel Chiayi",
        enType: "Eco Wooden Backpacker Hostel",
        enDescription: "5 mins walk from Chiayi Station, Alishan timber motifs, guest kitchen and cozy community.",
        jaName: "アンランジエホステル嘉義（安蘭居）",
        jaType: "駅前エコユースホステル",
        jaDescription: "嘉義駅から徒歩5分。阿里山の木材を取り入れた温もりあるデザインで旅行者に愛される宿。"
      }
    ],
    standard: [
      {
        name: "承億文旅 桃城茶樣子 Hotelday+ Teascape",
        type: "亞洲首座茶文化頂級設計文旅",
        tier: "standard",
        description: "全台首座以茶為主題的文創旅店，頂樓無邊際天際泳池與茶香浴湯，文化氣息濃厚。",
        locationType: "文化生活特區",
        priceRange: "NT$ 2,800 - 4,600/晚",
        googleMapsQuery: "承億文旅 桃城茶樣子",
        enName: "Hotelday+ Teascape Chiayi",
        enType: "Tea Culture Design Hotel",
        enDescription: "Asia's first tea-themed hotel, boasting a rooftop infinity sky pool and curated tea experiences.",
        jaName: "ホテルデイプラス桃城茶様子（承億文旅 桃城茶樣子）",
        jaType: "お茶文化テーマデザインホテル",
        jaDescription: "台湾茶文化を体験できるハイセンスなホテル。屋上のインフィニティプールから夕日を一望。"
      }
    ],
    luxury: [
      {
        name: "耐斯王子大飯店 Nice Prince Hotel",
        type: "日本王子大飯店集團五星地標",
        tier: "luxury",
        description: "嘉義市唯一五星級認證國際大飯店，融入阿里山原住民鄒族圖騰，緊鄰耐斯廣場購物中心。",
        locationType: "市中心/耐斯廣場商圈",
        priceRange: "NT$ 4,500 - 10,000/晚",
        googleMapsQuery: "耐斯王子大飯店",
        enName: "Nice Prince Hotel Chiayi",
        enType: "5-Star Premier International Hotel",
        enDescription: "The only certified 5-star hotel in Chiayi City, Tsou aboriginal aesthetics connected to shopping mall.",
        jaName: "ナイスプリンスホテル嘉義（耐斯王子大飯店）",
        jaType: "5つ星国際高級ホテル",
        jaDescription: "プリンスホテルグループが提携する嘉義唯一の5つ星ホテル。ショッピングモール直結。"
      }
    ]
  },
  "嘉義縣": {
    budget: [
      {
        name: "阿里山小資天主堂文青客棧",
        type: "阿里山森林小資背包客房",
        tier: "budget",
        description: "座落阿里山森林遊樂區內，乾淨清幽的木質床位，步行即可抵達祝山觀日出火車站。",
        locationType: "阿里山森林遊樂區內",
        priceRange: "NT$ 1,200 - 2,000/晚",
        googleMapsQuery: "阿里山 住宿",
        enName: "Alishan Forest Budget Lodge",
        enType: "High Altitude Forest Lodge",
        enDescription: "Inside Alishan Forest Recreation Area, simple clean beds, walking distance to sunrise train.",
        jaName: "阿里山フォレストバジェットロッジ",
        jaType: "高地森林ロッジ",
        jaDescription: "阿里山森林遊楽区内にあり、日の出列車の乗り場まで徒歩でアクセス可能な静かな宿。"
      }
    ],
    standard: [
      {
        name: "阿里山賓館 歷史館 Alishan House Historical",
        type: "百年檜木森林經典人文行館",
        tier: "standard",
        description: "全台海拔最高百年檜木打造行館，坐擁壯麗雲海與夕陽晚霞，空中景觀花園遠眺玉山群峰。",
        locationType: "阿里山國家森林遊樂區核心",
        priceRange: "NT$ 5,800 - 9,500/晚",
        googleMapsQuery: "阿里山賓館",
        enName: "Alishan House - Historical Wing",
        enType: "Century-Old Cypress Heritage Hotel",
        enDescription: "Taiwan's highest historic cypress retreat, panoramic ocean of clouds and sunset garden.",
        jaName: "阿里山賓館 歴史館",
        jaType: "百年ヒノキ歴史遺産ホテル",
        jaDescription: "樹齢数百年のヒノキ造りの歴史あるホテル。雲海と夕暮れを望む展望デッキが素晴らしい。"
      }
    ],
    luxury: [
      {
        name: "阿里山英迪格酒店 Hotel Indigo Alishan",
        type: "國際洲際五星山嵐奢華度假酒店",
        tier: "luxury",
        description: "阿里山國家風景區第一間國際頂級潮牌渡假飯店，頂樓無邊際溫水景觀泳池直面阿里山雲海日出。",
        locationType: "阿里山公路巃頭風景線",
        priceRange: "NT$ 11,000 - 28,000/晚",
        googleMapsQuery: "阿里山英迪格酒店",
        enName: "Hotel Indigo Alishan",
        enType: "5-Star Cloudscape Luxury Resort",
        enDescription: "First international luxury hotel in Alishan, rooftop heated infinity pool directly facing sea of clouds.",
        jaName: "ホテルインディゴ阿里山（阿里山英迪格酒店）",
        jaType: "雲海を望む5つ星最高級マウンテンリゾート",
        jaDescription: "IHGグループの高級ブティックリゾート。屋上の温水プールから雲海と朝日の絶景を一望。"
      }
    ]
  },
  "彰化縣": {
    budget: [
      {
        name: "鹿港小鎮青年旅舍 Lukang Backpacker",
        type: "老街紅磚閩南風情旅宿",
        tier: "budget",
        description: "隱身鹿港九曲巷旁，紅磚老屋保留歷史古韻，步行即至第一市場品嚐生炒五味與麵線糊。",
        locationType: "鹿港老街九曲巷商圈",
        priceRange: "NT$ 650 - 1,300/晚",
        googleMapsQuery: "鹿港 青年旅館",
        enName: "Lukang Old Town Hostel",
        enType: "Heritage Brick Old Town Hostel",
        enDescription: "Beside Lukang Nine-Turns Lane, red-brick heritage ambiance close to historic temples and street foods.",
        jaName: "鹿港オールドタウンホステル",
        jaType: "赤レンガ古民家ホステル",
        jaDescription: "九曲巷のすぐそばに佇む伝統赤レンガ宿。鹿港の歴史ある寺院や名物グルメ散策に最適。"
      }
    ],
    standard: [
      {
        name: "鹿港永樂酒店 UNION HOUSE Lukang",
        type: "國際SLH認證鹿港文化精品文旅",
        tier: "standard",
        description: "緊鄰國定古蹟鹿港龍山寺，榮獲全球奢華精品酒店(SLH)認證，早餐提供在地名店排隊美食小吃。",
        locationType: "鹿港龍山寺古蹟特區",
        priceRange: "NT$ 3,500 - 5,200/晚",
        googleMapsQuery: "鹿港永樂酒店",
        enName: "UNION HOUSE Lukang",
        enType: "SLH Certified Cultural Boutique Hotel",
        enDescription: "Beside historic Longshan Temple, SLH certified hotel serving famous local breakfast delicacies.",
        jaName: "ユニオンハウス鹿港（鹿港永樂酒店）",
        jaType: "SLH認定ヘリテージブティックホテル",
        jaDescription: "龍山寺に隣接する世界基準のブティックホテル。朝食には鹿港の有名老舗グルメが並ぶ。"
      }
    ],
    luxury: [
      {
        name: "鹿港澄悅酒店 Euphoria Hotel Lukang",
        type: "當代輕奢景觀星級酒店",
        tier: "luxury",
        description: "鹿港中正路地標，高樓層遠眺彰濱夕陽海景與鹿港老城全貌，客房大器寬敞配備頂級備品。",
        locationType: "鹿港市中心中正路地標",
        priceRange: "NT$ 4,600 - 9,500/晚",
        googleMapsQuery: "鹿港澄悅酒店",
        enName: "Euphoria Hotel Lukang",
        enType: "Contemporary Luxury Horizon Hotel",
        enDescription: "Landmark high-rise in Lukang with expansive views of the historic town and Changhua coast.",
        jaName: "ユーフォリアホテル鹿港（鹿港澄悅酒店）",
        jaType: "モダンラグジュアリーランドマークホテル",
        jaDescription: "鹿港の中心にそびえるモダンホテル。高層階からは古都の街並みと台湾海峡の夕日を一望。"
      }
    ]
  },
  "雲林縣": {
    budget: [
      {
        name: "斗六火車站舒適小宿 Douliu Station Inn",
        type: "車站前生活圈平價商旅",
        tier: "budget",
        description: "步行3分鐘抵達斗六火車站與太平老街，乾淨舒適床位，交通便利。",
        locationType: "斗六車站商圈",
        priceRange: "NT$ 800 - 1,500/晚",
        googleMapsQuery: "斗六 住宿",
        enName: "Douliu Station Inn",
        enType: "Station Front Value Inn",
        enDescription: "3 mins walk from Douliu Station and Taiping Old Street, clean rooms and convenient transit.",
        jaName: "斗六ステーションイン",
        jaType: "駅前バリューイン",
        jaDescription: "斗六駅から徒歩3分。太平老街のレトロな商店街散策にも便利なアットホームな宿。"
      }
    ],
    standard: [
      {
        name: "虎尾春秋 布袋戲文創設計旅店 Spring Autumn",
        type: "全台首座布袋戲文化設計旅店",
        tier: "standard",
        description: "座落虎尾布袋戲故鄉，復古工業風融合生旦淨末丑角色美學，頂樓沐白酒吧俯瞰虎尾鎮景致。",
        locationType: "虎尾文化特區",
        priceRange: "NT$ 2,400 - 3,800/晚",
        googleMapsQuery: "虎尾春秋",
        enName: "Huwei Hotel Spring Autumn",
        enType: "Puppet Cultural Heritage Design Hotel",
        enDescription: "Dedicated to Taiwanese glove puppetry heritage, chic industrial styling with rooftop bar.",
        jaName: "フーウェイ春秋（虎尾春秋 布袋戲文創旅店）",
        jaType: "台湾人形劇テーマデザインホテル",
        jaDescription: "布袋劇（台湾人形劇）の伝統を取り入れた個性派ホテル。屋上バーからの眺望も魅力。"
      }
    ],
    luxury: [
      {
        name: "劍湖山渡假大飯店 Janfusun Resort Hotel",
        type: "五星森林主題度假酒店",
        tier: "luxury",
        description: "座落古坑綠意山巒間，坐擁劍湖山摩天輪景致，中庭挑高南洋棕櫚花園與全台首屈一指古坑咖啡私房饗宴。",
        locationType: "古坑劍湖山風景特定區",
        priceRange: "NT$ 4,800 - 11,000/晚",
        googleMapsQuery: "劍湖山渡假大飯店",
        enName: "Janfusun Resort Hotel",
        enType: "5-Star Mountain Theme Resort",
        enDescription: "Perched among Gukeng green mountains facing Ferris Wheel, tropical gardens and local coffee cuisine.",
        jaName: "剣湖山リゾートホテル（劍湖山渡假大飯店）",
        jaType: "5つ星マウンテンテーマリゾート",
        jaDescription: "テーマパークに隣接する緑豊かな大型リゾート。古坑コーヒーを取り入れた創作料理が人気。"
      }
    ]
  }
};

// Generic generator for cities with multi-night deduplication support and area proximity matching
export function getTieredAccommodation(
  cityName: string,
  tier: 'budget' | 'standard' | 'luxury' = 'standard',
  index: number = 0,
  lang: string = 'zh-TW',
  usedHotelNames?: Set<string>,
  targetArea?: string
): TieredHotel {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const cityGroup = CITY_TIERED_ACCOMMODATIONS[cityName];

  const isAlreadyUsed = (hName?: string) => {
    if (!hName || !usedHotelNames || usedHotelNames.size === 0) return false;
    const cleanCandidate = hName.trim().toLowerCase();
    for (const u of usedHotelNames) {
      const cleanUsed = u.trim().toLowerCase();
      if (cleanUsed === cleanCandidate || cleanCandidate.includes(cleanUsed) || cleanUsed.includes(cleanCandidate)) {
        return true;
      }
    }
    return false;
  };

  const formatHotel = (raw: TieredHotel): TieredHotel => ({
    ...raw,
    name: l === 'en' ? (raw.enName || raw.name) : l === 'ja' ? (raw.jaName || raw.name) : raw.name,
    type: l === 'en' ? (raw.enType || raw.type) : l === 'ja' ? (raw.jaType || raw.type) : raw.type,
    description: l === 'en' ? (raw.enDescription || raw.description) : l === 'ja' ? (raw.jaDescription || raw.description) : raw.description
  });

  if (cityGroup) {
    const primaryList = cityGroup[tier] || [];

    // Prioritize finding an unused hotel matching targetArea (for close proximity to next day's tour)
    if (targetArea && targetArea.trim()) {
      const areaKeywords = targetArea
        .replace(/^[0-9A-Za-z\s:：第日天]+/, '')
        .split(/[\s/、,，與和-]+/)
        .map(k => k.trim())
        .filter(k => k.length >= 2);

      const scoreHotel = (h: TieredHotel) => {
        let score = 0;
        const text = `${h.name} ${h.locationType || ''} ${h.description || ''} ${h.enName || ''}`;
        for (const kw of areaKeywords) {
          if (text.includes(kw)) score += 3;
          if ((h.locationType || '').includes(kw)) score += 5;
        }
        return score;
      };

      // 1. Match within target tier
      const matchingInTier = primaryList
        .filter(h => !isAlreadyUsed(h.name) && scoreHotel(h) > 0)
        .sort((a, b) => scoreHotel(b) - scoreHotel(a));

      if (matchingInTier.length > 0) {
        const res = formatHotel(matchingInTier[0]);
        if (usedHotelNames) usedHotelNames.add(res.name);
        return res;
      }

      // 2. Match in other tiers
      const otherTiers: Array<'budget' | 'standard' | 'luxury'> =
        tier === 'standard' ? ['luxury', 'budget'] :
        tier === 'budget' ? ['standard', 'luxury'] :
        ['standard', 'budget'];

      for (const ot of otherTiers) {
        const otherList = cityGroup[ot] || [];
        const matchingOther = otherList
          .filter(h => !isAlreadyUsed(h.name) && scoreHotel(h) > 0)
          .sort((a, b) => scoreHotel(b) - scoreHotel(a));
        if (matchingOther.length > 0) {
          const res = formatHotel(matchingOther[0]);
          if (usedHotelNames) usedHotelNames.add(res.name);
          return res;
        }
      }
    }

    if (usedHotelNames && usedHotelNames.size > 0) {
      // 1. Check primary tier list for an unused accommodation
      for (let i = 0; i < primaryList.length; i++) {
        const candidate = primaryList[(index + i) % primaryList.length];
        if (!isAlreadyUsed(candidate.name) && !isAlreadyUsed(candidate.enName) && !isAlreadyUsed(candidate.jaName)) {
          const res = formatHotel(candidate);
          usedHotelNames.add(res.name);
          return res;
        }
      }

      // 2. If primary tier is exhausted, check other tiers of the same city
      const otherTiers: Array<'budget' | 'standard' | 'luxury'> =
        tier === 'standard' ? ['luxury', 'budget'] :
        tier === 'budget' ? ['standard', 'luxury'] :
        ['standard', 'budget'];

      for (const ot of otherTiers) {
        const otherList = cityGroup[ot] || [];
        for (const candidate of otherList) {
          if (!isAlreadyUsed(candidate.name) && !isAlreadyUsed(candidate.enName) && !isAlreadyUsed(candidate.jaName)) {
            const res = formatHotel(candidate);
            usedHotelNames.add(res.name);
            return res;
          }
        }
      }
    } else if (primaryList.length > 0) {
      const raw = primaryList[index % primaryList.length];
      const res = formatHotel(raw);
      if (usedHotelNames) usedHotelNames.add(res.name);
      return res;
    }
  }

  // Branch suffix identifiers guaranteeing uniqueness across consecutive nights
  const branchSuffixes = [
    { zh: '核心名邸館', en: 'Central Flagship', ja: '中央本館' },
    { zh: '水岸綠茵分館', en: 'Waterfront Park Branch', ja: '水辺別館' },
    { zh: '人文美學二館', en: 'Heritage Arts Branch', ja: 'アーツ館' },
    { zh: '景觀湖畔分館', en: 'Lakeview Branch', ja: '湖畔リゾート館' },
    { zh: '星空露台會館', en: 'Starlight Sky Lounge', ja: 'スカイテラス館' }
  ];
  const suffix = branchSuffixes[index % branchSuffixes.length];

  // Fallback programmatic generation for any remaining city
  if (tier === 'budget') {
    const result = {
      name: l === 'en' ? `${cityName} Central Backpacker Hostel (${suffix.en})` : l === 'ja' ? `${cityName}セントラルバックパッカーズ (${suffix.ja})` : `${cityName}青年背包客棧 - ${suffix.zh}`,
      type: l === 'en' ? "Budget Backpacker Hostel" : l === 'ja' ? "格安ユースホステル" : "小資平價背包青年旅館",
      tier: "budget" as const,
      description: l === 'en'
        ? `Conveniently situated near ${cityName} main station, clean dorms, shared kitchen, and great value.`
        : l === 'ja'
        ? `${cityName}中心部に位置し、清潔なドミトリーと手頃な価格で旅行者に最適。`
        : `緊鄰${cityName}核心車站與老街商圈，環境安全整潔，提供高CP值小資床位與共享廚房。`,
      locationType: l === 'en' ? "City Center/Station Area" : l === 'ja' ? "市内中心部/駅周辺" : "市中心/車站生活圈",
      priceRange: "NT$ 650 - 1,300/晚",
      googleMapsQuery: `${cityName} 青年旅館`,
      enName: `${cityName} Central Backpacker Hostel (${suffix.en})`,
      enType: "Budget Backpacker Hostel",
      enDescription: `Conveniently situated near ${cityName} main station, clean dorms, shared kitchen, and great value.`,
      jaName: `${cityName}セントラルバックパッカーズ (${suffix.ja})`,
      jaType: "格安ユースホステル",
      jaDescription: `${cityName}中心部に位置し、清潔なドミトリーと手頃な価格で旅行者に最適。`
    };
    if (usedHotelNames) usedHotelNames.add(result.name);
    return result;
  } else if (tier === 'luxury') {
    const result = {
      name: l === 'en' ? `${cityName} Grand Scenic Resort & Spa (${suffix.en})` : l === 'ja' ? `${cityName}グランドシーニック温泉リゾート (${suffix.ja})` : `${cityName}星級景觀溫泉渡假大飯店 - ${suffix.zh}`,
      type: l === 'en' ? "5-Star Premier Scenic Resort" : l === 'ja' ? "5つ星最高級温泉リゾート" : "五星奢華度假殿堂",
      tier: "luxury" as const,
      description: l === 'en'
        ? `Commanding panoramic views of ${cityName}, with open-air hot spring baths and fine dining.`
        : l === 'ja'
        ? `${cityName}の絶景を一望する露天風呂とプライベートスパを備えた極上宿。`
        : `坐擁${cityName}壯麗山海全景，提供五星級尊榮禮賓、戶外景觀溫水水療風呂與頂級主廚私房美饌。`,
      locationType: l === 'en' ? "Scenic Hot Spring Area" : l === 'ja' ? "景勝地/温泉リゾートエリア" : "景觀特區/溫泉渡假聚落",
      priceRange: "NT$ 6,500 - 16,000/晚",
      googleMapsQuery: `${cityName} 五星級飯店`,
      enName: `${cityName} Grand Scenic Resort & Spa (${suffix.en})`,
      enType: "5-Star Premier Scenic Resort",
      enDescription: `Commanding panoramic views of ${cityName}, with open-air hot spring baths and fine dining.`,
      jaName: `${cityName}グランドシーニック温泉リゾート (${suffix.ja})`,
      jaType: "5つ星最高級温泉リゾート",
      jaDescription: `${cityName}の絶景を一望する露天風呂とプライベートスパを備えた極上宿。`
    };
    if (usedHotelNames) usedHotelNames.add(result.name);
    return result;
  } else {
    const result = {
      name: l === 'en' ? `${cityName} Boutique Culture Hotel (${suffix.en})` : l === 'ja' ? `${cityName}ブティックカルチャーホテル (${suffix.ja})` : `${cityName}質感文旅精品商旅 - ${suffix.zh}`,
      type: l === 'en' ? "Contemporary Culture Boutique Hotel" : l === 'ja' ? "デザインブティックホテル" : "在地特色質感文旅",
      tier: "standard" as const,
      description: l === 'en'
        ? `Blending local heritage with modern comfort, acoustic rooms, and steps away from dining streets.`
        : l === 'ja'
        ? `${cityName}の地域文化を取り入れた快適な空間。観光や食事処へのアクセス抜群。`
        : `融合${cityName}在地風土與現代俐落設計，客房隔音優良、寢具舒適，步行可達在地人氣商圈。`,
      locationType: l === 'en' ? "City Center/Culture District" : l === 'ja' ? "市内中心部/文化街区" : "市中心/文化生活圈",
      priceRange: "NT$ 2,500 - 4,200/晚",
      googleMapsQuery: `${cityName} 精品飯店`,
      enName: `${cityName} Boutique Culture Hotel (${suffix.en})`,
      enType: "Contemporary Culture Boutique Hotel",
      enDescription: `Blending local heritage with modern comfort, acoustic rooms, and steps away from dining streets.`,
      jaName: `${cityName}ブティックカルチャーホテル (${suffix.ja})`,
      jaType: "デザインブティックホテル",
      jaDescription: `${cityName}の地域文化を取り入れた快適な空間。観光や食事処へのアクセス抜群。`
    };
    if (usedHotelNames) usedHotelNames.add(result.name);
    return result;
  }
}

/**
 * 依縣市與旅宿名稱快速查找房間大概價位與 Google Maps 搜尋關鍵字
 */
export function findHotelDetails(
  cityName: string,
  hotelName: string,
  lang: string = 'zh-TW'
): { priceRange: string; googleMapsQuery: string; type?: string } {
  if (!hotelName) {
    return { priceRange: 'NT$ 2,500 - 4,200/晚', googleMapsQuery: `${cityName} 飯店` };
  }

  const cleanQuery = hotelName.trim().toLowerCase();
  const cityGroup = CITY_TIERED_ACCOMMODATIONS[cityName];
  if (cityGroup) {
    const allHotels = [
      ...(cityGroup.budget || []),
      ...(cityGroup.standard || []),
      ...(cityGroup.luxury || [])
    ];
    const match = allHotels.find((h) => {
      const hName = h.name.toLowerCase();
      const en = (h.enName || '').toLowerCase();
      const ja = (h.jaName || '').toLowerCase();
      return (
        hName.includes(cleanQuery) ||
        cleanQuery.includes(hName) ||
        (en && (en.includes(cleanQuery) || cleanQuery.includes(en))) ||
        (ja && (ja.includes(cleanQuery) || cleanQuery.includes(ja)))
      );
    });

    if (match) {
      return {
        priceRange: match.priceRange,
        googleMapsQuery: match.googleMapsQuery || match.name,
        type:
          lang === 'en'
            ? match.enType || match.type
            : lang === 'ja'
            ? match.jaType || match.type
            : match.type
      };
    }
  }

  // 通用依名稱特徵判斷價位區間
  const isBudget = /青旅|hostel|背包|旅宿|inn|客棧|膠囊/i.test(hotelName);
  const isLuxury = /洲際|萬豪|晶英|香格里拉|頂級|resort|hotel & spa|大飯店|喜來登|艾美|行館|老爺/i.test(hotelName);
  const priceRange = isBudget
    ? 'NT$ 750 - 1,500/晚'
    : isLuxury
    ? 'NT$ 5,200 - 11,000/晚'
    : 'NT$ 2,600 - 4,500/晚';

  return {
    priceRange,
    googleMapsQuery: `${hotelName}`,
    type: isBudget ? '文青背包客棧' : isLuxury ? '星級渡假酒店' : '設計質感商旅'
  };
}

/**
 * 依縣市與旅宿名稱完整查找 TieredHotel 物件
 */
export function findTieredHotelObject(
  cityName: string,
  hotelName: string,
  lang: string = 'zh-TW'
): TieredHotel | null {
  if (!hotelName) return null;
  const cleanQuery = hotelName.trim().toLowerCase();
  const cityGroup = CITY_TIERED_ACCOMMODATIONS[cityName];
  if (cityGroup) {
    const allHotels = [
      ...(cityGroup.budget || []),
      ...(cityGroup.standard || []),
      ...(cityGroup.luxury || [])
    ];
    const match = allHotels.find((h) => {
      const hName = h.name.toLowerCase();
      const en = (h.enName || '').toLowerCase();
      const ja = (h.jaName || '').toLowerCase();
      return (
        hName.includes(cleanQuery) ||
        cleanQuery.includes(hName) ||
        (en && (en.includes(cleanQuery) || cleanQuery.includes(en))) ||
        (ja && (ja.includes(cleanQuery) || cleanQuery.includes(ja)))
      );
    });
    if (match) {
      const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
      return {
        name: l === 'en' ? (match.enName || match.name) : l === 'ja' ? (match.jaName || match.name) : match.name,
        type: l === 'en' ? (match.enType || match.type) : l === 'ja' ? (match.jaType || match.type) : match.type,
        tier: match.tier,
        description: l === 'en' ? (match.enDescription || match.description) : l === 'ja' ? (match.jaDescription || match.description) : match.description,
        locationType: match.locationType,
        priceRange: match.priceRange,
        googleMapsQuery: match.googleMapsQuery || match.name,
        enName: match.enName,
        enType: match.enType,
        enDescription: match.enDescription,
        jaName: match.jaName,
        jaType: match.jaType,
        jaDescription: match.jaDescription
      };
    }
  }
  return null;
}

