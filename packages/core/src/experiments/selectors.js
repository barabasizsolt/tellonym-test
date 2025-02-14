import moment from 'dayjs'
import { getFeatureHint, getShouldContactsBeUploaded } from '../app/selectors'
import { config } from '../config'
import {
  getHasAllowedSearchByLocation,
  getIsPushNotificationsEnabled,
} from '../profile/selectors'
import { DO_NOT_MUTATE } from '../underscore'
import { name } from './constants'

export const getLocalExperiment = (state) => state?.experiments?.local

export const getActiveExperiment = (state) =>
  getLocalExperiment(state) ??
  state?.experiments?.active ??
  DO_NOT_MUTATE.EMPTY.OBJECT

export const getActiveExperimentName = (state) =>
  getActiveExperiment(state).name ?? 'none'

export const getActiveExperimentId = (state) => getActiveExperiment(state).id

export const getActiveExperimentFeatureAnnouncements = (state) =>
  getActiveExperiment(state).config?.featureAnnouncements ??
  DO_NOT_MUTATE.EMPTY.ARRAY

export const getHasExperimentVariant = (variant, value) => (state) =>
  getActiveExperiment(state).config?.[variant] === value

export const getHasInstaGalleryExperiment = () => false

export const getShouldShowFeatureHint = (state) => {
  const featureHint = getFeatureHint(state)

  return (
    featureHint.dailyCount < config.components.FeatureHint.maxDisplayDaily &&
    featureHint.weeklyCount < config.components.FeatureHint.maxDisplayWeekly &&
    ((!featureHint.isAllowLocationHidden &&
      !getHasAllowedSearchByLocation(state)) ||
      (!featureHint.isPushNotificationsHidden &&
        !getIsPushNotificationsEnabled(state)) ||
      (!featureHint.isContactsHidden && !getShouldContactsBeUploaded(state)) ||
      (!featureHint.isInstagramHidden &&
        moment(featureHint.answerSharedAt).diff(3, 'days')))
  )
}

export const getAdditionalListItems = (state) =>
  getActiveExperiment(state).config?.additionalListItems

export const getAdditionalListItemsForRoute = (routeName) => (state) =>
  state[name].additionalListItems[routeName]

export const getExpVariant = (variant) => (state) =>
  getActiveExperiment(state).config?.[variant]

export const getActiveExperimentConfig = (state) =>
  getActiveExperiment(state).config ?? DO_NOT_MUTATE.EMPTY.OBJECT

export const getIsFromQueue = (state) => state[name].isFromQueue
