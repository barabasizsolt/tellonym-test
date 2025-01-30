import { faTimes } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { theme } from '../styles/theme'
import { Icon } from './Icon'
import { TouchableOpacity } from './TouchableOpacity'
import { View } from './View'

export const Card = ({
  children,
  onPressClose = undefined,
  style = undefined,
  ...props
}) => (
  <View
    style={[
      {
        backgroundColor: theme.colors.background,
        borderRadius: 24,
        position: 'relative',
        padding: 16,
        width: '80%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
      },
      style,
    ]}
    {...props}>
    {onPressClose && (
      <View style={{ alignItems: 'flex-end', width: '100%' }}>
        <TouchableOpacity onPress={onPressClose}>
          <Icon icon={faTimes} color={theme.colors.icon} />
        </TouchableOpacity>
      </View>
    )}
    {children}
  </View>
)
