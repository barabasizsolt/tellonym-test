import * as PropsStyles from '@tellonym/core/constants/PropsStyles'
import { mergeRight, omit, pick } from 'ramda'
import React from 'react'
import { colors } from '../styles/colors'
import { TouchableOpacity } from './TouchableOpacity'
import { View } from './View'

/**
 * Set to true to randomize the background color of all boxes for easier debugging.
 */
const RANDOM_BACKGROUND_COLOR = false

const styleProps = [
  PropsStyles.alignContent,
  PropsStyles.alignItems,
  PropsStyles.alignSelf,
  PropsStyles.aspectRatio,
  PropsStyles.backgroundColor,
  PropsStyles.borderBottomColor,
  PropsStyles.borderBottomEndRadius,
  PropsStyles.borderBottomLeftRadius,
  PropsStyles.borderBottomRightRadius,
  PropsStyles.borderBottomStartRadius,
  PropsStyles.borderBottomWidth,
  PropsStyles.borderColor,
  PropsStyles.borderEndColor,
  PropsStyles.borderEndWidth,
  PropsStyles.borderLeftColor,
  PropsStyles.borderLeftWidth,
  PropsStyles.borderRadius,
  PropsStyles.borderRightColor,
  PropsStyles.borderRightWidth,
  PropsStyles.borderStartColor,
  PropsStyles.borderStartWidth,
  PropsStyles.borderStyle,
  PropsStyles.borderTopColor,
  PropsStyles.borderTopEndRadius,
  PropsStyles.borderTopLeftRadius,
  PropsStyles.borderTopRightRadius,
  PropsStyles.borderTopStartRadius,
  PropsStyles.borderTopWidth,
  PropsStyles.borderWidth,
  PropsStyles.bottom,
  PropsStyles.boxShadow,
  PropsStyles.color,
  PropsStyles.cursor,
  PropsStyles.display,
  PropsStyles.elevation,
  PropsStyles.flex,
  PropsStyles.flexBasis,
  PropsStyles.flexDirection,
  PropsStyles.flexGrow,
  PropsStyles.flexShrink,
  PropsStyles.flexWrap,
  PropsStyles.height,
  PropsStyles.justifyContent,
  PropsStyles.left,
  PropsStyles.margin,
  PropsStyles.marginBottom,
  PropsStyles.marginEnd,
  PropsStyles.marginHorizontal,
  PropsStyles.marginLeft,
  PropsStyles.marginRight,
  PropsStyles.marginStart,
  PropsStyles.marginTop,
  PropsStyles.marginVertical,
  PropsStyles.maxHeight,
  PropsStyles.maxWidth,
  PropsStyles.minHeight,
  PropsStyles.minWidth,
  PropsStyles.opacity,
  PropsStyles.overflow,
  PropsStyles.padding,
  PropsStyles.paddingBottom,
  PropsStyles.paddingEnd,
  PropsStyles.paddingHorizontal,
  PropsStyles.paddingLeft,
  PropsStyles.paddingRight,
  PropsStyles.paddingStart,
  PropsStyles.paddingTop,
  PropsStyles.paddingVertical,
  PropsStyles.position,
  PropsStyles.right,
  PropsStyles.shadowColor,
  PropsStyles.shadowOffset,
  PropsStyles.shadowOpacity,
  PropsStyles.shadowRadius,
  PropsStyles.top,
  PropsStyles.width,
  PropsStyles.zIndex,
]

export const Box = React.forwardRef((props, ref) => {
  const computed = React.useMemo(() => {
    const backgroundColor =
      __DEV__ && RANDOM_BACKGROUND_COLOR
        ? `#${Math.floor(Math.random() * 16777215).toString(16)}`
        : props.backgroundColor ??
          (props.transparent ? 'transparent' : colors.background)

    return {
      isTouchable:
        props.onPress ||
        props.onLongPress ||
        props.onPressIn ||
        props.onPressOut,
      props: omit(styleProps, props),
      style: [
        mergeRight(pick(styleProps, props), {
          backgroundColor,
        }),
        props.style,
      ],
    }
  }, [props])

  if (computed.isTouchable) {
    return (
      <TouchableOpacity
        {...computed.props}
        forwardRef={ref}
        style={computed.style}
      />
    )
  }

  return <View {...computed.props} forwardRef={ref} style={computed.style} />
})
