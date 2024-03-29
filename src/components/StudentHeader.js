import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { apiURL } from '../Config';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import iconInfo from '../images/icons/info.png';
import orderImage from '../images/icons/order.png';
import exitImage from '../images/icons/exit.png';
import iconExamples from '../images/icons/samples.png';
import iconTasks from '../images/icons/tasks.png';
//import iconMenu from '../images/icons/menu.png';
import iconChat from '../images/icons/chat.png';
import iconVKR from '../images/icons/VKR.png';
import iconLk from '../images/icons/lk.png';

export default function StudentHeader() {
    const { authTokens, setAuthTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    const [scientificAdvisorData, setScientificAdvisorData] = useState([]);
    const [sciAdvisorSet, setSciAdvisorSet] = useState(false);

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
            setScientificAdvisorData(response.data);
            if (response.data.advsiorFio !== null) {
                setSciAdvisorSet(true);
            }
        }).catch(result => {
            console.log(result.data);
        });
    }


    function logOut() {
        setAuthTokens(null);
    }

    $(function () {

        $('.student-navbar-button').removeClass('student-navbar-button-selected');
        switch (window.location.pathname) {
            case ('/stu/info'):
                document.getElementById('button-info').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/tasks'):
                document.getElementById('button-tasks').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/orders'):
                document.getElementById('button-orders').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/examples'):
                document.getElementById('button-examples').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/settings'):
                document.getElementById('button-settings').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/theme'):
                document.getElementById('button-theme').classList.add('student-navbar-button-selected');
                break;
            case ('/stu/messages'):
                document.getElementById('button-messages').classList.add('student-navbar-button-selected');
                break;
            default:
                console.log('url error');
        };

        $('[data-toggle="popover"]').popover();

        $('body').off().on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide'); 
                }
            });
        });
    });

    return (
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/stu/info' style={{marginLeft:'11px'}}>
                    <button id='button-info' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'247px'}}>
                        <Image src={iconInfo} thumbnail className='student-navbar-image dark-background' />
                        Информация
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/tasks'>
                    <button id='button-tasks' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'186px'}}>
                        <Image src={iconTasks} thumbnail className='student-navbar-image dark-background' />
                        Задания
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/examples'>
                    <button id='button-examples' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'194px'}}>
                        <Image src={iconExamples} thumbnail className='student-navbar-image dark-background' />
                        Образцы
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='/stu/orders'>
                    <button id='button-orders' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'191px'}}>
                        <Image src={orderImage} thumbnail className='student-navbar-image dark-background' />
                        Приказы
                    </button>
                </Nav.Link>

                { 
                sciAdvisorSet ?
                (<Nav.Item style={{ marginLeft: '10px'}}>
                    <button type='button' className='student-navbar-button dark-background light size-30' data-toggle="popover"  style={{width:'317px', padding:'0px 0px'}}
                        data-placement="bottom" title="Данные научного руководителя:"
                        data-content={scientificAdvisorData !== [] ? "Имя: " + scientificAdvisorData.advsiorFio + "\nТелефон: " +
                            scientificAdvisorData.advisorPhone + "\nПочта: " + scientificAdvisorData.advisorEmail : ''}>
                        Научный руководитель: <br />{scientificAdvisorData.length !== 0 ? scientificAdvisorData.advsiorFio.split(' ')[0] + ' '
                            + scientificAdvisorData.advsiorFio.split(' ')[1].charAt(0) + '. ' + scientificAdvisorData.advsiorFio.split(' ')[2].charAt(0) + '.' : ''}
                    </button>
                </Nav.Item>)
                :
                (<Nav.Item style={{ marginLeft: '10px'}}>
                    <button type='button' className='student-navbar-button dark-background light size-30' data-toggle="popover" style={{minWidth:'317px', padding:'0px 0px'}}
                        data-placement="bottom" title="Данные научного руководителя:"
                        data-content={'Не назначен'}>
                        Научный руководитель: <br />{'Не назначен'}
                    </button>
                </Nav.Item>)
                }

                <Nav.Link as={Link} to='/stu/theme'>
                    <button type='button' id='button-theme' className='student-navbar-button dark-background light size-30' style={{minWidth:'202px'}}>
                        <Image src={iconVKR} thumbnail className='student-navbar-image dark-background' />
                        Тема ВКР
                    </button>
                </Nav.Link>

                <Nav.Link as={Link} to='/stu/settings'>
                    <button id='button-settings' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'180px'}}>
                        <Image src={iconLk} thumbnail className='student-navbar-image dark-background' />
                        Личные<br />данные
                    </button>
                </Nav.Link>

                <Nav.Link as={Link} to='/stu/messages'>
                    <button id='button-messages' type='button' className='student-navbar-button dark-background light size-30' style={{minWidth:'226px'}}>
                        <Image src={iconChat} thumbnail className='student-navbar-image dark-background' />
                        Сообщения
                    </button>
                </Nav.Link>

                <Nav.Link>
                    <button type='button' onClick={() => { logOut() }} className='student-navbar-button dark-background light size-30' style={{minWidth:'75px'}}>
                        <Image src={exitImage} thumbnail className='student-navbar-image dark-background' />
                    </button>
                </Nav.Link>
            </Navbar>

        </div>

    );


}