import React from 'react'
import { Helmet } from 'react-helmet'
import { withRouter } from '../../common'

const noIndexRouteRegexList = [
  /\/actions/,
  /\/answer/,
  /\/login/,
  /\/notifications/,
  /\/profile/,
  /\/register/,
  /\/reply/,
  /\/report/,
  /\/search/,
  /\/stream/,
  /\/tells/,
]

class HeadProviderComponent extends React.Component {
  render() {
    const { location } = this.props
    const shouldAddNoIndex = noIndexRouteRegexList.some((regex) =>
      regex.test(location.pathname)
    )
    return (
      <Helmet>
        <title>Tellonym</title>
        {shouldAddNoIndex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
    )
  }
}

export const HeadProvider = withRouter(HeadProviderComponent)
