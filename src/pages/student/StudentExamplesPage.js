import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconExample from '../../images/icons/samples.png';

export default function StudentExamplesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [examples, setExamples] = useState([]);

    useEffect(() => {
        showExamples();
    });

    if (!fetchedData) {
        setFetchedData(true);
        getExamples();
    }

    function getExamples() {
        axios({
            url: apiURL + '/document/view/templates/student',
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

    function showExamples() {
        //console.log(examples);
        for (var i = 0; i < examples.length; i++) {
            var example = examples[i];

            var exampleDiv = document.createElement('div');
            exampleDiv.className = 'student-example-div';

            var titleDiv = document.createElement('div');
            titleDiv.className = 'student-example-title dark-background';

            var exampleImage = document.createElement('img');
            exampleImage.className = 'order-name-image'
            exampleImage.src = iconExample;

            var exampleName = document.createElement('p');
            exampleName.className = 'order-name-text light size-24';
            exampleName.innerText = example.documentName;

            var exampleDownload = document.createElement('button');
            exampleDownload.className = 'student-example-download light size-24';
            exampleDownload.id = 'example-download-' + i;
            exampleDownload.innerText = "Сохранить образец";

            titleDiv.appendChild(exampleImage);
            titleDiv.appendChild(exampleName);
            exampleDiv.appendChild(titleDiv);
            exampleDiv.appendChild(exampleDownload);
            switch (example.documentType) {
                case 'Научно-исследовательская работа':
                    document.getElementById("exampleContentPanel1").appendChild(exampleDiv);
                    break;
                case 'Практика по получению знаний и умений':
                    document.getElementById("exampleContentPanel2").appendChild(exampleDiv);
                    break;
                case 'Преддипломная практика':
                    document.getElementById("exampleContentPanel3").appendChild(exampleDiv);
                    break;
                case 'ВКР':
                    document.getElementById("exampleContentPanel4").appendChild(exampleDiv);
                    break;
                default:
                    console.log('switchError');
            }
        }
    }

    $(function () {

        $('.contentButton').off().on('click', function (event) {
            $('.contentPanel').addClass('contentPanel-hidden');
            var buttonId = $(this).attr('id');
            $('.contentButton').removeClass('contentButton-selected');
            $(this).addClass('contentButton-selected');
            switch (buttonId) {
                case 'button-1':
                    $('#exampleContentPanel1').removeClass('contentPanel-hidden');
                    break;
                case 'button-2':
                    $('#exampleContentPanel2').removeClass('contentPanel-hidden');
                    break;
                case 'button-3':
                    $('#exampleContentPanel3').removeClass('contentPanel-hidden');
                    break;
                case 'button-4':
                    $('#exampleContentPanel4').removeClass('contentPanel-hidden');
                    break;
                default:
                    console.log('switchError');
            }
        })

        $('.student-example-download').off().on('click', function() {
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
    });

    return(
        <div className="ordersPanel">
            <div className="typeButtonPanel">
                <button type='submit' id='button-1' className="contentButton contentButton-selected light size-22">Научно-исследовательская работа</button>
                <button type='submit' id='button-2' className="contentButton light size-22">ПпППУиОПД</button>
                <button type='submit' id='button-3' className="contentButton light size-22">Преддипломная практика</button>
                <button type='submit' id='button-4' className="contentButton light size-22" style={{ marginRight: "0px" }}>Защита ВКР</button>
            </div>

            <div id="exampleContentPanel1" className="contentPanel">

            </div>
            <div id="exampleContentPanel2" className="contentPanel contentPanel-hidden">

            </div>
            <div id="exampleContentPanel3" className="contentPanel contentPanel-hidden">

            </div>
            <div id="exampleContentPanel4" className="contentPanel contentPanel-hidden">

            </div>
        </div>
    );
}