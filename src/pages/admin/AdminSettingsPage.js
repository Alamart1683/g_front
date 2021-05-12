import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import axios from 'axios';
import $ from 'jquery';

export default function AdminSettingsPage() {
    const { authTokens } = useAuthContext();

    const [show, setShow] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const [newPassword, setNewPassword] = useState('');

    function sendCode() {
        if (show) {
            document.getElementById('send-again-button').disabled = true;
        }
        axios({
            url: apiURL + '/authorization/get/password/code',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
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
            document.getElementById('change-password-button').disabled = true;
            axios({
                url: apiURL + '/authorization/get/password/code',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                console.log(response.data);
                setShow(true);
            }).catch(result => {
                console.log(result.data);
                document.getElementById('change-password-button').disabled = false;
            });

        });

        $('#send-again-button').off().on('click', function () {
            sendCode();
        });

        $('#final-change-button').off().on('click', function () {
            document.getElementById('final-change-button').disabled = true;
            axios({
                url: apiURL + '/authorization/change/password/',
                method: 'POST',
                params: {
                    'code': $('#code-input').val(),
                    'newPassword': newPassword,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
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
                console.log(result);
            });
        });

    });

    return (
        <div>
            <div className='ordersPanel'>
                <div id="orderContentPanel1" className="contentPanel" style={{ height: '360px' }}>
                    
                    <p style={{ marginLeft: '630px', marginTop: '20px' }} className='dark size-36'>Смена пароля</p>
                    <input style={{ marginLeft: '440px', height: '45px', textAlign: 'center' }} maxLength='50' id='new-password' type='password' value={newPassword} onChange={(e) => {
                        setNewPassword(e.target.value);
                        if ($('#new-password').val() !== '') {
                            document.getElementById('change-password-button').disabled = false;
                        }
                        else {
                            document.getElementById('change-password-button').disabled = true;
                        }
                    }} className='admin-registration-input dark size-36' placeholder='Введите новый пароль'></input>
                    <button id='change-password-button' disabled className='admin-registration-button light size-30 dark-background'
                        style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Отправить на почту код<br />для смены пароля</button>
                </div>
            </div>

            <Modal centered show={show} onEnter={(e) => { }} onHide={(e) => { setShow(false); document.getElementById('change-password-button').disabled = false;}} className='dark' >
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
    );
}