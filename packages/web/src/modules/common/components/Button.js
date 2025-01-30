import React from 'react'
import Text from 'react-native-web/dist/exports/Text'
import { Radium } from '../hocs/Radium'
import { getDisabledTintColor, getUserTintColor } from '../styles/helpers'
import { theme } from '../styles/theme'
import { Spinner } from './Spinner'
import { getEllipsizeTextStyles } from './Text'
import { View } from './View'

export const defaultStyle = {
  borderRadius: 24,
  borderStyle: 'solid',
  cursor: 'pointer',
  paddingHorizontal: 12,
  paddingVertical: 6,
  marginBottom: 6,
  marginTop: 6,
  color: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  ':active': {
    opacity: 0.8,
  },
}

export const outlineStyle = (tintColorHex) => ({
  backgroundColor: theme.colors.transparent,
  borderWidth: 1,
  borderColor: tintColorHex,
})

export const whiteOutlineStyle = {
  backgroundColor: theme.colors.transparent,
  borderWidth: 1,
  borderColor: theme.colors.white,
}

export const primaryStyle = (tintColorHex) => ({
  backgroundColor: tintColorHex,
  borderWidth: 1,
  borderColor: tintColorHex,
})

export const grayStyle = {
  backgroundColor: theme.colors.placeholder,
  borderColor: theme.colors.placeholder,
}

export const whiteStyle = {
  backgroundColor: theme.colors.white,
  borderColor: theme.colors.white,
}

export const bigStyle = {
  '@media (min-width: 321px)': {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
}

export const narrowStyle = {
  paddingHorizontal: 12,
}

const styles = {
  newSpinnerStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  textTransparent: { color: 'transparent' },
  wrapper: { position: 'relative' },
}

export const Button = Radium(
  ({
    anonymous,
    backgroundColor,
    borderColor,
    big,
    children,
    color,
    cta,
    desktopStyle,
    disabled,
    gray,
    isFetching,
    isSupportingNewSpinnerHandling = false,
    narrow,
    onPress,
    outline,
    primary = true,
    primaryGradient,
    spinnerSize,
    style,
    textEllipsisWidth,
    textStyle,
    textType,
    tintColor,
    white,
    whiteOutline,
    disabledStyle = {},
    ...props
  }) => {
    const tintColorHex = getUserTintColor(tintColor)
    const disabledTintColor = getDisabledTintColor(tintColor)

    return (
      <button
        type="button"
        onClick={onPress}
        disabled={disabled || isFetching}
        {...props}
        style={[
          defaultStyle,
          primary && primaryStyle(tintColorHex),
          primaryGradient && {
            background: 'linear-gradient(135deg, #FF5BB5, #ED0063)',
          },
          outline && outlineStyle(tintColorHex),
          white && whiteStyle,
          whiteOutline && whiteOutlineStyle,
          anonymous && {
            paddingHorizontal: 6,
            paddingVertical: 7,
          },
          big && bigStyle,
          cta && {
            backgroundColor: tintColorHex,
            borderColor: tintColorHex,
          },
          narrow && narrowStyle,

          backgroundColor && { backgroundColor },
          gray && grayStyle,
          borderColor && { borderColor, borderWidth: 1 },
          color && { color },
          disabled && {
            cursor: 'not-allowed',
            backgroundColor: disabledTintColor,
            borderColor: disabledTintColor,
            ...disabledStyle,
          },
          isFetching && { cursor: 'waiting' },
          style,
          desktopStyle && {
            '@media (min-width: 768px)': {
              ...desktopStyle,
            },
          },
          isFetching &&
            typeof style?.paddingVertical === 'undefined' && {
              paddingVertical: 4.5,
            },
        ]}>
        <View style={styles.wrapper}>
          {isFetching && isSupportingNewSpinnerHandling === false ? (
            <View
              style={{
                marginHorizontal: big ? 20 : 12,
                marginVertical: big ? 4.5 : 0,
              }}>
              <Spinner
                color={
                  white || whiteOutline ? tintColorHex : theme.colors.white
                }
                size="small"
              />
            </View>
          ) : typeof children === 'string' ? (
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                {
                  marginHorizontal: 6,
                  marginVertical: big ? 2 : 0,
                  color: white || outline ? tintColorHex : theme.colors.white,
                  textAlign: 'center',
                  fontSize: textType
                    ? theme.fontSizes[textType]
                    : big
                    ? theme.fontSizes.h4
                    : theme.fontSizes.small,
                },
                textEllipsisWidth && getEllipsizeTextStyles(textEllipsisWidth),
                textStyle,
                isFetching &&
                  isSupportingNewSpinnerHandling &&
                  styles.textTransparent,
              ]}>
              {isFetching && isSupportingNewSpinnerHandling ? (
                <Spinner
                  color={theme.colors.white}
                  size={spinnerSize ?? 'small'}
                  style={styles.newSpinnerStyle}
                />
              ) : null}
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </button>
    )
  }
)
