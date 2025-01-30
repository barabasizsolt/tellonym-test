import * as events from '@tellonym/core/events/reducer'
import { configureRootReducer } from '@tellonym/core/store/configureRootReducer'
import { getPersistOptions } from '@tellonym/core/store/persistence'
import { config } from '../../config'
import * as app from '../app/reducer'
import * as navigation from '../navigation/reducer'
import { migrations } from './migrations'

const { version } = config.store

const modules = [app, events, navigation]

export const persistOptions = getPersistOptions(modules)

export const rootReducer = configureRootReducer({
  modules,
  migrations,
  version,
})
