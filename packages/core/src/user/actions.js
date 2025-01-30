import { SERVICE } from './constants'
import * as t from './types'

export const abortRegistration = (payload) => ({
  type: t.ABORT_REGISTRATION,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/abortregistration', method: 'POST' },
      rollback: { type: t.ABORT_REGISTRATION_ERROR },
      commit: { type: t.ABORT_REGISTRATION_SUCCESS },
    },
  },
})

export const authenticate = (payload) => ({
  type: t.AUTHENTICATE,
  payload,
})

export const authenticationCompleted = (payload) => ({
  type: t.AUTHENTICATION_COMPLETED,
  payload,
})

export const changeEmail = (payload) => ({
  type: t.CHANGE_EMAIL,
  payload,
})

export const changePassword = (payload) => ({
  type: t.CHANGE_PASSWORD,
  payload,
})

export const changeState = (payload) => ({
  type: t.CHANGE_STATE,
  payload,
})

export const changeUsername = (payload) => ({
  type: t.CHANGE_USERNAME,
  payload,
})

export const checkEmailAvailability = (payload) => ({
  type: t.CHECK_EMAIL_AVAILABILITY,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/check', ...payload },
      rollback: { type: t.CHECK_EMAIL_AVAILABILITY_ERROR },
      commit: { type: t.CHECK_EMAIL_AVAILABILITY_SUCCESS },
    },
  },
})

export const checkUsernameAvailability = (payload) => ({
  type: t.CHECK_USERNAME_AVAILABILITY,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/check', ...payload },
      rollback: { type: t.CHECK_USERNAME_AVAILABILITY_ERROR },
      commit: { type: t.CHECK_USERNAME_AVAILABILITY_SUCCESS },
    },
  },
})

export const continueOnboarding = (payload = {}) => ({
  type: t.CONTINUE_ONBOARDING,
  payload,
})

export const giveParentalConfirmation = (payload) => ({
  type: t.GIVE_PARENTAL_CONFIRMATION,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/parentalverification', method: 'POST' },
      rollback: { type: t.GIVE_PARENTAL_CONFIRMATION_ERROR },
      commit: { type: t.GIVE_PARENTAL_CONFIRMATION_SUCCESS },
    },
  },
})

export const handleBan = (payload) => ({
  type: t.HANDLE_BAN,
  payload,
})

export const login = (payload, method) => ({
  type: t.LOGIN,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'tokens/create', method: 'POST' },
      rollback: { type: t.LOGIN_ERROR },
      commit: {
        type: t.LOGIN_SUCCESS,
        meta: { payload, method },
      },
    },
  },
})

export const loginLegacy = (payload) => ({
  type: t.LOGIN_LEGACY,
  payload,
  meta: {
    offline: {
      effect: {
        path: 'tokens/create/instagram/callback?web=true',
        ...payload,
      },
      rollback: { type: t.LOGIN_LEGACY_ERROR },
      commit: {
        type: t.LOGIN_LEGACY_SUCCESS,
        meta: { method: 'Instagram' },
      },
    },
  },
})

export const loginSuccess = ({ accessToken, lang, userId }, method, meta) => ({
  type: t.LOGIN_SUCCESS,
  payload: { accessToken, lang, method, userId },
  meta: { method, ...meta },
})

export const loginWithApple = (payload) => ({
  type: t.LOGIN_WITH_APPLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'tokens/create/apple', method: 'POST' },
      rollback: { type: t.LOGIN_WITH_APPLE_ERROR },
      commit: {
        type: t.LOGIN_WITH_APPLE_SUCCESS,
        meta: { ...payload, service: SERVICE.APPLE },
      },
    },
  },
})

export const loginWithGoogle = (payload) => ({
  type: t.LOGIN_WITH_GOOGLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'tokens/create/google', method: 'POST' },
      rollback: { type: t.LOGIN_WITH_GOOGLE_ERROR },
      commit: {
        type: t.LOGIN_WITH_GOOGLE_SUCCESS,
        meta: { ...payload, service: SERVICE.GOOGLE },
      },
    },
  },
})

