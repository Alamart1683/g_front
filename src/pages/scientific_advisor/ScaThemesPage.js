import React, {useState, useEffect} from 'react';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

export default function StudentThemePage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    
    const [students, setStudents] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Неопределенная ошибка');

    useEffect(() => {
        showStudentThemes(students);
    }, [students]);

    if (!fetchedData) {
        setFetchedData(true);
        getStudents();
    }

    // Получение данных о студентах
    function getStudents() {
        axios({
            url: apiURL + '/scientific_advisor/student/active',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setStudents(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showStudentThemes(studentArray) {
        for (var i = 0; i < studentArray.length; i++) {
            var item = studentArray[i];

            var student = document.createElement('tr');
            student.id = 'student' + i;
            student.className = 'size-20 dark';

            var studentNum = document.createElement('th');
            studentNum.innerText = i + 1;

            // Имя студента
            var studentFio = document.createElement('th');

            var projectArea = 'Комплексный проект не назначен';
            if (item.projectArea !== 'Нет проектной области') {
                projectArea = item.projectArea;
            }

            var popover = document.createElement('a');
            popover.href = '#';
            popover.onclick = 'return false;';
            popover.className = 'student-popover dark size-24';
            $(popover).attr('data-toggle', 'popover');
            $(popover).attr('title', 'Данные студента:');
            $(popover).attr('data-html', 'true');
            $(popover).attr('data-content', "Имя: " + item.fio +
                "<br /> Группа: " + item.group +
                "<br /> Телефон: " + item.phone +
                "<br /> Почта: " + item.email +
                "<br /> Комплексный проект: " + projectArea +
                "<br /> Проект: " + item.projectName);
            popover.innerText = item.fio.split(' ')[0] +
                '. ' +
                item.fio.split(' ')[1].charAt(0) +
                '. ' +
                item.fio.split(' ')[2].charAt(0) +
                '.';

            // Тема студента
            var studentTheme = document.createElement('th');
           var studentInput = document.createElement('textarea');
           studentInput.className = 'sca-student-theme-area dark';
           studentInput.value = item.studentVkrTheme;
           studentInput.maxLength = '1023';
           studentInput.id = 'student-input-'+i;

            var changeButtonTh = document.createElement('th');
            var changeButton = document.createElement('button');
            //studentButton.style.minWidth = '100px';
            changeButton.className = 'sca-projects-table-button change-button dark';
            changeButton.innerText = 'Изменить тему';
            changeButton.id = 'change-button-' + i;
            
            var confirmButtonTh = document.createElement('th');
            var confirmButton = document.createElement('button');
            confirmButton.className = 'sca-projects-table-button confirm-button dark';
            confirmButton.innerText = 'Одобрить';
            confirmButton.id = 'confirm-button-' + i;
            
            var unconfirmButton = document.createElement('button');
            unconfirmButton.className = 'sca-projects-table-button unconfirm-button dark';
            unconfirmButton.innerText = 'Разрешить изменять тему';
            unconfirmButton.id = 'unconfirm-button-' + i;

            var studentStatus = document.createElement('th');
            studentStatus.className = 'student-theme-status';
            if (item.studentVkrThemeEditable) {
                studentStatus.innerText += 'Не одобрено';
                //unconfirmButton.disabled = true;
                unconfirmButton.style.display = 'none';
            }
            else {
                studentStatus.innerText += 'Одобрено';
                changeButton.disabled = true; 
                //confirmButton.disabled = true;
                studentInput.disabled = true;
                confirmButton.style.display = 'none';
            }
            
            student.appendChild(studentNum);
            studentFio.appendChild(popover);
            student.appendChild(studentFio);
            studentTheme.appendChild(studentInput);
            student.appendChild(studentTheme);
            student.appendChild(studentStatus);

            changeButtonTh.appendChild(changeButton);
            student.appendChild(changeButtonTh);
            
            confirmButtonTh.appendChild(confirmButton);
            confirmButtonTh.appendChild(unconfirmButton);
            student.appendChild(confirmButtonTh);

            document.getElementById('student-table-body').appendChild(student);
        }
    }

    $(function () {
        $('[data-toggle="popover"]').popover();

        $('.student-popover').on('click', function (e) {
            e.preventDefault();
        });

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        $('.change-button').off().on('click', function() {
            $(this).attr('disabled', true);
            $(this).parent().parent().find('.sca-student-theme-area').attr('disabled', true);
            var id = $(this).attr('id').split('-')[2];
            var newTheme = $('#student-input-' + id).val();
            axios({
                url: apiURL + '/scientific_advisor/edit/student/vkr_theme',
                method: 'POST',
                params: {
                    'studentID': students[id].systemStudentID,
                    'newTheme': newTheme,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                $(this).parent().parent().find('.sca-student-theme-area').val(newTheme);
            }).catch(result => {
                console.log(result);
                setErrorMessage('Ошибка при изменении темы ВКР студента!');
                setShowError(true);
            });
            $(this).parent().parent().find('.sca-student-theme-area').attr('disabled', false);
            $(this).attr('disabled', false);
        });

        $('.confirm-button').off().on('click', function() {
            $(this).attr('disabled', true);
            var id = $(this).attr('id').split('-')[2];
            var newTheme = $('#student-input-' + id).val();
            // Изменение темы на записанную в поле ввода
            axios({
                url: apiURL + '/scientific_advisor/edit/student/vkr_theme',
                method: 'POST',
                params: {
                    'studentID': students[id].systemStudentID,
                    'newTheme': newTheme,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                $(this).parent().parent().find('.sca-student-theme-area').val(newTheme);
                // Утверждение темы
                axios({
                    url: apiURL + '/scientific_advisor/approve/student/vkr_theme',
                    method: 'POST',
                    params: {
                        'studentID': students[id].systemStudentID,
                        'approve': false,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    //console.log(response);
                    $(this).css('display', 'none');
                    $(this).parent().parent().find('.unconfirm-button').css('display','block');
                    $(this).parent().parent().find('.change-button').attr('disabled', true);
                    $(this).parent().parent().find('.sca-student-theme-area').attr('disabled', true);
                    $(this).parent().parent().find('.student-theme-status').text('Одобрено');
                }).catch(result => {
                    console.log(result);
                    setErrorMessage('Ошибка при утверждении темы ВКР студента!');
                    setShowError(true);
                });
            }).catch(result => {
                console.log(result);
                setErrorMessage('Ошибка при изменении темы ВКР студента!');
                setShowError(true);
            });           
            $(this).attr('disabled', false);
        });

        $('.unconfirm-button').off().on('click', function() {
            $(this).attr('disabled', true);
            var id = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/scientific_advisor/approve/student/vkr_theme',
                method: 'POST',
                params: {
                    'studentID': students[id].systemStudentID,
                    'approve': true,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                $(this).css('display', 'none');
                $(this).parent().parent().find('.confirm-button').css('display','block');
                $(this).parent().parent().find('.change-button').attr('disabled', false);
                $(this).parent().parent().find('.sca-student-theme-area').attr('disabled', false);
                $(this).parent().parent().find('.student-theme-status').text('Не одобрено');
            }).catch(result => {
                console.log(result);
                setErrorMessage('Ошибка при разрешении изменения темы ВКР студента!');
                setShowError(true);
            });
            $(this).attr('disabled', false);
        });
    });

    return(
        <div className='sci-advisor-students-form'>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО</th>
                            <th style={{width:'900px'}}>Тема</th>
                            <th >Статус</th>
                            <th style={{width:'140px'}}></th>
                            <th style={{width:'190px'}}></th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body'>

                    </tbody>
                </Table>
            </div>

            <Modal centered show={showError} onHide={() => { setShowError(false) }} className='dark'>
                <Modal.Header className='light-background' closeButton>
                    <Modal.Title className='size-30'>
                        {errorMessage}
                    </Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    );
}
