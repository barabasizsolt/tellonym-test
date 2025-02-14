import base64url from 'base64url'
import {
  allPass,
  apply,
  chain,
  complement,
  curry,
  fromPairs,
  isEmpty,
  pick,
  pipe,
  toPairs,
} from 'ramda'
import { config } from '../config'
import * as validations from '../validations'

export { pSBC } from './pSBC'

// Undefined -> String
export const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0, // eslint-disable-line no-bitwise
      v = c == 'x' ? r : (r & 0x3) | 0x8 // eslint-disable-line no-bitwise,eqeqeq
    return v.toString(16)
  })

// String -> Bool
export const isUuidv4 = (id) => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(id)

// Object -> Object
export const validate = (state) => {
  const keysToValidate = Object.keys(state)
  const validated = Object.keys(validations)
    .filter((key) => keysToValidate.includes(key))
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          typeof validations[key] === 'function'
            ? validations[key](state[key])
            : typeof state[key] === 'string' &&
              validations[key] &&
              validations[key].test(state[key].trim()),
      }),
      {}
    )

  return {
    ...validated,
    isValid: Object.values(validated).every((value) => value === true),
  }
}

// Ńumber -> String
export const formatNumber = (number) =>
  String(number).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

// Number, Bool? -> String
export const shortenNumber = (
  number,
  shouldFormatNumber = true,
  shortenFrom = 9999
) => {
  const num = parseInt(number, 10)

  if (typeof num !== 'number' || Number.isNaN(num)) {
    return number
  }

  if (num < shortenFrom) {
    if (shouldFormatNumber) {
      return formatNumber(num)
    }
    return number
  }

  switch (true) {
    case num > 99999999:
      return `${Math.floor(num / 1000000)}M`

    case num > 999999:
      return `${(num / 1000000).toFixed(1)}M`.replace('.0', '')

    case num > 99999:
      return `${Math.floor(num / 1000)}K`

    case num > 9999:
      return `${(num / 1000).toFixed(1)}K`.replace('.0', '')

    case num > 999:
      return `${(num / 1000).toFixed(1)}K`.replace('.0', '')

    case num > 99:
      return `${(num / 1000).toFixed(1)}K`

    case shouldFormatNumber:
      return formatNumber(num)

    default:
      return number
  }
}

// Number -> String
export const cutNumberToSuffix = (number) => {
  const num = parseInt(number, 10)

  return num
    ? num > 99999999
      ? `${Math.floor(num / 1000000)}M`
      : num > 999999
      ? `${(num / 1000000).toFixed(0)}M`.replace('.0', '')
      : num > 999
      ? `${(num / 1000).toFixed(0)}K`.replace('.0', '')
      : formatNumber(num)
    : number
}

// String, Object? -> Object
export const withFold = (foldType, data) => ({
  ...data,
  // Object, Object? -> Any
  fold: (definitions, options = {}) => {
    const key =
      Object.keys(definitions).find((key) =>
        key.split(',').includes(String(foldType))
      ) || '_'

    return typeof definitions[key] === 'function' && !options.isLazy
      ? definitions[key]()
      : definitions[key]
  },
  foldType,
})

// String -> String
export const intHash = (str) =>
  Math.abs(
    str.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0) // eslint-disable-line no-bitwise
      return a & a // eslint-disable-line no-bitwise
    }, 0)
  )

// Function, Integer? -> Function
export const debounce = (callback, ms = 200) => {
  let timeout = null
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), ms)
  }
}

// Function, Integer? -> Function
export const throttle = (callback, ms = 500) => {
  let lastCall = 0
  return (...args) => {
    const now = new Date().getTime()
    if (now - lastCall < ms) {
      return undefined
    }
    lastCall = now
    return callback(...args)
  }
}

// Array|String -> Function
export const getAdFactory = (ads, options = {}) => {
  if (!Array.isArray(ads)) {
    return () => ads
  }
  function* getFactory() {
    let index = 0

    while (true) {
      if (index > -1) {
        yield ads[index]
        index = ads[index + 1]
          ? index + 1
          : options.hasUnlimitedAds
          ? index
          : -1
      } else {
        yield undefined
      }
    }
  }
  const adFactory = getFactory()
  return () => adFactory.next().value
}

