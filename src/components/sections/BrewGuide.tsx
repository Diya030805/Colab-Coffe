import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Flame, Award, Coffee, Droplets, Thermometer, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { trackEvent } from '../../lib/analytics';

interface BrewStep {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  durationSeconds: number;
}

interface BrewMethod {
  id: string;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  ratioEn: string;
  ratioBn: string;
  grindEn: string;
  grindBn: string;
  tempEn: string;
  tempBn: string;
  iconName: 'pour' | 'french' | 'aero';
  steps: BrewStep[];
}

const BREW_METHODS: BrewMethod[] = [
  {
    id: 'pour-over',
    nameEn: 'Pour-Over (Hario V60)',
    nameBn: 'পোর-ওভার (হারিও ভি৬০)',
    taglineEn: 'Clean body, highlighted tasting notes, and complex floral acidity.',
    taglineBn: 'হালকা চমৎকার টেক্সচার, কফির নিজস্ব ফ্লেভার ও সূক্ষ্ম ফ্লোরাল অম্লতা।',
    ratioEn: '15g Coffee : 250g Water',
    ratioBn: '১৫ গ্রাম কফি : ২৫০ গ্রাম পানি',
    grindEn: 'Medium-Fine (Sandlike)',
    grindBn: 'মিডিয়াম-ফাইন (বালির দানা)',
    tempEn: '93°C / 200°F',
    tempBn: '৯৩ ডিগ্রী সেলসিয়াস',
    iconName: 'pour',
    steps: [
      {
        titleEn: 'Fold & Rinse Filter',
        titleBn: 'ফিল্টার পেপার ধোয়া',
        descEn: 'Fold the paper filter, place it in the V60 dripper, and pour hot water to rinse. This preheats the glass/ceramic and removes papery flavor. Discard water.',
        descBn: 'ফিল্টার পেপারটি ভাঁজ করে ভি৬০ ড্রিপারে রাখুন এবং গরম পানি দিয়ে ধুয়ে নিন। এটি পাত্রটিকে গরম করবে এবং কাগজের গন্ধ দূর করবে। পাত্রের পানিটি ফেলে দিন।',
        durationSeconds: 15
      },
      {
        titleEn: 'Add Ground Coffee & Zero Scale',
        titleBn: 'কফি গুঁড়ো দিন এবং স্কেল জিরো করুন',
        descEn: 'Add 15 grams of medium-fine freshly ground coffee to the dripper. Give it a gentle shake to flatten the coffee bed, then tare your scale.',
        descBn: 'ড্রিপারে ১৫ গ্রাম মিডিয়াম-ফাইন গুঁড়ো কফি যোগ করুন। কফির উপরিভাগ মসৃণ করতে আলতো করে ঝাঁকিয়ে নিন, এরপর ডিজিটাল স্কেলটি জিরো (tare) করে নিন।',
        durationSeconds: 15
      },
      {
        titleEn: 'The Blooming Phase',
        titleBn: 'কফির ব্লুমিং পর্ব',
        descEn: 'Pour 45g of water at 93°C quickly but gently over the grounds, ensuring all are wet. Let it bloom for 35 seconds to release trapped carbon dioxide gas.',
        descBn: '৯৩ ডিগ্রী তাপমাত্রার ৪৫ গ্রাম পানি কফির ওপর বৃত্তাকারে ঢালুন যাতে সব কফি ভিজে যায়। কফিতে জমে থাকা কার্বন ডাই-অক্সাইড গ্যাস বের করার জন্য ৩৫ সেকেন্ড অপেক্ষা করুন।',
        durationSeconds: 35
      },
      {
        titleEn: 'First Spiral Pour',
        titleBn: 'প্রথম বৃত্তাকার পোর',
        descEn: 'Pour in steady spirals from the center outwards up to 150g on your scale. Avoid pouring directly on the paper filter edges. Keep flow rate controlled.',
        descBn: 'কেন্দ্র থেকে শুরু করে বৃত্তাকারে আস্তে আস্তে ১৫০ গ্রাম পর্যন্ত গরম পানি ঢালুন। ড্রিপারের কাগজের ফিল্টারের ধারে সরাসরি পানি ঢালা থেকে বিরত থাকুন।',
        durationSeconds: 45
      },
      {
        titleEn: 'Final Main Pour',
        titleBn: 'চূড়ান্ত মূল পোর',
        descEn: 'Pour smoothly up to 250g in concentric circles. Give the V60 dripper a single gentle swirl and let it draw down fully for a beautiful flat coffee bed.',
        descBn: 'সবশেষে ২৫০ গ্রাম পূর্ণ হওয়া পর্যন্ত গোল গোল করে পানি ঢালুন। এরপর সম্পূর্ণ ড্রিপারটি ধরে আলতো করে একবার ঘুরিয়ে দিন এবং কফিটি সম্পূর্ণ ফিল্টার হয়ে পড়তে দিন।',
        durationSeconds: 55
      }
    ]
  },
  {
    id: 'french-press',
    nameEn: 'French Press (Plunger)',
    nameBn: 'ফ্রেঞ্চ প্রেস (প্লাঞ্জার)',
    taglineEn: 'Rich, full-bodied cup with strong aromatic oils and satisfying weight.',
    taglineBn: 'ঘন গাঢ় টেক্সচার, কফির সুগন্ধী প্রাকৃতিক তেল ও চমৎকার কড়া স্বাদ।',
    ratioEn: '20g Coffee : 320g Water',
    ratioBn: '২০ গ্রাম কফি : ৩২০ গ্রাম পানি',
    grindEn: 'Coarse (Sea Salt)',
    grindBn: 'কোর্স (সমুদ্রের লবণদানা)',
    tempEn: '94°C / 202°F',
    tempBn: '৯৪ ডিগ্রী সেলসিয়াস',
    iconName: 'french',
    steps: [
      {
        titleEn: 'Preheat Plunger Carafe',
        titleBn: 'ফ্রেঞ্চ প্রেস গরম করা',
        descEn: 'Pour a splash of boiling water into your French Press and swirl to warm the glass chamber. Empty the carafe completely before adding ingredients.',
        descBn: 'ফ্রেঞ্চ প্রেসের কাঁচে সামান্য গরম পানি ঢালুন এবং চারদিকে ঘুরিয়ে প্রি-হিট বা গরম করে নিন। কফি দেওয়ার আগে পাত্রের গরম পানিটি ফেলে দিন।',
        durationSeconds: 15
      },
      {
        titleEn: 'Add Coffee & Initial Pour',
        titleBn: 'কফি ও প্রাথমিক পানি ঢালা',
        descEn: 'Add 20g coarsely ground coffee to the warm beaker. Pour 320g of hot water smoothly, saturating all grounds evenly. Do not plunge yet.',
        descBn: 'গরম পাত্রটিতে ২০ গ্রাম একটু বড় দানার কোর্স কফি দিন। ৩২০ গ্রাম গরম পানি আস্তে আস্তে পুরো কফির ওপর সমানভাবে ঢালুন। এখনই প্লাঞ্জার চাপবেন না।',
        durationSeconds: 30
      },
      {
        titleEn: 'The 4-Minute Steep',
        titleBn: '৪-মিনিটের স্টিপিং পর্ব',
        descEn: 'Place the lid on top to retain heat but do NOT plunge. Let the coffee grounds steep undisturbed to extract deep oils and heavy caramelized flavors.',
        descBn: 'তাপমাত্রা ধরে রাখার জন্য প্লাঞ্জারের ঢাকনাটি ওপরে রাখুন কিন্তু নিচে চাপবেন না। কফি থেকে তেল ও সুগন্ধি ফ্লেভার ছড়ানোর জন্য শান্তভাবে অপেক্ষা করুন।',
        durationSeconds: 120
      },
      {
        titleEn: 'Break and Clean Crust',
        titleBn: 'কফির স্তর ভাঙা ও পরিষ্কার করা',
        descEn: 'Remove lid. Use a spoon to gently stir the top crust, causing the grounds to sink. Scoop off any floating pale foam or remaining surface grounds.',
        descBn: 'ঢাকনাটি সরিয়ে নিন। চামচ দিয়ে ওপরে জমে থাকা কফির শক্ত স্তরটি ভেঙে দিন যাতে কফি নিচে থিতিয়ে পড়ে। ওপরের হালকা ফেনা ও ভেসে থাকা কফি চামচ দিয়ে তুলে ফেলে দিন।',
        durationSeconds: 20
      },
      {
        titleEn: 'Slow Plunge & Decant',
        titleBn: 'আস্তে প্লাঞ্জার চাপা ও পরিবেশন',
        descEn: 'Replace plunger lid. Press down very slowly with steady, gentle forearm pressure. Pour into cups immediately to prevent over-extracting bitter notes.',
        descBn: 'প্লাঞ্জার ঢাকনাটি আবার পরান। অত্যন্ত আস্তে আস্তে ও মৃদু চাপে প্লাঞ্জারটি নিচের দিকে চেপে দিন। তিতকুটে স্বাদ এড়াতে সাথে সাথে কফিটি অন্য পাত্রে ঢেলে পরিবেশন করুন।',
        durationSeconds: 30
      }
    ]
  },
  {
    id: 'aeropress',
    nameEn: 'AeroPress (Inverted Method)',
    nameBn: 'অ্যারোপ্রেস (ইনভার্টেড পদ্ধতি)',
    taglineEn: 'Versatile, sweet, and incredibly rich extraction with zero sediment.',
    taglineBn: 'নমনীয়, প্রাকৃতিকভাবে মিষ্টি ও পলিমার ফিল্টার ব্যবহারের কারণে একদম মসৃণ কফি।',
    ratioEn: '16g Coffee : 220g Water',
    ratioBn: '১৬ গ্রাম কফি : ২২০ গ্রাম পানি',
    grindEn: 'Medium-Fine (Fine Sand)',
    grindBn: 'মিডিয়াম-ফাইন (মিহি বালি)',
    tempEn: '88°C / 190°F',
    tempBn: '৮৮ ডিগ্রী সেলসিয়াস',
    iconName: 'aero',
    steps: [
      {
        titleEn: 'Assemble Inverted & Rinse Filter',
        titleBn: 'ইনভার্টেড সেটআপ ও ফিল্টার ধোয়া',
        descEn: 'Assemble your AeroPress upside-down with plunger pushed in slightly. Place a paper filter inside the cap, rinse with hot water, and set aside.',
        descBn: 'প্লাঞ্জারটি সামান্য ভেতরে ঢুকিয়ে অ্যারোপ্রেসটি উল্টো করে (ইনভার্টেড) দাঁড় করান। ক্যাপের ভেতর কাগজের ফিল্টারটি রেখে গরম পানি দিয়ে ধুয়ে একপাশে রাখুন।',
        durationSeconds: 15
      },
      {
        titleEn: 'Add Grounds & Pre-wet',
        titleBn: 'কফি গুঁড়ো দেওয়া ও ভেজানো',
        descEn: 'Add 16g of medium-fine grounds inside the chamber. Pour 60g of water, stir vigorously 10 times to wet all grounds, and let bloom.',
        descBn: 'চেম্বারের ভেতর ১৬ গ্রাম মিডিয়াম-ফাইন কফি দিন। ৬০ গ্রাম গরম পানি ঢেলে চামচ বা নাড়ানি দিয়ে ১০ বার ভালোমতো নেড়ে দিন এবং কফিটি ভিজতে দিন।',
        durationSeconds: 25
      },
      {
        titleEn: 'Fill Chamber & Let Steep',
        titleBn: 'সম্পূর্ণ পানি দেওয়া ও ভিজিয়ে রাখা',
        descEn: 'Pour remaining hot water up to 220g. Let the coffee mixture brew undisturbed for full development of sweetness and origin characteristics.',
        descBn: 'বাকি গরম পানি ঢেলে মোট ২২০ গ্রাম পূর্ণ করুন। কফির নিজস্ব ফ্লেভার ও মিষ্টিভাব সম্পূর্ণ বিকশিত হওয়ার জন্য কিছুক্ষণ এভাবেই শান্তভাবে রাখুন।',
        durationSeconds: 45
      },
      {
        titleEn: 'Secure Cap & Quick Flip',
        titleBn: 'ক্যাপ লাগানো ও সাবধানে ঘোরানো',
        descEn: 'Screw the filter cap tightly onto the chamber. Carefully, with a firm grip on both parts, flip the entire assembly over onto your sturdy mug.',
        descBn: 'ফিল্টার ক্যাপটি চেম্বারের মাথায় শক্ত করে স্ক্রু করে আটকান। খুব সাবধানে দুই অংশ শক্ত করে ধরে একসাথে উল্টিয়ে আপনার কফি মগের ওপর বসান।',
        durationSeconds: 15
      },
      {
        titleEn: 'Steady Gentle Plunge',
        titleBn: 'একটানা মৃদু চাপে প্লাঞ্জ করা',
        descEn: 'Apply steady downward pressure on the plunger. Plunge slowly until you hear a soft hissing sound of air escaping. Stop plunging immediately.',
        descBn: 'প্লাঞ্জারের ওপর অবিরাম মৃদু চাপ দিন। আস্তে আস্তে নিচের দিকে চাপুন যতক্ষণ না বাতাস বের হওয়ার মৃদু হিসহিস শব্দ শুনতে পাচ্ছেন। শব্দ শুনলেই সাথে সাথে প্লাঞ্জ করা বন্ধ করুন।',
        durationSeconds: 30
      }
    ]
  }
];

