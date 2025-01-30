const store = {
  dispatch: () => {},
  getState: () => ({}),
  subscribe: () => {},
}

export const setStore = ({ dispatch, getState, subscribe }) => {
  store.dispatch = dispatch
  store.getState = getState
  store.subscribe = subscribe
}

export const getState = (selector) =>
  selector ? selector(store.getState()) : store.getState()

export const dispatch = (action) => store.dispatch(action)

/**
 * Subscribes to Redux store changes.
 * Returns an unsubscribe function.
 * @param {() => void} listener
 * @returns {() => void} unsubscribe function
 */
export const subscribeToStore = (listener) => store.subscribe(listener)
