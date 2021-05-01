import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import { Modal } from 'react-bootstrap';

import iconDocuments from '../../images/icons/documents.png';
import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function SciAdvisorStudentsDocsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Неопределенная ошибка');

    const [documentData, setDocumentData] = useState([]);

    if (!fetchedData) {
        setFetchedData(true);
        getStudentDocs();
    }

    function getStudentDocs() {
        axios({
            url: apiURL + '/scientific_advisor/document/view/students',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response.data);
            setDocumentData(response.data);
            showFiles(response.data);
        }).catch(result => {
            console.log(result);
        });
    }

    function showFiles(documentArray) {
        for (var i = 0; i < documentArray.length; i++) {
            var documentItem;

            var studentName = documentArray[i].documentDownloader.split(' ');
            studentName = studentName[0] + ' ' + studentName[1].substring(0, 1) + '. ' + studentName[2].substring(0, 1) + '.';
            var documentType = documentArray[i].documentType;
            var documentKind = documentArray[i].documentKind;
            var documentName;
            switch (documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentKind) {
                        case 'Задание':
                            documentName = 'Задание по НИР';
                            documentItem = documentArray[i].taskVersions;
                            break;
                        case 'Отчёт':
                            documentName = 'Отчет по НИР';
                            documentItem = documentArray[i].reportVersions;
                            break;
                        default:
                            documentName = 'Неопознанный документ по НИР';
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentKind) {
                        case 'Задание':
                            documentName = 'Задание по ПпППУиОПД';
                            documentItem = documentArray[i].taskVersions;
                            break;
                        case 'Отчёт':
                            documentName = 'Отчет по ПпППУиОПД';
                            documentItem = documentArray[i].reportVersions;
                            break;
                        default:
                            documentName = 'Неопознанный документ по ПпППУиОПД';
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentKind) {
                        case 'Задание':
                            documentName = 'Задание по ПП';
                            documentItem = documentArray[i].taskVersions;
                            break;
                        case 'Отчёт':
                            documentName = 'Отчет по ПП';
                            documentItem = documentArray[i].reportVersions;
                            break;
                        default:
                            documentName = 'Неопознанный документ по ПП';
                    }
                    break;
                case 'ВКР':
                    switch (documentKind) {
                        case 'Задание':
                            documentName = 'Задание по ВКР';
                            documentItem = documentArray[i].taskVersions;
                            break;
                        case 'Отчёт':
                            documentName = 'Отчет по ВКР';
                            documentItem = documentArray[i].reportVersions;
                            break;
                        case 'Допуск':
                            documentName = 'Допуск';
                            documentItem = documentArray[i].vkrStuffVersions;
                            break;
                        case 'Отзыв':
                            documentName = 'Отзыв научного руководителя';
                            documentItem = documentArray[i].vkrStuffVersions;
                            break;
                        case 'Антиплагиат':
                            documentName = 'Отчет по антиплагиату';
                            documentItem = documentArray[i].vkrStuffVersions;
                            break;
                        case 'Презентация':
                            documentName = 'Презентация по ВКР';
                            documentItem = documentArray[i].vkrStuffVersions;
                            break;
                        default:
                            documentName = 'Неопознанный документ по ВКР';
                    }
                    break;
                default:
                    documentName = 'Неопознанный документ';
            }

            for (var j = 0; j < documentItem.length; j++) {
                var documentVersion = documentItem[j];
                //console.log(documentVersion);
                var documentStatus;
                if (documentKind === 'Задание' || documentKind === 'Отчёт') {
                    documentStatus = getStatus(documentVersion.status);
                }
                else {
                    documentStatus = documentVersion.documentStatus;
                }

                var versionDiv = document.createElement('div');
                versionDiv.className = 'sca-scu-version-div ' +
                    documentType.replace(/\s+/g, '-').toLowerCase() +
                    ' ' +
                    documentKind.replace(/\s+/g, '-').toLowerCase();
                versionDiv.id = 'version-' + i + '-' + j;

                var titlesDiv = document.createElement('div');
                titlesDiv.className = 'sca-scu-version-titles-div dark-background';
                titlesDiv.style.width = '755px';

                var versionImage = document.createElement('img');
                versionImage.className = 'order-name-image'
                versionImage.src = iconDocuments;
                versionImage.style.marginLeft = '3px';
                versionImage.style.marginTop = '5px';

                var versionName = document.createElement('p');
                versionName.className = 'order-name-text light size-24';
                versionName.innerText = documentName;

                var versionStatus = document.createElement('p');
                versionStatus.className = 'order-name-text light size-24';
                versionStatus.innerText = 'Статус: ' + documentStatus;

                var titleDiv1 = document.createElement('div');
                titleDiv1.className = 'sca-scu-version-title-div1';

                var versionStudentName = document.createElement('p');
                versionStudentName.className = 'order-name-text light size-24';
                versionStudentName.innerText = 'Студент: ' + studentName;

                var versionDate = document.createElement('p');
                versionDate.className = 'order-name-text light size-24';
                versionDate.innerText = 'Версия: ' + documentVersion.versionEditionDate;

                var titleDiv2 = document.createElement('div');
                titleDiv2.className = 'sca-scu-version-title-div2';

                // Кнопка отправить студенту
                var sendButton = document.createElement('button');
                sendButton.className = 'light dark-background size-24 sca-scu-version-button version-send-button';
                sendButton.innerText = 'Оценить';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                if (documentStatus !== 'Не отправлено' && documentStatus !== 'Рассматривается') {
                    sendButton.disabled = true;
                }
                //sendButton.style.position = 'relative';
                sendButton.style.verticalAlign = 'top';
                //sendButton.style.top = '-94px';
                sendButton.style.marginTop = '71px';

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';                
                dropdownDiv.style.verticalAlign = 'top';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sca-scu-version-status-dropdown-content';
                dropdownContent.style.verticalAlign = 'top';

                if (documentKind === 'Отчёт') {
                    var status2 = document.createElement('p');
                    status2.className = 'dark size-24 status-2';
                    status2.innerText = 'Неудовлетворительно';

                    var status3 = document.createElement('p');
                    status3.className = 'dark size-24 status-3';
                    status3.innerText = 'Удовлетворительно';

                    var status4 = document.createElement('p');
                    status4.className = 'dark size-24 status-4';
                    status4.innerText = 'Хорошо';

                    var status5 = document.createElement('p');
                    status5.className = 'dark size-24 status-5';
                    status5.innerText = 'Отлично';
                }
                else {
                    var statusOdobreno = document.createElement('p');
                    statusOdobreno.className = 'dark size-24 status-odobreno';
                    statusOdobreno.innerText = 'Одобрено';

                }

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-24 status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

                // Кнопка скачать документ
                var downloadButton = document.createElement('button');
                downloadButton.className = 'light dark-background size-24 sca-scu-version-button version-download-button';
                downloadButton.innerText = 'Сохранить\nдокумент';
                downloadButton.type = 'button';
                downloadButton.style.verticalAlign = 'top';
                downloadButton.style.marginTop = '71px';
                //downloadButton.style.position = 'relative';
                //downloadButton.style.top = '-54px';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'light dark-background size-24 sca-scu-version-button version-delete-button';
                deleteButton.innerText = 'Удалить\nверсию';
                deleteButton.type = 'button';
                deleteButton.style.verticalAlign = 'top';
                //deleteButton.style.position = 'relative';
                deleteButton.style.marginTop = '71px';

                // Кнопка просмотреть
                var viewButton = document.createElement('button');
                viewButton.className = 'light dark-background size-20 sca-scu-version-button version-view-button';
                viewButton.innerText = 'Просмотреть';
                viewButton.type = 'button';
                viewButton.style.verticalAlign = 'top';
                viewButton.style.marginTop = '71px';
                //viewButton.style.position = 'relative';
                //viewButton.style.top = '-54px';

                var versionHeaderDiv = document.createElement('div');
                versionHeaderDiv.className = 'sca-scu-version-header-div';

                titlesDiv.appendChild(versionImage);

                titleDiv1.appendChild(versionName);
                titleDiv1.appendChild(versionStatus);
                titlesDiv.appendChild(titleDiv1);

                titleDiv2.appendChild(versionStudentName);
                titleDiv2.appendChild(versionDate);
                titlesDiv.appendChild(titleDiv2);

                versionHeaderDiv.appendChild(titlesDiv);
                versionHeaderDiv.appendChild(viewButton);

                dropdownDiv.appendChild(sendButton);
                if (documentKind === 'Отчёт') {
                    dropdownContent.appendChild(statusZamechaniya);
                    dropdownContent.appendChild(status2);
                    dropdownContent.appendChild(status3);
                    dropdownContent.appendChild(status4);
                    dropdownContent.appendChild(status5);
                }
                else {
                    dropdownContent.appendChild(statusOdobreno);
                    dropdownContent.appendChild(statusZamechaniya);
                }
                dropdownDiv.appendChild(dropdownContent);
                versionHeaderDiv.appendChild(dropdownDiv);

                versionHeaderDiv.appendChild(downloadButton);
                versionHeaderDiv.appendChild(deleteButton);

                versionDiv.appendChild(versionHeaderDiv);

                document.getElementById('file-div').appendChild(versionDiv);
            }
        }
    }

    function getStatus(status) {
        switch (status) {
            case 'Неудовлетворительно':
                return 'НЕУД.';
            case 'Удовлетворительно':
                return 'УДОВЛ.';
            case 'Хорошо':
                return 'ХОР.';
            case 'Отлично':
                return 'ОТЛ.';
            default:
                return status;
        }
    }

    // Поиск
    function searchFiles() {
        //console.log('search');
        var input = $('#fileSearch')[0].value.toUpperCase();
        var files = $('.sca-scu-version-div');
        for (var i = 0; i < files.length; i++) {
            var fileText = files[i].querySelector('.sca-scu-version-titles-div').textContent.toUpperCase();
            //console.log(fileText);
            if (fileText.indexOf(input) > -1) {
                files[i].classList.remove('student-file-search-hidden');
            }
            else {
                files[i].classList.add('student-file-search-hidden');
            }
        }
    }

    function downloadTask(versionId, type) {
        axios({
            url: apiURL + '/document/download/version',
            method: 'GET',
            responseType: 'blob',
            params: {
                versionID: versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            switch (type) {
                case 'Научно-исследовательская работа':
                    link.setAttribute('download', 'Задание на НИР.docx');
                    break;
                case 'Практика по получению знаний и умений':
                    link.setAttribute('download', 'Задание на ПпППУиОПД.docx');
                    break;
                case 'Преддипломная практика':
                    link.setAttribute('download', 'Задание на ПП.docx');
                    break;
                case 'ВКР':
                    link.setAttribute('download', 'Задание на ВКР.docx');
                    break;
                default:
                    link.setAttribute('download', 'Неопознанный документ.docx');
            }
            document.body.appendChild(link);
            link.click();
        }).catch(result => {
            console.log(result.data);
        });
    }

    function downloadReport(versionId, studentId, type) {
        console.log('download nir report');
        axios({
            url: apiURL + '/scientific_advisor/document/download/report',
            method: 'GET',
            responseType: 'blob',
            params: {
                'type': 'Научно-исследовательская работа',
                'reportVersion': versionId,
                'studentID': studentId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            switch (type) {
                case 'Научно-исследовательская работа':
                    link.setAttribute('download', 'Отчёт по НИР.docx');
                    break;
                case 'Практика по получению знаний и умений':
                    link.setAttribute('download', 'Отчёт по ПпППУиОПД.docx');
                    break;
                case 'Преддипломная практика':
                    link.setAttribute('download', 'Отчёт по ПП.docx');
                    break;
                case 'ВКР':
                    link.setAttribute('download', 'Отчёт по ВКР.docx');
                    break;
                default:
                    link.setAttribute('download', 'Неопознанный документ.docx');
            }
            document.body.appendChild(link);
            link.click();

        }).catch(result => {
            console.log(result.data);
        });
    }

    async function deleteTask(studentId, versionId) {
        return axios({
            url: apiURL + '/scientific_advisor/document/task/version/delete',
            method: 'DELETE',
            params: {
                versionID: versionId,
                'studentID': studentId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            if (response.data.indexOf('Вы не можете удалить версию документа, которую создали не вы') > -1) {
                setErrorMessage('Ошибка при удалении версии задания, нельзя удалить версию, созданную научным руководителем!');
                setShowError(true);
                return false;
            }
            else if (response.data.indexOf('Запрещено удалять последнюю прорецензированную версию документа') > -1) {
                setErrorMessage('Ошибка, нельзя удалять последнюю прорецензированную версию документа!');
                setShowError(true);
                return false;
            }
            else {
                return true;
            }
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении задания!');
            setShowError(true);
            return false;
        });
    }

    async function deleteReport(studentId, versionId) {
        return axios({
            url: apiURL + '/scientific_advisor/document/report/version/delete',
            method: 'DELETE',
            params: {
                versionID: versionId,
                'studentID': studentId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            if (response.data.indexOf('Вы не можете удалить версию документа, которую создали не вы') > -1) {
                setErrorMessage('Ошибка при удалении версии задания, нельзя удалить версию, созданную научным руководителем!');
                setShowError(true);
                return false;
            }
            else if (response.data.indexOf('Запрещено удалять последнюю прорецензированную версию документа') > -1) {
                setErrorMessage('Ошибка, нельзя удалять последнюю прорецензированную версию документа!');
                setShowError(true);
                return false;
            }
            else {
                return true;
            }
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении отчета!');
            setShowError(true);
            return false;
        });
    }

    async function gradeTask(versionId, status) {
        return axios({
            url: apiURL + '/scientific_advisor/document/management/task/nir/check',
            method: 'POST',
            params: {
                'versionID': versionId,
                'newStatus': status,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при выставлении оценки!');
            setShowError(true);
            return false;
        });
    }

    async function gradeReport(versionId, status) {
        return axios({
            url: apiURL + '/scientific_advisor/document/management/report/nir/check',
            method: 'POST',
            params: {
                'versionID': versionId,
                'newStatus': status,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            console.log(response);
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при выставлении оценки!');
            setShowError(true);
            return false;
        });
    }

    // Получение ид версии документа
    function getVersionId(arrayId1, arrayId2) {
        var documentType = documentData[arrayId1].documentType;
        var documentKind = documentData[arrayId1].documentKind;

        switch (documentType) {
            case 'Научно-исследовательская работа':
                switch (documentKind) {
                    case 'Задание':
                        return documentData[arrayId1].taskVersions[arrayId2].systemVersionID;
                    case 'Отчёт':
                        return documentData[arrayId1].reportVersions[arrayId2].systemVersionID;
                    default:
                        console.log('getting nir version id error');
                        return -1;
                }
            case 'Практика по получению знаний и умений':
                switch (documentKind) {
                    case 'Задание':
                        return documentData[arrayId1].taskVersions[arrayId2].systemVersionID;
                    case 'Отчёт':
                        return documentData[arrayId1].reportVersions[arrayId2].systemVersionID;
                    default:
                        console.log('getting ppoid version id error');
                        return -1;
                }
            case 'Преддипломная практика':
                switch (documentKind) {
                    case 'Задание':
                        return documentData[arrayId1].taskVersions[arrayId2].systemVersionID;
                    case 'Отчёт':
                        return documentData[arrayId1].reportVersions[arrayId2].systemVersionID;
                    default:
                        console.log('getting pp version id error');
                        return -1;
                }
            case 'ВКР':
                switch (documentKind) {
                    case 'Задание':
                        return documentData[arrayId1].taskVersions[arrayId2].systemVersionID;
                    case 'Отчёт':
                        return documentData[arrayId1].reportVersions[arrayId2].systemVersionID;
                    default:
                        return documentData[arrayId1].vkrStuffVersionViews[arrayId2].systemVersionID;
                }
            default:
                console.log('getting version id error');
                return -1;
        }
    }

    async function gradeVkrStuff(versionId, status) {
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
            return true;
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при выставлении оценки!');
            setShowError(true);
            return false;
        });
    }

    async function deleteVkrStuff(studentId, versionId) {
        return axios({
            url: apiURL + '/scientific_advisor/document/vkr/stuff/version/delete',
            method: 'DELETE',
            params: {
                'versionID': versionId,
                'studentID': studentId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            if (response.data.indexOf('Вы не можете удалить версию документа, которую создали не вы') > -1) {
                setErrorMessage('Ошибка при удалении версии задания, нельзя удалить версию, созданную научным руководителем!');
                setShowError(true);
                return false;
            }
            else if (response.data.indexOf('Запрещено удалять последнюю прорецензированную версию документа') > -1) {
                setErrorMessage('Ошибка, нельзя удалять последнюю прорецензированную версию документа!');
                setShowError(true);
                return false;
            }
            else {
                return true;
            }
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при удалении документа ВКР!');
            setShowError(true);
            return false;
        });
    }

    function downloadVkrStuff(versionId, kind) {
        axios({
            url: apiURL + '/document/download/version',
            method: 'GET',
            responseType: 'blob',
            params: {
                versionID: versionId,
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            switch (kind) {
                case 'Допуск':
                    link.setAttribute('download', 'Допуск к ВКР.docx');
                    break;
                case 'Отзыв':
                    link.setAttribute('download', 'Отзыв научного руководителя.docx');
                    break;
                case 'Антиплагиат':
                    link.setAttribute('download', 'Отчёт по антиплагиату.docx');
                    break;
                case 'Презентация':
                    link.setAttribute('download', 'Презентация по ВКР.pptx');
                    break;
                default:
                    link.setAttribute('download', 'Неопознанный документ.docx');
            }
            document.body.appendChild(link);
            link.click();
        }).catch(result => {
            console.log(result.data);
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
        // Вывод меню статусов
        $('.version-send-button').off().on('click', function (event) {
            $(this).parent().find('.sca-scu-version-status-dropdown-content').toggle();
        });

        // Отправить со статусом "Одобрено"
        $('.status-odobreno').off().on('click', function (event) {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            switch (documentData[arrayID1].documentKind) {
                case 'Задание':
                    gradeTask(versionId, 'Одобрено').then((result)=>{
                        if (result) {
                            $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Одобрено');
                        }
                        else {
                            $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                        }
                    });
                    break;
                default:
                    gradeVkrStuff(versionId, 'Одобрено').then((result)=>{
                        if (result) {
                            $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Одобрено');
                        }
                        else {
                            $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                        }
                    });
            }
        });

        // Отправить со статусом "Замечания"
        $('.status-zamechaniya').off().on('click', function (event) {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            switch (documentData[arrayID1].documentType) {
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            gradeTask(versionId, 'Замечания').then((result)=>{
                                if (result) {
                                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Замечания');
                                }
                                else {
                                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                                }
                            });
                            break;
                        case 'Отчёт':
                            gradeReport(versionId, 'Замечания').then((result)=>{
                                if (result) {
                                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Замечания');
                                }
                                else {
                                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                                }
                            });
                            break;
                        default:
                            gradeVkrStuff(versionId, 'Замечания').then((result)=>{
                                if (result) {
                                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Замечания');
                                }
                                else {
                                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                                }
                            });
                    }
                    break;
                default:
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            gradeTask(versionId, 'Замечания').then((result)=>{
                                if (result) {
                                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Замечания');
                                    $(this).parent().parent().parent().find('.version-delete-button').attr('disabled', false);
                                }
                                else {
                                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                                }
                            });
                            break;
                        case 'Отчёт':
                            gradeReport(versionId, 'Замечания').then((result)=>{
                                if (result) {
                                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: Замечания');
                                    $(this).parent().parent().parent().find('.version-delete-button').attr('disabled', false);
                                }
                                else {
                                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                                }
                            });
                            break;
                        default:
                            console.log('gradeError');
                    }
            }
        });

        $('.status-2').off().on('click', function () {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            gradeReport(versionId, 'Неудовлетворительно').then((result)=>{
                if (result) {
                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: НЕУД.');
                }
                else {
                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                }
            });
        });

        $('.status-3').off().on('click', function () {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            gradeReport(versionId, 'Удовлетворительно').then((result)=>{
                if (result) {
                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: УДОВЛ.');
                }
                else {
                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                }
            });
        });

        $('.status-4').off().on('click', function () {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            gradeReport(versionId, 'Хорошо').then((result)=>{
                if (result) {
                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: ХОР.');
                }
                else {
                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                }
            });
        });

        $('.status-5').off().on('click', function () {
            var documentId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            $(this).parent().parent().find('.version-send-button').attr('disabled', true);
            $(this).parent().toggle();
            gradeReport(versionId, 'Отлично').then((result)=>{
                if (result) {
                    $(this).parent().parent().parent().find('.order-name-text:contains("Статус: Рассматривается")').text('Статус: ОТЛ.');
                }
                else {
                    $(this).parent().parent().find('.version-send-button').attr('disabled', false);
                }
            });
        });

        // Удалить версию
        $('.version-delete-button').off().on('click', function (event) {
            var documentId = $(this).parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            var studentId = documentData[arrayID1].systemCreatorID;
            $(this).attr('disabled', 'true');
            switch (documentData[arrayID1].documentKind) {
                case 'Задание':
                    deleteTask(studentId, versionId).then((result)=>{
                        if (result) {
                            $(this).parent().parent().remove();
                        }
                        else {
                            $(this).attr('disabled', 'false');
                        }
                    });
                    break;
                case 'Отчёт':
                    deleteReport(studentId, versionId).then((result)=>{
                        if (result) {
                            $(this).parent().parent().remove();
                        }
                        else {
                            $(this).attr('disabled', 'false');
                        }
                    });
                    break;
                default:
                    deleteVkrStuff(studentId, versionId).then((result)=>{
                        if (result) {
                            $(this).parent().parent().remove();
                        }
                        else {
                            $(this).attr('disabled', 'false');
                        }
                    });
            }

        });

        // Скачать версию
        $('.version-download-button').off().on('click', function (event) {
            var documentId = $(this).parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            var studentId = documentData[arrayID1].systemCreatorID
            switch (documentData[arrayID1].documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //console.log(versionId);
                            downloadTask(versionId, 'Научно-исследовательская работа');
                            break;
                        case 'Отчёт':
                            //console.log(versionId);
                            downloadReport(versionId, studentId, 'Научно-исследовательская работа');
                            break;
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //console.log(versionId);
                            downloadTask(versionId, 'Практика по получению знаний и умений');
                            break;
                        case 'Отчёт':
                            //console.log(versionId);
                            downloadReport(versionId, studentId, 'Практика по получению знаний и умений');
                            break;
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //console.log(versionId);
                            downloadTask(versionId, 'Преддипломная практика');
                            break;
                        case 'Отчёт':
                            //console.log(versionId);
                            downloadReport(versionId, studentId, 'Преддипломная практика');
                            break;
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //console.log(versionId);
                            downloadTask(versionId, 'ВКР');
                            break;
                        case 'Отчёт':
                            //console.log(versionId);
                            downloadReport(versionId, studentId, 'ВКР');
                            break;
                        default:
                            downloadVkrStuff(versionId, documentData[arrayID1].documentKind);
                    }
                    break;
                default:
                    console.log('downloadError');
            }
        });

        $('.version-view-button').off().on('click', function (e) {
            var documentId = $(this).parent().parent().attr('id');
            var arrayID1 = documentId.split('-')[1];
            var arrayID2 = documentId.split('-')[2];
            var versionId = getVersionId(arrayID1, arrayID2);
            viewDoc(versionId);
        });

        $('#checkNir').off().on('click', function (event) {
            $('.научно-исследовательская-работа').toggleClass('filter-nir');
        });

        $('#checkLongPP').off().on('click', function (event) {
            $('.практика-по-получению-знаний-и-умений').toggleClass('filter-long-pp');
        });

        $('#checkPP').off().on('click', function (event) {
            $('.преддипломная-практика').toggleClass('filter-pp');
        });

        $('#checkVkr').off().on('click', function (event) {
            $('.вкр').toggleClass('filter-vkr');
        });
    });

    return (
        <div className='student-document-form'>
            <div className='student-document-search-div light-background'>
                <input id='fileSearch' type='text' className='student-document-search dark size-32' placeholder='Поиск по документам' />
                <button onClick={() => { searchFiles(); }} className='student-document-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
            </div>
            <div className='student-document-form-menu light-background'>
                <p className='dark size-32'>Фильтры:</p>
                <div>
                    <p className='dark size-28 filter-title'>Вид:</p>
                    <div>
                        <input type='checkbox' id='checkNir' name='checkNir' className='file-filter-checkbox' defaultChecked />
                        <label htmlFor='checkNir' className='dark size-24 file-filter-checkbox-label'>НИР</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkLongPP' name='checkLongPP' className='file-filter-checkbox' defaultChecked />
                        <label htmlFor='checkLongPP' className='dark size-24 file-filter-checkbox-label'>ПпППУиОПД</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkPP' name='checkPP' className='file-filter-checkbox' defaultChecked />
                        <label htmlFor='checkPP' className='dark size-24 file-filter-checkbox-label'>ПП</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkVkr' name='checkVkr' className='file-filter-checkbox' defaultChecked />
                        <label htmlFor='checkVkr' className='dark size-24 file-filter-checkbox-label'>ВКР</label>
                    </div>
                </div>
            </div>
            <div id='file-div' className='student-document-form-docs light-background'>

            </div>
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