// Array, Object? -> Object
export const normalize = (data = [], options = {}) => {
  if (!data.length) {
    return {
      ids: [],
      data: {},
    }
  }

  if (!options.adFactory) {
    return data.reduce(
      (acc, item) => {
        acc.ids.push(item.id)
        acc.data[item.id] = item
        return acc
      },
      {
        ids: [],
        data: {},
      }
    )
  }

  /**
   * The following code is legacy and can be removed as soon as the web doesn't depend on it anymore.
   */
  const settings = {
    ...config.helpers,
    ...options,
  }

  const iteration = settings.idsLength
    ? Math.ceil(settings.idsLength / settings.iterationQuotient)
    : 0

  const randomOffset =
    settings.fixedOffset ||
    (data.length > settings.placementOffset
      ? Math.floor(Math.random() * settings.placementOffset) + 1
      : 1)

  return data.reduce(
    (acc, item, index) => {
      const isPlacementIndex =
        (index + randomOffset) % settings.placementFrequency === 0

      const isAd = isPlacementIndex && !!settings.adFactory

      if (!isAd) {
        acc.ids.push(item.id)
        acc.data[item.id] = item
        return acc
      }

      const id = `injected${
        settings.activateAdsOnIndex.indexOf(index) +
        1 +
        settings.activateAdsOnIndex.length * iteration
      }`

      acc.ids.push(id)

      acc.data[id] = {
        ...settings.adFactory(),
        isAd: true,
      }

      acc.ids.push(item.id)
      acc.data[item.id] = item

      return acc
    },
    {
      ids: [],
      data: {},
    }
  )
}

// NormalizedObject -> [Object]
export const denormalize = (payload) =>
  payload.ids.reduce((acc, id) => {
    acc.push(payload.data[id])
    return acc
  }, [])

// Object -> String -> <String|undefined>
export const getGroupNameForType = (groups) => (type) =>
  Object.keys(groups).find((key) => groups[key].includes(type)) || undefined

// TODO negative to positive outputRange
// Array[min, max], Array[min, max], int -> int
export const interpolate = curry((inputRange, outputRange, value) => {
  const maxInputValue = apply(Math.max, inputRange)
  const minInputValue = apply(Math.min, inputRange)
  const maxOutputValue = apply(Math.max, outputRange)
  const minOutputValue = apply(Math.min, outputRange)

  if (value >= maxInputValue) {
    return maxOutputValue
  }

  if (value <= minInputValue) {
    return minOutputValue
  }

  const percentage = (value * 100) / (maxInputValue - minInputValue)

  const output = (percentage * (maxOutputValue - minOutputValue)) / 100

  return output
})

// String -> Number
export const timestampToUnix = (string) => new Date(string).getTime() / 1000

export const timeUnitMap = {
  milliseconds: (d) => d * 1000,
  seconds: (d) => d,
  minutes: (d) => d / 60,
  hours: (d) => d / 60 / 60,
  days: (d) => d / 60 / 60 / 24,
  weeks: (d) => d / 60 / 60 / 24 / 7,
}

export const diffDate = (date, unit = 'milliseconds') => {
  const now = timestampToUnix(new Date())
  const then = timestampToUnix(date)
  const delta = now - then
  const withUnit = timeUnitMap[unit](delta)
  return parseInt(withUnit, 10)
}

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export const timestampToElapsedTime = (date) => {
  if (typeof date !== 'object') {
    date = new Date(date)
  }

  const seconds = Math.round((new Date() - date) / 1000)

  if (seconds < 0) {
    return ''
  }

  let intervalType = 's'
  let interval = Math.round(seconds / 31536000)

  if (interval >= 1) {
    intervalType = 'y'
  } else {
    interval = Math.round(seconds / 2592000)
    if (interval >= 1) {
      intervalType = 'mo'
    } else {
      interval = Math.round(seconds / 86400)
      if (interval >= 1) {
        intervalType = 'd'
      } else {
        interval = Math.round(seconds / 3600)
        if (interval >= 1) {
          intervalType = 'h'
        } else {
          interval = Math.round(seconds / 60)
          if (interval >= 1) {
            intervalType = 'm'
          } else {
            interval = seconds
            intervalType = 's'
          }
        }
      }
    }
  }

  return `${interval}${intervalType}`
}

export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const queue = curry((maxLength, item, array) => {
  if (array.length < maxLength) {
    return array.concat(item)
  }
  if (array.length === maxLength) {
    return array.slice(1).concat(item)
  }
  const diff = array.length - maxLength
  return array.slice(diff + 1).concat(item)
})

