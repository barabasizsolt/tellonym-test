const borderValues = [1, 2]
const borderDirections = ['top', 'right', 'bottom', 'left']
const flexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const spacingValues = [0, 1, 2, 4, 8, 10, 12, 16, 24, 32, 48, 50, 150]
const directions = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical']

/**
 * @param {string} metric 'padding' or 'margin'
 * @returns {{ [metric]: { [direction]: { [distance]: { [cssProp]: number } }} }}
 */
const getDistanceMapFor = (metric) =>
  directions.reduce(
    (acc, key) => ({
      ...acc,
      [key]: spacingValues.reduce(
        (acc, num) => ({
          ...acc,
          [num]: {
            [`${metric}${key[0].toUpperCase()}${key.substring(1)}`]: num,
          },
        }),
        {}
      ),
    }),
    spacingValues.reduce((acc, num) => ({
      ...acc,
      [num]: { [metric]: num },
    }))
  )

const margin = getDistanceMapFor('margin')
const padding = getDistanceMapFor('padding')

const flex = flexValues.reduce((acc, flex) => ({ ...acc, [flex]: { flex } }), {
  direction: {
    row: { flexDirection: 'row' },
    column: { flexDirection: 'column' },
  },
  grow: { 1: { flexGrow: 1 } },
  wrap: { wrap: { flexWrap: 'wrap' } },
})

const border = borderValues.reduce(
  (acc, borderWidth) => {
    acc[borderWidth] = { borderWidth, borderStyle: 'solid' }

    for (const direction of borderDirections) {
      acc[direction] = {
        [`border${direction}Width`]: borderWidth,
        borderStyle: 'solid',
      }
    }

    return acc
  },
  {
    radius: {
      12: { borderRadius: 12 },
      25: { borderRadius: 25 },
    },
  }
)

export const sheets = {
  flex,
  margin,
  padding,
  border,
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  alignItems: {
    center: { alignItems: 'center' },
    end: { alignItems: 'flex-end' },
  },
  alignSelf: {
    center: { alignSelf: 'center' },
  },
  justifyContent: {
    center: { justifyContent: 'center' },
    spaceBetween: { justifyContent: 'space-between' },
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  edges: {
    top: ['top'],
    right: ['right'],
    bottom: ['bottom'],
    left: ['left'],
    horizontal: ['left', 'right'],
    vertical: ['top', 'bottom'],
  },
  flexAndWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: '50%',
  },
  header: {
    noBorder: {
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
  },
  position: {
    absolute: {
      position: 'absolute',
    },
    relative: {
      position: 'relative',
    },
  },
  textAlign: {
    center: {
      textAlign: 'center',
    },
    left: {
      textAlign: 'left',
    },
    right: {
      textAlign: 'right',
    },
  },
  textDecorationLine: { underline: { textDecorationLine: 'underline' } },
}
