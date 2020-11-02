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
    //const [shownProjects, setShownProjects] = useState(false);

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

        if (projectDataLoaded && projectAreaDataLoaded && unassociatedStudentsLoaded) {
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
                            rowArea.id = 'area-'+i+'-'+j+'-'+k;

                            var rowProject = document.createElement('th');
                            rowProject.innerText = projectData[j].projectName;
                            rowProject.id = 'project-'+i+'-'+j+'-'+k;

                            var rowStudentName = document.createElement('th');
                            rowStudentName.innerText = student.fio.split(' ')[0] + 
                                                        '. ' + 
                                                        student.fio.split(' ')[1].charAt(0)  + 
                                                        '. ' + 
                                                        student.fio.split(' ')[2].charAt(0) + 
                                                        '.';
                            rowStudentName.id = 'student'+i+'-'+j+'-'+k;

                            var rowStudentRemove = document.createElement('th');

                            var deleteButton = document.createElement('button');
                            deleteButton.type = 'button';
                            deleteButton.innerText = 'Удалить студента из проекта';
                            deleteButton.className = 'sca-projects-table-button';

                            studentRow.appendChild(rowNum);
                            studentRow.appendChild(rowArea);
                            studentRow.appendChild(rowProject);
                            studentRow.appendChild(rowStudentName);

                            rowStudentRemove.appendChild(deleteButton);
                            studentRow.appendChild(rowStudentRemove);

                            document.getElementById('project-table-body').appendChild(studentRow);

                        }

                        var studentRow = document.createElement('tr');
                        //studentRow.id = 'student' + counter;
                        studentRow.className = 'size-20 dark';

                        var rowNum = document.createElement('th');
                        counter++;
                        rowNum.innerText = counter;

                        var rowArea = document.createElement('th');
                        rowArea.innerText = projectAreaName;
                        rowArea.id = 'area-'+i+'-'+j+'-'+ projectData[j].occupiedStudents.length;

                        var rowProject = document.createElement('th');
                        rowProject.innerText = projectData[j].projectName;
                        rowProject.id = 'project-'+i+'-'+j+'-'+ projectData[j].occupiedStudents.length;

                        var rowAdd = document.createElement('th');

                        var addButton = document.createElement('button');
                        addButton.type = 'button';
                        addButton.innerText = 'Добавить студента';
                        addButton.className = 'sca-projects-table-button';

                        if (projectData[j].occupiedStudents.length === 0) {
                            var deleteButton = document.createElement('button');
                            deleteButton.type = 'button';
                            deleteButton.innerText = 'Удалить проект';
                            deleteButton.className = 'sca-projects-table-button';
                            deleteButton.style.marginTop = '10px';
                        }

                        studentRow.appendChild(rowNum);
                        studentRow.appendChild(rowArea);
                        studentRow.appendChild(rowProject);
                        studentRow.appendChild(document.createElement('th'));

                        rowAdd.appendChild(addButton);
                        if (projectData[j].occupiedStudents.length === 0) {
                            rowAdd.appendChild(deleteButton);
                        }
                        else {
                            
                        }
                        studentRow.appendChild(rowAdd);

                        document.getElementById('project-table-body').appendChild(studentRow);
                    }
                }

                if (!areaNotEmpty) {
                    var studentRow = document.createElement('tr');
                    studentRow.className = 'size-20 dark';

                    var rowNum = document.createElement('th');
                    counter++;
                    rowNum.innerText = counter;

                    var rowArea = document.createElement('th');
                    rowArea.innerText = projectAreaName;
                    rowArea.id = 'area-'+i+'-'+ 0+'-'+ 0;

                    var rowDelete = document.createElement('th');

                    var deleteAreaButton = document.createElement('button');
                    deleteAreaButton.type = 'button';
                    deleteAreaButton.innerText = 'Удалить программу проектов';
                    deleteAreaButton.className = 'sca-projects-table-button';

                    studentRow.appendChild(rowNum);
                    studentRow.appendChild(rowArea);
                    studentRow.appendChild(document.createElement('th'));
                    studentRow.appendChild(document.createElement('th'));

                    rowDelete.appendChild(deleteAreaButton);
                    studentRow.appendChild(rowDelete);

                    document.getElementById('project-table-body').appendChild(studentRow);
                }
            }
        }
    }

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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id='project-table-body'>

                    </tbody>
                </Table>
            </div>
            <div className='sca-projects-menu-div light-background'>
                <p className='dark size-30 sca-projects-title'>Добавление программы проектов</p>
                <p className='dark size-24'>Название программы проектов:</p>
                <textarea className='dark size-24 sca-projects-text-area'>

                </textarea>
                <button type='button' className='light size-24 dark-background sca-projects-button'>
                    Добавить программу проектов
                </button>

                <p className='dark size-30 sca-projects-title'>Добавление проекта<br/>в программу проектов</p>
                <p className='dark size-24'>Название проекта:</p>
                <textarea className='dark size-24 sca-projects-text-area'>
                
                </textarea>
                <p className='dark size-24'>Программа проектов,<br/>в которую добавить проект:</p>
                <select id='dropdown-list' className='dark size-24 sca-projects-dropdown'>
                    <option value="volvo">Программа проектов, в которую добавить проект:Программа проектов, в которую добавить проект:</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>
                <button type='button' className='light size-24 dark-background sca-projects-button'>
                    Добавить проект
                </button>
            </div>
        </div>
    );

}