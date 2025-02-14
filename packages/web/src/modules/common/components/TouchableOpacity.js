import React from 'react'
import { Radium } from '../hocs/Radium'
import { theme } from '../styles/theme'

const mobileOnly = {
  '@media (min-width: 768px)': {
    display: 'none',
  },
}

const desktopOnly = {
  '@media (max-width: 767px)': {
    display: 'none',
  },
}

const filterStyles = (styleObject) => {
  if (typeof styleObject === 'undefined') {
    return undefined
  }

  return Object.keys(styleObject).reduce((acc, key) => {
    if (key === ':disabled') {
      return { ...acc, ...styleObject[key] }
    }

    if (key.includes(':')) {
      return acc
    }

    acc[key] = styleObject[key]

    return acc
  }, {})
}

export const TouchableOpacity = Radium(
  ({
    children,
    desktop = false,
    desktopStyle = undefined,
    disabled,
    forwardRef,
    mobile = false,
    onLongPress,
    onPress = () => {},
    style,
    ...props
  }) => {
    const timeoutRef = React.useRef(null)

    const handleMouseDown = () => {
      timeoutRef.current = setTimeout(onLongPress, 3000)
    }

    const handleMouseUp = () => {
      clearTimeout(timeoutRef.current)
    }

    const disabledStyle = (() => {
      if (Array.isArray(style)) {
        return style.map((st) => filterStyles(st))
      }

      return filterStyles(style)
    })()

    return (
      <div
        ref={forwardRef}
        onClick={
          disabled
            ? () => {}
            : (e) => {
                e.stopPropagation()
                onPress(e)
              }
        }
        style={[
          {
            cursor: disabled ? 'default' : 'pointer',
            color: theme.colors.text,
            display: 'flex',
            flexDirection: 'column',
          },
          disabled ? disabledStyle : style,
          mobile && mobileOnly,
          desktop && desktopOnly,
          desktopStyle && {
            '@media (min-width: 768px)': {
              ...desktopStyle,
            },
          },
        ]}
        {...(typeof onLongPress === 'function'
          ? { onMouseDown: handleMouseDown, onMouseUp: handleMouseUp }
          : {})}
        {...props}>
        {children}
      </div>
    )
  }
)
