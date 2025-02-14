const rndNum = Math.random()

/**
 * Takes a rate (a number between 0 and 1), an optional payload which defaults to true and
 * an optional fallback which defaults to false.
 * The payload is returned, or in case of a function executed, if the rate is greater than a random number.
 * The fallback is returned, or in case of a function executed, if the rate is smaller than a random number.
 * The random number is defined on app start and the same for the whole session. This function is pure.
 *
 * @example sample(0.5, () => console.log('always logs or never logs, with a 50/50 chance for each session'))
 *
 * @param {Number} rate - a number between 0 and 1
 * @param {*} [payload] - a function to be called or a value to be returned; defaults to true
 * @param {*} [fallback] - a function to be called or a value to be returned; defaults to false
 * @returns {any}
 */
export const sample = (rate, payload = true, fallback = false) => {
  const value = rate > rndNum ? payload : fallback
  return typeof value === 'function' ? value() : value
}

/**
 * Takes a rate (a number between 0 and 1), an optional payload which defaults to true and
 * an optional fallback which defaults to false.
 * The payload is returned, or in case of a function executed, if the rate is greater than a random number.
 * The fallback is returned, or in case of a function executed, if the rate is smaller than a random number.
 * The random number is recalculated on each call to chance. This function is therefore not pure.
 *
 * @example chance(0.25, () => console.log('logs 25% of the time'), () => console.log('logs 75% of the time''))
 *
 * @param {Number} rate - a number between 0 and 1
 * @param {*} [payload] - a function to be called or a value to be returned; defaults to true
 * @param {*} [fallback] - a function to be called or a value to be returned; defaults to false
 * @returns {any}
 */
export const chance = (rate, payload = true, fallback = false) => {
  const value = rate > Math.random() ? payload : fallback
  return typeof value === 'function' ? value() : value
}
