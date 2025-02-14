import { config } from '../../../config'
import { moment } from '../../common/locales/moment'
import { getShouldShowHintBanner } from '../selectors'

describe('app/selectors', () => {
  describe('getShouldShowHintBanner', () => {
    it('should show the banner when never shown before', () => {
      const state = {
        __app__: {
          notAnonymousHintBannerHasBeenShownAt: undefined,
        },
      }

      const expected = true
      const actual = getShouldShowHintBanner(state)

      expect(actual).toBe(expected)
    })

    it('should show when threshold passed', () => {
      const { daysMinToRemind } = config.components.WriteTell

      const state = {
        __app__: {
          notAnonymousHintBannerHasBeenShownAt: moment().subtract(
            daysMinToRemind,
            'd'
          ),
        },
      }

      const expected = true
      const actual = getShouldShowHintBanner(state)

      expect(actual).toBe(expected)
    })

    it('should not show when threshold not passed', () => {
      const { daysMinToRemind } = config.components.WriteTell

      const state = {
        __app__: {
          notAnonymousHintBannerHasBeenShownAt: moment()
            .subtract(daysMinToRemind, 'd')
            .add(1, 'h'),
        },
      }

      const expected = false
      const actual = getShouldShowHintBanner(state)

      expect(actual).toBe(expected)
    })
  })
})
