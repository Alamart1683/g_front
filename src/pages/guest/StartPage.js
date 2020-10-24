import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuthContext } from '../../auth/AuthContext';

export default function StartPage() {
  const { authTokens, setAuthTokens } = useAuthContext();

  var role;
  try {
    role = authTokens.userRole;
  }
  catch(e) {
    role = null;
  }

  switch (role) {
    case null:
      setAuthTokens(null);
      return <Redirect to="/guest/login" />;
    case 'student':
      return <Redirect to="/stu/info" />;
    case 'scientific_advisor':
      return <Redirect to='/sca/students'/>;
    default:
      setAuthTokens(null);
      return <Redirect to="/guest/login" />;
  }

}