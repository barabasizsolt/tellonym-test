import { config } from '../config'

const networkLibraryErrorRegex = /^(Network request failed|Failed to fetch)\.?$/

export const discard = async (
  { data, error, response },
  action,
  retries = 0
) => {
  if (error && networkLibraryErrorRegex.test(error.message)) {
    const retryCount = action.meta?.offline?.retryCount ?? 1

    return retries >= retryCount
  }

  const retryCount =
    action.meta?.offline?.retryCount ?? config.api?.retryCount ?? 2

  if (retries >= retryCount) {
    return true
  }

  if (!response) {
    return true
  }

  if (!('status' in response)) {
    return true
  }

  if (response.status === 429) {
    const retryCount = data?.err?.retryCount ?? 1
    return retries >= retryCount
  }

  return response.status >= 400 && response.status < 500
}
