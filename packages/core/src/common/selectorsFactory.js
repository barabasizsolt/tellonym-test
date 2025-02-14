import {
  compose,
  concat,
  converge,
  head,
  map,
  mergeRight,
  tail,
  toUpper,
  transduce,
} from 'ramda'
import { createSelector } from 'reselect'

export const commonFlatListProps = {
  _rerenderItem: {
    ids: [],
    count: 0,
  },
  hasBadge: false,
  hasFetchFailed: false,
  hasMore: false,
  hasRefreshed: false,
  hasScrollTopLabel: false,
  hasUpdate: false,
  isFetching: false,
  isRefreshing: false,
  refreshedAt: undefined,
}

const commonFields = Object.keys(commonFlatListProps)

const createSelectorName = converge(compose(concat('get'), concat), [
  compose(toUpper, head),
  tail,
])
const selectorCreator = (name) => (key) => {
  const selectorName = createSelectorName(key)

  const selector = (state) => state[name][key]

  return { [selectorName]: selector }
}

const createTransducer = compose(map, selectorCreator)

/**
 * Creates all selectors that you need for a FlatList. Use this if your flags are not nested in the reducer.
 *
 * @param {String} name The name of the module
 * @returns {Object} The created selectors
 */
export const createCommonSelectors = (name) =>
  transduce(createTransducer(name), mergeRight, {}, commonFields)

const memoizedSelectorCreator = (pathSelector) => (key) => {
  const selectorName = createSelectorName(key)

  const selector = createSelector(
    pathSelector,
    (subState) => subState?.[key] ?? commonFlatListProps[key]
  )

  return { [selectorName]: selector }
}

const createMemoizedTransducer = compose(map, memoizedSelectorCreator)

/**
 * Creates all selectors that you need for a FlatList. Use this if you want to access state that is deeper
 * than 1 level in the redux state. Pass it a selector that returns the object where all the flags are located.
 * You also have access to the props in that function. See selectorsFactory.test.js for an example.
 * This function also returns the value of commonFlatListProps as a default value if the prop
 * does not exist in the return value of pathSelector. This behaviour is different to 'createCommonSelectors'.
 * This selector implements createSelector to use memoization. If you don't do computation in pathSelector
 * use createCommonSelectorsV2 instead.
 *
 * @param {Function} pathSelector Receives state and props and returns a substate on the level of the flags.
 * @returns {Object} The created selectors
 */

export const createMemoizedCommonSelectors = (pathSelector) =>
  transduce(
    createMemoizedTransducer(pathSelector),
    mergeRight,
    {},
    commonFields
  )

const selectorCreatorV2 = (pathSelector) => (key) => {
  const selectorName = createSelectorName(key)

  const selector = (state, props) =>
    pathSelector(state, props)?.[key] ?? commonFlatListProps[key]

  return { [selectorName]: selector }
}

const createTransducerV2 = compose(map, selectorCreatorV2)

/**
 * Creates all selectors that you need for a FlatList. Use this if you want to access state that is deeper
 * than 1 level in the redux state. Pass it a selector that returns the object where all the flags are located.
 * You also have access to the props in that function. See selectorsFactory.test.js for an example.
 * This function also returns the value of commonFlatListProps as a default value if the prop
 * does not exist in the return value of pathSelector. This behaviour is different to 'createCommonSelectors'.
 *
 * @param {Function} pathSelector Receives state and props and returns a substate on the level of the flags.
 * @returns {Object} The created selectors
 */

export const createCommonSelectorsV2 = (pathSelector) =>
  transduce(createTransducerV2(pathSelector), mergeRight, {}, commonFields)
