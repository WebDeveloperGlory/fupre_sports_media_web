'use client'
import React, { useEffect } from 'react'
import useAuthStore from '@/stores/authStore';

type Cookie = [string, { value: string }];
type Cookies = Cookie[];

const AuthWrapper = ({ data }: { data: Cookies }) => {
    const { setJwt } = useAuthStore();

    useEffect(() => {
        // Check if `authToken` exists and has a value
        const authTokenEntry = data.find(([key]) => key === 'authToken');

        if ( authTokenEntry && authTokenEntry[1]?.value ) {
            const authTokenValue = authTokenEntry[1].value;
            setJwt( authTokenValue );
        }
    }, [ data, setJwt ]);

  return null;
}

export default AuthWrapper