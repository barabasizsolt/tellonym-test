#!/usr/bin/env node
/**
 * Fastlane uploads changelogs with each release.
 * We configure them in the ./packages/strings project
 * and use a post install hook to sync the data.
 */
const fs = require('fs')
const path = require('path')

const root = process.cwd()

const changelogs = {
  'ar,ar-SA': require('../packages/strings/app/ar.json').changelog,
  'de-DE,de-DE': require('../packages/strings/app/de.json').changelog,
  'en-US,en-US': require('../packages/strings/app/en.json').changelog,
  'es-ES,es-ES': require('../packages/strings/app/es.json').changelog,
  'fr-FR,fr-FR': require('../packages/strings/app/fr.json').changelog,
  'it-IT,it': require('../packages/strings/app/it.json').changelog,
  'pt-BR,pt-BR': require('../packages/strings/app/pt.json').changelog,
  'ro,ro': require('../packages/strings/app/ro.json').changelog,
  'ru-RU,ru': require('../packages/strings/app/ru.json').changelog,
  'sv-SE,sv': require('../packages/strings/app/sv.json').changelog,
  'tr-TR,tr': require('../packages/strings/app/tr.json').changelog,
}

const entries = Object.entries(changelogs)

for (const [locales, string] of entries) {
  const [androidLocale, iosLocale] = locales.split(',')

  const androidPath = path.resolve(
    root,
    'packages/app/android/fastlane/metadata/android',
    androidLocale,
    'changelogs/default.txt'
  )

  if (string && fs.existsSync(androidPath)) {
    fs.writeFileSync(androidPath, string)
  }

  const iosPath = path.resolve(
    root,
    'packages/app/ios/fastlane/metadata',
    iosLocale,
    'release_notes.txt'
  )

  if (string && fs.existsSync(iosPath)) {
    fs.writeFileSync(iosPath, string)
  }
}

/**
 * JSON file used for iOS Beta submissions.
 */
const iosPath = path.resolve(
  root,
  'packages/app/ios/fastlane/localized_build_info.json'
)

fs.writeFileSync(
  iosPath,
  JSON.stringify(
    entries.reduce((acc, [locales, whats_new]) => {
      const [, iosLocale] = locales.split(',')

      if (iosLocale === 'en-US') {
        acc.default = { whats_new }
      }

      acc[iosLocale] = { whats_new }

      return acc
    }, {})
  )
)
