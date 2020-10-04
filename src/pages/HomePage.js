import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { useAuthContext } from '../auth/AuthContext';

export default function MainPage() {
  const { authTokens } = useAuthContext();

  var i;
  console.log("local storage");
  for (i = 0; i < localStorage.length; i++)   {
      console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
  }

  return(
    <div>

      <p>Начальная страница</p>
      <p></p>
      <Link to="/login" >Логин</Link>
      <p></p>
      <Link to="/registration" >Регистрация</Link>
      <p></p>
      <Link to="/user" >Страница пользователя</Link>
      <p></p>
      <Link to="/">Выход</Link>

    </div>
   );

}