import { effect } from '@tellonym/core/api'
import { discard } from '@tellonym/core/store/discard'
import { createLogger } from '@tellonym/core/store/middleware/createLogger'
import { errorHandlerMiddleware } from '@tellonym/core/store/middleware/errorHandlerMiddleware'
import { requestMiddleware } from '@tellonym/core/store/middleware/requestMiddleware'
import { queue } from '@tellonym/core/store/queue'
import { retry } from '@tellonym/core/store/retry'
import { createOffline } from '@tellonym/redux-offline'
import defaultOfflineConfig from '@tellonym/redux-offline/lib/defaults'
import { routerMiddleware } from 'connected-react-router'
import { mergeDeepRight } from 'ramda'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { config } from '../../config'
import { _, Alert, history, I18n } from '../common'
import { rootSaga } from '../sagas/rootSaga'
import { errorHandler } from './errorHandler'
import { analytics } from './middleware/analytics'
import { stateInjection } from './middleware/stateInjection'
import { persistOptions, rootReducer } from './rootReducer'

const {
  middleware: offlineMiddleware,
  enhanceReducer,
  enhanceStore,
} = createOffline({
  ...defaultOfflineConfig,
  ...mergeDeepRight(config.store.offline, {
    persistOptions,
    persistAutoRehydrate: false,
    effect,
    discard,
    queue,
    retry,
  }),
})

const composeEnhancers =
  process.env.REACT_APP_ENV === 'development' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware({
    onError: (e) => _.capture(e),
  })

  /**
   * The thunk middleware as to be first position so that other middlewares don't need to check if the action is a function.
   * The stateInjection comes right after as other middlewares rely on it.
   * The requestMiddleware has to be in front of the offlineMiddleware as it might decide to skip it.
   */
  const middleware = [
    thunk,
    stateInjection,
    requestMiddleware,
    offlineMiddleware,
    routerMiddleware(history),
    sagaMiddleware,
    ['development', 'testing'].includes(process.env.REACT_APP_ENV) &&
      createLogger(config.reduxLogger),
    analytics,
    errorHandlerMiddleware({
      badConnectionHandler: ({ type }) => {
        if (config.api.errorBlacklist.indexOf(type) === -1) {
          Alert.error(I18n.t('Common.noInternet'))
        }
      },
      errorHandler,
    }),
  ].filter(Boolean)

  const store = createStore(
    enhanceReducer(rootReducer),
    composeEnhancers(enhanceStore, applyMiddleware(...middleware))
  )

  sagaMiddleware.run(rootSaga)

  if (process.env.REACT_APP_ENV === 'development') {
    window.__STORE__ = store
  }

  return store
}
