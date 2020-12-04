import React, { useState } from 'react';
import { useAuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../../Config';
import $ from 'jquery';

export default function StudentThemePage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [theme, setTheme] = useState('');

    if (!fetchedData) {
        setFetchedData(true);
        getTheme();
    }

    function getTheme() {
        axios({
            url: apiURL + '/student/get/vkr_theme',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setTheme(response.data.vkrTheme);
            if ( !response.data.vkrThemeEditable) {
                document.getElementById('error-message').style.visibility = 'visible';
            }
        }).catch(result => {
            console.log(result.data);
        });
    }

    $(function () {
        $('#change-theme-button').off().on('click', function () {
          axios({
            url: apiURL + '/student/set/vkr_theme',
            method: 'POST',
            params: {
              'newTheme': theme
            },
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
          }).then((response) => {
            //console.log(response.data);
            window.location.reload();
          }).catch(result => {
            console.log(result.data);
          });
    
        });
    });

    return(
        <div>
            <div className='ordersPanel'>
                <div id="orderContentPanel1" className="contentPanel" style={{ minHeight: '450px'}}>
                    <p style={{ marginLeft: '600px' }} className='dark size-72'>Тема ВКР</p>
                    
                    <textarea style={{ marginLeft: '90px', height: '120px', textAlign: 'center', width:'1300px', maxHeight:'300px' }} maxLength='1023' id='theme' type='text' value={theme} onChange={(e) => {
                        setTheme(e.target.value);
                        if ($('#theme').val() !== '' &&  document.getElementById('error-message').style.visibility != 'visible') {
                            document.getElementById('change-theme-button').disabled = false;
                        }
                        else {
                            document.getElementById('change-theme-button').disabled = true;
                        }
                    }} className='admin-registration-input dark size-36' placeholder='Введите тему ВКР'></textarea>

                    <p id='error-message' style={{ visibility: 'hidden', marginBottom: '10px', marginLeft:'300px' }} className='dark size-32'>Научный руководитель одобрил тему, её больше нельзя изменять!</p>

                    <button id='change-theme-button' disabled className='admin-registration-button light size-72 dark-background'
                        style={{ marginLeft: '450px', marginTop: '30px', width: '600px' }}>Сменить тему ВКР</button>
                </div>
            </div>

        </div>
    )
}