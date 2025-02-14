import { always, either, isEmpty, isNil, propOr, type } from 'ramda'

export const createReducer = (actionHandlers, initialState) => {
  const isNilOrEmpty = either(isNil, isEmpty)

  if (type(actionHandlers) !== 'Object') {
    throw new TypeError('Action handlers must be an object: { type: handler }')
  }

  if (isNilOrEmpty(actionHandlers)) {
    throw new TypeError("Action handlers can't be empty!")
  }

  if (isNilOrEmpty(initialState)) {
    throw new TypeError('Initial state must be specified!')
  }

  return (state = initialState, action) => {
    const { type } = action

    if (isNilOrEmpty(type)) {
      throw new Error(`Action must have a type! ${JSON.stringify(action)}`)
    }

    const reducer = propOr(always(state), action.type, actionHandlers)

    return reducer(state, action)
  }
}
