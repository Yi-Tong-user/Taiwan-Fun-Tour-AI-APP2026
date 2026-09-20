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

    var selectedCity by remember {
        mutableStateOf(TaiwanDataProvider.getCityByName(initialCityName) ?: TaiwanDataProvider.cities.first())
    }
    var selectedCategoryTab by remember { mutableStateOf(0) } // 0: 必遊景點, 1: 觀光工廠, 2: 住宿推薦
    var saveTrigger by remember { mutableStateOf(0) }

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
        // City Quick Switcher Row
        Surface(
            color = Color.White,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(vertical = 10.dp)) {
                Text(
                    text = "${strings.selectCity}：${getLocalizedCityName(selectedCity.name, language)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = Slate900,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                )

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(TaiwanDataProvider.cities) { city ->
                        val isSelected = city.name == selectedCity.name
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = if (isSelected) Teal700 else Slate100,
                            modifier = Modifier.clickable { selectedCity = city }
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
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            when (selectedCategoryTab) {
                0 -> {
                    // Must-Visit Highlights
                    items(selectedCity.highlights) { spot ->
                        SpotCard(
                            context = context,
                            cityName = selectedCity.name,
                            spot = spot,
                            strings = strings,
                            saveTrigger = saveTrigger,
                            onToggleSave = { saveTrigger++ }
                        )
                    }
                }
                1 -> {
                    // Tourism Factories
                    items(selectedCity.tourismFactories) { factory ->
                        TourismFactoryCard(
                            context = context,
                            cityName = selectedCity.name,
                            factory = factory,
                            strings = strings,
                            saveTrigger = saveTrigger,
                            onToggleSave = { saveTrigger++ }
                        )
                    }
                }
                2 -> {
                    // Accommodations
                    items(selectedCity.accommodations) { acc ->
                        AccommodationCard(
                            context = context,
                            acc = acc,
                            strings = strings
                        )
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
                Text(
                    text = spot.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Slate900,
                    modifier = Modifier.weight(1f)
                )

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
    acc: Accommodation,
    strings: com.taiwan.explore.util.Strings
) {
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
