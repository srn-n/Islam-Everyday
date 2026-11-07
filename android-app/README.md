# Islam Everyday for Android

The website (`../IslamEverydayWeb`) packaged as a Play Store app with Capacitor 8. Simply Made Studio.

- App ID: `com.simplymadestudio.islameveryday` (permanent once uploaded to Play)
- Target SDK 36 (Android 16, Play's requirement for new apps and updates), min SDK 24 (Android 7)
- Everything is bundled: the app works offline from the first open, no service worker.

## Build the Play bundle

Needs Android Studio (for its JDK and Android SDK) and Node.js. On Windows, double-click or run:

    build-release.cmd

It copies the website into `www/`, syncs it into the Android project and writes `IslamEveryday-<version>.aab`,
signed with the upload key in `keys/`. For a test install on a phone, open `android/` in Android Studio and press Run.

Each time the website changes: run the build again. Before every Play upload, raise `versionCode` by 1 in
`android/app/build.gradle` (and `versionName` if you want people to see a new number).

## The upload key: back it up now

`keys/` holds `islam-everyday-upload.jks` and `keystore.properties` (its password). It is outside git on purpose.

1. Copy the whole `keys` folder to two places that are not this computer (for example a USB stick and a password manager or private cloud folder).
2. Never commit it or send it to anyone.
3. When you create the app in Play Console, keep **Play App Signing** on (the default). Google then holds the real signing key, and this one only proves uploads come from you. If you lose it, Play support can reset the upload key; without Play App Signing a lost key means a new app listing.

Upload key certificate SHA-256: `24:92:23:50:06:1C:BF:E5:02:33:F6:C6:0D:58:48:45:86:FC:28:D0:92:8B:DB:C2:C6:D1:AF:11:23:D5:2C:F1`

## What is app-only

Lives in the website code, switched on only inside the app (`NATIVE` in `assets/app.js`, `html.native` in CSS):

- Opening: Android's launch screen is the app's background colour only; the page's own splash (the doorway drawing itself, the studio name) starts as it fades, from the same colour.
- Closing: Back on Today fades the page into the doorway, then Android takes the app to the background. Reopening reverses it.
- Back button: closes an open sheet, then steps back through pages, then returns to Today, then closes.
- Sections slide (also on phone browsers, not on desktop). Fast or repeated taps finish the current slide instead of queueing.
- Share: image share through Android's share sheet, links point to the website, copy uses the app clipboard. Save-as-JPG and PDF (printing) are not offered in the app, since Android's web view cannot download or print.
- Status bar icons follow the theme; safe areas come from Capacitor.
- Haptics on section changes and prayer ticks (off with Motion: off).
- "My location" asks for Android's location permission when tapped; the position stays on the phone.

Files: `capacitor.config.json`, `scripts/copy-web.mjs`, `scripts/make-icons.mjs` (launcher icons and Play graphics from `brand/`),
`android/app/src/main/res/values*/` (colours, launch theme), `android/app/src/main/java/.../MainActivity.java`.

## Build on GitHub instead (no Android Studio needed)

`.github/workflows/android.yml` (in the website repo) builds an **unsigned** bundle on every push to main that touches the
app or the website, or by hand from the Actions tab (Run workflow). Download the artifact `islam-everyday-aab-unsigned`,
then sign it with the upload key on your own machine (the key never goes to GitHub):

    jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore keys\islam-everyday-upload.jks -signedjar IslamEveryday-1.0.0.aab app-release.aab upload

(`jarsigner` comes with any JDK, including Android Studio's `jbr\bin`.) Raise `versionCode` before each Play upload, as above.
