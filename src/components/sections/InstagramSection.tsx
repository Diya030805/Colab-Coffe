import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

export function InstagramSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const posts = [
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600",
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const smoothX = useSpring(xTranslation, { stiffness: 50, damping: 20 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      clipPath: "inset(10% 10% 10% 10% round 3rem)"
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      clipPath: "inset(0% 0% 0% 0% round 3rem)",
      transition: { 
        duration: 1.5, 
        ease: [0.23, 1, 0.32, 1] 
      }
    }
  };

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-base overflow-hidden relative border-t border-primary/5">
      {/* Dynamic Background */}
      <motion.div 
        style={{ x: smoothX, rotate: -5 }}
        className="absolute top-1/2 left-0 w-full text-[12vw] font-serif text-primary/5 whitespace-nowrap pointer-events-none select-none uppercase font-black"
      >
        Social Journal Social Journal
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 text-center mb-20 md:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary mb-6 tracking-tight leading-tight">
            {t('insta.title')}
          </h2>
          <p className="text-accent font-bold tracking-[0.3em] text-[9px] uppercase mb-10">@colabcoffeecalcutta</p>
          <Button 
            variant="outline" 
            className="rounded-full px-7 h-12 flex items-center gap-2.5 mx-auto border-primary/20 hover:bg-primary hover:text-white transition-all duration-700 group overflow-hidden relative"
            onClick={() => window.open('https://www.instagram.com/colabcoffeecalcutta/', '_blank')}
          >
            <Instagram size={16} className="group-hover:rotate-12 transition-transform duration-500" />
            <span className="font-bold tracking-widest text-[9px] uppercase">{t('insta.follow')}</span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
          </Button>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ x: useTransform(scrollYProgress, [0.3, 0.7], [30, -30]) }}
        aria-label="Instagram feed from @colabcoffeecalcutta"
        className="flex gap-6 md:gap-8 px-6 overflow-x-auto pb-16 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center will-change-transform"
      >
        {posts.map((url, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            role="img"
            aria-label={`Instagram post image ${i + 1}`}
            className="shrink-0 w-[240px] md:w-[280px] aspect-[4/5] rounded-[1.5rem] overflow-hidden snap-center relative group cursor-pointer shadow-[0_15px_30px_-10px_rgba(0,0,0,0.06)]"
          >
            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10 flex flex-col items-center justify-center backdrop-blur-md">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-700 delay-100 shadow-2xl"
              >
                <Instagram className="text-primary w-7 h-7" />
              </motion.div>
              <p className="text-white text-[8px] font-bold tracking-[0.2em] uppercase mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                View on Instagram
              </p>
            </div>
            <motion.img 
              src={url} 
              alt="Instagram post" 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
              className="w-full h-full object-cover" 
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
