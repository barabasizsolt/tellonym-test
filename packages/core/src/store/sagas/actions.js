import { call, spawn } from 'redux-saga/effects'

/**
 * Merges module configs for ease of use.
 * @param {Array<object>} modules Namespaced module sagas with optional actionHandler config.
 * @returns {Array<Array<string,Array<Function>>>} actionTypeConfigs
 */
const getActionTypeConfigs = (modules) =>
  Object.entries(
    modules.reduce((acc, module) => {
      if (module.actionHandler) {
        const actionTypeConfigs = Object.entries(module.actionHandler)

        for (const [type, actionHandlerConfig] of actionTypeConfigs) {
          acc[type] = acc[type] ?? []
          acc[type].push(actionHandlerConfig)
        }
      }

      return acc
    }, {})
  )

/**
 * Spawns all sagas based on their actionHandlerConfig.
 * @param {Array<Array<string,Array<Function>>>} actionTypeConfigs Namespaced module sagas with optional actionHandler config.
 * @param {object} rootActionHandler Action type to action handler config map.
 */
const spawnActionHandlers = function* spawnActionHandlers(
  actionTypeConfigs,
  rootActionHandler = {}
) {
  for (const [type, config] of Object.entries(rootActionHandler)) {
    const [effect, ...handlers] = config

    for (const handler of handlers) {
      yield spawn(effect, type, handler)
    }
  }

  for (const [type, configs] of actionTypeConfigs) {
    for (const [effect, ...handlers] of configs) {
      for (const handler of handlers) {
        yield spawn(effect, type, handler)
      }
    }
  }
}

/**
 * Utility saga that spawns sagas for modules based on their actionHandler.
 * A Module consists of all of its named sagas.js exports.
 * This saga manages the actionHandler exports.
 *
 * export const actionHandler = {
 *   [t.REFRESH_SUCCESS]: [safeEffects.takeLatest, refreshSuccess]
 * }
 *
 * modules [
 *   module
 * ]
 *
 * module {
 *   actionHandler
 * }
 *
 * actionHandler {
 *   [action.type]: actionHandlerConfig
 * }
 *
 * actionHandlerConfig [
 *   effect,
 *   saga,
 *   ...sagas
 * ]
 *
 * actionTypeConfigs [
 *   [action.type, actionHandlerConfig],
 * ]
 * @param {Array<object>} modules Namespaced module sagas with optional actionHandler config.
 * @param {object} rootActionHandler Action type to action handler config map.
 */
export const subscribe = function* subscribe(modules, rootActionHandler) {
  yield call(
    spawnActionHandlers,
    getActionTypeConfigs(modules),
    rootActionHandler
  )
}
