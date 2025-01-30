import { PERSIST_REHYDRATE } from '@tellonym/redux-offline/lib/constants'
import { LOGOUT_SUCCESS, REMOVE_ACCOUNT_SUCCESS } from '../../profile/types'
import { configureRootReducer } from '../configureRootReducer'

const defaultModules = [
  {
    name: 'offline',
    reducer: (s = {}) => s,
    initialState: {},
  },
]

describe('store/configureRootReducer', () => {
  describe('reducer', () => {
    it('resets modules to initial state on logout & remove account', () => {
      const initialState = { bar: 'test', foo: 'bar' }
      const modules = defaultModules.concat([
        {
          name: 'foo',
          reducer: (s = initialState) => s,
          initialState,
        },
      ])

      const rootReducer = configureRootReducer({ modules })

      const state = {
        foo: {
          bar: 'test',
          foo: 'test',
        },
      }

      const expected = {
        foo: {
          bar: 'test',
          foo: 'bar',
        },
        offline: {},
      }

      const actualLogout = rootReducer(state, { type: LOGOUT_SUCCESS })
      const actualRemoveAccount = rootReducer(state, {
        type: REMOVE_ACCOUNT_SUCCESS,
      })

      expect(actualLogout).toEqual(expected)
      expect(actualRemoveAccount).toEqual(expected)
    })

    it('uses persistence.clear on logout & remove account', () => {
      const initialState = { foo: 'bar' }
      const modules = defaultModules.concat([
        {
          name: 'foo',
          persistence: { clear: () => ({ foo: 'clear' }) },
          reducer: (s = initialState) => s,
          initialState,
        },
      ])

      const rootReducer = configureRootReducer({
        modules,
      })

      const state = {
        foo: {
          foo: 'test',
        },
      }

      const expected = {
        foo: {
          foo: 'clear',
        },
        offline: {},
      }

      const actualLogout = rootReducer(state, { type: LOGOUT_SUCCESS })
      const actualRemoveAccount = rootReducer(state, {
        type: REMOVE_ACCOUNT_SUCCESS,
      })

      expect(actualLogout).toEqual(expected)
      expect(actualRemoveAccount).toEqual(expected)
    })

    it('uses persistence.protect on logout & remove account', () => {
      const initialState = { foo: 'bar', foo2: undefined }
      const modules = defaultModules.concat([
        {
          name: 'foo',
          persistence: { protect: ['foo'] },
          reducer: (s = initialState) => s,
          initialState,
        },
      ])

      const rootReducer = configureRootReducer({
        modules,
      })

      const state = {
        foo: {
          foo: 'test',
          foo2: 'test',
        },
      }

      const expected = {
        foo: {
          foo: 'test',
          foo2: undefined,
        },
        offline: {},
      }

      const actualLogout = rootReducer(state, { type: LOGOUT_SUCCESS })
      const actualRemoveAccount = rootReducer(state, {
        type: REMOVE_ACCOUNT_SUCCESS,
      })

      expect(actualLogout).toEqual(expected)
      expect(actualRemoveAccount).toEqual(expected)
    })

    describe('migrate', () => {
      it('does not migrate if store version is equal', () => {
        const initialStateApp = { storeVersion: '1.0.0' }
        const initialStateFoo = { foo: 'bar' }
        const modules = defaultModules.concat([
          {
            name: '__app__',
            reducer: (s = initialStateApp) => s,
            initialState: initialStateApp,
          },
          {
            name: 'foo',
            reducer: (s = initialStateFoo) => s,
            initialState: initialStateFoo,
          },
        ])

        const migrationFunction = jest.fn((state) => ({
          ...state,
          foo: { ...state.foo, foo: 'appliedMigration' },
        }))

        const migrations = {
          '1.0.0': migrationFunction,
        }

        const rootReducer = configureRootReducer({
          migrations,
          modules,
          version: '1.0.0',
        })

        const state = {
          __app__: {
            storeVersion: '1.0.0',
          },
          foo: {
            foo: 'test',
          },
        }

        const expected = {
          __app__: {
            storeVersion: '1.0.0',
          },
          foo: {
            foo: 'test',
          },
          offline: {},
        }

        const actual = rootReducer(state, {
          type: PERSIST_REHYDRATE,
          payload: { __app__: {}, foo: {} },
        })

        expect(migrationFunction).not.toBeCalled()
        expect(actual).toEqual(expected)
      })

      it('applies migration if current store version is lower than target store version', () => {
        const initialStateApp = { storeVersion: '1.0.0' }
        const initialStateFoo = { foo: 'bar' }
        const modules = defaultModules.concat([
          {
            name: '__app__',
            reducer: (s = initialStateApp) => s,
            initialState: initialStateApp,
          },
          {
            name: 'foo',
            reducer: (s = initialStateFoo) => s,
            initialState: initialStateFoo,
          },
        ])

        const migrationFunction = jest.fn((state) => ({
          ...state,
          foo: { ...state.foo, foo: 'appliedMigration' },
        }))

        const migrations = {
          '2.0.0': migrationFunction,
        }

        const rootReducer = configureRootReducer({
          migrations,
          modules,
          version: '2.0.0',
        })

        const state = {
          __app__: {
            storeVersion: '1.0.0',
          },
          foo: {
            foo: 'test',
          },
        }

        const expected = {
          __app__: {
            storeVersion: '2.0.0',
          },
          foo: {
            foo: 'appliedMigration',
          },
          offline: {},
        }

        const actual = rootReducer(state, {
          type: PERSIST_REHYDRATE,
          payload: { __app__: {}, foo: {} },
        })

        expect(migrationFunction).toBeCalled()
        expect(actual).toEqual(expected)
      })
    })
  })
})
