# Finishing Android App Links setup ("Share my progress" opens the app)

The code side of this is done:

- `android/app/src/main/AndroidManifest.xml` has a second, `android:autoVerify="true"`
  intent-filter on `MainActivity` for `https://happykidsacademy.playfantacy.com`
  (any path — not just `/progress` — so any link shared from the app opens
  the app, not just the progress card).
- `src/components/shared/deep-link-handler.tsx` (mounted in `layout.tsx`)
  turns an incoming link into an in-app navigation, whether the app was
  already open or was cold-started by the tap.
- `public/.well-known/assetlinks.json` is scaffolded, but with a placeholder
  fingerprint — **this is the one piece I can't fill in for you**: it has to
  be the SHA-256 certificate fingerprint of whatever actually signs the APK
  a real user installs, and that's either in your Play Console or a
  password-protected keystore, neither of which this session has access to.

Until that fingerprint is real, Android treats the link as an ordinary
(unverified) deep link: still works if someone long-presses/picks "Open with
Happy Kids Academy", but won't open the app automatically the way a verified
App Link does. Here's how to finish it.

## 1. Get the real SHA-256 fingerprint

Most apps on the Play Store use **Play App Signing**, where Google holds the
actual signing key and re-signs your upload — if that's the case here, the
fingerprint you need is Google's, not your local keystore's:

1. [Play Console](https://play.google.com/console) → your app → **Setup → App integrity**.
2. Under **App signing key certificate**, copy the **SHA-256 certificate fingerprint**.

If you're *not* using Play App Signing (self-managed signing), get it from
your release keystore instead:

```bash
keytool -list -v -keystore android/app/release/keyStore.jks -alias <your-key-alias>
# Enter the keystore password when prompted, then copy the SHA256 line.
```

(`android/app/release/keyStore.jks` exists in this repo but `android/app/build.gradle`
has no `signingConfigs` block wired to it yet, which is a separate thing worth
checking — right now nothing here tells Gradle to actually sign release
builds with it.)

### Also add your debug fingerprint (optional, for local testing)

So App Links work on a debug build installed straight from Android Studio,
add its fingerprint too — `sha256_cert_fingerprints` accepts more than one:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
```

## 2. Update `public/.well-known/assetlinks.json`

Replace the placeholder with the real fingerprint(s):

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.happykids.academy",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:...:ZZ",
        "11:22:33:...:99"
      ]
    }
  }
]
```

Keep the colon-separated hex format `keytool` prints — don't strip the colons.

## 3. Deploy

- **The site**: rebuild (`npm run build`) and redeploy — `public/.well-known/assetlinks.json`
  copies straight into `out/.well-known/assetlinks.json` as a static file
  with no build step needed on it. Confirm it's actually reachable and
  serves as JSON after deploying: `curl -i https://happykidsacademy.playfantacy.com/.well-known/assetlinks.json`
  (should be `200`, `content-type: application/json`, no redirect).
- **The app**: ship a new build with the updated `AndroidManifest.xml` (already
  in this repo — just needs a normal `npx cap sync android` + release build).

Android re-verifies the domain the next time the app is installed/updated —
there's no separate "resync" step needed beyond a normal app update once
both halves are live.

## 4. Test it

Google's own checker (paste your domain + package name + fingerprint):
https://developers.google.com/digital-asset-links/tools/generator

On a device/emulator with the app installed, from a terminal:

```bash
# Simulates tapping a shared link — should open the app straight to that page,
# not a browser chooser, once verification has gone through.
adb shell am start -a android.intent.action.VIEW \
  -d "https://happykidsacademy.playfantacy.com/progress?level=3&stars=10&coins=20&badges=1&lessons=5" \
  com.happykids.academy

# Android 12+: shows verification status per domain.
adb shell pm get-app-links com.happykids.academy
```

If it opens a browser (or a chooser) instead of going straight to the app,
the most common cause is the fingerprint in `assetlinks.json` not matching
what actually signed the installed APK — double-check step 1 against
whichever build (Play-installed vs. sideloaded debug/release) you're testing
with.

## iOS

There's no `ios/` Capacitor project in this repo yet, so this only covers
Android for now. If iOS gets added later, the equivalent is a Universal Link:
an `apple-app-site-association` file at
`public/.well-known/apple-app-site-association` (no `.json` extension, but
served as `application/json`) listing your Team ID + Bundle ID, plus the
"Associated Domains" capability (`applinks:happykidsacademy.playfantacy.com`)
added to the Xcode project.
