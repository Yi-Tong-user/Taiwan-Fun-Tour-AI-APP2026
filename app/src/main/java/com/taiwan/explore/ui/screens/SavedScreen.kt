package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.*
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.components.ItineraryViewDialog
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings

@Composable
fun SavedScreen(
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    var selectedTab by remember { mutableStateOf(0) } // 0: 全旅程, 1: 單日旅程, 2: 景點收藏
    var refreshKey by remember { mutableStateOf(0) }
    var selectedPlanForView by remember { mutableStateOf<ItineraryPlan?>(null) }
    var showClearDialog by remember { mutableStateOf(false) }

    val fullList = remember(refreshKey) { SavedManager.getFullItineraries(context) }
    val dayList = remember(refreshKey) { SavedManager.getDayItineraries(context) }
    val spotList = remember(refreshKey) { SavedManager.getSavedSpots(context) }

    val tabs = listOf(
        "${strings.tabFullItinerary} (${fullList.size})",
        "${strings.tabDayItinerary} (${dayList.size})",
        "${strings.tabSingleSpot} (${spotList.size})"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Tab Row
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.White,
            contentColor = Teal700,
            divider = { Divider(color = Slate200) }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                            color = if (selectedTab == index) Teal700 else Slate600
                        )
                    }
                )
            }
        }

        // Action bar for Spot Tab (Clear all spots)
        if (selectedTab == 2 && spotList.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = { showClearDialog = true },
                    colors = ButtonDefaults.textButtonColors(contentColor = Color.Red)
                ) {
                    Icon(imageVector = Icons.Default.DeleteSweep, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(strings.clearAllSpots, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // List Content
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            when (selectedTab) {
                0 -> {
                    // Full Itineraries
                    if (fullList.isEmpty()) {
                        item {
                            EmptyState(strings.emptySavedFull)
                        }
                    } else {
                        items(fullList) { item ->
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedPlanForView = item.plan }
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Surface(
                                                    shape = RoundedCornerShape(8.dp),
                                                    color = Teal100
                                                ) {
                                                    Text(
                                                        text = getLocalizedCityName(item.cityName, language),
                                                        fontSize = 11.sp,
                                                        fontWeight = FontWeight.Bold,
                                                        color = Teal800,
                                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                    )
                                                }
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text(
                                                    text = "${item.daysCount} 日遊",
                                                    fontSize = 12.sp,
                                                    color = Slate600
                                                )
                                            }

                                            Spacer(modifier = Modifier.height(4.dp))

                                            Text(
                                                text = item.title,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 16.sp,
                                                color = Slate900
                                            )
                                            Text(
                                                text = "風格：${item.style}",
                                                fontSize = 12.sp,
                                                color = Slate500
                                            )
                                        }

                                        IconButton(
                                            onClick = {
                                                SavedManager.removeFullItinerary(context, item.id)
                                                refreshKey++
                                            }
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.DeleteOutline,
                                                contentDescription = strings.deleteItem,
                                                tint = Color.Red.copy(alpha = 0.7f)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                1 -> {
                    // Day Itineraries
                    if (dayList.isEmpty()) {
                        item {
                            EmptyState(strings.emptySavedDay)
                        }
                    } else {
                        items(dayList) { item ->
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Surface(
                                                shape = RoundedCornerShape(8.dp),
                                                color = Teal100
                                            ) {
                                                Text(
                                                    text = "${getLocalizedCityName(item.cityName, language)} · ${item.dateLabel}",
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Teal800,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }

                                            Spacer(modifier = Modifier.height(4.dp))

                                            Text(
                                                text = item.title,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 15.sp,
                                                color = Slate900
                                            )
                                            Text(
                                                text = "主題：${item.theme}",
                                                fontSize = 12.sp,
                                                color = Teal700
                                            )
                                        }

                                        IconButton(
                                            onClick = {
                                                SavedManager.removeDayItinerary(context, item.id)
                                                refreshKey++
                                            }
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.DeleteOutline,
                                                contentDescription = strings.deleteItem,
                                                tint = Color.Red.copy(alpha = 0.7f)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))

                                    // Day spots summary
                                    item.day.spots.forEachIndexed { i, s ->
                                        Row(
                                            modifier = Modifier.padding(vertical = 2.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = "${i + 1}. ${s.name} (${s.time})",
                                                fontSize = 12.sp,
                                                color = Slate600
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                2 -> {
                    // Spot Items
                    if (spotList.isEmpty()) {
                        item {
                            EmptyState(strings.emptySavedSpot)
                        }
                    } else {
                        items(spotList) { spot ->
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Surface(
                                                shape = RoundedCornerShape(8.dp),
                                                color = Amber100
                                            ) {
                                                Text(
                                                    text = getLocalizedCityName(spot.cityName, language),
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Amber900,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = spot.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 15.sp,
                                                color = Slate900
                                            )
                                        }

                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            // Navigation
                                            IconButton(
                                                onClick = {
                                                    val query = Uri.encode(spot.googleMapsQuery)
                                                    val intent = Intent(
                                                        Intent.ACTION_VIEW,
                                                        Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                                                    )
                                                    context.startActivity(intent)
                                                }
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Directions,
                                                    contentDescription = strings.openNavigation,
                                                    tint = Teal700
                                                )
                                            }

                                            // Delete
                                            IconButton(
                                                onClick = {
                                                    SavedManager.removeSpot(context, spot.id)
                                                    refreshKey++
                                                }
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.DeleteOutline,
                                                    contentDescription = strings.deleteItem,
                                                    tint = Color.Red.copy(alpha = 0.7f)
                                                )
                                            }
                                        }
                                    }

                                    if (spot.intro.isNotEmpty()) {
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = spot.intro,
                                            fontSize = 12.sp,
                                            color = Slate600,
                                            lineHeight = 17.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // View Full Plan Dialog
        selectedPlanForView?.let { plan ->
            ItineraryViewDialog(
                plan = plan,
                onDismiss = { selectedPlanForView = null },
                onRegenerate = { selectedPlanForView = null },
                language = language
            )
        }

        // Clear all spots confirmation dialog
        if (showClearDialog) {
            AlertDialog(
                onDismissRequest = { showClearDialog = false },
                title = { Text(strings.clearAllSpots, fontWeight = FontWeight.Bold) },
                text = { Text(strings.clearAllConfirm) },
                confirmButton = {
                    Button(
                        onClick = {
                            SavedManager.clearAllSpots(context)
                            refreshKey++
                            showClearDialog = false
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                    ) {
                        Text(strings.deleteItem)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showClearDialog = false }) {
                        Text(strings.close)
                    }
                }
            )
        }
    }
}

@Composable
private fun EmptyState(message: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 60.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.BookmarkBorder,
                contentDescription = null,
                tint = Slate300,
                modifier = Modifier.size(56.dp)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = message,
                fontSize = 14.sp,
                color = Slate500,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
