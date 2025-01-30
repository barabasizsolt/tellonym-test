import { HOST_TYPE } from '../api'
import { timestampToUnix } from '../helpers'
import { completeProfileSliderHiddenType } from './constants'
import { getProfileLang } from './selectors'
import * as t from './types'

export const addAccount = (payload) => ({
  type: t.ADD_ACCOUNT,
  payload,
})

export const changeAppTranslation = ({ _auto = false, ...payload }) => ({
  type: t.CHANGE_APP_TRANSLATION,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.CHANGE_APP_TRANSLATION_ERROR },
      commit: {
        type: t.CHANGE_APP_TRANSLATION_SUCCESS,
        meta: { payload, _auto },
      },
    },
  },
})

export const changeAvatar = (payload) => ({
  type: t.CHANGE_AVATAR,
  payload,
})

export const changeSettings = (payload) => ({
  type: t.CHANGE_SETTINGS,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.CHANGE_SETTINGS_ERROR },
      commit: { type: t.CHANGE_SETTINGS_SUCCESS, meta: { payload } },
    },
  },
})

export const changeEmail = (payload) => ({
  type: t.CHANGE_EMAIL,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.CHANGE_EMAIL_ERROR },
      commit: { type: t.CHANGE_EMAIL_SUCCESS },
    },
  },
})

export const changePassword = (payload) => ({
  type: t.CHANGE_PASSWORD,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/changepassword', method: 'POST' },
      rollback: { type: t.CHANGE_PASSWORD_ERROR },
      commit: { type: t.CHANGE_PASSWORD_SUCCESS },
    },
  },
})

export const changePushSettings = (payload) => ({
  type: t.CHANGE_PUSH_SETTINGS,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'accounts/pushnotificationtoken',
        method: 'POST',
      },
      rollback: { type: t.CHANGE_PUSH_SETTINGS_ERROR, meta: { payload } },
      commit: { type: t.CHANGE_PUSH_SETTINGS_SUCCESS, meta: { payload } },
    },
  },
})

export const changeSafetyLevel = (payload) => ({
  type: t.CHANGE_SAFETY_LEVEL,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.CHANGE_SAFETY_LEVEL_ERROR },
      commit: {
        type: t.CHANGE_SAFETY_LEVEL_SUCCESS,
        meta: { _navigateTo: payload._navigateTo },
      },
    },
  },
})

export const changeStatusEmoji = (payload) => ({
  type: t.CHANGE_STATUS_EMOJI,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      commit: { type: t.CHANGE_STATUS_EMOJI_SUCCESS },
      rollback: { type: t.CHANGE_STATUS_EMOJI_ERROR },
    },
  },
})

export const changeTellsPreferences = (payload) => ({
  type: t.CHANGE_TELLS_PREFERENCES,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings/tells', method: 'POST' },
      commit: { type: t.CHANGE_TELLS_PREFERENCES_SUCCESS },
      rollback: { type: t.CHANGE_TELLS_PREFERENCES_ERROR },
    },
  },
})

export const refreshTellPromptsPreferences = (payload) => ({
  shouldAdjustData: false,
  type: t.REFRESH_TELL_PROMPTS_PREFERENCES,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings/tell-categories/inactive' },
      commit: { type: t.REFRESH_TELL_PROMPTS_PREFERENCES_SUCCESS },
      rollback: {
        type: t.REFRESH_TELL_PROMPTS_PREFERENCES_ERROR,
      },
    },
  },
})

export const setTellPromptsCategoriesInactive = (payload) => ({
  type: t.SET_TELL_PROMPTS_CATEGORIES_INACTIVE,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'accounts/settings/tell-categories/deactivate',
        method: 'POST',
        ...payload,
      },
      commit: { type: t.SET_TELL_PROMPTS_CATEGORIES_INACTIVE_SUCCESS },
      rollback: {
        type: t.SET_TELL_PROMPTS_CATEGORIES_INACTIVE_ERROR,
        meta: { payload },
      },
    },
  },
})

