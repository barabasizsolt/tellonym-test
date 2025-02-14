import { validate } from '@tellonym/core/helpers'
import hoistStatics from 'hoist-non-react-statics'
import React from 'react'
import { I18n } from '../locales/I18n'

export const withUsernameValidation = (WrappedComponent) => {
  class EnhanceWithUsernameValidation extends React.Component {
    _validateUsername = (username) => {
      const startWithDot = /^\./
      const endsWithDot = /\.$/
      const consecutiveDots = /\.\./
      const rightLength = /^.{1,30}$/
      const onlyValidCharacters = /^[\w.]+$/

      const dotRegexes = [startWithDot, consecutiveDots, endsWithDot]
      const matchesUsername = (regex) => regex.test(username)

      if (!rightLength.test(username)) {
        return {
          isValid: false,
          message: I18n.t('usernameValidationLength'),
        }
      }

      if (dotRegexes.some(matchesUsername)) {
        return {
          isValid: false,
          message: I18n.t('usernameValidationDots'),
        }
      }

      if (!onlyValidCharacters.test(username)) {
        return {
          isValid: false,
          message: I18n.t('usernameValidationChars'),
        }
      }

      if (!validate({ username }).isValid) {
        return {
          isValid: false,
          message: I18n.t('Validation.usernameInvalid.content'),
        }
      }

      return {
        isValid: true,
        message: '',
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          validateUsername={this._validateUsername}
        />
      )
    }
  }

  EnhanceWithUsernameValidation.displayName = `withUsernameValidation(${
    WrappedComponent.displayName || WrappedComponent.name
  })`

  return hoistStatics(EnhanceWithUsernameValidation, WrappedComponent)
}
