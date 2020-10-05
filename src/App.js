import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgottenPassword from './pages/FogottenPasswordPage';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AuthRoute from './auth/AuthRoute';
import GuestHeader from './components/GuestHeader';
import Footer from './components/Footer';
import { AuthContext } from './auth/AuthContext';
import './styles/styles.css';


export default function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  
  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        
        <div className="wrapper">

          <Route path='/guest' component={GuestHeader} />

          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/guest/login' component={LoginPage} />
            <Route exact path='/guest/registration' component={RegisterPage} />
            <Route exact path='/guest/forgotten_password' component={ForgottenPassword} />
            <AuthRoute exact path='/user' component={UserPage} />
          </Switch>

        <div className="push"></div>
        </div>

        <Route path='/' component={Footer} />

      </AuthContext.Provider>
  );

}
