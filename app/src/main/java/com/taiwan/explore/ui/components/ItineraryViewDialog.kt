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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Directions
import androidx.compose.material.icons.filled.Hotel
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItineraryViewDialog(
    plan: ItineraryPlan,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.9f)
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
                        color = Slate900
                    )
                    Text(
                        text = "預訂風格：${plan.style} · 共 ${plan.daysCount} 天",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Teal700,
                        fontWeight = FontWeight.Medium
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "關閉")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

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
                        fontSize = 12.sp
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            // Days Itinerary List
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                items(plan.days) { day ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Slate50),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "${day.dateLabel} · ${day.title}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = Slate900
                                )
                                Surface(
                                    shape = RoundedCornerShape(20.dp),
                                    color = Teal100
                                ) {
                                    Text(
                                        text = day.theme,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        fontSize = 11.sp,
                                        color = Teal800,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Spot List
                            day.spots.forEachIndexed { index, spot ->
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
                                    }

                                    Spacer(modifier = Modifier.width(8.dp))

                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Text(
                                                text = spot.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 15.sp,
                                                color = Slate800
                                            )
                                            Text(
                                                text = spot.time,
                                                fontSize = 12.sp,
                                                color = Slate500
                                            )
                                        }

                                        Text(
                                            text = spot.intro,
                                            fontSize = 13.sp,
                                            color = Slate600,
                                            modifier = Modifier.padding(vertical = 2.dp)
                                        )

                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(top = 4.dp)
                                        ) {
                                            Text(
                                                text = "⏱️ ${spot.duration}  |  🚗 ${spot.transportToNext}",
                                                fontSize = 12.sp,
                                                color = Slate500,
                                                modifier = Modifier.weight(1f)
                                            )

                                            // Google Maps Navigation Button
                                            IconButton(
                                                onClick = { openGoogleMaps(context, spot.googleMapsKeyword) },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.Directions,
                                                    contentDescription = "Google Maps 導航",
                                                    tint = Teal700,
                                                    modifier = Modifier.size(20.dp)
                                                )
                                            }
                                        }
                                    }
                                }

                                if (index < day.spots.size - 1) {
                                    Divider(color = Slate200, modifier = Modifier.padding(vertical = 6.dp))
                                }
                            }

                            // Recommended Stay
                            day.stayHotel?.let { hotel ->
                                Spacer(modifier = Modifier.height(10.dp))
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Teal50,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { openGoogleMaps(context, hotel.googleMapsQuery) }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Hotel,
                                            contentDescription = "住宿推薦",
                                            tint = Amber600,
                                            modifier = Modifier.size(22.dp)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = "當晚推薦住宿：${hotel.name}",
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Slate800
                                            )
                                            Text(
                                                text = "${hotel.type} · ${hotel.priceRange} · ${hotel.description}",
                                                fontSize = 12.sp,
                                                color = Slate600
                                            )
                                        }
                                        Icon(
                                            imageVector = Icons.Default.Directions,
                                            contentDescription = "前往住宿",
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
    }
}

fun openGoogleMaps(context: Context, query: String) {
    val uri = Uri.parse("https://www.google.com/maps/search/?api=1&query=" + Uri.encode(query))
    val intent = Intent(Intent.ACTION_VIEW, uri)
    intent.setPackage("com.google.android.apps.maps")
    if (intent.resolveActivity(context.packageManager) != null) {
        context.startActivity(intent)
    } else {
        context.startActivity(Intent(Intent.ACTION_VIEW, uri))
    }
}
