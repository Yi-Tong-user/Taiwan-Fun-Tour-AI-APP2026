import { CitySpecialty, ItineraryDay, ItinerarySpot, AIItineraryResponse, SavedItinerary, SavedDayItinerary, SavedSpotItem } from '../types';
import { SupportedLanguage } from './i18n';

export interface LocalizedCityData {
  name: { 'zh-TW': string; en: string; ja: string };
  region: { 'zh-TW': string; en: string; ja: string };
  description: { 'zh-TW': string; en: string; ja: string };
  agriculture: { 'zh-TW': string; en: string; ja: string };
  fishery: { 'zh-TW': string; en: string; ja: string };
  livestock: { 'zh-TW': string; en: string; ja: string };
  famousFood: { 'zh-TW': string[]; en: string[]; ja: string[] };
  islandNotice?: { 'zh-TW': string; en: string; ja: string };
}

export const CITY_LOCALIZED_MAP: Record<string, LocalizedCityData> = {
  "臺北市": {
    name: { "zh-TW": "臺北市", en: "Taipei City", ja: "台北市" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "臺灣政治、經濟與文化核心樞紐，揉合百年歷史城區與現代摩天大樓，擁有豐富國家級博物館與便利便捷的捷運網絡。",
      en: "Taiwan's political, economic, and cultural capital, blending centuries-old heritage districts with modern skyscrapers, premier national museums, and an efficient MRT network.",
      ja: "台湾の政治・経済・文化の中枢。歴史ある街並みと近代的な超高層ビルが融合し、国立博物館や利便性の高いMRT網が充実しています。"
    },
    agriculture: { "zh-TW": "文山包種茶、海芋、繡球花、綠竹筍", en: "Wenshan Pouchong Tea, Calla Lilies, Hydrangeas, Green Bamboo Shoots", ja: "文山包種茶、カラーリリー、アジサイ、緑竹の子" },
    fishery: { "zh-TW": "基隆河淡水河鮮魚、大台北近郊漁獲直銷", en: "Keelung & Tamsui River fresh fish, Greater Taipei direct seafood", ja: "基隆河・淡水河の川魚、近郊新鮮海鮮直販" },
    livestock: { "zh-TW": "士林北投在地放山土雞、優質肉豬", en: "Shilin & Beitou free-range native chicken, premium pork", ja: "士林・北投の地鶏、上質ポーク" },
    famousFood: {
      "zh-TW": ["台北牛肉麵", "小籠湯包", "胡椒餅", "金峰滷肉飯"],
      en: ["Taipei Beef Noodles", "Xiao Long Bao (Soup Dumplings)", "Black Pepper Buns", "Braised Pork Rice"],
      ja: ["台北牛肉麺", "小籠包", "胡椒餅", "魯肉飯（ルーローハン）"]
    }
  },
  "新北市": {
    name: { "zh-TW": "新北市", en: "New Taipei City", ja: "新北市" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "環抱大臺北盆地，坐擁壯麗北海岸岬灣與平溪九份山城，以豐富多元的手工藝陶瓷及傳統老街馳名中外。",
      en: "Surrounding Taipei Basin with stunning North Coast capes, historic mountain towns like Jiufen and Pingxi, and famed handmade ceramics and traditional streets.",
      ja: "台北盆地を取り囲み、風光明媚な北海岸の岬や九份・平渓の山あいの町、伝統陶芸や活気ある老街で世界的に親しまれています。"
    },
    agriculture: { "zh-TW": "三芝筊白筍、坪林文山包種茶、雙溪山藥", en: "Sanzhi Water Bamboo, Pinglin Pouchong Tea, Shuangxi Wild Yam", ja: "三芝マコモダケ、坪林包種茶、双渓山薬" },
    fishery: { "zh-TW": "萬里蟹（三點蟹/花蟹）、貢寮九孔鮑魚、淡水吻仔魚", en: "Wanli Crab, Gongliao Abalone, Tamsui Whitebait", ja: "萬里カニ、貢寮アワビ、淡水シラス" },
    livestock: { "zh-TW": "深坑黑毛豬、三峽放山土雞", en: "Shenkeng Black Pig, Sanxia Free-Range Chicken", ja: "深坑黒豚、三峡地鶏" },
    famousFood: {
      "zh-TW": ["萬里蟹", "深坑臭豆腐", "金山紅心地瓜", "九份手工芋圓"],
      en: ["Wanli Steamed Crab", "Shenkeng Stinky Tofu", "Jinshan Red Sweet Potato", "Jiufen Taro Balls"],
      ja: ["萬里蒸しガニ", "深坑臭豆腐", "金山紅イモ", "九份手作り芋団子（タロイモボール）"]
    }
  },
  "基隆市": {
    name: { "zh-TW": "基隆市", en: "Keelung City", ja: "基隆市" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "北臺灣最主要的天然深水良港，兼具大航海時代砲台史蹟、迷人天然海岬地質與全臺知名美食廟口聚落。",
      en: "Northern Taiwan's premier natural deepwater harbor, combining Age of Discovery maritime forts, dramatic coastal geology, and the world-famous Miaokou Night Market.",
      ja: "台湾北部の天然の良港。大航海時代からの要塞史跡、大自然が織りなす奇岩海岸、そして全国に名を馳せる基隆廟口夜市が魅力です。"
    },
    agriculture: { "zh-TW": "七堵綠竹筍、基隆山藥、樹梅", en: "Qidu Green Bamboo Shoots, Keelung Yam, Chinese Bayberry", ja: "七堵緑竹の子、基隆山薬、ヤマモモ" },
    fishery: { "zh-TW": "八斗子透抽、鎖管、胭脂蝦、黑口魚", en: "Badouzih Squid, Neritic Squid, Scarlet Shrimp, Croaker", ja: "八斗子アオリイカ、ヤリイカ、アカザエビ、クログチ" },
    livestock: { "zh-TW": "暖暖在地土雞、優質健康禽產", en: "Nuannuan Native Chicken, Fresh Poultry", ja: "暖暖地鶏、新鮮家禽" },
    famousFood: {
      "zh-TW": ["基隆廟口鼎邊趖", "泡泡冰", "炭烤營養三明治", "連珍芋泥球"],
      en: ["Ding Bian Cuo Noodle Soup", "Paopao Shaved Ice", "Nutritious Sandwich", "Lian Zhen Taro Paste Balls"],
      ja: ["鼎辺趖（ディンビエンツォ）", "泡泡冰（ふわふわかき氷）", "栄養サンドイッチ", "タロイモペースト団子"]
    }
  },
  "宜蘭縣": {
    name: { "zh-TW": "宜蘭縣", en: "Yilan County", ja: "宜蘭県" },
    region: { "zh-TW": "東部", en: "Eastern Taiwan", ja: "東部エリア" },
    description: {
      "zh-TW": "背山面海的蘭陽平原，享有礁溪天然美人溫泉、蘇澳冷泉、櫻桃烤鴨與純淨鄉野梯田風光，為台北近郊頂級休閒勝地。",
      en: "Nestled between lush green mountains and the Pacific, renowned for Jiaoxi hot springs, Su'ao cold springs, cherry valley roast duck, and pastoral beauty.",
      ja: "山と海に抱かれた蘭陽平野。名湯・礁渓温泉や世界的な蘇澳冷泉、名物チェリーダック、のどかな田園風景が広がる癒しのリゾート地です。"
    },
    agriculture: { "zh-TW": "三星蔥、宜蘭嚴選稻米、金棗、上將梨", en: "Sanxing Scallions, Premium Rice, Kumquats, General Pears", ja: "三星ネギ、厳選宜蘭米、キンカン、上将梨" },
    fishery: { "zh-TW": "大溪漁港現撈海產、櫻花蝦、南方澳黑鮪魚", en: "Daxi Harbor Fresh Catch, Sakura Shrimp, Nanfang'ao Bluefin Tuna", ja: "大渓漁港獲れたて鮮魚、サクラエビ、南方澳クロマグロ" },
    livestock: { "zh-TW": "宜蘭櫻桃鴨、員山放山土雞", en: "Yilan Cherry Valley Duck, Yuanshan Free-Range Chicken", ja: "宜蘭チェリーダック、員山地鶏" },
    famousFood: {
      "zh-TW": ["櫻桃霸王烤鴨", "羅東夜市卜肉", "三星蔥油餅", "糕渣"],
      en: ["Crispy Cherry Roast Duck", "Luodong Pork Fritters (Bu-rou)", "Sanxing Scallion Pancake", "Gao Zha Deep-fried Custard"],
      ja: ["チェリーローストダック", "卜肉（豚肉の天ぷら）", "三星ネギパイ", "糕渣（スープ揚げ物）"]
    }
  },
  "桃園市": {
    name: { "zh-TW": "桃園市", en: "Taoyuan City", ja: "桃園市" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "臺灣接軌全球的國門之都，融合閩客眷村與原住民族多元文化，兼具大溪老街豆干工藝與拉拉山神木森呼吸。",
      en: "Taiwan's international aviation gateway, featuring Hakka, Minnan, and indigenous cultures, Daxi dried tofu crafts, and Lala Mountain's ancient giant trees.",
      ja: "台湾の空の玄関口。客家・原住民族の多彩な文化が息づき、大溪老街の伝統豆腐料理や拉拉山原生林の巨木巡りが楽しめます。"
    },
    agriculture: { "zh-TW": "拉拉山水蜜桃、大溪綠竹筍、蘆竹草莓", en: "Lala Mountain Peaches, Daxi Bamboo Shoots, Luzhu Strawberries", ja: "拉拉山モモ、大溪緑竹の子、蘆竹イチゴ" },
    fishery: { "zh-TW": "竹圍漁港海鮮、永安漁港現撈石斑", en: "Zhuwei Harbor Seafood, Yong'an Harbor Grouper", ja: "竹圍漁港海鮮、永安漁港クエ・ハタ" },
    livestock: { "zh-TW": "黑毛豬、觀音有機土雞", en: "Black Pork, Guanyin Organic Chicken", ja: "黒豚、観音オーガニック地鶏" },
    famousFood: {
      "zh-TW": ["大溪滷豆干", "龍潭花生軟糖", "中壢牛肉麵", "石門活魚三吃"],
      en: ["Daxi Braised Dried Tofu", "Longtan Peanut Candy", "Zhongli Beef Noodles", "Shimen Multi-flavor Fresh Fish"],
      ja: ["大溪煮込み干し豆腐", "龍潭ピーナッツソフトキャンディ", "中壢牛肉麺", "石門活魚三昧"]
    }
  },
  "新竹市": {
    name: { "zh-TW": "新竹市", en: "Hsinchu City", ja: "新竹市" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "素有『風城』美名，百年古城迎曦門與臺灣高科技矽谷交相輝映，手工米粉與彈牙貢丸聞名遐邇。",
      en: "Known as the 'Windy City', harmoniously blending the historic East Gate fortress with world-leading tech hubs, handmade rice noodles, and springy pork balls.",
      ja: "「風の街」と称される歴史の街。清朝時代の東門古跡と世界最先端のハイテクバレーが共存し、新竹ビーフンや弾力ある肉団子（貢丸）が有名です。"
    },
    agriculture: { "zh-TW": "南寮西瓜、香山荔枝、茶花", en: "Nanliao Watermelon, Xiangshan Lychee, Camellia", ja: "南寮スイカ、香山ライチ、ツバキ" },
    fishery: { "zh-TW": "南寮漁港烏魚子、現撈小管、白帶魚", en: "Nanliao Harbor Bottarga, Squid, Beltfish", ja: "南寮カラスミ、獲れたてイカ、タチウオ" },
    livestock: { "zh-TW": "新竹優質肉豬（貢丸原料）、香山土雞", en: "Premium Pork (Pork Ball Base), Xiangshan Free-range Chicken", ja: "厳選ポーク（貢丸用）、香山地鶏" },
    famousFood: {
      "zh-TW": ["新竹手工米粉", "彈牙香菇貢丸", "水潤餅", "城隍廟鴨肉麵"],
      en: ["Hsinchu Handmade Rice Noodles", "Springy Mushroom Meatballs", "Shuirun Soft Pancake", "Cheng Huang Temple Duck Noodles"],
      ja: ["新竹手延べビーフン", "キノコ入り肉団子（貢丸）", "水潤餅（伝統焼き菓子）", "城隍廟アヒル肉麺"]
    }
  },
  "新竹縣": {
    name: { "zh-TW": "新竹縣", en: "Hsinchu County", ja: "新竹県" },
    region: { "zh-TW": "北部", en: "Northern Taiwan", ja: "北部エリア" },
    description: {
      "zh-TW": "全臺客家文化與科技聚落重鎮，坐擁尖石司馬庫斯神木部落與北埔客家古厝擂茶，山林野趣純樸悠遠。",
      en: "Heartland of Hakka culture and forestry, home to Smangus 'God's Tribe' giant trees, Beipu Old Street, and aromatic Hakka pounded tea (Lei Cha).",
      ja: "客家文化と豊かな自然が広がる地域。「神の村」と呼ばれる司馬庫スの巨木群、北埔老街の伝統すり茶（擂茶）体験が人気です。"
    },
    agriculture: { "zh-TW": "新埔柿餅、北埔東方美人茶、五峰水蜜桃", en: "Xinpu Dried Persimmons, Beipu Oriental Beauty Tea, Wufeng Peaches", ja: "新埔干し柿、北埔東方美人茶、五峰モモ" },
    fishery: { "zh-TW": "新豐近海養殖、竹北烏魚子", en: "Xinfeng Coastal Aquaculture, Zhubei Bottarga", ja: "新豊養殖魚、竹北カラスミ" },
    livestock: { "zh-TW": "關西優質土雞、竹北黑豬", en: "Guanxi Free-Range Chicken, Zhubei Black Pig", ja: "関西地鶏、竹北黒豚" },
    famousFood: {
      "zh-TW": ["新埔客家粄條", "北埔擂茶", "客家鹹湯圓", "野薑花粽"],
      en: ["Xinpu Hakka Flat Rice Noodles", "Beipu Lei Cha (Pounded Tea)", "Hakka Savory Tangyuan", "Wild Ginger Flower Rice Dumpling"],
      ja: ["新埔客家きしめん（粄條）", "北埔擂茶（すり茶）", "客家風塩団子汁", "ハナシュクシャのちまき"]
    }
  },
  "苗栗縣": {
    name: { "zh-TW": "苗栗縣", en: "Miaoli County", ja: "苗栗県" },
    region: { "zh-TW": "中部", en: "Central Taiwan", ja: "中部エリア" },
    description: {
      "zh-TW": "山城慢活悠閒風情，三義木雕藝術與舊山線勝興車站鐵道自行車，大湖草莓與泰安美人湯溫泉遠近馳名。",
      en: "A Cittaslow-certified mountain haven celebrated for Sanyi woodcarvings, Old Mountain Line Rail Bikes, Dahu strawberries, and Tai'an hot springs.",
      ja: "スローシティに認定された山の郷。三義の木彫り工芸、旧山線のレールバイク、大湖のイチゴ狩り、泰安の名湯温泉を満喫できます。"
    },
    agriculture: { "zh-TW": "大湖草莓、卓蘭巨峰葡萄與水梨、公館紅棗", en: "Dahu Strawberries, Zhuolan Grapes & Pears, Gongguan Red Dates", ja: "大湖イチゴ、卓蘭ぶどう・梨、公館ナツメ" },
    fishery: { "zh-TW": "通霄苑裡現撈黑鯛、竹南養殖鮮蝦", en: "Tongxiao Black Porgy, Zhunan Fresh Farmed Shrimp", ja: "通霄クロダイ、竹南養殖エビ" },
    livestock: { "zh-TW": "頭份後龍黑毛豬、獅潭放山土雞", en: "Toufen Black Pig, Shitan Free-range Chicken", ja: "頭份黒豚、獅潭地鶏" },
    famousFood: {
      "zh-TW": ["苗栗客家小炒", "三義粄條", "草莓香腸與大福", "公館紅棗燉雞"],
      en: ["Hakka Stir-fry", "Sanyi Flat Rice Noodles", "Strawberry Sausage & Daifuku", "Gongguan Jujube Stewed Chicken"],
      ja: ["客家小炒（イカと豚肉の炒め）", "三義粄條", "イチゴフランク＆大福", "公館ナツメと地鶏煮込み"]
    }
  },
  "臺中市": {
    name: { "zh-TW": "臺中市", en: "Taichung City", ja: "台中市" },
    region: { "zh-TW": "中部", en: "Central Taiwan", ja: "中部エリア" },
    description: {
      "zh-TW": "中臺灣文化經貿大城，氣候宜人晴朗，匯聚高美濕地無敵夕陽、國家歌劇院前衛建築與逢甲夜市創新美食潮流。",
      en: "Central Taiwan's metropolis boasting year-round pleasant weather, breathtaking Gaomei Wetlands sunsets, the futuristic National Taichung Theater, and Fengjia Night Market.",
      ja: "気候温暖な中台湾の大都市。夕日が絶景の高美湿地、伊東豊雄氏設計の国家歌劇院、トレンドグルメ発信地の逢甲夜市が揃っています。"
    },
    agriculture: { "zh-TW": "東勢寄接梨與茂谷柑、和平高山水蜜桃、大甲芋頭", en: "Dongshi Pears & Murcott Oranges, Heping Peaches, Dajia Taro", ja: "東勢ナシ・ポンカン、和平高冷地モモ、大甲タロイモ" },
    fishery: { "zh-TW": "梧棲漁港現撈海產、生猛花蟹、野生烏魚", en: "Wuqi Harbor Fresh Catch, Flower Crab, Wild Mullet", ja: "梧棲漁港新鮮魚介、ワタリガニ、天然ボラ" },
    livestock: { "zh-TW": "外埔優質酪農生乳、大肚山黑豚", en: "Waipu Dairy Fresh Milk, Dadu Mountain Black Pork", ja: "外埔新鮮ミルク、大肚山黒豚" },
    famousFood: {
      "zh-TW": ["大甲酥炸芋頭酥", "逢甲大腸包小腸", "太陽餅", "宮原眼科冰淇淋"],
      en: ["Dajia Crispy Taro Pastry", "Fengjia Sausage with Sticky Rice", "Taichung Sun Cake", "Miyahara Gourmet Ice Cream"],
      ja: ["大甲タロイモパイ", "大腸包小腸（台湾ソーセージもち米包み）", "太陽餅（タイヤンビン）", "宮原眼科アイスクリーム"]
    }
  },
  "彰化縣": {
    name: { "zh-TW": "彰化縣", en: "Changhua County", ja: "彰化県" },
    region: { "zh-TW": "中部", en: "Central Taiwan", ja: "中部エリア" },
    description: {
      "zh-TW": "臺灣中部百年歷史穀倉，鹿港古蹟小鎮文風鼎盛，八卦山大佛巍峨聳立，觀光工廠密度冠居全臺。",
      en: "Central Taiwan's historic agricultural powerhouse, famed for Lukang heritage town, Baguashan Giant Buddha, and Taiwan's highest density of tourist factories.",
      ja: "歴史ある穀倉地帯。伝統文化香る古都・鹿港、八卦山大仏の威容、そして全国トップクラスの観光工場が集まる見どころ満載の県です。"
    },
    agriculture: { "zh-TW": "田尾公路花園花卉、大村巨峰葡萄、社頭芭樂", en: "Tianwei Flower Garden blooms, Dacun Kyoho Grapes, Shetou Guavas", ja: "田尾公路花園の花々、大村巨峰ぶどう、社頭グアバ" },
    fishery: { "zh-TW": "鹿港蝦猴、芳苑王功珍珠蚵、文蛤", en: "Lukang Mud Shrimp, Wanggong Pearl Oysters, Hard Clams", ja: "鹿港シャコ、王功パールオイスター、ハマグリ" },
    livestock: { "zh-TW": "芳苑有機生鮮雞蛋、溪湖羊肉、彰化黑豬", en: "Fangyuan Fresh Eggs, Xihu Tender Goat, Changhua Pork", ja: "芳苑新鮮タマゴ、渓湖ヤギ肉、彰化ポーク" },
    famousFood: {
      "zh-TW": ["彰化炸肉圓", "鹿港麵線糊", "溪湖當歸溫補羊肉爐", "牛舌餅"],
      en: ["Changhua Crispy Ba-wan", "Lukang Thick Flour-tea Noodles", "Xihu Herbal Lamb Hotpot", "Ox-tongue Biscuit"],
      ja: ["彰化バーワン（肉圓）", "鹿港麺線糊", "渓湖薬膳羊肉鍋", "牛舌餅（パイ風焼き菓子）"]
    }
  },
  "南投縣": {
    name: { "zh-TW": "南投縣", en: "Nantou County", ja: "南投県" },
    region: { "zh-TW": "中部", en: "Central Taiwan", ja: "中部エリア" },
    description: {
      "zh-TW": "臺灣唯一不臨海的內陸縣，坐擁高山百岳玉山、波光粼粼日月潭、清境高山農場與鹿谷凍頂烏龍茶鄉。",
      en: "Taiwan's only landlocked mountain county, featuring majestic Mt. Jade, the enchanting Sun Moon Lake, Qingjing Alpine Farm, and Lugu Oolong Tea.",
      ja: "台湾唯一の海なし県。最高峰・玉山、碧き湖・日月潭、ヨーロッパ風の清境農場、名茶・鹿谷凍頂烏龍茶の産地として世界に知られます。"
    },
    agriculture: { "zh-TW": "鹿谷凍頂烏龍茶、信義青梅、埔里百香果與茭白筍", en: "Lugu Oolong Tea, Xinyi Green Plums, Puli Passion Fruit & Water Bamboo", ja: "鹿谷凍頂烏龍茶、信義青梅、埔里パッションフルーツ・マコモダケ" },
    fishery: { "zh-TW": "日月潭曲腰魚（總統魚）、潭蝦、高山鱘龍魚", en: "Sun Moon Lake President Fish, Lake Shrimp, Alpine Sturgeon", ja: "日月潭総統魚、淡水エビ、チョウザメ" },
    livestock: { "zh-TW": "清境高山綿羊與黑豬、草屯健康放山土雞", en: "Qingjing Mountain Sheep & Pork, Caotun Native Chicken", ja: "清境高原羊・黒豚、草屯地鶏" },
    famousFood: {
      "zh-TW": ["日月潭紅茶蛋", "清境雲南擺夷料理", "竹山竹筒飯", "埔里紹興香腸"],
      en: ["Sun Moon Lake Black Tea Eggs", "Qingjing Yunnan Baiyi Dishes", "Zhushan Bamboo Rice", "Puli Shaoxing Sausage"],
      ja: ["日月潭紅茶煮玉子", "清境雲南料理", "竹山竹筒ご飯", "埔里紹興酒ソーセージ"]
    }
  },
  "雲林縣": {
    name: { "zh-TW": "雲林縣", en: "Yunlin County", ja: "雲林県" },
    region: { "zh-TW": "中部", en: "Central Taiwan", ja: "中部エリア" },
    description: {
      "zh-TW": "臺灣農業首都與布袋戲故鄉，北港朝天宮媽祖香火鼎盛，古坑臺灣咖啡與西螺百年黑豆純釀醬油名揚全臺。",
      en: "Taiwan's agricultural capital and glove puppetry cradle, featuring historic Beigang Chaotian Temple, Gukeng specialty coffee, and Xiluo soy sauce.",
      ja: "台湾の農業首都にして人形劇（布袋戯）のふるさと。北港朝天宮の熱気ある参拝、古坑コーヒー、西螺の伝統黒豆醤油が名高いです。"
    },
    agriculture: { "zh-TW": "古坑精品咖啡、西螺優質稻米、莿桐蒜頭、斗六文旦", en: "Gukeng Specialty Coffee, Xiluo Rice, Citong Garlic, Douliu Pomelo", ja: "古坑スペシャリティコーヒー、西螺良質米、莿桐ニンニク、斗六文旦" },
    fishery: { "zh-TW": "口湖台灣鯛、現剖文蛤、烏魚子、生猛泰國蝦", en: "Kouhu Tilapia, Fresh Hard Clams, Bottarga, River Prawns", ja: "口湖ティラピア、ハマグリ、カラスミ、手長エビ" },
    livestock: { "zh-TW": "全臺最大肉豬產區、元長黑羽放山土雞、鵝肉", en: "Top Pork Producer, Yuanchang Native Black Chicken, Goose", ja: "台湾随一のポーク産地、元長地鶏、ガチョウ肉" },
    famousFood: {
      "zh-TW": ["北港鴨肉羹", "西螺麻糬", "古坑香醇手沖咖啡", "斗六炊仔飯"],
      en: ["Beigang Duck Thick Soup", "Xiluo Handmade Mochi", "Gukeng Hand-drip Coffee", "Douliu Steamed Rice Bowl"],
      ja: ["北港アヒル肉とろみスープ", "西螺手作りもち", "古坑ハンドドリップコーヒー", "斗六伝統蒸しご飯"]
    }
  },
  "嘉義市": {
    name: { "zh-TW": "嘉義市", en: "Chiayi City", ja: "嘉義市" },
    region: { "zh-TW": "南部", en: "Southern Taiwan", ja: "南部エリア" },
    description: {
      "zh-TW": "昔日木材之都『檜木之城』，也是通往阿里山的神聖門戶，文化路夜市火雞肉飯飄香，整座城市散發悠閒林業文史風采。",
      en: "The historic 'City of Hinoki Cypress' and gateway to Alishan, famed for Wenhua Road Night Market's savory turkey rice and forestry heritage.",
      ja: "「ヒノキの都」と称された森林鉄道の起点都市。文化路夜市名物の七面鳥肉ご飯（火鶏肉飯）の香りと、温かみある木造建築が魅力です。"
    },
    agriculture: { "zh-TW": "嘉義甜玉米、溫室小番茄、網室哈密瓜", en: "Sweet Corn, Greenhouse Cherry Tomatoes, Cantaloupes", ja: "スイートコーン、高糖度ミニトマト、マスクメロン" },
    fishery: { "zh-TW": "鄰近布袋東石新鮮鮮蚵直銷、現撈虱目魚", en: "Direct Oysters from Dongshi Harbor, Milkfish", ja: "近隣・東石漁港の新鮮カキ、サバヒー" },
    livestock: { "zh-TW": "全臺馳名優質火雞養殖、健康肉豬", en: "Famous Premium Turkey, Prime Pork", ja: "全国名産の特選七面鳥、厳選ポーク" },
    famousFood: {
      "zh-TW": ["道地嘉義火雞肉飯", "林聰明沙鍋魚頭", "源興御香屋葡萄柚綠茶", "豆花豆漿配油條"],
      en: ["Authentic Chiayi Turkey Rice", "Smart Fish Casserole", "Grapefruit Green Tea", "Soy Milk Tofu Pudding with You Tiao"],
      ja: ["本場嘉義名物・火鶏肉飯", "林聡明砂鍋魚頭（魚の土鍋煮込み）", "御香屋グレープフルーツ緑茶", "豆乳豆花（油条添え）"]
    }
  },
  "嘉義縣": {
    name: { "zh-TW": "嘉義縣", en: "Chiayi County", ja: "嘉義県" },
    region: { "zh-TW": "南部", en: "Southern Taiwan", ja: "南部エリア" },
    description: {
      "zh-TW": "雄踞阿里山國家森林遊樂區，坐擁日出雲海鐵道與神木巨石，平原有故宮南院國家級瑰寶，濱海東石鮮蚵肥美聞名。",
      en: "Home to the world-renowned Alishan sunrise and forest railway, the Southern Branch of the National Palace Museum, and Dongshi oyster beds.",
      ja: "世界遺産級の阿里山森林鉄道と雲海の日の出、国立故宮博物院南部院区、そして東石のプリプリ新鮮カキが自慢の豊かな地域です。"
    },
    agriculture: { "zh-TW": "阿里山高山茶、金萱茶、極光哈密瓜、水上蓮藕", en: "Alishan High Mountain Oolong, Jinxuan Tea, Aurora Melon, Lotus Root", ja: "阿里山高山茶、金萱茶、極光メロン、水上レンコン" },
    fishery: { "zh-TW": "東石鮮蚵、布袋生猛文蛤、白蝦、虱目魚", en: "Dongshi Oysters, Budai Hard Clams, White Shrimp, Milkfish", ja: "東石カキ、布袋ハマグリ、ホワイトシュリンプ、サバヒー" },
    livestock: { "zh-TW": "大林優質放山肉雞、溪口肉鴨", en: "Dalin Free-Range Chicken, Xikou Duck", ja: "大林地鶏、渓口アヒル" },
    famousFood: {
      "zh-TW": ["東石烤鮮蚵吃到飽", "阿里山奮起湖鐵路便當", "民雄正宗鵝肉", "布袋蚵仔包"],
      en: ["Dongshi Charcoal Grilled Oysters", "Fenqihu Railway Bento", "Minxiong Goose Meat", "Budai Oyster Pocket"],
      ja: ["東石焼き牡蠣食べ放題", "阿里山奮起湖名物鉄道弁当", "民雄極上ガチョウ肉", "布袋オイスターポケット"]
    }
  },
  "臺南市": {
    name: { "zh-TW": "臺南市", en: "Tainan City", ja: "台南市" },
    region: { "zh-TW": "南部", en: "Southern Taiwan", ja: "南部エリア" },
    description: {
      "zh-TW": "臺灣第一古都『府城』，四百年悠久文史，赤崁樓與安平古堡見證大航海歷史，溫體牛肉湯與小吃美食密度稱霸全臺。",
      en: "Taiwan's ancient capital with over 400 years of heritage, Fort Zeelandia, Chihkan Tower, and legendary fresh beef soup and gourmet street delicacies.",
      ja: "400年の歴史を誇る台湾最初の古都「府城」。赤崁楼や安平古堡の史跡、新鮮な牛肉スープなど台湾グルメの聖地です。"
    },
    agriculture: { "zh-TW": "玉井愛文芒果、麻豆文旦、關廟金鑽鳳梨、東山龍眼與咖啡", en: "Yujing Irwin Mango, Madou Pomelo, Guanmiao Pineapple, Dongshan Longan & Coffee", ja: "玉井アップルマンゴー、麻豆文旦、関廟パイナップル、東山龍眼・コーヒー" },
    fishery: { "zh-TW": "七股潟湖生蠔、安平現撈虱目魚、黃錫鯛、秋姑魚", en: "Qigu Lagoon Oysters, Anping Fresh Milkfish, Porgy", ja: "七股カキ、安平サバヒー、鯛、海鮮" },
    livestock: { "zh-TW": "善化善新每日現宰溫體黃牛、新化放山土雞", en: "Shanhua Daily Fresh Local Beef, Xinhua Native Chicken", ja: "善化当日朝締めフレッシュ牛肉、新化地鶏" },
    famousFood: {
      "zh-TW": ["台南現涮溫體牛肉湯", "安平鮮蝦捲", "正宗度小月擔仔麵", "台南富盛號碗粿"],
      en: ["Tainan Fresh Beef Soup", "Anping Crispy Shrimp Rolls", "Du Hsiao Yueh Danzai Noodles", "Savory Rice Pudding (Wa Kueh)"],
      ja: ["台南名物・新鮮牛肉スープ", "安平エビ巻き揚げ", "度小月坦仔麺", "富盛号ワーグイ（米粉プリン）"]
    }
  },
  "高雄市": {
    name: { "zh-TW": "高雄市", en: "Kaohsiung City", ja: "高雄市" },
    region: { "zh-TW": "南部", en: "Southern Taiwan", ja: "南部エリア" },
    description: {
      "zh-TW": "海洋港都與鋼鐵文創蛻變之城，駁二藝術特區充滿生命力，愛河愛之船與流行音樂中心勾勒浪漫蔚藍天際線。",
      en: "Southern Taiwan's vibrant ocean metropolis, transforming into an arts hub with Pier-2 Art Center, the Love River, and the Music Center.",
      ja: "ダイナミックな港湾都市。駁二芸術特区の現代アート、愛河の遊覧船、高雄流行音楽センターの美しい夜景が旅情をかきたてます。"
    },
    agriculture: { "zh-TW": "大樹玉荷包荔枝、燕巢珍珠芭樂與蜜棗、美濃橙蜜香小番茄", en: "Dashu Lychees, Yanchao Guavas & Jujubes, Meinong Cherry Tomatoes", ja: "大樹ライチ、燕巣グアバ・ナツメ、美濃トマト" },
    fishery: { "zh-TW": "前鎮遠洋漁港鮪魚秋刀魚、旗津現撈透抽黑鯧", en: "Qianzhen Deep-sea Tuna & Saury, Cijin Harbor Squid & Pomfret", ja: "前鎮マグロ・サンマ、旗津イカ・マナガツオ" },
    livestock: { "zh-TW": "田寮月世界泥火山跑山土雞、優質肉豬", en: "Moon World Free-Range Mud Chicken, Premium Pork", ja: "月世界放し飼い地鶏、上質ポーク" },
    famousFood: {
      "zh-TW": ["旗津現烤大卷海產", "美濃客家炒粄條", "岡山正宗羊肉爐", "六合夜市海鮮粥"],
      en: ["Cijin Grilled Giant Squid", "Meinong Hakka Rice Noodles", "Gangshan Herbal Goat Stew", "Liuhe Night Market Seafood Congee"],
      ja: ["旗津名物・焼きイカ", "美濃客家きしめん炒め", "岡山薬膳ヤギ肉鍋", "六合夜市特製海鮮粥"]
    }
  },
  "屏東縣": {
    name: { "zh-TW": "屏東縣", en: "Pingtung County", ja: "屏東県" },
    region: { "zh-TW": "南部", en: "Southern Taiwan", ja: "南部エリア" },
    description: {
      "zh-TW": "國境之南熱情渡假勝地，坐擁墾丁蔚藍珊瑚海灣、東港黑鮪魚故鄉、萬巒豬腳與可可巧克力莊園，四季如夏溫暖陽光。",
      en: "Taiwan's tropical southernmost paradise, home to Kenting's coral waters, Donggang's bluefin tuna, Wanluan pig trotters, and cacao estates.",
      ja: "常夏の最南端リゾート。墾丁の青い海とサンゴ礁、東港の黒マグロ、萬巒名物豚足煮込み、台湾産カカオ農園など魅力が凝縮されています。"
    },
    agriculture: { "zh-TW": "枋山愛文芒果、內埔頂級可可、高樹金鑽鳳梨、林邊黑珍珠蓮霧", en: "Fangshan Mangoes, Neipu Fine Cacao, Gaoshu Pineapples, Linbian Wax Apples", ja: "枋山マンゴー、内埔プレミアムカカオ、高樹パイナップル、林辺レンブ" },
    fishery: { "zh-TW": "東港頂級黑鮪魚、櫻花蝦、油魚子（東港三寶）", en: "Donggang Bluefin Tuna, Sakura Shrimp, Oil Fish Roe (Donggang 3 Treasures)", ja: "東港最高級クロマグロ、サクラエビ、アブラソコムツの卵（東港三宝）" },
    livestock: { "zh-TW": "萬巒優質豬腳、萬丹在地鮮乳酪農", en: "Wanluan Premium Pig Trotters, Wandan Fresh Dairy", ja: "萬巒名物豚足、萬丹新鮮ミルク" },
    famousFood: {
      "zh-TW": ["萬巒脆皮滷豬腳", "東港現切生魚片與雙糕潤", "潮州冷熱冰", "恆春綠豆蒜"],
      en: ["Wanluan Braised Pig Trotters", "Donggang Fresh Sashimi", "Chaozhou Hot-Cold Shaved Ice", "Hengchun Sweet Mung Bean Porridge"],
      ja: ["萬巒豚足の煮込み", "東港新鮮お刺身＆伝統生菓子", "潮州ホット＆コールドかき氷", "恒春緑豆ぜんざい"]
    }
  },
  "花蓮縣": {
    name: { "zh-TW": "花蓮縣", en: "Hualien County", ja: "花蓮県" },
    region: { "zh-TW": "東部", en: "Eastern Taiwan", ja: "東部エリア" },
    description: {
      "zh-TW": "背倚中央山脈、面迎浩瀚太平洋，大山大海極致交織，世界奇景太魯閣峽谷壯麗雄奇，七星潭湛藍礫石海灣洗滌心靈。",
      en: "Flanked by the Central Mountain Range and the Pacific, featuring the sublime marble cliffs of Taroko Gorge and crystal pebbled Qixingtan Bay.",
      ja: "壮大な中央山脈と雄大な太平洋に囲まれた自然の宝庫。世界的大理石峡谷・太魯閣と、小石が輝く七星潭ビーチの景観に癒されます。"
    },
    agriculture: { "zh-TW": "富里玉里富麗米、吉安龍鬚菜、瑞穗蜜香紅茶、鶴岡文旦", en: "Fuli Rice, Ji'an Chayote Shoots, Ruisui Honey Black Tea, Pomelo", ja: "富里特選米、吉安ハヤトウリの若芽、瑞穂蜜香紅茶、鶴岡文旦" },
    fishery: { "zh-TW": "花蓮港曼波魚（翻車魚）、七星潭現撈定置網海產、柴魚", en: "Sunfish, Qixingtan Fixed-net Wild Catch, Bonito Flakes", ja: "マンボウ料理、七星潭定置網鮮魚、カツオ節" },
    livestock: { "zh-TW": "瑞穗牧場優質鮮乳、花蓮櫻桃鴨與放山閹雞", en: "Ruisui Dairy Fresh Milk, Cherry Duck & Free-range Capon", ja: "瑞穂牧場フレッシュミルク、花蓮地鶏" },
    famousFood: {
      "zh-TW": ["花蓮液香扁食", "炸彈蔥油餅", "花蓮手工麻糬", "玉里古早味麵"],
      en: ["Hualien Pork Wontons", "Exploding Scallion Pancake", "Hualien Hand-pulled Mochi", "Yuli Traditional Egg Noodles"],
      ja: ["花蓮名物ワンタン（扁食）", "半熟卵入り揚げネギパイ", "花蓮手作りおもち", "玉里伝統ラーメン"]
    }
  },
  "臺東縣": {
    name: { "zh-TW": "臺東縣", en: "Taitung County", ja: "台東県" },
    region: { "zh-TW": "東部", en: "Eastern Taiwan", ja: "東部エリア" },
    description: {
      "zh-TW": "臺灣最後淨土，坐擁池上關山黃金稻浪、三仙台跨海步橋、知本美人溫泉與鹿野高台臺灣國際熱氣球嘉年華。",
      en: "Taiwan's pure eastern sanctuary, featuring golden Chishang rice fields, Sanxiantai bridge, Zhiben hot springs, and Luye hot air balloons.",
      ja: "台湾最後の桃源郷。黄金に輝く池上の水田、三仙台の連なるアーチ橋、知本温泉の名湯、鹿野高台の熱気球フェスティバルが有名です。"
    },
    agriculture: { "zh-TW": "池上與關山一等米、太麻里大目釋迦與鳳梨釋迦、金針花", en: "Chishang & Guanshan Champion Rice, Sugar Apples & Atemoya, Daylilies", ja: "池上特A米、太麻里シャカトウ（釈迦頭）・アテモヤ、金針花" },
    fishery: { "zh-TW": "成功漁港現撈旗魚、鬼頭刀（鯕鰍）、鰹魚", en: "Chenggong Harbor Swordfish, Mahi-mahi (Dolphinfish), Bonito", ja: "成功漁港メカジキ、シイラ（マヒマヒ）、カツオ" },
    livestock: { "zh-TW": "初鹿牧場鮮純牛乳、鹿野土雞", en: "Chulu Ranch Pure Milk, Luye Mountain Chicken", ja: "初鹿牧場濃厚ミルク、鹿野地鶏" },
    famousFood: {
      "zh-TW": ["池上木片鐵路便當", "成功現切旗魚生魚片", "東河手工包子", "卑南豬血湯"],
      en: ["Chishang Wooden Box Bento", "Chenggong Fresh Swordfish Sashimi", "Donghe Handmade Buns", "Beinan Pork Blood Soup"],
      ja: ["池上木箱鉄道弁当", "成功獲れたてメカジキ刺身", "東河手作り肉まん", "卑南伝統豚の血スープ"]
    }
  },
  "澎湖縣": {
    name: { "zh-TW": "澎湖縣", en: "Penghu County", ja: "澎湖県" },
    region: { "zh-TW": "離島", en: "Outlying Islands", ja: "離島エリア" },
    description: {
      "zh-TW": "海島玄武岩奇觀與先民智慧雙心石滬，擁有澎湖國際海上花火節、奎壁山摩西分海與金黃沙灘水上世界。",
      en: "Volcanic basalt archipelagos featuring the Twin Heart Stone Weir, International Fireworks Festival, Kuibishan Moses Sea-parting, and coral beaches.",
      ja: "玄武岩の柱状節理と先人の知恵「双心石滬」で名高い美しい島々。国際海上花火フェスティバルやモーゼの海割れ現象が有名です。"
    },
    agriculture: { "zh-TW": "澎湖冰心絲瓜、花生、仙人掌果實、風茹草茶", en: "Penghu Loofah, Peanuts, Cactus Fruit, Wild Wind-grass Tea", ja: "澎湖ヘチマ、落花生、サボテン果実、風茹草ハーブティー" },
    fishery: { "zh-TW": "澎湖野生小管、狗母魚丸、澎湖大明蝦、丁香魚、海膽", en: "Penghu Wild Squid, Fish Meatballs, King Prawns, Anchovies, Sea Urchin", ja: "澎湖イカ、エソの魚団子、クルマエビ、キビナゴ、ウニ" },
    livestock: { "zh-TW": "澎湖在地放牧放山土羊、海風放山黑豬", en: "Penghu Free-range Pasture Goat, Sea-breeze Black Pig", ja: "澎湖放牧ヤギ肉、海風黒豚" },
    famousFood: {
      "zh-TW": ["澎湖仙人掌冰淇淋", "現烤小管麵線", "黑糖糕", "澎湖海鮮花枝丸"],
      en: ["Penghu Red Cactus Ice Cream", "Fresh Squid Vermicelli Soup", "Brown Sugar Sponge Cake", "Handmade Cuttlefish Balls"],
      ja: ["澎湖サボテンソフトクリーム", "獲れたてイカのそうめんスープ", "黒糖蒸しケーキ（黒糖糕）", "手作りイカ団子"]
    },
    islandNotice: {
      "zh-TW": "✈️ 交通方式：每日有定期航班由松山、台中、高雄、台南直飛馬公機場（航程約 45~55 分鐘）；布袋港與高雄港亦有高速客輪直達（船程約 75~90 分鐘）。",
      en: "✈️ Transit: Daily direct flights from Taipei Songshan, Taichung, Kaohsiung, and Tainan to Magong (45-55 mins); high-speed ferries operate from Chiayi Budai and Kaohsiung (75-90 mins).",
      ja: "✈️ アクセス：台北松山・台中・高雄・台南空港から馬公空港へ毎日定期便が運航（所要約45〜55分）。嘉義布袋港・高雄港から高速フェリーも就航（約75〜90分）。"
    }
  },
  "金門縣": {
    name: { "zh-TW": "金門縣", en: "Kinmen County", ja: "金門県" },
    region: { "zh-TW": "離島", en: "Outlying Islands", ja: "離島エリア" },
    description: {
      "zh-TW": "戰地坑道史蹟與閩南古厝燕尾脊交織，風獅爺虔敬守護聚落，金門高粱酒香四溢，兼具金門大橋壯麗跨海景觀。",
      en: "An island rich in Cold War military tunnels, majestic Minnan courtyards, Wind Lion Gods, legendary Kaoliang Liquor, and the grand Kinmen Bridge.",
      ja: "冷戦期の軍事要塞トンネルと、ツバメの尾のような屋根を持つ伝統的閩南集落が融合。風獅爺（シーサー）と名酒・金門高粱酒が息づきます。"
    },
    agriculture: { "zh-TW": "金門高粱、一條根、小麥、地瓜（番薯）", en: "Kinmen Sorghum, Yitiaogen Herb, Wheat, Sweet Potatoes", ja: "金門高粱（コーリャン）、一條根薬草、小麦、サツマイモ" },
    fishery: { "zh-TW": "金門石蚵、黃魚、鱟（保育活化石）、赤翅仔", en: "Kinmen Stone Oysters, Yellow Croaker, Horseshoe Crab, Sea Bream", ja: "金門天然石ガキ、キグチ、カブトガニ、クロダイ" },
    livestock: { "zh-TW": "金門高粱酒糟全牛、健康肉豬", en: "Kaoliang Distiller-grain Fed Beef, Pork", ja: "高粱酒粕育ちの極上金門牛、厳選ポーク" },
    famousFood: {
      "zh-TW": ["金門全牛宴料理", "石蚵麵線與蚵嗲", "廣東粥配現炸油條", "高粱蛋捲與貢糖"],
      en: ["Kinmen Full-beef Feast", "Stone Oyster Vermicelli & Fritters", "Cantonese Congee with Crispy Crullers", "Kaoliang Egg Rolls & Peanut Candy"],
      ja: ["金門名物・極上牛づくし料理", "石ガキの素麺＆カキ揚げ", "広東風おかゆ＆揚げパン", "高粱エッグロール＆伝統落花生糖"]
    },
    islandNotice: {
      "zh-TW": "✈️ 交通方式：每日有定期國內航班由台北松山、台中、高雄、台南、嘉義直飛金門尚義機場（航程約 55~65 分鐘）。",
      en: "✈️ Transit: Daily direct flights from Taipei Songshan, Taichung, Kaohsiung, Tainan, and Chiayi to Kinmen Shangyi Airport (55-65 mins).",
      ja: "✈️ アクセス：台北松山・台中・高雄・台南・嘉義から金門尚義空港へ毎日定期直行便が運航（所要約55〜65分）。"
    }
  },
  "連江縣": {
    name: { "zh-TW": "連江縣", en: "Lienchiang County (Matsu)", ja: "連江県（馬祖列島）" },
    region: { "zh-TW": "離島", en: "Outlying Islands", ja: "離島エリア" },
    description: {
      "zh-TW": "馬祖列島花崗岩地質奇觀，芹壁閩東石屋聚落宛如地中海山城，春夏藍眼淚夢幻螢光海灣，戰地八八坑道陳高醇厚。",
      en: "Granite archipelago famed for Qinbi Mediterranean-style stone village, magical spring 'Blue Tears' bioluminescence, and Tunnel 88 aged liquor.",
      ja: "花崗岩の断崖絶壁に佇む島々。「地中海のような石造りの街並み」芹壁集落、神秘的な青い波「青い涙（夜光虫）」、八八坑道の熟成古酒が魅力です。"
    },
    agriculture: { "zh-TW": "馬祖金銀花、高粱、白蘿蔔、紅糟", en: "Honeysuckle, Sorghum, White Radish, Red Yeast Rice Lees", ja: "スイカズラ、高粱、大根、紅麹（紅糟）" },
    fishery: { "zh-TW": "馬祖生猛淡菜（貽貝）、現撈黃魚、紫菜、帶魚", en: "Matsu Fresh Mussels, Wild Yellow Croaker, Seaweed, Beltfish", ja: "馬祖特大ムール貝、天然キグチ、海苔、タチウオ" },
    livestock: { "zh-TW": "南竿北竿放山土雞、天然海島黑山羊", en: "Nangan & Beigan Free-Range Chicken, Island Black Goat", ja: "南竿・北竿地鶏、島黒ヤギ" },
    famousFood: {
      "zh-TW": ["清蒸馬祖生鮮淡菜", "老酒麵線與老酒蛋", "紅糟炒飯與紅糟鰻", "馬祖繼光餅（馬祖漢堡）"],
      en: ["Steamed Matsu Mussels", "Old Matsu Wine Vermicelli Soup", "Red Yeast Fried Rice & Eel", "Jiguang Sesame Buns (Matsu Burger)"],
      ja: ["馬祖直送蒸しムール貝", "老酒風味そうめん＆目玉焼き", "紅麹チャーハン＆うなぎ", "継光餅（マツバーガー）"]
    },
    islandNotice: {
      "zh-TW": "✈️ 交通方式：每日有國內航班由松山、台中直飛南竿或北竿機場（航程約 50 分鐘）；基隆港亦有「新臺馬輪」客輪臥鋪夜航直達（船程約 7~8 小時）。",
      en: "✈️ Transit: Daily flights from Taipei Songshan and Taichung to Nangan/Beigan (50 mins); Xin Tai Ma overnight ferry sails from Keelung Harbor (7-8 hours).",
      ja: "✈️ アクセス：台北松山・台中空港から南竿・北竿空港へ毎日就航（所要約50分）。基隆港から大型フェリー「新臺馬輪」の夜行寝台船も就航（約7〜8時間）。"
    }
  },
  "琉球嶼": {
    name: { "zh-TW": "琉球嶼", en: "Xiaoliuqiu (Ryukyu Island)", ja: "琉球嶼（小琉球）" },
    region: { "zh-TW": "離島", en: "Outlying Islands", ja: "離島エリア" },
    description: {
      "zh-TW": "臺灣唯一的珊瑚礁離島，海水常年清澈如鏡，綠蠵龜野生浮潛勝地，花瓶岩與烏鬼洞見證大自然造化奇功。",
      en: "Taiwan's premier coral reef island with year-round crystal warm waters, world-famous green sea turtle snorkeling, and Vase Rock formations.",
      ja: "台湾唯一のサンゴ礁の島。一年中温暖で透明度抜群の海には野生のウミガメが泳ぎ、花瓶岩や鍾乳洞などの奇観が広がります。"
    },
    agriculture: { "zh-TW": "小琉球芒果、龍鬚菜、海燕窩", en: "Xiaoliuqiu Mango, Chayote Tendrils, Sea Bird's Nest Coral Algae", ja: "小琉球マンゴー、ハヤトウリの新芽、海燕の巣（海藻ゼリー）" },
    fishery: { "zh-TW": "現撈鬼頭刀（鯕鰍）、黃鰭鮪魚、小管、飛魚", en: "Mahi-mahi, Yellowfin Tuna, Squid, Flying Fish", ja: "獲れたてシイラ、キハダマグロ、イカ、トビウオ" },
    livestock: { "zh-TW": "全島放牧黑山羊、海島放山土雞", en: "Free-range Island Black Goat, Free-range Chicken", ja: "島黒ヤギ、放し飼い地鶏" },
    famousFood: {
      "zh-TW": ["小琉球酥脆麻花捲", "鬼頭刀炒飯與魚卵", "相思麵", "海龜燒雞蛋糕"],
      en: ["Xiaoliuqiu Crispy Twisted Rolls", "Mahi-mahi Fried Rice & Fish Roe", "Xiangsi Noodles", "Sea Turtle Shaped Waffle Cakes"],
      ja: ["名物かりんとう（麻花捲）", "シイラ炒飯＆魚卵焼き", "相思麺（特製まぜそば）", "ウミガメ型ベビーカステラ"]
    },
    islandNotice: {
      "zh-TW": "🚢 交通方式：由屏東東港碼頭搭乘泰富、東琉線或藍白客輪直達（船程僅約 20~25 分鐘，每日班次密集）。",
      en: "🚢 Transit: High-speed passenger ferries operate continuously from Pingtung Donggang Wharf directly to Xiaoliuqiu (approx. 20-25 minutes).",
      ja: "🚢 アクセス：屏東・東港フェリーターミナルから高速船で直行（所要時間はわずか約20〜25分、1日多数運航）。"
    }
  }
};

