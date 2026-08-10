"use client";

import React, { useState } from 'react';
import { X, Maximize2, ArrowUpRight } from 'lucide-react';

const IMAGES = [
  {
    src: "/src/assets/images/cafe_interior_1783671348427.jpg",
    title: "Main Workshop",
    category: "Architecture",
    className: "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto"
  },
  {
    src: "/src/assets/images/coffee_art_1783671366105.jpg",
    title: "Latte Mastery",
    category: "Craft",
    className: "md:col-span-1 md:row-span-1 aspect-square"
  },
  {
    src: "/src/assets/images/pastries_1783671380380.jpg",
    title: "Artisanal Bakes",
    category: "Pastry",
    className: "md:col-span-1 md:row-span-1 aspect-square"
  },
  {
    src: "/src/assets/images/cafe_workspace_area_1783847636897.jpg",
    title: "Productivity Zone",
    category: "Workspace",
    className: "md:col-span-2 md:row-span-1 aspect-video md:aspect-auto"
  },
  {
    src: "/src/assets/images/signature_coffee_drink_1783847653909.jpg",
    title: "Espresso Tonic",
    category: "Signature",
    className: "md:col-span-1 md:row-span-2 aspect-[3/4] md:aspect-auto"
  },
  {
    src: "/src/assets/images/barista_at_work_1783847669755.jpg",
    title: "The Craft",
    category: "Process",
    className: "md:col-span-1 md:row-span-1 aspect-square"
  },
  {
    src: "/src/assets/images/coffee_pouring_1783671392367.jpg",
    title: "Precision Pour",
    category: "Detail",
    className: "md:col-span-1 md:row-span-1 aspect-square"
  }
];

interface GalleryItemProps {
  src: string;
  title: string;
  category: string;
  className: string;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, title, category, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[2rem] bg-primary/5 cursor-pointer border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${className}`}
    >
      <img 
        src={src} 
        alt={title} 
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-2">
          {category}
        </span>
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-white font-serif text-xl md:text-2xl font-medium tracking-tight">
            {title}
          </h3>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      {/* Quick Access Icon (Mobile) */}
      <div className="absolute top-4 right-4 md:hidden opacity-100">
         <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <Maximize2 size={14} />
         </div>
      </div>
    </div>
  );
}

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-32 bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <p className="uppercase text-[10px] font-bold mb-4 text-accent tracking-[0.4em]">
            Visual Narrative
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary tracking-tight mb-6">
            The CoLab Experience
          </h2>
          <p className="text-primary/60 max-w-xl mx-auto text-sm md:text-base">
            From the meticulous craft behind each cup to the serene workspaces designed for focus, explore the heartbeat of our cafe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 md:gap-6">
          {IMAGES.map((img, idx) => (
            <GalleryItem 
              key={idx}
              src={img.src}
              title={img.title}
              category={img.category}
              className={img.className}
              onClick={() => setSelectedImage(img.src)} 
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl opacity-100"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              className="absolute top-4 right-4 md:top-0 md:-right-16 text-white p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
