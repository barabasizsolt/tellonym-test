import React from 'react'
import { withRouter } from 'react-router'
import { I18n } from '../locales/I18n'
import * as _ from '../underscore'
import { Button } from './Button'
import { Empty } from './Empty'
import { View } from './View'

class ErrorHandlerComponent extends React.Component {
  state = { hasError: false }

  componentDidUpdate(prevProps) {
    if (
      this.state.hasError &&
      prevProps.location.key !== this.props.location.key
    ) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error, extra) {
    if (error && error instanceof Error) {
      this.setState({ hasError: true })
      _.capture(error, extra)
    }
  }

  render() {
    return this.state.hasError ? (
      <View style={{ alignItems: 'center' }}>
        <Empty
          bigIcon
          smile={false}
          headline={I18n.t('Validation.common.title')}
          text={I18n.t('Validation.common.content')}
        />
        <Button gray onPress={() => this.props.history.push('/tellonym')}>
          {I18n.t('Common.confirm')}
        </Button>
      </View>
    ) : (
      this.props.children
    )
  }
}

export const ErrorHandler = withRouter(ErrorHandlerComponent)
