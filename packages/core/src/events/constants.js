import * as t from './types'

export const name = 'events'
export const eventTypes = Object.values(t)
export const eventTypeMap = eventTypes.reduce(
  (acc, type) => ({
    ...acc,
    [type]: type,
  }),
  {}
)

export const RESUME_TIMEOUT_DURATION = 2 * 60 * 1000
export const SESSION_TIMEOUT_DURATION = 10 * 60 * 1000
