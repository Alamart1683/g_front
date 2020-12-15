import React, { useState, useEffect } from 'react';
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

    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
        showPerformanceData(performanceData);
    }, [performanceData]);
    
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
        }).catch(result => {
            console.log(result);
        });
    }

    function showPerformanceData(dataArray) {
        for (var i = 0; i < dataArray.length; i++) {
            var item = dataArray[i];

            var student = document.createElement('tr');
            student.id = 'student' + i;
            student.className = 'size-20 dark';

            var studentNum = document.createElement('th');
            studentNum.innerText = i + 1;

            // Имя студента
            var studentFio = document.createElement('th');

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
            studentGroup.innerText = item.group;
            
            var studentSpeciality = document.createElement('th');
            studentSpeciality.innerText = item.specialityCode;

            // НИР
            var studentNir = document.createElement('th');

            var nirTaskStatus = document.createElement('label');
            nirTaskStatus.innerText = 'Задание на НИР:';
            nirTaskStatus.style.width = '223px';

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
            nirReportStatus.style.width = '223px';

            var nirReportMark = document.createElement('p');
            nirReportMark.innerText = getStatus(item.studentDocumentsStatusView.nirReportStatus);
            nirReportMark.className = 'table-report-mark-text';

            var nirReportDiv = document.createElement('div');

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

            var ppTaskStatus = document.createElement('label');
            ppTaskStatus.innerText = 'Задание по ПП:';
            ppTaskStatus.style.width = '223px';
            
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
            ppReportStatus.style.width = '223px';

            var ppReportMark = document.createElement('p');
            ppReportMark.innerText = getStatus(item.studentDocumentsStatusView.ppReportStatus);
            ppReportMark.className = 'table-report-mark-text';

            var ppReportDiv = document.createElement('div');

            var vkrTaskStatus = document.createElement('label');
            vkrTaskStatus.innerText = 'Задание ВКР:';
            vkrTaskStatus.style.width = '223px';

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
            vkrRPZStatus.style.width = '223px';

            var vkrRPZMark = document.createElement('p');
            vkrRPZMark.innerText = getStatus(item.studentDocumentsStatusView.vkrRPZ);
            vkrRPZMark.className = 'table-report-mark-text';

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
    }
    
    function getStatus(status) {
        switch (status) {
            case 0:
                return '     -';
            case 2:
                return 'неуд.';
            case 3:
                return 'удовл.';
            case 4:
                return '  хор.';
            case 5:
                return '  отл.';
            default:
                return '  ???';
        }
    }

    $(function () {

        $('#performance-button').off().on('click', function () {
            axios({
                url: apiURL + '/head_of_cathedra/document/download/cathedta_report/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'key': 'all',
                },
                headers: {
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

    return(
        <div className='hoc-assoc-div'>
            <div className='hoc-assoc-menu-div light-background'>
                <input id='tableSearch' type='text' className='hoc-table-search dark size-32' />
                <button type='button' onClick={() => {  }} className='hoc-table-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
                <div className='hoc-assoc-select-div'>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Направление:</p>
                    <select id='speciality-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {  }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <div className='hoc-assoc-select-div' style={{ marginLeft: '28px' }}>
                    <p className='dark size-24 hoc-assoc-select-div-title'>Группа:</p>
                    <select id='group-select' className='dark size-30 hoc-assoc-select' defaultValue='' onChange={(e) => {  }}>
                        <option value=''>Все</option>
                    </select>
                </div>
                <button type='button' id='performance-button' className='dark-background light size-24 hoc-assoc-after-select hoc-assoc-button' style={{ marginLeft: '600px' }}>
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