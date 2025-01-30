import { identity } from 'ramda'
import { LOGOUT_SUCCESS, REMOVE_ACCOUNT_SUCCESS } from '../profile/types'
import { eventTypeMap } from './constants'
import * as t from './types'

export { name } from './constants'

export const initialState = {}

export const persistence = {
  clear: identity,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCCESS:
    case REMOVE_ACCOUNT_SUCCESS:
      return {
        ...state,
        [t.AUTH]: undefined,
        [t.START]: undefined,
        [t.SESSION]: undefined,
      }

    case t.MAIN_NAVIGATOR_AVAILABLE:
      return {
        ...state,
        [t.MAIN_NAVIGATOR_AVAILABLE]: action,
        [t.MAIN_NAVIGATOR_UNAVAILABLE]: undefined,
      }

    case t.MAIN_NAVIGATOR_UNAVAILABLE:
      return {
        ...state,
        [t.INITIAL_SCREEN_INTERACTIVE]: undefined,
        [t.MAIN_NAVIGATOR_AVAILABLE]: undefined,
        [t.MAIN_NAVIGATOR_UNAVAILABLE]: action,
      }

    default: {
      if (eventTypeMap[action.type]) {
        return {
          ...state,
          [action.type]: action,
        }
      }

      return state
    }
  }
}