export const setTellPromptsCategoriesActive = (payload) => ({
  type: t.SET_TELL_PROMPTS_CATEGORIES_ACTIVE,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'accounts/settings/tell-categories/activate',
        method: 'POST',
        ...payload,
      },
      commit: { type: t.SET_TELL_PROMPTS_CATEGORIES_ACTIVE_SUCCESS },
      rollback: {
        type: t.SET_TELL_PROMPTS_CATEGORIES_ACTIVE_ERROR,
        meta: { payload },
      },
    },
  },
})

export const changeState = (payload) => ({
  type: t.CHANGE_STATE,
  payload,
})

export const changeTell = (payload) => ({
  type: t.CHANGE_TELL,
  payload,
})

export const checkSafetyCode = (payload) => ({
  type: t.CHECK_SAFETY_CODE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/safetycode/check', method: 'POST' },
      rollback: { type: t.CHECK_SAFETY_CODE_ERROR },
      commit: {
        type: t.CHECK_SAFETY_CODE_SUCCESS,
        meta: {
          _navigateTo: payload._navigateTo,
          safetyCode: payload.enteredSafetyCode,
        },
      },
    },
  },
})

export const connectApple = (payload) => ({
  type: t.CONNECT_APPLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/connect/apple', method: 'POST' },
      rollback: { type: t.CONNECT_APPLE_ERROR },
      commit: { type: t.CONNECT_APPLE_SUCCESS },
    },
  },
})

export const connectEmail = (payload) => ({
  type: t.CONNECT_EMAIL,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/connect/email', method: 'POST' },
      rollback: { type: t.CONNECT_EMAIL_ERROR },
      commit: { type: t.CONNECT_EMAIL_SUCCESS, meta: payload },
    },
  },
})

export const connectGoogle = (payload) => ({
  type: t.CONNECT_GOOGLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/connect/google', method: 'POST' },
      rollback: { type: t.CONNECT_GOOGLE_ERROR },
      commit: { type: t.CONNECT_GOOGLE_SUCCESS },
    },
  },
})

export const connectLocation = () => ({
  type: t.CONNECT_LOCATION,
})

export const confirmUserWarning = (payload) => ({
  type: t.CONFIRM_USER_WARNING,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'accounts/warning/seen',
        method: 'POST',
        ...payload,
      },
      rollback: { type: t.CONFIRM_USER_WARNING_ERROR },
      commit: { type: t.CONFIRM_USER_WARNING_SUCCESS },
    },
  },
})

export const disconnectInstagram = (payload) => ({
  type: t.DISCONNECT_INSTAGRAM,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/disconnect/instagram', method: 'POST' },
      rollback: { type: t.DISCONNECT_INSTAGRAM_ERROR },
      commit: { type: t.DISCONNECT_INSTAGRAM_SUCCESS },
    },
  },
})

/**
 * Add or remove interests. Requires one of the two parameters.
 * @param {object} payload
 * @param {object[]} [payload.interestsToAdd]
 * @param {object[]} [payload.interestsToRemove]
 * @returns {object}
 */
export const editInterests = ({
  interestsToAdd = [],
  interestsToRemove = [],
}) => ({
  type: t.EDIT_INTERESTS,
  payload: { interestsToAdd, interestsToRemove },
  meta: {
    offline: {
      effect: { path: 'interests/edit', method: 'POST' },
      rollback: { type: t.EDIT_INTERESTS_ERROR, meta: { interestsToAdd, interestsToRemove } }, // prettier-ignore
      commit: { type: t.EDIT_INTERESTS_SUCCESS, meta: { interestsToAdd, interestsToRemove } }, // prettier-ignore
    },
  },
})

export const subscribeToProfile = (payload) => ({
  type: t.SUBSCRIBE_TO_PROFILE,
  payload,
})

