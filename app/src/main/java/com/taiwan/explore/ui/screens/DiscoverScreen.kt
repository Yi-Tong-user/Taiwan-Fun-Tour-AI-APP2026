package com.taiwan.explore.ui.screens

import android.content.Context
import android.content.Intent
import android.location.Location
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.getLocalizedCityName
import com.taiwan.explore.util.getStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoverScreen(
    onSelectCity: (CityData) -> Unit,
    activeCityName: String = "臺北市",
    userLocation: Location? = null,
    language: AppLanguage = AppLanguage.ZH_TW
) {
    val context = LocalContext.current
    val strings = getStrings(language)

    var searchQuery by remember { mutableStateOf("") }
    val allCities = remember { TaiwanDataProvider.cities }

    val filteredCities = remember(searchQuery) {
        if (searchQuery.isBlank()) {
            allCities
        } else {
            allCities.filter {
                it.name.contains(searchQuery, ignoreCase = true) ||
                        it.agriculture.contains(searchQuery, ignoreCase = true) ||
                        it.fishery.contains(searchQuery, ignoreCase = true) ||
                        it.livestock.contains(searchQuery, ignoreCase = true) ||
                        it.region.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Search & Filter Header
        Surface(
            color = Color.White,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text(strings.searchCityPlaceholder, fontSize = 13.sp) },
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = Teal700)
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = null, tint = Slate400)
                            }
                        }
                    },
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Teal700,
                        unfocusedBorderColor = Slate200,
                        focusedContainerColor = Slate50,
                        unfocusedContainerColor = Slate50
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = strings.exploreCities,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = "${filteredCities.size} 個縣市",
                        fontSize = 12.sp,
                        color = Slate500,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        // Full-screen City List (Covering Map, Clean Text, No colored badge blocks)
        LazyColumn(
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredCities) { city ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectCity(city) }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Clean Text Display (No Colored Box Badge)
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = getLocalizedCityName(city.name, language),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = Slate900
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Teal50
                                ) {
                                    Text(
                                        text = city.region,
                                        fontSize = 11.sp,
                                        color = Teal800,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "🌾 ${strings.agriculturalProduce}：${city.agriculture}",
                                fontSize = 12.sp,
                                color = Slate700,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "🐟 ${strings.fisheryProduce}：${city.fishery}",
                                fontSize = 12.sp,
                                color = Slate600,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "🥩 ${strings.livestockProduce}：${city.livestock}",
                                fontSize = 12.sp,
                                color = Slate600,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        Icon(
                            imageVector = Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = Slate400,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }
        }
    }
}
