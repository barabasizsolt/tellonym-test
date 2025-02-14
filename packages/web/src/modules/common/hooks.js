import { useDebounceCallback } from '@react-hook/debounce'
import { useThrottleCallback } from '@react-hook/throttle'
import GraphemeSplitter from 'graphemer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * A hook that calls callback each milliseconds defined by delay.
 * @param {Function} callback The function to be called on every tick
 * @param {*} delay The delay between ticks
 * @example
 * const MyComponent = () => {
 *   useInterval(() => {}, 300)
 * }
 */
const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback.current?.()
      }, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const splitter = new GraphemeSplitter()

const useTextSplitter = (maxChars, lineBreakWidth, string) => {
  const shortenedText = useMemo(() => {
    const chars = splitter.splitGraphemes(string)

    let charCount = 0

    for (let index = 0; index <= chars.length; index++) {
      charCount =
        chars[index] === '\n' ? charCount + lineBreakWidth : charCount + 1

      if (charCount > maxChars) {
        return `${chars.slice(0, index).join('')}...`
      }
    }

    return string
  }, [maxChars, lineBreakWidth, string])

  return shortenedText
}

const useHorizontalScroll = (ref) => {
  if (ref.current) {
    const onWheel = (e) => {
      if (e.deltaY === 0) {
        return
      }
      if (
        !(ref.current.scrollLeft === 0 && e.deltaY < 0) &&
        !(
          ref.current.scrollWidth -
            ref.current.clientWidth -
            Math.round(ref.current.scrollLeft) ===
            0 && e.deltaY > 0
        )
      ) {
        e.preventDefault()
      }
      ref.current.scrollTo({
        left: ref.current.scrollLeft + e.deltaY,
        behavior: 'auto',
      })
    }

    ref.current.addEventListener('wheel', onWheel)

    return () => ref.current.removeEventListener('wheel', onWheel)
  }
}

const DEFAULT_TIMEOUT = 500

/**
 * React hook to throttle a function with given milliseconds, defaults to 500 and is wrapped with useCallback.
 *
 * @param {Function} callback The function you want to throttle.
 * @param {Number} ms The millisecond you want to throttle, defaults to 500ms.
 * @returns React hook
 */
export const useThrottle = (func, ms = DEFAULT_TIMEOUT, scope = []) =>
  useThrottleCallback(func, parseInt(ms / 16, 10)) // useThrottleCallback takes frames and not ms as an argument so we divide it (16 frames per second)

/**
 * React hook to debounce a function with given milliseconds, defaults to 500 and is wrapped with useCallback.
 *
 * @param {Function} callback The function you want to debounce.
 * @param {Number} ms The millisecond you want to debounce, defaults to 500ms.
 * @returns React hook
 */
const useDebounce = (func, ms = DEFAULT_TIMEOUT) =>
  useDebounceCallback(func, ms)

/**
 * @typedef {Object} IntervalCounterOptions
 * @property {Number} min The minimum number the counter can reach
 * @property {Number} max The maximum number the counter can reach
 * @property {Number} minDelta The minimum number the counter can change
 * @property {Number} maxDelta The maximum number the counter can change
 * @property {Number} intervalInMs The interval in milliseconds between each change
 * @property {Boolean} shouldStopAtMax Should the counter stop at max
 * @property {Number} increaseLikelihood The likelihood of the counter increasing, defaults to null which is equivalent to 1
 */

/**
 * React hook to create a counter based on an interval
 * @param {IntervalCounterOptions} options The options for the counter
 * @returns {Number} The current count
 */
const useIntervalCounter = ({
  min,
  max,
  minDelta,
  maxDelta,
  intervalInMs,
  shouldStopAtMax = false,
  increaseLikelihood = null,
}) => {
  const intervalRef = useRef(null)

  const getRandomNumber = useCallback(
    (min, max, hasRandomSign = false) => {
      const randNum = Math.floor(Math.random() * (max - min + 1) + min)

      if (increaseLikelihood !== null && hasRandomSign) {
        const isPositive = Math.random() < increaseLikelihood
        return isPositive ? randNum : -randNum
      }

      return randNum
    },
    [increaseLikelihood]
  )

  const [count, setCount] = useState(getRandomNumber(min, max))

  useEffect(() => {
    if (shouldStopAtMax && count >= max) {
      clearInterval(intervalRef.current)
    }
  }, [count, max, shouldStopAtMax])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => {
        const currentNumber =
          prevCount +
          getRandomNumber(maxDelta, minDelta, increaseLikelihood !== null)

        return shouldStopAtMax && currentNumber > max ? max : currentNumber
      })
    }, intervalInMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    getRandomNumber,
    increaseLikelihood,
    intervalInMs,
    max,
    maxDelta,
    min,
    minDelta,
    shouldStopAtMax,
  ])

  return count
}

export const hooks = {
  useDebounce,
  useHorizontalScroll,
  useInterval,
  useTextSplitter,
  useThrottle,
  useIntervalCounter,
}
