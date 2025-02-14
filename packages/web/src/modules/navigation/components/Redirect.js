import React from 'react'
import { Redirect as R } from 'react-router-dom'

export class Redirect extends React.Component {
  componentDidMount() {
    if (this.props.to.startsWith('https://')) {
      window.open(this.props.to, '_self')
    }
  }

  render() {
    return this.props.to.startsWith('https://') ? null : <R {...this.props} />
  }
}
