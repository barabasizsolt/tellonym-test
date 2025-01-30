import { identity } from 'ramda'

const ctx = new WeakMap()

/**
 * Clears an event listener.
 * @param {Function|{remove: Function}} listener EmitterSubscription
 */
export const clearListener = (listener) => {
  if (typeof listener === 'function') {
    listener()
  } else if (
    typeof listener === 'object' &&
    typeof listener.remove === 'function'
  ) {
    listener.remove()
  }
}

/**
 * Clears multiple event listeners.
 * @param {Array<Function|{remove: Function}>} listeners
 */
export const clearListeners = (listeners) => {
  for (const listener of listeners) {
    clearListener(listener)
  }
}

/**
 * Maps method names to their respective setter and clear functions.
 */
const methodConfigs = [
  ['requestAnimationFrame', requestAnimationFrame, cancelAnimationFrame],
  ['setImmediate', global.setImmediate, global.clearImmediate],
  ['setInterval', global.setInterval, global.clearInterval],
  ['setListener', identity, clearListener],
  ['setTimeout', global.setTimeout, global.clearTimeout],
]

class ContextListeners {
  constructor() {
    this._$state = {}

    for (const [name, setter] of methodConfigs) {
      this._$state[name] = new Map()

      /**
       * Sets a listener for a category.
       * If a string is passed as a first parameter, this string becomes a key
       * and can be used to remove the listener.
       * A key can be used once for each category.
       * @param  {...any} params
       * @returns {ContextListeners}
       */
      this[name] = function (...params) {
        const [key, handler, ms] =
          typeof params[0] === 'string' ? params : [Date.now()].concat(params)

        const handlers = Array.isArray(handler) ? handler : [handler]

        for (const handler of handlers) {
          if (handler) {
            this._$state[name].set(key, setter(handler, ms))
          }
        }

        return this
      }
    }

    /**
     * Removes listeners for a specific key of all categories.
     * @param {string} key
     * @returns {ContextListeners}
     */
    this.remove = function remove(key) {
      for (const [name, , clear] of methodConfigs) {
        if (this._$state[name].has(key)) {
          const value = this._$state[name].get(key)
          clear(value)
          this._$state[name].delete(key)
        }
      }

      return this
    }
  }
}

/**
 * Returns ContextListeners object for a context and initializes it beforehand if necessary.
 * When a context (e.g. React.Component) is destroyed, so is its WeakMap entry.
 *
 * class Component extends React.Component {
 *   componentDidMount() {
 *     const ctx = events.getContextListeners(this)
 *
 *     ctx
 *       .setImmediate(() => {
 *         console.log('tick')
 *         ctx.setInterval('tick', () => console.log('tick'), 2000)
 *       })
 *       .setTimeout(() => {
 *         console.log('tack')
 *         ctx.setInterval('tack', () => console.log('tack'), 2000)
 *       }, 1000)
 *       .setListener(
 *         AppState.addEventListener('change', appState => {
 *           if (appState.match(/inactive|background/)) {
 *             ctx.remove('tick')
 *             ctx.remove('tack')
 *           }
 *         })
 *       )
 *   }
 *
 *   componentWillUnmount() {
 *     events.clearContextListeners(this)
 *   }
 * }
 * @param {object} context
 * @returns {ContextListeners} ctx
 */
export const getContextListeners = function getContextListeners(context) {
  if (!ctx.has(context)) {
    ctx.set(context, new ContextListeners())
  }

  return ctx.get(context)
}

/**
 * Clears all listeners for a context.
 * @param {object} context
 */
export const clearContextListeners = function clearContextListeners(context) {
  if (!ctx.has(context)) {
    return
  }

  const contextListeners = ctx.get(context)

  for (const [name, , clear] of methodConfigs) {
    for (const value of contextListeners._$state[name].values()) {
      clear(value)
    }
    contextListeners._$state[name].clear()
  }

  ctx.delete(context)
}
