import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const testimonialsData = {
  en: [
    {
      quote: "An intellectual sanctuary in the heart of Kolkata. Sitting here with their single-origin Pour Over feels like a modern tribute to the legendary Coffee House addas, but with precise temperature control and pristine quiet.",
      author: "Siddharth Ray",
      role: "Biographer & Regular Patron"
    },
    {
      quote: "The fusion of cold-brewed Darjeeling first flush and espresso is pure genius. They have captured the complex heritage of Bengal and translated it into a world-class cup.",
      author: "Ananya Sen",
      role: "Creative Director"
    },
    {
      quote: "Finally, a workspace in Kolkata that understands both acoustics and ergonomics. The sourdough toasts are exceptional, and the ambient lighting makes focused coding a beautiful ritual.",
      author: "Rohan Das",
      role: "Software Engineer & Nomad"
    }
  ],
  bn: [
    {
      quote: "কলকাতার বুকে এক বুদ্ধিবৃত্তিক আশ্রয়স্থল। এখানকার সিঙ্গেল-অরিজিন পোর ওভার নিয়ে বসা মানেই বিখ্যাত কফি হাউসের আড্ডার এক আধুনিক রূপ, তবে নিখুঁত তাপমাত্রার কফি আর অসম্ভব শান্ত পরিবেশ।",
      author: "সিদ্ধার্থ রায়",
      role: "জীবনীকার ও নিয়মিত অতিথি"
    },
    {
      quote: "দার্জিলিং ফার্স্ট ফ্লাশ কোল্ড-ব্রিউ আর এসপ্রেসোর ফিউশন এক অনবদ্য সৃষ্টি। বাংলার সমৃদ্ধ ঐতিহ্যকে ওরা কাপের মাঝে নিখুঁতভাবে ফুটিয়ে তুলেছে।",
      author: "অনন্যা সেন",
      role: "ক্রিয়েটিভ ডিরেক্টর"
    },
    {
      quote: "অবশেষে কলকাতায় এমন একটা ওয়ার্কস্পেস পেলাম যা শান্ত পরিবেশ আর বসার সঠিক আরাম দুটোই বোঝে। টকমাখা সোরডো টোস্টগুলো অসাধারণ, আর মৃদু আলোতে কোডিং করা এখানে একটা সুন্দর অভ্যাসে পরিণত হয়েছে।",
      author: "রোহন দাস",
      role: "সফ্টওয়্যার ইঞ্জিনিয়ার ও নোম্যাড"
    }
  ]
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96
  })
};

export function Testimonials() {
  const { language } = useLanguage();
  const list = testimonialsData[language] || testimonialsData.en;
  
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto play logic with clean reset
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 7500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [index, isAutoPlaying]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % list.length);
  };

  const handleDotClick = (targetIndex: number) => {
    if (targetIndex === index) return;
    setDirection(targetIndex > index ? 1 : -1);
    setIndex(targetIndex);
  };

  return (
    <section 
      id="testimonials"
      className="py-24 bg-gradient-to-b from-base to-accent/5 overflow-hidden relative border-t border-primary/5"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Elegantly Styled Subtle Decorative Elements */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-[0.03] text-primary pointer-events-none select-none">
        <Quote className="w-96 h-96" strokeWidth={1} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-3 block">
            {language === 'bn' ? 'আমাদের অতিথিদের কথা' : 'Patron Stories'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
            {language === 'bn' ? 'কোলাবের সাথে কাটানো কিছু মুহূর্ত' : 'Conversations & Connections'}
          </h2>
          <div className="w-12 h-[1px] bg-accent/40 mx-auto mt-4" />
        </div>

        {/* Direction Aware Carousel Stage */}
        <div className="relative min-h-[260px] md:min-h-[200px] flex items-center justify-center px-4 md:px-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 220, damping: 26 },
                opacity: { duration: 0.35 },
                scale: { duration: 0.35 }
              }}
              className="w-full flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <Quote className="text-accent/20 w-8 h-8 absolute -top-4 -left-6 rotate-180" />
                <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-primary/90 leading-relaxed italic max-w-2xl px-4">
                  {list[index].quote}
                </blockquote>
                <Quote className="text-accent/20 w-8 h-8 absolute -bottom-4 -right-6" />
              </div>

              <div className="mt-4 flex flex-col items-center">
                <p className="font-sans font-bold text-primary tracking-widest text-xs uppercase">
                  {list[index].author}
                </p>
                <p className="text-accent text-[11px] mt-1.5 uppercase tracking-wider font-medium">
                  {list[index].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-0 p-3 rounded-full border border-primary/5 bg-base/80 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group focus:outline-none focus:ring-1 focus:ring-accent/40 shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 p-3 rounded-full border border-primary/5 bg-base/80 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group focus:outline-none focus:ring-1 focus:ring-accent/40 shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-12">
          {list.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="relative p-2 focus:outline-none"
              aria-label={`Go to testimonial slide ${idx + 1}`}
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ease-out ${
                index === idx ? 'w-6 bg-accent' : 'w-1.5 bg-primary/20 hover:bg-primary/40'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
