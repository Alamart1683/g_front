import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import orderImage from '../../images/icons/order.png';

export default function HocOrdersPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        showOrders(orders);
    }, [orders]);

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
            //console.log(response.data);
            setOrders(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    // Заполнение таблицы приказов
    function showOrders(ordersArray) {
        for (var i = 0; i < ordersArray.length; i++) {
            var order = ordersArray[i];

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
            orderNameImage.style.top = '-80px';

            var orderTitles = document.createElement('div');
            orderTitles.className = 'hoc-order-titles-div';

            var orderNameText = document.createElement('p');
            orderNameText.className = 'hoc-order-template-name-text light size-20';
            orderNameText.innerText = order.documentName;
            orderNameText.style.maxWidth = '350px';
            orderNameText.style.marginBottom = '0px';

            var orderNum = document.createElement('p');
            orderNum.className = 'hoc-order-template-name-text light size-20';
            orderNum.innerText = 'Номер: ' + order.number;
            orderNum.style.display = 'inline-block';
            orderNum.style.marginBottom = '0px';

            var orderSpeciality = document.createElement('p');
            orderSpeciality.className = 'hoc-order-template-name-text light size-20';
            orderSpeciality.innerText = 'Направление: ' + order.speciality;
            orderSpeciality.style.display = 'block';
            orderSpeciality.style.marginBottom = '0px';

            var orderDate = document.createElement('p');
            orderDate.className = 'hoc-order-template-name-text light size-20';
            orderDate.innerText = 'Дата: ' + order.orderDate;
            orderDate.style.marginBottom = '0px';

            var orderStartDate = document.createElement('p');
            orderStartDate.className = 'hoc-order-template-name-text light size-20';
            orderStartDate.innerText = 'Дата начала: ' + order.startDate;
            orderStartDate.style.marginLeft = '10px';
            orderStartDate.style.marginBottom = '0px';

            var orderEndDate = document.createElement('p');
            orderEndDate.className = 'hoc-order-template-name-text light size-20';
            orderEndDate.innerText = 'Дата конца: ' + order.endDate;
            orderEndDate.style.marginBottom = '0px';
            orderEndDate.style.marginLeft = '10px';

            var orderDownload = document.createElement('button');
            orderDownload.className = 'hoc-order-template-download-button light size-22';
            orderDownload.id = 'hoc-order-download-button';
            orderDownload.innerText = "Сохранить";
            orderDownload.style.height = '120px';
            orderDownload.style.width = '105px';
            orderDownload.style.position = 'relative';
            orderDownload.style.top = '-62px';

            var orderConfirm = document.createElement('button');
            orderConfirm.className = 'hoc-order-template-delete-button light size-22 hoc-order-template-confirm-button';
            orderConfirm.id = 'confirm-button-' + i;
            orderConfirm.innerText = 'Одобрить';
            orderConfirm.style.height = '120px';
            orderConfirm.style.width = '100px';
            orderConfirm.style.position = 'relative';
            orderConfirm.style.top = '-62px';

            var orderStatus = document.createElement('p');
            orderStatus.className = 'hoc-order-template-name-text light size-20';
            if (order.approved) {
                orderStatus.innerText = 'Статус: Одобрено';
                orderConfirm.disabled = true;
            }
            else {
                orderStatus.innerText = 'Статус: Не одобрено';
            }
            orderStatus.style.display = 'block';
            orderStatus.style.marginTop = '-6px';
            orderStatus.style.marginBottom = '0px';
            
            // Кнопка просмотреть
            var viewButton = document.createElement('button');
            viewButton.className = 'hoc-order-template-download-button light size-22 version-view-button';
            viewButton.id = 'template-view-' + i;
            viewButton.innerText = 'Просмотреть';
            viewButton.style.height = '120px';
            viewButton.style.width = '135px';
            viewButton.style.position = 'relative';
            viewButton.style.top = '-62px';
            viewButton.type = 'button';

            orderName.appendChild(orderNameImage);

            orderTitles.appendChild(orderNameText);
            orderTitles.appendChild(orderNum);
            orderTitles.appendChild(orderSpeciality);
            orderTitles.appendChild(orderDate);
            orderTitles.appendChild(orderStartDate);
            orderTitles.appendChild(orderEndDate);
            orderTitles.appendChild(orderStatus);
            orderName.appendChild(orderTitles);

            orderFile.appendChild(orderName);
            orderFile.appendChild(viewButton);
            orderFile.appendChild(orderConfirm);
            orderFile.appendChild(orderDownload);

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
                    $('#hoc-orders-document-panel1').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-2':
                    $('#hoc-orders-document-panel2').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-3':
                    $('#hoc-orders-document-panel3').removeClass('hoc-orders-templates-document-panel-hidden');
                    break;
                case 'button-4':
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
            });
        });

        // Одобрить приказ
        $('.hoc-order-template-confirm-button').off().on('click', function (event) {
            // example id = confirm-button-2
            var arrayID = $(this).attr('id').split('-')[2];
            axios({
                url: apiURL + '/head_of_cathedra/only/approve/order',
                method: 'POST',
                params: {
                    'documentID': orders[arrayID].documentVersions[0].systemDocumentID,
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
                <div className='hoc-templates-orders-buttons-panel' style={{height:'400px'}} id='hoc-orders-buttons-panel'>
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
                    <div className='hoc-orders-templates-document-panel' id='hoc-orders-document-panel1'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel2'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel3'></div>
                    <div className='hoc-orders-templates-document-panel hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel4'></div>
                </div>
            </div>
        </div>
    );
}