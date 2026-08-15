import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

export function About({ onReserveClick }: { onReserveClick?: () => void } = {}) {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-24 bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 text-accent">{t('about.eyebrow')}</p>
              <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-5xl font-medium text-primary leading-tight"
            >
                {t('about.title')}
            </motion.h2>
            </div>
            
            <div className="space-y-6 text-primary/80 leading-relaxed font-light text-lg">
              <p>
                {t('about.p1')}
              </p>
              <p>
                {t('about.p2')}
              </p>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-6 border-t border-primary/10">
              <div>
                <p className="font-serif text-3xl font-medium text-accent mb-2">333+</p>
                <p className="text-sm text-primary/60 font-medium uppercase tracking-wide">{t('about.reviews')}</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-medium text-accent mb-2">10pm</p>
                <p className="text-sm text-primary/60 font-medium uppercase tracking-wide">{t('about.openLate')}</p>
              </div>
            </div>

            {onReserveClick && (
              <div className="pt-6">
                <Button 
                  onClick={onReserveClick}
                  className="group relative overflow-hidden"
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
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=1200" 
                alt="Coffee pouring process" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-base p-8 rounded-3xl shadow-xl max-w-sm hidden md:block">
              <Quote className="text-accent/20 w-12 h-12 mb-4" />
              <p className="font-serif text-lg text-primary italic leading-snug">
                {t('about.quote')}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
