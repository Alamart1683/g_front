import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

export default function LoginPage() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuthContext();

  // Обработка запроса на логин по введенным данным
  function postLogin() {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    axios({
      method: 'post',
      url: apiURL + "/authorization",
      data: params
    })
    .then(result => {
      if (result.status === 200) {
        if (result.data.message === "Для авторизации необходимо подтвердить регистрацию аккаунта" ||
            result.data.message === "Неверная комбинация логина и пароля") {
          document.getElementById("errorMessage").innerHTML = result.data.message;
        }
        else {
          setAuthTokens(result.data);
          setLoggedIn(true);
        }
      } else {
        document.getElementById("errorMessage").innerHTML = "Ошибка подключения";
      }
    }).catch(e => {
      document.getElementById("errorMessage").innerHTML = "Неопределенная ошибка";
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return(
    <div>

        <Form>

          <Form.Group controlId="formLoginEmail">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="email" value={email} 
              onChange={e => {setEmail(e.target.value);}} placeholder="Введите почту" />
          </Form.Group>

          <Form.Group controlId="formLoginPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" onChange={e => {setPassword(e.target.value);}} 
              placeholder="Введите пароль" />
            <Link to="/guest/forgotten_password">
                <Form.Text className="text-muted">
                Забыли пароль? Восстановить
                </Form.Text>
            </Link>
          </Form.Group>

          <Form.Group controlId="formLoginSubmit" onClick={postLogin}>
            <Button>Войти в систему</Button>
            <p id = "errorMessage"></p>
          </Form.Group>

          <p>Или</p>

          <Link to="/guest/registration" >
            <Button>Зарегистрироваться</Button>
          </Link>

        </Form>

     </div>
   );

}