import React from 'react';
import { Link } from "react-router-dom";

export default class RegisterPage extends React.Component{
 render(){
   return(
    <div>
      <div>Регистрация</div>
      <p></p>
      <Link to="/">Назад</Link>
    </div>
   );
  }
}