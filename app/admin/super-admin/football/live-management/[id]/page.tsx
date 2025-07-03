'use client'

import { use, useState } from 'react'

const SuperAdminLivePage = ({ params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );

    const [loading, setLoading] = useState( true );
  return (
    <div>Super PageLive</div>
  )
}

export default SuperAdminLivePage