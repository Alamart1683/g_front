import React, { Component } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgottenPassword from './components/auth/FogottenPassword';
import { Route, Switch, withRouter } from "react-router-dom";


export default class App extends Component {
  render() {

    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={LoginPage} />
          <Route exact path='/registration' component={RegisterPage} />
          <Route exact path='/forgotten_password' component={ForgottenPassword} />
        </Switch>
      </div>
    );
  }
}
