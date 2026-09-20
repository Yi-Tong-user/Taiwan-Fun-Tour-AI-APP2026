package com.taiwan.explore.model

data class Spot(
    val name: String,
    val intro: String,
    val googleMapsQuery: String,
    val district: String = "",
    val openingHours: String = "08:00 - 18:00",
    val startHour: Int = 8,
    val endHour: Int = 18,
    val isNightOnly: Boolean = false
) {
    val districts: List<String>
        get() = if (district.isNotBlank()) listOf(district) else emptyList()
}

data class TourismFactory(
    val name: String,
    val intro: String,
    val googleMapsQuery: String,
    val district: String = "",
    val openingHours: String = "09:00 - 17:00",
    val startHour: Int = 9,
    val endHour: Int = 17
)

data class Accommodation(
    val name: String,
    val type: String,
    val tier: String = "standard", // "budget", "standard", "luxury"
    val description: String,
    val locationType: String = "",
    val priceRange: String = "",
    val priceValue: Int = 3000, // numeric for sorting high to low
    val googleMapsQuery: String,
    val district: String = ""
)

data class CityData(
    val name: String,
    val lat: Double,
    val lng: Double,
    val agriculture: String,
    val fishery: String,
    val livestock: String,
    val description: String,
    val region: String, // "北部", "中部", "南部", "東部", "離島"
    val districts: List<String> = emptyList(), // 所有行政區清單
    val highlights: List<Spot>,
    val tourismFactories: List<TourismFactory>,
    val accommodations: List<Accommodation>,
    val famousFood: List<String>,
    val islandNotice: String? = null
)

data class PlannedSpot(
    val time: String,
    val name: String,
    val intro: String,
    val duration: String,
    val transportToNext: String,
    val googleMapsKeyword: String,
    val district: String = ""
)

data class DayItinerary(
    val dayNumber: Int,
    val dateLabel: String,
    val title: String,
    val theme: String,
    val spots: List<PlannedSpot>,
    val stayHotel: Accommodation? = null,
    val multiStopRouteUrl: String = ""
)

data class ItineraryPlan(
    val title: String,
    val cityName: String,
    val daysCount: Int,
    val style: String,
    val days: List<DayItinerary>,
    val islandNotice: String? = null,
    val returnNavigationUrl: String? = null,
    val returnTransitGuide: String? = null,
    val transitWarning: String? = null
)
