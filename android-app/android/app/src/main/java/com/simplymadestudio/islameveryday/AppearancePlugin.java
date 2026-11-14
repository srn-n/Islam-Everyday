package com.simplymadestudio.islameveryday;

import android.app.Activity;
import android.app.UiModeManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;
import androidx.appcompat.app.AppCompatDelegate;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Keeps Android's launch screen in step with the appearance chosen inside the app: the mode (system, light or dark) and,
 * since 14 Nov 2026, the light and dark theme too, so the app opens on exactly the colour it will show, with no shift.
 * - Android 13+: the launch screen of the next start is the theme pair's own launch theme (setSplashScreenTheme).
 * - Android 11 and older: no system launch picture; the first frame is the window, painted in the theme's ground.
 * - Android 12 / 12L: only light or dark can be chosen; it shows the default Sandstone / Jade (values/colors.xml).
 * Three words are kept on the phone (mode, light theme, dark theme); nothing else is stored or sent anywhere.
 */
@CapacitorPlugin(name = "Appearance")
public class AppearancePlugin extends Plugin {
    static final String PREFS = "ie_appearance", KEY = "mode", LT = "light", DT = "dark";
    static final String[] LIGHT = { "classic", "sky", "sandstone" }, DARK = { "jade", "indigo", "teal" };
    // Ground colours of the six themes, the same as assets/app.css (tools/launch-themes.mjs; tests/launch.test.mjs).
    static final int[] LIGHT_GROUND = { 0xFFEEF3F1, 0xFFEDF3FA, 0xFFF3EADB }, DARK_GROUND = { 0xFF08120F, 0xFF0A0D1E, 0xFF051416 };

    static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    /** What was last chosen in the app: "light", "dark" or "system". */
    static String saved(Context c) {
        try { return prefs(c).getString(KEY, "system"); } catch (Exception e) { return "system"; }
    }

    private static int idx(String[] list, String v, int dflt) { for (int i = 0; i < list.length; i++) if (list[i].equals(v)) return i; return dflt; }
    /** The light and dark theme last chosen (defaults: Sandstone and Jade, as a new install). */
    static int lightTheme(Context c) { try { return idx(LIGHT, prefs(c).getString(LT, "sandstone"), 2); } catch (Exception e) { return 2; } }
    static int darkTheme(Context c) { try { return idx(DARK, prefs(c).getString(DT, "jade"), 0); } catch (Exception e) { return 0; } }

    /** Whether this start shows the dark appearance (the app's choice, or the phone's with "system"). */
    static boolean isDark(Context c) {
        String m = saved(c);
        if ("light".equals(m)) return false;
        if ("dark".equals(m)) return true;
        try { return (c.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES; } catch (Exception e) { return false; }
    }

    /** The page's ground colour for this start: what is behind the page, so the first frame already matches it. */
    static int ground(Context c) { return isDark(c) ? DARK_GROUND[darkTheme(c)] : LIGHT_GROUND[lightTheme(c)]; }

    /** The launch theme of the chosen light/dark pair (res/values-v31/launch_themes.xml). */
    // Named directly (not looked up by name), so the build keeps all nine. Rows: light theme; columns: dark theme.
    static final int[][] LAUNCH = {
        { R.style.Launch_Classic_Jade, R.style.Launch_Classic_Indigo, R.style.Launch_Classic_Teal },
        { R.style.Launch_Sky_Jade, R.style.Launch_Sky_Indigo, R.style.Launch_Sky_Teal },
        { R.style.Launch_Sandstone_Jade, R.style.Launch_Sandstone_Indigo, R.style.Launch_Sandstone_Teal } };
    static int splashTheme(Context c) { return LAUNCH[lightTheme(c)][darkTheme(c)]; }

    /** Android 13+: the next start's launch screen uses the chosen themes' colours. Kept by Android between starts. */
    static void applySplash(Activity a) {
        if (a == null || Build.VERSION.SDK_INT < 33) return;
        try { int id = splashTheme(a); if (id != 0) a.getSplashScreen().setSplashScreenTheme(id); } catch (Exception ignored) {}
    }

    /** Applies the mode to this run and, on Android 12 and later, to the launch screen of the next start. */
    static void apply(Context c, String mode) {
        boolean light = "light".equals(mode), dark = "dark".equals(mode);
        int want = light ? AppCompatDelegate.MODE_NIGHT_NO : dark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM;
        // Only when it changes: setting it again can make Android redraw the screen (a blink when coming back).
        try { if (AppCompatDelegate.getDefaultNightMode() != want) AppCompatDelegate.setDefaultNightMode(want); } catch (Exception ignored) {}
        if (Build.VERSION.SDK_INT >= 31) {
            try {
                UiModeManager ui = (UiModeManager) c.getSystemService(Context.UI_MODE_SERVICE);
                int m = light ? UiModeManager.MODE_NIGHT_NO : dark ? UiModeManager.MODE_NIGHT_YES : UiModeManager.MODE_NIGHT_AUTO;
                // Android keeps this between starts; it is set again only when the choice changes ("nm" remembers it).
                SharedPreferences p = prefs(c);
                if (ui != null && p.getInt("nm", -1) != m) { ui.setApplicationNightMode(m); p.edit().putInt("nm", m).apply(); }
            } catch (Exception ignored) {}
        }
    }

    @PluginMethod
    public void set(PluginCall call) {
        String m = call.getString("mode", "system");
        final String mode = "light".equals(m) || "dark".equals(m) ? m : "system";
        final String lt = call.getString("light", null), dt = call.getString("dark", null);
        try {
            SharedPreferences.Editor e = prefs(getContext()).edit().putString(KEY, mode);
            if (lt != null && idx(LIGHT, lt, -1) >= 0) e.putString(LT, lt);
            if (dt != null && idx(DARK, dt, -1) >= 0) e.putString(DT, dt);
            e.apply();
        } catch (Exception ignored) {}
        getActivity().runOnUiThread(() -> {
            apply(getContext(), mode);
            applySplash(getActivity());
            // The window and the WebView behind the page take the new ground at once (seen if the page ever pauses).
            try {
                int g = ground(getActivity());
                getActivity().getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(g));
                if (getBridge() != null && getBridge().getWebView() != null) getBridge().getWebView().setBackgroundColor(g);
            } catch (Exception ignored) {}
        });
        call.resolve();
    }
}
