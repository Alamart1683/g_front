import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import $ from 'jquery';

import iconStudents from '../images/icons/students.png';
import iconDocuments from '../images/icons/documents.png';
import iconSamples from '../images/icons/samples.png';
import iconMyProject from '../images/icons/myproject.png';
import orderImage from '../images/icons/order.png';
//import templateImage from '../images/icons/template.png';
import exitImage from '../images/icons/exit.png';
//import iconMenu from '../images/icons/menu.png';
import iconSelected from '../images/icons/documents_selected.png';
import iconChat from '../images/icons/chat.png';
import iconLk from '../images/icons/lk.png';

export default function SciAdvisorHeader() {

    const { setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    $(function () {
        $('.student-navbar-button').removeClass('student-navbar-button-selected');
        switch (window.location.pathname) {
            case ('/sca/students'):
                document.getElementById('button-students').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/stu-docs'):
                document.getElementById('button-stu-docs').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/projects'):
                document.getElementById('button-projects').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/orders'):
                document.getElementById('button-orders').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/examples'):
                document.getElementById('button-examples').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/settings'):
                document.getElementById('button-settings').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/stu-themes'):
                document.getElementById('button-themes').classList.add('student-navbar-button-selected');
                break;
            case ('/sca/messages'):
                document.getElementById('button-messages').classList.add('student-navbar-button-selected');
                break;
            default:
                console.log('url error');
        };
    });

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/sca/students' style={{marginLeft:'11px'}}>
                    <button id='button-students' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'264px'}}>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background' />
                        Мои студенты
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/stu-docs'>
                    <button id='button-stu-docs' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'231px'}}>
                        <Image src={iconDocuments} thumbnail className='student-navbar-image dark-background' />
                        Документы<br />студентов
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/projects'>
                    <button id='button-projects' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'212px'}}>
                        <Image src={iconMyProject} thumbnail className='student-navbar-image dark-background' />
                        Проекты<br />студентов
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/stu-themes'>
                    <button id='button-themes' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'214px'}}>
                        <Image src={iconSelected} thumbnail className='student-navbar-image dark-background' />
                        Темы<br />студентов
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/examples'>
                    <button id='button-examples' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'199px'}}>
                        <Image src={iconSamples} thumbnail className='student-navbar-image dark-background' />
                        Образцы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/orders'>
                    <button id='button-orders' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'197px'}}>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background' />
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/settings'>
                    <button id='button-settings' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'186px'}}>
                        <Image src={iconLk} thumbnail className='student-navbar-image dark-background' />
                        Личные<br />данные
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/sca/messages'>
                    <button id='button-messages' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'232px'}}>
                        <Image src={iconChat} thumbnail className='student-navbar-image dark-background' />
                        Сообщения
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='#'>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30' style={{minWidth:'75px'}}>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background' />
                    </button>
                </Nav.Link>
            </Navbar>
        </div>
    );


}