package com.taiwan.explore.data

import com.taiwan.explore.model.DayItinerary
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.model.PlannedSpot
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class GeminiPlanService {

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
            "休閒遊憩" -> "休閒放鬆、親子友善、步調舒緩、度假氛圍、室內園區與漫步"
            "文化生活" -> "古蹟巡禮、歷史建築、文創園區、在地工藝、民俗信仰與生活走讀"
            "戶外漫遊" -> "自然生態、步道漫步、國家公園或風景區、山海壯麗景致"
            "美食尋味" -> "在地老店、夜市美饌、農漁特產美食、特色小吃與排隊名店"
            else -> style
        }

        // Build prompt enforcing strict JSON output
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
            5. 在第 ${days} 天結束時，必須給予返程交通建議（如高鐵/台鐵/客運班次或國道指引）。
            
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
                      "intro": "特色簡介與農漁牧亮點",
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
            val returnTransitGuide = obj.optString("returnTransitGuide", "行程結束後，建議可搭乘高鐵、臺鐵或行經國道返程，祝您旅途愉快！")
            val daysArray = obj.getJSONArray("days")
            val daysList = mutableListOf<DayItinerary>()
            val city = TaiwanDataProvider.getCityByName(cityName)

            val matchingHotel = city?.accommodations?.find {
                when {
                    stayPreference.contains("尊榮") || stayPreference.contains("奢華") -> it.tier == "luxury"
                    stayPreference.contains("小資") || stayPreference.contains("經濟") -> it.tier == "budget"
                    else -> it.tier == "standard"
                }
            } ?: city?.accommodations?.firstOrNull()

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
                            googleMapsKeyword = sObj.optString("googleMapsKeyword", "${cityName} " + sObj.optString("name", ""))
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

                // Build multi-stop route url
                val multiRouteUrl = buildMultiStopRouteUrl(spotsList)

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
            val returnNavUrl = if (lastSpot != null) {
                val dest = if (!userOrigin.isNullOrBlank()) userOrigin else "${cityName}車站"
                "https://www.google.com/maps/dir/?api=1&origin=${java.net.URLEncoder.encode(lastSpot.googleMapsKeyword, "UTF-8")}&destination=${java.net.URLEncoder.encode(dest, "UTF-8")}&travelmode=driving"
            } else null

            val transitWarning = if (transport != "自行開車") {
                "旅行規劃部分路線景點距離較遠或無直達班次，無法完全使用您當前選擇的「$transport」旅遊，因此建議改用「自行開車」作為交通工具。"
            } else null

            return ItineraryPlan(
                title = title,
                cityName = cityName,
                daysCount = daysCount,
                style = style,
                days = daysList,
                islandNotice = islandNotice,
                returnNavigationUrl = returnNavUrl,
                returnTransitGuide = returnTransitGuide,
                transitWarning = transitWarning
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

        // Time-based offset ensures regeneration visits different attractions & districts
        val offset = ((System.currentTimeMillis() / 1000) % totalHighlights.coerceAtLeast(1)).toInt()

        for (d in 1..days) {
            val startIndex = (offset + (d - 1) * 3) % totalHighlights
            val spotsForDay = mutableListOf<PlannedSpot>()

            val timeSlots = listOf("09:30 - 11:30", "13:00 - 15:00", "15:30 - 17:30", "18:30 - 20:30")
            for (s in 0 until 3) {
                val spotIndex = (startIndex + s) % totalHighlights
                val sourceSpot = highlights[spotIndex]
                val nextSpot = highlights[(spotIndex + 1) % totalHighlights]

                spotsForDay.add(
                    PlannedSpot(
                        time = timeSlots.getOrElse(s) { "14:00 - 16:00" },
                        name = sourceSpot.name,
                        intro = "${sourceSpot.intro}（位於${sourceSpot.districts.firstOrNull() ?: city.name}）",
                        duration = "約 1.5 - 2 小時",
                        transportToNext = if (s < 2) "開車/大眾運輸約 15-20 分鐘抵達「${nextSpot.name}」" else "晚間漫步夜市或前往下榻處休憩（車程約20分鐘）",
                        googleMapsKeyword = sourceSpot.googleMapsQuery
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

            val multiRouteUrl = buildMultiStopRouteUrl(spotsForDay)

            dayList.add(
                DayItinerary(
                    dayNumber = d,
                    dateLabel = "第 $d 天",
                    title = when (d) {
                        1 -> "${city.name}經典風華巡禮"
                        2 -> "山海風貌與在地美饌深度漫遊"
                        3 -> "在地文化走讀與特色工藝體驗"
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
        val returnNavUrl = if (lastSpot != null) {
            val dest = if (!userOrigin.isNullOrBlank()) userOrigin else "${city.name}高鐵/臺鐵站"
            "https://www.google.com/maps/dir/?api=1&origin=${java.net.URLEncoder.encode(lastSpot.googleMapsKeyword, "UTF-8")}&destination=${java.net.URLEncoder.encode(dest, "UTF-8")}&travelmode=driving"
        } else null

        val returnGuide = if (city.region == "離島") {
            "離島旅程圓滿結束！建議提早 1 小時前往機場或碼頭完成登機/登船手續，並確認當日天候與班次狀態。"
        } else {
            "旅程完美結束！推薦可直接由「${lastSpot?.name ?: city.name}」導航前往鄰近之國道交流道或高鐵/臺鐵站，順暢返程回家。"
        }

        val transitWarning = if (transport != "自行開車") {
            "旅行規劃部分路線景點距離較遠或無直達班次，無法完全使用您當前選擇的「$transport」旅遊，因此建議改用「自行開車」作為交通工具。"
        } else null

        return ItineraryPlan(
            title = "${city.name} ${days}日遊・$style",
            cityName = city.name,
            daysCount = days,
            style = style,
            days = dayList,
            islandNotice = islandNotice,
            returnNavigationUrl = returnNavUrl,
            returnTransitGuide = returnGuide,
            transitWarning = transitWarning
        )
    }

    private fun buildMultiStopRouteUrl(spots: List<PlannedSpot>): String? {
        if (spots.isEmpty()) return null
        if (spots.size == 1) {
            return "https://www.google.com/maps/search/?api=1&query=${java.net.URLEncoder.encode(spots.first().googleMapsKeyword, "UTF-8")}"
        }
        val origin = java.net.URLEncoder.encode(spots.first().googleMapsKeyword, "UTF-8")
        val destination = java.net.URLEncoder.encode(spots.last().googleMapsKeyword, "UTF-8")
        val waypoints = if (spots.size > 2) {
            spots.subList(1, spots.size - 1).joinToString("|") {
                java.net.URLEncoder.encode(it.googleMapsKeyword, "UTF-8")
            }
        } else ""

        return if (waypoints.isNotEmpty()) {
            "https://www.google.com/maps/dir/?api=1&origin=$origin&destination=$destination&waypoints=$waypoints&travelmode=driving"
        } else {
            "https://www.google.com/maps/dir/?api=1&origin=$origin&destination=$destination&travelmode=driving"
        }
    }
}
