import React from 'react';
import { Link } from "react-router-dom";
import { useAuthContext } from '../../auth/AuthContext';

export default function RegisterPage() {
  const { authTokens } = useAuthContext();

  console.log(authTokens);

  return(
    <div>
      <div>Регистрация</div>
      <p></p>
      <Link to="/guest/login">Назад</Link>
    </div>
  );

}