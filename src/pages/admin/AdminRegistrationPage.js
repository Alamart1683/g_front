import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';


export default function AdminRegistrationPage() {
    const { authTokens } = useAuthContext();

    return(
        <div>
            admin registration
        </div>
    );
}