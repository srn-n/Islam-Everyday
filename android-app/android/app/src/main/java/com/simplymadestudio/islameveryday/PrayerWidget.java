package com.simplymadestudio.islameveryday;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;

/** Home-screen widget: the next prayer, and the five times of its day with the next one marked. */
public class PrayerWidget extends AppWidgetProvider {
    static final int[] NAME = { R.id.wg_p0n, R.id.wg_p1n, R.id.wg_p2n, R.id.wg_p3n, R.id.wg_p4n };
    static final int[] TIME = { R.id.wg_p0t, R.id.wg_p1t, R.id.wg_p2t, R.id.wg_p3t, R.id.wg_p4t };

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        JSONObject d = WidgetData.load(c);
        long now = System.currentTimeMillis();
        // the next prayer from now, and its day
        JSONObject day = null; int nx = -1;
        JSONArray days = d == null ? null : d.optJSONArray("days");
        if (days != null) {
            for (int i = 0; i < days.length() && nx < 0; i++) {
                JSONObject o = days.optJSONObject(i); JSONArray p = o == null ? null : o.optJSONArray("p");
                if (p == null || o.optLong("to") <= now) continue;
                for (int k = 0; k < p.length(); k++) { JSONArray r = p.optJSONArray(k); if (r != null && r.optLong(2) > now) { day = o; nx = k; break; } }
            }
        }
        String pic = WidgetData.picAt(d, now);
        for (int id : ids) m.updateAppWidget(id, build(c, m, id, d, day, nx, now, pic));
        long next = day == null ? 0 : day.optJSONArray("p").optJSONArray(nx).optLong(2);
        WidgetData.scheduleNext(c, PrayerWidget.class, 1, next);
    }

    private static RemoteViews build(Context c, AppWidgetManager m, int id, JSONObject d, JSONObject day, int nx, long now, String pic) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_prayer);
        v.setOnClickPendingIntent(R.id.wg_root, WidgetData.open(c));
        if (day == null) {
            v.setViewVisibility(R.id.wg_body, View.GONE);
            v.setViewVisibility(R.id.wg_empty, View.VISIBLE);
            return v;
        }
        boolean onPic = WidgetData.applyPicture(c, m, id, v, pic);
        int ink = onPic ? WidgetData.PIC_INK : WidgetData.col(d, "ink", 0xFF14211D), muted = onPic ? WidgetData.PIC_MUTED : WidgetData.col(d, "muted", 0xFF5F6B66),
            acc = onPic ? WidgetData.PIC_ACCENT : WidgetData.col(d, "accent", 0xFF0E6B5C);
        if (!onPic) v.setInt(R.id.wg_bg, "setColorFilter", WidgetData.col(d, "bg", 0xFFF6F3EC));
        v.setViewVisibility(R.id.wg_body, View.VISIBLE);
        v.setViewVisibility(R.id.wg_empty, View.GONE);
        JSONArray p = day.optJSONArray("p"), next = p.optJSONArray(nx);
        boolean today = now >= day.optLong("from") && now < day.optLong("to");
        v.setTextViewText(R.id.wg_label, WidgetData.lab(d, "next") + (today ? "" : " · " + WidgetData.lab(d, "tomorrow")));
        v.setTextViewText(R.id.wg_place, d.optString("place", ""));
        v.setTextViewText(R.id.wg_next_name, next.optString(0));
        v.setTextViewText(R.id.wg_next_time, next.optString(1));
        v.setTextColor(R.id.wg_label, muted); v.setTextColor(R.id.wg_place, muted);
        v.setTextColor(R.id.wg_next_name, ink); v.setTextColor(R.id.wg_next_time, acc);
        for (int k = 0; k < NAME.length; k++) {
            JSONArray r = p.optJSONArray(k); String n = r == null ? "" : r.optString(0), t = r == null ? "" : r.optString(1);
            v.setTextViewText(NAME[k], k == nx ? WidgetData.bold(n) : n);
            v.setTextViewText(TIME[k], k == nx ? WidgetData.bold(t) : t);
            v.setTextColor(NAME[k], k == nx ? acc : muted);
            v.setTextColor(TIME[k], k == nx ? acc : ink);
        }
        return v;
    }

    /** Resized on the home screen: the picture is cut again for the new shape. */
    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, Bundle o) {
        onUpdate(c, m, new int[] { id });
    }

    @Override
    public void onReceive(Context c, Intent i) {
        if (WidgetData.ACTION_TICK.equals(i.getAction())) {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            onUpdate(c, m, m.getAppWidgetIds(new ComponentName(c, PrayerWidget.class)));
            return;
        }
        super.onReceive(c, i);
    }

    @Override
    public void onDisabled(Context c) {
        WidgetData.scheduleNext(c, PrayerWidget.class, 1, 0);
    }
}
