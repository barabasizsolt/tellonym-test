import { mergeLeft } from 'ramda'
import { createLogger as reduxLogger } from 'redux-logger'

export const LOG_LEVEL = {
  ALL: 'ALL',
  MODULE: 'MODULE',
  NONE: 'NONE',
  TYPE: 'TYPE',
}

export const createLogger = ({
  actionType,
  logLevel = LOG_LEVEL.ALL,
  module,
  ...config
}) =>
  reduxLogger(
    mergeLeft(config, {
      collapsed: [LOG_LEVEL.ALL, LOG_LEVEL.MODULE].includes(logLevel),
      diff: [LOG_LEVEL.TYPE].includes(logLevel),
      duration: true,
      predicate: (getState, action) => {
        switch (logLevel) {
          case LOG_LEVEL.ALL:
            return true
          case LOG_LEVEL.MODULE:
            return action.type.startsWith(`${module}/`)
          case LOG_LEVEL.NONE:
            return false
          case LOG_LEVEL.TYPE:
            return action.type === actionType
          default:
            return true
        }
      },
    })
  )
