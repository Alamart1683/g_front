import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import templateImage from '../../images/icons/template.png';
import $ from 'jquery';

export default function TemplatesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [redirect, setRedirect] = useState(false);
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
            console.log(response);
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
            documentFile.className = 'template-doc';
            documentFile.id = 'template-doc-' + i;

            var templateName = document.createElement('div');
            templateName.className = 'template-name light-background';
            templateName.id = 'template-doc-name';

            var templateNameText = document.createElement('p');
            templateNameText.className = 'template-name-text light size-24'
            templateNameText.innerText=template.documentName;

            var templateNameImage = document.createElement('img');
            templateNameImage.className='template-name-image'
            templateNameImage.src=templateImage;

            templateName.appendChild(templateNameImage);
            templateName.appendChild(templateNameText);

            var templateDownload = document.createElement('button');
            templateDownload.className = 'template-doc-download light size-24';
            templateDownload.id = 'template-doc-download';
            templateDownload.innerText = "Сохранить шаблон задания"

            documentFile.appendChild(templateName);
            documentFile.appendChild(templateDownload);

            document.getElementById("contentPanel1").appendChild(documentFile);
        }
    }

    $(function() {
        // Скачать шаблон задания
        $('.template-doc-download').off().on('click', function(event) {
            var systemDocumentId = $(this).parent().attr('id');
            // console.log(systemDocumentId);
            var arrayID = systemDocumentId.split('-')[2];
            // console.log(arrayID);
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
    });

    return (
        <div className="templatesPanel">
            <div className="typeButtonPanel">
                <button type='submit' className="contentButton light size-22">Научно-исследовательская работа</button>
                <button type='submit' className="contentButton light size-22">ПпППУиОПД</button>
                <button type='submit' className="contentButton light size-22">Преддипломная практика</button>
                <button type='submit' className="contentButton light size-22" style={{marginRight:"0px"}}>Защита ВКР</button>
            </div>

            <div id="contentPanel1" className="contentPanel">
                
            </div>
        </div>
    );
}