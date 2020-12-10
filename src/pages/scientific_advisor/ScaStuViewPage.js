import React, { useState, useEffect } from 'react';
import { Form, Tabs, Tab, Image, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocument from '../../images/icons/documents.png';
import iconProject from '../../images/icons/myproject.png';

export default function ScaStuViewPage() {

    // TODO обработка сообщения, что нельзя добавлять версии, если студент ещё ничего не создал

    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [themeConfirmed, setThemeConfirmed] = useState('');

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
        getStudentTaskVersions('Научно-исследовательская работа');
        getOtchetVersions('Научно-исследовательская работа');
        getStudentTaskVersions('Практика по получению знаний и умений');
        getOtchetVersions('Практика по получению знаний и умений');
        getStudentTaskVersions('Преддипломная практика');
        getOtchetVersions('Преддипломная практика');
        getStudentTaskVersions('ВКР');
        getOtchetVersions('ВКР');

        getVkrStuff('Допуск');
        getVkrStuff('Отзыв');
        getVkrStuff('Антиплагиат');
        getVkrStuff('Презентация');

        setStudentData(JSON.parse(sessionStorage.getItem('student')));
    }

    useEffect(() => {
        showStudentNirVersions(nirVersions);
    }, [nirVersions]);

    useEffect(() => {
        showStudentLongPPVersions(longPPData);
    }, [longPPData]);

    useEffect(() => {
        showStudentPPVersions(PPData);
    }, [PPData]);

    useEffect(() => {
        showStudentVkrVersions(vkrTaskVersions);
    }, [vkrTaskVersions]);

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
        showVkrOtchetVersions(vkrOtchetVersions);
    }, [vkrOtchetVersions]);

    useEffect(() => {
        showVkrDopuskVersions(vkrDopuskVersions);
    }, [vkrDopuskVersions]);

    useEffect(() => {
        showVkrReviewVersions(vkrReviewVersions);
    }, [vkrReviewVersions]);

    useEffect(() => {
        showVkrAntiplagiatVersions(vkrAntiplagiatVersions);
    }, [vkrAntiplagiatVersions]);

    useEffect(() => {
        showVkrPresentationVersions(vkrPrezentationVersions);
    }, [vkrPrezentationVersions]);

    useEffect(() => {
        showStudent(studentData, 0);
    }, [studentData]);

    // Заполнение таблицы студентов
    function showStudent(item, i) {
        console.log(item);

        var student = document.createElement('tr');
        student.id = 'student' + i;
        student.className = 'size-20 dark';

        // Имя студента
        var studentFio = document.createElement('th');

        var projectArea = 'Комплексный проект не назначен';
        if (item.projectArea != 'Нет проектной области') {
            projectArea = item.projectArea;
        }

        var popover = document.createElement('a');
        popover.href = '#';
        popover.onclick = 'return false;';
        popover.className = 'student-popover dark size-24';
        $(popover).attr('data-toggle', 'popover');
        $(popover).attr('title', 'Данные студента:');
        $(popover).attr('data-html', 'true');
        $(popover).attr('data-content', "Имя: " + item.fio +
            "<br /> Группа: " + item.group +
            "<br /> Телефон: " + item.phone +
            "<br /> Почта: " + item.email +
            "<br /> Комплексный проект: " + projectArea +
            "<br /> Проект: " + item.projectName);
        popover.innerText = item.fio.split(' ')[0] +
            '. ' +
            item.fio.split(' ')[1].charAt(0) +
            '. ' +
            item.fio.split(' ')[2].charAt(0) +
            '.';

        // Тема студента
        var studentTheme = document.createElement('th');
        setStudentTheme(item.studentVkrTheme);
        studentTheme.innerText = item.studentVkrTheme;
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

        studentFio.appendChild(popover);
        student.appendChild(studentFio);

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

    // Получение заданий НИР для студента
    function getStudentTaskVersions(type) {
        axios({
            url: apiURL + '/scientific_advisor/document/task/view',
            method: 'GET',
            params: {
                'taskType': type,
                'studentID': sessionStorage.getItem('viewedStudentId'),
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

    // Получение версий отчетов НИР
    function getOtchetVersions(type) {
        axios({
            url: apiURL + '/scientific_advisor/document/report/view',
            method: 'GET',
            params: {
                'taskType': type,
                'studentID': sessionStorage.getItem('viewedStudentId'),
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
                    //console.log(response);
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
            url: apiURL + '/scientific_advisor/document/vkr/stuff/view',
            method: 'GET',
            params: {
                'stuffKind': stuffKind,
                'studentID': sessionStorage.getItem('viewedStudentId'),
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

    // Показать допуск ВКР
    function showVkrDopuskVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.documentStatus === 'Одобрено' || item.documentStatus === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 vkr-dopusk-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 vkr-dopusk-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-titles';

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
            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);

            document.getElementById('student-vkr-dopusk-version-div').appendChild(nirVersion);
        }
    }

    // Показать отзыв ВКР
    function showVkrReviewVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.documentStatus === 'Одобрено' || item.documentStatus === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 vkr-review-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 vkr-review-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-titles';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);

            document.getElementById('student-vkr-review-version-div').appendChild(nirVersion);
        }
    }

    // Показать антиплагиат ВКР
    function showVkrAntiplagiatVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.documentStatus === 'Одобрено' || item.documentStatus === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 vkr-antiplagiat-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 vkr-antiplagiat-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-titles';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);

            document.getElementById('student-vkr-antiplagiat-version-div').appendChild(nirVersion);
        }
    }

    // Показать презентации ВКР
    function showVkrPresentationVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.documentStatus === 'Одобрено' || item.documentStatus === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 vkr-presentation-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 vkr-presentation-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-titles';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);

            document.getElementById('student-vkr-presentation-version-div').appendChild(nirVersion);
        }
    }

    // Показать задания НИР
    function showStudentNirVersions(nirVersionArray) {
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

                // Кнопка отправить студенту
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить студенту:';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (item.status === 'Одобрено' || item.status === 'Замечания') {
                    sendButton.disabled = true;
                }

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sci-advisor-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 nir-status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 nir-status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

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

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                nirVersionHeader.appendChild(dropdownDiv);

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

    // Показать задания ПП...
    function showStudentLongPPVersions(nirVersionArray) {
        if (nirVersionArray.length > 0) {
            for (var i = 0; i < nirVersionArray.length; i++) {
                var item = nirVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'long-pp-version-' + i;

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

                // Кнопка отправить студенту
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить студенту:';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (item.status === 'Одобрено' || item.status === 'Замечания') {
                    sendButton.disabled = true;
                }

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sci-advisor-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 long-pp-status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 long-pp-status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

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
                copyButton.className = 'light dark-background size-21 nir-copy-button long-pp-copy';
                copyButton.innerText = 'Перенести значения в меню';
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
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(viewButton);

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                nirVersionHeader.appendChild(dropdownDiv);

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
                document.getElementById('student-long-pp-task-version-div').appendChild(nirVersion);
            }
        }
    }

    // Показать задания ПП
    function showStudentPPVersions(nirVersionArray) {
        if (nirVersionArray.length > 0) {
            for (var i = 0; i < nirVersionArray.length; i++) {
                var item = nirVersionArray[i];

                var nirVersion = document.createElement('div');
                nirVersion.className = 'nir-version light-background';
                nirVersion.id = 'pp-version-' + i;

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

                // Кнопка отправить студенту
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить студенту:';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (item.status === 'Одобрено' || item.status === 'Замечания') {
                    sendButton.disabled = true;
                }

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sci-advisor-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 pp-status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 pp-status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

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
                copyButton.className = 'light dark-background size-21 nir-copy-button pp-copy';
                copyButton.innerText = 'Перенести значения в меню';
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
                nirVersionHeader.appendChild(clickableArea);
                nirVersionHeader.appendChild(viewButton);

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                nirVersionHeader.appendChild(dropdownDiv);

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
                document.getElementById('student-pp-task-version-div').appendChild(nirVersion);
            }
        }
    }

    // Показать задания ВКР
    function showStudentVkrVersions(nirVersionArray) {
        if (nirVersionArray.length > 0) {
            for (var i = 0; i < nirVersionArray.length; i++) {
                var item = nirVersionArray[i];

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

                // Кнопка отправить студенту
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить студенту:';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (item.status === 'Одобрено' || item.status === 'Замечания') {
                    sendButton.disabled = true;
                }

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sci-advisor-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 vkr-status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 vkr-status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

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

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                nirVersionHeader.appendChild(dropdownDiv);

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
    }

    // Показать отчёты НИР
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

                // Кнопка отправить науч руку
                var sendButton = document.createElement('button');
                sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
                sendButton.innerText = 'Отправить студенту:';
                sendButton.type = 'button';
                if (item.status === 'Одобрено' || item.status === 'Замечания') {
                    sendButton.disabled = true;
                }

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sci-advisor-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 nir-otchet-status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 nir-otchet-status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

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

                var clickableArea = document.createElement('div');
                clickableArea.className = 'nir-version-clickable';

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

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                nirVersionHeader.appendChild(dropdownDiv);

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

    // Показать отчёты ПП...
    function showLongPPOtchetVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.status === 'Одобрено' || item.status === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 long-pp-otchet-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 long-pp-otchet-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-clickable';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

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

    // Показать отчёты ПП
    function showPPOtchetVersions(nirOtchetVersionArray) {
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

            // Кнопка отправить науч руку
            var sendButton = document.createElement('button');
            sendButton.className = 'dark size-24 nir-version-header-button nir-version-send-button';
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.status === 'Одобрено' || item.status === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 pp-otchet-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 pp-otchet-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-clickable';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

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

    // Показать отчёты ВКР
    function showVkrOtchetVersions(nirOtchetVersionArray) {
        for (var i = 0; i < nirOtchetVersionArray.length; i++) {
            var item = nirOtchetVersionArray[i];

            var nirVersion = document.createElement('div');
            nirVersion.className = 'nir-version light-background';
            nirVersion.id = 'vkr-otchet-version-' + i;

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
            sendButton.innerText = 'Отправить студенту:';
            sendButton.type = 'button';
            if (item.status === 'Одобрено' || item.status === 'Замечания') {
                sendButton.disabled = true;
            }

            var dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'sci-advisor-status-dropdown-div';

            var dropdownContent = document.createElement('div');
            dropdownContent.className = 'sci-advisor-status-dropdown-content';

            var statusOdobreno = document.createElement('p');
            statusOdobreno.className = 'dark size-18 vkr-otchet-status-odobreno';
            statusOdobreno.innerText = 'Одобрено';

            var statusZamechaniya = document.createElement('p');
            statusZamechaniya.className = 'dark size-18 vkr-otchet-status-zamechaniya';
            statusZamechaniya.innerText = 'Замечания';

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

            var clickableArea = document.createElement('div');
            clickableArea.className = 'nir-version-titles';

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

            dropdownDiv.appendChild(sendButton);
            dropdownContent.appendChild(statusOdobreno);
            dropdownContent.appendChild(statusZamechaniya);
            dropdownDiv.appendChild(dropdownContent);
            nirVersionHeader.appendChild(dropdownDiv);

            nirVersionHeader.appendChild(downloadButton);
            nirVersionHeader.appendChild(deleteButton);
            nirVersion.appendChild(nirVersionHeader);

            document.getElementById('student-vkr-otchet-version-div').appendChild(nirVersion);
        }
    }

    function makeTaskVersion(type) {
        var formData = new FormData();
        formData.append('taskType', type);
        formData.append('studentTheme', studentTheme);
        formData.append('studentID', sessionStorage.getItem('viewedStudentId'));
        switch (type) {
            case 'ВКР':
                formData.append('vkrAim', vkrAims);
                formData.append('vkrTasks', vkrTasks);
                formData.append('vkrDocs', vkrDocs);
                axios({
                    url: apiURL + '/scientific_advisor/document/management/task/vkr/update',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    if (response.data === 'Вы не можете добавлять версии заданию студенту, пока он его не сгенерирует') {
                        console.log(response.data);
                    }
                    else {
                        window.location.reload();
                    }
                    console.log(response);
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
                    url: apiURL + '/scientific_advisor/document/management/task/nir/update',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    if (response.data === 'Вы не можете добавлять версии заданию студенту, пока он его не сгенерирует') {
                        console.log(response.data);
                    }
                    else {
                        window.location.reload();
                    }
                    //console.log(response);
                }).catch(result => {
                    console.log(result);
                });
        }
    }

    // Отправить студенту задание со статусом
    function gradeTask(array, arrayId, status) {
        axios({
            url: apiURL + '/scientific_advisor/document/management/task/nir/check',
            method: 'POST',
            params: {
                'versionID': array[arrayId].systemVersionID,
                'newStatus': status,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response)
            window.location.reload(true);
        }).catch(result => {
            console.log(result);
        });
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
        formData.append('studentID', sessionStorage.getItem('viewedStudentId'));
        axios({
            url: apiURL + '/scientific_advisor/document/report/upload/version',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            if (response.data === 'Вы не можете загрузить версию отчёта студента пока он его не загрузит') {
                console.log(response);
            }
            else {
                console.log(response);
                window.location.reload();
            }
        }).catch(result => {
            console.log(result);
        });
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
        formData.append('studentID', sessionStorage.getItem('viewedStudentId'));
        axios({
            url: apiURL + '/scientific_advisor/document/report/upload/version',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            if (response.data === 'Вы не можете загрузить версию отчёта студента пока он его не загрузит') {
                console.log(response);
            }
            else {
                console.log(response);
                window.location.reload();
            }
        }).catch(result => {
            console.log(result);
        });
    }

    // Отправить студенту отчёт со статусом
    function gradeOtchet(array, arrayId, status) {
        axios({
            url: apiURL + '/scientific_advisor/document/management/report/nir/check',
            method: 'POST',
            params: {
                'versionID': array[arrayId].systemVersionID,
                'newStatus': status,
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
    }

    function gradeVkrStuff(versionId, status) {
        axios({
            url: apiURL + '/scientific_advisor/document/management/vkr/stuff/check',
            method: 'POST',
            params: {
                'versionID': versionId,
                'newStatus': status,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response)
            window.location.reload(true);
        }).catch(result => {
            console.log(result);
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

    $(function () {
        // Показ полей версии
        $(document).off().on('click', '.nir-version-clickable', function () {
            $(this).parent().parent().find('.nir-version-content').toggle();
        });

        // Показать поля для оценки
        $('.nir-version-send-button').off().on('click', function () {
            $(this).parent().find('.sci-advisor-status-dropdown-content').toggle();
        });

        // Создание новой версии задания НИР
        $('#make-nir-task-button').off().on('click', function () {
            makeTaskVersion('Научно-исследовательская работа');
        });

        // Оценка задания НИР - одобрено
        $('.nir-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            gradeTask(nirVersions, arrayID, 'Одобрено');
        });

        // Оценка задания НИР - замечания
        $('.nir-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            gradeTask(nirVersions, arrayID, 'Замечания');
        });

        // Скачать версию задания НИР
        $('.nir-version-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(nirVersions[arrayID]);
            console.log(nirVersions[arrayID].systemVersionID);
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
        $('.nir-version-delete-button').off().on('click', function (event) {
            console.log('delete');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/scientific_advisor/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: nirVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание науч руком версии отчета НИР
        $('#make-nir-otchet-button').off().on('click', function (event) {
            $('#nir-otchet-file-input').trigger('click');
        });

        // Оценка отчёта НИР - одобрено
        $('.nir-otchet-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(nirOtchetVersions, arrayID, 'Одобрено');
        });

        // Оценка отчёта НИР - замечания
        $('.nir-otchet-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(nirOtchetVersions, arrayID, 'Замечания');
        });

        // Удаление версии отчёта НИР
        $('.nir-otchet-delete-button').off().on('click', function (event) {
            //console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: nirOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Скачать версию отчёта НИР
        $('.nir-otchet-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            //console.log( $(this).parent().parent() );
            var arrayID = versionId.split('-')[3];

            axios({
                url: apiURL + '/scientific_advisor/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': nirOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание новой версии задания ПП...
        $('#make-long-pp-task-button').off().on('click', function () {
            makeTaskVersion('Практика по получению знаний и умений');
        });

        // Оценка задания ПП... - одобрено
        $('.long-pp-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeTask(longPPData, arrayID, 'Одобрено');
        });

        // Оценка задания ПП... - замечания
        $('.long-pp-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeTask(longPPData, arrayID, 'Замечания');
        });

        // Скачать версию задания ПП...
        $('.long-pp-version-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            console.log(longPPData[arrayID]);
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
        $('.long-pp-version-delete-button').off().on('click', function (event) {
            console.log('delete');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            console.log(arrayID);
            axios({
                url: apiURL + '/scientific_advisor/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: longPPData[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание науч руком версии отчета ПП...
        $('#make-long-pp-otchet-button').off().on('click', function () {
            $('#long-pp-otchet-file-input').trigger('click');
        });

        // Оценка отчёта ПП... - одобрено
        $('.long-pp-otchet-status-odobreno').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            gradeOtchet(longPPOtchetVersions, arrayID, 'Одобрено');
        });

        // Оценка отчёта ПП... - замечания
        $('.long-pp-otchet-status-zamechaniya').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            gradeOtchet(longPPOtchetVersions, arrayID, 'Замечания');
        });

        // Удаление версии отчёта ПП...
        $('.long-pp-otchet-delete-button').off().on('click', function () {
            //console.log('delete otchet');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[4];
            axios({
                url: apiURL + '/scientific_advisor/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: longPPOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Скачать версию отчёта ПП...
        $('.long-pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            //console.log( $(this).parent().parent() );
            var arrayID = versionId.split('-')[4];

            axios({
                url: apiURL + '/scientific_advisor/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': longPPOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание новой версии задания ПП
        $('#make-pp-task-button').off().on('click', function () {
            makeTaskVersion('Преддипломная практика');
        });

        // Оценка задания ПП - одобрено
        $('.pp-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            gradeTask(PPData, arrayID, 'Одобрено');
        });

        // Оценка задания ПП - замечания
        $('.pp-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            gradeTask(PPData, arrayID, 'Замечания');
        });

        // Скачать версию задания ПП
        $('.pp-version-download-button').off().on('click', function (event) {
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
        $('.pp-version-delete-button').off().on('click', function (event) {
            console.log('delete');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/scientific_advisor/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: PPData[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание науч руком версии отчета ПП
        $('#make-pp-otchet-button').off().on('click', function () {
            $('#pp-otchet-file-input').trigger('click');
        });

        // Оценка отчёта ПП - одобрено
        $('.pp-otchet-status-odobreno').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(PPOtchetVersions, arrayID, 'Одобрено');
        });

        // Оценка отчёта ПП - замечания
        $('.pp-otchet-status-zamechaniya').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(PPOtchetVersions, arrayID, 'Замечания');
        });

        // Удаление версии отчёта ПП
        $('.pp-otchet-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: PPOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Скачать версию отчёта ПП
        $('.pp-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': PPOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание новой версии задания ВКР
        $('#make-vkr-task-button').off().on('click', function () {
            makeTaskVersion('ВКР');
        });

        // Оценка задания ВКР - одобрено
        $('.vkr-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            //console.log(vkrTaskVersions[arrayID]);
            gradeTask(vkrTaskVersions, arrayID, 'Одобрено');
        });

        // Оценка задания ВКР - замечания
        $('.vkr-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            gradeTask(vkrTaskVersions, arrayID, 'Замечания');
        });

        // Скачать версию задания ВКР
        $('.vkr-version-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
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
        $('.vkr-version-delete-button').off().on('click', function (event) {
            //console.log('delete');
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            console.log(arrayID);
            axios({
                url: apiURL + '/scientific_advisor/document/task/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrTaskVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Создание науч руком версии отчета ВКР
        $('#make-vkr-otchet-button').off().on('click', function () {
            $('#vkr-otchet-file-input').trigger('click');
        });

        // Оценка отчёта ВКР - одобрено
        $('.vkr-otchet-status-odobreno').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(vkrOtchetVersions, arrayID, 'Одобрено');
        });

        // Оценка отчёта ВКР - замечания
        $('.vkr-otchet-status-zamechaniya').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeOtchet(vkrOtchetVersions, arrayID, 'Замечания');
        });

        // Удаление версии отчёта ВКР
        $('.vkr-otchet-delete-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/report/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Скачать версию отчёта ВКР
        $('.vkr-otchet-download-button').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/download/report',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'type': 'Научно-исследовательская работа',
                    'reportVersion': vkrOtchetVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        /*
        // Создание отзыва ВКР
        $('#make-vkr-review-button').off().on('click', function () {
            $('#vkr-review-file-input').trigger('click');
        });
        */

        // Оценка отзыва ВКР - одобрено
        $('.vkr-review-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrReviewVersions[arrayID].systemVersionID, 'Одобрено');

        });

        // Оценка отзыва ВКР - замечания
        $('.vkr-review-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            //console.log($(this).parent().parent().parent().parent());
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrReviewVersions[arrayID].systemVersionID, 'Замечания');
        });

        // Скачать версию отзыва ВКР
        $('.vkr-review-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: vkrReviewVersions[arrayID].systemVersionID,
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

        // Удалить версию отзыва ВКР
        $('.vkr-review-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            //console.log(arrayID);
            axios({
                url: apiURL + '/scientific_advisor/document/vkr/stuff/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrReviewVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        /*
        // Создание допуска ВКР
        $('#make-vkr-review-button').off().on('click', function () {
            $('#vkr-review-file-input').trigger('click');
        });
        */

        // Оценка допуска ВКР - одобрено
        $('.vkr-dopusk-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrDopuskVersions[arrayID].systemVersionID, 'Одобрено');

        });

        // Оценка допуска ВКР - замечания
        $('.vkr-dopusk-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            //console.log($(this).parent().parent().parent().parent());
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrDopuskVersions[arrayID].systemVersionID, 'Замечания');
        });

        // Скачать версию допуска ВКР
        $('.vkr-dopusk-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: vkrDopuskVersions[arrayID].systemVersionID,
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

        // Удалить версию допуска ВКР
        $('.vkr-dopusk-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/vkr/stuff/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrDopuskVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        /*
        // Создание антиплагиата ВКР
        $('#make-vkr-review-button').off().on('click', function () {
            $('#vkr-review-file-input').trigger('click');
        });
        */

        // Оценка антиплагиата ВКР - одобрено
        $('.vkr-antiplagiat-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrAntiplagiatVersions[arrayID].systemVersionID, 'Одобрено');

        });

        // Оценка антиплагиата ВКР - замечания
        $('.vkr-antiplagiat-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            //console.log($(this).parent().parent().parent().parent());
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrAntiplagiatVersions[arrayID].systemVersionID, 'Замечания');
        });

        // Скачать версию антиплагиата ВКР
        $('.vkr-antiplagiat-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: vkrAntiplagiatVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчет о прохождении проверки на антиплагиат.docx');
                document.body.appendChild(link);
                link.click();
            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию антиплагиата ВКР
        $('.vkr-antiplagiat-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/vkr/stuff/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrAntiplagiatVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        /*
        // Создание презентации ВКР
        $('#make-vkr-review-button').off().on('click', function () {
            $('#vkr-review-file-input').trigger('click');
        });
        */

        // Оценка презентации ВКР - одобрено
        $('.vkr-presentation-status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrPrezentationVersions[arrayID].systemVersionID, 'Одобрено');

        });

        // Оценка презентации ВКР - замечания
        $('.vkr-presentation-status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            //console.log($(this).parent().parent().parent().parent());
            var arrayID = versionId.split('-')[3];
            gradeVkrStuff(vkrPrezentationVersions[arrayID].systemVersionID, 'Замечания');
        });

        // Скачать версию презентации ВКР
        $('.vkr-presentation-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/document/download/version',
                method: 'GET',
                responseType: 'blob',
                params: {
                    versionID: vkrPrezentationVersions[arrayID].systemVersionID,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Презентация по ВКР.pptx');
                document.body.appendChild(link);
                link.click();
            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить версию презентации ВКР
        $('.vkr-presentation-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[3];
            axios({
                url: apiURL + '/scientific_advisor/document/vkr/stuff/version/delete',
                method: 'DELETE',
                params: {
                    versionID: vkrPrezentationVersions[arrayID].systemVersionID,
                    'studentID': sessionStorage.getItem('viewedStudentId'),
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

        // Функция кнопки "перенести в меню" для задания НИР
        $('.nir-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];
            if (themeConfirmed != 'Одобрена') {
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

            if (themeConfirmed != 'Одобрена') {
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

            if (themeConfirmed != 'Одобрена') {
                setStudentTheme(PPData[arrayID].theme);
            }
            setToExplore(PPData[arrayID].toExplore);
            setToCreate(PPData[arrayID].toCreate);
            setToFamiliarize(PPData[arrayID].toFamiliarize);
            setAdditionalTask(PPData[arrayID].additionalTask);
        });

        // Функция кнопки "перенести в меню" для отчета НИР
        $('.nir-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[3];

            setDetailedDescription(nirOtchetVersions[id].detailedContent);
            setConclusion(nirOtchetVersions[id].advisorConclusion);
        });

        // Функция кнопки "перенести в меню" для отчета НИР
        $('.long-pp-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[4];

            setDetailedDescriptionLongPP(longPPOtchetVersions[id].detailedContent);
            setConclusionLongPP(longPPOtchetVersions[id].advisorConclusion);
        });

        // Функция кнопки "перенести в меню" для отчета НИР
        $('.pp-otchet-copy').off().on('click', function () {
            var id = $(this).attr('id').split('-')[3];

            setDetailedDescriptionPP(PPOtchetVersions[id].detailedContent);
            setConclusionPP(PPOtchetVersions[id].advisorConclusion);
        });

        // Функция кнопки "перенести в меню" для задания ВКР
        $('.vkr-copy').off().on('click', function () {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID = versionId.split('-')[2];

            if (themeConfirmed != 'Одобрена') {
                setStudentTheme(vkrTaskVersions[arrayID].theme);
            }
            setVkrDocs(vkrTaskVersions[arrayID].vkrDocs);
            setVkrAims(vkrTaskVersions[arrayID].vkrAim);
            setVkrTasks(vkrTaskVersions[arrayID].vkrTasks);
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
                default:
                    console.log('View error');
            }
        })
    });

    return (
        <div>
            <div className='sci-advisor-students-form'>
                <Table striped bordered hover style={{ width: '1488px', marginLeft: 'auto', marginRight: 'auto', }}>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>ФИО</th>
                            <th>Тема - {themeConfirmed}</th>
                            <th style={{ minWidth: '203px' }}>НИР</th>
                            <th style={{ minWidth: '278px' }}>ПпППУиОПД</th>
                            <th style={{ minWidth: '193px' }}>ПП</th>
                            <th style={{ minWidth: '243px' }}>ВКР</th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body' className='size-24 dark'>

                    </tbody>
                </Table>
            </div>
            <Form className='info-form light-background'>
                <Tabs defaultActiveKey='info1' className='info-form-main-tabs sca-tabs' onSelect={(firstTab) => {
                    $('.sca-tab-header').removeClass('sca-tab-header-active');
                    switch (firstTab) {
                        case 'info1':
                            $('#header-1').addClass('sca-tab-header-active');
                            break;
                        case 'info2':
                            $('#header-2').addClass('sca-tab-header-active');
                            break;
                        case 'info3':
                            $('#header-3').addClass('sca-tab-header-active');
                            break;
                        case 'info4':
                            $('#header-4').addClass('sca-tab-header-active');
                            break;
                        default:
                            console.log('tabError');
                    }
                }}>
                    <Tab eventKey='info1' title={<p id='header-1' className='light-background light size-30 sca-tab-header sca-tab-header-active' style={{ lineHeight: '45px' }}>Научно-исследовательская работа</p>} className='info-form-tabs'>

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

                                            <button type='button' id='make-nir-task-button' className='size-30 light dark-background info-button-1'>
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
                                            makeNirOtchet(e.target.files[0]);
                                        }
                                    }} ></input>

                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey='info2' title={<p id='header-2' className='light-background light size-30 sca-tab-header' style={{ marginLeft: '14px' }}>ПпППУиОПД</p>}>

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
                    <Tab eventKey='info3' title={<p id='header-3' className='light-background light size-30 sca-tab-header' style={{ marginLeft: '14px' }}>Преддипломная практика</p>}>

                        <Tabs defaultActiveKey='none' onSelect={() => { setTimeout(function () { window.scrollTo(0, 2000); }, 1); }} className='info-form-subtab light-background container-fluid'>
                            <Tab eventKey='info21' title={
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
                            <Tab eventKey='info22' title={
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
                                        if (e.target.files.length !== 0) {
                                            //makeOtchetVersion(e.target.files[0], 'Преддипломная практика');
                                        }
                                    }} ></input>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey='info4' title={<p id='header-4' className='light-background light size-30 sca-tab-header' style={{ marginLeft: '13px' }}>Защита ВКР</p>}>
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

                                        <button disabled type='button' id='make-vkr-review-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                            <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                            <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отзыва научного руководителя</p></div>
                                        </button>
                                        <input id='vkr-review-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                            if (e.target.files.length !== 0) {
                                                if (vkrReviewVersions.length == 0) {
                                                    //uploadDocument(e.target.files[0], 'ВКР', 'Отзыв');
                                                }
                                                else {
                                                    //uploadDocumentVersion(e.target.files[0], vkrReviewVersions[0].systemDocumentID, 'Отзыв версия')
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

                                    <button disabled type='button' id='make-vkr-dopusk-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />допуска к защите ВКР</p></div>
                                    </button>
                                    <input id='vkr-dopusk-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrDopuskVersions.length == 0) {
                                                //uploadDocument(e.target.files[0], 'ВКР', 'Допуск');
                                            }
                                            else {
                                                //uploadDocumentVersion(e.target.files[0], vkrDopuskVersions[0].systemDocumentID, 'Допуск версия')
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

                                    <button disabled type='button' id='make-vkr-task-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
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

                                    <button disabled type='button' id='make-vkr-otchet-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '480px', marginLeft: '505px' }}>
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

                                    <button disabled type='button' id='make-vkr-antiplagiat-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />отчета об антиплагиате</p></div>
                                    </button>
                                    <input id='vkr-antiplagiat-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrAntiplagiatVersions.length == 0) {
                                                //uploadDocument(e.target.files[0], 'ВКР', 'Антиплагиат');
                                            }
                                            else {
                                                //uploadDocumentVersion(e.target.files[0], vkrAntiplagiatVersions[0].systemDocumentID, 'Антиплагиат версия')
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

                                    <button disabled type='button' id='make-vkr-presentation-button' className='size-30 light dark-background info-button-1' style={{ height: '100px', width: '670px', marginLeft: '410px' }}>
                                        <Image src={iconDocument} thumbnail className='dark-background thumbnail-icon' style={{ position: 'relative', top: '-25px' }} />
                                        <div style={{ display: 'inline-block' }}><p style={{ marginBottom: '0px' }}>Загрузить новую версию<br />презентации</p></div>
                                    </button>
                                    <input id='vkr-presentation-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files.length !== 0) {
                                            if (vkrPrezentationVersions.length == 0) {
                                                //uploadDocument(e.target.files[0], 'ВКР', 'Презентация');
                                            }
                                            else {
                                                //uploadDocumentVersion(e.target.files[0], vkrPrezentationVersions[0].systemDocumentID, 'Презентация версия')
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