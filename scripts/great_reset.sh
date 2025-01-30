#!/usr/bin/env bash
set -e
CWD=$(pwd)
watchman watch-del-all
yarn cache clean --mirror
rm -rf ~/Library/{Developer/Xcode/DerivedData,Caches/CocoaPods/Pods,Caches/org.swift.swiftpm}
rm -rf ~/.gradle/caches
rm -rf $CWD/packages/{app,core,modcp,web}/build
rm -rf $CWD/packages/{app,core,modcp,web}/dist
rm -rf $CWD/packages/app/{android,android/app,ios}/build
rm -rf $CWD/packages/app/{android,android/app}/.cxx
rm -rf $CWD/packages/app/android/{.gradle,.idea}
rm -rf $CWD/vendor/bundle
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
find . -name 'Pods' -type d -prune -exec rm -rf '{}' +
yarn install
yarn workspaces foreach run i
