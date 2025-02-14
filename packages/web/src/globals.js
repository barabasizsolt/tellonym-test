window.Buffer = window.Buffer || require('buffer').Buffer

window.tnym = window.tnym || {}
window.tnym.device = (() => {
  const includes = (string) => navigator.appVersion?.indexOf?.(string) !== -1

  const version = '0'

  switch (true) {
    case includes('iPhone') || includes('iPad') || includes('iPod'):
      return { os: 'ios', version }
    case includes('Android'):
      return { os: 'android', version }
    case includes('Windows'):
      return { os: 'windows', version }
    case includes('Mac'):
      return { os: 'mac', version }
    case includes('Linux'):
      return { os: 'linux', version }
    case includes('X11'):
      return { os: 'unix', version }
    default:
      return { os: 'unknown', version }
  }
})()
window.tnym.getWidth = () => document.documentElement.clientWidth
window.tnym.getHeight = () => document.documentElement.clientHeight - 50
window.tnym.getFullHeight = () => document.documentElement.clientHeight
window.tnym.hasChangedLangToProfileLang = false
window.tnym.isAndroid =
  window.navigator.userAgent.toLowerCase().indexOf('android') > -1
window.tnym.isDesktop = () => document.documentElement.clientWidth >= 768
window.tnym.logProduction = () => {}
window.tnym.isInAppBrowser = (() => {
  const isInAppBrowser =
    window.tnym.useragentFamily?.toLowerCase()?.indexOf('webview') > -1

  return isInAppBrowser
})()
window.tnym.isInstagramInAppBrowser = (() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  const isInstagram = ua.indexOf('Instagram') > -1

  if (isInstagram) {
    return true
  }

  return (
    window.tnym.isInAppBrowser && window.location.search.indexOf('fbclid') > -1
  )
})()
window.tnym.isSnapchatInAppBrowser = (() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  const isSnapchat = ua.indexOf('Snapchat') > -1

  return isSnapchat
})()
window.tnym.whoami = (() => {
  // eslint-disable-next-line prefer-const
  let ua = navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return {
      browser: 'ie',
      version: tem[1],
    }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
    if (tem != null) {
      return {
        browser: tem.indexOf('Edge') > -1 ? 'edge' : 'opera',
        version: tem[2],
      }
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  // eslint-disable-next-line no-cond-assign
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1])
  }

  // fixes netscape who reports version with user agent like "5.0 (iPhone)..."
  const version = M[1].match(/^([0-9]*\.?[0-9]*)\s*.*/)[1]

  return {
    browser: M[0].toLowerCase(),
    version,
  }
})()
