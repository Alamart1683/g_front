import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../Config';
//import $ from 'jquery';

//import iconBell from '../images/icons/bell.png';
import iconInfo from '../images/icons/info.png';
//import iconDisc from '../images/icons/disc.png';
//import iconMyProject from '../images/icons/myproject.png';

export default function StudentHeader() {
    const { authTokens, setAuthTokens  } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [scientificAdvisor, setScientificAdvisor] = useState('');

    if (!fetchedData) {
        setFetchedData(true);
        getScientificAdvisor();
    }

    function getScientificAdvisor() {
        axios({
            url: apiURL + '/student/advisor/data',
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + authTokens.accessToken 
            },
          }).then((response) => {
            //console.log(response.data.advsiorFio);
            setScientificAdvisor(response.data.advsiorFio);
            //console.log(scientificAdvisor);
          }).catch(result => {
            console.log(result.data);
        });
    }

    function logOut() {
        setAuthTokens(null);
    }

    return(
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/stu/info'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconInfo} thumbnail className='student-navbar-image dark-background'/>
                        Информация
                    </button>
                </Nav.Link>
                <Nav.Link>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        Научный руководитель: <br/>{scientificAdvisor}
                    </button>
                </Nav.Link>
                <Nav.Link>
                    <button type='button' onClick={ () => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        Выйти
                    </button>
                </Nav.Link>
            </Navbar>
        </div>

    );
    

}