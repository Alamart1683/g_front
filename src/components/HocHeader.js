import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import $ from 'jquery';

import exitImage from '../images/icons/exit.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import iconStudents from '../images/icons/students.png';
import iconNR from '../images/icons/NR.png';
import iconMenu from '../images/icons/menu.png';

export default function ScaStuHeader() {
    const { setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    $(function () {
        $('.student-navbar-button').removeClass('student-navbar-button-selected');
        switch (window.location.pathname) {
            case ('/hoc/performance'):
                document.getElementById('button-performance').classList.add('student-navbar-button-selected');
                break;
            case ('/hoc/orders'):
                document.getElementById('button-orders').classList.add('student-navbar-button-selected');
                break;
            case ('/hoc/templates'):
                document.getElementById('button-templates').classList.add('student-navbar-button-selected');
                break;
            case ('/hoc/settings'):
                document.getElementById('button-settings').classList.add('student-navbar-button-selected');
                break;
            default:
                console.log('url error');
        };
    });

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/hoc/performance'>
                    <button id='button-performance' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconNR} thumbnail className='student-navbar-image dark-background' />
                        Успеваемость
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/hoc/orders'>
                    <button id='button-orders' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background' />
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/hoc/templates'>
                    <button id='button-templates' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background' />
                        Шаблоны
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/hoc/settings'>
                    <button id='button-settings' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconMenu} thumbnail className='student-navbar-image dark-background' />
                        Личные<br />данные
                    </button>
                </Nav.Link>
                <Nav.Link>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background' />
                        Выйти
                    </button>
                </Nav.Link>
            </Navbar>
        </div>
    );
}