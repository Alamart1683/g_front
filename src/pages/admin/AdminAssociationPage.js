import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';


export default function AdminAssociationPage() {
    const { authTokens } = useAuthContext();

    return(
        <div>
            admin association
        </div>
    );
}