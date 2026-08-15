import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, Mail, Phone, Users, CheckCircle2, Laptop, Award, MapPin, Sparkles, Check, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { trackEvent } from '../../lib/analytics';
import { cn } from '../../lib/utils';

interface WorkspaceZone {
  id: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  capacity: string;
  capacityBn: string;
  icon: string;
  color: string;
}

export interface CommunityEvent {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  date: string; // YYYY-MM-DD (August 2026 format)
  dayNumber: number; // 1 to 31
  timeEn: string;
  timeBn: string;
  instructorEn: string;
  instructorBn: string;
  capacity: number;
  rsvps: number;
  category: 'brewing' | 'poetry' | 'coding' | 'art';
}

const SEEDED_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    titleEn: 'Aeropress Brewing Masterclass',
    titleBn: 'অ্যারোপ্রেস ব্রিউইং মাস্টারক্লাস',
    descEn: 'Learn temperature control, extraction ratios, and grind size science with award-winning baristas.',
    descBn: 'পুরস্কারপ্রাপ্ত ব্যারিস্টাদের থেকে জলের তাপমাত্রা, এক্সট্রাকশন রেশিও এবং গ্রাইন্ড সাইজের বিজ্ঞান সরাসরি শিখুন।',
    date: '2026-08-16',
    dayNumber: 16,
    timeEn: '4:00 PM - 5:30 PM',
    timeBn: 'বিকাল ৪:০০ - ৫:৩০',
    instructorEn: 'Rohan Banerjee (Lead Barista)',
    instructorBn: 'রোহন ব্যানার্জী (প্রধান ব্যারিস্টা)',
    capacity: 12,
    rsvps: 9,
    category: 'brewing'
  },
  {
    id: 'e2',
    titleEn: 'South Kolkata Poetry Slam',
    titleBn: 'দক্ষিণ কলকাতা কবিতা উৎসব',
    descEn: 'An open-mic evening for local independent writers to share poetry, spoken word, and stories.',
    descBn: 'স্থানীয় উদীয়মান কবি ও লেখকদের নিজস্ব কবিতা এবং মন ছুঁয়ে যাওয়া গল্প পাঠের একটি জাদুকরী সন্ধ্যা।',
    date: '2026-08-19',
    dayNumber: 19,
    timeEn: '6:30 PM - 8:30 PM',
    timeBn: 'সন্ধ্যা ৬:৩০ - ৮:৩০',
    instructorEn: 'Srijita Sen (Author & Curator)',
    instructorBn: 'সৃজিতা সেন (লেখিকা ও সংগঠক)',
    capacity: 35,
    rsvps: 29,
    category: 'poetry'
  },
  {
    id: 'e3',
    titleEn: 'React Native & Expo Jam',
    titleBn: 'রিয়্যাক্ট নেটিভ ও এক্সপো জ্যাম',
    descEn: 'Build mobile web prototypes, talk API integration, and review codebase architectures over cold brews.',
    descBn: 'কফি খেতে খেতে মোবাইল ওয়েব প্রোটোটাইপ তৈরি করুন, এপিআই ইন্টিগ্রেশন ও আর্কিটেকচার নিয়ে আলোচনা করুন।',
    date: '2026-08-22',
    dayNumber: 22,
    timeEn: '11:00 AM - 1:30 PM',
    timeBn: 'সকাল ১১:০০ - দুপুর ১:৩০',
    instructorEn: 'Deepankar Ghosh (Tech Lead)',
    instructorBn: 'দীপঙ্কর ঘোষ (টেক লিড)',
    capacity: 15,
    rsvps: 11,
    category: 'coding'
  },
  {
    id: 'e4',
    titleEn: 'Terracotta Clay Pot Painting',
    titleBn: 'টেরাকোটা মাটির পাত্র পেইন্টিং',
    descEn: 'Design and paint traditional terracotta pots while sipping honey ginger tea. Clay pot included!',
    descBn: 'আদা-মধু চা উপভোগ করতে করতে ঐতিহ্যবাহী মাটির পাত্র ডিজাইন ও রং করুন। মাটির পাত্র ক্যাফে থেকে দেওয়া হবে!',
    date: '2026-08-25',
    dayNumber: 25,
    timeEn: '3:00 PM - 5:00 PM',
    timeBn: 'দুপুর ৩:০০ - বিকাল ৫:০০',
    instructorEn: 'Pritha Sen (Pottery Artist)',
    instructorBn: 'পৃথা সেন (মৃৎশিল্পী)',
    capacity: 10,
    rsvps: 6,
    category: 'art'
  },
  {
    id: 'e5',
    titleEn: 'Sourdough & Artisan Plating',
    titleBn: 'সায়রডো ও রুটি বেকিং কর্মশালা',
    descEn: 'Discover wild sourdough fermentation secrets and master gourmet presentation skills.',
    descBn: 'সহজ পদ্ধতিতে সায়রডো গেঁজানো ও বেকিং করার এবং আধুনিক প্লেটিং করার বিশেষ কৌশল শিখুন।',
    date: '2026-08-28',
    dayNumber: 28,
    timeEn: '12:00 PM - 2:00 PM',
    timeBn: 'দুপুর ১২:০০ - ২:০০',
    instructorEn: 'Chef Joyeeta Paul',
    instructorBn: 'শেফ জয়ীতা পাল',
    capacity: 8,
    rsvps: 8, // Sold out
    category: 'art'
  }
];

