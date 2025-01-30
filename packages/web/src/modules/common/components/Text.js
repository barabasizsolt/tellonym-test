import { bool } from 'prop-types'
import React from 'react'
import useFitText from 'use-fit-text'
import { Radium } from '../hocs/Radium'
import { getUserTintColor } from '../styles/helpers'
import { theme } from '../styles/theme'

export const getEllipsizeTextStyles = (maxWidth) => ({
  maxWidth,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const TextFontAdjusting = Radium(
  ({
    children,
    logLevel,
    maxFontSize,
    minFontSize,
    onFinish,
    onStart,
    resolution,
    style,
    adjustedTextStyle,
    ...props
  }) => {
    const { fontSize: adjustingFontSize, ref } = useFitText({
      logLevel,
      maxFontSize,
      minFontSize,
      onFinish,
      onStart,
      resolution,
    })

    return (
      /** Parent div is needed as adjustingFontSize is a percentage of the parent font size */
      <div style={style}>
        <div
          ref={ref}
          style={[
            {
              fontSize: adjustingFontSize,
              height: '100%',
              width: '100%',
            },
            adjustedTextStyle,
          ]}
          {...props}>
          {children}
        </div>
      </div>
    )
  }
)

class TextComponent extends React.Component {
  getChildContext() {
    return { isInAParentText: true }
  }

  render() {
    const {
      center,
      children,
      color = theme.colors.text,
      desktopStyle,
      ellipsisWidth,
      fontSize,
      fontWeight = this.props.bold
        ? 'bold'
        : this.props.semibold
        ? '600'
        : this.props.medium
        ? '500'
        : undefined,
      forwardRef,
      letterSpacing,
      lineHeight,
      onPress,
      style,
      tintColor,
      type = 'default',
      adjustsFontSizeToFit = false,
      ...props
    } = this.props

    const Component = adjustsFontSizeToFit
      ? TextFontAdjusting
      : this.context.isInAParentText
      ? 'span'
      : 'div'

    const tintColorHex = getUserTintColor(tintColor)

    return (
      <Component
        ref={forwardRef}
        onClick={onPress}
        style={[
          {
            color: tintColor ? tintColorHex : color,
            cursor: onPress ? 'pointer' : undefined,
            fontSize: fontSize ?? theme.fontSizes[type],
            fontWeight,
            letterSpacing,
            lineHeight:
              typeof lineHeight === 'number' ? `${lineHeight}px` : lineHeight,
            overflowWrap: 'break-word',
            textAlign: center ? 'center' : undefined,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            wordWrap: 'break-word',
          },
          ellipsisWidth && getEllipsizeTextStyles(ellipsisWidth),
          style,
          desktopStyle && {
            '@media (min-width: 768px)': {
              ...desktopStyle,
            },
          },
        ]}
        {...props}>
        {children}
      </Component>
    )
  }
}

TextComponent.childContextTypes = {
  isInAParentText: bool,
}

TextComponent.contextTypes = {
  isInAParentText: bool,
}

export const Text = Radium(TextComponent)
