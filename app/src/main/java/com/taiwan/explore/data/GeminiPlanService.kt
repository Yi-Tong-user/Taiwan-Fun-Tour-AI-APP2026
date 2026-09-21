package com.taiwan.explore.data

import com.taiwan.explore.model.Accommodation
import com.taiwan.explore.model.DayItinerary
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.model.PlannedSpot
import com.taiwan.explore.model.Spot
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

data class IslandTransportCapability(
    val hasBoat: Boolean,
    val hasFlight: Boolean,
    val boatDescription: String,
    val flightDescription: String,
    val recommendedMainlandToIsland: String,
    val lastFerryFlightAdvice: String
)

class GeminiPlanService {

    companion object {
        fun getIslandCapability(cityName: String): IslandTransportCapability? {
            return when {
                cityName.contains("琉球") || cityName.contains("小琉球") -> IslandTransportCapability(
                    hasBoat = true,
                    hasFlight = false,
                    boatDescription = "屏東東港碼頭／鹽埔碼頭搭乘高速客輪（船程約 20-25 分鐘，抵達白沙尾或大福港）",
                    flightDescription = "琉球嶼為全珊瑚礁島嶼無商用民航客機，若搭機需飛抵高雄小港機場再轉乘接駁車至東港碼頭登船",
                    recommendedMainlandToIsland = "建議搭乘高鐵至左營站，轉乘「台灣好行大鵬灣琉球線 9127D」至東港碼頭，搭乘高速客輪抵達小琉球。",
                    lastFerryFlightAdvice = "【琉球嶼返程重要時效建議】琉球嶼（白沙尾港／大福港）返回屏東東港之末班客輪通常約在 17:00 ~ 17:30 開航（遇假日人潮機動加班），一日遊或旅程最後一天請務必於 16:30 前抵達碼頭排隊候船，回到東港後可轉乘「台灣好行大鵬灣琉球線」接駁至左營高鐵站返程。"
                )
                cityName.contains("澎湖") -> IslandTransportCapability(
                    hasBoat = true,
                    hasFlight = true,
                    boatDescription = "嘉義布袋港或高雄港搭乘高速客輪直達馬公商港（布袋航程約 80 分鐘）",
                    flightDescription = "台北松山、台中、台南、高雄直飛馬公澎湖機場（飛行約 45-55 分鐘）",
                    recommendedMainlandToIsland = "建議搭乘國內班機直飛澎湖機場，或由嘉義布袋港搭乘高速客輪前往。",
                    lastFerryFlightAdvice = "【澎湖返程重要時效建議】搭乘班機返程請務必於起飛前 60 分鐘抵達馬公澎湖機場劃位；若搭乘布袋客輪末班船多為 16:00 ~ 16:30，請提前 40 分鐘至馬公商港報到候船。"
                )
                cityName.contains("金門") -> IslandTransportCapability(
                    hasBoat = false,
                    hasFlight = true,
                    boatDescription = "臺灣本島至金門目前無定期直達客輪（多為小三通金廈航線）",
                    flightDescription = "台北松山、台中、嘉義、台南、高雄直飛金門尚義機場（飛行約 55-65 分鐘）",
                    recommendedMainlandToIsland = "臺灣本島至金門建議搭乘國內班機直達金門尚義機場，島上租用機車或汽車自由行。",
                    lastFerryFlightAdvice = "【金門返程重要時效建議】搭乘班機返程請務必於起飛前 60 分鐘抵達金門尚義機場辦理登機劃位與行李託運手續。"
                )
                cityName.contains("連江") || cityName.contains("馬祖") -> IslandTransportCapability(
                    hasBoat = true,
                    hasFlight = true,
                    boatDescription = "基隆港搭乘「新臺馬輪」夜航或日航至南竿福澳港或東引中柱港",
                    flightDescription = "台北松山、台中直飛南竿機場或北竿機場（飛行約 50 分鐘）",
                    recommendedMainlandToIsland = "建議搭乘立榮航空直飛南竿/北竿，或體驗基隆夜航新臺馬輪清晨抵達馬祖。",
                    lastFerryFlightAdvice = "【馬祖返程重要時效建議】馬祖易受海霧影響班機起降，返程請隨時關注航班動態並提早 60 分鐘至南竿或北竿機場候機；若搭船返基隆請提早至南竿福澳港換票登船。"
                )
                cityName.contains("綠島") -> IslandTransportCapability(
                    hasBoat = true,
                    hasFlight = true,
                    boatDescription = "台東富岡漁港搭乘客輪直達綠島南寮漁港（航程約 50 分鐘）",
                    flightDescription = "台東豐年機場搭乘德安航空 19 人座客機直飛綠島航空站（航程約 15 分鐘）",
                    recommendedMainlandToIsland = "建議搭火車至台東站轉搭客運至富岡漁港搭乘高速客輪前往。",
                    lastFerryFlightAdvice = "【綠島返程重要時效建議】綠島返回台東之末班客輪通常約為 16:30（飛機末班約 16:00），一日遊旅客最晚需於 15:50 前抵達南寮漁港換票登船。"
                )
                cityName.contains("蘭嶼") -> IslandTransportCapability(
                    hasBoat = true,
                    hasFlight = true,
                    boatDescription = "台東富岡漁港或屏東後壁湖漁港搭乘客輪至蘭嶼開元港（航程約 2-2.5 小時）",
                    flightDescription = "台東豐年機場搭乘德安航空直飛蘭嶼航空站（航程約 25 分鐘）",
                    recommendedMainlandToIsland = "建議由台東富岡港或墾丁後壁湖搭乘客輪前往，亦可提早預訂台東出發之小型班機。",
                    lastFerryFlightAdvice = "【蘭嶼返程重要時效建議】蘭嶼返回本島客輪末班船通常約為 15:30（飛機末班約 16:00），一日遊旅客務必留意開元港集合登船時間。"
                )
                else -> null
            }
        }

        fun getTransitWarning(cityName: String, transport: String): String? {
            val islandCap = getIslandCapability(cityName)
            if (islandCap != null) {
                // Island destinations
                if (transport == "飛機往返" && !islandCap.hasFlight) {
                    return "⚠️ 琉球嶼（小琉球）全島為珊瑚礁地形無民航客機機場，無法直接搭乘飛機抵達。已為您優先規劃由高鐵左營站／台鐵潮州站銜接「屏東東港客輪」（航程約 20 分鐘）登島；島內交通建議租用機車自由行或搭乘環島公車。"
                }
                if (transport == "輪船接駁" && !islandCap.hasBoat) {
                    return "⚠️ 臺灣本島至金門目前無定期客運船班，建議搭乘國內班機直達金門尚義機場（飛行約 55 分鐘），島上推薦租用機車或自駕汽車。"
                }
                if (transport == "自行開車" || transport == "騎乘機車" || transport == "自行車漫遊") {
                    return "💡 提示：前往離島跨海行程，本島車輛通常無法直接駛達，建議搭乘渡輪或航班抵達後，在島上租用機車、自駕汽車或搭乘環島公車暢遊。"
                }
            } else {
                // Mainland destinations
                if (transport == "輪船接駁" || transport == "飛機往返") {
                    return "💡 提示：本島縣市陸路交通便捷，已為您依所選城市規劃順暢動線，建議改以「自行開車」或「大眾運輸（高鐵/臺鐵/公車）」旅遊最為便利。"
                }
            }
            return null
        }

        fun mapTransportMode(transport: String): String {
            return when (transport) {
                "騎乘機車" -> "scooter"
                "大眾運輸" -> "transit"
                "自行車漫遊" -> "bike"
                "輪船接駁" -> "boat"
                "飛機往返" -> "flight"
                else -> "car"
            }
        }

        fun mapGoogleMapsTravelMode(transport: String): String {
            return when (transport) {
                "騎乘機車" -> "two_wheeler"
                "大眾運輸" -> "transit"
                "自行車漫遊" -> "bicycling"
                else -> "driving"
            }
        }
    }

