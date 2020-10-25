import React, { useState} from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import infoBlock1 from '../../images/infographics blocks/block1_0.png';
import infoBlock2 from '../../images/infographics blocks/block2_0.png';
import infoBlock3 from '../../images/infographics blocks/block3_0.png';
import infoBlock4 from '../../images/infographics blocks/block4_0.png';

import iconDocument from '../../images/icons/documents.png';
import iconProject from '../../images/icons/myproject.png';
import iconInfo from '../../images/icons/info.png';

export default function ScaStuViewPage() {
    const { authTokens } = useAuthContext();

    // Задание на НИР
    const [studentTheme, setStudentTheme] = useState('');
    const [toExplore, setToExplore] = useState('');
    const [toCreate, setToCreate] = useState('');
    const [toFamiliarize, setToFamiliarize] = useState('');
    const [additionalTask, setAdditionalTask] = useState('');

    // Загруженное содержание НИР
    var fileNirOtchet;
    const [nirVersions, setNirVersions] = useState([]);
    const [nirOtchetVersions, setNirOtchetVersions] = useState([]);

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-main-tabs'>
                <Tab eventKey='info1' title={<Image src={infoBlock1} thumbnail className='info-form-image'/>} className='info-form-tabs'>
                    
                    <div className='info-break-div'>&nbsp;</div>
                    <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function(){window.scrollTo(0, 2000);},1);  }} className='info-form-subtab light-background container-fluid'>
                        <Tab eventKey='info11' title={
                            <p className='size-30 light dark-background info-form-subtab-title'>
                                <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small'/>
                                Задание на НИР
                            </p>
                        }>
                            <div className='info-sub-tab-div'>

                                <div className='info-break-div'  style={{marginBottom: '20px'}}>&nbsp;</div>

                                <div id='student-nir-task-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-row'>
                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Тема НИР:</Form.Label>
                                        <textarea value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); console.log(studentTheme);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Изучить:</Form.Label>
                                        <textarea value={toExplore} onChange={(e) => { setToExplore(e.target.value);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Практически выполнить:</Form.Label>
                                        <textarea value={toCreate} onChange={(e) => { setToCreate(e.target.value);}} className='dark size-24 info-input-area'/>
                                    </div>

                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Ознакомиться:</Form.Label>
                                        <textarea value={toFamiliarize} onChange={(e) => { setToFamiliarize(e.target.value);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Дополнительное задание:</Form.Label>
                                        <textarea value={additionalTask} onChange={(e) => { setAdditionalTask(e.target.value); console.log(additionalTask) }} className='dark size-24 info-input-area'/>

                                        <button type='button' id='send-nir-task-button' className='size-30 light dark-background info-button-1'>
                                            <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon'/>
                                            Создать новую версию<br/>задания на НИР
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        </Tab>
                        <Tab eventKey='info12' title={
                            <p className='size-30 light dark-background info-form-subtab-title' style={{marginLeft: '846px'}}>
                                <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small'/>
                                Отчет о<br/>прохождении НИР
                            </p>
                        }>
                            <div className='info-break-div'  style={{marginBottom: '20px'}}>&nbsp;</div>

                            <div id='student-nir-otchet-version-div' className='student-nir-task-version-div light-background'></div>
                            
                            <div className='info-sub-tab-div'>
                                <div className='centered'>
                                    <input type="file" name="file" id="fileNir" accept='.docx' className="info-input-file-hidden"
                                        onChange={e => {
                                            if (e.target.files.length !== 0) {
                                               if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                    fileNirOtchet = e.target.files[0];
                                                    document.getElementById('fileNirName').innerHTML = 'Файл выбран';
                                                }
                                                else {
                                                    fileNirOtchet = null;
                                                    document.getElementById('fileNirName').innerHTML = 'Ошибка загрузки файла!';
                                                } 
                                            }
                                        }} 
                                    />
                                    <label htmlFor="fileNir"  className='size-30 dark-background light info-file-label1'>
                                        <Image src={iconInfo} thumbnail className='dark-background thumbnail-icon'/>
                                        <p id='fileNirName' style={{display: 'inline-block'}}>Выбрать файл с содержанием отчета</p>
                                    </label>
                                    <button type='button' className='size-30 light dark-background info-button-inline-block'>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon'/>
                                        Сформировать и загрузить версию отчета
                                    </button>
                                    <p id='errorNirMessage' className='size-24 dark' style={{visibility: 'hidden'}}>errorNir</p>
                                </div>
                                
                            </div>
                        </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey='info2' title={<Image src={infoBlock2} thumbnail className='info-form-image'/>}>
                    
                </Tab>
                <Tab eventKey='info3' title={<Image src={infoBlock3} thumbnail className='info-form-image'/>}>
                    
                    
                </Tab>
                <Tab eventKey='info4' title={<Image src={infoBlock4} thumbnail className='info-form-image'/>}>
                    
                </Tab>
            </Tabs>
            
        </Form>
    );
}