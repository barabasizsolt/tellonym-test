import * as _ from './underscore'

const PERMISSION_DENIED = 1
const POSITION_UNAVAILABLE = 2
const TIMEOUT = 3
const PLAY_SERVICE_NOT_AVAILABLE = 4
const SETTINGS_NOT_SATISFIED = 5
const INTERNAL_ERROR = -1

const getCurrentPosition = (payload = {}) => {
  const { ...options } = payload

  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (res = {}) => {
        const { coords = {} } = res
        const { latitude, longitude } = coords
        resolve({ latitude, longitude })
      },
      (e = {}) => {
        switch (e.code) {
          case POSITION_UNAVAILABLE:
          case SETTINGS_NOT_SATISFIED:
            // TODO
            break
          case INTERNAL_ERROR:
            if (e instanceof Error) {
              _.capture(e)
            } else {
              _.capture(new Error(JSON.stringify(e)))
            }
            break
          case PERMISSION_DENIED:
          case PLAY_SERVICE_NOT_AVAILABLE:
          case TIMEOUT:
          default:
            break
        }
        reject(e)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 600000,
        timeout: 15000,
        ...options,
      }
    )
  )
}

const watchPosition = (handler, options = {}) =>
  navigator.geolocation.watchPosition(handler, null, {
    enableHighAccuracy: true,
    maximumAge: 600000,
    timeout: 15000,
    useSignificantChanges: true,
    ...options,
  })

const clearWatch = (id) => navigator.geolocation.clearWatch(id)

const stopObserving = () => navigator.geolocation.stopObserving()

export const geolocation = {
  INTERNAL_ERROR,
  PERMISSION_DENIED,
  PLAY_SERVICE_NOT_AVAILABLE,
  POSITION_UNAVAILABLE,
  SETTINGS_NOT_SATISFIED,
  TIMEOUT,
  clearWatch,
  getCurrentPosition,
  stopObserving,
  watchPosition,
}
