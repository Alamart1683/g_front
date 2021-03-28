import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import orderImage from '../../images/icons/order.png';

export default function OrdersPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        showOrdersFancy(orders);
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
    function showOrdersFancy(ordersArray) {
        for (var i = 0; i < ordersArray.length; i++) {
            var order = ordersArray[i];

            var orderFile = document.createElement('div')
            orderFile.className = 'hoc-order-template-doc';
            orderFile.style.height = '120px';
            orderFile.id = 'hoc-order-template-doc-' + i;
            orderFile.style.width = '1460px';

            var orderName = document.createElement('div');
            orderName.className = 'hoc-order-name-div dark-background';
            orderName.id = 'hoc-order-template-name';
            orderName.style.width = '1040px';
            orderName.style.whiteSpace = 'nowrap';

            var orderNameImage = document.createElement('img');
            orderNameImage.className = 'hoc-order-template-name-image';
            orderNameImage.src = orderImage;
            orderNameImage.style.position = 'relative';
            orderNameImage.style.top = '-65px';

            var orderTitles = document.createElement('div');
            orderTitles.className = 'hoc-order-titles-div';
            orderTitles.style.width = '900px';

            var orderNameText = document.createElement('p');
            orderNameText.className = 'hoc-order-template-name-text light size-24';
            orderNameText.innerText = order.documentName;
            orderNameText.style.maxWidth = '350px';
            orderNameText.style.marginBottom = '0px';

            var orderNum = document.createElement('p');
            orderNum.className = 'hoc-order-template-name-text light size-24';
            orderNum.innerText = 'Номер: ' + order.number;
            orderNum.style.display = 'inline-block';
            orderNum.style.marginBottom = '0px';

            var orderSpeciality = document.createElement('p');
            orderSpeciality.className = 'hoc-order-template-name-text light size-24';
            orderSpeciality.innerText = 'Направление: ' + order.speciality;
            orderSpeciality.style.display = 'block';
            orderSpeciality.style.marginBottom = '0px';

            var orderDate = document.createElement('p');
            orderDate.className = 'hoc-order-template-name-text light size-24';
            orderDate.innerText = 'Дата: ' + order.orderDate;
            orderDate.style.marginBottom = '0px';

            var orderStartDate = document.createElement('p');
            orderStartDate.className = 'hoc-order-template-name-text light size-24';
            orderStartDate.innerText = 'Дата начала: ' + order.startDate;
            orderStartDate.style.marginBottom = '0px';

            var orderEndDate = document.createElement('p');
            orderEndDate.className = 'hoc-order-template-name-text light size-24';
            orderEndDate.innerText = 'Дата конца: ' + order.endDate;
            orderEndDate.style.marginBottom = '0px';

            var orderDownload = document.createElement('button');
            orderDownload.className = 'hoc-order-template-download-button light size-22';
            orderDownload.id = 'download-button-' + i;
            orderDownload.innerText = "Сохранить";
            orderDownload.style.height = '125px'
            orderDownload.style.width = '200px';
            orderDownload.style.verticalAlign = 'top';
            orderDownload.style.marginTop = '-5px';
            
            // Кнопка просмотреть
            var viewButton = document.createElement('button');
            viewButton.className = 'hoc-order-template-download-button light size-22 version-view-button';
            viewButton.id = 'template-view-' + i;
            viewButton.innerText = 'Просмотреть';
            viewButton.style.height = '125px';
            viewButton.style.width = '200px';
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

            switch (order.documentType) {
                case 'Научно-исследовательская работа':
                    document.getElementById("orderContentPanel1").appendChild(orderFile);
                    break;
                case 'Практика по получению знаний и умений':
                    document.getElementById("orderContentPanel2").appendChild(orderFile);
                    break;
                case 'Преддипломная практика':
                    document.getElementById("orderContentPanel3").appendChild(orderFile);
                    break;
                case 'ВКР':
                    document.getElementById("orderContentPanel4").appendChild(orderFile);
                    break;
                default:
                    console.log('switchError');
            }
        }
    }

    $(function () {
        // Скачать приказ
        $('.hoc-order-template-download-button').off().on('click', function (event) {
            var systemDocumentId = $(this).attr('id');
            var arrayID = systemDocumentId.split('-')[2];
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

        $('.contentButton').off().on('click', function (event) {
            $('.contentPanel').addClass('contentPanel-hidden');
            var buttonId = $(this).attr('id');
            $('.contentButton').removeClass('contentButton-selected');
            $(this).addClass('contentButton-selected');
            switch (buttonId) {
                case 'button-1':
                    $('#orderContentPanel1').removeClass('contentPanel-hidden');
                    break;
                case 'button-2':
                    $('#orderContentPanel2').removeClass('contentPanel-hidden');
                    break;
                case 'button-3':
                    $('#orderContentPanel3').removeClass('contentPanel-hidden');
                    break;
                case 'button-4':
                    $('#orderContentPanel4').removeClass('contentPanel-hidden');
                    break;
                default:
                    console.log('switchError');
            }
        })

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
        <div className="ordersPanel">
            <div className="typeButtonPanel">
                <button type='submit' id='button-1' className="contentButton contentButton-selected light size-22">Научно-исследовательская работа</button>
                <button type='submit' id='button-2' className="contentButton light size-22">ПпППУиОПД</button>
                <button type='submit' id='button-3' className="contentButton light size-22">Преддипломная практика</button>
                <button type='submit' id='button-4' className="contentButton light size-22" style={{ marginRight: "0px" }}>Защита ВКР</button>
            </div>

            <div id="orderContentPanel1" className="contentPanel">

            </div>
            <div id="orderContentPanel2" className="contentPanel contentPanel-hidden">

            </div>
            <div id="orderContentPanel3" className="contentPanel contentPanel-hidden">

            </div>
            <div id="orderContentPanel4" className="contentPanel contentPanel-hidden">

            </div>
        </div>
    );
}