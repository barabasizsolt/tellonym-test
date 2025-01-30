import { config } from '../config'
import * as _ from '../underscore'

export const retry = async ({ data }, action, retries) => {
  const retryCount =
    data?.err?.retryCount ??
    action.meta?.offline?.retryCount ??
    config.api?.retryCount ??
    0

  const retryIn = data?.err.retryIn ?? _.sec

  return retries >= retryCount ? null : retryIn
}
