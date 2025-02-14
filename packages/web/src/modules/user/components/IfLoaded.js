import { events } from '@tellonym/core/events'
import React from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from '../../common'

class IfLoadedComponent extends React.Component {
  render() {
    const { children, isLoaded } = this.props
    return isLoaded ? children : null
  }
}

const mapStateToProps = createStructuredSelector({
  isLoaded: events.get(events.LOAD),
})

export const IfLoaded = connect(mapStateToProps)(IfLoadedComponent)