// Common spot translations dictionary
export const COMMON_SPOT_TRANSLATIONS: Record<string, { en: string; ja: string; enIntro?: string; jaIntro?: string }> = {
  "臺北101觀景台": {
    en: "Taipei 101 Observatory",
    ja: "台北101展望台",
    enIntro: "Iconic landmark skyscraper offering panoramic views of Taipei Basin.",
    jaIntro: "台北盆地の雄大なパノラマを一望できる国際的な摩天楼ランドマーク。"
  },
  "國立故宮博物院": {
    en: "National Palace Museum",
    ja: "国立故宮博物院",
    enIntro: "Housing nearly 700,000 ancient Chinese imperial treasures.",
    jaIntro: "歴代王朝の至宝約70万点を収蔵する世界屈指の博物館。"
  },
  "臺北市立美術館": {
    en: "Taipei Fine Arts Museum",
    ja: "台北市立美術館",
    enIntro: "Taiwan's premier public modern and contemporary art museum.",
    jaIntro: "現代アートをリードする台湾初の公立美術館。"
  },
  "大稻埕迪化街歷史街區": {
    en: "Dadaocheng Dihua Street Heritage Area",
    ja: "大稲埕・迪化街レトロ歴史街区",
    enIntro: "Baroque and red-brick heritage street filled with herbal tea shops and crafts.",
    jaIntro: "バロック様式と赤レンガ建築が連なる乾物・漢方・カフェの街。"
  },
  "陽明山竹子湖海芋繡球花田": {
    en: "Yangmingshan Zhuzihu Calla Lily & Hydrangea Fields",
    ja: "陽明山・竹子湖カラーリリー＆アジサイ花畑",
    enIntro: "Lush volcanic floral valleys in Yangmingshan National Park.",
    jaIntro: "四季折々の花々と湯煙が彩る陽明山の名勝。"
  },
  "艋舺龍山寺與剝皮寮歷史街區": {
    en: "Bangka Lungshan Temple & Bopiliao Historic Block",
    ja: "艋舺龍山寺＆剥皮寮歴史街区",
    enIntro: "280-year-old historic Buddhist temple and preserved Qing-dynasty arcades.",
    jaIntro: "280年以上の歴史を誇る名刹と清朝時代の赤レンガ建築街。"
  },
  "松山文創園區": {
    en: "Songshan Cultural and Creative Park",
    ja: "松山文創園区",
    enIntro: "Revitalized historic tobacco factory turned vibrant design hub.",
    jaIntro: "旧煙草工場を再生した緑豊かなデザイン＆カルチャー発信地。"
  },
  "象山親山步道六巨石": {
    en: "Xiangshan (Elephant Mountain) Trail & Six Giant Rocks",
    ja: "象山遊歩道・六巨石展望スポット",
    enIntro: "Famous trail offering iconic skyline views of Taipei 101.",
    jaIntro: "台北101の絶景パノラマと夜景を一望できる人気ハイキングコース。"
  },
  "九份老街": {
    en: "Jiufen Old Street",
    ja: "九份老街",
    enIntro: "Historic gold rush mountain town with charming lanterns and tea houses.",
    jaIntro: "赤い提灯と石段が幻想的なノスタルジックな山あいの街並み。"
  },
  "淡水老街與漁人碼頭": {
    en: "Tamsui Old Street & Fisherman's Wharf",
    ja: "淡水老街＆フィッシャーマンズワーフ",
    enIntro: "Riverside boardwalk famous for romantic sunsets and historic Fort San Domingo.",
    jaIntro: "川沿いの夕日と恋人橋、オランダ古城が織りなすロマンチックな港町。"
  },
  "新北市立鶯歌陶瓷博物館": {
    en: "Yingge Ceramics Museum",
    ja: "鶯歌陶芸博物館",
    enIntro: "Taiwan's premier museum dedicated to ceramics and ceramic art.",
    jaIntro: "台湾陶磁器の歴史と現代アートを展示する専門博物館。"
  },
  "野柳地質公園": {
    en: "Yehliu Geopark",
    ja: "野柳地質公園",
    enIntro: "World-renowned seaside geopark featuring the iconic Queen's Head rock.",
    jaIntro: "女王頭（クイーンズヘッド）など波と風が刻んだ奇岩が広がる景勝地。"
  },
  "十分瀑布公園": {
    en: "Shifen Waterfall Park",
    ja: "十分大滝公園",
    enIntro: "Known as Taiwan's Niagara Falls, a magnificent curtain waterfall.",
    jaIntro: "「台湾のナイアガラ」と称される迫力満点のカーテン型大滝。"
  },
  "基隆廟口夜市": {
    en: "Keelung Miaokou Night Market",
    ja: "基隆廟口夜市",
    enIntro: "Famous bustling food market surrounding Dianji Temple.",
    jaIntro: "奠済宮を中心に百軒以上の伝統屋台が立ち並ぶ台湾屈指の美食夜市。"
  },
  "正濱漁港彩色屋": {
    en: "Zhengbin Port Color Houses",
    ja: "正濱漁港カラフルハウス",
    enIntro: "Vibrant Venetian-style painted buildings along the harbor.",
    jaIntro: "ベネチアのブラーノ島を思わせる色鮮やかな港町のフォトスポット。"
  },
  "和平島地質公園": {
    en: "Heping Island Geopark",
    ja: "和平島地質公園",
    enIntro: "Marine eroded geological wonderland with natural sea pools.",
    jaIntro: "奇岩怪石と太平洋の海風、天然の海水プールが楽しめる海洋公園。"
  },
  "日月潭國家風景區": {
    en: "Sun Moon Lake National Scenic Area",
    ja: "日月潭国家風景区",
    enIntro: "Breathtaking alpine lake surrounded by misty emerald green hills.",
    jaIntro: "エメラルドグリーンの湖面と霧煙る山並みが美しい台湾有数の名勝。"
  },
  "阿里山國家森林遊樂區": {
    en: "Alishan National Forest Recreation Area",
    ja: "阿里山国家森林遊楽区",
    enIntro: "Renowned for ancient giant cypress trees, sunrise seas of clouds, and forest railway.",
    jaIntro: "樹齢千年の巨木林、雲海の日の出、名物森林鉄道で名高い景勝地。"
  },
  "墾丁國家公園": {
    en: "Kenting National Park",
    ja: "墾丁国家公園",
    enIntro: "Tropical paradise with white sand beaches, coral reefs, and vibrant night markets.",
    jaIntro: "白い砂浜とサンゴ礁、熱帯の青い海が広がるリゾートパラダイス。"
  },
  "太魯閣國家公園": {
    en: "Taroko National Park",
    ja: "太魯閣国家公園",
    enIntro: "World-class marble gorge canyons, sheer cliff trails, and azure crystal waters.",
    jaIntro: "大理石の断崖絶壁とエメラルドの渓谷美が織りなす世界的大自然。"
  },
  "赤崁樓": {
    en: "Chihkan Tower (Fort Provintia)",
    ja: "赤崁楼（プロヴィンシャ城）",
    enIntro: "Historic fortress built during the Dutch era in Tainan.",
    jaIntro: "オランダ統治時代に築かれた台南を代表する国家一級古蹟。"
  },
  "安平古堡": {
    en: "Anping Fort (Fort Zeelandia)",
    ja: "安平古堡（ゼーランディア城）",
    enIntro: "Centuries-old fortress and historic cradle of Taiwan.",
    jaIntro: "台湾の歴史の幕開けを告げる17世紀のオランダ要塞跡。"
  },
  "駁二藝術特區": {
    en: "The Pier-2 Art Center",
    ja: "駁二芸術特区",
    enIntro: "Dynamic harbor warehouse arts colony showcasing cutting-edge installations.",
    jaIntro: "港湾の古い倉庫群をリノベーションした高雄最先端のアートパーク。"
  },
  "黑松世界觀光展覽館": {
    en: "HeySong Beverage Museum",
    ja: "ヘイソン飲料文化観光館",
    enIntro: "Explore the nostalgic history of Taiwan's national beverage brand.",
    jaIntro: "台湾の国民的清涼飲料「黒松」の百年史とレトロ展示を体感。"
  },
  "台北偶戲館": {
    en: "Puppetry Art Center of Taipei",
    ja: "台北人形劇芸術館",
    enIntro: "Hands-on glove and shadow puppetry craft workshop.",
    jaIntro: "伝統の人形劇（布袋戯・影絵劇）を体験できる文化施設。"
  },
  "郭元益糕餅博物館士林館": {
    en: "Kuo Yuan Ye Museum of Cake and Pastry",
    ja: "郭元益お菓子博物館",
    enIntro: "Heritage Taiwanese pastry culture with DIY bakery experience.",
    jaIntro: "百年の歴史を誇る老舗中華菓子の文化展示と手作りDIY体験。"
  },
  "手信坊創意和菓子文化館": {
    en: "Shoushinbou Wagashi Cultural Center",
    ja: "手信坊和菓子文化館",
    enIntro: "Japanese-inspired confectionary center with DIY sweets making.",
    jaIntro: "鳥居や日本庭園の景観と和菓子手作り体験が人気の観光工場。"
  },
  "鶯歌許新旺陶瓷紀念博物館": {
    en: "Shu's Pottery Museum Yingge",
    ja: "許新旺陶芸記念博物館",
    enIntro: "Centennial ceramics craft museum with pottery wheel workshops.",
    jaIntro: "百年陶芸の歴史と本格的な陶芸ろくろ体験が楽しめる工房。"
  },
  "鹽水永成戲院": {
    en: "Yanshui Yongcheng Theater",
    ja: "塩水永成劇場（永成戯院）",
    enIntro: "Historic Japanese-era wooden cinema preserving vintage movie memorabilia.",
    jaIntro: "日本統治時代の木造映画館。ヴィンテージ映写機やレトロな歴史を今に伝えます。"
  },
  "菁寮老街": {
    en: "Jingliao Old Street",
    ja: "菁寮老街（無米楽ロケ地）",
    enIntro: "Charming traditional rural street famed for historic wooden shopfronts and indigo crafts.",
    jaIntro: "名作ドキュメンタリー「無米楽」の舞台。木造建築のレトロ商店や藍染め文化が残る風情ある老街。"
  },
  "海安路藝術造街": {
    en: "Haian Road Art Street",
    ja: "海安路アートストリート",
    enIntro: "Vibrant open-air art museum boulevard with creative murals and night cafes.",
    jaIntro: "壁画アートやライトアップインスタレーション、夜のカフェが立ち並ぶ野外アート街。"
  },
  "初鹿牧場週邊秘境林道": {
    en: "Chulu Ranch Secret Forest Trail",
    ja: "初鹿牧場周辺シークレット森林遊歩道",
    enIntro: "Peaceful forest trail behind the ranch offering fresh phytoncide and scenic greenery.",
    jaIntro: "牧場奥に広がる静寂な原生林遊歩道。森林浴と爽やかな緑を満喫できる癒しスポット。"
  },
  "初鹿牧場": {
    en: "Chulu Ranch",
    ja: "初鹿牧場",
    enIntro: "Taiwan's premier highland dairy ranch with green pastures and fresh dairy treats.",
    jaIntro: "青々とした放牧地が広がる台東屈指の高原牧場。濃厚な新鮮ミルクやソフトクリームが名物。"
  },
  "知本溫泉區觀景步道與商圈": {
    en: "Zhiben Hot Springs Trail & Village",
    ja: "知本温泉街・景観遊歩道",
    enIntro: "Famous mineral hot spring district with riverside boardwalks and local dining.",
    jaIntro: "名湯・知本温泉の河畔遊歩道とご当地グルメが並ぶ賑やかな温泉街。"
  },
  "知本溫泉": {
    en: "Zhiben Hot Springs",
    ja: "知本温泉",
    enIntro: "World-renowned sodium bicarbonate hot springs surrounded by emerald valleys.",
    jaIntro: "美肌効果抜群の弱アルカリ性炭酸水素塩泉。渓谷の絶景に囲まれた名湯。"
  },
  "神農街": {
    en: "Shennong Street",
    ja: "神農街レトロストリート",
    enIntro: "Atmospheric Qing-dynasty heritage lane with lantern-lit historic shop-houses.",
    jaIntro: "提灯の灯りが情緒を醸し出す清朝時代の歴史ある町屋小路。"
  },
  "國華街": {
    en: "Guohua Street Food Alley",
    ja: "国華街グルメストリート",
    enIntro: "Tainan's bustling culinary strip packed with legendary generational street food.",
    jaIntro: "老舗小吃店が軒を連ねる台南随一の食べ歩き天国。"
  },
  "安平老街": {
    en: "Anping Old Street",
    ja: "安平老街（延平街）",
    enIntro: "Taiwan's oldest commercial street dating back to the Dutch era.",
    jaIntro: "オランダ統治時代に発祥した台湾最古の歴史を誇る商店街。"
  },
  "奇美博物館": {
    en: "Chimei Museum",
    ja: "奇美博物館（チーメイ博物館）",
    enIntro: "Palatial Western art museum featuring classical art, musical instruments, and armor.",
    jaIntro: "西洋古典絵画、世界最高峰のバイオリンコレクション、武器甲冑を誇る白亜の大博物館。"
  },
  "十鼓仁糖文創園區": {
    en: "Ten Drum Cultural Creative Park",
    ja: "十鼓仁糖文創園区",
    enIntro: "Historic sugar refinery transformed into world-class percussion art and adventure hub.",
    jaIntro: "百年製糖工場をリノベーションした迫力の太鼓パフォーマンス＆体験型アートパーク。"
  },
  "藍晒圖文創園區": {
    en: "Blueprint Cultural & Creative Park",
    ja: "藍晒図文創園区",
    enIntro: "Creative arts village with 3D blueprint art installations and indie studios.",
    jaIntro: "青い3D設計図アートと古民家が融合した高感度カルチャー＆アートヴィレッジ。"
  },
  "四草綠色隧道": {
    en: "Sicao Green Tunnel",
    ja: "四草マングローブ緑のトンネル",
    enIntro: "Taiwan's mini Amazon, featuring scenic raft tours through ancient mangrove canopies.",
    jaIntro: "「台湾のミニ・アマゾン」と称される水上マングローブ原生林を巡る竹筏ツアー。"
  },
  "伯朗大道": {
    en: "Mr. Brown Avenue",
    ja: "伯朗大道（ミスターブラウンアベニュー）",
    enIntro: "Iconic rural road flanked by endless golden rice paddies without a single power pole.",
    jaIntro: "電柱が一切ない緑と黄金の広大な水田を真っ直ぐ貫く絶景サイクリングロード。"
  },
  "鹿野高台": {
    en: "Luye Highland",
    ja: "鹿野高台",
    enIntro: "Scenic plateau famous for tea plantations and the Taiwan International Balloon Fiesta.",
    jaIntro: "壮大な茶畑を見下ろす台地。台湾国際熱気球フェスティバルの開催地。"
  },
  "三仙台": {
    en: "Sanxiantai Dragon Bridge",
    ja: "三仙台跨海歩道橋",
    enIntro: "Dramatic eight-arch pedestrian bridge connecting to an offshore sea dragon island.",
    jaIntro: "八連のアーチ橋が太平洋に架かる奇岩と海の絶景ランドマーク。"
  },
  "鐵花村": {
    en: "Tiehua Music Village",
    ja: "鉄花村音楽集落",
    enIntro: "Charming creative village with handmade hot-air balloon lanterns and live indie music.",
    jaIntro: "手描きミニ気球ランタンの温かい灯りとライブ演奏が彩るナイトスポット。"
  },
  "多良車站": {
    en: "Duoliang Station",
    ja: "多良駅（太平洋絶景駅）",
    enIntro: "Acclaimed as Taiwan's most beautiful railway platform overlooking the Pacific.",
    jaIntro: "コバルトブルーの太平洋を見下ろす「台湾一美しい駅」展望デッキ。"
  },
  "小野柳": {
    en: "Fugang Geopark (Little Yeliu)",
    ja: "小野柳奇岩海岸",
    enIntro: "Coastal geopark featuring intricate wave-carved sandstone formations.",
    jaIntro: "波の浸食が生み出した豆腐岩やキノコ岩が連なる東海岸のジオパーク。"
  },
  "加路蘭遊憩區": {
    en: "Jialulan Recreation Area",
    ja: "加路蘭海岸展望スポット",
    enIntro: "Oceanfront open-air park adorned with indigenous driftwood art sculptures.",
    jaIntro: "太平洋を望む芝生広場に原住民族の流木アートが点在する絶景スポット。"
  }
};

