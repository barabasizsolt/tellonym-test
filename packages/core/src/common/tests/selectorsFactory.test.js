import {
  createCommonSelectors,
  createMemoizedCommonSelectors,
} from '../selectorsFactory'

describe('common/selectors', () => {
  describe('createCommonSelectors', () => {
    const state = {
      foo: {
        _rerenderItem: true,
        hasMore: true,
        hasRefreshed: true,
        isFetching: false,
        isRefreshing: false,
        refreshedAt: undefined,
      },
    }

    const {
      get_rerenderItem,
      getHasMore,
      getHasRefreshed,
      getIsFetching,
      getIsRefreshing,
      getRefreshedAt,
    } = createCommonSelectors('foo')

    test('get_rerenderItem', () => {
      const expected = true
      const actual = get_rerenderItem(state)

      expect(actual).toBe(expected)
    })

    test('getHasMore', () => {
      const expected = true
      const actual = getHasMore(state)

      expect(actual).toBe(expected)
    })

    test('getHasRefreshed', () => {
      const expected = true
      const actual = getHasRefreshed(state)

      expect(actual).toBe(expected)
    })

    test('getIsFetching', () => {
      const expected = false
      const actual = getIsFetching(state)

      expect(actual).toBe(expected)
    })

    test('getIsRefreshing', () => {
      const expected = false
      const actual = getIsRefreshing(state)

      expect(actual).toBe(expected)
    })

    test('getRefreshedAt', () => {
      const expected = undefined
      const actual = getRefreshedAt(state)

      expect(actual).toBe(expected)
    })
  })

  describe('createMemoizedCommonSelectors', () => {
    it('creates common selectors with the given selector', () => {
      const state = { items: { data: { 2: { isRefreshing: true } } } }
      const props = { navigation: { id: 2 } }

      const pathSelector = (state, props) =>
        state.items.data[props.navigation.id]

      const { getIsRefreshing } = createMemoizedCommonSelectors(pathSelector)

      const expected = true
      const actual = getIsRefreshing(state, props)

      expect(actual).toBe(expected)
    })

    it('returns the default value if flag does not exist in state', () => {
      const state = { items: { data: {} } }
      const props = { navigation: { id: 2 } }

      const pathSelector = (state, props) =>
        state.items.data[props.navigation.id]

      const { getIsRefreshing } = createMemoizedCommonSelectors(pathSelector)

      const expected = false
      const actual = getIsRefreshing(state, props)

      expect(actual).toBe(expected)
    })
  })
})
