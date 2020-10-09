import React from 'react';
import { Navbar, Nav, Link, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

export default function StudentHeader() {

    return(
        <div>
            <Navbar className='light-background size-30 light'>
                <Nav.Link href='/stu/info'>
                    <Button variant="primary" classname='student-navbar-button light'>
                        Информация
                    </Button>
                </Nav.Link>
                
                <Nav.Link href='#'>Найти ВКР</Nav.Link>
                <Nav.Link href='#'>Обучающие программы</Nav.Link>
                <Nav.Link href='#'>Мой проект</Nav.Link>
            </Navbar>
        </div>

    );
    

}