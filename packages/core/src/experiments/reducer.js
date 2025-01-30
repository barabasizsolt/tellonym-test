import { identity, mergeDeepRight, mergeRight, pick } from 'ramda'
import semver from 'semver'
import * as t from './types'

export { name } from './constants'

/**
 * Queued experiments are applied on app start inside core/src/store/configureRootReducer.js
 */
export const initialState = {
  active: {},
  additionalListItems: {},
  isConfirming: false,
  isFromQueue: false,
  isRefreshing: false,
  local: undefined,
  queued: {},
}

const persistKeys = ['active', 'additionalListItems', 'local', 'queued']

export const persistence = {
  in: pick(persistKeys),
  out: identity,
  clear: identity,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.ADD_TO_LOCAL_EXPERIMENT_CONFIG: {
      const { key, value } = action.payload

      return mergeDeepRight(state, {
        local: {
          config: { [key]: value },
        },
      })
    }

    case t.CONFIRM:
      return mergeRight(state, {
        isConfirming: true,
      })

    case t.CONFIRM_ERROR:
      return mergeRight(state, {
        isConfirming: false,
      })

    case t.CONFIRM_SUCCESS:
      return mergeDeepRight(state, {
        isConfirming: false,
        active: {
          triggers: [],
        },
      })

    case t.REFRESH:
      return mergeRight(state, {
        isRefreshing: true,
      })

    case t.REFRESH_ERROR:
      return mergeRight(state, {
        isRefreshing: false,
      })

    case t.REFRESH_SUCCESS: {
      const isAppVersionMatch =
        typeof action.payload.appVersionRange !== 'string' ||
        semver.satisfies(
          action.meta.setup.appVersion,
          action.payload.appVersionRange
        )

      const isAuthenticating = action.meta.route.name.startsWith('ScreenAuth')
      const isNew = isAuthenticating || action.payload.id !== state.active.id

      if (isNew && action.payload.shouldApplyOnRestart) {
        /**
         * If the config should be applied on restart it is queued and handled by the configureRootReducer function in tellonym/core.
         * The base config is applied anyway, since it is used to make old experiments the default behavior before the experiment code is removed.
         */
        return {
          ...state,
          isRefreshing: false,
          active: {
            ...state.active,
            config: {
              ...state.active.config,
              ...action.payload.base,
            },
          },
          queued: {
            id: action.payload.id,
            config: {
              ...action.payload.base,
              ...(isAppVersionMatch && action.payload.config),
            },
            name: action.payload.name,
            triggers: !isNew
              ? state.active.triggers
              : action.payload.triggers?.data ?? [],
          },
        }
      }

      return {
        ...state,
        isRefreshing: false,
        active: {
          id: action.payload.id,
          config: {
            ...action.payload.base,
            ...(isAppVersionMatch && action.payload.config),
          },
          name: action.payload.name,
          triggers:
            isNew || action.meta.forceTriggerUpdate // We use force update for the logout case to handle triggers like REGISTER_SUCCESS again
              ? action.payload.triggers?.data ?? []
              : state.active.triggers,
        },
        queued: {},
      }
    }

    case t.REMOVE_FROM_LOCAL_EXPERIMENT_CONFIG: {
      const { key } = action.payload

      // eslint-disable-next-line no-unused-vars
      const { [key]: remove, ...config } = state.local?.config ?? {}

      if (!config || Object.keys(config).length === 0) {
        return mergeRight(state, {
          local: undefined,
        })
      }

      return {
        ...state,
        local: {
          ...state.local,
          config,
        },
      }
    }

    case t.REMOVE_LOCAL_EXPERIMENT:
      return mergeRight(state, {
        local: undefined,
      })

    case t.RESET:
      return initialState

    case t.SET_ADDITIONAL_LIST_ITEMS:
      return mergeRight(state, {
        additionalListItems: action.payload,
      })

    default:
      return state
  }
}
