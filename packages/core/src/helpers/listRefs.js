/**
 *  A ref could be wrapped inside a React.RefObject.
 */
const selectRef = (ref) => ref?.current ?? ref

/**
 * This method is taken and adapted from react-navigation's useScrollToTop hook.
 */
const getScrollableNode = (ref) => {
  if (!ref) {
    return undefined
  }

  if (
    'scrollToTop' in ref ||
    'scrollTo' in ref ||
    'scrollToOffset' in ref ||
    'scrollResponderScrollTo' in ref
  ) {
    // This is already a scrollable node.
    return ref
  } else if ('getScrollResponder' in ref) {
    // If the view is a wrapper like FlatList, SectionList etc.
    // We need to use `getScrollResponder` to get access to the scroll responder
    return ref.getScrollResponder()
  } else if ('getNode' in ref) {
    // When a `ScrollView` is wrapped in `Animated.createAnimatedComponent`
    // we need to use `getNode` to get the ref to the actual ScrollView.
    // Note that `getNode` is deprecated in newer versions of react-native
    // this is why we check if we already have a scrollable node above.
    return ref.getNode()
  } else {
    return ref
  }
}

/**
 * To get certain information from a FlatList we need to access its _listRef.
 * While the FlatList uses _listRef directly, the SectionList wraps it in a
 * _wrapperListRef which we need to unwrap.
 */
const getListRef = (ref) => {
  if (ref?._wrapperListRef?._listRef) {
    return ref._wrapperListRef._listRef
  }

  if (ref?._listRef) {
    return ref._listRef
  }

  return ref
}

/**
 * A ScrollView doesn't expose its scroll metrics directly. If they are available
 * we know we are dealing with a FlatList.
 */
const getIsFlatListRef = (ref) => Boolean(getListRef(ref)?._scrollMetrics)

const getFlatListRefScrollMetrics = (ref) =>
  getListRef(ref)?._scrollMetrics ?? {}

/**
 * For horizontal list we need to scroll on the x axis instead of the y axis.
 */
const getScrollAxis = (scrollable) => {
  const isHorizontal = scrollable?.props?.horizontal ?? false
  return isHorizontal ? 'x' : 'y'
}

/**
 * Inspired by react-navigation's useScrollToTop hook.
 * Selects the correct way to scroll the list.
 */
const scrollListRef = (ref, { offset = 0, animated = true }) => {
  const scrollable = getScrollableNode(ref)

  if (typeof scrollable !== 'object') {
    return
  }

  const axis = getScrollAxis(scrollable)

  if (offset === 0 && 'scrollToTop' in scrollable) {
    scrollable.scrollToTop()
  } else if ('scrollTo' in scrollable) {
    scrollable.scrollTo({ [axis]: offset, animated })
  } else if ('scrollToOffset' in scrollable) {
    scrollable.scrollToOffset({ offset, animated })
  } else if ('scrollResponderScrollTo' in scrollable) {
    scrollable.scrollResponderScrollTo({ [axis]: offset, animated })
  }
}

/**
 * Wraps a list ref to provide additional functionality and to hide
 * the complexity from dealing with different list types.
 */
export const wrapListRef = (ref) => {
  const reference = selectRef(ref)
  const innerViewRef = reference?.getInnerViewRef?.()

  return {
    isFlatList: getIsFlatListRef(reference),
    isScrollView: Boolean(innerViewRef),
    scrollTo: ({ offset, animated = true }) => {
      scrollListRef(reference, { offset, animated })
    },
    scrollToTop: (payload) => {
      scrollListRef(reference, {
        offset: 0,
        animated: payload?.animated ?? true,
      })
    },
    /**
     * Provides insights into scroll position of a FlatList.
     * Only works for FlatList.
     * @returns {{ contentLength: number, dOffset: number, dt: number, offset: number, timestamp: number, velocity: number }}
     */
    getScrollMetrics: () => getFlatListRefScrollMetrics(reference),
    /**
     * Measures the View inside the ScrollView, which provides insights into its scroll position.
     * Only works for ScrollView.
     * @returns {Promise<{ x: number, y: number, width: number, height: number, pageX: number, pageY: number }>}
     */
    measureInnerView: () =>
      new Promise((resolve, reject) => {
        if (!innerViewRef) {
          reject(new Error('wrapListRef: No inner view ref found.'))
        }

        innerViewRef.measure((x, y, width, height, pageX, pageY) =>
          resolve({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          })
        )
      }),
  }
}

const listRefMap = {}

/**
 * A store to keep track of list refs.
 */
export const listRefStore = {
  /**
   * Adds a list ref to the store.
   * @param {string} key - route.key
   * @param {object} ref - a list ref
   */
  set: (key, ref) => {
    listRefMap[key] = ref
  },
  /**
   * Removes a list ref from the store.
   * @param {string} key - route.key
   */
  remove: (key) => {
    delete listRefMap[key]
  },
  /**
   * Gets a list ref from the store.
   * @param {string} key - route.key
   * @returns {object|undefined} - a list ref or undefined
   */
  get: (key) => listRefMap[key],
  /**
   * Clears all list refs from the store.
   */
  clear: () => {
    Object.keys(listRefMap).forEach((key) => {
      delete listRefMap[key]
    })
  },
}
