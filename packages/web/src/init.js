import * as Sentry from '@sentry/browser'
import { configureCore } from '@tellonym/core/config'
import { configureMirageServer } from '@tellonym/core/api/mocks/server'
import { uuidv4 } from '@tellonym/core/helpers'
import { config } from './config'
import * as _ from './modules/common/underscore'

/**
 * This statement is not in the globals.js because we want to import from core
 * only after we loaded the polyfills.
 */
window.tnym.anonUserId = uuidv4()

configureCore(config, {
  Sentry,
})

if (__DEV__) {
  _.setMirageServer(configureMirageServer())
}
