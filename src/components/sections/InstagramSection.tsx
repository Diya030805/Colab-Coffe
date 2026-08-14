import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Instagram, ArrowUpRight, Heart, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

interface SocialPost {
  id: string;
  username: string;
  caption: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  relativeTime: string;
}

export function InstagramSection() {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Unconditional top-level Hook declarations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const smoothX = useSpring(xTranslation, { stiffness: 50, damping: 20 });
  
  // Hoisted scroll transform hook to remain unconditional across toggling render states
  const scrollOffsetTransform = useTransform(scrollYProgress, [0.3, 0.7], [30, -30]);

  const fallbacks: SocialPost[] = [
    {
      id: 'f1',
      username: 'calcutta_cuppa',
      caption: 'Finding peace at CoLab in Lake Gardens. The Cardamom Flat White is poetry in a cup. ☕✨ #kolkatacafe #colabcoffee',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
      likes: 124,
      commentsCount: 12,
      relativeTime: '2 hours ago'
    },
    {
      id: 'f2',
      username: 'jodhpur_park_coder',
      caption: 'Best workspace in South Kolkata. Low lighting, smooth lo-fi beats, and infinite refills of the Gondhoraj Cold Brew. 💻🍋 #remoteoffice',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      likes: 89,
      commentsCount: 6,
      relativeTime: '4 hours ago'
    },
    {
      id: 'f3',
      username: 'bong_barista',
      caption: 'Pour-over dripping slow, just like a Kolkata afternoon. Perfect spot to read or watch the rain outside. 🌧️📖',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600',
      likes: 156,
      commentsCount: 18,
      relativeTime: '1 day ago'
    },
    {
      id: 'f4',
      username: 'priya_chai_coffee',
      caption: 'The sourdough toast pairing here is artisanal magic. Combined with an espresso macchiato under warm amber lights. 🥐🤎',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600',
      likes: 213,
      commentsCount: 22,
      relativeTime: '2 days ago'
    }
  ];

  useEffect(() => {
    async function loadSocialFeed() {
      try {
        const response = await fetch('/api/social-feed');
        if (!response.ok) throw new Error('Failed to load live feed');
        const data = await response.json();
        if (data && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts(fallbacks);
        }
      } catch (err) {
        console.warn('Could not fetch live social feed, using fallbacks:', err);
        setPosts(fallbacks);
      } finally {
        setLoading(false);
      }
    }
    loadSocialFeed();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-base overflow-hidden relative border-t border-primary/5">
      {/* Dynamic Background Title */}
      <motion.div 
        style={{ x: smoothX, rotate: -3 }}
        className="absolute top-1/3 left-0 w-full text-[12vw] font-serif text-primary/5 whitespace-nowrap pointer-events-none select-none uppercase font-black"
      >
        Live Pulse Live Pulse
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 text-center mb-16 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {/* Live indicator badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-400 select-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase">
              {language === 'bn' ? 'লাইভ লাইট পালস' : 'LIVE FROM LAKE GARDENS'}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary mb-4 tracking-tight leading-tight">
            {language === 'bn' ? 'লেক গার্ডেন্স আড্ডা স্পন্দন' : 'Live from Lake Gardens'}
          </h2>
          <p className="text-accent font-bold tracking-[0.25em] text-[10px] uppercase">
            {language === 'bn' ? 'সরাসরি স্থানীয় কফি আড্ডা থেকে' : 'Latest social beats from the South Kolkata community'}
          </p>

          <div className="pt-4">
            <Button 
              variant="outline" 
              className="rounded-full px-7 h-12 flex items-center gap-2.5 mx-auto border-primary/20 hover:bg-primary hover:text-white transition-all duration-500 group overflow-hidden relative cursor-pointer"
              onClick={() => window.open('https://www.instagram.com/colabcoffeecalcutta/', '_blank')}
            >
              <Instagram size={16} className="group-hover:rotate-12 transition-transform duration-500" />
              <span className="font-bold tracking-widest text-[9px] uppercase">{t('insta.follow')}</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
            </Button>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex gap-6 md:gap-8 px-6 overflow-x-auto pb-16 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="shrink-0 w-[240px] md:w-[280px] aspect-[4/5] rounded-[1.5rem] bg-[#1a1511] border border-primary/5 animate-pulse flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border border-primary/10 border-t-accent animate-spin" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ x: scrollOffsetTransform }}
          aria-label="Community-driven social feed"
          className="flex gap-6 md:gap-8 px-6 overflow-x-auto pb-16 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center will-change-transform"
        >
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              variants={itemVariants}
              className="shrink-0 w-[240px] md:w-[280px] aspect-[4/5] rounded-[1.5rem] overflow-hidden snap-center relative group cursor-pointer shadow-[0_15px_30px_-10px_rgba(0,0,0,0.06)] bg-[#16120e] border border-primary/5"
            >
              {/* Dynamic Metadata Hover Overlay */}
              <div className="absolute inset-0 bg-[#0c0a08]/95 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-between p-6 backdrop-blur-md text-left rounded-[1.5rem] border border-primary/10">
                <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                  <span className="text-xs font-bold text-accent">@{post.username}</span>
                  <span className="text-[9px] text-primary/40 font-sans">{post.relativeTime}</span>
                </div>
                
                <p className="text-xs text-primary/80 leading-relaxed font-sans font-light line-clamp-5 my-auto">
                  {post.caption}
                </p>
                
                <div className="flex items-center justify-between border-t border-primary/5 pt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-primary/60 hover:text-red-400 transition-colors">
                      <Heart size={13} className="text-red-500 fill-red-500/20" />
                      <span className="text-[10px] font-mono">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary/60 hover:text-accent transition-colors">
                      <MessageSquare size={13} className="text-accent" />
                      <span className="text-[10px] font-mono">{post.commentsCount}</span>
                    </div>
                  </div>
                  <Instagram size={14} className="text-primary/40 group-hover:text-accent transition-colors animate-pulse" />
                </div>
              </div>

              {/* Underlying Image */}
              <motion.img 
                src={post.imageUrl} 
                alt={`Community post by @${post.username}`} 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
