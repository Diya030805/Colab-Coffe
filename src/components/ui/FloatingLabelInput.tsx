"use client";

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  labelClassName?: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, icon, className, labelClassName, value, onBlur, onFocus, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && value !== '';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full space-y-1">
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "w-full bg-primary/5 border-none rounded-2xl px-5 pt-7 pb-3 focus:ring-2 focus:ring-accent transition-all text-sm outline-none peer",
              error && "ring-2 ring-red-500 focus:ring-red-500",
              className
            )}
            placeholder=" "
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            {...props}
          />
          
          <label
            className={cn(
              "absolute left-5 transition-all duration-300 pointer-events-none text-primary/40 text-sm",
              (isFocused || hasValue) 
                ? "top-2 text-[10px] font-bold uppercase tracking-[0.15em] text-accent" 
                : "top-[1.35rem]",
              labelClassName
            )}
          >
            {label}
          </label>

          {icon && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent transition-colors">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-[10px] uppercase font-bold ml-1">{error}</p>}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
