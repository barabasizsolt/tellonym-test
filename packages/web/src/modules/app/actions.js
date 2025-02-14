import { moment } from '../common/locales/moment'
import * as t from './types'

export const setAreAnalyticsEnabled = (payload) => ({
  type: t.SET_ARE_ANALYTICS_ENABLED,
  payload,
})

export const setIsSigningUp = (payload) => ({
  type: t.SET_IS_SIGNING_UP,
  payload,
})

export const setNotAnonymousHintBannerShown = (payload) => ({
  type: t.SET_NOT_ANONYMOUS_HINT_BANNER_SHOWN,
  payload: {
    ...payload,
    notAnonymousHintBannerHasBeenShownAt: moment().format(),
  },
})

export const setStaticFriendsCount = (payload) => ({
  type: t.SET_STATIC_FRIENDS_COUNT,
  payload,
})
