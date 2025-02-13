'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavButton = (
    { icon, label, href }:
    { icon: any, label: string, href: string }
) => {
    const Icon = icon;
  return (
    <Link
        href={ href }
        className='w-full flex justify-between items-center gap-2 border py-2 px-4 rounded hover:bg-accent'
    >
        <div className='flex items-center gap-2'>
            <Icon className="h-4 w-4" />
            <span>
                { label }
            </span>
        </div>
        <ChevronRight className="h-4 w-4" />
    </Link>
  )
}

export default NavButton