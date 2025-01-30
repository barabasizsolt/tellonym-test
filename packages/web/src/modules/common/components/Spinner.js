import React from 'react'
import ActivityIndicator from 'react-native-web/dist/exports/ActivityIndicator'
import { theme } from '../styles/theme'

export const Spinner = ({ color, size = 'large', style }) => (
  <ActivityIndicator
    color={color || theme.colors.primary}
    size={size}
    style={style}
  />
)
