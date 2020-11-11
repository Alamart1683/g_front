import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import iconStudents from '../images/icons/students.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import exitImage from '../images/icons/exit.png';
import iconNR from '../images/icons/NR.png';

export default function AdminHeader() {

    const { authTokens, setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/admin/association'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background'/>
                        Студенты и<br/>научные руководители
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/orders'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background'/>
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/templates'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background'/>
                        Шаблоны
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/registration'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconNR} thumbnail className='student-navbar-image dark-background'/>
                        Регистрация<br/>пользователей
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='#'>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background'/>
                        Выйти
                    </button>
                </Nav.Link>
            </Navbar>
        </div>
    );


}