export const fetchAnswers = (payload) => (dispatch, getState) =>
  dispatch({
    type: t.FETCH_ANSWERS,
    payload,
    meta: {
      offline: {
        effect: {
          path: `answers/olderthan/${getState().profile.profile.id}`,
          answerTime: timestampToUnix(payload.createdAt),
          ...payload,
        },
        rollback: { type: t.FETCH_ANSWERS_ERROR },
        commit: { type: t.FETCH_ANSWERS_SUCCESS },
      },
    },
  })

export const fetchMainLanguageSettings = (payload) => ({
  type: t.FETCH_MAIN_LANGUAGE_SETTINGS,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'accounts/settings/main-language',
      },
      rollback: { type: t.FETCH_MAIN_LANGUAGE_SETTINGS_ERROR },
      commit: { type: t.FETCH_MAIN_LANGUAGE_SETTINGS_SUCCESS },
    },
  },
})

export const incrementStatusEmojiChallengeProgress = (payload) => ({
  type: t.INCREMENT_STATUS_EMOJI_CHALLENGE_PROGRESS,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/challenges/increment', method: 'POST' },
      commit: { type: t.INCREMENT_STATUS_EMOJI_CHALLENGE_PROGRESS_SUCCESS },
      rollback: { type: t.INCREMENT_STATUS_EMOJI_CHALLENGE_PROGRESS_ERROR },
    },
  },
})

export const logout = (payload) => ({
  type: t.LOGOUT,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'tokens/destroy', method: 'POST' },
      commit: { type: t.LOGOUT_SUCCESS, meta: payload },
      rollback: { type: t.LOGOUT_ERROR },
    },
  },
})

export const logoutSuccess = (payload) => ({
  type: t.LOGOUT_SUCCESS,
  payload,
})

export const logSocialLinkPress = (payload) => ({
  type: t.LOG_SOCIAL_LINK_PRESS,
  payload,
  meta: {
    offline: {
      shouldUseRequestMiddleware: true,
      effect: { path: 'profiles/tracklinkclick', method: 'POST' },
      commit: { type: t.LOG_SOCIAL_LINK_PRESS_SUCCESS },
      rollback: { type: t.LOG_SOCIAL_LINK_PRESS_ERROR },
    },
  },
})

export const refresh = (payload) => ({
  type: t.REFRESH,
  payload,
  meta: {
    offline: {
      shouldUseRequestMiddleware: false,
      effect: { path: 'accounts/myself', ...payload },
      rollback: { type: t.REFRESH_ERROR },
      commit: { type: t.REFRESH_SUCCESS },
    },
  },
})

export const refreshAchievableEmojis = (payload) => ({
  type: t.REFRESH_ACHIEVABLE_EMOJIS,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/challenges/statusemoji' },
      commit: { type: t.REFRESH_ACHIEVABLE_EMOJIS_SUCCESS },
      rollback: { type: t.REFRESH_ACHIEVABLE_EMOJIS_ERROR },
    },
  },
})

export const refreshAnswers = (payload) => (dispatch, getState) =>
  dispatch({
    type: t.REFRESH_ANSWERS,
    payload,
    meta: {
      offline: {
        effect: {
          path: `answers/${getState().profile.profile.id}`,
          ...payload,
        },
        rollback: { type: t.REFRESH_ANSWERS_ERROR },
        commit: { type: t.REFRESH_ANSWERS_SUCCESS },
      },
    },
  })

export const refreshInterests = (payload) => (dispatch, getState) =>
  dispatch({
    type: t.REFRESH_INTERESTS,
    payload,
    meta: {
      offline: {
        effect: { path: `interests/list/${getProfileLang(getState())}` },
        commit: { type: t.REFRESH_INTERESTS_SUCCESS },
        rollback: { type: t.REFRESH_INTERESTS_ERROR },
      },
    },
  })

