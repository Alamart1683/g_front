import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import orderImage from '../../images/icons/order.png';

export default function AdminOrdersPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [orders, setOrders] = useState([]);

    const [stage, setStage] = useState('Приказ об организации НИР');
    const [show, setShow] = useState(false);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Неопределенная ошибка');

    if (!fetchedData) {
        setFetchedData(true);
        getOrders();
    }

    // Получение данных о шаблонах заданий
    function getOrders() {
        axios({
            url: apiURL + '/document/view/orders',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            console.log(response.data);
            setOrders(response.data);
            showOrders(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы приказов
    function showOrders(ordersArray) {
        for (var i = 0; i < ordersArray.length; i++) {
            showOrderSingle(ordersArray[i], i);
        }
    }

    function showOrderSingle(order, i) {
        var orderFile = document.createElement('div')
        orderFile.className = 'hoc-order-template-doc';
        orderFile.style.height = '120px';
        orderFile.id = 'hoc-order-template-doc-' + i;

        var orderName = document.createElement('div');
        orderName.className = 'hoc-order-name-div dark-background';
        orderName.id = 'hoc-order-template-name';

        var orderNameImage = document.createElement('img');
        orderNameImage.className = 'hoc-order-template-name-image';
        orderNameImage.src = orderImage;
        orderNameImage.style.position = 'relative';
        orderNameImage.style.top = '-55px';

        var orderTitles = document.createElement('div');
        orderTitles.className = 'hoc-order-titles-div';
        orderTitles.style.width = '647px';

        var orderNameText = document.createElement('p');
        orderNameText.className = 'hoc-order-template-name-text light size-24';
        orderNameText.innerText = order.documentName;
        orderNameText.style.maxWidth = '350px';
        orderNameText.style.marginBottom = '-5px';

        var orderNum = document.createElement('p');
        orderNum.className = 'hoc-order-template-name-text light size-24';
        orderNum.innerText = 'Номер: ' + order.number;
        orderNum.style.display = 'inline-block';
        orderNum.style.marginBottom = '-5px';

        var orderSpeciality = document.createElement('p');
        orderSpeciality.className = 'hoc-order-template-name-text light size-24';
        orderSpeciality.innerText = 'Направление: ' + order.speciality;
        orderSpeciality.style.display = 'block';
        orderSpeciality.style.marginBottom = '0px';

        var orderDate = document.createElement('p');
        orderDate.className = 'hoc-order-template-name-text light size-22';
        orderDate.innerText = 'Дата: ' + order.orderDate;
        orderDate.style.marginBottom = '0px';

        var orderStartDate = document.createElement('p');
        orderStartDate.className = 'hoc-order-template-name-text light size-22';
        orderStartDate.innerText = 'Дата начала: ' + order.startDate;
        orderStartDate.style.marginBottom = '0px';
        orderStartDate.style.marginLeft = '5px';

        var orderEndDate = document.createElement('p');
        orderEndDate.className = 'hoc-order-template-name-text light size-22';
        orderEndDate.innerText = 'Дата конца: ' + order.endDate;
        orderEndDate.style.marginBottom = '0px';
        orderEndDate.style.marginLeft = '5px';

        var orderDownload = document.createElement('button');
        orderDownload.className = 'hoc-order-template-download-button light size-22';
        orderDownload.id = 'hoc-order-download-button';
        orderDownload.innerText = "Сохранить";
        orderDownload.style.height = '125px'
        orderDownload.style.width = '105px';
        orderDownload.style.verticalAlign = 'top';
        orderDownload.style.marginTop = '-5px';

        var orderDelete = document.createElement('button');
        orderDelete.className = 'hoc-order-template-delete-button light size-22';
        orderDelete.id = 'hoc-order-delete-button';
        orderDelete.innerText = "Удалить";
        orderDelete.style.height = '125px'
        orderDelete.style.width = '100px';
        orderDelete.style.verticalAlign = 'top';
        orderDelete.style.marginTop = '-5px';

        // Кнопка просмотреть
        var viewButton = document.createElement('button');
        viewButton.className = 'hoc-order-template-delete-button light size-22 version-view-button';
        viewButton.id = 'order-view-' + i;
        viewButton.innerText = 'Просмотреть';
        viewButton.type = 'button';
        viewButton.style.height = '125px';
        viewButton.style.width = '135px';
        viewButton.type = 'button';
        viewButton.style.verticalAlign = 'top';
        viewButton.style.marginTop = '-5px';

        orderName.appendChild(orderNameImage);

        orderTitles.appendChild(orderNameText);
        orderTitles.appendChild(orderNum);
        orderTitles.appendChild(orderSpeciality);
        orderTitles.appendChild(orderDate);
        orderTitles.appendChild(orderStartDate);
        orderTitles.appendChild(orderEndDate);
        orderName.appendChild(orderTitles);

        orderFile.appendChild(orderName);
        orderFile.appendChild(viewButton);
        orderFile.appendChild(orderDownload);
        orderFile.appendChild(orderDelete);

        switch (order.documentType) {
            case 'Научно-исследовательская работа':
                document.getElementById("hoc-orders-document-panel1").appendChild(orderFile);
                break;
            case 'Практика по получению знаний и умений':
                document.getElementById("hoc-orders-document-panel2").appendChild(orderFile);
                break;
            case 'Преддипломная практика':
                document.getElementById("hoc-orders-document-panel3").appendChild(orderFile);
                break;
            case 'ВКР':
                document.getElementById("hoc-orders-document-panel4").appendChild(orderFile);
                break;
            default:
                console.log('switchError');
        }
    }

    function uploadOrder(file, orderType, orderSpeciality, orderNum, orderDate, orderStartDate, orderEndDate) {
        // формат дат в JavaScript yyyy-mm-dd
        orderDate = orderDate.split('-')[2] + '.' + orderDate.split('-')[1] + '.' + orderDate.split('-')[0];
        orderStartDate = orderStartDate.split('-')[2] + '.' + orderStartDate.split('-')[1] + '.' + orderStartDate.split('-')[0];
        orderEndDate = orderEndDate.split('-')[2] + '.' + orderEndDate.split('-')[1] + '.' + orderEndDate.split('-')[0];
        var formData = new FormData();
        switch (orderType) {
            case 'Приказ об организации НИР':
                formData.append('documentFormType', 'Научно-исследовательская работа');
                formData.append('documentFormKind', 'Приказ');
                formData.append('documentFormDescription', 'Приказ о выходе на НИР');
                formData.append('documentFormViewRights', 'Все пользователи');
                formData.append('number', orderNum);
                formData.append('orderDate', orderDate);
                formData.append('startDate', orderStartDate);
                formData.append('endDate', orderEndDate);
                formData.append('speciality', orderSpeciality);
                formData.append('file', file);
                break;
            case 'Приказ об организации ПпППУиОПД':
                formData.append('documentFormType', 'Практика по получению знаний и умений');
                formData.append('documentFormKind', 'Приказ');
                formData.append('documentFormDescription', 'Приказ о выходе на НИР');
                formData.append('documentFormViewRights', 'Все пользователи');
                formData.append('number', orderNum);
                formData.append('orderDate', orderDate);
                formData.append('startDate', orderStartDate);
                formData.append('endDate', orderEndDate);
                formData.append('speciality', orderSpeciality);
                formData.append('file', file);
                break;
            case 'Приказ об организации ПП':
                formData.append('documentFormType', 'Преддипломная практика');
                formData.append('documentFormKind', 'Приказ');
                formData.append('documentFormDescription', 'Приказ о выходе на НИР');
                formData.append('documentFormViewRights', 'Все пользователи');
                formData.append('number', orderNum);
                formData.append('orderDate', orderDate);
                formData.append('startDate', orderStartDate);
                formData.append('endDate', orderEndDate);
                formData.append('speciality', orderSpeciality);
                formData.append('file', file);
                break;
            case 'Приказ об организации ВКР':
                formData.append('documentFormType', 'ВКР');
                formData.append('documentFormKind', 'Приказ');
                formData.append('documentFormDescription', 'Приказ о выходе на НИР');
                formData.append('documentFormViewRights', 'Все пользователи');
                formData.append('number', orderNum);
                formData.append('orderDate', orderDate);
                formData.append('startDate', orderStartDate);
                formData.append('endDate', orderEndDate);
                formData.append('speciality', orderSpeciality);
                formData.append('file', file);
                break;
            default:
                console.log('Неопознанный тип приказа');
        }
        axios({
            url: apiURL + '/head_of_cathedra/document/order/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);

            if (response.data.indexOf('Файл с таким именем уже существует') > -1) {
                setErrorMessage('Ошибка при загрузке приказа, файл с таким именем уже существует!');
                setShowError(true);
            } else if (/\d/.test(response.data[0])) {
                var orderVersion = {};
                //orderVersion['systemCreatorID'] = authTokens.fio;
                orderVersion['documentName'] = file.name;
                switch (orderType) {
                    case 'Приказ об организации НИР':
                        orderVersion['documentType'] = 'Научно-исследовательская работа';
                        break;
                    case 'Приказ об организации ПпППУиОПД':
                        orderVersion['documentType'] = 'Практика по получению знаний и умений';
                        break;
                    case 'Приказ об организации ПП':
                        orderVersion['documentType'] = 'Преддипломная практика';
                        break;
                    case 'Приказ об организации ВКР':
                        orderVersion['documentType'] = 'ВКР';
                        break;
                    default:
                        console.log('order type error');
                };
                orderVersion['endDate'] = orderEndDate;
                orderVersion['number'] = orderNum;
                orderVersion['orderDate'] = orderDate;
                orderVersion['startDate'] = orderStartDate;
                orderVersion['specialityCode'] = orderSpeciality;
                switch (orderSpeciality) {
                    case '09.03.01':
                        orderVersion['speciality'] = 'Информатика и вычислительная техника';
                        break;
                    default:
                        orderVersion['speciality'] = 'Программная инженерия';
                };
                orderVersion['systemCreatorID'] = response.data[0].split(',')[1];
                showOrderSingle(orderVersion, orders.length);
                if (orders.length > 0) {
                    setOrders(orders.concat(orderVersion));
                }
                else {
                    setOrders([...orders, orderVersion]);
                }
            }
            else {
                setErrorMessage('Ошибка при загрузке приказа!');
                setShowError(true);
            }
        }).catch(result => {
            console.log(result);
            setErrorMessage('Ошибка при загрузке приказа!');
            setShowError(true);
        });
    }

    function checkIfCanUpload() {
        var date1 = new Date($('#order-date').val());
        var valid1 = !isNaN(date1.valueOf());

        var date2 = new Date($('#order-start-date').val());
        var valid2 = !isNaN(date2.valueOf());

        var date3 = new Date($('#order-end-date').val());
        var valid3 = !isNaN(date3.valueOf());

        if ($('#dropdown-order-type :selected').val() !== '' &&
            $('#dropdown-order-speciality :selected').val() !== '' &&
            $('#order-num').val() !== '' &&
            valid1 && valid2 && valid3) {
            document.getElementById('create-order-button').disabled = false;
        }
        else {
            document.getElementById('create-order-button').disabled = true;
        }
    }

    $(function () {
        // Отображение расфасованных приказов
        $('.orders-templates-button').off().on('click', function (event) {
            $('.hoc-orders-templates-document-panel').addClass('hoc-orders-templates-document-panel-hidden');
            var buttonId = $(this).attr('id');
            $('.orders-templates-button').removeClass('orders-templates-button-selected');
            $(this).addClass('orders-templates-button-selected');
            switch (buttonId) {
                case 'button-1':
                    setStage('Приказ об организации НИР');
                    $('#hoc-orders-document-panel1').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-2':
                    setStage('Приказ об организации ПпППУиОПД');
                    $('#hoc-orders-document-panel2').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-3':
                    setStage('Приказ об организации ПП');
                    $('#hoc-orders-document-panel3').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-4':
                    setStage('Приказ об организации ВКР');
                    $('#hoc-orders-document-panel4').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                default:
                    console.log('switchError');
            }
        })

        // Скачать приказ
        $('.hoc-order-template-download-button').off().on('click', function (event) {
            var systemDocumentId = $(this).parent().attr('id');
            var arrayID = systemDocumentId.split('-')[4];
            axios({
                url: apiURL + '/document/download/',
                method: 'GET',
                responseType: 'blob',
                params: {
                    'creator_id': orders[arrayID].systemCreatorID,
                    'documentName': orders[arrayID].documentName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', orders[arrayID].documentName);
                document.body.appendChild(link);
                link.click();

            }).catch(result => {
                console.log(result.data);
                setErrorMessage('Ошибка при скачивании приказа!');
                setShowError(true);
            });
        });

        // Удалить приказ
        $('.hoc-order-template-delete-button').off().on('click', function () {
            var systemDocumentId = $(this).parent().attr('id');
            var arrayId = systemDocumentId.split('-')[4];
            //console.log(orders[arrayId].documentName);
            axios({
                url: apiURL + '/scientific_advisor/document/delete/',
                method: 'DELETE',
                params: {
                    documentName: orders[arrayId].documentName,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //window.location.reload(true);
                $(this).parent().remove();
            }).catch(result => {
                console.log(result);
                setErrorMessage('Ошибка при удалении приказа!');
                setShowError(true);
            });
        });

        $('#create-order-button').off().on('click', function () {
            $('#order-file-input').trigger('click');
        });

        $('.version-view-button').off().on('click', function (e) {
            e.preventDefault();
            var arrayId = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/document/get/outer/link/single',
                method: 'GET',
                params: {
                    'creatorID': orders[arrayId].systemCreatorID,
                    'documentName': orders[arrayId].documentName,
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
                <div className='hoc-templates-orders-buttons-panel' id='hoc-orders-buttons-panel'>
                    <button type='button' className='size-22 light orders-templates-button orders-templates-button-selected' id='button-1'>
                        Научно-исследовательская работа
                    </button>

                    <button type='button' className='size-22 light orders-templates-button' id='button-2'>
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
                    <div className='hoc-orders-templates-document-panel' id='hoc-orders-document-panel1'>
                        <button type='button' onClick={(e) => { setShow(true); }} className='dark-background light size-32 admin-upload-button'>Загрузить приказ</button>
                    </div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel2'>
                        <button type='button' onClick={(e) => { setShow(true); }} className='dark-background light size-32 admin-upload-button'>Загрузить приказ</button>
                    </div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel3'>
                        <button type='button' onClick={(e) => { setShow(true); }} className='dark-background light size-32 admin-upload-button'>Загрузить приказ</button>
                    </div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel4'>
                        <button type='button' onClick={(e) => { setShow(true); }} className='dark-background light size-32 admin-upload-button'>Загрузить приказ</button>
                    </div>
                </div>
            </div>
            <Modal centered show={show} onHide={(e) => { setShow(false); }} className='dark'>
                <Modal.Header className='light-background sca-examples-modal1-header' closeButton>
                    <Modal.Title className='size-30'>
                        <p style={{ height: '50px', marginBottom: '0px', marginLeft: '260px' }}>Загрузить приказ</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='light-background sca-examples-modal1-body'>
                    <select id='dropdown-order-type' defaultValue={stage} className='dark size-24 sca-examples-dropdown' onChange={(e) => { checkIfCanUpload(); }}>
                        <option value='' disabled hidden>Выберите тип приказа</option>
                        <option value='Приказ об организации НИР'>Приказ об организации НИР</option>
                        <option value='Приказ об организации ПпППУиОПД'>Приказ об организации ПпППУиОПД</option>
                        <option value='Приказ об организации ПП'>Приказ об организации ПП</option>
                        <option value='Приказ об организации ВКР'>Приказ об организации ВКР</option>
                    </select>

                    <div className='info-row' style={{ marginTop: '5px' }}>
                        <div className='info-column'>
                            <label htmlFor='order-date' style={{ marginLeft: '15px' }} className='dark size-24'>Дата выхода приказа:</label>
                            <input id='order-date' type='date' min='2019-01-01' max='2050-01-01' style={{ width: '300px' }} className='dark size-24 hoc-order-date-input' onChange={(e) => { checkIfCanUpload(); }}></input>
                            <input id='order-num' type='text' maxLength='100' className='dark size-24 sca-examples-dropdown' style={{ width: '300px' }} placeholder='Введите номер приказа' onChange={(e) => { checkIfCanUpload(); }}></input>
                            <select id='dropdown-order-speciality' defaultValue='' style={{ width: '300px' }} className='dark size-24 sca-examples-dropdown' onChange={(e) => { checkIfCanUpload(); }}>
                                <option value='' disabled hidden>Выберите направление</option>
                                <option value='09.03.01'>09.03.01</option>
                                <option value='09.03.04'>09.03.04</option>
                            </select>
                        </div>
                        <div className='info-column'>

                            <label htmlFor='order-start-date' style={{ marginLeft: '45px' }} className='dark size-24'>Дата начала:</label>
                            <input id='order-start-date' type='date' min='2019-01-01' max='2050-01-01' style={{ marginLeft: '30px' }} className='dark size-24 hoc-order-date-input' onChange={(e) => { checkIfCanUpload(); }}></input>

                            <label htmlFor='order-end-date' style={{ marginLeft: '45px' }} className='dark size-24'>Дата конца:</label>
                            <input id='order-end-date' type='date' min='2019-01-01' max='2050-01-01' style={{ marginLeft: '30px' }} className='dark size-24 hoc-order-date-input' onChange={(e) => { checkIfCanUpload(); }}></input>
                        </div>
                    </div>

                    <button type='button' id='create-order-button' disabled className='size-24 dark-background light sca-modal-button' style={{ marginLeft: '180px' }}>
                        Выбрать файл и<br />загрузить приказ на сервер
                    </button>
                    <input id='order-file-input' type='file' style={{ display: 'none' }} onChange={(e) => {
                        if (e.target.files.length !== 0) {
                            document.getElementById('create-order-button').disabled = true;
                            setShow(false);
                            uploadOrder(e.target.files[0],
                                $('#dropdown-order-type :selected').val(),
                                $('#dropdown-order-speciality :selected').val(),
                                $('#order-num').val(),
                                $('#order-date').val(),
                                $('#order-start-date').val(),
                                $('#order-end-date').val());
                        }
                    }} ></input>
                </Modal.Body>
            </Modal>
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