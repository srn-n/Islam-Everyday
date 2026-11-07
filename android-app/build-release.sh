#!/usr/bin/env bash
# Same as build-release.cmd, for macOS/Linux (or CI).
set -euo pipefail
cd "$(dirname "$0")"
[ -f keys/keystore.properties ] || { echo "keys/keystore.properties is missing"; exit 1; }
npm install --no-audit --no-fund
npm run sync
(cd android && ./gradlew --no-daemon clean bundleRelease)
VN=$(sed -n 's/.*versionName "\(.*\)".*/\1/p' android/app/build.gradle)
cp android/app/build/outputs/bundle/release/app-release.aab "IslamEveryday-$VN.aab"
echo "Done: IslamEveryday-$VN.aab"
