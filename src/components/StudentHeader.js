import React from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';

import iconBell from '../images/icons/bell.png';
import iconInfo from '../images/icons/info.png';
import iconFind from '../images/icons/find.png';
import iconDisc from '../images/icons/disc.png';
import iconMyProject from '../images/icons/myproject.png';

export default function StudentHeader() {

    return(
        <div>
            <Navbar className='light-background light'>
                <Nav.Link href='/stu/info'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconInfo} thumbnail className='student-navbar-image dark-background'/>
                        Информация
                    </button>
                </Nav.Link>
                <Nav.Link href='#'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconFind} thumbnail className='student-navbar-image dark-background'/>
                        Найти ВКР
                    </button>
                </Nav.Link>
                <Nav.Link href='#'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconDisc} thumbnail className='student-navbar-image dark-background'/>
                        Обучающие<br></br>программы
                    </button>
                </Nav.Link>
                <Nav.Link href='#'>
                    <button type='button' class="btn" className='student-navbar-button dark-background light size-30'>
                        <Image src={iconMyProject} thumbnail className='student-navbar-image dark-background'/>
                        Мой проект
                    </button>
                </Nav.Link>
                
            </Navbar>
        </div>

    );
    

}