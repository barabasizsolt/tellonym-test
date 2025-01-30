import * as _ from '../underscore'

export const name = 'user'

/**
 * The categories of screens that are shown during the onboarding process.
 * Screens are placed in categories to group them for further configuration,
 * e.g. persistence or skipping of screens.
 */
export const AUTH_CATEGORY = {
  CREDENTIALS: 'CREDENTIALS',
  SETTINGS: 'SETTINGS',
  SHARING: 'SHARING',
  ONBOARDING: 'ONBOARDING',
}

/**
 * The configuration that groups specific screens into categories.
 */
export const authCategoryScreenMap = {
  [AUTH_CATEGORY.CREDENTIALS]: [
    _.ScreenAuthUsername,
    _.ScreenAuthEmail,
    _.ScreenAuthPassword,
  ],
  [AUTH_CATEGORY.SETTINGS]: [
    _.ScreenAuthConnectPhone,
    _.ScreenAuthMainLanguageSelection,
  ],
  [AUTH_CATEGORY.SHARING]: [
    _.ScreenAuthSharingLink,
    _.ScreenAuthSharingCards,
    _.ScreenAuthTellsArrivingSoon,
  ],
  [AUTH_CATEGORY.ONBOARDING]: [
    _.ScreenAuthFindContacts,
    _.ScreenAuthFollowFriends,
    _.ScreenAuthPushNotifications,
    _.ScreenAuthPurchasePremium, // If at any point ScreenAuthPurchasePremium is not the last screen, we need to handle ModalPurchaseSuccess differently in handleSuccessfulPurchase in iap/sagas.js
  ],
}

/**
 * Maps a category to the category that should be skipped to
 * in case the user presses the skip button during onboarding.
 */
export const authCategorySkipToCategoryMap = {
  [AUTH_CATEGORY.SHARING]: AUTH_CATEGORY.ONBOARDING,
}

/**
 * The order in which the categories are shown during the onboarding process.
 */
export const authCategoryOrder = [
  AUTH_CATEGORY.CREDENTIALS,
  AUTH_CATEGORY.SETTINGS,
  AUTH_CATEGORY.SHARING,
  AUTH_CATEGORY.ONBOARDING,
]

/**
 * The order in which the screens are shown during the onboarding process.
 */
export const authScreenOrder = authCategoryOrder.flatMap(
  (category) => authCategoryScreenMap[category]
)

/**
 * The screens that should be persisted during the onboarding process.
 * All screens that are shown after the user received an access token
 * should be in this list. If the user closes the app on one of these
 * screens he will continue on the same screen on next app start.
 */
export const authScreensToPersist = []
  .concat(authCategoryScreenMap[AUTH_CATEGORY.SETTINGS])
  .concat(authCategoryScreenMap[AUTH_CATEGORY.SHARING])
  .concat(authCategoryScreenMap[AUTH_CATEGORY.ONBOARDING])

export const SERVICE = {
  APPLE: 'APPLE',
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
}

export const TYPE = {
  CONNECT: 'CONNECT',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
}