// Theme translations
export const THEME_LOCALIZED_MAP: Record<string, { en: string; ja: string }> = {
  "休閒遊憩": { en: "Leisure & Family", ja: "レジャー・ファミリー" },
  "文化生活": { en: "Culture & Heritage", ja: "文化・歴史散策" },
  "戶外漫遊": { en: "Nature & Outdoor", ja: "自然・アウトドア" },
  "美食尋味": { en: "Local Gourmet", ja: "ご当地グルメ巡り" },
  "休閒親子與美食品嚐": { en: "Leisure, Family & Dining", ja: "レジャー・ファミリー＆グルメ" },
  "歷史文化與老街散步": { en: "Heritage & Old Streets", ja: "歴史文化＆レトロ街歩き" },
  "自然生態與戶外冒險": { en: "Nature & Outdoor Adventure", ja: "大自然＆アウトドアアドベンチャー" },
  "在地夜市與經典老店": { en: "Night Markets & Local Eats", ja: "夜市＆ご当地名物グルメ" }
};

// Transport translations
export const TRANSPORT_LOCALIZED_MAP: Record<string, { en: string; ja: string }> = {
  "汽車自駕": { en: "Self-Driving Car", ja: "レンタカー・マイカー" },
  "開車自駕": { en: "Self-Driving Car", ja: "レンタカー・マイカー" },
  "台灣高鐵（站前轉乘/租車）": { en: "High Speed Rail (THSR + Rental/Shuttle)", ja: "台湾新幹線 (THSR・乗継/レンタカー)" },
  "台鐵火車（鐵道慢旅漫遊）": { en: "Taiwan Railway (TRA Train Slow Travel)", ja: "台湾鉄道 (TRA 鉄道のんびり旅)" },
  "公車客運（大眾運輸好行路線）": { en: "Public Bus / Taiwan Tourist Shuttle", ja: "路線バス・台湾トリップバス" },
  "機車慢遊（巷弄穿梭）": { en: "Scooter Rental (Alley Exploration)", ja: "レンタルバイク（路地散策）" },
  "機車租借": { en: "Scooter Rental", ja: "レンタルバイク" },
  "腳踏車自行車慢騎": { en: "Bicycle / Cycling Tour", ja: "サイクリング・レンタサイクル" },
  "台灣高鐵": { en: "High Speed Rail (THSR)", ja: "台湾新幹線 (THSR)" },
  "台鐵火車": { en: "TRA Railway", ja: "台湾鉄道 (TRA)" },
  "大眾捷運": { en: "Metro / MRT", ja: "地下鉄・MRT" },
  "觀光巴士": { en: "Tourist Bus", ja: "観光バス・路線バス" },
  "徒步漫遊": { en: "Walking Tour", ja: "徒歩散策" },
  "飛機（國內航班直飛）": { en: "Domestic Flight", ja: "国内線直行便" },
  "船（客輪渡輪航行）": { en: "Passenger Ferry", ja: "定期旅客フェリー" },
  "客輪渡輪（海運航線直達）": { en: "Passenger Ferry", ja: "定期旅客フェリー" },
  "渡輪客輪": { en: "Passenger Ferry", ja: "定期旅客フェリー" }
};