export const refreshSettings = (payload) => ({
  type: t.REFRESH_SETTINGS,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', ...payload },
      rollback: { type: t.REFRESH_SETTINGS_ERROR },
      commit: { type: t.REFRESH_SETTINGS_SUCCESS },
    },
  },
})

export const refreshStatusEmojis = (payload) => ({
  type: t.REFRESH_STATUS_EMOJIS,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/statusemoji', limit: 100 },
      commit: { type: t.REFRESH_STATUS_EMOJIS_SUCCESS },
      rollback: { type: t.REFRESH_STATUS_EMOJIS_ERROR },
    },
  },
})

export const refreshTellsPreferences = (payload) => ({
  type: t.REFRESH_TELLS_PREFERENCES,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings/tells' },
      commit: { type: t.REFRESH_TELLS_PREFERENCES_SUCCESS },
      rollback: { type: t.REFRESH_TELLS_PREFERENCES_ERROR },
    },
  },
})

export const removeAccount = () => ({
  type: t.REMOVE_ACCOUNT,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/destroy', method: 'POST' },
      rollback: { type: t.REMOVE_ACCOUNT_ERROR },
      commit: { type: t.REMOVE_ACCOUNT_SUCCESS },
    },
  },
})

export const removeAvatar = (payload = {}, options = {}) => ({
  type: t.REMOVE_AVATAR,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'uploads/avatar/destroy', method: 'POST', ...payload },
      rollback: { type: t.REMOVE_AVATAR_ERROR },
      commit: { type: t.REMOVE_AVATAR_SUCCESS, meta: options },
    },
  },
})

export const changeAvatarPosition = (payload = {}) => ({
  type: t.CHANGE_AVATAR_POSITION,
  payload,
  meta: {
    offline: {
      effect: { path: 'uploads/avatar/exchange', method: 'POST', ...payload },
      rollback: { type: t.CHANGE_AVATAR_POSITION_ERROR, meta: { payload } },
      commit: { type: t.CHANGE_AVATAR_POSITION_SUCCESS },
    },
  },
})

export const removeSafetyCode = (payload) => ({
  type: t.REMOVE_SAFETY_CODE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/safetycode/destroy', method: 'POST' },
      rollback: { type: t.REMOVE_SAFETY_CODE_ERROR },
      commit: { type: t.REMOVE_SAFETY_CODE_SUCCESS },
    },
  },
})

export const uploadAvatar = (payload) => {
  const formData = new FormData()

  const item = payload.resizedPicture ?? payload

  formData.append(
    'picture',
    item.path
      ? {
          uri: item.path,
          name: item.path && item.path.split('/').reverse()[0],
          type: item.mime,
        }
      : item.avatar
  )

  return {
    type: t.UPLOAD_AVATAR,
    payload: { formData },
    meta: {
      offline: {
        effect: {
          hostType: HOST_TYPE.UPLOAD,
          path: 'upload/profilepicture',
          method: 'POST',
          timeout: 61000,
        },
        rollback: { type: t.UPLOAD_AVATAR_ERROR },
        commit: {
          type: t.UPLOAD_AVATAR_SUCCESS,
          meta: { position: payload.position },
        },
      },
    },
  }
}

export const saveAvatar = (payload) => ({
  type: t.SAVE_AVATAR,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.SAVE_AVATAR_ERROR },
      commit: { type: t.SAVE_AVATAR_SUCCESS },
    },
  },
})

export const sendSafetyCodeMail = (payload) => ({
  type: t.SEND_SAFETY_CODE_MAIL,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/safetycode/reset', method: 'POST' },
      rollback: { type: t.SEND_SAFETY_CODE_MAIL_ERROR },
      commit: { type: t.SEND_SAFETY_CODE_MAIL_SUCCESS },
    },
  },
})

export const setPhone = (payload) => ({
  type: t.SET_PHONE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.SET_PHONE_ERROR },
      commit: { type: t.SET_PHONE_SUCCESS },
    },
  },
})

