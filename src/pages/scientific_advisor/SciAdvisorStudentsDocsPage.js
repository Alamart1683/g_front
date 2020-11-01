import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocuments from '../../images/icons/documents.png';
import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function SciAdvisorStudentsDocsPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [documentData, setDocumentData] = useState([]);
    //const [fileToDelete, setFileToDelete] = useState([]);

    useEffect(() => {
        showFiles(documentData);
    });

    if (!fetchedData) {
        setFetchedData(true);
        getStudentDocs();
    }

    function getStudentDocs() {
        console.log('getfiles');
        axios({
            url: apiURL + '/scientific_advisor/document/view/students',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setDocumentData(response.data);
            console.log(response.data);

        }).catch(result => {
            console.log(result.data);
        });
    }

    function showFiles(documentArray) {
        for (var i = 0; i < documentArray.length; i++) {
            var documentItem = documentArray[i].documentVersions;
            var studentName = documentArray[i].documentDownloader.split(' ');
            studentName = studentName[0] + ' ' + studentName[1].substring(0, 1) + '. ' + studentName[2].substring(0, 1) + '.';
            var documentType = documentArray[i].documentType;
            var documentKind = documentArray[i].documentKind;
            for (var j = 0; j < documentItem.length; j++) {
                var documentVersion = documentItem[j];
                //console.log(documentVersion);

                var versionDiv = document.createElement('div');
                versionDiv.className = 'sca-scu-version-div';
                versionDiv.id = 'version-' + i + '-' + j;

                var titlesDiv = document.createElement('div');
                titlesDiv.className = 'sca-scu-version-titles-div dark-background';

                var versionImage = document.createElement('img');
                versionImage.className = 'order-name-image'
                versionImage.src = iconDocuments;

                var versionName = document.createElement('p');
                versionName.className = 'order-name-text light size-24';
                // TODO add more version names
                switch (documentType) {
                    case 'Научно-исследовательская работа':
                        switch (documentKind) {
                            case 'Задание':
                                versionName.innerText = 'Задание по НИР';
                                break;
                            case 'Отчёт':
                                versionName.innerText = 'Отчет по НИР';
                                break;
                            default:
                                versionName.innerText = 'Неопознанный документ по НИР';
                        }
                        break;
                    case 'Практика по получению знаний и умений':
                        switch (documentKind) {
                            case 'Задание':
                                versionName.innerText = 'Задание по практике по получению знаний и умений';
                                break;
                            case 'Отчет':
                                versionName.innerText = 'Отчет по практике по получению знаний и умений';
                                break;
                            default:
                                versionName.innerText = 'Неопознанный документ по практике по получению знаний и умений';
                        }
                        break;
                    case 'Преддипломная практика':
                        switch (documentKind) {
                            default:
                                versionName.innerText = 'Неопознанный документ по преддипломной практике';
                        }
                        break;
                    case 'ВКР':
                        switch (documentKind) {
                            default:
                                versionName.innerText = 'Неопознанный документ по ВКР';
                        }
                        break;
                    default:
                        versionName.innerText = 'Неопознанный документ';
                }

                var versionStatus = document.createElement('p');
                versionStatus.className = 'order-name-text light size-24';
                // TODO
                versionStatus.innerText = 'Статус: ' + 'Замечания';

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
                sendButton.innerText = 'Отправить\nстуденту:';
                sendButton.type = 'button';
                // Запретить отсылку, если версия отправлена
                //if (item.status === 'Одобрено' || item.status === 'Замечания') {
                //    sendButton.disabled = true;
                //}

                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'sci-advisor-status-dropdown-div';

                var dropdownContent = document.createElement('div');
                dropdownContent.className = 'sca-scu-version-status-dropdown-content';

                var statusOdobreno = document.createElement('p');
                statusOdobreno.className = 'dark size-18 status-odobreno';
                statusOdobreno.innerText = 'Одобрено';

                var statusZamechaniya = document.createElement('p');
                statusZamechaniya.className = 'dark size-18 status-zamechaniya';
                statusZamechaniya.innerText = 'Замечания';

                // Кнопка скачать документ
                var downloadButton = document.createElement('button');
                downloadButton.className = 'light dark-background size-24 sca-scu-version-button version-download-button';
                downloadButton.innerText = 'Сохранить\nдокумент';
                downloadButton.type = 'button';

                // Кнопка удалить
                var deleteButton = document.createElement('button');
                deleteButton.className = 'light dark-background size-24 sca-scu-version-button version-delete-button';
                deleteButton.innerText = 'Удалить\nверсию';
                deleteButton.type = 'button';
                // Запретить удаление, если версия отправлена
                //if (item.status !== 'Не отправлено' && item.status !== 'Замечания') {
                //    deleteButton.disabled = true;
                //}

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

                dropdownDiv.appendChild(sendButton);
                dropdownContent.appendChild(statusOdobreno);
                dropdownContent.appendChild(statusZamechaniya);
                dropdownDiv.appendChild(dropdownContent);
                versionHeaderDiv.appendChild(dropdownDiv);

                versionHeaderDiv.appendChild(downloadButton);
                versionHeaderDiv.appendChild(deleteButton);

                versionDiv.appendChild(versionHeaderDiv);

                document.getElementById('file-div').appendChild(versionDiv);
            }
        }
    }

    // TODO
    function searchFiles() {
        console.log('search');
    }

    function downloadNirTask(versionId) {
        console.log('download nir task');
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
                link.setAttribute('download', 'Задание на НИР.docx');
                document.body.appendChild(link);
                link.click();
            }).catch(result => {
                console.log(result.data);
        });
    }

    function downloadNirReport(versionId, studentId) {
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
            link.setAttribute('download', 'Отчёт по НИР.docx');
            document.body.appendChild(link);
            link.click();

        }).catch(result => {
            console.log(result.data);
        });
    }

    function deleteNirTask(studentId, versionId) {
        console.log('delete nir task');
        axios({
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
            //console.log(response);
            window.location.reload(true);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function deleteNirReport(studentId, versionId) {
        console.log('delete nir report');
        axios({
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
            window.location.reload(true);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function gradeNirTask(versionId, status) {
        console.log('grade nir task' + status);
        axios({
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

            window.location.reload(true);

        }).catch(result => {
            console.log(result.data);
        });
    }

    function gradeNirReport(versionId, status) {
        console.log('grade nir report' + status);
        axios({
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

            window.location.reload(true);

        }).catch(result => {
            console.log(result.data);
        });
    }

    $(function () {

        $('.version-send-button').off().on('click', function (event) {
            $(this).parent().find('.sca-scu-version-status-dropdown-content').toggle();
        });

        // TODO versionId
        // Отправить со статусом "Одобрено"
        $('.status-odobreno').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = versionId.split('-')[1];
            var arrayID2 = versionId.split('-')[2];
            //console.log(documentData[arrayID1].documentVersions[arrayID2].systemDocumentID);
            var versionId = 0;
            switch (documentData[arrayID1].documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //TODO
                            gradeNirTask(versionId, 'Одобрено');
                            break;
                        case 'Отчёт':
                            //TODO
                            gradeNirReport(versionId, 'Одобрено');
                            break;
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                default:
                    console.log('deleteError');
            }
        });

        // TODO versionId
        // Отправить со статусом "Замечания"
        $('.status-zamechaniya').off().on('click', function (event) {
            var versionId = $(this).parent().parent().parent().parent().attr('id');
            var arrayID1 = versionId.split('-')[1];
            var arrayID2 = versionId.split('-')[2];
            //console.log(documentData[arrayID1].documentVersions[arrayID2].systemDocumentID);
            var versionId = 0;
            switch (documentData[arrayID1].documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            gradeNirTask(versionId, 'Замечания');
                            break;
                        case 'Отчёт':
                            gradeNirReport(versionId, 'Замечания');
                            break;
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                default:
                    console.log('deleteError');
            }
        });

        // TODO versionId
        // Удалить версию
        $('.version-delete-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID1 = versionId.split('-')[1];
            var arrayID2 = versionId.split('-')[2];
            //console.log(documentData[arrayID1].documentVersions[arrayID2].systemDocumentID);
            var versionId = 0;
            var studentId = documentData[arrayID1].systemCreatorID
            switch (documentData[arrayID1].documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            //TODO
                            deleteNirTask(studentId, versionId);
                            break;
                        case 'Отчёт':
                            //TODO
                            deleteNirReport(studentId, versionId);
                            break;
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('deleteError');
                    }
                    break;
                default:
                    console.log('deleteError');
            }
        });

        // TODO versionId
        // Скачать версию
        $('.version-download-button').off().on('click', function (event) {
            var versionId = $(this).parent().parent().attr('id');
            var arrayID1 = versionId.split('-')[1];
            var arrayID2 = versionId.split('-')[2];
            //console.log(documentData[arrayID1].documentVersions[arrayID2].systemDocumentID);
            //TODO
            var versionId = 0;
            var studentId = documentData[arrayID1].systemCreatorID
            switch (documentData[arrayID1].documentType) {
                case 'Научно-исследовательская работа':
                    switch (documentData[arrayID1].documentKind) {
                        case 'Задание':
                            downloadNirTask(versionId);
                            break;
                        case 'Отчёт':
                            downloadNirReport(versionId, studentId);
                            break;
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'Практика по получению знаний и умений':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'Преддипломная практика':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('downloadError');
                    }
                    break;
                case 'ВКР':
                    switch (documentData[arrayID1].documentKind) {
                        default:
                            console.log('downloadError');
                    }
                    break;
                default:
                    console.log('downloadError');
            }
        });

        
    });

    return (
        <div className='student-document-form'>
            <div className='student-document-search-div light-background'>
                <input id='fileSearch' type='text' className='student-document-search dark size-32' />
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
        </div>
    );
}