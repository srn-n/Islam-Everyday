package com.simplymadestudio.islameveryday;

import android.app.UiModeManager;
import android.content.Context;
import android.os.Build;
import androidx.appcompat.app.AppCompatDelegate;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Keeps Android's launch screen in step with the appearance chosen inside the app (system, light or dark).
 * Without it the launch screen follows the phone alone: a phone in dark mode opened a light app on a near-black
 * screen for the first second. The choice is one word kept on the phone; nothing else is stored or sent anywhere.
 */
@CapacitorPlugin(name = "Appearance")
public class AppearancePlugin extends Plugin {
    static final String PREFS = "ie_appearance", KEY = "mode";

    /** What was last chosen in the app: "light", "dark" or "system". */
    static String saved(Context c) {
        try { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "system"); } catch (Exception e) { return "system"; }
    }

    /** Applies the choice to this run and, on Android 12 and later, to the launch screen of the next start. */
    static void apply(Context c, String mode) {
        boolean light = "light".equals(mode), dark = "dark".equals(mode);
        try {
            AppCompatDelegate.setDefaultNightMode(light ? AppCompatDelegate.MODE_NIGHT_NO : dark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        } catch (Exception ignored) {}
        if (Build.VERSION.SDK_INT >= 31) {
            try {
                UiModeManager ui = (UiModeManager) c.getSystemService(Context.UI_MODE_SERVICE);
                if (ui != null) ui.setApplicationNightMode(light ? UiModeManager.MODE_NIGHT_NO : dark ? UiModeManager.MODE_NIGHT_YES : UiModeManager.MODE_NIGHT_AUTO);
            } catch (Exception ignored) {}
        }
    }

    @PluginMethod
    public void set(PluginCall call) {
        String m = call.getString("mode", "system");
        final String mode = "light".equals(m) || "dark".equals(m) ? m : "system";
        try { getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, mode).apply(); } catch (Exception ignored) {}
        getActivity().runOnUiThread(() -> apply(getContext(), mode));
        call.resolve();
    }
}
