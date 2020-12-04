import React, { useState, useEffect } from 'react';
import { Form, Tabs, Tab, Image, Accordion, Card, Table } from 'react-bootstrap';
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
import iconExample from '../../images/icons/samples.png';

export default function StudentTasksPage() {

    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [studentData, setStudentData] = useState('');
    const [themeConfirmed, setThemeConfirmed] = useState('');

    // Образцы
    const [examples, setExamples] = useState([]);

    // Задание на НИР
    const [nirVersions, setNirVersions] = useState([]);
    const [studentTheme, setStudentTheme] = useState('');
    const [toExplore, setToExplore] = useState('');
    const [toCreate, setToCreate] = useState('');
    const [toFamiliarize, setToFamiliarize] = useState('');
    const [additionalTask, setAdditionalTask] = useState('');

    // Отчет по НИР
    const [nirOtchetVersions, setNirOtchetVersions] = useState([]);
    const [detailedDescription, setDetailedDescription] = useState('');
    const [conclusion, setConclusion] = useState('');

    // Версии заданий по ПП...
    const [longPPData, setLongPPData] = useState([]);

    // Отчет по ПП...
    const [longPPOtchetVersions, setLongPPOtchetVersions] = useState([]);
    const [detailedDescriptionLongPP, setDetailedDescriptionLongPP] = useState('');
    const [conclusionLongPP, setConclusionLongPP] = useState('');

    // Версии заданий по ПП
    const [PPData, setPPData] = useState([]);

    // Отчет по ПП
    const [PPOtchetVersions, setPPOtchetVersions] = useState([]);
    const [detailedDescriptionPP, setDetailedDescriptionPP] = useState('');
    const [conclusionPP, setConclusionPP] = useState('');

    // ВКР - задание
    const [vkrTaskVersions, setVkrTaskVersions] = useState([]);
    const [vkrDocs, setVkrDocs] = useState('');
    const [vkrAims, setVkrAims] = useState('');
    const [vkrTasks, setVkrTasks] = useState('');

    // ВКР - РПЗ
    const [vkrOtchetVersions, setVkrOtchetVersions] = useState([]);

    // ВКР - отзыв научного руководителя
    const [vkrReviewVersions, setVkrReviewVersions] = useState([]);

    // ВКР - допуск
    const [vkrDopuskVersions, setVkrDopuskVersions] = useState([]);

    // ВКР - антиплагиат
    const [vkrAntiplagiatVersions, setAntiplagiatVersions] = useState([]);

    // ВКР - презентация
    const [vkrPrezentationVersions, setPrezentationVersions] = useState([]);

    if (!fetchedData) {
        setFetchedData(true);

        getStudentData();

        getTaskVersions('Научно-исследовательская работа');
        getOtchetVersions('Научно-исследовательская работа');
        getTaskVersions('Практика по получению знаний и умений');
        getOtchetVersions('Практика по получению знаний и умений');
        getTaskVersions('Преддипломная практика');
        getOtchetVersions('Преддипломная практика');
        getTaskVersions('ВКР');
        getOtchetVersions('ВКР');

        getVkrStuff('Допуск');
        getVkrStuff('Отзыв');
        getVkrStuff('Антиплагиат');
        getVkrStuff('Презентация');

        getExamples();
    }

    useEffect(() => {
        if (studentData !== '') {
            showStudentData(studentData);
        }
    }, [studentData]);

    useEffect(() => {
        showNirVersions(nirVersions);
    }, [nirVersions]);

    useEffect(() => {
        showLongPPVersions(longPPData);
    }, [longPPData]);

    useEffect(() => {
        showPPVersions(PPData);
    }, [PPData]);

    useEffect(() => {
        showNirOtchetVersions(nirOtchetVersions);
    }, [nirOtchetVersions]);

    useEffect(() => {
        showLongPPOtchetVersions(longPPOtchetVersions);
    }, [longPPOtchetVersions]);

    useEffect(() => {
        showPPOtchetVersions(PPOtchetVersions);
    }, [PPOtchetVersions]);

    useEffect(() => {
        showVkrTaskVersions(vkrTaskVersions);
    }, [vkrTaskVersions]);

    useEffect(() => {
        showVkrOtchetVersions(vkrOtchetVersions);
    }, [vkrOtchetVersions]);

    useEffect(() => {
        showExamples(examples);
    }, [examples]);

    useEffect(() => {
        showDopuskVersions(vkrDopuskVersions);
    }, [vkrDopuskVersions]);

    useEffect(() => {
        showReviewVersions(vkrReviewVersions);
    }, [vkrReviewVersions]);

    useEffect(() => {
        showAntiplagiatVersions(vkrAntiplagiatVersions);
    }, [vkrAntiplagiatVersions]);

    useEffect(() => {
        showPresentationVersions(vkrPrezentationVersions);
    }, [vkrPrezentationVersions]);

    function getStudentData() {
        console.log('1');
        axios({
            url: apiURL + '/student/get/about/me',
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

    function showStudentData(item) {
        //console.log(item);

        var student = document.createElement('tr');
        student.className = 'size-20 dark';

        // Тема студента
        var studentTheme = document.createElement('th');
        studentTheme.innerText = item.studentVkrTheme;
        if (item.studentVkrThemeEditable) {
            setThemeConfirmed('Не одобрена');
        }
        else {
            setThemeConfirmed('Одобрена');
        }
        studentTheme.style.overflow = 'hidden';
        studentTheme.style.textOverflow = 'ellipsis';
        studentTheme.style.maxWidth = '300px';

        // НИР
        var studentNir = document.createElement('th');

        var nirTaskCheckbox = document.createElement('input');
        nirTaskCheckbox.type = 'checkbox';
        nirTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.nirTaskStatus) {
            nirTaskCheckbox.checked = true;
        }
        var nirTaskStatus = document.createElement('label');
        nirTaskStatus.htmlFor = nirTaskCheckbox;
        nirTaskStatus.innerText = 'Задание на НИР:';
        nirTaskStatus.style.width = '148px';

        var nirTaskDiv = document.createElement('div');

        var nirReportCheckbox = document.createElement('input');
        nirReportCheckbox.type = 'checkbox';
        nirReportCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.nirReportStatus) {
            nirReportCheckbox.checked = true;
        }
        var nirReportStatus = document.createElement('label');
        nirReportStatus.htmlFor = nirReportCheckbox;
        nirReportStatus.innerText = 'Отчет по НИР:';
        nirReportStatus.style.width = '148px';

        var nirReportDiv = document.createElement('div');

        // ППП...
        var studentLongPP = document.createElement('th');

        var longPPTaskCheckbox = document.createElement('input');
        longPPTaskCheckbox.type = 'checkbox';
        longPPTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppppuipdTaskStatus) {
            longPPTaskCheckbox.checked = true;
        }
        var longPPTaskStatus = document.createElement('label');
        longPPTaskStatus.htmlFor = longPPTaskCheckbox;
        longPPTaskStatus.innerText = 'Задание по ПпППУиОПД:';
        longPPTaskStatus.style.width = '223px';

        var longPPTaskDiv = document.createElement('div');

        var longPPReportCheckbox = document.createElement('input');
        longPPReportCheckbox.type = 'checkbox';
        longPPReportCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppppuipdReportStatus) {
            longPPReportCheckbox.checked = true;
        }
        var longPPReportStatus = document.createElement('label');
        longPPReportStatus.htmlFor = longPPReportCheckbox;
        longPPReportStatus.innerText = 'Отчет по ПпППУиОПД:';
        longPPReportStatus.style.width = '223px';

        var longPPReportDiv = document.createElement('div');

        // ПП
        var studentPP = document.createElement('th');

        var ppTaskCheckbox = document.createElement('input');
        ppTaskCheckbox.type = 'checkbox';
        ppTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppTaskStatus) {
            ppTaskCheckbox.checked = true;
        }
        var ppTaskStatus = document.createElement('label');
        ppTaskStatus.htmlFor = ppTaskCheckbox;
        ppTaskStatus.innerText = 'Задание по ПП:';
        ppTaskStatus.style.width = '138px';

        var ppTaskDiv = document.createElement('div');

        var ppReportCheckbox = document.createElement('input');
        ppReportCheckbox.type = 'checkbox';
        ppReportCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppReportStatus) {
            ppReportCheckbox.checked = true;
        }
        var ppReportStatus = document.createElement('label');
        ppReportStatus.htmlFor = ppReportCheckbox;
        ppReportStatus.innerText = 'Отчет по ПП:';
        ppReportStatus.style.width = '138px';

        var ppReportDiv = document.createElement('div');

        // ВКР
        var studentVkr = document.createElement('th');

        var vkrAdvisorFeedbackCheckbox = document.createElement('input');
        vkrAdvisorFeedbackCheckbox.type = 'checkbox';
        vkrAdvisorFeedbackCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAdvisorFeedback) {
            vkrAdvisorFeedbackCheckbox.checked = true;
        }
        var vkrAdvisorFeedbackStatus = document.createElement('label');
        vkrAdvisorFeedbackStatus.htmlFor = vkrAdvisorFeedbackCheckbox;
        vkrAdvisorFeedbackStatus.innerText = 'Отзыв руководителя:';
        vkrAdvisorFeedbackStatus.style.width = '188px';

        var vkrAdvisorFeedbackDiv = document.createElement('div');

        var vkrAllowanceCheckbox = document.createElement('input');
        vkrAllowanceCheckbox.type = 'checkbox';
        vkrAllowanceCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAllowance) {
            vkrAllowanceCheckbox.checked = true;
        }
        var vkrAllowanceStatus = document.createElement('label');
        vkrAllowanceStatus.htmlFor = vkrAllowanceCheckbox;
        vkrAllowanceStatus.innerText = 'Допуск к ВКР:';
        vkrAllowanceStatus.style.width = '188px';

        var vkrAllowanceStatusDiv = document.createElement('div');

        var vkrTaskCheckbox = document.createElement('input');
        vkrTaskCheckbox.type = 'checkbox';
        vkrTaskCheckbox.className = 'sci-table-checkbox';
        //vkrTaskCheckbox.disabled = true;
        if (item.studentDocumentsStatusView.vkrTask) {
            vkrTaskCheckbox.checked = true;
        }
        var vkrTaskStatus = document.createElement('label');
        vkrTaskStatus.htmlFor = vkrTaskCheckbox;
        vkrTaskStatus.innerText = 'Задание ВКР:';
        vkrTaskStatus.style.width = '188px';

        var vkrTaskDiv = document.createElement('div');

        var vkrRPZCheckbox = document.createElement('input');
        vkrRPZCheckbox.type = 'checkbox';
        vkrRPZCheckbox.className = 'sci-table-checkbox';
        //vkrRPZCheckbox.disabled = true;
        if (item.studentDocumentsStatusView.vkrRPZ) {
            vkrRPZCheckbox.checked = true;
        }
        var vkrRPZStatus = document.createElement('label');
        vkrRPZStatus.htmlFor = vkrRPZCheckbox;
        vkrRPZStatus.innerText = 'РПЗ:';
        vkrRPZStatus.style.width = '188px';

        var vkrRPZDiv = document.createElement('div');

        var vkrAntiplagiatCheckbox = document.createElement('input');
        vkrAntiplagiatCheckbox.type = 'checkbox';
        vkrAntiplagiatCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAntiplagiat) {
            vkrAntiplagiatCheckbox.checked = true;
        }
        var vkrAntiplagiatStatus = document.createElement('label');
        vkrAntiplagiatStatus.htmlFor = vkrAntiplagiatCheckbox;
        vkrAntiplagiatStatus.innerText = 'Антиплагиат:';
        vkrAntiplagiatStatus.style.width = '188px';

        var vkrAntiplagiatDiv = document.createElement('div');

        var vkrPresentationCheckbox = document.createElement('input');
        vkrPresentationCheckbox.type = 'checkbox';
        vkrPresentationCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrPresentation) {
            vkrPresentationCheckbox.checked = true;
        }
        var vkrPresentationStatus = document.createElement('label');
        vkrPresentationStatus.htmlFor = vkrPresentationCheckbox;
        vkrPresentationStatus.innerText = 'Презентация:';
        vkrPresentationStatus.style.width = '188px';

        var vkrPresentationDiv = document.createElement('div');

        student.appendChild(studentTheme);

        nirTaskDiv.appendChild(nirTaskStatus);
        nirTaskDiv.appendChild(nirTaskCheckbox);
        studentNir.appendChild(nirTaskDiv);

        nirReportDiv.appendChild(nirReportStatus);
        nirReportDiv.appendChild(nirReportCheckbox);
        studentNir.appendChild(nirReportDiv);

        student.appendChild(studentNir);

        longPPTaskDiv.appendChild(longPPTaskStatus);
        longPPTaskDiv.appendChild(longPPTaskCheckbox);
        studentLongPP.appendChild(longPPTaskDiv);

        longPPReportDiv.appendChild(longPPReportStatus);
        longPPReportDiv.appendChild(longPPReportCheckbox);
        studentLongPP.appendChild(longPPReportDiv);

        student.appendChild(studentLongPP);

        ppTaskDiv.appendChild(ppTaskStatus);
        ppTaskDiv.appendChild(ppTaskCheckbox);
        studentPP.appendChild(ppTaskDiv);

        ppReportDiv.appendChild(ppReportStatus);
        ppReportDiv.appendChild(ppReportCheckbox);
        studentPP.appendChild(ppReportDiv);

        student.appendChild(studentPP);

        vkrAdvisorFeedbackDiv.appendChild(vkrAdvisorFeedbackStatus);
        vkrAdvisorFeedbackDiv.appendChild(vkrAdvisorFeedbackCheckbox);
        studentVkr.appendChild(vkrAdvisorFeedbackDiv);

        vkrAllowanceStatusDiv.appendChild(vkrAllowanceStatus);
        vkrAllowanceStatusDiv.appendChild(vkrAllowanceCheckbox);
        studentVkr.appendChild(vkrAllowanceStatusDiv);

        vkrTaskDiv.appendChild(vkrTaskStatus);
        vkrTaskDiv.appendChild(vkrTaskCheckbox);
        studentVkr.appendChild(vkrTaskDiv);

        vkrRPZDiv.appendChild(vkrRPZStatus);
        vkrRPZDiv.appendChild(vkrRPZCheckbox);
        studentVkr.appendChild(vkrRPZDiv);

        vkrAntiplagiatDiv.appendChild(vkrAntiplagiatStatus);
        vkrAntiplagiatDiv.appendChild(vkrAntiplagiatCheckbox);
        studentVkr.appendChild(vkrAntiplagiatDiv);

        vkrPresentationDiv.appendChild(vkrPresentationStatus);
        vkrPresentationDiv.appendChild(vkrPresentationCheckbox);
        studentVkr.appendChild(vkrPresentationDiv);

        student.appendChild(studentVkr);

        document.getElementById('student-table-body').appendChild(student);

    }

    // Получение версий заданий
    function getTaskVersions(type) {
        axios({
            url: apiURL + '/student/document/task/view',
            method: 'GET',
            params: {
                'taskType': type,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            switch (type) {
                case 'Научно-исследовательская работа':
                    //console.log(response.data);
                    setNirVersions(response.data);
                    break;
                case 'Практика по получению знаний и умений':
                    //console.log(response.data);
                    setLongPPData(response.data);
                    break;
                case 'Преддипломная практика':
                    //console.log(response.data);
                    setPPData(response.data);
                    break;
                case 'ВКР':
                    //console.log(response.data);
                    setVkrTaskVersions(response.data);
                    break;
                default:
                    console.log(response);
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Получение версий отчетов
    function getOtchetVersions(type) {
        axios({
            url: apiURL + '/student/document/report/view',
            method: 'GET',
            params: {
                'taskType': type,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            switch (type) {
                case 'Научно-исследовательская работа':
                    //console.log(response);
                    setNirOtchetVersions(response.data);
                    break;
                case 'Практика по получению знаний и умений':
                    setLongPPOtchetVersions(response.data);
                    break;
                case 'Преддипломная практика':
                    //console.log(response);
                    setPPOtchetVersions(response.data);
                    break;
                case 'ВКР':
                    //console.log(response);
                    setVkrOtchetVersions(response.data);
                    break;
                default:
                    console.log(response);
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

    function getVkrStuff(stuffKind) {
        axios({
            url: apiURL + '/student/document/vkr/stuff/view',
            method: 'GET',
            params: {
                'stuffKind': stuffKind,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            switch (stuffKind) {
                case 'Допуск':
                    //console.log('Допуск');
                    //console.log(response);
                    setVkrDopuskVersions(response.data);
                    break;
                case 'Отзыв':
                    //console.log('Отзыв');
                    //console.log(response);
                    setVkrReviewVersions(response.data);
                    break;
                case 'Антиплагиат':
                    //console.log('Антиплагиат');
                    //console.log(response);
                    setAntiplagiatVersions(response.data);
                    break;
                case 'Презентация':
                    //console.log('Презентация');
                    //console.log(response);
                    setPrezentationVersions(response.data);
                    break;
                default:
                    console.log(response);
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showDopuskVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];
                //console.log(item);

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'vkr-dopusk-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.documentStatus;

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-titles';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button vkr-dopusk-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button vkr-dopusk-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button vkr-dopusk-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено' && item.documentStatus !== 'Замечания') {
                    deleteButton.disabled = true;
                }


                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-vkr-dopusk-version-div').appendChild(nirVersion);
            }
        }
    }

    function showReviewVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];
                //console.log(item);

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'vkr-dopusk-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.documentStatus;

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-titles';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button vkr-review-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button vkr-review-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button vkr-review-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено' && item.documentStatus !== 'Замечания') {
                    deleteButton.disabled = true;
                }


                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-vkr-review-version-div').appendChild(nirVersion);
            }
        }
    }

    function showAntiplagiatVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];
                //console.log(item);

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'vkr-dopusk-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.documentStatus;

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-titles';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button vkr-antiplagiat-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button vkr-antiplagiat-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button vkr-antiplagiat-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено' && item.documentStatus !== 'Замечания') {
                    deleteButton.disabled = true;
                }

                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-vkr-antiplagiat-version-div').appendChild(nirVersion);
            }
        }
    }

    function showPresentationVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];
                //console.log(item);

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'vkr-dopusk-version-' + i;

                var nirVersionHeader = document.createElement('div');
                nirVersionHeader.className = 'nir-version-header dark-background';

                // Имя версии
                var versionName = document.createElement('p');
                versionName.className = 'light size-24 nir-header-text';
                versionName.innerText = 'Версия: ' + item.versionEditionDate;

                // Статус версии
                var versionStatus = document.createElement('p');
                versionStatus.className = 'light size-24 nir-header-text';
                versionStatus.innerText = 'Статус: ' + item.documentStatus;

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-titles';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button vkr-presentation-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button vkr-presentation-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button vkr-presentation-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.documentStatus !== 'Не отправлено' && item.documentStatus !== 'Замечания') {
                    deleteButton.disabled = true;
                }

                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-vkr-presentation-version-div').appendChild(nirVersion);
            }
        }
    }

    // Вывод версий задания нир
    function showNirVersions(nirVersionArray) {
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

            // Кнопка просмотреть
            /*
            var viewButton = document.createElement('button');
            viewButton.className = 'dark size-24 nir-version-header-button nir-version-view-button';
            viewButton.innerText = 'Просмотреть';
            viewButton.type = 'button';
            */

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
            themeLabel.innerText = 'Тема:';

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
            //nirVersionHeader.appendChild(viewButton);
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

    // Вывод версий задания ПП...
    function showLongPPVersions(longPPVersionArray) {
        for (var i = 0; i < longPPVersionArray.length; i++) {
            var item = longPPVersionArray[i];

            var longPPVersion = document.createElement('div');
            longPPVersion.className = 'nir-version light-background';
            longPPVersion.id = 'long-pp-version-' + i;

            var longPPVersionHeader = document.createElement('div');
            longPPVersionHeader.className = 'nir-version-header dark-background';

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
            sendButton.className = 'dark size-24 nir-version-header-button long-pp-version-send-button';
            sendButton.innerText = 'Отправить науч. руку';
            sendButton.type = 'button';
            // Запретить отсылку, если версия отправлена
            if (item.status !== 'Не отправлено') {
                sendButton.disabled = true;
            }

            // Кнопка скачать документ
            var downloadButton = document.createElement('button');
            downloadButton.className = 'dark size-24 nir-version-header-button long-pp-version-download-button';
            downloadButton.innerText = 'Сохранить документ';
            downloadButton.type = 'button';

            // Кнопка удалить
            var deleteButton = document.createElement('button');
            deleteButton.className = 'dark size-24 nir-version-header-button long-pp-version-delete-button';
            deleteButton.innerText = 'Удалить версию';
            deleteButton.type = 'button';
            // Запретить удаление, если версия отправлена
            if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                deleteButton.disabled = true;
            }

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-clickable';

            var longPPVersionContent = document.createElement('div');
            longPPVersionContent.className = 'nir-version-content light-background';

            var themeLabel = document.createElement('p');
            themeLabel.className = 'dark size-21 nir-text-label';
            themeLabel.innerText = 'Тема:';

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
            copyButton.className = 'light dark-background size-21 nir-copy-button long-pp-copy';
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
            longPPVersionHeader.appendChild(clickableArea);
            longPPVersionHeader.appendChild(sendButton);
            longPPVersionHeader.appendChild(downloadButton);
            longPPVersionHeader.appendChild(deleteButton);
            longPPVersion.appendChild(longPPVersionHeader);
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
            longPPVersionContent.appendChild(rowDiv);
            longPPVersion.appendChild(longPPVersionContent);
            document.getElementById('student-long-pp-task-version-div').appendChild(longPPVersion);
        }
    }

    // Вывод версий задания ПП
    function showPPVersions(longPPVersionArray) {
        for (var i = 0; i < longPPVersionArray.length; i++) {
            var item = longPPVersionArray[i];

            var longPPVersion = document.createElement('div');
            longPPVersion.className = 'nir-version light-background';
            longPPVersion.id = 'pp-version-' + i;

            var longPPVersionHeader = document.createElement('div');
            longPPVersionHeader.className = 'nir-version-header dark-background';

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
            sendButton.className = 'dark size-24 nir-version-header-button pp-version-send-button';
            sendButton.innerText = 'Отправить науч. руку';
            sendButton.type = 'button';
            // Запретить отсылку, если версия отправлена
            if (item.status !== 'Не отправлено') {
                sendButton.disabled = true;
            }

            // Кнопка скачать документ
            var downloadButton = document.createElement('button');
            downloadButton.className = 'dark size-24 nir-version-header-button pp-version-download-button';
            downloadButton.innerText = 'Сохранить документ';
            downloadButton.type = 'button';

            // Кнопка удалить
            var deleteButton = document.createElement('button');
            deleteButton.className = 'dark size-24 nir-version-header-button pp-version-delete-button';
            deleteButton.innerText = 'Удалить версию';
            deleteButton.type = 'button';
            // Запретить удаление, если версия отправлена
            if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                deleteButton.disabled = true;
            }

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-clickable';

            var longPPVersionContent = document.createElement('div');
            longPPVersionContent.className = 'nir-version-content light-background';

            var themeLabel = document.createElement('p');
            themeLabel.className = 'dark size-21 nir-text-label';
            themeLabel.innerText = 'Тема:';

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
            copyButton.className = 'light dark-background size-21 nir-copy-button pp-copy';
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
            longPPVersionHeader.appendChild(clickableArea);
            longPPVersionHeader.appendChild(sendButton);
            longPPVersionHeader.appendChild(downloadButton);
            longPPVersionHeader.appendChild(deleteButton);
            longPPVersion.appendChild(longPPVersionHeader);
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
            longPPVersionContent.appendChild(rowDiv);
            longPPVersion.appendChild(longPPVersionContent);
            document.getElementById('student-pp-task-version-div').appendChild(longPPVersion);
        }
    }

    // Вывод версий задания ВКР
    function showVkrTaskVersions(vkrTaskVersionArray) {
        for (var i = 0; i < vkrTaskVersionArray.length; i++) {
            var item = vkrTaskVersionArray[i];

            var nirVersion = document.createElement('div');
            nirVersion.className = 'nir-version light-background';
            nirVersion.id = 'vkr-version-' + i;

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
            sendButton.className = 'dark size-24 nir-version-header-button vkr-version-send-button';
            sendButton.innerText = 'Отправить науч. руку';
            sendButton.type = 'button';
            // Запретить отсылку, если версия отправлена
            if (item.status !== 'Не отправлено') {
                sendButton.disabled = true;
            }

            // Кнопка скачать документ
            var downloadButton = document.createElement('button');
            downloadButton.className = 'dark size-24 nir-version-header-button vkr-version-download-button';
            downloadButton.innerText = 'Сохранить документ';
            downloadButton.type = 'button';

            // Кнопка удалить
            var deleteButton = document.createElement('button');
            deleteButton.className = 'dark size-24 nir-version-header-button vkr-version-delete-button';
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
            themeLabel.innerText = 'Тема:';

            // Тема
            var themeArea = document.createElement('textarea');
            themeArea.className = 'dark size-18 nir-text-area'
            themeArea.disabled = true;
            themeArea.value = item.theme;

            var aimLabel = document.createElement('p');
            aimLabel.className = 'dark size-21 nir-text-label';
            aimLabel.innerText = 'Цель:';

            // Цель
            var aimArea = document.createElement('textarea');
            aimArea.className = 'dark size-18 nir-text-area'
            aimArea.disabled = true;
            aimArea.value = item.vkrAim;

            var tasksLabel = document.createElement('p');
            tasksLabel.className = 'dark size-21 nir-text-label';
            tasksLabel.innerText = 'Задачи:';

            // Ззадачи
            var tasksArea = document.createElement('textarea');
            tasksArea.className = 'dark size-18 nir-text-area'
            tasksArea.disabled = true;
            tasksArea.value = item.vkrTasks;

            var docsLabel = document.createElement('p');
            docsLabel.className = 'dark size-21 nir-text-label2';
            docsLabel.innerText = 'Разрабатываемые документы:';

            // Ознакомиться
            var docsArea = document.createElement('textarea');
            docsArea.className = 'dark size-18 nir-text-area2'
            docsArea.disabled = true;
            docsArea.value = item.vkrDocs;

            var copyButton = document.createElement('button');
            copyButton.className = 'light dark-background size-21 nir-copy-button vkr-copy';
            copyButton.innerText = 'Перенести значения в меню';
            copyButton.type = 'button';
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
            //nirVersionHeader.appendChild(viewButton);
            nirVersionHeader.appendChild(sendButton);
            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);
            columnDiv1.appendChild(themeLabel);
            columnDiv1.appendChild(themeArea);
            columnDiv1.appendChild(aimLabel);
            columnDiv1.appendChild(aimArea);
            columnDiv2.appendChild(tasksLabel);
            columnDiv2.appendChild(tasksArea);
            columnDiv2.appendChild(docsLabel);
            columnDiv2.appendChild(docsArea);
            //columnDiv2.appendChild(copyButton);
            rowDiv.appendChild(columnDiv1);
            rowDiv.appendChild(columnDiv2);
            nirVersionContent.appendChild(rowDiv);
            nirVersionContent.appendChild(copyButton);
            nirVersion.appendChild(nirVersionContent);
            document.getElementById('student-vkr-task-version-div').appendChild(nirVersion);
        }

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

    // Вывод на экран версий отчетов ПП...
    function showLongPPOtchetVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'long-pp-otchet-version-' + i;

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
                sendButton.className = 'dark size-24 nir-version-header-button long-pp-otchet-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.status !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button long-pp-otchet-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button long-pp-otchet-delete-button';
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
                copyButton.className = 'light dark-background size-21 nir-copy-button long-pp-otchet-copy';
                copyButton.id = 'long-pp-otchet-copy-' + i;
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

                document.getElementById('student-long-pp-otchet-version-div').appendChild(nirVersion);
            }
        }
    }

    // Вывод на экран версий отчетов ПП
    function showPPOtchetVersions(nirOtchetVersionArray) {
        if (nirOtchetVersionArray.length > 0) {
            for (var i = 0; i < nirOtchetVersionArray.length; i++) {
                var item = nirOtchetVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'pp-otchet-version-' + i;

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
                sendButton.className = 'dark size-24 nir-version-header-button pp-otchet-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.status !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button pp-otchet-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button pp-otchet-delete-button';
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
                copyButton.className = 'light dark-background size-21 nir-copy-button pp-otchet-copy';
                copyButton.id = 'pp-otchet-copy-' + i;
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

                document.getElementById('student-pp-otchet-version-div').appendChild(nirVersion);
            }
        }
    }

    // Вывод на экран версий отчетов НИР
    function showVkrOtchetVersions(nirOtchetVersionArray) {
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
                clickableArea.className = 'nir-version-titles';

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button vkr-otchet-send-button';
                sendButton.innerText = 'Отправить науч. руку';
                sendButton.type = 'button';
                if (item.status !== 'Не отправлено') {
                    sendButton.disabled = true;
                }

                // Кнопка скачать отчёт
                var downloadButton = document.createElement('button');
                downloadButton.className = 'dark size-24 nir-version-header-button vkr-otchet-download-button';
                downloadButton.innerText = 'Сохранить документ';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'dark size-24 nir-version-header-button vkr-otchet-delete-button';
                deleteButton.innerText = 'Удалить версию';
                deleteButton.type = 'button';
                if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                    deleteButton.disabled = true;
                }


                clickableArea.appendChild(versionName);
                clickableArea.appendChild(versionStatus);
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(sendButton);
                nirVersionHeader.appendChild(downloadButton);
                nirVersionHeader.appendChild(deleteButton);
                nirVersion.appendChild(nirVersionHeader);

                document.getElementById('student-vkr-otchet-version-div').appendChild(nirVersion);
            }
        }
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
            //console.log(example);

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

    function makeTaskVersion(type) {
        //console.log(type);
        var formData = new FormData();
        formData.append('taskType', type);
        formData.append('studentTheme', studentTheme);
        switch (type) {
            case 'ВКР':
                formData.append('vkrAim', vkrAims);
                formData.append('vkrTasks', vkrTasks);
                formData.append('vkrDocs', vkrDocs);
                axios({
                    url: apiURL + '/student/document/management/task/vkr/create',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload();
                    //console.log(response);
                }).catch(result => {
                    console.log(result);
                });
                break;
            default:
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
                    console.log(result);
                });
        }
    }

    function makeOtchetVersion(file, type) {
        var formData = new FormData();
        formData.append('documentFormType', type);
        formData.append('documentFormKind', 'Отчёт');
        formData.append('documentFormDescription', 'Пример отчёта');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        switch (type) {
            case 'Научно-исследовательская работа':
                formData.append('detailedContent', detailedDescription);
                formData.append('advisorConclusion', conclusion);
                break;
            case 'Практика по получению знаний и умений':
                formData.append('detailedContent', detailedDescriptionLongPP);
                formData.append('advisorConclusion', conclusionLongPP);
                break;
            case 'Преддипломная практика':
                formData.append('detailedContent', detailedDescriptionPP);
                formData.append('advisorConclusion', conclusionPP);
                break;
            case 'ВКР':
                break;
            default:
                console.log('Неопознанный тип отчета')
        }
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
            //console.log(response);
            window.location.reload();
        }).catch(result => {
            console.log(result);
        });
    }

    function uploadDocument(file, type, kind) {
        //console.log(file);
        var formData = new FormData();
        formData.append('documentFormType', type);
        formData.append('documentFormKind', kind);
        formData.append('documentFormDescription', 'Документ');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        formData.append('file', file);
        axios({
            url: apiURL + '/document/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            window.location.reload();
        }).catch(result => {
            console.log(result);
        });
    }

    function uploadDocumentVersion(file, id, description) {
        var formData = new FormData();
        formData.append('documentID', id);
        formData.append('editionDescription', description);
        formData.append('versionFile', file);
        axios({
            url: apiURL + '/document/upload/version',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            window.location.reload();
        }).catch(result => {
            console.log(result);
        });
    }

    $(function () {
        $('.sci-table-checkbox').off().on('click', function(e) {
            e.preventDefault();
        });

        // Показ полей версии
        $(document).off().on('click', '.nir-version-clickable', function (event) {
            $(this).parent().parent().find('.nir-version-content').toggle();
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

        // Создание новой версии задания НИР
        $('#make-nir-task-button').off().on('click', function () {
            makeTaskVersion('Научно-исследовательская работа');
        });

        // Послать версию задания НИР науч руку
        $('.nir-version-send-button').off().on('click', function () {
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

        // Скачать версию задания НИР
        $('.nir-version-download-button').off().on('click', function () {
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

        // Удалить версию задания НИР
        $('.nir-version-delete-button').off().on('click', function () {
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

        // Создать версию отчёта по НИР
        $('#make-nir-otchet-button').off().on('click', function () {
            $('#nir-otchet-file-input').trigger('click');
        });

        // Отправить отчёт НИР науч руку
        $('.nir-otchet-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
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
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать отчёт НИР
        $('.nir-otchet-download-button').off().on('click', function () {
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

        // Удалить отчёт НИР
        $('.nir-otchet-delete-button').off().on('click', function () {
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

        // Создание новой версии задания пп...
        $('#make-long-pp-task-button').off().on('click', function () {
            makeTaskVersion('Практика по получению знаний и умений');
        });

        // Послать версию задания ПП... науч руку
        $('.long-pp-version-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/task/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': longPPData[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });

        // Скачать версию задания ПП...
        $('.long-pp-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: longPPData[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Задание на ПпППУиОПД.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию задания ПП...
        $('.long-pp-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            console.log(arrayID);
            console.log(longPPData[arrayID]);
            axios({
                url: apiURL + '/student/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: longPPData[arrayID].systemVersionID,
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

        // Создать версию отчёта по ПП...
        $('#make-long-pp-otchet-button').off().on('click', function () {
            $('#long-pp-otchet-file-input').trigger('click');
        });

        // Отправить отчёт ПП... науч руку
        $('.long-pp-otchet-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            axios({
                url: apiURL + '/student/document/management/report/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': longPPOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать отчёт ПП...
        $('.long-pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[4];

            axios({
                url: apiURL + '/student/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': longPPOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчёт по ПпППУиОПД.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить отчёт ПП...
        $('.long-pp-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            axios({
                url: apiURL + '/student/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: longPPOtchetVersions[arrayID].systemVersionID,
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

        // Создание новой версии задания ПП
        $('#make-pp-task-button').off().on('click', function () {
            makeTaskVersion('Преддипломная практика');
        });

        // Послать версию задания ПП науч руку
        $('.pp-version-send-button').off().on('click', function () {
            //console.log('sent');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/management/task/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': PPData[arrayID].systemVersionID,
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

        // Скачать версию задания ПП
        $('.pp-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: PPData[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Задание на ПП.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию задания ПП
        $('.pp-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: PPData[arrayID].systemVersionID,
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

        // Создать версию отчёта по ПП
        $('#make-pp-otchet-button').off().on('click', function () {
            $('#pp-otchet-file-input').trigger('click');
        });

        // Отправить отчёт ПП науч руку
        $('.pp-otchet-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/report/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': PPOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать отчёт ПП
        $('.pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/student/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': PPOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчёт по ПП.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить отчёт ПП
        $('.pp-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: PPOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Создание новой версии задания ВКР
        $('#make-vkr-task-button').off().on('click', function () {
            makeTaskVersion('ВКР');
        });

        // Послать версию задания ВКР науч руку
        $('.vkr-version-send-button').off().on('click', function () {
            //console.log('sent');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/management/task/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrTaskVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });

        // Скачать задание ВКР
        $('.vkr-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(vkrTaskVersions[arrayID]);
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: vkrTaskVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Задание на ВКР.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию задания ВКР
        $('.vkr-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/student/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrTaskVersions[arrayID].systemVersionID,
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

        // Создать версию отчёта по ВКР
        $('#make-vkr-otchet-button').off().on('click', function () {
            $('#vkr-otchet-file-input').trigger('click');
        });

        // Отправить отчёт ВКР науч руку
        $('.vkr-otchet-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/report/nir/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать отчёт ВКР
        $('.vkr-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/student/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'ВКР',
                    'reportVersion': vkrOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'РПЗ.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить отчёт ВКР
        $('.vkr-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrOtchetVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Создать версию отзыва научного руководителя
        $('#make-vkr-review-button').off().on('click', function () {
            $('#vkr-review-file-input').trigger('click');
        });

        // Отправить отзыв ВКР науч руку
        $('.vkr-review-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/vkr/stuff/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrReviewVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать отзыв ВКР
        $('.vkr-review-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'versionID': vkrReviewVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отзыв научного руководителя.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить отзыв ВКР
        $('.vkr-review-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrReviewVersions.length > 1) {
                axios({
                    url: apiURL + '/student/document/vkr/stuff/version/delete',
                    method: 'DELETE',
                    params: {
                        versionID: vkrReviewVersions[arrayID].systemVersionID,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
            else {
                axios({
                    url: apiURL + '/document/delete/',
                    method: 'DELETE',
                    params: {
                        documentKind: 'Отзыв',
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
        });

        // Создать версию допуска
        $('#make-vkr-dopusk-button').off().on('click', function () {
            $('#vkr-dopusk-file-input').trigger('click');
        });

        // Отправить допуск ВКР науч руку
        $('.vkr-dopusk-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/vkr/stuff/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrDopuskVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать допуск ВКР
        $('.vkr-dopusk-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'versionID': vkrDopuskVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Допуск к защите.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить допуск ВКР
        $('.vkr-dopusk-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrDopuskVersions.length > 1) {
                axios({
                    url: apiURL + '/student/document/vkr/stuff/version/delete',
                    method: 'DELETE',
                    params: {
                        versionID: vkrDopuskVersions[arrayID].systemVersionID,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
            else {
                axios({
                    url: apiURL + '/document/delete/',
                    method: 'DELETE',
                    params: {
                        'documentKind': 'Допуск',
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
        });

        // Создать версию антиплагиата
        $('#make-vkr-antiplagiat-button').off().on('click', function () {
            $('#vkr-antiplagiat-file-input').trigger('click');
        });

        // Отправить антиплагиат ВКР науч руку
        $('.vkr-antiplagiat-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/vkr/stuff/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrAntiplagiatVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать антиплагиат ВКР
        $('.vkr-antiplagiat-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'versionID': vkrAntiplagiatVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчет о прохождении антиплагиата.docx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить антиплагиат ВКР
        $('.vkr-antiplagiat-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrAntiplagiatVersions.length > 1) {
                axios({
                    url: apiURL + '/student/document/vkr/stuff/version/delete',
                    method: 'DELETE',
                    params: {
                        versionID: vkrAntiplagiatVersions[arrayID].systemVersionID,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
            else {
                axios({
                    url: apiURL + '/document/delete/',
                    method: 'DELETE',
                    params: {
                        'documentKind': 'Антиплагиат',
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
        });

        // Создать версию презентации
        $('#make-vkr-presentation-button').off().on('click', function () {
            $('#vkr-presentation-file-input').trigger('click');
        });

        // Отправить презентацию ВКР науч руку
        $('.vkr-presentation-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/student/document/management/vkr/stuff/send',
                method: 'POST',
                params: {
                    'newStatus': 'Рассматривается',
                    'versionID': vkrPrezentationVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload(true);
            }).catch(result => {
                console.log(result);
            });
        });

        // Скачать презентацию ВКР
        $('.vkr-presentation-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'versionID': vkrPrezentationVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Презентация ВКР.pptx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить презентацию ВКР
        $('.vkr-presentation-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrPrezentationVersions.length > 1) {
                axios({
                    url: apiURL + '/student/document/vkr/stuff/version/delete',
                    method: 'DELETE',
                    params: {
                        versionID: vkrPrezentationVersions[arrayID].systemVersionID,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
            else {
                axios({
                    url: apiURL + '/document/delete/',
                    method: 'DELETE',
                    params: {
                        'documentKind': 'Презентация',
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    window.location.reload(true);
                }).catch(result => {
                    console.log(result);
                });
            }
        });

        // Функция кнопки "перенести в меню" для задания НИР
        $('.nir-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            setStudentTheme(nirVersions[arrayID].theme);
            setToExplore(nirVersions[arrayID].toExplore);
            setToCreate(nirVersions[arrayID].toCreate);
            setToFamiliarize(nirVersions[arrayID].toFamiliarize);
            setAdditionalTask(nirVersions[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ПП...
        $('.long-pp-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];

            setStudentTheme(longPPData[arrayID].theme);
            setToExplore(longPPData[arrayID].toExplore);
            setToCreate(longPPData[arrayID].toCreate);
            setToFamiliarize(longPPData[arrayID].toFamiliarize);
            setAdditionalTask(longPPData[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ПП
        $('.pp-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            setStudentTheme(PPData[arrayID].theme);
            setToExplore(PPData[arrayID].toExplore);
            setToCreate(PPData[arrayID].toCreate);
            setToFamiliarize(PPData[arrayID].toFamiliarize);
            setAdditionalTask(PPData[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ВКР
        $('.vkr-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            setStudentTheme(vkrTaskVersions[arrayID].theme);
            setVkrDocs(vkrTaskVersions[arrayID].vkrDocs);
            setVkrAims(vkrTaskVersions[arrayID].vkrAim);
            setVkrTasks(vkrTaskVersions[arrayID].vkrTasks);
        });

        // Функция кнопки "перенести в меню" для отчета НИР
        $('.nir-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[3];

            setDetailedDescription(nirOtchetVersions[id].detailedContent);
            setConclusion(nirOtchetVersions[id].advisorConclusion);
        });

        // Функция кнопки "перенести в меню" для отчета ПП...
        $('.long-pp-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[4];

            setDetailedDescriptionLongPP(longPPOtchetVersions[id].detailedContent);
            setConclusionLongPP(longPPOtchetVersions[id].advisorConclusion);
        });

        // Функция кнопки "перенести в меню" для отчета ПП
        $('.pp-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[3];

            setDetailedDescriptionPP(PPOtchetVersions[id].detailedContent);
            setConclusionPP(PPOtchetVersions[id].advisorConclusion);
        });

    });

    return (
        <div>

            <div className='sci-advisor-students-form'>
                <div>
                    <Table striped bordered hover style={{ width: '1490px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <thead className='size-24 dark'>
                            <tr>
                                <th>Тема - {themeConfirmed}</th>
                                <th style={{ minWidth: '203px' }}>НИР</th>
                                <th style={{ minWidth: '278px' }}>ПпППУиОПД</th>
                                <th style={{ minWidth: '193px' }}>ПП</th>
                                <th style={{ minWidth: '243px' }}>ВКР</th>
                            </tr>
                        </thead>
                        <tbody id='student-table-body'>

                        </tbody>
                    </Table>
                </div>
            </div>

            <Form className='info-form light-background'>

                <Tabs defaultActiveKey='info1' className='info-form-main-tabs' onSelect={(firstTab) => {
                    $('#image1').attr('src', infoBlock1);
                    $('#image2').attr('src', infoBlock2);
                    $('#image3').attr('src', infoBlock3);
                    $('#image4').attr('src', infoBlock4);
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
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
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

                                            <button type='button' id='make-nir-task-button' className='size-30 light dark-background info-button-1' style={{ height: '100px' }}>
                                                <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                                <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Создать новую версию<br />задания на НИР</p></div>
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
                                            <textarea id='nir-otchet-description' maxLength='1024' value={detailedDescription} onChange={(e) => {
                                                setDetailedDescription(e.target.value);
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

                                    <button type='button' disabled id='make-nir-otchet-button' className='size-30 light dark-background info-button-inline-block' style={{ marginLeft: '425px', marginTop: '20px' }}>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon' />
                                        Сформировать и загрузить версию отчета
                                </button>
                                    <input id='nir-otchet-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        console.log(e.target.files);
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Научно-исследовательская работа');
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

                        <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function () { window.scrollTo(0, 2000); }, 1); }} className='info-form-subtab light-background container-fluid'>
                            <Tab eventKey='info21' title={
                                <p className='size-30 light dark-background info-form-subtab-title'>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Задание на ПпППУиОПД
                            </p>
                            }>
                                <div className='info-sub-tab-div'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на ПпППУиОПД</p>

                                    <div id='student-long-pp-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
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

                                            <button type='button' id='make-long-pp-task-button' className='size-30 light dark-background info-button-1' style={{ height: '100px' }}>
                                                <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                                <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Создать новую версию<br />задания на ПпППУиОПД</p></div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </Tab>
                            <Tab eventKey='info22' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '626px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Отчет о<br />прохождении ПпППУиОПД
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении ПпППУиОПД</p>

                                <div id='student-long-pp-otchet-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className='size-21 dark info-input-label'>Детальное содержание:</Form.Label>
                                            <textarea id='long-pp-otchet-description' maxLength='1024' value={detailedDescriptionLongPP} onChange={(e) => {
                                                setDetailedDescriptionLongPP(e.target.value);
                                                if ($('#long-pp-otchet-description').val() === '' || $('#long-pp-otchet-conclusion').val() === '') {
                                                    document.getElementById('make-long-pp-otchet-button').disabled = true;
                                                }
                                                else {
                                                    document.getElementById('make-long-pp-otchet-button').disabled = false;
                                                }
                                            }} className='dark size-24 info-input-area' />
                                        </div>

                                        <div className='info-column'>
                                            <Form.Label column className='size-21 dark info-input-label'>Заключение научного руководителя:</Form.Label>
                                            <textarea id='long-pp-otchet-conclusion' maxLength='2048' value={conclusionLongPP} onChange={(e) => {
                                                setConclusionLongPP(e.target.value);
                                                if ($('#long-pp-otchet-description').val() === '' || $('#long-pp-otchet-conclusion').val() === '') {
                                                    document.getElementById('make-long-pp-otchet-button').disabled = true;
                                                }
                                                else {
                                                    document.getElementById('make-long-pp-otchet-button').disabled = false;
                                                }
                                            }} className='dark size-24 info-input-area' />
                                        </div>
                                    </div>

                                    <button type='button' disabled id='make-long-pp-otchet-button' className='size-30 light dark-background info-button-inline-block' style={{ marginLeft: '425px', marginTop: '20px' }}>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon' />
                                        Сформировать и загрузить версию отчета
                                </button>
                                    <input id='long-pp-otchet-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        console.log(e.target.files);
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Практика по получению знаний и умений');
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                        </Tabs>
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

                        <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function () { window.scrollTo(0, 2000); }, 1); }} className='info-form-subtab light-background container-fluid'>
                            <Tab eventKey='info31' title={
                                <p className='size-30 light dark-background info-form-subtab-title'>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Задание на ПП
                            </p>
                            }>
                                <div className='info-sub-tab-div'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на ПП</p>

                                    <div id='student-pp-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
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

                                            <button type='button' id='make-pp-task-button' className='size-30 light dark-background info-button-1' style={{ height: '100px' }}>
                                                <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                                <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Создать новую версию<br />задания на ПП</p></div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </Tab>
                            <Tab eventKey='info32' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '880px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Отчет о<br />прохождении ПП
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении ПП</p>

                                <div id='student-pp-otchet-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className='size-21 dark info-input-label'>Детальное содержание:</Form.Label>
                                            <textarea id='pp-otchet-description' maxLength='1024' value={detailedDescriptionPP} onChange={(e) => {
                                                setDetailedDescriptionPP(e.target.value);
                                                if ($('#pp-otchet-description').val() === '' || $('#pp-otchet-conclusion').val() === '') {
                                                    document.getElementById('make-pp-otchet-button').disabled = true;
                                                }
                                                else {
                                                    document.getElementById('make-pp-otchet-button').disabled = false;
                                                }
                                            }} className='dark size-24 info-input-area' />
                                        </div>

                                        <div className='info-column'>
                                            <Form.Label column className='size-21 dark info-input-label'>Заключение научного руководителя:</Form.Label>
                                            <textarea id='pp-otchet-conclusion' maxLength='2048' value={conclusionPP} onChange={(e) => {
                                                setConclusionPP(e.target.value);
                                                if ($('#pp-otchet-description').val() === '' || $('#pp-otchet-conclusion').val() === '') {
                                                    document.getElementById('make-pp-otchet-button').disabled = true;
                                                }
                                                else {
                                                    document.getElementById('make-pp-otchet-button').disabled = false;
                                                }
                                            }} className='dark size-24 info-input-area' />
                                        </div>
                                    </div>

                                    <button type='button' disabled id='make-pp-otchet-button' className='size-30 light dark-background info-button-inline-block' style={{ marginLeft: '425px', marginTop: '20px' }}>
                                        <Image src={iconProject} thumbnail className='dark-background thumbnail-icon' />
                                        Сформировать и загрузить версию отчета
                                </button>
                                    <input id='pp-otchet-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        console.log(e.target.files);
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Преддипломная практика');
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                        </Tabs>
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

                        <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function () { window.scrollTo(0, 2000); }, 1); }} className='info-form-subtab light-background container-fluid'>
                            <Tab eventKey='info41' title={
                                <p className='size-30 light dark-background info-form-subtab-title'>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Отзыв научного<br />руководителя
                            </p>
                            }>
                                <div className='info-sub-tab-div'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Отзыв научного руководителя</p>

                                    <div id='student-vkr-review-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-sub-tab-div'>

                                        <button type='button' id='make-vkr-review-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                            <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                            <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отзыва научного руководителя</p></div>
                                        </button>
                                        <input id='vkr-review-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                            if (e.target.files.length !== 0) {
                                                if (vkrReviewVersions.length == 0) {
                                                    uploadDocument(e.target.files[0], 'ВКР', 'Отзыв');
                                                }
                                                else {
                                                    uploadDocumentVersion(e.target.files[0], vkrReviewVersions[0].systemDocumentID, 'Отзыв версия')
                                                    //uploadDocument(e.target.files[0], 'ВКР', 'Отзыв');
                                                }

                                            }
                                        }} ></input>

                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey='info42' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Допуск к<br />защите
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Допуск к защите</p>

                                <div id='student-vkr-dopusk-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <button type='button' id='make-vkr-dopusk-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />допуска к защите ВКР</p></div>
                                    </button>
                                    <input id='vkr-dopusk-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrDopuskVersions.length == 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Допуск');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrDopuskVersions[0].systemDocumentID, 'Допуск версия')
                                                //uploadDocument(e.target.files[0], 'ВКР', 'Отзыв');
                                            }

                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                            <Tab eventKey='info43' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Задание<br />на ВКР
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Задание на ВКР</p>

                                <div id='student-vkr-task-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
                                            <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area' />

                                            <Form.Label column className="size-21 dark info-input-label">Цель:</Form.Label>
                                            <textarea maxLength='2048' value={vkrAims} onChange={(e) => { setVkrAims(e.target.value); }} className='dark size-24 info-input-area' />

                                        </div>

                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Задачи:</Form.Label>
                                            <textarea maxLength='2048' value={vkrTasks} onChange={(e) => { setVkrTasks(e.target.value); }} className='dark size-24 info-input-area' />

                                            <Form.Label column className="size-21 dark info-input-label">Разрабатываемые документы:</Form.Label>
                                            <textarea maxLength='2048' value={vkrDocs} onChange={(e) => { setVkrDocs(e.target.value); }} className='dark size-24 info-input-area' />

                                        </div>
                                    </div>

                                    <button type='button' id='make-vkr-task-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Создать новую версию<br />задания на ВКР</p></div>
                                    </button>

                                </div>
                            </Tab>
                            <Tab eventKey='info44' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                РПЗ
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>РПЗ</p>

                                <div id='student-vkr-otchet-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <button type='button' id='make-vkr-otchet-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '480px', marginLeft: '505px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить<br />новую версию РПЗ</p></div>
                                    </button>
                                    <input id='vkr-otchet-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'ВКР');
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                            <Tab eventKey='info45' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Проверка на<br />антиплагиат
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Проверка на антиплагиат</p>

                                <div id='student-vkr-antiplagiat-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <button type='button' id='make-vkr-antiplagiat-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отчета об антиплагиате</p></div>
                                    </button>
                                    <input id='vkr-antiplagiat-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrAntiplagiatVersions.length == 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Антиплагиат');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrAntiplagiatVersions[0].systemDocumentID, 'Антиплагиат версия')
                                            }
                                            //uploadDocument(e.target.files[0], 'ВКР', 'Антиплагиат');
                                        }

                                    }} ></input>
                                </div>
                            </Tab>
                            <Tab eventKey='info46' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Презентация<br />к защите
                            </p>
                            }>
                                <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                <p className='size-30 dark info-sub-tab-title'>Презентация к защите</p>

                                <div id='student-vkr-presentation-version-div' className='student-nir-task-version-div light-background'></div>

                                <div className='info-sub-tab-div'>

                                    <button type='button' id='make-vkr-presentation-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />презентации</p></div>
                                    </button>
                                    <input id='vkr-presentation-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrPrezentationVersions.length == 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Презентация');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrPrezentationVersions[0].systemDocumentID, 'Презентация версия')
                                            }
                                            //uploadDocument(e.target.files[0], 'ВКР', 'Презентация');
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                </Tabs>

            </Form>
        </div>
    );
}