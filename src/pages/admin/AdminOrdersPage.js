import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';


export default function AdminOrdersPage() {
    const { authTokens } = useAuthContext();

    return(
        <div>
            admin orders
        </div>
    );
}