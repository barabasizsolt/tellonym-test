const path = require('path')
const fs = require('fs')
const R = require('ramda')
const prompts = require('prompts')

const appTxtPath = path.join(__dirname, '../public/app-ads.txt')
const webTxtPath = path.join(__dirname, '../public/ads.txt')

const transformToArray = (string) => string.split('\n')

const getDuplicates = (array) => {
  const duplicates = []
  const uniques = []

  array.reduce((acc, curr) => {
    if (acc[curr] && curr !== '' && curr !== '\n') {
      duplicates.push(curr)
    } else {
      acc[curr] = curr
      uniques.push(curr)
    }

    return acc
  }, {})

  return [duplicates, uniques]
}

const run = async () => {
  const appads = fs.readFileSync(appTxtPath, 'utf8')
  const webads = fs.readFileSync(webTxtPath, 'utf8')

  const [resultApp, uniqueApp] = R.compose(
    getDuplicates,
    transformToArray
  )(appads)

  const [resultWeb, uniqueWeb] = R.compose(
    getDuplicates,
    transformToArray
  )(webads)

  console.log('\n   app-ads.txt\n')
  console.log(resultApp.join('\n'))
  console.log('\n   ads.txt\n')
  console.log(resultWeb.join('\n'))
  console.log('')

  const { shouldWriteApp, shouldWriteWeb } = await prompts([
    {
      type: 'confirm',
      name: 'shouldWriteApp',
      message: 'Should app-ads.txt be made unique?',
    },
    {
      type: 'confirm',
      name: 'shouldWriteWeb',
      message: 'Should ads.txt be made unique?',
    },
  ])

  if (shouldWriteApp) {
    fs.writeFileSync(appTxtPath, uniqueApp.join('\n'))
  }

  if (shouldWriteWeb) {
    fs.writeFileSync(webTxtPath, uniqueWeb.join('\n'))
  }
}

run()
