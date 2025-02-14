import * as effects from 'redux-saga/effects'

/**
 * Like Reux-Saga's takeEvery, but detaches the saga from it's parent.
 * @param {pattern} type
 * @param {Function|Generator} handler
 */
export function* takeEvery(type, handler) {
  while (true) {
    const action = yield effects.take(type)
    yield effects.spawn(handler, action)
  }
}

/**
 * Like Reux-Saga's takeLeading, but detaches the saga from it's parent.
 * @param {pattern} type
 * @param {Function|Generator} handler
 */
export function* takeLeading(type, handler) {
  let isActive = false

  while (true) {
    const action = yield effects.take(type)

    if (isActive) {
      continue
    }

    yield effects.spawn(function* takeLeadingActionHandler() {
      isActive = true
      yield effects.call(handler, action)
      isActive = false
    })
  }
}

/**
 * Like Reux-Saga's takeLatest, but detaches the saga from it's parent.
 * @param {pattern} type
 * @param {Function|Generator} handler
 */
export function* takeLatest(type, handler) {
  let lastTask

  while (true) {
    const action = yield effects.take(type)

    if (lastTask) {
      yield effects.cancel(lastTask)
    }

    yield effects.spawn(function* takeLatestActionHandler() {
      lastTask = yield effects.fork(handler, action)
    })
  }
}
