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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.ui.components.DisclaimerModal
import com.taiwan.explore.ui.components.HowToUseModal
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.I18nManager
import com.taiwan.explore.util.getStrings

@Composable
fun SettingsScreen(
    currentLanguage: AppLanguage,
    onLanguageChange: (AppLanguage) -> Unit,
    userLocationName: String? = null,
    isLocationEnabled: Boolean = false,
    onRequestLocation: () -> Unit = {},
    onToggleLocation: () -> Unit = {}
) {
    val context = LocalContext.current
    val strings = getStrings(currentLanguage)
    val scrollState = rememberScrollState()

    var showDisclaimer by remember { mutableStateOf(false) }
    var showGuide by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .verticalScroll(scrollState)
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        // Section: Location Permission & Status
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isLocationEnabled) Icons.Default.LocationOn else Icons.Default.LocationOff,
                        contentDescription = null,
                        tint = if (isLocationEnabled) Teal700 else Amber600
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = strings.locationRequestTitle,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = strings.locationRequestPrivacy,
                    fontSize = 12.sp,
                    color = Slate600,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "${strings.currentLocation}：${if (isLocationEnabled && userLocationName != null) userLocationName else strings.locationDisabled}",
                    fontSize = 13.sp,
                    color = if (isLocationEnabled) Teal800 else Slate600,
                    fontWeight = if (isLocationEnabled) FontWeight.Bold else FontWeight.Normal
                )

                Spacer(modifier = Modifier.height(12.dp))

                if (isLocationEnabled) {
                    Button(
                        onClick = onToggleLocation,
                        colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${strings.locationEnabled} (${strings.disableLocation})",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                } else {
                    Button(
                        onClick = onRequestLocation,
                        colors = ButtonDefaults.buttonColors(containerColor = Amber600),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = strings.enableLocationInSettings,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
        // Section: Language Selection
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Language, contentDescription = null, tint = Teal700)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = strings.languageSection,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppLanguage.entries.forEach { lang ->
                        val isSelected = currentLanguage == lang
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = if (isSelected) Teal50 else Slate50,
                            border = androidx.compose.foundation.BorderStroke(
                                1.5.dp,
                                if (isSelected) Teal700 else Slate200
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    I18nManager.saveLanguage(context, lang)
                                    onLanguageChange(lang)
                                }
                        ) {
                            Column(
                                modifier = Modifier.padding(vertical = 12.dp, horizontal = 4.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(text = lang.flag, fontSize = 24.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = lang.label,
                                    fontSize = 13.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Teal900 else Slate700
                                )
                                if (isSelected) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = Teal700,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section: AI Disclaimer
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.WarningAmber, contentDescription = null, tint = Amber600)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = strings.disclaimerSection,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = strings.disclaimerText1,
                    fontSize = 13.sp,
                    color = Slate600,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = { showDisclaimer = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber600),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.Info, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(strings.openFullDisclaimer, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }

        // Section: User Guide
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.MenuBook, contentDescription = null, tint = Teal700)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = strings.guideSection,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = when (currentLanguage) {
                        AppLanguage.EN -> "Learn about random city adventures, region discovery, recommendations, AI smart tours, 3-tier favorites, and multilingual support."
                        AppLanguage.JA -> "ランダムで街へ出発、地域特産、おすすめスポット、AI旅程、お気に入り管理、多言語切り替えの操作ガイドを確認できます。"
                        else -> "瞭解隨機出發一座城市、分區探索農漁特產、精選推薦、AI 旅程規劃、收藏管理與多語言切換等完整操作流程。"
                    },
                    fontSize = 13.sp,
                    color = Slate600,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = { showGuide = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.HelpOutline, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(strings.openFullGuide, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }

        // App Version Info
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "臺灣好好玩 Taiwan Fun Tour v1.0.0",
                    fontSize = 12.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Powered by Google Gemini AI & Google Maps",
                    fontSize = 11.sp,
                    color = Slate400
                )
            }
        }
    }

    // Modals
    if (showDisclaimer) {
        DisclaimerModal(
            isOpen = true,
            onConfirm = { showDisclaimer = false },
            language = currentLanguage
        )
    }

    if (showGuide) {
        HowToUseModal(
            isOpen = true,
            onClose = { showGuide = false },
            language = currentLanguage
        )
    }
}
