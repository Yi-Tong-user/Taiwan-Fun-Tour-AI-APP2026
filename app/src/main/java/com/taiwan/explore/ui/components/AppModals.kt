package com.taiwan.explore.ui.components

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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getStrings

@Composable
fun LocationRequestModal(
    isOpen: Boolean,
    onAllow: () -> Unit,
    onDisallow: () -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    if (!isOpen) return
    val strings = getStrings(language)

    Dialog(onDismissRequest = onDisallow) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.Start
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Teal100,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.Navigation,
                                contentDescription = null,
                                tint = Teal800,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = strings.locationRequestTitle,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = strings.locationRequestMessage,
                    fontSize = 14.sp,
                    color = Slate700,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Teal50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Teal200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = Teal700,
                            modifier = Modifier
                                .size(18.dp)
                                .padding(top = 1.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = strings.locationRequestPrivacy,
                            fontSize = 12.sp,
                            color = Teal900,
                            lineHeight = 17.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(
                        onClick = onDisallow,
                        colors = ButtonDefaults.textButtonColors(contentColor = Slate600)
                    ) {
                        Text(strings.disallowBtn, fontWeight = FontWeight.SemiBold)
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = onAllow,
                        colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.MyLocation,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(strings.allowLocationBtn, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun DisclaimerModal(
    isOpen: Boolean,
    onConfirm: () -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    if (!isOpen) return
    val strings = getStrings(language)

    Dialog(onDismissRequest = onConfirm) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.Start
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Amber50,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = null,
                                tint = Amber600,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = strings.disclaimerTitle,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Slate900
                        )
                        Text(
                            text = strings.disclaimerSubtitle,
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = strings.disclaimerText1,
                    fontSize = 13.sp,
                    color = Slate700,
                    lineHeight = 19.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Amber50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Amber200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = null,
                            tint = Amber700,
                            modifier = Modifier
                                .size(18.dp)
                                .padding(top = 1.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = strings.disclaimerText2,
                            fontSize = 12.sp,
                            color = Amber900,
                            lineHeight = 17.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = onConfirm,
                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(strings.understandBtn, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun HowToUseModal(
    isOpen: Boolean,
    onClose: () -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    if (!isOpen) return
    val strings = getStrings(language)
    val scrollState = rememberScrollState()

    Dialog(onDismissRequest = onClose) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f)
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Teal100,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.Book,
                                    contentDescription = null,
                                    tint = Teal800,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = strings.guideTitle,
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = Slate900
                        )
                    }

                    IconButton(onClick = onClose) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = strings.close)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(scrollState),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    GuideItem(
                        icon = "🎲",
                        title = strings.guideItem1Title,
                        desc = strings.guideItem1Desc
                    )

                    GuideItem(
                        icon = "🗺️",
                        title = strings.guideItem2Title,
                        desc = strings.guideItem2Desc
                    )

                    GuideItem(
                        icon = "👍",
                        title = strings.guideItem3Title,
                        desc = strings.guideItem3Desc
                    )

                    GuideItem(
                        icon = "✨",
                        title = strings.guideItem4Title,
                        desc = strings.guideItem4Desc
                    )

                    GuideItem(
                        icon = "🔖",
                        title = strings.guideItem5Title,
                        desc = strings.guideItem5Desc
                    )

                    GuideItem(
                        icon = "🌐",
                        title = strings.guideItem6Title,
                        desc = strings.guideItem6Desc
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onClose,
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(strings.close, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun GuideItem(icon: String, title: String, desc: String) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = Slate50,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = icon, fontSize = 18.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Slate900
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = desc,
                fontSize = 13.sp,
                color = Slate600,
                lineHeight = 18.sp
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanCustomizerBottomSheet(
    initialCityName: String,
    onDismiss: () -> Unit,
    onSubmit: (city: String, days: Int, style: String, transport: String, stayPref: String, special: String) -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val strings = getStrings(language)
    var selectedCity by remember { mutableStateOf(initialCityName) }
    var selectedDays by remember { mutableStateOf(2) }
    var selectedStyle by remember { mutableStateOf("山海自然放鬆") }
    var selectedTransport by remember { mutableStateOf("自行開車 / 租車自駕") }
    var selectedStayPref by remember { mutableStateOf("舒適質感商旅") }
    var specialRequests by remember { mutableStateOf("") }

    val styles = listOf("山海自然放鬆", "歷史文化古蹟", "在地排隊美食巡禮", "親子觀光工廠體驗", "文青藝術街區")
    val transports = listOf("自行開車 / 租車自駕", "大眾運輸（高鐵/台鐵/客運捷運）", "機車雙載輕旅行")
    val stayPrefs = listOf("頂級奢華度假", "舒適質感商旅", "平價青年旅舍 / 特色民宿")

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        val scrollState = rememberScrollState()
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp)
                .verticalScroll(scrollState)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Teal700)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = strings.aiTourTitle,
                        style = MaterialTheme.typography.titleLarge,
                        color = Slate900
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = strings.close)
                }
            }

            Text(
                text = strings.aiTourSubtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = Slate600
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Days Selection (1 to 5)
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
                        Text("${d}日", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Style Selection
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

            Spacer(modifier = Modifier.height(10.dp))

            // Transport Selection
            Text(text = strings.transportMethod, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                transports.forEach { t ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (selectedTransport == t) Teal50 else Slate50,
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

            Spacer(modifier = Modifier.height(10.dp))

            // Accommodation Preference
            Text(text = strings.stayPreference, fontWeight = FontWeight.Bold, color = Slate800)
            Column(modifier = Modifier.padding(vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                stayPrefs.forEach { sp ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (selectedStayPref == sp) Teal50 else Slate50,
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

            Spacer(modifier = Modifier.height(10.dp))

            // Special Request Input
            OutlinedTextField(
                value = specialRequests,
                onValueChange = { specialRequests = it },
                label = { Text(strings.specialRequests) },
                placeholder = { Text(strings.specialRequestsHint, fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Submit Button
            Button(
                onClick = { onSubmit(selectedCity, selectedDays, selectedStyle, selectedTransport, selectedStayPref, specialRequests) },
                colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text(strings.generateBtn, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(28.dp))
        }
    }
}
