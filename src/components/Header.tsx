"use client";

import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Globe, Sun, Moon, CalendarCheck } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onReserveClick: () => void;
  onViewReservedClick: () => void;
  onOrderClick: () => void;
  onMenuClick: () => void;
}

export function Header({ onReserveClick, onViewReservedClick, onOrderClick, onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '#home', isMenu: false },
    { label: t('nav.menu'), href: '#menu', isMenu: true },
    { label: t('nav.about'), href: '#about', isMenu: false },
    { label: t('nav.visit'), href: '#visit', isMenu: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  return (
    <header 
      role="banner"
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-base/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.a 
            href="#home" 
            aria-label="CoLab Coffee Calcutta Home" 
            className="font-serif text-2xl font-bold tracking-tighter text-primary"
            variants={itemVariants}
          >
            CoLab<span className="italic font-normal">.</span>
          </motion.a>
          
          {/* Desktop Nav */}
          <nav aria-label="Desktop navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <motion.div key={link.label} variants={itemVariants}>
                {link.isMenu ? (
                  <button 
                    onClick={onMenuClick}
                    className="text-[12px] font-semibold tracking-[0.05em] uppercase text-primary/70 hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a 
                    href={link.href}
                    className="text-[12px] font-semibold tracking-[0.05em] uppercase text-primary/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>
        </motion.div>

        <motion.div 
          className="hidden md:flex items-center gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.button 
            variants={itemVariants}
            onClick={toggleTheme} 
            className="flex items-center justify-center text-primary/70 hover:text-primary transition-colors bg-primary/5 w-8 h-8 rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
          <motion.button 
            variants={itemVariants}
            onClick={toggleLanguage} 
            aria-label={`Switch language to ${language === 'en' ? 'Bengali' : 'English'}`}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary/70 hover:text-primary transition-colors bg-primary/5 px-3 py-1.5 rounded-full"
          >
            <Globe size={14} />
            {language === 'en' ? 'BN' : 'EN'}
          </motion.button>
          <motion.button 
            variants={itemVariants}
            onClick={onViewReservedClick}
            aria-label="View your active reservations"
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-accent hover:text-accent/80 transition-colors bg-accent/5 px-3 py-1.5 rounded-full border border-accent/20"
          >
            <CalendarCheck size={14} />
            Reserved
          </motion.button>
          <motion.div variants={itemVariants}>
            <Button variant="outline" onClick={onReserveClick}>{t('btn.reserve')}</Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button onClick={onOrderClick}>{t('btn.order')}</Button>
          </motion.div>
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="flex items-center justify-center text-primary/70 bg-primary/5 w-7 h-7 rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          </button>
          <button 
            onClick={toggleLanguage} 
            aria-label={`Switch language to ${language === 'en' ? 'Bengali' : 'English'}`}
            className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-primary/70 bg-primary/5 px-2 py-1 rounded-full"
          >
            <Globe size={12} />
            {language === 'en' ? 'BN' : 'EN'}
          </button>
          <button 
            className="text-primary p-2 -mr-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-base border-t border-primary/10 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {navLinks.map(link => (
            link.isMenu ? (
              <button 
                key={link.label} 
                onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
                className="text-lg font-medium text-primary py-2 text-left"
              >
                {link.label}
              </button>
            ) : (
              <a 
                key={link.label} 
                href={link.href}
                className="text-lg font-medium text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          ))}
          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-primary/10">
            <Button 
              variant="outline" 
              className="w-full border-accent text-accent hover:bg-accent/5" 
              onClick={() => {
                setMobileMenuOpen(false);
                onViewReservedClick();
              }}
            >
              <CalendarCheck size={18} className="mr-2" />
              Reserved
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
              setMobileMenuOpen(false);
              onReserveClick();
            }}>{t('btn.reserve')}</Button>
            <Button className="w-full" onClick={() => { onOrderClick(); setMobileMenuOpen(false); }}>{t('btn.order')}</Button>
          </div>
        </div>
      )}
    </header>
  );
}
