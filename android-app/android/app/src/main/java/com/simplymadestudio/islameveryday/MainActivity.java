package com.simplymadestudio.islameveryday;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
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
        // The window behind everything: the ground colour of the theme chosen in the app (14 Nov 2026), set before the
        // first frame. On Android 11 and older that IS the first thing on screen (no system launch picture).
        getWindow().setBackgroundDrawable(new ColorDrawable(AppearancePlugin.ground(this)));
        registerPlugin(AppearancePlugin.class);
        registerPlugin(WidgetsPlugin.class); // what the home-screen widgets show
        registerPlugin(RingerPlugin.class); // the phone's sound profile, for the app's own sounds
        super.onCreate(savedInstanceState);
        int g = AppearancePlugin.ground(this);
        // Behind the page, the same colour, never the WebView's default white: launch screen, window, WebView and page
        // are one colour from the first frame to the opening.
        if (getBridge() != null && getBridge().getWebView() != null) getBridge().getWebView().setBackgroundColor(g);
        getWindow().setBackgroundDrawable(new ColorDrawable(g));
        // Android 13+: the next start's launch screen in the chosen themes' colours (kept by Android between starts).
        AppearancePlugin.applySplash(this);
    }
}
