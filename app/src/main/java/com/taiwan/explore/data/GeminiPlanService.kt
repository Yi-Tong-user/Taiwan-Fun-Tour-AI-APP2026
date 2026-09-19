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
        specialRequests: String
    ): ItineraryPlan = withContext(Dispatchers.IO) {
        val city = TaiwanDataProvider.getCityByName(cityName)
            ?: TaiwanDataProvider.cities.first()

        // Build prompt enforcing strict JSON output
        val prompt = """
            你是一位專門規劃台灣旅遊的行程專家與助手。
            請針對【${city.name}】規劃 ${days} 天的完整行程。
            旅遊風格：${style}
            交通方式：${transport}
            特別需求：${specialRequests.ifEmpty { "無" }}
            
            輸出規則：
            1. 必須輸出符合標準 JSON 格式的內容，不要包含任何 markdown 代碼標籤（如 ```json）或額外的客套話。
            2. 每天安排 3~4 個主要景點，景點之間的路線需符合地理邏輯，避免折返跑。
            3. 每個景點需包含：時間、景點名稱、特色簡介、建議停留時長、前往下一站的交通方式與預估時間，以及供 Google Maps 導航搜尋的關鍵字。
            
            JSON 結構範例：
            {
              "title": "${city.name} ${days}日經典旅行",
              "days": [
                {
                  "dayNumber": 1,
                  "dateLabel": "第 1 天",
                  "title": "文化慢活探訪",
                  "theme": "古蹟巡禮與在地風情",
                  "spots": [
                    {
                      "time": "09:30 - 11:30",
                      "name": "經典景點名稱",
                      "intro": "特色亮點簡短描述",
                      "duration": "2 小時",
                      "transportToNext": "開車約 15 分鐘",
                      "googleMapsKeyword": "景點搜尋名稱"
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
                val parsed = parsePlanJson(responseJson, city.name, days, style, city.islandNotice)
                if (parsed != null) return@withContext parsed
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // Fallback to high-quality curated itinerary based on the city's verified local highlights
        return@withContext generateCuratedPlan(city.name, days, style, city.islandNotice)
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
        islandNotice: String?
    ): ItineraryPlan? {
        try {
            val cleaned = jsonString.trim().removePrefix("```json").removePrefix("```").removeSuffix("```").trim()
            val obj = JSONObject(cleaned)
            val title = obj.optString("title", "$cityName $daysCount 日遊")
            val daysArray = obj.getJSONArray("days")
            val daysList = mutableListOf<DayItinerary>()

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
                            googleMapsKeyword = sObj.optString("googleMapsKeyword", sObj.optString("name", cityName))
                        )
                    )
                }

                val city = TaiwanDataProvider.getCityByName(cityName)
                val stay = city?.accommodations?.getOrNull(i % (city.accommodations.size.coerceAtLeast(1)))

                daysList.add(
                    DayItinerary(
                        dayNumber = dayNum,
                        dateLabel = dateLabel,
                        title = dayTitle,
                        theme = dayTheme,
                        spots = spotsList,
                        stayHotel = stay
                    )
                )
            }

            return ItineraryPlan(
                title = title,
                cityName = cityName,
                daysCount = daysCount,
                style = style,
                days = daysList,
                islandNotice = islandNotice
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
        islandNotice: String?
    ): ItineraryPlan {
        val city = TaiwanDataProvider.getCityByName(cityName)
            ?: TaiwanDataProvider.cities.first()

        val dayList = mutableListOf<DayItinerary>()
        val highlights = city.highlights
        val totalHighlights = highlights.size

        for (d in 1..days) {
            val startIndex = ((d - 1) * 3) % totalHighlights
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
                        intro = sourceSpot.intro,
                        duration = "約 1.5 - 2 小時",
                        transportToNext = if (s < 2) "開車/大眾運輸約 15-20 分鐘抵達「${nextSpot.name}」" else "晚間前往夜市或返回住宿休憩",
                        googleMapsKeyword = sourceSpot.googleMapsQuery
                    )
                )
            }

            val stayHotel = city.accommodations.getOrNull((d - 1) % city.accommodations.size)

            dayList.add(
                DayItinerary(
                    dayNumber = d,
                    dateLabel = "第 $d 天",
                    title = when (d) {
                        1 -> "${city.name}經典風華巡禮"
                        2 -> "山海風貌與在地美饌深度漫遊"
                        else -> "私房秘境與伴手禮探訪"
                    },
                    theme = style,
                    spots = spotsForDay,
                    stayHotel = stayHotel
                )
            )
        }

        return ItineraryPlan(
            title = "${city.name} ${days}日遊・$style",
            cityName = city.name,
            daysCount = days,
            style = style,
            days = dayList,
            islandNotice = islandNotice
        )
    }
}
