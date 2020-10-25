import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
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
                <NavDropdown title={
                    <p className='student-navbar-name dark-background light size-30'>
                        Научный руководитель: <br/>{scientificAdvisor}
                    </p>
                    }>
                    <NavDropdown.Item>Action</NavDropdown.Item>
                    <NavDropdown.Item>Another action</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={ () => { logOut() }}>Выйти</NavDropdown.Item>
                </NavDropdown>
            </Navbar>
        </div>

    );
    

}