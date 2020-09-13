import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default class LoginPage extends Component{
 render(){
   return(
     <div>
        <LoginForm/>

        <Link to="/">Назад</Link>
     </div>
   );
  }
}