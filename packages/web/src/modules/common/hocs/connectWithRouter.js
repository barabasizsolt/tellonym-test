import { connect as c } from 'react-redux'
import { withRouter } from 'react-router'

export const connectWithRouter =
  (...props) =>
  (Component) =>
    withRouter(c(...props)(Component))
