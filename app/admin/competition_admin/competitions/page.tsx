'use client'

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const CompetitionAdminCompetitionsPage = () => {
    const router = useRouter();

    const { jwt } = useAuthStore();
    
    const [ loading, setLoading ] = useState<boolean>( true );

    useEffect( () => {
        const fetchData = async () => {

        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading ]);
  return (
    <div>CompetitionAdminCompetitionsPage</div>
  )
}

export default CompetitionAdminCompetitionsPage