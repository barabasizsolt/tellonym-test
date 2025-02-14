const cookieRegex = /^.*isTnymDebugEnabled=true.*$/

const getIsTnymDebugEnabled = () => cookieRegex.test(document.cookie)

if (process.env.REACT_APP_ENV !== 'production') {
  document.cookie =
    'isTnymDebugEnabled=true;path=/;expires=Thu, 12 Dec 2030 00:00:00 UTC;'
}

let isTnymDebugEnabled = getIsTnymDebugEnabled()

window.tnym.enableDebug = (enforcedNetwork) => {
  // eslint-disable-next-line

  document.cookie =
    'isTnymDebugEnabled=true;path=/;expires=Thu, 12 Dec 2030 00:00:00 UTC;'

  if (enforcedNetwork) {
    document.cookie = `tnymEnforcedAdNetwork=${enforcedNetwork};path=/;expires=Thu, 12 Dec 2030 00:00:00 UTC;`
  } else {
    document.cookie =
      'tnymEnforcedAdNetwork=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  }

  isTnymDebugEnabled = getIsTnymDebugEnabled()
}

window.tnym.disableDebug = () => {
  document.cookie =
    'isTnymDebugEnabled=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  document.cookie =
    'tnymEnforcedAdNetwork=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

  isTnymDebugEnabled = getIsTnymDebugEnabled()
}

const logProduction = (...log) => isTnymDebugEnabled && console.log(...log) // eslint-disable-line no-console
window.tnym.logProduction = logProduction

export const Analytics = {
  addEvent: logProduction,
  logProduction,
}
