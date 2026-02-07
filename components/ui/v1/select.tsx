import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Select = ({ value, onValueChange, children, className = '' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            setIsOpen,
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps & {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  value?: string;
}>(
  ({ children, className = '', isOpen, setIsOpen, value, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen?.(!isOpen)}
        className={`
          flex h-10 w-full items-center justify-between rounded-lg border 
          border-input bg-background px-3 py-2 text-sm ring-offset-background 
          placeholder:text-muted-foreground focus:outline-none focus:ring-2 
          focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed 
          disabled:opacity-50
          ${className}
        `}
        {...props}
      >
        <span className="truncate">{children}</span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ placeholder = "Select..." }: { placeholder?: string }) => {
  return <span>{placeholder}</span>;
};

export const SelectContent = ({ children, className = '' }: SelectContentProps & {
  isOpen?: boolean;
}) => {
  if (!open) return null;

  return (
    <div
      className={`
        absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border 
        border-border bg-popover text-popover-foreground shadow-md 
        animate-in fade-in-0 zoom-in-95
        ${className}
      `}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  );
};

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps & {
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
}>(
  ({ value, children, className = '', onValueChange, setIsOpen, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          relative flex w-full cursor-default select-none items-center 
          rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none 
          hover:bg-accent hover:text-accent-foreground 
          focus:bg-accent focus:text-accent-foreground 
          data-[disabled]:pointer-events-none data-[disabled]:opacity-50
          ${className}
        `}
        onClick={() => {
          onValueChange?.(value);
          setIsOpen?.(false);
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-current" />
        </span>
        {children}
      </div>
    );
  }
);

SelectItem.displayName = 'SelectItem';