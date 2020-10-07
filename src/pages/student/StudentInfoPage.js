import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuthContext } from '../../auth/AuthContext';

export default function StudentInfoPage(){
    const { authTokens, setAuthTokens } = useAuthContext();

    function logOut() {
        setAuthTokens(null);
    }

    window.onload = function () {
        changeName();

        function changeName() {
            try {
                document.getElementById("studentName").innerHTML = authTokens.fio;
            }
            catch (e) {
                document.getElementById("studentName").innerHTML = "NameError";
            };

        }
    }

    return(
        <div>
            
            <div>Страница студента</div>
            <p id="studentName"></p>

            <Button type="submit" onClick={ () => { logOut() }} >Log out</Button>

        </div>
    );
   
}