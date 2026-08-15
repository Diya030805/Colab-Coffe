import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Coffee, User, Flame, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { trackEvent } from '../lib/analytics';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  textEn: string;
  textBn: string;
  timestamp: string;
}

const ROAST_QUESTIONS = [
  {
    id: 'q1',
    labelEn: 'Araku Medium-Dark Roast',
    labelBn: 'আরাকু মিডিয়াম-ডার্ক রোস্ট',
    textEn: 'Tell me about the Araku Valley Medium-Dark Roast beans.',
    textBn: 'আরাকু ভ্যালি মিডিয়াম-ডার্ক রোস্ট কফি বিন সম্পর্কে বলুন।'
  },
  {
    id: 'q2',
    labelEn: 'Baba Budangiri Roast',
    labelBn: 'বাবা বুদানগিরি রোস্ট',
    textEn: 'Tell me about the Baba Budangiri Medium Roast.',
    textBn: 'বাবা বুদানগিরি মিডিয়াম রোস্ট কফি সম্পর্কে বিস্তারিত বলুন।'
  },
  {
    id: 'q3',
    labelEn: 'Ethiopian Floral Roast',
    labelBn: 'ইথিওপিয়ান ফ্লোরাল রোস্ট',
    textEn: 'What notes are in the Ethiopian AeroPress roast?',
    textBn: 'ইথিওপিয়ান অ্যারোপ্রেস রোস্টে কী কী ফ্লেভার নোট আছে?'
  },
  {
    id: 'q4',
    labelEn: 'Which roast is sweetest?',
    labelBn: 'কোন রোস্টটি সবচেয়ে মিষ্টি?',
    textEn: 'Which roast is the sweetest or has the least bitterness?',
    textBn: 'কোন রোস্টে তিতকুটে ভাব সবচেয়ে কম এবং মিষ্টি স্বাদ বেশি?'
  }
];

const AGENT_REPLIES = [
  {
    keywords: ['araku', 'আরাকু'],
    replyEn: 'Our Araku Valley Medium-Dark Roast originates from organic shade-grown estates in Andhra Pradesh. It has a heavy, syrup-like body with delicious notes of rich dark chocolate, toasted hazelnut, and a sweet caramelized honey finish. It is phenomenal as an Espresso or Espresso-macchiato!',
    replyBn: 'আমাদের আরাকু ভ্যালি মিডিয়াম-ডার্ক রোস্ট অন্ধ্রপ্রদেশের প্রত্যন্ত পাহাড়ি জৈব উপায়ে ছায়ায় চাষ করা কফি এস্টেট থেকে সংগৃহীত। এটি গাঢ় ও ঘন টেক্সচারের হয় এবং এতে ডার্ক চকলেট, টোস্টেড হ্যাজেলনাট এবং ক্যারামেল মধুর মিষ্টি ফিনিশ পাওয়া যায়। এটি এসপ্রেসো হিসেবে অসাধারণ জমবে!'
  },
  {
    keywords: ['baba', 'budangiri', 'বাবা', 'বুদানগিরি'],
    replyEn: 'The Baba Budangiri Roast is our classic single-origin medium roast sourced from the birthplace of Indian coffee in Karnataka. Sown at 4,200ft, it yields subtle spiced undertones, hints of roasted cardamom, a smooth velvety texture, and balanced acidity. Ideal for South Indian Filter or Pour-Over.',
    replyBn: 'বাবা বুদানগিরি রোস্ট আমাদের ভারতের কর্ণাটক রাজ্যের ঐতিহাসিক পর্বতমালা (যেখানে প্রথম ভারতীয় কফি রোপণ করা হয়েছিল) থেকে সংগৃহীত। ৪,২০০ ফুট উচ্চতায় চাষ হওয়া এই কফিতে এলাচের মশলাদার সুবাস, মখমলের মতো মসৃণ টেক্সচার এবং ভারসাম্যপূর্ণ অ্যাসিডিটি রয়েছে। ফিল্টার কফি বা পোর-ওভারের জন্য এটি সেরা।'
  },
  {
    keywords: ['ethiopian', 'aeropress', 'ইথিওপিয়ান', 'ফ্লোরাল'],
    replyEn: 'The Ethiopian roast is our light-to-medium roasted Sidama heirloom bean. Prepared with precision AeroPress, it releases incredible floral jasmine aroma, bright citrusy acidity, and juicy blueberry notes. It is exceptionally clean and perfect for coffee purists who dislike milk additions.',
    replyBn: 'ইথিওপিয়ান রোস্টটি আমাদের লাইট-টু-মিডিয়াম রোস্ট করা সিদামা হেয়ারলুম বিন। নিখুঁত অ্যারোপ্রেস পদ্ধতিতে তৈরি এই কফিতে জুঁই ফুলের মিষ্টি সুবাস, সতেজ লেবুজাতীয় অ্যাসিডিটি এবং ব্লুবেরির সুস্বাদু ফ্লেভার পাওয়া যায়। যারা কফিতে দুধ পছন্দ করেন না, তাদের জন্য এটি চমৎকার।'
  },
  {
    keywords: ['sweet', 'bitter', 'মিষ্টি', 'তিতকুটে'],
    replyEn: 'If you prefer a sweeter, smoother profile with minimal bitterness, we highly recommend our "Golden Cortado" made with the Araku Honey-sun-dried roast. The natural processing method allows the coffee cherry sugars to dry into the seed, imparting a natural honeyed sweetness that pairs brilliantly with textured whole milk.',
    replyBn: 'আপনি যদি কম তিতকুটে ও তুলনামূলক মিষ্টি ও মসৃণ কফি পছন্দ করেন, তবে আমরা আমাদের "গোল্ডেন কর্টাডো" নেওয়ার সুপারিশ করব। এটি আরাকু ভ্যালি হানিক্রাফট বিন ব্যবহার করে তৈরি করা হয়। কফির চেরি ফলটি প্রাকৃতিকভাবে রোদ খাইয়ে শুকানোয় এটিতে চমৎকার মিষ্টি ফ্লেভার পাওয়া যায় যা দুধের সাথে দারুণ মেলে।'
  },
  {
    keywords: ['roast', 'profiles', 'পদ্ধতি', 'ধরণ'],
    replyEn: 'We source and roast micro-lots ourselves! We offer: 1) Light-Medium floral single origin (best for AeroPress & pour-overs), 2) Balanced Medium estate-grown (perfect for French press & filter), and 3) Dark Espresso roasts for premium espresso extractions.',
    replyBn: 'আমরা নিজস্ব তত্ত্বাবধানে বাছাই করা কফি রোস্ট করি! আমাদের রয়েছে: ১) লাইট-মিডিয়াম ফ্লোরাল কফি বিন (অ্যারোপ্রেসের জন্য উপযুক্ত), ২) ব্যালেন্সড মিডিয়াম এস্টেট বিন (ফ্রেঞ্চ প্রেস ও ফিল্টারের জন্য দারুণ), এবং ৩) ডার্ক এসপ্রেসো রোস্ট (নিখুঁত এসপ্রেসো শটের জন্য)।'
  }
];

