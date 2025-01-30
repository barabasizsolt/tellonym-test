import { createReducer } from '../reducers'

describe('common/reducers', () => {
  describe('createReducer', () => {
    const testFunction =
      (...args) =>
      () =>
        createReducer(...args)

    it('expects handlers as object', () => {
      const expectedErrorString =
        'Action handlers must be an object: { type: handler }'

      expect(testFunction([])).toThrow(expectedErrorString)
    })

    it('throws when ho handlers provided', () => {
      const expectedErrorString = "Action handlers can't be empty"

      expect(testFunction({})).toThrow(expectedErrorString)
    })

    it('applies right reducer', () => {
      const initialState = { foo: 'bar', bar: 'baz' }
      const handlers = {
        t1: (state, action) => ({ ...state, foo: action.payload }),
        t2: (state, action) => ({ ...state, bar: action.payload }),
      }
      const reducer = createReducer(handlers, initialState)

      const expectedResult1 = { foo: 'test', bar: 'baz' }
      const expectedResult2 = { foo: 'test', bar: 'test' }

      const actualResult1 = reducer(undefined, { type: 't1', payload: 'test' })
      const actualResult2 = reducer(actualResult1, {
        type: 't2',
        payload: 'test',
      })

      expect(actualResult1).toEqual(expectedResult1)
      expect(actualResult2).toEqual(expectedResult2)
    })
  })
})
