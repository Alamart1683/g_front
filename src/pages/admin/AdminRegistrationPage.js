import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';
//import axios from 'axios';
//import { apiURL } from '../../Config';
import $ from 'jquery';

//import orderImage from '../../images/icons/order.png';

export default function AdminRegistrationPage() {
    const { authTokens } = useAuthContext();

    function checkIfCanRegisterStudent() {
        if ($('#student-mail').val() !== '' &&
            $('#student-name').val() !== '' &&
            $('#student-surname').val() !== '' &&
            $('#student-second-name').val() !== '' &&
            $('#student-phone').val() !== '' &&
            $('#student-speciality :selected').val() !== '' &&
            $('#student-group :selected').val() !== '') {
            document.getElementById('register-student-button').disabled = false;
        }
        else {
            document.getElementById('register-student-button').disabled = true;
        }
    }

    // TODO
    function registerStudent() {
        //console.log('register student');
        var email = $('#student-mail').val();
        var name = $('#student-name').val();
        var surname = $('#student-surname').val();
        var secondName = $('#student-second-name').val();
        var phone = $('#student-phone').val();
        var speciality = $('#student-speciality :selected').val();
        var group = $('#student-group :selected').val();
    }

    function checkIfCanRegisterSca() {
        if ($('#sca-mail').val() !== '' &&
            $('#sca-name').val() !== '' &&
            $('#sca-surname').val() !== '' &&
            $('#sca-second-name').val() !== '' &&
            $('#sca-phone').val() !== '') {
            document.getElementById('register-sca-button').disabled = false;
        }
        else {
            document.getElementById('register-sca-button').disabled = true;
        }
    }

    // TODO
    function registerSca() {
        //console.log('register sca');
        var email = $('#sca-mail').val();
        var name = $('#sca-name').val();
        var surname = $('#sca-surname').val();
        var secondName = $('#sca-second-name').val();
        var phone = $('#sca-phone').val();
    }

    function checkIfCanRegisterHoc() {
        if ($('#hoc-mail').val() !== '' &&
            $('#hoc-name').val() !== '' &&
            $('#hoc-surname').val() !== '' &&
            $('#hoc-second-name').val() !== '' &&
            $('#hoc-phone').val() !== '') {
            document.getElementById('register-hoc-button').disabled = false;
        }
        else {
            document.getElementById('register-hoc-button').disabled = true;
        }
    }

    // TODO
    function registerHoc() {
        //console.log('register hoc');
        var email = $('#hoc-mail').val();
        var name = $('#hoc-name').val();
        var surname = $('#hoc-surname').val();
        var secondName = $('#hoc-second-name').val();
        var phone = $('#hoc-phone').val();
    }

    function checkIfCanRegisterAdmin() {
        if ($('#admin-mail').val() !== '' &&
            $('#admin-name').val() !== '' &&
            $('#admin-surname').val() !== '' &&
            $('#admin-second-name').val() !== '' &&
            $('#admin-phone').val() !== '') {
            document.getElementById('register-admin-button').disabled = false;
        }
        else {
            document.getElementById('register-admin-button').disabled = true;
        }
    }

    // TODO
    function registerAdmin() {
        //console.log('register admin');
        var email = $('#admin-mail').val();
        var name = $('#admin-name').val();
        var surname = $('#admin-surname').val();
        var secondName = $('#admin-second-name').val();
        var phone = $('#admin-phone').val();
    }

    $(function () {

        if (authTokens.userRole !== 'root') {
            document.getElementById('button-4').disabled = true;
        }

        if (authTokens.userRole !== 'root') {
            document.getElementById('button-3').disabled = true;
        }

        $('.contentButton').off().on('click', function (event) {
            $('.contentPanel').addClass('contentPanel-hidden');
            var buttonId = $(this).attr('id');
            $('.contentButton').removeClass('contentButton-selected');
            $(this).addClass('contentButton-selected');
            switch (buttonId) {
                case 'button-1':
                    $('#orderContentPanel1').removeClass('contentPanel-hidden');
                    break;
                case 'button-2':
                    $('#orderContentPanel2').removeClass('contentPanel-hidden');
                    break;
                case 'button-3':
                    $('#orderContentPanel3').removeClass('contentPanel-hidden');
                    break;
                case 'button-4':
                    $('#orderContentPanel4').removeClass('contentPanel-hidden');
                    break;
                default:
                    console.log('switchError');
            }
        })

        $('#register-student-button').off().on('click', function() {
            registerStudent();
        });

        $('#register-sca-button').off().on('click', function() {
            registerSca();
        });

        $('#register-hoc-button').off().on('click', function() {
            registerHoc();
        });

        $('#register-admin-button').off().on('click', function() {
            registerAdmin();
        });

    });

    return (
        <div className="ordersPanel">
            <div className="typeButtonPanel">
                <button type='submit' id='button-1' className="contentButton contentButton-selected light size-22">Регистрация<br />Студентов</button>
                <button type='submit' id='button-2' className="contentButton light size-22">Регистрация<br />Научных Руководителей</button>
                <button type='submit' id='button-3' className="contentButton light size-22">Регистрация<br />Заведующего Кафедрой</button>
                <button type='submit' id='button-4' className="contentButton light size-22" style={{ marginRight: "0px" }}>Регистрация<br />Администраторов</button>
            </div>

            <div id="orderContentPanel1" className="contentPanel">
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                    </div>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Направление:</p>
                        <select id='student-speciality' defaultValue='' onChange={(e) => { checkIfCanRegisterStudent(); }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите направление</option>
                            <option value='09.03.04'>09.03.01</option>
                            <option value='09.03.04'>09.03.04</option>
                        </select>

                        <p className='admin-registration-label dark size-24'>Группа:</p>
                        <select id='student-group' defaultValue='' onChange={(e) => { checkIfCanRegisterStudent(); }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите группу</option>
                            <option value='ИКБО-06-17'>ИКБО-06-17</option>
                            <option value='ИКБО-12-17'>ИКБО-12-17</option>
                            <option value='ИКБО-07-17'>ИКБО-07-17</option>
                            <option value='ИКБО-11-17'>ИКБО-11-17</option>
                        </select>

                        <button id='register-student-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '50px', marginTop: '30px', width: '600px' }}>Зарегистрировать студента</button>
                    </div>
                </div>
                <button className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '400px', marginTop: '30px', width: '600px' }}>Зарегистрировать студентов<br />из файла</button>
            </div>
            <div id="orderContentPanel2" className="contentPanel contentPanel-hidden">
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>

                    </div>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                    </div>
                </div>
                <button id='register-sca-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '400px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Научного Руководителя</button>
            </div>
            <div id="orderContentPanel3" className="contentPanel contentPanel-hidden">
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterHoc(); }} id='hoc-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterHoc(); }} id='hoc-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>
                        
                    </div>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterHoc(); }} id='hoc-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterHoc(); }} id='hoc-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterHoc(); }} id='hoc-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                    </div>
                </div>
                <button id='register-hoc-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '400px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Заведующего Кафедрой</button>
            </div>
            <div id="orderContentPanel4" className="contentPanel contentPanel-hidden">
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>


                    </div>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                    </div>
                </div>
                <button id='register-admin-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '400px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Администратора</button>
            </div>
        </div>
    );
}