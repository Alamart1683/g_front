import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, OverlayTrigger, Popover } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

export default function LoginPage() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [popoverShow, setPopoverShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuthContext();
  const [fetchedData, setFetchedData] = useState(false);

  if (!fetchedData) {
    setFetchedData(true);
    if (sessionStorage.getItem('loginEmail') != null) {
      setEmail(sessionStorage.getItem('loginEmail'));
    }
  }

  // Бутстрап отказывается менять вид Popover при использовании classname
  // OverlayTrigger внедряет свой style и видимо переписывает его
  const popoverTitleStyle = {
    fontSize: '30px',
    background: '#E8F0FE',
    color: '#3A5985',
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
    borderBottomWidth: '0'
  };
  const popoverContentStyle = {
    fontSize: '30px',
    color: '#3A5985'
  };

  const errorPopover = (props) => (
    <Popover {...props} id='errorPopover' >
      <Popover.Title style={popoverTitleStyle}>
        Ошибка!
      </Popover.Title>
      <Popover.Content id='errorPopoverContent' style={popoverContentStyle}>
        Неверный логин или пароль
      </Popover.Content>
    </Popover>
  );

  // Обработка запроса на логин по введенным данным
  function postLogin() {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    axios({
      method: 'post',
      url: apiURL + '/authorization',
      data: params
    })
      .then(result => {
        if (result.status === 200) {
          if (result.data.message === "Аккаунт не подтвержден" ||
            result.data.message === "Неверный логин или пароль") {
            setPopoverShow(true);
            document.getElementById("errorPopoverContent").innerHTML = result.data.message;
          }
          else {
            setAuthTokens(result.data);
            setLoggedIn(true);
          }
        } else {
          setPopoverShow(true);
          document.getElementById("errorPopoverContent").innerHTML = "Ошибка подключения";
        }
      }).catch(e => {
        setPopoverShow(true);
        document.getElementById("errorPopoverContent").innerHTML = "Нет связи с сервером";
      });
  }

  return (
    <div>
      <Form className="loginForm light-background" onSubmit={e => {
        e.preventDefault();
        //sessionStorage.setItem('loginEmail', email); 
        postLogin();
      }}>
        <p className="size-48 dark loginForm-topLabel">Вход</p>

        <Form.Group controlId="formLoginEmail" className='loginForm-formGroup'>
          <Form.Label className="size-21 dark loginForm-label1">Логин</Form.Label>
          <Form.Control type="email" value={email} onChange={e => {
            setEmail(e.target.value);
            setPopoverShow(false);
            sessionStorage.setItem('loginEmail', e.target.value);
          }} placeholder="Введите почту" className="size-24 loginForm-input" />
        </Form.Group>

        <Form.Group controlId="formLoginPassword" className='loginForm-formGroup'>
          <Form.Label className="size-21 dark loginForm-label4">Пароль</Form.Label>
          <Form.Control type="password" onChange={e => { setPassword(e.target.value); setPopoverShow(false); }}
            placeholder="Введите пароль" className="size-24 loginForm-input" />
          <Link to="/guest/forgotten_password">
            <Form.Text className="size-21 dark loginForm-label2">
              Не знаете или забыли пароль?
            </Form.Text>
          </Link>
        </Form.Group>

        <Form.Group controlId="formLoginSubmit" onClick={postLogin} className='loginForm-formGroup'>

          <OverlayTrigger trigger='click' placement='right' show={popoverShow} overlay={errorPopover}>
            <button type='submit' className="size-32 dark-background light loginForm-button">Войти в систему</button>
          </OverlayTrigger>

        </Form.Group>


        <Link to="/guest/forgotten_password">
          <Form.Text className="size-21 dark loginForm-label2">
            Входите в первый раз?
            </Form.Text>
        </Link>

      </Form>
      { isLoggedIn ? (<Redirect push to='/' />) : null}
    </div>
  );

}