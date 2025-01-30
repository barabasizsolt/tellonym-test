import { createServer, Model } from 'miragejs' // eslint-disable-line import/no-extraneous-dependencies
import { mergeRight } from 'ramda'
import { config } from '../../config'
import { modules } from './index'
import { ApplicationSerializer } from './serializers'

const mergeModules = (modules) =>
  modules.reduce(
    (acc, curr) => {
      const keys = Object.keys(curr)

      for (const key of keys) {
        if (Array.isArray(acc[key])) {
          acc[key].push(curr[key])
        } else {
          acc[key] = mergeRight(acc[key], curr[key])
        }
      }

      return acc
    },
    { seeds: [], routes: [] }
  )

const combinedModules = mergeModules(modules)

export const configureMirageServer = (options) => {
  console.warn('[Mirage]: Mocks are enabled.') // eslint-disable-line no-console

  return createServer({
    environment: options?.environment ?? 'development',

    serializers: {
      application: ApplicationSerializer,
      ...combinedModules.serializers,
    },

    models: {
      analyticsEvent: Model,
      ...combinedModules.models,
    },

    factories: combinedModules.factories,

    seeds(server) {
      combinedModules.seeds.forEach((func) => func.call(this, server))
    },

    routes() {
      this.urlPrefix = config.api.host

      combinedModules.routes.forEach((func) => func.call(this))

      // let all unhandled API requests hit the real server
      this.passthrough()

      // let external domain requests hit the real servers
      this.passthrough('https://codepush.appcenter.ms/v0.1/public/codepush/update_check') // prettier-ignore
      this.passthrough('http://localhost**')
      this.passthrough(`${config.api.hostChat}/**`)
      this.passthrough(`${config.api.hostUpload}/**`)
      this.passthrough(`${config.api.hostAnalytics}/**`)
      this.passthrough('**/symbolicate')
      this.passthrough('https://a.tnym.de/log_client_events')
      this.passthrough('https://tiktakvideojetzt.tnym.me/**')
      this.passthrough('https://tiktakvideojetzt.tnym.me/')
      this.passthrough('https://api.notion.com/**')
      this.passthrough('https://api.notion.com/')
      this.passthrough('http://notion-api.callosum.workers.dev/**')
      this.passthrough('http://notion-api.callosum.workers.dev/')
      this.passthrough('https://open.tiktokapis.com/**')
    },
  })
}
