import React from 'react';
import { Link } from "react-router-dom";

export default function ForgottenPassword(){
  return(
    <div>
      <div>Восстановление пароля</div>
      <p></p>
      <Link to="/login">Назад</Link>
    </div>
   );
   
}