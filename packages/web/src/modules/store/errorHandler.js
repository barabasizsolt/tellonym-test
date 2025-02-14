import { config } from '../../config'
import { Alert, I18n, _ } from '../common'

export const errorHandler = async ({
  code = 'NO_CODE',
  dispatch,
  isLoggedIn,
  message,
  payload = {},
  type,
}) => {
  switch (code) {
    default: {
      if (process.env.REACT_APP_ENV === 'development') {
        console.error(`[${type}]: ${message ?? code}`) // eslint-disable-line no-console
      }

      _.crumb({
        category: 'Service',
        message: 'errorHandler',
        data: {
          payload,
          type,
        },
      })

      _.capture(code)

      if (!config.api.errorBlacklist.includes(type)) {
        Alert.alert(
          I18n.t('Validation.common.title'),
          `${I18n.t('Validation.common.content')}\n\n${code}`
        )
      }

      return undefined
    }
  }
}
