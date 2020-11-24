import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocument from '../../images/icons/documents.png';

export default function ScaExamplesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [examples, setExamples] = useState([]);
    const [projectAreaData, setProjectAreaData] = useState([]);

    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        showExamples(examples);
    }, [examples]);

    if (!fetchedData) {
        setFetchedData(true);
        getProjectAreaData()
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
            console.log(response.data);
            setExamples(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showExamples(examplesArray) {
        for (var i = 0; i < examplesArray.length; i++) {
            var example = examplesArray[i];
            //console.log(example);

            var exampleDiv = document.createElement('div');
            exampleDiv.className = 'sca-example-file-div';

            var clickableDiv = document.createElement('div');
            clickableDiv.className = 'sca-example-file-clickable light size-22 dark-background';

            var iconImage = document.createElement('img');
            iconImage.className = 'sca-example-image';
            iconImage.src = iconDocument;

            var textDiv = document.createElement('div');
            textDiv.className = 'sca-example-text-div';

            var exampleName = document.createElement('p');
            exampleName.innerText = example.documentName;
            exampleName.style.maxWidth = '540px';
            exampleName.style.overflow = 'hidden';
            exampleName.style.textOverflow = 'ellipsis';
            exampleName.style.display = 'inline-block';

            var examplePermissions = document.createElement('p');
            if (example.area === 'Программа проектов не назначена') {
                examplePermissions.innerText = 'Доступ: Для всех моих студентов';
            }
            else {
                examplePermissions.innerText = 'Доступ: ' + example.area;
                if (example.project != null) {
                    examplePermissions.innerText += ' - ' + example.project;
                }
            }
            examplePermissions.style.position = 'relative';
            examplePermissions.style.top = '-27px';

            var exampleType = document.createElement('p');
            exampleType.innerText = 'Тип: ' + example.documentType;
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
            exampleType.style.width = '180px';
            exampleType.style.display = 'inline-block';
            exampleType.style.marginLeft = '15px';
            exampleType.style.position = 'relative';
            exampleType.style.top = '-26px';

            var downloadButton = document.createElement('button');
            downloadButton.id = 'download-button-' + i;
            downloadButton.className = 'sca-example-file-button size-24 light dark-background download-button';
            downloadButton.innerText = 'Сохранить';

            var deleteButton = document.createElement('button');
            deleteButton.id = 'delete-button-' + i;
            deleteButton.className = 'sca-example-file-button size-24 light dark-background delete-button';
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

    function getProjectAreaData() {
        axios({
            url: apiURL + '/scientific_advisor/project/area/all',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setProjectAreaData(response.data);
            //console.log(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function fillAreaData() {
        for (var i = 0; i < projectAreaData.length; i++) {
            var areaOption = document.createElement('option');
            areaOption.value = projectAreaData[i];
            areaOption.innerText = projectAreaData[i];
            document.getElementById('dropdown-create-area').appendChild(areaOption);
        }
    }

    // TODO add project selection
    // Создание образца
    function createExample(file, type, area) {
        var formData = new FormData();
        formData.append('documentFormType', type);
        formData.append('documentFormKind', 'Образец');
        formData.append('documentFormDescription', 'Описание образца');
        // Если равно, дать доступ всем студентам
        if (area !== 'Все мои студенты') {
            formData.append('documentFormViewRights', 'Только для проектной области');
        }
        else {
            formData.append('documentFormViewRights', 'Только мои студенты');
        }
        formData.append('file', file);
        // Если равно, дать доступ всем студентам
        if (area !== 'Все мои студенты') {
            console.log(area);
            formData.append('projectArea', area);
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

        // Выбор файла
        $('.sca-example-file-clickable').off().on('click', function () {
            $('.sca-example-file-clickable').removeClass('sca-example-file-clickable-selected');
            $(this).addClass('sca-example-file-clickable-selected');
            document.getElementById('change-permissions-button').disabled = false;
        });

        // Скачать пример
        $('.download-button').off().on('click', function () {
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

        // Открыть выбор файла при создании образца
        $('#create-example-button').off().on('click', function () {
            $('#example-file-input').trigger('click');
        });

    });

    return (
        <div className='sca-examples-div'>
            <div className='clearfix'>
                <div className='sca-examples-menu-div light-background'>
                    <button type='button' onClick={(e) => { setShowCreate(true); }} className='light size-24 dark-background sca-examples-button'>
                        Загрузить файл<br />образца на сайт
                    </button>
                    <button type='button' id='change-permissions-button' disabled className='light size-24 dark-background sca-examples-button'>
                        Изменить права<br />доступа к образцу
                    </button>
                </div>
                <div id='examples-div' className='sca-examples-files-div light-background'>

                </div>
            </div>

            <Modal centered show={showCreate} onEnter={(e) => { fillAreaData(); }} onHide={(e) => { setShowCreate(false); }} className='dark'>
                <Modal.Header className='light-background sca-examples-modal1-header' closeButton>
                    <Modal.Title className='size-30'>
                        <p style={{ height: '50px', marginBottom: '0px', marginLeft: '200px' }}>Загрузить образец</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='light-background sca-examples-modal1-body'>
                    <select id='dropdown-create-type' defaultValue='' onChange={(e) => {
                        if ($('#dropdown-create-type :selected').val() !== '' && $('#dropdown-create-area :selected').val() !== '') {
                            document.getElementById('create-example-button').disabled = false;
                        }

                    }} className='dark size-24 sca-examples-dropdown'>
                        <option value='' disabled hidden>Выберите тип образца</option>
                        <option value='Научно-исследовательская работа'>Научно-исследовательская работа</option>
                        <option value='Практика по получению знаний и умений'>Практика по получению знаний и умений</option>
                        <option value='Преддипломная практика'>Преддипломная практика</option>
                        <option value='ВКР'>ВКР</option>
                    </select>
                    <select id='dropdown-create-area' defaultValue='' onChange={(e) => {
                        if ($('#dropdown-create-type :selected').val() !== '' && $('#dropdown-create-area :selected').val() !== '') {
                            document.getElementById('create-example-button').disabled = false;
                        }
                    }} className='dark size-24 sca-examples-dropdown'>
                        <option value='' disabled hidden>Выберите права доступа к образцу</option>
                        <option value='Все мои студенты'>Все мои студенты</option>
                    </select>
                    <button id='create-example-button' disabled className='size-24 dark-background light sca-modal-button' style={{ marginLeft: '130px' }}>
                        Загрузить файл и создать образец
                    </button>
                    <input id='example-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            document.getElementById('create-example-button').disabled = true;
                            createExample(e.target.files[0], $('#dropdown-create-type :selected').val(), $('#dropdown-create-area :selected').val());
                        }
                    }} />
                </Modal.Body>
            </Modal>

        </div>
    );
}