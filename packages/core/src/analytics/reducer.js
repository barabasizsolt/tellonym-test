import { identity, pick } from 'ramda'
import { config } from '../config'
import { queue } from '../helpers'
import {
  EVENT_SEND_BATCH_SIZE,
  EVENT_TYPE,
  KochavaAttributionStatus,
  REGISTERED_EVENTS_MAP,
  UNREGISTERED_EVENTS_MAP,
  eventProperties,
} from './constants'
import * as t from './types'

export { name } from './constants'

export const initialState = {
  idfaSentAt: undefined,
  isSendingDebugInfo: false,
  isSendingRegisteredEvents: false,
  isSendingUnregisteredEvents: false,
  kochavaAttributionStatus: KochavaAttributionStatus.UNEVALUATED,
  kochavaLoggedEvents: [],
  kochavaEventBuffer: [],
  registeredErrorCount: 0,
  registeredEvents: [],
  registeredEventsQueued: [],
  reportId: '',
  sessionCounts: {},
  totalCaptchasShownCount: 0,
  unregisteredErrorCount: 0,
  unregisteredEvents: [],
  unregisteredEventsQueued: [],
}

const persistKeys = [
  'idfaSentAt',
  'registeredEvents',
  'unregisteredEvents',
  'kochavaAttributionStatus',
  'kochavaLoggedEvents',
  'kochavaEventBuffer',
]

const protectKeys = [
  'idfaSentAt',
  'kochavaAttributionStatus',
  'kochavaLoggedEvents',
  'kochavaEventBuffer',
]

export const persistence = {
  in: pick(persistKeys),
  out: identity,
  clear: identity,
  protect: protectKeys,
}

const fifo1000 = queue(1000)
const fifo10 = queue(10)

const validateEvent = (event) => {
  if (config.reduxLogger?.eventValidation !== true) {
    return
  }

  if (
    !(REGISTERED_EVENTS_MAP[event.name] || UNREGISTERED_EVENTS_MAP[event.name])
  ) {
    // eslint-disable-next-line no-console
    console.warn(new Error(`Unknown event: ${event.name}`))
    return
  }

  if (!Array.isArray(eventProperties[event.name])) {
    // eslint-disable-next-line no-console
    console.warn(`Analytics: event not yet in analytics-devdocs: ${event.name}`)
    return
  }

  const extras = Object.keys(event.extra ?? {}).sort()
  const params = eventProperties[event.name]

  const missingParameters = params.filter((prop) => !extras.includes(prop))

  if (missingParameters.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `Analytics: missing parameters for ${
        event.name
      }: ${missingParameters.join(', ')}`
    )
  }

  const unknownParameters = extras.filter((prop) => !params.includes(prop))

  if (unknownParameters.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `Analytics: unknown parameters for ${
        event.name
      }: ${unknownParameters.join(', ')}`
    )
  }
}

export const getStateKeysByType = (type) => {
  const isRegisterType = type === EVENT_TYPE.REGISTERED

  if (isRegisterType) {
    return {
      errorCount: 'registeredErrorCount',
      events: 'registeredEvents',
      isSending: 'isSendingRegisteredEvents',
      queued: 'registeredEventsQueued',
    }
  }

  return {
    errorCount: 'unregisteredErrorCount',
    events: 'unregisteredEvents',
    isSending: 'isSendingUnregisteredEvents',
    queued: 'unregisteredEventsQueued',
  }
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.ADD_EVENT:
    case t.ADD_EVENT_DEBOUNCED: {
      const type = REGISTERED_EVENTS_MAP[action.payload.name]
        ? EVENT_TYPE.REGISTERED
        : UNREGISTERED_EVENTS_MAP[action.payload.name]
        ? EVENT_TYPE.UNREGISTERED
        : undefined

      if (__DEV__) {
        validateEvent(action.payload)
      }

      if (!type) {
        return state
      }

      const keys = getStateKeysByType(type)

      return {
        ...state,
        [keys.events]: fifo1000(action.payload, state[keys.events]),
        sessionCounts: {
          ...state.sessionCounts,
          [action.payload.name]: state.sessionCounts[action.payload.name]
            ? state.sessionCounts[action.payload.name] + 1
            : 1,
        },
      }
    }

    case t.ADD_KOCHAVA_EVENT: {
      return {
        ...state,
        kochavaEventBuffer: fifo10(action.payload, state.kochavaEventBuffer),
        kochavaLoggedEvents: [
          ...state.kochavaLoggedEvents,
          action.payload.name,
        ],
      }
    }

    case t.CHANGE_KOCHAVA_ATTRIBUTION_STATUS: {
      return {
        ...state,
        kochavaAttributionStatus: action.payload,
      }
    }

    case t.CLEAR_KOCHAVA_EVENT_BUFFER: {
      return {
        ...state,
        kochavaEventBuffer: [],
      }
    }

    case t.SEND_DEBUG_INFO:
      return {
        ...state,
        isSendingDebugInfo: true,
        reportId: '',
      }

    case t.SEND_DEBUG_INFO_ERROR:
      return {
        ...state,
        isSendingDebugInfo: false,
        reportId: '',
      }

    case t.SEND_DEBUG_INFO_SUCCESS:
      return {
        ...state,
        isSendingDebugInfo: false,
        reportId: action.payload.reportId,
      }

    case t.SEND_EVENTS: {
      const keys = getStateKeysByType(action.payload.type)

      return {
        ...state,
        [keys.isSending]: true,
        [keys.events]: state[keys.events].slice(EVENT_SEND_BATCH_SIZE),
        [keys.queued]: state[keys.events].slice(0, EVENT_SEND_BATCH_SIZE),
      }
    }

    case t.SEND_EVENTS_ERROR: {
      const keys = getStateKeysByType(action.payload.type)

      return {
        ...state,
        [keys.errorCount]: state[keys.errorCount]
          ? state[keys.errorCount] + 1
          : 1,
        [keys.isSending]: false,
        [keys.events]:
          state[keys.errorCount] > 20 || action.payload.shouldClearEvents
            ? state[keys.events]
            : [...state[keys.queued], ...state[keys.events]],
        [keys.queued]: [],
      }
    }

    case t.SEND_EVENTS_SUCCESS: {
      const keys = getStateKeysByType(action.payload.type)

      return {
        ...state,
        [keys.errorCount]: 0,
        [keys.isSending]: false,
        [keys.queued]: [],
      }
    }

    case t.SET_IDFA_SENT_AT:
      return { ...state, idfaSentAt: action.meta.createdAt }

    case t.SET_EVENT_HAS_USED_CURRENT_APP_OPEN_WITH_INTENT:
      return {
        ...state,
        eventHasUsedCurrentAppOpenWithIntent: {
          ...state.eventHasUsedCurrentAppOpenWithIntent,
          [action.payload.eventName]: action.payload.value,
        },
      }

    case t.RESET_EVENT_HAS_USED_CURRENT_APP_OPEN_WITH_INTENT:
      return {
        ...state,
        eventHasUsedCurrentAppOpenWithIntent: undefined,
      }

    default:
      return state
  }
}
