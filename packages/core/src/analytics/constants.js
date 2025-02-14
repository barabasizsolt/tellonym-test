export const name = 'analytics'

export const EVENT_TYPE = {
  REGISTERED: 'registered',
  UNREGISTERED: 'unregistered',
}

export const EVENT_SEND_BATCH_SIZE = 50
export const EVENT_SEND_THRESHOLD_REGISTERED = 20
export const EVENT_SEND_THRESHOLD_UNREGISTERED = 4

export const eventTypes = [EVENT_TYPE.REGISTERED, EVENT_TYPE.UNREGISTERED]

export const REGISTERED_EVENTS_MAP = {}

export const UNREGISTERED_EVENTS_MAP = {}

export const eventProperties = {}

export const KochavaAttributionStatus = {
  UNEVALUATED: 'UNEVALUATED',
  IN_PROGRESS: 'IN_PROGRESS',
  ATTRIBUTED: 'ATTRIBUTED',
  NOT_ATTRIBUTED: 'NOT_ATTRIBUTED',
}
