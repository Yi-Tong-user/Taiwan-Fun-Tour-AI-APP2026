package com.taiwan.explore.ui.screens

import androidx.compose.animation.core.*
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun DiscoverScreen(
    onSelectCity: (CityData) -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val coroutineScope = rememberCoroutineScope()
    val strings = getStrings(language)

    var selectedRegion by remember { mutableStateOf("全部") }
    var isRunningRandom by remember { mutableStateOf(false) }
    var rollingCityName by remember { mutableStateOf("") }

    val defaultTaiwanPos = LatLng(23.7, 120.9)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(defaultTaiwanPos, 7.5f)
    }

    val regions = listOf("全部", "北部", "中部", "南部", "東部", "離島")
    val filteredCities = remember(selectedRegion) {
        if (selectedRegion == "全部") TaiwanDataProvider.cities
        else TaiwanDataProvider.cities.filter { it.region == selectedRegion }
    }

    // 3-second random picking logic matching web version
    fun handleRandomPick() {
        if (isRunningRandom) return
        isRunningRandom = true

        coroutineScope.launch {
            val startTime = System.currentTimeMillis()
            while (System.currentTimeMillis() - startTime < 3000) {
                val randomCity = TaiwanDataProvider.cities.random()
                rollingCityName = randomCity.name
                delay(100)
            }

            val finalCity = TaiwanDataProvider.cities.random()
            rollingCityName = finalCity.name
            isRunningRandom = false

            cameraPositionState.animate(
                CameraUpdateFactory.newLatLngZoom(LatLng(finalCity.lat, finalCity.lng), 11.5f),
                1000
            )
            delay(500)
            onSelectCity(finalCity)
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate50)
        ) {
            // Interactive Google Map Viewport
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1.1f)
            ) {
                GoogleMap(
                    modifier = Modifier.fillMaxSize(),
                    cameraPositionState = cameraPositionState,
                    uiSettings = MapUiSettings(
                        zoomControlsEnabled = false,
                        compassEnabled = true,
                        myLocationButtonEnabled = false
                    )
                ) {
                    filteredCities.forEach { city ->
                        Marker(
                            state = MarkerState(position = LatLng(city.lat, city.lng)),
                            title = getLocalizedCityName(city.name, language),
                            snippet = "🌾 ${city.agriculture.take(15)}...",
                            onClick = {
                                onSelectCity(city)
                                false
                            }
                        )
                    }
                }

                // Region Filter Chips Floating on Map
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White.copy(alpha = 0.95f),
                    shadowElevation = 4.dp,
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 10.dp)
                ) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        items(regions) { region ->
                            val isSelected = selectedRegion == region
                            val label = when (region) {
                                "全部" -> strings.regionAll
                                "北部" -> strings.regionNorth
                                "中部" -> strings.regionCentral
                                "南部" -> strings.regionSouth
                                "東部" -> strings.regionEast
                                "離島" -> strings.regionIslands
                                else -> region
                            }
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = if (isSelected) Teal700 else Color.Transparent,
                                modifier = Modifier.clickable { selectedRegion = region }
                            ) {
                                Text(
                                    text = label,
                                    color = if (isSelected) Color.White else Slate700,
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                }

                // Rolling City Overlay during Random Selection
                if (isRunningRandom) {
                    Surface(
                        shape = RoundedCornerShape(24.dp),
                        color = Slate900.copy(alpha = 0.9f),
                        shadowElevation = 8.dp,
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(24.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 24.dp, vertical = 16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = Amber400,
                                strokeWidth = 3.dp
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = "🎲 $rollingCityName",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                        }
                    }
                }
            }

            // City Highlights & Specialties List
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(0.9f)
                    .background(Color.White)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = strings.exploreCities,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = "${filteredCities.size} 個縣市",
                        fontSize = 12.sp,
                        color = Slate500
                    )
                }

                LazyColumn(
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 80.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(filteredCities) { city ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Slate50),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    coroutineScope.launch {
                                        cameraPositionState.animate(
                                            CameraUpdateFactory.newLatLngZoom(LatLng(city.lat, city.lng), 11.5f),
                                            800
                                        )
                                    }
                                    onSelectCity(city)
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Teal100,
                                    modifier = Modifier.size(44.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = city.name.take(2),
                                            fontWeight = FontWeight.Bold,
                                            color = Teal800,
                                            fontSize = 14.sp
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = getLocalizedCityName(city.name, language),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp,
                                            color = Slate800
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = city.region,
                                            fontSize = 11.sp,
                                            color = Teal700
                                        )
                                    }
                                    Text(
                                        text = "🌾 ${city.agriculture}",
                                        fontSize = 12.sp,
                                        color = Slate600,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = "🐟 ${city.fishery}",
                                        fontSize = 12.sp,
                                        color = Slate500,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = "🥩 ${city.livestock}",
                                        fontSize = 12.sp,
                                        color = Slate500,
                                        maxLines = 1
                                    )
                                }

                                Icon(
                                    imageVector = Icons.Default.ChevronRight,
                                    contentDescription = null,
                                    tint = Slate400
                                )
                            }
                        }
                    }
                }
            }
        }

        // Floating "隨機出發一座城市" Action Button
        FloatingActionButton(
            onClick = { handleRandomPick() },
            containerColor = Amber500,
            contentColor = Color.White,
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 16.dp)
                .height(50.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "🎲", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = strings.randomCityBtn,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }
    }
}
