import React from 'react';
import { motion } from 'motion/react';
import { Star, Coffee, Moon, Heart } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useLanguage } from '../../contexts/LanguageContext';

function FeatureCard({ f, i }: { f: any, i: number, key?: React.Key }) {
  const { tiltProps } = useTilt(10);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: i * 0.1 }}
      className="bg-base p-8 rounded-2xl shadow-sm border border-primary/5 text-center flex flex-col items-center"
      {...tiltProps}
      style={tiltProps.style}
    >
      <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
        {f.icon}
      </div>
      <h3 className="font-serif text-xl font-medium mb-3">{f.title}</h3>
      <p className="text-primary/70 text-sm leading-relaxed">{f.desc}</p>
    </motion.div>
  );
}

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Coffee className="w-6 h-6" />,
      title: t('features.handcrafted'),
      desc: t('features.handcraftedDesc')
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: t('features.ambience'),
      desc: t('features.ambienceDesc')
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('features.locals'),
      desc: t('features.localsDesc')
    }
  ];

  return (
    <section className="py-20 bg-base relative z-20 -mt-6 rounded-t-[2rem]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Trust Bar */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl font-medium text-primary"
          >
            Why Choose CoLab
          </motion.h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-20 text-sm font-medium text-primary/70">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-accent text-accent" />
            <span className="text-primary font-semibold text-base">{t('features.rating')}</span>
            <span className="text-primary/50">{t('features.reviews')}</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/20" />
          <span>{t('features.dineIn')}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <span>{t('features.driveThrough')}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <span>{t('features.delivery')}</span>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/20" />
          <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">{t('features.lgbtq')}</span>
          <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">{t('features.womenOwned')}</span>
        </div>

        {/* Why CoLab Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
