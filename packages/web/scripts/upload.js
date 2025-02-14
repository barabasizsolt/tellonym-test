#!/usr/bin/env node

const fs = require('fs')
const prompts = require('prompts')
const path = require('path')
const { program } = require('commander') // eslint-disable-line import/no-extraneous-dependencies
const semver = require('semver')
const { spawn } = require('child_process')
const { version } = require('../package.json')

const buildFolderPath = path.resolve(`${__dirname}/../build`)

const productionCdnUrl = 'https://www2.tellonym.me/'
const testingCdnUrl = 'https://www2.tnym.de/'
const stagingCdnUrl = 'https://www2-staging.tellonym.me/'

program
  .version('0.1.0')
  .usage('./upload.js [shouldActivateProduction]')
  .option('-p, --production', 'Activate on production environment')
  .option('-s, --skiptags', 'skip the tag creation')
  .option('-g, --staging', 'build and upload staging')
  .parse()

const cleanup = () =>
  new Promise((resolve, reject) => {
    console.log('Cleaning up...')
    const cmdCleanFolder = spawn('rm', ['-rf', buildFolderPath])
    cmdCleanFolder.stdout.on('data', (data) => console.log(data.toString()))
    cmdCleanFolder.stderr.on('data', (data) => console.warn(data.toString()))
    cmdCleanFolder.on(
      'exit',
      (code) => (code === 0 ? resolve() : reject({ code, skipCleanup: true })) // eslint-disable-line prefer-promise-reject-errors
    )
  })

const onError = (param) => {
  if (typeof param === 'object') {
    if (!param.skipCleanup) {
      cleanup()
    }
    return undefined
  }
  console.log(`child process exited with code ${param.toString()}`)
  cleanup()
  return undefined
}

const syncAndRelease = ({ isProduction = false, isStaging = false, version }) =>
  new Promise((resolve, reject) => {
    const cmd = spawn('aws', [
      's3',
      'cp',
      '--recursive',
      isProduction
        ? `s3://tellonym-web/version/${version}/production/`
        : isStaging
        ? `s3://tellonym-web/version/${version}/staging/`
        : `s3://tellonym-web/version/${version}/testing/`,
      isProduction
        ? 's3://tellonym-web/production'
        : isStaging
        ? 's3://tellonym-web/staging'
        : 's3://tellonym-web/testing',
      '--acl',
      'public-read',
    ])

    cmd.stdout.on('data', (data) => console.log(data.toString()))
    cmd.stderr.on('data', (data) => console.warn(data.toString()))
    cmd.on('exit', (code) => (code === 0 ? resolve() : reject(code)))
  })

const activateToProductionPrompt = () =>
  new Promise((resolve) =>
    prompts({
      type: 'confirm',
      name: 'shouldDeployToProduction',
      initial: false,
      message:
        'Should this bundle be available for production? THIS CAN NOT BE REVERTED!',
    }).then(({ shouldDeployToProduction }) => resolve(shouldDeployToProduction))
  )

const startUpload = ({ isProduction = false, isStaging = false, version }) =>
  new Promise((resolve, reject) => {
    const cmd = spawn('aws', [
      's3',
      'cp',
      '--recursive',
      buildFolderPath,
      isProduction
        ? `s3://tellonym-web/version/${version}/production/`
        : isStaging
        ? `s3://tellonym-web/version/${version}/staging/`
        : `s3://tellonym-web/version/${version}/testing/`,
      '--metadata-directive',
      'REPLACE',
      '--cache-control',
      '"max-age=31536000, public"',
    ])

    cmd.stdout.on('data', (data) => console.log(data.toString()))
    cmd.stderr.on('data', (data) => console.warn(data.toString()))
    cmd.on('exit', (code) => (code === 0 ? resolve() : reject(code)))
  })

