package com.taiwan.explore.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanCustomizerBottomSheet(
    initialCityName: String,
    onDismiss: () -> Unit,
    onSubmit: (city: String, days: Int, style: String, transport: String, special: String) -> Unit
) {
    var selectedCity by remember { mutableStateOf(initialCityName) }
    var selectedDays by remember { mutableStateOf(2) }
    var selectedStyle by remember { mutableStateOf("山海自然放鬆") }
    var selectedTransport by remember { mutableStateOf("自行開車 / 租車自駕") }
    var specialRequests by remember { mutableStateOf("") }

    val styles = listOf("山海自然放鬆", "歷史文化古蹟", "在地排隊美食巡禮", "親子觀光工廠體驗", "文青藝術街區")
    val transports = listOf("自行開車 / 租車自駕", "大眾運輸（高鐵/台鐵/客運捷運）", "機車雙載輕旅行")

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp)
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
                        text = "Gemini AI 智能行程規劃",
                        style = MaterialTheme.typography.titleLarge,
                        color = Slate900
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "關閉")
                }
            }

            Text(
                text = "針對台灣各地縣市特色、農漁牧產與順暢地理動線，客製專屬行程與住宿規劃。",
                style = MaterialTheme.typography.bodyMedium,
                color = Slate600
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Days Selection
            Text(text = "規劃天數", fontWeight = FontWeight.Bold, color = Slate800)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(1, 2, 3, 4).forEach { d ->
                    OutlinedButton(
                        onClick = { selectedDays = d },
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = if (selectedDays == d) Teal100 else Color.White,
                            contentColor = if (selectedDays == d) Teal800 else Slate700
                        ),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("${d} 日遊")
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Style Selection
            Text(text = "旅遊風格", fontWeight = FontWeight.Bold, color = Slate800)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                styles.take(3).forEach { s ->
                    Surface(
                        shape = RoundedCornerShape(20.dp),
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

            Spacer(modifier = Modifier.height(10.dp))

            // Transport Selection
            Text(text = "交通方式", fontWeight = FontWeight.Bold, color = Slate800)
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

            // Special Request Input
            OutlinedTextField(
                value = specialRequests,
                onValueChange = { specialRequests = it },
                label = { Text("特殊需求 (如: 帶長輩小孩、需室內避雨吹冷氣、蔬食素食)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Submit Button
            Button(
                onClick = { onSubmit(selectedCity, selectedDays, selectedStyle, selectedTransport, specialRequests) },
                colors = ButtonDefaults.buttonColors(containerColor = Teal700),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("立即產生行程規劃", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
