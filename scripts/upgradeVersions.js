#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const version = require(`${__dirname}/../package.json`).version
const packages = ['app', 'modcp', 'web']

for (const pkg of packages) {
  const file = path.resolve(__dirname, `../packages/${pkg}/package.json`)
  const json = require(file)
  json.version = version
  fs.writeFileSync(
    `${__dirname}/../packages/${pkg}/package.json`,
    `${JSON.stringify(json, null, 2)}\n`
  )
}
