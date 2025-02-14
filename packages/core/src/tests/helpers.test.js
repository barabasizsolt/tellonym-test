import { interpolate } from '../helpers'

describe('helpers', () => {
  describe('interpolate', () => {
    it('returns highest output when value higher than max input', () => {
      const inputRange = [0, 1]
      const outputRange = [0, 100]
      const value = 2

      const expected = 100
      const actual = interpolate(inputRange, outputRange, value)

      expect(actual).toBe(expected)
    })

    it('returns lowest output when value lower than min input', () => {
      const inputRange = [0, 1]
      const outputRange = [0, 100]
      const value = -1

      const expected = 0
      const actual = interpolate(inputRange, outputRange, value)

      expect(actual).toBe(expected)
    })

    it('returns the appropriate output value according to input range 0, 1', () => {
      const inputRange = [0, 1]
      const outputRange = [0, 100]
      const value = 0.7

      const expected = 70
      const actual = interpolate(inputRange, outputRange, value)

      expect(actual).toBe(expected)
    })

    it('returns the appropriate output value according to input range 1, 5', () => {
      const inputRange = [1, 5]
      const outputRange = [100, 500]
      const value = 2

      const expected = 200
      const actual = interpolate(inputRange, outputRange, value)

      expect(actual).toBe(expected)
    })

    it('returns the appropriate output value according to input range 3, 13', () => {
      const inputRange = [3, 13]
      const outputRange = [6, 26]
      const value = 4

      const expected = 8
      const actual = interpolate(inputRange, outputRange, value)

      expect(actual).toBe(expected)
    })
  })
})
