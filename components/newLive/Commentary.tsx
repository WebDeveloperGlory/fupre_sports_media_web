'use client'

import { FixtureCommentary } from '@/utils/V2Utils/v2requestSubData.types'
import { MessageSquare } from 'lucide-react'
import React from 'react'

interface ICommentary {
    commentary: FixtureCommentary[];
}

const Commentary = ({ commentary }: ICommentary) => {
    const sortedCommentary = [ ...commentary ].sort((a,b) => b.minute - a.minute);
  return (
    <div className='space-y-4'>
        {/* Commentary */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <MessageSquare className='text-emerald-500 w-6 h-6' />
                <h2>Commentary</h2>
            </div>
            <div className='space-y-4'>
                {
                    sortedCommentary.map( comment => (
                        <div key={ comment.eventId } className='w-full flex gap-2'>
                            <p className='text-sm'>{ comment.minute }'</p>
                            <p className='px-4 py-2 rounded-lg border border-emerald-500 w-full'>{ comment.text }</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Commentary