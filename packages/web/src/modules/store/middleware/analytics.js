import { isCommitOrRollback } from '@tellonym/core/validations'
import { LOCATION_CHANGE } from 'connected-react-router'
import { helpers, history, _ } from '../../common'
import { Router } from '../../navigation/components/Router'

export const analytics = (store) => (next) => (action) => {
  const state = store.getState()

  if (state.__app__.areAnalyticsEnabled === false) {
    return next(action)
  }

  if (action.type === LOCATION_CHANGE) {
    _.crumb({
      category: 'Navigation',
      message: action.routeName,
      data: action.params,
    })

    if (typeof window.ga === 'function') {
      const path = history.location.pathname.toLowerCase()
      const page = Router.routes.includes(path)
        ? path
        : path === `/${state.profile?.profile?.username?.toLowerCase?.()}`
        ? '/profile'
        : path.includes('/likes')
        ? '/likes'
        : path.includes('/answer/')
        ? '/answer'
        : path.includes('/follower')
        ? '/follower'
        : path.includes('/followings')
        ? '/followings'
        : path.includes('/reply')
        ? '/reply'
        : path.includes('/report')
        ? '/report'
        : '/result'

      window.ga('send', 'pageview', page)
    }
  } else {
    const shouldLogPayload =
      !!action.meta &&
      typeof action.payload === 'object' &&
      !isCommitOrRollback(action.type)

    _.crumb({
      category: 'Action',
      message: action.type,
      data: shouldLogPayload
        ? helpers.filterSensitivData(action.payload)
        : undefined,
    })
  }

  return next(action)
}
