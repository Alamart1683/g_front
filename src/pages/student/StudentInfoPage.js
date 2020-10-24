import React, { useState, useEffect } from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

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

    useEffect(() => {
        showNirVersions(nirVersions);
    }, [nirVersions]);

    useEffect(() => {
        showNirOtchetVersions(nirOtchetVersions);
    }, [nirOtchetVersions]);
    
    if (!fetchedData) {
        setFetchedData(true);
        getNirVersions();
        getNirOtchetVersions();
    }
    
    /*function getNIRShort() {
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
    */

    // Загрузка отчета по НИР на сервер
    function uploadNIR() {
        var formData = new FormData();
        formData.append('documentFormType', 'Научно-исследовательская работа');
        formData.append('documentFormKind', 'Отчёт');
        formData.append('documentFormDescription', 'Пример отчёта');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        formData.append('file', fileNirOtchet);
        axios({
            url: apiURL + '/student/document/report/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
        }).then((response) => {
            console.log(response);
            document.getElementById('errorNirMessage').style.visibility = 'visible';
            document.getElementById('errorNirMessage').innerHTML = 'Отчет загружен!';
        }).catch(result => {
            document.getElementById('errorNirMessage').style.visibility = 'visible';
            document.getElementById('errorNirMessage').innerHTML = 'При загрузке произошла ошибка!';
        });
    }

    // TODO WRITE REQUEST fill array
    // Получение версий заданий НИР
    function getNirVersions() {
        var exampleNirVersions = [
            {
                "data": null,
            },
            {
                "data": null,
            },
            {
                "data": null,
            }
        ]

        setNirVersions(exampleNirVersions);
    }

    // FIX TODOS
    // Вывод на экран версий задания нир
    function showNirVersions(nirVersionArray) {
        if (nirVersionArray.length > 0) {
           for (var i=0; i<nirVersionArray.length; i++) {
                var item = nirVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'nir-version' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                //TODO get version name
                versionName.innerText = 'Версия  23.10.2020 14:10';

                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                //TODO get version status
                versionStatus.innerText = 'Статус: рассматривается';

                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type='button';
                // TODO if already sent
                if (false) {
                    sendButton.disabled = true;
                }
                // TODO Button function SEND

                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button';
                downloadButton.innerText = 'Скачать документ';
                downloadButton.type='button';
                // TODO Button function DOWNLOAD

                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type='button';
                // TODO if cant delete
                if (false) {
                    deleteButton.disabled = true;
                }
                // TODO Button function DELETE

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-clickable';

                var nirVersionContent = document.createElement('div');
                nirVersionContent.className = 'nir-version-content light-background';

                var themeLabel = document.createElement('p');
                themeLabel.className = 'dark size-21 nir-text-label';
                themeLabel.innerText = 'Тема НИР:';

                var themeArea = document.createElement('textarea');
                themeArea.className = 'dark size-18 nir-text-area'
                themeArea.disabled = true;
                // TODO fill value
                themeArea.value = 'тема';

                var exploreLabel = document.createElement('p');
                exploreLabel.className = 'dark size-21 nir-text-label';
                exploreLabel.innerText = 'Изучить:';

                var exploreArea = document.createElement('textarea');
                exploreArea.className = 'dark size-18 nir-text-area'
                exploreArea.disabled = true;
                // TODO fill value
                exploreArea.value = 'изучить';

                var createLabel = document.createElement('p');
                createLabel.className = 'dark size-21 nir-text-label';
                createLabel.innerText = 'Выполнить:';

                var createArea = document.createElement('textarea');
                createArea.className = 'dark size-18 nir-text-area'
                createArea.disabled = true;
                // TODO fill value
                createArea.value = 'выполнить';

                var familiarizeLabel = document.createElement('p');
                familiarizeLabel.className = 'dark size-21 nir-text-label2';
                familiarizeLabel.innerText = 'Ознакомиться:';

                var familiarizeArea = document.createElement('textarea');
                familiarizeArea.className = 'dark size-18 nir-text-area2'
                familiarizeArea.disabled = true;
                // TODO fill value
                familiarizeArea.value = 'ознакомиться';

                var taskLabel = document.createElement('p');
                taskLabel.className = 'dark size-21 nir-text-label2';
                taskLabel.innerText = 'Дополнительное задание:';

                var taskArea = document.createElement('textarea');
                taskArea.className = 'dark size-18 nir-text-area2'
                taskArea.disabled = true;
                // TODO fill value
                taskArea.value = 'доп задание';

                var copyButton = document.createElement('button');
                copyButton.className = 'light dark-background size-21 nir-copy-button';
                copyButton.innerText = 'Перенести значения в меню';
                copyButton.type='button';

                var rowDiv = document.createElement('div');
                rowDiv.className = 'info-row';
                var columnDiv1 = document.createElement('div');
                columnDiv1.className = 'info-column';
                var columnDiv2 = document.createElement('div');
                columnDiv2.className = 'info-column';
                
                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);
                columnDiv1.appendChild(themeLabel);
                columnDiv1.appendChild(themeArea);
                columnDiv1.appendChild(exploreLabel);
                columnDiv1.appendChild(exploreArea);
                columnDiv1.appendChild(createLabel);
                columnDiv1.appendChild(createArea);
                columnDiv2.appendChild(familiarizeLabel);
                columnDiv2.appendChild(familiarizeArea);
                columnDiv2.appendChild(taskLabel);
                columnDiv2.appendChild(taskArea);
                columnDiv2.appendChild(copyButton);
                rowDiv.appendChild(columnDiv1);
                rowDiv.appendChild(columnDiv2);
                nirVersionContent.appendChild(rowDiv);
                nirVersion.appendChild(nirVersionContent);
                document.getElementById('student-nir-task-version-div').appendChild(nirVersion);
            } 
        }
        else {
            var noVersionMessage = document.createElement('p');
            noVersionMessage.className = 'dark size-32';
            noVersionMessage.innerText = 'Создайте версию задания на НИР в меню ниже!';
            document.getElementById('student-nir-task-version-div').appendChild(noVersionMessage);
        }
    }

    // TODO WRITE REQUEST fill array
    // Получение версий отчетов
    function getNirOtchetVersions() {
        var exampleNirOtchetVersions = [
            {
                "data": null,
            },
            {
                "data": null,
            },
            {
                "data": null,
            }
        ]

        setNirOtchetVersions(exampleNirOtchetVersions);
    }

    function showNirOtchetVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i=0; i<nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'nir-otchet-version' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                //TODO get version name
                versionName.innerText = 'Версия  23.10.2020 14:10';

                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                //TODO get version status
                versionStatus.innerText = 'Статус: рассматривается';

                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type='button';
                // TODO if already sent
                if (false) {
                    sendButton.disabled = true;
                }
                // TODO Button function SEND

                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button';
                downloadButton.innerText = 'Скачать документ';
                downloadButton.type='button';
                // TODO Button function DOWNLOAD

                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type='button';
                // TODO if cant delete
                if (false) {
                    deleteButton.disabled = true;
                }
                // TODO Button function DELETE

                var titlesArea = document.createElement('div');
                titlesArea.className = 'nir-version-titles';

                titlesArea.appendChild(versionName);
                titlesArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(titlesArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-nir-otchet-version-div').appendChild(nirVersion);
            }
        }
        else {
            var noVersionMessage = document.createElement('p');
            noVersionMessage.className = 'dark size-32 no-versions-message';
            noVersionMessage.innerText = 'Создайте версию отчёте на НИР с помощью кнопок ниже!';
            document.getElementById('student-nir-otchet-version-div').appendChild(noVersionMessage);
        }
    }


    $(function() {
        // TODO Copy data from array to 
        $('.nir-copy-button').on('click', function(event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.substr(versionId.length - 1);
            console.log(arrayID);
            //setStudentTheme();
            //setToExplore();
            //setToCreate();
            //setToFamiliarize();
            //setAdditionalTask();
            event.stopImmediatePropagation();
        });

        $(document).on('click', '.nir-version-clickable', function(event) {
            $(this).parent().parent().find('.nir-version-content').toggle();
            event.stopImmediatePropagation();
        });
    });

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-main-tabs'>
                <Tab eventKey='info1' title={<Image src={infoBlock1} thumbnail className='info-form-image'/>} className='info-form-tabs'>
                    <InfoTextBlock1/>
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
                                        <textarea value={studentTheme} onChange={e => { setStudentTheme(e.target.value);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Изучить:</Form.Label>
                                        <textarea value={toExplore} onChange={e => { setToExplore(e.target.value);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Практически выполнить:</Form.Label>
                                        <textarea value={toCreate} onChange={e => { setToCreate(e.target.value);}} className='dark size-24 info-input-area'/>
                                    </div>

                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Ознакомиться:</Form.Label>
                                        <textarea value={toFamiliarize} onChange={e => { setToFamiliarize(e.target.value);}} className='dark size-24 info-input-area'/>

                                        <Form.Label column className="size-21 dark info-input-label">Дополнительное задание:</Form.Label>
                                        <textarea value={additionalTask} onChange={e => { setAdditionalTask(e.target.value);console.log(additionalTask) }} className='dark size-24 info-input-area'/>

                                        <button type='button' onClick={e=> { console.log('nirTaskClick'); }} className='size-30 light dark-background info-button-1'>
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
                                        <p id='fileNirName' style={{display: 'inline-block'}}>Выберите файл</p>
                                    </label>
                                    <button type='button' onClick={uploadNIR} className='size-30 light dark-background info-button-inline-block'>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon'/>
                                        Загрузить отчет о прохождении НИР
                                    </button>
                                    <p id='errorNirMessage' className='size-24 dark' style={{visibility: 'hidden'}}>errorNir</p>
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