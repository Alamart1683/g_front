import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuthContext } from '../../auth/AuthContext';

export default function StartPage() {
  const { authTokens } = useAuthContext();

  var role;
  try {
    role = authTokens.userRole;
  }
  catch(e) {
    role = null;
  }

  switch (role) {
    case null:
      return <Redirect to="/guest/login" />;
    case 'student':
      return <Redirect to="/stu/info" />;
    default:
      return <Redirect to="/guest/login" />;
  }

}