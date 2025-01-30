import { PERSIST_REHYDRATE } from '@tellonym/redux-offline/lib/constants'
import { mergeDeepRight } from 'ramda'
import { combineReducers } from 'redux'
import { LOGOUT_SUCCESS, REMOVE_ACCOUNT_SUCCESS } from '../profile/types'
import { ABORT_REGISTRATION_SUCCESS } from '../user/types'

const applyExperiments = (state) => {
  if (typeof state.experiments?.queued?.id !== 'undefined') {
    state.experiments.active = { ...state.experiments.queued }
    state.experiments.queued = {}
    state.experiments.isFromQueue = true
  } else if (state.experiments) {
    state.experiments.isFromQueue = false
  }

  return state
}

/**
 * Clears the state of a module.
 * Resets state to initial state by default.
 * If module has a clear function, it will be used instead.
 * If module has no clear function but a protect array,
 * the state for those keys will be kept when clearState is called.
 * @param {object} state
 * @param {{
 *   initialState: object,
 *   persistence?: {
 *     clear?: (state: object) => object,
 *     protect?: string[],
 *   }
 * }} module
 * @returns {object} cleared state
 */
const clearState = (state, module, action) => {
  const substate = state[module.name]

  if (typeof module.persistence?.clear === 'function') {
    return module.persistence.clear(substate, action)
  }

  if (Array.isArray(module.persistence?.protect)) {
    return Object.keys(substate).reduce((acc, key) => {
      if (module.persistence.protect.includes(key)) {
        return { ...acc, [key]: substate[key] }
      }

      return acc
    }, module.initialState)
  }

  return module.initialState
}

export const configureRootReducer = ({ modules, migrations, version }) => {
  const appReducer = combineReducers(
    modules.reduce(
      (acc, module) => ({
        ...acc,
        [module.name]: module.reducer,
      }),
      {
        offline: (state = {}) => state,
      }
    )
  )

  const migrate = (state) => {
    if (migrations && version && state.__app__) {
      const currentVersion = state.__app__.storeVersion

      const newerVersions = Object.keys(migrations)
        .sort()
        .filter((v) => v > currentVersion && v <= version)

      if (newerVersions[0]) {
        return newerVersions.reduce(
          (acc, newVersion) => ({
            ...acc,
            ...migrations[newVersion]({
              ...acc,
              __app__: {
                ...acc.__app__,
                storeVersion: newVersion,
              },
            }),
          }),
          state
        )
      }
    }

    return state
  }

  const rootReducer = (state, action) => {
    let newState

    switch (action.type) {
      case PERSIST_REHYDRATE: {
        newState = applyExperiments(
          migrate(
            modules.reduce(
              (acc, module) => ({
                ...acc,
                [module.name]: action.payload?.[module.name]
                  ? mergeDeepRight(
                      state[module.name],
                      action.payload[module.name]
                    )
                  : state[module.name],
              }),
              state
            )
          )
        )
        break
      }

      case ABORT_REGISTRATION_SUCCESS:
      case LOGOUT_SUCCESS:
      case REMOVE_ACCOUNT_SUCCESS: {
        newState = modules.reduce(
          (acc, module) => ({
            ...acc,
            [module.name]: clearState(state, module, action),
          }),
          state
        )
        break
      }

      default:
        newState = state
    }

    return appReducer(newState, action)
  }

  return rootReducer
}
