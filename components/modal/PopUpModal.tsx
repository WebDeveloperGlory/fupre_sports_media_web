import { X } from 'lucide-react'
import React from 'react'

const PopUpModal = (
    { open, onClose, children }: 
    { open: boolean, onClose: () => void, children: React.ReactNode }
) => {
  return (
    <div
        onClick={ onClose }
        className={` ${ open ? 'bg-black/70 visible' : 'invisible' } fixed inset-0 flex justify-center items-center transition-colors z-50 `}
    >
      <div
        onClick={ ( e ) => e.stopPropagation() } 
        className={` ${ open ? 'scale-100 opacity-100' : 'scale-0 opacity-0' } bg-popover rounded-xl shadow p-6 transition-all w-5/6 lg:w-1/2 text-center max-h-[80vh] overflow-y-auto `}
      >
        <button
          onClick={ onClose }
          className='absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600'
        >
          <X className='w-5 h-5' />
        </button>
        { children }
      </div>
    </div>
  )
}

export default PopUpModal