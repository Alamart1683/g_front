import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, OverlayTrigger, Popover } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

export default function LoginPage() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuthContext();

  // Бутстрап отказывается менять вид Popover при использовании classname
  // OverlayTrigger внедряет свой style и видимо переписывает его
  const popoverContentStyle = {
    font: 'PT Sans',
    fontSize: '30px',
    color: '#3A5985'
  };

  const errorPopover = (props) => (
    <Popover {...props} id='errorPopover' >
      <Popover.Title style={ popoverContentStyle }>
        Ошибка!
      </Popover.Title>
      <Popover.Content id='errorPopoverContent' style={ popoverContentStyle }>
        Неверный логин или пароль
      </Popover.Content>
    </Popover>
  );

  // Обработка запроса на логин по введенным данным
  function postLogin() {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    // TODO: Переписать через fetch
    axios({
      method: 'post',
      url: apiURL + '/authorization',
      data: params
    })
    .then(result => {
      if (result.status === 200) {
        if (result.data.message === "Аккаунт не подтвержден" ||
            result.data.message === "Неверный логин или пароль") {
          //document.getElementById("errorMessage").style.visibility = 'visible';
          //document.getElementById("errorMessage").innerHTML = result.data.message;
        }
        else {
          setAuthTokens(result.data);
          setLoggedIn(true);
        }
      } else {
        //document.getElementById("errorMessage").style.visibility = 'visible';
        //document.getElementById("errorMessage").innerHTML = "Ошибка подключения";
      }
    }).catch(e => {
      //document.getElementById("errorMessage").style.visibility = 'visible';
      //document.getElementById("errorMessage").innerHTML = "Непредвиденная ошибка";
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return(
    <div>

        <Form className="loginForm light-background" onSubmit={ e => {e.preventDefault(); postLogin();} }>
          <p className="size-48 dark loginForm-topLabel">Вход</p>

          <Form.Group controlId="formLoginEmail" className='loginForm-formGroup'>
            <Form.Label className="size-21 dark loginForm-label1">Логин</Form.Label>
            <Form.Control type="email" value={email} onChange={e => {setEmail(e.target.value);}} 
              placeholder="Введите почту" className="size-24 loginForm-input"/>
          </Form.Group>

          <Form.Group controlId="formLoginPassword" className='loginForm-formGroup'>
            <Form.Label className="size-21 dark loginForm-label4">Пароль</Form.Label>
            <Form.Control type="password" onChange={e => {setPassword(e.target.value);}} 
              placeholder="Введите пароль" className="size-24 loginForm-input"/>
            <Link to="/guest/forgotten_password">
                <Form.Text className="size-21 dark loginForm-label2">
                  Забыли пароль? Восстановить
                </Form.Text>
            </Link>
          </Form.Group>

          <Form.Group controlId="formLoginSubmit" onClick={postLogin} className='loginForm-formGroup'>
            
            <OverlayTrigger trigger='click' placement='right' overlay={errorPopover}>
              <button type='submit' className="size-32 dark-background light loginForm-button">Войти в систему</button>
            </OverlayTrigger>
            
          </Form.Group>

          <p className="size-21 dark loginForm-label3">Или</p>

          <Link to="/guest/registration" >
            <button type='button' className="size-32 dark-background light loginForm-button">Создать аккаунт</button>
          </Link>

        </Form>

     </div>
   );

}