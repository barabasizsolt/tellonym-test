import { REFRESH_SUCCESS as REFRESH_PROFILE_SUCCESS } from '@tellonym/core/profile/types'
import {
  LOGIN_SUCCESS,
  LOGIN_WITH_APPLE_SUCCESS,
  LOGIN_WITH_GOOGLE_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_WITH_APPLE_SUCCESS,
  REGISTER_WITH_GOOGLE_SUCCESS,
} from '@tellonym/core/user/types'
import { identity, mergeDeepRight } from 'ramda'
import { config } from '../../config'
import * as t from './types'

export const name = '__app__'

export const accountState = {
  accessToken: undefined,
  avatarFileName: undefined,
  userId: undefined,
  username: undefined,
}

export const initialState = {
  accounts: { activeUserId: undefined },
  areAnalyticsEnabled: true,
  notAnonymousHintBannerHasBeenShownAt: undefined,
  storeVersion: config.store.version,
  staticFriendsCount: undefined,
}

export const persistence = {
  in: identity,
  out: identity,
  clear: (state) =>
    mergeDeepRight(state, {
      accounts: {
        [state.accounts.activeUserId]: { accessToken: undefined },
        activeUserId: undefined,
      },
    }),
}

const setAccountState = (state, newState) => ({
  ...state,
  accounts: {
    ...state.accounts,
    [state.accounts.activeUserId]: {
      ...state.accounts[state.accounts.activeUserId],
      ...newState,
    },
  },
})

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case t.SET_ARE_ANALYTICS_ENABLED:
      return {
        ...state,
        areAnalyticsEnabled: action.payload,
      }

    case t.SET_NOT_ANONYMOUS_HINT_BANNER_SHOWN:
      return {
        ...state,
        notAnonymousHintBannerHasBeenShownAt:
          action.payload.notAnonymousHintBannerHasBeenShownAt,
      }

    case t.SET_IS_SIGNING_UP:
      return setAccountState(state, {
        isSigningUp: action.payload,
      })

    case LOGIN_SUCCESS:
    case LOGIN_WITH_APPLE_SUCCESS:
    case LOGIN_WITH_GOOGLE_SUCCESS:
    case REGISTER_SUCCESS:
    case REGISTER_WITH_APPLE_SUCCESS:
    case REGISTER_WITH_GOOGLE_SUCCESS: {
      return {
        ...state,
        accounts: {
          ...state.accounts,
          activeUserId: action.payload.userId,
          [action.payload.userId]: {
            ...accountState,
            ...state.accounts[action.payload.userId],
            accessToken: action.payload.accessToken,
            userId: action.payload.userId,
            /**
             * When signing up with a social sign in, the onboarding is not needed anymore
             */
            isSigningUp:
              state.accounts[action.payload.userId] &&
              state.accounts[action.payload.userId].isSigningUp &&
              action.type === REGISTER_SUCCESS,
          },
        },
      }
    }

    case REFRESH_PROFILE_SUCCESS:
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.payload.id]: {
            ...state.accounts[action.payload.id],
            avatarFileName: action.payload.avatarFileName,
            username: action.payload.username,
          },
        },
      }

    case t.SET_STATIC_FRIENDS_COUNT:
      return {
        ...state,
        staticFriendsCount: action.payload,
      }

    default:
      return state
  }
}
