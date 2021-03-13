import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../../Config';
import $ from 'jquery';

//import orderImage from '../../images/icons/order.png';

export default function AdminRegistrationPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [ groups, setGroups] = useState([]);

    useEffect(() => {
        //showOrders(orders);
    }, [groups]);

    if (!fetchedData) {
        setFetchedData(true);
        getGroups();
    }

    function getGroups() {
        axios({
            url: apiURL + '/student_group/all',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            console.log(response.data);
            setGroups(response.data);
        }).catch(result => {
            console.log(result);
        });
    }

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

    function registerStudent() {
        var email = $('#student-mail').val();
        var name = $('#student-name').val();
        var surname = $('#student-surname').val();
        var secondName = $('#student-second-name').val();
        var phone = $('#student-phone').val();
        var group = $('#student-group :selected').val();
        axios({
            url: apiURL + '/admin/registration/student',
            method: 'POST',
            params: {
                'cathedra': 'МОСИТ',
                'student_group': group,
                'email': email,
                'name': name,
                'surname': surname,
                'second_name': secondName,
                'phone': phone,
                'mailSendingAccepted': true,
                'student_type': 'Бакалавр',
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            window.location.reload(true);
        }).catch(result => {
            console.log(result);
        });
    }

    function registerStudentsFromFile(file) {
        document.getElementById('register-students-from-file-button').disabled = true;
        var formData = new FormData();
        formData.append('cathedra', 'МОСИТ');
        formData.append('type', 'Бакалавр');
        formData.append('studentData', file);
        axios({
            url: apiURL + '/admin/registration/students/automatic',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            window.location.reload();
            //console.log(response);
        }).catch(result => {
            console.log(result.data);
            document.getElementById('register-students-from-file-button').disabled = false;
        });
    }

    function registerScaFromFile(file) {
        document.getElementById('register-sca-from-file-button').disabled = true;
        var formData = new FormData();
        formData.append('cathedra', 'МОСИТ');
        formData.append('studentData', file);
        axios({
            url: apiURL + '/admin/registration/advisors/automatic',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            window.location.reload();
            //console.log(response);
        }).catch(result => {
            console.log(result.data);
            document.getElementById('register-sca-from-file-button').disabled = false;
        });
    }

    function checkIfCanRegisterSca() {
        if ($('#sca-mail').val() !== '' &&
            $('#sca-name').val() !== '' &&
            $('#sca-surname').val() !== '' &&
            $('#sca-second-name').val() !== '' &&
            $('#sca-phone').val() !== '' &&
            $('#sca-position').val() !== ''&&
            $('#sca-cathedra').val() !== '') {
            document.getElementById('register-sca-button').disabled = false;
        }
        else {
            document.getElementById('register-sca-button').disabled = true;
        }
    }

    function registerSca() {
        var email = $('#sca-mail').val();
        var name = $('#sca-name').val();
        var surname = $('#sca-surname').val();
        var secondName = $('#sca-second-name').val();
        var phone = $('#sca-phone').val();
        var cathedra = $('#sca-cathedra').val();
        var position = $('#sca-position').val();
        axios({
            url: apiURL + '/admin/registration/scientific_advisor',
            method: 'POST',
            params: {
                'cathedra': cathedra,
                'email': email,
                'name': name,
                'surname': surname,
                'second_name': secondName,
                'phone': phone,
                'mailSendingAccepted': true,
                'places': 10,
                'position': position,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            window.location.reload(true);
        }).catch(result => {
            console.log(result);
        });
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

    function registerAdmin() {
        var email = $('#admin-mail').val();
        var name = $('#admin-name').val();
        var surname = $('#admin-surname').val();
        var secondName = $('#admin-second-name').val();
        var phone = $('#admin-phone').val();
        axios({
            url: apiURL + '/root/registration/admin',
            method: 'POST',
            params: {
                'email': email,
                'name': name,
                'surname': surname,
                'second_name': secondName,
                'phone': phone,
                'mailSendingAccepted': true,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            window.location.reload(true);
        }).catch(result => {
            console.log(result);
        });
    }

    $(function () {

        if (authTokens.userRole !== 'root') {
            document.getElementById('button-4').disabled = true;
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

        $('#register-students-from-file-button').off().on('click', function() {
            $('#student-file-input').trigger('click');
        });

        $('#register-sca-from-file-button').off().on('click', function() {
            $('#sca-file-input').trigger('click');
        });

        $('#register-sca-button').off().on('click', function() {
            registerSca();
        });

        $('#register-admin-button').off().on('click', function() {
            registerAdmin();
        });

    });

    return (
        <div className="ordersPanel">
            <div className="typeButtonPanel">
                <button type='submit' id='button-1' className="contentButton contentButton-selected light size-22" style={{width:'486px'}}>Регистрация<br />Студентов</button>
                <button type='submit' id='button-2' className="contentButton light size-22" style={{width:'486px'}}>Регистрация<br />Научных Руководителей</button>
                <button type='submit' id='button-4' className="contentButton light size-22" style={{ marginRight: "0px",width:'486px' }}>Регистрация<br />Администраторов</button>
            </div>

            <div id="orderContentPanel1" className="contentPanel">
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>
                        
                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Направление:</p>
                        <select id='student-speciality' defaultValue='' onChange={(e) => { 
                            var speciality = $('#student-speciality :selected').val();
                            $('#student-group option').remove();
                            var defOption = document.createElement('option');
                            defOption.value = '';
                            defOption.innerText = 'Выберите группу';
                            defOption.disabled = true;
                            defOption.hidden = true;
                            document.getElementById('student-group').appendChild(defOption);
                            document.getElementById('student-group').value = '';
                            checkIfCanRegisterStudent();
                            for (var i = 0; i < groups.length; i++) {
                                var option = document.createElement('option');
                                option.value = groups[i].studentGroup;
                                option.innerText = groups[i].studentGroup;
                                if (speciality === '09.03.04' && groups[i].studentGroup.includes('ИКБО')) {
                                   document.getElementById('student-group').appendChild(option);
                                }
                                if (speciality === '09.03.01' && groups[i].studentGroup.includes('ИВБО')) {
                                    document.getElementById('student-group').appendChild(option);
                                }
                            }
                            document.getElementById('student-group').disabled = false;
                        }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите направление</option>
                            <option value='09.03.01'>09.03.01</option>
                            <option value='09.03.04'>09.03.04</option>
                        </select>

                        <p className='admin-registration-label dark size-24'>Группа:</p>
                        <select disabled id='student-group' defaultValue='' onChange={(e) => { checkIfCanRegisterStudent(); }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите группу</option>
                        </select>
                        
                    </div>
                    <div className='info-column'>
                        

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterStudent(); }} id='student-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                                            
                    </div>
                </div>
                <button id='register-student-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Зарегистрировать студента</button>

                <button id='register-students-from-file-button' className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Зарегистрировать студентов<br />из файла</button>
                <input id='student-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            registerStudentsFromFile(e.target.files[0]);
                        }
                    }} ></input>
            </div>
            <div id="orderContentPanel2" className="contentPanel contentPanel-hidden" style={{height:'710px'}}>
                <div className='info-row' style={{ paddingTop: '20px' }}>
                    <div className='info-column'>
                        <p className='admin-registration-label dark size-24'>Почта:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-mail' type='text' placeholder='Введите почту' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Телефон:</p>
                        <input maxLength='12' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-phone' type='text' placeholder='Введите телефон' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Кафедра:</p>
                        <select id='sca-cathedra' defaultValue='' onChange={(e) => { checkIfCanRegisterSca(); }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите кафедру</option>
                            <option value='МОСИТ'>МОСИТ</option>
                        </select>

                    </div>
                    <div className='info-column'>

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterSca(); }} id='sca-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Дожность:</p>
                        <select id='sca-position' defaultValue='' onChange={(e) => { checkIfCanRegisterSca(); }} className='admin-registration-select dark size-24'>
                            <option value='' disabled hidden>Выберите должность</option>
                            <option value='д.т.н, профессор'>д.т.н, профессор</option>
                            <option value='к.т.н, доцент'>к.т.н, доцент</option>
                            <option value='к.т.н, ст. преподаватель'>к.т.н, ст. преподаватель</option>
                        </select>
                    </div>
                </div>
                <button id='register-sca-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Научного Руководителя</button>

                <button id='register-sca-from-file-button' className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Научных Руководителей из файла</button>
                <input id='sca-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            registerScaFromFile(e.target.files[0]);
                        }
                    }} ></input>
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

                        <p className='admin-registration-label dark size-24'>Фамилия:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-surname' type='text' placeholder='Введите фамилию' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Имя:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-name' type='text' placeholder='Введите имя' className='admin-registration-input dark size-24'></input>

                        <p className='admin-registration-label dark size-24'>Отчество:</p>
                        <input maxLength='50' onChange={(e) => { checkIfCanRegisterAdmin(); }} id='admin-second-name' type='text' placeholder='Введите отчество' className='admin-registration-input dark size-24'></input>
                    </div>
                </div>
                <button id='register-admin-button' disabled className='admin-registration-button light size-30 dark-background' style={{ marginLeft: '440px', marginTop: '30px', width: '600px' }}>Зарегистрировать<br />Администратора</button>
            </div>
        </div>
    );
}