export const refreshIsBanned = () => ({
  type: t.REFRESH_BANNED_STATUS,
  meta: {
    offline: {
      effect: { path: 'check/updates' },
      rollback: { type: t.REFRESH_BANNED_STATUS_ERROR },
      commit: { type: t.REFRESH_BANNED_STATUS_SUCCESS },
    },
  },
})

export const register = (payload) => ({
  type: t.REGISTER,
  payload,
  meta: {
    offline: {
      shouldNotEnqueueMultiple: true,
      effect: { path: 'accounts/register', method: 'POST' },
      rollback: { type: t.REGISTER_ERROR },
      commit: { type: t.REGISTER_SUCCESS },
    },
  },
})

export const registerWithApple = (payload) => ({
  type: t.REGISTER_WITH_APPLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/register/apple', method: 'POST' },
      rollback: { type: t.REGISTER_WITH_APPLE_ERROR },
      commit: {
        type: t.REGISTER_WITH_APPLE_SUCCESS,
        meta: { ...payload, service: SERVICE.APPLE },
      },
    },
  },
})

export const registerWithGoogle = (payload) => ({
  type: t.REGISTER_WITH_GOOGLE,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/register/google', method: 'POST' },
      rollback: { type: t.REGISTER_WITH_GOOGLE_ERROR },
      commit: {
        type: t.REGISTER_WITH_GOOGLE_SUCCESS,
        meta: { ...payload, service: SERVICE.GOOGLE },
      },
    },
  },
})

export const requestAttributedUser = (payload) => ({
  type: t.REQUEST_ATTRIBUTED_USER,
  payload,
  meta: {
    offline: {
      effect: { path: `profiles/id/${payload.userId}` },
      rollback: { type: t.REQUEST_ATTRIBUTED_USER_ERROR },
      commit: {
        type: t.REQUEST_ATTRIBUTED_USER_SUCCESS,
        meta: payload,
      },
    },
  },
})

export const requestPassword = (payload) => ({
  type: t.REQUEST_PASSWORD,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/forgotpassword', method: 'POST' },
      rollback: { type: t.REQUEST_PASSWORD_ERROR },
      commit: { type: t.REQUEST_PASSWORD_SUCCESS },
    },
  },
})

export const resetPassword = (payload, method) => ({
  type: t.RESET_PASSWORD,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/resetpassword', method: 'POST' },
      rollback: { type: t.RESET_PASSWORD_ERROR },
      commit: { type: t.RESET_PASSWORD_SUCCESS, meta: { method } },
    },
  },
})

export const resetAuthentication = (payload) => ({
  type: t.RESET_AUTHENTICATION,
  payload,
})

export const syncDeviceBanInformation = (payload) => ({
  type: t.SYNC_DEVICE_BAN_INFORMATION,
  payload,
  meta: {
    offline: {
      effect: { path: 'accounts/device/validate-token-update', method: 'POST' },
      rollback: { type: t.SYNC_DEVICE_BAN_INFORMATION_ERROR },
      commit: { type: t.SYNC_DEVICE_BAN_INFORMATION_SUCCESS },
    },
  },
})

export const setHasAcceptedTerms = (payload) => ({
  type: t.SET_HAS_ACCEPTED_TERMS,
  payload,
})

export const setHasPromptedPushPermission = (payload) => ({
  type: t.SET_HAS_PROMPTED_PUSH_PERMISSION,
  payload,
})

export const showAppleLogin = (payload) => ({
  type: t.SHOW_APPLE_LOGIN,
  payload,
})

export const showGoogleLogin = (payload) => ({
  type: t.SHOW_GOOGLE_LOGIN,
  payload,
})

export const setIsBanned = (payload) => ({
  type: t.SET_IS_BANNED,
  payload,
})

export const setShouldShowGoogleIdentityServiceButton = (payload) => ({
  type: t.SET_SHOULD_SHOW_GOOGLE_IDENTITY_SERVICE_BUTTON,
  payload,
})
