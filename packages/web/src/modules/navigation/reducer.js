import { connectRouter } from 'connected-react-router'
import { identity } from 'ramda'
import { history } from '../common'

export const initialState = {
  action: 'POP',
  location: {
    hash: '',
    pathname: '/',
    search: '',
    state: undefined,
  },
}

export const persistence = {
  clear: identity,
}

export const name = 'router'

export const reducer = connectRouter(history)
