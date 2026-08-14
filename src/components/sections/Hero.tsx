"use client";

import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import heroImg from '../../assets/images/cafe_interior_hero_1783588664843.jpg';

export function Hero({ onReserveClick, onOrderClick, onPairingClick }: { onReserveClick: () => void, onOrderClick?: () => void, onPairingClick?: () => void }) {
  const { t, language } = useLanguage();
  const [isLeafHovered, setIsLeafHovered] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isSpotlightActive, setIsSpotlightActive] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      id="home" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsSpotlightActive(true)}
      onMouseLeave={() => setIsSpotlightActive(false)}
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-base"
    >
      {/* Warm Spotlight Mouse Follow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-0"
        style={{
          opacity: isSpotlightActive ? 1 : 0,
          background: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.04) 40%, transparent 100%)`,
        }}
      />
      <style>
        {`
          @keyframes gentleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(12px) rotate(3deg); }
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
          @keyframes candleFlicker {
            0%, 100% {
              opacity: 0.15;
              filter: saturate(1) blur(0px);
            }
            25% {
              opacity: 0.35;
              filter: saturate(1.2) blur(1px);
            }
            45% {
              opacity: 0.22;
              filter: saturate(0.9) blur(0px);
            }
            70% {
              opacity: 0.42;
              filter: saturate(1.3) blur(2px);
            }
            85% {
              opacity: 0.28;
              filter: saturate(1.05) blur(0px);
            }
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
                className="w-full sm:w-auto group relative overflow-hidden"
                onClick={() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-0 group-hover:gap-2.5 transition-all duration-300">
                  {t('hero.viewMenu')}
                  <span className="w-0 opacity-0 scale-0 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out inline-flex items-center">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="w-4 h-4 text-white"
                    >
                      <path d="M18.5 5.5C21.5 8.5 21.5 13.5 18.5 16.5C15.5 19.5 10.5 19.5 7.5 16.5C4.5 13.5 4.5 8.5 7.5 5.5C10.5 2.5 15.5 2.5 18.5 5.5Z" fill="currentColor" fillOpacity="0.15" />
                      <path d="M6 18C9 15 9 9 12 12C15 15 15 9 18 6" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto group relative overflow-hidden"
                onClick={onReserveClick}
              >
                <span className="relative z-10 flex items-center justify-center gap-0 group-hover:gap-2.5 transition-all duration-300">
                  {t('btn.reserve')}
                  <span className="w-0 opacity-0 scale-0 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out inline-flex items-center">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="w-4 h-4 text-accent"
                    >
                      <path d="M18.5 5.5C21.5 8.5 21.5 13.5 18.5 16.5C15.5 19.5 10.5 19.5 7.5 16.5C4.5 13.5 4.5 8.5 7.5 5.5C10.5 2.5 15.5 2.5 18.5 5.5Z" fill="currentColor" fillOpacity="0.15" />
                      <path d="M6 18C9 15 9 9 12 12C15 15 15 9 18 6" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-12 h-[1px] bg-primary"></div>
                <span className="font-serif italic text-sm text-primary">{t('hero.location')}</span>
              </div>
            </div>

            {/* AI Artisanal Pairing Spark Notification */}
            <div 
              onClick={onPairingClick}
              className="mt-10 inline-flex items-center gap-3 cursor-pointer group bg-accent/5 border border-accent/15 hover:bg-accent/10 rounded-2xl px-4 py-2.5 transition-all duration-300 max-w-lg select-none"
            >
              <div className="relative flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-0.5">
                  {language === 'bn' ? 'নতুন এআই মেলবন্ধন' : 'NEW AI PAIRING'}
                </p>
                <p className="text-xs text-primary/80 group-hover:text-primary transition-colors font-sans">
                  {language === 'bn' 
                    ? 'আপনার মেজাজ বলুন, আমাদের এআই ব্যারিস্তা নিখুঁত কফি ও খাবার মেলাবে →' 
                    : 'Describe your mood & let our AI Barista suggest a perfect match →'}
                </p>
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
              
              {/* Warm Candlelight Flickering Pulse Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-15"
                style={{ 
                  background: 'radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.4) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 100%)',
                  mixBlendMode: 'color-burn',
                  animation: 'candleFlicker 8s infinite ease-in-out'
                }}
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
                filter: isLeafHovered ? 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25))' : 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))'
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
                className={`transition-transform duration-300 ease-out ${isLeafHovered ? 'scale-105 rotate-[20deg]' : 'scale-100 rotate-0'}`}
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
