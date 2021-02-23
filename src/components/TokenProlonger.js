import React, { useEffect, useRef } from 'react';
import { useAuthContext } from '../auth/AuthContext';
import { apiURL } from '../Config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default function TokenProlonger() {

    const { authTokens, setAuthTokens } = useAuthContext();
    const INTERVAL_MS = 1800000;

    useEffect(() => {

        prolongToken();

    }, [])


    useInterval(() => {

        prolongToken();

      }, INTERVAL_MS);

    async function prolongToken() {

        var cur_date = Math.round((new Date()).getTime() / 1000);

        if (authTokens.accessExpireDate - cur_date < 10800000 || authTokens.refreshExpireDate - cur_date < 259200000) {
            if (authTokens.accessExpireDate - cur_date > 0 || authTokens.refreshExpireDate - cur_date > 0) {
                axios({
                    url: apiURL + '/authorization/prolongation',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.refreshToken
                    },
                }).then((response) => {
                    //console.log(response.data);
                    if (response.data.message === 'Неверная комбинация логина и пароля, необходима авторизация') {
                        setAuthTokens(null);
                        return <Redirect to="/guest/login" />;
                    }
                    else {
                        //console.log('prolonged');
                        setAuthTokens(response.data);
                        // Временное решение проблемы гонки состояний
                        window.location.reload();
                    }
                }).catch(result => {
                    console.log(result);
                });
            }
            else {
                //console.log('expired');
                setAuthTokens(null);
                return <Redirect to="/guest/login" />;
            }
        }
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    return (
        null
    );

}