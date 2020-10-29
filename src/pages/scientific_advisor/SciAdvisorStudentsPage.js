import React, { useEffect, useState } from 'react';
import { Image, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function SciAdvisorStudentsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        showStudents(students);
    }, [students]);

    if (!fetchedData) {
        setFetchedData(true);
        getStudents();
    }

    // Получение данных о студентах
    function getStudents() {
        axios({
            url: apiURL + '/scientific_advisor/student/active/without_project',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            setStudents(response.data);
          }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы студентов
    function showStudents(studentArray) {
        for (var i=0; i<studentArray.length; i++) {
            var item = studentArray[i];
            //console.log(item);

            var student = document.createElement('tr');
            student.id = 'student' + i;
            student.className = 'size-24 dark'

            var studentNum = document.createElement('th');
            studentNum.innerText = i+1;

            // Имя студента
            var studentFio = document.createElement('th');
            //studentFio.innerText = item.fio;

            var popover = document.createElement('a');
            popover.href='#';
            popover.className = 'student-popover dark size-24';
            $(popover).attr('data-toggle', 'popover');
            $(popover).attr('title', 'Данные студента:');
            $(popover).attr('data-html', 'true');
            $(popover).attr('data-content', "Группа: " + item.group + 
                                            "<br /> Телефон: " + item.phone +
                                            "<br /> Почта: " + item.email);
            popover.innerText = item.fio;
            //popover.dataContent = 'content';

            var studentGroup = document.createElement('th');
            studentGroup.innerText = item.group;

            var studentPhone = document.createElement('th');
            studentPhone.innerText = item.phone;

            var studentMail = document.createElement('th');
            studentMail.innerText = item.email;

            var studentButtonTh = document.createElement('th');
            var studentButton = document.createElement('button');
            studentButton.className = 'student-table-button';
            studentButton.innerText = 'Перейти к студенту';

            student.appendChild(studentNum);
            studentFio.appendChild(popover);
            student.appendChild(studentFio);
            student.appendChild(studentGroup);
            student.appendChild(studentPhone);
            student.appendChild(studentMail);
            studentButtonTh.appendChild(studentButton);
            student.appendChild(studentButtonTh);
            document.getElementById('student-table-body').appendChild(student);
        }
    }

    $(function() {

        $('.student-table-button').off().on('click', function(event) {
            var studentId = $(this).parent().parent().attr('id');
            var arrayId = studentId.substr(studentId.length - 1);
            sessionStorage.setItem('viewedStudentId', students[arrayId].systemStudentID);
            sessionStorage.setItem('viewedStudentName', students[arrayId].fio);
            setRedirect(true);
        });

        $('[data-toggle="popover"]').popover();

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
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
                            <th>НИР</th>
                            <th>ПпППУиОПД</th>
                            <th>ПП</th>
                            <th>ВКР</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body'>
                        
                    </tbody>
                </Table>
            </div>

            { redirect ? (<Redirect push to='/sca-stu/view'/>) : null }
        </div>
    );
}