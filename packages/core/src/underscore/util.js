export const selectEnv = (options) => {
  if (__DEV__ && typeof options.development !== 'undefined') { return options.development } // prettier-ignore
  if (__DEV__ && typeof options.dev !== 'undefined') { return options.dev } // prettier-ignore
  if (__INTERNAL__ && typeof options.internal !== 'undefined') { return options.internal } // prettier-ignore
  if (typeof options.prod !== 'undefined') { return options.prod } // prettier-ignore
  return options.production
}

export const diff = (o1, o2) =>
  Object.keys(o2).reduce((diff, key) => {
    if (o1[key] === o2[key]) {
      return diff
    }

    return {
      ...diff,
      [key]: o2[key],
    }
  }, {})

/** returns the key of a given value from the given object
 * @params {object: {[key]: T}} the object to search through
 * @params {T} the value to search for
 */
export const getKeyByValue = (obj, value) =>
  Object.keys(obj).find((key) => obj[key] === value)
