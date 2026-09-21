package com.taiwan.explore

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.google.android.gms.maps.model.LatLng
import com.taiwan.explore.data.GeminiPlanService
import com.taiwan.explore.data.TaiwanDataProvider
import com.taiwan.explore.model.CityData
import com.taiwan.explore.model.ItineraryPlan
import com.taiwan.explore.ui.components.*
import com.taiwan.explore.ui.screens.*
import com.taiwan.explore.ui.theme.*
import com.taiwan.explore.util.AppLanguage
import com.taiwan.explore.util.I18nManager
import com.taiwan.explore.util.getStrings
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TaiwanExploreApp()
        }
    }
}

@SuppressLint("MissingPermission")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TaiwanExploreApp() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val geminiService = remember { GeminiPlanService() }

    // Language state
    var currentLanguage by remember {
        mutableStateOf(I18nManager.getSavedLanguage(context))
    }
    val strings = getStrings(currentLanguage)

    // Startup flow modals: 1. 定位說明 -> 2. AI免責聲明
    var showLocationRequestModal by remember { mutableStateOf(true) }
    var showDisclaimerModal by remember { mutableStateOf(false) }

    // Real device location state
    var isLocationEnabled by remember { mutableStateOf(false) }
    var userLocation by remember { mutableStateOf<LatLng?>(null) }
    var userLocationName by remember { mutableStateOf<String?>(null) }

    fun updateLocationFromDevice() {
        try {
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
            if (locationManager != null) {
                val hasFine = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                val hasCoarse = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                if (hasFine || hasCoarse) {
                    val location: Location? = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                        ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

                    if (location != null) {
                        userLocation = LatLng(location.latitude, location.longitude)
                        isLocationEnabled = true

                        // Find nearest Taiwan city to display name
                        val nearest = TaiwanDataProvider.cities.minByOrNull { city ->
                            val dx = city.lat - location.latitude
                            val dy = city.lng - location.longitude
                            dx * dx + dy * dy
                        }
                        userLocationName = nearest?.name ?: "${String.format("%.2f", location.latitude)}, ${String.format("%.2f", location.longitude)}"
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        isLocationEnabled = granted
        if (granted) {
            updateLocationFromDevice()
        }
    }

    // Check existing permissions on launch
    LaunchedEffect(Unit) {
        val hasFine = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val hasCoarse = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        if (hasFine || hasCoarse) {
            isLocationEnabled = true
            updateLocationFromDevice()
        }
    }

    // Navigation Tab state (0: 發現, 1: 推薦, 2: 首頁, 3: AI旅程, 4: 設定)
    var selectedNavTab by remember { mutableStateOf(2) }
    var showSavedDialog by remember { mutableStateOf(false) }
    var homeResetTrigger by remember { mutableStateOf(0) }

    // Shared city state
    var selectedCityForDetail by remember { mutableStateOf<CityData?>(null) }
    var activeCityName by remember { mutableStateOf("臺北市") }

    // Fast AI itinerary state from CityDetailSheet
    var currentItineraryPlan by remember { mutableStateOf<ItineraryPlan?>(null) }
    var showItineraryDialog by remember { mutableStateOf(false) }
    var isLoadingFastPlan by remember { mutableStateOf(false) }

    MaterialTheme(
        colorScheme = TaiwanColorScheme,
        typography = TaiwanTypography
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Column {
                            Text(
                                text = strings.appName,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color.White
                            )
                            Text(
                                text = strings.appSubtitle,
                                fontSize = 11.sp,
                                color = Teal100
                            )
                        }
                    },
                    actions = {
                        // 收藏按鍵 (移動到繁體中文旁邊，不更改原始功能)
                        IconButton(
                            onClick = { showSavedDialog = true }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Bookmark,
                                contentDescription = strings.tabSaved,
                                tint = Color.White
                            )
                        }

                        // Quick Language Indicator
                        TextButton(
                            onClick = { selectedNavTab = 4 }
                        ) {
                            Text(
                                text = "${currentLanguage.flag} ${currentLanguage.label}",
                                color = Color.White,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Teal700)
                )
            },
            bottomBar = {
                NavigationBar(
                    containerColor = Color.White,
                    tonalElevation = 8.dp
                ) {
                    // 1. 發現
                    NavigationBarItem(
                        selected = selectedNavTab == 0,
                        onClick = { selectedNavTab = 0 },
                        icon = { Icon(imageVector = Icons.Default.Explore, contentDescription = strings.tabDiscover) },
                        label = { Text(strings.tabDiscover, fontSize = 11.sp, fontWeight = if (selectedNavTab == 0) FontWeight.Bold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Teal800,
                            selectedTextColor = Teal800,
                            indicatorColor = Teal100,
                            unselectedIconColor = Slate500,
                            unselectedTextColor = Slate500
                        )
                    )

                    // 2. 推薦
                    NavigationBarItem(
                        selected = selectedNavTab == 1,
                        onClick = { selectedNavTab = 1 },
                        icon = { Icon(imageVector = Icons.Default.ThumbUp, contentDescription = strings.tabRecommend) },
                        label = { Text(strings.tabRecommend, fontSize = 11.sp, fontWeight = if (selectedNavTab == 1) FontWeight.Bold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Teal800,
                            selectedTextColor = Teal800,
                            indicatorColor = Teal100,
                            unselectedIconColor = Slate500,
                            unselectedTextColor = Slate500
                        )
                    )

                    // 3. 首頁 (新增在發現、推薦後)
                    NavigationBarItem(
                        selected = selectedNavTab == 2,
                        onClick = {
                            selectedNavTab = 2
                            homeResetTrigger++
                        },
                        icon = { Icon(imageVector = Icons.Default.Home, contentDescription = strings.tabHome) },
                        label = { Text(strings.tabHome, fontSize = 11.sp, fontWeight = if (selectedNavTab == 2) FontWeight.Bold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Teal800,
                            selectedTextColor = Teal800,
                            indicatorColor = Teal100,
                            unselectedIconColor = Slate500,
                            unselectedTextColor = Slate500
                        )
                    )

                    // 4. AI旅程
                    NavigationBarItem(
                        selected = selectedNavTab == 3,
                        onClick = { selectedNavTab = 3 },
                        icon = { Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = strings.tabAITour) },
                        label = { Text(strings.tabAITour, fontSize = 11.sp, fontWeight = if (selectedNavTab == 3) FontWeight.Bold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Teal800,
                            selectedTextColor = Teal800,
                            indicatorColor = Teal100,
                            unselectedIconColor = Slate500,
                            unselectedTextColor = Slate500
                        )
                    )

                    // 5. 設定
                    NavigationBarItem(
                        selected = selectedNavTab == 4,
                        onClick = { selectedNavTab = 4 },
                        icon = { Icon(imageVector = Icons.Default.Settings, contentDescription = strings.tabSettings) },
                        label = { Text(strings.tabSettings, fontSize = 11.sp, fontWeight = if (selectedNavTab == 4) FontWeight.Bold else FontWeight.Normal) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Teal800,
                            selectedTextColor = Teal800,
                            indicatorColor = Teal100,
                            unselectedIconColor = Slate500,
                            unselectedTextColor = Slate500
                        )
                    )
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                when (selectedNavTab) {
                    0 -> DiscoverScreen(
                        onSelectCity = { city ->
                            selectedCityForDetail = city
                            activeCityName = city.name
                        },
                        userLocation = userLocation,
                        language = currentLanguage
                    )
                    1 -> RecommendScreen(
                        initialCityName = activeCityName,
                        language = currentLanguage,
                        onOpenSaved = { showSavedDialog = true }
                    )
                    2 -> HomeScreen(
                        onSelectCityForDetail = { city ->
                            selectedCityForDetail = city
                            activeCityName = city.name
                        },
                        userLocationName = userLocationName,
                        language = currentLanguage,
                        resetTrigger = homeResetTrigger
                    )
                    3 -> AITourScreen(
                        initialCityName = activeCityName,
                        userLocationName = userLocationName,
                        language = currentLanguage
                    )
                    4 -> SettingsScreen(
                        currentLanguage = currentLanguage,
                        onLanguageChange = { newLang ->
                            currentLanguage = newLang
                        },
                        userLocationName = userLocationName,
                        isLocationEnabled = isLocationEnabled,
                        onRequestLocation = {
                            locationPermissionLauncher.launch(
                                arrayOf(
                                    Manifest.permission.ACCESS_FINE_LOCATION,
                                    Manifest.permission.ACCESS_COARSE_LOCATION
                                )
                            )
                        },
                        onToggleLocation = {
                            if (isLocationEnabled) {
                                isLocationEnabled = false
                                userLocation = null
                                userLocationName = null
                            } else {
                                locationPermissionLauncher.launch(
                                    arrayOf(
                                        Manifest.permission.ACCESS_FINE_LOCATION,
                                        Manifest.permission.ACCESS_COARSE_LOCATION
                                    )
                                )
                            }
                        }
                    )
                }

                // Fast plan loading overlay
                if (isLoadingFastPlan) {
                    Surface(
                        color = Color.Black.copy(alpha = 0.5f),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Box(contentAlignment = androidx.compose.ui.Alignment.Center) {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                modifier = Modifier.padding(32.dp)
                            ) {
                                Column(
                                    modifier = Modifier.padding(24.dp),
                                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                                ) {
                                    CircularProgressIndicator(color = Teal700)
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Text(strings.generatingPlan, fontWeight = FontWeight.Bold, color = Slate900)
                                    Text(strings.generatingPlanSub, fontSize = 12.sp, color = Slate500)
                                }
                            }
                        }
                    }
                }
            }
        }

        // City Detail Bottom Sheet (when clicked from Discover or Map)
        selectedCityForDetail?.let { city ->
            CityDetailBottomSheet(
                city = city,
                onDismiss = { selectedCityForDetail = null },
                onPlanItinerary = { days, style ->
                    selectedCityForDetail = null
                    isLoadingFastPlan = true
                    coroutineScope.launch {
                        try {
                            val plan = geminiService.generateItinerary(
                                cityName = city.name,
                                days = days,
                                style = style,
                                transport = "自行開車",
                                userOrigin = userLocationName
                            )
                            currentItineraryPlan = plan
                            showItineraryDialog = true
                        } finally {
                            isLoadingFastPlan = false
                        }
                    }
                },
                language = currentLanguage,
                onOpenSaved = { showSavedDialog = true }
            )
        }

        // Fast Itinerary Result Sheet
        if (showItineraryDialog && currentItineraryPlan != null) {
            ItineraryViewDialog(
                plan = currentItineraryPlan!!,
                onDismiss = { showItineraryDialog = false },
                onRegenerate = {
                    showItineraryDialog = false
                    isLoadingFastPlan = true
                    coroutineScope.launch {
                        try {
                            val plan = geminiService.generateItinerary(
                                cityName = currentItineraryPlan!!.cityName,
                                days = currentItineraryPlan!!.daysCount,
                                style = currentItineraryPlan!!.style,
                                transport = "自行開車",
                                userOrigin = userLocationName
                            )
                            currentItineraryPlan = plan
                            showItineraryDialog = true
                        } finally {
                            isLoadingFastPlan = false
                        }
                    }
                },
                language = currentLanguage,
                onOpenSaved = { showSavedDialog = true }
            )
        }

        // 1. Startup Modal: Location Request
        LocationRequestModal(
            isOpen = showLocationRequestModal,
            onAllow = {
                showLocationRequestModal = false
                showDisclaimerModal = true
                locationPermissionLauncher.launch(
                    arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    )
                )
            },
            onDisallow = {
                showLocationRequestModal = false
                showDisclaimerModal = true
                isLocationEnabled = false
            },
            language = currentLanguage
        )

        // 2. Startup Modal: AI Disclaimer
        DisclaimerModal(
            isOpen = showDisclaimerModal,
            onConfirm = {
                showDisclaimerModal = false
            },
            language = currentLanguage
        )

        // 3. Saved Screen Full Dialog (from TopAppBar bookmark button)
        if (showSavedDialog) {
            androidx.compose.ui.window.Dialog(
                onDismissRequest = { showSavedDialog = false },
                properties = androidx.compose.ui.window.DialogProperties(usePlatformDefaultWidth = false)
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        TopAppBar(
                            title = {
                                Text(
                                    strings.tabSaved,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            },
                            navigationIcon = {
                                IconButton(onClick = { showSavedDialog = false }) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Close",
                                        tint = Color.White
                                    )
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(containerColor = Teal700)
                        )
                        SavedScreen(language = currentLanguage)
                    }
                }
            }
        }
    }
}
