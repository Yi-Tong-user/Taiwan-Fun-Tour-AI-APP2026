package com.taiwan.explore.model

data class Spot(
    val name: String,
    val intro: String,
    val googleMapsQuery: String
)

data class TourismFactory(
    val name: String,
    val intro: String,
    val googleMapsQuery: String
)

data class Accommodation(
    val name: String,
    val type: String,
    val tier: String = "standard", // "budget", "standard", "luxury"
    val description: String,
    val locationType: String = "",
    val priceRange: String = "",
    val googleMapsQuery: String
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
    val googleMapsKeyword: String
)

data class DayItinerary(
    val dayNumber: Int,
    val dateLabel: String,
    val title: String,
    val theme: String,
    val spots: List<PlannedSpot>,
    val stayHotel: Accommodation? = null
)

data class ItineraryPlan(
    val title: String,
    val cityName: String,
    val daysCount: Int,
    val style: String,
    val days: List<DayItinerary>,
    val islandNotice: String? = null
)
