import fs from 'fs'
import { spawn, spawnSync } from 'child_process'
import { program } from 'commander'

/**
 * This script helps with generating the changelog entries for production log.
 * It combines all commits from 'target' until 'untilVersion', if the changelog is too short
 * you need to define additional versions that should be generated with '-r'.
 */

const targetHeadlineRegex = /###\s(.*)/
const entryRegex = /\*\s\*\*(\w*):\*\*\s([\w|\s]*)\s/

program
  .version('0.1.0')
  .usage('node changelogFilter.mjs [options]')
  .option(
    '-u, --until-version <version>',
    'version until the filter should be applied (including version) e.g. 3.28.1',
    '0.1.0'
  )
  .option('-t, --target <client>', 'target client app, web, modcp etc.', 'app')
  .option(
    '-r, --versions-backwards-amount <number>',
    'how many versions should be generated for changelog',
    20
  )
  .parse()

const formatOutput = (entries) => {
  const output = []

  Object.keys(entries).forEach((kind) => {
    output.push(kind)

    for (const entry of entries[kind]) {
      output.push(`- ${entry}`)
    }

    output.push('\n')
  })

  return output.join('\n')
}

const { target, untilVersion, versionsBackwardsAmount } = program.opts()

const run = () => {
  spawnSync('npx', [
    'conventional-changelog',
    '-p',
    '@tellonym/tellonym',
    '-o',
    'CHANGELOG.md',
    '-r',
    `${versionsBackwardsAmount}`,
  ])

  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8')

  const rows = changelog.split('\n')
  const filteredRows = rows.filter((v) => !['', null, undefined].includes(v))

  let hasReachedTarget = false
  let lineNumber = 0
  let currentKind

  const entries = {}

  while (!hasReachedTarget) {
    const row = filteredRows[lineNumber] || ''

    if (row.startsWith(`## [${untilVersion}]`)) {
      hasReachedTarget = true
    } else if (lineNumber === rows.length) {
      hasReachedTarget = true

      console.log('Reached end of file, did not find target version')
    }

    const headline = row.match(targetHeadlineRegex)
    if (headline !== null) {
      currentKind = headline[1]
    }

    // eslint-disable-next-line no-unused-vars
    const [_, lineTarget, message] = row.match(entryRegex) || []

    if (
      typeof entries[currentKind] === 'undefined' &&
      typeof currentKind !== 'undefined'
    ) {
      entries[currentKind] = []
    }

    if (lineTarget === target && typeof message !== 'undefined') {
      entries[currentKind].push(message)
    }

    lineNumber += 1
  }

  spawn('git', ['restore', 'CHANGELOG.md'])

  console.log('') // TODO: remove
  console.log(formatOutput(entries))
}

run()
