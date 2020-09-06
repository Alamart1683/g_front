import React from 'react';
import { Route, Redirect } from "react-router-dom";

function AuthRoute({ component: Component, ...rest}) {
  return(
    <Route {...rest} render = {(props) => (
      localStorage.getItem('user')
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}
    />
  );
  
}

export default AuthRoute;