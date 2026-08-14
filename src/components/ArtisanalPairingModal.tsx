import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Coffee, Utensils, Heart, RefreshCw, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

interface PairingResult {
  coffeeName: string;
  coffeeDescription: string;
  foodName: string;
  foodDescription: string;
  pairingExplanation: string;
  vibeSubtitle: string;
}

export function ArtisanalPairingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language } = useLanguage();
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhrase, setLoadingPhrase] = useState('');

  const loadingPhrases = language === 'bn' ? [
    'কফির দানাগুলো আপনার মেজাজ বুঝছে...',
    'এসপ্রেসো মেশিনটি প্রস্তুত করা হচ্ছে...',
    'দার্জিলিং ফার্স্ট ফ্লাশের সুবাস মেলানো হচ্ছে...',
    'নিখুঁত স্বাদের মেলবন্ধন খোঁজা হচ্ছে...',
    'বাতি জ্বালিয়ে শান্ত পরিবেশ তৈরি করা হচ্ছে...'
  ] : [
    'Whispering to the coffee beans...',
    'Calibrating the pour-over water temperature...',
    'Steeping Darjeeling tea leaves in local rhythm...',
    'Consulting the master barista notes...',
    'Flickering the candle light to match your vibe...'
  ];

  const quickMoods = language === 'bn' ? [
    { label: 'বৃষ্টিভেজা বিকেল', value: 'Rainy afternoon adda, feeling thoughtful' },
    { label: 'ক্লান্ত কিন্তু সৃজনশীল', value: 'Tired but creative after a long coding session' },
    { label: 'একাকীত্ব ও প্রশান্তি', value: 'Quiet solitude, wanting a calm escape' },
    { label: 'বন্ধুদের সাথে আড্ডা', value: 'Vibrant chat with old friends' },
    { label: 'উদ্যমী সকাল', value: 'Morning focus, eager to build something new' }
  ] : [
    { label: 'Rainy Melancholy', value: 'Rainy afternoon, feeling thoughtful and literary' },
    { label: 'Exhausted Developer', value: 'Exhausted but highly creative after writing code' },
    { label: 'Intimate Solitude', value: 'Quiet self-reflection, wanting a peaceful warm space' },
    { label: 'Warm Adda / Catchup', value: 'Warm reunion with loved ones and friends' },
    { label: 'Focused Ambition', value: 'Energetic morning focus, ready to tackle big ideas' }
  ];

  // Rotate loading phrases
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      setLoadingPhrase(loadingPhrases[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % loadingPhrases.length;
        setLoadingPhrase(loadingPhrases[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, language]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchPairing = async (moodText: string) => {
    if (!moodText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/pairings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodText, language }),
      });

      if (!response.ok) {
        throw new Error('Could not blend the perfect pairing. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMood('');
    setResult(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090705]/80 backdrop-blur-md"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative bg-[#16120e] border border-primary/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top header */}
          <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <h3 className="font-serif text-lg md:text-xl text-primary font-medium tracking-wide">
                {language === 'bn' ? 'আর্টিসানাল মেলবন্ধন' : 'Artisanal Mood Pairing'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-primary/80 font-sans leading-relaxed text-sm">
                    {language === 'bn' 
                      ? 'আজ আপনার মেজাজ কেমন? আমাদের এআই-চালিত আর্টিসানাল ব্যারিস্তা আপনার আবেগের সাথে সামঞ্জস্য রেখে একটি অনন্য কফি এবং খাবারের জুটি তৈরি করবে।'
                      : 'How are you feeling right now? Describe your mood, and our AI Artisanal Barista will blend an evocative coffee and food pairing customized exactly for you.'}
                  </p>
                </div>

                {/* Input area */}
                <div className="space-y-3">
                  <label htmlFor="mood-input" className="block text-xs font-semibold uppercase tracking-wider text-accent/80">
                    {language === 'bn' ? 'আপনার মেজাজ বা অনুভুতি লিখুন' : 'Describe your current vibe'}
                  </label>
                  <div className="relative">
                    <textarea
                      id="mood-input"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      placeholder={language === 'bn' ? 'উদাঃ সারাদিন কোডিংয়ের পর ক্লান্ত কিন্তু খুশী...' : 'e.g., listening to lofi, reading a poetry book during a calm rain...'}
                      className="w-full bg-[#1e1914] border border-primary/10 rounded-xl px-4 py-3.5 pr-12 text-primary placeholder-primary/35 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/40 text-sm font-sans resize-none h-24 transition-colors"
                      maxLength={150}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-primary/30">
                      {mood.length}/150
                    </div>
                  </div>
                </div>

                {/* Quick mood chips */}
                <div className="space-y-3">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary/50">
                    {language === 'bn' ? 'দ্রুত নির্বাচন করুন' : 'Or select a quick mood'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickMoods.map((qm, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setMood(qm.value);
                          fetchPairing(qm.value);
                        }}
                        className="text-xs bg-[#1a1511] border border-primary/5 text-primary/80 hover:text-white hover:border-accent hover:bg-accent/10 rounded-full px-3.5 py-1.5 transition-all duration-300"
                      >
                        {qm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                  <Coffee className="w-6 h-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <p className="font-serif italic text-lg text-primary animate-pulse">
                    {loadingPhrase}
                  </p>
                  <p className="text-primary/40 text-xs font-sans">
                    {language === 'bn' ? 'আমাদের ব্যারিস্তা আপনার জন্য সেরা জুটি বেছে নিচ্ছে...' : 'Crafting a personalized sensory experience...'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center space-y-4"
              >
                <p className="text-sm text-red-400 font-sans font-medium">{error}</p>
                <Button onClick={handleReset} variant="outline" size="sm">
                  {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                </Button>
              </motion.div>
            )}

            {/* Result Presentation */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="space-y-6"
              >
                {/* Evocative Header / Vibe label */}
                <div className="text-center bg-accent/5 border border-accent/10 rounded-xl py-3 px-4">
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-accent block mb-1">
                    {language === 'bn' ? 'আপনার মেজাজ সুর' : 'Your Shared Vibe'}
                  </span>
                  <h4 className="font-serif text-lg md:text-xl text-primary font-medium italic">
                    "{result.vibeSubtitle}"
                  </h4>
                </div>

                {/* Symmetrical Dual Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coffee card */}
                  <div className="bg-[#1e1914] border border-primary/10 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-4 right-4 opacity-5 text-accent">
                      <Coffee className="w-12 h-12" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-accent mb-2.5">
                        <Coffee className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {language === 'bn' ? 'বিশেষ কফি' : 'The Specialty Brew'}
                        </span>
                      </div>
                      <h5 className="font-serif text-lg text-primary font-bold mb-2">
                        {result.coffeeName}
                      </h5>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans font-light">
                        {result.coffeeDescription}
                      </p>
                    </div>
                  </div>

                  {/* Food card */}
                  <div className="bg-[#1e1914] border border-primary/10 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-4 right-4 opacity-5 text-accent">
                      <Utensils className="w-12 h-12" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-accent mb-2.5">
                        <Utensils className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {language === 'bn' ? 'আর্টিসানাল খাবার' : 'The Artisanal Food'}
                        </span>
                      </div>
                      <h5 className="font-serif text-lg text-primary font-bold mb-2">
                        {result.foodName}
                      </h5>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans font-light">
                        {result.foodDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Synthesis Explanation Card */}
                <div className="bg-[#241e18]/40 border border-accent/15 rounded-xl p-5 relative">
                  <div className="flex items-center gap-1.5 text-accent mb-2.5">
                    <Heart className="w-4 h-4 fill-accent/20 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {language === 'bn' ? 'পরস্পর সামঞ্জস্য' : 'The Perfect Harmony'}
                    </span>
                  </div>
                  <p className="font-serif italic text-sm md:text-base text-primary/90 leading-relaxed">
                    "{result.pairingExplanation}"
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom actions footer */}
          <div className="px-6 py-4 bg-[#120f0c] border-t border-primary/10 flex flex-col sm:flex-row gap-3 items-center justify-end">
            {!result && !loading && (
              <Button
                onClick={() => fetchPairing(mood)}
                disabled={!mood.trim()}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  {language === 'bn' ? 'জুটি তৈরি করুন' : 'Discover Pairing'}
                  <Send className="w-4 h-4" />
                </span>
              </Button>
            )}

            {result && !loading && (
              <>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full sm:w-auto text-xs"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'আরেকটি মেজাজ পরীক্ষা করুন' : 'Try Another Mood'}
                  </span>
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full sm:w-auto text-xs"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close Suggestion'}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
