package com.taiwan.explore

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
import com.taiwan.explore.data.GeminiPlanService
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.components.*
import com.taiwan.explore.ui.theme.*
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TaiwanExploreApp()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TaiwanExploreApp() {
    val coroutineScope = rememberCoroutineScope()
    val geminiService = remember { GeminiPlanService() }

    var selectedRegion by remember { mutableStateOf("全部") }
    var selectedCity by remember { mutableStateOf<CityData?>(null) }
    var showCustomizer by remember { mutableStateOf(false) }
    var showItineraryDialog by remember { mutableStateOf(false) }
    var currentItineraryPlan by remember { mutableStateOf<ItineraryPlan?>(null) }
    var isLoadingPlan by remember { mutableStateOf(false) }

    // Taiwan Center Camera Position
    val defaultTaiwanPos = LatLng(23.7, 120.9)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(defaultTaiwanPos, 7.5f)
    }

    val regions = listOf("全部", "北部", "中部", "南部", "東部", "離島")
    val filteredCities = remember(selectedRegion) {
        if (selectedRegion == "全部") TaiwanDataProvider.cities
        else TaiwanDataProvider.cities.filter { it.region == selectedRegion }
    }

    MaterialTheme(
        colorScheme = TaiwanColorScheme,
        typography = TaiwanTypography
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Column {
                            Text(
                                text = "臺灣好好玩",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color.White
                            )
                            Text(
                                text = "探索臺灣 22 縣市・農漁牧特產・AI 行程規劃",
                                fontSize = 11.sp,
                                color = Teal100
                            )
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = {
                                // Random City Explorer
                                val randomCity = TaiwanDataProvider.cities.random()
                                selectedCity = randomCity
                                coroutineScope.launch {
                                    cameraPositionState.animate(
                                        CameraUpdateFactory.newLatLngZoom(LatLng(randomCity.lat, randomCity.lng), 11.5f)
                                    )
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Casino,
                                contentDescription = "隨機城市出發",
                                tint = Color.White
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Teal700)
                )
            },
            floatingActionButton = {
                FloatingActionButton(
                    onClick = { showCustomizer = true },
                    containerColor = Amber500,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("AI 行程規劃", fontWeight = FontWeight.Bold)
                    }
                }
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(Slate50)
            ) {
                // Interactive Google Map
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
                                title = city.name,
                                snippet = "特色：${city.agriculture.take(15)}...",
                                onClick = {
                                    selectedCity = city
                                    false
                                }
                            )
                        }
                    }

                    // Floating Region Filter Chips
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
                                Surface(
                                    shape = RoundedCornerShape(16.dp),
                                    color = if (isSelected) Teal700 else Color.Transparent,
                                    modifier = Modifier.clickable { selectedRegion = region }
                                ) {
                                    Text(
                                        text = region,
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

                // City Highlights Horizontal List
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.9f)
                        .background(Color.White)
                        .padding(top = 10.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (selectedRegion == "全部") "探索縣市清單" else "${selectedRegion}縣市",
                            style = MaterialTheme.typography.titleMedium,
                            color = Slate900
                        )
                        Text(
                            text = "點選查看農漁特產與景點",
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }

                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
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
                                        selectedCity = city
                                        coroutineScope.launch {
                                            cameraPositionState.animate(
                                                CameraUpdateFactory.newLatLngZoom(LatLng(city.lat, city.lng), 11.5f)
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
                                                text = city.name,
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
                                    }

                                    Icon(
                                        imageVector = Icons.Default.ChevronRight,
                                        contentDescription = "查看詳情",
                                        tint = Slate500
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Loading Overlay
            if (isLoadingPlan) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator(color = Teal700)
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("Gemini 正在智慧規劃行程...", fontWeight = FontWeight.Bold, color = Slate900)
                            Text("分析在地特色、順向動線與推薦住宿", fontSize = 12.sp, color = Slate500)
                        }
                    }
                }
            }

            // City Detail Bottom Sheet
            selectedCity?.let { city ->
                CityDetailBottomSheet(
                    city = city,
                    onDismiss = { selectedCity = null },
                    onPlanItinerary = { days, style ->
                        isLoadingPlan = true
                        selectedCity = null
                        coroutineScope.launch {
                            try {
                                val plan = geminiService.generateItinerary(
                                    cityName = city.name,
                                    days = days,
                                    style = style,
                                    transport = "自行開車 / 租車自駕",
                                    specialRequests = ""
                                )
                                currentItineraryPlan = plan
                                showItineraryDialog = true
                            } finally {
                                isLoadingPlan = false
                            }
                        }
                    }
                )
            }

            // Plan Customizer Modal
            if (showCustomizer) {
                PlanCustomizerBottomSheet(
                    initialCityName = selectedCity?.name ?: "臺北市",
                    onDismiss = { showCustomizer = false },
                    onSubmit = { city, days, style, transport, special ->
                        showCustomizer = false
                        isLoadingPlan = true
                        coroutineScope.launch {
                            try {
                                val plan = geminiService.generateItinerary(
                                    cityName = city,
                                    days = days,
                                    style = style,
                                    transport = transport,
                                    specialRequests = special
                                )
                                currentItineraryPlan = plan
                                showItineraryDialog = true
                            } finally {
                                isLoadingPlan = false
                            }
                        }
                    }
                )
            }

            // Itinerary Plan Result Sheet
            if (showItineraryDialog && currentItineraryPlan != null) {
                ItineraryViewDialog(
                    plan = currentItineraryPlan!!,
                    onDismiss = { showItineraryDialog = false }
                )
            }
        }
    }
}
