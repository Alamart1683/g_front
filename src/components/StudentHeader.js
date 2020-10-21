import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import iconBell from '../images/icons/bell.png';
import iconInfo from '../images/icons/info.png';
import iconDisc from '../images/icons/disc.png';
import iconMyProject from '../images/icons/myproject.png';

export default function StudentHeader() {
    const { authTokens, setAuthTokens  } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    var studentName;
    try {
        studentName = authTokens.fio;
    }
    catch (e) {
        studentName = 'Ошибка имени';
    };


    return(
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/stu/info'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconInfo} thumbnail className='student-navbar-image dark-background'/>
                        Информация
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/docs'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconMyProject} thumbnail className='student-navbar-image dark-background'/>
                        Документы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='#'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconDisc} thumbnail className='student-navbar-image dark-background'/>
                        Обучающие<br></br>программы
                    </button>
                </Nav.Link>
                <NavDropdown title={
                    <p className='student-navbar-name dark-background light size-30'>
                        <Image src={iconBell} thumbnail className='student-navbar-image dark-background'/>
                        {studentName}
                    </p>
                    } id='studentName' >
                    <NavDropdown.Item>Action</NavDropdown.Item>
                    <NavDropdown.Item>Another action</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={ () => { logOut() }}>Выйти</NavDropdown.Item>
                </NavDropdown>
            </Navbar>
        </div>

    );
    

}