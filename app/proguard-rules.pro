# Proguard rules for TaiwanExplore
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class com.taiwan.explore.model.** { *; }
