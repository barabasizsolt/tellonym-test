import { getIsLoggedIn } from '@tellonym/core/app/selectors'
import { events } from '@tellonym/core/events'
import {
  LOGOUT_SUCCESS,
  REMOVE_ACCOUNT_SUCCESS,
} from '@tellonym/core/profile/types'
import { AUTHENTICATION_COMPLETED } from '@tellonym/core/user/types'
import { PERSIST_REHYDRATE } from '@tellonym/redux-offline/lib/constants'
import { eventChannel } from 'redux-saga'
import { put, select, spawn, take } from 'redux-saga/effects'
import { config } from '../../config'
import { _ } from '../common'

const load = function* load() {
  try {
    /**
     * App is considered loaded when persisted data is loaded into state.
     */
    yield take(PERSIST_REHYDRATE)
    const isLoggedIn = yield select(getIsLoggedIn)
    yield put(events.load({ isLoggedIn }))
  } catch (e) {
    _.capture(e)
  }
}

const ready = function* ready() {
  try {
    /**
     * App is considered ready when app is mounted, rehydrated and
     * the navigation ref is available.
     */
    yield events.ensure([events.LOAD, events.MOUNT])
    yield put(events.ready())
  } catch (e) {
    _.capture(e)
  }
}

const auth = function* auth() {
  try {
    while (true) {
      yield take([events.READY, events.UNAUTH])

      const isLoggedIn = yield select(getIsLoggedIn)
      const isDelayed = !isLoggedIn

      if (!isLoggedIn) {
        yield take(AUTHENTICATION_COMPLETED)
      }

      yield put(events.auth({ isDelayed }))
    }
  } catch (e) {
    _.capture(e)
  }
}

const unauth = function* unauth() {
  try {
    while (true) {
      yield take([LOGOUT_SUCCESS, REMOVE_ACCOUNT_SUCCESS])
      yield put(events.unauth({}))
    }
  } catch (e) {
    _.capture(e)
  }
}

const update = function* update() {
  try {
    const channel = eventChannel((emitter) => {
      const interval = setInterval(() => emitter({}), config.api.updateInterval)

      return () => {
        clearInterval(interval)
      }
    })

    const signalCheckUpdates = function* signalCheckUpdates() {
      yield put(events.checkUpdates({}))
    }

    while (true) {
      yield take(channel)
      yield spawn(events.has, events.AUTH, signalCheckUpdates)
    }
  } catch (e) {
    _.capture(e)
  }
}

/**
 * This object maps event types to their respective event factories.
 * A factory dispatches one or multiple event actions based on certain conditions.
 */
export const eventFactory = {
  [events.LOAD]: [load],
  [events.READY]: [ready],
  [events.AUTH]: [auth],
  [events.UNAUTH]: [unauth],
  [events.UPDATE]: [update],
}
