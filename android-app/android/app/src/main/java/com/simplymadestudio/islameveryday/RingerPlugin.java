package com.simplymadestudio.islameveryday;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Tells the page the phone's sound profile (normal, vibrate or silent), and when it changes, so the app's own
 * sounds (touch ticks and the background sound) stay quiet whenever the phone is on silent or vibrate.
 * It only reads the ringer mode: no permission is needed and nothing is changed on the phone.
 */
@CapacitorPlugin(name = "Ringer")
public class RingerPlugin extends Plugin {
    private BroadcastReceiver receiver;

    private JSObject mode() {
        String m = "normal";
        try {
            AudioManager am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
            int r = am == null ? AudioManager.RINGER_MODE_NORMAL : am.getRingerMode();
            m = r == AudioManager.RINGER_MODE_SILENT ? "silent" : r == AudioManager.RINGER_MODE_VIBRATE ? "vibrate" : "normal";
        } catch (Exception ignored) {}
        JSObject o = new JSObject();
        o.put("mode", m);
        return o;
    }

    @Override
    public void load() {
        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                notifyListeners("ringerChange", mode(), true);
            }
        };
        try {
            ContextCompat.registerReceiver(getContext(), receiver, new IntentFilter(AudioManager.RINGER_MODE_CHANGED_ACTION), ContextCompat.RECEIVER_NOT_EXPORTED);
        } catch (Exception ignored) {
            receiver = null;
        }
    }

    @PluginMethod
    public void getMode(PluginCall call) {
        call.resolve(mode());
    }

    @Override
    protected void handleOnDestroy() {
        if (receiver != null) {
            try { getContext().unregisterReceiver(receiver); } catch (Exception ignored) {}
            receiver = null;
        }
    }
}
