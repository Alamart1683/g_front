import React, { useState } from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

import InfoTextBlock1 from '../../components/infoText/InfoTextBlock1';

import infoBlock1 from '../../images/infographics blocks/block1_0.png';
import infoBlock2 from '../../images/infographics blocks/block2_0.png';
import infoBlock3 from '../../images/infographics blocks/block3_0.png';
import infoBlock4 from '../../images/infographics blocks/block4_0.png';


export default function StudentInfoPage(){
    const { authTokens } = useAuthContext();

    const [fetchedData, setFetchedData] = useState(false);

    const [studentFio, setStudentFio] = useState('');
    const [studentGroup, setStudentGroup] = useState('');
    const [studentTheme, setStudentTheme] = useState('');
    const [cathedra, setCathedra] = useState('');
    // Науч рук
    const [advisorFio, setAdvisorFio] = useState('');
    // Зав. кафедры
    const [headFio, setHeadFio] = useState('');
    // Приказ на НИР
    const [orderNumber, setOrderNumber] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [orderStartDate, setOrderStartDate] = useState('');
    const [orderEndDate, setOrderEndDate] = useState('');
    const [orderSpeciality, setOrderSpeciality] = useState('');

    //console.log(authTokens);

    if (!fetchedData) {
        getInputData();
        setFetchedData(true);
    }

    function getInputData() {
        axios.get(apiURL + '/student/request/NIR/task/data', 
            {headers: 
                {
                    'Authorization': 'Bearer ' + authTokens.accessToken,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(result => {
            //console.log(result.data.taskDataView.studentFio);
            setStudentFio(result.data.taskDataView.studentFio);
            console.log(studentFio);
            setStudentGroup(result.data.taskDataView.studentGroup);
            setStudentTheme(result.data.taskDataView.studentTheme);
            setAdvisorFio(result.data.taskDataView.advisorFio);
            setHeadFio(result.data.taskDataView.headFio);
            setCathedra(result.data.taskDataView.cathedra);
            setOrderNumber(result.data.taskDataView.orderNumber);
            setOrderDate(result.data.taskDataView.orderDate);
            setOrderStartDate(result.data.taskDataView.orderStartDate);
            setOrderEndDate(result.data.taskDataView.orderEndDate);
            setOrderSpeciality(result.data.taskDataView.orderSpeciality);

        }).catch(result => {
            console.log(result.data);
        });
    }

    function getNIR() {
        axios({
            url: apiURL + '/student/document/download/task/nir',
            method: 'GET',
            responseType: 'blob',
            params: {
                taskType: 'Научно-исследовательская работа',
                studentFio: studentFio,
                studentGroup: studentGroup,
                studentTheme: studentTheme,
                advisorFio: advisorFio,
                headFio: headFio,
                cathedra: cathedra,
                orderNumber: orderNumber,
                orderDate: orderDate,
                orderStartDate: orderStartDate,
                orderEndDate: orderEndDate,
                orderSpeciality: orderSpeciality
            },
            headers: { 'Authorization': 'Bearer ' + authTokens.accessToken },
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.docx');
            document.body.appendChild(link);
            link.click();
          }).catch(result => {
            console.log(result.data);
        });
    }

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-tabs'>
                <Tab eventKey='info1' title={<Image src={infoBlock1} thumbnail className='info-form-image'/>} className='info-form-tabs'>
                    <InfoTextBlock1/>
                    <Tabs defaultActiveKey='info11' className='info-form-subtab'>
                        <Tab eventKey='info11' title={<p className='size-24 dark white-background'>Задание на НИР</p>}>
                            <div className='info-row'>
                                <div className='info-row'>
                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">ФИО:</Form.Label>
                                        <Form.Control type='text' defaultValue={studentFio} onChange={e => { setStudentFio(e.target.value); console.log(studentFio); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Группа:</Form.Label>
                                        <Form.Control type='text' value={studentGroup} onChange={e => { setStudentGroup(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Тема НИР:</Form.Label>
                                        <Form.Control type='text' value={studentTheme} onChange={e => { setStudentTheme(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">ФИО научного руководителя:</Form.Label>
                                        <Form.Control type='text' value={advisorFio} onChange={e => { setAdvisorFio(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">ФИО зав. кафедры:</Form.Label>
                                        <Form.Control type='text' value={headFio} onChange={e => { setHeadFio(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Кафедра:</Form.Label>
                                        <Form.Control type='text' value={cathedra} onChange={e => { setCathedra(e.target.value); }} className="size-24 info-input"/>
                                    </div>
                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Номер приказа:</Form.Label>
                                        <Form.Control  type='text' value={orderNumber} onChange={e => { setOrderNumber(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Дата выпуска приказа:</Form.Label>
                                        <Form.Control  type='text' value={orderDate} onChange={e => { setOrderDate(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Дата начала НИР:</Form.Label>
                                        <Form.Control  type='text' value={orderStartDate} onChange={e => { setOrderStartDate(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Дата конца НИР:</Form.Label>
                                        <Form.Control  type='text' value={orderEndDate} onChange={e => { setOrderEndDate(e.target.value); }} className="size-24 info-input"/>
                                        <Form.Label column className="size-21 dark info-input-label">Направление:</Form.Label>
                                        <Form.Control  type='text' value={orderSpeciality} onChange={e => { setOrderSpeciality(e.target.value); }} className="size-24 info-input"/>
                                    </div>
                                </div>
                                <button type='button' onClick={getNIR} className='size-30 light dark-background info-button'>Получить индивидуальное задание НИР</button>
                            </div>
                        </Tab>
                        <Tab eventKey='info12' title={<p className='size-24 dark  white-background'>Отчет</p>}>
                            12
                        </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey='info2' title={<Image src={infoBlock2} thumbnail className='info-form-image'/>}>
                    2
                </Tab>
                <Tab eventKey='info3' title={<Image src={infoBlock3} thumbnail className='info-form-image'/>}>
                    3 
                </Tab>
                <Tab eventKey='info4' title={<Image src={infoBlock4} thumbnail className='info-form-image'/>}>
                    4
                </Tab>
            </Tabs>
            
        </Form>
        
    );
   
}