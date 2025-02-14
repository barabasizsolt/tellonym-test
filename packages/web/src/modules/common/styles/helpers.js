import { premiumColors } from '@tellonym/core/common/colorSystem'

const { DEFAULT } = {}

const getColorsObjectForTintColor = (tintColor = DEFAULT) =>
  premiumColors[tintColor] ?? premiumColors[DEFAULT]

export const getBannerTintColor = (tintColor) =>
  getColorsObjectForTintColor(tintColor).banner

export const getUserTintColor = (tintColor) =>
  getColorsObjectForTintColor(tintColor).default

export const getInputTintColor = (tintColor) =>
  getColorsObjectForTintColor(tintColor).input

export const getDisabledTintColor = (tintColor) =>
  getColorsObjectForTintColor(tintColor).disabled
