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
    const [scaData, setScaData] = useState([]);

    useEffect(() => {
        showHocStudents(studentData);
        fillSelects(studentData);
    }, [studentData]);

    useEffect(() => {
        fillScaDropdown(scaData);
    }, [scaData]);

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

    // Заполнение выпадающего менб науч руков
    function fillScaDropdown(scaArray) {
        console.log(scaArray);
        for (var i = 0; i < scaArray.length; i++) {
            var sca = scaArray[i];
            var scaRecord = document.createElement('p');
            scaRecord.id = 'sca-' + i;
            scaRecord.className = 'dark size-18 sca-assign-record';
            scaRecord.innerText = sca.advisorName;
            document.getElementById('sca-dropdown-content').appendChild(scaRecord);
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
        //console.log(studentArray);
        for (var i = 0; i < studentArray.length; i++) {
            var student = studentArray[i];

            var studentRow = document.createElement('tr');
            studentRow.id = 'row-' + i;
            studentRow.className = 'size-20 dark hoc-table-row';

            var studentNum = document.createElement('th');
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

            studentRow.appendChild(studentNum);
            studentRow.appendChild(studentSpeciality);
            studentRow.appendChild(studentGroup);
            studentRow.appendChild(studentScaFio);
            studentRow.appendChild(studentFio);

            document.getElementById('hoc-table-body').appendChild(studentRow);
        }
    }

    // Получение списка науч руков
    function getSca() {
        axios({
            url: apiURL + '/scientific_advisor/all',
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
        checkIfCanAssign();
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
        checkIfCanAssign();
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
        checkIfCanAssign();
    }

    // Проверка наличия выбранных строк
    function checkIfCanAssign() {
        if ($('.hoc-table-row-selected').length === 0) {
            document.getElementById('assign-button').disabled = true;
        }
        else {
            document.getElementById('assign-button').disabled = false;
        }
    }

    // TODO
    // Выставление ассоциаций студентам из файла
    function setAssociations(assocFile) {
        console.log(assocFile);
    }

    $(function() {

        // Выбор строки в таблице
        $('.hoc-table-row').off().on('click', function() {
            if ($(this).hasClass('hoc-table-row-selected')) {
                $(this).removeClass('hoc-table-row-selected');
                $(this).removeClass('light');
                $(this).addClass('dark');
            }
            else {
                $(this).addClass('hoc-table-row-selected');
                $(this).removeClass('dark');
                $(this).addClass('light');
            }
            checkIfCanAssign();
        });

        // Открытиь диалог выбора файла
        $('#assoc-button').off().on('click', function () {
            $('#assoc-file-input').trigger('click');
        });

        // Показать науч руков
        $('#assign-button').off().on('click', function (event) {
            $(this).parent().find('.sca-dropdown-content').toggle();
        });

        // Назначить студентам науч рука
        $('.sca-assign-record').off().on('click', function() {
            var scaArrayId = $(this).attr('id').split('-')[1];
            var students = $('.hoc-table-row-selected');
            //console.log(scaData[arrayId]);
            //console.log(students);
            for (var i = 0; i < students.length; i++) {
                var stuArrayId = students[i].id.split('-')[1];
                axios({
                    url: apiURL + '/head_of_cathedra/change/advisor',
                    method: 'POST',
                    params: {
                        studentID: studentData[stuArrayId].systemStudentID,
                        advisorID: scaData[scaArrayId].systemID,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    //console.log(response);
                    //window.location.reload();
                }).catch(result => {
                    console.log(result);
                });
            }
            window.location.reload();
        });

    });

    return(
        <div className='hoc-assoc-div'>
            <div className='hoc-assoc-menu-div light-background'>
                <input id='tableSearch' type='text' className='hoc-table-search dark size-32' />
                <button type='button' onClick={() => { searchTable(); }} className='hoc-table-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
                <div className='hoc-assoc-select-div'>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Группа:</p>
                    <select id='group-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {filterGroups();}}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{marginLeft: '28px'}}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Направление:</p>
                    <select id='speciality-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {filterSpecialty();}}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <button type='button' id='assoc-button' className='dark-background light size-24 hoc-assoc-after-select hoc-assoc-button'>
                    Задать ассоциации студентов и<br/>научных руководителей из файла
                </button>
                <input id='assoc-file-input' type='file' accept='.xls, .xlsx' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                e.target.files[0].type === 'application/vnd.ms-excel') {
                                setAssociations(e.target.files[0]);
                            }
                        }
                }} />
                <div className='hoc-assoc-after-select sca-dropdown-div'>
                    <button type='button' disabled id='assign-button' className='dark-background light size-24 hoc-assoc-button'>
                        Назначить выбранным студентам<br/>научного руководителя
                    </button>
                    <div id='sca-dropdown-content' className='sca-dropdown-content'>

                    </div>
                </div>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>Направление</th>
                            <th>Группа</th>
                            <th>ФИО Научного Руководителя</th>
                            <th>ФИО Студента</th>
                        </tr>
                    </thead>
                    <tbody id='hoc-table-body'>
                        
                    </tbody>
                </Table>
            </div>
        </div>
    );
}