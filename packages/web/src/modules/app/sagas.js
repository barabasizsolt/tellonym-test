import { events } from '@tellonym/core/events'
import { LOGOUT_SUCCESS } from '@tellonym/core/profile/types'
import { safeEffects } from '@tellonym/core/sagas'
import { LOGIN_SUCCESS } from '@tellonym/core/user/types'
import { put, select } from 'redux-saga/effects'
import { setStaticFriendsCount } from './actions'
import { getStaticFriendsCount } from './selectors'

const handleStaticFriendsCount = function* (action) {
  const staticFriendsCount = yield select(getStaticFriendsCount)

  if (
    typeof staticFriendsCount === 'undefined' ||
    [LOGIN_SUCCESS, LOGOUT_SUCCESS].includes(action.type)
  ) {
    yield put(setStaticFriendsCount(Math.floor(Math.random() * 6) + 3))
  }
}

export const eventHandler = {
  [events.LOAD]: [handleStaticFriendsCount],
}

export const actionHandler = {
  [LOGIN_SUCCESS]: [safeEffects.takeLatest, handleStaticFriendsCount],
  [LOGOUT_SUCCESS]: [safeEffects.takeLatest, handleStaticFriendsCount],
}