// Helper: Get localized city name (supports bidirectional translation)
export function getLocalizedCityName(name: string, lang: SupportedLanguage | string = 'zh-TW'): string {
  if (!name) return '';
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const cleanName = name.trim();

  // 1. Direct match in CITY_LOCALIZED_MAP
  if (CITY_LOCALIZED_MAP[cleanName]) {
    return CITY_LOCALIZED_MAP[cleanName].name[l] || cleanName;
  }

  // 2. Reverse search across zh-TW, en, and ja
  for (const [zhKey, cityData] of Object.entries(CITY_LOCALIZED_MAP)) {
    if (
      zhKey === cleanName ||
      cityData.name['zh-TW'] === cleanName ||
      cityData.name.en.toLowerCase() === cleanName.toLowerCase() ||
      cityData.name.ja === cleanName
    ) {
      return cityData.name[l] || cityData.name['zh-TW'];
    }
  }

  return cleanName;
}

// Helper: Get localized region
export function getLocalizedRegion(region: string, lang: SupportedLanguage | string = 'zh-TW'): string {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const map: Record<string, { en: string; ja: string }> = {
    '北部': { en: 'Northern Taiwan', ja: '北部エリア' },
    '中部': { en: 'Central Taiwan', ja: '中部エリア' },
    '南部': { en: 'Southern Taiwan', ja: '南部エリア' },
    '東部': { en: 'Eastern Taiwan', ja: '東部エリア' },
    '離島': { en: 'Outlying Islands', ja: '離島エリア' }
  };
  if (l === 'zh-TW') {
    for (const [zh, trans] of Object.entries(map)) {
      if (trans.en.toLowerCase() === region.toLowerCase() || trans.ja === region) {
        return zh;
      }
    }
    return region;
  }
  return map[region]?.[l] || region;
}

