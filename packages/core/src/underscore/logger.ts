import { config } from '../config'
import { queue, uuidv4 } from '../helpers'

const Tag = {
  ADS: 'Ads',
  IAP: 'IAP',
}

export const log = (...params: unknown[]) => {
  if (!__DEV__) {
    return
  }

  console.log(...params) // eslint-disable-line no-console
}

export const pretty = (...params: unknown[]) => {
  if (!__DEV__) {
    return
  }

  console.log(...params.map((param) => JSON.stringify(param, null, 2))) // eslint-disable-line no-console
}

class CustomError extends Error {
  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
  }
}

/**
 * @param {exception|string} e exception to be logged to sentry
 * @param {object.<string, string|number>} [extras] object of additional data to be logged to this error
 */
export const capture = (
  e: Error | string,
  extras?: Record<string, unknown>
) => {
  if (!e) {
    return
  }

  const error = e instanceof Error ? e : new CustomError(String(e))

  if (error instanceof Error === false) {
    return
  }

  if (typeof config.underscore.onCapture === 'function') {
    config.underscore.onCapture(error, extras)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  config.underscore.capture(e, extras)
}

export const crumb = (
  breadcrumb:
    | string
    | {
        category: string
        message: string
        level?: string
        data?: Record<string, unknown>
      }
) => {
  let payload = breadcrumb

  if (typeof payload === 'string') {
    payload = {
      category: 'generic',
      message: payload,
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  config.underscore.crumb(payload)
}

const fifo40 = queue(40)

enum LogType {
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

type MessageType = { message: string }

type BodyType =
  | string
  | MessageType
  | string[]
  | Record<string | number, unknown>
  | Error

const isMessage = (body: BodyType): body is { message: string } =>
  typeof (body as MessageType)?.message === 'string'

const getTextToDisplay = (body: BodyType) => {
  if (typeof body === 'string') {
    return body.substring(0, 300)
  }

  if (isMessage(body)) {
    return body.message.substring(0, 300)
  }

  if (Array.isArray(body)) {
    return body.join(' ')
  }

  try {
    const stringified = JSON.stringify(body)

    return stringified.substring(0, 300)
  } catch (e) {
    return 'LOGGER ERROR: can not parse message'
  }
}

const logToConsole = ({
  type,
  body,
  extras = '',
  tags,
}: {
  type: LogType
  body: unknown
  extras?: unknown
  tags: string[] // Array<keyof typeof Tag>
}) => {
  switch (type) {
    case LogType.ERROR:
      console.error(body, extras) // eslint-disable-line no-console
      break

    case LogType.WARNING:
      console.warn(body, extras) // eslint-disable-line no-console
      break

    default:
      // eslint-disable-next-line no-console
      console.log(body, extras, tags)
      break
  }
}

let logs: {
  id: string
  parsedMessage: string
  extras: unknown
  type: LogType
  time: number
  tags?: string[]
}[] = []

const addMessage =
  (type: LogType) =>
  (
    body: BodyType,
    extra?: Record<string, unknown>,
    tags?: string[] // Array<keyof typeof Tag>
  ) => {
    const id = uuidv4()
    const time = new Date().getTime()

    const extras = {
      ...extra,
    }

    if (body instanceof Error) {
      extras.stack = body.stack?.split('\n').slice(0, 5).join('\n')
    }

    if (__DEV__) {
      logToConsole({ type, body, extras, tags })
    }

    const parsedMessage = getTextToDisplay(body)

    const entry = { id, body: parsedMessage, extras, type, time, tags }

    const updatedLog = fifo40(entry, logs)

    logs = updatedLog
  }

export const getLogs = () => logs.slice().reverse()

export const getLogsWithFilter = (filter: string[]) => {
  const logs = getLogs()

  if (filter.length === 0) {
    return logs
  }

  const filteredLogs = logs.filter((log) =>
    filter.some((tag) => log.tags?.includes(tag))
  )

  return filteredLogs
}

export const logger = {
  Tag,
  /**
   * Adds a message to the logger in debug menu, additionally does a console.log in __DEV__
   * @param {string} body - message to log
   * @param {string} extras - additional info as object
   * @param {string} extras.description - text below the body
   * @param {string} extras.location - info where the log was created
   */
  add: addMessage(LogType.INFO),
  error: addMessage(LogType.ERROR),
  getAllMessages: () => [...logs],
  warning: addMessage(LogType.WARNING),
}
