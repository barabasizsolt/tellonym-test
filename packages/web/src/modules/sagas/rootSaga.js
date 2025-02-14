import { events } from '@tellonym/core/events'
import * as actions from '@tellonym/core/store/sagas/actions'
import { eventFactory } from './eventFactories'
import { rootEventHandler } from './eventHandlers'

const modules = []

export const rootSaga = function* rootSaga() {
  yield events.subscribe(modules, eventFactory, rootEventHandler)
  yield actions.subscribe(modules)
}
