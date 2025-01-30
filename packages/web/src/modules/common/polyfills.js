const { browser, version } = window.tnym.whoami

const patchFetch = () => {
  const _fetch = fetch
  window.fetch = (...args) => Promise.resolve(_fetch(...args))
  return Promise.resolve()
}

if (
  (browser === 'safari' && parseInt(version, 10) < 11) ||
  ['chrome', 'edge', 'ie', 'opera', 'safari'].indexOf(browser) === -1
) {
  delete window.Promise
  delete window.fetch
}

if (
  'Promise' in window === false ||
  typeof Promise.prototype.finally !== 'function'
) {
  window.Promise = require('es6-promise').Promise
}

if (URLSearchParams === undefined) {
  require('url-search-params-polyfill')
}

export const loadPolyfills = () =>
  Promise.all(
    [
      ('from' in Array &&
        'startsWith' in String.prototype &&
        'endsWith' in String.prototype &&
        'includes' in String.prototype &&
        'includes' in Array.prototype &&
        'assign' in Object &&
        'values' in Object &&
        'entries' in Object &&
        'keys' in Object) === false && import('core-js/actual'),
      'fetch' in window === false && import('whatwg-fetch'),
    ].filter(Boolean)
  ).then(patchFetch)
