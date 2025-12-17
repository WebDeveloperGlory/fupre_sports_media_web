import { X } from 'lucide-react'
import React from 'react'

const PopUpModal = (
    { open, onClose, children }: 
    { open: boolean, onClose: () => void, children: React.ReactNode }
) => {
  return (
    <div
        onClick={ onClose }
        className={` ${ open ? 'bg-black/80 visible' : 'invisible' } fixed inset-0 flex justify-center items-end md:items-center transition-colors z-50 px-0 md:px-4`}
    >
      <div
        onClick={ ( e ) => e.stopPropagation() } 
        className={` 
          ${ open ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-0 md:scale-0 opacity-0' } 
          bg-background border border-border 
          rounded-t-2xl md:rounded-xl 
          shadow-lg p-4 md:p-6 
          transition-all duration-300 ease-out
          w-full md:w-[480px] lg:w-[520px]
          max-h-[85vh] md:max-h-[80vh] overflow-y-auto
          relative
        `}
      >
        <button
          onClick={ onClose }
          className='absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors'
        >
          <X className='w-5 h-5' />
        </button>
        { children }
      </div>
    </div>
  )
}

export default PopUpModal