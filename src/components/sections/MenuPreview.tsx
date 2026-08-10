import React from 'react';
import { motion } from 'motion/react';
import { beverageItems, foodVegItems, foodNonVegItems, dessertItems, MenuItem } from '../../data/menu';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

export function MenuPreview({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useLanguage();

  // Pick a few signature or popular items to showcase
  const previewItems: MenuItem[] = [
    beverageItems.find(i => i.name === 'Turmeric Latte') || beverageItems[0],
    foodNonVegItems.find(i => i.name === 'Diavolo Chicken Pizza') || foodNonVegItems[0],
    foodVegItems.find(i => i.name === 'Nachos with Avocado Mousse') || foodVegItems[0],
    dessertItems.find(i => i.name === 'Chocolate Cheesecake') || dessertItems[0],
  ].filter(Boolean) as MenuItem[];

  return (
    <motion.section 
      id="menu" 
      className="py-24 bg-base"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 text-accent">{t('menu.eyebrow')}</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-medium text-primary"
          >
            {t('menu.title')}
          </motion.h2>
          <p className="text-primary/70 mt-6 max-w-2xl mx-auto">
            A curated selection of our finest offerings. Discover the taste of excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
          {previewItems.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={item.name}
              className="flex items-center justify-between py-4 border-b border-primary/10 group hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium text-primary text-xl font-serif">{item.name}</span>
                <div className="flex flex-wrap gap-2 mt-2">
                    {item.containsEgg && <span className="text-[10px] text-primary/60 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Contains Egg</span>}
                    {item.dietary?.map(d => (
                       <span key={d} className="text-[10px] bg-primary/5 px-2 py-0.5 rounded-full text-primary/60">{d}</span>
                    ))}
                    {item.type?.map(type => (
                       <span key={type} className="text-[10px] bg-primary/5 px-2 py-0.5 rounded-full text-primary/60">{type}</span>
                    ))}
                </div>
              </div>
              {item.isSignature && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-full ml-4 shrink-0">
                  Signature
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={onMenuClick} className="px-8 py-6 text-lg rounded-full">
            View Full Menu
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
