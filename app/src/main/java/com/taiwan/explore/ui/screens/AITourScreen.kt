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
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val coroutineScope = rememberCoroutineScope()
    val geminiService = remember { GeminiPlanService() }
    val strings = getStrings(language)
    val scrollState = rememberScrollState()

    var selectedCity by remember { mutableStateOf(initialCityName) }
    var selectedDays by remember { mutableStateOf(2) }
    var selectedStyle by remember { mutableStateOf("山海自然放鬆") }
    var selectedTransport by remember { mutableStateOf("自行開車 / 租車自駕") }
    var selectedStayPref by remember { mutableStateOf("舒適質感商旅") }
    var specialRequests by remember { mutableStateOf("") }

    var isLoadingPlan by remember { mutableStateOf(false) }
    var generatedPlan by remember { mutableStateOf<ItineraryPlan?>(null) }
    var showPlanDialog by remember { mutableStateOf(false) }

    val styles = listOf("山海自然放鬆", "歷史文化古蹟", "在地排隊美食巡禮", "親子觀光工廠體驗", "文青藝術街區")
    val transports = listOf("自行開車 / 租車自駕", "大眾運輸（高鐵/台鐵/客運捷運）", "機車雙載輕旅行")
    val stayPrefs = listOf("頂級奢華度假", "舒適質感商旅", "平價青年旅舍 / 特色民宿")

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
                    specialRequests = specialRequests
                )
                generatedPlan = plan
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
                        text = strings.aiTourTitle,
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

            // 1. Destination City
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
                            text = getLocalizedCityName(selectedCity, language),
                            color = Slate800,
                            fontWeight = FontWeight.Bold
                        )
                        Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate600)
                    }
                }

                DropdownMenu(
                    expanded = cityExpanded,
                    onDismissRequest = { cityExpanded = false }
                ) {
                    TaiwanDataProvider.cities.forEach { c ->
                        DropdownMenuItem(
                            text = { Text(getLocalizedCityName(c.name, language)) },
                            onClick = {
                                selectedCity = c.name
                                cityExpanded = false
                            }
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

            // 3. Travel Style
            Text(text = strings.travelStyle, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                styles.chunked(3).forEach { rowStyles ->
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        rowStyles.forEach { s ->
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = if (selectedStyle == s) Teal700 else Slate100,
                                modifier = Modifier.clickable { selectedStyle = s }
                            ) {
                                Text(
                                    text = s,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    color = if (selectedStyle == s) Color.White else Slate700,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 4. Transport Method
            Text(text = strings.transportMethod, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                transports.forEach { t ->
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (selectedTransport == t) Teal50 else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (selectedTransport == t) Teal700 else Slate200
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedTransport = t }
                    ) {
                        Text(
                            text = t,
                            modifier = Modifier.padding(10.dp),
                            fontSize = 13.sp,
                            color = if (selectedTransport == t) Teal800 else Slate700,
                            fontWeight = if (selectedTransport == t) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 5. Accommodation Preference
            Text(text = strings.stayPreference, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                stayPrefs.forEach { sp ->
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (selectedStayPref == sp) Teal50 else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (selectedStayPref == sp) Teal700 else Slate200
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedStayPref = sp }
                    ) {
                        Text(
                            text = sp,
                            modifier = Modifier.padding(10.dp),
                            fontSize = 13.sp,
                            color = if (selectedStayPref == sp) Teal800 else Slate700,
                            fontWeight = if (selectedStayPref == sp) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 6. Special Requests
            OutlinedTextField(
                value = specialRequests,
                onValueChange = { specialRequests = it },
                label = { Text(strings.specialRequests) },
                placeholder = { Text(strings.specialRequestsHint, fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // 7. Submit Button
            Button(
                onClick = { triggerGenerate() },
                colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(strings.generateBtn, fontSize = 16.sp, fontWeight = FontWeight.Bold)
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
