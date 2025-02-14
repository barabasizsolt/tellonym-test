import { curry } from 'ramda'
import { name } from './constants'
import { SESSION } from './types'

/**
 * Curried selector factory to receive state for one or more events.
 * Redux state has to be applied as first or second argument.
 * The other argument has to be an event type or an array of event types.
 * @param {string|Array<string>|object} arg1 event type, array of event types or redux state.
 * @param {string|Array<string>|object} arg2 event type, array of event types or redux state.
 */
export const get = curry((arg1, arg2) => {
  const isSelector = typeof arg1 === 'string' || Array.isArray(arg1)
  const [payload, state] = isSelector ? [arg1, arg2] : [arg2, arg1]

  if (typeof payload === 'string') {
    return state[name][payload]
  }

  if (Array.isArray(payload)) {
    return payload.map((type) => state[name][type])
  }

  if (__DEV__) {
    throw new Error('events.get: invalid parameters.')
  }

  return undefined
})

export const getSessionCreatedAt = (state) =>
  get(SESSION, state)?.meta?.createdAt
