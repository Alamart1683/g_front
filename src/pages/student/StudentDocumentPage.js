import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocuments from '../../images/icons/documents.png';
import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function StudentDocumentPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    var documentData;

    if (!fetchedData) {
        setFetchedData(true);
        getStudentDocs();
    }

    function getStudentDocs() {
        axios({
            url: apiURL + '/document/view',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            documentData = response.data;
            showFiles(documentData);
          }).catch(result => {
            console.log(result.data);
        });
    }

    function showFiles(documentArray) {
        for (var i=0; i<documentArray.length; i++) {
            var item = documentArray[i];
            console.log(item.documentName);

            var file = document.createElement('div');
            file.className = 'student-file';
            
            var selectableDiv = document.createElement('div');
            selectableDiv.className = 'student-file-selectable dark-background';

            var icon = document.createElement('img');
            icon.src = iconDocuments;
            icon.className = 'icon-small student-file-icon';
            selectableDiv.appendChild(icon);

            var content = document.createElement('p');
            content.className = 'size-32 light student-file-content'
            content.innerHTML += item.documentName;
            selectableDiv.appendChild(content);

            file.appendChild(selectableDiv);

            var deleteButton = document.createElement('button');
            deleteButton.className = 'student-file-delete-button dark-background';

            file.appendChild(deleteButton);

            document.getElementById('file-div').appendChild(file);
        }
    }

    $(document).ready(function() {
        $("button").click(function(event){
            console.log('click');
            event.stopImmediatePropagation();
        });

        $(document).on('click', '.student-file-selectable', function(event) {
            console.log('click2');
            $(this).toggleClass('student-file-selected');
            event.stopImmediatePropagation();
        });
    });

    return(
        <div className='student-document-form'>
            <div className='student-document-search-div light-background'>
                <input type='text' className='student-document-search dark size-32'/>
                <button className='student-document-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background'/>
                    Поиск
                </button>
            </div>
            <div className='student-document-form-menu light-background'>
                <button className='light dark-background size-32 student-document-button'>
                    Изменить документ
                </button>
                <button className='light dark-background size-32 student-document-button'>
                    Загрузить документ
                </button>
                <button className='light dark-background size-32 student-document-button'>
                    Скачать документ
                </button>
            </div>
            <div id='file-div' className='student-document-form-docs light-background'>
                
            </div>
        </div>
    );
}