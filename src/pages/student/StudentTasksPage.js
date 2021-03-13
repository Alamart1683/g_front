import React, { useState, useEffect } from 'react';
import { Form, Tabs, Tab, Image, Accordion, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import { Modal } from 'react-bootstrap';

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

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Неопределенная ошибка');

    // Образцы
    const [examples, setExamples] = useState([]);

    const [studentTheme, setStudentTheme] = useState('');
    const [toExplore, setToExplore] = useState('');
    const [toCreate, setToCreate] = useState('');
    const [toFamiliarize, setToFamiliarize] = useState('');
    const [additionalTask, setAdditionalTask] = useState('');

    const [vkrDocs, setVkrDocs] = useState('');
    const [vkrAims, setVkrAims] = useState('');
    const [vkrTasks, setVkrTasks] = useState('');

    // Задание на НИР
    const [nirVersions, setNirVersions] = useState([]);

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

    function getStudentData() {
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
        // Заполнить поля "Тема"
        setStudentTheme(item.studentVkrTheme);
        if (item.studentVkrThemeEditable) {
            setThemeConfirmed('Не одобрена');
        }
        else {
            $.each($('.theme-area'), function (index, item) {
                $(item).attr('disabled', true);
            });
            setThemeConfirmed('Одобрена');
        }
        studentTheme.style.overflow = 'hidden';
        studentTheme.style.textOverflow = 'ellipsis';
        studentTheme.style.maxWidth = '300px';

        // НИР
        var studentNir = document.createElement('th');

        var nirTaskStatus = document.createElement('label');
        nirTaskStatus.innerText = 'Задание на НИР:';
        nirTaskStatus.style.width = '148px';

        var nirTaskCheckbox = document.createElement('input');

        nirTaskCheckbox.type = 'checkbox';
        nirTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.nirTaskStatus) {
            nirTaskCheckbox.checked = true;
        }
        nirTaskCheckbox.style.marginLeft = '22px';

        var nirTaskDiv = document.createElement('div');

        var nirReportStatus = document.createElement('label');
        nirReportStatus.innerText = 'Отчет по НИР:';
        nirReportStatus.style.width = '148px';

        var nirReportMark = document.createElement('p');
        nirReportMark.innerText = getStatus(item.studentDocumentsStatusView.nirReportStatus);
        nirReportMark.className = 'table-report-mark-text';

        var nirReportDiv = document.createElement('div');

        // ППП...
        var studentLongPP = document.createElement('th');

        var longPPTaskStatus = document.createElement('label');
        longPPTaskStatus.innerText = 'Задание по ПпППУиОПД:';
        longPPTaskStatus.style.width = '223px';

        var longPPTaskCheckbox = document.createElement('input');

        longPPTaskCheckbox.type = 'checkbox';
        longPPTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppppuipdTaskStatus) {
            longPPTaskCheckbox.checked = true;
        }
        longPPTaskCheckbox.style.marginLeft = '22px';

        var longPPTaskDiv = document.createElement('div');

        var longPPReportStatus = document.createElement('label');
        longPPReportStatus.innerText = 'Отчет по ПпППУиОПД:';
        longPPReportStatus.style.width = '223px';

        var longPPReportMark = document.createElement('p');
        longPPReportMark.innerText = getStatus(item.studentDocumentsStatusView.ppppuipdReportStatus);
        longPPReportMark.className = 'table-report-mark-text';

        var longPPReportDiv = document.createElement('div');

        // ПП
        var studentPP = document.createElement('th');

        var ppTaskStatus = document.createElement('label');
        ppTaskStatus.innerText = 'Задание по ПП:';
        ppTaskStatus.style.width = '138px';

        var ppTaskCheckbox = document.createElement('input');

        ppTaskCheckbox.type = 'checkbox';
        ppTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.ppTaskStatus) {
            ppTaskCheckbox.checked = true;
        }
        ppTaskCheckbox.style.marginLeft = '22px';

        var ppTaskDiv = document.createElement('div');

        var ppReportStatus = document.createElement('label');
        ppReportStatus.innerText = 'Отчет по ПП:';
        ppReportStatus.style.width = '138px';

        var ppReportMark = document.createElement('p');
        ppReportMark.innerText = getStatus(item.studentDocumentsStatusView.ppReportStatus);
        ppReportMark.className = 'table-report-mark-text';

        var ppReportDiv = document.createElement('div');

        // ВКР
        var studentVkr = document.createElement('th');

        var vkrAdvisorFeedbackStatus = document.createElement('label');
        vkrAdvisorFeedbackStatus.innerText = 'Отзыв руководителя:';
        vkrAdvisorFeedbackStatus.style.width = '188px';

        var vkrAdvisorFeedbackCheckbox = document.createElement('input');

        vkrAdvisorFeedbackCheckbox.type = 'checkbox';
        vkrAdvisorFeedbackCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAdvisorFeedback) {
            vkrAdvisorFeedbackCheckbox.checked = true;
        }
        vkrAdvisorFeedbackCheckbox.style.marginLeft = '22px';


        var vkrAdvisorFeedbackDiv = document.createElement('div');

        var vkrAllowanceStatus = document.createElement('label');
        vkrAllowanceStatus.innerText = 'Допуск к ВКР:';
        vkrAllowanceStatus.style.width = '188px';

        var vkrAllowanceCheckbox = document.createElement('input');

        vkrAllowanceCheckbox.type = 'checkbox';
        vkrAllowanceCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAllowance) {
            vkrAllowanceCheckbox.checked = true;
        }
        vkrAllowanceCheckbox.style.marginLeft = '22px';

        var vkrAllowanceStatusDiv = document.createElement('div');

        var vkrTaskStatus = document.createElement('label');
        vkrTaskStatus.innerText = 'Задание ВКР:';
        vkrTaskStatus.style.width = '188px';

        var vkrTaskCheckbox = document.createElement('input');

        vkrTaskCheckbox.type = 'checkbox';
        vkrTaskCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrTask) {
            vkrTaskCheckbox.checked = true;
        }
        vkrTaskCheckbox.style.marginLeft = '22px';

        var vkrTaskDiv = document.createElement('div');

        var vkrRPZStatus = document.createElement('label');
        vkrRPZStatus.innerText = 'РПЗ:';
        vkrRPZStatus.style.width = '188px';

        var vkrRPZMark = document.createElement('p');
        vkrRPZMark.innerText = getStatus(item.studentDocumentsStatusView.vkrRPZ);
        vkrRPZMark.className = 'table-report-mark-text';

        var vkrRPZDiv = document.createElement('div');

        var vkrAntiplagiatCheckbox = document.createElement('input');

        var vkrAntiplagiatStatus = document.createElement('label');
        vkrAntiplagiatStatus.innerText = 'Антиплагиат:';
        vkrAntiplagiatStatus.style.width = '188px';

        vkrAntiplagiatCheckbox.type = 'checkbox';
        vkrAntiplagiatCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrAntiplagiat) {
            vkrAntiplagiatCheckbox.checked = true;
        }
        vkrAntiplagiatCheckbox.style.marginLeft = '22px';

        var vkrAntiplagiatDiv = document.createElement('div');

        var vkrPresentationCheckbox = document.createElement('input');

        var vkrPresentationStatus = document.createElement('label');
        vkrPresentationStatus.innerText = 'Презентация:';
        vkrPresentationStatus.style.width = '188px';

        vkrPresentationCheckbox.type = 'checkbox';
        vkrPresentationCheckbox.className = 'sci-table-checkbox';
        if (item.studentDocumentsStatusView.vkrPresentation) {
            vkrPresentationCheckbox.checked = true;
        }
        vkrPresentationCheckbox.style.marginLeft = '22px';

        var vkrPresentationDiv = document.createElement('div');

        student.appendChild(studentTheme);

        nirTaskDiv.appendChild(nirTaskStatus);
        nirTaskDiv.appendChild(nirTaskCheckbox);
        studentNir.appendChild(nirTaskDiv);

        nirReportDiv.appendChild(nirReportStatus);
        nirReportDiv.appendChild(nirReportMark);
        studentNir.appendChild(nirReportDiv);

        student.appendChild(studentNir);

        longPPTaskDiv.appendChild(longPPTaskStatus);
        longPPTaskDiv.appendChild(longPPTaskCheckbox);
        studentLongPP.appendChild(longPPTaskDiv);

        longPPReportDiv.appendChild(longPPReportStatus);
        longPPReportDiv.appendChild(longPPReportMark);
        studentLongPP.appendChild(longPPReportDiv);

        student.appendChild(studentLongPP);

        ppTaskDiv.appendChild(ppTaskStatus);
        ppTaskDiv.appendChild(ppTaskCheckbox);
        studentPP.appendChild(ppTaskDiv);

        ppReportDiv.appendChild(ppReportStatus);
        ppReportDiv.appendChild(ppReportMark);
        studentPP.appendChild(ppReportDiv);

        student.appendChild(studentPP);

        vkrTaskDiv.appendChild(vkrTaskStatus);
        vkrTaskDiv.appendChild(vkrTaskCheckbox);
        studentVkr.appendChild(vkrTaskDiv);

        vkrRPZDiv.appendChild(vkrRPZStatus);
        vkrRPZDiv.appendChild(vkrRPZMark);
        studentVkr.appendChild(vkrRPZDiv);

        vkrAdvisorFeedbackDiv.appendChild(vkrAdvisorFeedbackStatus);
        vkrAdvisorFeedbackDiv.appendChild(vkrAdvisorFeedbackCheckbox);
        studentVkr.appendChild(vkrAdvisorFeedbackDiv);

        vkrAllowanceStatusDiv.appendChild(vkrAllowanceStatus);
        vkrAllowanceStatusDiv.appendChild(vkrAllowanceCheckbox);
        studentVkr.appendChild(vkrAllowanceStatusDiv);

        vkrAntiplagiatDiv.appendChild(vkrAntiplagiatStatus);
        vkrAntiplagiatDiv.appendChild(vkrAntiplagiatCheckbox);
        studentVkr.appendChild(vkrAntiplagiatDiv);

        vkrPresentationDiv.appendChild(vkrPresentationStatus);
        vkrPresentationDiv.appendChild(vkrPresentationCheckbox);
        studentVkr.appendChild(vkrPresentationDiv);

        student.appendChild(studentVkr);

        document.getElementById('student-table-body').appendChild(student);

    }

    function getStatus(status) {
        switch (status) {
            case 0:
                return '     -';
            case 2:
                return '  НЕУД.';
            case 3:
                return 'УДОВЛ.';
            case 4:
                return '  ХОР.';
            case 5:
                return '  ОТЛ.';
            default:
                return '???';
        }
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
                    setNirVersions(response.data);
                    showNirVersions(response.data);
                    break;
                case 'Практика по получению знаний и умений':
                    setLongPPData(response.data);
                    showLongPPVersions(response.data);
                    break;
                case 'Преддипломная практика':
                    setPPData(response.data);
                    showPPVersions(response.data);
                    break;
                case 'ВКР':
                    setVkrTaskVersions(response.data);
                    showVkrTaskVersions(response.data);
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
                    setNirOtchetVersions(response.data);
                    showNirOtchetVersions(response.data);
                    break;
                case 'Практика по получению знаний и умений':
                    setLongPPOtchetVersions(response.data);
                    showLongPPOtchetVersions(response.data);
                    break;
                case 'Преддипломная практика':
                    setPPOtchetVersions(response.data);
                    showPPOtchetVersions(response.data);
                    break;
                case 'ВКР':
                    setVkrOtchetVersions(response.data);
                    showVkrOtchetVersions(response.data);
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
                case 'Отзыв':
                    setVkrReviewVersions(response.data);
                    showReviewVersions(response.data);
                    break;
                case 'Допуск':
                    setVkrDopuskVersions(response.data);
                    showDopuskVersions(response.data);
                    break;
                case 'Антиплагиат':
                    setAntiplagiatVersions(response.data);
                    showAntiplagiatVersions(response.data);
                    break;
                case 'Презентация':
                    setPrezentationVersions(response.data);
                    showPresentationVersions(response.data);
                    break;
                default:
                    console.log(response);
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showDopuskVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showDopuskVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showDopuskVersionSingle(item, i) {
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrDopusk-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
        nirVersionHeader.appendChild(sendButton);
        nirVersionHeader.appendChild(downloadButton);
        nirVersionHeader.appendChild(deleteButton);
        nirVersion.appendChild(nirVersionHeader);

        document.getElementById('student-vkr-dopusk-version-div').appendChild(nirVersion);
    }

    function showReviewVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showReviewVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showReviewVersionSingle(item, i) {
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrReview-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';


        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
        nirVersionHeader.appendChild(sendButton);
        nirVersionHeader.appendChild(downloadButton);
        nirVersionHeader.appendChild(deleteButton);
        nirVersion.appendChild(nirVersionHeader);

        document.getElementById('student-vkr-review-version-div').appendChild(nirVersion);
    }

    function showAntiplagiatVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showAntiplagiatVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showAntiplagiatVersionSingle(item, i) {
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrAntiplagiat-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
        nirVersionHeader.appendChild(sendButton);
        nirVersionHeader.appendChild(downloadButton);
        nirVersionHeader.appendChild(deleteButton);
        nirVersion.appendChild(nirVersionHeader);

        document.getElementById('student-vkr-antiplagiat-version-div').appendChild(nirVersion);
    }

    function showPresentationVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showPresentationVersionsSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showPresentationVersionsSingle(item, i) {
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrPresentation-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
        nirVersionHeader.appendChild(sendButton);
        nirVersionHeader.appendChild(downloadButton);
        nirVersionHeader.appendChild(deleteButton);
        nirVersion.appendChild(nirVersionHeader);

        document.getElementById('student-vkr-presentation-version-div').appendChild(nirVersion);
    }

    // Вывод версий задания нир
    function showNirVersions(nirVersionArray) {
        for (var i = 0; i < nirVersionArray.length; i++) {
            showNirVersionSingle(nirVersionArray[i], i);
        }
    }

    function showNirVersionSingle(item, i) {
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
        themeLabel.innerText = 'Тема:';

        // Тема нир
        var themeArea = document.createElement('textarea');
        themeArea.className = 'dark size-24 nir-text-area'
        themeArea.disabled = true;
        themeArea.value = item.theme;

        var exploreLabel = document.createElement('p');
        exploreLabel.className = 'dark size-21 nir-text-label';
        exploreLabel.innerText = 'Изучить:';

        // Изучить
        var exploreArea = document.createElement('textarea');
        exploreArea.className = 'dark size-24 nir-text-area'
        exploreArea.disabled = true;
        exploreArea.value = item.toExplore;

        var createLabel = document.createElement('p');
        createLabel.className = 'dark size-21 nir-text-label';
        createLabel.innerText = 'Выполнить:';

        // Выполнить
        var createArea = document.createElement('textarea');
        createArea.className = 'dark size-24 nir-text-area'
        createArea.disabled = true;
        createArea.value = item.toCreate;

        var familiarizeLabel = document.createElement('p');
        familiarizeLabel.className = 'dark size-21 nir-text-label2';
        familiarizeLabel.innerText = 'Ознакомиться:';

        // Ознакомиться
        var familiarizeArea = document.createElement('textarea');
        familiarizeArea.className = 'dark size-24 nir-text-area2'
        familiarizeArea.disabled = true;
        familiarizeArea.value = item.toFamiliarize;

        var taskLabel = document.createElement('p');
        taskLabel.className = 'dark size-21 nir-text-label2';
        taskLabel.innerText = 'Дополнительное задание:';

        // Доп задание
        var taskArea = document.createElement('textarea');
        taskArea.className = 'dark size-24 nir-text-area2'
        taskArea.disabled = true;
        taskArea.value = item.additionalTask;

        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button nir-copy';
        copyButton.innerText = 'Перенести значения в поля ниже';
        copyButton.type = 'button';

        var rowDiv = document.createElement('div');
        rowDiv.className = 'info-row';
        var columnDiv1 = document.createElement('div');
        columnDiv1.className = 'info-column';
        var columnDiv2 = document.createElement('div');
        columnDiv2.className = 'info-column';

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'nirTask-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);

        nirVersionHeader.appendChild(viewButton);

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

    // Вывод версий задания ПП...
    function showLongPPVersions(longPPVersionArray) {
        for (var i = 0; i < longPPVersionArray.length; i++) {
            showLongPPVersionSingle(longPPVersionArray[i], i);
        }
    }

    function showLongPPVersionSingle(item, i) {
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
        themeArea.className = 'dark size-24 nir-text-area'
        themeArea.disabled = true;
        themeArea.value = item.theme;

        var exploreLabel = document.createElement('p');
        exploreLabel.className = 'dark size-21 nir-text-label';
        exploreLabel.innerText = 'Изучить:';

        // Изучить
        var exploreArea = document.createElement('textarea');
        exploreArea.className = 'dark size-24 nir-text-area'
        exploreArea.disabled = true;
        exploreArea.value = item.toExplore;

        var createLabel = document.createElement('p');
        createLabel.className = 'dark size-21 nir-text-label';
        createLabel.innerText = 'Выполнить:';

        // Выполнить
        var createArea = document.createElement('textarea');
        createArea.className = 'dark size-24 nir-text-area'
        createArea.disabled = true;
        createArea.value = item.toCreate;

        var familiarizeLabel = document.createElement('p');
        familiarizeLabel.className = 'dark size-21 nir-text-label2';
        familiarizeLabel.innerText = 'Ознакомиться:';

        // Ознакомиться
        var familiarizeArea = document.createElement('textarea');
        familiarizeArea.className = 'dark size-24 nir-text-area2'
        familiarizeArea.disabled = true;
        familiarizeArea.value = item.toFamiliarize;

        var taskLabel = document.createElement('p');
        taskLabel.className = 'dark size-21 nir-text-label2';
        taskLabel.innerText = 'Дополнительное задание:';

        // Доп задание
        var taskArea = document.createElement('textarea');
        taskArea.className = 'dark size-24 nir-text-area2'
        taskArea.disabled = true;
        taskArea.value = item.additionalTask;

        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button long-pp-copy';
        copyButton.innerText = 'Перенести значения в поля ниже';
        copyButton.type = 'button';

        var rowDiv = document.createElement('div');
        rowDiv.className = 'info-row';
        var columnDiv1 = document.createElement('div');
        columnDiv1.className = 'info-column';
        var columnDiv2 = document.createElement('div');
        columnDiv2.className = 'info-column';

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'longPPTask-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        longPPVersionHeader.appendChild(clickableArea);
        longPPVersionHeader.appendChild(viewButton);
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

    // Вывод версий задания ПП
    function showPPVersions(longPPVersionArray) {
        for (var i = 0; i < longPPVersionArray.length; i++) {
            showPPVersionSingle(longPPVersionArray[i], i);
        }
    }

    function showPPVersionSingle(item, i) {
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
        themeArea.className = 'dark size-24 nir-text-area'
        themeArea.disabled = true;
        themeArea.value = item.theme;

        var exploreLabel = document.createElement('p');
        exploreLabel.className = 'dark size-21 nir-text-label';
        exploreLabel.innerText = 'Изучить:';

        // Изучить
        var exploreArea = document.createElement('textarea');
        exploreArea.className = 'dark size-24 nir-text-area'
        exploreArea.disabled = true;
        exploreArea.value = item.toExplore;

        var createLabel = document.createElement('p');
        createLabel.className = 'dark size-21 nir-text-label';
        createLabel.innerText = 'Выполнить:';

        // Выполнить
        var createArea = document.createElement('textarea');
        createArea.className = 'dark size-24 nir-text-area'
        createArea.disabled = true;
        createArea.value = item.toCreate;

        var familiarizeLabel = document.createElement('p');
        familiarizeLabel.className = 'dark size-21 nir-text-label2';
        familiarizeLabel.innerText = 'Ознакомиться:';

        // Ознакомиться
        var familiarizeArea = document.createElement('textarea');
        familiarizeArea.className = 'dark size-24 nir-text-area2'
        familiarizeArea.disabled = true;
        familiarizeArea.value = item.toFamiliarize;

        var taskLabel = document.createElement('p');
        taskLabel.className = 'dark size-21 nir-text-label2';
        taskLabel.innerText = 'Дополнительное задание:';

        // Доп задание
        var taskArea = document.createElement('textarea');
        taskArea.className = 'dark size-24 nir-text-area2'
        taskArea.disabled = true;
        taskArea.value = item.additionalTask;

        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button pp-copy';
        copyButton.innerText = 'Перенести значения в поля ниже';
        copyButton.type = 'button';

        var rowDiv = document.createElement('div');
        rowDiv.className = 'info-row';
        var columnDiv1 = document.createElement('div');
        columnDiv1.className = 'info-column';
        var columnDiv2 = document.createElement('div');
        columnDiv2.className = 'info-column';

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'ppTask-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        longPPVersionHeader.appendChild(clickableArea);
        longPPVersionHeader.appendChild(viewButton);
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

    // Вывод версий задания ВКР
    function showVkrTaskVersions(vkrTaskVersionArray) {
        for (var i = 0; i < vkrTaskVersionArray.length; i++) {
            showVkrTaskVersionSingle(vkrTaskVersionArray[i], i)
        }
    }

    function showVkrTaskVersionSingle(item, i) {
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
        themeArea.className = 'dark size-24 nir-text-area'
        themeArea.disabled = true;
        themeArea.value = item.theme;

        var aimLabel = document.createElement('p');
        aimLabel.className = 'dark size-21 nir-text-label';
        aimLabel.innerText = 'Цель:';

        // Цель
        var aimArea = document.createElement('textarea');
        aimArea.className = 'dark size-24 nir-text-area'
        aimArea.disabled = true;
        aimArea.value = item.vkrAim;

        var tasksLabel = document.createElement('p');
        tasksLabel.className = 'dark size-21 nir-text-label';
        tasksLabel.innerText = 'Задачи:';

        // Задачи
        var tasksArea = document.createElement('textarea');
        tasksArea.className = 'dark size-24 nir-text-area'
        tasksArea.disabled = true;
        tasksArea.value = item.vkrTasks;

        var docsLabel = document.createElement('p');
        docsLabel.className = 'dark size-21 nir-text-label2';
        docsLabel.innerText = 'Разрабатываемые документы:';

        // Ознакомиться
        var docsArea = document.createElement('textarea');
        docsArea.className = 'dark size-24 nir-text-area2'
        docsArea.disabled = true;
        docsArea.value = item.vkrDocs;

        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button vkr-copy';
        copyButton.innerText = 'Перенести значения в поля ниже';
        copyButton.type = 'button';
        copyButton.style.marginLeft = '500px';

        var rowDiv = document.createElement('div');
        rowDiv.className = 'info-row';
        var columnDiv1 = document.createElement('div');
        columnDiv1.className = 'info-column';
        var columnDiv2 = document.createElement('div');
        columnDiv2.className = 'info-column';

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrTask-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';


        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
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

    // Вывод на экран версий отчетов НИР
    function showNirOtchetVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showNirOtchetVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showNirOtchetVersionSingle(item, i) {
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
        detailedArea.className = 'dark size-24 nir-text-area'
        detailedArea.disabled = true;
        detailedArea.value = item.detailedContent;

        var conclusionLabel = document.createElement('p');
        conclusionLabel.className = 'dark size-21 nir-text-label';
        conclusionLabel.innerText = 'Заключение научного руководителя:';

        // Заключение
        var conclusionArea = document.createElement('textarea');
        conclusionArea.className = 'dark size-24 nir-text-area'
        conclusionArea.disabled = true;
        conclusionArea.value = item.advisorConclusion;

        // Кнопка перенести в меню
        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button nir-otchet-copy';
        copyButton.id = 'nir-otchet-copy-' + i;
        copyButton.innerText = 'Перенести значения в поля ниже';
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'nirOtchet-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
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

    // Вывод на экран версий отчетов ПП...
    function showLongPPOtchetVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showLongPPOtchetVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showLongPPOtchetVersionSingle(item, i) {
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
        detailedArea.className = 'dark size-24 nir-text-area'
        detailedArea.disabled = true;
        detailedArea.value = item.detailedContent;

        var conclusionLabel = document.createElement('p');
        conclusionLabel.className = 'dark size-21 nir-text-label';
        conclusionLabel.innerText = 'Заключение научного руководителя:';

        // Заключение
        var conclusionArea = document.createElement('textarea');
        conclusionArea.className = 'dark size-24 nir-text-area'
        conclusionArea.disabled = true;
        conclusionArea.value = item.advisorConclusion;

        // Кнопка перенести в меню
        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button long-pp-otchet-copy';
        copyButton.id = 'long-pp-otchet-copy-' + i;
        copyButton.innerText = 'Перенести значения в поля ниже';
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'longPPOtchet-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
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

    // Вывод на экран версий отчетов ПП
    function showPPOtchetVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showPPOtchetVersionSingle(nirOtchetVersionArray[i], i);
        }
    }

    function showPPOtchetVersionSingle(item, i) {
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
        detailedArea.className = 'dark size-24 nir-text-area'
        detailedArea.disabled = true;
        detailedArea.value = item.detailedContent;

        var conclusionLabel = document.createElement('p');
        conclusionLabel.className = 'dark size-21 nir-text-label';
        conclusionLabel.innerText = 'Заключение научного руководителя:';

        // Заключение
        var conclusionArea = document.createElement('textarea');
        conclusionArea.className = 'dark size-24 nir-text-area'
        conclusionArea.disabled = true;
        conclusionArea.value = item.advisorConclusion;

        // Кнопка перенести в меню
        var copyButton = document.createElement('button');
        copyButton.className = 'light dark-background size-21 nir-copy-button pp-otchet-copy';
        copyButton.id = 'pp-otchet-copy-' + i;
        copyButton.innerText = 'Перенести значения в поля ниже';
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'ppOtchet-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
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

    // Вывод на экран версий отчетов НИР
    function showVkrOtchetVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            showVkrOtchetVersionSingle(nirOtchetVersionArray[i], i)
        }
    }

    function showVkrOtchetVersionSingle(item, i) {
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

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'dark size-24 nir-version-header-button version-view-button';
        viewButton.id = 'vkrOtchet-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';

        clickableArea.appendChild(versionName);
        clickableArea.appendChild(versionStatus);
        nirVersionHeader.appendChild(clickableArea);
        nirVersionHeader.appendChild(viewButton);
        nirVersionHeader.appendChild(sendButton);
        nirVersionHeader.appendChild(downloadButton);
        nirVersionHeader.appendChild(deleteButton);
        nirVersion.appendChild(nirVersionHeader);

        document.getElementById('student-vkr-otchet-version-div').appendChild(nirVersion);
    }

    function getExamples() {
        axios({
            url: apiURL + '/document/view/templates/student',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setExamples(response.data);
            showExamples(response.data);
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
            titleDiv.style.width = '840px';

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

            // Кнопка просмотреть
            var viewButton = document.createElement('button');
            viewButton.className = 'student-example-download light size-24 version-view-button';
            viewButton.id = 'example-view-' + i;
            viewButton.innerText = 'Просмотреть';
            viewButton.type = 'button';

            titleDiv.appendChild(exampleImage);
            titleDiv.appendChild(exampleName);
            exampleDiv.appendChild(titleDiv);
            exampleDiv.appendChild(viewButton);
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
        document.getElementById('make-nir-task-button').disabled = true;
        document.getElementById('make-long-pp-task-button').disabled = true;
        document.getElementById('make-long-pp-task-button').disabled = true;
        document.getElementById('make-vkr-task-button').disabled = true;
        var taskVersion = {};
        taskVersion['editorName'] = authTokens.fio;
        taskVersion['status'] = 'Не отправлено';
        if (studentTheme === '') {
            taskVersion['theme'] = 'Тема не указана';
        }
        else {
            taskVersion['theme'] = studentTheme;
        }
        if (toCreate === '') {
            taskVersion['toCreate'] = 'Создать';
        }
        else {
            taskVersion['toCreate'] = toCreate;
        }
        if (toExplore === '') {
            taskVersion['toExplore'] = 'Изучить';
        }
        else {
            taskVersion['toExplore'] = toExplore;
        }
        if (toFamiliarize === '') {
            taskVersion['toFamiliarize'] = 'Ознакомиться';
        }
        else {
            taskVersion['toFamiliarize'] = toFamiliarize;
        }
        if (additionalTask === '') {
            taskVersion['additionalTask'] = 'Дополнительное задание';
        }
        else {
            taskVersion['additionalTask'] = additionalTask;
        }
        if (vkrAims === '') {
            taskVersion['vkrAim'] = 'Цель'
        }
        else {
            taskVersion['vkrAim'] = vkrAims
        }
        if (vkrDocs === '') {
            taskVersion['vkrDocs'] = '– Документы и графические материалы'
        }
        else {
            taskVersion['vkrDocs'] = vkrDocs
        }
        if (vkrTasks === '') {
            taskVersion['vkrTasks'] = 'Задачи'
        }
        else {
            taskVersion['vkrTasks'] = vkrTasks
        }
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
                    if (response.data.indexOf('Приказ еще не был загружен') > -1) {
                        setErrorMessage('Ошибка при создании версии задания: приказ ещё не был загружен!');
                        setShowError(true);
                    }
                    else {
                        taskVersion['systemVersionID'] = response.data.split(',')[0]
                        taskVersion['versionEditionDate'] = response.data.split(',')[1]
                        showVkrTaskVersionSingle(taskVersion, vkrTaskVersions.length);
                        if (vkrTaskVersions.length > 0) {
                            setVkrTaskVersions(vkrTaskVersions.concat(taskVersion));
                        }
                        else {
                            setVkrTaskVersions([...vkrTaskVersions, taskVersion]);
                        }
                    }
                    document.getElementById('make-nir-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-vkr-task-button').disabled = false;

                    //console.log(response);
                }).catch(result => {
                    document.getElementById('make-nir-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-vkr-task-button').disabled = false;

                    console.log(result);
                    setErrorMessage('Ошибка при создании версии задания!');
                    setShowError(true);
                });
                break;
            default:
                formData.append('toExplore', toExplore);
                formData.append('toCreate', toCreate);
                formData.append('toFamiliarize', toFamiliarize);
                formData.append('additionalTask', additionalTask);
                return axios({
                    url: apiURL + '/student/document/management/task/nir/create',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    //console.log(response);
                    if (response.data.indexOf('Приказ еще не был загружен') > -1) {
                        setErrorMessage('Ошибка при создании версии задания: приказ ещё не был загружен!');
                        setShowError(true);
                    }
                    else if (response.data.indexOf('Шаблон задания еще не был загружен') > -1) {
                        setErrorMessage('Шаблон задания еще не был загружен!');
                        setShowError(true);
                    }
                    else {
                        taskVersion['systemVersionID'] = response.data.split(',')[0]
                        taskVersion['versionEditionDate'] = response.data.split(',')[1]
                        switch (type) {
                            case 'Научно-исследовательская работа':
                                showNirVersionSingle(taskVersion, nirVersions.length);
                                if (nirVersions.length > 0) {
                                    setNirVersions(nirVersions.concat(taskVersion));
                                }
                                else {
                                    setNirVersions([...nirVersions, taskVersion]);
                                }
                                break;
                            case 'Практика по получению знаний и умений':
                                showLongPPVersionSingle(taskVersion, longPPData.length);
                                if (longPPData.length > 0) {
                                    setLongPPData(longPPData.concat(taskVersion));
                                }
                                else {
                                    setLongPPData([...longPPData, taskVersion]);
                                }
                                break;
                            case 'Преддипломная практика':
                                showPPVersionSingle(taskVersion, PPData.length);
                                if (PPData.length > 0) {
                                    setPPData(PPData.concat(taskVersion));
                                }
                                else {
                                    setPPData([...PPData, taskVersion]);
                                }
                                break;
                            default:
                                console.log('task version creation error')
                        }
                    }
                    document.getElementById('make-nir-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-vkr-task-button').disabled = false;
                    //console.log(response);
                }).catch(result => {
                    document.getElementById('make-nir-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-long-pp-task-button').disabled = false;
                    document.getElementById('make-vkr-task-button').disabled = false;

                    console.log(result);
                    setErrorMessage('Ошибка при создании версии задания!');
                    setShowError(true);
                });
        }
    }

    function makeOtchetVersion(file, type) {
        var reportVersion = {};
        reportVersion['editorName'] = authTokens.fio;
        reportVersion['status'] = 'Не отправлено';

        var formData = new FormData();
        formData.append('documentFormType', type);
        formData.append('documentFormKind', 'Отчёт');
        formData.append('documentFormDescription', 'Пример отчёта');
        formData.append('documentFormViewRights', 'Я и мой научный руководитель');
        switch (type) {
            case 'Научно-исследовательская работа':
                document.getElementById('make-nir-otchet-button').disabled = true;
                formData.append('detailedContent', detailedDescription);
                formData.append('advisorConclusion', conclusion);
                reportVersion['detailedContent'] = detailedDescription;
                reportVersion['advisorConclusion'] = conclusion;
                formData.append('nowMerge', $('#nir-merge-checkbox').prop('checked'));
                break;
            case 'Практика по получению знаний и умений':
                document.getElementById('make-long-pp-otchet-button').disabled = true;
                formData.append('detailedContent', detailedDescriptionLongPP);
                formData.append('advisorConclusion', conclusionLongPP);
                reportVersion['detailedContent'] = detailedDescriptionLongPP;
                reportVersion['advisorConclusion'] = conclusionLongPP;
                formData.append('nowMerge', $('#long-pp-merge-checkbox').prop('checked'));
                break;
            case 'Преддипломная практика':
                document.getElementById('make-pp-otchet-button').disabled = true;
                formData.append('detailedContent', detailedDescriptionPP);
                formData.append('advisorConclusion', conclusionPP);
                reportVersion['detailedContent'] = detailedDescriptionPP;
                reportVersion['advisorConclusion'] = conclusionPP;
                formData.append('nowMerge', $('#pp-merge-checkbox').prop('checked'));
                break;
            case 'ВКР':
                document.getElementById('make-vkr-otchet-button').disabled = true;
                formData.append('nowMerge', $('#vkr-merge-checkbox').prop('checked'));
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
            if (response.data.indexOf('Попытка загрузить документ с некорректным разрешением') > -1) {
                setErrorMessage('Ошибка при создании документа: расширение файлов должно совпадать!');
                setShowError(true);
            }
            else if (response.data.indexOf('При поиске последней версии задания произошло что-то необъяснимое') > -1 || response.data.indexOf('Не найдено одобренное задание') > -1) {
                setErrorMessage('Ошибка при создании отчета: не удалось найти одобренную версию задания!');
                setShowError(true);
            }
            else if (/\d/.test(response.data[0])) {
                reportVersion['systemVersionID'] = response.data[0].split(',')[0]
                reportVersion['versionEditionDate'] = response.data[0].split(',')[1]
                switch (type) {
                    case 'Научно-исследовательская работа':
                        showNirOtchetVersionSingle(reportVersion, nirOtchetVersions.length);
                        if (nirOtchetVersions.length > 0) {
                            setNirOtchetVersions(nirOtchetVersions.concat(reportVersion));
                        }
                        else {
                            setNirOtchetVersions([...nirOtchetVersions, reportVersion]);
                        }
                        break;
                    case 'Практика по получению знаний и умений':
                        showLongPPOtchetVersionSingle(reportVersion, longPPOtchetVersions.length);
                        if (longPPOtchetVersions.length > 0) {
                            setLongPPOtchetVersions(longPPOtchetVersions.concat(reportVersion));
                        }
                        else {
                            setLongPPOtchetVersions([...longPPOtchetVersions, reportVersion]);
                        }
                        break;
                    case 'Преддипломная практика':
                        showPPOtchetVersionSingle(reportVersion, PPOtchetVersions.length);
                        if (PPOtchetVersions.length > 0) {
                            setPPOtchetVersions(PPOtchetVersions.concat(reportVersion));
                        }
                        else {
                            setPPOtchetVersions([...PPOtchetVersions, reportVersion]);
                        }
                        break;
                    case 'ВКР':
                        showVkrOtchetVersionSingle(reportVersion, vkrOtchetVersions.length);
                        if (vkrOtchetVersions.length > 0) {
                            setVkrOtchetVersions(vkrOtchetVersions.concat(reportVersion));
                        }
                        else {
                            setVkrOtchetVersions([...vkrOtchetVersions, reportVersion]);
                        }
                        break;
                    default:
                        console.log('task version creation error')
                }
            }
            else {
                setErrorMessage('Ошибка при создании версии отчета!');
                setShowError(true);
            }
        }).then(() => {
            switch (type) {
                case 'Научно-исследовательская работа':
                    document.getElementById('make-nir-otchet-button').disabled = false;
                    break;
                case 'Практика по получению знаний и умений':
                    document.getElementById('make-long-pp-otchet-button').disabled = false;
                    break;
                case 'Преддипломная практика':
                    document.getElementById('make-pp-otchet-button').disabled = false;
                    break;
                case 'ВКР':
                    document.getElementById('make-vkr-otchet-button').disabled = false;
                    break;
                default:
                    console.log('otchet creation error')
            }
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при создании версии отчета!');
            setShowError(true);
        });
    }

    function uploadDocument(file, type, kind) {
        document.getElementById('make-vkr-review-button').disabled = true;
        document.getElementById('make-vkr-dopusk-button').disabled = true;
        document.getElementById('make-vkr-antiplagiat-button').disabled = true;
        document.getElementById('make-vkr-presentation-button').disabled = true;
        var stuffVersion = {};
        stuffVersion['editorName'] = authTokens.fio;
        stuffVersion['documentStatus'] = 'Не отправлено';
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
            if (response.data.indexOf('Файл с таким именем уже существует') > -1) {
                setErrorMessage('Ошибка при создании документа ВКР: файл с таким именем уже существует!');
                setShowError(true);
            }
            else if (/\d/.test(response.data[0])) {
                stuffVersion['systemVersionID'] = response.data[0].split(',')[0]
                stuffVersion['versionEditionDate'] = response.data[0].split(',')[1]
                stuffVersion['systemDocumentID'] = response.data[0].split(',')[2]
                switch (kind) {
                    case 'Отзыв':
                        showReviewVersionSingle(stuffVersion, vkrReviewVersions.length);
                        setVkrReviewVersions([...vkrReviewVersions, stuffVersion]);
                        break;
                    case 'Допуск':
                        showDopuskVersionSingle(stuffVersion, vkrDopuskVersions.length);
                        setVkrDopuskVersions([...vkrDopuskVersions, stuffVersion]);
                        break;
                    case 'Антиплагиат':
                        showAntiplagiatVersionSingle(stuffVersion, vkrAntiplagiatVersions.length);
                        setAntiplagiatVersions([...vkrAntiplagiatVersions, stuffVersion]);
                        break;
                    case 'Презентация':
                        showPresentationVersionsSingle(stuffVersion, vkrPrezentationVersions.length);
                        setPrezentationVersions([...vkrPrezentationVersions, stuffVersion]);
                        break;
                    default:
                        console.log('stuff creation error')
                }
            }
            else {
                setErrorMessage('Ошибка при создании документа: расширение файлов должно совпадать!');
                setShowError(true);
            }
        }).catch(result => {
            console.log(result);
            switch (kind) {
                case 'Отзыв':
                    setErrorMessage('Ошибка при создании отзыва для ВКР!');
                    break;
                case 'Допуск':
                    setErrorMessage('Ошибка при создании допуска для ВКР!');
                    break;
                case 'Антиплагиат':
                    setErrorMessage('Ошибка при создании антиплагиата для ВКР!');
                    break;
                case 'Презентация':
                    setErrorMessage('Ошибка при создании презентации для ВКР!');
                    break;
                default:
                    setErrorMessage('Ошибка при создании документа для ВКР!');
            }
            setShowError(true);
        }).then(() => {
            document.getElementById('make-vkr-review-button').disabled = false;
            document.getElementById('make-vkr-dopusk-button').disabled = false;
            document.getElementById('make-vkr-antiplagiat-button').disabled = false;
            document.getElementById('make-vkr-presentation-button').disabled = false;
        });
    }

    function uploadDocumentVersion(file, id, description, kind) {
        document.getElementById('make-vkr-review-button').disabled = true;
        document.getElementById('make-vkr-dopusk-button').disabled = true;
        document.getElementById('make-vkr-antiplagiat-button').disabled = true;
        document.getElementById('make-vkr-presentation-button').disabled = true;
        var stuffVersion = {};
        stuffVersion['editorName'] = authTokens.fio;
        stuffVersion['documentStatus'] = 'Не отправлено';
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
            if (response.data.indexOf('Запрещено загружать версию документа с иным разрешением, для этого следует загрузить новый документ') > -1) {
                setErrorMessage('Ошибка при создании документа: расширение файлов должно совпадать!');
                setShowError(true);
            }
            else if (/\d/.test(response.data[0])) {
                stuffVersion['systemVersionID'] = response.data[0].split(',')[0]
                stuffVersion['versionEditionDate'] = response.data[0].split(',')[1]
                stuffVersion['systemDocumentID'] = response.data[0].split(',')[2]
                switch (kind) {
                    case 'Отзыв':
                        showReviewVersionSingle(stuffVersion, vkrReviewVersions.length);
                        setVkrReviewVersions(vkrReviewVersions.concat(stuffVersion));
                        break;
                    case 'Допуск':
                        showDopuskVersionSingle(stuffVersion, vkrDopuskVersions.length);
                        setVkrDopuskVersions(vkrDopuskVersions.concat(stuffVersion));
                        break;
                    case 'Антиплагиат':
                        showAntiplagiatVersionSingle(stuffVersion, vkrAntiplagiatVersions.length);
                        setAntiplagiatVersions(vkrAntiplagiatVersions.concat(stuffVersion));
                        break;
                    case 'Презентация':
                        showPresentationVersionsSingle(stuffVersion, vkrPrezentationVersions.length);
                        setPrezentationVersions(vkrPrezentationVersions.concat(stuffVersion));
                        break;
                    default:
                        console.log('stuff version creation error')
                }
            }
            else {
                setErrorMessage('Ошибка при создании документа ВКР!');
                setShowError(true);
            }
        }).catch(result => {
            console.log(result);
            switch (kind) {
                case 'Отзыв':
                    setErrorMessage('Ошибка при создании отзыва для ВКР!');
                    break;
                case 'Допуск':
                    setErrorMessage('Ошибка при создании допуска для ВКР!');
                    break;
                case 'Антиплагиат':
                    setErrorMessage('Ошибка при создании антиплагиата для ВКР!');
                    break;
                case 'Презентация':
                    setErrorMessage('Ошибка при создании презентации для ВКР!');
                    break;
                default:
                    setErrorMessage('Ошибка при создании документа для ВКР!');
            }
            setShowError(true);
        }).then(() => {
            document.getElementById('make-vkr-review-button').disabled = false;
            document.getElementById('make-vkr-dopusk-button').disabled = false;
            document.getElementById('make-vkr-antiplagiat-button').disabled = false;
            document.getElementById('make-vkr-presentation-button').disabled = false;
        });
    }

    function viewDoc(versionId) {
        axios({
            url: apiURL + '/document/get/outer/link',
            method: 'GET',
            params: {
                'versionID': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log('https://docs.google.com/gview?url=' + response.data);
            window.open('https://docs.google.com/gview?url=' + response.data, '_blank');
        }).catch(result => {
            console.log('error');
            console.log(result);
        });
    }

    function viewExample(arrayId) {
        axios({
            url: apiURL + '/document/get/outer/link/single',
            method: 'GET',
            params: {
                'creatorID': examples[arrayId].systemCreatorID,
                'documentName': examples[arrayId].documentName,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log('https://docs.google.com/gview?url=' + response.data);
            window.open('https://docs.google.com/gview?url=' + response.data, '_blank');
        }).catch(result => {
            console.log('error');
            console.log(result);
        });
    }

    async function sendTask(versionId) {
        return axios({
            url: apiURL + '/student/document/management/task/nir/send',
            method: 'POST',
            params: {
                'newStatus': 'Рассматривается',
                'versionID': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при отправке версии документа!');
            setShowError(true);
            return false;
        })
    }

    function downloadDocument(versionID, documentName) {
        axios({
            url: apiURL + '/document/download/version',
            method: 'GET',
            responseType: 'blob',
            params: {
                versionID: versionID,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documentName);
            document.body.appendChild(link);
            link.click();

        }).catch(result => {
            console.log(result.data);
            setErrorMessage('Ошибка при скачивании версии документа!');
            setShowError(true);
        });
    }

    async function deleteTaskVersion(versionId) {
        return axios({
            url: apiURL + '/student/document/task/version/delete',
            method: 'DELETE',
            params: {
                versionID: versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении версии задания!');
            setShowError(true);
            return false;
        });
    }

    async function sendReport(versionId) {
        return axios({
            url: apiURL + '/student/document/management/report/nir/send',
            method: 'POST',
            params: {
                'newStatus': 'Рассматривается',
                'versionID': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при отправке версии отчета!');
            setShowError(true);
            return false;
        });
    }

    function downloadReport(type, versionId, name) {
        axios({
            url: apiURL + '/student/document/download/report',
            method: 'GET',
            responseType: 'blob',
            params: {
                'type': type,
                'reportVersion': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();

        }).catch(result => {
            console.log(result.data);
            setErrorMessage('Ошибка при скачивании версии документа!');
            setShowError(true);
        });
    }

    async function deleteReportVersion(versionId) {
        return axios({
            url: apiURL + '/student/document/report/version/delete',
            method: 'DELETE',
            params: {
                versionID: versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении версии отчета!');
            setShowError(true);
            return false;
        });
    }

    async function sendVkrStuff(versionId) {
        return axios({
            url: apiURL + '/student/document/management/vkr/stuff/send',
            method: 'POST',
            params: {
                'newStatus': 'Рассматривается',
                'versionID': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при отправке версии документа для ВКР!');
            setShowError(true);
            return false;
        });
    }

    function downloadVkrStuff(versionId, documentName) {
        axios({
            url: apiURL + '/document/download/version',
            method: 'GET',
            responseType: 'blob',
            params: {
                'versionID': versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documentName);
            document.body.appendChild(link);
            link.click();
        }).catch(result => {
            console.log(result.data);
            setErrorMessage('Ошибка при скачивании версии документа!');
            setShowError(true);
        });
    }

    async function deleteVkrStuffVersion(versionId) {
        return axios({
            url: apiURL + '/student/document/vkr/stuff/version/delete',
            method: 'DELETE',
            params: {
                versionID: versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return false;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении документа для ВКР!');
            setShowError(true);
            return false;
        });
    }

    async function deleteVkrStuffKind(kind) {
        return axios({
            url: apiURL + '/document/delete/',
            method: 'DELETE',
            params: {
                documentKind: kind,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении версии документа для ВКР!');
            setShowError(true);
            return false;
        });
    }

    $(function () {

        $('.sci-table-checkbox').off().on('click', function (e) {
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
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            sendTask(nirVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.nir-version-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            })

        });

        // Скачать версию задания НИР
        $('.nir-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            downloadDocument(nirVersions[arrayID].systemVersionID, 'Задание на НИР.docx');
        });

        // Удалить версию задания НИР
        $('.nir-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            deleteTaskVersion(nirVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
            })
        });

        // Создать версию отчёта по НИР
        $('#make-nir-otchet-button').off().on('click', function () {
            $('#nir-otchet-file-input').trigger('click');
        });

        // Отправить отчёт НИР науч руку
        $('.nir-otchet-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            $(this).attr('disabled', true);
            sendReport(nirOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.nir-otchet-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать отчёт НИР
        $('.nir-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadReport('Научно-исследовательская работа', nirOtchetVersions[arrayID].systemVersionID, 'Отчёт по НИР.docx');
        });

        // Удалить отчёт НИР
        $('.nir-otchet-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            $(this).attr('disabled', true);
            deleteReportVersion(nirOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
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
            $(this).attr('disabled', true);
            sendTask(longPPData[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.long-pp-version-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать версию задания ПП...
        $('.long-pp-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            downloadDocument(longPPData[arrayID].systemVersionID, 'Задание на ПпППУиОПД.docx');
        });

        // Удалить версию задания ПП...
        $('.long-pp-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            $(this).attr('disabled', true);
            deleteTaskVersion(longPPData[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
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
            $(this).attr('disabled', true);
            sendReport(longPPOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.long-pp-otchet-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать отчёт ПП...
        $('.long-pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[4];
            downloadReport('Научно-исследовательская работа', longPPOtchetVersions[arrayID].systemVersionID, 'Отчёт по ПпППУиОПД.docx');
        });

        // Удалить отчёт ПП...
        $('.long-pp-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            $(this).attr('disabled', true);
            deleteReportVersion(longPPOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Создание новой версии задания ПП
        $('#make-pp-task-button').off().on('click', function () {
            makeTaskVersion('Преддипломная практика');
        });

        // Послать версию задания ПП науч руку
        $('.pp-version-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            sendTask(PPData[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.pp-version-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать версию задания ПП
        $('.pp-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            downloadDocument(PPData[arrayID].systemVersionID, 'Задание на ПП.docx');
        });

        // Удалить версию задания ПП
        $('.pp-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            deleteTaskVersion(PPData[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
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
            $(this).attr('disabled', true);
            sendReport(PPOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.pp-otchet-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать отчёт ПП
        $('.pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadReport('Научно-исследовательская работа', PPOtchetVersions[arrayID].systemVersionID, 'Отчёт по ПП.docx');
        });

        // Удалить отчёт ПП
        $('.pp-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            $(this).attr('disabled', true);
            deleteReportVersion(PPOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
            })
        });

        // Создание новой версии задания ВКР
        $('#make-vkr-task-button').off().on('click', function () {
            makeTaskVersion('ВКР');
        });

        // Послать версию задания ВКР науч руку
        $('.vkr-version-send-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            sendTask(vkrTaskVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-version-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать задание ВКР
        $('.vkr-version-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            downloadDocument(vkrTaskVersions[arrayID].systemVersionID, 'Задание на ВКР.docx');
        });

        // Удалить версию задания ВКР
        $('.vkr-version-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            $(this).attr('disabled', true);
            deleteTaskVersion(vkrTaskVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
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
            $(this).attr('disabled', true);
            sendReport(vkrOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-otchet-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать отчёт ВКР
        $('.vkr-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadReport('ВКР', vkrOtchetVersions[arrayID].systemVersionID, 'РПЗ.docx');
        });

        // Удалить отчёт ВКР
        $('.vkr-otchet-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            $(this).attr('disabled', true);
            deleteReportVersion(vkrOtchetVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().parent().remove();
                }
                else {
                    $(this).attr('disabled', false);
                }
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
            $(this).attr('disabled', true);
            sendVkrStuff(vkrReviewVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-review-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать отзыв ВКР
        $('.vkr-review-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadVkrStuff(vkrReviewVersions[arrayID].systemVersionID, 'Отзыв научного руководителя.docx');
        });

        // Удалить отзыв ВКР
        $('.vkr-review-delete-button').off().on('click', function () {
            console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrReviewVersions.length > 1) {
                $(this).attr('disabled', true);
                deleteVkrStuffVersion(vkrReviewVersions[arrayID].systemVersionID).then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
                });
            }
            else {
                $(this).attr('disabled', true);
                deleteVkrStuffKind('Отзыв').then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                        setVkrReviewVersions([]);
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
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
            $(this).attr('disabled', true);
            sendVkrStuff(vkrDopuskVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-dopusk-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать допуск ВКР
        $('.vkr-dopusk-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadVkrStuff(vkrDopuskVersions[arrayID].systemVersionID, 'Допуск к защите.docx');
        });

        // Удалить допуск ВКР
        $('.vkr-dopusk-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            console.log(vkrDopuskVersions);
            if (vkrDopuskVersions.length > 1) {
                $(this).attr('disabled', true);
                deleteVkrStuffVersion(vkrDopuskVersions[arrayID].systemVersionID).then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
                });
            }
            else {
                $(this).attr('disabled', true);
                deleteVkrStuffKind('Допуск').then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                        setVkrDopuskVersions([]);
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
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
            $(this).attr('disabled', true);
            sendVkrStuff(vkrAntiplagiatVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-antiplagiat-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать антиплагиат ВКР
        $('.vkr-antiplagiat-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadVkrStuff(vkrAntiplagiatVersions[arrayID].systemVersionID, 'Отчет о прохождении антиплагиата.docx');
        });

        // Удалить антиплагиат ВКР
        $('.vkr-antiplagiat-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrAntiplagiatVersions.length > 1) {
                $(this).attr('disabled', true);
                deleteVkrStuffVersion(vkrAntiplagiatVersions[arrayID].systemVersionID).then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
                });
            }
            else {
                $(this).attr('disabled', true);
                deleteVkrStuffKind('Антиплагиат').then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                        setAntiplagiatVersions([]);
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
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
            $(this).attr('disabled', true);
            sendVkrStuff(vkrPrezentationVersions[arrayID].systemVersionID).then((result) => {
                if (result) {
                    $(this).parent().find('.vkr-presentation-delete-button').attr('disabled', true);
                    $(this).parent().find('.nir-header-text:contains("Статус: Не отправлено")').text('Статус: Рассматривается');
                }
                else {
                    $(this).attr('disabled', false);
                }
            });
        });

        // Скачать презентацию ВКР
        $('.vkr-presentation-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            console.log($(this).parent().parent());
            var arrayID = versionId.split('-')[3];
            downloadVkrStuff(vkrPrezentationVersions[arrayID].systemVersionID, 'Презентация ВКР.pptx');
        });

        // Удалить презентацию ВКР
        $('.vkr-presentation-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            if (vkrPrezentationVersions.length > 1) {
                $(this).attr('disabled', true);
                deleteVkrStuffVersion(vkrPrezentationVersions[arrayID].systemVersionID).then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
                });
            }
            else {
                console.log('deleting kind');
                $(this).attr('disabled', true);
                deleteVkrStuffKind('Презентация').then((result) => {
                    if (result) {
                        $(this).parent().parent().remove();
                        setPrezentationVersions([]);
                    }
                    else {
                        $(this).attr('disabled', false);
                    }
                });
            }
        });

        // Функция кнопки "перенести в меню" для задания НИР
        $('.nir-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            if (themeConfirmed !== 'Одобрена') {
                setStudentTheme(nirVersions[arrayID].theme);
            }
            setToExplore(nirVersions[arrayID].toExplore);
            setToCreate(nirVersions[arrayID].toCreate);
            setToFamiliarize(nirVersions[arrayID].toFamiliarize);
            setAdditionalTask(nirVersions[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ПП...
        $('.long-pp-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];

            if (themeConfirmed !== 'Одобрена') {
                setStudentTheme(longPPData[arrayID].theme);
            }
            setToExplore(longPPData[arrayID].toExplore);
            setToCreate(longPPData[arrayID].toCreate);
            setToFamiliarize(longPPData[arrayID].toFamiliarize);
            setAdditionalTask(longPPData[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ПП
        $('.pp-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            if (themeConfirmed !== 'Одобрена') {
                setStudentTheme(PPData[arrayID].theme);
            }
            setToExplore(PPData[arrayID].toExplore);
            setToCreate(PPData[arrayID].toCreate);
            setToFamiliarize(PPData[arrayID].toFamiliarize);
            setAdditionalTask(PPData[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для задания ВКР
        $('.vkr-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            if (themeConfirmed !== 'Одобрена') {
                setStudentTheme(vkrTaskVersions[arrayID].theme);
            }
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

        $('.version-view-button').off().on('click', function (e) {
            e.preventDefault();
            var thisType = $(this).attr('id').split('-')[0];
            var arrayId = $(this).attr('id').split('-')[2];
            var versionId = -1;
            switch (thisType) {
                case 'nirTask':
                    versionId = nirVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'nirOtchet':
                    versionId = nirOtchetVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'longPPTask':
                    versionId = longPPData[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'longPPOtchet':
                    versionId = longPPOtchetVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'ppTask':
                    versionId = PPData[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'ppOtchet':
                    versionId = PPOtchetVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrTask':
                    versionId = vkrTaskVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrOtchet':
                    versionId = vkrOtchetVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrDopusk':
                    versionId = vkrDopuskVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrReview':
                    versionId = vkrReviewVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrAntiplagiat':
                    versionId = vkrAntiplagiatVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'vkrPresentation':
                    versionId = vkrPrezentationVersions[arrayId].systemVersionID;
                    viewDoc(versionId);
                    break;
                case 'example':
                    viewExample(arrayId);
                    break;
                default:
                    console.log('View error');
            }
        })

    });

    return (
        <div>

            <div className='sci-advisor-students-form'>
                <div>
                    <Table striped bordered hover style={{ width: '1490px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <thead className='size-24 dark'>
                            <tr>
                                <th>Тема - {themeConfirmed}</th>
                                <th style={{ minWidth: '241px' }}>НИР</th>
                                <th style={{ minWidth: '318px' }}>ПпППУиОПД</th>
                                <th style={{ minWidth: '233px' }}>ПП</th>
                                <th style={{ minWidth: '283px' }}>ВКР</th>
                            </tr>
                        </thead>
                        <tbody id='student-table-body'>

                        </tbody>
                    </Table>
                </div>
            </div>

            <Form className='info-form '>

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

                        <div className='dark info-task-block light-background' style={{ paddingBottom: '3px' }}>
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на НИР</p>

                                    <div id='student-nir-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
                                            <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area theme-area' />

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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении НИР</p>

                                    <div id='student-nir-otchet-version-div' className='student-nir-task-version-div light-background'></div>


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
                                    <input id='nir-otchet-file-input' type='file' style={{ display: 'none' }} accept='application/vnd.openxmlformats-officedocument.wordprocessingml.document' onChange={(e) => {
                                        //console.log(e.target.files);
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Научно-исследовательская работа');
                                            $('#nir-otchet-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>
                                    <div className='report-attach-div'>
                                        <input type='checkbox' defaultChecked id='nir-merge-checkbox' className='report-attach-checkbox'></input>
                                        <label htmlFor='nir-merge-checkbox' className='size-24 dark attach-checkbox-text'>Присоединить к загруженному файлу одобренное задание?</label>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey='info2' title={<Image id='image2' src={infoBlock2} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                        <div className='dark info-task-block' style={{ backgroundColor: '#89AFE0', paddingBottom: '3px' }}>
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на ПпППУиОПД</p>

                                    <div id='student-long-pp-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
                                            <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area theme-area' />

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

                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении ПпППУиОПД</p>

                                    <div id='student-long-pp-otchet-version-div' className='student-nir-task-version-div light-background'></div>


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
                                    <input id='long-pp-otchet-file-input' type='file' style={{ display: 'none' }} accept='application/vnd.openxmlformats-officedocument.wordprocessingml.document' onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Практика по получению знаний и умений');
                                            $('#long-pp-otchet-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>
                                    <div className='report-attach-div'>
                                        <input type='checkbox' defaultChecked id='long-pp-merge-checkbox' className='report-attach-checkbox'></input>
                                        <label htmlFor='long-pp-merge-checkbox' className='size-24 dark attach-checkbox-text'>Присоединить к загруженному файлу одобренное задание?</label>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey='info3' title={<Image id='image3' src={infoBlock3} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                        <div className='dark info-task-block' style={{ backgroundColor: '#618FCA', color: '#F1F4FB', paddingBottom: '3px' }}>
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на ПП</p>

                                    <div id='student-pp-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
                                            <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area theme-area' />

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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Отчет о прохождении ПП</p>

                                    <div id='student-pp-otchet-version-div' className='student-nir-task-version-div light-background'></div>

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
                                    <input id='pp-otchet-file-input' type='file' style={{ display: 'none' }} accept='application/vnd.openxmlformats-officedocument.wordprocessingml.document' onChange={(e) => {
                                        //console.log(e.target.files);
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'Преддипломная практика');
                                            $('#pp-otchet-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>
                                    <div className='report-attach-div'>
                                        <input type='checkbox' defaultChecked id='pp-merge-checkbox' className='report-attach-checkbox'></input>
                                        <label htmlFor='pp-merge-checkbox' className='size-24 dark attach-checkbox-text'>Присоединить к загруженному файлу одобренное задание?</label>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey='info4' title={<Image id='image4' src={infoBlock4} thumbnail className='info-form-image' style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }} />}>
                        <div className='dark info-task-block' style={{ backgroundColor: '#3A5985', color: '#F1F4FB', paddingBottom: '3px' }}>
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Отзыв научного руководителя</p>

                                    <div id='student-vkr-review-version-div' className='student-nir-task-version-div light-background'></div>

                                    <button type='button' id='make-vkr-review-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отзыва научного руководителя</p></div>
                                    </button>
                                    <input id='vkr-review-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrReviewVersions.length === 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Отзыв');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrReviewVersions[0].systemDocumentID, 'Отзыв версия', 'Отзыв')
                                            }
                                            $('#vkr-review-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>

                                </div>
                            </Tab>
                            <Tab eventKey='info42' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Допуск к<br />защите
                            </p>
                            }>
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Допуск к защите</p>

                                    <div id='student-vkr-dopusk-version-div' className='student-nir-task-version-div light-background'></div>


                                    <button type='button' id='make-vkr-dopusk-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />допуска к защите ВКР</p></div>
                                    </button>
                                    <input id='vkr-dopusk-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrDopuskVersions.length === 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Допуск');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrDopuskVersions[0].systemDocumentID, 'Допуск версия', 'Допуск')
                                            }
                                            $('#vkr-dopusk-file-input[type="file"]').val(null);
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Задание на ВКР</p>

                                    <div id='student-vkr-task-version-div' className='student-nir-task-version-div light-background'></div>

                                    <div className='info-row'>
                                        <div className='info-column'>
                                            <Form.Label column className="size-21 dark info-input-label">Тема:</Form.Label>
                                            <textarea maxLength='1024' value={studentTheme} onChange={(e) => { setStudentTheme(e.target.value); }} className='dark size-24 info-input-area theme-area' />

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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>РПЗ</p>

                                    <div id='student-vkr-otchet-version-div' className='student-nir-task-version-div light-background'></div>

                                    <button type='button' id='make-vkr-otchet-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '480px', marginLeft: '505px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить<br />новую версию РПЗ</p></div>
                                    </button>
                                    <input id='vkr-otchet-file-input' type='file' style={{ display: 'none' }} accept='application/vnd.openxmlformats-officedocument.wordprocessingml.document' onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            makeOtchetVersion(e.target.files[0], 'ВКР');
                                            $('#vkr-otchet-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>
                                    <div className='report-attach-div'>
                                        <input type='checkbox' defaultChecked id='vkr-merge-checkbox' className='report-attach-checkbox'></input>
                                        <label htmlFor='vkr-merge-checkbox' className='size-24 dark attach-checkbox-text'>Присоединить к загруженному файлу одобренное задание?</label>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey='info45' title={
                                <p className='size-30 light dark-background info-form-subtab-title' style={{ marginLeft: '29px' }}>
                                    <Image src={iconDocument} thumbnail className='dark-background info-form-subtab-icon icon-small' />
                                Проверка на<br />антиплагиат
                            </p>
                            }>
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Проверка на антиплагиат</p>

                                    <div id='student-vkr-antiplagiat-version-div' className='student-nir-task-version-div light-background'></div>

                                    <button type='button' id='make-vkr-antiplagiat-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отчета об антиплагиате</p></div>
                                    </button>
                                    <input id='vkr-antiplagiat-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrAntiplagiatVersions.length === 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Антиплагиат');
                                            }
                                            else {
                                                uploadDocumentVersion(e.target.files[0], vkrAntiplagiatVersions[0].systemDocumentID, 'Антиплагиат версия', 'Антиплагиат')
                                            }
                                            $('#vkr-antiplagiat-file-input[type="file"]').val(null);
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
                                <div className='info-sub-tab-div light-background'>

                                    <div className='info-break-div' style={{ marginBottom: '20px' }}>&nbsp;</div>

                                    <p className='size-30 dark info-sub-tab-title'>Презентация к защите</p>

                                    <div id='student-vkr-presentation-version-div' className='student-nir-task-version-div light-background'></div>

                                    <button type='button' id='make-vkr-presentation-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />презентации</p></div>
                                    </button>
                                    <input id='vkr-presentation-file-input' type='file' style={{ display: 'none' }} accept='application/vnd.openxmlformats-officedocument.presentationml.presentation' onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrPrezentationVersions.length === 0) {
                                                uploadDocument(e.target.files[0], 'ВКР', 'Презентация');
                                            }
                                            else {
                                                //console.log(vkrPrezentationVersions);
                                                uploadDocumentVersion(e.target.files[0], vkrPrezentationVersions[0].systemDocumentID, 'Презентация версия', 'Презентация')
                                            }
                                            $('#vkr-presentation-file-input[type="file"]').val(null);
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                </Tabs>

            </Form>

            <Modal centered show={showError} onHide={() => { setShowError(false) }} className='dark'>
                <Modal.Header className='light-background' closeButton>
                    <Modal.Title className='size-30'>
                        {errorMessage}
                    </Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    );
}