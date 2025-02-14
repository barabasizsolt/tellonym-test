import {
  all,
  call,
  select as selectEffect,
  spawn,
  take,
} from 'redux-saga/effects'
import { safeEffects } from '../sagas'
import { name } from './constants'
import * as t from './types'

const eventTypes = Object.values(t)

/**
 * Much like redux-saga select effect. But takes event types as an argument.
 * @param {string|Array<string>} [condition] Either an event type or an array of event types.
 * @return {undefined|object|Array<object>} Event state.
 */
export const select = function* select(condition) {
  const state = yield selectEffect()

  if (typeof condition === 'string') {
    return state[name][condition]
  }

  if (Array.isArray(condition)) {
    return condition.map((type) => state[name][type])
  }

  return state[name]
}

/**
 * Calls the generator function only if all requirements are met when calling ensure.
 * @param {string|Array<string>} condition Either an event type or an array of event types.
 * @return {Array<string>} Event types that haven't occurred yet.
 */
const getUnmetRequirements = function* getUnmetRequirements(condition) {
  const eventState = yield select()
  const types = Array.isArray(condition) ? condition : [condition]
  return types.filter((type) => !eventState[type])
}

/**
 * Calls the generator function only if all requirements are met when calling ensure.
 * @param {string|Array<string>} condition Either an event type or an array of event types.
 * @param {Function|Generator} callback Generator function, only called if all requirements are met.
 * @param {...*} [var_args] Arguments are passed to the generator function.
 */
export const has = function* has(condition, saga, ...params) {
  const unmetRequirements = yield call(getUnmetRequirements, condition)

  if (unmetRequirements.length === 0) {
    yield call(saga, ...params)
  }
}

/**
 * Calls the generator function only if all requirements are missing when calling ensure.
 * The opposite behaviour of has.
 * @param {string|Array<string>} condition Either an event type or an array of event types.
 * @param {Function|Generator} callback Only called if all requirements are met.
 * @param {...*} [var_args] Arguments are passed to the generator function.
 */
export const not = function* not(condition, saga, ...params) {
  const unmetRequirements = yield call(getUnmetRequirements, condition)
  const isArray = Array.isArray(condition)

  if (
    isArray
      ? condition.length === unmetRequirements.length
      : unmetRequirements.length === 1
  ) {
    yield call(saga, ...params)
  }
}

/**
 * Calls the first function if all requirements are met or the second function otherwise.
 * @param {string|Array<string>} condition Either an event type or an array of event types.
 * @param {Function|Generator} either Only called if all requirements are met.
 * @param {Function|Generator} or Only called if not all requirements are met.
 * @param {...*} [var_args] Arguments passed to either/or.
 */
export const ifElse = function* ifElse(condition, either, or, ...params) {
  const unmetRequirements = yield call(getUnmetRequirements, condition)

  if (unmetRequirements.length) {
    yield call(or, ...params)
  } else {
    yield call(either, ...params)
  }
}

/**
 * This helper will block the parent saga until all requirements are met.
 * If a generator function is passed as a second argument, it is called as soon as all requirements are met.
 * @param {string|Array<string>} condition Either an event type or an array of event types.
 * @param {Function|Generator} [callback] Only called if all requirements are met.
 * @param {...*} [var_args] Arguments passed to the generator function callback.
 */
export const ensure = function* ensure(condition, saga, ...params) {
  const unmetRequirements = yield call(getUnmetRequirements, condition)

  if (unmetRequirements.length === 1) {
    yield take(unmetRequirements[0])
  } else if (unmetRequirements.length > 1) {
    yield all(unmetRequirements.map((type) => take(type)))
  }

  if (saga) {
    const eventState = yield select(condition)
    yield call(saga, ...params, eventState)
  }
}

/**
 * Collects eventHandlerConfig arrays for each event type.
 * @param {Array<object>} modules Namespaced module sagas with optional eventHandler config.
 * @param {string} eventType Event type.
 */
const getModuleHandlersByType = (modules, type) =>
  modules.reduce(
    (acc, module) =>
      module.eventHandler?.[type] ? acc.concat(module.eventHandler[type]) : acc,
    []
  )

/**
 * Merges module and factory configs for ease of use.
 * @returns {Array<Array<string,Array<Function>>>} eventTypeConfigs, transformed module data for iteration.
 */
const getEventTypeConfigs = (modules, eventFactory, rootEventHandler) =>
  eventTypes.map((type) => [
    type,
    [
      eventFactory[type] ?? [],
      rootEventHandler[type] ?? [safeEffects.takeEvery],
      getModuleHandlersByType(modules, type),
    ],
  ])

/**
 *
 * Spawns all configured event handlers.
 * @param {Array<Array<EventType,Array<Function>>>} eventTypeConfigs Namespaced module sagas with optional eventHandler config.
 */
const spawnEventHandlers = function* spawnEventHandlers(eventTypeConfigs) {
  for (const [
    type,
    [factories, [effect, priorityHandler, ...params], moduleHandlers],
  ] of eventTypeConfigs) {
    if (factories.length) {
      yield all(factories.map((factory) => spawn(factory)))
    }

    if (!priorityHandler && moduleHandlers.length === 0) {
      continue
    }

    const handleEvent = function* handleEvent(event) {
      if (priorityHandler) {
        // Calls optional priorityHandler first and only then spawns module handlers.
        yield call(priorityHandler, ...params, event)
      }

      if (moduleHandlers.length) {
        yield all(moduleHandlers.map((handler) => spawn(handler, event)))
      }
    }

    yield spawn(effect, type, handleEvent)
  }
}

/**
 * Utility saga that spawns sagas for modules based on their eventHandler configuration.
 * A Module consists of all of its named sagas.js exports.
 * The saga manages the eventHandler exports.
 * Each event type used by a module should also have a rootEventHandlerConfig.
 * The module sagas only execute after the prioritySaga finished.
 * The effect is applied to the prioritySaga, so they both influence all module sagas.
 *
 * export const eventHandler = {
 *   [event.RESUME]: [refresh]
 * }
 *
 * modules [
 *   module
 * ]
 *
 * module {
 *   eventHandler
 * }
 *
 * eventHandler {
 *   [event.type]: eventTypeConfig
 * }
 *
 * eventTypeConfig [
 *   saga,
 *   ...sagas
 * ]
 *
 * rootEventHandler {
 *   [event.type]: rootEventHandlerConfig
 * }
 *
 * rootEventHandlerConfig [
 *   effect,
 *   prioritySaga,
 *  ...params
 * ]
 *
 * eventFactory {
 *   [event.type]: saga
 * }
 *
 * factories [
 *   saga
 * ]
 *
 * moduleHandlers [
 *   saga
 * ]
 *
 * eventTypeConfigs [
 *   [event.type, [factories, rootEventHandlerConfig, moduleHandlers]],
 * ]
 *
 * @param {Array<object>} modules Namespaced module sagas with optional eventHandler config.
 * @param {object} eventFactory Event type to event factories map.
 * @param {object} rootEventHandler Event type to event handler config map.
 */
export const subscribe = function* subscribe(
  modules,
  eventFactory,
  rootEventHandler
) {
  yield call(
    spawnEventHandlers,
    getEventTypeConfigs(modules, eventFactory, rootEventHandler)
  )
}
