"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, Check, Star, Sparkles, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const TOTAL_STAMPS = 10;

export function CoffeeLoyaltyCard() {
  const [stamps, setStamps] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('loyalty_stamps');
    if (saved) {
      setStamps(parseInt(saved, 10));
    }
  }, []);

  const addStamp = () => {
    if (stamps >= TOTAL_STAMPS) {
      setShowReward(true);
      return;
    }

    const nextStamps = stamps + 1;
    setStamps(nextStamps);
    localStorage.setItem('loyalty_stamps', nextStamps.toString());

    if (nextStamps === TOTAL_STAMPS) {
      setShowReward(true);
      toast.success("Congratulations! Your 10th coffee is on us!", {
        icon: <Gift className="text-accent" />,
        duration: 6000
      });
    } else {
      toast("Stamp collected!", {
        description: `${TOTAL_STAMPS - nextStamps} more to your free coffee.`,
        icon: <Coffee className="text-accent" />
      });
    }
  };

  const resetCard = () => {
    setStamps(0);
    localStorage.setItem('loyalty_stamps', '0');
    setShowReward(false);
  };

  if (!mounted) return null;

  const progress = (stamps / TOTAL_STAMPS) * 100;

  return (
    <section className="py-24 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 opacity-100"
          >
            <Star size={14} className="text-accent fill-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Loyalty Program</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif text-primary opacity-100"
          >
            Digital Coffee Card
          </h2>
          <p
            className="text-primary/60 max-w-lg mx-auto opacity-100"
          >
            Collect 10 stamps and enjoy your next coffee on the house. Scan your receipt or click below to add a stamp.
          </p>
        </div>

        <div
          className="relative bg-base rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-primary/5 overflow-hidden opacity-100"
        >
          {/* Progress Bar */}
          <div className="mb-12 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Progress</span>
              <span className="text-2xl font-serif text-accent">{stamps}<span className="text-primary/20 text-sm">/{TOTAL_STAMPS}</span></span>
            </div>
            <div className="h-3 w-full bg-primary/5 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-accent relative transition-all duration-500 ease-out"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[pulse_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Stamps Grid */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4 md:gap-6 mb-12">
            {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
              <div key={i} className="aspect-square relative">
                <div className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  i < stamps 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'bg-primary/5 text-primary/10 border-2 border-dashed border-primary/5'
                }`}>
                  {i < stamps ? (
                    <div className="opacity-100 scale-100">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  ) : (
                    <Coffee size={20} />
                  )}
                </div>
                {i === TOTAL_STAMPS - 1 && i >= stamps && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-bounce shadow-md">
                    <Gift size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              onClick={addStamp}
              disabled={stamps >= TOTAL_STAMPS}
              className="w-full sm:w-auto h-16 px-8 rounded-2xl text-lg font-serif group"
            >
              <span className="flex items-center gap-3">
                {stamps >= TOTAL_STAMPS ? (
                  <>Claim Your Free Coffee <Sparkles size={20} className="text-white animate-pulse" /></>
                ) : (
                  <>Collect Stamp <Coffee size={20} className="group-hover:rotate-12 transition-transform" /></>
                )}
              </span>
            </Button>
            
            {stamps > 0 && stamps < TOTAL_STAMPS && (
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary/30">
                Next reward at {TOTAL_STAMPS} stamps
              </p>
            )}
          </div>

          {/* Celebration Overlay */}
          {showReward && (
            <div
              className="absolute inset-0 bg-accent flex flex-col items-center justify-center text-white p-8 text-center z-20 opacity-100"
            >
              <div
                className="space-y-6 opacity-100 scale-100"
              >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-white/10">
                  <Sparkles size={48} className="text-white" />
                </div>
                <h3 className="text-4xl font-serif">You've Earned a Free Coffee!</h3>
                <p className="text-white/80 max-w-xs mx-auto">Show this screen to our barista at CoLab Coffee Calcutta to claim your reward.</p>
                <div className="pt-8 flex flex-col gap-4">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20 font-mono text-2xl tracking-[0.3em]">
                    REWARD-COFFEE-99
                  </div>
                  <button 
                    onClick={resetCard}
                    className="text-white/60 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors"
                  >
                    Start New Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