    suspend fun generateItinerary(
        cityName: String,
        days: Int,
        style: String,
        transport: String,
        stayPreference: String = "經典舒適",
        keepSameHotel: Boolean = true,
        userOrigin: String? = null
    ): ItineraryPlan = withContext(Dispatchers.IO) {
        val city = TaiwanDataProvider.getCityByName(cityName)
            ?: TaiwanDataProvider.cities.first()

        val styleConnotation = when (style) {
            "休閒遊憩" -> "休閒放鬆、度假勝地、景觀莊園與慢活步調為主，輕鬆舒適無負擔"
            "文化生活" -> "走訪歷史古蹟、文創園區、地方博物館與傳統聚落，深度體驗在地人文底蘊"
            "戶外漫遊" -> "親近自然山林、海岸步道、國家公園與生態秘境，享受踏青探索之美"
            "美食尋味" -> "深入在地經典老店、米其林小吃、傳統菜市場與觀光夜市，每趟行程至少安排兩間以上代表性美食或夜市市場巡禮"
            else -> style
        }

        // Build prompt enforcing strict JSON output and the 2+ food spots rule for gourmet style
        val prompt = """
            你是一位專門規劃台灣旅遊的行程專家與助手。
            請針對【${city.name}】規劃 ${days} 天的深度且順向的完整行程。
            旅遊風格：${style}（核心意涵：${styleConnotation}）
            交通方式：${transport}
            ${if (days > 1) "住宿偏好：$stayPreference （${if (days >= 3) if (keepSameHotel) "旅客希望維持同一間住宿" else "旅客希望體驗不同住宿" else "請安排適合之住宿"}）" else "一日遊無需住宿安排"}
            
            重要規劃原則：
            1. 行程不可只局限於市中心，必須穿插非市中心的在地行政區（例如：${city.districts.take(6).joinToString("、")}等）。
            2. 景點之間的動線必須高度順向，相鄰兩點車程原則在 15-30 分鐘內，嚴禁折返跑。
            3. ${if (days > 1) "隔天出發的第一個景點，與前一晚的住宿地點車程需在 30 分鐘以內。" else ""}
            4. 每天安排 3~4 個主要景點，且必須考量營業時間與在地特色。
            5. 【特別嚴格規範】若旅遊風格為「美食尋味」，每一天的行程中必須安排至少 2 間以上在地排隊美食、傳統菜市場或觀光夜市（例如：傳統市場、夜市巡禮、知名老店小吃、在地農漁特產特色餐飲）！
            6. 交通工具請緊扣旅客選擇之「${transport}」規劃動線、距離與時間估算。
            7. 在第 ${days} 天結束時（或一日遊結束），必須給予具體返程交通建議${if (city.region == "離島") "（離島請務必詳細載明返程末班船或末班航班時間建議，提醒提早候船登機）" else "（如高鐵/台鐵/客運班次或國道指引）"}。
            
            輸出規則：
            1. 必須輸出符合標準 JSON 格式的內容，嚴禁包含 markdown 代碼標籤（如 ```json）或任何額外文字。
            2. JSON 結構：
            {
              "title": "${city.name} ${days}日・${style}",
              "returnTransitGuide": "建議可搭乘高鐵/台鐵或經由國道返程，車程約...",
              "days": [
                {
                  "dayNumber": 1,
                  "dateLabel": "第 1 天",
                  "title": "主題名稱",
                  "theme": "${style}",
                  "spots": [
                    {
                      "time": "09:30 - 11:30",
                      "name": "景點名稱",
                      "intro": "特色簡介與在地亮點",
                      "duration": "2 小時",
                      "transportToNext": "開車約 15 分鐘",
                      "googleMapsKeyword": "${city.name} 景點名稱"
                    }
                  ]
                }
              ]
            }
        """.trimIndent()

        // Check if API key is present
        val apiKey = try {
            val buildConfigClass = Class.forName("com.taiwan.explore.BuildConfig")
            val field = buildConfigClass.getField("GEMINI_API_KEY")
            field.get(null) as? String ?: ""
        } catch (e: Exception) {
            ""
        }

        if (apiKey.isNotEmpty() && apiKey != "your_api_key_here") {
            try {
                val responseJson = callGeminiRestApi(apiKey, prompt)
                val parsed = parsePlanJson(responseJson, city.name, days, style, city.islandNotice, keepSameHotel, stayPreference, userOrigin, transport)
                if (parsed != null) return@withContext parsed
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // Fallback to high-quality curated itinerary based on the city's verified local highlights
        return@withContext generateCuratedPlan(city.name, days, style, stayPreference, keepSameHotel, city.islandNotice, userOrigin, transport)
    }

    private fun callGeminiRestApi(apiKey: String, prompt: String): String {
        val endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"
        val url = URL(endpoint)
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("Content-Type", "application/json")
        conn.doOutput = true

        val requestBody = JSONObject().apply {
            val contents = org.json.JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", org.json.JSONArray().apply {
                        put(JSONObject().apply {
                            put("text", prompt)
                        })
                    })
                })
            }
            put("contents", contents)
            put("generationConfig", JSONObject().apply {
                put("responseMimeType", "application/json")
                put("temperature", 0.7)
            })
        }

        OutputStreamWriter(conn.outputStream).use { it.write(requestBody.toString()) }

        val responseText = conn.inputStream.bufferedReader().use { it.readText() }
        val root = JSONObject(responseText)
        val candidates = root.getJSONArray("candidates")
        val firstCandidate = candidates.getJSONObject(0)
        val content = firstCandidate.getJSONObject("content")
        val parts = content.getJSONArray("parts")
        return parts.getJSONObject(0).getString("text")
    }

    private fun parsePlanJson(
        jsonString: String,
        cityName: String,
        daysCount: Int,
        style: String,
        islandNotice: String?,
        keepSameHotel: Boolean,
        stayPreference: String,
        userOrigin: String?,
        transport: String = "自行開車"
    ): ItineraryPlan? {
        try {
            val cleaned = jsonString.trim().removePrefix("```json").removePrefix("```").removeSuffix("```").trim()
            val obj = JSONObject(cleaned)
            val title = obj.optString("title", "$cityName $daysCount 日遊・$style")
            val city = TaiwanDataProvider.getCityByName(cityName)
            val isIsland = city?.region == "離島"
            val islandCap = getIslandCapability(cityName)

            val returnTransitGuide = obj.optString("returnTransitGuide", if (isIsland) {
                islandCap?.lastFerryFlightAdvice ?: "離島旅程圓滿結束！建議提早 1 小時前往機場或碼頭完成登機/登船手續，並確認當日天候與班次狀態。"
            } else {
                "旅程結束後，建議可搭乘大眾運輸或行經國道返回，祝您旅途平安！"
            })

            val daysArray = obj.getJSONArray("days")
            val daysList = mutableListOf<DayItinerary>()

            val matchingHotel = city?.accommodations?.find {
                when {
                    stayPreference.contains("尊榮") || stayPreference.contains("奢華") -> it.tier == "luxury"
                    stayPreference.contains("小資") || stayPreference.contains("經濟") -> it.tier == "budget"
                    else -> it.tier == "standard"
                }
            } ?: city?.accommodations?.firstOrNull()

            val spotTransportMode = mapTransportMode(transport)

            for (i in 0 until daysArray.length()) {
                val dayObj = daysArray.getJSONObject(i)
                val dayNum = dayObj.optInt("dayNumber", i + 1)
                val dateLabel = dayObj.optString("dateLabel", "第 $dayNum 天")
                val dayTitle = dayObj.optString("title", "精彩體驗行程")
                val dayTheme = dayObj.optString("theme", style)
                val spotsArray = dayObj.getJSONArray("spots")
                val spotsList = mutableListOf<PlannedSpot>()

                for (j in 0 until spotsArray.length()) {
                    val sObj = spotsArray.getJSONObject(j)
                    spotsList.add(
                        PlannedSpot(
                            time = sObj.optString("time", "10:00 - 12:00"),
                            name = sObj.optString("name", "推薦景點"),
                            intro = sObj.optString("intro", "在地推薦熱門好去處。"),
                            duration = sObj.optString("duration", "1.5 小時"),
                            transportToNext = sObj.optString("transportToNext", "前往下一站約 15 分鐘"),
                            googleMapsKeyword = sObj.optString("googleMapsKeyword", "${cityName} " + sObj.optString("name", "")),
                            transportMode = spotTransportMode
                        )
                    )
                }

                // Decide stay hotel (last day does NOT show accommodation)
                val stay = if (daysCount > 1 && i < daysCount - 1) {
                    if (keepSameHotel) {
                        matchingHotel
                    } else {
                        city?.accommodations?.getOrNull(i % (city.accommodations.size.coerceAtLeast(1))) ?: matchingHotel
                    }
                } else null

                // Build multi-stop route url with userOrigin & stayHotel
                val multiRouteUrl = buildMultiStopRouteUrl(
                    spots = spotsList,
                    userOrigin = if (i == 0) userOrigin else null,
                    stayHotel = stay,
                    transport = transport
                )

                daysList.add(
                    DayItinerary(
                        dayNumber = dayNum,
                        dateLabel = dateLabel,
                        title = dayTitle,
                        theme = dayTheme,
                        spots = spotsList,
                        stayHotel = stay,
                        multiStopRouteUrl = multiRouteUrl ?: ""
                    )
                )
            }

            // Return navigation URL from last spot
            val lastSpot = daysList.lastOrNull()?.spots?.lastOrNull()
            val travelMode = mapGoogleMapsTravelMode(transport)
            val returnNavUrl = if (lastSpot != null) {
                val dest = if (!userOrigin.isNullOrBlank()) userOrigin else "${cityName}車站"
                "https://www.google.com/maps/dir/?api=1&origin=${URLEncoder.encode(lastSpot.googleMapsKeyword, "UTF-8")}&destination=${URLEncoder.encode(dest, "UTF-8")}&travelmode=$travelMode"
            } else null

            val transitWarning = getTransitWarning(cityName, transport)

            return ItineraryPlan(
                title = title,
                cityName = cityName,
                daysCount = daysCount,
                style = style,
                days = daysList,
                islandNotice = islandNotice,
                returnNavigationUrl = returnNavUrl,
                returnTransitGuide = returnTransitGuide,
                transitWarning = transitWarning,
                selectedTransport = transport,
                isIsland = isIsland
            )
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    private fun generateCuratedPlan(
        cityName: String,
        days: Int,
        style: String,
        stayPreference: String,
        keepSameHotel: Boolean,
        islandNotice: String?,
        userOrigin: String?,
        transport: String = "自行開車"
    ): ItineraryPlan {
        val city = TaiwanDataProvider.getCityByName(cityName)
            ?: TaiwanDataProvider.cities.first()

        val isIsland = city.region == "離島"
        val islandCap = getIslandCapability(cityName)
        val dayList = mutableListOf<DayItinerary>()
        val highlights = city.highlights
        val totalHighlights = highlights.size

        // Select hotel matching stay preference if possible
        val matchingHotel = city.accommodations.find {
            when {
                stayPreference.contains("尊榮") || stayPreference.contains("奢華") -> it.tier == "luxury"
                stayPreference.contains("小資") || stayPreference.contains("經濟") -> it.tier == "budget"
                else -> it.tier == "standard"
            }
        } ?: city.accommodations.firstOrNull()

        val spotTransportMode = mapTransportMode(transport)

        // Separate food-related highlights for "美食尋味"
        val foodHighlights = highlights.filter { isFoodRelated(it.name, it.intro) }
        val nonFoodHighlights = highlights.filter { !isFoodRelated(it.name, it.intro) }

        // Time-based offset ensures regeneration visits different attractions & districts
        val offset = ((System.currentTimeMillis() / 1000) % totalHighlights.coerceAtLeast(1)).toInt()

        for (d in 1..days) {
            val spotsForDay = mutableListOf<PlannedSpot>()
            val timeSlots = listOf("09:30 - 11:30", "12:00 - 14:00", "15:00 - 17:00", "18:00 - 20:30")

            val daySpotsList: List<Spot> = if (style == "美食尋味") {
                // Guaranteed at least 2 food-related spots, markets, or night markets
                val pickedFood = mutableListOf<Spot>()
                if (foodHighlights.isNotEmpty()) {
                    val fIndex1 = (offset + (d - 1) * 2) % foodHighlights.size
                    pickedFood.add(foodHighlights[fIndex1])
                    val fIndex2 = (offset + (d - 1) * 2 + 1) % foodHighlights.size
                    if (foodHighlights.size > 1) {
                        pickedFood.add(foodHighlights[fIndex2])
                    }
                }
                // If fewer than 2 food highlights in data, complement with city famousFood or night market
                while (pickedFood.size < 2) {
                    val foodName = city.famousFood.getOrNull(pickedFood.size) ?: "在地特色風味小吃"
                    pickedFood.add(
                        Spot(
                            name = "${city.name}${foodName}巡禮",
                            intro = "走訪在地傳統市場與知名老店，品嚐最道地的${foodName}及人氣名產。",
                            googleMapsQuery = "${city.name} $foodName",
                            district = city.districts.firstOrNull() ?: city.name,
                            openingHours = "10:30 - 21:00",
                            startHour = 10,
                            endHour = 21
                        )
                    )
                }
                // Plus 1 cultural or scenic spot for balance
                val otherSpot = (if (nonFoodHighlights.isNotEmpty()) nonFoodHighlights else highlights)[(offset + d) % (if (nonFoodHighlights.isNotEmpty()) nonFoodHighlights.size else highlights.size)]
                listOf(pickedFood[0], otherSpot, pickedFood[1])
            } else {
                val startIndex = (offset + (d - 1) * 3) % totalHighlights
                listOf(
                    highlights[startIndex],
                    highlights[(startIndex + 1) % totalHighlights],
                    highlights[(startIndex + 2) % totalHighlights]
                )
            }

            for (s in 0 until 3) {
                val sourceSpot = daySpotsList[s]
                val nextSpot = daySpotsList[(s + 1) % daySpotsList.size]

                val transitText = getTransportDescription(transport, sourceSpot.name, nextSpot.name, s == 2)

                spotsForDay.add(
                    PlannedSpot(
                        time = timeSlots.getOrElse(s) { "14:00 - 16:00" },
                        name = sourceSpot.name,
                        intro = "${sourceSpot.intro}（位於${sourceSpot.districts.firstOrNull() ?: city.name}）",
                        duration = "約 1.5 - 2 小時",
                        transportToNext = transitText,
                        googleMapsKeyword = sourceSpot.googleMapsQuery,
                        transportMode = spotTransportMode
                    )
                )
            }

            // Decide stay hotel (last day does NOT show accommodation)
            val stayHotel = if (days > 1 && d < days) {
                if (keepSameHotel) {
                    matchingHotel
                } else {
                    city.accommodations.getOrNull((d - 1 + offset) % city.accommodations.size) ?: matchingHotel
                }
            } else null

            val multiRouteUrl = buildMultiStopRouteUrl(
                spots = spotsForDay,
                userOrigin = if (d == 1) userOrigin else null,
                stayHotel = stayHotel,
                transport = transport
            )

            dayList.add(
                DayItinerary(
                    dayNumber = d,
                    dateLabel = "第 $d 天",
                    title = when (d) {
                        1 -> if (style == "美食尋味") "${city.name}必吃老店與特色小吃巡禮" else "${city.name}經典風華巡禮"
                        2 -> if (style == "美食尋味") "傳統菜市場古早味與名產深度尋味" else "山海風貌與在地文化深度漫遊"
                        3 -> if (style == "美食尋味") "觀光夜市美饌與特色餐廳品味" else "在地工藝走讀與特色景觀體驗"
                        4 -> "秘境探幽與自然生態漫步"
                        else -> "慢活悠閒品味與名產伴手禮探訪"
                    },
                    theme = style,
                    spots = spotsForDay,
                    stayHotel = stayHotel,
                    multiStopRouteUrl = multiRouteUrl ?: ""
                )
            )
        }

        val lastSpot = dayList.lastOrNull()?.spots?.lastOrNull()
        val travelMode = mapGoogleMapsTravelMode(transport)
        val returnNavUrl = if (lastSpot != null) {
            val dest = if (!userOrigin.isNullOrBlank()) userOrigin else "${city.name}高鐵/臺鐵站"
            "https://www.google.com/maps/dir/?api=1&origin=${URLEncoder.encode(lastSpot.googleMapsKeyword, "UTF-8")}&destination=${URLEncoder.encode(dest, "UTF-8")}&travelmode=$travelMode"
        } else null

        val returnGuide = if (isIsland) {
            islandCap?.lastFerryFlightAdvice
                ?: "離島旅程圓滿結束！建議提早 1 小時前往機場或碼頭完成登機/登船手續，並確認當日天候與海象班次狀態。"
        } else {
            "旅程完美結束！推薦可直接由「${lastSpot?.name ?: city.name}」導航前往鄰近之國道交流道或高鐵/臺鐵站，順暢返程回家。"
        }

        val transitWarning = getTransitWarning(cityName, transport)

        return ItineraryPlan(
            title = "${city.name} ${days}日遊・$style",
            cityName = city.name,
            daysCount = days,
            style = style,
            days = dayList,
            islandNotice = islandNotice,
            returnNavigationUrl = returnNavUrl,
            returnTransitGuide = returnGuide,
            transitWarning = transitWarning,
            selectedTransport = transport,
            isIsland = isIsland
        )
    }

    private fun isFoodRelated(name: String, intro: String): Boolean {
        val keywords = listOf(
            "夜市", "市場", "老街", "美食", "小吃", "早餐", "海鮮", "海產", "牛肉湯", "肉圓", "麻糬",
            "芋頭", "包子", "農產", "茶", "蓮子", "伴手禮", "麻花捲", "蜂巢蝦", "相思麵", "飯", "麵",
            "香腸", "鴨肉", "火雞肉", "臭豆腐", "潤餅", "甜不辣", "米糕", "碗粿", "糕點", "排骨",
            "肉粽", "冰", "豆花", "餐廳", "名產", "料理", "甜點"
        )
        return keywords.any { name.contains(it) || intro.contains(it) }
    }

    private fun getTransportDescription(transport: String, fromName: String, toName: String, isLast: Boolean): String {
        return when (transport) {
            "騎乘機車" -> if (!isLast) "🛵 騎乘機車約 10-15 分鐘（車程約 4.5 公里）抵達「$toName」" else "🛵 晚間騎乘機車前往在地小吃或下榻處（約15分鐘）"
            "大眾運輸" -> if (!isLast) "🚆 搭乘市區公車/客運約 20-25 分鐘抵達「$toName」" else "🚆 搭乘大眾運輸前往夜市或住宿地點（約25分鐘）"
            "自行車漫遊" -> if (!isLast) "🚲 自行車漫遊約 25-35 分鐘（車程約 4.5 公里）抵達「$toName」" else "🚲 自行車悠活漫步返回下榻處休憩（約30分鐘）"
            "輪船接駁" -> if (!isLast) "🚢 搭乘客輪/渡輪前往「$toName」（航程約 20 分鐘）" else "🚢 晚間漫步港口周邊或返回旅宿（約15分鐘）"
            "飛機往返" -> if (!isLast) "✈️ 國內班機抵達後接駁約 20 分鐘至「$toName」" else "✈️ 前往下榻處辦理入住休憩（車程約20分鐘）"
            else -> if (!isLast) "🚗 開車自駕約 15-20 分鐘（車程約 4.5 公里）抵達「$toName」" else "🚗 晚間開車前往夜市或下榻處休憩（車程約15分鐘）"
        }
    }

    fun buildMultiStopRouteUrl(
        spots: List<PlannedSpot>,
        userOrigin: String? = null,
        stayHotel: Accommodation? = null,
        transport: String = "自行開車"
    ): String? {
        if (spots.isEmpty()) return null
        val travelMode = mapGoogleMapsTravelMode(transport)

        val origin = if (!userOrigin.isNullOrBlank()) {
            URLEncoder.encode(userOrigin, "UTF-8")
        } else {
            URLEncoder.encode(spots.first().googleMapsKeyword, "UTF-8")
        }

        val destination = if (stayHotel != null) {
            URLEncoder.encode(stayHotel.googleMapsQuery, "UTF-8")
        } else {
            URLEncoder.encode(spots.last().googleMapsKeyword, "UTF-8")
        }

        val waypointSpots = if (stayHotel != null) {
            if (!userOrigin.isNullOrBlank()) spots else spots.drop(1)
        } else {
            if (spots.size > 2) spots.subList(if (!userOrigin.isNullOrBlank()) 0 else 1, spots.size - 1) else emptyList()
        }

        val waypointsParam = if (waypointSpots.isNotEmpty()) {
            "&waypoints=" + waypointSpots.joinToString("|") {
                URLEncoder.encode(it.googleMapsKeyword, "UTF-8")
            }
        } else ""

        return "https://www.google.com/maps/dir/?api=1&origin=$origin&destination=$destination$waypointsParam&travelmode=$travelMode"
    }
}
