import * as t from './types'

export const init = (payload = {}) => ({
  type: t.INIT,
  payload,
})

export const load = (payload = {}) => ({
  type: t.LOAD,
  payload,
})

export const mount = (payload = {}) => ({
  type: t.MOUNT,
  payload,
})

export const navigation = (payload = {}) => ({
  type: t.NAVIGATION,
  payload,
})

export const navigationReady = (payload = {}) => ({
  type: t.NAVIGATION_READY,
  payload,
})

export const bottomTabDoublePress = (payload = {}) => ({
  type: t.BOTTOM_TAB_DOUBLE_PRESS,
  payload,
})

export const bottomTabPress = (payload = {}) => ({
  type: t.BOTTOM_TAB_PRESS,
  payload,
})

export const topTabPress = (payload = {}) => ({
  type: t.TOP_TAB_PRESS,
  payload,
})

export const ready = (payload = {}) => ({
  type: t.READY,
  payload,
})

export const auth = (payload = {}) => ({
  type: t.AUTH,
  payload,
})

export const unauth = (payload = {}) => ({
  type: t.UNAUTH,
  payload,
})

export const start = (payload = {}) => ({
  type: t.START,
  payload,
})

export const background = (payload = {}) => ({
  type: t.BACKGROUND,
  payload,
})

export const foreground = (payload = {}) => ({
  type: t.FOREGROUND,
  payload,
})

export const continuation = (payload = {}) => ({
  type: t.CONTINUATION,
  payload,
})

export const resume = (payload = {}) => ({
  type: t.RESUME,
  payload,
})

export const session = (payload = {}) => ({
  type: t.SESSION,
  payload: {
    isInitial: true,
    duration: 0,
    ...payload,
  },
})

export const mainNavigatorAvailable = (payload = {}) => ({
  type: t.MAIN_NAVIGATOR_AVAILABLE,
  payload,
})

export const mainNavigatorUnavailable = (payload = {}) => ({
  type: t.MAIN_NAVIGATOR_UNAVAILABLE,
  payload,
})

export const initialScreenInteractive = (payload = {}) => ({
  type: t.INITIAL_SCREEN_INTERACTIVE,
  payload,
})

export const checkUpdates = (payload = {}) => ({
  type: t.UPDATE_REQUEST,
  payload,
  meta: {
    offline: {
      shouldUseRequestMiddleware: true,
      effect: { path: 'check/updates', ...payload },
      commit: { type: t.UPDATE },
      rollback: { type: t.UPDATE_ERROR },
    },
  },
})

export const screenshot = (payload = {}) => ({
  type: t.SCREENSHOT,
  payload,
})

export const modalOpen = (payload = {}) => ({
  type: t.MODAL_OPEN,
  payload,
})

export const modalClose = (payload = {}) => ({
  type: t.MODAL_CLOSE,
  payload,
})
