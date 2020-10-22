import React, { useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocuments from '../../images/icons/documents.png';
import iconLookingGlass from '../../images/icons/lookingglass.png';
import iconDelete from '../../images/icons/delete.png';
import iconDeleteDisable from '../../images/icons/delete_disable.png';

export default function StudentDocumentPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [documentData, setDocumentData] = useState('');
    const [fileToDelete, setFileToDelete] = useState([]);

    useEffect(() => {
        showFiles(documentData);
    }, [documentData]);

    if (!fetchedData) {
        setFetchedData(true);
        getStudentDocs();
    }

    function getStudentDocs() {
        axios({
            url: apiURL + '/document/view',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            
            setDocumentData(response.data);
            
          }).catch(result => {
            console.log(result.data);
        });
    }

    function showFiles(documentArray) {
        for (var i=0; i<documentArray.length; i++) {
            var item = documentArray[i];

            var file = document.createElement('div');
            file.className = 'student-file';
            var documentType = item.documentType.replace(/\s+/g, '-').toLowerCase();
            file.className += ' ' + documentType;
            var documentKind = item.documentKind.replace(/\s+/g, '-').toLowerCase();
            file.className += ' ' + documentKind;
            file.id = 'file' + i;

            var selectableDiv = document.createElement('div');
            selectableDiv.className = 'student-file-selectable dark-background';

            var icon = document.createElement('img');
            icon.src = iconDocuments;
            icon.className = 'icon-small student-file-icon';
            selectableDiv.appendChild(icon);

            var content = document.createElement('p');
            content.className = 'size-32 light student-file-content'
            content.innerHTML += item.documentName;
            selectableDiv.appendChild(content);
            file.appendChild(selectableDiv);

            var deleteButton = document.createElement('button');
            var deleteIcon = document.createElement('img');
            
            if (authTokens.fio === item.documentDownloader) {
                deleteButton.className = 'student-file-delete-button dark-background';
                deleteButton.id = 'delete' + i;
                //deleteButton.onclick = handleDelete;
                deleteIcon.className = 'dark-background icon-small';
                deleteIcon.src = iconDelete;
            }
            else {
                deleteButton.className = 'student-file-delete-button grey-background';
                deleteIcon.className = 'grey-background icon-small';
                deleteButton.disabled = true;
                deleteIcon.src = iconDeleteDisable;
            }
            deleteButton.appendChild(deleteIcon);
            file.appendChild(deleteButton);

            document.getElementById('file-div').appendChild(file);
        }
    }

    function deleteFile() {
        var fileName = $('#'+fileToDelete).parent().find('.student-file-content')[0].innerText;
        console.log(fileName);
        var formData = new FormData();
        formData.append('documentName', fileName);
        axios({
            url: apiURL + '/student/document/delete/',
            method: 'DELETE',
            data: formData,
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
        }).then((response) => {
            console.log(response);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function downloadFile() {
        if ($('.student-file-selected').length != 0) {
            var fileNum = $('.student-file-selected').parent()[0].id.slice(-1);
            console.log(fileNum);
            console.log(documentData);
            axios({
                url: apiURL + '/document/download/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    creator_id: documentData[fileNum].systemCreatorID,
                    documentName: documentData[fileNum].documentName,
                },
                headers: { 
                    'Authorization': 'Bearer ' + authTokens.accessToken 
                },
              }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', documentData[fileNum].documentName);
                document.body.appendChild(link);
                link.click();
              }).catch(result => {
                console.log(result.data);
            });
        }
    }

    $(document).ready(function() {
        
        $('#checkZadanie').on('click', function(event) {
            $('.задание').toggle();
            $('.задание .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkPrikaz').on('click', function(event) {
            $('.приказ').toggle();
            $('.приказ .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkOtchet').on('click', function(event) {
            $('.отчёт').toggle();
            $('.отчёт .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkNir').on('click', function(event) {
            $('.научно-исследовательская-работа').toggle();
            $('.научно-исследовательская-работа .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkLongPP').on('click', function(event) {
            $('.практика-по-получению-знаний-и-умений').toggle();
            $('.практика-по-получению-знаний-и-умений .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkPP').on('click', function(event) {
            $('.преддипломная-практика').toggle();
            $('.преддипломная-практика .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $('#checkVkr').on('click', function(event) {
            $('.вкр').toggle();
            $('.вкр .student-file-selectable').removeClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $(document).on('click', '.student-file-selectable', function(event) {
            $('.student-file-selectable').removeClass('student-file-selected');
            $(this).toggleClass('student-file-selected');
            event.stopImmediatePropagation();
        });

        $(document).on('click', '.student-file-delete-button', function(event) {
            setFileToDelete ($(this)[0].id);
            setShowDeleteModal(true);
            event.stopImmediatePropagation();
        });

    });

    return(
        <div className='student-document-form'>
            <div className='student-document-search-div light-background'>
                <input type='text' className='student-document-search dark size-32'/>
                <button className='student-document-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background'/>
                    Поиск
                </button>
            </div>
            <div className='student-document-form-menu light-background'>
                <p className='dark size-32'>Фильтры:</p>
                <div className='file-filter-div'>
                    <p className='dark size-28'>Тип:</p>
                    <div className='file-filter-group'>
                        <input type='checkbox' id='checkZadanie' name='checkZadanie' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkZadanie' className='dark size-24 file-filter-checkbox-label'>Задание</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkPrikaz' name='checkPrikaz' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkPrikaz' className='dark size-24 file-filter-checkbox-label'>Приказ</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkOtchet' name='checkOtchet' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkOtchet' className='dark size-24 file-filter-checkbox-label'>Отчет</label>
                    </div>
                    
                </div>
                <div>
                    <p className='dark size-28'>Вид:</p>
                    <div>
                        <input type='checkbox' id='checkNir' name='checkNir' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkNir' className='dark size-24 file-filter-checkbox-label'>НИР</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkLongPP' name='checkLongPP' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkLongPP' className='dark size-24 file-filter-checkbox-label'>ПпППУиОПД</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkPP' name='checkPP' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkPP' className='dark size-24 file-filter-checkbox-label'>ПП</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkVkr' name='checkVkr' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkVkr' className='dark size-24 file-filter-checkbox-label'>ВКР</label>
                    </div>
                    
                </div>
                <button className='light dark-background size-32 student-document-button'>
                    Изменить документ
                </button>
                <button className='light dark-background size-32 student-document-button'>
                    Загрузить документ
                </button>
                <button className='light dark-background size-32 student-document-button' onClick={() => {downloadFile();}}>
                    Скачать документ
                </button>
            </div>
            <div id='file-div' className='student-document-form-docs light-background'>
                
            </div>

            <Modal className='light-background file-delete-modal'
                show={showDeleteModal} onHide={() => {setShowDeleteModal(false)}}>
                <p className='light-background dark size-30 file-delete-modal-text'>Вы уверены, что хотите удалить<br/>данный документ?</p>
                <button className='dark-background light size-30 file-delete-modal-button' style={{ marginLeft: '15px', marginTop: '80px'}}
                    onClick={() => {deleteFile(); setShowDeleteModal(false); window.location.reload();}}>
                    Да
                </button>
                <button className='dark-background light size-30 file-delete-modal-button' style={{ marginLeft: '280px', marginTop: '80px'}} 
                    onClick={() => {setShowDeleteModal(false)}}>
                    Нет
                </button>
            </Modal>
        </div>
    );
}