import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Switch } from 'react-router'
import { Alert, ErrorHandler, history, View } from '../../common'
import { IfLoaded } from '../../user/components/IfLoaded'
import { PageHelp } from '../../help'
import { PageHome } from '../../home'
import { Route } from './Route'
import { Redirect } from './Redirect'
import UserInterviewForm from '../../userInterView/components/UserInterViewForm'

export class Router extends React.Component {
  static routes = ['/', '/help']

  render() {
    return (
      <IfLoaded>
        <ConnectedRouter history={history}>
          <View style={{ height: '100%', flex: 1 }}>
            <Alert hasHeaderOffset />

            <ErrorHandler>
              <Switch>
                <Route exact path="/" component={PageHome} />
                <Route path="/help" component={PageHelp} />
                <Route path="/userInterView" component={UserInterviewForm} />
                <Route component={() => <Redirect to="/" />} />
              </Switch>
            </ErrorHandler>
          </View>
        </ConnectedRouter>
      </IfLoaded>
    )
  }
}