// Helper: Get full localized city object
export function getLocalizedCity(city: CitySpecialty, lang: SupportedLanguage | string = 'zh-TW'): CitySpecialty {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  if (l === 'zh-TW') return city;
  const loc = CITY_LOCALIZED_MAP[city.name];
  if (!loc) return city;

  return {
    ...city,
    name: loc.name[l] || city.name,
    region: (loc.region[l] || city.region) as any,
    description: loc.description[l] || city.description,
    agriculture: loc.agriculture[l] || city.agriculture,
    fishery: loc.fishery[l] || city.fishery,
    livestock: loc.livestock[l] || city.livestock,
    famousFood: loc.famousFood[l] || city.famousFood,
    islandNotice: loc.islandNotice ? loc.islandNotice[l] : city.islandNotice,
    highlights: city.highlights.map(h => {
      const sp = COMMON_SPOT_TRANSLATIONS[h.name];
      return {
        ...h,
        name: sp ? sp[l] : h.name,
        intro: sp && (l === 'en' ? sp.enIntro : sp.jaIntro) ? (l === 'en' ? sp.enIntro! : sp.jaIntro!) : h.intro
      };
    }),
    tourismFactories: city.tourismFactories.map(tf => {
      const sp = COMMON_SPOT_TRANSLATIONS[tf.name];
      return {
        ...tf,
        name: sp ? sp[l] : tf.name,
        intro: sp && (l === 'en' ? sp.enIntro : sp.jaIntro) ? (l === 'en' ? sp.enIntro! : sp.jaIntro!) : tf.intro
      };
    })
  };
}

