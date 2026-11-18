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

/**
 * Home-screen widget: the Verse for today (the translation and its reference), as on Today. 4x2; the large 4x4 one
 * (VerseWidgetLarge) is the same widget with more room, so long verses show in full more often.
 */
public class VerseWidget extends AppWidgetProvider {
    /** The layout this size uses. */
    protected int layout() { return R.layout.widget_verse; }
    /** Its own pictures (WG_SETS in the app): not the same as any other widget's. */
    protected String picSet() { return "verse"; }

    /** Its own wake-up alarm (each kind of widget has one). */
    protected int alarmCode() { return 2; }
    /** The large one has share and save buttons and puts the reference at the top (18 Nov 2026, Notion). */
    protected boolean large() { return false; }

    /** The save button's broadcast (VerseShare.save). */
    static final String ACTION_SAVE = "com.simplymadestudio.islameveryday.VERSE_SAVE";

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        JSONObject d = WidgetData.load(c);
        long now = System.currentTimeMillis();
        JSONObject vs = WidgetData.verseNow(d, now);
        String pic = WidgetData.picAt(d, now, picSet());
        for (int id : ids) m.updateAppWidget(id, build(c, m, id, d, vs, pic));
        // the next verse at 00:01, on time when the app may set exact alarms; with pictures changing on their own,
        // also at each prayer time
        long next = WidgetData.nextVerse(d, now), pc = WidgetData.nextPicChange(d, now);
        boolean pcFirst = pc > 0 && (next <= 0 || pc < next);
        WidgetData.scheduleNext(c, getClass(), alarmCode(), pcFirst ? pc : next, true);
    }

    private RemoteViews build(Context c, AppWidgetManager m, int id, JSONObject d, JSONObject vs, String pic) {
        RemoteViews v = new RemoteViews(c.getPackageName(), layout());
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
        v.setTextColor(R.id.wg_text, ink);
        if (large()) {
            // the reference at the top in the accent colour, the label under it, the two buttons below the verse
            v.setTextColor(R.id.wg_ref, acc); v.setTextColor(R.id.wg_label, muted);
            v.setInt(R.id.wg_share, "setColorFilter", muted); v.setInt(R.id.wg_save, "setColorFilter", muted);
            v.setOnClickPendingIntent(R.id.wg_share, VerseShare.sharePi(c, d, vs, alarmCode() * 10 + 1));
            v.setOnClickPendingIntent(R.id.wg_save, VerseShare.savePi(c, getClass(), alarmCode() * 10 + 2));
        } else {
            v.setTextColor(R.id.wg_label, acc); v.setTextColor(R.id.wg_ref, muted);
        }
        return v;
    }

    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, Bundle o) {
        onUpdate(c, m, new int[] { id });
    }

    @Override
    public void onReceive(Context c, Intent i) {
        if (ACTION_SAVE.equals(i.getAction())) { VerseShare.save(c); return; }
        if (WidgetData.ACTION_TICK.equals(i.getAction())) {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            onUpdate(c, m, m.getAppWidgetIds(new ComponentName(c, getClass())));
            return;
        }
        super.onReceive(c, i);
    }

    @Override
    public void onDisabled(Context c) {
        WidgetData.scheduleNext(c, getClass(), alarmCode(), 0);
    }
}