export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

export const getRandomString = (length = 0) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  return [...new Array(length)].reduce(
    (acc) =>
      `${acc}${characters.charAt(
        Math.floor(Math.random() * characters.length)
      )}`,
    ''
  )
}

const componentToHex = (c) => {
  // https://stackoverflow.com/a/5624139
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

export const rgbToHex = ({ r = 0, g = 0, b = 0 }) =>
  `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

export const hexToRgb = (hex) => {
  // https://stackoverflow.com/a/5624139
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

  const normalizedHex = hex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  )

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const getTextColorBasedOnBackgroundColor = ({ r = 0, g = 0, b = 0 }) => {
  // https://stackoverflow.com/a/11868159
  // http://www.w3.org/TR/AERT#color-contrast
  const o = Math.round(
    (parseInt(r, 10) * 299 + parseInt(g, 10) * 587 + parseInt(b, 10) * 114) /
      1000
  )
  return o > 125 ? 'black' : 'white'
}

export const shuffle = (a) => {
  // https://stackoverflow.com/a/6274381
  const shuffled = [...a]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRange = (n) => [...new Array(n).keys()]

export const getDump = curry((keys, item) => {
  const getInfo = (key) => {
    const isArray = Array.isArray(key)
    return {
      modifier: isArray && !!key[2] ? key[2] : (item) => item,
      propName: isArray ? key[0] : key,
      synonym: isArray ? key[1] : key,
    }
  }

  const longestKeyLength = keys.reduce((acc, key) => {
    const { synonym } = getInfo(key)
    return synonym.length > acc ? synonym.length : acc
  }, 0)

  return keys.reduce((acc, key) => {
    const { modifier, propName, synonym } = getInfo(key)

    if (!item[propName]) {
      return acc
    }

    const keyWithColon = `${synonym}:`.padEnd(longestKeyLength + 1)

    return `${acc}\n${keyWithColon} ${modifier(item[propName])}`
  }, '')
})

export const flattenProps = (obj) => {
  const jamming = allPass([validations.isObject, complement(isEmpty)])
  // eslint-disable-next-line no-use-before-define
  const jam = ([k, v]) => (jamming(v) ? go(v) : [[k, v]])
  const go = pipe(toPairs, chain(jam))
  return fromPairs(go(obj))
}

export const checkIfAnswerHasPicture = () => false

export const splitStringAtCursor = (s, c) => {
  if (c !== s?.length) {
    return [s.slice(0, c), s.slice(c)]
  }

  return [s, '']
}

export const limitNormalizedData = (key) => (state) => {
  const ids = state[key].ids.slice(0, config.api.limit)

  return {
    ...state,
    [key]: { ids, data: pick(ids, state[key].data) },
  }
}

/**
 * This function encodes a given type and id with base64 after our scheme.
 *
 * @param {Number|String} type The type that should be encoded.
 * @param {Number} id The id that should be encoded.
 * @returns {String} String Base64 encoded string.
 */
export const encodeId = (type, id) => base64url.encode(`${type}:${id}`)

/**
 * Decode a given encoded string and receive and object that gives you direct access to type and id.
 *
 * @param {String} encodedId The encoded id that should be decoded.
 * @returns {{ id: Number, type: String|undefined }} Object containing id and maybe type.
 * @example const { id, type } = decodeId(item.id)
 */
export const decodeId = (encodedId) => {
  if (typeof encodedId !== 'string') {
    return { id: encodedId }
  }

  const [type, id] = base64url.decode(encodedId).split(':')

  if (typeof id === 'undefined') {
    return { id: encodedId }
  }

  return { id: Number(id), type }
}

/**
 * A function to safely check for encoding. It returns false when id is neither a string or nor encoded.
 *
 * @param {any} value Any given value that should be evaluated.
 * @returns {Boolean} Boolean to determine if the given value is encoded.
 */
export const isEncodedId = (value) =>
  typeof value === 'string' &&
  value.includes('-') === false &&
  base64url.decode(value).includes(':')

/**
 * A safe check to compare a maybe encoded value to a type. It returns false when id is neither a string or nor encoded.
 *
 * @param {Number|String} type The type that should be checked for.
 * @param {*} string Any given value that should be compared to type.
 * @returns {Boolean} Boolean to determine if the given value is equal to the given type.
 * @example hasEncodedType(MY_ENUM.TYPE, item.id)
 */
export const hasEncodedType = (type, encodedId) => {
  if (typeof encodedId !== 'string') {
    return false
  }

  const decoded = decodeId(encodedId)

  return type && type === decoded.type
}

/**
 * Merges multiple of handler functions into an array, if the initialHandlers are not valid it'll return just the new ones
 * @param {Function|Function[]} initialHandlers The source handler function or handler function array
 * @param {Function|Function[]} newHandlers A new handler function or an array of new handler functions to merge
 * @returns {Function|Function[]} A new handler function or array of handler functions
 */
export const mergeHandlers = (initialHandlers, newHandlers) => {
  if (
    !validations.isFunction(newHandlers) &&
    !validations.isArrayOfFunctions(newHandlers)
  ) {
    throw new TypeError(
      'newHandlers must be either a function or an array of functions.'
    )
  }
  if (validations.isFunction(initialHandlers)) {
    return Array.isArray(newHandlers)
      ? [initialHandlers, ...newHandlers]
      : [initialHandlers, newHandlers]
  }

  if (validations.isArrayOfFunctions(initialHandlers)) {
    return Array.isArray(newHandlers)
      ? [...initialHandlers, ...newHandlers]
      : [...initialHandlers, newHandlers]
  }

  return newHandlers
}

/**
 * Calls one or more handler functions
 * @param {Function|Function[]} handler
 * @param {any} event
 */
export const callHandler = (handler, event) => {
  if (validations.isFunction(handler)) {
    handler(event)
  } else if (validations.isArrayOfFunctions(handler)) {
    handler.forEach((fn) => fn(event))
  }
}

/**
 * Creates a generic event handler for one or more handler functions
 * @param {Function|Function[]} handler
 * @returns {(event: any) => void}
 */
export const makeEventHandler = (handler) => (event) => {
  callHandler(handler, event)
}

export const parseJsonSafely = (json) => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return undefined
  }
}

/**
 * Function to optimistically add/remove a reaction and insert/remove the preview user from the reactions preview when he reacted to an item.
 */
export const getModifiedLikesValues = ({
  isLikeAction,
  item = {},
  reactionType,
}) => {
  const { likes = {}, isCurrentUserTellSender } = item

  const previewReactions = [...(likes.previewReactions ?? [])]

  let watchingUserGivenReactions = [...(likes.watchingUserGivenReactions ?? [])]

  let anonGivenReactions = [...(likes.anonGivenReactions ?? [])]

  let count = likes.reactionCounts?.all ?? 0
  let typeCount = likes.reactionCounts?.[reactionType] ?? 0

  // when the user adds a reaction
  if (isLikeAction) {
    // insert the preview reaction at the first position in the list

    previewReactions.unshift(reactionType)

    count++
    typeCount++

    /**
     * Add the given reaction type to the corresponding list of reactions.
     * anonGivenReactions: includes reactions from the anonymous tell sender
     * watchingUserGivenReactions: includes reactions from the watching user if he is not the anonymous tell sender
     */
    if (isCurrentUserTellSender) {
      anonGivenReactions.push(reactionType)
    } else {
      watchingUserGivenReactions.push(reactionType)
    }
  } else {
    // when the user removes a reaction

    const index = previewReactions.indexOf(reactionType)

    // remove the preview user from the list
    if (index > -1) {
      previewReactions.splice(index, 1)

      count--
      typeCount--
    }

    // remove the reaction from the corresponding list of reactions
    if (isCurrentUserTellSender) {
      anonGivenReactions = anonGivenReactions.filter(
        (type) => type !== reactionType
      )
    } else {
      watchingUserGivenReactions = watchingUserGivenReactions.filter(
        (type) => type !== reactionType
      )
    }
  }

  return {
    anonGivenReactions,
    reactionCounts: {
      [reactionType]: Math.max(typeCount, 0),
      all: Math.max(count, 0),
    },
    previewReactions,
    watchingUserGivenReactions,
  }
}

export const removeActionTypePrefix = (str) => str.replace(/^.*?\//, '')

export const snakeCaseToCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const hideItemInList = ({ data = [], id }) =>
  data.map((item) => (item.id === id ? { ...item, _isHidden: true } : item))

/**
 * Returns the value of numbers closest to the target.
 * @param {number} target
 * @param {number[]} numbers
 * @returns {number}
 */
export const closestNumberTo = (target, numbers) =>
  numbers.reduce((acc, num) =>
    Math.abs(num - target) < Math.abs(acc - target) ? num : acc
  )

/**
 * Returns a list of all possible combinations.
 * @param {array} items
 * @returns {array[]}
 */
export const getCombinations = (items) => {
  const results = []

  for (let slots = items.length; slots > 0; slots--) {
    for (let loop = 0; loop < items.length - slots + 1; loop++) {
      const key = results.length

      results[key] = []

      for (let i = loop; i < loop + slots; i++) {
        results[key].push(items[i])
      }
    }
  }

  return results
}

/**
 * Returns a list of all possible permutations.
 * @param {array} items
 * @returns {array[]}
 */
export const getPermutations = (items) => {
  const results = []

  const permute = (arr, memo = []) => {
    let cur

    for (let i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1)

      if (arr.length === 0) {
        results.push(memo.concat(cur))
      }

      permute(arr.slice(), memo.concat(cur))
      arr.splice(i, 0, cur[0])
    }

    return results
  }

  permute(items)

  return results
}

export const getStringWithTagInserted = ({
  tagSuggestionsTerm,
  value,
  textInputCursorPosition,
  username,
}) => {
  const [stringStart, stringEnd] = splitStringAtCursor(
    value,
    textInputCursorPosition
  )

  let stringWithTagInserted

  if (tagSuggestionsTerm !== '') {
    const match = stringStart.match(validations.usernameWithTagInTextLast)

    if (!match) {
      return undefined
    }

    const indexUsername = match.index === 0 ? match.index : match.index + 1
    const beforeUsername = stringStart.slice(0, indexUsername)

    stringWithTagInserted = `${beforeUsername}@${username} ${stringEnd}`
  } else {
    const match =
      stringStart.match(validations.endsWithAtSignNotCapturing)?.[1] ?? ''

    stringWithTagInserted = `${match}@${username} ${stringEnd}`
  }

  return stringWithTagInserted
}

/**
 * Returns the Levenshtein distance between two strings.
 * https://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
 * @param {string} s string1
 * @param {string} t string2
 * @returns {number}
 */
export const stringDistance = (s, t) => {
  if (s === t) {
    return 0
  }
  const n = s.length,
    m = t.length
  if (n === 0 || m === 0) {
    return n + m
  }
  let x = 0,
    y,
    a,
    b,
    c,
    d,
    g,
    h,
    k
  const p = new Array(n)
  for (y = 0; y < n; ) {
    p[y] = ++y
  }

  for (; x + 3 < m; x += 4) {
    const e1 = t.charCodeAt(x)
    const e2 = t.charCodeAt(x + 1)
    const e3 = t.charCodeAt(x + 2)
    const e4 = t.charCodeAt(x + 3)
    c = x
    b = x + 1
    d = x + 2
    g = x + 3
    h = x + 4
    for (y = 0; y < n; y++) {
      k = s.charCodeAt(y)
      a = p[y]
      if (a < c || b < c) {
        c = a > b ? b + 1 : a + 1
      } else {
        if (e1 !== k) {
          c++
        }
      }

      if (c < b || d < b) {
        b = c > d ? d + 1 : c + 1
      } else {
        if (e2 !== k) {
          b++
        }
      }

      if (b < d || g < d) {
        d = b > g ? g + 1 : b + 1
      } else {
        if (e3 !== k) {
          d++
        }
      }

      if (d < g || h < g) {
        g = d > h ? h + 1 : d + 1
      } else {
        if (e4 !== k) {
          g++
        }
      }
      // eslint-disable-next-line no-multi-assign
      p[y] = h = g
      g = d
      d = b
      b = c
      c = a
    }
  }

  for (; x < m; ) {
    const e = t.charCodeAt(x)
    c = x
    d = ++x
    for (y = 0; y < n; y++) {
      a = p[y]
      if (a < c || d < c) {
        d = a > d ? d + 1 : a + 1
      } else {
        if (e !== s.charCodeAt(y)) {
          d = c + 1
        } else {
          d = c
        }
      }
      p[y] = d
      c = a
    }
    h = d
  }

  return h
}

/**
 * Cloudflare's Turnstile widgets only allow alphanumeric characters as well as _ and -.
 * We decided to just replace all non alphanumeric characters with _.
 */
export const sanitizeCloudflareTurnstileCustomerData = (cData) =>
  cData.replace(/[^\w]/g, '_')
