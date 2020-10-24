import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';

import iconStudents from '../images/icons/students.png';

export default function SciAdvisorHeader() {

  const { authTokens, setAuthTokens  } = useAuthContext();

  function logOut() {
      setAuthTokens(null);
  }

  var studentName;
  try {
      studentName = authTokens.fio;
  }
  catch (e) {
      studentName = 'Ошибка имени';
  };

  return (
    <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/sca/students'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        <Image src={iconStudents} thumbnail className='student-navbar-image dark-background'/>
                        Мои студенты
                    </button>
                </Nav.Link>
                <NavDropdown title={
                    <p className='student-navbar-name dark-background light size-30'>
                        {studentName}
                    </p>
                    } id='studentName' >
                    <NavDropdown.Item>Action</NavDropdown.Item>
                    <NavDropdown.Item>Another action</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={ () => { logOut() }}>Выйти</NavDropdown.Item>
                </NavDropdown>
            </Navbar>
        </div>
  );


}