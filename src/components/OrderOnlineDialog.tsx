"use client";

import React, { useState } from 'react';
import { X, ExternalLink, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/analytics';

export function OrderOnlineDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [errorPlatform, setErrorPlatform] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleOrder = (platform: string, url: string) => {
    trackEvent('order_platform_click', { platform });
    setLoadingPlatform(platform);
    setErrorPlatform(null);
    
    setTimeout(() => {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      setLoadingPlatform(null);
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        setErrorPlatform(platform);
      } else {
        onClose();
      }
    }, 600); // Small artificial delay to show state
  };

  const zomatoUrl = "https://www.zomato.com/kolkata/colab-coffee-calcutta-jodhpur-park";
  const swiggyUrl = "https://www.swiggy.com/restaurants/colab-coffee-south-prince-anwar-shah-road-kolkata-483357";

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 opacity-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-dialog-title"
    >
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[8px] opacity-100"
      />

      <div 
        className="relative bg-base rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 opacity-100 scale-100"
      >
        <div className="flex justify-between items-center p-6 border-b border-primary/10">
          <h2 id="order-dialog-title" className="font-serif text-2xl font-medium text-primary">{t('order.title')}</h2>
          <button 
            onClick={onClose} 
            aria-label="Close order dialog"
            className="text-primary/60 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-primary/80">{t('order.desc')}</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Button 
                className="w-full justify-between bg-[#E23744] hover:bg-[#E23744]/90 text-white border-0" 
                onClick={() => handleOrder('zomato', zomatoUrl)}
                disabled={loadingPlatform === 'zomato'}
              >
                <span>{loadingPlatform === 'zomato' ? t('order.opening') : t('order.zomato')}</span>
                {loadingPlatform !== 'zomato' && <ExternalLink size={18} />}
              </Button>
              {errorPlatform === 'zomato' && (
                <p className="text-sm text-accent text-center mt-1">
                  {t('order.blocked')} <a href={zomatoUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">{t('order.manual')}</a>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full justify-between bg-[#FC8019] hover:bg-[#FC8019]/90 text-white border-0" 
                onClick={() => handleOrder('swiggy', swiggyUrl)}
                disabled={loadingPlatform === 'swiggy'}
              >
                <span>{loadingPlatform === 'swiggy' ? t('order.opening') : t('order.swiggy')}</span>
                {loadingPlatform !== 'swiggy' && <ExternalLink size={18} />}
              </Button>
              {errorPlatform === 'swiggy' && (
                <p className="text-sm text-accent text-center mt-1">
                  {t('order.blocked')} <a href={swiggyUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">{t('order.manual')}</a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-primary/5 text-center">
          <p className="text-primary/70 text-sm flex items-center justify-center gap-2">
            {t('order.phone')} 
            <a href="tel:08910780424" className="font-medium text-primary hover:text-accent transition-colors flex items-center gap-1">
              <Phone size={14} /> 089107 80424
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