// Helper: Get localized theme name (bidirectional)
export function getLocalizedTheme(theme: string, lang: SupportedLanguage | string = 'zh-TW'): string {
  if (!theme) return '';
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const cleanTheme = theme.trim();

  if (THEME_LOCALIZED_MAP[cleanTheme]) {
    return l === 'zh-TW' ? cleanTheme : THEME_LOCALIZED_MAP[cleanTheme][l];
  }

  for (const [zhKey, data] of Object.entries(THEME_LOCALIZED_MAP)) {
    if (data.en.toLowerCase() === cleanTheme.toLowerCase() || data.ja === cleanTheme) {
      return l === 'zh-TW' ? zhKey : data[l];
    }
  }

  return cleanTheme;
}

// Detailed Theme Localization Map for UI cards
export const THEME_DETAILS_LOCALIZED: Record<string, {
  name: { en: string; ja: string };
  badgeLabel: { en: string; ja: string };
  audience: { en: string; ja: string };
  coverage: { en: string; ja: string };
  exclusion?: { en: string; ja: string };
  factoryPrinciple: { en: string; ja: string };
}> = {
  leisure_family: {
    name: { en: "Leisure & Family", ja: "レジャー・ファミリー" },
    badgeLabel: { en: "All Ages & Kids · Air-conditioned", ja: "全年齢・親子向け・快適室内" },
    audience: { en: "Families with seniors & kids. High comfort, indoor climate-controlled, easy gentle walking paths prioritized.", ja: "ファミリー、シニア、子供連れ。快適で段差が少なく、エアコン完備の屋内を最優先。" },
    coverage: { en: "Theme parks, interactive pavilions, aquariums/science museums, and entertainment-focused tourist factories.", ja: "テーマパーク、体験型科学館、水族館、エンタメ・スイーツ系観光工場。" },
    factoryPrinciple: { en: "Only factories with high interactive fun, dessert/toy DIY workshops, and relaxing spaces.", ja: "インタラクティブ体験、スイーツ・おもちゃDIY、涼しい休憩スペースが充実した施設を選定。" }
  },
  culture_and_lifestyle: {
    name: { en: "Culture & Heritage", ja: "文化・歴史散策" },
    badgeLabel: { en: "Heritage Settlements · Crafts", ja: "歴史街並み・職人工芸" },
    audience: { en: "Travelers who cherish historic heritage, artisan craftsmanship, old street ambiance, and aesthetic depth.", ja: "歴史的街並み、伝統工芸、レトロな雰囲気や美意識をじっくり味わいたい旅行者。" },
    coverage: { en: "Historic old streets, heritage villages, art museums, creative parks, and craft-learning factories.", ja: "史跡・老街、伝統集落、美術館、文創パーク、産業見学型観光工場。" },
    factoryPrinciple: { en: "Focuses on local industry heritage, guided brewing/craftsmanship, ceramics, or historic tea factories.", ja: "伝統産業の歴史、醸造・陶芸・茶葉製法の見学や本格的な工芸体験ができる施設を厳選。" }
  },
  outdoor_nature: {
    name: { en: "Nature & Outdoor", ja: "自然・アウトドア" },
    badgeLabel: { en: "Expansive Vistas · Mountains & Coast", ja: "大自然・山海パノラマ" },
    audience: { en: "Nature lovers, scenic vistas, refreshing outdoor explorations.", ja: "大自然に親しみ、開放的な景色を満喫したい旅行者。" },
    coverage: { en: "National scenic areas, coastal viewpoints, forest trails, and natural geological formations.", ja: "国家風景区、海岸景勝地、森林トレッキングコース、大自然の地形スポット。" },
    exclusion: { en: "Strictly excludes enclosed artificial indoor entertainment venues.", ja: "人工の閉鎖的屋内施設は厳格に除外。" },
    factoryPrinciple: { en: "Avoids enclosed indoor commercial factories; prioritizes open-air scenic spots and ecosystems.", ja: "密閉された屋内工場は避け、開けた自然スポットと生態景観を優先。" }
  },
  local_gourmet: {
    name: { en: "Local Gourmet", ja: "ご当地グルメ巡り" },
    badgeLabel: { en: "Famous Eateries · Markets & Night Markets", ja: "名物行列店・市場＆夜市" },
    audience: { en: "Food enthusiasts seeking authentic regional delicacies, culinary heritage, and souvenirs.", ja: "本場のローカルグルメ、伝統的な味、名物のお土産探しを楽しみたい方。" },
    coverage: { en: "Classic time-honored stalls, local morning markets, lively night markets, agricultural specialties centers.", ja: "行列のできる老舗、伝統市場、賑やかな夜市、農水産物特産品センター。" },
    factoryPrinciple: { en: "Prioritizes food/beverage tasting pavilions, regional specialty workshops, and traditional culinary makers.", ja: "試食・試飲ができる食品工場や、伝統的な食文化を学べる工房を優先。" }
  }
};

