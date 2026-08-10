"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Mail, Calendar, Users, Phone, Clock, BellRing, Bell, X, Search, QrCode, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from './ui/button';
import { FloatingLabelInput } from './ui/FloatingLabelInput';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(?:\+91|0)?[6-9]\d{9}$/, 'Invalid phone number'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.preprocess((val) => parseInt(String(val)), z.number().min(1, 'Must be at least 1 guest').max(20, 'Max 20 guests')),
});

function formatGoogleCalendarDates(dateStr: string, timeStr: string): { startISO: string; endISO: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const start = new Date(year, month - 1, day, hour, minute, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const startISO = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endISO = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return { startISO, endISO };
}

export function ReservationModal({ isOpen = true, onClose, initialStep = 'form' }: { isOpen?: boolean; onClose: () => void; initialStep?: 'active' | 'form' }) {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [step, setStep] = useState<'form' | 'success' | 'details' | 'active' | 'no-active' | 'error'>(initialStep);
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [assignedTable, setAssignedTable] = useState('');
  const { t } = useLanguage();

  const [activeReservation, setActiveReservation] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(initialStep); // Ensure step is reset to initial requested step whenever modal opens
      
      try {
        const saved = localStorage.getItem('active_reservation');
        if (saved) {
          const data = JSON.parse(saved);
          setActiveReservation(data);
          if (initialStep === 'active') {
            setFormData(data.formData);
            setRefNumber(data.refNumber);
            setAssignedTable(data.assignedTable);
            setStep('active');
          }
        } else if (initialStep === 'active') {
          setStep('no-active');
        }
      } catch (err) {
        console.error("Failed to load active reservation:", err);
      }
    } else if (mounted) {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      if (mounted) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, initialStep, mounted]);

  const getTableAssignment = (ref: string) => {
    const tables = [
      "Table 04 — Window Side Lounge",
      "Table 02 — Cozy Corner",
      "Table 07 — Bar Counter",
      "Table 01 — Garden View",
      "Table 09 — Quiet Zone",
      "Table 05 — Center Stage"
    ];
    const index = ref.charCodeAt(0) % tables.length;
    return tables[index];
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1
  });

  useEffect(() => {
    if (mounted && !formData.date) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [mounted]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    generateSlots(formData.date);
  }, [formData.date]);

  const generateSlots = (dateString: string) => {
    const slots = [];
    const openHour = 10;
    const closeHour = 21; 
    for (let h = openHour; h <= closeHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setAvailableSlots(slots);
    if (slots.length > 0 && !slots.includes(formData.time)) {
      setFormData(prev => ({ ...prev, time: slots[0] }));
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name' && (value.length < 2 || !/^[a-zA-Z\s]+$/.test(value))) error = t('reserve.errorName');
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
    if (name === 'phone' && !/^(?:\+91|0)?[6-9]\d{9}$/.test(value)) error = t('reserve.errorPhone');
    if (name === 'date' && !value) error = t('reserve.errorDate');
    if (name === 'time' && !value) error = t('reserve.errorTime');
    if (name === 'guests' && (parseInt(value) < 1 || parseInt(value) > 20)) error = 'Please enter a valid number of guests (1-20)';
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'guests' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = reservationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit reservation');
      const dbRecord = result.data;
      setStep('success');
      const generatedRef = `CLB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const { startISO, endISO } = formatGoogleCalendarDates(formData.date, formData.time);
      setCalendarUrl(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Table+Reservation+-+CoLab+Coffee+Calcutta&dates=${startISO}/${endISO}&details=Hi+${formData.name},+your+table+reservation+is+confirmed!+Guests:+${formData.guests}.+Phone:+${formData.phone}&location=CoLab+Coffee,+Kolkata,+India`);
      setRefNumber(generatedRef);
      const table = getTableAssignment(generatedRef);
      setAssignedTable(table);
      const reservationData = { id: dbRecord?.id, refNumber: generatedRef, assignedTable: table, formData, status: 'Confirmed' };
      localStorage.setItem('active_reservation', JSON.stringify(reservationData));
      setActiveReservation(reservationData);
      toast.success(t('reserve.booked'), {
        description: `${new Date(formData.date).toLocaleDateString()} at ${formData.time} — Ref: ${generatedRef}`,
        duration: 5000,
      });
      trackEvent('reserve_success', { guests: formData.guests });
    } catch (error: any) {
      setStep('error');
      toast.error(t('reserve.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (hasError) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md opacity-100">
        <div className="bg-base p-8 rounded-3xl max-w-md w-full text-center space-y-6 border border-white/10 shadow-2xl scale-100">
          <h2 className="font-serif text-2xl text-primary">Connection Interrupted</h2>
          <p className="text-primary/60 text-sm">The reservation system encountered a synchronization error. Please refresh the page or try again.</p>
          <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl">
            Refresh Page
          </Button>
          <button onClick={onClose} className="text-primary/40 text-xs uppercase font-bold tracking-widest hover:text-primary transition-colors">
            Close Modal
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-black/60 backdrop-blur-[8px]"
        style={{ opacity: 1, visibility: 'visible' }}
      >
        <div 
          onClick={onClose}
          className="absolute inset-0"
        />
        
        <div 
          className="relative bg-base rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
          style={{ opacity: 1, transform: 'scale(1)', visibility: 'visible' }}
        >
              {/* Header */}
              <div className="relative p-8 pb-4 flex justify-between items-start z-20">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">CoLab Coffee Calcutta</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary">
                    {step === 'form' ? 'Reserve a Table' : 
                     step === 'success' ? 'Confirmed!' : 
                     step === 'active' ? 'Active Booking' : 
                     'Reservation'}
                  </h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-3 bg-primary/5 hover:bg-primary/10 rounded-full transition-all group"
                >
                  <X size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
                </button>
              </div>
              
              <div className="overflow-y-auto px-8 pb-10 scroll-smooth custom-scrollbar relative z-10">
                  {step === 'form' && (
                    <form 
                      onSubmit={handleSubmit} 
                      className="space-y-6 opacity-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingLabelInput
                          label={t('reserve.name')}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.name}
                          required
                        />
                        <FloatingLabelInput
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.email}
                          required
                        />
                      </div>
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingLabelInput
                          label={t('reserve.phone')}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.phone}
                          required
                        />
                        <FloatingLabelInput
                          label="Party Size"
                          type="number"
                          name="guests"
                          min="1"
                          max="20"
                          value={formData.guests}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          icon={<Users size={16} />}
                          error={errors.guests}
                          required
                        />
                      </div>
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingLabelInput
                          label={t('reserve.date')}
                          type="date"
                          name="date"
                          min={mounted ? new Date().toISOString().split('T')[0] : ''}
                          value={formData.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          icon={<Calendar size={16} />}
                          error={errors.date}
                          required
                        />
                        <div className="space-y-1">
                          <div className="relative group">
                            <select 
                              name="time" 
                              value={formData.time} 
                              onChange={handleChange} 
                              onBlur={handleBlur} 
                              className="w-full bg-primary/5 border-none rounded-2xl px-5 pt-7 pb-3 focus:ring-2 focus:ring-accent transition-all text-sm appearance-none cursor-pointer outline-none peer" 
                              required
                            >
                              {availableSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                            <label
                              className={cn(
                                "absolute left-5 transition-all duration-300 pointer-events-none text-[10px] font-bold uppercase tracking-[0.15em] text-accent top-2"
                              )}
                            >
                              {t('reserve.time')}
                            </label>
                            <Clock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent pointer-events-none" />
                          </div>
                          {errors.time && <p className="text-accent text-[10px] uppercase font-bold ml-1">{errors.time}</p>}
                        </div>
                      </div>
  
                      <Button type="submit" className="w-full h-16 text-lg font-serif rounded-2xl shadow-xl shadow-accent/20 group" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                          <span className="flex items-center gap-2">
                            {t('reserve.confirm')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                      
                      <p className="text-[10px] text-center text-primary/40 leading-relaxed max-w-[280px] mx-auto">
                        By confirming, you agree to our reservation policy. We hold tables for 15 minutes past your booking time.
                      </p>
                    </form>
                  )}
  
                  {step === 'success' && (
                    <div 
                      className="text-center space-y-8 py-6 opacity-100"
                    >
                      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                        <CheckCircle size={48} />
                      </div>
                      <div>
                        <h4 className="text-3xl font-serif text-primary mb-2">Table Reserved!</h4>
                        <p className="text-primary/60">Your unique reference: <span className="font-mono font-bold text-accent tracking-widest">{refNumber}</span></p>
                      </div>
                      
                      <div className="bg-primary/5 rounded-[2rem] p-8 text-left space-y-4 border border-primary/5">
                         <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                           <span className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-bold">Assigned Space</span>
                           <span className="text-sm font-medium text-accent">{assignedTable}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                           <span className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-bold">Schedule</span>
                           <span className="text-sm font-medium">{new Date(formData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} @ {formData.time}</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-bold">Party Details</span>
                           <span className="text-sm font-medium">{formData.guests} Guests — {formData.name}</span>
                         </div>
                      </div>
  
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => window.open(calendarUrl, '_blank')} className="h-14 rounded-2xl bg-base border-primary/10">
                          <Calendar size={18} className="mr-2" /> Add to Calendar
                        </Button>
                        <Button onClick={onClose} className="h-14 rounded-2xl shadow-lg">
                          {t('reserve.done')}
                        </Button>
                      </div>
                    </div>
                  )}
  
                  {step === 'active' && (
                    <div 
                      className="space-y-8 py-6 opacity-100"
                    >
                      <div className="bg-accent/5 p-10 rounded-[2.5rem] border border-accent/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
                          <QrCode size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Upcoming Reservation</span>
                        </div>
                        <h4 className="text-3xl font-serif text-primary mb-2">{formData.name}</h4>
                        <p className="text-lg text-primary/70 mb-8">{new Date(formData.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} <span className="text-accent">at {formData.time}</span></p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-accent/10">
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase tracking-widest mb-1">Space</p>
                            <p className="font-medium text-sm">{assignedTable}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-primary/40 uppercase tracking-widest mb-1">Reference</p>
                            <p className="font-mono font-bold text-sm tracking-tighter">{refNumber}</p>
                          </div>
                        </div>
                      </div>
  
                      <div className="flex flex-col gap-3">
                        <Button 
                          variant="outline" 
                          className="h-14 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this reservation?")) {
                              localStorage.removeItem('active_reservation');
                              onClose();
                              toast.success("Reservation cancelled.");
                            }
                          }}
                        >
                          Cancel Reservation
                        </Button>
                        <Button onClick={onClose} variant="ghost" className="h-14 rounded-2xl text-primary/40 hover:text-primary transition-colors">
                          Close Details
                        </Button>
                      </div>
                    </div>
                  )}
  
                  {step === 'error' && (
                    <div 
                      className="text-center space-y-8 py-10 opacity-100"
                    >
                      <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <X size={40} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-serif text-primary">Something went wrong</h4>
                        <p className="text-sm text-primary/60">{t('reserve.errorMsg')}</p>
                      </div>
                      <Button onClick={() => setStep('form')} className="w-full h-14 rounded-2xl">
                        Try Again
                      </Button>
                    </div>
                  )}
              </div>
              
              {/* Ambient Background Gradient for the Modal */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
            </div>
          </div>
    );
  } catch (error) {
    console.error("Critical rendering error in ReservationModal:", error);
    setHasError(true);
    return null;
  }
}
