import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import iconStudents from '../images/icons/students.png';
import iconDocuments from '../images/icons/documents.png';
import iconSamples from '../images/icons/samples.png';
import iconMyProject from '../images/icons/myproject.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import exitImage from '../images/icons/exit.png';

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
                <Nav.Link as={Link} to='/sca/projects'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconMyProject} thumbnail className='student-navbar-image dark-background' />
                        Мои проекты
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/examples'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconSamples} thumbnail className='student-navbar-image dark-background' />
                        Образцы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/orders'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background'/>
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/templates'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background'/>
                        Шаблоны <br/> заданий
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