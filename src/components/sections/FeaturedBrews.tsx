"use client";

import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Brew {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  category: string;
}

const FEATURED_BREWS: Brew[] = [
  {
    id: "1",
    name: "Golden Cortado",
    description: "Equally balanced espresso and textured milk with a hint of honey.",
    price: "₹240",
    rating: 4.9,
    image: "/src/assets/images/cortado_coffee_art_1783848049569.jpg",
    category: "Signature"
  },
  {
    id: "2",
    name: "Noir Cold Brew",
    description: "18-hour steep single origin coffee served over crystal clear ice.",
    price: "₹280",
    rating: 4.8,
    image: "/src/assets/images/cold_brew_bottle_1783848063528.jpg",
    category: "Seasonal"
  },
  {
    id: "3",
    name: "Ethiopian AeroPress",
    description: "Bright acidity with floral notes, precision brewed for clarity.",
    price: "₹260",
    rating: 4.9,
    image: "/src/assets/images/aeropress_coffee_pour_1783848077021.jpg",
    category: "Artisanal"
  }
];

interface BrewCardProps {
  brew: Brew;
}

const BrewCard: React.FC<BrewCardProps> = ({ brew }) => {
  return (
    <div className="group relative flex flex-col bg-base rounded-[2.5rem] border border-primary/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={brew.image} 
          alt={brew.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Category Tag */}
        <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
          {brew.category}
        </div>

        {/* Rating */}
        <div className="absolute top-6 right-6 flex items-center gap-1 px-2 py-1 rounded-lg bg-accent text-white text-[10px] font-bold">
          <Star size={10} className="fill-white" />
          {brew.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-2xl text-primary group-hover:text-accent transition-colors">
            {brew.name}
          </h3>
          <span className="font-serif text-xl text-accent font-medium">{brew.price}</span>
        </div>
        <p className="text-primary/60 text-sm leading-relaxed mb-8 flex-grow italic">
          "{brew.description}"
        </p>
        
        <Button variant="outline" className="w-full rounded-xl border-primary/10 group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
          <span className="flex items-center gap-2">
            Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
}

export function FeaturedBrews({ onReserveClick }: { onReserveClick?: () => void } = {}) {
  return (
    <section className="py-24 md:py-32 bg-primary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="uppercase text-[10px] font-bold mb-4 text-accent tracking-[0.4em]">
              The Curator's Choice
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary tracking-tight">
              Featured Brews
            </h2>
          </div>
          <p className="text-primary/60 max-w-sm text-sm italic border-l-2 border-accent pl-6">
            "A rotating selection of our highest-rated specialty coffees, chosen for their unique flavor profiles and exceptional craft."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_BREWS.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>

        {onReserveClick && (
          <div className="mt-16 text-center">
            <p className="text-primary/75 text-sm mb-6 font-sans italic max-w-md mx-auto leading-relaxed">
              Want to experience these craft brews fresh in our cozy South Kolkata cafe? Secure your spot today.
            </p>
            <Button 
              onClick={onReserveClick}
              className="px-8 py-6 text-xs uppercase tracking-widest font-bold font-sans rounded-full shadow-md hover:shadow-xl transition-all duration-300"
            >
              Reserve a Table
            </Button>
          </div>
        )}
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none" />
    </section>
  );
}
