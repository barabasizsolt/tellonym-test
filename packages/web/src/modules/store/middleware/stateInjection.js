import { getAccessToken } from '@tellonym/core/app/selectors'
import { getActiveExperimentId } from '@tellonym/core/experiments/selectors'
import { _, history } from '../../common'

export const stateInjection = (store) => (next) => (action) => {
  const isEvent = action.type.startsWith('events/')
  const isReduxOfflineAction = !isEvent && action.type.includes('Offline/')

  _.crumb({
    category: isEvent ? 'event' : 'action',
    message: action.type,
    data: {
      route: { routeName: history.location.pathname },
    },
  })

  if (isReduxOfflineAction) {
    return next(action)
  }

  const state = store.getState()

  const enhancedAction = {
    ...action,
    meta: {
      ...action.meta,
      createdAt: Date.now(),
      /**
       * TODO: remove currentRoute once frontend migrated to v24+
       */
      currentRoute: { routeName: history.location.pathname },
      route: { name: history.location.pathname, state: history.location.state },
      setup: {
        accessToken: action.meta?.offline ? getAccessToken(state) : undefined,
        expId: getActiveExperimentId(state),
      },
    },
  }

  return next(enhancedAction)
}
