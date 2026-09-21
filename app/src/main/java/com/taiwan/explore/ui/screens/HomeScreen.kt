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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
    language: AppLanguage = AppLanguage.ZH_TW,
    resetTrigger: Int = 0
) {
    val context = LocalContext.current
    val strings = getStrings(language)
    val coroutineScope = rememberCoroutineScope()
    val allCities = remember { TaiwanDataProvider.cities }

    var isRolling by remember { mutableStateOf(false) }
    var isShowingPickedCityText by remember { mutableStateOf(false) }
    var rollingCityName by remember { mutableStateOf("臺灣") }
    var selectedCity by remember { mutableStateOf<CityData?>(null) }
    var showActiveLaunchView by remember { mutableStateOf(false) }

    // When bottom nav "首頁" is clicked, reset to default map & roll view
    LaunchedEffect(resetTrigger) {
        if (resetTrigger > 0) {
            isRolling = false
            isShowingPickedCityText = false
            selectedCity = null
            showActiveLaunchView = false
        }
    }

    // Start 3-second rolling city animation + 3-second prominent city name display
    fun startRandomRoll() {
        if (isRolling || isShowingPickedCityText) return
        isRolling = true
        isShowingPickedCityText = false
        selectedCity = null
        showActiveLaunchView = false

        coroutineScope.launch {
            val startTime = System.currentTimeMillis()
            var index = 0
            while (System.currentTimeMillis() - startTime < 2800) {
                index = (index + 1) % allCities.size
                rollingCityName = allCities[index].name
                delay(80)
            }
            val finalCity = allCities.random()
            rollingCityName = finalCity.name
            isRolling = false
            isShowingPickedCityText = true

            // Display picked city text for 3 seconds prominently
            delay(3000)
            isShowingPickedCityText = false
            selectedCity = finalCity
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
            // Main Map & Rolling View (No top Taiwan Fun Tour icon or text banner)
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Taiwan Map in Center maintaining strict aspect ratio
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
                            .padding(10.dp),
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

                        // 1. When rolling: show animated indicator
                        if (isRolling) {
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = Slate900.copy(alpha = 0.88f),
                                shadowElevation = 10.dp,
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(22.dp),
                                        color = Amber400,
                                        strokeWidth = 2.5.dp
                                    )
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Text(
                                        text = rollingCityName,
                                        fontSize = 22.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }

                        // 2. When roll stops: display chosen city text prominently for 3 seconds
                        if (isShowingPickedCityText) {
                            Surface(
                                shape = RoundedCornerShape(22.dp),
                                color = Slate900.copy(alpha = 0.92f),
                                shadowElevation = 12.dp,
                                modifier = Modifier.padding(20.dp)
                            ) {
                                Column(
                                    modifier = Modifier.padding(horizontal = 28.dp, vertical = 18.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = "🎯 隨機精選城市",
                                        fontSize = 13.sp,
                                        color = Amber400,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = rollingCityName,
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = Color.White
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "即將載入城市介紹與即刻啟動...",
                                        fontSize = 11.sp,
                                        color = Slate300
                                    )
                                }
                            }
                        }
                    }
                }

                // Selected City Info Card (shown after 3 seconds text display)
                AnimatedVisibility(
                    visible = selectedCity != null && !isRolling && !isShowingPickedCityText,
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
                if (selectedCity == null && !isShowingPickedCityText) {
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
            // 即刻啟動 View: 15 operating spots/shops according to current time (AI operation, NO "15" displayed on UI)
            val city = selectedCity ?: allCities.first()
            val currentHour = remember { Calendar.getInstance().get(Calendar.HOUR_OF_DAY) }

            val openSpots = remember(city, currentHour) {
                val matching = city.highlights.filter { spot ->
                    if (spot.isNightOnly) {
                        currentHour >= 17 || currentHour <= 1
                    } else {
                        currentHour in spot.startHour..spot.endHour
                    }
                }.toMutableList()

                // Append remaining spots to reach 15 for AI operation
                for (spot in city.highlights) {
                    if (matching.size >= 15) break
                    if (!matching.any { it.name == spot.name }) matching.add(spot)
                }

                if (matching.size < 15) {
                    for (f in city.tourismFactories) {
                        if (matching.size >= 15) break
                        matching.add(
                            Spot(
                                name = f.name,
                                intro = f.intro,
                                googleMapsQuery = f.googleMapsQuery,
                                district = f.district,
                                openingHours = f.openingHours,
                                startHour = f.startHour,
                                endHour = f.endHour
                            )
                        )
                    }
                }

                if (matching.size < 15) {
                    city.famousFood.forEach { foodName ->
                        if (matching.size < 15) {
                            matching.add(
                                Spot(
                                    name = foodName,
                                    intro = "${city.name}在地必嚐代表美食，營業中店家推薦，美味可口令人回味。",
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
                matching.take(15)
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header (NO number 15 or count displayed on UI, and NO inline return button)
                Column(modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
                    Text(
                        text = "⚡ 即刻啟動・營業中推薦",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Teal900
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${getLocalizedCityName(city.name, language)} · 依目前時間即時精選",
                        fontSize = 12.sp,
                        color = Slate500
                    )
                }

                // List of operating spots
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(bottom = 80.dp)
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
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    // 營業中的色塊出現在地標名稱的文字左上方
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = Emerald100,
                                        modifier = Modifier.padding(bottom = 4.dp)
                                    ) {
                                        Text(
                                            text = strings.currentlyOperating,
                                            fontSize = 10.sp,
                                            color = Emerald700,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }

                                    Text(
                                        text = spot.name,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = Slate900
                                    )

                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "${spot.openingHours} · ${spot.districts.firstOrNull() ?: city.name}",
                                        fontSize = 11.sp,
                                        color = Slate500
                                    )

                                    Spacer(modifier = Modifier.height(4.dp))

                                    // 內文的描述需要有滑動功能能看完全文
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .heightIn(max = 72.dp)
                                            .verticalScroll(rememberScrollState())
                                    ) {
                                        Text(
                                            text = spot.intro,
                                            fontSize = 12.sp,
                                            color = Slate600,
                                            lineHeight = 17.sp
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(10.dp))

                                // Direct Google Maps Navigation Button
                                Button(
                                    onClick = { openGoogleMaps(spot) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                                    shape = RoundedCornerShape(10.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                                    modifier = Modifier.align(Alignment.CenterVertically)
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
