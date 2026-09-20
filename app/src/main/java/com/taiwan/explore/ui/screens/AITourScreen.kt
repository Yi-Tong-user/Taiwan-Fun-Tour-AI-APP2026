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

            // 3. Travel Style (4 options without brackets)
            Text(text = strings.travelStyle, fontWeight = FontWeight.Bold, color = Slate800)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                styles.forEach { s ->
                    val isSelected = selectedStyle == s
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (isSelected) Teal700 else Slate100,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { selectedStyle = s }
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(vertical = 10.dp)) {
                            Text(
                                text = s,
                                color = if (isSelected) Color.White else Slate700,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 4. Transport Method (Mainland vs Island)
            Text(text = strings.transportMethod, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                availableTransports.chunked(2).forEach { rowTransports ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        rowTransports.forEach { t ->
                            val isSelected = selectedTransport == t
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (isSelected) Teal50 else Color.White,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) Teal700 else Slate200
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { selectedTransport = t }
                            ) {
                                Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = t,
                                        fontSize = 13.sp,
                                        color = if (isSelected) Teal800 else Slate700,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            }
                        }
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
