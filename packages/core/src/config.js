import { mergeDeepRight } from 'ramda'

// eslint-disable-next-line import/no-mutable-exports
export let config = {
  analytics: {
    registered: {
      endpoint: 'log_client_events',
      threshold: 1,
    },
    unregistered: {
      endpoint: 'log_ur_client_events',
      threshold: 1,
    },
  },
  api: {
    client: '',
    host: 'https://api.tnym.de',
    hostChat: 'https://chat-api.tnym.de',
    hostUpload: 'https://upload.tnym.de',
    hostAnalytics: 'https://a.tnym.de',
    videoGen: 'https://tiktakvideojetzt.tnym.me',
    isWeb: false,
    limit: 12,
    shouldCountRequests: false,
    timeout: 30000,
  },
  helpers: {},
  selectors: {
    hasRefreshedRecentlyMs: 2000,
  },
  underscore: {
    capture: () => {},
    crumb: () => {},
    onCapture: __DEV__ ? console.error : undefined, // eslint-disable-line no-console
    getSentryErrorExtras: (error, extras) => extras,
  },
}

const configureSentry = (Sentry) => {
  if (__DEV__) {
    return
  }

  Sentry.init({
    ...config.Sentry.config,
    integrations: (payload) =>
      payload
        .map((integration) => {
          switch (integration.name) {
            case 'Breadcrumbs': {
              integration._options = {
                console: false,
                dom: false,
                fetch: false,
                history: false,
                sentry: false,
                xhr: false,
              }
              break
            }
            default:
              break
          }

          return integration
        })
        .concat(config.Sentry.config.integrations ?? []),
  })

  config.underscore.capture = (e, extras) => {
    Sentry.withScope((scope) => {
      scope.setExtras(config.underscore.getSentryErrorExtras(e, extras))
      Sentry.captureException(e)
    })
  }

  config.underscore.crumb = (e) => {
    Sentry.addBreadcrumb(e)
  }
}

/**
 * Initializes the core configuration and optionally enables the Sentry integration.
 * Since subsequent calls merge the configs, it is possible to pass individual key value
 * pairs to update the config during runtime.
 * @param {object} configOverwrites local project config
 * @param {object} modules additional context for the setup
 */
export const configureCore = (configOverwrites, modules) => {
  config = mergeDeepRight(config, configOverwrites)

  if (modules?.Sentry) {
    configureSentry(modules.Sentry)
  }
}