export function WorkspaceWidget({ onReserveClick }: { onReserveClick?: () => void } = {}) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'booking' | 'calendar'>('booking');
  
  // Workspace Booking state variables
  const [selectedZone, setSelectedZone] = useState<string>('window');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Workshop Events state variables (seeded with localStorage persistence)
  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem('colab_community_events');
    return saved ? JSON.parse(saved) : SEEDED_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('colab_community_events', JSON.stringify(events));
  }, [events]);

  const [selectedEventId, setSelectedEventId] = useState<string>('e1');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [userRsvps, setUserRsvps] = useState<string[]>(() => {
    const saved = localStorage.getItem('user_workshop_rsvps');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_workshop_rsvps', JSON.stringify(userRsvps));
  }, [userRsvps]);

  const zones: WorkspaceZone[] = [
    {
      id: 'window',
      nameEn: 'Window Bar Desk',
      nameBn: 'উইন্ডো বার ডেস্ক',
      descEn: 'Solo work desk facing South Kolkata streets with abundant natural light & soft foliage.',
      descBn: 'প্রাকৃতিক আলো ও সবুজের মাঝে দক্ষিণ কলকাতার রাস্তা পানে মুখ করা একক ডেস্ক।',
      capacity: '1 Co-worker',
      capacityBn: '১ জন',
      icon: '🌅',
      color: 'border-amber-500/30 hover:border-amber-500/80'
    },
    {
      id: 'patio',
      nameEn: 'Garden Patio',
      nameBn: 'বাগান পেটিও ডেস্ক',
      descEn: 'Open-air breezy tables surrounded by terracotta planters. Perfect for fresh focus.',
      descBn: 'টেরাকোটা টবে ঘেরা খোলা হাওয়া টেবিল। সতেজ মনযোগ ও গভীর চিন্তার জন্য সেরা।',
      capacity: 'Up to 2 Co-workers',
      capacityBn: '২ জন পর্যন্ত',
      icon: '🪴',
      color: 'border-emerald-500/30 hover:border-emerald-500/80'
    },
    {
      id: 'booth',
      nameEn: 'Quiet Corner Booth',
      nameBn: 'কোয়ায়েট কর্নার বুথ',
      descEn: 'Padded sound-insulated booths with dedicated multi-plug adapters & high-speed router access.',
      descBn: 'শব্দ-নিরোধক আরামদায়ক কুশন সিট, নিজস্ব চার্জার প্লাগ ও হাই স্পিড রাউটার সুবিধাসহ।',
      capacity: 'Up to 4 Co-workers',
      capacityBn: '৪ জন পর্যন্ত',
      icon: '🛋️',
      color: 'border-cyan-500/30 hover:border-cyan-500/80'
    },
    {
      id: 'team',
      nameEn: 'Shared Team Desk',
      nameBn: 'শেয়ার্ড টিম ডেস্ক',
      descEn: 'Large teak-wood table equipped with a dynamic rolling whiteboard & quick-cast smart TV.',
      descBn: 'স্মার্ট টিভি ও মুভেবল হোয়াইটবোর্ড সজ্জিত বড় সেগুন কাঠের দলগত টেবিল।',
      capacity: 'Up to 6 Co-workers',
      capacityBn: '৬ জন পর্যন্ত',
      icon: '👥',
      color: 'border-purple-500/30 hover:border-purple-500/80'
    }
  ];

  const timeSlots = [
    '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', 
    '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', 
    '06:30 PM', '07:30 PM', '08:30 PM'
  ];

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) {
      tempErrors.name = language === 'bn' ? 'দয়া করে আপনার নাম লিখুন' : 'Please enter your name';
    } else if (name.trim().length < 2) {
      tempErrors.name = language === 'bn' ? 'নামটি কমপক্ষে ২ অক্ষরের হতে হবে' : 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = language === 'bn' ? 'দয়া করে আপনার ইমেল লিখুন' : 'Please enter your email';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = language === 'bn' ? 'সঠিক ইমেল ঠিকানা লিখুন' : 'Please enter a valid email address';
    }

    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phone.trim()) {
      tempErrors.phone = language === 'bn' ? 'দয়া করে ফোন নম্বর লিখুন' : 'Please enter your phone number';
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      tempErrors.phone = language === 'bn' ? 'সঠিক ভারতীয় ফোন নম্বর লিখুন' : 'Please enter a valid 10-digit phone number';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    trackEvent('workspace_zone_select', { zoneId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    trackEvent('workspace_submit_attempt', { selectedZone, selectedTime });

    try {
      const zoneNameEn = zones.find(z => z.id === selectedZone)?.nameEn || 'Workspace Table';
      const requestPayload = {
        name,
        email,
        phone,
        date,
        time: selectedTime,
        guests,
        notes: `Workspace Reservation: ${zoneNameEn}`
      };

      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) throw new Error('Failed to record reservation');

      const generatedRef = `WORK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setBookingRef(generatedRef);
      setIsSuccess(true);
      trackEvent('workspace_booking_success', { reference: generatedRef });
    } catch (err) {
      console.error('Error reserving workspace table:', err);
      const generatedRef = `WORK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setBookingRef(generatedRef);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError('');

    if (!rsvpName.trim() || !rsvpEmail.trim()) {
      setRsvpError(language === 'bn' ? 'সবগুলি ঘর পূরণ করুন' : 'Please fill in all fields');
      return;
    }

    const selectedEvent = events.find(ev => ev.id === selectedEventId);
    if (!selectedEvent) return;

    if (userRsvps.includes(selectedEventId)) {
      setRsvpError(language === 'bn' ? 'আপনি ইতিমধ্যেই এই কর্মশালায় নাম নথিভুক্ত করেছেন।' : 'You have already booked a spot for this workshop.');
      return;
    }

    if (selectedEvent.rsvps >= selectedEvent.capacity) {
      setRsvpError(language === 'bn' ? 'দুঃখিত, এই কর্মশালার সমস্ত আসন পূরণ হয়ে গেছে।' : 'Sorry, this event is completely sold out.');
      return;
    }

    // Increment RSVPs in state
    setEvents(prev => prev.map(ev => {
      if (ev.id === selectedEventId) {
        return { ...ev, rsvps: ev.rsvps + 1 };
      }
      return ev;
    }));

    setUserRsvps(prev => [...prev, selectedEventId]);
    setRsvpSuccess(true);
    trackEvent('workshop_rsvp_success', { eventId: selectedEventId });

    // Clear inputs
    setRsvpName('');
    setRsvpEmail('');
  };

  const activeZone = zones.find(z => z.id === selectedZone)!;
  const currentEvent = events.find(ev => ev.id === selectedEventId) || events[0];

  // Calendar math properties for August 2026:
  // August 1st, 2026 is a Saturday (offset = 6 empty spaces on calendar grid starting Sunday)
  const augustDays = 31;
  const augustOffset = 6;
  const daysGrid = Array.from({ length: augustOffset + augustDays }, (_, i) => {
    if (i < augustOffset) return null;
    return i - augustOffset + 1;
  });

  return (
    <section id="workspace-booking" className="py-24 bg-[#0d0b09] relative overflow-hidden border-t border-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(197,160,111,0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-accent mb-4 select-none">
            <Laptop size={12} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              {language === 'bn' ? 'রিমোট ওয়ার্ক ও কর্মশালা হাব' : 'CO-WORKING & COMMUNITY HUB'}
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary mb-4">
            {language === 'bn' ? 'ডেস্ক বুকিং ও ক্রাফট ক্যালেন্ডার' : 'Work & Learn at CoLab'}
          </h2>
          <p className="text-primary/70 font-light font-sans text-sm md:text-base leading-relaxed">
            {language === 'bn' 
              ? 'কাজের জন্য শান্ত কো-ওয়ার্কিং স্পট বেছে নিন অথবা ক্যাফেইন ও ক্রিয়েটিভিটি ভরপুর আমাদের কফি এবং আর্ট ওয়ার্কশপে যোগ দিন।' 
              : 'Secure your dedicated co-working spot or join our highly curated specialty coffee and creative workshops in South Kolkata.'}
          </p>
        </div>

        {/* Universal Switcher Tab Bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-[#14100d] border border-primary/5 rounded-2xl">
            <button
              onClick={() => setActiveTab('booking')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer select-none",
                activeTab === 'booking'
                  ? "bg-accent text-black shadow-lg shadow-accent/15 font-extrabold"
                  : "text-primary/60 hover:text-primary"
              )}
            >
              <Laptop size={13} />
              {language === 'bn' ? 'ডেস্ক বুকিং' : 'Desk Booking'}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer select-none",
                activeTab === 'calendar'
                  ? "bg-accent text-black shadow-lg shadow-accent/15 font-extrabold"
                  : "text-primary/60 hover:text-primary"
              )}
            >
              <Calendar size={13} />
              {language === 'bn' ? 'কর্মশালা ক্যালেন্ডার' : 'Workshop Calendar'}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'booking' ? (
            <motion.div
              key="desk-booking-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-[#14100d] rounded-3xl border border-primary/5 p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left"
            >
              {/* Left Column: Visual Zone Selection */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary mb-4 flex items-center gap-2">
                    <span className="text-accent">1.</span>
                    {language === 'bn' ? 'কাজের জায়গা ও ডেস্ক বেছে নিন' : 'Select Workspace Vibe & Desk'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {zones.map((zone) => {
                      const isSelected = selectedZone === zone.id;
                      return (
                        <div
                          key={zone.id}
                          onClick={() => handleZoneSelect(zone.id)}
                          className={`cursor-pointer rounded-2xl p-5 border text-left transition-all duration-300 relative group flex flex-col justify-between min-h-[13rem] h-auto select-none pb-4 ${
                            isSelected 
                              ? 'bg-accent/10 border-accent shadow-[0_10px_20px_rgba(197,160,111,0.15)]' 
                              : 'bg-[#1a1511]/50 border-primary/5 ' + zone.color
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-3xl filter drop-shadow-md">{zone.icon}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-accent text-black' : 'bg-primary/5 text-primary/60'
                            }`}>
                              {language === 'bn' ? zone.capacityBn : zone.capacity}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-col gap-3">
                            <div>
                              <h4 className="text-sm font-semibold text-primary mb-1">
                                {language === 'bn' ? zone.nameBn : zone.nameEn}
                              </h4>
                              <p className="text-[11px] text-primary/60 line-clamp-2 leading-relaxed font-sans">
                                {language === 'bn' ? zone.descBn : zone.descEn}
                              </p>
                            </div>
                            
                            <Button 
                              size="sm"
                              variant="outline"
                              className="w-full text-[10px] h-8 rounded-lg border-accent/20 hover:border-accent hover:bg-accent hover:text-black font-semibold uppercase tracking-widest mt-1 cursor-pointer transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onReserveClick) {
                                  onReserveClick();
                                }
                              }}
                            >
                              {language === 'bn' ? 'টেবিল বুকিং' : 'Reserve a Table'}
                            </Button>
                          </div>

                          {isSelected && (
                            <div className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time Selections */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-medium text-primary flex items-center gap-2">
                    <span className="text-accent">2.</span>
                    {language === 'bn' ? 'তারিখ ও সময়সূচী' : 'Choose Date & Slot'}
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    {/* Date Input */}
                    <div className="flex-1 relative bg-[#1c1612] border border-primary/5 rounded-xl px-4 py-3 flex items-center gap-3">
                      <Calendar size={16} className="text-accent shrink-0" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-transparent text-primary text-xs outline-none w-full cursor-pointer select-none border-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>

                    {/* Info Text */}
                    <div className="flex-1 bg-accent/5 border border-accent/10 rounded-xl px-4 py-3 flex items-center gap-3 text-left">
                      <Award size={16} className="text-accent shrink-0 animate-pulse" />
                      <p className="text-[11px] text-primary/70 font-sans leading-normal">
                        {language === 'bn' 
                          ? 'প্রতিটি বুকিং সেশনে কফি ও কাজের সুবিধাসহ ৩ ঘণ্টা সময় বরাদ্দ পাবেন।' 
                          : 'Each reservation guarantees high-speed workspace access for up to 3 hours.'}
                      </p>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="pt-2">
                    <p className="text-primary/40 text-[10px] uppercase font-bold tracking-wider mb-2">
                      {language === 'bn' ? 'সহজলভ্য স্লটসমূহ' : 'Available Time Slots'}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent/20 hide-scrollbar justify-start">
                      {timeSlots.map((time) => {
                        const isTimeSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider font-sans select-none transition-all duration-300 cursor-pointer ${
                              isTimeSelected 
                                ? 'bg-accent text-black shadow-lg shadow-accent/20' 
                                : 'bg-[#1a1511] text-primary/60 border border-primary/5 hover:border-primary/20 hover:text-primary'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Reservation Details Form */}
              <div className="lg:col-span-5 bg-[#1a1411] rounded-2xl border border-primary/5 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="booking-form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-left h-full flex flex-col justify-between"
                    >
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-serif text-lg font-medium text-primary mb-1 flex items-center gap-2">
                            <span className="text-accent">3.</span>
                            {language === 'bn' ? 'যোগাযোগ বিবরণী' : 'Contact Details'}
                          </h3>
                          <p className="text-[11px] text-primary/50 font-sans mb-3">
                            {language === 'bn' 
                              ? 'আপনার বুকিং রেফারেন্স নিশ্চিত করার জন্য সঠিক তথ্য প্রদান করুন।' 
                              : 'Provide your details to receive the instant booking confirmation.'}
                          </p>
                        </div>

                        {/* Name input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                            {language === 'bn' ? 'পুরো নাম' : 'Full Name'}
                          </label>
                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-[#15100d] transition-colors ${
                            errors.name ? 'border-red-500/50 focus-within:border-red-500' : 'border-primary/5 focus-within:border-accent/40'
                          }`}>
                            <User size={14} className="text-primary/40 shrink-0" />
                            <input
                              type="text"
                              placeholder={language === 'bn' ? 'যেমন: সুদীপ্ত সেন' : 'e.g. Sudipto Sen'}
                              value={name}
                              onChange={(e) => {
                                  setName(e.target.value);
                                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                              }}
                              className="bg-transparent text-xs text-primary outline-none w-full font-sans border-none focus:ring-0 p-0"
                            />
                          </div>
                          {errors.name && <p className="text-[10px] text-red-400 font-sans">{errors.name}</p>}
                        </div>

                        {/* Email input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                            {language === 'bn' ? 'ইমেল ঠিকানা' : 'Email Address'}
                          </label>
                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-[#15100d] transition-colors ${
                            errors.email ? 'border-red-500/50 focus-within:border-red-500' : 'border-primary/5 focus-within:border-accent/40'
                          }`}>
                            <Mail size={14} className="text-primary/40 shrink-0" />
                            <input
                              type="email"
                              placeholder="sudipto@example.com"
                              value={email}
                              onChange={(e) => {
                                  setEmail(e.target.value);
                                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                              }}
                              className="bg-transparent text-xs text-primary outline-none w-full font-sans border-none focus:ring-0 p-0"
                            />
                          </div>
                          {errors.email && <p className="text-[10px] text-red-400 font-sans">{errors.email}</p>}
                        </div>

                        {/* Phone input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                            {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                          </label>
                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-[#15100d] transition-colors ${
                            errors.phone ? 'border-red-500/50 focus-within:border-red-500' : 'border-primary/5 focus-within:border-accent/40'
                          }`}>
                            <Phone size={14} className="text-primary/40 shrink-0" />
                            <input
                              type="tel"
                              placeholder={language === 'bn' ? '+৯১ ৯৮৭৬৫ ৪৩২১০' : '+91 98765 43210'}
                              value={phone}
                              onChange={(e) => {
                                  setPhone(e.target.value);
                                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                              }}
                              className="bg-transparent text-xs text-primary outline-none w-full font-sans border-none focus:ring-0 p-0"
                            />
                          </div>
                          {errors.phone && <p className="text-[10px] text-red-400 font-sans">{errors.phone}</p>}
                        </div>

                        {/* Guests select */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-primary/60 font-bold uppercase tracking-wider block">
                            {language === 'bn' ? 'আসন সংখ্যা' : 'Workspace Seats Needed'}
                          </label>
                          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-primary/5 bg-[#15100d]">
                            <Users size={14} className="text-primary/40 shrink-0" />
                            <select
                              value={guests}
                              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                              className="bg-transparent text-xs text-primary outline-none w-full font-sans cursor-pointer border-none p-0 focus:ring-0"
                            >
                              <option value="1" className="bg-[#1a1411]">1 Desk Space</option>
                              <option value="2" className="bg-[#1a1411]">2 Desk Spaces</option>
                              <option value="3" className="bg-[#1a1411]">3 Desk Spaces</option>
                              <option value="4" className="bg-[#1a1411]">4 Desk Spaces</option>
                              <option value="5" className="bg-[#1a1411]">5 Desk Spaces</option>
                              <option value="6" className="bg-[#1a1411]">6 Desk Spaces</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Summary / Submit */}
                      <div className="pt-6 border-t border-primary/5">
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-primary/40">
                            {language === 'bn' ? 'নির্বাচন:' : 'Selected Vibe:'}
                          </span>
                          <span className="text-accent font-semibold flex items-center gap-1.5">
                            <span className="text-sm">{activeZone.icon}</span>
                            {language === 'bn' ? activeZone.nameBn : activeZone.nameEn}
                          </span>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-11 text-xs font-bold uppercase tracking-widest bg-accent hover:bg-accent/90 text-black rounded-xl select-none flex items-center justify-center cursor-pointer"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              <span>{language === 'bn' ? 'সংরক্ষণ করা হচ্ছে...' : 'Confirming Workspace...'}</span>
                            </div>
                          ) : (
                            <span>{language === 'bn' ? 'ডেস্ক বুকিং নিশ্চিত করুন' : 'Confirm Spot'}</span>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="booking-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="flex flex-col items-center justify-center text-center h-full space-y-6 py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/5">
                        <CheckCircle2 size={32} />
                      </div>

                      <div className="space-y-2 max-w-sm">
                        <h4 className="font-serif text-2xl font-semibold text-primary">
                          {language === 'bn' ? 'আপনার কাজের স্পট রেডি!' : 'Spot Booked Successfully!'}
                        </h4>
                        <p className="text-xs text-primary/70 leading-relaxed font-sans">
                          {language === 'bn' 
                            ? `ধন্যবাদ ${name}! ${date} তারিখে ${selectedTime} টায় আপনার জন্য ${activeZone.icon} ${activeZone.nameBn} বুক করা হয়েছে।` 
                            : `Thanks ${name}! We have confirmed your reservation for a ${activeZone.nameEn} at ${selectedTime} on ${date}.`}
                        </p>
                      </div>

                      {/* Reference Ticket Card */}
                      <div className="bg-[#14100d] border border-accent/15 rounded-xl p-5 w-full text-left font-sans space-y-4">
                        <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                          <span className="text-[10px] text-primary/40 uppercase tracking-widest font-bold">Booking Ticket</span>
                          <span className="text-xs font-bold font-mono text-accent">{bookingRef}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase font-bold tracking-wider mb-0.5">Location</p>
                            <p className="text-primary font-medium text-[11px] flex items-center gap-1">
                              <MapPin size={10} className="text-accent" />
                              Lake Gardens
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase font-bold tracking-wider mb-0.5">Workspace</p>
                            <p className="text-primary font-medium text-[11px] flex items-center gap-1">
                              <span className="text-xs">{activeZone.icon}</span>
                              {language === 'bn' ? activeZone.nameBn : activeZone.nameEn}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase font-bold tracking-wider mb-0.5">Date</p>
                            <p className="text-primary font-mono text-[11px]">{date}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase font-bold tracking-wider mb-0.5">Time Slot</p>
                            <p className="text-primary font-mono text-[11px]">{selectedTime}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 w-full">
                        <Button
                          onClick={() => {
                            setIsSuccess(false);
                            setName('');
                            setEmail('');
                            setPhone('');
                          }}
                          className="w-full text-xs font-bold uppercase tracking-wider bg-transparent hover:bg-primary/5 text-accent border border-accent/20 rounded-xl py-2.5 transition-colors cursor-pointer"
                        >
                          {language === 'bn' ? 'আরেকটি ডেস্ক বুক করুন' : 'Book Another Desk'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workshop-calendar-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#14100d] rounded-3xl border border-primary/5 p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left"
            >
              {/* Interactive August 2026 Monthly Grid (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-serif text-lg font-medium text-primary flex items-center gap-2">
                      <span className="text-accent">August 2026</span>
                      <span className="text-xs text-primary/40 font-normal">({language === 'bn' ? 'আগস্ট ২০২৬' : 'Monthly View'})</span>
                    </h3>

                    <div className="flex gap-1">
                      <button disabled className="p-1.5 bg-[#1a1511] text-primary/20 border border-primary/5 rounded-lg cursor-not-allowed">
                        <ChevronLeft size={14} />
                      </button>
                      <button disabled className="p-1.5 bg-[#1a1511] text-primary/20 border border-primary/5 rounded-lg cursor-not-allowed">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Labels */}
                  <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <span key={day} className="text-[10px] font-bold text-primary/40 uppercase tracking-wider py-1 font-mono">
                        {language === 'bn' ? (
                          day === 'Sun' ? 'রবি' :
                          day === 'Mon' ? 'সোম' :
                          day === 'Tue' ? 'মঙ্গল' :
                          day === 'Wed' ? 'বুধ' :
                          day === 'Thu' ? 'বৃহ' :
                          day === 'Fri' ? 'শুক্র' : 'শনি'
                        ) : day}
                      </span>
                    ))}
                  </div>

                  {/* August 2026 Calendar Grid Cells */}
                  <div className="grid grid-cols-7 gap-2">
                    {daysGrid.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="aspect-square bg-transparent rounded-xl" />;
                      }

                      // Find if an event matches this day number in August 2026
                      const dayEvents = events.filter(ev => ev.dayNumber === day);
                      const hasEvent = dayEvents.length > 0;
                      const isSelected = hasEvent && dayEvents.some(ev => ev.id === selectedEventId);

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          onClick={() => {
                            if (hasEvent) {
                              setSelectedEventId(dayEvents[0].id);
                              setRsvpSuccess(false);
                              setRsvpError('');
                            }
                          }}
                          className={cn(
                            "aspect-square rounded-xl flex flex-col justify-between p-2 text-left relative transition-all duration-300 font-sans cursor-pointer select-none border group",
                            isSelected 
                              ? "bg-accent border-accent text-black font-extrabold"
                              : hasEvent
                                ? "bg-accent/10 border-accent/25 text-primary hover:bg-accent/20"
                                : "bg-[#1a1511]/40 border-primary/5 text-primary/30 hover:border-primary/10"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-mono font-bold",
                            isSelected ? "text-black" : hasEvent ? "text-accent" : "text-primary/40"
                          )}>
                            {day}
                          </span>

                          {hasEvent && (
                            <div className="flex gap-1 mt-1">
                              {dayEvents.map(ev => (
                                <span 
                                  key={ev.id} 
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isSelected 
                                      ? "bg-black" 
                                      : ev.category === 'brewing' ? "bg-amber-400" : ev.category === 'poetry' ? "bg-purple-400" : ev.category === 'coding' ? "bg-cyan-400" : "bg-emerald-400"
                                  )} 
                                />
                              ))}
                            </div>
                          )}

                          {hasEvent && !isSelected && (
                            <div className="absolute inset-0 bg-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Category Legends */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-primary/5 text-[10px] font-sans font-semibold text-primary/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{language === 'bn' ? 'কফি ব্রিউইং' : 'Coffee Brewing'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                    <span>{language === 'bn' ? 'কবিতা ও আবৃত্তি' : 'Poetry Slam'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{language === 'bn' ? 'কোডিং ও টেক' : 'Coding Jam'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{language === 'bn' ? 'চিত্রকর্ম ও ক্রাফট' : 'Art Workshops'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Workshop Details & RSVP Panel (5 cols) */}
              <div className="lg:col-span-5 bg-[#1a1411] rounded-2xl border border-primary/5 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="space-y-6">
                  {/* Category Pill Tag */}
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                      currentEvent.category === 'brewing' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      currentEvent.category === 'poetry' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      currentEvent.category === 'coding' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {language === 'bn' ? (
                        currentEvent.category === 'brewing' ? 'ব্রিউইং মাস্টার' :
                        currentEvent.category === 'poetry' ? 'কবিতা উৎসব' :
                        currentEvent.category === 'coding' ? 'টেক ও কোডিং' : 'আর্ট অ্যান্ড ক্রাফট'
                      ) : currentEvent.category.toUpperCase()}
                    </span>

                    {/* Spots tracker badge */}
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-lg font-mono",
                      currentEvent.rsvps >= currentEvent.capacity 
                        ? "bg-red-500/10 text-red-400 border border-red-500/10" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                    )}>
                      {currentEvent.rsvps >= currentEvent.capacity 
                        ? (language === 'bn' ? 'আসন সম্পূর্ণ' : 'SOLD OUT') 
                        : (language === 'bn' 
                            ? `আসন বাকি: ${currentEvent.capacity - currentEvent.rsvps}/${currentEvent.capacity}` 
                            : `Seats: ${currentEvent.capacity - currentEvent.rsvps} Left`)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 text-left">
                    <h4 className="font-serif text-xl md:text-2xl font-semibold text-primary leading-tight">
                      {language === 'bn' ? currentEvent.titleBn : currentEvent.titleEn}
                    </h4>
                    <p className="text-xs text-primary/70 font-sans leading-relaxed">
                      {language === 'bn' ? currentEvent.descBn : currentEvent.descEn}
                    </p>
                  </div>

                  {/* Detail list specs */}
                  <div className="bg-[#14100d] border border-primary/5 rounded-xl p-4 text-xs font-sans space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={13} className="text-accent shrink-0" />
                      <span className="text-primary/80 font-mono font-medium">
                        {language === 'bn' ? 'আগস্ট ' + currentEvent.dayNumber + ', ২০২৬' : `August ${currentEvent.dayNumber}, 2026`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock size={13} className="text-accent shrink-0" />
                      <span className="text-primary/80 font-mono">
                        {language === 'bn' ? currentEvent.timeBn : currentEvent.timeEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User size={13} className="text-accent shrink-0" />
                      <span className="text-primary/80 font-medium">
                        {language === 'bn' ? currentEvent.instructorBn : currentEvent.instructorEn}
                      </span>
                    </div>
                  </div>

                  {/* Interactive RSVP Form or Confirmation Box */}
                  <AnimatePresence mode="wait">
                    {rsvpSuccess || userRsvps.includes(currentEvent.id) ? (
                      <motion.div
                        key="rsvp-success-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-accent/5 border border-accent/25 rounded-xl p-4 text-center space-y-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 mx-auto flex items-center justify-center text-accent">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-accent font-sans">
                            {language === 'bn' ? 'আপনার আসন নিশ্চিত করা হয়েছে!' : 'Workshop Spot Confirmed!'}
                          </p>
                          <p className="text-[10px] text-primary/60 font-sans leading-normal">
                            {language === 'bn' 
                              ? 'আপনার ইমেলে আমন্ত্রণ টিকিট পাঠানো হয়েছে। কর্মশালা শুরু হওয়ার ১৫ মিনিট আগে অনুগ্রহ করে উপস্থিত থাকবেন।' 
                              : 'We have reserved your seat. Please arrive 15 minutes prior for cozy seating and pre-brew preparation.'}
                          </p>
                        </div>
                      </motion.div>
                    ) : currentEvent.rsvps >= currentEvent.capacity ? (
                      <motion.div
                        key="rsvp-soldout-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center"
                      >
                        <p className="text-xs font-bold text-red-400">
                          {language === 'bn' ? 'কর্মশালাটি সম্পূর্ণ পূর্ণ!' : 'Workshop is Fully Booked'}
                        </p>
                        <p className="text-[10px] text-primary/50 mt-1">
                          {language === 'bn' 
                            ? 'পরবর্তী কর্মশালার নোটিফিকেশন পেতে আমাদের ইন্সটাগ্রামে নজর রাখুন।' 
                            : 'Follow our Instagram for priority waiting lists and newly added schedules.'}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="rsvp-booking-form"
                        onSubmit={handleRsvpSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-[10px] text-accent font-extrabold uppercase tracking-wider block text-left">
                          {language === 'bn' ? 'কর্মশালায় নাম নথিভুক্ত করুন' : 'Join Workshop Workshop RSVP'}
                        </p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder={language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                            value={rsvpName}
                            onChange={(e) => setRsvpName(e.target.value)}
                            className="w-full bg-[#15100d] text-xs text-primary placeholder-primary/30 border border-primary/5 rounded-xl px-3 py-2.5 focus:border-accent/40 outline-none font-sans"
                            required
                          />
                          <input
                            type="email"
                            placeholder="yourname@example.com"
                            value={rsvpEmail}
                            onChange={(e) => setRsvpEmail(e.target.value)}
                            className="w-full bg-[#15100d] text-xs text-primary placeholder-primary/30 border border-primary/5 rounded-xl px-3 py-2.5 focus:border-accent/40 outline-none font-sans"
                            required
                          />
                        </div>

                        {rsvpError && (
                          <p className="text-[10px] text-red-400 font-sans font-bold text-left">{rsvpError}</p>
                        )}

                        <Button
                          type="submit"
                          className="w-full h-10 text-xs font-bold uppercase tracking-widest bg-accent hover:bg-accent/90 text-black rounded-xl flex items-center justify-center cursor-pointer font-sans"
                        >
                          <Bookmark size={11} className="mr-1 shrink-0" />
                          {language === 'bn' ? 'আসন বুক করুন' : 'Book Workshop Seat'}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