export function LiveChatBubble() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat logs on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('colab_roast_chat_history');
    if (savedLogs) {
      setMessages(JSON.parse(savedLogs));
      setHasUnread(false);
    } else {
      // Seed first greeting message
      const initialGreeting: ChatMessage = {
        id: 'msg-init',
        sender: 'agent',
        textEn: 'Hello there! 👋 I am Sudipto, your CoLab Roast Advisor. Ask me anything about our single-origin estates, light/medium floral notes, or how we brew our coffee today!',
        textBn: 'নমস্কার! 👋 আমি সুদীপ্ত, আপনার কো-ল্যাব রোস্ট অ্যাডভাইজর। আমাদের বিভিন্ন কফি এস্টেট, লাইট/মিডিয়াম ফ্লেভার নোট অথবা আজকের ব্রিউইং পদ্ধতি সম্পর্কে যেকোনো প্রশ্ন আমাকে করতে পারেন!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
    }
  }, []);

  // Save logs on changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('colab_roast_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      textEn: textToSend,
      textBn: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    trackEvent('roast_chat_send', { text: textToSend });

    // Simulate smart matching mock reply
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let matchedEn = "That is a great question about our roasts! All our beans are 100% Arabica, organic, and ethically sourced from high-altitude estates in India & East Africa. Ask me about 'Araku Valley', 'Baba Budangiri' or our 'Floral AeroPress' roast profiles!";
      let matchedBn = "আমাদের কফি বিন সম্পর্কে দারুণ প্রশ্ন! কো-ল্যাবের সমস্ত কফি বিন ১০০% অ্যারাবিকা, সম্পুর্ণ জৈব উপায়ে উৎপাদিত এবং ভারতের সেরা পাহাড়িয়া এস্টেট থেকে সরাসরি সংগৃহীত। আরাকু ভ্যালি, বাবা বুদানগিরি বা অ্যারোপ্রেস লাইট রোস্ট সম্পর্কে বিস্তারিত জানতে প্রশ্ন করতে পারেন!";

      // Scan keywords for matching
      for (const item of AGENT_REPLIES) {
        if (item.keywords.some(kw => lowerText.includes(kw))) {
          matchedEn = item.replyEn;
          matchedBn = item.replyBn;
          break;
        }
      }

      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        textEn: matchedEn,
        textBn: matchedBn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const clearChatHistory = () => {
    const initialGreeting: ChatMessage = {
      id: 'msg-init',
      sender: 'agent',
      textEn: 'Chat history reset. How can I assist you with our single-origin roasts now?',
      textBn: 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আমাদের কফি বিন ও রোস্ট সম্পর্কে জানতে আর কী সাহায্য করতে পারি?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreeting]);
    localStorage.removeItem('colab_roast_chat_history');
    trackEvent('roast_chat_clear');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[45] font-sans pointer-events-auto">
      
      {/* Floating Bubble Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
              trackEvent('roast_chat_open');
            }}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-black shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open Roast Advisor Chat"
          >
            <MessageSquare size={22} className="group-hover:rotate-6 transition-transform" />
            
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-bold text-white items-center justify-center">1</span>
              </span>
            )}

            {/* Micro-tooltip on hover */}
            <span className="absolute right-16 bg-black/80 backdrop-blur-md text-white border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
              {language === 'bn' ? 'কফি রোস্ট অ্যাডভাইজর' : 'Roast Chat Advisor'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Slide-out Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel-box"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-[340px] sm:w-[380px] h-[500px] bg-[#14100d] border border-primary/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-[#2B1D16] border-b border-primary/5 px-4 py-3.5 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent relative">
                  <Coffee size={18} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#2B1D16]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-1">
                    {language === 'bn' ? 'কো-ল্যাব রোস্ট অ্যাডভাইজর' : 'CoLab Roast Advisor'}
                    <Sparkles size={11} className="text-accent shrink-0 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-accent font-semibold tracking-wider uppercase">
                    {language === 'bn' ? 'অনলাইন সাপোর্ট অ্যাসিস্ট্যান্ট' : 'Support Assistant • Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Logs */}
                <button
                  onClick={clearChatHistory}
                  className="p-1.5 rounded-lg text-primary/40 hover:text-primary hover:bg-white/5 text-[9px] font-mono tracking-tighter uppercase transition-all cursor-pointer"
                  title="Clear chat logs"
                >
                  Reset
                </button>
                {/* Close Trigger */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-primary/40 hover:text-primary hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Message History Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent/15">
              {messages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-2 max-w-[85%] text-left",
                      isAgent ? "self-start" : "ml-auto flex-row-reverse"
                    )}
                  >
                    {/* Tiny avatar circle */}
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 border",
                      isAgent ? "bg-accent/10 border-accent/20 text-accent" : "bg-primary/5 border-primary/10 text-primary"
                    )}>
                      {isAgent ? <Coffee size={11} /> : <User size={11} />}
                    </div>

                    <div className="space-y-1">
                      <div className={cn(
                        "rounded-2xl px-3.5 py-2 text-xs leading-relaxed font-sans shadow-sm",
                        isAgent 
                          ? "bg-[#1d1612] text-primary/90 rounded-tl-none border border-primary/5" 
                          : "bg-accent text-black font-medium rounded-tr-none"
                      )}>
                        {language === 'bn' ? msg.textBn : msg.textEn}
                      </div>
                      
                      <p className={cn(
                        "text-[8px] text-primary/30 font-mono",
                        isAgent ? "text-left" : "text-right"
                      )}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 max-w-[85%] text-left">
                  <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Coffee size={11} />
                  </div>
                  <div className="bg-[#1d1612] border border-primary/5 rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick-reply dynamic chips */}
            <div className="px-4 py-2.5 border-t border-primary/5 bg-[#0c0a08]/50 text-left">
              <span className="text-[9px] font-bold text-primary/40 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <HelpCircle size={10} className="text-accent" />
                {language === 'bn' ? 'কুইক প্রশ্নসমূহ সিলেক্ট করুন' : 'Ask our Specialty Advisor:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {ROAST_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSendMessage(language === 'bn' ? q.textBn : q.textEn)}
                    className="px-2.5 py-1 text-[10px] text-primary/75 hover:text-black bg-primary/5 hover:bg-accent border border-primary/5 hover:border-accent rounded-lg transition-all cursor-pointer font-sans select-none flex items-center gap-1 whitespace-nowrap"
                  >
                    <Flame size={9} className="text-accent mix-blend-difference shrink-0" />
                    <span>{language === 'bn' ? q.labelBn : q.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputValue.trim()) {
                  handleSendMessage(inputValue);
                }
              }}
              className="p-3 bg-[#0c0a08] border-t border-primary/5 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={language === 'bn' ? 'কফি রোস্ট সম্পর্কে জিজ্ঞাসা করুন...' : 'Ask about espresso roasts, origins, notes...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-[#14100d] text-xs text-primary outline-none border border-primary/5 rounded-xl px-3 py-2 focus:border-accent/30 font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={cn(
                  "w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer select-none border border-transparent",
                  inputValue.trim()
                    ? "bg-accent hover:bg-accent/90 text-black"
                    : "bg-primary/5 text-primary/20"
                )}
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
