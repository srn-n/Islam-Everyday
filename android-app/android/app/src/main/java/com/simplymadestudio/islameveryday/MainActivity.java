package com.simplymadestudio.islameveryday;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void attachBaseContext(Context base) {
        // Before anything is drawn: light or dark as chosen in the app, so every colour the activity reads is the right one.
        AppearancePlugin.apply(base, AppearancePlugin.saved(base));
        super.attachBaseContext(base);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // The appearance chosen in the app (not only the phone's) decides light or dark from the first frame.
        AppearancePlugin.apply(this, AppearancePlugin.saved(this));
        registerPlugin(AppearancePlugin.class);
        registerPlugin(WidgetsPlugin.class); // what the home-screen widgets show
        registerPlugin(RingerPlugin.class); // the phone's sound profile, for the app's own sounds
        super.onCreate(savedInstanceState);
        // Behind the page, the app's ground colour (light or dark with the phone), never the WebView's default white:
        // the gap between Android's launch screen and the page's first frame is the same colour as both.
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(ground());
        }
        // The window behind everything too. With "light" or "dark" chosen in the app the colour is set outright, so the
        // first frame is right on every Android version, whatever the phone's own mode is.
        getWindow().setBackgroundDrawable(new ColorDrawable(ground()));
    }

    private int ground() {
        String m = AppearancePlugin.saved(this);
        if ("light".equals(m)) return 0xFFEEF3F1;
        if ("dark".equals(m)) return 0xFF08120F;
        return ContextCompat.getColor(this, R.color.ground);
    }
}
