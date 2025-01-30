import {
  getAccessToken,
  getAccount,
  getAccounts,
  getActiveUserId,
  getIsLoggedIn,
  getState,
} from '@tellonym/core/app/selectors'
import { isNil, prop, propOr } from 'ramda'
import { createSelector } from 'reselect'
import { config } from '../../config'
import { moment } from '../common/locales/moment'

const name = '__app__'

export {
  getAccessToken,
  getAccount,
  getAccounts,
  getActiveUserId,
  getIsLoggedIn,
  getState,
}

const isSameOrAfter = (date) => moment().isSame(date) || moment().isAfter(date)

export const getAreAnalyticsEnabled = createSelector(
  getState,
  prop('areAnalyticsEnabled')
)

export const getNotAnonymousHintBannerHasBeenShownAt = createSelector(
  getState,
  prop('notAnonymousHintBannerHasBeenShownAt')
)

export const getShouldShowHintBanner = createSelector(
  getNotAnonymousHintBannerHasBeenShownAt,
  (notAnonymousHintBannerHasBeenShownAt) => {
    const remindDate = moment(notAnonymousHintBannerHasBeenShownAt).add(
      config.components.WriteTell.daysMinToRemind,
      'd'
    )

    const shouldShowHintBanner =
      isNil(notAnonymousHintBannerHasBeenShownAt) || isSameOrAfter(remindDate)

    return shouldShowHintBanner
  }
)

export const getIsSigningUp = createSelector(
  getAccount,
  propOr(false, 'isSigningUp')
)

export const getStaticFriendsCount = (state) => state[name].staticFriendsCount
