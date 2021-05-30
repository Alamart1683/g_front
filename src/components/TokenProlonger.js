import React, { useEffect, useRef } from 'react';
import { useAuthContext } from '../auth/AuthContext';
import { apiURL } from '../Config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default function TokenProlonger() {

    const { authTokens, setAuthTokens } = useAuthContext();
    // Интервал - полчаса
    const INTERVAL_MS = 1800000;
    //const INTERVAL_MS = 60000;

    // Время продления access токена - 12 часов
    const accessProlongTime = 43200;
    // Время продления refresh токена -  15 суток
    const refreshProlongTime = 1296000;

    useEffect(() => {

        prolongToken();

    }, [])


    useInterval(() => {

        //prolongToken();

      }, INTERVAL_MS);

    async function prolongToken() {

        var cur_date = Math.round((new Date()).getTime() / 1000);
        //console.log('prolonging        ' + cur_date);
        //console.log('accessExpireDate  ' + authTokens.accessExpireDate + ' time diff: ' + (authTokens.accessExpireDate - cur_date));
        //console.log('refreshExpireDate ' + authTokens.refreshExpireDate + ' time diff: ' + (authTokens.refreshExpireDate - cur_date));

        if (authTokens.accessExpireDate - cur_date < accessProlongTime || authTokens.refreshExpireDate - cur_date < refreshProlongTime) {
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
                        console.log('successfully prolonged token');
                        setAuthTokens(response.data);
                        // Возможна проблема гонки состояний
                        window.location.reload();
                    }
                }).catch(result => {
                    // console.log(result);
                    setAuthTokens(null);
                    return <Redirect to="/guest/login" />;
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