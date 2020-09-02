import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default class LoginPage extends Component{
 render(){
   return(
     <div>
        <Form>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="email" placeholder="Введите почту" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" placeholder="Введите пароль" />
            
            <Link to="/forgotten_password">
              <Form.Text className="text-muted">
                Забыли пароль? Восстановить
              </Form.Text>
            </Link>

          </Form.Group>

          <Link to="/user" >
            <Button variant="primary" type="submit">
              Войти в систему
            </Button>
          </Link>

          <p>Или</p>

          <Link to="/registration" >
            <Button variant="primary" type="submit">
              Создать аккаунт
            </Button>
          </Link>

        </Form>

        <Link to="/">Назад</Link>
     </div>
   );
  }
}