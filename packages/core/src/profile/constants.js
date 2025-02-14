import * as _ from '../underscore'

export const name = 'profile'

export const supportedEmojiTypes = []

export const supportedEmojis = []

export const completeProfileSliderHiddenType = {
  SESSION: 'completeProfileSliderHiddenType/SESSION',
  USER: 'completeProfileSliderHiddenType/USER',
}

export const sliderHiddenTypeToTimeoutMap = {
  [completeProfileSliderHiddenType.SESSION]: 2 * _.d,
  [completeProfileSliderHiddenType.USER]: 2 * _.w,
}

export const SESSION_COUNT_SLIDER_VISIBLE_THRESHOLD = 3

export const UPDATE_SOCIAL_LINKS_INTERVAL = 8 * _.w
export const UPDATE_SOCIAL_LINKS_POST_REGISTRATION_THRESHOLD = 1 * _.w

export const VERIFICATION_BANNER_INTERVAL = 7 * _.d

export const userTintColors = []