// Helper: Get localized theme details
export function getLocalizedThemeDetails(themeKey: string, lang: SupportedLanguage | string = 'zh-TW') {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const item = THEME_DETAILS_LOCALIZED[themeKey];
  if (!item || l === 'zh-TW') return null;
  return {
    name: item.name[l],
    badgeLabel: item.badgeLabel[l],
    audience: item.audience[l],
    coverage: item.coverage[l],
    exclusion: item.exclusion ? item.exclusion[l] : undefined,
    factoryPrinciple: item.factoryPrinciple[l]
  };
}

// Helper: Get localized transport mode (bidirectional)
export function getLocalizedTransport(transport: string, lang: SupportedLanguage | string = 'zh-TW'): string {
  if (!transport) return '';
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const cleanTransport = transport.trim();

  if (TRANSPORT_LOCALIZED_MAP[cleanTransport]) {
    return l === 'zh-TW' ? cleanTransport : TRANSPORT_LOCALIZED_MAP[cleanTransport][l];
  }

  for (const [zhKey, data] of Object.entries(TRANSPORT_LOCALIZED_MAP)) {
    if (data.en.toLowerCase() === cleanTransport.toLowerCase() || data.ja === cleanTransport) {
      return l === 'zh-TW' ? zhKey : data[l];
    }
  }

  for (const [zhKey, data] of Object.entries(TRANSPORT_LOCALIZED_MAP)) {
    if (cleanTransport.includes(zhKey) || zhKey.includes(cleanTransport)) {
      return l === 'zh-TW' ? zhKey : data[l];
    }
    if (cleanTransport.toLowerCase().includes(data.en.toLowerCase())) {
      return l === 'zh-TW' ? zhKey : data[l];
    }
    if (cleanTransport.includes(data.ja)) {
      return l === 'zh-TW' ? zhKey : data[l];
    }
  }

  return cleanTransport;
}

// Helper: Get localized spot name (bidirectional)
export function getLocalizedSpotName(name: string, lang: SupportedLanguage | string = 'zh-TW'): string {
  if (!name) return '';
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const cleanName = name.trim();

  if (COMMON_SPOT_TRANSLATIONS[cleanName]) {
    if (l === 'zh-TW') return cleanName;
    return COMMON_SPOT_TRANSLATIONS[cleanName][l] || cleanName;
  }

  for (const [zhKey, data] of Object.entries(COMMON_SPOT_TRANSLATIONS)) {
    if (data.en.toLowerCase() === cleanName.toLowerCase() || data.ja === cleanName) {
      if (l === 'zh-TW') return zhKey;
      return data[l] || zhKey;
    }
  }

  for (const [zhKey, data] of Object.entries(COMMON_SPOT_TRANSLATIONS)) {
    if (cleanName.includes(zhKey)) {
      if (l === 'zh-TW') return zhKey;
      return data[l] || zhKey;
    }
    if (cleanName.toLowerCase().includes(data.en.toLowerCase())) {
      if (l === 'zh-TW') return zhKey;
      return data[l] || zhKey;
    }
    if (cleanName.includes(data.ja)) {
      if (l === 'zh-TW') return zhKey;
      return data[l] || zhKey;
    }
  }

  return cleanName;
}

// Helper: Localize an entire ItinerarySpot
export function getLocalizedSpot(spot: ItinerarySpot, lang: SupportedLanguage | string = 'zh-TW'): ItinerarySpot {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  if (l === 'zh-TW') return spot;
  const sp = COMMON_SPOT_TRANSLATIONS[spot.name];
  const nextSp = spot.nextSpotName ? COMMON_SPOT_TRANSLATIONS[spot.nextSpotName] : null;

  let localizedDuration = spot.duration;
  if (l === 'en') {
    localizedDuration = spot.duration
      .replace(/約\s*(\d+)\s*小時/g, 'Approx. $1 hrs')
      .replace(/(\d+)\s*小時/g, '$1 hrs')
      .replace(/(\d+)\s*分鐘/g, '$1 mins');
  } else if (l === 'ja') {
    localizedDuration = spot.duration
      .replace(/約/g, '約')
      .replace(/小時/g, '時間')
      .replace(/分鐘/g, '分');
  }

  let localizedOperating = spot.operatingHours;
  if (localizedOperating) {
    if (l === 'en') {
      localizedOperating = localizedOperating
        .replace(/全天開放/g, 'Open 24 Hours')
        .replace(/夜間營業中/g, 'Open in Evening')
        .replace(/夜間點燈/g, 'Night Lighting')
        .replace(/週一休館/g, 'Closed Mondays')
        .replace(/週二休館/g, 'Closed Tuesdays');
    } else if (l === 'ja') {
      localizedOperating = localizedOperating
        .replace(/全天開放/g, '終日開放')
        .replace(/夜間營業中/g, '夜間営業中')
        .replace(/夜間點燈/g, '夜間ライトアップ')
        .replace(/週一休館/g, '月曜休館')
        .replace(/週二休館/g, '火曜休館');
    }
  }

  let localizedPlayStyle = spot.activityPlayStyle;
  if (localizedPlayStyle) {
    if (l === 'en') {
      localizedPlayStyle = localizedPlayStyle
        .replace(/深入走訪(.*?)，漫步欣賞在地生活脈絡與聚落風光，感受慢活步調。/g, 'Explore $1, strolling through local neighborhoods and scenic heritage at a relaxed pace.')
        .replace(/漫步參觀，體驗在地生活與特色風情。/g, 'Stroll through the venue, discovering authentic local heritage.')
        .replace(/手作DIY與親子同樂體驗/g, 'Hands-on DIY craft and family interactive experience')
        .replace(/工藝美學與產業文化導覽見習/g, 'Artisanal craft aesthetics and cultural manufacturing tour')
        .replace(/沈浸大自然風景與森林芬多精/g, 'Immerse in natural scenery and fresh forest atmosphere');
    } else if (l === 'ja') {
      localizedPlayStyle = localizedPlayStyle
        .replace(/深入走訪(.*?)，漫步欣賞在地生活脈絡與聚落風光，感受慢活步調。/g, '$1を訪れ、地域の歴史や風情をゆったりと散策して味わいます。')
        .replace(/漫步參觀，體驗在地生活與特色風情。/g, 'ゆったりと散策し、地域の歴史と独自の風情を体験。')
        .replace(/手作DIY與親子同樂體驗/g, '手作りDIYと家族で楽しむ体験')
        .replace(/工藝美學與產業文化導覽見習/g, '職人技と伝統産業の見学ツアー')
        .replace(/沈浸大自然風景與森林芬多精/g, '豊かな自然景観と森林浴を満喫');
    }
  }

  let localizedFood = spot.foodRecommendation;
  if (localizedFood) {
    if (l === 'en') {
      localizedFood = localizedFood
        .replace(/特色夜市小吃、/g, 'Night market street bites, ')
        .replace(/特色夜市小吃/g, 'Local night market street food')
        .replace(/在地招牌美饌/g, 'Signature local delicacy')
        .replace(/在地排隊經典小吃/g, 'Famous local street snacks')
        .replace(/產地時令手作美食/g, 'Fresh artisanal seasonal specialty');
    } else if (l === 'ja') {
      localizedFood = localizedFood
        .replace(/特色夜市小吃、/g, '名物夜市グルメ、')
        .replace(/特色夜市小吃/g, '名物夜市グルメ')
        .replace(/在地招牌美饌/g, 'ご当地看板グルメ')
        .replace(/在地排隊經典小吃/g, '行列ができる地元名物小吃')
        .replace(/產地時令手作美食/g, '産地直送の手作り旬グルメ');
    }
  }

  let localizedTransportTip = spot.transportTip;
  if (localizedTransportTip) {
    if (l === 'en') {
      localizedTransportTip = localizedTransportTip
        .replace(/約\s*(\d+)\s*分鐘/g, 'approx. $1 mins')
        .replace(/約\s*(\d+)\s*小時/g, 'approx. $1 hrs')
        .replace(/搭乘/g, 'via ')
        .replace(/步行/g, 'Walk ');
    } else if (l === 'ja') {
      localizedTransportTip = localizedTransportTip
        .replace(/約\s*(\d+)\s*分鐘/g, '約$1分')
        .replace(/約\s*(\d+)\s*小時/g, '約$1時間')
        .replace(/搭乘/g, '乗車')
        .replace(/步行/g, '徒歩');
    }
  }

  return {
    ...spot,
    name: sp ? sp[l] : spot.name,
    intro: sp && (l === 'en' ? sp.enIntro : sp.jaIntro) ? (l === 'en' ? sp.enIntro! : sp.jaIntro!) : (localizedPlayStyle || spot.intro),
    activityPlayStyle: localizedPlayStyle || spot.activityPlayStyle,
    foodRecommendation: localizedFood || spot.foodRecommendation,
    transportTip: localizedTransportTip || spot.transportTip,
    duration: localizedDuration,
    operatingHours: localizedOperating,
    nextSpotName: nextSp ? nextSp[l] : spot.nextSpotName
  };
}

