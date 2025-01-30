import React from 'react'
import { theme } from '../styles/theme'
import { View } from './View'

export class Overlay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zIndex: [...document.getElementsByClassName('rc-Overlay')].length,
    }
  }

  componentDidMount() {
    document.querySelector('body').style.overflow = 'hidden'
  }

  componentWillUnmount() {
    const overlays = [...document.getElementsByClassName('rc-Overlay')]
    if (overlays.length === 1) {
      document.querySelector('body').style.overflow = ''
    }
  }

  _onPress = (e) => {
    const { onPress } = this.props
    const overlays = [...document.getElementsByClassName('rc-Overlay')]

    if (typeof onPress === 'function' && overlays.includes(e.target)) {
      onPress()
    }
  }

  render() {
    const { style } = this.props
    return (
      <View
        className="rc-Overlay"
        style={[
          {
            position: 'fixed',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 1000 + this.state.zIndex,
            backgroundColor: theme.colors.modalBackground,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          style,
        ]}
        {...this.props}
        onPress={this._onPress}
      />
    )
  }
}
