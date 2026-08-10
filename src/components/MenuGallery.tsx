import React, { useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'motion/react';

const IMAGES = [
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600&h=800", // Coffee pouring
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600&h=800", // Pastry/Croissant
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600&h=800", // Coffee shop interior
  "https://images.unsplash.com/photo-1484723091791-c28f0dd15d27?auto=format&fit=crop&q=80&w=600&h=800", // Food dish (breakfast)
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600&h=800", // Latte art
  "https://images.unsplash.com/photo-1621285093761-e5d0f622be25?auto=format&fit=crop&q=80&w=600&h=800", // Sandwich/snack
];

export function MenuGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a seamless loop by doubling the images
  const loopedImages = [...IMAGES, ...IMAGES];

  return (
    <div className="hidden lg:block w-full h-full relative overflow-hidden bg-primary/5" ref={containerRef} aria-hidden="true">
      {/* Absolute overlay for gradient to make it fade at edges */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-base via-transparent to-base opacity-40"></div>
      
      <div className="absolute inset-0 flex justify-center items-center py-10 opacity-20">
         <span className="font-serif text-9xl -rotate-90 tracking-[0.2em] whitespace-nowrap text-primary">COLAB</span>
      </div>

      <motion.div 
        className="flex flex-col gap-6 absolute left-0 right-0"
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        <div className="flex flex-col gap-6 py-6 px-12">
          {loopedImages.map((src, idx) => (
            <div key={idx} className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={src} 
                alt="Cafe offering" 
                className="w-full h-full object-cover"
                loading={idx > 2 ? "lazy" : "eager"}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
