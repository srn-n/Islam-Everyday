package com.simplymadestudio.islameveryday;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.os.Bundle;
import android.widget.RemoteViews;
import java.io.InputStream;
import android.graphics.Typeface;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.StyleSpan;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * What the home-screen widgets show. The app writes it (WidgetsPlugin) whenever Today is drawn: seven days of prayer
 * times and verses, already in the app's language, with the colours of the theme in use. The widgets only read it, so
 * they work offline and keep showing the right day for a week without the app being opened. Nothing leaves the phone.
 */
final class WidgetData {
    static final String PREFS = "ie_widgets", KEY = "data", ACTION_TICK = "com.simplymadestudio.islameveryday.WIDGET_TICK";

    private WidgetData() {}

    static JSONObject load(Context c) {
        try {
            String s = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, null);
            return s == null ? null : new JSONObject(s);
        } catch (Exception e) {
            return null;
        }
    }

    static void save(Context c, String json) {
        c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, json).apply();
    }

    /** The day (from local midnight to the next) that contains this moment, or null when the data has run out. */
    static JSONObject dayAt(JSONObject d, long now) {
        JSONArray days = d == null ? null : d.optJSONArray("days");
        if (days == null) return null;
        for (int i = 0; i < days.length(); i++) {
            JSONObject o = days.optJSONObject(i);
            if (o != null && now >= o.optLong("from") && now < o.optLong("to")) return o;
        }
        return null;
    }

    /** Text colours on a picture: white, with a soft gold for the highlight (the picture has a dark wash). */
    static final int PIC_INK = 0xFFFFFFFF, PIC_MUTED = 0xE6FFFFFF, PIC_ACCENT = 0xFFFFE2A6;

    /**
     * The picture behind the widgets now, or null for the theme colour. "auto" moves one step at each prayer time:
     * day number × 5 + prayers begun that day (the same rule as wgPicAt in the app, so Settings marks the same one).
     */
    static String picAt(JSONObject d, long now) {
        JSONObject bg = d == null ? null : d.optJSONObject("bg");
        if (bg == null || "plain".equals(bg.optString("mode"))) return null;
        JSONArray list = bg.optJSONArray("list");
        if (!"auto".equals(bg.optString("mode")) || list == null || list.length() == 0) return bg.optString("pic", null);
        JSONObject day = dayAt(d, now);
        if (day == null) return bg.optString("pic", null);
        int n = 0; JSONArray p = day.optJSONArray("p");
        if (p != null) for (int k = 0; k < p.length(); k++) { JSONArray r = p.optJSONArray(k); if (r != null && r.optLong(2) <= now) n++; }
        long i = (day.optLong("dn") * 5 + n) % list.length();
        return list.optString((int) (i < 0 ? i + list.length() : i), null);
    }

    /** The next moment the "auto" picture changes (the next prayer time today, else midnight), or 0. */
    static long nextPicChange(JSONObject d, long now) {
        JSONObject bg = d == null ? null : d.optJSONObject("bg"), day = dayAt(d, now);
        if (bg == null || !"auto".equals(bg.optString("mode")) || day == null) return 0;
        JSONArray p = day.optJSONArray("p");
        if (p != null) for (int k = 0; k < p.length(); k++) { JSONArray r = p.optJSONArray(k); if (r != null && r.optLong(2) > now) return r.optLong(2); }
        return day.optLong("to");
    }

    /**
     * Puts the picture behind one widget: cropped to that widget's shape, corners rounded, with a dark wash so the
     * text reads. The picture is the app's own file (assets/widgets-img inside the app). Returns false when the theme
     * colour is used instead (chosen, or the picture could not be read).
     */
    static boolean applyPicture(Context c, AppWidgetManager m, int id, RemoteViews v, String name) {
        if (name == null || !name.matches("[a-z]+")) return false;
        Bitmap src = null;
        try (InputStream in = c.getAssets().open("public/assets/widgets-img/" + name + ".webp")) {
            src = BitmapFactory.decodeStream(in);
        } catch (Exception e) {
            return false;
        }
        if (src == null) return false;
        float dp = c.getResources().getDisplayMetrics().density;
        Bundle o = m.getAppWidgetOptions(id);
        int wDp = o == null ? 0 : o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH), hDp = o == null ? 0 : o.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT);
        if (wDp <= 0) wDp = 320;
        if (hDp <= 0) hDp = 160;
        // at most about 900 px wide: sharp enough, and well inside what a home screen accepts for one widget
        float s = Math.min(dp, 900f / wDp);
        int w = Math.max(1, Math.round(wDp * s)), h = Math.max(1, Math.round(hDp * s));
        Bitmap out = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(out);
        float sc = Math.max((float) w / src.getWidth(), (float) h / src.getHeight());
        Matrix mx = new Matrix();
        mx.setScale(sc, sc);
        mx.postTranslate((w - src.getWidth() * sc) / 2f, (h - src.getHeight() * sc) / 2f);
        BitmapShader sh = new BitmapShader(src, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        sh.setLocalMatrix(mx);
        Paint pp = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        pp.setShader(sh);
        RectF r = new RectF(0, 0, w, h);
        float rad = 22 * s;
        cv.drawRoundRect(r, rad, rad, pp);
        Paint wash = new Paint(Paint.ANTI_ALIAS_FLAG);
        wash.setShader(new LinearGradient(0, 0, 0, h, 0x73000000, 0xA6000000, Shader.TileMode.CLAMP));
        cv.drawRoundRect(r, rad, rad, wash);
        src.recycle();
        v.setImageViewBitmap(R.id.wg_bg, out);
        return true;
    }

    /** Bangla digits when the app is in Bangla. */
    static String num(JSONObject d, long n) {
        String s = String.valueOf(n);
        if (d == null || !"bn".equals(d.optString("lang"))) return s;
        StringBuilder b = new StringBuilder();
        for (char ch : s.toCharArray()) b.append(ch >= '0' && ch <= '9' ? (char) ('০' + (ch - '0')) : ch);
        return b.toString();
    }

    /** "in 2 h 15 min" / "in 15 min" (whole minutes, rounded up, so it never says 0 before the prayer begins). */
    static String timeLeft(JSONObject d, long ms) {
        long mins = Math.max(1, (ms + 59999) / 60000), h = mins / 60, m = mins % 60;
        return h > 0 ? lab(d, "inH").replace("{h}", num(d, h)).replace("{m}", num(d, m)) : lab(d, "inM").replace("{m}", num(d, m));
    }

    /**
     * The avoided time (the three sun-based ones, as on Today) to show now: its line, whether it is on now, and the
     * next moment this changes. Returns null when none is on or about to begin.
     */
    static Object[] forbidden(JSONObject d, long now) {
        JSONObject day = dayAt(d, now);
        JSONArray f = day == null ? null : day.optJSONArray("f");
        if (f == null) return null;
        long soon = d.optLong("soon", 10) * 60000;
        for (int i = 0; i < f.length(); i++) {
            JSONArray w = f.optJSONArray(i); if (w == null) continue;
            long a = w.optLong(0), b = w.optLong(1);
            if (now >= a && now < b) return new Object[] { w.optString(2), true, b };
            if (now < a && a - now <= soon) return new Object[] { w.optString(3), false, a };
        }
        return null;
    }

    /** The next time an avoided-time line appears (its advance notice), for the widget's wake-up. */
    static long nextForbiddenNotice(JSONObject d, long now) {
        JSONObject day = dayAt(d, now);
        JSONArray f = day == null ? null : day.optJSONArray("f");
        long soon = d == null ? 600000 : d.optLong("soon", 10) * 60000, best = 0;
        if (f != null) for (int i = 0; i < f.length(); i++) {
            JSONArray w = f.optJSONArray(i); if (w == null) continue;
            long t = w.optLong(0) - soon;
            if (t > now && (best == 0 || t < best)) best = t;
        }
        return best;
    }

    static int col(JSONObject d, String k, int def) {
        try {
            return Color.parseColor(d.getJSONObject("col").getString(k));
        } catch (Exception e) {
            return def;
        }
    }

    static String lab(JSONObject d, String k) {
        JSONObject l = d == null ? null : d.optJSONObject("lab");
        return l == null ? "" : l.optString(k, "");
    }

    static CharSequence bold(String s) {
        SpannableString b = new SpannableString(s);
        b.setSpan(new StyleSpan(Typeface.BOLD), 0, s.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        return b;
    }

    /** Tapping a widget opens the app (it starts on Today). */
    static PendingIntent open(Context c) {
        Intent i = new Intent(c, MainActivity.class);
        i.setAction(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_LAUNCHER);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(c, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Redraws every widget of both kinds now. */
    static void refreshAll(Context c) {
        refresh(c, PrayerWidget.class);
        refresh(c, VerseWidget.class);
        refresh(c, VerseWidgetLarge.class);
    }

    static void refresh(Context c, Class<?> cls) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, cls));
        if (ids == null || ids.length == 0) return;
        Intent i = new Intent(c, cls).setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE).putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        c.sendBroadcast(i);
    }

    /**
     * Wakes this kind of widget at the next change (a prayer starting, or midnight). An ordinary (not exact) alarm:
     * Android may deliver it a little late, and it needs no permission. The widgets also refresh every 30 minutes.
     */
    static void scheduleNext(Context c, Class<?> cls, int code, long at) { scheduleNext(c, cls, code, at, false); }

    /**
     * exact: the prayer widget counts the minutes to the next prayer, so it asks for its next minute exactly, when the
     * app may set exact alarms (it already asks for that for reminders). It is a non-waking alarm: while the phone
     * sleeps nothing runs, and the widget catches up as soon as the screen is on. Otherwise Android times it.
     */
    static void scheduleNext(Context c, Class<?> cls, int code, long at, boolean exact) {
        try {
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            Intent i = new Intent(c, cls).setAction(ACTION_TICK);
            PendingIntent pi = PendingIntent.getBroadcast(c, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            if (am == null) return;
            if (at <= 0) { am.cancel(pi); return; }
            boolean ok = exact && (android.os.Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms());
            if (ok) am.setExact(AlarmManager.RTC, at + 500, pi);
            else am.set(AlarmManager.RTC, at + 1000, pi);
        } catch (Exception ignored) {}
    }
}
