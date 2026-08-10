import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The turmeric latte here is life-changing. A perfect balance of spices in an atmosphere that's both productive and peaceful.",
    author: "Sarah Jenkins",
    role: "Regular Patron"
  },
  {
    quote: "Best workspace in the city. The coffee is exceptional, but it's the attention to detail and the serene vibe that keeps me coming back.",
    author: "David Chen",
    role: "Digital Nomad"
  },
  {
    quote: "A true hidden gem. The Diavolo pizza is a must-try. Everything about CoLab screams quality and craftsmanship.",
    author: "Elena Rodriguez",
    role: "Food Critic"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section 
      className="py-24 bg-primary/5 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Quote className="mx-auto mb-10 text-accent opacity-40 w-12 h-12" strokeWidth={1} />
        
        <div className="relative min-h-[200px] md:min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary leading-tight italic">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              
              <div className="mt-8">
                <p className="font-sans font-semibold text-primary uppercase tracking-widest text-sm">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-primary/50 text-xs mt-1 uppercase tracking-wider">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                currentIndex === idx ? 'w-8 bg-accent' : 'w-2 bg-primary/20 hover:bg-primary/40'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
