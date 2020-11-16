import React, { useState, useEffect } from 'react';
import { Form, Tabs, Tab, Image, Accordion, Card } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import infoBlock1 from '../../images/infographics blocks/block1_0.png';
import infoBlock2 from '../../images/infographics blocks/block2_0.png';
import infoBlock3 from '../../images/infographics blocks/block3_0.png';
import infoBlock4 from '../../images/infographics blocks/block4_0.png';
import infoBlock11 from '../../images/infographics blocks/block1.png';
import infoBlock22 from '../../images/infographics blocks/block2.png';
import infoBlock33 from '../../images/infographics blocks/block3.png';
import infoBlock44 from '../../images/infographics blocks/block4.png';

import iconDocument from '../../images/icons/documents.png';
import iconProject from '../../images/icons/myproject.png';
import iconInfo from '../../images/icons/info.png';
import iconExample from '../../images/icons/samples.png';

export default function StudentTasksPage() {

    // TODO массив версий иногда не грузится, приводит к крэше при нажатии кнопок

    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    // Образцы
    const [examples, setExamples] = useState([]);

    // Задание на НИР
    const [studentTheme, setStudentTheme] = useState('');
    const [toExplore, setToExplore] = useState('');
    const [toCreate, setToCreate] = useState('');
    const [toFamiliarize, setToFamiliarize] = useState('');
    const [additionalTask, setAdditionalTask] = useState('');

    // Загруженное содержание НИР
    var fileNirOtchet;
    const [nirTaskApproval, setNirTaskApproval] = useState(true);
    const [nirVersions, setNirVersions] = useState([]);
    const [nirOtchetVersions, setNirOtchetVersions] = useState([]);

    // Отчет по НИР
    const [detailedDescription, setDetailedDescription] = useState('');
    const [conclusion, setConclusion] = useState('');

    if (!fetchedData) {
        setFetchedData(true);
        getNirVersions();
        getExamples();
        getNirOtchetVersions();
    }

    useEffect(() => {
        showNirVersions(nirVersions);
    }, [nirVersions]);

    useEffect(() => {
        showNirOtchetVersions(nirOtchetVersions);
    }, [nirOtchetVersions]);

    useEffect(() => {
        showExamples(examples);
    }, [examples]);

    // Получение версий заданий НИР
    function getNirVersions() {
        axios({
            url: apiURL + '/student/document/task/view',
            method: 'GET',
            params: {
                'taskType': 'Научно-исследовательская работа',
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setNirVersions(response.data);
            //console.log(response.data);

        }).catch(result => {
            console.log(result.data);
        });
    }

    // Вывод на экран версий задания нир
    function showNirVersions(nirVersionArray) {
        if (nirVersionArray.length > 0) {
            for (var i = 0; i < nirVersionArray.length; i++) {
                var item = nirVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'nir-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.status;

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (item.status !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать документ
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button nir-version-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button nir-version-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                // Запретить удаление, если версия отправлена
                if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                    deleteButton.disabled = true;
                }

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-clickable';

                var nirVersionContent = document.createElement('div');
                nirVersionContent.className = 'nir-version-content light-background';

                var themeLabel = document.createElement('p');
                themeLabel.className = 'dark size-21 nir-text-label';
                themeLabel.innerText = 'Тема НИР:';

                // Тема нир
                var themeArea = document.createElement('textarea');
                themeArea.className = 'dark size-18 nir-text-area'
                themeArea.disabled = true;
                themeArea.value = item.theme;

                var exploreLabel = document.createElement('p');
                exploreLabel.className = 'dark size-21 nir-text-label';
                exploreLabel.innerText = 'Изучить:';

                // Изучить
                var exploreArea = document.createElement('textarea');
                exploreArea.className = 'dark size-18 nir-text-area'
                exploreArea.disabled = true;
                exploreArea.value = item.toExplore;

                var createLabel = document.createElement('p');
                createLabel.className = 'dark size-21 nir-text-label';
                createLabel.innerText = 'Выполнить:';

                // Выполнить
                var createArea = document.createElement('textarea');
                createArea.className = 'dark size-18 nir-text-area'
                createArea.disabled = true;
                createArea.value = item.toCreate;

                var familiarizeLabel = document.createElement('p');
                familiarizeLabel.className = 'dark size-21 nir-text-label2';
                familiarizeLabel.innerText = 'Ознакомиться:';

                // Ознакомиться
                var familiarizeArea = document.createElement('textarea');
                familiarizeArea.className = 'dark size-18 nir-text-area2'
                familiarizeArea.disabled = true;
                familiarizeArea.value = item.toFamiliarize;

                var taskLabel = document.createElement('p');
                taskLabel.className = 'dark size-21 nir-text-label2';
                taskLabel.innerText = 'Дополнительное задание:';

                // Доп задание
                var taskArea = document.createElement('textarea');
                taskArea.className = 'dark size-18 nir-text-area2'
                taskArea.disabled = true;
                taskArea.value = item.additionalTask;

                var copyButton = document.createElement('button');
                copyButton.className = 'light dark-background size-21 nir-copy-button nir-copy';
                copyButton.innerText = 'Перенести значения в меню';
                copyButton.type = 'button';

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

    }

    // Получение версий отчетов
    function getNirOtchetVersions() {
        axios({
            url: apiURL + '/student/document/report/view',
            method: 'GET',
            params: {
                'taskType': 'Научно-исследовательская работа',
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setNirOtchetVersions(response.data);
            console.log(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Вывод на экран версий отчетов НИР
    function showNirOtchetVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'nir-otchet-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.status;

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-clickable';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-otchet-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.status !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button nir-otchet-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button nir-otchet-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                    deleteButton.disabled = true;
                }

                var nirVersionContent = document.createElement('div');
                nirVersionContent.className = 'nir-version-content light-background';

                var detailedLabel = document.createElement('p');
                detailedLabel.className = 'dark size-21 nir-text-label';
                detailedLabel.innerText = 'Подробное содержание:';

                // Детальное содержание
                var detailedArea = document.createElement('textarea');
                detailedArea.className = 'dark size-18 nir-text-area'
                detailedArea.disabled = true;
                detailedArea.value = item.detailedContent;

                var conclusionLabel = document.createElement('p');
                conclusionLabel.className = 'dark size-21 nir-text-label';
                conclusionLabel.innerText = 'Заключение научного руководителя:';

                // Заключение
                var conclusionArea = document.createElement('textarea');
                conclusionArea.className = 'dark size-18 nir-text-area'
                conclusionArea.disabled = true;
                conclusionArea.value = item.advisorConclusion;

                // Кнопка перенести в меню
                var copyButton = document.createElement('button');
                copyButton.className = 'light dark-background size-21 nir-copy-button nir-otchet-copy';
                copyButton.id = 'nir-otchet-copy-' + i;
                copyButton.innerText = 'Перенести значения в меню';
                copyButton.type = 'button';
                copyButton.style.marginBottom = '10px';
                copyButton.style.marginTop = '10px';
                copyButton.style.marginLeft = '500px';

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

                columnDiv1.appendChild(detailedLabel);
                columnDiv1.appendChild(detailedArea);
                columnDiv2.appendChild(conclusionLabel);
                columnDiv2.appendChild(conclusionArea);
                rowDiv.appendChild(columnDiv1);
                rowDiv.appendChild(columnDiv2);
                nirVersionContent.appendChild(rowDiv);
                nirVersionContent.appendChild(copyButton);
                nirVersion.appendChild(nirVersionContent);

                document.getElementById('student-nir-otchet-version-div').appendChild(nirVersion);
            }
        }
    }

    function checkTaskApproval() {
        for (var i = 0; i < nirVersions.length; i++) {
            if (nirVersions[i].status === 'Одобрено') {
                return true;
            }
        }
        return false;
    }

    function getExamples() {
        axios({
            url: apiURL + '/document/view/templates/student',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response.data);
            setExamples(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showExamples(examplesArray) {
        for (var i = 0; i < examplesArray.length; i++) {
            var example = examplesArray[i];
            console.log(example);

            var exampleDiv = document.createElement('div');
            exampleDiv.className = 'student-example-div';
            exampleDiv.style.width = '1400px';

            var titleDiv = document.createElement('div');
            titleDiv.className = 'student-example-title dark-background';
            titleDiv.style.width = '1120px';

            var exampleImage = document.createElement('img');
            exampleImage.className = 'order-name-image'
            exampleImage.src = iconExample;

            var exampleName = document.createElement('p');
            exampleName.className = 'order-name-text light size-24';
            exampleName.innerText = example.documentName;

            var exampleDownload = document.createElement('button');
            exampleDownload.className = 'student-example-download light size-24';
            exampleDownload.type = 'button';
            exampleDownload.id = 'example-download-' + i;
            exampleDownload.innerText = "Сохранить образец";

            titleDiv.appendChild(exampleImage);
            titleDiv.appendChild(exampleName);
            exampleDiv.appendChild(titleDiv);
            exampleDiv.appendChild(exampleDownload);

            switch (example.documentType) {
                case 'Научно-исследовательская работа':
                    document.getElementById("example-panel-1").appendChild(exampleDiv);
                    break;
                case 'Практика по получению знаний и умений':
                    document.getElementById("example-panel-2").appendChild(exampleDiv);
                    break;
                case 'Преддипломная практика':
                    document.getElementById("example-panel-3").appendChild(exampleDiv);
                    break;
                case 'ВКР':
                    document.getElementById("example-panel-4").appendChild(exampleDiv);
                    break;
                default:
                    console.log('switchError');
            }
        }
    }

    function makeNirOtchet(file) {
        var formData = new FormData();
        formData.append('documentFormType', 'Научно-исследовательская работа');
        formData.append('documentFormKind', 'Отчёт');
        formData.append('documentFormDescription', 'Пример отчёта');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        formData.append('detailedContent', detailedDescription);
        formData.append('advisorConclusion', conclusion);
        formData.append('file', file);
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
            //window.location.reload();
        }).catch(result => {
            console.log(result);
        });
    }

    $(function () {
        // Послать версию задания науч руку
        $('.nir-version-send-button').off().on('click', function (event) {
            //console.log('sent');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/management/task/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': nirVersions[arrayID].systemVersionID,
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

        // Скачать версию задания
        $('.nir-version-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: nirVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Задание на НИР.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию задания
        $('.nir-version-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: nirVersions[arrayID].systemVersionID,
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

        // Функция кнопки "перенести в меню" для задания НИР
        $('.nir-copy').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            setStudentTheme(nirVersions[arrayID].theme);
            setToExplore(nirVersions[arrayID].toExplore);
            setToCreate(nirVersions[arrayID].toCreate);
            setToFamiliarize(nirVersions[arrayID].toFamiliarize);
            setAdditionalTask(nirVersions[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для отчета НИР
        $('.nir-otchet-copy').off().on('click', function (event) {
            var id = $(this).attr('id').split('-')[3];

            setDetailedDescription(nirOtchetVersions[id].detailedContent);
            setConclusion(nirOtchetVersions[id].advisorConclusion);
        });

        // Создание новой версии задания НИР
        $('#send-nir-task-button').off().on('click', function (event) {
            //console.log('made');
            var formData = new FormData();
            formData.append('taskType', 'Научно-исследовательская работа');
            formData.append('studentTheme', studentTheme);
            formData.append('toExplore', toExplore);
            formData.append('toCreate', toCreate);
            formData.append('toFamiliarize', toFamiliarize);
            formData.append('additionalTask', additionalTask);

            axios({
                url: apiURL + '/student/document/management/task/nir/create',
                method: 'POST',
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload();
                //console.log(response);

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Показ полей версии задания
        $(document).on('click', '.nir-version-clickable', function (event) {
            $(this).parent().parent().find('.nir-version-content').toggle();
            event.stopImmediatePropagation();
        });

        // Создать версию отчёта
        $('#make-nir-otchet-button').off().on('click', function (event) {
            $('#nir-otchet-file-input').trigger('click');
        });

        // Отправить отчёт науч руку
        $('.nir-otchet-send-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/report/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': nirOtchetVersions[arrayID].systemVersionID,
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

        // Скачать отчёт
        $('.nir-otchet-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/student/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': nirOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчёт по НИР.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить отчёт
        $('.nir-otchet-delete-button').off().on('click', function (event) {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: nirOtchetVersions[arrayID].systemVersionID,
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

        // Скачать пример
        $('.student-example-download').off().on('click', function () {
            var arrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/document/download/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'creator_id': examples[arrayId].systemCreatorID,
                    'documentName': examples[arrayId].documentName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', examples[arrayId].documentName);
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        })
    });

    return (
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-main-tabs' onSelect={(firstTab) => {
                $('#image1').attr('src', infoBlock1);
                $('#image2').attr('src', infoBlock2);
                $('#image3').attr('src', infoBlock3);
                $('#image4').attr('src', infoBlock4);
                console.log(firstTab);
                switch (firstTab) {
                    case 'info1':
                        $('#image1').attr('src', infoBlock11);
                        break;
                    case 'info2':
                        $('#image2').attr('src', infoBlock22);
                        break;
                    case 'info3':
                        $('#image3').attr('src', infoBlock33);
                        break;
                    case 'info4':
                        $('#image4').attr('src', infoBlock44);
                        break;
                    default:
                        console.log('tabError');
                }
            }}>
                <Tab eventKey='info1' title={<Image id='image1' src={infoBlock11} thumbnail className='info-form-image' style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }} />} className='info-form-tabs'>

                    <div className='dark info-task-block'>
                        <p className='size-24 info-text-block-title'>НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА</p>
                        <div>
                            <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: 1.09.2020</b></p>
                            <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: 21.12.2020</b></p>
                        </div>
                        <div style={{ clear: 'both' }}></div>

                        <div className='task-page-accordion-div'>
                            <Accordion>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="acc0" className='dark size-28 accordion-clickable'>
                                        Образцы по НИР
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="acc0">
                                        <Card.Body id='example-panel-1'>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>

                    <div className='info-break-div'>&nbsp;</div>
                    <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function () { window.scrollTo(0, 2000); }, 1); }} className='info-form-subtab light-background container-fluid'>
                        <Tab eventKey='info11' title={
                            <p className='size-30 light dark-background info-form-subtab-title'>
                                <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Задание на НИР
                            </p>
                        }>
                            <div className='info-sub-tab-div'>

                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Задание на НИР</p>

                                <div id='student-nir-task-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-row'>
                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Тема НИР:</Form.Label>
                                        <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area' />

                                        <Form.Label column className="size-21 dark info-input-label">Изучить:</Form.Label>
                                        <textarea maxLength='2048' value={toExplore} onChange={(e) => { setToExplore(e.target.value); }} className='dark size-24 info-input-area' />

                                        <Form.Label column className="size-21 dark info-input-label">Практически выполнить:</Form.Label>
                                        <textarea maxLength='2048' value={toCreate} onChange={(e) => { setToCreate(e.target.value); }} className='dark size-24 info-input-area' />
                                    </div>

                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Ознакомиться:</Form.Label>
                                        <textarea maxLength='2048' value={toFamiliarize} onChange={(e) => { setToFamiliarize(e.target.value); }} className='dark size-24 info-input-area' />

                                        <Form.Label column className="size-21 dark info-input-label">Дополнительное задание:</Form.Label>
                                        <textarea maxLength='2048' value={additionalTask} onChange={(e) => { setAdditionalTask(e.target.value); }} className='dark size-24 info-input-area' />

                                        <button type='button' id='send-nir-task-button' className='size-30 light dark-background info-button-1'>
                                            <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' />
                                            Создать новую версию<br />задания на НИР
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </Tab>
                        <Tab eventKey='info12' title={
                            <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '846px' }}>
                                <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Отчет о<br />прохождении НИР
                            </p>
                        }>
                            <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                            <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении НИР</p>

                            <div id='student-nir-otchet-version-div' className='student-nir-task-version-div light-background'></div>

                            <div className='info-sub-tab-div'>

                                <div className='info-row'>
                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Детальное содержание:</Form.Label>
                                        <textarea id='nir-otchet-description' maxLength='1024' value={detailedDescription} onChange={(e) => { setDetailedDescription(e.target.value); 
                                            if ($('#nir-otchet-description').val() === '' || $('#nir-otchet-conclusion').val() === '') {
                                                document.getElementById('make-nir-otchet-button').disabled = true;
                                            }
                                            else {
                                                document.getElementById('make-nir-otchet-button').disabled = false;
                                            }
                                            }} className='dark size-24 info-input-area' />
                                    </div>

                                    <div className='info-column'>
                                        <Form.Label column className="size-21 dark info-input-label">Заключение научного руководителя:</Form.Label>
                                        <textarea id='nir-otchet-conclusion' maxLength='2048' value={conclusion} onChange={(e) => { 
                                            setConclusion(e.target.value); 
                                            if ($('#nir-otchet-description').val() === '' || $('#nir-otchet-conclusion').val() === '') {
                                                document.getElementById('make-nir-otchet-button').disabled = true;
                                            }
                                            else {
                                                document.getElementById('make-nir-otchet-button').disabled = false;
                                            }
                                            }} className='dark size-24 info-input-area' />
                                    </div>
                                </div>

                                <button type='button' disabled id='make-nir-otchet-button' className='size-30 light dark-background info-button-inline-block' style={{marginLeft:'425px',marginTop:'20px'}}>
                                    <Image src={iconProject} thumbnail className='dark-background thumbnail-icon' />
                                        Сформировать и загрузить версию отчета
                                </button>
                                <input id='nir-otchet-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                    console.log(e.target.files);
                                    if (e.target.files.length !== 0) {
                                        makeNirOtchet(e.target.files[0]);
                                    }
                                }} ></input>
                            </div>
                        </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey='info2' title={<Image id='image2' src={infoBlock2} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                    <div className='dark info-task-block'>
                        <p className='size-24 info-text-block-title'>ПРАКТИКА ПО ПОЛУЧЕНИЮ ПРОФЕССИОНАЛЬНЫХ УМЕНИЙ И ОПЫТА ПРОФЕССИОНАЛЬНОЙ ДЕЯТЕЛЬНОСТИ</p>
                        <div>
                            <p className='size-20 info-text-block-start-date'><b>Начало: 09.02.2021</b></p>
                            <p className='size-20 info-text-block-end-date'><b>Конец: 05.04.2021</b></p>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        <div className='task-page-accordion-div'>
                            <Accordion>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="acc1" className='dark size-28 accordion-clickable'>
                                        Образцы по ПпППУиОПД
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="acc1">
                                        <Card.Body id='example-panel-2'>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                    <div className='info-break-div'>&nbsp;</div>
                </Tab>
                <Tab eventKey='info3' title={<Image id='image3' src={infoBlock3} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                    <div className='dark info-task-block'>
                        <p className='size-24 info-text-block-title'>ПРЕДДИПЛОМНАЯ ПРАКТИКА</p>
                        <div>
                            <p className='size-20 info-text-block-start-date'><b>Начало: 20.04.2021</b></p>
                            <p className='size-20 info-text-block-end-date'><b>Конец: 17.05.2021</b></p>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        <div className='task-page-accordion-div'>
                            <Accordion>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="acc2" className='dark size-28 accordion-clickable'>
                                        Образцы по ПП
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="acc2">
                                        <Card.Body id='example-panel-3'>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                    <div className='info-break-div'>&nbsp;</div>
                </Tab>
                <Tab eventKey='info4' title={<Image id='image4' src={infoBlock4} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                    <div className='dark info-task-block'>
                        <p className='size-24 info-text-block-title'>ПОДГОТОВКА И ЗАЩИТА ВКР</p>
                        <div>
                            <p className='size-20 info-text-block-start-date'><b>Начало: 25.05.2021</b></p>
                            <p className='size-20 info-text-block-end-date'><b>Конец: 05.07.2021</b></p>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        <div className='task-page-accordion-div'>
                            <Accordion>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="acc3" className='dark size-28 accordion-clickable'>
                                        Образцы по ВКР
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="acc3">
                                        <Card.Body id='example-panel-4'>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                    <div className='info-break-div'>&nbsp;</div>
                </Tab>
            </Tabs>

        </Form>

    );
}