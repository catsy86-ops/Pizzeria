import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Clock, ChefHat, Truck, PackageCheck, 
  MapPin, Phone, MessageSquare, Star, Navigation2, Flame, Send, X, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  { label: 'Przyjęto', desc: 'Kuchnia startuje', icon: Clock, color: 'text-blue-400' },
  { label: 'Wyrabianie', desc: 'Szef Fisz w akcji', icon: Clock, color: 'text-orange-400' },
  { label: 'Wypiek', desc: '450°C w piecu', icon: Flame, color: 'text-red-500' },
  { label: 'Kontrola', desc: 'Standard D.O.P.', icon: PackageCheck, color: 'text-purple-400' },
  { label: 'W drodze', desc: 'Kurier jedzie', icon: Truck, color: 'text-emerald-400' },
  { label: 'U Ciebie', desc: 'Smacznego!', icon: CheckCircle2, color: 'text-primary' },
];

const DRIVER = {
  name: 'Marek Rossi',
  rating: 4.9,
  vehicle: 'Vespa Midnight Red',
  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80'
};

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const orderId = useMemo(() => `UF-${Math.floor(100000 + Math.random() * 900000)}`, []);

  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: 'Cześć! Odebrałem Twoje zamówienie. Wyruszam w drogę!', time: new Date().toTimeString().substring(0, 5) }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep < STATUSES.length - 1) {
      const duration = currentStep === 4 ? 12000 : 7000; 
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (timeLeft > 0 && currentStep < STATUSES.length - 1) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, currentStep]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Courier coordinates helper
  const progressRatio = currentStep / (STATUSES.length - 1);
  const courierLeft = 15 + progressRatio * 70; // 15% to 85%
  const courierTop = 48 + Math.sin(progressRatio * Math.PI) * -12; // curve effect

  // Generate logistics logs based on step
  const logEvents = useMemo(() => {
    const fmt = (minutesOffset: number) => {
      const d = new Date(Date.now() - (30 - minutesOffset) * 60000);
      return d.toTimeString().split(' ')[0];
    };
    return [
      { step: 0, time: fmt(0), text: 'Zamówienie przyjęte do systemu uFisza. Weryfikacja płatności.' },
      { step: 1, time: fmt(2), text: 'Wyrabianie ciasta (mąka Caputo Nuvola, hydratacja 70%).' },
      { step: 2, time: fmt(5), text: 'Nałożenie składników: pomidory San Marzano, mozzarella Fior di Latte.' },
      { step: 3, time: fmt(8), text: 'Wypiek w piecu opalanym drewnem bukowym w temp. 450°C.' },
      { step: 4, time: fmt(10), text: 'Wypiek zakończony. Kontrola jakości certyfikatu D.O.P. pomyślna.' },
      { step: 5, time: fmt(12), text: 'Paczka przekazana kurierowi. Marek Rossi wyrusza na Vespie.' },
    ];
  }, []);

  const activeLogs = logEvents.filter(log => log.step <= currentStep);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const timeStr = new Date().toTimeString().substring(0, 5);
    setMessages(prev => [...prev, { sender: 'user', text, time: timeStr }]);
    setInputVal('');
    
    // Trigger simulated response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Okej, zrozumiałem! Będę jak najszybciej.';
      if (text.toLowerCase().includes('drzwi')) {
        reply = 'Jasne, zostawię pizzę pod drzwiami i zapukam.';
      } else if (text.toLowerCase().includes('kod') || text.toLowerCase().includes('bram') || text.toLowerCase().includes('domofon')) {
        reply = 'Super, wielkie dzięki! To mi znacznie ułatwi wejście.';
      } else if (text.toLowerCase().includes('dzięk') || text.toLowerCase().includes('dziek')) {
        reply = 'Nie ma sprawy, polecam się i smacznego!';
      }
      setMessages(prev => [...prev, { sender: 'driver', text: reply, time: new Date().toTimeString().substring(0, 5) }]);
    }, 1500);
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-12 pb-40 font-sans text-white relative">
      
      {/* Live Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#141416] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col h-[550px]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <img src={DRIVER.image} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5" alt="driver" />
                  <div>
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">{DRIVER.name}</h4>
                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                      Kurier w trasie
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)} 
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl flex flex-col gap-1 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                    }`}>
                      <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>
                      <span className="text-[8px] text-white/40 text-right self-end font-mono">{msg.time}</span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
                {[
                  'Zostaw pod drzwiami',
                  'Kod do domofonu to #55',
                  'Dzięki za dostawę!'
                ].map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(phrase)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-[9px] font-black uppercase text-white/60 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(inputVal); }}
                className="p-4 border-t border-white/5 flex gap-3 bg-white/[0.01]"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Napisz do Marka..."
                  className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-primary text-white"
                />
                <button 
                  type="submit"
                  className="p-3 bg-primary hover:bg-[#ff6a00] rounded-xl text-white transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
          >
             <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
             Śledzenie na żywo
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">STATUS <br/><span className="text-primary italic">UCZTY</span></h2>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Numer Zamówienia</p>
           <p className="text-2xl font-black text-white tracking-widest">{orderId}</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Lewa strona: Dashboard Dostawy */}
        <div className="flex-grow space-y-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-premium rounded-[3.5rem] overflow-hidden shadow-2xl border-white/5"
          >
            <div className="p-12 flex flex-col sm:flex-row justify-between items-center gap-10">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Pozostało około</span>
                <h2 className="text-7xl md:text-8xl font-black text-white mt-4 tracking-tighter tabular-nums">{formatTime(timeLeft)}</h2>
              </div>
              <div className="w-full sm:w-auto glass-premium p-8 rounded-[2.5rem] flex items-center gap-6 border-white/5 bg-white/[0.02]">
                 <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,77,0,0.4)] animate-pulse">
                    <Flame size={32} fill="currentColor" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aktualnie</p>
                    <p className="font-black text-white uppercase text-sm tracking-tight">{STATUSES[currentStep].label}</p>
                 </div>
              </div>
            </div>

            {/* Nowoczesna Wektorowa Mapa Cyberpunk */}
            <div className="h-[400px] bg-[#070709] relative overflow-hidden group border-y border-white/5 shadow-inner">
               {/* Grid background */}
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <svg width="100%" height="100%" className="absolute inset-0">
                   <defs>
                     <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                       <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                     </pattern>
                   </defs>
                   <rect width="100%" height="100%" fill="url(#grid)" />
                 </svg>
               </div>

               {/* Fake street networks (SVG background map) */}
               <div className="absolute inset-0 opacity-30 pointer-events-none">
                 <svg width="100%" height="100%" viewBox="0 0 1000 450" preserveAspectRatio="none" className="w-full h-full">
                   {/* Background roads */}
                   <path d="M -50,180 L 1050,180" stroke="rgba(255,255,255,0.02)" strokeWidth="8" fill="none" />
                   <path d="M -50,220 L 1050,220" stroke="rgba(255,255,255,0.02)" strokeWidth="12" fill="none" />
                   <path d="M -50,300 L 1050,300" stroke="rgba(255,255,255,0.02)" strokeWidth="8" fill="none" />
                   <path d="M 150,-50 L 150,500" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="none" />
                   <path d="M 450,-50 L 450,500" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="none" />
                   <path d="M 850,-50 L 850,500" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="none" />
                   <path d="M 300,-50 L 700,500" stroke="rgba(255,255,255,0.01)" strokeWidth="10" fill="none" />

                   {/* Main Delivery Curve Route */}
                   <path 
                     d="M 150,220 C 300,100 500,340 850,220" 
                     stroke="rgba(255,77,0,0.08)" 
                     strokeWidth="8" 
                     fill="none" 
                     strokeLinecap="round" 
                   />
                   <motion.path 
                     d="M 150,220 C 300,100 500,340 850,220" 
                     stroke="var(--color-primary)" 
                     strokeWidth="6" 
                     fill="none" 
                     strokeLinecap="round"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: progressRatio }}
                     transition={{ duration: 1.2, ease: "easeOut" }}
                   />
                 </svg>
               </div>
               
               {/* Map Landmarks */}
               <div className="absolute inset-0 pointer-events-none">
                  {/* Pizzeria Node */}
                  <div className="absolute left-[15%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                     <div className="w-14 h-14 glass-premium rounded-2xl flex items-center justify-center border-white/10 shadow-2xl relative">
                        <ChefHat size={24} className="text-orange-400" />
                        <span className="absolute -inset-4 rounded-full border border-orange-500/20 animate-ping opacity-60" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-widest mt-2 text-gray-400 bg-[#070709] px-2 py-0.5 rounded-full border border-white/5">uFisza HQ</span>
                  </div>

                  {/* Courier Node (Vespa/Truck) */}
                  <motion.div 
                     animate={{ left: `${courierLeft}%`, top: `${courierTop}%` }}
                     transition={{ type: "spring", stiffness: 60, damping: 12 }}
                     className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                     <div className="bg-primary p-4 rounded-[1.5rem] shadow-[0_0_35px_rgba(255,77,0,0.6)] border border-white/10 animate-bounce">
                        <Truck size={24} className="text-white" />
                     </div>
                  </motion.div>

                  {/* Customer Node */}
                  <div className="absolute left-[85%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                     <div className="w-14 h-14 glass-premium rounded-2xl flex items-center justify-center border-white/10 shadow-2xl relative">
                        <MapPin size={24} className="text-primary" />
                        <span className="absolute -inset-4 rounded-full border border-primary/20 animate-ping opacity-60" style={{ animationDelay: '1000ms' }} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-widest mt-2 text-gray-400 bg-[#070709] px-2 py-0.5 rounded-full border border-white/5">Mieszkanie</span>
                  </div>
               </div>

               {/* Watermark / Coordinates */}
               <div className="absolute bottom-4 left-6 text-[8px] font-mono text-white/10 uppercase tracking-widest select-none">
                 LAT: 52.2297° N / LON: 21.0122° E
               </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="p-12 bg-[#141416] border-t border-white/5 flex items-center gap-10"
              >
                 <div className="bg-primary/10 p-6 rounded-[2rem] border border-primary/20 shrink-0">
                    {(() => {
                      const Icon = STATUSES[currentStep].icon;
                      return <Icon className={`h-10 w-10 ${STATUSES[currentStep].color}`} />;
                    })()}
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{STATUSES[currentStep].label}</h3>
                    <p className="text-gray-300 font-medium text-lg italic">{STATUSES[currentStep].desc}</p>
                 </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Karta Kuriera Midnight */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="glass-premium p-8 rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-10 border-white/5"
          >
            <div className="flex items-center gap-8">
              <div className="relative group">
                <img src={DRIVER.image} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl ring-4 ring-white/5 transition-transform group-hover:scale-105" alt="driver" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-7 h-7 rounded-full border-4 border-[#141416]" />
              </div>
              <div>
                <h4 className="font-black text-white text-3xl tracking-tight">{DRIVER.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[#ffb800] font-black text-sm uppercase tracking-widest">
                    <Star size={14} className="fill-current" />
                    {DRIVER.rating}
                  </div>
                  <span className="text-white/20">|</span>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{DRIVER.vehicle}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setChatOpen(true)}
                className="flex-1 sm:flex-none p-6 glass-premium text-white rounded-[1.5rem] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl border-white/5 cursor-pointer"
              >
                <MessageSquare size={24} />
              </button>
              <a 
                href={`tel:+48500600700`}
                className="flex-1 sm:flex-none p-6 bg-primary text-white rounded-[1.5rem] hover:bg-[#ff6a00] transition-all active:scale-95 shadow-2xl shadow-primary/20 flex items-center justify-center cursor-pointer"
              >
                <Phone size={24} />
              </a>
            </div>
          </motion.div>
          
          {/* Live Logistics Console (Real-time logs terminal) */}
          <div className="glass-premium rounded-[3rem] p-8 border-white/5 bg-black/40">
             <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-widest text-xs mb-6">
                <Terminal size={16} className="text-primary" />
                Live Logistics Console
             </h3>
             <div className="font-mono text-[11px] space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                {activeLogs.map((log, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="flex gap-4"
                  >
                     <span className="text-primary font-bold">[{log.time}]</span>
                     <span className="text-white/40">system_log:</span>
                     <span className="text-gray-200">{log.text}</span>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Prawa strona: Timeline Bento */}
        <div className="lg:w-[450px] shrink-0 w-full">
          <div className="glass-premium rounded-[3.5rem] p-12 h-full shadow-2xl border-white/5">
            <h3 className="font-black text-white mb-16 flex items-center gap-4 uppercase tracking-tighter text-2xl">
               <Navigation2 size={24} className="text-primary rotate-45" />
               Logistyka
            </h3>
            
            <div className="space-y-12 relative">
              <div className="absolute left-7 top-4 bottom-4 w-[1px] bg-white/5" />

              {STATUSES.map((status, index) => {
                const active = index <= currentStep;
                const Icon = status.icon;
                return (
                  <div key={status.label} className={`flex items-start gap-8 relative transition-all duration-700 ${active ? 'opacity-100' : 'opacity-15'}`}>
                    <div className={`z-10 w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 shadow-2xl ${
                      active ? 'bg-primary border-primary shadow-primary/20' : 'bg-transparent border-white/10'
                    }`}>
                      <Icon size={24} className={active ? 'text-white' : 'text-white/20'} />
                    </div>
                    <div className="pt-2">
                      <h4 className={`text-sm font-black uppercase tracking-widest ${active ? 'text-white' : 'text-white/40'}`}>
                        {status.label}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                        {index < currentStep ? 'Zakończono' : index === currentStep ? 'W trakcie' : 'Oczekiwanie'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 pt-10 border-t border-white/5">
               <div className="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 rounded-xl glass-premium flex items-center justify-center">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Cel</p>
                       <p className="text-sm font-black text-white truncate">ul. Pixelowa 123</p>
                    </div>
                  </div>
                  <button className="w-full py-4 glass-premium text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500/10 transition-colors border-red-500/20 text-red-400 cursor-pointer">
                     Potrzebujesz pomocy?
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
