package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.model.Spot
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.net.URLEncoder
import java.util.Calendar

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DiscoverScreen(
    onSelectCity: (CityData) -> Unit,
    userLocation: LatLng? = null,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val strings = getStrings(language)

    // No pre-selected city
    var selectedCityForDetails by remember { mutableStateOf<CityData?>(null) }
    var selectedRegion by remember { mutableStateOf("全部") }
    var isRunningRandom by remember { mutableStateOf(false) }
    var rollingCityName by remember { mutableStateOf("") }
    var randomLandedCity by remember { mutableStateOf<CityData?>(null) }
    var showActiveLaunchView by remember { mutableStateOf(false) }

    val defaultTaiwanPos = LatLng(23.7, 120.9)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(defaultTaiwanPos, 7.3f)
    }

    val regions = listOf("全部", "北部", "中部", "南部", "東部", "離島")
    val filteredCities = remember(selectedRegion) {
        if (selectedRegion == "全部") TaiwanDataProvider.cities
        else TaiwanDataProvider.cities.filter { it.region == selectedRegion }
    }

    // 3-second random sweep animation
    fun handleRandomPick() {
        if (isRunningRandom) return
        isRunningRandom = true
        showActiveLaunchView = false
        randomLandedCity = null

        coroutineScope.launch {
            val startTime = System.currentTimeMillis()
            var lastCity = TaiwanDataProvider.cities.first()
            while (System.currentTimeMillis() - startTime < 3000) {
                lastCity = TaiwanDataProvider.cities.random()
                rollingCityName = lastCity.name
                cameraPositionState.animate(
                    CameraUpdateFactory.newLatLngZoom(LatLng(lastCity.lat, lastCity.lng), 9.0f),
                    180
                )
                delay(180)
            }

            val finalCity = TaiwanDataProvider.cities.random()
            rollingCityName = finalCity.name
            randomLandedCity = finalCity
            isRunningRandom = false

            cameraPositionState.animate(
                CameraUpdateFactory.newLatLngZoom(LatLng(finalCity.lat, finalCity.lng), 11.0f),
                700
            )
        }
    }

    fun openGoogleMapsNavigation(spot: Spot) {
        val dest = URLEncoder.encode(spot.googleMapsQuery, "UTF-8")
        val uriStr = if (userLocation != null) {
            "https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=$dest&travelmode=driving"
        } else {
            "https://www.google.com/maps/dir/?api=1&destination=$dest&travelmode=driving"
        }
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(uriStr))
        context.startActivity(intent)
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate50)
        ) {
            // Interactive Proportional Taiwan Map Viewport (Teal Theme)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1.05f)
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
                                selectedCityForDetails = city
                                coroutineScope.launch {
                                    cameraPositionState.animate(
                                        CameraUpdateFactory.newLatLngZoom(LatLng(city.lat, city.lng), 11.0f),
                                        600
                                    )
                                }
                                false
                            }
                        )
                    }
                }

                // Regional Filter Chips Floating at Top
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

                // Rolling City Sweep Overlay during Random Selection
                if (isRunningRandom) {
                    Surface(
                        shape = RoundedCornerShape(24.dp),
                        color = Slate900.copy(alpha = 0.92f),
                        shadowElevation = 10.dp,
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

            // Bottom Section: Anchored "探索縣市清單" or Landed City / Detailed City View
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(0.95f)
                    .background(Color.White)
            ) {
                // Landed City Card (After 3s random sweep)
                if (randomLandedCity != null && !showActiveLaunchView) {
                    val city = randomLandedCity!!
                    Card(
                        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
                        colors = CardDefaults.cardColors(containerColor = Teal50),
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "🎯 " + getLocalizedCityName(city.name, language),
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Teal900
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Surface(
                                            shape = RoundedCornerShape(12.dp),
                                            color = Teal200.copy(alpha = 0.6f)
                                        ) {
                                            Text(
                                                text = city.region,
                                                fontSize = 11.sp,
                                                color = Teal900,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }

                                    IconButton(onClick = {
                                        randomLandedCity = null
                                        coroutineScope.launch {
                                            cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(defaultTaiwanPos, 7.3f), 600)
                                        }
                                    }) {
                                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate500)
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = city.description,
                                    fontSize = 13.sp,
                                    color = Slate700,
                                    lineHeight = 18.sp
                                )

                                Spacer(modifier = Modifier.height(10.dp))
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text(text = "🌾 農產：${city.agriculture}", fontSize = 12.sp, color = Slate800)
                                        Spacer(modifier = Modifier.height(3.dp))
                                        Text(text = "🐟 漁業：${city.fishery}", fontSize = 12.sp, color = Slate800)
                                        Spacer(modifier = Modifier.height(3.dp))
                                        Text(text = "🥩 畜牧：${city.livestock}", fontSize = 12.sp, color = Slate800)
                                    }
                                }
                            }

                            // 即刻啟動 Button
                            Button(
                                onClick = { showActiveLaunchView = true },
                                colors = ButtonDefaults.buttonColors(containerColor = Amber500),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "🚀", fontSize = 16.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = strings.startNow,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }
                } else if (showActiveLaunchView && randomLandedCity != null) {
                    // 即刻啟動 View: 5+ Currently open spots & restaurants based on user's current local time
                    val city = randomLandedCity!!
                    val currentHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
                    val openSpots = remember(city, currentHour) {
                        val filtered = city.highlights.filter { spot ->
                            if (spot.isNightOnly) {
                                currentHour >= 17 || currentHour <= 1
                            } else {
                                currentHour in spot.startHour..spot.endHour
                            }
                        }
                        if (filtered.size >= 5) filtered else city.highlights.take(6)
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "⚡ 即時營業中景點與美食 (${openSpots.size})",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Teal900
                                )
                                Text(
                                    text = "${city.name}・依目前時間 (${currentHour}:00) 精選",
                                    fontSize = 11.sp,
                                    color = Slate500
                                )
                            }

                            // 返回首頁 Button
                            OutlinedButton(
                                onClick = {
                                    showActiveLaunchView = false
                                    randomLandedCity = null
                                    coroutineScope.launch {
                                        cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(defaultTaiwanPos, 7.3f), 600)
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(text = strings.returnToHome, fontSize = 12.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            items(openSpots) { spot ->
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Slate50),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text(
                                                    text = spot.name,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp,
                                                    color = Slate900
                                                )
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Surface(
                                                    shape = RoundedCornerShape(4.dp),
                                                    color = Emerald100
                                                ) {
                                                    Text(
                                                        text = strings.currentlyOperating,
                                                        fontSize = 10.sp,
                                                        color = Emerald700,
                                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                                    )
                                                }
                                            }
                                            Text(
                                                text = "${spot.openingHours}・${spot.districts.firstOrNull() ?: city.name}",
                                                fontSize = 11.sp,
                                                color = Slate500
                                            )
                                            Text(
                                                text = spot.intro,
                                                fontSize = 12.sp,
                                                color = Slate700,
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                        }

                                        Spacer(modifier = Modifier.width(8.dp))

                                        // Google Maps navigation button
                                        Button(
                                            onClick = { openGoogleMapsNavigation(spot) },
                                            colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.Navigation, contentDescription = null, modifier = Modifier.size(14.dp))
                                                Spacer(modifier = Modifier.width(4.dp))
                                                Text(text = "導航", fontSize = 11.sp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (selectedCityForDetails != null) {
                    // Detailed City View (All administrative districts + Agriculture/Fishery/Livestock cards)
                    val city = selectedCityForDetails!!
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = getLocalizedCityName(city.name, language),
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Teal900
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "${city.districts.size} 個行政區",
                                    fontSize = 12.sp,
                                    color = Slate500
                                )
                            }

                            // 返回首頁 / 關閉 Button
                            OutlinedButton(
                                onClick = {
                                    selectedCityForDetails = null
                                    coroutineScope.launch {
                                        cameraPositionState.animate(CameraUpdateFactory.newLatLngZoom(defaultTaiwanPos, 7.3f), 600)
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(text = strings.returnToHome, fontSize = 12.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            // Administrative Districts Chips
                            item {
                                Text(
                                    text = "🗺️ ${strings.administrativeDistricts}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = Slate800
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    city.districts.forEach { dist ->
                                        Surface(
                                            shape = RoundedCornerShape(8.dp),
                                            color = Teal50,
                                            border = androidx.compose.foundation.BorderStroke(1.dp, Teal200)
                                        ) {
                                            Text(
                                                text = dist,
                                                fontSize = 11.sp,
                                                color = Teal800,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                            )
                                        }
                                    }
                                }
                            }

                            // Agriculture, Fishery, Livestock Specialty Cards
                            item {
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Emerald50),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(text = "🌾 ${strings.agriculturalProduce}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Emerald800)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(text = city.agriculture, fontSize = 12.sp, color = Slate700)
                                    }
                                }
                            }

                            item {
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Blue50),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(text = "🐟 ${strings.fisheryProduce}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Blue800)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(text = city.fishery, fontSize = 12.sp, color = Slate700)
                                    }
                                }
                            }

                            item {
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = Amber50),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(text = "🥩 ${strings.livestockProduce}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Amber800)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(text = city.livestock, fontSize = 12.sp, color = Slate700)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Default State: Pinned "探索縣市清單" at top of list
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
                                        selectedCityForDetails = city
                                        coroutineScope.launch {
                                            cameraPositionState.animate(
                                                CameraUpdateFactory.newLatLngZoom(LatLng(city.lat, city.lng), 11.0f),
                                                800
                                            )
                                        }
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
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = "🐟 ${city.fishery}",
                                            fontSize = 12.sp,
                                            color = Slate500,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = "🥩 ${city.livestock}",
                                            fontSize = 12.sp,
                                            color = Slate500,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
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
        }

        // Floating "隨機出發一座城市" Action Button
        if (randomLandedCity == null && selectedCityForDetails == null) {
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
}
