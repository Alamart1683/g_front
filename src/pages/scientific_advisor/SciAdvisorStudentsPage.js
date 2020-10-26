import React, { useEffect, useState } from 'react';
import { Image, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

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

            var studentFio = document.createElement('th');
            studentFio.innerText = item.fio;

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

    });

    return(
        <div className='sci-advisor-students-form'>
            <div className='sci-advisor-students-search-div light-background'>
                <input id='studentSearch' type='text' className='sci-advisor-students-search dark size-32'/>
                <button onClick={()=>{ console.log('search')}} className='sci-advisor-students-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background'/>
                    Поиск
                </button>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО</th>
                            <th>Группа</th>
                            <th>Телефон</th>
                            <th>Почта</th>
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