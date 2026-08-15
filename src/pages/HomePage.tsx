"use client";

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { Menu } from '../components/sections/Menu';
import { MenuPreview } from '../components/sections/MenuPreview';
import { About } from '../components/sections/About';
import { Testimonials } from '../components/sections/Testimonials';
import { FeaturedBrews } from '../components/sections/FeaturedBrews';
import { VisitUs } from '../components/sections/VisitUs';
import { WorkspaceWidget } from '../components/sections/WorkspaceWidget';
import { InstagramSection } from '../components/sections/InstagramSection';
import { GallerySection } from '../components/sections/GallerySection';
import { CoffeeLoyaltyCard } from '../components/CoffeeLoyaltyCard';
import { ReservationModal } from '../components/ReservationModal';
import { OrderOnlineDialog } from '../components/OrderOnlineDialog';
import { ArtisanalPairingModal } from '../components/ArtisanalPairingModal';
import { BackToTop } from '../components/BackToTop';
import { Preloader } from '../components/Preloader';
import { usePreloader } from '../hooks/usePreloader';
import { AudioPlayer } from '../components/AudioPlayer';
import { LiveChatBubble } from '../components/LiveChatBubble';
import { trackEvent } from '../lib/analytics';

export function HomePage() {
  const { isLoading, progress, isComplete } = usePreloader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [reserveInitialStep, setReserveInitialStep] = useState<'form' | 'active'>('form');
  const [orderOpen, setOrderOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleReserveClick = (location: string) => {
    trackEvent('reserve_click', { location });
    setReserveInitialStep('form');
    setIsModalOpen(true);
  };

  const handleViewReservedClick = () => {
    trackEvent('view_reserved_click');
    setReserveInitialStep('active');
    setIsModalOpen(true);
  };

  const handleOrderClick = (location: string) => {
    trackEvent('order_click', { location });
    setOrderOpen(true);
  };

  return (
    <>
      {isLoading && <Preloader progress={progress} />}

      <div className="min-h-screen selection:bg-accent/20 opacity-100">
        <Header 
          onReserveClick={() => handleReserveClick('header')} 
          onViewReservedClick={handleViewReservedClick}
          onOrderClick={() => handleOrderClick('header')} 
          onPairingClick={() => {
            trackEvent('pairing_click', { location: 'header' });
            setIsPairingOpen(true);
          }}
          onMenuClick={() => {
            trackEvent('menu_open');
            setIsMenuOpen(true);
          }}
        />
        
        <main>
          <Hero 
            onReserveClick={() => handleReserveClick('hero')} 
            onPairingClick={() => {
              trackEvent('pairing_click', { location: 'hero' });
              setIsPairingOpen(true);
            }} 
          />
          <Features />
          <MenuPreview onMenuClick={() => {
            trackEvent('menu_open');
            setIsMenuOpen(true);
          }} />
          <About />
          <FeaturedBrews />
          <Testimonials />
          <CoffeeLoyaltyCard />
          <WorkspaceWidget />
          <VisitUs onReserveClick={() => handleReserveClick('visit_us')} />
          <GallerySection />
          <InstagramSection />
        </main>

        <Footer />
        
        {orderOpen && (
          <OrderOnlineDialog 
            isOpen={orderOpen} 
            onClose={() => setOrderOpen(false)} 
          />
        )}
        
        {isModalOpen && (
          <ReservationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialStep={reserveInitialStep}
          />
        )}
        
        {isPairingOpen && (
          <ArtisanalPairingModal 
            isOpen={isPairingOpen} 
            onClose={() => setIsPairingOpen(false)} 
          />
        )}
        
        <BackToTop />
        <AudioPlayer />
        <LiveChatBubble />
      </div>

      {isMenuOpen && (
        <Menu 
          onClose={() => setIsMenuOpen(false)}
          onReserveClick={() => {
            setIsMenuOpen(false);
            handleReserveClick('menu_full');
          }}
          onViewReservedClick={() => {
            setIsMenuOpen(false);
            handleViewReservedClick();
          }}
          onOrderClick={() => {
            setIsMenuOpen(false);
            handleOrderClick('menu_full');
          }}
        />
      )}
    </>
  );
}
