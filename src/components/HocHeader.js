import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import exitImage from '../images/icons/exit.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import iconStudents from '../images/icons/students.png';
import iconNR from '../images/icons/NR.png';

export default function ScaStuHeader() {
    const { setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    return(
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/hoc/association'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background'/>
                        Студенты и<br/>научные руководители
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/hoc/orders'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background'/>
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/hoc/templates'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background'/>
                        Шаблоны
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/students'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconNR} thumbnail className='student-navbar-image dark-background'/>
                        Перейти в меню<br/>научного руководителя
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