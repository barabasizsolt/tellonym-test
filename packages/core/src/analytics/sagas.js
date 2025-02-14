/**
 * Legacy code, only used by web.
 */
import { compose, keys, map, slice, toString } from 'ramda'
import { call, put, select, spawn } from 'redux-saga/effects'
import { parseJson } from '../api'
import { getAccessToken } from '../app/selectors'
import { config } from '../config'
import { sendEvents, sendEventsError, sendEventsSuccess } from './actions'
import { EVENT_TYPE } from './constants'
import { getEventState } from './selectors'

const objectToData = (object) => {
  const data = new URLSearchParams()

  const buildFormData = compose(
    map((key) => data.append(key, object[key])),
    keys
  )

  buildFormData(object)

  return data.toString()
}

const getFirstChar = compose(slice(0, 1), toString)

const handleAnalyticsResponse = function* handleAnalyticsResponse({
  type,
  response,
  events,
}) {
  try {
    if (response) {
      const statusCodeCategory = parseInt(getFirstChar(response.status), 10)

      switch (statusCodeCategory) {
        case 2:
        case 3: {
          yield put(sendEventsSuccess({ type, events }))
          break
        }

        case 4:
        case 5: {
          const res = yield parseJson(response)
          const { err = {} } = res
          const { code, errorId, msg = '__empty__' } = err

          if (code) {
            config.underscore.crumb({
              message: msg,
              category: 'saga:handleAnalyticsResponse',
              data: {
                errorId,
              },
            })

            config.underscore.capture(new Error(code))
          }

          yield put(sendEventsError({ type, events }))
          break
        }

        default: {
          yield put(sendEventsError({ type, events }))
          break
        }
      }
    } else {
      yield put(sendEventsError({ type, events }))
    }
  } catch (e) {
    config.underscore.capture(e)
    yield put(sendEventsError({ type, events }))
  }
}

const sendAnalyticsByType = function* sendAnalyticsByType(type) {
  const state = yield select()
  const accessToken = getAccessToken(state)
  const { events } = getEventState(state, { type })

  if (events.length === 0) {
    return
  }

  const body = objectToData({
    accessToken,
    message: JSON.stringify({ data: events }),
  })

  const host = `${config.api.hostAnalytics}/${config.analytics[type].endpoint}`

  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Tellonym-Client': config.api.client,
    },
    body,
  }

  try {
    yield put(sendEvents({ type }))

    const response = yield fetch(host, fetchConfig)

    yield call(handleAnalyticsResponse, { type, response, events })
  } catch (e) {
    yield put(sendEventsError({ type, events }))
  }
}

export const sendEventsToAnalyticsServer =
  function* sendEventsToAnalyticsServer(action) {
    yield spawn(sendAnalyticsByType, EVENT_TYPE.UNREGISTERED, action)
    yield spawn(sendAnalyticsByType, EVENT_TYPE.REGISTERED, action)
  }