export function BrewGuide() {
  const { language } = useLanguage();
  const [activeMethod, setActiveMethod] = useState<BrewMethod>(BREW_METHODS[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(activeMethod.steps[0].durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep = activeMethod.steps[currentStepIdx];
  const maxSteps = activeMethod.steps.length;

  // Sync timer when method or step changes
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(activeMethod.steps[currentStepIdx].durationSeconds);
  }, [activeMethod, currentStepIdx]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Native Synthesized Cafe Chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // High-pitched clear coffee shop counter bell sound (chime)
      const now = ctx.currentTime;
      
      // Harmonic 1 (Fundamental bell frequency)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5 note
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      // Harmonic 2 (High overtone ring)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1760, now); // Octave up A6
      
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.9);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio Context could not be initialized:", e);
    }
  };

  // Timer Tick Core Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Step complete
            playChime();
            if (currentStepIdx < maxSteps - 1) {
              setCurrentStepIdx((idx) => idx + 1);
            } else {
              setIsRunning(false);
              trackEvent('brew_guide_complete', { method: activeMethod.id });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStepIdx, maxSteps, activeMethod]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
    trackEvent('brew_guide_timer_toggle', { method: activeMethod.id, isRunning: !isRunning, step: currentStepIdx });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(activeStep.durationSeconds);
    trackEvent('brew_guide_timer_reset', { method: activeMethod.id, step: currentStepIdx });
  };

  const handleNextStep = () => {
    if (currentStepIdx < maxSteps - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      trackEvent('brew_guide_next_step', { method: activeMethod.id, step: currentStepIdx + 1 });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      trackEvent('brew_guide_prev_step', { method: activeMethod.id, step: currentStepIdx - 1 });
    }
  };

  const handleMethodChange = (method: BrewMethod) => {
    setActiveMethod(method);
    setCurrentStepIdx(0);
    setIsRunning(false);
    trackEvent('brew_guide_method_select', { method: method.id });
  };

  // Calculations for Step Progress Rings
  const totalDuration = activeStep.durationSeconds;
  const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const strokeDashoffset = 220 - (220 * percentage) / 100;

  return (
    <section id="brew-guide" className="py-20 bg-[#0c0a08] border-t border-primary/5 text-left">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title & Section Intro Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Coffee size={12} />
            <span>{language === 'bn' ? 'কো-ল্যাব কফি টিউটোরিয়াল' : 'CoLab Coffee Brewing Guides'}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary tracking-tight leading-tight mb-4">
            {language === 'bn' ? 'নিখুঁত কাপ ব্রিউ করুন আপনার ঘরেই' : 'Brew Like a Barista at Home'}
          </h2>
          <p className="text-sm md:text-base text-primary/60 leading-relaxed font-sans">
            {language === 'bn'
              ? 'কফি ব্রিউ করা একটি বিজ্ঞান ও শিল্পের মেলবন্ধন। আপনার পছন্দের সরঞ্জামটি বেছে নিয়ে কফি বানানোর ধাপে ধাপে আমাদের ইন্টারেক্টিভ টাইমারটি অনুসরণ করুন।'
              : 'Coffee brewing is a sensory ritual of water, temperature, and ratio. Select your preferred equipment below, configure your coffee scale, and activate our interactive step-by-step follow-along guide.'}
          </p>
        </div>

        {/* Outer Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Equipment selectors & parameters list (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* 1. Selector Buttons */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest block mb-1">
                {language === 'bn' ? 'সরঞ্জাম নির্বাচন করুন' : '1. Choose Your Brewing Device'}
              </span>
              
              <div className="flex flex-col gap-3">
                {BREW_METHODS.map((method) => {
                  const isSelected = activeMethod.id === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodChange(method)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-start gap-3.5 cursor-pointer select-none group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-[#1a1411] border-accent text-primary shadow-lg shadow-accent/5' 
                          : 'bg-[#14100d]/60 border-primary/5 hover:border-primary/10 text-primary/70 hover:text-primary'
                      }`}
                    >
                      {/* Left vertical highlights */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                      )}

                      {/* Icon wrappers */}
                      <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-accent/10 border-accent/20 text-accent' 
                          : 'bg-primary/5 border-primary/10 text-primary/40 group-hover:text-primary/70'
                      }`}>
                        <Coffee size={18} />
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-bold tracking-wide">
                          {language === 'bn' ? method.nameBn : method.nameEn}
                        </h4>
                        <p className="text-[11px] leading-relaxed text-primary/50">
                          {language === 'bn' ? method.taglineBn : method.taglineEn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Parameters Dashboard Sheet */}
            <div className="bg-[#14100d] border border-primary/5 rounded-3xl p-6 space-y-4">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest block border-b border-primary/5 pb-2.5">
                {language === 'bn' ? 'নির্ধারিত ব্রিউইং প্যারামিটার' : 'Recommended Brew Parameters'}
              </span>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Ratio Parameter */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/5 border border-primary/5 text-accent shrink-0">
                    <Droplets size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider block">
                      {language === 'bn' ? 'কফি ও পানি অনুপাত' : 'Coffee-to-Water'}
                    </span>
                    <span className="text-xs font-semibold text-primary font-mono">
                      {language === 'bn' ? activeMethod.ratioBn : activeMethod.ratioEn}
                    </span>
                  </div>
                </div>

                {/* Temperature Parameter */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/5 border border-primary/5 text-accent shrink-0">
                    <Thermometer size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider block">
                      {language === 'bn' ? 'পানির তাপমাত্রা' : 'Water Temp'}
                    </span>
                    <span className="text-xs font-semibold text-primary font-mono">
                      {language === 'bn' ? activeMethod.tempBn : activeMethod.tempEn}
                    </span>
                  </div>
                </div>

                {/* Grind Size Parameter */}
                <div className="flex items-center gap-3 col-span-2">
                  <div className="p-2 rounded-xl bg-primary/5 border border-primary/5 text-accent shrink-0">
                    <Flame size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider block">
                      {language === 'bn' ? 'গ্রাইন্ড সাইজ (গুঁড়ো ধরণ)' : 'Ideal Grind Profile'}
                    </span>
                    <span className="text-xs font-semibold text-primary font-sans">
                      {language === 'bn' ? activeMethod.grindBn : activeMethod.grindEn}
                    </span>
                  </div>
                </div>

              </div>
              
              {/* Pro advice footnote */}
              <div className="bg-[#1c1511] border border-accent/10 rounded-xl p-3 flex gap-2">
                <Award size={13} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-primary/65 leading-relaxed font-sans">
                  {language === 'bn'
                    ? 'প্রো-টিপ: সর্বদা ব্রিউ করার একদম আগে তাজা বিন পিষে নিন। কফি স্কেল ব্যবহার করলে প্রতিবার নিখুঁত স্বাদ বজায় থাকবে।'
                    : 'Pro Barista Tip: Grind your single-origin beans fresh right before extraction. Use a digital coffee scale to duplicate precise ratios.'}
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Step-by-Step Interactive Timer Interface (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#14100d] border border-primary/10 rounded-3xl overflow-hidden relative shadow-2xl p-6 md:p-8">
            
            {/* Header: Title step info & Chime Speaker trigger */}
            <div className="flex items-center justify-between border-b border-primary/5 pb-4 mb-6">
              <div>
                <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest block">
                  {language === 'bn' ? `ধাপ ${currentStepIdx + 1} / ${maxSteps}` : `Step ${currentStepIdx + 1} of ${maxSteps}`}
                </span>
                <h3 className="font-serif text-lg font-bold text-primary mt-0.5">
                  {language === 'bn' ? activeStep.titleBn : activeStep.titleEn}
                </h3>
              </div>

              {/* Speaker sound switcher */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  soundEnabled 
                    ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20' 
                    : 'bg-primary/5 border-primary/10 text-primary/30 hover:text-primary/50'
                }`}
                title={soundEnabled ? 'Chime sound is enabled' : 'Chime sound is muted'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>

            {/* Step instruction text container (Dynamic transition effect) */}
            <div className="min-h-[100px] mb-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeMethod.id}-step-${currentStepIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5 text-left"
                >
                  <p className="text-xs md:text-sm text-primary/85 font-medium leading-relaxed font-sans">
                    {language === 'bn' ? activeStep.descBn : activeStep.descEn}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Central visual Ring Timer element */}
            <div className="flex flex-col items-center justify-center py-6 mb-8 relative bg-[#0c0a08]/50 border border-primary/5 rounded-2xl">
              
              {/* Timer Circular Canvas */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                
                {/* Background Track Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="35"
                    className="stroke-[#1a1411]"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  {/* Foreground Animated Ring */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="35"
                    className="stroke-accent"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="220"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transition={{ ease: "linear" }}
                  />
                </svg>

                {/* Centered digits value readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-extrabold text-primary tracking-tighter">
                    {timeLeft}s
                  </span>
                  <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">
                    {isRunning ? (language === 'bn' ? 'চলমান' : 'Active') : (language === 'bn' ? 'স্থগিত' : 'Paused')}
                  </span>
                </div>

              </div>

              {/* Secondary linear timeline steps tracker */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-1.5 justify-center">
                {activeMethod.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIdx 
                        ? 'w-6 bg-accent' 
                        : idx < currentStepIdx 
                          ? 'w-2 bg-accent/30' 
                          : 'w-2 bg-[#261d18]'
                    }`}
                  />
                ))}
              </div>

            </div>

            {/* Bottom Form Action Buttons for Step Controls */}
            <div className="flex items-center justify-between gap-4">
              
              {/* Prev Trigger */}
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStepIdx === 0}
                className="border-primary/10 text-primary hover:bg-primary/5 h-11 w-11 p-0 rounded-xl cursor-pointer disabled:opacity-30 flex items-center justify-center shrink-0"
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Main Play / Pause Button with responsive accent colors */}
              <Button
                onClick={handlePlayPause}
                className={`flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer select-none flex items-center justify-center gap-2 transition-all ${
                  isRunning 
                    ? 'bg-[#1a1411] hover:bg-[#211b17] border border-accent/30 text-accent shadow-md' 
                    : 'bg-accent hover:bg-accent/90 text-black shadow-lg shadow-accent/5'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause size={14} fill="currentColor" />
                    <span>{language === 'bn' ? 'বিরতি দিন' : 'Pause Timer'}</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>{language === 'bn' ? 'শুরু করুন' : 'Start Timer'}</span>
                  </>
                )}
              </Button>

              {/* Reset Trigger */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-primary/10 text-primary hover:bg-primary/5 h-11 w-11 p-0 rounded-xl cursor-pointer flex items-center justify-center shrink-0"
                title="Reset timer for current step"
              >
                <RotateCcw size={14} />
              </Button>

              {/* Next Trigger */}
              <Button
                variant="outline"
                onClick={handleNextStep}
                disabled={currentStepIdx === maxSteps - 1}
                className="border-primary/10 text-primary hover:bg-primary/5 h-11 w-11 p-0 rounded-xl cursor-pointer disabled:opacity-30 flex items-center justify-center shrink-0"
              >
                <ChevronRight size={16} />
              </Button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
