import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

export default function ScaProjectsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const isFirstRun1 = useRef(true);
    const isFirstRun2 = useRef(true);
    const isFirstRun3 = useRef(true);

    const [projectAreaData, setProjectAreaData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [unassociatedStudents, setUnassociatedStudents] = useState([]);

    const [projectAreaDataLoaded, setProjectAreaDataLoaded] = useState(false);
    const [projectDataLoaded, setProjectDataLoaded] = useState(false);
    const [unassociatedStudentsLoaded, setUnassociatedStudentsLoaded] = useState(false);
    const [projectsShown, setProjectsShown] = useState(false);

    const [projectAreaName, setProjectAreaName] = useState('');
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        if (isFirstRun1.current) {
            isFirstRun1.current = false;
        }
        else {
            //console.log('load1');
            setProjectAreaDataLoaded(true);
        }
    }, [projectAreaData]);

    useEffect(() => {
        if (isFirstRun2.current) {
            isFirstRun2.current = false;
        }
        else {
            //console.log('load2');
            setProjectDataLoaded(true);
        }
    }, [projectData]);

    useEffect(() => {
        if (isFirstRun3.current) {
            isFirstRun3.current = false;
        }
        else {
            //console.log('load3');
            setUnassociatedStudentsLoaded(true);
        }
    }, [unassociatedStudents]);

    useEffect(() => {
        showProjects();
    });

    if (!fetchedData) {
        getProjectAreaData();
        getProjectData();
        getUnassociatedStudents();
        setFetchedData(true);
    }

    function getProjectAreaData() {
        axios({
            url: apiURL + '/scientific_advisor/project/area/all',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setProjectAreaData(response.data);
            //console.log(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function getProjectData() {
        axios({
            url: apiURL + '/scientific_advisor/projects',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setProjectData(response.data);
            //console.log(response);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function getUnassociatedStudents() {
        axios({
            url: apiURL + '/scientific_advisor/student/active/without_project',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setUnassociatedStudents(response.data);
            //console.log(response);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showProjects() {

        if (projectDataLoaded && projectAreaDataLoaded && unassociatedStudentsLoaded && !projectsShown) {
            setProjectsShown(true);
            loadDropdownOptions();
            var counter = 0;

            for (var i = 0; i < projectAreaData.length; i++) {
                var projectAreaName = projectAreaData[i];
                var areaNotEmpty = false;

                for (var j = 0; j < projectData.length; j++) {
                    if (projectData[j].projectArea === projectAreaName) {
                        areaNotEmpty = true;

                        for (var k = 0; k < projectData[j].occupiedStudents.length; k++) {
                            var student = projectData[j].occupiedStudents[k];
                            var studentRow = document.createElement('tr');
                            studentRow.className = 'size-20 dark';

                            var rowNum = document.createElement('th');
                            counter++;
                            rowNum.innerText = counter;

                            var rowArea = document.createElement('th');
                            rowArea.innerText = projectAreaName;
                            rowArea.id = 'area-' + i + '-' + j + '-' + k;

                            var rowProject = document.createElement('th');
                            rowProject.innerText = projectData[j].projectName;
                            rowProject.id = 'project-' + i + '-' + j + '-' + k;

                            var rowStudentName = document.createElement('th');
                            rowStudentName.innerText = student.fio.split(' ')[0] +
                                                        '. ' +
                                                        student.fio.split(' ')[1].charAt(0) +
                                                        '. ' +
                                                        student.fio.split(' ')[2].charAt(0) +
                                                        '.';
                            rowStudentName.id = 'student-' + i + '-' + j + '-' + k;

                            var rowStudentRemove = document.createElement('th');

                            var deleteButton = document.createElement('button');
                            deleteButton.type = 'button';
                            deleteButton.id = 'delete-student-' + j + '-' + k;
                            deleteButton.innerText = 'Удалить студента из проекта';
                            deleteButton.className = 'sca-projects-table-button delete-student-from-project';

                            studentRow.appendChild(rowNum);
                            studentRow.appendChild(rowArea);
                            studentRow.appendChild(rowProject);
                            studentRow.appendChild(rowStudentName);

                            rowStudentRemove.appendChild(deleteButton);
                            studentRow.appendChild(rowStudentRemove);

                            document.getElementById('project-table-body').appendChild(studentRow);

                        }

                        var studentRowLast = document.createElement('tr');
                        studentRowLast.className = 'size-20 dark';

                        var rowNumLast = document.createElement('th');
                        counter++;
                        rowNumLast.innerText = counter;

                        var rowAreaLast = document.createElement('th');
                        rowAreaLast.innerText = projectAreaName;
                        rowAreaLast.id = 'area-' + i + '-' + j + '-' + projectData[j].occupiedStudents.length;

                        var rowProjectLast = document.createElement('th');
                        rowProjectLast.innerText = projectData[j].projectName;
                        rowProjectLast.id = 'project-' + i + '-' + j + '-' + projectData[j].occupiedStudents.length;

                        var rowAddLast = document.createElement('th');


                        var addButtonLast = document.createElement('button');
                        addButtonLast.type = 'button';
                        addButtonLast.innerText = 'Добавить\nстудента';
                        addButtonLast.className = 'sca-projects-table-button add-student-button';

                        var dropdownDiv = document.createElement('div');
                        dropdownDiv.className = 'add-student-dropdown-div';

                        var dropdownContent = document.createElement('div');
                        dropdownContent.className = 'sci-advisor-status-dropdown-content';

                        for (var p = 0; p < unassociatedStudents.length; p++) {
                            var studentRecord = document.createElement('p');
                            studentRecord.id = 'student-' + j + '-' + p;
                            studentRecord.className = 'dark size-18 student-add-to-project';
                            studentRecord.innerText = unassociatedStudents[p].fio.split(' ')[0] +
                                                        '. ' +
                                                        unassociatedStudents[p].fio.split(' ')[1].charAt(0) +
                                                        '. ' +
                                                        unassociatedStudents[p].fio.split(' ')[2].charAt(0) +
                                                        '.';

                            dropdownContent.appendChild(studentRecord);
                        }
                        dropdownContent.style.maxHeight = '400px';
                        dropdownContent.style.overflowX = 'scroll';

                        if (projectData[j].occupiedStudents.length === 0) {
                            var deleteButtonLast = document.createElement('button');
                            deleteButtonLast.type = 'button';
                            deleteButtonLast.id = 'delete-project-' + j;
                            deleteButtonLast.innerText = 'Удалить проект';
                            deleteButtonLast.className = 'sca-projects-table-button delete-ptoject-button';
                            deleteButtonLast.style.marginTop = '10px';
                        }

                        studentRowLast.appendChild(rowNumLast);
                        studentRowLast.appendChild(rowAreaLast);
                        studentRowLast.appendChild(rowProjectLast);
                        studentRowLast.appendChild(document.createElement('th'));

                        dropdownDiv.appendChild(addButtonLast);
                        dropdownDiv.appendChild(dropdownContent);
                        rowAddLast.appendChild(dropdownDiv);

                        if (projectData[j].occupiedStudents.length === 0) {
                            rowAddLast.appendChild(deleteButtonLast);
                        }
                        else {

                        }
                        studentRowLast.appendChild(rowAddLast);

                        document.getElementById('project-table-body').appendChild(studentRowLast);
                    }
                }

                if (!areaNotEmpty) {
                    var studentRowEmpty = document.createElement('tr');
                    studentRowEmpty.className = 'size-20 dark';

                    var rowNumEmpty = document.createElement('th');
                    counter++;
                    rowNumEmpty.innerText = counter;

                    var rowAreaEmpty = document.createElement('th');
                    rowAreaEmpty.innerText = projectAreaName;
                    rowAreaEmpty.id = 'area-' + i + '-' + 0 + '-' + 0;

                    var rowDeleteEmpty = document.createElement('th');

                    var deleteAreaButton = document.createElement('button');
                    deleteAreaButton.id = 'delete-area-' + i;
                    deleteAreaButton.type = 'button';
                    deleteAreaButton.innerText = 'Удалить программу проектов';
                    deleteAreaButton.className = 'sca-projects-table-button delete-project-area-button';

                    studentRowEmpty.appendChild(rowNumEmpty);
                    studentRowEmpty.appendChild(rowAreaEmpty);
                    studentRowEmpty.appendChild(document.createElement('th'));
                    studentRowEmpty.appendChild(document.createElement('th'));

                    rowDeleteEmpty.appendChild(deleteAreaButton);
                    studentRowEmpty.appendChild(rowDeleteEmpty);

                    document.getElementById('project-table-body').appendChild(studentRowEmpty);
                }
            }
        }
    }

    function loadDropdownOptions() {
        //console.log('loaded dropdown');
        for (var i = 0; i < projectAreaData.length; i++) {
            var areaOption = document.createElement('option');
            areaOption.value = projectAreaData[i];
            areaOption.innerText = projectAreaData[i];
            document.getElementById('area-dropdown-list').appendChild(areaOption);
        }
    }

    $(function () {
        // Показать список неассоциированных студентов
        $('.add-student-button').off().on('click', function (event) {
            $(this).parent().find('.sci-advisor-status-dropdown-content').toggle();
        });

        // Создать программу проектов
        $('#add-project-area-button').off().on('click', function (event) {
            console.log(projectAreaName);
            axios({
                url: apiURL + '/scientific_advisor/project/area/save/',
                method: 'POST',
                params: {
                    area: projectAreaName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload();
            }).catch(result => {
                console.log(result);
            });
        });

        // Создать проект
        $('#add-project-button').off().on('click', function (event) {
            //console.log(projectName);
            //console.log( $('#area-dropdown-list :selected').val() );
            var formData = new FormData();
            formData.append('projectName', projectName);
            formData.append('projectTheme', $('#area-dropdown-list :selected').val());
            formData.append('projectDescription', 'Описание проекта');
            axios({
                url: apiURL + '/scientific_advisor/project/add',
                method: 'POST',
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload();
            }).catch(result => {
                console.log(result);
            });
        });

        // Удалить программу проектов
        $('.delete-project-area-button').off().on('click', function (event) {
            //console.log( $(this).attr('id') );
            var areaId = $(this).attr('id').split('-')[2];
            //console.log(projectAreaData[areaId]);
            axios({
                url: apiURL + '/scientific_advisor/project/area/delete/',
                method: 'DELETE',
                params: {
                    area: projectAreaData[areaId],
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });
    
        // Удалить проект
        $('.delete-ptoject-button').off().on('click', function() {
            var projectId = $(this).attr('id').split('-')[2];
            //console.log(projectData[projectId]);
            axios({
                url: apiURL + '/scientific_advisor/project/delete/' + projectData[projectId].systemProjectID,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });

        // Добавить студента впроект
        $('.student-add-to-project').off().on('click', function (event) {
            var projectId = $(this).attr('id').split('-')[1];
            var studentId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/scientific_advisor/project/student/add/',
                method: 'POST',
                params: {
                    studentID: unassociatedStudents[studentId].systemStudentID,
                    projectID: projectData[projectId].systemProjectID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload();
            }).catch(result => {
                console.log(result);
            });
        });

        // Удалить студента из проекта
        $('.delete-student-from-project').off().on('click', function (event) {
            var projectId = $(this).attr('id').split('-')[2];
            var studentId = $(this).attr('id').split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/project/student/delete/',
                method: 'DELETE',
                params: {
                    studentID: projectData[projectId].occupiedStudents[studentId].systemStudentID,
                    projectID: projectData[projectId].systemProjectID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });

    });

    return (
        <div className='student-document-form'>
            <div className='sca-projects-table-div'>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th >#</th>
                            <th >Программа проектов</th>
                            <th>Проект</th>
                            <th>Студент</th>
                            <th style={{width:'180px'}}></th>
                        </tr>
                    </thead>
                    <tbody id='project-table-body'>

                    </tbody>
                </Table>
            </div>
            <div className='sca-projects-menu-div light-background'>
                <p className='dark size-30 sca-projects-title'><b>Добавление программы проектов</b></p>
                <p className='dark size-24'>Название программы проектов:</p>
                <textarea maxLength='256' id='project-area-name' value={projectAreaName} onChange={(e) => {
                    setProjectAreaName(e.target.value);
                    if (e.target.value.length > 0) {
                        document.getElementById('add-project-area-button').disabled = false;
                    }
                    else {
                        document.getElementById('add-project-area-button').disabled = true;
                    }
                }} className='dark size-24 sca-projects-text-area'>

                </textarea>
                <button id='add-project-area-button' type='button' disabled className='light size-24 dark-background sca-projects-button'>
                    Добавить программу проектов
                </button>

                <p className='dark size-30 sca-projects-title'><b>Добавление проекта<br />в программу проектов</b></p>
                <p className='dark size-24'>Название проекта:</p>
                <textarea maxLength='100' id='project-name' value={projectName} onChange={(e) => {
                    setProjectName(e.target.value);
                    //console.log( $('#area-dropdown-list :selected').val() );
                    if (e.target.value.length > 0 && $('#area-dropdown-list :selected').val() !== undefined) {
                        document.getElementById('add-project-button').disabled = false;
                    }
                    else {
                        document.getElementById('add-project-button').disabled = true;
                    }
                }} className='dark size-24 sca-projects-text-area'>

                </textarea>
                <p className='dark size-24'>Программа проектов,<br />в которую добавить проект:</p>
                <select id='area-dropdown-list' size={projectAreaData.length} className='dark size-24 sca-projects-dropdown'
                    onChange={(e) => {
                        if (projectName.length > 0 && $('#area-dropdown-list :selected').val() !== undefined) {
                            document.getElementById('add-project-button').disabled = false;
                        }
                    }}>

                </select>
                <button id='add-project-button' type='button' disabled className='light size-24 dark-background sca-projects-button' style={{ marginBottom: '30px' }}>
                    Добавить проект
                </button>
            </div>
        </div>
    );

}