export const setSafetyCode = (payload) => ({
  type: t.SET_SAFETY_CODE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/settings', method: 'POST' },
      rollback: { type: t.SET_SAFETY_CODE_ERROR },
      commit: { type: t.SET_SAFETY_CODE_SUCCESS },
    },
  },
})

export const setStatusEmojiIsOwned = (payload) => ({
  type: t.SET_STATUS_EMOJI_IS_OWNED,
  payload,
})

export const switchAccount = (payload) => ({
  type: t.SWITCH_ACCOUNT,
  payload,
})

export const unlockStatusEmoji = (payload) => ({
  type: t.UNLOCK_STATUS_EMOJI,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/statusemoji/unlock', method: 'POST' },
      commit: { type: t.UNLOCK_STATUS_EMOJI_SUCCESS },
      rollback: { type: t.UNLOCK_STATUS_EMOJI_ERROR },
    },
  },
})

export const writeTell = (payload) => ({
  type: t.WRITE_TELL,
  payload,
  meta: {
    offline: {
      effect: {
        method: 'POST',
        path: 'tells/create',
      },
      rollback: { type: t.WRITE_TELL_ERROR },
      commit: {
        type: t.WRITE_TELL_SUCCESS,
        meta: payload,
      },
    },
  },
})

export const writeTellWeb = (payload) => ({
  type: t.WRITE_TELL,
  payload,
  meta: {
    offline: {
      effect: {
        method: 'POST',
        path: 'tells/new',
      },
      rollback: { type: t.WRITE_TELL_ERROR },
      commit: {
        type: t.WRITE_TELL_SUCCESS,
        meta: payload,
      },
    },
  },
})

export const setCompleteProfileSliderComplete = (payload) => ({
  type: t.SET_COMPLETE_PROFILE_SLIDER_COMPLETE,
  payload,
})

export const setCompleteProfileSliderHide = (payload) => ({
  type: t.SET_COMPLETE_PROFILE_SLIDER_HIDE,
  payload,
})

export const setCompleteProfileSliderHideByUser = (payload) => ({
  type: t.SET_COMPLETE_PROFILE_SLIDER_HIDE,
  payload: {
    isHidden: payload,
    ...(payload && {
      hiddenBy: completeProfileSliderHiddenType.USER,
    }),
  },
})

export const uploadAccountVerificationSelfie = ({ picture }) => {
  const formData = new FormData()

  formData.append(
    'picture',
    picture.path
      ? {
          uri: ANDROID ? `file://${picture.path}` : picture.path,
          name: picture.path && picture.path.split('/').reverse()[0],
          type: picture.mime ?? 'image/jpeg',
        }
      : picture
  )

  return {
    type: t.UPLOAD_ACCOUNT_VERIFICATION_SELFIE,
    payload: { formData },
    meta: {
      offline: {
        effect: {
          hostType: HOST_TYPE.UPLOAD,
          path: 'upload/accountverification',
          method: 'POST',
          timeout: 61000,
        },
        rollback: { type: t.UPLOAD_ACCOUNT_VERIFICATION_SELFIE_ERROR },
        commit: { type: t.UPLOAD_ACCOUNT_VERIFICATION_SELFIE_SUCCESS },
      },
    },
  }
}

/**
 *
 * @param {object} payload
 * @param {string} payload.filename
 * @returns {object}
 */
export const verifyAccount = (payload) => ({
  type: t.VERIFY_ACCOUNT,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/verification', method: 'POST' },
      commit: { type: t.VERIFY_ACCOUNT_SUCCESS },
      rollback: { type: t.VERIFY_ACCOUNT_ERROR },
    },
  },
})

export const setVerificationBannerStatus = (payload) => ({
  type: t.SET_VERIFICATION_BANNER_STATUS,
  payload,
})

export const setIsMaintenanceMode = (payload) => ({
  type: t.SET_IS_MAINTENANCE_MODE,
  payload,
})
