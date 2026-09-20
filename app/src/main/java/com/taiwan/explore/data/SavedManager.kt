package com.taiwan.explore.data

import android.content.Context
import com.taiwan.explore.model.Accommodation
import com.taiwan.explore.model.DayItinerary
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.model.PlannedSpot
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

data class SavedFullItinerary(
    val id: String = UUID.randomUUID().toString(),
    val cityName: String,
    val title: String,
    val style: String,
    val daysCount: Int,
    val plan: ItineraryPlan,
    val savedAt: Long = System.currentTimeMillis()
)

data class SavedDayItinerary(
    val id: String = UUID.randomUUID().toString(),
    val cityName: String,
    val dayNumber: Int,
    val dateLabel: String,
    val title: String,
    val theme: String,
    val day: DayItinerary,
    val savedAt: Long = System.currentTimeMillis()
)

data class SavedSpotItem(
    val id: String = UUID.randomUUID().toString(),
    val cityName: String,
    val name: String,
    val intro: String,
    val googleMapsQuery: String,
    val duration: String = "",
    val savedAt: Long = System.currentTimeMillis()
)

object SavedManager {
    private const val PREFS_NAME = "taiwan_saved_collections"
    private const val KEY_FULL = "saved_full_itineraries"
    private const val KEY_DAY = "saved_day_itineraries"
    private const val KEY_SPOTS = "saved_spots"

    const val MAX_SAVED_ITEMS = 20

    fun canSaveFull(context: Context): Boolean = getFullItineraries(context).size < MAX_SAVED_ITEMS
    fun canSaveDay(context: Context): Boolean = getDayItineraries(context).size < MAX_SAVED_ITEMS
    fun canSaveSpot(context: Context): Boolean = getSavedSpots(context).size < MAX_SAVED_ITEMS

