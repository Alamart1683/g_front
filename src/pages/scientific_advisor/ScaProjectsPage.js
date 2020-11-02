import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

export default function ScaProjectsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [projectAreaData, setProjectAreaData] = useState([]);
    const [projectData, setProjectData] = useState([]);

    useEffect(() => {
        //console.log(projectAreaData);
    });

    useEffect(() => {
        //console.log(projectData);
        showProjects()
    });

    if (!fetchedData) {
        setFetchedData(true);
        getProjectAreaData();
        getProjectData();
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

    function showProjects() {
        console.log(projectAreaData);
        console.log(projectData);
    }

    return(
        <div className='student-document-form'>
            <div className='sca-projects-table-div'>
            <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th colSpan='2'>Проектная область</th>
                            <th colSpan='2'>Проект</th>
                            <th colSpan='2'>Студент</th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body'>
                        <tr>
                            <td rowSpan='5'>1</td>
                            <td rowSpan='5'>Проектная область 1</td>

                            <td rowSpan='2'>1</td>
                            <td rowSpan='2'>Проект 1</td>

                            <td rowSpan='1'>1</td>
                            <td rowSpan='1'>Студент 1</td>
                        </tr>

                        <tr>
                            <td rowSpan='1'>2</td>
                            <td rowSpan='1'>Студент 2</td>
                        </tr>

                        <tr>
                            <td rowSpan='2'>2</td>
                            <td rowSpan='2'>Проект 2</td>

                            <td rowSpan='1'>3</td>
                            <td rowSpan='1'>Студент 3</td>
                        </tr>

                        <tr>
                            <td rowSpan='1'>4</td>
                            <td rowSpan='1'>Студент 4</td>
                        </tr>

                        <tr>
                            <td rowSpan='1'>3</td>
                            <td rowSpan='1'>Проект 3</td>

                            <td rowSpan='1'>3</td>
                            <td rowSpan='1'>Студент 5</td>
                        </tr>

                        <tr>
                            <td rowSpan='1'>2</td>
                            <td rowSpan='1'>Проектная область 2</td>

                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                    </tbody>
                </Table>
            </div>
            <div className='sca-projects-menu-div light-background'>
                menu
            </div>
        </div>
    );

}