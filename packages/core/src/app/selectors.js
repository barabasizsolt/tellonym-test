import { DO_NOT_MUTATE } from '../underscore'
import { name } from './constants'

export const getState = (state) => state[name]

export const getAccounts = (state) =>
  state[name].accounts ?? DO_NOT_MUTATE.EMPTY.OBJECT

export const getActiveUserId = (state) => state[name].accounts?.activeUserId

export const getAccount = (state) =>
  state[name].accounts?.[state[name].accounts?.activeUserId] ??
  DO_NOT_MUTATE.EMPTY.OBJECT

export const getAccessToken = (state) => getAccount(state).accessToken ?? ''

export const getFeatureHint = (state) => state[name].featureHint

export const getHasOpenedAnswerModal = (state) =>
  state[name].hasOpenedAnswerModal

export const getHiddenAnswerIds = (state) =>
  getAccount(state).hiddenAnswerIds ?? DO_NOT_MUTATE.EMPTY.ARRAY

export const getIsLoggedIn = (state) => Boolean(getAccessToken(state))

export const getShouldContactsBeUploaded = (state) =>
  getAccount(state).shouldContactsBeUploaded ?? false
