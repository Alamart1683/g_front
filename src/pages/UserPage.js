import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class UserPage extends Component{
 render(){
   return(
     <div>
        <p>Страница пользователя</p>

        <Link to="/">Назад</Link>
     </div>
   );
  }
}