    // --- FULL ITINERARY ---
    fun getFullItineraries(context: Context): List<SavedFullItinerary> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val jsonStr = prefs.getString(KEY_FULL, "[]") ?: "[]"
        val list = mutableListOf<SavedFullItinerary>()
        try {
            val arr = JSONArray(jsonStr)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                val planObj = obj.getJSONObject("plan")
                val daysArr = planObj.getJSONArray("days")
                val days = mutableListOf<DayItinerary>()

                for (d in 0 until daysArr.length()) {
                    val dObj = daysArr.getJSONObject(d)
                    val spotsArr = dObj.getJSONArray("spots")
                    val spots = mutableListOf<PlannedSpot>()
                    for (s in 0 until spotsArr.length()) {
                        val sObj = spotsArr.getJSONObject(s)
                        spots.add(
                            PlannedSpot(
                                time = sObj.optString("time"),
                                name = sObj.optString("name"),
                                intro = sObj.optString("intro"),
                                duration = sObj.optString("duration"),
                                transportToNext = sObj.optString("transportToNext"),
                                googleMapsKeyword = sObj.optString("googleMapsKeyword")
                            )
                        )
                    }

                    val stay = if (dObj.has("stayHotel") && !dObj.isNull("stayHotel")) {
                        val hObj = dObj.getJSONObject("stayHotel")
                        Accommodation(
                            name = hObj.optString("name"),
                            type = hObj.optString("type"),
                            tier = hObj.optString("tier", "standard"),
                            description = hObj.optString("description"),
                            locationType = hObj.optString("locationType"),
                            priceRange = hObj.optString("priceRange"),
                            googleMapsQuery = hObj.optString("googleMapsQuery"),
                            priceValue = hObj.optInt("priceValue", 2500)
                        )
                    } else null

                    days.add(
                        DayItinerary(
                            dayNumber = dObj.optInt("dayNumber"),
                            dateLabel = dObj.optString("dateLabel"),
                            title = dObj.optString("title"),
                            theme = dObj.optString("theme"),
                            spots = spots,
                            stayHotel = stay,
                            multiStopRouteUrl = dObj.optString("multiStopRouteUrl", "")
                        )
                    )
                }

                val plan = ItineraryPlan(
                    title = planObj.optString("title"),
                    cityName = planObj.optString("cityName"),
                    daysCount = planObj.optInt("daysCount"),
                    style = planObj.optString("style"),
                    days = days,
                    islandNotice = if (planObj.has("islandNotice") && !planObj.isNull("islandNotice")) planObj.optString("islandNotice") else null,
                    returnNavigationUrl = if (planObj.has("returnNavigationUrl") && !planObj.isNull("returnNavigationUrl")) planObj.optString("returnNavigationUrl") else null,
                    returnTransitGuide = if (planObj.has("returnTransitGuide") && !planObj.isNull("returnTransitGuide")) planObj.optString("returnTransitGuide") else null
                )

                list.add(
                    SavedFullItinerary(
                        id = obj.optString("id"),
                        cityName = obj.optString("cityName"),
                        title = obj.optString("title"),
                        style = obj.optString("style"),
                        daysCount = obj.optInt("daysCount"),
                        plan = plan,
                        savedAt = obj.optLong("savedAt")
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return list
    }

    fun saveFullItinerary(context: Context, plan: ItineraryPlan): SavedFullItinerary? {
        val current = getFullItineraries(context).toMutableList()
        // If already exists with same title & cityName, don't duplicate
        val existing = current.find { it.cityName == plan.cityName && it.title == plan.title }
        if (existing != null) return existing

        if (current.size >= MAX_SAVED_ITEMS) {
            return null
        }

        val item = SavedFullItinerary(
            cityName = plan.cityName,
            title = plan.title,
            style = plan.style,
            daysCount = plan.daysCount,
            plan = plan
        )
        current.add(0, item)
        saveFullList(context, current)
        return item
    }

    fun removeFullItinerary(context: Context, id: String) {
        val current = getFullItineraries(context).filter { it.id != id }
        saveFullList(context, current)
    }

    fun isFullItinerarySaved(context: Context, title: String): Boolean {
        return getFullItineraries(context).any { it.title == title }
    }

    private fun saveFullList(context: Context, list: List<SavedFullItinerary>) {
        val arr = JSONArray()
        for (item in list) {
            val obj = JSONObject().apply {
                put("id", item.id)
                put("cityName", item.cityName)
                put("title", item.title)
                put("style", item.style)
                put("daysCount", item.daysCount)
                put("savedAt", item.savedAt)

                val planObj = JSONObject().apply {
                    put("title", item.plan.title)
                    put("cityName", item.plan.cityName)
                    put("daysCount", item.plan.daysCount)
                    put("style", item.plan.style)
                    put("islandNotice", item.plan.islandNotice ?: JSONObject.NULL)
                    put("returnNavigationUrl", item.plan.returnNavigationUrl ?: JSONObject.NULL)
                    put("returnTransitGuide", item.plan.returnTransitGuide ?: JSONObject.NULL)

                    val daysArr = JSONArray()
                    for (day in item.plan.days) {
                        val dObj = JSONObject().apply {
                            put("dayNumber", day.dayNumber)
                            put("dateLabel", day.dateLabel)
                            put("title", day.title)
                            put("theme", day.theme)
                            put("multiStopRouteUrl", day.multiStopRouteUrl ?: JSONObject.NULL)

                            val spotsArr = JSONArray()
                            for (spot in day.spots) {
                                spotsArr.put(JSONObject().apply {
                                    put("time", spot.time)
                                    put("name", spot.name)
                                    put("intro", spot.intro)
                                    put("duration", spot.duration)
                                    put("transportToNext", spot.transportToNext)
                                    put("googleMapsKeyword", spot.googleMapsKeyword)
                                })
                            }
                            put("spots", spotsArr)

                            day.stayHotel?.let { hotel ->
                                put("stayHotel", JSONObject().apply {
                                    put("name", hotel.name)
                                    put("type", hotel.type)
                                    put("tier", hotel.tier)
                                    put("description", hotel.description)
                                    put("locationType", hotel.locationType)
                                    put("priceRange", hotel.priceRange)
                                    put("googleMapsQuery", hotel.googleMapsQuery)
                                    put("priceValue", hotel.priceValue)
                                })
                            }
                        }
                        daysArr.put(dObj)
                    }
                    put("days", daysArr)
                }
                put("plan", planObj)
            }
            arr.put(obj)
        }
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_FULL, arr.toString()).apply()
    }

    // --- DAY ITINERARY ---
    fun getDayItineraries(context: Context): List<SavedDayItinerary> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val jsonStr = prefs.getString(KEY_DAY, "[]") ?: "[]"
        val list = mutableListOf<SavedDayItinerary>()
        try {
            val arr = JSONArray(jsonStr)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                val dayObj = obj.getJSONObject("day")
                val spotsArr = dayObj.getJSONArray("spots")
                val spots = mutableListOf<PlannedSpot>()
                for (s in 0 until spotsArr.length()) {
                    val sObj = spotsArr.getJSONObject(s)
                    spots.add(
                        PlannedSpot(
                            time = sObj.optString("time"),
                            name = sObj.optString("name"),
                            intro = sObj.optString("intro"),
                            duration = sObj.optString("duration"),
                            transportToNext = sObj.optString("transportToNext"),
                            googleMapsKeyword = sObj.optString("googleMapsKeyword")
                        )
                    )
                }

                val stay = if (dayObj.has("stayHotel") && !dayObj.isNull("stayHotel")) {
                    val hObj = dayObj.getJSONObject("stayHotel")
                    Accommodation(
                        name = hObj.optString("name"),
                        type = hObj.optString("type"),
                        tier = hObj.optString("tier", "standard"),
                        description = hObj.optString("description"),
                        locationType = hObj.optString("locationType"),
                        priceRange = hObj.optString("priceRange"),
                        googleMapsQuery = hObj.optString("googleMapsQuery"),
                        priceValue = hObj.optInt("priceValue", 2500)
                    )
                } else null

                val day = DayItinerary(
                    dayNumber = dayObj.optInt("dayNumber"),
                    dateLabel = dayObj.optString("dateLabel"),
                    title = dayObj.optString("title"),
                    theme = dayObj.optString("theme"),
                    spots = spots,
                    stayHotel = stay,
                    multiStopRouteUrl = dayObj.optString("multiStopRouteUrl", "")
                )

                list.add(
                    SavedDayItinerary(
                        id = obj.optString("id"),
                        cityName = obj.optString("cityName"),
                        dayNumber = obj.optInt("dayNumber"),
                        dateLabel = obj.optString("dateLabel"),
                        title = obj.optString("title"),
                        theme = obj.optString("theme"),
                        day = day,
                        savedAt = obj.optLong("savedAt")
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return list
    }

    fun saveDayItinerary(context: Context, cityName: String, day: DayItinerary): SavedDayItinerary? {
        val current = getDayItineraries(context).toMutableList()
        val existing = current.find { it.cityName == cityName && it.dayNumber == day.dayNumber && it.title == day.title }
        if (existing != null) return existing

        if (current.size >= MAX_SAVED_ITEMS) {
            return null
        }

        val item = SavedDayItinerary(
            cityName = cityName,
            dayNumber = day.dayNumber,
            dateLabel = day.dateLabel,
            title = day.title,
            theme = day.theme,
            day = day
        )
        current.add(0, item)
        saveDayList(context, current)
        return item
    }

    fun removeDayItinerary(context: Context, id: String) {
        val current = getDayItineraries(context).filter { it.id != id }
        saveDayList(context, current)
    }

    fun isDayItinerarySaved(context: Context, cityName: String, dayNumber: Int, title: String): Boolean {
        return getDayItineraries(context).any { it.cityName == cityName && it.dayNumber == dayNumber && it.title == title }
    }

    private fun saveDayList(context: Context, list: List<SavedDayItinerary>) {
        val arr = JSONArray()
        for (item in list) {
            val obj = JSONObject().apply {
                put("id", item.id)
                put("cityName", item.cityName)
                put("dayNumber", item.dayNumber)
                put("dateLabel", item.dateLabel)
                put("title", item.title)
                put("theme", item.theme)
                put("savedAt", item.savedAt)

                val dObj = JSONObject().apply {
                    put("dayNumber", item.day.dayNumber)
                    put("dateLabel", item.day.dateLabel)
                    put("title", item.day.title)
                    put("theme", item.day.theme)
                    put("multiStopRouteUrl", item.day.multiStopRouteUrl ?: JSONObject.NULL)

                    val spotsArr = JSONArray()
                    for (spot in item.day.spots) {
                        spotsArr.put(JSONObject().apply {
                            put("time", spot.time)
                            put("name", spot.name)
                            put("intro", spot.intro)
                            put("duration", spot.duration)
                            put("transportToNext", spot.transportToNext)
                            put("googleMapsKeyword", spot.googleMapsKeyword)
                        })
                    }
                    put("spots", spotsArr)

                    item.day.stayHotel?.let { hotel ->
                        put("stayHotel", JSONObject().apply {
                            put("name", hotel.name)
                            put("type", hotel.type)
                            put("tier", hotel.tier)
                            put("description", hotel.description)
                            put("locationType", hotel.locationType)
                            put("priceRange", hotel.priceRange)
                            put("googleMapsQuery", hotel.googleMapsQuery)
                            put("priceValue", hotel.priceValue)
                        })
                    }
                }
                put("day", dObj)
            }
            arr.put(obj)
        }
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_DAY, arr.toString()).apply()
    }

    // --- SPOTS ---
    fun getSavedSpots(context: Context): List<SavedSpotItem> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val jsonStr = prefs.getString(KEY_SPOTS, "[]") ?: "[]"
        val list = mutableListOf<SavedSpotItem>()
        try {
            val arr = JSONArray(jsonStr)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                list.add(
                    SavedSpotItem(
                        id = obj.optString("id"),
                        cityName = obj.optString("cityName"),
                        name = obj.optString("name"),
                        intro = obj.optString("intro"),
                        googleMapsQuery = obj.optString("googleMapsQuery"),
                        duration = obj.optString("duration"),
                        savedAt = obj.optLong("savedAt")
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return list
    }

    fun saveSpot(context: Context, cityName: String, name: String, intro: String, googleMapsQuery: String, duration: String = ""): SavedSpotItem? {
        val current = getSavedSpots(context).toMutableList()
        val existing = current.find { it.cityName == cityName && it.name == name }
        if (existing != null) return existing

        if (current.size >= MAX_SAVED_ITEMS) {
            return null
        }

        val item = SavedSpotItem(
            cityName = cityName,
            name = name,
            intro = intro,
            googleMapsQuery = googleMapsQuery,
            duration = duration
        )
        current.add(0, item)
        saveSpotsList(context, current)
        return item
    }

    fun removeSpot(context: Context, id: String) {
        val current = getSavedSpots(context).filter { it.id != id }
        saveSpotsList(context, current)
    }

    fun removeSpotByName(context: Context, cityName: String, name: String) {
        val current = getSavedSpots(context).filterNot { it.cityName == cityName && it.name == name }
        saveSpotsList(context, current)
    }

    fun clearAllSpots(context: Context) {
        saveSpotsList(context, emptyList())
    }

    fun isSpotSaved(context: Context, cityName: String, name: String): Boolean {
        return getSavedSpots(context).any { it.cityName == cityName && it.name == name }
    }

    private fun saveSpotsList(context: Context, list: List<SavedSpotItem>) {
        val arr = JSONArray()
        for (item in list) {
            arr.put(JSONObject().apply {
                put("id", item.id)
                put("cityName", item.cityName)
                put("name", item.name)
                put("intro", item.intro)
                put("googleMapsQuery", item.googleMapsQuery)
                put("duration", item.duration)
                put("savedAt", item.savedAt)
            })
        }
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_SPOTS, arr.toString()).apply()
    }
}
