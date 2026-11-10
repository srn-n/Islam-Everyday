package com.simplymadestudio.islameveryday;

import android.os.Bundle;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RingerPlugin.class); // the phone's sound profile, for the app's own sounds
        super.onCreate(savedInstanceState);
        // Behind the page, the app's ground colour (light or dark with the phone), never the WebView's default white:
        // the gap between Android's launch screen and the page's first frame is the same colour as both.
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(ContextCompat.getColor(this, R.color.ground));
        }
    }
}
