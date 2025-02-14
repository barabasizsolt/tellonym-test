import React from 'react'
import { Radium } from '../hocs/Radium'

const defaultStyle = {
  display: 'flex',
  flexDirection: 'column',
}

export const View = Radium(
  ({ desktopStyle, forwardRef, onPress, style, ...props }) => (
    <div
      {...props}
      ref={forwardRef}
      onClick={onPress}
      style={[
        defaultStyle,
        style,
        desktopStyle && {
          '@media (min-width: 768px)': {
            ...desktopStyle,
          },
        },
      ]}
    />
  )
)
