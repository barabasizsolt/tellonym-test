/**
 * This file exposes an interface to mutate constants for QA purposes,
 * without the need to write redux boilerplate or toggle redux state.
 * You can add a constant to the defaults object and it will be exposed
 * on the `_.mutable` namespace.
 * Set a corresponding config in ModalMutable.js to make your constant
 * changeable by admins.
 * Changes are not persisted across app starts and a warning is logged
 * every time a changed constant is accessed.
 */
import * as logger from './logger'

const defaults = {}
/**
 * Add your code below this line.
 */
/**
 * Add your code above this line.
 */

const props = Object.keys(defaults)

const mutated = props.reduce((acc, prop) => ({ ...acc, [prop]: false }), {})

const handler = {
  get(obj, prop) {
    if (mutated[prop]) {
      logger.log(`mutable[${prop}]: ${defaults[prop]} => ${obj[prop]}`)
    }

    return Reflect.get(obj, prop)
  },
  set(obj, prop, value) {
    mutated[prop] = defaults[prop] && value !== defaults[prop]

    return Reflect.set(obj, prop, value)
  },
}

export const mutable = new Proxy({ ...defaults }, handler)
