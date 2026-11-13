package com.simplymadestudio.islameveryday;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import org.json.JSONObject;

/** Home-screen widget: the Verse for today (the translation and its reference), as on Today. */
public class VerseWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        JSONObject d = WidgetData.load(c);
        long now = System.currentTimeMillis();
        JSONObject day = WidgetData.dayAt(d, now), vs = day == null ? null : day.optJSONObject("v");
        String pic = WidgetData.picAt(d, now);
        for (int id : ids) m.updateAppWidget(id, build(c, m, id, d, vs, pic));
        // the next verse at local midnight; with pictures changing on their own, also at each prayer time
        long next = day == null ? 0 : day.optLong("to"), pc = WidgetData.nextPicChange(d, now);
        WidgetData.scheduleNext(c, VerseWidget.class, 2, pc > 0 && pc < next ? pc : next);
    }

    private static RemoteViews build(Context c, AppWidgetManager m, int id, JSONObject d, JSONObject vs, String pic) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_verse);
        v.setOnClickPendingIntent(R.id.wg_root, WidgetData.open(c));
        if (vs == null || vs.optString("t").isEmpty()) {
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
        v.setTextViewText(R.id.wg_label, WidgetData.lab(d, "votd"));
        v.setTextViewText(R.id.wg_text, vs.optString("t"));
        v.setTextViewText(R.id.wg_ref, vs.optString("r"));
        v.setTextColor(R.id.wg_label, acc); v.setTextColor(R.id.wg_text, ink); v.setTextColor(R.id.wg_ref, muted);
        return v;
    }

    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, Bundle o) {
        onUpdate(c, m, new int[] { id });
    }

    @Override
    public void onReceive(Context c, Intent i) {
        if (WidgetData.ACTION_TICK.equals(i.getAction())) {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            onUpdate(c, m, m.getAppWidgetIds(new ComponentName(c, VerseWidget.class)));
            return;
        }
        super.onReceive(c, i);
    }

    @Override
    public void onDisabled(Context c) {
        WidgetData.scheduleNext(c, VerseWidget.class, 2, 0);
    }
}
