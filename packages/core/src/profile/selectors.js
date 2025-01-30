import { compose, prop, propOr, sortBy } from 'ramda'
import { createSelector, createStructuredSelector } from 'reselect'
import { createCommonSelectors } from '../common/selectorsFactory'
import { config } from '../config'
import * as _ from '../underscore'
import { name, supportedEmojiTypes } from './constants'

export const getState = (state) => state[name]

export const {
  get_rerenderItem,
  getHasFetchFailed,
  getHasMore,
  getHasRefreshed,
  getIsFetching,
  getIsRefreshing,
  getRefreshedAt,
} = createCommonSelectors(name)

export const getActiveLoginMethod = (state) => state[name].activeLoginMethod

export const getActiveRtPost = (state) => state[name].activeRtPost

export const getAnswers = (state) => state[name].answers

export const getHasAnswers = (state) => state[name].answers.ids.length > 0

export const getContentIdRelatedPost = (state) =>
  state[name].contentIdRelatedPost

export const getPinnedPosts = (state) => state[name].pinnedPosts

export const getPinnedPost = (state) =>
  state[name].pinnedPosts &&
  state[name].pinnedPosts.ids &&
  state[name].pinnedPosts.ids.length > 0
    ? state[name].pinnedPosts.data[state[name].pinnedPosts.ids[0]]
    : undefined

export const getProfile = (state) => state[name].profile

export const getAvailableBadges = () => 'NONE'

export const getAvatarFileName = (state) => state[name].profile.avatarFileName

export const getCaptcha = (state) => state[name].captcha

export const getAdditionalAvatars = (state) =>
  state[name].profile.additionalAvatars

export const getAvatars = (state) =>
  state[name].profile?.avatars?.data ?? _.DO_NOT_MUTATE.EMPTY.ARRAY

export const getCity = (state) => state[name].profile.city

export const getCreatedAt = (state) => state[name].profile.createdAt

export const getBadge = (state) => state[name].profile.badge || 'NONE'

export const getHasAllowedSearchByLocation = (state) =>
  state[name].profile.hasAllowedSearchByLocation

export const getCommentsPrivacySettings = (state) =>
  state[name].profile.commentsPrivacySetting

export const getHasData = (state) => Boolean(state[name].profile.createdAt)

export const getHasRefreshedRecently = (state) =>
  new Date() - getRefreshedAt(state) < config.selectors.hasRefreshedRecentlyMs

export const getIsAbleToComment = (state) => state[name].profile.isAbleToComment

export const getProfileCreatedAt = (state) => state[name].profile.createdAt

export const getProfileId = (state) => state[name].profile.id

export const getAnonymousFollowerCount = (state) =>
  state[name].profile.anonymousFollowerCount

export const getProfileIsSecureAccountRecommended = (state) =>
  state[name].profile.isSecureAccountRecommended

export const getProfilePremiumUntil = (state) =>
  state[name].profile.premiumUntil

export const getProfileLang = (state) => state[name].profile.lang

export const getProfileMainLanguage = (state) =>
  state[name].profile.mainLanguage

export const getProfileTellCount = (state) => state[name].profile.tellCount

export const getProfileAboutMe = (state) => state[name].profile.aboutMe

export const getProfileVerificationStatus = (state) =>
  state[name].profile.verificationStatus

export const getIsVerificationBannerVisible = (state) =>
  state[name].verificationBannerStatus.isVisible

export const getLastSeenVerificationBanner = (state) =>
  state[name].verificationBannerStatus.lastSeenAt

export const getProfileVerifiedSince = (state) =>
  state[name].profile.verifiedSince

export const getProfileIsVerified = (state) => state[name].profile.isVerified

export const getPurchaserId = (state) => state[name].profile.purchaserId

export const getEmoji = (state) => state[name].profile.emoji

export const getGender = (state) => state[name].profile.gender || 'UNKNOWN'

export const getType = (state) => state[name].profile.type

export const getHasPremium = (state) => state[name].profile.isPremium === true

export const getIsAdmin = (state) => state[name].profile.type === 'ADMIN'

export const getIsPushNotificationsEnabled = (state) =>
  state[name].profile.isPushNotificationsEnabled

export const getIsTellsOnlyFromRegistered = (state) =>
  state[name].isTellsOnlyFromRegistered

export const getIsSaving = (state) => state[name].isSaving

export const getIsSavingEmail = (state) => state[name].isSavingEmail

export const getIsSavingPassword = (state) => state[name].isSavingPassword

export const getIsCorrectPassword = (state) => state[name].isCorrectPassword

export const getHasSendingFailed = (state) => state[name].hasSendingFailed

export const getIsSending = (state) => state[name].isSending

export const getIsSavingPhone = (state) => state[name].isSavingPhone

export const getOccupationType = (state) => state[name].profile.occupation

export const getHasOccupation = (state) =>
  typeof state[name].profile.occupation !== 'undefined'

export const getTellDrafts = (state) => state[name].tells

export const getTgt = (state) => state[name].profile.tgt

export const getUsername = (state) => state[name].profile.username

export const getPhone = (state) =>
  state[name].profile.phone ?? _.DO_NOT_MUTATE.EMPTY.OBJECT

export const getPhoneNumber = compose(propOr('', 'number'), getPhone)

export const getPhonePrefix = compose(propOr('', 'prefix'), getPhone)

export const getLocation = (state) => state[name].profile.location

export const getLinkData = (state) =>
  state[name].profile.linkData ?? _.DO_NOT_MUTATE.EMPTY.OBJECT

export const getTellsPreferences = (state) => state[name].tellsPreferences

export const getTellPromptsPreferences = (state) =>
  state[name].tellPromptsPreferences ?? _.DO_NOT_MUTATE.EMPTY.OBJECT

