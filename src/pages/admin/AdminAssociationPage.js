import React, { useEffect, useState, useRef } from 'react';
import { Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function AdminAssociationPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const isFirstRun1 = useRef(true);
    const isFirstRun2 = useRef(true);
    const [studentDataLoaded, setStudentDataLoaded] = useState(false);
    const [scaDataLoaded, setScaDataLoaded] = useState(false);
    const [studentsShown, setStudentsShown] = useState(false);

    const [studentData, setStudentData] = useState(false);
    const [scaData, setScaData] = useState(false);

    useEffect(() => {
        if (isFirstRun1.current) {
            isFirstRun1.current = false;
        }
        else {
            setStudentDataLoaded(true);
        }
    }, [studentData]);

    useEffect(() => {
        if (isFirstRun2.current) {
            isFirstRun2.current = false;
        }
        else {
            setScaDataLoaded(true);
        }
    }, [scaData]);

    useEffect(() => {
        showHocStudents(studentData);
    });

    if (!fetchedData) {
        setFetchedData(true);
        getHocStudents();
        getSca();
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
            //console.log(response);
            setStudentData(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы студентов
    function showHocStudents(studentArray) {
        if (studentDataLoaded && scaDataLoaded && !studentsShown) {
            setStudentsShown(true);
            fillSelects(studentArray);
            for (var i = 0; i < studentArray.length; i++) {
                var student = studentArray[i];

                var studentRow = document.createElement('tr');
                studentRow.id = 'row-' + i;
                studentRow.className = 'size-20 dark hoc-table-row';

                var studentNum = document.createElement('th');
                studentNum.className = 'row-num';
                studentNum.innerText = i + 1;

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

                var assignDiv = document.createElement('div');
                assignDiv.className = 'add-student-dropdown-div';

                var assignContent = document.createElement('div');
                assignContent.className = 'sci-advisor-status-dropdown-content assign-content';

                for (var p = 0; p < scaData.length; p++) {
                    if (scaData[p].roles[0].role === 'ROLE_HEAD_OF_CATHEDRA' ||
                        scaData[p].roles[0].role === 'ROLE_SCIENTIFIC_ADVISOR') {
                        var scaRecord = document.createElement('p');
                        scaRecord.id = 'sca-' + i + '-' + p;
                        scaRecord.className = 'dark size-18 student-add-to-project sca-record';
                        scaRecord.innerText = scaData[p].surname + ' ' +
                            scaData[p].name.charAt(0) + '. ' +
                            scaData[p].second_name.charAt(0) + '.';
                        assignContent.appendChild(scaRecord);
                    }
                }
                assignContent.style.maxHeight = '400px';
                assignContent.style.overflowX = 'scroll';

                var assignButton = document.createElement('button');
                assignButton.type = 'button';
                assignButton.id = 'assign-i';
                assignButton.className = 'sca-projects-table-button assign-button';
                assignButton.style.marginTop = '3px';
                assignButton.style.marginBottom = '3px';
                assignButton.innerText = 'Назначить научного\nруководителя';

                studentRow.appendChild(studentNum);
                studentRow.appendChild(studentFio);
                studentRow.appendChild(studentSpeciality);
                studentRow.appendChild(studentGroup);
                studentRow.appendChild(studentScaFio);
                studentRow.appendChild(studentStatus);

                assignDiv.appendChild(assignButton);
                assignDiv.appendChild(assignContent);
                studentRow.appendChild(assignDiv);

                document.getElementById('hoc-table-body').appendChild(studentRow);
            }
        }
    }

    // Получение списка науч руков
    function getSca() {
        axios({
            url: apiURL + '/admin/users/all',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setScaData(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Поиск по таблице
    function searchTable() {
        var input = $('#tableSearch')[0].value.toUpperCase();
        var rows = $('.hoc-table-row');
        $('.assign-content:visible').each(function () {
            $(this).toggle();
        });
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
        $('.assign-content:visible').each(function () {
            $(this).toggle();
        });
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
        $('.assign-content:visible').each(function () {
            $(this).toggle();
        });
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
    }

    // Выставление ассоциаций студентам из файла
    function setAssociations(assocFile) {
        document.getElementById('assoc-button').disabled = true;
        var formData = new FormData();
        formData.append('studentData', assocFile);
        axios({
            url: apiURL + '/admin/association/student/automatic',
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
            document.getElementById('assoc-button').disabled = false;
        });
    }

    $(function () {
        // Показать список науч руков
        $('.assign-button').off().on('click', function (event) {
            $(this).parent().find('.sci-advisor-status-dropdown-content').toggle();
        });

        // Открытиь диалог выбора файла
        $('#assoc-button').off().on('click', function () {
            $('#assoc-file-input').trigger('click');
        });

        // Назначить студентам науч рука
        $('.sca-record').off().on('click', function () {
            var studentArrayId = $(this).attr('id').split('-')[1];
            var scaArrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/head_of_cathedra/change/advisor',
                method: 'POST',
                params: {
                    studentID: studentData[studentArrayId].systemStudentID,
                    advisorID: scaData[scaArrayId].id,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                console.log(response);
                //window.location.reload();
            }).catch(result => {
                console.log(result);
            });
            $(this).parent().parent().parent().find('.sca-fio')[0].innerText = scaData[scaArrayId].surname + ' ' +
                scaData[scaArrayId].name + ' ' +
                scaData[scaArrayId].second_name;

            $(this).parent().toggle();
        });
    });

    return (
        <div className='hoc-assoc-div'>
            <div className='hoc-assoc-menu-div light-background'>
                <input id='tableSearch' type='text' className='hoc-table-search dark size-32' />
                <button type='button' onClick={() => { searchTable(); }} className='hoc-table-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
                <div className='hoc-assoc-select-div'>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Направление:</p>
                    <select id='speciality-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => { filterSpecialty(); }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{ marginLeft: '28px' }}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Группа:</p>
                    <select id='group-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => { filterGroups(); }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <button type='button' id='assoc-button' className='dark-background light size-24 hoc-assoc-after-select hoc-assoc-button' style={{ marginLeft: '423px' }}>
                    Задать ассоциации студентов и<br />научных руководителей из файла
                </button>
                <input id='assoc-file-input' type='file' accept='.xls, .xlsx' style={{ display: 'none' }} onChange={(e) => {
                    if (e.target.files.length !== 0) {
                        if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                            e.target.files[0].type === 'application/vnd.ms-excel') {
                            setAssociations(e.target.files[0]);
                        }
                    }
                }} />
            </div>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО Студента</th>
                            <th>Направление</th>
                            <th style={{minWidth:'135px'}}>Группа</th>
                            <th>ФИО Научного Руководителя</th>                            
                            <th>Статус</th>
                            <th style={{minWidth:'190px'}}></th>
                        </tr>
                    </thead>
                    <tbody id='hoc-table-body'>

                    </tbody>
                </Table>
            </div>
        </div>
    );
}