import React from 'react';
import { Link } from "react-router-dom";

export default function ForgottenPasswordPage(){
  return(
    <div>
      <div>Восстановление пароля</div>
      <p></p>
      <Link to="/guest/login">Назад</Link>
    </div>
   );
   
}