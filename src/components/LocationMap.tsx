import React from 'react';
import { MapPin, Map, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface LocationMapProps {
  address: string;
  name: string;
  mapQuery: string;
}

export function LocationMap({ address, name, mapQuery }: LocationMapProps) {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.733020959049!2d88.3582109!3d22.5142129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027732a396ebef%3A0xc66512a1f49fa4eb!2s${encodeURIComponent(name)}!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;
  
  const handleDirectionsClick = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`, '_blank');
  };

  return (
    <div className="w-full h-[450px] lg:h-full min-h-[450px] rounded-3xl overflow-hidden shadow-xl border border-primary/10 relative group bg-primary/5">
      {/* Map iframe */}
      <iframe 
        src={mapUrl} 
        className="absolute inset-0 w-full h-full border-0 grayscale-[40%] contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 pointer-events-auto"
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Location"
      ></iframe>

      {/* Floating Interactive Card */}
      <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-80 bg-base/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-primary/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-500 ease-out z-10">
        <div className="flex items-start gap-4">
          <div className="bg-accent text-base p-3 rounded-xl shadow-lg shrink-0">
            <Navigation size={24} className="fill-current" />
          </div>
          <div>
            <h4 className="font-serif font-medium text-lg mb-1 text-primary">{name}</h4>
            <p className="text-sm text-primary/70 mb-5 leading-relaxed">{address}</p>
            <Button 
              onClick={handleDirectionsClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl"
            >
              <Map size={16} />
              Get Directions
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative center marker to simulate custom marker (optional overlay effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent/20 rounded-full animate-ping"></div>
          <MapPin size={48} className="text-accent drop-shadow-xl" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
