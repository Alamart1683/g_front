import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useAuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

export default function ScaStuHeader() {
    const { authTokens } = useAuthContext();
    const [redirect, setRedirect] = useState(false);
    const [fetchedData, setFetchedData] = useState(false);
    const [studentName, setStudentName] = useState('');

    if (!fetchedData) {
        setFetchedData(true);
        if (sessionStorage.getItem('viewedStudentId') === null ||
            sessionStorage.getItem('viewedStudentName') === null) {
            setRedirect(true);
        }
        else {
            setStudentName(sessionStorage.getItem('viewedStudentName'));
        }
    }

    console.log(studentName);

    return(
        <div>
            <Navbar className='light-background light student-nav'>
                <Nav.Link as={Link} to='/sca/students'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        Вернуться
                    </button>
                </Nav.Link>
                <Nav.Link as={Link} to='#'>
                    <button type='button' className='student-navbar-button dark-background light size-30'>
                        Студент: <br/> {studentName}
                    </button>
                </Nav.Link>
            </Navbar>

            { redirect ? (<Redirect to='/sca/students'/>) : null }
        </div>
    );
}