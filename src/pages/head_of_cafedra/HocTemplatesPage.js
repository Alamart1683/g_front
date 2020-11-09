import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import templateImage from '../../images/icons/template.png';

export default function HocTemplatesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [templates, setTemplates] = useState([]);

    const [show, setShow] = useState(false);

    useEffect(() => {
        showTeplates(templates);
    }, [templates]);

    if (!fetchedData) {
        setFetchedData(true);
        getTemplates();
    }

    // Получение данных о шаблонах заданий
    function getTemplates() {
        axios({
            url: apiURL + '/document/view/templates',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            //console.log(response);
            setTemplates(response.data);
          }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы шаблонов
    function showTeplates(templatesArray) {
        for (var i = 0; i < templatesArray.length; i++) {
            var template = templatesArray[i];

            var documentFile = document.createElement('div')
            documentFile.className = 'hoc-order-template-doc';
            documentFile.id = 'hoc-order-template-doc-' + i;

            var templateName = document.createElement('div');
            templateName.className = 'dark-background hoc-order-template-name';
            templateName.id = 'hoc-order-template-name';

            var templateNameText = document.createElement('p');
            templateNameText.className = 'hoc-order-template-name-text light size-22'
            templateNameText.innerText=template.documentName;

            var templateNameImage = document.createElement('img');
            templateNameImage.className='hoc-order-template-name-image'
            templateNameImage.src=templateImage;

            templateName.appendChild(templateNameImage);
            templateName.appendChild(templateNameText);

            var templateDownload = document.createElement('button');
            templateDownload.className = 'hoc-order-template-download-button light size-22';
            templateDownload.id = 'hoc-template-download-button';
            templateDownload.innerText = "Сохранить"

            var templateDelete = document.createElement('button');
            templateDelete.className = 'hoc-order-template-delete-button light size-22';
            templateDelete.id = 'hoc-template-delete-button';
            templateDelete.innerText = "Удалить";

            documentFile.appendChild(templateName);
            documentFile.appendChild(templateDownload);
            documentFile.appendChild(templateDelete);

            switch (template.documentType) {
                case 'Научно-исследовательская работа':
                    document.getElementById("hoc-templates-document-panel1").appendChild(documentFile);
                    break;
                case 'Практика по получению знаний и умений':
                    document.getElementById("hoc-templates-document-panel2").appendChild(documentFile);
                    break;
                case 'Преддипломная практика':
                    document.getElementById("hoc-templates-document-panel3").appendChild(documentFile);
                    break;
                case 'ВКР':
                    document.getElementById("hoc-templates-document-panel4").appendChild(documentFile);
                    break;
                default:
                    console.log('switch error');
            }
        }
    }

    function createTemplate(file, templateType) {
        //console.log(file);
        //console.log(templateType);
        var formData = new FormData();
        switch (templateType) {
            case 'Шаблон задания на НИР':
                formData.append('documentFormType', 'Научно-исследовательская работа');
                formData.append('documentFormKind', 'Задание');
                formData.append('documentFormDescription', 'Образец задания на НИР для автозаполнения');
                formData.append('documentFormViewRights', 'Все пользователи');
                formData.append('file', file);
                break;
            default:
                console.log('Неопознанный тип шаблона');
        }
        axios({
            url: apiURL + '/scientific_advisor/document/upload',
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
        // Отображение расфасованных шаблонов
        $('.orders-templates-button').off().on('click', function (event) {
            $('.hoc-orders-templates-document-panel').addClass('hoc-orders-templates-document-panel-hidden');
            var buttonId = $(this).attr('id');
            $('.orders-templates-button').removeClass('orders-templates-button-selected');
            $(this).addClass('orders-templates-button-selected');
            switch (buttonId) {
                case 'button-1':
                    $('#hoc-templates-document-panel1').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-2':
                    $('#hoc-templates-document-panel2').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-3':
                    $('#hoc-templates-document-panel3').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-4':
                    $('#hoc-templates-document-panel4').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                default:
                    console.log('switchError');
            }
        })

        // Скачать шаблон
        $('.hoc-order-template-download-button').off().on('click', function (event) {
            var systemDocumentId = $(this).parent().attr('id');
            var arrayID = systemDocumentId.split('-')[4];
            axios({
                url: apiURL + '/document/download/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'creator_id': templates[arrayID].systemCreatorID,
                    'documentName': templates[arrayID].documentName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', templates[arrayID].documentName);
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить шаблон
        $('.hoc-order-template-delete-button').off().on('click', function () {
            var systemDocumentId = $(this).parent().attr('id');
            var arrayId = systemDocumentId.split('-')[4];
            axios({
                url: apiURL + '/scientific_advisor/document/delete/',
                method: 'DELETE',
                params: {
                    documentName: templates[arrayId].documentName,
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
    
        $('#create-template-button').off().on('click', function () {
            $('#template-file-input').trigger('click');
        });

    });

    return(
        <div className='orders-templates-panel'>
            <div className='hoc-templates-orders-buttons-panel' id='hoc-templates-buttons-panel'>
                <button type='button' className='size-22 light orders-templates-button orders-templates-button-selected' id='button-1'>
                    Научно-исследовательская работа
                </button>

                <button type='button' className='size-22 light orders-templates-button ' id='button-2'>
                    ПпППУиОПД
                </button>

                <button type='button' className='size-22 light orders-templates-button' id='button-3'>
                    Преддипломная практика
                </button>

                <button type='button' className='size-22 light orders-templates-button' id='button-4'>
                    Защита ВКР
                </button>

                <button type='button' onClick={(e) => { setShow(true); }} className='size-22 light orders-templates-upload-button' id='upload-button'>
                    Загрузить шаблон
                </button>
            </div>

            <div className='hoc-orders-templates-document-panel-common'> 
                <div className='hoc-orders-templates-document-panel' id='hoc-templates-document-panel1'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel2'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel3'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel4'></div>
            </div>
            <Modal centered show={show} onHide={(e) => { setShow(false); }} className='dark'>
                <Modal.Header className='light-background sca-examples-modal1-header' closeButton>
                    <Modal.Title className='size-30'>
                        <p style={{ height: '50px', marginBottom: '0px', marginLeft: '200px' }}>Загрузить шаблон</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='light-background sca-examples-modal1-body'>
                    <select id='dropdown-template-type' defaultValue='' className='dark size-24 sca-examples-dropdown' onChange={(e) => {
                        if ($('#dropdown-template-type :selected').val() !== '') {
                            document.getElementById('create-template-button').disabled = false;
                        }
                    }}>
                        <option value='' disabled hidden>Выберите тип шаблона</option>
                        <option value='Шаблон задания на НИР'>Шаблон задания на НИР</option>
                    </select>
                    <button type='button' id='create-template-button' disabled className='size-24 dark-background light sca-modal-button' style={{ marginLeft: '130px' }}>
                        Выбрать файл и<br/>загрузить шаблон на сервер
                    </button>
                    <input id='template-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            document.getElementById('create-template-button').disabled = true;
                            createTemplate(e.target.files[0], $('#dropdown-template-type :selected').val());
                        }
                    }} ></input>
                </Modal.Body>
            </Modal>
        </div>
    );
}