export const getInactiveTellPromptsCategories = (state) =>
  getTellPromptsPreferences(state).inactiveCategories ??
  _.DO_NOT_MUTATE.EMPTY.ARRAY

export const getTintColor = (state) =>
  state[name].profile.tintColor || 'DEFAULT'

export const getStatusEmoji = (state) =>
  state[name].profile.statusEmoji || 'NONE'

export const getAchievableEmojis = compose(
  sortBy(prop('emoji')),
  propOr([], 'achievableEmojis'),
  getProfile
)

export const getStatusEmojis = (state) => state[name].statusEmojis

export const getIsCompleteProfileSliderComplete = (state) =>
  state[name].isCompleteProfileSliderComplete

export const getIsCompleteProfileSliderHidden = (state) =>
  state[name].completeProfileSliderHiddenStatus.isHidden

export const getCompleteProfileSliderHiddenBy = (state) =>
  state[name].completeProfileSliderHiddenStatus.hiddenBy

export const getCompleteProfileSliderStatusUpdatedAt = (state) =>
  state[name].completeProfileSliderHiddenStatus.updatedAt

export const getOwnInterests = (state) => state[name].profile?.interests

const getEmojisByUnlockState = (emojis) =>
  emojis.ids.reduce(
    (acc, id) => {
      const item = emojis.data[id]

      const isUnlocked =
        item.isOwned ||
        item.type === 'FREE' ||
        (item.type === 'ACHIEVABLE' && item.current >= item.goal)

      const unlockStateKey = isUnlocked ? 'unlocked' : 'locked'

      return {
        ...acc,
        [unlockStateKey]: {
          ids: [...acc[unlockStateKey].ids, id],
          data: { ...acc[unlockStateKey].data, [id]: item },
        },
      }
    },
    { locked: { ids: [], data: {} }, unlocked: { ids: [], data: {} } }
  )

const getEmojisSortedByType = (emojisByUnlockState) =>
  Object.keys(emojisByUnlockState).reduce((acc, unlockState) => {
    const emojis = emojisByUnlockState[unlockState]

    const sortedIds = emojis.ids.sort((idA, idB) => {
      const itemA = emojis.data[idA]
      const itemB = emojis.data[idB]

      return itemA.type - itemB.type
    })

    return { ...acc, [unlockState]: { ids: sortedIds, data: emojis.data } }
  }, {})

const getSortedEmojis = (emojis) => {
  const emojisByUnlockState = getEmojisByUnlockState(emojis)
  const sortedEmojisByUnlockState = getEmojisSortedByType(emojisByUnlockState)

  const mergedEmojis = {
    ids: [
      ...sortedEmojisByUnlockState.unlocked.ids,
      ...sortedEmojisByUnlockState.locked.ids,
    ],
    data: {
      ...sortedEmojisByUnlockState.unlocked.data,
      ...sortedEmojisByUnlockState.locked.data,
    },
  }

  return mergedEmojis
}

export const getStatusEmojisData = createSelector(getStatusEmojis, (data) => {
  // filter out emojis which type this app version does not support
  const supportedEmojis = (data?.emojis?.ids ?? []).reduce(
    (acc, curr) => {
      const emojiItem = data.emojis.data[curr]

      if (supportedEmojiTypes.includes(emojiItem.type)) {
        return {
          ids: [...acc.ids, curr],
          data: { ...acc.data, [curr]: emojiItem },
        }
      }

      return acc
    },
    { ids: [], data: {} }
  )

  const sortedEmojis = getSortedEmojis(supportedEmojis)

  return sortedEmojis
})

export const getHasGender = (state) => getGender(state) !== 'UNKNOWN'

export const getHasPhoneNumber = (state) =>
  state[name].profile.phone &&
  state[name].profile.phone.number &&
  state[name].profile.phone.prefix

export const getHasDisabledNotificationsDuringSession = (state) =>
  state[name].hasDisabledNotificationsDuringSession

export const getShouldRefresh = createSelector(
  getHasData,
  getHasRefreshedRecently,
  getIsRefreshing,
  (hasData, hasRefreshedRecently, isRefreshing) =>
    !hasData && !isRefreshing && !hasRefreshedRecently
)

export const getCompleteProfileSliderStatus = createStructuredSelector({
  isHidden: getIsCompleteProfileSliderHidden,
  hiddenBy: getCompleteProfileSliderHiddenBy,
  updatedAt: getCompleteProfileSliderStatusUpdatedAt,
})

export const getShouldShowCompleteProfileSlider = createSelector(
  getIsCompleteProfileSliderHidden,
  getIsCompleteProfileSliderComplete,
  (isHidden, isComplete) => !isComplete && !isHidden
)

export const getSocialFormInitialData = createSelector(
  getLinkData,
  (linkData) => {
    return (linkData?.data ?? []).reduce((acc, socialLink) => {
      acc[_.getKeyByValue('USER_LINK_TYPE', socialLink.type)] = socialLink.link
      return acc
    }, {})
  }
)

export const getAccountVerificationSelfieFileName = (state) =>
  state[name].accountVerificationSelfieFileName

export const getHasUploadingAccountVerificationSelfieError = (state) =>
  state[name].hasUploadingAccountVerificationSelfieError

export const getIsUploadingAccountVerificationSelfie = (state) =>
  state[name].isUploadingAccountVerificationSelfie

export const getIsVerifyingAccount = (state) => state[name].isVerifyingAccount

export const getShouldShowMainLanguageSelectionModalDueToAppLanguageChange = (
  state
) => state[name].shouldShowMainLanguageSelectionModalDueToAppLanguageChange

export const getIsMaintenanceMode = (state) => state[name].isMaintenanceMode
