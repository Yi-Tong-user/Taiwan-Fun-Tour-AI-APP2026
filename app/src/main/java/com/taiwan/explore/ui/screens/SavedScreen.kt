package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.*
import com.taiwan.explore.model.DayItinerary
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.components.ItineraryViewDialog
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedScreen(
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    var selectedTab by remember { mutableStateOf(0) } // 0: 全旅程, 1: 單日旅程, 2: 景點收藏
    var refreshKey by remember { mutableStateOf(0) }
    var selectedPlanForView by remember { mutableStateOf<ItineraryPlan?>(null) }
    var selectedDayForView by remember { mutableStateOf<Pair<String, DayItinerary>?>(null) }
    var selectedSpotForView by remember { mutableStateOf<SavedSpotItem?>(null) }
    var showClearAllSpotsConfirm by remember { mutableStateOf(false) }

    val fullList = remember(refreshKey) { SavedManager.getFullItineraries(context) }
    val dayList = remember(refreshKey) { SavedManager.getDayItineraries(context) }
    val spotList = remember(refreshKey) { SavedManager.getSavedSpots(context) }

    val tabs = listOf(
        "${strings.tabFullItinerary} (${fullList.size})",
        "${strings.tabDayItinerary} (${dayList.size})",
        "${strings.tabSingleSpot} (${spotList.size})"
    )

    val currentTabCount = when (selectedTab) {
        0 -> fullList.size
        1 -> dayList.size
        else -> spotList.size
    }
    val isCurrentTabFull = currentTabCount >= SavedManager.MAX_SAVED_ITEMS

    
    if (showClearAllSpotsConfirm) {
        AlertDialog(
            onDismissRequest = { showClearAllSpotsConfirm = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("🗑️", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "確認刪除全部收藏？", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                }
            },
            text = {
                Text(
                    text = "確定要刪除景點收藏中的全部收藏嗎？若確認，則將清除所有景點收藏，此動作無法復原。",
                    fontSize = 13.sp,
                    color = Slate700
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        SavedManager.clearAllSpots(context)
                        refreshKey++
                        showClearAllSpotsConfirm = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                ) {
                    Text("確認刪除", fontWeight = FontWeight.Bold, color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearAllSpotsConfirm = false }) {
                    Text(strings.close)
                }
            }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Tab Row (Separate tabs for Full, Day, Spots)
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

        // Full Storage Warning Banner
        if (isCurrentTabFull) {
            Surface(
                color = Amber100,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                        Text(text = "⚠️", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = strings.savedLimitReached,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Amber900
                        )
                    }

                    Button(
                        onClick = { /* User focuses on deleting items via swipe */ },
                        colors = ButtonDefaults.buttonColors(containerColor = Amber800),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(text = strings.organizeSaved, fontSize = 11.sp, color = Color.White)
                    }
                }
            }
        }

        // Swipe-to-delete Hint Banner (No trash icons)
        Surface(
            color = Teal50.copy(alpha = 0.6f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "👈", fontSize = 13.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = strings.swipeToDeleteHint,
                    fontSize = 11.sp,
                    color = Teal900,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // List Content with Swipe-to-Delete
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
                        items(fullList, key = { it.id }) { item ->
                            val dismissState = rememberSwipeToDismissBoxState(
                                confirmValueChange = { value ->
                                    if (value == SwipeToDismissBoxValue.EndToStart) {
                                        SavedManager.removeFullItinerary(context, item.id)
                                        refreshKey++
                                        true
                                    } else false
                                }
                            )

                            SwipeToDismissBox(
                                state = dismissState,
                                enableDismissFromStartToEnd = false,
                                enableDismissFromEndToStart = true,
                                backgroundContent = {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(Color.Red.copy(alpha = 0.85f))
                                            .padding(horizontal = 20.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        Text(
                                            text = strings.deleteItem,
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    }
                                }
                            ) {
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

                                            Text(
                                                text = "點選查看完整行程 👉",
                                                fontSize = 11.sp,
                                                color = Teal700
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(6.dp))

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
                        items(dayList, key = { it.id }) { item ->
                            val dismissState = rememberSwipeToDismissBoxState(
                                confirmValueChange = { value ->
                                    if (value == SwipeToDismissBoxValue.EndToStart) {
                                        SavedManager.removeDayItinerary(context, item.id)
                                        refreshKey++
                                        true
                                    } else false
                                }
                            )

                            SwipeToDismissBox(
                                state = dismissState,
                                enableDismissFromStartToEnd = false,
                                enableDismissFromEndToStart = true,
                                backgroundContent = {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(Color.Red.copy(alpha = 0.85f))
                                            .padding(horizontal = 20.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        Text(
                                            text = strings.deleteItem,
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    }
                                }
                            ) {
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedDayForView = Pair(item.cityName, item.day) }
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
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

                                            Text(
                                                text = "點選查看單日細節 👉",
                                                fontSize = 11.sp,
                                                color = Teal700
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(6.dp))

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

                                        Spacer(modifier = Modifier.height(6.dp))

                                        // Day spots summary
                                        item.day.spots.forEachIndexed { i, s ->
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
                        item {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "景點收藏 (${spotList.size} / 20)",
                                    fontSize = 12.sp,
                                    color = Slate600,
                                    fontWeight = FontWeight.Bold
                                )

                                OutlinedButton(
                                    onClick = { showClearAllSpotsConfirm = true },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.Red.copy(alpha = 0.6f)),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.DeleteSweep,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp),
                                        tint = Color.Red
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("一鍵刪除全部收藏", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                        items(spotList, key = { it.id }) { spot ->
                            val dismissState = rememberSwipeToDismissBoxState(
                                confirmValueChange = { value ->
                                    if (value == SwipeToDismissBoxValue.EndToStart) {
                                        SavedManager.removeSpot(context, spot.id)
                                        refreshKey++
                                        true
                                    } else false
                                }
                            )

                            SwipeToDismissBox(
                                state = dismissState,
                                enableDismissFromStartToEnd = false,
                                enableDismissFromEndToStart = true,
                                backgroundContent = {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(Color.Red.copy(alpha = 0.85f))
                                            .padding(horizontal = 20.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        Text(
                                            text = strings.deleteItem,
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    }
                                }
                            ) {
                                Card(
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedSpotForView = spot }
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
        }

        // View Full Plan Dialog
        selectedPlanForView?.let { plan ->
            ItineraryViewDialog(
                plan = plan,
                onDismiss = { selectedPlanForView = null },
                onRegenerate = null,
                showRegenerate = false,
                language = language
            )
        }

        // View Day Detail Dialog
        selectedDayForView?.let { (cityName, day) ->
            AlertDialog(
                onDismissRequest = { selectedDayForView = null },
                title = {
                    Column {
                        Text(text = "${day.dateLabel}・${day.title}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(text = "主題：${day.theme} (${cityName})", fontSize = 12.sp, color = Teal700)
                    }
                },
                text = {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        day.spots.forEachIndexed { i, s ->
                            Text(
                                text = "${i + 1}. ${s.name} (${s.time})",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Slate900
                            )
                            Text(text = s.intro, fontSize = 12.sp, color = Slate600)
                            Spacer(modifier = Modifier.height(6.dp))
                        }

                        day.stayHotel?.let { hotel ->
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(text = "🏨 推薦住宿：${hotel.name} (${hotel.priceRange})", fontSize = 12.sp, color = Amber800, fontWeight = FontWeight.Bold)
                        }

                        day.multiStopRouteUrl?.let { routeUrl ->
                            Spacer(modifier = Modifier.height(10.dp))
                            Button(
                                onClick = {
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(routeUrl))
                                    context.startActivity(intent)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(text = strings.multiStopRoute, fontSize = 12.sp)
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { selectedDayForView = null }) {
                        Text(strings.close)
                    }
                }
            )
        }

        // View Spot Detail Dialog
        selectedSpotForView?.let { spot ->
            AlertDialog(
                onDismissRequest = { selectedSpotForView = null },
                title = {
                    Text(text = spot.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                },
                text = {
                    Column {
                        Text(text = "縣市：${getLocalizedCityName(spot.cityName, language)}", fontSize = 12.sp, color = Teal700, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = spot.intro, fontSize = 13.sp, color = Slate700)
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val query = Uri.encode(spot.googleMapsQuery)
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                            )
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Teal700)
                    ) {
                        Text(strings.openNavigation)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { selectedSpotForView = null }) {
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
