import React from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';

export default function SettingsPage() {
    const { authTokens } = useAuthContext();



    return (
        <div>настройки</div>
    );
}