package com.taiwan.explore.ui.components

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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.GeminiPlanService
import com.taiwan.explore.data.SavedManager
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItineraryViewDialog(
    plan: ItineraryPlan,
    onDismiss: () -> Unit,
    onRegenerate: (() -> Unit)? = null,
    showRegenerate: Boolean = true,
    language: AppLanguage = AppLanguage.ZH_TW,
    onOpenSaved: () -> Unit = {}
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    
    var showLimitDialog by remember { mutableStateOf(false) }

    if (showLimitDialog) {
        AlertDialog(
            onDismissRequest = { showLimitDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("⚠️", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "收藏夾已額滿", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                }
            },
            text = {
                Text(
                    text = strings.savedLimitReached,
                    fontSize = 14.sp,
                    color = Slate700
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showLimitDialog = false
                        onOpenSaved()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Teal700)
                ) {
                    Text(strings.organizeSaved, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLimitDialog = false }) {
                    Text(strings.close)
                }
            }
        )
    }

    var isFullSaved by remember(plan.id) {
        mutableStateOf(SavedManager.isFullItinerarySavedByPlan(context, plan))
    }

    // Refresh trigger for day/spot saved states
    var saveUpdateTrigger by remember { mutableStateOf(0) }

    val isIslandDestination = remember(plan) {
        plan.isIsland || (TaiwanDataProvider.getCityByName(plan.cityName)?.region == "離島")
    }

    var islandInternalTransport by remember(plan) {
        mutableStateOf(
            if (isIslandDestination) {
                when (plan.selectedTransport) {
                    "騎乘機車" -> "騎乘機車"
                    "大眾運輸" -> "大眾運輸"
                    "自行開車" -> "自行開車"
                    else -> "騎乘機車"
                }
            } else {
                plan.selectedTransport
            }
        )
    }

    val activeTransport = if (isIslandDestination) islandInternalTransport else plan.selectedTransport
    val geminiService = remember { GeminiPlanService() }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.92f)
                .padding(horizontal = 20.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = plan.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = "${plan.cityName} · ${plan.style} · ${activeTransport} · 共 ${plan.daysCount} 天",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Teal700,
                        fontWeight = FontWeight.Medium
                    )
                }

                // 收藏(字樣) then ✕(符號) on the top right
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TextButton(
                        onClick = {
                            if (showRegenerate && onRegenerate != null) {
                                if (isFullSaved) {
                                    SavedManager.removeFullItinerary(context, plan.id)
                                    isFullSaved = false
                                } else {
                                    if (!SavedManager.canSaveFull(context)) {
                                        showLimitDialog = true
                                    } else {
                                        SavedManager.saveFullItinerary(context, plan)
                                        isFullSaved = true
                                    }
                                }
                            } else {
                                onOpenSaved()
                            }
                        },
                        enabled = showRegenerate && onRegenerate != null
                    ) {
                        Text(
                            text = if (isFullSaved) strings.savedFullItinerary else strings.saveFullItinerary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (!showRegenerate || onRegenerate == null) Slate400 else if (isFullSaved) Amber700 else Teal700
                        )
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = strings.close, tint = Slate600)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Action Row: Save Full Trip & Regenerate UI Buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Save Full Trip Button
                Button(
                    onClick = {
                        if (isFullSaved) {
                            SavedManager.removeFullItinerary(context, plan.id)
                            isFullSaved = false
                        } else {
                            if (!SavedManager.canSaveFull(context)) {
                                showLimitDialog = true
                            } else {
                                SavedManager.saveFullItinerary(context, plan)
                                isFullSaved = true
                            }
                        }
                    },
                    enabled = showRegenerate && onRegenerate != null,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isFullSaved) Amber600 else Teal700,
                        disabledContainerColor = Slate200,
                        disabledContentColor = Slate600
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(if (showRegenerate && onRegenerate != null) 1.2f else 1f)
                ) {
                    Icon(
                        imageVector = if (isFullSaved) Icons.Default.BookmarkAdded else Icons.Default.BookmarkAdd,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isFullSaved) strings.savedFullItinerary else strings.saveFullItinerary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Regenerate UI Button (hidden when viewed from Saved)
                if (showRegenerate && onRegenerate != null) {
                    OutlinedButton(
                        onClick = onRegenerate,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Teal800),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Teal600),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(strings.regenerateBtn, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Days Itinerary List (Transit information moved INSIDE LazyColumn to scroll smoothly with itinerary)
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 32.dp)
            ) {
                // Island Internal Transport Switcher inside LazyColumn (re-plan island transit)
                if (isIslandDestination) {
                    item {
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = Teal50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Teal300),
                            modifier = Modifier.fillMaxWidth().padding(bottom = 6.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Tune, contentDescription = null, tint = Teal800, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = strings.islandInternalTitle,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = Teal900
                                    )
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    val internalModes = listOf(
                                        "騎乘機車" to strings.islandInternalScooter,
                                        "自行開車" to strings.islandInternalCar,
                                        "大眾運輸" to strings.islandInternalBus
                                    )
                                    internalModes.forEach { (mode, label) ->
                                        val isCurrent = islandInternalTransport == mode
                                        Surface(
                                            shape = RoundedCornerShape(10.dp),
                                            color = if (isCurrent) Teal700 else Color.White,
                                            border = androidx.compose.foundation.BorderStroke(
                                                1.dp,
                                                if (isCurrent) Teal800 else Teal200
                                            ),
                                            modifier = Modifier
                                                .weight(1f)
                                                .clickable { islandInternalTransport = mode }
                                        ) {
                                            Box(
                                                contentAlignment = Alignment.Center,
                                                modifier = Modifier.padding(vertical = 8.dp, horizontal = 4.dp)
                                            ) {
                                                Text(
                                                    text = label,
                                                    fontSize = 11.sp,
                                                    fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                                                    color = if (isCurrent) Color.White else Slate700
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // Transit Warning inside LazyColumn (scrolls with page, never blocks itinerary)
                plan.transitWarning?.let { warning ->
                    item {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Amber50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Amber300),
                            modifier = Modifier.fillMaxWidth().padding(bottom = 6.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = Amber800)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = warning,
                                    fontSize = 12.sp,
                                    color = Amber900,
                                    lineHeight = 17.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                // Island Notice inside LazyColumn (scrolls with page, never blocks itinerary)
                plan.islandNotice?.let { notice ->
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Teal50)
                                .padding(12.dp)
                                .padding(bottom = 6.dp)
                        ) {
                            Text(
                                text = notice,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Teal800,
                                fontSize = 12.sp,
                                lineHeight = 17.sp
                            )
                        }
                    }
                }

                items(plan.days) { day ->
                    val isDaySaved = remember(day, saveUpdateTrigger) {
                        SavedManager.isDayItinerarySaved(context, plan.cityName, day.dayNumber, day.title)
                    }

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate50),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Day Header with Independent Save Day Button
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "${day.dateLabel} · ${day.title}",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = Slate900
                                    )
                                    Text(
                                        text = day.theme,
                                        fontSize = 12.sp,
                                        color = Teal700,
                                        fontWeight = FontWeight.Medium
                                    )
                                }

                                // Save Day Itinerary Button
                                IconButton(
                                    onClick = {
                                        if (isDaySaved) {
                                            val all = SavedManager.getDayItineraries(context)
                                            val item = all.find { it.cityName == plan.cityName && it.dayNumber == day.dayNumber && it.title == day.title }
                                            item?.let { SavedManager.removeDayItinerary(context, it.id) }
                                        } else {
                                            if (!SavedManager.canSaveDay(context)) {
                                                showLimitDialog = true
                                            } else {
                                                SavedManager.saveDayItinerary(context, plan.cityName, day)
                                            }
                                        }
                                        saveUpdateTrigger++
                                    }
                                ) {
                                    Icon(
                                        imageVector = if (isDaySaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                        contentDescription = strings.saveDayItinerary,
                                        tint = if (isDaySaved) Amber600 else Slate500
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Spot List with Independent Spot Save Button & Navigation
                            day.spots.forEachIndexed { index, spot ->
                                val isSpotSaved = remember(spot, saveUpdateTrigger) {
                                    SavedManager.isSpotSaved(context, plan.cityName, spot.name)
                                }

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 6.dp)
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier.width(28.dp)
                                    ) {
                                        Surface(
                                            shape = RoundedCornerShape(14.dp),
                                            color = Teal700,
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Box(contentAlignment = Alignment.Center) {
                                                Text(
                                                    text = "${index + 1}",
                                                    color = Color.White,
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                        }
                                        if (index < day.spots.size - 1) {
                                            Box(
                                                modifier = Modifier
                                                    .width(2.dp)
                                                    .height(44.dp)
                                                    .background(Teal200)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.width(10.dp))

                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = spot.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 14.sp,
                                                color = Slate800
                                            )
                                            Text(
                                                text = spot.time,
                                                fontSize = 11.sp,
                                                color = Slate500
                                            )
                                        }

                                        Text(
                                            text = spot.intro,
                                            fontSize = 12.sp,
                                            color = Slate600,
                                            lineHeight = 17.sp,
                                            modifier = Modifier.padding(vertical = 2.dp)
                                        )

                                        val spotTransportIcon = when (activeTransport) {
                                            "騎乘機車" -> Icons.Default.TwoWheeler
                                            "大眾運輸" -> Icons.Default.Train
                                            "自行車漫遊" -> Icons.Default.DirectionsBike
                                            "輪船接駁" -> Icons.Default.DirectionsBoat
                                            "飛機往返" -> Icons.Default.Flight
                                            else -> Icons.Default.DirectionsCar
                                        }

                                        val displayTransportText = if (isIslandDestination && activeTransport != plan.selectedTransport) {
                                            when (activeTransport) {
                                                "騎乘機車" -> "機車漫遊約 8-12 分鐘"
                                                "自行開車" -> "自駕開車約 6-10 分鐘"
                                                else -> "環島公車約 15-20 分鐘"
                                            }
                                        } else {
                                            spot.transportToNext
                                        }

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                modifier = Modifier.weight(1f).padding(end = 4.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Schedule,
                                                    contentDescription = null,
                                                    tint = Teal700,
                                                    modifier = Modifier.size(13.dp)
                                                )
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Text(
                                                    text = spot.duration,
                                                    fontSize = 11.sp,
                                                    color = Teal800
                                                )

                                                Spacer(modifier = Modifier.width(8.dp))

                                                Icon(
                                                    imageVector = spotTransportIcon,
                                                    contentDescription = null,
                                                    tint = Teal700,
                                                    modifier = Modifier.size(14.dp)
                                                )
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Text(
                                                    text = displayTransportText,
                                                    fontSize = 11.sp,
                                                    color = Teal800,
                                                    maxLines = 1
                                                )
                                            }

                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                // Independent Spot Favorite Button
                                                IconButton(
                                                    onClick = {
                                                        if (isSpotSaved) {
                                                            SavedManager.removeSpotByName(context, plan.cityName, spot.name)
                                                        } else {
                                                            if (!SavedManager.canSaveSpot(context)) {
                                                                showLimitDialog = true
                                                            } else {
                                                                SavedManager.saveSpot(
                                                                    context = context,
                                                                    cityName = plan.cityName,
                                                                    name = spot.name,
                                                                    intro = spot.intro,
                                                                    googleMapsQuery = spot.googleMapsKeyword,
                                                                    duration = spot.duration
                                                                )
                                                            }
                                                        }
                                                        saveUpdateTrigger++
                                                    },
                                                    modifier = Modifier.size(32.dp)
                                                ) {
                                                    Icon(
                                                        imageVector = if (isSpotSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                                        contentDescription = strings.saveSpot,
                                                        tint = if (isSpotSaved) Color.Red else Slate400,
                                                        modifier = Modifier.size(18.dp)
                                                    )
                                                }

                                                // Google Maps Navigation
                                                IconButton(
                                                    onClick = {
                                                        val query = Uri.encode(spot.googleMapsKeyword)
                                                        val intent = Intent(
                                                            Intent.ACTION_VIEW,
                                                            Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                                                        )
                                                        context.startActivity(intent)
                                                    },
                                                    modifier = Modifier.size(32.dp)
                                                ) {
                                                    Icon(
                                                        imageVector = Icons.Default.Directions,
                                                        contentDescription = strings.openNavigation,
                                                        tint = Teal700,
                                                        modifier = Modifier.size(18.dp)
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Daily Multi-stop Route Button (Incorporating stay hotel if present)
                            val dynamicRouteUrl = remember(day, activeTransport) {
                                geminiService.buildMultiStopRouteUrl(
                                    spots = day.spots,
                                    stayHotel = day.stayHotel,
                                    transport = activeTransport
                                ) ?: day.multiStopRouteUrl
                            }

                            if (dynamicRouteUrl.isNotBlank()) {
                                Spacer(modifier = Modifier.height(10.dp))
                                OutlinedButton(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(dynamicRouteUrl))
                                        context.startActivity(intent)
                                    },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Teal800),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Teal600),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Navigation,
                                        contentDescription = null,
                                        modifier = Modifier.size(15.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = if (day.stayHotel != null) strings.multiStopRouteWithHotel else strings.multiStopRoute,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            // Stay Hotel (Only displayed if NOT the final day of the trip)
                            if (day.dayNumber < plan.daysCount) {
                                day.stayHotel?.let { hotel ->
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Surface(
                                        shape = RoundedCornerShape(12.dp),
                                        color = Color.White,
                                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(12.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Hotel,
                                                contentDescription = null,
                                                tint = Teal700,
                                                modifier = Modifier.size(20.dp)
                                            )
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Column(modifier = Modifier.weight(1f)) {
                                                Text(
                                                    text = "${strings.stayHotel}：${hotel.name}",
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 13.sp,
                                                    color = Slate800
                                                )
                                                Text(
                                                    text = "${hotel.type} · ${hotel.priceRange}",
                                                    fontSize = 11.sp,
                                                    color = Slate500
                                                )
                                            }

                                            IconButton(
                                                onClick = {
                                                    val query = Uri.encode(hotel.googleMapsQuery)
                                                    val intent = Intent(
                                                        Intent.ACTION_VIEW,
                                                        Uri.parse("https://www.google.com/maps/search/?api=1&query=$query")
                                                    )
                                                    context.startActivity(intent)
                                                },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Directions,
                                                    contentDescription = strings.openNavigation,
                                                    tint = Teal700,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Return Transit Recommendations & Return Navigation at end of trip
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Emerald50),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.DirectionsCar, contentDescription = null, tint = Emerald800)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = strings.returnTransitGuide,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Emerald900
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = plan.returnTransitGuide ?: "旅程結束後，建議可搭乘大眾運輸或行經國道返回，祝您旅途平安！",
                                fontSize = 12.sp,
                                color = Slate700,
                                lineHeight = 17.sp
                            )

                            plan.returnNavigationUrl?.let { navUrl ->
                                Spacer(modifier = Modifier.height(10.dp))
                                // 返程導航按鈕 (無額外Icon)
                                Button(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(navUrl))
                                        context.startActivity(intent)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald700),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(text = strings.returnNav, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
