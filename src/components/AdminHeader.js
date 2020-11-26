import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import $ from 'jquery';

import iconStudents from '../images/icons/students.png';
import orderImage from '../images/icons/order.png';
import templateImage from '../images/icons/template.png';
import exitImage from '../images/icons/exit.png';
import iconNR from '../images/icons/NR.png';
import iconMenu from '../images/icons/menu.png';

export default function AdminHeader() {

    const { setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    $(function () {
        $('.student-navbar-button').removeClass('student-navbar-button-selected');
        switch (window.location.pathname) {
            case ('/admin/association'):
                document.getElementById('button-association').classList.add('student-navbar-button-selected');
                break;
            case ('/admin/orders'):
                document.getElementById('button-orders').classList.add('student-navbar-button-selected');
                break;
            case ('/admin/templates'):
                document.getElementById('button-templates').classList.add('student-navbar-button-selected');
                break;
            case ('/admin/registration'):
                document.getElementById('button-registration').classList.add('student-navbar-button-selected');
                break;
            case ('/admin/settings'):
                document.getElementById('button-settings').classList.add('student-navbar-button-selected');
                break;
            default:
                console.log('url error');
        };
    });

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/admin/association'>
                    <button id='button-association' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background' />
                        Студенты и<br />Научные Руководители
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/orders'>
                    <button id='button-orders' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background' />
                        Приказы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/templates'>
                    <button id='button-templates' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={templateImage} thumbnail className='student-navbar-image dark-background' />
                        Шаблоны
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/registration'>
                    <button id='button-registration' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconNR} thumbnail className='student-navbar-image dark-background' />
                        Регистрация<br />Пользователей
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/admin/settings'>
                    <button id='button-settings' type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconMenu} thumbnail className='student-navbar-image dark-background' />
                        Настройки
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='#'>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30'>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background' />
                        Выйти
                    </button>
                </Nav.Link>
            </Navbar>
        </div>
    );


}