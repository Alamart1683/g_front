import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocument from '../../images/icons/documents.png';

export default function ScaExamplesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [examples, setExamples] = useState([]);

    useEffect(() => {
        showExamples(examples);
    }, [examples]);

    if (!fetchedData) {
        setFetchedData(true);
        getExamples();
    }

    function getExamples() {
        axios({
            url: apiURL + '/document/view/templates/advisor',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response.data);
            setExamples(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // TODO permissions
    function showExamples(examplesArray) {
        for (var i = 0; i < examplesArray.length; i++) {
            var example = examplesArray[i];
            console.log(example);

            var exampleDiv = document.createElement('div');
            exampleDiv.className = 'sca-example-file-div';

            var iconImage = document.createElement('img');
            iconImage.className = 'sca-example-image';
            iconImage.src = iconDocument;

            var textDiv = document.createElement('div');
            textDiv.className = 'sca-example-text-div';

            var exampleName = document.createElement('p');
            exampleName.innerText = example.documentName;

            var examplePermissions = document.createElement('p');
            examplePermissions.innerText = 'Доступ: ' + 'Для всех';
            examplePermissions.style.display = 'inline-block';
            examplePermissions.style.marginLeft = '15px';

            var exampleType = document.createElement('p');
            exampleType.innerText = 'Тип: ' + example.documentType;
            exampleType.style.display = 'inline-block';
            switch (example.documentType) {
                case 'Научно-исследовательская работа':
                    exampleType.innerText = 'Тип: НИР';
                    break;
                case 'Практика по получению знаний и умений':
                    exampleType.innerText = 'Тип: ПпППУиОПД';
                    break;
                case 'Преддипломная практика':
                    exampleType.innerText = 'Тип: ПП';
                    break;
                case 'ВКР':
                    exampleType.innerText = 'Тип: ВКР';
                    break;
                default:
                    exampleType.innerText = 'Тип: Неопознанный';
                    break;
            }

            var clickableDiv = document.createElement('div');
            clickableDiv.className = 'sca-example-file-clickable light size-24 dark-background';

            var downloadButton = document.createElement('button');
            downloadButton.id = 'download-button-' + i;
            downloadButton.className = 'sca-example-file-button light dark-background download-button';
            downloadButton.innerText = 'Сохранить';

            var deleteButton = document.createElement('button');
            deleteButton.id = 'delete-button-' + i;
            deleteButton.className = 'sca-example-file-button light dark-background delete-button';
            deleteButton.innerText = 'Удалить';

            clickableDiv.appendChild(iconImage);
            textDiv.appendChild(exampleName);
            textDiv.appendChild(exampleType);
            textDiv.appendChild(examplePermissions);
            clickableDiv.appendChild(textDiv);
            exampleDiv.appendChild(clickableDiv);
            exampleDiv.appendChild(downloadButton);
            exampleDiv.appendChild(deleteButton);
            document.getElementById('examples-div').appendChild(exampleDiv);
        }
    }

    $(function () {

        // Выбор файла
        $('.sca-example-file-clickable').off().on('click', function () {
            $('.sca-example-file-clickable').removeClass('sca-example-file-clickable-selected');
            $(this).addClass('sca-example-file-clickable-selected');
            document.getElementById('change-permissions-button').disabled = false;
        });

        // Скачать пример
        $('.download-button').off().on('click', function() {
            var arrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/document/download/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'creator_id': examples[arrayId].systemCreatorID,
                    'documentName': examples[arrayId].documentName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', examples[arrayId].documentName);
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
            });
        });

        // Удалить пример
        $('.delete-button').off().on('click', function () {
            var arrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/scientific_advisor/document/delete/',
                method: 'DELETE',
                params: {
                    documentName: examples[arrayId].documentName,
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

    });

    return (
        <div className='sca-examples-div'>
            <div className='sca-examples-menu-div light-background'>
                <button type='button' className='light size-24 dark-background sca-examples-button'>
                    Загрузить файл<br />образца на сайт
                </button>
                <button type='button' id='change-permissions-button' disabled className='light size-24 dark-background sca-examples-button'>
                    Изменить права<br />доступа к образцу
                </button>
            </div>
            <div id='examples-div' className='sca-examples-files-div light-background'>

            </div>
        </div>
    );
}