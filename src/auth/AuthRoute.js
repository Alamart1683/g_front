import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export default function AuthRoute({ component: Component, ...rest}) {
  const { authTokens } = useAuthContext();
 
  return(
    <Route {...rest} render = {(props) => (
      authTokens
        ? <Component {...props} />
        : <Redirect to='/guest/login'/>
    )}
    />
  );
  
}
