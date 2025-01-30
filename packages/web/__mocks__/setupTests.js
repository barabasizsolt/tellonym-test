import '../src/globals'

global.__DEV__ = false
global.APP_VERSION = JSON.stringify(require('../package.json').version)
