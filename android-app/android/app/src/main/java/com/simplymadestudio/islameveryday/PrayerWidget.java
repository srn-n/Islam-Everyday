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

/** Home-screen widget: the current prayer (left) and the next one (right), and the five times of the next prayer's day
 *  (16 Nov 2026, Notion: no place and no countdown on the right any more). 18 Nov 2026: only the current prayer and its
 *  time are in colour, in the list too; the next prayer is plain. */
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
        String pic = WidgetData.picAt(d, now, "prayer");
        Object[] fb = WidgetData.forbidden(d, now);
        for (int id : ids) m.updateAppWidget(id, build(c, m, id, d, day, nx, now, pic, fb));
        // wake at the next change: a prayer beginning, sunrise (Fajr's time ends), or an avoided time
        long next = 0;
        if (day != null) {
            next = day.optJSONArray("p").optJSONArray(nx).optLong(2);
            long sr = sunriseAfter(d, now);
            if (sr > 0) next = Math.min(next, sr);
            if (fb != null) next = Math.min(next, (long) fb[2]);
            long notice = WidgetData.nextForbiddenNotice(d, now);
            if (notice > 0) next = Math.min(next, notice);
        }
        WidgetData.scheduleNext(c, PrayerWidget.class, 1, next, true);
    }

    /** The current prayer at `now`, as Today shows it: the latest prayer begun, except that Fajr ends at sunrise (then
     *  none until Dhuhr) and before Fajr it is still last night's Isha. Null: none in progress. */
    static String current(JSONObject d, long now) {
        JSONArray days = d == null ? null : d.optJSONArray("days");
        if (days == null) return null;
        for (int i = 0; i < days.length(); i++) {
            JSONObject o = days.optJSONObject(i);
            if (o == null || now < o.optLong("from") || now >= o.optLong("to")) continue;
            JSONArray p = o.optJSONArray("p"); if (p == null) return null;
            int k = -1;
            for (int j = 0; j < p.length(); j++) { JSONArray r = p.optJSONArray(j); if (r != null && r.optLong(2) <= now) k = j; }
            if (k < 0) { JSONArray pi = o.optJSONArray("pi"); return pi == null ? null : pi.optString(0); }
            if (k == 0 && o.optLong("sr") > 0 && now >= o.optLong("sr")) return null;
            return p.optJSONArray(k).optString(0);
        }
        return null;
    }

    /** The next sunrise after `now` (when "Fajr" stops being current), or 0. */
    static long sunriseAfter(JSONObject d, long now) {
        JSONArray days = d == null ? null : d.optJSONArray("days");
        if (days == null) return 0;
        for (int i = 0; i < days.length(); i++) { JSONObject o = days.optJSONObject(i); long sr = o == null ? 0 : o.optLong("sr"); if (sr > now) return sr; }
        return 0;
    }

    private static RemoteViews build(Context c, AppWidgetManager m, int id, JSONObject d, JSONObject day, int nx, long now, String pic, Object[] fb) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_prayer);
        v.setOnClickPendingIntent(R.id.wg_root, WidgetData.open(c));
        if (day == null) {
            v.setViewVisibility(R.id.wg_body, View.GONE);
            v.setViewVisibility(R.id.wg_empty, View.VISIBLE);
            return v;
        }
        boolean onPic = WidgetData.applyPicture(c, m, id, v, pic);
        int ink = onPic ? WidgetData.PIC_INK : WidgetData.col(d, "ink", 0xFF14211D), muted = onPic ? WidgetData.PIC_MUTED : WidgetData.col(d, "muted", 0xFF5F6B66),
            curC = onPic ? WidgetData.PIC_CUR : WidgetData.col(d, "cur", 0xFF996010); // the current prayer: its own colour
        if (!onPic) v.setInt(R.id.wg_bg, "setColorFilter", WidgetData.col(d, "bg", 0xFFF6F3EC));
        v.setViewVisibility(R.id.wg_body, View.VISIBLE);
        v.setViewVisibility(R.id.wg_empty, View.GONE);
        JSONArray p = day.optJSONArray("p"), next = p.optJSONArray(nx);
        boolean today = now >= day.optLong("from") && now < day.optLong("to");
        String cur = current(d, now);
        v.setTextViewText(R.id.wg_cur_name, cur != null ? cur : WidgetData.lab(d, "nocur"));
        v.setFloat(R.id.wg_cur_name, "setTextSize", cur != null ? 21f : 15f);
        v.setTextViewText(R.id.wg_next_name, next.optString(0));
        v.setTextViewText(R.id.wg_next_lbl, WidgetData.lab(d, "next") + (today ? "" : " · " + WidgetData.lab(d, "tomorrow")));
        v.setTextColor(R.id.wg_next_lbl, muted);
        if (fb != null) {
            // an avoided time is on (or begins within ten minutes): one amber line across the top, in place of both labels
            int amber = onPic ? 0xFFFFC46E : 0xFFB06A0E;
            v.setTextViewText(R.id.wg_label, (boolean) fb[1] ? WidgetData.bold((String) fb[0]) : (String) fb[0]);
            v.setTextColor(R.id.wg_label, amber);
            v.setViewVisibility(R.id.wg_next_lbl, View.GONE);
        } else {
            v.setTextViewText(R.id.wg_label, WidgetData.lab(d, "cur"));
            v.setTextColor(R.id.wg_label, muted);
            v.setViewVisibility(R.id.wg_next_lbl, View.VISIBLE);
        }
        // 18 Nov 2026 (Notion): only the current prayer and its time are in colour; the next prayer is plain text
        v.setTextColor(R.id.wg_cur_name, cur != null ? curC : muted); v.setTextColor(R.id.wg_next_name, ink);
        // The current prayer's row in the list: today's prayer that has begun most recently (none from sunrise to Dhuhr,
        // and none before Fajr, when the current prayer is yesterday's Isha).
        int ci = -1;
        if (cur != null && today) for (int k = 0; k < NAME.length; k++) { JSONArray r = p.optJSONArray(k); if (r != null && r.optLong(2) <= now && k != nx) ci = k; }
        for (int k = 0; k < NAME.length; k++) {
            JSONArray r = p.optJSONArray(k); String n = r == null ? "" : r.optString(0), t = r == null ? "" : r.optString(1);
            v.setTextViewText(NAME[k], k == ci ? WidgetData.bold(n) : n);
            v.setTextViewText(TIME[k], k == ci ? WidgetData.bold(t) : t);
            v.setTextColor(NAME[k], k == ci ? curC : muted);
            v.setTextColor(TIME[k], k == ci ? curC : ink);
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
