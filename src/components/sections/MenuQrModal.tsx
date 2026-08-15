import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, QrCode, Settings, RefreshCw, Layout, Check, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

interface MenuQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuQrModal({ isOpen, onClose }: MenuQrModalProps) {
  const { language } = useLanguage();
  const [tableNumber, setTableNumber] = useState<string>('Table 5');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [brandMessageEn, setBrandMessageEn] = useState<string>('Scan to View Our Live Artisanal Menu & Order');
  const [brandMessageBn, setBrandMessageBn] = useState<string>('আমাদের লাইভ মেনু দেখতে এবং অর্ডার করতে স্ক্যান করুন');
  const [themeColor, setThemeColor] = useState<string>('#2B1D16'); // Espresso
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [qrSize, setQrSize] = useState<number>(220);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  
  // Pre-fill current live URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Append #menu hash or similar query to guide direct open
      const url = `${window.location.origin}/?menu=true`;
      setQrUrl(url);
    }
  }, []);

  const themeOptions = [
    { name: 'Espresso', value: '#2B1D16', bg: 'bg-[#2B1D16]' },
    { name: 'Classic Charcoal', value: '#0d0b09', bg: 'bg-[#0d0b09]' },
    { name: 'Warm Amber', value: '#C5A06F', bg: 'bg-[#C5A06F]' },
    { name: 'Forest Moss', value: '#1E2D24', bg: 'bg-[#1E2D24]' },
  ];

  const tableOptions = [
    { labelEn: 'General Counter', labelBn: 'প্রধান কাউন্টার', value: 'Counter' },
    { labelEn: 'Table 1 (Window)', labelBn: 'টেবিল ১ (উইন্ডো)', value: 'Table 1' },
    { labelEn: 'Table 2 (Window)', labelBn: 'টেবিল ২ (উইন্ডো)', value: 'Table 2' },
    { labelEn: 'Table 3 (Patio)', labelBn: 'টেবিল ৩ (পেটিও)', value: 'Table 3' },
    { labelEn: 'Table 4 (Patio)', labelBn: 'টেবিল ৪ (পেটিও)', value: 'Table 4' },
    { labelEn: 'Table 5 (Lounge)', labelBn: 'টেবিল ৫ (লাউঞ্জ)', value: 'Table 5' },
    { labelEn: 'Table 6 (Shared)', labelBn: 'টেবিল ৬ (শেয়ার্ড)', value: 'Table 6' },
    { labelEn: 'Workspace Booth A', labelBn: 'ওয়ার্কস্পেস বুথ এ', value: 'Booth A' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('printable-qr-svg');
    if (!svgEl) return;

    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `colab-menu-${tableNumber.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        
        {/* Printable tent card styling rules compiled inline to isolate printer formatting */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-tent-card, #printable-tent-card * {
              visibility: visible;
            }
            #printable-tent-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px;
              background: #fff !important;
              color: #000 !important;
              border: 1px dashed #ccc !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-4xl bg-[#14100d] border border-primary/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-left max-h-[90vh] lg:max-h-[85vh]"
        >
          {/* Close trigger */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-all hover:rotate-90 cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Left Panel: QR Generator Control Settings */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 border-r border-primary/5 overflow-y-auto">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl text-accent">
                <QrCode size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-primary">
                  {language === 'bn' ? 'মেনু কিউআর কোড জেনারেটর' : 'Menu QR Code Generator'}
                </h3>
                <p className="text-[11px] text-primary/50 font-sans">
                  {language === 'bn' ? 'টেবিল টেন্ট ও প্রবেশদ্বারের জন্য প্রিন্ট-রেডি কিউআর কোড' : 'Printable QR standees for your dining tables & counter'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Table Position Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'টেবিল বা বসার স্থান' : 'Table / Counter Spot'}
                </label>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-primary/5 bg-[#0c0a08]">
                  <Layout size={14} className="text-accent shrink-0" />
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="bg-transparent text-xs text-primary outline-none w-full font-sans cursor-pointer border-none p-0 focus:ring-0"
                  >
                    {tableOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#14100d]">
                        {language === 'bn' ? opt.labelBn : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Target Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'স্ক্যান করার পর টার্গেট লিংক' : 'QR Scan Destination Link'}
                </label>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-primary/5 bg-[#0c0a08]">
                  <Settings size={14} className="text-primary/40 shrink-0" />
                  <input
                    type="url"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder="https://example.com/menu"
                    className="bg-transparent text-xs text-primary outline-none w-full font-sans border-none p-0 focus:ring-0"
                  />
                </div>
                <p className="text-[9px] text-primary/40 leading-normal">
                  {language === 'bn' 
                    ? 'আপনার কাস্টমাররা এটি স্ক্যান করলে সরাসরি আমাদের ডিজিটাল ক্যাফে মেনুতে চলে যাবেন।' 
                    : 'This is the web address that opens on customer smartphones when they scan the code.'}
                </p>
              </div>

              {/* Customize Brand Message (English) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'ব্র্যান্ড বার্তা (ইংরেজি)' : 'Brand Instruction Message (English)'}
                </label>
                <input
                  type="text"
                  value={brandMessageEn}
                  onChange={(e) => setBrandMessageEn(e.target.value)}
                  placeholder="e.g. Scan to View Menu"
                  className="w-full bg-[#0c0a08] text-xs text-primary border border-primary/5 rounded-xl px-3 py-2.5 focus:border-accent/40 outline-none font-sans"
                />
              </div>

              {/* Customize Brand Message (Bengali) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'ব্র্যান্ড বার্তা (বাংলা)' : 'Brand Instruction Message (Bengali)'}
                </label>
                <input
                  type="text"
                  value={brandMessageBn}
                  onChange={(e) => setBrandMessageBn(e.target.value)}
                  placeholder="যেমন: অর্ডার করতে স্ক্যান করুন"
                  className="w-full bg-[#0c0a08] text-xs text-primary border border-primary/5 rounded-xl px-3 py-2.5 focus:border-accent/40 outline-none font-sans"
                />
              </div>

              {/* Branding Theme Palette */}
              <div className="space-y-2">
                <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'রঙের থিম' : 'QR Accent Color Theme'}
                </label>
                <div className="flex gap-2.5">
                  {themeOptions.map((opt) => {
                    const isSelected = themeColor === opt.value;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setThemeColor(opt.value)}
                        className={`w-8 h-8 rounded-full ${opt.bg} flex items-center justify-center border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-accent scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={opt.name}
                      >
                        {isSelected && <Check size={14} className="text-white mix-blend-difference" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logo Overlay & Details Selector */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="rounded border-primary/10 text-accent focus:ring-accent bg-transparent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-primary/80 font-sans">
                    {language === 'bn' ? 'মাঝখানে কো-ল্যাব ব্র্যান্ড লোগো যুক্ত করুন' : 'Embed CoLab Minimalist Cup logo in center'}
                  </span>
                </label>
              </div>

              {/* Live Status Warning Details */}
              <div className="bg-[#1a1411] border border-accent/10 rounded-xl p-3.5 flex items-start gap-2.5">
                <Info size={14} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-primary/70 leading-relaxed font-sans">
                  {language === 'bn' 
                    ? 'কিউআর কোডটি ভেক্টর ভ্যালু ব্যবহার করে তৈরি হচ্ছে। এটি প্রিন্ট করলে বা বড় পোস্টারে ফুটিয়ে তুললেও একটুও ফাটবে না।' 
                    : 'Vector-quality QR generated on SVG canvas. Highly scalable and guarantees optimal scans on matte/glossy cardstock.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Print Layout Live Preview Sheet */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 bg-[#0c0a08] flex flex-col justify-between items-center overflow-y-auto border-t lg:border-t-0 border-primary/5">
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4">
              {language === 'bn' ? 'টেবিল স্ট্যান্ড প্রিন্ট প্রিভিউ' : 'Live Tent Card Print Preview'}
            </span>

            {/* Simulated Paper Tent Card Sheet */}
            <div 
              id="printable-tent-card"
              className="bg-white text-black p-6 rounded-2xl w-full max-w-[290px] shadow-2xl flex flex-col items-center justify-between border-2 border-dashed border-stone-200 relative aspect-[4/5]"
            >
              {/* Cutting & Fold Indicator Lines (Non-printing helpers) */}
              <div className="absolute top-0 inset-x-0 h-4 border-b border-dashed border-stone-300 no-print flex items-center justify-center">
                <span className="text-[7px] text-stone-400 uppercase font-mono tracking-widest bg-white px-2">✂️ Cut and fold top flap</span>
              </div>

              {/* Card Header */}
              <div className="text-center w-full mt-4">
                <div className="flex justify-center items-center gap-1.5 mb-1">
                  <span className="text-sm">☕</span>
                  <span className="font-serif text-sm font-bold tracking-widest text-[#2B1D16] uppercase">CoLab Café</span>
                </div>
                <div className="h-[2px] w-12 bg-[#2B1D16] mx-auto opacity-30 mb-2" />
                
                {/* Dynamically display Selected Spot */}
                <span className="inline-block bg-[#2B1D16]/5 text-[#2B1D16] border border-[#2B1D16]/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase font-mono">
                  {tableNumber}
                </span>
              </div>

              {/* QR Code Canvas container */}
              <div className="my-4 p-2 bg-white rounded-xl border border-stone-200 shadow-sm flex items-center justify-center relative">
                <QRCodeSVG
                  id="printable-qr-svg"
                  value={qrUrl || 'https://colab-kolkata.com'}
                  size={qrSize}
                  level="H" // High error correction to support logo overlay
                  fgColor={themeColor}
                  bgColor="#ffffff"
                  imageSettings={includeLogo ? {
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%232B1D16" stroke-width="2.5"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  } : undefined}
                />
              </div>

              {/* Instructions below QR code */}
              <div className="text-center max-w-[230px]">
                <p className="text-[10px] font-extrabold tracking-wide text-stone-800 leading-tight mb-1 font-sans">
                  {brandMessageEn}
                </p>
                <p className="text-[9px] text-stone-500 font-sans font-medium leading-tight">
                  {brandMessageBn}
                </p>
                
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-center gap-3 text-[7px] text-stone-400 font-mono">
                  <span>LAKE GARDENS</span>
                  <span>•</span>
                  <span>CALCUTTA COFFEE</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-[290px]">
              <Button
                onClick={handlePrint}
                className="flex-1 bg-accent hover:bg-accent/90 text-black text-xs font-bold uppercase tracking-widest h-10 rounded-xl cursor-pointer select-none flex items-center justify-center gap-1.5"
              >
                <Printer size={13} />
                {language === 'bn' ? 'প্রিন্ট কিউআর' : 'Print Card'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDownloadSVG}
                className="flex-1 border-primary/10 text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest h-10 rounded-xl cursor-pointer select-none flex items-center justify-center gap-1.5"
              >
                {downloadSuccess ? (
                  <Check size={13} className="text-emerald-400 animate-scale" />
                ) : (
                  <Download size={13} />
                )}
                {language === 'bn' ? 'ডাউনলোড' : 'Download'}
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
