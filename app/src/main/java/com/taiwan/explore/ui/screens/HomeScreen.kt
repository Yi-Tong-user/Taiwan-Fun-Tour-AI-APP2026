package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.R
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.model.Spot
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Calendar

@Composable
fun HomeScreen(
    onSelectCityForDetail: (CityData) -> Unit,
    userLocationName: String? = null,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)
    val coroutineScope = rememberCoroutineScope()
    val allCities = remember { TaiwanDataProvider.cities }

    var isRolling by remember { mutableStateOf(false) }
    var rollingCityName by remember { mutableStateOf("臺灣") }
    var selectedCity by remember { mutableStateOf<CityData?>(null) }
    var showActiveLaunchView by remember { mutableStateOf(false) }

    // Start 3-second rolling city animation
    fun startRandomRoll() {
        if (isRolling) return
        isRolling = true
        selectedCity = null
        showActiveLaunchView = false

        coroutineScope.launch {
            val startTime = System.currentTimeMillis()
            var index = 0
            while (System.currentTimeMillis() - startTime < 3000) {
                index = (index + 1) % allCities.size
                rollingCityName = allCities[index].name
                delay(90)
            }
            // Final stop on a randomized city
            val finalCity = allCities.random()
            rollingCityName = finalCity.name
            selectedCity = finalCity
            isRolling = false
        }
    }

    fun openGoogleMaps(spot: Spot) {
        val destination = Uri.encode(spot.googleMapsQuery)
        val originParam = if (!userLocationName.isNullOrBlank()) "&origin=" + Uri.encode(userLocationName) else ""
        val url = "https://www.google.com/maps/dir/?api=1$originParam&destination=$destination&travelmode=driving"
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        context.startActivity(intent)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        if (!showActiveLaunchView) {
            // Main Map & Rolling View
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header Banner
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Teal50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Teal200),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = if (isRolling) Amber500 else Teal700,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = if (isRolling) "🎲" else "🗺️",
                                    fontSize = 18.sp
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isRolling) strings.randomSelecting else if (selectedCity != null) "已選中：${getLocalizedCityName(selectedCity!!.name, language)}" else strings.appName,
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = if (isRolling) Amber700 else Teal900
                            )
                            Text(
                                text = if (isRolling) "即將停留在任一特色縣市..." else strings.appSubtitle,
                                fontSize = 11.sp,
                                color = Slate600
                            )
                        }
                    }
                }

                // Taiwan Map in Center with Green/Teal Aesthetic Border
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, Teal100),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.map_new),
                            contentDescription = "Taiwan Map",
                            contentScale = ContentScale.Fit,
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(RoundedCornerShape(16.dp))
                        )

                        // If rolling, show prominent animated badge in center
                        if (isRolling) {
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = Slate900.copy(alpha = 0.85f),
                                shadowElevation = 8.dp,
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(20.dp),
                                        color = Amber400,
                                        strokeWidth = 2.5.dp
                                    )
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Text(
                                        text = rollingCityName,
                                        fontSize = 20.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }
                }

                // Selected City Info Card (shown when roll completes)
                AnimatedVisibility(
                    visible = selectedCity != null && !isRolling,
                    enter = fadeIn() + slideInVertically(initialOffsetY = { it / 2 }),
                    exit = fadeOut()
                ) {
                    selectedCity?.let { city ->
                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            border = androidx.compose.foundation.BorderStroke(1.5.dp, Teal600),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = getLocalizedCityName(city.name, language),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 18.sp,
                                            color = Slate900
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Surface(
                                            shape = RoundedCornerShape(12.dp),
                                            color = Teal100
                                        ) {
                                            Text(
                                                text = city.region,
                                                fontSize = 11.sp,
                                                color = Teal900,
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                            )
                                        }
                                    }

                                    IconButton(
                                        onClick = { selectedCity = null },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = city.description,
                                    fontSize = 12.sp,
                                    color = Slate600,
                                    lineHeight = 17.sp,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                // Agricultural, Fishery, Livestock specialties
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Slate50,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(8.dp)) {
                                        Text(text = "🌾 農產：${city.agriculture}", fontSize = 11.sp, color = Slate800, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(text = "🐟 漁業：${city.fishery}", fontSize = 11.sp, color = Slate800, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(text = "🥩 畜牧：${city.livestock}", fontSize = 11.sp, color = Slate800, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // 即刻啟動 Button
                                Button(
                                    onClick = { showActiveLaunchView = true },
                                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(44.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.DirectionsRun, contentDescription = null, tint = Color.White)
                                    Spacer(modifier = Modifier.width(6.dp))
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
                }

                // Random City Action Button
                if (selectedCity == null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = { startRandomRoll() },
                        enabled = !isRolling,
                        colors = ButtonDefaults.buttonColors(containerColor = Amber500),
                        shape = RoundedCornerShape(24.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 3.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Text(text = "🎲", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = strings.randomCityBtn,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        } else {
            // 即刻啟動 View: 5+ currently operating spots & food places based on device local time
            val city = selectedCity ?: allCities.first()
            val currentHour = remember { Calendar.getInstance().get(Calendar.HOUR_OF_DAY) }

            // Filter open spots; ensure at least 5
            val openSpots = remember(city, currentHour) {
                val matching = city.highlights.filter { spot ->
                    if (spot.isNightOnly) {
                        currentHour >= 17 || currentHour <= 1
                    } else {
                        currentHour in spot.startHour..spot.endHour
                    }
                }
                if (matching.size >= 5) {
                    matching
                } else {
                    // Include food recommendations or additional city highlights
                    val combined = matching.toMutableList()
                    for (spot in city.highlights) {
                        if (combined.size >= 6) break
                        if (!combined.contains(spot)) combined.add(spot)
                    }
                    // If still under 5, add famous foods as spots
                    if (combined.size < 5) {
                        city.famousFood.forEachIndexed { idx, foodName ->
                            if (combined.size < 5) {
                                combined.add(
                                    Spot(
                                        name = foodName,
                                        intro = "${city.name}在地必嚐代表美食，營業中店家推薦。",
                                        googleMapsQuery = "${city.name} $foodName",
                                        district = city.districts.firstOrNull() ?: city.name,
                                        openingHours = "10:00 - 21:00",
                                        startHour = 10,
                                        endHour = 21
                                    )
                                )
                            }
                        }
                    }
                    combined
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Top Header Row with "返回首頁" button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "⚡ 即刻啟動・營業中推薦 (${openSpots.size})",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Teal900
                        )
                        Text(
                            text = "${getLocalizedCityName(city.name, language)} · 依目前時間 (${currentHour}:00) 即時精選",
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }

                    // 返回首頁 Button
                    OutlinedButton(
                        onClick = {
                            showActiveLaunchView = false
                            selectedCity = null
                        },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Teal800),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Teal600)
                    ) {
                        Icon(Icons.Default.ArrowBack, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = strings.returnToHome, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // List of 5+ open spots with direct Google Maps navigation from location
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(openSpots) { spot ->
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = spot.name,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp,
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
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.5.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(3.dp))
                                    Text(
                                        text = "${spot.openingHours} · ${spot.districts.firstOrNull() ?: city.name}",
                                        fontSize = 11.sp,
                                        color = Slate500
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = spot.intro,
                                        fontSize = 12.sp,
                                        color = Slate600,
                                        lineHeight = 17.sp,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }

                                Spacer(modifier = Modifier.width(10.dp))

                                // Direct Google Maps Navigation Button
                                Button(
                                    onClick = { openGoogleMaps(spot) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                                    shape = RoundedCornerShape(10.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Navigation,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp),
                                        tint = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = strings.openNavigation,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
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
