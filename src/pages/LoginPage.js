import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../auth/AuthContext';
import { apiURL } from '../Config';

export default function LoginPage() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuthContext();

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
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/user" />;
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
            <Link to="/forgotten_password">
                <Form.Text className="text-muted">
                Забыли пароль? Восстановить
                </Form.Text>
            </Link>
          </Form.Group>

          <Form.Group controlId="formLoginSubmit" onClick={postLogin}>
            <Button>Войти в систему</Button>
            { isError && <div>Почтовый адрес или пароль введены неправильно!</div> }
          </Form.Group>

          <p>Или</p>

          <Link to="/registration" >
            <Button>Зарегистрироваться</Button>
          </Link>

        </Form>

        <Link to="/">Назад</Link>
     </div>
   );

}