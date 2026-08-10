"use client";

import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import heroImg from '../../assets/images/cafe_interior_hero_1783588664843.jpg';

export function Hero({ onReserveClick, onOrderClick }: { onReserveClick: () => void, onOrderClick?: () => void }) {
  const { t } = useLanguage();
  const [isLeafHovered, setIsLeafHovered] = React.useState(false);

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-base">
      <style>
        {`
          @keyframes gentleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(12px) rotate(-3deg); }
          }
          @keyframes heroEntrance {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes rotateLeaf {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes wiggleLeaf {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-12deg); }
            75% { transform: rotate(12deg); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 relative">
        <div 
          className="w-full md:w-3/5 flex flex-col justify-center relative z-10"
          style={{ 
            animation: 'heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="opacity-100">
            <div className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-6 text-accent">
              {t('hero.eyebrow')}
            </div>
            <h1 className="font-serif text-[50px] sm:text-7xl lg:text-[84px] font-medium leading-[0.95] mb-8 text-primary tracking-tight whitespace-pre-line">
              {t('hero.title').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i === 1 ? <span className="italic tracking-normal">{line}</span> : line}
                  {i !== 2 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-xl text-primary/80 max-w-lg mb-12 leading-relaxed font-light font-sans tracking-wide">
              {t('hero.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button 
                className="w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.viewMenu')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={onReserveClick}
              >
                {t('btn.reserve')}
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-12 h-[1px] bg-primary"></div>
                <span className="font-serif italic text-sm text-primary">{t('hero.location')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Right Column */}
        <div 
          className="w-full md:w-2/5 relative h-[500px] md:h-auto min-h-[500px]"
          style={{ 
            animation: 'heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            opacity: 0
          }}
        >
          {/* Dot Grid Background */}
          <div className="absolute inset-0 -z-10 translate-x-4 -translate-y-4 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }}></div>
          
          {/* Outer Float Wrapper for Main Image */}
          <div 
            className="w-full h-full relative z-20"
            style={{ animation: 'gentleFloat 6s infinite ease-in-out' }}
          >
            {/* Hero Image Container */}
            <div 
              className="relative h-full w-full bg-primary flex items-end overflow-hidden shadow-2xl"
              style={{ 
                clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
              }}
            >
              <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-black to-transparent z-10"></div>
              <div className="absolute inset-0 border-[20px] border-white/10 mix-blend-overlay z-10 pointer-events-none"></div>
              <img 
                src={heroImg} 
                alt="Cozy low-lit cafe interior" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div className="p-10 relative z-20 w-full">
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/60 mb-2">{t('hero.featured')}</div>
                <div className="font-serif text-3xl text-white mb-4 italic">{t('hero.turmeric')}</div>
                <div className="flex justify-between items-center gap-4">
                  <p className="text-white/80 text-sm max-w-[200px] font-light font-sans">{t('hero.turmericDesc')}</p>
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white shrink-0">→</div>
                </div>
              </div>
            </div>
          </div>

          {/* Outer Float Wrapper for Floating Card */}
          <div 
            className="absolute -left-8 md:-left-12 top-20 hidden sm:block z-30"
            style={{ 
              animation: 'cardFloat 5s infinite ease-in-out',
              animationDelay: '0.5s'
            }}
          >
            {/* Coffee Leaf Illustration */}
            <div 
              className="absolute -top-10 -right-6 text-accent opacity-60 cursor-pointer pointer-events-auto select-none transition-all duration-300"
              style={{ 
                animation: isLeafHovered ? 'wiggleLeaf 0.5s infinite ease-in-out' : 'rotateLeaf 4s infinite ease-in-out',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
              }}
              onMouseEnter={() => setIsLeafHovered(true)}
              onMouseLeave={() => setIsLeafHovered(false)}
            >
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ease-out ${isLeafHovered ? 'scale-105' : 'scale-100'}`}
              >
                <path d="M12 2C12 2 19 6 19 12C19 18 12 22 12 22M12 2C12 2 5 6 5 12C5 18 12 22 12 22M12 2V22M12 7L19 10M12 12L19 15M12 7L5 10M12 12L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            
            <div className="bg-base p-6 shadow-2xl rounded-sm w-56 border-t-4 border-accent">
              <div className="font-serif text-lg mb-2 italic text-primary">{t('hero.signature')}</div>
              <div className="font-bold text-sm mb-1 text-primary">{t('hero.diavolo')}</div>
              <div className="text-[10px] text-primary/50 font-sans">{t('hero.diavoloDesc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
