import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgottenPassword from './components/auth/FogottenPassword';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import AuthRoute from './components/auth/AuthRoute';


export default class App extends Component {
  render() {

    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/registration' component={RegisterPage} />
          <Route exact path='/forgotten_password' component={ForgottenPassword} />
          <AuthRoute exact path='/user' component={UserPage} />
        </Switch>
      </div>
    );
  }
}
