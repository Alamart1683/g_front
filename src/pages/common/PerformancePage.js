import React, { useState } from 'react';
import { Table, Image } from 'react-bootstrap';
import { useAuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../../Config';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function PerformancePage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [lastSearch, setLastSearch] = useState('');
    const [performanceData, setPerformanceData] = useState([]);

    if (!fetchedData) {
        setFetchedData(true);
        getPerformanceData();
    }

    function getPerformanceData() {
        axios({
            url: apiURL + '/scientific_advisor/student/active/for/',
            method: 'GET',
            params: {
                'key': 'all',
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setPerformanceData(response.data);
            showPerformanceData(response.data);
        }).catch(result => {
            console.log(result);
        });
    }

    function fillSelects(studentArray) {
        var groups = [];
        var specialities = [];
        for (var i = 0; i < studentArray.length; i++) {
            var student = studentArray[i];
            if (!groups.includes(student.group)) {
                groups.push(student.group);

                var group = document.createElement('option');
                group.innerText = student.group;
                document.value = student.group;
                document.getElementById('group-select').appendChild(group);
            }
            if (!specialities.includes(student.specialityCode)) {
                specialities.push(student.specialityCode);

                var speciality = document.createElement('option');
                speciality.innerText = student.specialityCode;
                document.value = student.specialityCode;
                document.getElementById('speciality-select').appendChild(speciality);
            }
        }
    }

    function showPerformanceData(dataArray) {
        fillSelects(dataArray);
        for (var i = 0; i < dataArray.length; i++) {
            var item = dataArray[i];

            var student = document.createElement('tr');
            student.id = 'student-' + i;
            student.className = 'size-20 dark table-row';

            var studentNum = document.createElement('th');
            studentNum.className = 'row-num';
            studentNum.innerText = i + 1;

            // Имя студента
            var studentFio = document.createElement('th');
            studentFio.className = 'student-fio';

            var popover = document.createElement('a');
            popover.href = '#';
            popover.onclick = 'return false;';
            popover.className = 'student-popover dark';
            $(popover).attr('data-toggle', 'popover');
            $(popover).attr('title', 'Данные студента:');
            $(popover).attr('data-html', 'true');
            $(popover).attr('data-content', "Имя: " + item.fio +
                "<br /> Телефон: " + item.phone +
                "<br /> Почта: " + item.email);
            popover.innerText = item.fio.split(' ')[0] +
                ' ' +
                item.fio.split(' ')[1].charAt(0) +
                '. ' +
                item.fio.split(' ')[2].charAt(0) +
                '.';

            var advisorFio = document.createElement('th');
            advisorFio.innerText = item.advisorFIO;
            advisorFio.className = 'advisor-fio';

            // Тема студента
            var studentTheme = document.createElement('th');
            studentTheme.innerText = item.studentVkrTheme;
            if (item.studentVkrThemeEditable) {
                studentTheme.innerText += ' - Не одобрено';
            }
            else {
                studentTheme.innerText += ' - Одобрено';
            }
            studentTheme.style.overflow = 'hidden';
            studentTheme.style.textOverflow = 'ellipsis';
            studentTheme.style.maxWidth = '300px';

            var studentGroup = document.createElement('th');
            studentGroup.className = 'student-group';
            studentGroup.innerText = item.group;

            var studentSpeciality = document.createElement('th');
            studentSpeciality.className = 'student-speciality';
            studentSpeciality.innerText = item.specialityCode;

            // НИР
            var nirTaskStatus = document.createElement('label');
            nirTaskStatus.innerText = 'Задание на НИР:';
            nirTaskStatus.style.width = '223px';

            var nirTaskCheckbox = document.createElement('input');
            nirTaskCheckbox.type = 'checkbox';
            nirTaskCheckbox.className = 'sci-table-checkbox nir-task-checkbox';
            if (item.studentDocumentsStatusView.nirTaskStatus) {
                nirTaskCheckbox.checked = true;
            }
            nirTaskCheckbox.style.marginLeft = '22px';

            var nirTaskDiv = document.createElement('div');

            var nirReportStatus = document.createElement('label');
            nirReportStatus.innerText = 'Отчет по НИР:';
            nirReportStatus.style.width = '223px';

            var nirReportMark = document.createElement('p');
            nirReportMark.innerText = getStatus(item.studentDocumentsStatusView.nirReportStatus);
            nirReportMark.className = 'table-report-mark-text nir-report-status';

            var nirReportDiv = document.createElement('div');

            var longPPTaskStatus = document.createElement('label');
            longPPTaskStatus.innerText = 'Задание по ПпППУиОПД:';
            longPPTaskStatus.style.width = '223px';

            var longPPTaskCheckbox = document.createElement('input');

            longPPTaskCheckbox.type = 'checkbox';
            longPPTaskCheckbox.className = 'sci-table-checkbox longpp-task-checkbox';
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
            longPPReportMark.className = 'table-report-mark-text longpp-report-status';

            var longPPReportDiv = document.createElement('div');

            var ppTaskStatus = document.createElement('label');
            ppTaskStatus.innerText = 'Задание по ПП:';
            ppTaskStatus.style.width = '223px';

            var ppTaskCheckbox = document.createElement('input');

            ppTaskCheckbox.type = 'checkbox';
            ppTaskCheckbox.className = 'sci-table-checkbox pp-task-checkbox';
            if (item.studentDocumentsStatusView.ppTaskStatus) {
                ppTaskCheckbox.checked = true;
            }
            ppTaskCheckbox.style.marginLeft = '22px';

            var ppTaskDiv = document.createElement('div');

            var ppReportStatus = document.createElement('label');
            ppReportStatus.innerText = 'Отчет по ПП:';
            ppReportStatus.style.width = '223px';

            var ppReportMark = document.createElement('p');
            ppReportMark.innerText = getStatus(item.studentDocumentsStatusView.ppReportStatus);
            ppReportMark.className = 'table-report-mark-text pp-report-status';

            var ppReportDiv = document.createElement('div');

            var vkrTaskStatus = document.createElement('label');
            vkrTaskStatus.innerText = 'Задание ВКР:';
            vkrTaskStatus.style.width = '223px';

            var vkrTaskCheckbox = document.createElement('input');

            vkrTaskCheckbox.type = 'checkbox';
            vkrTaskCheckbox.className = 'sci-table-checkbox vkr-task-checkbox';
            if (item.studentDocumentsStatusView.vkrTask) {
                vkrTaskCheckbox.checked = true;
            }
            vkrTaskCheckbox.style.marginLeft = '22px';

            var vkrTaskDiv = document.createElement('div');

            var vkrRPZStatus = document.createElement('label');
            vkrRPZStatus.innerText = 'РПЗ:';
            vkrRPZStatus.style.width = '223px';

            var vkrRPZMark = document.createElement('p');
            vkrRPZMark.innerText = getStatus(item.studentDocumentsStatusView.vkrRPZ);
            vkrRPZMark.className = 'table-report-mark-text vkr-report-status';

            var vkrRPZHocCheckbox = document.createElement('input');

            vkrRPZHocCheckbox.type = 'checkbox';
            vkrRPZHocCheckbox.className = 'sci-table-checkbox';
            if (item.studentDocumentsStatusView.vkrRPZHocRate) {
                vkrRPZHocCheckbox.checked = true;
            }

            var vkrRPZDiv = document.createElement('div');

            var studentPerformance = document.createElement('th');

            student.appendChild(studentNum);
            studentFio.appendChild(popover);
            student.appendChild(studentFio);
            student.appendChild(advisorFio);
            student.appendChild(studentTheme);
            student.appendChild(studentGroup);
            student.appendChild(studentSpeciality);

            nirTaskDiv.appendChild(nirTaskStatus);
            nirTaskDiv.appendChild(nirTaskCheckbox);
            studentPerformance.appendChild(nirTaskDiv);
            nirReportDiv.appendChild(nirReportStatus);
            nirReportDiv.appendChild(nirReportMark);
            studentPerformance.appendChild(nirReportDiv);

            longPPTaskDiv.appendChild(longPPTaskStatus);
            longPPTaskDiv.appendChild(longPPTaskCheckbox);
            studentPerformance.appendChild(longPPTaskDiv);
            longPPReportDiv.appendChild(longPPReportStatus);
            longPPReportDiv.appendChild(longPPReportMark);
            studentPerformance.appendChild(longPPReportDiv);

            ppTaskDiv.appendChild(ppTaskStatus);
            ppTaskDiv.appendChild(ppTaskCheckbox);
            studentPerformance.appendChild(ppTaskDiv);
            ppReportDiv.appendChild(ppReportStatus);
            ppReportDiv.appendChild(ppReportMark);
            studentPerformance.appendChild(ppReportDiv);

            vkrTaskDiv.appendChild(vkrTaskStatus);
            vkrTaskDiv.appendChild(vkrTaskCheckbox);
            studentPerformance.appendChild(vkrTaskDiv);
            vkrRPZDiv.appendChild(vkrRPZStatus);
            vkrRPZDiv.appendChild(vkrRPZMark);
            studentPerformance.appendChild(vkrRPZDiv);

            student.appendChild(studentPerformance);

            document.getElementById('performance-table-body').appendChild(student);
        }
        document.getElementById('performance-button').disabled = false;
    }

    function getStatus(status) {
        switch (status) {
            case 0:
                return '     -';
            case 2:
                return 'НЕУД.';
            case 3:
                return 'УДОВЛ.';
            case 4:
                return '  ХОР.';
            case 5:
                return '  ОТЛ.';
            default:
                return '  ???';
        }
    }

    function setTableNums() {
        $('.table-row:visible').each(function (index) {
            $(this).find('.row-num')[0].innerText = index + 1;
        })
    }

    // Поиск по таблице
    function searchTable() {
        var input = $('#tableSearch')[0].value.toUpperCase();
        var rows = $('.table-row');
        setLastSearch(input);

        for (var i = 0; i < rows.length; i++) {
            var rowText = rows[i].querySelector('.advisor-fio').textContent.toUpperCase() +
                ' ' +
                rows[i].querySelector('.student-fio').textContent.toUpperCase();
            if (rowText.indexOf(input) > -1) {
                rows[i].classList.remove('hoc-table-search-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-search-hidden');
            }
        }
        setTableNums();
    }

    // Фильтрация по специальности
    function filterSpecialty() {
        var speciality = $('#speciality-select :selected').val();
        var rows = $('.table-row');
        for (var i = 0; i < rows.length; i++) {
            var rowSpeciality = rows[i].querySelector('.student-speciality').textContent;
            if (rowSpeciality === speciality || speciality === '') {
                rows[i].classList.remove('hoc-table-speciality-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-speciality-hidden');
            }
        }
        setTableNums();
    }

    // Фильтрация по группе
    function filterGroups() {
        var group = $('#group-select :selected').val();
        var rows = $('.table-row');
        for (var i = 0; i < rows.length; i++) {
            var rowGroup = rows[i].querySelector('.student-group').textContent;
            if (rowGroup === group || group === '') {
                rows[i].classList.remove('hoc-table-group-hidden');
            }
            else {
                rows[i].classList.add('hoc-table-group-hidden');
            }
        }
        setTableNums();
    }

    function filterStage() {
        var stage = $('#stage-select :selected').val();
        var rows = $('.table-row');
        var status;
        for (var i = 0; i < rows.length; i++) {
            switch (stage) {
                case 'НИР - Задание не сдано':
                    if (!rows[i].querySelector('.nir-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'НИР - Задание сдано':
                    if (rows[i].querySelector('.nir-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'НИР - Отчет не сдан':
                    status = rows[i].querySelector('.nir-report-status').textContent;
                    if (status === '     -' || status === 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'НИР - Отчет сдан':
                    status = rows[i].querySelector('.nir-report-status').textContent;
                    if (status !== '     -' && status !== 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПпППУиОПД - Задание не сдано':
                    if (!rows[i].querySelector('.longpp-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПпППУиОПД - Задание сдано':
                    if (rows[i].querySelector('.longpp-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПпППУиОПД - Отчет не сдан':
                    status = rows[i].querySelector('.longpp-report-status').textContent;
                    if (status === '     -' || status === 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПпППУиОПД - Отчет сдан':
                    status = rows[i].querySelector('.longpp-report-status').textContent;
                    if (status !== '     -' && status !== 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПП - Задание не сдано':
                    if (!rows[i].querySelector('.pp-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПП - Задание сдано':
                    if (rows[i].querySelector('.pp-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПП - Отчет не сдан':
                    status = rows[i].querySelector('.pp-report-status').textContent;
                    if (status === '     -' || status === 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ПП - Отчет сдан':
                    status = rows[i].querySelector('.pp-report-status').textContent;
                    if (status !== '     -' && status !== 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ВКР - Задание не сдано':
                    if (!rows[i].querySelector('.vkr-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ВКР - Задание сдано':
                    if (rows[i].querySelector('.vkr-task-checkbox').checked) {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ВКР - Отчет не сдан':
                    status = rows[i].querySelector('.vkr-report-status').textContent;
                    if (status === '     -' || status === 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                case 'ВКР - Отчет сдан':
                    status = rows[i].querySelector('.vkr-report-status').textContent;
                    if (status !== '     -' && status !== 'НЕУД.') {
                        rows[i].classList.remove('hoc-table-stage-hidden');
                    }
                    else {
                        rows[i].classList.add('hoc-table-stage-hidden');
                    }
                    break;
                default:
                    rows[i].classList.remove('hoc-table-stage-hidden');
                    break;
            }
        }
        setTableNums();
    }

    $(function () {

        $('#performance-button').off().on('click', function () {
            document.getElementById('performance-button').disabled = true;
            var stageKey;
            switch ($('#stage-select :selected').val()) {
                case 'НИР - Задание не сдано':
                    stageKey = 1;
                    break;
                case 'НИР - Задание сдано':
                    stageKey = 1;
                    break;
                case 'НИР - Отчет не сдан':
                    stageKey = 1;
                    break;
                case 'НИР - Отчет сдан':
                    stageKey = 1;
                    break;
                case 'ПпППУиОПД - Задание не сдано':
                    stageKey = 2;
                    break;
                case 'ПпППУиОПД - Задание сдано':
                    stageKey = 2;
                    break;
                case 'ПпППУиОПД - Отчет не сдан':
                    stageKey = 2;
                    break;
                case 'ПпППУиОПД - Отчет сдан':
                    stageKey = 2;
                    break;
                case 'ПП - Задание не сдано':
                    stageKey = 3;
                    break;
                case 'ПП - Задание сдано':
                    stageKey = 3;
                    break;
                case 'ПП - Отчет не сдан':
                    stageKey = 3;
                    break;
                case 'ПП - Отчет сдан':
                    stageKey = 3;
                    break;
                case 'ВКР - Задание не сдано':
                    stageKey = 4;
                    break;
                case 'ВКР - Задание сдано':
                    stageKey = 4;
                    break;
                case 'ВКР - Отчет не сдан':
                    stageKey = 4;
                    break;
                case 'ВКР - Отчет сдан':
                    stageKey = 4;
                    break;
                default:
                    stageKey = 0;
            }

            var outgoingJson = {};

            var columnJson = [];
            columnJson.push('ФИО Научного Руководителя');
            columnJson.push('ФИО Студента');
            columnJson.push('Группа');
            switch (stageKey) {
                case 1:
                    columnJson.push('Задание на НИР');
                    columnJson.push('Отчет по НИР');
                    break;
                case 2:
                    columnJson.push('Задание по ПпППУиОПД');
                    columnJson.push('Отчет по ПпППУиОПД');
                    break;
                case 3:
                    columnJson.push('Задание по ПП');
                    columnJson.push('Отчет по ПП');
                    break;
                case 4:
                    columnJson.push('Задание ВКР');
                    columnJson.push('РПЗ');
                    break;
                default:
                    columnJson.push('Задание на НИР');
                    columnJson.push('Отчет по НИР');
                    columnJson.push('Задание по ПпППУиОПД');
                    columnJson.push('Отчет по ПпППУиОПД');
                    columnJson.push('Задание по ПП');
                    columnJson.push('Отчет по ПП');
                    columnJson.push('Задание ВКР');
                    columnJson.push('РПЗ');
            }

            outgoingJson.columnsHeaders = columnJson;
            var dataJson = [];

            $('.table-row:visible').each(function () {
                var studentId = $(this).attr('id').split('-')[1];
                var student = performanceData[studentId];

                var studentJson = [];
                studentJson.push(student.advisorFIO);
                studentJson.push(student.fio);
                studentJson.push(student.group);
                switch (stageKey) {
                    case 1:
                        studentJson.push(student.studentDocumentsStatusView.nirTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.nirReportStatus);
                        break;
                    case 2:
                        studentJson.push(student.studentDocumentsStatusView.ppppuipdTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppppuipdReportStatus);
                        break;
                    case 3:
                        studentJson.push(student.studentDocumentsStatusView.ppTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppReportStatus);
                        break;
                    case 4:
                        studentJson.push(student.studentDocumentsStatusView.vkrTask);
                        studentJson.push(student.studentDocumentsStatusView.vkrRPZ);
                        break;
                    default:
                        studentJson.push(student.studentDocumentsStatusView.nirTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.nirReportStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppppuipdTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppppuipdReportStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppTaskStatus);
                        studentJson.push(student.studentDocumentsStatusView.ppReportStatus);
                        studentJson.push(student.studentDocumentsStatusView.vkrTask);
                        studentJson.push(student.studentDocumentsStatusView.vkrRPZ);
                }
                
                dataJson.push(studentJson);
            });

            outgoingJson.rowsContent = dataJson;
            console.log(JSON.stringify(outgoingJson));

            axios({
                url: apiURL + '/head_of_cathedra/document/download/dynamic_report/',
                method: 'POST',
                responseType: 'blob',
                data: JSON.stringify(outgoingJson),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Отчет об успеваемости.xlsx');
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result);
            });
            document.getElementById('performance-button').disabled = false;
        });

        $('[data-toggle="popover"]').popover();

        $(".student-popover").on('click', function (e) {
            e.preventDefault();
        });

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        $('.sci-table-checkbox').off().on('click', function (e) {
            e.preventDefault();
        });
    });

    return (
        <div className='hoc-assoc-div'>
            <div className='hoc-assoc-menu-div light-background'>
                <input id='tableSearch' type='text' className='hoc-table-search dark size-32' />
                <button type='button' onClick={() => { searchTable(); }} className='hoc-table-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
                <div className='hoc-assoc-select-div'>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Направление:</p>
                    <select id='speciality-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => { filterSpecialty(); }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{ marginLeft: '28px' }}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Группа:</p>
                    <select id='group-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => { filterGroups(); }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{ marginLeft: '28px' }}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Этап:</p>
                    <select id='stage-select' className='dark size-30 hoc-assoc-select' style={{ width: '450px' }} defaultValue='' onChange={(e) => { filterStage(); }}>
                        <option value=''>Все</option>
                        <option value='НИР - Задание не сдано'>НИР - Задание не сдано</option>
                        <option value='НИР - Задание сдано'>НИР - Задание сдано</option>
                        <option value='НИР - Отчет не сдан'>НИР - Отчет не сдан</option>
                        <option value='НИР - Отчет сдан'>НИР - Отчет сдан</option>
                        <option value='ПпППУиОПД - Задание не сдано'>ПпППУиОПД - Задание не сдано</option>
                        <option value='ПпППУиОПД - Задание сдано'>ПпППУиОПД - Задание сдано</option>
                        <option value='ПпППУиОПД - Отчет не сдан'>ПпППУиОПД - Отчет не сдан</option>
                        <option value='ПпППУиОПД - Отчет сдан'>ПпППУиОПД - Отчет сдан</option>
                        <option value='ПП - Задание не сдано'>ПП - Задание не сдано</option>
                        <option value='ПП - Задание сдано'>ПП - Задание сдано</option>
                        <option value='ПП - Отчет не сдан'>ПП - Отчет не сдан</option>
                        <option value='ПП - Отчет сдан'>ПП - Отчет сдан</option>
                        <option value='ВКР - Задание не сдано'>ВКР - Задание не сдано</option>
                        <option value='ВКР - Задание сдано'>ВКР - Задание сдано</option>
                        <option value='ВКР - Отчет не сдан'>ВКР - Отчет не сдан</option>
                        <option value='ВКР - Отчет сдан'>ВКР - Отчет сдан</option>
                    </select>
                </div>
                <button disabled type='button' id='performance-button' className='dark-background light size-24 hoc-assoc-after-select hoc-assoc-button' style={{ marginLeft: '272px' }}>
                    Сохранить отчёт<br />об успеваемости
                </button>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО Студента</th>
                            <th>ФИО Научного Руководителя</th>
                            <th >Тема</th>
                            <th style={{ minWidth: '140px' }}>Группа</th>
                            <th >Направление</th>
                            <th style={{ minWidth: '316px' }}>Успеваемость</th>
                        </tr>
                    </thead>
                    <tbody id='performance-table-body'>

                    </tbody>
                </Table>
            </div>
        </div>
    );
}