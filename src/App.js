import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgottenPassword from './pages/FogottenPasswordPage';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AuthRoute from './auth/AuthRoute';
import { AuthContext } from './auth/AuthContext';


export default class App extends Component {

  state = {

  }
  
  render() {

    return (
      <AuthContext.Provider value={ false }>
        <div className="App">
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/registration' component={RegisterPage} />
            <Route exact path='/forgotten_password' component={ForgottenPassword} />
            <AuthRoute exact path='/user' component={UserPage} />
          </Switch>
        </div>
      </AuthContext.Provider>
    );
  }
}
