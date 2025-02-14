import { getAccount } from '../app/selectors'
import { KochavaAttributionStatus, name } from './constants'

export const getState = (state) => state[name]

export const getAds = (state) => state[name].ads

export const getAppView = (state) => state[name].appView

export const getPreviousAppView = (state) => state[name].previousAppView

export const getFirstAuthStartAppView = (state) =>
  state[name].firstAuthStartAppView

export const getHasVisitedAuthHelp = (state) => state[name].hasVisitedAuthHelp

export const getAuthStartTime = (state) => state[name].authStartTime

export const getAreAnalyticsEnabled = (state) =>
  getAccount(state)?.areAnalyticsEnabled

export const getIdfaSentAt = (state) => state[name].idfaSentAt

export const getIsSendingDebugInfo = (state) => state[name].isSendingDebugInfo

export const getLoggedUniqueEvents = (state) => state[name].loggedUniqueEvents

export const getHasSeenCompleteProfileSlider = (state) =>
  state[name].hasSeenCompleteProfileSlider

export const getReportId = (state) => state[name].reportId

export const getSessionEndedAt = (state) => state[name].sessionEndedAt

export const getSessionStartedAt = (state) => state[name].sessionStartedAt

export const getViewTimes = (state) => state[name].viewTimes

export const getIsSendingRegisteredEvents = (state) =>
  state[name].isSendingRegisteredEvents

export const getIsSendingUnregisteredEvents = (state) =>
  state[name].isSendingUnregisteredEvents

export const getRegisteredEvents = (state) => state[name].registeredEvents

export const getUnregisteredEvents = (state) => state[name].unregisteredEvents

export const getEventState = (state, { type }) =>
  type === 'registered'
    ? {
        events: state[name].registeredEvents,
        isSending: state[name].isSendingRegisteredEvents,
      }
    : {
        events: state[name].unregisteredEvents,
        isSending: state[name].isSendingUnregisteredEvents,
      }

export const getEventHasUsedCurrentAppOpenWithIntent = (state) =>
  state[name].eventHasUsedCurrentAppOpenWithIntent

export const getKochavaAttributionStatus = (state) =>
  state[name].kochavaAttributionStatus ??
  KochavaAttributionStatus.NOT_ATTRIBUTED

export const getKochavaEventBuffer = (state) => state[name].kochavaEventBuffer

export const getKochavaLoggedEvents = (state) => state[name].kochavaLoggedEvents
