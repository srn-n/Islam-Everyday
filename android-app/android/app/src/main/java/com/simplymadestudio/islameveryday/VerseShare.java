package com.simplymadestudio.islameveryday;

import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import org.json.JSONObject;

/**
 * Share and save for the large Verse for today widget (18 Nov 2026, Notion), without opening the app. Share hands the
 * verse as text to the phone's share sheet. Save draws the verse as a phone-screen-sized picture in the theme's
 * colours and puts it in Pictures › Islam Everyday (Android 10 and later need no permission for that). On Android 7 to
 * 9 saving there would need a storage permission, so the picture goes to the share sheet instead, where "Save" or a
 * gallery app can keep it. Nothing is sent anywhere by the app itself.
 */
final class VerseShare {
    private VerseShare() {}

    /** The text that is shared: the verse, its reference and the app's name. */
    static String text(JSONObject d, JSONObject vs) {
        String brand = WidgetData.lab(d, "brand");
        return vs.optString("t") + "\n\n" + vs.optString("r") + "\n— " + (brand.isEmpty() ? "Islam Everyday" : brand);
    }

    /** The share button: the phone's share sheet with the verse as text. */
    static PendingIntent sharePi(Context c, JSONObject d, JSONObject vs, int code) {
        Intent send = new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text(d, vs));
        Intent ch = Intent.createChooser(send, WidgetData.lab(d, "shr")).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(c, code, ch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** The save button: a broadcast to the widget, which calls save() (no activity opens on Android 10 and later). */
    static PendingIntent savePi(Context c, Class<?> cls, int code) {
        Intent i = new Intent(c, cls).setAction(VerseWidget.ACTION_SAVE);
        return PendingIntent.getBroadcast(c, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Saves the verse shown now as a picture, and says so in a short message. */
    static void save(Context c) {
        JSONObject d = WidgetData.load(c);
        JSONObject vs = WidgetData.verseNow(d, System.currentTimeMillis());
        if (vs == null || vs.optString("t").isEmpty()) return;
        Bitmap b = null;
        try {
            b = draw(d, vs);
            String name = "verse-" + System.currentTimeMillis() + ".png";
            if (Build.VERSION.SDK_INT >= 29) {
                ContentResolver cr = c.getContentResolver();
                ContentValues cv = new ContentValues();
                cv.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                cv.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                cv.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Islam Everyday");
                cv.put(MediaStore.Images.Media.IS_PENDING, 1);
                Uri u = cr.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv);
                if (u == null) throw new IllegalStateException("no uri");
                try (OutputStream o = cr.openOutputStream(u)) {
                    if (o == null || !b.compress(Bitmap.CompressFormat.PNG, 100, o)) throw new IllegalStateException("not written");
                } catch (Exception e) {
                    cr.delete(u, null, null);
                    throw e;
                }
                cv.clear();
                cv.put(MediaStore.Images.Media.IS_PENDING, 0);
                cr.update(u, cv, null, null);
                toast(c, WidgetData.lab(d, "saved"));
            } else {
                File dir = new File(c.getCacheDir(), "share");
                if (!dir.isDirectory() && !dir.mkdirs()) throw new IllegalStateException("no folder");
                File f = new File(dir, "verse.png");
                try (FileOutputStream o = new FileOutputStream(f)) { b.compress(Bitmap.CompressFormat.PNG, 100, o); }
                Uri u = FileProvider.getUriForFile(c, c.getPackageName() + ".fileprovider", f);
                Intent send = new Intent(Intent.ACTION_SEND).setType("image/png").putExtra(Intent.EXTRA_STREAM, u)
                    .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                c.startActivity(Intent.createChooser(send, WidgetData.lab(d, "sav")).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION));
            }
        } catch (Exception e) {
            toast(c, WidgetData.lab(d, "savefail"));
        } finally {
            if (b != null) b.recycle();
        }
    }

    private static void toast(Context c, String s) {
        if (s != null && !s.isEmpty()) Toast.makeText(c, s, Toast.LENGTH_SHORT).show();
    }

    /** The picture: 1080 × 1920, the theme's surface, the reference at the top, the verse in the middle, the credit below. */
    static Bitmap draw(JSONObject d, JSONObject vs) {
        int W = 1080, H = 1920, pad = 110;
        int bg = WidgetData.col(d, "bg", 0xFFF6F3EC), ink = WidgetData.col(d, "ink", 0xFF14211D),
            muted = WidgetData.col(d, "muted", 0xFF5F6B66), acc = WidgetData.col(d, "accent", 0xFF0E6B5C);
        Bitmap b = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(b);
        cv.drawColor(bg);
        // a thin frame in the accent colour, as on the app's share pictures
        Paint fr = new Paint(Paint.ANTI_ALIAS_FLAG);
        fr.setStyle(Paint.Style.STROKE); fr.setStrokeWidth(3); fr.setColor((acc & 0x00FFFFFF) | 0x55000000);
        cv.drawRoundRect(new RectF(54, 54, W - 54, H - 54), 44, 44, fr);

        TextPaint lp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        lp.setColor(muted); lp.setTextSize(34); lp.setTextAlign(Paint.Align.CENTER);
        String lab = WidgetData.lab(d, "votd");
        cv.drawText(lab, W / 2f, 250, lp);
        TextPaint rp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        rp.setColor(acc); rp.setTextSize(46); rp.setTypeface(Typeface.DEFAULT_BOLD); rp.setTextAlign(Paint.Align.CENTER);
        cv.drawText(vs.optString("r"), W / 2f, 320, rp);

        // the verse, as large as fits between the reference and the credit, centred
        int top = 400, bottom = H - 330, w = W - pad * 2;
        TextPaint tp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        tp.setColor(ink);
        StaticLayout sl = null;
        for (int sz = 66; sz >= 30; sz -= 2) {
            tp.setTextSize(sz);
            sl = StaticLayout.Builder.obtain(vs.optString("t"), 0, vs.optString("t").length(), tp, w)
                .setAlignment(Layout.Alignment.ALIGN_CENTER).setLineSpacing(0, 1.3f).build();
            if (sl.getHeight() <= bottom - top) break;
        }
        if (sl != null) {
            cv.save();
            cv.translate(pad, top + Math.max(0, (bottom - top - sl.getHeight()) / 2f));
            sl.draw(cv);
            cv.restore();
        }

        TextPaint bp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        bp.setColor(muted); bp.setTextSize(30); bp.setTextAlign(Paint.Align.CENTER);
        String by = WidgetData.lab(d, "by");
        if (!by.isEmpty()) cv.drawText(by, W / 2f, H - 200, bp);
        TextPaint sp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        sp.setColor(acc); sp.setTextSize(36); sp.setTypeface(Typeface.DEFAULT_BOLD); sp.setTextAlign(Paint.Align.CENTER);
        cv.drawText("Simply Made Studio", W / 2f, H - 148, sp);
        return b;
    }
}