// Helper: Localize day item (bidirectional across zh-TW, en, ja)
export function getLocalizedDay(day: ItineraryDay, lang: SupportedLanguage | string = 'zh-TW'): ItineraryDay {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';

  let localizedTitle = day.title;
  if (l === 'en') {
    localizedTitle = day.title
      .replace(/第\s*(\d+)\s*天/g, 'Day $1')
      .replace(/(\d+)日目/g, 'Day $1')
      .replace(/深度探索/g, 'In-Depth Exploration')
      .replace(/探訪/g, 'In-Depth Exploration')
      .replace(/深度精選/g, 'Curated Highlights')
      .replace(/厳選/g, 'Curated Highlights')
      .replace(/：/g, ': ');
  } else if (l === 'ja') {
    localizedTitle = day.title
      .replace(/第\s*(\d+)\s*天/g, '$1日目')
      .replace(/Day\s*(\d+)/gi, '$1日目')
      .replace(/深度探索/g, '探訪')
      .replace(/In-Depth Exploration/gi, '探訪')
      .replace(/深度精選/g, '厳選')
      .replace(/Curated Highlights/gi, '厳選')
      .replace(/：/g, ': ');
  } else {
    localizedTitle = day.title
      .replace(/Day\s*(\d+)/gi, '第 $1 天')
      .replace(/(\d+)日目/g, '第 $1 天')
      .replace(/In-Depth Exploration/gi, '深度探索')
      .replace(/探訪/g, '深度探索')
      .replace(/Curated Highlights/gi, '深度精選')
      .replace(/厳選/g, '深度精選')
      .replace(/:\s*/g, '：');
  }

  const localizedStayHotel = day.stayHotel ? getLocalizedSpotName(day.stayHotel, l) : day.stayHotel;
  let localizedStayRec = day.stayRecommendation;

  if (day.stayRecommendation) {
    let locType = day.stayRecommendation.location_type;
    let propType = day.stayRecommendation.property_type || '';
    let feat = day.stayRecommendation.feature;
    let geoCont = day.stayRecommendation.geographic_continuity || '';

    if (l === 'en') {
      locType = locType
        .replace(/市中心\/車站生活圈/g, 'City Center / Station Area')
        .replace(/市中心/g, 'City Center')
        .replace(/海線/g, 'Coastal Route')
        .replace(/山城/g, 'Mountain Village')
        .replace(/茶鄉/g, 'Tea Country')
        .replace(/古聚落/g, 'Historic Settlement')
        .replace(/溫泉/g, 'Hot Spring District');
      propType = propType
        .replace(/海景特色民宿/g, 'Coastal Boutique B&B')
        .replace(/濱海特色民宿/g, 'Coastal Boutique B&B')
        .replace(/山林溫泉渡假飯店/g, 'Mountain Hot Spring Resort')
        .replace(/山林溫泉渡假旅店/g, 'Mountain Hot Spring Resort')
        .replace(/老宅風格客棧/g, 'Heritage Inn')
        .replace(/老宅改建文旅/g, 'Historic Heritage Hotel')
        .replace(/老宅文創設計旅宿/g, 'Heritage Design Hotel')
        .replace(/設計商旅/g, 'Design Boutique Hotel')
        .replace(/質感設計商旅/g, 'Design Boutique Hotel')
        .replace(/背包客棧/g, 'Backpacker Hostel')
        .replace(/青年背包設計旅社/g, 'Youth Design Hostel');
      feat = feat
        .replace(/緊鄰本日探索生活軸線，動線順暢銜接/g, 'Directly along today’s exploration route with smooth transit.')
        .replace(/享受舒適夜宿時光與在地人文風情/g, 'Enjoying restful evening stays and authentic local charm.');
      geoCont = geoCont
        .replace(/位於本日晚間最後景點車程約 15 分鐘範圍內，地理動線無縫銜接，便於次日一早順向出發。/g, "Located within 15 mins drive from today's final evening stop, seamlessly connecting to tomorrow's route.")
        .replace(/位於市區交通樞紐，便利往返各主要動線。/g, 'Centrally located with direct transit access.');
    } else if (l === 'ja') {
      locType = locType
        .replace(/市中心\/車站生活圈/g, '市内中心部・駅周辺')
        .replace(/市中心/g, '市内中心部')
        .replace(/海線/g, '海岸エリア')
        .replace(/山城/g, '山間エリア')
        .replace(/茶鄉/g, '茶郷エリア')
        .replace(/古聚落/g, '歴史集落エリア')
        .replace(/溫泉/g, '温泉エリア');
      propType = propType
        .replace(/海景特色民宿/g, '海辺の特色民宿')
        .replace(/濱海特色民宿/g, '海辺の特色民宿')
        .replace(/山林溫泉渡假飯店/g, '温泉・山荘リゾート')
        .replace(/山林溫泉渡假旅店/g, '温泉・山荘リゾート')
        .replace(/老宅風格客棧/g, '古民家宿')
        .replace(/老宅改建文旅/g, '歴史建築デザインホテル')
        .replace(/老宅文創設計旅宿/g, '古民家デザインホテル')
        .replace(/設計商旅/g, 'デザインホテル')
        .replace(/質感設計商旅/g, 'デザインホテル')
        .replace(/背包客棧/g, 'バックパッカーホステル')
        .replace(/青年背包設計旅社/g, 'デザインホステル');
      feat = feat
        .replace(/緊鄰本日探索生活軸線，動線順暢銜接/g, '当日の探索ルートに隣接し、移動がスムーズ。')
        .replace(/享受舒適夜宿時光與在地人文風情/g, '快適な宿泊と地域の情緒を満喫。');
      geoCont = geoCont
        .replace(/位於本日晚間最後景點車程約 15 分鐘範圍內，地理動線無縫銜接，便於次日一早順向出發。/g, '本日の最終スポットから車で約15分圏内に位置し、翌日の観光ルートへもスムーズに直結します。')
        .replace(/位於市區交通樞紐，便利往返各主要動線。/g, '交通の要所に位置し、各方面へのアクセス良好。');
    }

    localizedStayRec = {
      ...day.stayRecommendation,
      location_type: locType,
      property_type: propType || day.stayRecommendation.property_type,
      feature: feat,
      geographic_continuity: geoCont || day.stayRecommendation.geographic_continuity
    };
  }

  return {
    ...day,
    title: localizedTitle,
    stayHotel: localizedStayHotel,
    stayRecommendation: localizedStayRec,
    spots: day.spots?.map(s => getLocalizedSpot(s, l)) || []
  };
}

// Helper: Localize full AI itinerary (bidirectional)
export function getLocalizedItinerary(itin: AIItineraryResponse, lang: SupportedLanguage | string = 'zh-TW'): AIItineraryResponse {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';

  let localizedHotelAdvice = itin.hotelAdvice;
  if (localizedHotelAdvice) {
    if (l === 'en') {
      localizedHotelAdvice = localizedHotelAdvice
        .replace(/【住宿場館建議（(.*?)）】：下榻『(.*?)』/g, '[Accommodation Venue Recommendation ($1)]: Reserved at "$2"')
        .replace(/【全程入住同一住宿場館說明（(.*?)）】：全程下榻『(.*?)』/g, '[Trip Consecutive Stay Venue Guide ($1)]: All nights reserved at "$2"')
        .replace(/【全程入住同一住宿場館（(.*?)）】：全程下榻『(.*?)』/g, '[Trip Consecutive Stay Venue Guide ($1)]: All nights reserved at "$2"')
        .replace(/【依每日遊程更換住宿建議（(.*?)）】：/g, '[Flexible Multi-Stay Accommodation Guide ($1)]: ')
        .replace(/【全程入住同一間住宿】：已為您指定入住「(.*?)」（(.*?)），每日各景點行程以該飯店為起訖中心，免去每日打包行李與重新 Check-in 舟車勞頓！/g, '[Single Stay Guarantee]: Reserved at "$1" ($2) for all nights. Daily itineraries radiate from this hotel, saving you from daily luggage repacking!')
        .replace(/【精選深度住宿推薦】：首晚建議入住「(.*?)」（(.*?)），享受舒適夜宿時光與在地晨昏人文風情。/g, '[Curated Accommodation]: First night recommendation at "$1" ($2) for a restful evening and authentic local ambiance.')
        .replace(/【靈活深度住宿推薦】：首晚建議入住「(.*?)」，後續亦可體驗「(.*?)」，依據每日探索軸線入住不同風格特色旅宿！/g, '[Dynamic Multi-Stop Stays]: First night at "$1", followed by "$2", aligning with your daily route!');
    } else if (l === 'ja') {
      localizedHotelAdvice = localizedHotelAdvice
        .replace(/【住宿場館建議（(.*?)）】：下榻『(.*?)』/g, '【おすすめ宿泊施設のご案内（$1）】：「$2」に滞在')
        .replace(/【全程入住同一住宿場館說明（(.*?)）】：全程下榻『(.*?)』/g, '【旅行中同一宿泊施設のご案内（$1）】：全日程「$2」に連泊')
        .replace(/【全程入住同一住宿場館（(.*?)）】：全程下榻『(.*?)』/g, '【旅行中同一宿泊施設のご案内（$1）】：全日程「$2」に連泊')
        .replace(/【依每日遊程更換住宿建議（(.*?)）】：/g, '【日替わりおすすめ宿泊施設（$1）】：')
        .replace(/【全程入住同一間住宿】：已為您指定入住「(.*?)」（(.*?)），每日各景點行程以該飯店為起訖中心，免去每日打包行李與重新 Check-in 舟車勞頓！/g, '【同一施設連泊】：全日程「$1」（$2）に連泊。毎日の荷物移動の負担なく快適に周遊できます！')
        .replace(/【精選深度住宿推薦】：首晚建議入住「(.*?)」（(.*?)），享受舒適夜宿時光與在地晨昏人文風情。/g, '【おすすめ宿泊施設】：初日は「$1」（$2）への宿泊がおすすめ。快適な夜と地域の情緒をお楽しみいただけます。')
        .replace(/【靈活深度住宿推薦】：首晚建議入住「(.*?)」，後續亦可體驗「(.*?)」，依據每日探索軸線入住不同風格特色旅宿！/g, '【おすすめ宿泊施設】：初日は「$1」、後日は「$2」と、日ごとの動線に合わせた特色ある滞在をお楽しみいただけます！');
    }
  }

  let localizedTransitNotice = itin.transitNotice;
  if (localizedTransitNotice) {
    if (l === 'en') {
      localizedTransitNotice = localizedTransitNotice
        .replace(/【離島交通指引】：/g, '[Island Transit Guide]: ')
        .replace(/【交通動線指引】：/g, '[Transit Route Guide]: ')
        .replace(/【(.*?)航空指南】/g, '[$1 Flight Guide] ')
        .replace(/【(.*?)高鐵轉乘指引】/g, '[$1 High-Speed Rail Guide] ')
        .replace(/【(.*?)交通指南】/g, '[$1 Transit Guide] ');
    } else if (l === 'ja') {
      localizedTransitNotice = localizedTransitNotice
        .replace(/【離島交通指引】：/g, '【離島交通案内】：')
        .replace(/【交通動線指引】：/g, '【交通動線案内】：')
        .replace(/【(.*?)航空指南】/g, '【$1航空案内】')
        .replace(/【(.*?)高鐵轉乘指引】/g, '【$1台湾新幹線乗換案内】')
        .replace(/【(.*?)交通指南】/g, '【$1交通案内】');
    }
  }

  let localizedOverview = itin.overview;
  if (localizedOverview) {
    if (l === 'en') {
      localizedOverview = localizedOverview
        .replace(/【(.*?)客製專屬行程】/g, '[$1 Custom Tour] ')
        .replace(/【(.*?) カスタムプラン】/g, '[$1 Custom Tour] ')
        .replace(/專為您依據/g, 'Tailored based on ')
        .replace(/本行程由 AI 即時生成/g, 'Generated by AI in real time')
        .replace(/部分場館有提供冷氣/g, 'air-conditioned venues')
        .replace(/特色夜市美食/g, 'authentic night market street food');
    } else if (l === 'ja') {
      localizedOverview = localizedOverview
        .replace(/【(.*?)客製專屬行程】/g, '【$1 カスタムプラン】')
        .replace(/\[(.*?) Custom Tour\]/g, '【$1 カスタムプラン】')
        .replace(/部分場館有提供冷氣/g, '一部冷房完備の快適施設')
        .replace(/特色夜市美食/g, '名物夜市グルメ');
    } else {
      localizedOverview = localizedOverview
        .replace(/\[(.*?) Custom Tour\]/g, '【$1客製專屬行程】')
        .replace(/【(.*?) カスタムプラン】/g, '【$1客製專屬行程】');
    }
  }

  return {
    ...itin,
    cityName: getLocalizedCityName(itin.cityName, l),
    travelStyle: getLocalizedTheme(itin.travelStyle, l),
    transportMode: getLocalizedTransport(itin.transportMode, l),
    overview: localizedOverview,
    hotelAdvice: localizedHotelAdvice,
    transitNotice: localizedTransitNotice,
    itinerary: itin.itinerary?.map(day => getLocalizedDay(day, l)) || []
  };
}

// Helper: Localize saved full itinerary
export function getLocalizedSavedItinerary(item: SavedItinerary, lang: SupportedLanguage | string = 'zh-TW'): SavedItinerary {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const localizedData = item.data ? getLocalizedItinerary(item.data, l) : item.data;
  return {
    ...item,
    cityName: getLocalizedCityName(item.cityName, l),
    travelStyle: getLocalizedTheme(item.travelStyle, l),
    transportMode: getLocalizedTransport(item.transportMode, l),
    overview: localizedData?.overview || item.overview,
    data: localizedData
  };
}

// Helper: Localize saved single-day itinerary
export function getLocalizedSavedDay(item: SavedDayItinerary, lang: SupportedLanguage | string = 'zh-TW'): SavedDayItinerary {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  const dayObj: ItineraryDay = {
    day: item.dayNumber,
    title: item.dayTitle,
    stayHotel: item.stayHotel,
    spots: item.spots || []
  };
  const localizedDayObj = getLocalizedDay(dayObj, l);
  return {
    ...item,
    cityName: getLocalizedCityName(item.cityName, l),
    dayTitle: localizedDayObj.title,
    stayHotel: localizedDayObj.stayHotel,
    travelStyle: getLocalizedTheme(item.travelStyle, l),
    transportMode: getLocalizedTransport(item.transportMode, l),
    spots: localizedDayObj.spots
  };
}

// Helper: Localize saved spot item
export function getLocalizedSavedSpot(item: SavedSpotItem, lang: SupportedLanguage | string = 'zh-TW'): SavedSpotItem {
  const l = (lang === 'en' || lang === 'ja') ? lang : 'zh-TW';
  return {
    ...item,
    cityName: getLocalizedCityName(item.cityName, l),
    spot: getLocalizedSpot(item.spot, l)
  };
}
