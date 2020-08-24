import React from 'react';

export default class LoginPage extends React.Component{
 render(){
   return(
     <div>
        <div>Гостевая страница</div>
        <div>
          <form method="POST" action="/login">
            <h2>Вход в систему</h2>
            <div>
              
            </div>
          </form>
        </div>
        <p></p>
        <a href='/register'>Регистрация</a>
        <p></p>
        <a href='/forgotten_password'>Восстановить пароль</a>
        <p></p>
     </div>
   );
  }
}