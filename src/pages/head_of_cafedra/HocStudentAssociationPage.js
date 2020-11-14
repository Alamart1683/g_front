import React, { useEffect, useState } from 'react';
import { Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function HocStudentAssociationPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        showHocStudents(studentData);
        fillSelects(studentData);
    }, [studentData]);

    if (!fetchedData) {
        setFetchedData(true);
        getHocStudents();
    }

    function fillSelects(studentArray) {
        var groups = [];
        var specialities = [];
        for (var i = 0; i < studentArray.length; i++) {
            var student = studentArray[i];
            if (!groups.includes(student.studentGroup)) {
                groups.push(student.studentGroup);

                var group = document.createElement('option');
                group.innerText = student.studentGroup;
                document.value = student.studentGroup;
                document.getElementById('group-select').appendChild(group);
            }
            if (!specialities.includes(student.studentSpeciality)) {
                specialities.push(student.studentSpeciality);

                var speciality = document.createElement('option');
                speciality.innerText = student.studentSpeciality;
                document.value = student.studentSpeciality;
                document.getElementById('speciality-select').appendChild(speciality);
            }
        }
    }

    // Получение данных о студентах
    function getHocStudents() {
        axios({
            url: apiURL + '/head_of_cathedra/get/associated_students',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            console.log(response);
            setStudentData(response.data);
          }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы студентов
    function showHocStudents(studentArray) {
        //console.log(studentArray);
        for (var i = 0; i < studentArray.length; i++) {
            var student = studentArray[i];

            var studentRow = document.createElement('tr');
            studentRow.id = 'row-' + i;
            studentRow.className = 'size-20 dark hoc-table-row';

            var studentNum = document.createElement('th');
            studentNum.className = 'row-num';
            studentNum.innerText = i+1;

            var studentSpeciality = document.createElement('th');
            studentSpeciality.className = 'row-speciality';
            studentSpeciality.innerText = student.studentSpeciality;

            var studentGroup = document.createElement('th');
            studentGroup.className = 'row-group';
            studentGroup.innerText = student.studentGroup;

            var studentScaFio = document.createElement('th');
            studentScaFio.innerText = student.advisorFio;
            studentScaFio.className = 'sca-fio';

            var studentFio = document.createElement('th');
            studentFio.innerText = student.studentFio;
            studentFio.className = 'student-fio';

            var studentStatus = document.createElement('th');
            if (student.studentIsConfirmed) {
                studentStatus.innerText = 'Подтвержден';
            }
            else {
                studentStatus.innerText = 'Не подтвержден';
            }

            studentRow.appendChild(studentNum);
            studentRow.appendChild(studentFio);
            studentRow.appendChild(studentSpeciality);
            studentRow.appendChild(studentGroup);
            studentRow.appendChild(studentScaFio);
            studentRow.appendChild(studentStatus);

            document.getElementById('hoc-table-body').appendChild(studentRow);
        }
    }

    // Поиск по таблице
    function searchTable() {
        var input = $('#tableSearch')[0].value.toUpperCase();
        var rows = $('.hoc-table-row');
        for (var i = 0; i < rows.length; i++) {
            var rowText = rows[i].querySelector('.sca-fio').textContent.toUpperCase() + 
                          ' ' +
                          rows[i].querySelector('.student-fio').textContent.toUpperCase();
            if (rowText.indexOf(input) > -1) {
                rows[i].classList.remove('hoc-table-search-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-search-hidden');
                rows[i].classList.remove('hoc-table-row-selected');
                rows[i].classList.remove('light');
                rows[i].classList.add('dark');
            }
        }
        setTableNums();
    }

    // Фильтрация по группе
    function filterGroups() {
        var group = $('#group-select :selected').val();
        var rows = $('.hoc-table-row');
        for (var i = 0; i < rows.length; i++) {
            var rowGroup = rows[i].querySelector('.row-group').textContent;
            if (rowGroup === group || group === '') {
                rows[i].classList.remove('hoc-table-group-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-group-hidden');
                rows[i].classList.remove('hoc-table-row-selected');
                rows[i].classList.remove('light');
                rows[i].classList.add('dark');
            }
        }
        setTableNums();
    }

    // Фильтрация по специальности
    function filterSpecialty() {
        var speciality = $('#speciality-select :selected').val();
        var rows = $('.hoc-table-row');
        for (var i = 0; i < rows.length; i++) {
            var rowSpeciality = rows[i].querySelector('.row-speciality').textContent;
            if (rowSpeciality === speciality || speciality === '') {
                rows[i].classList.remove('hoc-table-speciality-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-speciality-hidden');
                rows[i].classList.remove('hoc-table-row-selected');
                rows[i].classList.remove('light');
                rows[i].classList.add('dark');
            }
        }
        setTableNums();
    }

    function setTableNums() {
        $('.hoc-table-row:visible').each(function (index) {
            $(this).find('.row-num')[0].innerText = index + 1;
        })

        // TODO
        $('#confirm-button').off().on('click', function() {
            for (var i = 0; i < studentData.length; i++) {
                if (!studentData[i].studentIsConfirmed) {
                    axios({
                        url: apiURL + '/head_of_cathedra_only/confirm/student',
                        method: 'POST',
                        params: {
                            'studentID': true,
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
            }
            
        });
    }

    return(
        <div className='hoc-assoc-div'>
            <div className='hoc-assoc-menu-div light-background'>
                <input id='tableSearch' type='text' className='hoc-table-search dark size-32' />
                <button type='button' onClick={() => { searchTable(); }} className='hoc-table-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
                <div className='hoc-assoc-select-div'>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Направление:</p>
                    <select id='speciality-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {filterSpecialty();}}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{marginLeft: '28px'}}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Группа:</p>
                    <select id='group-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {filterGroups();}}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <button type='button' id='confirm-button' className='dark-background light size-24 hoc-assoc-after-select hoc-assoc-button' style={{ marginLeft: '404px' }}>
                    Подтвердить ассоциации студентов<br />и научных руководителей
                </button>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО Студента</th>
                            <th>Направление</th>
                            <th>Группа</th>
                            <th>ФИО Научного Руководителя</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody id='hoc-table-body'>
                        
                    </tbody>
                </Table>
            </div>
        </div>
    );
}