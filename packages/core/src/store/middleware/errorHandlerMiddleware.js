import { getIsLoggedIn } from '../../app/selectors'
import * as _ from '../../underscore'
import { isError, isResponse } from '../../validations'

export const errorHandlerMiddleware =
  ({ badConnectionHandler = () => {}, errorHandler = () => {} }) =>
  (store) =>
  (next) =>
  (action) => {
    if (action.type.includes('ERROR') === false) {
      return next(action)
    }

    const handle = (err) => {
      errorHandler({
        code: err.code,
        dispatch: store.dispatch,
        err,
        getState: store.getState,
        isLoggedIn: getIsLoggedIn(store.getState()),
        message: err.msg,
        meta: action.meta,
        payload: action.payload,
        type: action.type,
      })
    }

    if (
      isResponse(action.payload.response) &&
      action.payload.response.status >= 500
    ) {
      handle({ code: 'INTERNAL_SERVER_ERROR' })

      return next(action)
    } else if (isResponse(action.payload.response)) {
      _.crumb(
        `[${action.payload.response.status}]: ${action.payload.response.url}`
      )

      for (const [key, value] of action.payload.response.headers.entries?.() ??
        []) {
        const header = key.toLowerCase()

        if (header.startsWith('tnym-') || header.startsWith('cf-')) {
          _.crumb(`${header}: ${value?.slice?.(0, 100)}`)
        }
      }

      const err = action.payload.data?.err ?? {
        code: 'NO_CODE',
        msg: '',
        errors: [],
      }

      if (action.payload.data?.is_warp === false) {
        err.code = 'WARP_ERROR'
        err.msg = 'Please connect to Cloudflare WARP.'
      }

      handle(err)

      return next(action)
    } else if (
      isError(action.payload.error) &&
      /(Network request failed|Failed to fetch)/.test(
        action.payload.error.message
      )
    ) {
      badConnectionHandler({
        error: action.payload.error,
        dispatch: store.dispatch,
        getState: store.getState,
        meta: action.meta,
        type: action.type,
      })

      return next(action)
    } else {
      return next(action)
    }
  }
