import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
//import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function SciAdvisorStudentsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        showStudents(students);
    }, [students]);

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
            console.log(result.data);
        });
    }

    // TODO Show project name or shortened project name
    // Заполнение таблицы студентов
    function showStudents(studentArray) {
        for (var i=0; i<studentArray.length; i++) {
            var item = studentArray[i];
            //console.log(item);

            var student = document.createElement('tr');
            student.id = 'student' + i;
            student.className = 'size-20 dark';

            var studentNum = document.createElement('th');
            studentNum.innerText = i+1;

            // Имя студента
            var studentFio = document.createElement('th');

            var popover = document.createElement('a');
            popover.href='javascript:void(0);';
            popover.className = 'student-popover dark size-24';
            $(popover).attr('data-toggle', 'popover');
            $(popover).attr('title', 'Данные студента:');
            $(popover).attr('data-html', 'true');
            $(popover).attr('data-content', "Имя: " + item.fio + 
                                            "<br /> Группа: " + item.group + 
                                            "<br /> Телефон: " + item.phone +
                                            "<br /> Почта: " + item.email);
            popover.innerText = item.fio.split(' ')[0] + 
                                '. ' + 
                                item.fio.split(' ')[1].charAt(0)  + 
                                '. ' + 
                                item.fio.split(' ')[2].charAt(0) + 
                                '.';

            // Проект студента
            var studentProject = document.createElement('th');
            studentProject.innerText = item.projectArea + '\n' + item.projectName;

            // НИР
            var studentNir = document.createElement('th');
            
            var nirTaskCheckbox = document.createElement('input');
            nirTaskCheckbox.type = 'checkbox';
            nirTaskCheckbox.className = 'sci-table-checkbox';
            nirTaskCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.nirTaskStatus) {
                nirTaskCheckbox.checked = true;
            }
            var nirTaskStatus = document.createElement('label');
            nirTaskStatus.htmlFor = nirTaskCheckbox;
            nirTaskStatus.innerText = 'Задание на НИР';

            var nirTaskDiv = document.createElement('div');
            nirTaskDiv.style.minWidth = '170px';

            var nirReportCheckbox = document.createElement('input');
            nirReportCheckbox.type = 'checkbox';
            nirReportCheckbox.className = 'sci-table-checkbox';
            nirReportCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.nirReportStatus) {
                nirReportCheckbox.checked = true;
            }
            var nirReportStatus = document.createElement('label');
            nirReportStatus.htmlFor = nirReportCheckbox;
            nirReportStatus.innerText = 'Отчет по НИР';

            var nirReportDiv = document.createElement('div');

            // ППП...
            var studentLongPP = document.createElement('th');

            var longPPTaskCheckbox = document.createElement('input');
            longPPTaskCheckbox.type = 'checkbox';
            longPPTaskCheckbox.className = 'sci-table-checkbox';
            longPPTaskCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.ppppuipdTaskStatus) {
                longPPTaskCheckbox.checked = true;
            }
            var longPPTaskStatus = document.createElement('label');
            longPPTaskStatus.htmlFor = longPPTaskCheckbox;
            longPPTaskStatus.innerText = 'Задание по ПпППУиОПД';

            var longPPTaskDiv = document.createElement('div');
            longPPTaskDiv.style.minWidth = '250px';

            var longPPReportCheckbox = document.createElement('input');
            longPPReportCheckbox.type = 'checkbox';
            longPPReportCheckbox.className = 'sci-table-checkbox';
            longPPReportCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.longPPReportStatus) {
                longPPReportCheckbox.checked = true;
            }
            var longPPReportStatus = document.createElement('label');
            longPPReportStatus.htmlFor = longPPReportCheckbox;
            longPPReportStatus.innerText = 'Отчет по ПпППУиОПД';

            var longPPReportDiv = document.createElement('div');

            // ПП
            var studentPP = document.createElement('th');

            var ppTaskCheckbox = document.createElement('input');
            ppTaskCheckbox.type = 'checkbox';
            ppTaskCheckbox.className = 'sci-table-checkbox';
            ppTaskCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.ppppuipdTaskStatus) {
                ppTaskCheckbox.checked = true;
            }
            var ppTaskStatus = document.createElement('label');
            ppTaskStatus.htmlFor = ppTaskCheckbox;
            ppTaskStatus.innerText = 'Задание по ПП';

            var ppTaskDiv = document.createElement('div');
            ppTaskDiv.style.minWidth = '160px';

            var ppReportCheckbox = document.createElement('input');
            ppReportCheckbox.type = 'checkbox';
            ppReportCheckbox.className = 'sci-table-checkbox';
            ppReportCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.ppReportStatus) {
                ppReportCheckbox.checked = true;
            }
            var ppReportStatus = document.createElement('label');
            ppReportStatus.htmlFor = ppReportCheckbox;
            ppReportStatus.innerText = 'Отчет по ПП:';
            
            var ppReportDiv = document.createElement('div');

            // ВКР
            var studentVkr = document.createElement('th');

            var vkrAdvisorFeedbackCheckbox = document.createElement('input');
            vkrAdvisorFeedbackCheckbox.type = 'checkbox';
            vkrAdvisorFeedbackCheckbox.className = 'sci-table-checkbox';
            vkrAdvisorFeedbackCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrAdvisorFeedback) {
                vkrAdvisorFeedbackCheckbox.checked = true;
            }
            var vkrAdvisorFeedbackStatus = document.createElement('label');
            vkrAdvisorFeedbackStatus.htmlFor = vkrAdvisorFeedbackCheckbox;
            vkrAdvisorFeedbackStatus.innerText = 'Отзыв руководителя:';

            var vkrAdvisorFeedbackDiv = document.createElement('div');
            vkrAdvisorFeedbackDiv.style.minWidth = '220px';

            var vkrAllowanceCheckbox = document.createElement('input');
            vkrAllowanceCheckbox.type = 'checkbox';
            vkrAllowanceCheckbox.className = 'sci-table-checkbox';
            vkrAllowanceCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrAllowance) {
                vkrAllowanceCheckbox.checked = true;
            }
            var vkrAllowanceStatus = document.createElement('label');
            vkrAllowanceStatus.htmlFor = vkrAllowanceCheckbox;
            vkrAllowanceStatus.innerText = 'Допуск к ВКР:';

            var vkrAllowanceStatusDiv = document.createElement('div');

            var vkrTaskCheckbox = document.createElement('input');
            vkrTaskCheckbox.type = 'checkbox';
            vkrTaskCheckbox.className = 'sci-table-checkbox';
            vkrTaskCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrTask) {
                vkrTaskCheckbox.checked = true;
            }
            var vkrTaskStatus = document.createElement('label');
            vkrTaskStatus.htmlFor = vkrTaskCheckbox;
            vkrTaskStatus.innerText = 'Задание ВКР:';

            var vkrTaskDiv = document.createElement('div');

            var vkrRPZCheckbox = document.createElement('input');
            vkrRPZCheckbox.type = 'checkbox';
            vkrRPZCheckbox.className = 'sci-table-checkbox';
            vkrRPZCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrRPZ) {
                vkrRPZCheckbox.checked = true;
            }
            var vkrRPZStatus = document.createElement('label');
            vkrRPZStatus.htmlFor = vkrRPZCheckbox;
            vkrRPZStatus.innerText = 'РПЗ:';

            var vkrRPZDiv = document.createElement('div');

            var vkrAntiplagiatCheckbox = document.createElement('input');
            vkrAntiplagiatCheckbox.type = 'checkbox';
            vkrAntiplagiatCheckbox.className = 'sci-table-checkbox';
            vkrAntiplagiatCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrAntiplagiat) {
                vkrAntiplagiatCheckbox.checked = true;
            }
            var vkrAntiplagiatStatus = document.createElement('label');
            vkrAntiplagiatStatus.htmlFor = vkrAntiplagiatCheckbox;
            vkrAntiplagiatStatus.innerText = 'Антиплагиат:';

            var vkrAntiplagiatDiv = document.createElement('div');

            var vkrPresentationCheckbox = document.createElement('input');
            vkrPresentationCheckbox.type = 'checkbox';
            vkrPresentationCheckbox.className = 'sci-table-checkbox';
            vkrPresentationCheckbox.disabled = true;
            if (item.studentDocumentsStatusView.vkrPresentation) {
                vkrPresentationCheckbox.checked = true;
            }
            var vkrPresentationStatus = document.createElement('label');
            vkrPresentationStatus.htmlFor = vkrPresentationCheckbox;
            vkrPresentationStatus.innerText = 'Презентация:';

            var vkrPresentationDiv = document.createElement('div');

            var studentButtonTh = document.createElement('th');
            var studentButton = document.createElement('button');
            studentButton.style.minWidth = '100px';
            studentButton.className = 'student-table-button';
            studentButton.innerText = 'Перейти к студенту';

            student.appendChild(studentNum);
            studentFio.appendChild(popover);
            student.appendChild(studentFio);

            student.appendChild(studentProject);

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

            studentButtonTh.appendChild(studentButton);
            student.appendChild(studentButtonTh);
            document.getElementById('student-table-body').appendChild(student);
        }
    }

    $(function() {

        $('.student-table-button').off().on('click', function(event) {
            var studentId = $(this).parent().parent().attr('id');
            var arrayId = studentId.substr(studentId.length - 1);
            //console.log(students[arrayId]);
            sessionStorage.setItem('viewedStudentId', students[arrayId].systemStudentID);
            sessionStorage.setItem('viewedStudentName', students[arrayId].fio);
            sessionStorage.setItem('student', JSON.stringify(students[arrayId]));
            setRedirect(true);
        });

        $('[data-toggle="popover"]').popover();

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    });

    return(
        <div className='sci-advisor-students-form'>
            <div>
                <Table striped bordered hover>
                    <thead className='size-24 dark'>
                        <tr>
                            <th>#</th>
                            <th>ФИО</th>
                            <th>Проект</th>
                            <th>НИР</th>
                            <th>ПпППУиОПД</th>
                            <th>ПП</th>
                            <th>ВКР</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id='student-table-body'>
                        
                    </tbody>
                </Table>
            </div>

            { redirect ? (<Redirect push to='/sca-stu/view'/>) : null }
        </div>
    );
}