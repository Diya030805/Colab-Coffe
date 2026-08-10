"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { MenuItem } from '../../types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { MenuGallery } from '../MenuGallery';
import { supabase } from '../../lib/supabase';

export function Menu({ onClose, onReserveClick, onViewReservedClick, onOrderClick }: { onClose?: () => void, onReserveClick: () => void, onViewReservedClick: () => void, onOrderClick: () => void }) {
  const [activeCategory, setActiveCategory] = useState<'food' | 'beverages' | 'desserts'>('food');
  const [foodType, setFoodType] = useState<'veg' | 'nonveg'>('veg');
  const [isEntering, setIsEntering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [contentStage, setContentStage] = useState(0);
  const isClosing = useRef(false);
  const { t } = useLanguage();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger entering animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(true);
      // Stagger content stages for a cinematic entry
      setTimeout(() => setContentStage(1), 400); // Title
      setTimeout(() => setContentStage(2), 600); // Categories
      setTimeout(() => setContentStage(3), 800); // Filters & Content
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (!onClose || isClosing.current) return;
    isClosing.current = true;
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
      isClosing.current = false;
    }, 800); // Match premium exit transition
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    async function fetchMenu() {
      if (!supabase) {
        // Silently fail or show a friendly message if not configured
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('menu_items').select('*').eq('availability', true);
        if (error) throw error;
        setMenuItems(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free'];
  const typeOptions = ['Coffee', 'Tea', 'Pastries', 'Savory Snacks'];

  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleFilter = (val: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(val)) {
      setList(list.filter(item => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  const isFiltering = selectedDietary.length > 0 || selectedTypes.length > 0;
  
  const filteredItems = menuItems.filter(item => {
    const dMatch = selectedDietary.length === 0 || selectedDietary.some(d => item.dietary?.includes(d));
    const tMatch = selectedTypes.length === 0 || selectedTypes.some(t => item.type?.includes(t));
    return dMatch && tMatch;
  });

  const foodVegItems = menuItems.filter(item => item.category === 'food' && item.dietary.includes('Vegetarian'));
  const foodNonVegItems = menuItems.filter(item => item.category === 'food' && !item.dietary.includes('Vegetarian'));
  const beverageItems = menuItems.filter(item => item.category === 'beverages');
  const dessertItems = menuItems.filter(item => item.category === 'desserts');

  const renderItems = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 gap-x-12 gap-y-6">
      {items.map((item, idx) => (
        <div 
          key={item.name}
          style={{ 
            transitionDelay: `${idx * 40}ms`,
            transform: contentStage >= 3 ? 'translateY(0)' : 'translateY(20px)',
            opacity: contentStage >= 3 ? 1 : 0
          }}
          className="flex items-center justify-between py-3 border-b border-primary/10 group hover:border-accent/40 transition-all duration-700 ease-out"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-medium text-primary text-lg font-serif">{item.name}</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                  {item.contains_egg && <span className="text-[10px] text-primary/60 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Contains Egg</span>}
                  {item.dietary?.map(d => (
                     <span key={d} className="text-[10px] bg-primary/5 px-2 py-0.5 rounded-full text-primary/60">{d}</span>
                  ))}
                  {item.type?.map(t => (
                     <span key={t} className="text-[10px] bg-primary/5 px-2 py-0.5 rounded-full text-primary/60">{t}</span>
                  ))}
              </div>
            </div>
          </div>
          {item.is_signature && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-full ml-4 shrink-0">
              Signature
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-base flex overflow-hidden transition-all ease-[cubic-bezier(0.16,1,0.3,1)]",
        isEntering && !isLeaving 
          ? "opacity-100 translate-y-0 scale-100 duration-[850ms]" 
          : "opacity-0 translate-y-12 scale-95 duration-[750ms]"
      )}
    >
      {/* Left side: Menu Items (Scrollable) */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto relative">
        {onClose && (
          <button 
            onClick={handleClose}
            className="absolute top-8 right-8 z-10 p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}

        <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
          <div className={cn(
            "text-center mb-16 transition-all duration-1000 ease-out transform",
            contentStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 text-accent">{t('menu.eyebrow')}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary">{t('menu.title')}</h2>
          </div>


          {/* Top Level Categories */}
          <div className={cn(
            "flex flex-wrap justify-center gap-4 mb-8 transition-all duration-1000 delay-200 ease-out transform",
            contentStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            isFiltering && "opacity-30 pointer-events-none"
          )}>
            {['food', 'beverages', 'desserts'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all capitalize shadow-sm",
                  activeCategory === cat 
                    ? "bg-primary text-base shadow-md scale-105" 
                    : "bg-base text-primary/70 hover:bg-base/80 hover:text-primary border border-primary/10"
                )}
              >
                {t(`menu.${cat}`)}
              </button>
            ))}
          </div>

        {/* Filters */}
        <div className={cn(
          "flex flex-col items-center gap-4 mb-12 transition-all duration-1000 delay-300 ease-out transform",
          contentStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-serif text-primary/70 mr-2 self-center">{t('menu.dietary')}</span>
            {dietaryOptions.map(opt => (
              <button 
                key={opt}
                onClick={() => toggleFilter(opt, selectedDietary, setSelectedDietary)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all",
                  selectedDietary.includes(opt) ? "bg-accent text-white border-accent" : "bg-base text-primary/70 border-primary/20 hover:border-primary/40"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm font-serif text-primary/70 mr-2 self-center">{t('menu.types')}</span>
            {typeOptions.map(opt => (
              <button 
                key={opt}
                onClick={() => toggleFilter(opt, selectedTypes, setSelectedTypes)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all",
                  selectedTypes.includes(opt) ? "bg-accent text-white border-accent" : "bg-base text-primary/70 border-primary/20 hover:border-primary/40"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "min-h-[400px] transition-all duration-1000 delay-500 ease-out transform",
          contentStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {loading ? (
            <div className="text-center py-20 text-primary/50">Loading menu...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">Error loading menu: {error}</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-20 text-primary/50">No menu items available at the moment.</div>
          ) : (
            <>
              {isFiltering ? (
                <div key="filtered" className="opacity-100">
                  {filteredItems.length > 0 ? (
                    renderItems(filteredItems)
                  ) : (
                    <div className="text-center py-20 text-primary/50">
                      {t('menu.noItems')}
                    </div>
                  )}
                </div>
              ) : activeCategory === 'food' ? (
                <div key="food" className="opacity-100">
                  {/* Sub-tabs for Food */}
                  <div className="flex justify-center gap-6 mb-10 border-b border-primary/10 pb-4">
                    <button
                      onClick={() => setFoodType('veg')}
                      className={cn(
                        "text-sm font-semibold tracking-wide uppercase pb-2 relative transition-colors",
                        foodType === 'veg' ? "text-primary" : "text-primary/40 hover:text-primary/70"
                      )}
                    >
                      {t('menu.veg')}
                      {foodType === 'veg' && (
                        <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent" />
                      )}
                    </button>
                    <button
                      onClick={() => setFoodType('nonveg')}
                      className={cn(
                        "text-sm font-semibold tracking-wide uppercase pb-2 relative transition-colors",
                        foodType === 'nonveg' ? "text-primary" : "text-primary/40 hover:text-primary/70"
                      )}
                    >
                      {t('menu.nonveg')}
                      {foodType === 'nonveg' && (
                        <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent" />
                      )}
                    </button>
                  </div>

                  {foodType === 'veg' ? renderItems(foodVegItems) : renderItems(foodNonVegItems)}
                </div>
              ) : activeCategory === 'beverages' ? (
                <div key="beverages" className="opacity-100">
                  {renderItems(beverageItems)}
                </div>
              ) : activeCategory === 'desserts' ? (
                <div key="desserts" className="opacity-100">
                  {renderItems(dessertItems)}
                </div>
              ) : null}
            </>
          )}
        </div>


        <div className="mt-20 p-8 rounded-3xl bg-base border border-primary/5 text-center flex flex-col items-center">
          <h3 className="font-serif text-2xl font-medium mb-2">{t('menu.craving')}</h3>
          <p className="text-primary/70 text-sm mb-8">{t('menu.cravingDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8" onClick={onOrderClick}>{t('btn.order')}</Button>
            <Button variant="outline" className="w-full sm:w-auto px-8" onClick={() => {
              onReserveClick();
              handleClose();
            }}>{t('btn.reserve')}</Button>
            <Button variant="ghost" className="w-full sm:w-auto px-6 text-accent" onClick={() => {
              onViewReservedClick();
              handleClose();
            }}>View My Reservation</Button>
          </div>
        </div>
      </div>
      </div>

      {/* Right side: Gallery */}
      <div className="hidden lg:block lg:w-[40%] h-full">
        <MenuGallery />
      </div>
    </div>
  );
}
