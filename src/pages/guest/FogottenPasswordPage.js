import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { apiURL } from '../../Config';
import axios from 'axios';
import $ from 'jquery';

export default function ForgottenPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [show, setShow] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function sendCode() {
    if (show) {
      document.getElementById('send-again-button').disabled = true;
    }
    axios({
      url: apiURL + '/authorization/get/password/code/byemail',
      method: 'GET',
      params: {
        'email': email
      },
    }).then((response) => {
      //console.log(response.data);
      if (show) {
        document.getElementById('send-again-button').disabled = false;
      }
    }).catch(result => {
      console.log(result.data);
      if (show) {
        document.getElementById('send-again-button').disabled = false;
      }
    });

  }

  $(function () {
    $('#change-password-button').off().on('click', function () {
      axios({
        url: apiURL + '/authorization/get/password/code/byemail',
        method: 'GET',
        params: {
          'email': email
        },
      }).then((response) => {
        //console.log(response.data);
        if (response.data === 'Ошибка: пользователь не найден') {
          document.getElementById('error-message').style.visibility = 'visible';
        }
        else {
          document.getElementById('error-message').style.visibility = 'hidden';
          setShow(true);
        }
      }).catch(result => {
        console.log(result.data);
      });

    });

    $('#send-again-button').off().on('click', function () {
      sendCode();
    });

    $('#final-change-button').off().on('click', function () {
      document.getElementById('final-change-button').disabled = true;
      axios({
        url: apiURL + '/authorization/change/password/byemail/',
        method: 'POST',
        params: {
          'email': email,
          'code': $('#code-input').val(),
          'newPassword': newPassword,
        },
      }).then((response) => {
        //console.log(response.data);
        if (response.data === 'Пароль успешно изменен') {
          setRedirect(true);
        }
        else {
          document.getElementById('code-error-message').style.visibility = 'visible';
        }
      }).catch(result => {
        console.log(result.data);
      });
    });

  });

  return (
    <Form>
      <div className='recover-password-div light-background'>
        <p className='size-48 dark loginForm-topLabel'>Восстановление пароля</p>
        <Form.Group className='loginForm-formGroup'>
          <Form.Label className="size-21 dark loginForm-label1">Логин</Form.Label>
          <Form.Control id='new-email' type="email" value={email} onChange={e => {
            setEmail(e.target.value);
            document.getElementById('error-message').style.visibility = 'hidden';
            if ($('#new-email').val() !== '' && $('#new-password').val() !== '') {
              document.getElementById('change-password-button').disabled = false;
            }
            else {
              document.getElementById('change-password-button').disabled = true;
            }
          }}
            placeholder="Введите почту" className="size-24 loginForm-input" />
        </Form.Group>

        <Form.Group className='loginForm-formGroup'>
          <Form.Label className="size-21 dark loginForm-label4">Пароль</Form.Label>
          <Form.Control id='new-password' type="password" onChange={e => {
            setNewPassword(e.target.value);
            if ($('#new-email').val() !== '' && $('#new-password').val() !== '') {
              document.getElementById('change-password-button').disabled = false;
            }
            else {
              document.getElementById('change-password-button').disabled = true;
            }
          }}
            placeholder="Введите новый пароль" className="size-24 loginForm-input" />
        </Form.Group>

        <p id='error-message' style={{ visibility: 'hidden', marginBottom: '10px' }} className='dark size-24'>Такого пользователя<br />не существует!</p>

        <button id='change-password-button' type='button' disabled className="size-32 dark-background light loginForm-button" style={{ height: '148px' }}>Отправить на почту<br />код для смены пароля</button>

        <Link to='/guest/login'>
          <button type='button' style={{ marginTop: '20px' }} className="size-32 dark-background light loginForm-button">Назад</button>
        </Link>

        <Modal centered show={show} onEnter={(e) => { }} onHide={(e) => { setShow(false); }} className='dark' >
          <Modal.Header className='light-background forgotten-password-modal-header' closeButton>
            <Modal.Title className='size-36 '>
              <p style={{ height: '50px', marginBottom: '0px', marginLeft: '130px' }}>Введите код</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='light-background forgotten-password-modal-body'>
            <input id='code-input' className='forgotten-password-input size-36' type='text' placeholder='Код' onChange={(e) => {
              document.getElementById('code-error-message').style.visibility = 'hidden';
              if ($('#code-input').val() !== '') {
                document.getElementById('final-change-button').disabled = false;
              }
              else {
                document.getElementById('final-change-button').disabled = true;
              }
            }}></input>

            <p className='dark size-24'>Сообщение с кодом подтверждения<br />было отправлено на указанный адрес</p>
            <button disabled id='final-change-button' type='button' style={{ marginTop: '20px', marginBottom: '20px', width: '417px' }} className="size-32 dark-background light loginForm-button">Сменить пароль</button>

            <p id='code-error-message' style={{ visibility: 'hidden' }} className='dark size-24'>Введен неверный код!</p>

            <p style={{ marginBottom: '5px' }} className='dark size-24'>Сообщение с кодом подтверждения<br />не пришло?</p>
            <button id='send-again-button' type='button' style={{ marginBottom: '20px', width: '417px' }} className="size-32 dark-background light loginForm-button">Отправить код повторно</button>
          </Modal.Body>
        </Modal>

        {redirect ? (<Redirect push to='/guest/login' />) : null}
      </div>
    </Form>
  );

}