import React, { useMemo } from 'react';

export function Preloader({ progress }: { progress: number }) {
  const brandName = "CoLab Coffee Calcutta";
  
  const characters = useMemo(() => {
    return brandName.split("").map((char, index) => ({
      char,
      index
    }));
  }, [brandName]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-base overflow-hidden opacity-100"
    >
      <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
      
      <div className="relative flex flex-col items-center">
        <div className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary flex items-center justify-center text-center px-6">
          {characters.map(({ char, index }) => (
            <span 
              key={index} 
              className="inline-block whitespace-pre"
            >
              {char}
            </span>
          ))}
          <span className="italic font-normal text-accent">.</span>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 md:w-48 h-[1px] bg-primary/10 overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
