# ProGuard rules for AgriTrade Release Build
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebKit and Browser support
-keep class androidx.webkit.** { *; }
-keep class androidx.browser.customtabs.** { *; }

# Keep data models
-keepclassmembers class * {
    *** get*();
    *** set*(***);
    *** is*();
}
