package com.taiwan.explore.ui.components

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
import com.taiwan.explore.model.Accommodation
import com.taiwan.explore.model.CityData
import com.taiwan.explore.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CityDetailBottomSheet(
    city: CityData,
    onDismiss: () -> Unit,
    onPlanItinerary: (days: Int, style: String) -> Unit
) {
    val context = LocalContext.current
    var selectedTab by remember { mutableStateOf(0) } // 0: 地方特色, 1: 必遊景點, 2: 觀光工廠, 3: 住宿精選
    val tabs = listOf("地方特色", "必遊景點", "觀光工廠", "住宿推薦")

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.88f)
                .padding(horizontal = 20.dp)
        ) {
            // City Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = city.name,
                        style = MaterialTheme.typography.headlineMedium,
                        color = Slate900
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Teal100
                    ) {
                        Text(
                            text = city.region,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = Teal800,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "關閉")
                }
            }

            Text(
                text = city.description,
                style = MaterialTheme.typography.bodyMedium,
                color = Slate600,
                modifier = Modifier.padding(vertical = 6.dp)
            )

            // Fast Plan Action Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { onPlanItinerary(1, "經典精華一日遊") },
                    colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("1日遊規劃", fontSize = 13.sp)
                }

                Button(
                    onClick = { onPlanItinerary(2, "深度山海二日遊") },
                    colors = ButtonDefaults.buttonColors(containerColor = Teal800),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("2日遊規劃", fontSize = 13.sp)
                }
            }

            // Tab Row
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                edgePadding = 0.dp,
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

            Spacer(modifier = Modifier.height(12.dp))

            // Tab Content
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                when (selectedTab) {
                    0 -> { // 地方特色（農產、漁產、畜牧、必吃美食）
                        item {
                            SpecialtySection(
                                icon = "🌾",
                                title = "在地優質農產",
                                content = city.agriculture
                            )
                        }
                        item {
                            SpecialtySection(
                                icon = "🐟",
                                title = "海洋漁業水產",
                                content = city.fishery
                            )
                        }
                        item {
                            SpecialtySection(
                                icon = "🥩",
                                title = "在地畜牧特產",
                                content = city.livestock
                            )
                        }
                        item {
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Teal50)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text(
                                        text = "🍜 代表性排隊小吃",
                                        fontWeight = FontWeight.Bold,
                                        color = Teal800,
                                        fontSize = 15.sp
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = city.famousFood.joinToString(" • "),
                                        color = Slate700,
                                        fontSize = 13.sp
                                    )
                                }
                            }
                        }
                    }

                    1 -> { // 必遊景點
                        items(city.highlights) { spot ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Slate50),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = spot.name,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp,
                                            color = Slate800
                                        )
                                        Text(
                                            text = spot.intro,
                                            fontSize = 13.sp,
                                            color = Slate600
                                        )
                                    }
                                    IconButton(onClick = { openGoogleMaps(context, spot.googleMapsQuery) }) {
                                        Icon(
                                            imageVector = Icons.Default.Directions,
                                            contentDescription = "導航",
                                            tint = Teal700
                                        )
                                    }
                                }
                            }
                        }
                    }

                    2 -> { // 觀光工廠
                        if (city.tourismFactories.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier.fillMaxWidth().padding(24.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("暫無觀光工廠資料", color = Slate500)
                                }
                            }
                        } else {
                            items(city.tourismFactories) { factory ->
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = Slate50),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        modifier = Modifier.padding(14.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = factory.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 15.sp,
                                                color = Slate800
                                            )
                                            Text(
                                                text = factory.intro,
                                                fontSize = 13.sp,
                                                color = Slate600
                                            )
                                        }
                                        IconButton(onClick = { openGoogleMaps(context, factory.googleMapsQuery) }) {
                                            Icon(
                                                imageVector = Icons.Default.Directions,
                                                contentDescription = "導航",
                                                tint = Teal700
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    3 -> { // 住宿推薦
                        items(city.accommodations) { hotel ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Slate50),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(
                                                text = hotel.name,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 15.sp,
                                                color = Slate800
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Surface(
                                                shape = RoundedCornerShape(4.dp),
                                                color = Amber500.copy(alpha = 0.15f)
                                            ) {
                                                Text(
                                                    text = hotel.type,
                                                    fontSize = 11.sp,
                                                    color = Amber600,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }
                                        Text(
                                            text = hotel.description,
                                            fontSize = 13.sp,
                                            color = Slate600
                                        )
                                        Text(
                                            text = "預估價位：${hotel.priceRange}",
                                            fontSize = 12.sp,
                                            color = Teal700,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                    IconButton(onClick = { openGoogleMaps(context, hotel.googleMapsQuery) }) {
                                        Icon(
                                            imageVector = Icons.Default.Directions,
                                            contentDescription = "導航",
                                            tint = Teal700
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

@Composable
fun SpecialtySection(icon: String, title: String, content: String) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Slate50),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = icon, fontSize = 18.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    color = Slate800,
                    fontSize = 14.sp
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = content,
                color = Slate600,
                fontSize = 13.sp
            )
        }
    }
}
