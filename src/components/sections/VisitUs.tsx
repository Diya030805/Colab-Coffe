"use client";

import React from 'react';
import { MapPin, Clock, Phone, Map } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LocationMap } from '../LocationMap';

export function VisitUs({ onReserveClick }: { onReserveClick: () => void }) {
  const { t } = useLanguage();
  return (
    <section id="visit" className="py-24 bg-base relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-medium text-primary mb-4"
          >
            {t('visit.title')}
          </motion.h2>
          <p className="text-primary/70 max-w-xl mx-auto">{t('visit.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-base flex items-center justify-center shrink-0">
                <MapPin className="text-accent w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium mb-2">{t('visit.location')}</h3>
                <p className="text-primary/70 leading-relaxed">
                  {t('visit.address1')} <br/>
                  {t('visit.address2')} <br/>
                  {t('visit.address3')}
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-base flex items-center justify-center shrink-0">
                <Clock className="text-accent w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium mb-2">{t('visit.hours')}</h3>
                <p className="text-primary/70">{t('visit.openDaily')}</p>
                <p className="text-primary/70 font-medium">10:30 AM – 10:00 PM</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-base flex items-center justify-center shrink-0">
                <Phone className="text-accent w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium mb-2">{t('visit.contact')}</h3>
                <a href="tel:08910780424" className="text-primary/70 hover:text-accent transition-colors block mb-1">089107 80424</a>
                <p className="text-primary/50 text-sm">{t('visit.callUs')}</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.open('https://maps.google.com/?q=G945+8P+Kolkata,+West+Bengal', '_blank')}
                className="flex items-center gap-2"
              >
                <Map size={18} />
                {t('visit.directions')}
              </Button>
              <Button variant="outline" onClick={onReserveClick}>{t('btn.reserve')}</Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
          >
            <LocationMap 
              name="CoLab Coffee Calcutta"
              address="G945 8P, Kolkata, West Bengal"
              mapQuery="CoLab Coffee Calcutta G945 8P Kolkata"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
