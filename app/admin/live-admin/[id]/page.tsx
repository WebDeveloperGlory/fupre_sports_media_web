'use client'

import { use, useState } from 'react'

const LiveAdminPage = ({ params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );

    const [loading, setLoading] = useState( true );
  return (
    <div>Live Page</div>
  )
}

export default LiveAdminPage