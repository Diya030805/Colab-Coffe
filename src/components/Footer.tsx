import React, { useState } from 'react';
import { MapPin, Phone, Instagram, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { FloatingLabelInput } from './ui/FloatingLabelInput';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const [phone, setPhone] = useState('');
  const [joined, setJoined] = useState(false);
  const { t } = useLanguage();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setJoined(true);
      setPhone('');
    }
  };

  const footerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const footerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  return (
    <footer role="contentinfo" className="bg-primary text-base pt-20 pb-8 px-6 mt-20 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto mb-20 bg-base/5 border border-base/10 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerItemVariants}
      >
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wider uppercase">
            <Gift size={14} /> {t('footer.loyalty')}
          </div>
          <h3 className="font-serif text-3xl font-medium text-white">{t('footer.join')}</h3>
          <p className="text-base/70 text-sm leading-relaxed">
            {t('footer.joinDesc')}
          </p>
        </div>
        
        <div className="w-full md:w-auto shrink-0">
          {joined ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-accent/20 text-accent px-6 py-4 rounded-lg text-sm font-medium border border-accent/30 flex items-center justify-center gap-2"
            >
              {t('footer.welcome')}
            </motion.div>
          ) : (
            <form onSubmit={handleJoin} aria-label="Join our loyalty program" className="flex flex-col sm:flex-row gap-3 items-start">
              <FloatingLabelInput 
                type="tel" 
                label={t('footer.phone')} 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/10 text-white w-full sm:w-64 border border-white/20"
                labelClassName="text-base/50"
                required
              />
              <Button type="submit" className="shrink-0 bg-accent text-white hover:bg-accent/90 border-0 h-[60px] sm:h-[62px] px-8 rounded-2xl">
                {t('footer.signup')}
              </Button>
            </form>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerContainerVariants}
      >
        <motion.div className="space-y-6" variants={footerItemVariants}>
          <h3 className="font-serif text-2xl">CoLab Coffee Calcutta</h3>
          <p className="text-base/70 text-sm leading-relaxed max-w-sm">
            {t('footer.desc')}
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/colabcoffeecalcutta/" target="_blank" rel="noopener noreferrer" aria-label="Follow CoLab Coffee Calcutta on Instagram" className="w-10 h-10 rounded-full border border-base/20 flex items-center justify-center hover:bg-base hover:text-primary transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </motion.div>
        
        <motion.div className="space-y-6" variants={footerItemVariants}>
          <h4 className="font-serif text-lg tracking-wide uppercase text-base/50 text-sm">{t('footer.visitHeader')}</h4>
          <ul className="space-y-4 text-sm text-base/80">
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-accent" />
              <span>{t('visit.address1')} {t('visit.address2')} {t('visit.address3')}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="shrink-0 text-accent" />
              <a href="tel:08910780424" className="hover:text-accent transition-colors">089107 80424</a>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 text-accent font-serif italic">@</span>
              <a href="mailto:hello@colabcoffee.com" className="hover:text-accent transition-colors">hello@colabcoffee.com</a>
            </li>
          </ul>
        </motion.div>
        
        <motion.div className="space-y-6" variants={footerItemVariants}>
          <h4 className="font-serif text-lg tracking-wide uppercase text-base/50 text-sm">{t('footer.hoursHeader')}</h4>
          <ul className="space-y-2 text-sm text-base/80">
            <li>{t('footer.hoursDesc')}</li>
            <li>{t('footer.options')}</li>
          </ul>
          
          <div className="flex gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base/10 text-xs border border-base/10">
              {t('features.lgbtq')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base/10 text-xs border border-base/10">
              {t('features.womenOwned')}
            </span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="max-w-7xl mx-auto border-t border-base/10 mt-16 pt-8 flex flex-col items-center justify-center gap-4 text-xs text-base/40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        viewport={{ once: true }}
      >
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
        <a href="/admin" className="hover:text-base/80 underline decoration-base/20 underline-offset-4">Admin Login</a>
      </motion.div>
    </footer>
  );
}
