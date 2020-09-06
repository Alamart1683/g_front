import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class MainPage extends Component{
 render(){
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
}