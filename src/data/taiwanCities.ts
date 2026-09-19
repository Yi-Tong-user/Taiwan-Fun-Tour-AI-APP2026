import { CitySpecialty } from '../types';

export const TAIWAN_CITIES: CitySpecialty[] = [
  {
    name: "臺北市",
    lat: 25.0330,
    lng: 121.5654,
    agriculture: "文山包種茶、海芋、繡球花、綠竹筍",
    fishery: "基隆河淡水河鮮魚、大台北近郊漁獲直銷",
    livestock: "士林北投在地放山土雞、優質肉豬",
    description: "臺灣政治、經濟與文化核心樞紐，揉合百年歷史城區與現代摩天大樓，擁有豐富國家級博物館與便利便捷的捷運網絡。",
    region: "北部",
    highlights: [
      { name: "臺北101觀景台", intro: "俯瞰台北盆地壯麗全景的國際級都會地標。", googleMapsQuery: "臺北101觀景台" },
      { name: "國立故宮博物院", intro: "典藏近七十萬件中華歷代皇家珍寶與藝術極品。", googleMapsQuery: "國立故宮博物院" },
      { name: "臺北市立美術館", intro: "臺灣首座現代與當代藝術公立美術館，展覽多元前衛。", googleMapsQuery: "臺北市立美術館" },
      { name: "大稻埕迪化街歷史街區", intro: "巴洛克與閩南紅磚老宅並存，中藥乾貨、布行與文青選物聚落。", googleMapsQuery: "大稻埕迪化街" },
      { name: "陽明山竹子湖海芋繡球花田", intro: "火山地貌與山嵐繚繞的花卉農園，四季賞花踏青名勝。", googleMapsQuery: "竹子湖海芋季" },
      { name: "艋舺龍山寺與剝皮寮歷史街區", intro: "二百八十餘年古剎香火鼎盛，走入清代紅磚騎樓與歷史展覽。", googleMapsQuery: "艋舺龍山寺" },
      { name: "松山文創園區", intro: "昔日松山菸廠活化，結合誠品行旅、設計工坊與巴洛克花園。", googleMapsQuery: "松山文創園區" },
      { name: "象山親山步道六巨石", intro: "遠眺台北101與台北盆地夕陽暮色與璀璨夜景的經典健行步道。", googleMapsQuery: "象山步道" },
      { name: "國立臺灣博物館鐵道部園區", intro: "百年紅磚與半木構造鐵道部古蹟，完整重現臺灣鐵道史。", googleMapsQuery: "國立臺灣博物館鐵道部園區" }
    ],
    tourismFactories: [
      { name: "黑松世界觀光展覽館", intro: "探索臺灣近百年國民飲料文化與復古懷舊展區。", googleMapsQuery: "黑松世界 微風廣場" },
      { name: "台北偶戲館", intro: "皮影戲、布袋戲與傀儡戲互動體驗工藝工坊。", googleMapsQuery: "台北偶戲館" },
      { name: "郭元益糕餅博物館士林館", intro: "傳承百年糕餅文化與宮廷點心親手DIY體驗。", googleMapsQuery: "郭元益糕餅博物館士林館" },
      { name: "新芳春茶行大稻埕茶文化館", intro: "大稻埕市定古蹟茶行，探索精製焙茶古法產線與品茗手作。", googleMapsQuery: "新芳春茶行" },
      { name: "臺灣中油石油探索館", intro: "沉浸式互動科普基地，探索石油地質開採與新能源科技體驗。", googleMapsQuery: "台灣中油石油探索館" },
      { name: "林安泰古厝傳統工藝見學坊", intro: "閩南傳統古建築雕樑畫棟，體驗拓碑、竹編與傳統節慶手工藝。", googleMapsQuery: "林安泰古厝民俗文物館" }
    ],
    accommodations: [
      { name: "台北晶華酒店", type: "五星奢華", description: "中山區精緻住宿，米其林推薦餐廳與名品商圈。", googleMapsQuery: "台北晶華酒店" },
      { name: "北投大地酒店", type: "溫泉度假", description: "白磺溫泉與四層樓高光陰部落藏書閣。", googleMapsQuery: "北投大地酒店" },
      { name: "誠品行旅 Eslite Hotel", type: "人文設計", description: "座落松山文創園區，俯瞰綠茵園區與大巨蛋，每間客房配備經典書籍。", googleMapsQuery: "誠品行旅" },
      { name: "台北君悅酒店", type: "信義旗艦", description: "緊鄰台北101，視野絕佳之戶外綠洲溫水泳池與世界級百匯。", googleMapsQuery: "台北君悅酒店" },
      { name: "北投麗禧溫泉酒店", type: "頂級白磺泉", description: "幽雅路制高點，遠眺丹鳳山群巒，純淨白磺泉與桂花樹景。", googleMapsQuery: "北投麗禧溫泉酒店" }
    ],
    famousFood: ["台北牛肉麵", "小籠湯包", "胡椒餅", "金峰滷肉飯"],
    svgCoords: { x: 645, y: 125 }
  },
  {
    name: "新北市",
    lat: 25.0169,
    lng: 121.4627,
    agriculture: "三芝筊白筍、坪林文山包種茶、雙溪山藥",
    fishery: "萬里蟹（三點蟹/花蟹）、貢寮九孔鮑魚、淡水吻仔魚",
    livestock: "深坑黑毛豬、三峽放山土雞",
    description: "環抱大臺北盆地，坐擁壯麗北海岸岬灣與平溪九份山城，以豐富多元的手工藝陶瓷及傳統老街馳名中外。",
    region: "北部",
    highlights: [
      { name: "九份老街", intro: "依山傍海的黃金山城，石階步道與紅燈籠茶樓如夢似幻。", googleMapsQuery: "九份老街" },
      { name: "淡水老街與漁人碼頭", intro: "觀賞臺灣八景之一淡水夕照，漫步古蹟紅毛城。", googleMapsQuery: "淡水漁人碼頭" },
      { name: "新北市立鶯歌陶瓷博物館", intro: "全臺灣首座以陶瓷為主題的專業博物館，建築極具現代感。", googleMapsQuery: "新北市立鶯歌陶瓷博物館" },
      { name: "野柳地質公園", intro: "世界級海蝕奇岩怪石，馳名國際的女王頭與蕈狀岩。", googleMapsQuery: "野柳地質公園" },
      { name: "十分瀑布公園", intro: "享有『臺灣尼加拉瀑布』美譽的簾幕型壯麗大瀑布。", googleMapsQuery: "十分瀑布" },
      { name: "金瓜石黃金博物館園區", intro: "觸摸220公斤純金金磚，深入本山五坑坑道體驗淘金歲月。", googleMapsQuery: "黃金博物館" },
      { name: "三峽老街與清水祖師廟", intro: "全臺最完整紅磚巴洛克拱廊老街，祖師廟名家精湛石雕木雕。", googleMapsQuery: "三峽老街" },
      { name: "碧潭風景區", intro: "漫步碧潭吊橋，租踩天鵝船泛舟於青山綠水間享受微風。", googleMapsQuery: "碧潭風景區" }
    ],
    tourismFactories: [
      { name: "鶯歌許新旺陶瓷紀念博物館", intro: "百年陶瓷文化演進，提供專業拉坯與馬賽克拼貼手作。", googleMapsQuery: "許新旺陶瓷紀念博物館" },
      { name: "手信坊創意和菓子文化館", intro: "結合日式禪風鳥居造景與和菓子DIY手作觀光工廠。", googleMapsQuery: "手信坊創意和菓子文化館" },
      { name: "吳福洋襪子故事館", intro: "臺灣第一家百年織襪廠，體驗古董手搖織襪機手作樂趣。", googleMapsQuery: "吳福洋襪子故事館" },
      { name: "坪林茶業博物館", intro: "全球罕見綜合茶博物館，四合院閩南建築體驗品茗與泡茶科學。", googleMapsQuery: "坪林茶業博物館" },
      { name: "維格餅家鳳梨酥夢工場", intro: "巨型鳳梨滾輪隧道互動，親手體驗包餡烘烤現烤鳳梨酥。", googleMapsQuery: "維格餅家鳳梨酥夢工場" },
      { name: "聖瑪莉丹麥麵包莊園", intro: "歐風城堡烘焙樂園，穿著小小烘焙師服裝體驗裝飾蛋糕手作。", googleMapsQuery: "聖瑪莉丹麥麵包莊園" },
      { name: "宏洲磁磚觀光工廠", intro: "深入千度窯燒產線，彩繪吸水杯墊與馬賽克磁磚拼貼DIY。", googleMapsQuery: "宏洲磁磚觀光工廠" }
    ],
    accommodations: [
      { name: "福容大飯店 淡水漁人碼頭", type: "海景度假", description: "巨型郵輪造型外觀，坐擁淡水河口第一排夕陽絕景。", googleMapsQuery: "福容大飯店 淡水漁人碼頭" },
      { name: "九份山經民宿", type: "山城美學", description: "面海望山的老街秘境，品茶與享受夜間九份靜謐。", googleMapsQuery: "九份山經民宿" },
      { name: "烏來馥蘭朵渡假酒店", type: "山水湯泉", description: "南勢溪畔頂級溫泉祕境，無干擾私密湯池與生活儀式饗宴。", googleMapsQuery: "烏來馥蘭朵渡假酒店" },
      { name: "板橋凱撒大飯店", type: "新板都會", description: "高空露天無邊際泳池，鄰近新北耶誕城特區與三鐵共構站。", googleMapsQuery: "板橋凱撒大飯店" },
      { name: "福容大飯店 福隆", type: "沙灘Villa", description: "東北角金黃沙灘首排，天然溫泉與獨木舟海洋水上活動。", googleMapsQuery: "福容大飯店 福隆" }
    ],
    famousFood: ["萬里蟹", "深坑臭豆腐", "金山紅心地瓜", "九份手工芋圓"],
    svgCoords: { x: 670, y: 190 }
  },
  {
    name: "基隆市",
    lat: 25.1276,
    lng: 121.7392,
    agriculture: "七堵綠竹筍、基隆山藥、樹梅",
    fishery: "八斗子透抽、鎖管、胭脂蝦、黑口魚",
    livestock: "暖暖在地土雞、優質健康禽產",
    description: "北臺灣最主要的天然深水良港，兼具大航海時代砲台史蹟、迷人天然海岬地質與全臺知名美食廟口聚落。",
    region: "北部",
    highlights: [
      { name: "基隆廟口夜市", intro: "以奠濟宮為核心聚集數百攤數十年歷史傳統老字號美饌。", googleMapsQuery: "基隆廟口夜市" },
      { name: "正濱漁港彩色屋", intro: "宛如威尼斯布拉諾島的繽紛港灣彩色街屋，攝影熱點。", googleMapsQuery: "正濱漁港彩色屋" },
      { name: "和平島地質公園", intro: "千萬年海浪雕琢的萬人堆、千疊敷豆腐岩與天然海水泳池。", googleMapsQuery: "和平島地質公園" },
      { name: "潮境公園與飛天掃帚", intro: "坐擁八斗子海岬無敵海景，巨型裝置藝術與鸚鵡螺溜滑梯。", googleMapsQuery: "潮境公園" },
      { name: "國立海洋科技博物館", intro: "火電廠改建的海科館，展現海洋科學、深海探險與海洋文化。", googleMapsQuery: "國立海洋科技博物館" },
      { name: "望幽谷濱海步道", intro: "綠草如茵的V型山谷，沿稜線石階步道直通湛藍太平洋海角。", googleMapsQuery: "望幽谷" },
      { name: "白米甕砲台", intro: "荷蘭時代即設置的海防要塞，四具巨型涼亭砲座守衛基隆港外海。", googleMapsQuery: "白米甕砲台" }
    ],
    tourismFactories: [
      { name: "一太e衛浴觀光工廠", intro: "亞洲首創衛浴文化與養生文化觀光工廠，提供衛浴文史科普。", googleMapsQuery: "一太e衛浴觀光工廠" },
      { name: "泉利米香傳統文化館", intro: "全臺首創冰凍米香與海鮮米香工藝，體驗傳統爆米香與手作米香磚。", googleMapsQuery: "泉利米香" },
      { name: "國立海科館潮境海洋探索體驗館", intro: "親近海洋科技與潮間帶生態復育，VR深海虛擬潛航體驗。", googleMapsQuery: "潮境海洋中心" },
      { name: "正濱漁港手工碳烤吉古拉見學坊", intro: "傳承數十年炭火手工現烤魚漿吉古拉，親睹師傅俐落手藝與現烤香氣。", googleMapsQuery: "正濱漁港 碳烤吉古拉" }
    ],
    accommodations: [
      { name: "基隆長榮桂冠酒店", type: "港灣景觀", description: "座落基隆港第一排，客房大窗直接俯瞰豪華郵輪與港灣夜景。", googleMapsQuery: "基隆長榮桂冠酒店" },
      { name: "雨天晴民宿", type: "山海風格", description: "依山傍海俯瞰基隆嶼海景，遠離塵囂感受港都海風。", googleMapsQuery: "基隆 民宿" },
      { name: "享海旅店", type: "市區精品", description: "步行五分鐘可抵達基隆廟口，現代簡約舒適設計。", googleMapsQuery: "基隆 旅店" },
      { name: "Hotel BEGINS 倉箱蜜境文旅", type: "綠意設計", description: "隱身八斗子容軒園區，被綠意森林與海科館環抱的靜謐旅宿。", googleMapsQuery: "Hotel BEGINS" }
    ],
    famousFood: ["百年吳家鼎邊趖", "泡泡冰", "營養三明治", "碳烤吉古拉"],
    svgCoords: { x: 740, y: 110 }
  },
  {
    name: "宜蘭縣",
    lat: 24.7021,
    lng: 121.7377,
    agriculture: "三星蔥、溫泉空心菜、金棗、礁溪溫泉番茄",
    fishery: "南方澳鯖魚、櫻花蝦、南方澳現撈鬼頭刀",
    livestock: "宜蘭櫻桃谷品種櫻桃鴨、宜蘭白鵝",
    description: "蘭陽平原沃野千里，背倚雪山山脈、面迎太平洋龜山島，溫泉美人湯與純淨湧泉造就發達的食品與酒廠聚落。",
    region: "東部",
    highlights: [
      { name: "國立傳統藝術中心", intro: "集結全臺傳統民間工藝、傳統戲曲與古意紅磚街道體驗。", googleMapsQuery: "國立傳統藝術中心 宜蘭園區" },
      { name: "礁溪溫泉公園", intro: "免費露天泡腳池與林蔭日式湯屋，體驗無色無味碳酸氫鈉泉。", googleMapsQuery: "礁溪溫泉公園" },
      { name: "冬山河親水公園", intro: "以水為主題的國際級風景區，宜蘭國際童玩藝術節主會場。", googleMapsQuery: "冬山河親水公園" },
      { name: "蘭陽博物館", intro: "單面山幾何前衛幾何斜屋頂建築，展現宜蘭山、平原與海洋生態。", googleMapsQuery: "蘭陽博物館" },
      { name: "羅東林業文化園區", intro: "太平山檜木林鐵集材貯木池，漫步水畔木棧道與老火車頭。", googleMapsQuery: "羅東林業文化園區" },
      { name: "清水地熱公園", intro: "天然地熱溫泉湧泉，體驗竹簍煮溫泉蛋、甜玉米與地熱泡腳池。", googleMapsQuery: "清水地熱公園" },
      { name: "冬山生態綠舟", intro: "神秘河道黑洞洞穴與廣袤濕地水鳥生態，搭電動船探訪仙境。", googleMapsQuery: "冬山生態綠舟" }
    ],
    tourismFactories: [
      { name: "金車噶瑪蘭威士忌酒廠", intro: "世界威士忌冠軍產地，參觀麥芽發酵、蒸餾熟成與專業品評。", googleMapsQuery: "金車噶瑪蘭威士忌酒廠" },
      { name: "奇麗灣珍奶文化館", intro: "全球首座綠建築珍珠奶茶觀光工廠，首創燈泡珍奶手作體驗。", googleMapsQuery: "奇麗灣珍奶文化館" },
      { name: "金車生技水產養殖研發中心", intro: "透明玻璃觀景台俯瞰鯊魚與魟魚悠游，品嚐無毒鮮甜白蝦。", googleMapsQuery: "金車生技水產養殖研發中心" },
      { name: "潭酵天地觀光工廠", intro: "全透明天然純釀造醋製程，設有兩層樓旋轉溜滑梯寓教於樂。", googleMapsQuery: "潭酵天地觀光工廠" },
      { name: "蜡藝蠟筆城堡", intro: "巨型蠟筆造型城堡，親手製作漸層彩色筆與酷炫人體彩繪。", googleMapsQuery: "蜡藝蠟筆城堡" },
      { name: "超品起司烘焙工坊", intro: "起司烘焙甜點巴洛克風文創館，現烤起司蛋糕與手作披薩DIY。", googleMapsQuery: "超品起司烘焙工坊" },
      { name: "橘之鄉蜜餞形象館", intro: "全臺首家蜜餞觀光工廠，金棗果醬DIY與浪漫北歐風巨型木桌椅。", googleMapsQuery: "橘之鄉蜜餞形象館" },
      { name: "亞典菓子工場", intro: "年輪蛋糕與日式銅鑼燒自動化透明烘焙產線，免費咖啡與甜點品嚐。", googleMapsQuery: "亞典菓子工場" }
    ],
    accommodations: [
      { name: "礁溪老爺酒店", type: "露天溫泉", description: "頂級美人湯泉與日式無垢原木禪意美學。", googleMapsQuery: "礁溪老爺酒店" },
      { name: "蘭城晶英酒店", type: "頂級親子", description: "全台馳名紅樓櫻桃霸王烤鴨五吃與芬朵奇堡親子樂園。", googleMapsQuery: "蘭城晶英酒店" },
      { name: "宜蘭力麗威斯汀度假酒店", type: "員山溫泉Villa", description: "員山溫泉首選，獨棟泳池Villa與日式禪風露天風呂。", googleMapsQuery: "宜蘭力麗威斯汀度假酒店" },
      { name: "煙波大飯店蘇澳四季雙泉館", type: "黃金雙泉", description: "高樓層同時擁有冷泉與溫泉黃金雙湯，無邊際泳池凝望蘇澳港。", googleMapsQuery: "煙波大飯店蘇澳四季雙泉館" },
      { name: "村却國際溫泉酒店", type: "羅東地標", description: "羅東制高點雙湯泉房，頂樓高空酒吧俯瞰蘭陽平原百萬夜景。", googleMapsQuery: "村却國際溫泉酒店" }
    ],
    famousFood: ["櫻桃霸王烤鴨", "三星蔥油餅", "宜蘭鴨賞", "諾貝爾奶凍捲"],
    svgCoords: { x: 690, y: 280 }
  },
  {
    name: "桃園市",
    lat: 24.9936,
    lng: 121.3009,
    agriculture: "復興區拉拉山水蜜桃、大溪黑豆干、東方美人茶",
    fishery: "竹圍漁港鮮蚵、永安漁港現撈黑鯛與白鯧",
    livestock: "桃園在地黑毛豬、優質鮮乳乳牛",
    description: "臺灣第一國門航空城，坐擁豐富的埤塘水圳地形、拉拉山神木群與全臺灣密度最高的食品與文具觀光工廠。",
    region: "北部",
    highlights: [
      { name: "大溪老街", intro: "和平老街上保留大量日治大正時代巴洛克雕花牌樓與木器店。", googleMapsQuery: "大溪老街" },
      { name: "Xpark 都會型水生公園", intro: "日本橫濱八景島海外首館，融合科技與自然的新世代水族館。", googleMapsQuery: "Xpark" },
      { name: "角板山行館園區", intro: "復興區北橫入口，賞梅名所與探索神秘地下防空戰備隧道。", googleMapsQuery: "角板山行館" },
      { name: "永安漁港海螺文化體驗館", intro: "純白海螺曲線造型建築，欣賞全台唯一客家漁港美麗落日。", googleMapsQuery: "永安海螺文化體驗館" },
      { name: "龍潭大池與南天宮", intro: "湖心南天宮與吊橋相映，漫步環湖步道遠眺雪山山脈連峰。", googleMapsQuery: "龍潭大池" },
      { name: "慈湖雕塑紀念公園", intro: "湖光山色倒映群山，欣賞儀隊交接與保存完好的百尊歷史雕塑。", googleMapsQuery: "慈湖雕塑紀念公園" },
      { name: "虎頭山環保公園", intro: "桃園市區後花園，居高臨下俯瞰桃園台地開闊夜景與飛機起降。", googleMapsQuery: "虎頭山環保公園" }
    ],
    tourismFactories: [
      { name: "大溪老茶廠", intro: "建於1926年的英倫茶廠風華，極簡藍灰窗櫺與普洱茶磚牆拍照熱點。", googleMapsQuery: "大溪老茶廠" },
      { name: "郭元益糕餅博物館", intro: "臺灣首座綠建築糕餅工廠，傳承傳統漢餅文化與手作鳳梨酥體驗。", googleMapsQuery: "郭元益糕餅博物館" },
      { name: "雄獅文具想像力製造所", intro: "探索色彩美學的森林系美學工廠，客製繽紛彩色筆與手作染布。", googleMapsQuery: "雄獅文具想像力製造所" },
      { name: "可口可樂世界", intro: "紅白色調美式復古汽水王國，探索經典弧形瓶與限量周邊展覽。", googleMapsQuery: "可口可樂世界 桃園" },
      { name: "祥儀機器人夢工廠", intro: "全球唯一機器人主題觀光工廠，體驗格鬥機器人操作與科技互動。", googleMapsQuery: "祥儀機器人夢工廠" },
      { name: "卡司·蒂菈樂園（金格觀光工廠）", intro: "長崎蛋糕蛋型綠建築，手作餅乾屋與長崎蛋糕DIY體驗。", googleMapsQuery: "卡司蒂菈樂園" },
      { name: "太平洋自行車博物館", intro: "收藏全球各式當代與折疊自行車，深入了解世界自行車工藝與試騎。", googleMapsQuery: "太平洋自行車博物館" }
    ],
    accommodations: [
      { name: "桃園大溪笠復威斯汀度假酒店", type: "南洋渡假", description: "棕櫚樹環繞戶外泳池，頂級天夢之床與高爾夫球場美景。", googleMapsQuery: "桃園大溪笠復威斯汀度假酒店" },
      { name: "COZZI Blu 和逸飯店桃園館", type: "海洋飯店", description: "海洋冒險主題，室內連結華泰名品城與高鐵桃園站。", googleMapsQuery: "COZZI Blu 和逸飯店桃園館" },
      { name: "福容大飯店 桃園機場捷運A8", type: "捷運直達", description: "機捷A8站共構，配備黃金溫泉三溫暖與商務尊榮套房。", googleMapsQuery: "福容大飯店 桃園機場捷運A8" },
      { name: "朋趣 Bon Chill 露營車", type: "奢華露營", description: "一泊四食全包式天成飯店集團奢華露營車，結合星空影院。", googleMapsQuery: "朋趣 Bon Chill" },
      { name: "石門水庫福華渡假飯店", type: "湖景休閒", description: "緊鄰石門水庫山嵐湖水，新整修親子歡樂互動遊樂區。", googleMapsQuery: "石門水庫福華渡假飯店" }
    ],
    famousFood: ["大溪烏豆干", "拉拉山水蜜桃", "龍岡忠貞米干", "石門活魚多吃"],
    svgCoords: { x: 575, y: 160 }
  },
  {
    name: "新竹市",
    lat: 24.8138,
    lng: 120.9675,
    agriculture: "香山海山柑桔、茶花產銷班盆栽",
    fishery: "南寮漁港現撈透抽、花枝、鯧魚",
    livestock: "新竹在地黑毛豬、產銷履歷肉豬",
    description: "臺灣科技之都與百年風城，建城超過三百年，城隍廟古蹟小吃林立，並擁有全球聞名的玻璃與循環綠能工藝技術。",
    region: "北部",
    highlights: [
      { name: "新竹都城隍廟", intro: "臺灣位階最高的城隍廟，周圍聚集百年字號摃丸與米粉小吃。", googleMapsQuery: "新竹都城隍廟" },
      { name: "南寮漁港十七公里海岸線", intro: "沿著臺灣海峽騎行自行車，途經海天一線觀景區與香山賞蟹步道。", googleMapsQuery: "南寮漁港" },
      { name: "新竹市玻璃工藝博物館", intro: "結合麗池公園日式房舍，展示吹製、實心雕塑等晶瑩玻璃藝術。", googleMapsQuery: "新竹市玻璃工藝博物館" },
      { name: "新竹市立動物園", intro: "全臺灣原址現存最古老動物園，打造無欄杆式友善動物棲地生態。", googleMapsQuery: "新竹市立動物園" },
      { name: "辛志平校長故居", intro: "市定古蹟日式木構官舍，庭園林蔭幽靜，體驗精品手沖咖啡甜點。", googleMapsQuery: "辛志平校長故居" },
      { name: "新竹東門城迎曦門", intro: "建於清道光年間古城門，周邊下沉式親水廣場連結護城河步道。", googleMapsQuery: "新竹東門城" }
    ],
    tourismFactories: [
      { name: "春池綠能玻璃觀光工廠", intro: "全球領先廢棄玻璃循環永續工廠，近距離目睹師傅1400度高溫吹製。", googleMapsQuery: "春池綠能玻璃觀光工廠" },
      { name: "新竹市玻璃工藝博物館", intro: "展示日治以來吹製、實心雕塑等玻璃藝術，提供工藝吹玻璃手作體驗。", googleMapsQuery: "新竹市玻璃工藝博物館" },
      { name: "福源花生醬手作工坊", intro: "新竹一甲子老字號花生醬，體驗古法炒焙花生與濃醇花生醬研磨填裝。", googleMapsQuery: "新竹 福源花生醬" },
      { name: "台灣纖維工藝手作館", intro: "傳承新竹傳統編織、染織與天然植物纖維工藝創作體驗。", googleMapsQuery: "新竹 工藝館" }
    ],
    accommodations: [
      { name: "新竹國賓大飯店", type: "五星都會", description: "新竹市中心高樓景觀，採光挑高十二層空中中庭花園。", googleMapsQuery: "新竹國賓大飯店" },
      { name: "新竹老爺酒店", type: "星級舒適", description: "鄰近新竹科學園區與高速公路，商務休閒設備一應俱全。", googleMapsQuery: "新竹老爺酒店" },
      { name: "煙波大飯店新竹湖濱館", type: "全台十大親子", description: "坐落青草湖畔，擁有2300坪卡樂次元全天候室內兒童樂園。", googleMapsQuery: "煙波大飯店新竹湖濱館" },
      { name: "新竹福華大飯店", type: "市心經典", description: "座落舊城區，步行即可漫遊城隍廟與護城河文藝商圈。", googleMapsQuery: "新竹福華大飯店" }
    ],
    famousFood: ["新竹純米米粉", "手工爆汁摃丸", "城隍廟水潤餅", "黑貓包"],
    svgCoords: { x: 515, y: 200 }
  },
  {
    name: "新竹縣",
    lat: 24.8387,
    lng: 121.0177,
    agriculture: "北埔東方美人茶（膨風茶）、尖石甜柿、新埔柿餅",
    fishery: "竹北烏魚子、拔子窟近海海鮮",
    livestock: "新竹客家黑毛豬、跑山土雞",
    description: "客家風情濃厚，層巒疊嶂中蘊藏泰雅部落秘境司馬庫斯，客家擂茶與秋季新埔曬柿餅是全臺代表性文化風景。",
    region: "北部",
    highlights: [
      { name: "北埔老街", intro: "古蹟密度全台最高老街之一，品嚐道地客家擂茶與柿餅。", googleMapsQuery: "北埔老街" },
      { name: "六福村主題遊樂園", intro: "結合非洲野生動物園與驚險雲霄飛車的綜合型主題樂園。", googleMapsQuery: "六福村主題遊樂園" },
      { name: "新埔味衛佳柿餅教育農園", intro: "秋天限定的金黃曬柿餅壯麗盛況，三合院古厝前拍照勝地。", googleMapsQuery: "味衛佳柿餅教育農園" },
      { name: "內灣老街與內灣吊橋", intro: "鐵道支線終點站，欣賞劉興欽漫畫阿三哥與大嬸婆造景。", googleMapsQuery: "內灣老街" },
      { name: "小森之歌（綠世界生態農場）", intro: "落羽松林大道與廣大羊駝放牧草坪，親近動植物的自然綠洲。", googleMapsQuery: "綠世界生態農場" },
      { name: "司馬庫斯上帝的部落", intro: "深山泰雅部落，探索千年巨木紅檜巨木群神聖步道。", googleMapsQuery: "司馬庫斯" }
    ],
    tourismFactories: [
      { name: "吉比鮮釀識酒館", intro: "探索精釀啤酒手工釀造技術與冷藏鮮送的現代精釀文化。", googleMapsQuery: "吉比鮮釀識酒館" },
      { name: "濟生Beauty新竹觀光工廠", intro: "結合健康醫學、保養品研發與趣味健康檢測的互動園區。", googleMapsQuery: "濟生Beauty新竹觀光工廠" },
      { name: "華夏玻璃水晶故事館", intro: "全臺最大日用玻璃容器製造廠，展示水晶玻璃吹製與手作雕刻。", googleMapsQuery: "華夏玻璃" },
      { name: "湖口老街客家手作藍染坊", intro: "漫步紅磚老街，親手體驗天然植物客家藍染與拓印工藝。", googleMapsQuery: "湖口老街 藍染" },
      { name: "隆源餅行客家糕餅工坊", intro: "傳承百年北埔番薯餅與芋仔餅古法手工揉製見學坊。", googleMapsQuery: "隆源餅行" }
    ],
    accommodations: [
      { name: "新竹豐邑喜來登大飯店", type: "旗艦五星", description: "竹北高鐵特區宏偉地標，設有波波叢林大型室內兒童遊戲區。", googleMapsQuery: "新竹豐邑喜來登大飯店" },
      { name: "關西六福莊生態度假旅館", type: "動物生態", description: "亞洲唯一生態度假飯店，打開窗戶即見白犀牛與長頸鹿散步。", googleMapsQuery: "關西六福莊生態度假旅館" },
      { name: "新竹安捷國際酒店", type: "潛艇美學", description: "高鐵新竹站前純白潛水艇流線外型，高空景觀客房。", googleMapsQuery: "新竹安捷國際酒店" },
      { name: "泰雅巴萊部落民宿", type: "尖石部落", description: "尖石高山山嵐繚繞，體驗泰雅獵人文化與原民烤肉饗宴。", googleMapsQuery: "尖石 民宿" }
    ],
    famousFood: ["北埔客家擂茶", "客家鹹豬肉", "內灣野薑花粽", "新埔日曬柿餅"],
    svgCoords: { x: 550, y: 225 }
  },
  {
    name: "苗栗縣",
    lat: 24.5601,
    lng: 120.8214,
    agriculture: "大湖草莓、三灣水梨、公館紅棗、卓蘭巨峰葡萄",
    fishery: "後龍龍鳳漁港花枝、白帶魚、海瓜子",
    livestock: "苗栗黑豬肉、放牧產銷土雞",
    description: "國際雙慢城（三義、南庄）認證，群山環抱、木雕產業鼎盛，冬季草莓香甜醉人，泰安溫泉更名列臺灣名湯。",
    region: "中部",
    highlights: [
      { name: "舊山線鐵道自行車", intro: "騎乘電動鐵道車穿梭勝興車站與魚藤坪斷橋，俯瞰龍騰斷橋殘垣。", googleMapsQuery: "舊山線鐵道自行車" },
      { name: "三義木雕博物館", intro: "全臺灣唯一以木雕藝術為主題的公立博物館，館藏精湛大師手藝。", googleMapsQuery: "三義木雕博物館" },
      { name: "大湖草莓文化館（大湖酒莊）", intro: "大湖草莓王國心臟，品嚐草莓香腸、草莓貢丸與草莓淡酒。", googleMapsQuery: "大湖草莓文化館" },
      { name: "南庄老街桂花巷", intro: "客家山城狹窄石梯巷弄，品嚐冰鎮桂花湯圓與道地客家手工粄食。", googleMapsQuery: "南庄老街" },
      { name: "飛牛牧場", intro: "綠草如茵歐風大牧場，餵食小牛喝奶與品嚐白布丁甜點。", googleMapsQuery: "飛牛牧場" },
      { name: "後龍過港百年鐵道隧道群", intro: "紅磚圓拱隧道打上七彩幻麗光影，漫步散心拍照絕景。", googleMapsQuery: "後龍過港隧道" },
      { name: "功維敘百年七彩鐵道隧道", intro: "日治明治時代紅磚鐵道隧道，配備炫彩LED光雕與古典音樂。", googleMapsQuery: "功維敘隧道" }
    ],
    tourismFactories: [
      { name: "臺鹽通霄觀光園區", intro: "全臺唯一食用鹽產地，體驗溫泉海洋足浴溪與鹽宗公仔DIY。", googleMapsQuery: "臺鹽通霄觀光園區" },
      { name: "雅聞七里香玫瑰森林", intro: "頭屋山林間萬株珍稀玫瑰盛開，媲美歐洲莊園的浪漫步道。", googleMapsQuery: "雅聞七里香玫瑰森林" },
      { name: "三義一甲子木雕觀光工廠", intro: "近距離欣賞神斧木雕藝術與木藝生活工坊。", googleMapsQuery: "三義木雕街" },
      { name: "金良興觀光磚廠（灣麗磚瓦文物館）", intro: "全臺首座紅磚觀光工廠，體驗傳統紅磚彩繪與砌磚雕刻。", googleMapsQuery: "金良興觀光磚廠" },
      { name: "花露休閒農場香草精油工坊", intro: "滿山繡球花與薰衣草花海，體驗天然香草精油萃取與蒸餾手作。", googleMapsQuery: "花露農場" },
      { name: "裕隆車之道體驗中心", intro: "全臺首座汽車觀光工廠，走入現代化汽車智慧裝配產線工藝巡禮。", googleMapsQuery: "車之道體驗中心" }
    ],
    accommodations: [
      { name: "泰安觀止溫泉會館", type: "山林溫泉", description: "清水模與鐵木共構的靜謐美學，無邊際山景露天湯泉享受。", googleMapsQuery: "泰安觀止溫泉會館" },
      { name: "南庄雲水度假森林", type: "落羽松秘境", description: "湖畔落羽松倒影如夢，群山環抱的美人湯露天風呂莊園。", googleMapsQuery: "南庄雲水度假森林" },
      { name: "享沐時光莊園渡假酒店", type: "苑裡溫泉", description: "苑裡頂級美人湯泉，700坪露天風呂水療與戶外泳池。", googleMapsQuery: "享沐時光莊園渡假酒店" },
      { name: "卓也小屋度假園區", type: "藍染山居", description: "穀倉造型特色客房，被大自然綠意環抱，體驗道地客家藍染。", googleMapsQuery: "卓也小屋" }
    ],
    famousFood: ["大湖新鮮草莓", "苗栗客家小炒", "三義客家粄條", "公館紅棗養生餐"],
    svgCoords: { x: 495, y: 285 }
  },
  {
    name: "臺中市",
    lat: 24.1477,
    lng: 120.6736,
    agriculture: "和平大雪山高山甜柿、新社黑早香菇、東勢高接梨",
    fishery: "梧棲漁港鮮撈小管、白鯧、烏魚子",
    livestock: "外埔優質健康豬、產銷純牛乳",
    description: "臺灣第二大都會區，氣候宜人四季如春，擁有極具前衛張力的歌劇院建築、熱鬧逢甲商圈與壯麗高美濕地風車大道。",
    region: "中部",
    highlights: [
      { name: "臺中國家歌劇院", intro: "伊東豊雄大師設計無樑柱曲牆建築，被譽為世界第九大新地標。", googleMapsQuery: "臺中國家歌劇院" },
      { name: "國立自然科學博物館", intro: "全臺灣規模最龐大科普殿堂，恐龍展廳與太空劇場寓教於樂。", googleMapsQuery: "國立自然科學博物館" },
      { name: "高美濕地景觀木棧道", intro: "夕陽西沉時巨大風車倒映在退潮灘地，被譽為臺灣版天空之鏡。", googleMapsQuery: "高美濕地" },
      { name: "宮原眼科", intro: "日治時期紅磚眼科醫院化身復古英倫圖書館，知名冰淇淋名店。", googleMapsQuery: "宮原眼科" },
      { name: "審計新村文創聚落", intro: "早期省府時期單身宿舍轉型青年文創基地，特色咖啡手作攤位聚集。", googleMapsQuery: "審計新村" },
      { name: "彩虹眷村", intro: "彩虹爺爺筆下鮮豔飽滿的純樸畫作，享譽國際的街頭壁畫傳奇。", googleMapsQuery: "彩虹眷村" },
      { name: "武陵農場與新社花海", intro: "春季櫻花海與秋季楓葉銀杏盛開，四季景致各異其趣。", googleMapsQuery: "武陵農場" }
    ],
    tourismFactories: [
      { name: "寶熊漁樂碼頭", intro: "全球首座釣具觀光工廠，體驗巨無霸釣魚機與3D海洋劇場。", googleMapsQuery: "寶熊漁樂碼頭" },
      { name: "台灣味噌釀造文化館", intro: "百年古法釀造味噌與紅糟，手作味噌封缸帶回家熟成。", googleMapsQuery: "台灣味噌釀造文化館" },
      { name: "伊莎貝爾數位烘焙體驗館", intro: "影音互動體感遊戲，品嚐現烤法式香榭起士與手作餅乾。", googleMapsQuery: "伊莎貝爾數位烘焙體驗館" },
      { name: "張連昌薩克斯風博物館", intro: "探索后里薩克斯風手工製程，聆聽悠揚銅管樂音。", googleMapsQuery: "張連昌薩克斯風博物館" },
      { name: "阿聰師糕餅隨意館（芋頭酥觀光工廠）", intro: "台灣芋頭酥之父創辦，親手捏製芋頭酥與芋頭文創生態見學。", googleMapsQuery: "阿聰師芋頭文化館" },
      { name: "鞋寶觀光工廠", intro: "台灣製鞋產業文化重鎮，手作彩繪勃肯鞋與客製帆布提袋。", googleMapsQuery: "鞋寶觀光工廠" },
      { name: "木匠兄妹木工房", intro: "傳承台中后里木藝，打造文青木作玩具、木質生活小物體驗。", googleMapsQuery: "木匠兄妹木工房" }
    ],
    accommodations: [
      { name: "裕元花園酒店", type: "五星都會", description: "台中西屯大道指標五星，挑高奢華客房與恆溫室內水療池。", googleMapsQuery: "裕元花園酒店" },
      { name: "林酒店 The Lin Hotel", type: "現代奢華", description: "緊鄰七期秋紅谷，百匯自助餐馳名、空間奢華大器。", googleMapsQuery: "林酒店 The Lin Hotel" },
      { name: "日月千禧酒店", type: "政經核心", description: "台中市政中心精華地段，頂樓極炙牛排館眺望七期天際線。", googleMapsQuery: "台中日月千禧酒店" },
      { name: "虹夕諾雅 谷關 HOSHINOYA Guguan", type: "頂級日式溫泉", description: "星野集團在台首座奢華溫泉度假村，高山峽谷林泉相映。", googleMapsQuery: "虹夕諾雅 谷關" },
      { name: "逢甲商旅 La Vida Hotel", type: "商圈首選", description: "步行三分鐘直抵逢甲夜市，原木北歐風格鬧中取靜。", googleMapsQuery: "逢甲商旅" }
    ],
    famousFood: ["正宗台中太陽餅", "逢甲夜市小吃", "大甲芋頭酥", "清水米糕"],
    svgCoords: { x: 450, y: 355 }
  },
  {
    name: "彰化縣",
    lat: 24.0518,
    lng: 120.5161,
    agriculture: "溪湖巨峰葡萄、社頭珍珠芭樂、田尾公路花園花卉",
    fishery: "王功芳苑潮間帶文蛤、蚵仔（牡蠣）",
    livestock: "彰化健康豬、二林蛋雞產銷班優質雞蛋",
    description: "一府二鹿三艋舺，彰化建縣三百年，鹿港小鎮古蹟林立，擁有全臺唯一活體國定古蹟扇形車庫與臺灣最大玻璃藝術工坊。",
    region: "中部",
    highlights: [
      { name: "鹿港老街與鹿港天后宮", intro: "國定古蹟媽祖殿堂，穿梭摸乳巷、九曲巷與品嚐鹿港糕點。", googleMapsQuery: "鹿港天后宮" },
      { name: "國定古蹟彰化扇形車庫", intro: "全臺灣僅存十二股放射狀軌道動態蒸氣火車頭調度旋轉盤。", googleMapsQuery: "彰化扇形車庫" },
      { name: "八卦山大佛風景區", intro: "彰化最具代表性精神地標，走訪天空步道遠眺彰化平原景觀。", googleMapsQuery: "八卦山大佛風景區" },
      { name: "田尾公路花園", intro: "全台最大花卉苗木集散地，租乘四輪電動敞篷車漫遊百家園藝花坊。", googleMapsQuery: "田尾公路花園" },
      { name: "芳苑海空步道與王功漁港", intro: "走進紅樹林潮間帶觀賞招潮蟹彈塗魚，搭乘海牛車出海採蚵。", googleMapsQuery: "芳苑海空步道" },
      { name: "成美文化園", intro: "百年閩客合院成美公堂與枯山水落羽松庭園，媲美日本兼六園。", googleMapsQuery: "成美文化園" }
    ],
    tourismFactories: [
      { name: "台灣玻璃館", intro: "展示世界首創全玻璃打造之護聖宮媽祖廟與晶瑩黃金隧道。", googleMapsQuery: "台灣玻璃館" },
      { name: "台灣優格餅乾學院", intro: "如哈利波特霍格華茲魔法城堡外觀，體驗魔法烘焙餅乾DIY。", googleMapsQuery: "台灣優格餅乾學院" },
      { name: "白蘭氏健康博物館", intro: "全亞洲最大雞精瓶外觀造型，透明參觀步道見證現代萃取製程。", googleMapsQuery: "白蘭氏健康博物館" },
      { name: "緞帶王觀光工廠", intro: "彩虹織帶隧道、古董紡織機展示與親手編織特色拉花緞帶。", googleMapsQuery: "緞帶王觀光工廠" },
      { name: "卷木森活館", intro: "全臺唯一環保木皮觀光工廠，漫步童話精靈森林與手作木質動物公仔。", googleMapsQuery: "卷木森活館" },
      { name: "華新MASK創意生活館", intro: "亞洲首座鑽石型口罩觀光工廠，探索防護口罩科技與彩繪DIY。", googleMapsQuery: "華新口罩觀光工廠" },
      { name: "愛玩色創意館", intro: "色彩魔術師體驗館，探索顏料調色魔法與神奇彩繪膠手作。", googleMapsQuery: "愛玩色創意館" }
    ],
    accommodations: [
      { name: "鹿港永樂酒店", type: "精品人文", description: "SLH全球奢華精品酒店，早餐供應鹿港阿振肉包等道地名產。", googleMapsQuery: "鹿港永樂酒店" },
      { name: "澄悅酒店", type: "日式沉穩", description: "座落鹿港老街外緣，高樓景觀酒吧鳥瞰鹿港古都夜色。", googleMapsQuery: "澄悅酒店" },
      { name: "福華飯店 彰化福泰商務飯店", type: "市心首選", description: "彰化市中心現代商務星級飯店，近彰化火車站與扇形車庫。", googleMapsQuery: "彰化福泰商務飯店" },
      { name: "鹿港澄悅商旅", type: "文青美學", description: "鄰近鹿港老街古蹟聚落，設計感十足且提供單車租借服務。", googleMapsQuery: "鹿港澄悅商旅" }
    ],
    famousFood: ["彰化阿璋肉圓", "阿泉爌肉飯", "鹿港牛舌餅", "王功現炸蚵嗲"],
    svgCoords: { x: 385, y: 430 }
  },
  {
    name: "南投縣",
    lat: 23.9609,
    lng: 120.9718,
    agriculture: "鹿谷凍頂烏龍茶、信義青梅、埔里百香果、魚池紅玉紅茶",
    fishery: "日月潭水庫總統魚（曲腰魚）、奇力魚",
    livestock: "仁愛鄉放牧黑豬、信義山林放山走地雞",
    description: "全臺灣唯一不靠海的內陸山岳縣，玉山、日月潭與清境農場名冠天下，高山茶葉與可可巧克力工藝傲視全球。",
    region: "中部",
    highlights: [
      { name: "日月潭國家風景區水社碼頭", intro: "獲CNN評選全球最美自行車道之一，搭乘遊艇環湖參拜玄光寺。", googleMapsQuery: "日月潭國家風景區" },
      { name: "清境農場青青草原", intro: "高海拔綿延綠草坡，欣賞紐西蘭毛利綿羊脫毛秀與馬術特技。", googleMapsQuery: "清境農場青青草原" },
      { name: "溪頭自然教育園區", intro: "高聳入雲柳杉紅檜林，漫步空中走廊吸取極致森林芬多精。", googleMapsQuery: "溪頭自然教育園區" },
      { name: "車埕木業展示館與貯木池", intro: "隱身水里山谷的最後火車站，舊廠房改建木工樂園與落羽松池。", googleMapsQuery: "車埕木業展示館" },
      { name: "九族文化村與日月潭纜車", intro: "原住民族傳統部落文化展示與空中纜車俯瞰日月潭壯麗碧波。", googleMapsQuery: "九族文化村" },
      { name: "杉林溪森林生態渡假園區", intro: "松瀧岩瀑布石窟壯觀磅礡，四季鬱金香、繡球花與水杉林景致。", googleMapsQuery: "杉林溪森林生態渡假園區" }
    ],
    tourismFactories: [
      { name: "Cona's妮娜巧克力夢想城堡", intro: "埔里霍格華茲歐風城堡，世界巧克力大賽金牌產地與變裝體驗。", googleMapsQuery: "Cona's妮娜巧克力夢想城堡" },
      { name: "水里蛇窯陶藝文化園區", intro: "臺灣最古老柴燒木柴蛇窯，捏陶拉坯與品嚐蛇窯窯烤麵包咖啡。", googleMapsQuery: "水里蛇窯陶藝文化園區" },
      { name: "埔里廣興紙寮手作紙觀光工廠", intro: "傳承手工造紙古法，親手拓印並製作屬於自己的菜倫紙。", googleMapsQuery: "廣興紙寮" },
      { name: "HOHOCHA喝喝茶台灣香日月潭紅茶廠", intro: "奉茶奉蛋日式茶屋體驗，透明化製茶五大工法產線導覽。", googleMapsQuery: "HOHOCHA喝喝茶" },
      { name: "采棉居寢飾文化館", intro: "臺灣第一家以寢飾為主題的觀光工廠，體驗手工抱枕與紓壓香草枕DIY。", googleMapsQuery: "采棉居寢飾文化館" },
      { name: "本草自然生技園區", intro: "以左手香等天然本草為主題的綠建築工廠，體驗純天然手工皂製作。", googleMapsQuery: "本草自然生技園區" },
      { name: "造紙龍手創館", intro: "繽紛立體萬捲紙藝，展示外銷全球的特殊紙張與手作紙公仔。", googleMapsQuery: "造紙龍手創館" }
    ],
    accommodations: [
      { name: "日月潭涵碧樓酒店", type: "頂級湖景", description: "極簡禪風大師巨作，無邊際鏡面泳池飽覽日月潭清晨暮色。", googleMapsQuery: "日月潭涵碧樓酒店" },
      { name: "清境老英格蘭莊園", type: "都鐸城堡", description: "彷彿置身英國古典貴族莊園，頂級音響客房與雲海相伴。", googleMapsQuery: "清境老英格蘭莊園" },
      { name: "雲品溫泉酒店日月潭", type: "湖景溫泉", description: "日月潭首家天然碳酸氫鈉溫泉，全客房配備觀景陽台與私密湯池。", googleMapsQuery: "雲品溫泉酒店" },
      { name: "溪頭米堤大飯店", type: "法式宮廷森林", description: "深處竹林雲海中的古典歐洲宮廷城堡，負離子瀑布環繞。", googleMapsQuery: "溪頭米堤大飯店" }
    ],
    famousFood: ["鹿谷凍頂烏龍茶", "日月潭阿薩姆紅茶蛋捲", "信義脆梅", "竹山手工番薯包"],
    svgCoords: { x: 500, y: 470 }
  },
  {
    name: "雲林縣",
    lat: 23.7092,
    lng: 120.4313,
    agriculture: "西螺溫室蔬菜、古坑台灣咖啡、莿桐大蒜、斗六文旦",
    fishery: "口湖鰻魚、金目鱸魚、台西文蛤",
    livestock: "雲林快樂豬、麥寮產銷黑豬、優質肉雞",
    description: "臺灣農業最大生產首都，西螺古釀造醬油陶甕飄香百年，北港朝天宮更是全臺媽祖信仰重鎮，布袋戲文化底蘊深厚。",
    region: "中部",
    highlights: [
      { name: "北港朝天宮", intro: "國定古蹟媽祖信仰總本山，參拜祈福並品嚐廟前百年鴨肉羹。", googleMapsQuery: "北港朝天宮" },
      { name: "西螺延平老街與西螺大橋", intro: "巴洛克紅磚洋樓街景與昔日遠東第一大虹橋西螺大橋壯景。", googleMapsQuery: "西螺延平老街" },
      { name: "古坑綠色隧道公園", intro: "兩旁濃密芒果老樹夾道，假日特色小農市集與咖啡香氣蔓延。", googleMapsQuery: "古坑綠色隧道公園" },
      { name: "雲林布袋戲館（虎尾郡役所）", intro: "和洋折衷紅磚古蹟，展出黃海岱國寶大師金光布袋戲偶珍藏。", googleMapsQuery: "雲林布袋戲館" },
      { name: "虎尾鐵橋與糖廠日式宿舍群", intro: "百年鋼桁架花樑鐵橋跨越虎尾溪，品嚐古早味紅豆酵母冰棒。", googleMapsQuery: "虎尾鐵橋" },
      { name: "澄霖沉香味道森林館", intro: "台版兼六園澄霖日式枯山水庭園，愛心落羽松池與沉香科普。", googleMapsQuery: "澄霖沉香味道森林館" }
    ],
    tourismFactories: [
      { name: "良作工場農業文創館", intro: "究好豬旗艦文創園區，解說現代豬肉科學分切與美味豬排餐。", googleMapsQuery: "良作工場農業文創館" },
      { name: "西螺丸莊醬油觀光工廠", intro: "展示黑豆純釀醬油陶甕日曬場，親手體驗傳統黑豆蔭油壺DIY。", googleMapsQuery: "丸莊醬油觀光工廠" },
      { name: "興隆毛巾觀光工廠", intro: "臺灣第一家蛋糕毛巾創始工廠，以假亂真的毛巾甜點造型體驗。", googleMapsQuery: "興隆毛巾觀光工廠" },
      { name: "塔吉特千層蛋糕大使館", intro: "全臺首座千層蛋糕觀光工廠，體驗千層蛋皮彩繪烘焙DIY。", googleMapsQuery: "塔吉特千層蛋糕大使館" },
      { name: "朝露魚舖觀光工廠", intro: "全臺首座水產加工觀光工廠，探索-18度急速冷凍水產與手作彩繪DIY。", googleMapsQuery: "朝露魚舖觀光工廠" },
      { name: "福祿壽觀光酒廠", intro: "探索臺灣古法高粱酒釀造，參觀百年老酒窖與酒香品評。", googleMapsQuery: "福祿壽觀光酒廠" }
    ],
    accommodations: [
      { name: "北港朝聖酒店", type: "宮廟美學", description: "正對朝天宮，融合新東方奢華與宗教藝術美學。", googleMapsQuery: "北港朝聖酒店" },
      { name: "劍湖山渡假大飯店", type: "度假樂園", description: "古坑山巒景觀，直通主題樂園與摩天輪夜景。", googleMapsQuery: "劍湖山渡假大飯店" },
      { name: "三好國際酒店", type: "斗六地標", description: "斗六棒球場旁指標四星，設有高空景觀蒸氣浴與露天泳池。", googleMapsQuery: "三好國際酒店" },
      { name: "虎尾春秋文創設計旅店", type: "布袋戲主題", description: "全臺首創布袋戲偶主題設計文旅，工業風與生旦淨末丑元素。", googleMapsQuery: "虎尾春秋" }
    ],
    famousFood: ["古坑台灣黑咖啡", "西螺甕底手工醬油", "北港生炒鴨肉羹", "口湖頂級蒲燒鰻"],
    svgCoords: { x: 360, y: 520 }
  },
  {
    name: "嘉義市",
    lat: 23.4800,
    lng: 120.4491,
    agriculture: "精緻小農苦茶油、甜玉米、香瓜",
    fishery: "布袋鮮蚵與沿海魚獲直銷特快車",
    livestock: "嘉義正宗火雞肉、產銷黑羽土雞",
    description: "昔日阿里山木材集散之『木都』，全臺火雞肉飯發源地，擁有全臺最大日式檜木官舍群與新落成之嘉義市立美術館。",
    region: "南部",
    highlights: [
      { name: "嘉義市立美術館", intro: "古蹟菸酒公賣局嘉義分局修復新生，新舊建築交織的木都美學殿堂。", googleMapsQuery: "嘉義市立美術館" },
      { name: "檜意森活村", intro: "全臺灣保存最完整之日式檜木官舍建築群，宛如穿越時空抵達京都。", googleMapsQuery: "檜意森活村" },
      { name: "阿里山森林鐵路車庫園區", intro: "停放多輛珍貴蒸氣老火車頭與退役柴油機車，鐵道迷必訪樂園。", googleMapsQuery: "阿里山森林鐵路車庫園區" },
      { name: "文化路觀光夜市", intro: "長達數百公尺的排隊美食天堂，砂鍋魚頭與火雞肉飯匯集地。", googleMapsQuery: "文化路夜市" },
      { name: "森林之歌裝置藝術", intro: "使用木材、鐵軌與黃藤打造巨型蛋形穹頂，夜間光影極為迷人。", googleMapsQuery: "森林之歌" },
      { name: "嘉義市立博物館", intro: "展示嘉義地質化石、交趾陶工藝與木都歷史的科普藝文館。", googleMapsQuery: "嘉義市立博物館" },
      { name: "蘭潭風景區月影潭心", intro: "環潭湖畔鋁片編織鳥巢裝置藝術，搭配夜間水舞噴泉音樂秀。", googleMapsQuery: "蘭潭月影潭心" },
      { name: "國定古蹟嘉義舊監獄", intro: "全臺唯一完整保存賓夕凡尼亞放射型牢房，世界罕見木構監獄古蹟。", googleMapsQuery: "嘉義舊監獄" }
    ],
    tourismFactories: [
      { name: "愛木村休閒觀光工廠", intro: "檜木香氣瀰漫的木育樂園，走過千歲紅檜爺爺與體驗手工檜木筷DIY。", googleMapsQuery: "愛木村休閒觀光工廠" },
      { name: "月桃故事館", intro: "月桃植物萃取與芳香精油研發，綠意盎然的香草花園體驗步道。", googleMapsQuery: "月桃故事館" },
      { name: "義興嘉釀傳統醬油體驗坊", intro: "嘉義七十年古法純釀醬油，參觀戶外露天黑豆蔭油麴槽與手工封缸。", googleMapsQuery: "義興醬油 嘉義" },
      { name: "嘉友電子觀光工廠", intro: "探索臺灣首家無線麥克風音響工藝，走進專業錄音室與聲音科普互動。", googleMapsQuery: "嘉友電子" }
    ],
    accommodations: [
      { name: "嘉義耐斯王子大飯店", type: "原民奢華五星", description: "阿里山鄒族圖騰為設計核心，舒適典雅的五星級名邸。", googleMapsQuery: "嘉義耐斯王子大飯店" },
      { name: "天成文旅-繪日之丘", type: "幾何文創", description: "純白堆疊積木童趣外觀，寬敞家庭房型與貼心茶點服務。", googleMapsQuery: "天成文旅繪日之丘" },
      { name: "福泰桔子商旅嘉義文化店", type: "夜市首排", description: "出門直達文化路夜市核心，乾淨明亮高CP值都會旅店。", googleMapsQuery: "福泰桔子商旅嘉義文化店" },
      { name: "新悅花園酒店", type: "親子度假", description: "頂樓黃金旋轉木馬與賽車場，阿里山黑熊公共藝術。", googleMapsQuery: "新悅花園酒店" },
      { name: "承億文旅-桃城茶樣子", type: "茶文化美學", description: "全臺首座茶主題旅店，頂樓無邊際泳池眺望嘉義市日落。", googleMapsQuery: "承億文旅桃城茶樣子" }
    ],
    famousFood: ["嘉義正宗火雞肉飯", "林聰明沙鍋魚頭", "源興御香屋紅鑽葡萄柚綠", "恩典酥方塊酥"],
    svgCoords: { x: 380, y: 575 }
  },
  {
    name: "嘉義縣",
    lat: 23.4518,
    lng: 120.2559,
    agriculture: "阿里山高山茶、民雄金鑽鳳梨、竹崎椪柑、太保玉女小番茄",
    fishery: "東石布袋現剖鮮蚵、虱目魚、白蝦",
    livestock: "嘉義火雞、御牧牛高品質履歷肉牛",
    description: "坐擁國際級阿里山神木群與日出雲海，平原區更建有宏偉的國立故宮博物院南部院區與歐風巴洛克城堡園區。",
    region: "南部",
    highlights: [
      { name: "阿里山國家森林遊樂區", intro: "搭乘經典紅色小火車祝山線看日出，仰望千年巨木神木群步道。", googleMapsQuery: "阿里山國家森林遊樂區" },
      { name: "國立故宮博物院南部院區", intro: "座落人工湖畔的當代流線建築，展出亞洲各國頂級珍藏藝術文物。", googleMapsQuery: "國立故宮博物院南部院區" },
      { name: "東石漁人碼頭", intro: "白色細沙灘、彩色風車與海風大道，品嚐現烤東石鮮蚵吃到飽。", googleMapsQuery: "東石漁人碼頭" },
      { name: "太平雲梯景觀吊橋", intro: "全台海拔最高單跨景觀吊橋，俯瞰嘉南平原夕照與雲海翻騰。", googleMapsQuery: "太平雲梯" },
      { name: "奮起湖老街與杉林木棧道", intro: "南台灣九份老街，品嚐鐵盒雙主菜鐵路便當與手工野生愛玉。", googleMapsQuery: "奮起湖老街" },
      { name: "布袋高跟鞋教堂", intro: "巨型藍色玻璃高跟鞋地標，金氏世界紀錄認證最大高跟鞋建築。", googleMapsQuery: "布袋高跟鞋教堂" }
    ],
    tourismFactories: [
      { name: "佐登妮絲城堡生技園區", intro: "全台最大巴洛克歐風城堡，穹頂噴泉、落羽松林與公主鏡池美拍。", googleMapsQuery: "佐登妮絲城堡生技園區" },
      { name: "民雄金桔觀光工廠", intro: "綠蔭老樹下品嚐香純金桔檸檬汁，親手煮一罐無防腐劑金桔果醬。", googleMapsQuery: "民雄金桔觀光工廠" },
      { name: "卡普秀醫美觀光工廠", intro: "探索醫美膠囊製造技術與客製化美肌面膜體驗。", googleMapsQuery: "卡普秀醫美觀光工廠" },
      { name: "蓋婭莊園康倪時代美學校園", intro: "希臘神話純白莊園，古典羅馬浴場造景與香氛美學。", googleMapsQuery: "蓋婭莊園" },
      { name: "丸聚頭觀光工廠", intro: "全臺首座貢丸觀光工廠，探索貢丸製程與親手包捏手作肉丸DIY。", googleMapsQuery: "丸聚頭觀光工廠" },
      { name: "旺萊山鳳梨文化園區", intro: "民雄神農獎鳳梨田環繞，免費享用整塊現烤土鳳梨酥與鳳梨醋品嚐。", googleMapsQuery: "旺萊山鳳梨文化園區" },
      { name: "余順豐花生觀光工廠", intro: "全臺第一座花生觀光工廠，探索傳統人工挑豆花生歷史與手炒花生香。", googleMapsQuery: "余順豐花生觀光工廠" }
    ],
    accommodations: [
      { name: "阿里山英迪格酒店", type: "高山雲海度假", description: "阿里山國家風景區首座國際頂級潮牌酒店，頂樓無邊際水池迎朝曦。", googleMapsQuery: "阿里山英迪格酒店" },
      { name: "長榮文苑酒店(嘉義)", type: "故宮景觀", description: "正對故宮南院，融入茶文化與中式美學的星級住宿。", googleMapsQuery: "長榮文苑酒店 嘉義" },
      { name: "阿里山賓館", type: "百年檜木歷史", description: "全台海拔最高五星級飯店，建於日治大正時期的全檜木貴賓館。", googleMapsQuery: "阿里山賓館" },
      { name: "棒棒積木飯店", type: "親子積木", description: "故宮南院旁，超大發光積木走廊與超大發光積木遊戲室。", googleMapsQuery: "棒棒積木飯店" }
    ],
    famousFood: ["阿里山高山珠露茶", "東石炭烤鮮蚵", "民雄旺萊山鳳梨酥", "阿里山手工天然愛玉"],
    svgCoords: { x: 420, y: 585 }
  },
  {
    name: "臺南市",
    lat: 22.9997,
    lng: 120.2270,
    agriculture: "玉井愛文芒果、麻豆文旦柚、官田紅菱（菱角）、白河蓮子",
    fishery: "七股虱目魚、北門黑金烏魚子、現撈白蝦",
    livestock: "善化溫體本土牛肉、黑羽土雞、優質肉豬",
    description: "臺灣建城起源地『府城』，四百年深厚歷史，古蹟廟宇密度居冠，溫體牛肉湯與庶民小吃文化更是享譽國際美食圈。",
    region: "南部",
    highlights: [
      { name: "奇美博物館", intro: "希臘神話阿波羅噴泉與純白圓頂殿堂，典藏名琴、西洋名畫與兵器。", googleMapsQuery: "奇美博物館" },
      { name: "臺南市美術館二館", intro: "普立茲克建築獎得主坂茂設計，五角形碎形屋頂構築的光影殿堂。", googleMapsQuery: "臺南市美術館二館" },
      { name: "安平古堡與安平老街", intro: "熱蘭遮城紅磚殘蹟，穿梭老街巷弄尋找劍獅與品嚐安平蝦捲。", googleMapsQuery: "安平古堡" },
      { name: "安平樹屋與德記洋行", intro: "百年榕樹氣根盤根錯節包覆舊倉庫，形成樹屋共生奇景與英商歷史洋樓。", googleMapsQuery: "安平樹屋" },
      { name: "四草綠色隧道", intro: "乘竹筏穿梭紅樹林形成的袖珍版亞馬遜河水上森林秘境。", googleMapsQuery: "四草綠色隧道" },
      { name: "赤崁樓與祀典武廟", intro: "荷蘭普羅民遮城遺址與九座贔屭御碑，府城文化歷史中樞。", googleMapsQuery: "赤崁樓" },
      { name: "神農街歷史街區", intro: "清代老屋老屋燈籠街，保留早期木格門與進駐手作選物酒吧。", googleMapsQuery: "神農街" },
      { name: "十鼓仁糖文創園區", intro: "百年老糖廠注入極限運動與震撼鼓樂演出，宛如台版霍格華茲。", googleMapsQuery: "十鼓仁糖文創園區" },
      { name: "六甲落羽松秘境與赤山龍湖巖", intro: "六甲菁埔埤落羽松林倒映水色，走訪參拜三百年古剎赤山龍湖巖，品嚐六甲媽祖廟百年麵茶刨冰。", googleMapsQuery: "六甲落羽松秘境" },
      { name: "官田遊客中心與水雉生態教育園區", intro: "西拉雅大草原梅花鹿地景建築，走訪官田菱角田探尋『菱角鳥』水雉鳥優雅身影與葫蘆埤自然公園。", googleMapsQuery: "官田遊客中心" },
      { name: "柳營德元埤荷蘭村與八翁酪農區", intro: "引進荷蘭純風車與紅磚水道造景，探訪全臺最大柳營八翁鮮乳酪農區與劉啟祥美術紀念館。", googleMapsQuery: "德元埤荷蘭村" },
      { name: "山上花園水道博物館", intro: "日治百年自來水水道紅磚巴洛克建築與快濾筒室，林蔭綠意水利遺產。", googleMapsQuery: "山上花園水道博物館" },
      { name: "臺南左鎮化石園區", intro: "全臺唯一化石主題博物館，展出早坂犀牛骨架與左鎮人古生物遺跡。", googleMapsQuery: "臺南左鎮化石園區" },
      { name: "七股鹽山與台灣鹽博物館", intro: "雪白壯觀的鹽峰地標，體驗爬鹽山與搭乘七股潟湖觀光竹筏現烤鮮蚵。", googleMapsQuery: "七股鹽山" },
      { name: "北門井仔腳瓦盤鹽田與水晶教堂", intro: "全臺最古老現存瓦盤鹽田，傍晚欣賞鹽田夕陽金黃倒影與純白水晶教堂。", googleMapsQuery: "井仔腳瓦盤鹽田" },
      { name: "後壁菁寮老街（無米樂故鄉）", intro: "走入經典金鐘台劇老街，探訪崑濱伯故居、嫁妝老舖與品嚐傳統割稻飯。", googleMapsQuery: "後壁菁寮老街" },
      { name: "白河關子嶺水火同源與溫泉鄉", intro: "天然瓦斯與泉水共生三百年水火奇觀，白河蓮花田與全台唯一泥漿溫泉。", googleMapsQuery: "關子嶺水火同源" },
      { name: "東山咖啡公路與174翼騎士驛站", intro: "175東山咖啡公路景觀咖啡莊園，高空透明玻璃天空步道俯瞰群山環繞。", googleMapsQuery: "東山咖啡公路" },
      { name: "玉井老街芒果冰與楠西梅嶺", intro: "全台愛文芒果發源地狂嗑大碗芒果冰，楠西梅嶺健行賞梅與品嚐招牌梅子雞。", googleMapsQuery: "玉井老街" },
      { name: "新化老街與大目降文化園區", intro: "日治巴洛克洋樓老街、日式武德殿與郡役所宿舍群，品嚐新化在地甘藷餅。", googleMapsQuery: "新化老街" }
    ],
    tourismFactories: [
      { name: "六甲蘭都觀光工廠", intro: "全台首座以蘭花為主題的生技美學館，漫步千坪落羽松蘭花花園與體驗蘭花保養品DIY。", googleMapsQuery: "蘭都觀光工廠" },
      { name: "官田隆田chacha文化資產教育園區", intro: "四鐵共構歷史舊糧倉轉型沉浸式數位劇場，體驗彈珠台巨型水圳互動遊戲。", googleMapsQuery: "隆田chacha文化資產教育園區" },
      { name: "柳營尖山埤江南渡假村與老牛之家", intro: "搭乘畫舫遊江南美景湖泊，探訪退役耕牛安老園區與八翁酪農乳品體驗。", googleMapsQuery: "柳營尖山埤渡假村" },
      { name: "奇美食品幸福工廠", intro: "包子燒賣公仔情境互動，品嚐現蒸多汁大肉包與手作杯子蛋糕。", googleMapsQuery: "奇美食品幸福工廠" },
      { name: "萬國通路創意觀光工廠", intro: "全球行李箱龍頭大廠，巨型太空梭與遊艇造景，彩繪專屬行李箱。", googleMapsQuery: "萬國通路創意觀光工廠" },
      { name: "天一中藥生活化園區", intro: "官田探索漢方草本與十二時辰養生密碼，品嚐香醇何首烏茶葉蛋。", googleMapsQuery: "天一中藥生活化園區" },
      { name: "黑橋牌香腸博物館", intro: "重現臺南早期沙卡里巴康樂市場，探索臺灣肉品醃漬文化歷史。", googleMapsQuery: "黑橋牌香腸博物館" },
      { name: "台南家具產業博物館", intro: "典藏百年魯班工藝、古董榫卯家具，提供手工木質生活小物創作體驗。", googleMapsQuery: "台南家具產業博物館" },
      { name: "立康中草藥產業文化館", intro: "探索臺灣真菌、中草藥製程及健康體質養生諮詢。", googleMapsQuery: "立康中草藥產業文化館" },
      { name: "瓜瓜園地瓜生態故事館", intro: "全臺最大甘藷供應地，體驗地瓜採收、地瓜圓手作與現烤香甜地瓜。", googleMapsQuery: "瓜瓜園地瓜生態故事館" },
      { name: "虹泰水凝膠世界", intro: "全球領先水凝膠生醫材料，體驗水凝膠芳香公仔DIY與智慧溫室花園。", googleMapsQuery: "虹泰水凝膠世界" }
    ],
    accommodations: [
      { name: "台南晶英酒店", type: "儒風府城五星", description: "揉合古都書院文風，早餐供應牛肉湯與米糕等道地小吃名宴。", googleMapsQuery: "台南晶英酒店" },
      { name: "煙波大飯店台南館", type: "市心首選", description: "正對台南美術館二館，配備完善露天溫水泳池與三溫暖水療。", googleMapsQuery: "煙波大飯店台南館" },
      { name: "台南遠東香格里拉", type: "車站地標五星", description: "臺南第一高樓圓形建築，緊鄰火車站，客房景觀遼闊震撼。", googleMapsQuery: "台南遠東香格里拉" },
      { name: "友愛街旅館 UIJ Hotel & Hostel", type: "設計風格", description: "結合黑膠唱片、書店與共享廚房文青旅店，鄰近南美館。", googleMapsQuery: "友愛街旅館" },
      { name: "台南大員皇冠假日酒店", type: "安平水岸", description: "緊鄰安平國家歷史風景區與鹽水溪出海口，客房飽覽水鳥濕地。", googleMapsQuery: "台南大員皇冠假日酒店" }
    ],
    famousFood: ["台南溫體現沖牛肉湯", "七股無刺虱目魚肚粥", "同記安平豆花", "玉井愛文芒果冰"],
    svgCoords: { x: 350, y: 685 }
  },
  {
    name: "高雄市",
    lat: 22.6273,
    lng: 120.3014,
    agriculture: "燕巢牛奶芭樂、旗山香蕉、大樹玉荷包荔枝、六龜黑鑽石蓮霧",
    fishery: "前鎮遠洋魷魚、秋刀魚、永安鑽石水石斑魚、茄萣烏魚",
    livestock: "田寮月世界泥火山跑山土雞、優質肉豬",
    description: "臺灣第一大國際海港都會，山海河港合一，愛河與亞灣區輕軌穿梭，結合駁二文創園區與大港橋旋轉奇景。",
    region: "南部",
    highlights: [
      { name: "駁二藝術特區與大港橋", intro: "港口舊倉庫轉型國際文創基地，欣賞全臺首座水平旋轉景觀大港橋。", googleMapsQuery: "駁二藝術特區" },
      { name: "旗津風景區與旗後砲台", intro: "搭乘渡輪漫步星空隧道、彩虹教堂與品嚐旗津現烤小卷。", googleMapsQuery: "旗津風景區" },
      { name: "高雄流行音樂中心", intro: "六角高音塔與珊瑚礁群前衛建築，沿愛河灣漫步欣賞璀璨夜景。", googleMapsQuery: "高雄流行音樂中心" },
      { name: "衛武營國家藝術文化中心", intro: "全球最大單一屋頂劇院，荷蘭建築師受老榕樹群啟發的流線空間。", googleMapsQuery: "衛武營國家藝術文化中心" },
      { name: "佛光山佛陀紀念館", intro: "供奉佛陀真身舍利，雄偉八塔與高聳入雲之青銅坐佛。", googleMapsQuery: "佛光山佛陀紀念館" },
      { name: "蓮池潭風景區龍虎塔", intro: "自龍口進、虎口出以趨吉避凶，七層黃色雙塔倒映湖心。", googleMapsQuery: "蓮池潭龍虎塔" },
      { name: "田寮月世界地質公園", intro: "泥岩惡地宛如月球荒涼表面，走上環湖步道與弦月觀景台。", googleMapsQuery: "田寮月世界" }
    ],
    tourismFactories: [
      { name: "宏裕行花枝丸館", intro: "全臺首座花枝丸觀光工廠，探索澎湖新鮮花枝打漿製程與現炸品嚐。", googleMapsQuery: "宏裕行花枝丸館" },
      { name: "紅頂穀創穀物文創樂園", intro: "馬玉山穀物研發美學館，參觀自動化包裝產線與手作磨穀樂趣。", googleMapsQuery: "紅頂穀創穀物文創樂園" },
      { name: "裕賀牛觀光工廠", intro: "專業牛肉分級冷鏈知識工廠，現場挑選頂級牛排由主廚煎烤品嚐。", googleMapsQuery: "裕賀牛觀光工廠" },
      { name: "FLOMO富樂夢橡皮擦觀光工廠", intro: "環保無毒橡皮擦製程探秘，發揮創意手作專屬彩繪橡皮擦。", googleMapsQuery: "富樂夢觀光工廠" },
      { name: "珍芳烏魚子見學工廠", intro: "全臺首座烏魚子觀光工廠，體驗烏魚子炙燒、手作飯糰與海洋生技科普。", googleMapsQuery: "珍芳烏魚子見學工廠" },
      { name: "台灣滷味博物館", intro: "全球首座滷味觀光工廠，探索得意中華五行滷汁與現煮黃金蛋DIY。", googleMapsQuery: "台灣滷味博物館" },
      { name: "彪琥台灣鞋故事館", intro: "堅持MIT台灣手工製鞋，足部3D數位掃描與迷你小鞋彩繪手作。", googleMapsQuery: "彪琥台灣鞋故事館" }
    ],
    accommodations: [
      { name: "高雄洲際酒店", type: "科技奢華", description: "座落亞洲新灣區智慧奢華地標，頂級客房設施與星級酒吧。", googleMapsQuery: "高雄洲際酒店" },
      { name: "高雄萬豪酒店", type: "大器五星", description: "愛河之心景觀第一排，直通義享天地時尚購物中心。", googleMapsQuery: "高雄萬豪酒店" },
      { name: "晶英國際行館 Silks Club", type: "極致精品", description: "全套房私人奢華行館，展出4D浮空動力藝術與Ukai頂級牛排鐵板燒。", googleMapsQuery: "晶英國際行館" },
      { name: "承億酒店 TAI Urban Resort", type: "高空無邊際", description: "全台唯一高空懸挑透明無邊際泳池，飽覽高雄港灣西子灣夕陽。", googleMapsQuery: "承億酒店" },
      { name: "高雄漢來大飯店", type: "海港地標", description: "經典港都名牌五星，擁有全台最受歡迎之漢來海港自助百匯。", googleMapsQuery: "高雄漢來大飯店" }
    ],
    famousFood: ["正宗岡山羊肉爐", "旗津現烤鮮小卷", "旗山手工香蕉蛋糕", "月世界泥火山土雞"],
    svgCoords: { x: 410, y: 735 }
  },
  {
    name: "屏東縣",
    lat: 22.6713,
    lng: 120.4879,
    agriculture: "林邊黑珍珠蓮霧、枋山愛文芒果、九如檸檬、萬丹紅豆",
    fishery: "東港三寶之黑鮪魚、櫻花蝦、油魚子、林邊石斑魚",
    livestock: "萬丹產銷履歷生鮮純乳、健康黑毛豬",
    description: "臺灣最南端的陽光國境之南，墾丁珊瑚礁海岸、熱帶雨林生態與東港漁港海鮮冠絕全臺，四季皆沐浴於熱情陽光下。",
    region: "南部",
    highlights: [
      { name: "國立海洋生物博物館", intro: "全臺最大水族館，三層樓大洋池展示鯨鯊與海底隧道企鵝館。", googleMapsQuery: "國立海洋生物博物館" },
      { name: "墾丁國家公園鵝鑾鼻燈塔", intro: "臺灣本島最南端純白燈塔，眺望巴士海峽、太平洋與臺灣海峽交匯。", googleMapsQuery: "鵝鑾鼻燈塔" },
      { name: "大鵬灣國家風景區與跨海大橋", intro: "全臺最大單口囊狀潟湖，欣賞開啟式跨海大橋與濱海紅樹林生態。", googleMapsQuery: "大鵬灣國家風景區" },
      { name: "東港華僑市場", intro: "生猛現撈海鮮批發市場，產地第一手平價品嚐黑鮪魚生魚片。", googleMapsQuery: "東港華僑市場" },
      { name: "勝利星村創意生活園區", intro: "全臺最大規模日式陸軍軍官官舍群，進駐獨立書店與文創咖啡廳。", googleMapsQuery: "勝利星村創意生活園區" },
      { name: "墾丁白沙灣海灘", intro: "純淨貝殼白沙灘，少年Pi與海角七號取景地，欣賞夕陽晚霞首選。", googleMapsQuery: "墾丁白沙灣" },
      { name: "龍磐公園", intro: "石灰岩溶蝕崩崖地形，廣袤草原居高臨下俯瞰太平洋蔚藍壯景。", googleMapsQuery: "龍磐公園" },
      { name: "恆春古城與南門歷史巡禮", intro: "臺灣保留最完整的百年清代紅磚城門與城牆遺跡，漫步歷史老街。", googleMapsQuery: "恆春古城" }
    ],
    tourismFactories: [
      { name: "鮮豐水果觀光工廠（銘泉農場）", intro: "有機鳳梨田園導覽與金鑽鳳梨酥烘焙手作體驗。", googleMapsQuery: "銘泉生態休閒農場" },
      { name: "福爾摩沙可可農場", intro: "內埔屏東可可基地，探索世界金牌Tree to Bar巧克力工藝。", googleMapsQuery: "福爾摩沙可可農場" },
      { name: "鮮芋仙黑糖烘焙體驗館", intro: "全臺首創芋圓甜品觀光工廠，親手搓揉雙色芋圓與地瓜圓手作。", googleMapsQuery: "鮮芋仙 觀光工廠" },
      { name: "喬本生醫觀光工廠", intro: "GMP中草藥超臨界萃取科技，參觀牛樟芝培育庫與健康草本飲品體驗。", googleMapsQuery: "喬本生醫觀光工廠" },
      { name: "台灣農林老埤農場茶葉文化館", intro: "南臺灣最大茶園基地，漫步千畝翠綠茶海與探索現代化製茶技術。", googleMapsQuery: "老埤農場" },
      { name: "天明製藥農科觀光藥廠", intro: "全臺最大科學中藥觀光工廠，體驗漢方防蚊包與草本精油DIY。", googleMapsQuery: "天明製藥農科觀光藥廠" }
    ],
    accommodations: [
      { name: "墾丁夏都沙灘酒店", type: "私人海灘", description: "推開落地窗即是綿延金色沙灘與椰林，頂級海島度假首選。", googleMapsQuery: "墾丁夏都沙灘酒店" },
      { name: "華泰瑞苑墾丁賓館", type: "大尖山秘境", description: "前蔣公行館，座落國家森林遊樂區內，遠眺大尖石山雄偉姿態。", googleMapsQuery: "華泰瑞苑" },
      { name: "墾丁凱撒大飯店", type: "峇里島風情", description: "緊鄰小灣沙灘，椰林庭園景觀泳池與貼心親子俱樂部。", googleMapsQuery: "墾丁凱撒大飯店" },
      { name: "福容大飯店 墾丁", type: "帆船石海景", description: "背山面海俯瞰船帆石蔚藍海岸，休閒保齡球館與水療池。", googleMapsQuery: "福容大飯店 墾丁" },
      { name: "墾丁悠活渡假村", type: "溫泉水療親子", description: "萬里桐海景首排，設有天然溫泉、滑水道泳池與潮間帶生態探險。", googleMapsQuery: "墾丁悠活渡假村" }
    ],
    famousFood: ["東港現切黑鮪魚生魚片", "萬巒正宗海鴻豬腳", "潮州正老牌燒冷冰", "萬丹紅豆餅"],
    svgCoords: { x: 440, y: 880 }
  },
  {
    name: "花蓮縣",
    lat: 23.9871,
    lng: 121.6015,
    agriculture: "富里池上富麗米、鶴岡文旦柚、吉安龍鬚菜、金針花",
    fishery: "七星潭定置漁場鰹魚、鬼頭刀、曼波魚",
    livestock: "花蓮無毒農業跑山土雞、瑞穗吉蒸牧場鮮乳",
    description: "大山大海的花東縱谷與斷崖奇景，大理石峽谷太魯閣鬼斧神工，七星潭月牙海灣海天一色，是大自然最好的療癒禮物。",
    region: "東部",
    highlights: [
      { name: "太魯閣國家公園燕子口", intro: "大理石岩壁立霧溪深切峽谷，燕子口、九曲洞奇險絕倫。", googleMapsQuery: "太魯閣國家公園" },
      { name: "七星潭風景區", intro: "弧形優美月牙海灣，踏浪散步、堆疊鵝卵石與凝望湛藍太平洋。", googleMapsQuery: "七星潭風景區" },
      { name: "瑞穗牧場", intro: "縱谷群山環繞的翠綠草場，親手餵食乳牛與品嚐香濃乳酪炸饅頭。", googleMapsQuery: "瑞穗牧場" },
      { name: "花蓮文化創意產業園區", intro: "昔日百年花蓮酒廠紅磚綠蔭空間，文創展演與特色手作選物。", googleMapsQuery: "花蓮文化創意產業園區" },
      { name: "鯉魚潭風景區", intro: "花蓮最大內陸天然湖泊，踩天鵝船環湖、漫步親水步道賞螢。", googleMapsQuery: "鯉魚潭風景區" },
      { name: "遠雄海洋公園", intro: "全臺灣第一座國際級海洋主題樂園，欣賞海豚海獅秀與全景纜車。", googleMapsQuery: "遠雄海洋公園" },
      { name: "東大門國際觀光夜市", intro: "原住民一條街、福町夜市與各省一條街，匯集數百攤山海美食。", googleMapsQuery: "東大門夜市" }
    ],
    tourismFactories: [
      { name: "台泥DAKA生態循環工廠", intro: "全臺首座對外開放之水泥生態循環工廠，展示巨型太陽能和平花與星巴克。", googleMapsQuery: "台泥DAKA" },
      { name: "地瓜臭豆腐觀光故事館（阿美小米文化館）", intro: "原住民小米麻糬製程文化，親手體驗搗麻糬手作樂趣。", googleMapsQuery: "阿美小米文化館" },
      { name: "光復糖廠", intro: "保存日式榻榻米木造宿舍群，享用清涼美味的多種口味古早味冰棒。", googleMapsQuery: "花蓮觀光糖廠" },
      { name: "七星柴魚博物館", intro: "全臺唯一柴魚主題產業博物館，體驗刨柴魚片、炙燒章魚燒DIY。", googleMapsQuery: "七星柴魚博物館" },
      { name: "新光兆豐休閒農場乳業工坊", intro: "萬坪綠意草原，近距離接觸乳牛與浣熊，體驗手工鮮奶酪製作。", googleMapsQuery: "新光兆豐休閒農場" }
    ],
    accommodations: [
      { name: "太魯閣晶英酒店", type: "頂級峽谷", description: "深處國家公園天祥核心，峽谷頂樓無邊際溫水泳池眺望雄峰。", googleMapsQuery: "太魯閣晶英酒店" },
      { name: "瑞穗天合國際觀光酒店", type: "歐風溫泉城堡", description: "南歐城堡造型與頂級金色美人湯溫泉，室內金色水樂園。", googleMapsQuery: "瑞穗天合國際觀光酒店" },
      { name: "花蓮遠雄悅來大飯店", type: "太平洋海景", description: "矗立海岸山脈之巔，英倫維多利亞宮廷風，俯瞰花蓮市百萬夜景。", googleMapsQuery: "花蓮遠雄悅來大飯店" },
      { name: "煙波大飯店花蓮館", type: "美崙海景", description: "坐落美崙文教區，海景客房坐擁太平洋海天一色晨曦。", googleMapsQuery: "煙波大飯店花蓮館" },
      { name: "理想大地渡假飯店", type: "運河別墅", description: "西班牙摩爾式風格運河別墅，搭乘無聲輕艇遊覽2.2公里人造運河。", googleMapsQuery: "花蓮理想大地渡假飯店" }
    ],
    famousFood: ["花蓮炸彈蔥油餅", "戴記扁食湯", "手工曾記麻糬", "玉里麵與橋頭臭豆腐"],
    svgCoords: { x: 670, y: 440 }
  },
  {
    name: "臺東縣",
    lat: 22.7583,
    lng: 121.1444,
    agriculture: "大目釋迦與鳳梨釋迦、池上冠軍良質米、太麻里金針、洛神花",
    fishery: "成功漁港旗魚、富岡黑潮柴魚、鬼頭刀",
    livestock: "臺東純放牧土雞、初鹿純鮮乳",
    description: "全臺灣最純淨的陽光綠地，鹿野高台熱氣球翱翔天際，伯朗大道稻浪隨風搖曳，三仙台跨海八拱步橋矗立太平洋怒濤中。",
    region: "東部",
    highlights: [
      { name: "池上伯朗大道與金城武樹", intro: "無任何電線桿干擾的純粹稻浪大道，騎乘自行車漫遊天堂路。", googleMapsQuery: "池上伯朗大道" },
      { name: "鹿野高台風景區", intro: "臺灣國際熱氣球嘉年華舉辦地，寬闊大草坪與飛行傘體驗勝地。", googleMapsQuery: "鹿野高台" },
      { name: "三仙台跨海步橋", intro: "八拱跨海人行步道連接離岸珊瑚礁小島，迎曙光絕美聖地。", googleMapsQuery: "三仙台" },
      { name: "臺東森林公園琵琶湖", intro: "黑森林中隱藏的天然湧泉地下湖泊，水草清澈倒映藍天白雲。", googleMapsQuery: "臺東森林公園" },
      { name: "鐵花村音樂聚落慢市集", intro: "彩繪熱氣球燈海如夢似幻，原住民創作音樂現場駐唱與在地小農手作。", googleMapsQuery: "鐵花村" },
      { name: "小野柳風景區", intro: "豆腐岩、蜂窩岩與蕈狀岩奇石林立，海岸地質景觀媲美野柳。", googleMapsQuery: "小野柳" },
      { name: "加路蘭海岸遊憩區", intro: "漂流木裝置藝術與太平洋海濤交織，東海岸最佳星空觀賞點。", googleMapsQuery: "加路蘭海岸" }
    ],
    tourismFactories: [
      { name: "池上鄉農會觀光工廠金色豐收館", intro: "全臺灣最具規模稻米文化觀光工廠，體驗手工碾米包裝製程。", googleMapsQuery: "金色豐收館" },
      { name: "初鹿牧場", intro: "走在全臺灣坡度最大的高台牧場，品嚐初鹿純純鮮乳冰淇淋。", googleMapsQuery: "初鹿牧場" },
      { name: "東河香蘭釋迦手作體驗館", intro: "探索臺東釋迦種植技術，手作釋迦冰沙與釋迦手工皂DIY。", googleMapsQuery: "台東 釋迦 觀光" },
      { name: "紅葉谷綠能溫泉園區", intro: "結合地熱發電與溫泉觀光，走進地熱鑽井科普基地與山林湯泉。", googleMapsQuery: "紅葉谷綠能溫泉園區" },
      { name: "原生應用植物園", intro: "全臺最大藥草植物主題園區，品嚐養生汆燙野菜鍋與天然藥草植物精油。", googleMapsQuery: "台東原生應用植物園" }
    ],
    accommodations: [
      { name: "台東知本老爺酒店", type: "知本湯泉", description: "坐落知本溪谷蓊鬱林木間，名湯露天溫泉與原住民歌舞表演。", googleMapsQuery: "知本老爺酒店" },
      { name: "日暉國際渡假村池上", type: "縱谷Villa", description: "池上翠綠稻浪旁的南歐風情泳池Villa，享受純粹慢活放鬆。", googleMapsQuery: "日暉國際渡假村池上" },
      { name: "THE GAYA HOTEL 潮渡假酒店", type: "市心設計", description: "頂樓無邊際泳池正對鯉魚山與鐵花村，融合台東原民人文與當代極簡。", googleMapsQuery: "THE GAYA HOTEL" },
      { name: "台東桂田喜來登酒店", type: "市區旗艦", description: "台東市中心最高建築，緊鄰正氣路觀光夜市，配備精緻海鮮百匯。", googleMapsQuery: "台東桂田喜來登酒店" },
      { name: "鹿野森活民宿", type: "田園莊園", description: "鹿野高台山腳下純白法式鄉村風，庭院大草坪與滿天璀璨星斗。", googleMapsQuery: "鹿野森活民宿" }
    ],
    famousFood: ["大目釋迦果", "池上正宗木盒便當", "東河手工包子", "卑南傳統豬血湯"],
    svgCoords: { x: 610, y: 730 }
  },
  {
    name: "澎湖縣",
    lat: 23.5711,
    lng: 119.5793,
    agriculture: "澎湖絲瓜（十角絲瓜）、花生、白沙洋香瓜、仙人掌果",
    fishery: "澎湖小管乾、海鱺魚、澎湖野生生蠔（牡蠣）、石斑",
    livestock: "離島黑山羊、野生跑山雞",
    description: "臺灣海峽上最耀眼的九十座島嶼群島，玄武岩柱狀節理列為世界地質遺產，雙心石滬與花火節蔚藍海景美不勝收。",
    region: "離島",
    islandNotice: "【離島交通方式】澎湖可由臺北松山、臺中清泉崗、高雄小港或嘉義水上機場搭乘班機直飛（約35~50分鐘）；亦可由嘉義布袋港搭乘高速客輪（約70~80分鐘）抵達馬公港。各離島間備有快艇接駁。",
    highlights: [
      { name: "奎壁山摩西分海", intro: "潮汐退去時礫石踏浪步道浮現，宛如舊約聖經摩西分海神蹟。", googleMapsQuery: "奎壁山摩西分海" },
      { name: "七美雙心石滬", intro: "先民智慧玄武岩堆砌石滬，在清澈碧藍海面上勾勒出浪漫心心相印。", googleMapsQuery: "七美雙心石滬" },
      { name: "澎湖跨海大橋", intro: "連接白沙島與西嶼島，全長近兩千五百公尺的壯闊跨海拱門橋樑。", googleMapsQuery: "澎湖跨海大橋" },
      { name: "篤行十村眷村文化園區", intro: "潘安邦與張雨生故居所在地，全台最古老眷村翻新文創咖啡館。", googleMapsQuery: "篤行十村" },
      { name: "大菓葉柱狀玄武岩", intro: "因採石意外出土的巨型五角柱狀玄武岩壁，雨後窪地倒映節理壯觀絕倫。", googleMapsQuery: "大菓葉柱狀玄武岩" },
      { name: "二崁傳統聚落保存區", intro: "澎湖保存最完整的珊瑚礁咾咕石與玄武岩古厝聚落，品嚐杏仁茶。", googleMapsQuery: "二崁聚落" },
      { name: "隘門沙灘", intro: "綿延數公里的金色貝殼沙灘與碧綠海水，水上摩托車與香蕉船樂園。", googleMapsQuery: "隘門沙灘" }
    ],
    tourismFactories: [
      { name: "黑妞黑糖糕觀光工廠", intro: "傳承澎湖百年黑糖糕製造工藝，現場觀看高溫蒸氣炊製與試吃。", googleMapsQuery: "黑妞黑糖糕觀光工廠" },
      { name: "澎坊Pier3免稅海洋文創館", intro: "結合澎湖海洋文化科技互動、威士忌蒸餾見學與免稅購物體驗。", googleMapsQuery: "Pier3三號港" },
      { name: "澎湖水產種苗繁殖場海洋生態館", intro: "探索珊瑚培育復育生態、親手觸摸海膽海參海星與種苗科普。", googleMapsQuery: "澎湖縣水產種苗繁殖場" },
      { name: "大漢花枝丸手作體驗館", intro: "澎湖新鮮野生花枝純手工打漿，親自捏製花枝丸與現炸美味。", googleMapsQuery: "大漢花枝丸 澎湖" },
      { name: "御品家黑糖糕冰心糕觀光工廠", intro: "澎湖在地人氣糕餅名店，透明化產線參觀黑糖糕與冰心糕製作。", googleMapsQuery: "御品家 澎湖" }
    ],
    accommodations: [
      { name: "澎湖福朋喜來登酒店", type: "港灣旗艦", description: "坐擁馬公第三漁港景致，無邊際戶外海景泳池與五星海鮮百匯。", googleMapsQuery: "澎湖福朋喜來登酒店" },
      { name: "澎澄飯店 Discovery Hotel", type: "海洋探險", description: "直通Pier3三號港免稅商場，館內設有大型極限運動攀岩場。", googleMapsQuery: "澎澄飯店" },
      { name: "綠光海風海景民宿", type: "沙灘首排", description: "隘門沙灘旁，推開窗戶即見澎湖灣蔚藍海景與星空。", googleMapsQuery: "澎湖 海景民宿" },
      { name: "和田大飯店", type: "市區便捷", description: "座落馬公市中心第一銀行旁，步行三分鐘直達中正路美食商圈與天后宮。", googleMapsQuery: "和田大飯店" }
    ],
    famousFood: ["仙人掌冰淇淋", "現蒸黑糖糕", "小管麵線", "澎湖絲瓜炒蛤蜊"],
    svgCoords: { x: 175, y: 535 }
  },
  {
    name: "金門縣",
    lat: 24.4490,
    lng: 118.3765,
    agriculture: "高粱、金門一條根、烈嶼芋頭（小金門芋頭）",
    fishery: "黃魚、花蛤、近海野生花蟹、海蚵",
    livestock: "金門酒糟放牧牛（頂級酒糟牛肉）、黑毛豬",
    description: "戰地史蹟與閩南僑鄉文化的大成之地，翟山坑道、洋樓聚落與風獅爺庇佑，享譽全球的金門高粱酒香醇濃郁。",
    region: "離島",
    islandNotice: "【離島交通方式】金門可由臺北松山、臺中清泉崗、嘉義水上、臺南、高雄小港機場搭乘立榮航空或華信航空客機直達尚義機場（約50~65分鐘）。大金門與烈嶼（小金門）可經由金門大橋車行往返。",
    highlights: [
      { name: "水頭聚落得月樓", intro: "金門最精美之閩南古厝與防禦性西式洋樓群，感受僑鄉建築極致風華。", googleMapsQuery: "水頭聚落 得月樓" },
      { name: "翟山坑道", intro: "國軍徒手開鑿深入花崗岩花崗石坑道，水道波光倒影鬼斧神工。", googleMapsQuery: "翟山坑道" },
      { name: "金門大橋", intro: "臺灣首座深水域跨海脊背橋，全長5.4公里連結大小金門極致海景。", googleMapsQuery: "金門大橋" },
      { name: "莒光樓", intro: "金門精神指標地標，仿古宮殿式三層樓建築，登高遠眺金烈水道。", googleMapsQuery: "莒光樓" },
      { name: "陳景蘭洋樓", intro: "金門規模最大最華麗之雙層番仔樓，白色對稱羅馬拱門俯瞰成功沙灘。", googleMapsQuery: "陳景蘭洋樓" },
      { name: "古寧頭戰史館", intro: "緬懷古寧頭戰役英雄，展出十二幅巨幅戰役油畫與先鋒反擊戰車。", googleMapsQuery: "古寧頭戰史館" },
      { name: "獅山砲陣地", intro: "全臺灣罕見的全坑道式榴彈砲陣地，欣賞震撼人心的砲操操演示範。", googleMapsQuery: "獅山砲陣地" }
    ],
    tourismFactories: [
      { name: "金門酒廠觀光巡禮（金門酒廠金寧廠）", intro: "全臺灣白酒龍頭，參觀高粱蒸煮發酵與品嚐純正58度原酒醇香。", googleMapsQuery: "金門酒廠" },
      { name: "金合利鋼刀觀光工廠", intro: "以八二三砲戰砲彈鋼片手工打磨鍛造聞名世界的金門鋼刀。", googleMapsQuery: "金合利鋼刀" },
      { name: "聖祖食品觀光工廠", intro: "現場觀摩金門傳統貢糖手工拉糖與酥脆包餡技藝。", googleMapsQuery: "聖祖食品觀光工廠" },
      { name: "王大夫一條根文化館", intro: "百年漢方金門一條根草本萃取，體驗草本精油舒壓與足貼DIY。", googleMapsQuery: "王大夫一條根文化館" },
      { name: "良金牧場牛肉乾觀光工廠", intro: "金門酒糟牛養殖與牛肉乾製程見學，享用產地現沖溫體酒糟牛肉麵。", googleMapsQuery: "良金牧場" }
    ],
    accommodations: [
      { name: "金湖飯店 Golden Lake Hotel", type: "五星太湖", description: "金門首座國際五星級飯店，坐擁太湖山色湖光，直通亞洲最大免稅店。", googleMapsQuery: "金湖飯店" },
      { name: "水頭古厝特色民宿", type: "傳統燕尾古厝", description: "夜宿百年紅磚燕尾古厝，細品閩南天井天井風情與星空古意。", googleMapsQuery: "水頭聚落民宿" },
      { name: "海福商務飯店", type: "金城市區", description: "座落金城鎮核心，步行即可造訪模範街與總兵署，交通便捷。", googleMapsQuery: "海福商務飯店" },
      { name: "湖峰民宿", type: "傳統石砌古聚落", description: "慈湖湖畔古厝，夜間可遠眺廈門高樓璀璨夜景與夕陽候鳥。", googleMapsQuery: "金門 湖峰民宿" }
    ],
    famousFood: ["金門酒糟牛肉麵", "廣東粥配手工現炸油條", "高粱酒香腸", "貢糖伴手禮"],
    svgCoords: { x: 120, y: 250 }
  },
  {
    name: "連江縣",
    lat: 26.1558,
    lng: 119.9519,
    agriculture: "東湧高粱、白蘿蔔、洛神花",
    fishery: "馬祖野生淡菜、海帶、黃魚、花蛤",
    livestock: "離島野生黑山羊、跑山土雞",
    description: "極北國境島嶼，芹壁閩東聚落宛如地中海石頭城，春夏交替藍眼淚夜光藻點亮海浪，八八坑道陳釀老酒沉厚醇香。",
    region: "離島",
    islandNotice: "【離島交通方式】連江馬祖可由臺北松山或臺中機場搭乘班機飛往南竿或北竿機場（約50分鐘）；海運可從基隆港搭乘「新臺馬輪」夜航至南竿福澳港（約8~10小時）。各島間透過定期客船接駁往來。",
    highlights: [
      { name: "北竿芹壁聚落", intro: "保存最完整的閩東式花崗岩石頭屋聚落，背山面海，號稱臺灣地中海。", googleMapsQuery: "芹壁聚落" },
      { name: "南竿北海坑道", intro: "深入堅硬花崗岩開鑿的井字型戰備水道，夜間搖櫓追尋夢幻藍眼淚。", googleMapsQuery: "南竿北海坑道" },
      { name: "東引東湧燈塔", intro: "矗立在懸崖絕壁上的百年英倫純白燈塔，俯瞰太平洋怒濤萬丈。", googleMapsQuery: "東引東湧燈塔" },
      { name: "八八坑道", intro: "坑道內長年恆溫恆濕，排列整齊陶甕陳年大麴老酒香氣四溢。", googleMapsQuery: "八八坑道" },
      { name: "馬祖巨神像與祈福坑道", intro: "高達28.8公尺的媽祖巨神像，船型瞭望台俯瞰馬祖港與閩江口。", googleMapsQuery: "馬祖巨神像" },
      { name: "鐵堡戰地海防要塞", intro: "突出於海中的獨立礁岩軍事據點，體驗昔日水鬼防衛歷史氛圍。", googleMapsQuery: "鐵堡" },
      { name: "北竿坂里大宅", intro: "傳統閩東四合院建築，就近漫步坂里沙灘與天后宮。", googleMapsQuery: "坂里大宅" }
    ],
    tourismFactories: [
      { name: "馬祖酒廠南竿展示館", intro: "探索馬祖老酒與元尊陳高釀造歷史，免費品嚐甘醇濃烈陳年高粱。", googleMapsQuery: "馬祖酒廠" },
      { name: "馬祖梅石軍官特約茶室文化館", intro: "重現戰地政務時期歷史生活樣貌與軍旅藝文故事展覽。", googleMapsQuery: "梅石特約茶室" },
      { name: "林義和工坊紅糟老酒體驗館", intro: "傳承百年閩東紅糟釀造工藝，手作老酒面膜與紅糟醬料理體驗。", googleMapsQuery: "林義和工坊" },
      { name: "馬祖民俗文物館生態工坊", intro: "閩東建築風格展館，深入體驗馬祖海洋漁業古道具與拓印體驗。", googleMapsQuery: "馬祖民俗文物館" },
      { name: "東引酒廠展示中心", intro: "全臺最北高緯度低溫發酵東湧陳高，探索坑道儲酒與醇厚風味品嚐。", googleMapsQuery: "東引酒廠" }
    ],
    accommodations: [
      { name: "芹壁望海居精品民宿", type: "閩東石屋海景", description: "座落芹壁核心，推開石窗直視龜島與碧藍海灣，星空日出如夢。", googleMapsQuery: "芹壁望海居" },
      { name: "日光春和 Dayspring", type: "清水模當代", description: "南竿海岸邊極簡現代美學綠建築旅館，海景視野寬闊療癒。", googleMapsQuery: "日光春和" },
      { name: "南竿覓境E19木屋民宿", type: "海景小木屋", description: "依山傍海獨立木屋，坐在戶外木棧台享受海風與滿天星斗。", googleMapsQuery: "南竿覓境E19" },
      { name: "東引東湧民宿", type: "極北之境", description: "東引中柱港旁溫馨旅宿，主人親切導覽東引燈塔與安東坑道。", googleMapsQuery: "東引 民宿" }
    ],
    famousFood: ["馬祖老酒麵線", "清蒸活淡菜", "紅糟鰻魚", "馬祖漢堡（繼光餅夾蛋）"],
    svgCoords: { x: 155, y: 110 }
  },
  {
    name: "綠島",
    lat: 22.6625,
    lng: 121.4925,
    agriculture: "天然野生海草、綠島花生糖、林投果、野生土芭樂",
    fishery: "現撈芭蕉旗魚、飛魚、鰹魚、鬼頭刀、九孔、海石花菜",
    livestock: "綠島放牧梅花鹿、黑山羊、跑山土雞",
    description: "太平洋上耀眼的火燒島，座擁世界級罕見『朝日海底溫泉』，環島被清澈湛藍的玻璃海與壯麗珊瑚礁環抱，是潛水客夢幻天堂，更保存深富歷史記憶的人權文化園區。",
    region: "離島",
    islandNotice: "【離島交通方式】綠島可由臺東富岡漁港搭乘高速客輪（凱旋號/綠島之星/金星客輪，航程約 50 分鐘）直達綠島南寮漁港；亦可由臺東豐年機場搭乘德安航空 19 人座小型客機（航程僅約 15 分鐘）直飛綠島航空站。島上交通以租乘電動機車、燃油機車或環島觀光巴士最為便捷。",
    highlights: [
      { name: "朝日溫泉海底鹹水溫泉", intro: "世界僅有三處之海底鹹水溫泉，清晨邊泡溫泉邊迎接太平洋第一道日出曙光。", googleMapsQuery: "朝日溫泉" },
      { name: "綠島燈塔與烏油窟潟湖", intro: "二次大戰胡佛總統號郵輪受難紀念純白燈塔，下方烏油窟為夢幻貝殼沙潟湖。", googleMapsQuery: "綠島燈塔" },
      { name: "柴口與石朗浮潛區", intro: "全臺頂級潛水秘境，擁有水下大香菇珊瑚礁、海底郵筒與綠蠵龜共游。", googleMapsQuery: "柴口浮潛區" },
      { name: "綠島人權文化園區（綠洲山莊）", intro: "臺灣白色恐怖時期歷史紀念地，完整保留昔日牢房、不義遺址與人權史料展覽。", googleMapsQuery: "綠島人權文化園區" },
      { name: "睡美人與哈巴狗岩", intro: "火山頸岩石經億萬年海蝕雕琢，宛如一位側臥熟睡的美人與忠心趴臥的哈巴狗。", googleMapsQuery: "睡美人岩" },
      { name: "大白沙珊瑚礁海岸步道", intro: "綿延細緻的白色珊瑚貝殼沙灘，延伸入太平洋蔚藍果凍海的經典木棧道步道。", googleMapsQuery: "大白沙潛水區" },
      { name: "牛頭山大草原", intro: "三面環海的高聳岬角大草原，外型宛如巨牛伏臥，坐擁無死角海天一色絕景與夕陽。", googleMapsQuery: "牛頭山" },
      { name: "柚子湖與海蝕門秘境", intro: "綠島最早開發之古老咾咕石厝聚落遺址，穿過巨型海蝕門探訪藍洞秘境。", googleMapsQuery: "柚子湖" }
    ],
    tourismFactories: [
      { name: "綠島遊客中心與海洋環境生態館", intro: "探索綠島火山地質成因、黑潮暖流洋流、珊瑚礁海洋生態與梅花鹿歷史。", googleMapsQuery: "綠島遊客中心" },
      { name: "綠島信交易郵筒文創手作館", intro: "全臺知名水下明信片寄送體驗，提供在地木作刻印與特色文創明信片。", googleMapsQuery: "信交易 綠島" },
      { name: "綠島監獄冰文創體驗故事館", intro: "結合昔日犯人放風歷史造景，體驗親手刨製純天然海草雪花冰與海草點心。", googleMapsQuery: "綠島監獄冰" }
    ],
    accommodations: [
      { name: "綠島微風海景民宿", type: "海景首排", description: "座落南寮漁港旁，客房超大落地窗直面太平洋夕陽落日暮色。", googleMapsQuery: "綠島微風海景民宿" },
      { name: "緩島旅宿 Slow Island Hostel", type: "青年設計", description: "文青設計風格旅舍，綠意盎然交誼庭院與專業潛水教練帶領考照。", googleMapsQuery: "緩島旅宿" },
      { name: "綠島過日子民宿", type: "簡約慢活", description: "溫馨日系無印風，座落公館村寧靜角落，提供在地私房景點導覽。", googleMapsQuery: "綠島過日子民宿" },
      { name: "綠島 TORO 觀海民宿", type: "頂級奢華Villa", description: "緊鄰珊瑚礁海岸，私人專屬觀海平台與無死角海景獨立浴缸。", googleMapsQuery: "綠島TORO觀海民宿" }
    ],
    famousFood: ["綠島海草冰", "現烤鹿肉乾", "海草茜草手工芡粿", "酥炸鬼頭刀魚柳", "花生糖伴手禮"],
    svgCoords: { x: 740, y: 740 }
  },
  {
    name: "蘭嶼",
    lat: 22.0560,
    lng: 121.5540,
    agriculture: "蘭嶼水芋（傳統水芋田）、紅頭地瓜、林投果、麵包樹果實",
    fishery: "黑潮飛魚、鬼頭刀、芭蕉旗魚、夜行白帶魚、海膽、野生海菜",
    livestock: "達悟族傳統黑毛豬、自由漫步海崖放牧山羊（達悟族財富象徵）",
    description: "太平洋黑潮上的達悟族神聖島嶼，完整保留全臺最純粹南島語系海洋文化。紅黑白圖騰拼板舟破浪迎曦、壯麗野銀傳統地下屋、東清灣迎第一道曙光，每年春夏的飛魚祭更展現人與海洋的永續共生智慧。",
    region: "離島",
    islandNotice: "【離島交通方式】蘭嶼可由臺東富岡漁港或屏東恆春後壁湖遊艇港搭乘高速客輪（綠島之星號/金星客輪，航程約 2~2.5 小時）直達蘭嶼開元港；亦可由臺東豐年機場搭乘德安航空 19 人座小型客機（航程約 25 分鐘）直達蘭嶼航空站（機位限量敬請提前預訂）。全島環島公路全長約 37 公里，租乘機車或包車漫遊為主要交通方式。",
    highlights: [
      { name: "東清灣拼板舟與日出曙光", intro: "全臺灣最早迎接第一道曙光的港灣，達悟族紅白黑圖騰拼板舟整齊停泊礫石海灘。", googleMapsQuery: "東清灣 拼板舟" },
      { name: "野銀部落傳統地下屋聚落", intro: "全島保存最完整的達悟族傳統地下屋聚落，兼具防風防震防暑智慧，冬暖夏涼。", googleMapsQuery: "野銀地下屋" },
      { name: "東清秘境天然珊瑚海蝕池", intro: "隱藏在海蝕珊瑚礁岩裂縫中的天然海水泳池，陽光灑落水面如碧綠寶石清澈通透。", googleMapsQuery: "東清秘境" },
      { name: "蘭嶼氣象站 360 度觀景制高點", intro: "日治時期白色氣象站古蹟，座落全島公路制高點，眺望東清灣與八代灣山海壯景。", googleMapsQuery: "蘭嶼氣象站" },
      { name: "青青草原夕陽日落晚霞", intro: "島嶼最南端延伸至海崖的寬廣綠茵草原，俯瞰小蘭嶼與欣賞太平洋浩瀚夕陽夕照。", googleMapsQuery: "蘭嶼青青草原" },
      { name: "開元港舊燈塔白色懸崖步道", intro: "沿著海崖階梯直登白色舊燈塔遺址，俯瞰清澈見底的藍綠如果凍般海水與峽灣。", googleMapsQuery: "開元港舊燈塔" },
      { name: "大天池森林火山口湖秘境", intro: "原始熱帶雨林深處的火山口雨水湖，枯木倒影與原始森林相映，宛如阿凡達秘境。", googleMapsQuery: "蘭嶼大天池" },
      { name: "雙獅岩與軍艦岩海岸奇石", intro: "火山集塊岩經大自然風化海蝕形成兩隻栩栩如生對峙雄獅，為東清朗島部落界石。", googleMapsQuery: "雙獅岩" }
    ],
    tourismFactories: [
      { name: "蘭嶼文物館（達悟海洋文化工坊）", intro: "完整展示百年達悟族拼板舟造舟工藝、傳統丁字褲、傳統十合一地下屋與藤編技藝。", googleMapsQuery: "蘭嶼文物館" },
      { name: "野銀地下屋文化傳承導覽工坊", intro: "由在地達悟族耆老帶領走入歷史主屋、涼台與靠背石，聆聽達悟族生活哲學。", googleMapsQuery: "野銀地下屋導覽" },
      { name: "朗島部落手作工坊與飛魚文創館", intro: "親手體驗達悟族傳統琉璃串珠飾品、雕刻拼板舟木雕模型與手作傳統編織。", googleMapsQuery: "朗島部落工坊" }
    ],
    accommodations: [
      { name: "蘭嶼墨泥黑舍 Meni Guest House", type: "現代黑白設計", description: "紅頭村質感設計旅宿，極簡風格融入達悟文化元素，提供特色精緻早餐。", googleMapsQuery: "蘭嶼墨泥黑舍" },
      { name: "天空的眼睛（生態海景綠建築）", type: "海景綠建築", description: "東清灣山坡上全天然建材打造，夜間聽濤觀看銀河繁星，與自然和諧共存。", googleMapsQuery: "蘭嶼 天空的眼睛" },
      { name: "野銀地下屋百年傳統民宿", type: "原民文化體驗", description: "夜宿達悟族傳統地下屋旁，親身體驗最深度的南島原住民生活作息與星空。", googleMapsQuery: "野銀 民宿" },
      { name: "蘭嶼藍海屋潛水渡假村", type: "潛水渡假", description: "紅頭部落海景第一排，配備專業 PADI 潛水中心與寬敞舒適海景套房。", googleMapsQuery: "蘭嶼藍海屋潛水渡假村" }
    ],
    famousFood: ["達悟族酥炸飛魚乾", "飛魚卵香腸與飛魚炒飯", "純天然林投果現打冰沙", "傳統水芋起司派", "無餓不坐原民特色風味餐"],
    svgCoords: { x: 725, y: 915 }
  },
  {
    name: "琉球嶼",
    lat: 22.342,
    lng: 120.370,
    agriculture: "野生土芒果、林投果、小琉球地瓜、野生海菜、洛神花",
    fishery: "東港琉球鬼頭刀、現撈黑鮪魚、櫻花蝦、飛魚、九孔、海石花菜",
    livestock: "小琉球跑山土雞、天然放牧黑山羊",
    description: "臺灣唯一的珊瑚礁離島，隸屬於屏東縣琉球鄉，俗稱『小琉球』。全島被溫暖清澈的玻璃海與壯麗珊瑚礁群環繞，是全臺灣綠蠵龜棲息密度最高的保育勝地。代表性地標花瓶岩、天然珊瑚石灰岩穴美人洞與望海亭、原始熱帶林相山豬溝、傳奇海蝕洞烏鬼洞與無敵夕陽落日亭，為旅人帶來最慢活的海島奇幻假期。",
    region: "離島",
    islandNotice: "【離島交通方式】琉球嶼（小琉球）往返臺灣本島主要由屏東東港渡船碼頭（東港漁港）搭乘交通客船，直達小琉球白沙觀光港或大福漁港。民營客輪（東琉線聯營處、泰富航運、藍白航運、大福航運）航程僅約 20~25 分鐘，班次密集便利；亦有公營交通船（航程約 35~40 分鐘）。自駕旅客可導航至東港碼頭周邊停車場；大眾運輸可由高鐵左營站或高雄火車站搭乘「台灣好行大鵬灣琉球線（9127D）」直達東港碼頭。島上環島公路全長約 18 公里，以租賃電動機車（Gogoro/綠能機車）、燃油機車或搭乘環島接駁公車漫遊最為推薦。",
    highlights: [
      { name: "花瓶岩（花瓶石）風景區", intro: "小琉球最具代表性之珊瑚礁地標與浮潛勝地，岩頂長滿盒果藤如花瓶，清澈玻璃海隨處可見綠蠵龜悠游伴游。", googleMapsQuery: "小琉球花瓶岩" },
      { name: "美人洞與望海亭珊瑚礁步道", intro: "曲徑通幽之高位珊瑚礁石灰岩穴步道，擁有奇岩怪石十三景；高處望海亭居高臨下俯瞰清澈礁海，是觀察野生綠蠵龜探頭換氣之全島最佳制高點。", googleMapsQuery: "小琉球美人洞" },
      { name: "山豬溝生態步道", intro: "保留全島最完整熱帶珊瑚礁植群與原始林相，木棧道穿梭於一線天峽谷、防空洞與百年雀榕巨石氣根間，綠意盎然如侏儸紀秘境。", googleMapsQuery: "山豬溝生態步道" },
      { name: "烏鬼洞珊瑚礁岩穴迷宮", intro: "大自然鬼斧神工的珊瑚礁岩洞穴迷宮與歷史傳聞勝地，沿海濱木棧道漫步至觀海落日涼亭，傍晚海浪激石晚霞極美。", googleMapsQuery: "烏鬼洞" },
      { name: "蛤板灣（威尼斯沙灘）", intro: "小琉球島上少見綿延約百公尺的純白貝殼白砂海灘，弧形優美，赤腳漫步踏浪迎風，為欣賞夕陽落日暮色之絕佳私房景點。", googleMapsQuery: "蛤板灣" },
      { name: "落日亭與厚石裙礁", intro: "島嶼西南懸崖落日亭坐擁無邊際臺灣海峽海天一色與壯麗夕陽；下方厚石裙礁為百公尺天然海蝕平台與紅番石、觀音石奇岩。", googleMapsQuery: "小琉球落日亭" },
      { name: "龍蝦洞天然海蝕溝", intro: "海水侵蝕形成的壯麗海蝕溝地形，潮水湧入壺穴浪花飛濺激盪，更是近年熱門之綠蠵龜覓食觀察點與網美打卡秘境。", googleMapsQuery: "龍蝦洞" },
      { name: "鹿粼梅花鹿園區", intro: "屏東離島特色萌寵主題園區，近距離親手餵食梅花鹿、水豚君與可愛動物互動，老少咸宜之寓教於樂好去處。", googleMapsQuery: "鹿粼梅花鹿園區" }
    ],
    tourismFactories: [
      { name: "小琉球遊客中心與海洋環境保育展示館", intro: "深入認識小琉球珊瑚礁地質成因、海龜產卵生態保護、減塑海洋友善與低碳島嶼永續旅遊知識。", googleMapsQuery: "小琉球遊客中心" },
      { name: "小琉球麻花捲手作體驗觀光坊", intro: "傳承在地數十年手工烘炸工藝，親手體驗將麵糰搓捻成麻花狀並裹上黑糖、海苔等香酥糖霜伴手禮。", googleMapsQuery: "小琉球麻花捲" },
      { name: "小琉球綠蠵龜友善潛水體驗中心", intro: "由專業PADI認證教練帶領，宣導使用海洋友善防曬，體驗浮潛、深潛或SUP立槳與野生綠蠵龜同游。", googleMapsQuery: "小琉球 浮潛 綠蠵龜" }
    ],
    accommodations: [
      { name: "小琉球地中海海景渡假旅店", type: "希臘海景城堡", description: "希臘地中海藍白風情建築，座落海景第一排，無邊際觀海泡水池與大片落地窗夕陽海景。", googleMapsQuery: "小琉球地中海海景渡假旅店" },
      { name: "南洋渡假莊園", type: "峇里島風Villa", description: "座落大福高地，充滿熱帶椰林與南洋峇里島風情渡假Villa，俯瞰遼闊海平線，靜謐悠閒。", googleMapsQuery: "南洋渡假莊園" },
      { name: "朵貓貓海景民宿", type: "北歐海景草坪", description: "極簡純白現代風格，客房大面採光直視蔚藍大海，附設戶外大草坪適合觀星放空。", googleMapsQuery: "朵貓貓海景民宿" },
      { name: "琉球茶苑精品民宿", type: "日系清水模茶禪", description: "現代清水模建築融入日系茶道美學，鬧中取靜，提供頂級精緻早餐與慢活海島氛圍。", googleMapsQuery: "琉球茶苑" },
      { name: "尊順祿藝術旅店", type: "奇幻彩色城堡", description: "西班牙高第建築風格，七彩馬賽克磁磚拼貼童話城堡，房型附專屬造型泳池與按摩浴缸。", googleMapsQuery: "小琉球尊順祿藝術民宿" }
    ],
    famousFood: ["小琉球手工麻花捲", "柴燒相思麵配炭烤滷味", "東港琉球現煎鬼頭刀魚卵", "小琉球海龜燒小蛋糕", "琉球特製古早味香腸", "起司牛肉捲與爆漿黑糖包"],
    svgCoords: { x: 360, y: 815 }
  }
];
