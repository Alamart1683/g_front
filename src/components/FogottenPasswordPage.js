import React from 'react';
import { Link } from "react-router-dom";

export default class ForgottenPassword extends React.Component{
 render(){
   return(
    <div>
      <div>Восстановление пароля</div>
      <p></p>
      <Link to="/login">Назад</Link>
    </div>
   );
  }
}