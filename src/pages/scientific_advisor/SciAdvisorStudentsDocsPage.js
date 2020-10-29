import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

import iconDocuments from '../../images/icons/documents.png';
import iconLookingGlass from '../../images/icons/lookingglass.png';
import iconDelete from '../../images/icons/delete.png';
import iconDeleteDisable from '../../images/icons/delete_disable.png';

export default function SciAdvisorStudentsDocsPage(){

    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [documentData, setDocumentData] = useState('');
    const [fileToDelete, setFileToDelete] = useState([]);

    useEffect(() => {
        showFiles(documentData);
    });

    if (!fetchedData) {
        setFetchedData(true);
        getStudentDocs();
    }

    function getStudentDocs() {
        console.log('bruh');
    }

    function showFiles(documentArray) {
        console.log('bruh');
    }

    function searchFiles() {
        console.log('bruh');
    }

    function deleteFile() {
        console.log('bruh');
    }

    function downloadFile() {
        console.log('bruh');
    }


    return(
        <div className='student-document-form'>
            <div className='student-document-search-div light-background'>
                <input id='fileSearch' type='text' className='student-document-search dark size-32'/>
                <button onClick={()=>{searchFiles();}} className='student-document-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background'/>
                    Поиск
                </button>
            </div>
            <div className='student-document-form-menu light-background'>
                <p className='dark size-32'>Фильтры:</p>
                <div>
                    <p className='dark size-28 filter-title'>Вид:</p>
                    <div>
                        <input type='checkbox' id='checkNir' name='checkNir' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkNir' className='dark size-24 file-filter-checkbox-label'>НИР</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkLongPP' name='checkLongPP' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkLongPP' className='dark size-24 file-filter-checkbox-label'>ПпППУиОПД</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkPP' name='checkPP' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkPP' className='dark size-24 file-filter-checkbox-label'>ПП</label>
                    </div>
                    <div>
                        <input type='checkbox' id='checkVkr' name='checkVkr' className='file-filter-checkbox' defaultChecked/>
                        <label htmlFor='checkVkr' className='dark size-24 file-filter-checkbox-label'>ВКР</label>
                    </div>
                    
                </div>
            </div>
            <div id='file-div' className='student-document-form-docs light-background'>
                
            </div>
        </div>
    );
}