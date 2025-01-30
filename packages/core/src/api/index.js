import qs from 'qs'
import { config } from '../config'
import { isObject } from '../validations'

export const requestCounter = {
  _data: {},
  getKeyFromPath: (path) => `/${path.split('?')[0]}`,
  count: (path) => {
    const key = requestCounter.getKeyFromPath(path)
    requestCounter._data[key] = (requestCounter._data[key] ?? 0) + 1
  },
  getCounts: (path) => {
    if (path) {
      const key = requestCounter.getKeyFromPath(path)
      return requestCounter._data[key]
    }

    return requestCounter._data
  },
}

export const HOST_TYPE = {
  API: 'API',
  CHAT: 'CHAT',
  UPLOAD: 'UPLOAD',
  VIDEOGEN: 'VIDEOGEN',
}

// Object -> Object
export const removePrivateData = (payload) =>
  Object.keys(payload).reduce(
    (acc, key) =>
      key.startsWith('_') || key === 'offset'
        ? acc
        : { ...acc, [key]: payload[key] },
    {}
  )

// Object, Object -> Any
export const buildPayload = (
  { limit = config.api.limit, method = 'GET' },
  { payload = {}, shouldAdjustData = true }
) =>
  payload && payload.formData
    ? payload.formData
    : method === 'GET'
    ? undefined
    : JSON.stringify({
        ...removePrivateData(payload),
        limit:
          limit === null ? undefined : shouldAdjustData ? limit + 1 : limit,
        pos: payload.offset,
      })

// Object -> String
export const buildUrl = (
  {
    hostType = HOST_TYPE.API,
    limit = config.api.limit,
    offset,
    path,
    method = 'GET',
    ...effect
  },
  { meta, shouldAdjustData = true }
) => {
  const hostTypeToHostMap = {
    [HOST_TYPE.API]: config.api.host,
    [HOST_TYPE.CHAT]: config.api.hostChat,
    [HOST_TYPE.UPLOAD]: config.api.hostUpload,
    [HOST_TYPE.UPLOAD]: config.api.hostUpload,
    [HOST_TYPE.VIDEOGEN]: config.api.videoGen,
    [undefined]: config.api.host,
  }

  if (config.api.shouldCountRequests) {
    requestCounter.count(path)
  }

  const host = hostTypeToHostMap[hostType]

  const href = `${host}/${path.startsWith('/') ? path.slice(1) : path}`

  if (method !== 'GET') {
    return href
  }

  const params = {
    ...removePrivateData(effect),
    adExpId: meta.setup?.adExpId ?? meta.adExpId,
    limit: limit === null ? undefined : shouldAdjustData ? limit + 1 : limit,
    pos: offset,
  }

  const queryString = qs.stringify(params)

  const separator = path.includes('?') ? '&' : '?'

  const url = `${href}${queryString ? separator : ''}${queryString}`

  return url
}

// [Object] -> Object
export const arrayToObject = (arr, limit = config.api.limit) => ({
  hasMore: limit !== null && arr.length > limit,
  data: limit === null ? arr : arr.slice(0, limit),
})

// Object -> Object
export const arraysToObjects = (obj, limit) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [key]: Array.isArray(obj[key])
        ? arrayToObject(obj[key], limit)
        : /* isObject(obj[key])
          ? arraysToObjects(obj[key])
          : */
          obj[key],
    }),
    {}
  )

// Any -> Object
export const transformData = (data, limit) =>
  Array.isArray(data)
    ? arrayToObject(data, limit)
    : typeof data === 'string'
    ? { data }
    : isObject(data)
    ? arraysToObjects(data, limit)
    : { data }

// Object -> Promise<Object>
export const parseJson = async (response) => {
  try {
    const res = response.clone()

    if (res.headers.get('content-type').includes('application/json')) {
      return await res.json()
    }

    const text = await res.text()

    if (text.includes('Cloudflare') === false) {
      return {}
    }
  } catch (_) {
    return {}
  }
}

// Object -> Promise<Object, Error>
export const resolveOrReject = async (
  response, // can be an error object
  limit,
  shouldAdjustData = true
) => {
  if (response.ok) {
    const data = await parseJson(response)

    if (shouldAdjustData) {
      return transformData(data, limit)
    }

    return data
  }

  return Promise.reject(response)
}

// Object, Object -> Promise<Object,Response>
export const effect = (effect, action) => {
  let timeout

  const accessToken = action.meta.setup?.accessToken ?? action.meta.accessToken

  return Promise.race([
    fetch(buildUrl(effect, action), {
      ...(action.type === 'user/LOGIN_LEGACY' &&
      (action.payload.code || action.payload.oauth_token)
        ? {
            credentials: 'include',
          }
        : {}),
      method: effect.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Tellonym-Client': config.api.client,
        ...(!config.api.isWeb
          ? {
              'Content-Type': action.payload?.formData
                ? 'multipart/form-data'
                : 'application/json;charset=utf-8',
            }
          : action.payload?.formData
          ? {}
          : { 'Content-Type': 'application/json;charset=utf-8' }),
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: buildPayload(effect, action),
    }),
    new Promise((_, reject) => {
      timeout = setTimeout(() => {
        reject(new Error('Network request failed. Custom time out.'))
      }, effect.timeout ?? config.api.timeout)
    }),
  ]).then((res) => {
    clearTimeout(timeout)
    return resolveOrReject(res, effect.limit, action.shouldAdjustData)
  })
}

/**
 * Constructs the info to pass to fetch function
 * @param {String} payload.method request method - defaults to 'GET'
 * @param {String} payload.path the path of the url without leading slash
 * @param {Object} payload.payload params of request - automatically added to body or query
 * @param {?String} options.accessToken accessToken of current user, undefined if not logged in
 * @param {?Number} options.adExpId current ad exp id
 * @param {?string} options.credentials should include credentials like cookies
 * @param {?String} options.hostType one of 'CHAT', 'API', 'UPLOAD', "VIDEOGEN"
 * @param {?Number} options.limit  amount of items to return
 * @param {?Number} options.offset offset of items to return
 * @param {?Boolean} options.shouldAdjustData whether hasMore should be evaluated by frontend
 * @returns {Array<url, config>} Returns an array that contains url and the config to be passed to fetch
 * @example buildUrl({ path: 'users/me', payload: { id: 1 } }, { limit: 24 })
 */
export const buildFetch = (payload, options = {}) => {
  const method = payload.method ?? 'GET'
  const limit = options.limit ?? null

  const url = buildUrl(
    {
      path: payload.path,
      method,
      hostType: options.hostType,
      limit,
      offset: options.offset,
      ...(method === 'GET' ? payload.payload : {}),
    },
    {
      meta: { adExpId: options.adExpId },
      shouldAdjustData: options.shouldAdjustData ?? false,
    }
  )

  const body = buildPayload(
    { limit, method },
    {
      payload: { ...payload.payload, offset: options.offset },
      shouldAdjustData: false,
    }
  )

  const contentType = (() => {
    switch (true) {
      case !config.api.isWeb && payload.payload?.formData:
        return 'multipart/form-data'
      case config.api.isWeb && payload.payload?.formData:
        return {}
      default:
        return { 'Content-Type': 'application/json;charset=utf-8' }
    }
  })()

  const accessToken = options.accessToken
    ? {
        Authorization: `Bearer ${options.accessToken}`,
      }
    : {}

  const fetchConfig = {
    method,
    body,
    credentials: options.credentials,
    headers: {
      Accept: 'application/json',
      'Tellonym-Client': config.api.client,
      ...contentType,
      ...accessToken,
    },
  }

  return [url, fetchConfig]
}
