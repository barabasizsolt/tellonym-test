import { dissocPath, mergeDeepRight } from 'ramda'
import { effect } from '../../api'
import { discard } from '../discard'

export const requestMiddleware = (store) => (next) => (action) => {
  const shouldUseMiddleware =
    action.meta?.offline &&
    action.meta.offline.shouldUseRequestMiddleware !== false &&
    (action.meta.offline.shouldUseRequestMiddleware === true ||
      action.type.includes('REFRESH') ||
      action.type.includes('FETCH'))

  if (!shouldUseMiddleware) {
    return next(action)
  }

  let retries = 0

  const request = (action) => {
    effect(action.meta.offline.effect, action)
      .then((payload) => {
        retries = null
        store.dispatch({ ...action.meta.offline.commit, payload })
      })
      .catch(async (result) => {
        const payload = {}

        if (result instanceof Error) {
          payload.error = result
        } else if (typeof result.clone === 'function') {
          const response = result.clone()
          if (
            response.headers.get('content-type').includes('application/json')
          ) {
            payload.data = await response.json()
            payload.response = response
          }
        }

        const shouldDiscard = await discard(payload, action, retries)

        if (shouldDiscard) {
          store.dispatch({ ...action.meta.offline.rollback, payload })
        } else {
          setTimeout(() => {
            retries += 1
            request(action)
          }, 1000)
        }
      })
  }

  request(action)

  /**
   * We have to remove the offline meta property from the action to prevent
   * the redux-offline middleware from picking it up.
   * We rename it to _offline to still have a reference in our dev tools.
   */
  return next(
    mergeDeepRight(dissocPath(['meta', 'offline'], action), {
      meta: { _offline: action.meta.offline },
    })
  )
}
