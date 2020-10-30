import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/styles.css';

import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';
import ForgottenPasswordPage from './pages/guest/FogottenPasswordPage';
import StartPage from './pages/guest/StartPage';
import OrdersPage from './pages/common/OrdersPage'
import TemplatesPage from './pages/common/TemplatesPage'
import AuthRoute from './auth/AuthRoute';
import GuestHeader from './components/GuestHeader';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

import StudentHeader from './components/StudentHeader';
import StudentInfoPage from './pages/student/StudentInfoPage';
//import StudentDocumentPage from './pages/student/StudentDocumentPage';

import SciAdvisorHeader from './components/SciAdvisorHeader';
import SciAdvisorStudentsPage from './pages/scientific_advisor/SciAdvisorStudentsPage';
import ScaStuViewHeader from './components/ScaStuViewHeader';
import ScaStuViewPage from './pages/scientific_advisor/ScaStuViewPage';
import SciAdvisorStudentsDocsPage from './pages/scientific_advisor/SciAdvisorStudentsDocsPage';

import HocHeader from './components/HocHeader';
import HocDocumentooborotPage from './pages/head_of_cafedra/HocDocumentooborotPage';

export default function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  
  // <AuthRoute exact path='/orders' component={OrdersPage} />
  // <AuthRoute exact path='/templates' component={TemplatesPage} />

  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        
        <div className="wrapper">

          <Route path='/guest' component={GuestHeader} />
          <AuthRoute path='/stu' component={StudentHeader} />
          <AuthRoute path='/sca' component={SciAdvisorHeader} />
          <AuthRoute path='/sca-stu' component={ScaStuViewHeader} />
          <AuthRoute path='/hoc' component={HocHeader} />

          <Switch>
            <Route exact path='/' component={StartPage} />
            <Route exact path='/guest/login' component={LoginPage} />
            <Route exact path='/guest/registration' component={RegisterPage} />
            <Route exact path='/guest/forgotten_password' component={ForgottenPasswordPage} />
            
            <AuthRoute exact path='/stu/info' component={StudentInfoPage} />
            <AuthRoute exact path='/stu/orders' component={OrdersPage} />
            <AuthRoute exact path='/stu/templates' component={TemplatesPage} />

            <AuthRoute exact path='/sca/students' component={SciAdvisorStudentsPage} />
            <AuthRoute exact path='/sca/stu-docs' component={SciAdvisorStudentsDocsPage} />
            <AuthRoute exact path='/sca-stu/view' component={ScaStuViewPage} />
            <AuthRoute exact path='/sca/orders' component={OrdersPage} />
            <AuthRoute exact path='/sca/templates' component={TemplatesPage} />

            <AuthRoute exact path='/hoc/documentooborot' component={HocDocumentooborotPage} />

            <Route path='*' component={NoMatch} />
          </Switch>

        <div className="push"></div>
        </div>

        <Route path='/' component={Footer} />

      </AuthContext.Provider>
  );

}
