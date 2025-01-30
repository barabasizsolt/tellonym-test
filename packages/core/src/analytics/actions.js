import * as t from './types'

export const setFirstAuthStartAppView = (payload) => ({
  type: t.SET_FIRST_AUTH_START_APP_VIEW,
  payload,
})

export const setAuthStartTime = () => ({
  type: t.SET_AUTH_START_TIME,
})

export const setHasVisitedAuthHelp = (payload) => ({
  type: t.SET_HAS_VISITED_AUTH_HELP,
  payload,
})

export const addEvent = ({ id, name, time, extra = {} }) => ({
  type: t.ADD_EVENT,
  payload: { id, name, time, extra },
})

/**
 * We are usually sending events immediately in the web, because we can't
 * send them when a user closes the tab or the browser.
 * High frequency events are debounced to avoid sending too many requests.
 */
export const addEventDebounced = ({ id, name, time, extra = {} }) => ({
  type: t.ADD_EVENT_DEBOUNCED,
  payload: { id, name, time, extra },
})

export const addKochavaEvent = (payload) => ({
  type: t.ADD_KOCHAVA_EVENT,
  payload,
})

export const rehydrate = (payload) => ({
  type: t.REHYDRATE,
  payload,
})

export const addBack = (payload) => ({
  type: t.ADD_BACK,
  payload,
})

export const removeBack = (payload) => ({
  type: t.REMOVE_BACK,
  payload,
})

export const addConsentChoiceEvent = (payload) => ({
  type: t.ADD_CONSENT_CHOICE_EVENT,
  payload,
})

export const addUniqueEvent = (payload) => ({
  type: t.ADD_UNIQUE_EVENT,
  payload,
})

export const changeKochavaAttributionStatus = (payload) => ({
  type: t.CHANGE_KOCHAVA_ATTRIBUTION_STATUS,
  payload,
})

export const clearKochavaEventBuffer = () => ({
  type: t.CLEAR_KOCHAVA_EVENT_BUFFER,
})

export const logEvent = (type, params = {}) => ({
  type: t.LOG_EVENT,
  payload: { type, params },
})

export const sendEvents = (payload) => ({
  type: t.SEND_EVENTS,
  payload,
})

export const sendEventsError = (payload) => ({
  type: t.SEND_EVENTS_ERROR,
  payload,
})

export const sendEventsSuccess = (payload) => ({
  type: t.SEND_EVENTS_SUCCESS,
  payload,
})

export const addFocus = (payload) => ({
  type: t.ADD_FOCUS,
  payload,
})

export const collectDebugInfo = (payload) => ({
  type: t.COLLECT_DEBUG_INFO,
  payload,
})

export const continueSession = (payload) => ({
  type: t.CONTINUE_SESSION,
  payload,
})

export const removeAd = (payload) => ({
  type: t.REMOVE_AD,
  payload,
})

export const removeFocus = (payload) => ({
  type: t.REMOVE_FOCUS,
  payload,
})

export const removeLastAppView = () => ({
  type: t.REMOVE_LAST_APP_VIEW,
})

export const resetAds = (payload) => ({
  type: t.RESET_ADS,
  payload,
})

export const sendDebugInfo = (payload) => ({
  type: t.SEND_DEBUG_INFO,
  payload,
  meta: {
    offline: {
      shouldUseRequestMiddleware: true,
      effect: { path: 'info/debug', method: 'POST' },
      commit: { type: t.SEND_DEBUG_INFO_SUCCESS },
      rollback: { type: t.SEND_DEBUG_INFO_ERROR },
    },
  },
})

export const setAppView = (payload) => ({
  type: t.SET_APP_VIEW,
  payload,
})

export const setIdfaSentAt = (payload) => ({
  type: t.SET_IDFA_SENT_AT,
  payload,
})

export const startSession = (payload) => ({
  type: t.START_SESSION,
  payload,
})

export const updateAd = (id, data) => ({
  type: t.UPDATE_AD,
  payload: { id, data },
})

export const setHasSeenCompleteProfileSlider = (payload) => ({
  type: t.SET_HAS_SEEN_COMPLETE_PROFILE_SLIDER,
  payload,
})

export const resetHasSeenCompleteProfileSlider = (payload) => ({
  type: t.RESET_HAS_SEEN_COMPLETE_PROFILE_SLIDER,
  payload,
})

/**
 * set if appOpenIntent from app reducer has been used for a specific analytics event
 * @param {{eventName: Event, value: boolean}} payload
 */
export const setEventHasUsedCurrentAppOpenWithIntent = (payload) => ({
  type: t.SET_EVENT_HAS_USED_CURRENT_APP_OPEN_WITH_INTENT,
  payload,
})

export const resetEventHasUsedCurrentAppOpenWithIntent = (payload) => ({
  type: t.RESET_EVENT_HAS_USED_CURRENT_APP_OPEN_WITH_INTENT,
  payload,
})
