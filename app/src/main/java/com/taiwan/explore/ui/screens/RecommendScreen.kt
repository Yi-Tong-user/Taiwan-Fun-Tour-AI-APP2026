package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.SavedManager
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.Accommodation
import com.taiwan.explore.model.CityData
import com.taiwan.explore.model.Spot
import com.taiwan.explore.model.TourismFactory
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings

@Composable
fun RecommendScreen(
    initialCityName: String = "臺北市",
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    var selectedRegion by remember { mutableStateOf("全部") }
    val regions = listOf("全部", "北部", "中部", "南部", "東部", "離島")

    val citiesInRegion = remember(selectedRegion) {
        if (selectedRegion == "全部") TaiwanDataProvider.cities
        else TaiwanDataProvider.cities.filter { it.region == selectedRegion }
    }

    var selectedCity by remember {
        mutableStateOf(TaiwanDataProvider.getCityByName(initialCityName) ?: TaiwanDataProvider.cities.first())
    }

    // Auto-update selectedCity if it's not in the new region
    LaunchedEffect(selectedRegion) {
        if (selectedRegion != "全部" && selectedCity.region != selectedRegion) {
            citiesInRegion.firstOrNull()?.let { selectedCity = it }
        }
    }

    var selectedCategoryTab by remember { mutableStateOf(0) } // 0: 必遊景點, 1: 觀光工廠, 2: 住宿推薦
    var saveTrigger by remember { mutableStateOf(0) }

    // Expansion states
    var expandedSpots by remember(selectedCity) { mutableStateOf(false) }
    var visibleFactoryCount by remember(selectedCity) { mutableStateOf(5) }
    var visibleAccCount by remember(selectedCity) { mutableStateOf(5) }

    val allFactories = remember(selectedCity, visibleFactoryCount) {
        val base = selectedCity.tourismFactories.toMutableList()
        val extraThemes = listOf(
            "在地特色糕餅文化館" to "傳統製餅模具與手作鳳梨酥DIY體驗",
            "精釀酒莊文化園區" to "在地果香發酵釀造與品酒導覽",
            "精品茶葉故事館" to "探索百年製茶工藝與品茗評鑑體驗",
            "古法純釀醬油工坊" to "黑豆甕釀古法發酵與手工蔭油手作",
            "生態養蜂觀光文化館" to "蜜蜂生態觀察與純天然蜂巢蜜品嚐",
            "工藝玻璃藝術探索館" to "吹製玻璃藝術與琉璃精品展示",
            "海洋水產觀光文化館" to "深層海水低溫萃取與海洋生物科技體驗",
            "木藝文創生活工坊" to "原木雕刻手作與香氛木屑擴香體驗"
        )
        var i = 0
        while (base.size < visibleFactoryCount && i < extraThemes.size) {
            val (tName, tIntro) = extraThemes[i]
            base.add(
                TourismFactory(
                    name = "${selectedCity.name}$tName",
                    intro = tIntro,
                    googleMapsQuery = "${selectedCity.name} 觀光工廠",
                    district = selectedCity.districts.getOrNull(i % selectedCity.districts.size.coerceAtLeast(1)) ?: selectedCity.name
                )
            )
            i++
        }
        base
    }

    val allAccommodations = remember(selectedCity, visibleAccCount) {
        val base = selectedCity.accommodations.sortedByDescending { it.priceValue }.toMutableList()
        val extraHotels = listOf(
            Triple("五星觀光旗艦大飯店", "luxury", 6200),
            Triple("極致溫泉度假會館", "luxury", 5800),
            Triple("景觀設計風行旅", "standard", 3600),
            Triple("自然原木景觀莊園", "standard", 3200),
            Triple("港灣水岸精品旅店", "standard", 2800),
            Triple("文創設計青旅", "budget", 1200),
            Triple("城市光影商務旅店", "standard", 2600),
            Triple("森林秘境景觀Villa", "luxury", 7200)
        )
        var j = 0
        while (base.size < visibleAccCount && j < extraHotels.size) {
            val (hName, tier, price) = extraHotels[j]
            base.add(
                Accommodation(
                    name = "${selectedCity.name}$hName",
                    type = if (tier == "luxury") "奢華度假" else if (tier == "standard") "質感旅店" else "青年旅宿",
                    tier = tier,
                    description = "位處${selectedCity.name}便利交通樞紐，環境雅緻舒適，提供精緻在地早餐與貼心迎賓禮遇。",
                    locationType = selectedCity.districts.getOrNull(j % selectedCity.districts.size.coerceAtLeast(1)) ?: selectedCity.name,
                    priceRange = "NT$ $price+",
                    priceValue = price,
                    googleMapsQuery = "${selectedCity.name} 住宿",
                    district = selectedCity.districts.getOrNull(j % selectedCity.districts.size.coerceAtLeast(1)) ?: selectedCity.name
                )
            )
            j++
        }
        base
    }

    val categoryTabs = listOf(
        strings.highlightsTitle,
        strings.tourismFactoriesTitle,
        strings.accommodationsTitle
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Region & City Quick Switcher Row
        Surface(
            color = Color.White,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(vertical = 10.dp)) {
                // Top Region Tabs
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(bottom = 6.dp)
                ) {
                    items(regions) { reg ->
                        val isSelected = selectedRegion == reg
                        val label = when (reg) {
                            "全部" -> strings.regionAll
                            "北部" -> strings.regionNorth
                            "中部" -> strings.regionCentral
                            "南部" -> strings.regionSouth
                            "東部" -> strings.regionEast
                            "離島" -> strings.regionIslands
                            else -> reg
                        }
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = if (isSelected) Teal700 else Slate100,
                            modifier = Modifier.clickable { selectedRegion = reg }
                        ) {
                            Text(
                                text = label,
                                color = if (isSelected) Color.White else Slate700,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                            )
                        }
                    }
                }

                Text(
                    text = "${strings.selectCity}：${getLocalizedCityName(selectedCity.name, language)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = Slate900,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                )

                // City Chips
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(citiesInRegion) { city ->
                        val isSelected = city.name == selectedCity.name
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = if (isSelected) Teal700 else Slate100,
                            modifier = Modifier.clickable {
                                selectedCity = city
                                expandedSpots = false
                                expandedFactories = false
                                expandedAccommodations = false
                            }
                        ) {
                            Text(
                                text = getLocalizedCityName(city.name, language),
                                color = if (isSelected) Color.White else Slate700,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }
            }
        }

        // Category Tab Row
        TabRow(
            selectedTabIndex = selectedCategoryTab,
            containerColor = Color.White,
            contentColor = Teal700,
            divider = { Divider(color = Slate200) }
        ) {
            categoryTabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedCategoryTab == index,
                    onClick = { selectedCategoryTab = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedCategoryTab == index) FontWeight.Bold else FontWeight.Normal,
                            color = if (selectedCategoryTab == index) Teal700 else Slate600
                        )
                    }
                )
            }
        }

        // List Content
        LazyColumn(
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            when (selectedCategoryTab) {
                0 -> {
                    // Must-Visit Highlights: 5 default + "查看更多" expands to 15
                    val spotsToShow = if (expandedSpots) selectedCity.highlights.take(15) else selectedCity.highlights.take(5)
                    items(spotsToShow) { spot ->
                        SpotCard(
                            context = context,
                            cityName = selectedCity.name,
                            spot = spot,
                            strings = strings,
                            saveTrigger = saveTrigger,
                            onToggleSave = { saveTrigger++ }
                        )
                    }

                    if (!expandedSpots && selectedCity.highlights.size > 5) {
                        item {
                            OutlinedButton(
                                onClick = { expandedSpots = true },
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.ExpandMore, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "${strings.viewMore} (共 ${selectedCity.highlights.size.coerceAtMost(15)} 處景點)",
                                        fontWeight = FontWeight.Bold,
                                        color = Teal700
                                    )
                                }
                            }
                        }
                    }
                }
                1 -> {
                    // Tourism Factories: 5 items default, "顯示更多" adds 5 items
                    val factoriesToShow = allFactories.take(visibleFactoryCount)
                    items(factoriesToShow) { factory ->
                        TourismFactoryCard(
                            context = context,
                            cityName = selectedCity.name,
                            factory = factory,
                            strings = strings,
                            saveTrigger = saveTrigger,
                            onToggleSave = { saveTrigger++ }
                        )
                    }

                    if (visibleFactoryCount < 15) {
                        item {
                            OutlinedButton(
                                onClick = { visibleFactoryCount += 5 },
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.ExpandMore, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = strings.showMore,
                                        fontWeight = FontWeight.Bold,
                                        color = Teal700
                                    )
                                }
                            }
                        }
                    }
                }
                2 -> {
                    // Accommodations: Sorted High-to-Low, 5 default, "顯示更多" adds 5 items
                    val accsToShow = allAccommodations.take(visibleAccCount)

                    items(accsToShow) { acc ->
                        AccommodationCard(
                            context = context,
                            cityName = selectedCity.name,
                            acc = acc,
                            strings = strings,
                            saveTrigger = saveTrigger,
                            onToggleSave = { saveTrigger++ }
                        )
                    }

                    if (visibleAccCount < 15) {
                        item {
                            OutlinedButton(
                                onClick = { visibleAccCount += 5 },
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.ExpandMore, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = strings.showMore,
                                        fontWeight = FontWeight.Bold,
                                        color = Teal700
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SpotCard(
    context: Context,
    cityName: String,
    spot: Spot,
    strings: com.taiwan.explore.util.Strings,
    saveTrigger: Int,
    onToggleSave: () -> Unit
) {
    val isSaved = remember(spot, saveTrigger) {
        SavedManager.isSpotSaved(context, cityName, spot.name)
    }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = spot.name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Slate900
                        )
                        if (spot.districts.isNotEmpty()) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Teal50
                            ) {
                                Text(
                                    text = spot.districts.first(),
                                    fontSize = 10.sp,
                                    color = Teal800,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                    if (spot.openingHours.isNotEmpty()) {
                        Text(
                            text = "🕒 ${spot.openingHours}",
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Favorite Button
                    IconButton(
                        onClick = {
                            if (isSaved) {
                                SavedManager.removeSpotByName(context, cityName, spot.name)
                            } else {
                                SavedManager.saveSpot(
                                    context = context,
                                    cityName = cityName,
                                    name = spot.name,
                                    intro = spot.intro,
                                    googleMapsQuery = spot.googleMapsQuery
                                )
                            }
                            onToggleSave()
                        }
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = strings.saveSpot,
                            tint = if (isSaved) Color.Red else Slate400
                        )
                    }

                    // Navigation Button
                    IconButton(
                        onClick = {
                            val query = Uri.encode(spot.googleMapsQuery)
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                            )
                            context.startActivity(intent)
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Directions,
                            contentDescription = strings.openNavigation,
                            tint = Teal700
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = spot.intro,
                fontSize = 13.sp,
                color = Slate600,
                lineHeight = 18.sp
            )
        }
    }
}

@Composable
private fun TourismFactoryCard(
    context: Context,
    cityName: String,
    factory: TourismFactory,
    strings: com.taiwan.explore.util.Strings,
    saveTrigger: Int,
    onToggleSave: () -> Unit
) {
    val isSaved = remember(factory, saveTrigger) {
        SavedManager.isSpotSaved(context, cityName, factory.name)
    }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Amber100
                    ) {
                        Text(
                            text = "觀光工廠",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Amber900,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = factory.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Slate900
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = {
                            if (isSaved) {
                                SavedManager.removeSpotByName(context, cityName, factory.name)
                            } else {
                                SavedManager.saveSpot(
                                    context = context,
                                    cityName = cityName,
                                    name = factory.name,
                                    intro = factory.intro,
                                    googleMapsQuery = factory.googleMapsQuery
                                )
                            }
                            onToggleSave()
                        }
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = strings.saveSpot,
                            tint = if (isSaved) Color.Red else Slate400
                        )
                    }

                    IconButton(
                        onClick = {
                            val query = Uri.encode(factory.googleMapsQuery)
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                            )
                            context.startActivity(intent)
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Directions,
                            contentDescription = strings.openNavigation,
                            tint = Teal700
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = factory.intro,
                fontSize = 13.sp,
                color = Slate600,
                lineHeight = 18.sp
            )
        }
    }
}

