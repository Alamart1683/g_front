import React, { Component } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgottenPassword from './components/auth/FogottenPassword';
import {
  Route,
  Switch,
  withRouter,
  Redirect,
  Link
} from "react-router-dom"


class App extends Component {
  render() {
    const { history } = this.props

    return (
      <div className="App">
        <Switch>
          <Route history={history} exact path='/' component={LoginPage} />
          <Route history={history} exact path='/registration' component={RegisterPage} />
          <Route history={history} exact path='/forgotten_password' component={ForgottenPassword} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)