import React from 'react'
import { theme } from '../styles/theme'
import { Text } from './Text'
import { TouchableOpacity } from './TouchableOpacity'

export const ModalOption = ({
  children,
  onPress = undefined,
  hasBorderBottom = false,
  hasBorderTop = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        paddingVertical: 16,
        width: '100%',
      },
      hasBorderBottom && {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.separator,
      },
      hasBorderTop && {
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: theme.colors.separator,
      },
    ]}>
    {typeof children === 'string' ? <Text center>{children}</Text> : children}
  </TouchableOpacity>
)
