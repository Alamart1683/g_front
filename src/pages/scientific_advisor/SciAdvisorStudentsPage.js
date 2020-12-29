import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function SciAdvisorStudentsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        showStudents(students);
    });

    if (!fetchedData) {
        setFetchedData(true);
        getStudents();
    }

    // Получение данных о студентах
    function getStudents() {
        axios({
            url: apiURL + '/scientific_advisor/student/active',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setStudents(response.data);
        }).catch(result => {
            //console.log(result.data);
        });
    }

    // Заполнение таблицы студентов
    function showStudents(studentArray) {
        for (var i = 0; i < studentArray.length; i++) {
            var item = studentArray[i];
            //console.log(item);

            var student = document.createElement('tr');
            student.id = 'student' + i;
            student.className = 'size-20 dark';

            var studentNum = document.createElement('th');
            studentNum.innerText = i + 1;

            // Имя студента
            var studentFio = document.createElement('th');

            var projectArea = 'Комплексный проект не назначен';
            if (item.projectArea !== 'Нет проектной области') {
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
                ' ' +
                item.fio.split(' ')[1].charAt(0) +
                '. ' +
                item.fio.split(' ')[2].charAt(0) +
                '.';

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

            var vkrRPZHocCheckbox = document.createElement('input');

            vkrRPZHocCheckbox.type = 'checkbox';
            vkrRPZHocCheckbox.className = 'sci-table-checkbox';
            if (item.studentDocumentsStatusView.vkrRPZHocRate) {
                vkrRPZHocCheckbox.checked = true;
            }
            
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

            var studentButtonTh = document.createElement('th');
            var studentButton = document.createElement('button');
            //studentButton.style.minWidth = '100px';
            studentButton.className = 'student-table-button';
            studentButton.innerText = 'Перейти к студенту';
            studentButton.id = 'student-table-button-' + i;

            student.appendChild(studentNum);
            studentFio.appendChild(popover);
            student.appendChild(studentFio);

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

            studentButtonTh.appendChild(studentButton);
            student.appendChild(studentButtonTh);
            document.getElementById('student-table-body').appendChild(student);
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

        $('.student-table-button').off().on('click', function () {
            var arrayId = $(this).attr('id').split('-')[3];
            sessionStorage.setItem('viewedStudentId', students[arrayId].systemStudentID);
            sessionStorage.setItem('viewedStudentName', students[arrayId].fio);
            setRedirect(true);
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
        <div className='sci-advisor-students-form'>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО</th>
                            <th>Тема</th>
                            <th style={{ minWidth: '241px' }}>НИР</th>
                            <th style={{ minWidth: '316px' }}>ПпППУиОПД</th>
                            <th style={{ minWidth: '231px' }}>ПП</th>
                            <th style={{ minWidth: '281px' }}>ВКР</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body'>

                    </tbody>
                </Table>
            </div>

            { redirect ? (<Redirect push to='/sca-stu/view' />) : null}
        </div>
    );
}