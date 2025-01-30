import * as actions from './actions'
import * as constants from './constants'
import * as contextListeners from './contextListeners'
import * as emitter from './emitter'
import * as sagas from './sagas'
import * as selectors from './selectors'
import * as types from './types'

export const events = {
  ...actions,
  ...constants,
  ...contextListeners,
  ...emitter,
  ...sagas,
  ...selectors,
  ...types,
}
