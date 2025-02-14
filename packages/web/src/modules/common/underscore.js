import { curry } from 'ramda'
import { history } from './history'

export * from '@tellonym/core/underscore'

export const getDeviceHeight = () => document.documentElement.clientHeight
export const getDeviceWidth = () => document.documentElement.clientWidth

/**
 * Try using openRouteProps before using this
 * use instead of history.push or window.open
 * Handles cases like cmd press
 */
export const openRoute = curry((route, e) => {
  const isActionKeyPressed = e.metaKey || e.ctrlKey

  const isExternalUrl = route.startsWith('http')

  if (isActionKeyPressed) {
    window.open(route, '_blank')
  } else if (isExternalUrl) {
    window.open(route, '_self')
  } else {
    history.push(route)
  }
})

/**
 * Creates the props necessary to handle navigation to a route
 * Handles middle mouse click and cmd click
 */
export const openRouteProps = (route) => ({
  onPress: openRoute(route),
  onAuxClick: () => window.open(route, '_blank'),
})
