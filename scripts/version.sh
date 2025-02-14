#!/usr/bin/env bash
# do not run by yourself
# this script is run by the npm version command
set -e

yarn workflow:eslint
yarn workflow:jest
yarn workflow:madge

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)

APP_DIRECTORY="$DIR/../packages/app"
MODCP_DIRECTORY="$DIR/../packages/modcp"
WEB_DIRECTORY="$DIR/../packages/web"

PACKAGE_JSON="$DIR/../package.json"
APP_PACKAGE_JSON="$APP_DIRECTORY/package.json"
APP_BUILD_GRADLE="$APP_DIRECTORY/android/app/build.gradle"
APP_INFO_PLIST="$APP_DIRECTORY/ios/Tellonym/Info.plist"
APP_FASTLANE_ANDROID_DIR="$APP_DIRECTORY/android/fastlane"
APP_FASTLANE_IOS_DIR="$APP_DIRECTORY/ios/fastlane"
MODCP_PACKAGE_JSON="$MODCP_DIRECTORY/package.json"
WEB_PACKAGE_JSON="$WEB_DIRECTORY/package.json"

NEXT_VERSION_NAME=$(node -p "require('$PACKAGE_JSON').version")

node $DIR/upgradeVersions.js
git add $APP_PACKAGE_JSON 
git add $MODCP_PACKAGE_JSON 
git add $WEB_PACKAGE_JSON 

node $DIR/syncStrings.js
git add $APP_FASTLANE_ANDROID_DIR
git add $APP_FASTLANE_IOS_DIR

npx conventional-changelog -p @tellonym/tellonym -o CHANGELOG.md -r 8
git add $DIR/../CHANGELOG.md

sed -i "" "s/versionName.*/versionName \"$NEXT_VERSION_NAME\"/" $APP_BUILD_GRADLE
git add $APP_BUILD_GRADLE

/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $NEXT_VERSION_NAME" "$APP_INFO_PLIST"
git add $APP_INFO_PLIST
