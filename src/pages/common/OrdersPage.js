import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import orderImage from '../../images/icons/order.png';

export default function OrdersPage () {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [redirect, setRedirect] = useState(false);
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
            orderFile.className = 'order-doc';
            orderFile.id = 'order-doc-' + i;

            var orderName = document.createElement('div');
            orderName.className = 'order-name light-background';
            orderName.id = 'order-doc-name';

            var orderNameText = document.createElement('p');
            orderNameText.className = 'order-name-text light size-24'
            orderNameText.innerText=order.documentDescription;

            var orderNameImage = document.createElement('img');
            orderNameImage.className='order-name-image'
            orderNameImage.src=orderImage;

            orderName.appendChild(orderNameImage);
            orderName.appendChild(orderNameText);

            var orderDownload = document.createElement('button');
            orderDownload.className = 'order-doc-download light size-24';
            orderDownload.id = 'order-doc-download';
            orderDownload.innerText = "Сохранить приказ"

            orderFile.appendChild(orderName);
            orderFile.appendChild(orderDownload);

            document.getElementById("orderContentPanel").appendChild(orderFile);
        }
    }

    $(function() {
        // Скачать шаблон задания
        $('.order-doc-download').off().on('click', function(event) {
            var systemDocumentId = $(this).parent().attr('id');
            // console.log(systemDocumentId);
            var arrayID = systemDocumentId.split('-')[2];
            // console.log(arrayID);
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
    });

    return(
        <div className="ordersPanel">
            <div className="typeButtonPanel">
                <button type='submit' className="contentButton light size-22">Научно-исследовательская работа</button>
                <button type='submit' className="contentButton light size-22">ПпППУиОПД</button>
                <button type='submit' className="contentButton light size-22">Преддипломная практика</button>
                <button type='submit' className="contentButton light size-22" style={{marginRight:"0px"}}>Защита ВКР</button>
            </div>
            
            <div id="orderContentPanel" className="contentPanel">
                
            </div>
        </div>
    );
}