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
import com.taiwan.explore.data.SavedManager
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItineraryViewDialog(
    plan: ItineraryPlan,
    onDismiss: () -> Unit,
    onRegenerate: () -> Unit,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    var isFullSaved by remember(plan) {
        mutableStateOf(SavedManager.isFullItinerarySaved(context, plan.title))
    }

    // Refresh trigger for day/spot saved states
    var saveUpdateTrigger by remember { mutableStateOf(0) }

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
                        text = "${plan.cityName} · ${plan.style} · 共 ${plan.daysCount} 天",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Teal700,
                        fontWeight = FontWeight.Medium
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = strings.close)
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
                            val all = SavedManager.getFullItineraries(context)
                            val found = all.find { it.title == plan.title }
                            found?.let { SavedManager.removeFullItinerary(context, it.id) }
                            isFullSaved = false
                        } else {
                            SavedManager.saveFullItinerary(context, plan)
                            isFullSaved = true
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isFullSaved) Amber600 else Teal700
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1.2f)
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

                // Regenerate UI Button
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

            Spacer(modifier = Modifier.height(10.dp))

            // Island Notice if present
            plan.islandNotice?.let { notice ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Teal50)
                        .padding(12.dp)
                ) {
                    Text(
                        text = notice,
                        style = MaterialTheme.typography.bodyMedium,
                        color = Teal800,
                        fontSize = 12.sp,
                        lineHeight = 17.sp
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
            }

            // Days Itinerary List
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 32.dp)
            ) {
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
                                        text = "主題：${day.theme}",
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
                                            SavedManager.saveDayItinerary(context, plan.cityName, day)
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

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = "⏱️ ${spot.duration}  ·  🚗 ${spot.transportToNext}",
                                                fontSize = 11.sp,
                                                color = Teal800
                                            )

                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                // Independent Spot Favorite Button
                                                IconButton(
                                                    onClick = {
                                                        if (isSpotSaved) {
                                                            SavedManager.removeSpotByName(context, plan.cityName, spot.name)
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

                                }
                            }

                            // Daily "開啟多點行程路線 🗺️" Button
                            day.multiStopRouteUrl?.let { routeUrl ->
                                Spacer(modifier = Modifier.height(10.dp))
                                OutlinedButton(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(routeUrl))
                                        context.startActivity(intent)
                                    },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Teal800),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Teal600),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(text = strings.multiStopRoute, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            // Stay Hotel if present
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
