import React from 'react';
import { useAuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

export default function MessageRedirect() {
    const { authTokens, setAuthTokens } = useAuthContext();

    var role;
    try {
        role = authTokens.userRole;
    }
    catch (e) {
        role = null;
    }

    switch (role) {
        case null:
            setAuthTokens(null);
            return <Redirect to="/guest/login" />;
        case 'student':
            return <Redirect to="/stu/messages" />;
        case 'scientific_advisor':
            return <Redirect to='/sca/messages' />;
        /*
          case 'head_of_cathedra':
            return <Redirect to='/hoc/performance' />;
        */
        case 'root':
            return <Redirect to='/admin/messages' />;
        case 'admin':
            return <Redirect to='/admin/messages' />;
        default:
            setAuthTokens(null);
            return <Redirect to="/guest/login" />;
    }
}