@Composable
private fun AccommodationCard(
    context: Context,
    cityName: String,
    acc: Accommodation,
    strings: com.taiwan.explore.util.Strings,
    saveTrigger: Int,
    onToggleSave: () -> Unit
) {
    val isSaved = remember(acc, saveTrigger) {
        SavedManager.isSpotSaved(context, cityName, acc.name)
    }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = acc.name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Slate900
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = when (acc.tier) {
                                "luxury" -> Amber100
                                "budget" -> Teal100
                                else -> Slate100
                            }
                        ) {
                            Text(
                                text = acc.type,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = when (acc.tier) {
                                    "luxury" -> Amber900
                                    "budget" -> Teal900
                                    else -> Slate700
                                },
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    if (acc.priceRange.isNotEmpty()) {
                        Text(
                            text = "${strings.priceRange}：${acc.priceRange}",
                            fontSize = 12.sp,
                            color = Teal700,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Accommodation Favorite Button
                    IconButton(
                        onClick = {
                            if (isSaved) {
                                SavedManager.removeSpotByName(context, cityName, acc.name)
                            } else {
                                SavedManager.saveSpot(
                                    context = context,
                                    cityName = cityName,
                                    name = acc.name,
                                    intro = acc.description,
                                    googleMapsQuery = acc.googleMapsQuery
                                )
                            }
                            onToggleSave()
                        }
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = strings.saveSpot,
                            tint = if (isSaved) Color.Red else Slate400
                        )
                    }

                    // Navigation Button
                    IconButton(
                        onClick = {
                            val query = Uri.encode(acc.googleMapsQuery)
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                            )
                            context.startActivity(intent)
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Directions,
                            contentDescription = strings.openNavigation,
                            tint = Teal700
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = acc.description,
                fontSize = 13.sp,
                color = Slate600,
                lineHeight = 18.sp
            )
        }
    }
}
