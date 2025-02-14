import { createTransform } from 'redux-persist'

const createTransformer = (type) => (transxMap) => (state, key) => {
  if (transxMap[key] && typeof transxMap[key][type] === 'function') {
    return transxMap[key][type](state)
  }

  return state
}

const createTransformerIn = createTransformer('in')
const createTransformerOut = createTransformer('out')

/**
 * A module is whitelisted for redux-persist if persistence.in or persistence.out is defined.
 * persistence.in is applied before writing the state.
 * persistence.out is applied after reading the state.
 * persistence.clear is called when authentication is removed, independent of the whitelist.
 * @param {Array<object>} modules the array of modules with a reducer and optionally persistence.
 * @returns {object} persistOptions to be passed with redux-offline config.
 */
export const getPersistOptions = (modules) => {
  const moduleTransformMap = modules.reduce((acc, module) => {
    if (
      typeof module.persistence?.in === 'function' ||
      typeof module.persistence?.out === 'function'
    ) {
      acc[module.name] = module.persistence
    }
    return acc
  }, {})

  return {
    transforms: [
      createTransform(
        createTransformerIn(moduleTransformMap),
        createTransformerOut(moduleTransformMap)
      ),
    ],
    whitelist: Object.keys(moduleTransformMap),
  }
}
