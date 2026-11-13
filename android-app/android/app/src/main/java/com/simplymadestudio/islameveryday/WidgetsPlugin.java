package com.simplymadestudio.islameveryday;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** The app hands the home-screen widgets what they show (see WidgetData). Kept on the phone only. */
@CapacitorPlugin(name = "Widgets")
public class WidgetsPlugin extends Plugin {
    @PluginMethod
    public void update(PluginCall call) {
        String data = call.getString("data");
        if (data == null || data.length() > 200000) { call.reject("bad data"); return; }
        WidgetData.save(getContext(), data);
        WidgetData.refreshAll(getContext());
        call.resolve();
    }
}
