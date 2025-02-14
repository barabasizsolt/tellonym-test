import React from 'react'
import { theme } from '../styles/theme'
import { RNImage } from './Image'
import { Text } from './Text'
import { View } from './View'

export const Empty = ({
  bigIcon = false,
  color = undefined,
  headline = undefined,
  icon = true,
  text = undefined,
  smile = true,
}) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      margin: 16,
    }}>
    {icon && (
      <RNImage
        alt={smile ? 'happy_tello' : 'sad_tello'}
        style={{
          height: bigIcon ? 130 : 80,
          marginBottom: 16,
          tintColor: theme.colors.lightThemePrimarySimilar,
          width: bigIcon ? 130 : 80,
        }}
        source={
          smile
            ? '/assets/img/placeholder_happy.png'
            : '/assets/img/placeholder_sad.png'
        }
      />
    )}
    <Text
      type="h4"
      color={color || theme.colors.lightThemePrimarySimilar}
      style={{ textAlign: 'center' }}>
      {headline}
    </Text>
    <Text
      type="small"
      color={color || theme.colors.lightThemePrimarySimilar}
      style={{ textAlign: 'center', marginTop: headline ? 30 : undefined }}>
      {text}
    </Text>
  </View>
)
