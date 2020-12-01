import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import axios from 'axios';
import $ from 'jquery';

export default function SettingsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [show, setShow] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const [newPassword, setNewPassword] = useState('');

    if (!fetchedData) {
        setFetchedData(true);
        getUserData(authTokens.userRole)

    }

    function getUserData(tokenRole) {
        var userRole;
        switch (tokenRole) {
            case 'student':
                userRole = 'student';
                break;
            case 'scientific_advisor':
                userRole = 'scientific_advisor';
                break;
            case 'head_of_cathedra':
                userRole = 'scientific_advisor';
                break;
            default:
                console.log('Ошибка определения роли пользователя');
        }
        axios({
            url: apiURL + '/' + userRole + '/personal',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            console.log(response);
            switch (tokenRole) {
                case 'student':
                    document.getElementById('student-mail').value = response.data.studentEmail;
                    document.getElementById('student-phone').value = response.data.studentPhone;
                    document.getElementById('student-speciality').value = response.data.studentSpeciality;
                    document.getElementById('student-name').value = response.data.studentName;
                    document.getElementById('student-surname').value = response.data.studentSurname;
                    document.getElementById('student-second-name').value = response.data.studentSecondName;
                    document.getElementById('student-role').value = 'Студент';
                    document.getElementById('student-group').value = response.data.studentGroup;
                    break;
                case 'scientific_advisor':
                    document.getElementById('student-mail').value = response.data.advisorEmail;
                    document.getElementById('student-phone').value = response.data.advisorPhone;
                    document.getElementById('student-name').value = response.data.advisorName;
                    document.getElementById('student-surname').value = response.data.advisorSurname;
                    document.getElementById('student-second-name').value = response.data.advisorSecondName;
                    document.getElementById('student-role').value = 'Научный руководитель';
                    document.getElementById('student-speciality').style.visibility = 'hidden';
                    document.getElementById('student-group').style.visibility = 'hidden';
                    document.getElementById('student-speciality-label').style.visibility = 'hidden';
                    document.getElementById('student-group-label').style.visibility = 'hidden';
                    break;
                case 'head_of_cathedra':
                    document.getElementById('student-mail').value = response.data.advisorEmail;
                    document.getElementById('student-phone').value = response.data.advisorPhone;
                    document.getElementById('student-name').value = response.data.advisorName;
                    document.getElementById('student-surname').value = response.data.advisorSurname;
                    document.getElementById('student-second-name').value = response.data.advisorSecondName;
                    document.getElementById('student-role').value = 'Заведующий кафедрой';
                    document.getElementById('student-speciality').style.visibility = 'hidden';
                    document.getElementById('student-group').style.visibility = 'hidden';
                    document.getElementById('student-speciality-label').style.visibility = 'hidden';
                    document.getElementById('student-group-label').style.visibility = 'hidden';
                    break;
                default:
                    console.log('Ошибка определения роли пользователя');
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

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
                <div id="orderContentPanel1" className="contentPanel" style={{ height: '810px' }}>
                    <p style={{ marginLeft: '500px' }} className='dark size-36'>Информация о пользователе</p>
                    <div className='info-row' style={{ paddingTop: '20px' }}>
                        <div className='info-column'>
                            <p className='admin-registration-label dark size-24'>Почта:</p>
                            <input disabled id='student-mail' type='text' className='admin-registration-input dark size-24'></input>

                            <p className='admin-registration-label dark size-24'>Телефон:</p>
                            <input disabled id='student-phone' type='text' className='admin-registration-input dark size-24'></input>

                            <p className='admin-registration-label dark size-24'>Роль:</p>
                            <input disabled id='student-role' type='text' className='admin-registration-input dark size-24'></input>

                            <p id='student-speciality-label' className='admin-registration-label dark size-24'>Направление:</p>
                            <input disabled id='student-speciality' type='text' className='admin-registration-input dark size-24'></input>

                        </div>
                        <div className='info-column'>


                            <p className='admin-registration-label dark size-24'>Фамилия:</p>
                            <input disabled id='student-surname' type='text' className='admin-registration-input dark size-24'></input>

                            <p className='admin-registration-label dark size-24'>Имя:</p>
                            <input disabled id='student-name' type='text' className='admin-registration-input dark size-24'></input>

                            <p className='admin-registration-label dark size-24'>Отчество:</p>
                            <input disabled id='student-second-name' type='text' className='admin-registration-input dark size-24'></input>

                            <p id='student-group-label' className='admin-registration-label dark size-24'>Группа:</p>
                            <input disabled id='student-group' type='text' className='admin-registration-input dark size-24'></input>
                        </div>
                    </div>
                    <p style={{ marginLeft: '590px', marginTop: '20px' }} className='dark size-36'>Смена пароля</p>
                    <input style={{ marginLeft: '400px', height: '45px', textAlign: 'center' }} maxLength='50' id='new-password' type='password' value={newPassword} onChange={(e) => {
                        setNewPassword(e.target.value);
                        if ($('#new-password').val() !== '') {
                            document.getElementById('change-password-button').disabled = false;
                        }
                        else {
                            document.getElementById('change-password-button').disabled = true;
                        }
                    }} className='admin-registration-input dark size-36' placeholder='Введите новый пароль'></input>
                    <button id='change-password-button' disabled className='admin-registration-button light size-30 dark-background'
                        style={{ marginLeft: '400px', marginTop: '30px', width: '600px' }}>Отправить на почту код<br />для смены пароля</button>
                </div>
            </div>

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
    );
}