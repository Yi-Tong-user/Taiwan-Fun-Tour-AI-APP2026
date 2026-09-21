package com.taiwan.explore.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.GeminiPlanService
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.components.ItineraryViewDialog
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings
import kotlinx.coroutines.launch

@Composable
fun AITourScreen(
    initialCityName: String = "臺北市",
    userLocationName: String? = null,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val coroutineScope = rememberCoroutineScope()
    val geminiService = remember { GeminiPlanService() }
    val strings = getStrings(language)
    val scrollState = rememberScrollState()

    var selectedCity by remember { mutableStateOf(initialCityName) }
    var selectedDays by remember { mutableStateOf(2) }
    var selectedStyle by remember { mutableStateOf("休閒遊憩") }
    var selectedTransport by remember { mutableStateOf("自行開車") }
    var selectedStayPref by remember { mutableStateOf("經典舒適") }
    var keepSameHotel by remember { mutableStateOf(true) }

    var isLoadingPlan by remember { mutableStateOf(false) }
    var generatedPlan by remember { mutableStateOf<ItineraryPlan?>(null) }
    var showPlanDialog by remember { mutableStateOf(false) }
    var hasGeneratedOnce by remember { mutableStateOf(false) }

    // 4 Core Travel Styles (UI shows only clean titles, connotations are passed to AI backend)
    val styles = listOf("休閒遊憩", "文化生活", "戶外漫遊", "美食尋味")

    // Destination city object & Island check
    val currentCityData = remember(selectedCity) {
        TaiwanDataProvider.getCityByName(selectedCity) ?: TaiwanDataProvider.cities.first()
    }
    val isIslandCity = currentCityData.region == "離島"

    // Transit options based on mainland vs island
    val mainlandTransports = listOf("自行開車", "大眾運輸", "騎乘機車", "自行車漫遊")
    val islandTransports = listOf("自行開車", "大眾運輸", "騎乘機車", "自行車漫遊", "輪船接駁", "飛機往返")
    val availableTransports = if (isIslandCity) islandTransports else mainlandTransports

    // Reset selectedTransport if it's invalid for mainland
    LaunchedEffect(isIslandCity) {
        if (!isIslandCity && (selectedTransport == "輪船接駁" || selectedTransport == "飛機往返")) {
            selectedTransport = "自行開車"
        }
    }

    // 3 Accommodation tiers
    val stayPrefs = listOf("小資經濟", "經典舒適", "尊榮輕奢")

    fun triggerGenerate() {
        isLoadingPlan = true
        coroutineScope.launch {
            try {
                val plan = geminiService.generateItinerary(
                    cityName = selectedCity,
                    days = selectedDays,
                    style = selectedStyle,
                    transport = selectedTransport,
                    stayPreference = selectedStayPref,
                    keepSameHotel = keepSameHotel,
                    userOrigin = userLocationName
                )
                generatedPlan = plan
                hasGeneratedOnce = true
                showPlanDialog = true
            } finally {
                isLoadingPlan = false
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate50)
                .verticalScroll(scrollState)
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            // Header
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = Teal700,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = strings.tabAITour,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = strings.aiTourSubtitle,
                        fontSize = 12.sp,
                        color = Slate600
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 1. Destination City with Regional Grouping
            Text(text = strings.selectCity, fontWeight = FontWeight.Bold, color = Slate800)
            Spacer(modifier = Modifier.height(6.dp))
            var cityExpanded by remember { mutableStateOf(false) }
            Box {
                OutlinedButton(
                    onClick = { cityExpanded = true },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${currentCityData.region}・${getLocalizedCityName(selectedCity, language)}",
                            color = Slate800,
                            fontWeight = FontWeight.Bold
                        )
                        Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate600)
                    }
                }

                DropdownMenu(
                    expanded = cityExpanded,
                    onDismissRequest = { cityExpanded = false },
                    modifier = Modifier.heightIn(max = 400.dp)
                ) {
                    val regions = listOf("北部", "中部", "南部", "東部", "離島")
                    regions.forEach { reg ->
                        Text(
                            text = "── $reg ──",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Teal800,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                        )
                        TaiwanDataProvider.cities.filter { it.region == reg }.forEach { c ->
                            DropdownMenuItem(
                                text = { Text(getLocalizedCityName(c.name, language), fontSize = 13.sp) },
                                onClick = {
                                    selectedCity = c.name
                                    cityExpanded = false
                                }
                            )
                        }
                    }
                }
            }

            // Island Transit Features Card (Auto-detect boat/flight)
            val islandCap = remember(selectedCity) {
                GeminiPlanService.getIslandCapability(selectedCity)
            }
            if (isIslandCity && islandCap != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Blue50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Blue100),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.DirectionsBoat, contentDescription = null, tint = Blue800, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "【${getLocalizedCityName(selectedCity, language)}】${strings.islandFeatureNotice}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Blue900
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "🚢 船班：${islandCap.boatDescription}",
                            fontSize = 11.sp,
                            color = Slate700,
                            lineHeight = 16.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "✈️ 航班：${islandCap.flightDescription}",
                            fontSize = 11.sp,
                            color = Slate700,
                            lineHeight = 16.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 2. Duration (1 to 5 days)
            Text(text = strings.planDays, fontWeight = FontWeight.Bold, color = Slate800)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                (1..5).forEach { d ->
                    OutlinedButton(
                        onClick = { selectedDays = d },
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = if (selectedDays == d) Teal100 else Color.White,
                            contentColor = if (selectedDays == d) Teal800 else Slate700
                        ),
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(horizontal = 2.dp, vertical = 6.dp),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("${d}日", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 3. Travel Style (Explicit Definitions)
            Text(text = strings.travelStyle, fontWeight = FontWeight.Bold, color = Slate800)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                styles.forEach { s ->
                    val isSelected = selectedStyle == s
                    val styleLabel = when (s) {
                        "休閒遊憩" -> strings.styleLeisure
                        "文化生活" -> strings.styleCulture
                        "戶外漫遊" -> strings.styleOutdoor
                        "美食尋味" -> strings.styleFood
                        else -> s
                    }
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (isSelected) Teal700 else Slate100,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { selectedStyle = s }
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(vertical = 10.dp)) {
                            Text(
                                text = styleLabel,
                                color = if (isSelected) Color.White else Slate700,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Style Definition Explanation Card
            val styleDescription = when (selectedStyle) {
                "休閒遊憩" -> strings.styleLeisureDesc
                "文化生活" -> strings.styleCultureDesc
                "戶外漫遊" -> strings.styleOutdoorDesc
                "美食尋味" -> strings.styleFoodDesc
                else -> ""
            }

            Spacer(modifier = Modifier.height(4.dp))
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Teal50,
                border = androidx.compose.foundation.BorderStroke(1.dp, Teal200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = when (selectedStyle) {
                            "休閒遊憩" -> Icons.Default.Spa
                            "文化生活" -> Icons.Default.AccountBalance
                            "戶外漫遊" -> Icons.Default.Terrain
                            else -> Icons.Default.Restaurant
                        },
                        contentDescription = null,
                        tint = Teal800,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = styleDescription,
                        fontSize = 12.sp,
                        color = Teal900,
                        lineHeight = 17.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 4. Transport Method (Independent Icons & Subtitles)
            Text(text = strings.transportMethod, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                availableTransports.chunked(2).forEach { rowTransports ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        rowTransports.forEach { t ->
                            val isSelected = selectedTransport == t
                            val transportInfo = when (t) {
                                "自行開車" -> Triple(strings.transportCar, strings.transportCarSub, Icons.Default.DirectionsCar)
                                "大眾運輸" -> Triple(strings.transportTransit, strings.transportTransitSub, Icons.Default.Train)
                                "騎乘機車" -> Triple(strings.transportScooter, strings.transportScooterSub, Icons.Default.TwoWheeler)
                                "自行車漫遊" -> Triple(strings.transportBike, strings.transportBikeSub, Icons.Default.DirectionsBike)
                                "輪船接駁" -> Triple(strings.transportBoat, strings.transportBoatSub, Icons.Default.DirectionsBoat)
                                "飛機往返" -> Triple(strings.transportFlight, strings.transportFlightSub, Icons.Default.Flight)
                                else -> Triple(t, "", Icons.Default.DirectionsCar)
                            }

                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) Teal50 else Color.White,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.5.dp,
                                    if (isSelected) Teal700 else Slate200
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { selectedTransport = t }
                            ) {
                                Row(
                                    modifier = Modifier.padding(vertical = 10.dp, horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = transportInfo.third,
                                        contentDescription = null,
                                        tint = if (isSelected) Teal700 else Slate500,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            text = transportInfo.first,
                                            fontSize = 12.sp,
                                            color = if (isSelected) Teal900 else Slate800,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                        )
                                        Text(
                                            text = transportInfo.second,
                                            fontSize = 10.sp,
                                            color = if (isSelected) Teal700 else Slate500
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Transit Suggestion Banner if choice requires caution
            val instantWarning = remember(selectedCity, selectedTransport) {
                GeminiPlanService.getTransitWarning(selectedCity, selectedTransport)
            }
            if (instantWarning != null) {
                Spacer(modifier = Modifier.height(4.dp))
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Amber50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Amber200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = Amber800, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = instantWarning,
                            fontSize = 11.sp,
                            color = Amber900,
                            lineHeight = 15.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // 5. Accommodation Preference (Hidden on 1-day trip)
            if (selectedDays > 1) {
                Spacer(modifier = Modifier.height(14.dp))
                Text(text = strings.stayPreference, fontWeight = FontWeight.Bold, color = Slate800)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    stayPrefs.forEach { sp ->
                        val isSelected = selectedStayPref == sp
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (isSelected) Teal50 else Color.White,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) Teal700 else Slate200
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { selectedStayPref = sp }
                        ) {
                            Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(10.dp)) {
                                Text(
                                    text = sp,
                                    fontSize = 13.sp,
                                    color = if (isSelected) Teal800 else Slate700,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }

                // For >= 3 days: Toggle for "維持原住宿" vs "不維持原住宿"
                if (selectedDays >= 3) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(text = strings.keepSameHotel, fontWeight = FontWeight.Bold, color = Slate800, fontSize = 13.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf(true to strings.keepSameHotelYes, false to strings.keepSameHotelNo).forEach { (keep, label) ->
                            val isSelected = keepSameHotel == keep
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (isSelected) Teal100 else Slate100,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) Teal700 else Color.Transparent
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { keepSameHotel = keep }
                            ) {
                                Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(8.dp)) {
                                    Text(
                                        text = label,
                                        fontSize = 12.sp,
                                        color = if (isSelected) Teal900 else Slate700,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 6. Submit Button (Switches to "再次生成行程規劃" if already generated)
            Button(
                onClick = { triggerGenerate() },
                colors = ButtonDefaults.buttonColors(containerColor = if (hasGeneratedOnce) Amber600 else Teal700),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (hasGeneratedOnce) strings.regenerateBtn else strings.generateBtn,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(80.dp))
        }

        // Loading Overlay
        if (isLoadingPlan) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.6f)),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.padding(32.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        CircularProgressIndicator(color = Teal700, strokeWidth = 3.dp)
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = strings.generatingPlan,
                            fontWeight = FontWeight.Bold,
                            color = Slate900,
                            fontSize = 15.sp
                        )
                        Text(
                            text = strings.generatingPlanSub,
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }
                }
            }
        }

        // Result Dialog
        if (showPlanDialog && generatedPlan != null) {
            ItineraryViewDialog(
                plan = generatedPlan!!,
                onDismiss = { showPlanDialog = false },
                onRegenerate = {
                    showPlanDialog = false
                    triggerGenerate()
                },
                language = language
            )
        }
    }
}
