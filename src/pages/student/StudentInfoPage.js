import React, { useState } from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

import InfoTextBlock1 from '../../components/infoText/InfoTextBlock1';
import InfoTextBlock2 from '../../components/infoText/InfoTextBlock2';
import InfoTextBlock3 from '../../components/infoText/InfoTextBlock3';
import InfoTextBlock4 from '../../components/infoText/InfoTextBlock4';

import infoBlock1 from '../../images/infographics blocks/block1_0.png';
import infoBlock2 from '../../images/infographics blocks/block2_0.png';
import infoBlock3 from '../../images/infographics blocks/block3_0.png';
import infoBlock4 from '../../images/infographics blocks/block4_0.png';

import iconDocument from '../../images/icons/documents.png';
import iconProject from '../../images/icons/myproject.png';
import iconInfo from '../../images/icons/info.png';

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
    // Задание на НИР
    const [toExplore, setToExplore] = useState('');
    const [toCreate, setToCreate] = useState('');
    const [toFamiliarize, setToFamiliarize] = useState('');
    const [additionalTask, setAdditionalTask] = useState('');

    // Загруженный отчет НИР
    var fileNir;


    if (!fetchedData) {
        //getInputData();
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
            setStudentFio(result.data.taskDataView.studentFio);
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
            link.setAttribute('download', 'Задание НИР.docx');
            document.body.appendChild(link);
            link.click();
          }).catch(result => {
            console.log(result.data);
        });
    }

    function getNIRShort() {
        axios({
            url: apiURL + '/student/document/download/task/nir/short',
            method: 'GET',
            responseType: 'blob',
            params: {
                taskType: 'Научно-исследовательская работа',
                studentTheme: studentTheme,
                toExplore: toExplore,
                toCreate: toCreate,
                toFamiliarize: toFamiliarize,
                additionalTask: additionalTask
            },
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Задание НИР.docx');
            document.body.appendChild(link);
            link.click();
          }).catch(result => {
            console.log(result.data);
        });
    }

    // Загрузка отчета по НИР на сервер
    function uploadNIR() {
        console.log(fileNir);
        var formData = new FormData();
        formData.append('documentFormType', 'Научно-исследовательская работа');
        formData.append('documentFormKind', 'Отчёт');
        formData.append('documentFormDescription', 'Пример отчёта');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        formData.append('file', fileNir);
        axios({
            url: apiURL + '/student/document/report/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
        }).then((response) => {
            console.log('success');
            console.log(response);
        }).catch(result => {
            console.log('failure');
            console.log(result.data);
        });
    }

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-tabs'>
                <Tab eventKey='info1' title={<Image src={infoBlock1} thumbnail className='info-form-image'/>} className='info-form-tabs'>
                    <InfoTextBlock1/>
                    <Tabs defaultActiveKey='info11' className='info-form-subtab'>
                        <Tab eventKey='info11' title={<p className='size-24 dark white-background'>Оформить задание для НИР</p>}>
                            <div className='info-sub-tab-div'>
                                <Form.Label column className="size-21 dark info-input-label">Тема НИР:</Form.Label>
                                <input type='text' value={studentTheme} onChange={e => { setStudentTheme(e.target.value); }} className="dark size-24 info-input"/>

                                <Form.Label column className="size-21 dark info-input-label">Изучить:</Form.Label>
                                <textarea value={toExplore} onChange={e => { setToExplore(e.target.value);}} className='dark size-24 info-input-area'/>

                                <Form.Label column className="size-21 dark info-input-label">Практически выполнить:</Form.Label>
                                <textarea value={toCreate} onChange={e => { setToCreate(e.target.value);}} className='dark size-24 info-input-area'/>

                                <Form.Label column className="size-21 dark info-input-label">Ознакомиться:</Form.Label>
                                <textarea value={toFamiliarize} onChange={e => { setToFamiliarize(e.target.value);}} className='dark size-24 info-input-area'/>

                                <Form.Label column className="size-21 dark info-input-label">Дополнительное задание:</Form.Label>
                                <textarea value={additionalTask} onChange={e => { setAdditionalTask(e.target.value);console.log(additionalTask) }} className='dark size-24 info-input-area'/>

                                <button type='button' onClick={getNIRShort} className='size-30 light dark-background info-button-block'>
                                    <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon'/>
                                    Получить индивидуальное задание НИР
                                </button>

                            </div>
                        </Tab>
                        <Tab eventKey='info12' title={<p className='size-24 dark  white-background'>Загрузить отчет о прохождении НИР</p>}>
                            <div className='info-sub-tab-div'>
                                <div className='centered'>
                                    <input type="file" name="file" id="fileNir" accept='.docx' className="info-input-file-hidden"
                                        onChange={e => {
                                            if (e.target.files.length !== 0) {
                                               if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                    fileNir = e.target.files[0];
                                                    document.getElementById('fileNirName').innerHTML = e.target.files[0].name;
                                                }
                                                else {
                                                    fileNir = null;
                                                    document.getElementById('fileNirName').innerHTML = 'Ошибка загрузки файла!';
                                                } 
                                            }
                                        }} 
                                    />
                                    <label htmlFor="fileNir"  className='size-30 dark-background light info-file-label1'>
                                        <Image src={iconInfo} thumbnail className='dark-background thumbnail-icon'/>
                                        <p id='fileNirName' style={{display: 'inline-block'}}>Выберите файл</p>
                                    </label>
                                    <button type='button' onClick={uploadNIR} className='size-30 light dark-background info-button-inline-block'>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon'/>
                                        Загрузить отчет о прохождении НИР
                                    </button>
                                </div>
                                
                            </div>
                        </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey='info2' title={<Image src={infoBlock2} thumbnail className='info-form-image'/>}>
                    <InfoTextBlock2/>
                </Tab>
                <Tab eventKey='info3' title={<Image src={infoBlock3} thumbnail className='info-form-image'/>}>
                    <InfoTextBlock3/>
                </Tab>
                <Tab eventKey='info4' title={<Image src={infoBlock4} thumbnail className='info-form-image'/>}>
                    <InfoTextBlock4/>
                </Tab>
            </Tabs>
            
        </Form>
        
    );
   
}