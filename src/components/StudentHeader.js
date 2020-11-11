import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../Config';
//import $ from 'jquery';

import iconInfo from '../images/icons/info.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import exitImage from '../images/icons/exit.png';
import iconMyProject from '../images/icons/myproject.png';
import iconExamples from '../images/icons/samples.png';
import iconTasks from '../images/icons/tasks.png';

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
            //console.log(response);
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
                <Nav.Link as={Link} to='/stu/tasks'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconTasks} thumbnail className='student-navbar-image dark-background'/>
                        Задания
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/examples'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconExamples} thumbnail className='student-navbar-image dark-background'/>
                        Образцы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/orders'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background'/>
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/templates'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background'/>
                        Шаблоны
                    </button>
                </Nav.Link>
                <Nav.Link>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        Научный руководитель: <br/>{scientificAdvisor}
                    </button>
                </Nav.Link>
                <Nav.Link>
                    <button type='button' onClick={ () => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background'/>
                        Выйти
                    </button>
                </Nav.Link>
            </Navbar>
        </div>

    );
    

}