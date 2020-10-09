import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';
import ForgottenPasswordPage from './pages/guest/FogottenPasswordPage';
import StartPage from './pages/guest/StartPage';
import StudentInfoPage from './pages/student/StudentInfoPage'
import AuthRoute from './auth/AuthRoute';
import GuestHeader from './components/GuestHeader';
import StudentHeader from './components/StudentHeader';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';
import { AuthContext } from './auth/AuthContext';
import './styles/styles.css';

export default function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    console.log("data");
    console.log(data);
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  
  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        
        <div className="wrapper">

          <Route path='/guest' component={GuestHeader} />
          <Route path='/stu' component={StudentHeader} />

          <Switch>
            <Route exact path='/' component={StartPage} />
            <Route exact path='/guest/login' component={LoginPage} />
            <Route exact path='/guest/registration' component={RegisterPage} />
            <Route exact path='/guest/forgotten_password' component={ForgottenPasswordPage} />

            <AuthRoute exact path='/stu/info' component={StudentInfoPage} />

            <Route path='*' component={NoMatch} />
          </Switch>

        <div className="push"></div>
        </div>

        <Route path='/' component={Footer} />

      </AuthContext.Provider>
  );

}
