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
            console.log(response.data);
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
            orderFile.id = 'hoc-order-template-doc-' + i;

            var orderName = document.createElement('div');
            orderName.className = 'hoc-order-template-name light-background';
            orderName.id = 'hoc-order-template-name';

            var orderNameText = document.createElement('p');
            orderNameText.className = 'hoc-order-template-name-text light size-22';
            orderNameText.innerText = order.documentName;

            var orderNameImage = document.createElement('img');
            orderNameImage.className = 'hoc-order-template-name-image'
            orderNameImage.src = orderImage;

            orderName.appendChild(orderNameImage);
            orderName.appendChild(orderNameText);

            var orderDownload = document.createElement('button');
            orderDownload.className = 'hoc-order-template-download-button light size-22';
            orderDownload.id = 'hoc-order-download-button';
            orderDownload.innerText = "Сохранить";

            var orderDelete = document.createElement('button');
            orderDelete.className = 'hoc-order-template-delete-button light size-22';
            orderDelete.id = 'hoc-order-delete-button';
            orderDelete.innerText = "Удалить";

            orderFile.appendChild(orderName);
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

        // Удалить приказ
        $('.hoc-order-template-delete-button').off().on('click', function () {
            var systemDocumentId = $(this).parent().attr('id');
            var arrayId = systemDocumentId.split('-')[4];
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
                window.location.reload(true);
            }).catch(result => {
                console.log(result.data);
            });
        });
    });

    return(
        <div className='orders-templates-panel'>
            <div className='hoc-templates-orders-buttons-panel' id='hoc-orders-buttons-panel'>
                <button type='submit' className='size-22 light orders-templates-button' id='button-1'>
                    Научно-исследовательская работа
                </button>

                <button type='submit' className='size-22 light orders-templates-button' id='button-2'>
                    ПпППУиОПД
                </button>

                <button type='submit' className='size-22 light orders-templates-button' id='button-3'>
                    Преддипломная практика
                </button>

                <button type='submit' className='size-22 light orders-templates-button' id='button-4'>
                    Защита ВКР
                </button>

                <button type='button' className='size-22 light orders-templates-upload-button' id='upload-button'>
                    Загрузить приказ
                </button>
            </div>

            <div className='hoc-orders-templates-document-panel-common'>
                <div className='hoc-orders-templates-document-panel' id='hoc-orders-document-panel1'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel2'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel3'></div>
                <div className='hoc-orders-templates-document-panel-hidden' id='hoc-orders-document-panel4'></div>
            </div>
        </div>
    );
}