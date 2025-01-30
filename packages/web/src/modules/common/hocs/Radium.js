import R from 'radium'
import friendlyPseudos from 'radium-plugin-friendly-pseudos'

const resolveHorizontalAndVertical = ({ style = {}, ...props }) => {
  const {
    margin,
    marginVertical,
    marginHorizontal,
    padding,
    paddingHorizontal,
    paddingVertical,
    ...restStyles
  } = style

  const transformedStyles = {}

  if (typeof margin === 'number') {
    transformedStyles.marginTop = margin
    transformedStyles.marginRight = margin
    transformedStyles.marginBottom = margin
    transformedStyles.marginLeft = margin
  } else if (typeof margin === 'string') {
    transformedStyles.margin = margin
  }

  if (marginHorizontal) {
    transformedStyles.marginRight = marginHorizontal
    transformedStyles.marginLeft = marginHorizontal
  }

  if (marginVertical) {
    transformedStyles.marginTop = marginVertical
    transformedStyles.marginBottom = marginVertical
  }

  if (typeof padding === 'number') {
    transformedStyles.paddingTop = padding
    transformedStyles.paddingRight = padding
    transformedStyles.paddingBottom = padding
    transformedStyles.paddingLeft = padding
  } else if (typeof padding === 'string') {
    transformedStyles.padding = padding
  }

  if (paddingHorizontal) {
    transformedStyles.paddingRight = paddingHorizontal
    transformedStyles.paddingLeft = paddingHorizontal
  }

  if (paddingVertical) {
    transformedStyles.paddingTop = paddingVertical
    transformedStyles.paddingBottom = paddingVertical
  }

  return { ...props, style: { ...transformedStyles, ...restStyles } }
}

export const Radium = (Component) =>
  R({
    plugins: [
      R.Plugins.mergeStyleArray,
      R.Plugins.checkProps,
      R.Plugins.resolveMediaQueries,
      friendlyPseudos,
      resolveHorizontalAndVertical,
      R.Plugins.resolveInteractionStyles,
      R.Plugins.keyframes,
      R.Plugins.prefix,
      R.Plugins.checkProps,
      // ({ componentName, style }) => console.log(componentName, style),
    ],
  })(Component)
