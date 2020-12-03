import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/styles.css';

import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';
import ForgottenPasswordPage from './pages/guest/FogottenPasswordPage';
import StartPage from './pages/guest/StartPage';
import AuthRoute from './auth/AuthRoute';
import GuestHeader from './components/GuestHeader';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

import OrdersPage from './pages/common/OrdersPage';
import TemplatesPage from './pages/common/TemplatesPage';
import SettingsPage from './pages/common/SettingsPage';

import StudentHeader from './components/StudentHeader';
import StudentInfoPage from './pages/student/StudentInfoPage';
import StudentTasksPage from './pages/student/StudentTasksPage';
import StudentExamplesPage from './pages/student/StudentExamplesPage';
import StudentThemePage from './pages/student/StudentThemePage';
//import StudentDocumentPage from './pages/student/StudentDocumentPage';

import SciAdvisorHeader from './components/SciAdvisorHeader';
import SciAdvisorStudentsPage from './pages/scientific_advisor/SciAdvisorStudentsPage';
import ScaStuViewHeader from './components/ScaStuViewHeader';
import ScaStuViewPage from './pages/scientific_advisor/ScaStuViewPage';
import SciAdvisorStudentsDocsPage from './pages/scientific_advisor/SciAdvisorStudentsDocsPage';
import ScaProjectsPage from './pages/scientific_advisor/ScaProjectsPage';
import ScaExamplesPage from './pages/scientific_advisor/ScaExamplesPage';
import ScaThemesPage from './pages/scientific_advisor/ScaThemesPage';

import HocHeader from './components/HocHeader';
//import HocDocumentooborotPage from './pages/head_of_cafedra/HocDocumentooborotPage';
import HocOrdersPage from './pages/head_of_cafedra/HocOrdersPage';
import HocTemplatesPage from './pages/head_of_cafedra/HocTemplatesPage';
import HocStudentAssociationPage from './pages/head_of_cafedra/HocStudentAssociationPage';

import AdminHeader from './components/AdminHeader';
import AdminAssociationPage from './pages/admin/AdminAssociationPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminTemplatesPage from './pages/admin/AdminTemplatesPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';

export default function App() {

  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>

      <div className='wrapper'>

        <Route path='/guest' component={GuestHeader} />
        <AuthRoute path='/stu' component={StudentHeader} />
        <AuthRoute path='/sca' component={SciAdvisorHeader} />
        <AuthRoute path='/sca-stu' component={ScaStuViewHeader} />
        <AuthRoute path='/hoc' component={HocHeader} />
        <AuthRoute path='/admin' component={AdminHeader} />

        <Switch>
          <Route exact path='/' component={StartPage} />
          <Route exact path='/guest/login' component={LoginPage} />
          <Route exact path='/guest/registration' component={RegisterPage} />
          <Route exact path='/guest/forgotten_password' component={ForgottenPasswordPage} />

          <AuthRoute exact path='/stu/info' component={StudentInfoPage} />
          <AuthRoute exact path='/stu/tasks' component={StudentTasksPage} />
          <AuthRoute exact path='/stu/orders' component={OrdersPage} />
          <AuthRoute exact path='/stu/examples' component={StudentExamplesPage} />
          <AuthRoute exact path='/stu/settings' component={SettingsPage} />
          <AuthRoute exact path='/stu/theme' component={StudentThemePage} />

          <AuthRoute exact path='/sca/students' component={SciAdvisorStudentsPage} />
          <AuthRoute exact path='/sca/stu-docs' component={SciAdvisorStudentsDocsPage} />
          <AuthRoute exact path='/sca-stu/view' component={ScaStuViewPage} />
          <AuthRoute exact path='/sca/orders' component={OrdersPage} />
          <AuthRoute exact path='/sca/templates' component={TemplatesPage} />
          <AuthRoute exact path='/sca/projects' component={ScaProjectsPage} />
          <AuthRoute exact path='/sca/examples' component={ScaExamplesPage} />
          <AuthRoute exact path='/sca/settings' component={SettingsPage} />
          <AuthRoute exact path='/sca/stu-themes' component={ScaThemesPage} />

          <AuthRoute exact path='/hoc/orders' component={HocOrdersPage} />
          <AuthRoute exact path='/hoc/templates' component={HocTemplatesPage} />
          <AuthRoute exact path='/hoc/association' component={HocStudentAssociationPage} />
          <AuthRoute exact path='/hoc/settings' component={SettingsPage} />

          <AuthRoute exact path='/admin/association' component={AdminAssociationPage} />
          <AuthRoute exact path='/admin/orders' component={AdminOrdersPage} />
          <AuthRoute exact path='/admin/templates' component={AdminTemplatesPage} />
          <AuthRoute exact path='/admin/registration' component={AdminRegistrationPage} />
          <AuthRoute exact path='/admin/settings' component={SettingsPage} />

          <Route path='*' component={NoMatch} />
        </Switch>

        <div className='push'></div>
      </div>

      <Route path='/' component={Footer} />

    </AuthContext.Provider>
  );

}
