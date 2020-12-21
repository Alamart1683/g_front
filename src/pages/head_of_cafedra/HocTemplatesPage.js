import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import templateImage from '../../images/icons/template.png';

export default function HocTemplatesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [templates, setTemplates] = useState([]);

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
            templateName.style.top = '-5px';
            templateName.style.width = '660px';

            var templateNameText = document.createElement('p');
            templateNameText.className = 'hoc-order-template-name-text light size-22'
            templateNameText.innerText = template.documentName;
            templateNameText.style.maxHeight = '30px';
            templateNameText.style.maxWidth = '350px';
            templateNameText.style.overflow = 'hidden';
            templateNameText.style.textOverflow = 'ellipsis';
            templateNameText.style.whiteSpace = 'nowrap';

            var templateNameImage = document.createElement('img');
            templateNameImage.className = 'hoc-order-template-name-image'
            templateNameImage.src = templateImage;

            var templateDownload = document.createElement('button');
            templateDownload.className = 'hoc-order-template-download-button light size-22';
            templateDownload.id = 'hoc-template-download-button';
            templateDownload.innerText = "Сохранить"

            var templateConfirm = document.createElement('button');
            templateConfirm.className = 'hoc-order-template-delete-button light size-22 hoc-order-template-confirm-button';
            templateConfirm.id = 'confirm-button-' + i;
            templateConfirm.innerText = 'Одобрить';

            var templateStatus = document.createElement('p');
            templateStatus.className = 'hoc-order-template-name-text light size-22';
            if (template.approved) {
                templateStatus.innerText = 'Статус: Одобрено';
                templateConfirm.disabled = true;
            }
            else {
                templateStatus.innerText = 'Статус: Не одобрено';
            }

            // Кнопка просмотреть
            var viewButton = document.createElement('button');
            viewButton.className = 'hoc-order-template-delete-button light size-22 version-view-button';
            viewButton.id = 'template-view-' + i;
            viewButton.innerText = 'Просмотреть';
            viewButton.type = 'button';

            templateName.appendChild(templateNameImage);
            templateName.appendChild(templateNameText);
            templateName.appendChild(templateStatus);

            documentFile.appendChild(templateName);
            documentFile.appendChild(viewButton);
            documentFile.appendChild(templateConfirm);
            documentFile.appendChild(templateDownload);

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

        // Одобрить шаблон
        $('.hoc-order-template-confirm-button').off().on('click', function (event) {
            // example id = confirm-button-2
            var arrayID = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/head_of_cathedra/only/approve/template',
                method: 'POST',
                params: {
                    'documentID': templates[arrayID].documentVersions[0].systemDocumentID,
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

        $('.version-view-button').off().on('click', function (e) {
            e.preventDefault();
            var arrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/document/get/outer/link/single',
                method: 'GET',
                params: {
                    'creatorID': templates[arrayId].systemCreatorID,
                    'documentName': templates[arrayId].documentName,
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
        });
    });

    return (
        <div className='orders-templates-panel'>
            <div className='clearfix'>
                <div className='hoc-templates-orders-buttons-panel' style={{ height: '400px' }} id='hoc-templates-buttons-panel'>
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
                </div>

                <div className='hoc-orders-templates-document-panel-common'>
                    <div className='hoc-orders-templates-document-panel' id='hoc-templates-document-panel1'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel2'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel3'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-templates-document-panel4'></div>
                </div>
            </div>
        </div>
    );
}