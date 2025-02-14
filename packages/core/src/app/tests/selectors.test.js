import { getAccessToken, getIsLoggedIn } from '../selectors'

describe('app/selectors', () => {
  describe('getAccessToken', () => {
    it('returns accessToken', () => {
      const state = {
        __app__: { accounts: { activeUserId: 1, 1: { accessToken: 'foo' } } },
      }
      const expected = 'foo'
      const actual = getAccessToken(state)

      expect(actual).toBe(expected)
    })

    it('returns empty string when no accessToken', () => {
      const state = { __app__: { accounts: {} } }
      const expected = ''
      const actual = getAccessToken(state)

      expect(actual).toBe(expected)
    })
  })

  describe('getIsLoggedIn', () => {
    it('return false when not logged in', () => {
      const state = { __app__: { accounts: {} } }
      const expected = false
      const actual = getIsLoggedIn(state)

      expect(actual).toBe(expected)
    })

    it('return true when logged in', () => {
      const state = {
        __app__: {
          accounts: { activeUserId: 1, 1: { accessToken: 'foo' } },
        },
      }
      const expected = true
      const actual = getIsLoggedIn(state)
      expect(actual).toBe(expected)
    })
  })
})
