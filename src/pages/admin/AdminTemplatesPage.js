import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';


export default function AdminTemplatesPage() {
    const { authTokens } = useAuthContext();

    return(
        <div>
            admin templates
        </div>
    );
}