const removeMaps = () =>
  new Promise((resolve) => {
    fs.readdirSync(path.resolve(`${__dirname}/../build/static/js`)).reduce(
      (_, curr) =>
        curr.endsWith('map') &&
        fs.unlinkSync(path.resolve(`${__dirname}/../build/static/js/${curr}`)),
      undefined
    )

    // fs.readdirSync(path.resolve(`${__dirname}/../build/static/css`)).reduce(
    //   (_, curr) =>
    //     curr.endsWith('map') &&
    //     fs.unlinkSync(path.resolve(`${__dirname}/../build/static/css/${curr}`)),
    //   undefined
    // )

    resolve()
  })

const buildBundle = (payload = { isProduction: false, isStaging: false }) =>
  new Promise((resolve, reject) =>
    prompts({
      type: 'confirm',
      name: 'shouldBuild',
      message: 'Build the new version (yarn build) ?',
      initial: true,
    }).then(({ shouldBuild }) => {
      if (shouldBuild) {
        const cmd = spawn(
          'yarn',
          [
            payload.isProduction
              ? 'build:maps'
              : payload.isStaging
              ? 'build:staging'
              : 'build:testing',
          ],
          {
            env: {
              ...process.env,
              PUBLIC_URL: payload.isProduction
                ? productionCdnUrl
                : payload.isStaging
                ? stagingCdnUrl
                : testingCdnUrl,
            },
          }
        )

        cmd.stdout.on('data', (data) => console.log(data.toString()))
        cmd.stderr.on('data', (data) => console.warn(data.toString()))
        cmd.on('exit', (code) =>
          code === 0 ? removeMaps().then(resolve) : reject(code)
        )
      } else {
        resolve()
      }
    })
  )

const options = program.opts()

const run = () =>
  options.production
    ? buildBundle({ isProduction: true })
        .then(() => startUpload({ isProduction: true, version }))
        .then(activateToProductionPrompt)
        .then((shouldDeployToProduction) =>
          shouldDeployToProduction
            ? syncAndRelease({ isProduction: true, version })
            : undefined
        )
        .then(cleanup)
        .catch(onError)
    : options.staging
    ? buildBundle({ isStaging: true })
        .then(() => startUpload({ isStaging: true, version }))
        .then(() => syncAndRelease({ isStaging: true, version }))
        .then(cleanup)
        .catch(onError)
    : options.skiptags
    ? buildBundle()
        .then(() => startUpload({ version }))
        .then(() => syncAndRelease({ version }))
        .then(cleanup)
        .catch(onError)
    : prompts({
        type: 'select',
        name: 'semverIncrement',
        message: 'Select semver increment',
        choices: [
          { title: 'patch', value: 'patch' },
          { title: 'minor', value: 'minor' },
          { title: 'major', value: 'major' },
        ],
        initial: 0,
      })
        .then(({ semverIncrement }) => {
          const increasedVersion = semver.inc(version, semverIncrement)
          const cmdNpm = spawn('npm', ['version', increasedVersion])

          cmdNpm.stdout.on('data', (data) => console.log(data.toString()))
          cmdNpm.stderr.on('data', (data) => console.warn(data.toString()))
          cmdNpm.on('exit', (code) => {
            if (code === 0) {
              const cmdPush = spawn('git', ['push'])

              cmdPush.stdout.on('data', (data) => console.log(data.toString()))
              cmdPush.stderr.on('data', (data) => console.warn(data.toString()))
              cmdPush.on('exit', (code) => {
                if (code === 0) {
                  const cmdPushTags = spawn('git', ['push', '--tags'])

                  cmdPushTags.stdout.on('data', (data) =>
                    console.log(data.toString())
                  )
                  cmdPushTags.stderr.on('data', (data) =>
                    console.warn(data.toString())
                  )
                  cmdPushTags.on(
                    'exit',
                    (code) =>
                      code === 0 &&
                      buildBundle()
                        .then(() => startUpload({ version: increasedVersion }))
                        .then(() =>
                          syncAndRelease({
                            version: increasedVersion,
                          })
                        )
                        .then(cleanup)
                        .catch(onError)
                  )
                }
              })
            }
          })
        })
        .catch(onError)

run()
