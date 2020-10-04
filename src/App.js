import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgottenPassword from './pages/FogottenPasswordPage';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AuthRoute from './auth/AuthRoute';
import { AuthContext } from './auth/AuthContext';


export default function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  
  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
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
