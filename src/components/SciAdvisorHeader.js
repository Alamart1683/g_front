import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import iconStudents from '../images/icons/students.png';
import iconDocuments from '../images/icons/documents.png';

export default function SciAdvisorHeader() {

    const { setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/sca/students'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background' />
                        Мои студенты
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/stu-docs'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconDocuments} thumbnail className='student-navbar-image dark-background' />
                        Документы<br/>студентов
                    </button>
                </Nav.Link>
                <Nav>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        Выйти
                    </button>
                </Nav>
            </Navbar>
        </div>
    );


}