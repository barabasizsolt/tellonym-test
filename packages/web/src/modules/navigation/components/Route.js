import { getIsLoggedIn } from '@tellonym/core/app/selectors'
import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Redirect, Route as R } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { getIsSigningUp } from '../../app/selectors'

export class RouteComponent extends React.Component {
  render() {
    const {
      component: C,
      authenticated: A,
      unauthenticated: U,
      isLoggedIn,
      location,
      isSigningUp,
      ...rest
    } = this.props

    const isAuthenticated = isLoggedIn && !isSigningUp

    return (
      <R
        {...rest}
        render={(props) => {
          if (
            isLoggedIn &&
            isSigningUp &&
            !(
              location.pathname.startsWith('/register/') ||
              location.pathname === '/'
            )
          ) {
            return <Redirect to="/register/username" />
          }
          if (C) {
            return <C {...props} />
          }
          if (A && isAuthenticated) {
            return <A {...props} />
          }
          if (U && !isAuthenticated) {
            return <U {...props} />
          }
          if (U && isAuthenticated) {
            return <Redirect to="/tells" />
          }
          return (
            <Redirect
              to={`/login?redirect=${props.location.pathname}${props.location.search}`}
            />
          )
        }}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getIsLoggedIn,
  isSigningUp: getIsSigningUp,
})

const withConnect = connect(mapStateToProps)

const enhancer = compose(withRouter, withConnect)

export const Route = enhancer(RouteComponent)
