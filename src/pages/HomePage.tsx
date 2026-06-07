import { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Play, RotateCcw, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  interface PlacedTopping {
    id: number;
    type: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
  }

  const [toppings, setToppings] = useState<PlacedTopping[]>([]);
  const [selectedTopping, setSelectedTopping] = useState<string>('pepperoni');
  const [isBaking, setIsBaking] = useState<boolean>(false);
  const [bakeProgress, setBakeProgress] = useState<number>(0);
  const [isBaked, setIsBaked] = useState<boolean>(false);
  const [isSliced, setIsSliced] = useState<boolean>(false);
  const [preview, setPreview] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const pizzaRef = useRef<HTMLDivElement>(null);

  const handlePizzaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSliced || isBaking) return;
    if (!pizzaRef.current) return;
    const rect = pizzaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;
    
    const dx = percentX - 50;
    const dy = percentY - 50;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= 43) {
      const newTopping: PlacedTopping = {
        id: Date.now() + Math.random(),
        type: selectedTopping,
        x: percentX,
        y: percentY,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
      };
      setToppings([...toppings, newTopping]);

      const newParticle = {
        id: Date.now() + Math.random(),
        x: percentX,
        y: percentY,
      };
      setParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 800);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSliced || isBaking) {
      setPreview({ x: 0, y: 0, show: false });
      return;
    }
    if (!pizzaRef.current) return;
    const rect = pizzaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const percentX = (mouseX / rect.width) * 100;
    const percentY = (mouseY / rect.height) * 100;
    
    const dx = percentX - 50;
    const dy = percentY - 50;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= 43) {
      setPreview({ x: percentX, y: percentY, show: true });
    } else {
      setPreview({ x: 0, y: 0, show: false });
    }
  };

  const handleMouseLeave = () => {
    setPreview({ x: 0, y: 0, show: false });
  };

  const startBaking = () => {
    if (isBaking || isBaked) return;
    setIsBaking(true);
    setBakeProgress(0);
    const interval = setInterval(() => {
      setBakeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBaking(false);
          setIsBaked(true);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const handleReset = () => {
    setToppings([]);
    setIsBaking(false);
    setIsBaked(false);
    setBakeProgress(0);
    setIsSliced(false);
    setPreview({ x: 0, y: 0, show: false });
    setParticles([]);
  };

  const handleUndo = () => {
    if (isSliced || isBaking) return;
    setToppings((prev) => prev.slice(0, -1));
  };

  const getQualityText = () => {
    if (toppings.length === 0) return { title: 'Margherita Klasyk', desc: 'Samo ciasto i ser. Czasem prostota jest kluczem!', rating: '⭐⭐⭐' };
    if (toppings.length < 5) return { title: 'Minimalista', desc: 'Skromnie, ale ze smakiem. Każdy kęs się liczy!', rating: '⭐⭐⭐⭐' };
    if (toppings.length > 18) return { title: 'Gastro-Wulkan', desc: 'Prawdziwy festiwal obfitości! Trudno to unieść.', rating: '⭐⭐⭐⭐⭐' };
    
    const quadrants = [0, 0, 0, 0];
    toppings.forEach(t => {
      if (t.x < 50 && t.y < 50) quadrants[0]++;
      else if (t.x >= 50 && t.y < 50) quadrants[1]++;
      else if (t.x < 50 && t.y >= 50) quadrants[2]++;
      else quadrants[3]++;
    });
    
    const minQ = Math.min(...quadrants);
    const maxQ = Math.max(...quadrants);
    
    if (maxQ - minQ <= 2) {
      return { title: 'Kunszt Neapolu', desc: 'Perfekcyjna dystrybucja składników. Sycylijski mistrz byłby dumny!', rating: '⭐⭐⭐⭐⭐' };
    }
    return { title: 'Artystyczny Nieład', desc: 'Asymetryczna kompozycja pełna pasji i fantazji.', rating: '⭐⭐⭐⭐' };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: "easeOut" } 
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-white selection:bg-primary overflow-x-hidden font-sans">
      
      {/* 1. ATMOSPHERIC BACKGROUND (CINEMATIC HEAT & OVEN ART) */}
      <div className="absolute inset-0 z-0 h-screen overflow-hidden">
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ 
            scale: [1.02, 1.06, 1.02],
            rotate: [0, 0.4, -0.4, 0],
            opacity: 0.85
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-full h-full relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=2000&q=95" 
            alt="Artisanal Pizzeria" 
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
            style={{ filter: 'url(#oven-heat-shimmer)' }}
          />
          {/* Subtle Rim Lighting (gentle to keep pizza crisp and visible) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/60 via-[#0a0a0b]/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/30" />
        </motion.div>

        {/* Bubbling Cheese & Dough Heat Spots */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {/* Active Bubble 1: Large glowing cheese bubble */}
          <motion.div 
            animate={{ 
              scale: [0.95, 1.12, 0.95], 
              opacity: [0.35, 0.8, 0.35],
              borderRadius: ["42% 58% 50% 50%", "58% 42% 58% 42%", "42% 58% 50% 50%"]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[35%] left-[52%] w-64 h-40 bg-gradient-to-br from-yellow-300/40 via-amber-500/20 to-transparent blur-xl border border-yellow-400/20"
          />
          <motion.div 
            animate={{ 
              scale: [0.7, 1.3, 0.7], 
              opacity: [0.2, 0.75, 0.2],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[39%] left-[55%] w-16 h-16 bg-white/25 rounded-full blur-md shadow-[0_0_15px_rgba(253,224,71,0.5)]"
          />

          {/* Active Bubble 2: Boiling heat point */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.3, 0.7, 0.3],
              borderRadius: ["50%", "47% 53% 47% 53%", "50%"]
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[48%] left-[45%] w-48 h-32 bg-gradient-to-tr from-yellow-400/30 via-orange-600/15 to-transparent blur-2xl border border-yellow-500/15"
          />
          <motion.div 
            animate={{ 
              scale: [0.6, 1.25, 0.6], 
              opacity: [0.15, 0.65, 0.15],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-[51%] left-[47%] w-12 h-12 bg-amber-400/30 rounded-full blur-lg"
          />

          {/* Active Bubble 3: Baking crust glow */}
          <motion.div 
            animate={{ 
              scale: [0.9, 1.08, 0.9], 
              opacity: [0.4, 0.85, 0.4],
              borderRadius: ["60% 40% 50% 50%", "50% 60% 40% 50%", "60% 40% 50% 50%"]
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute top-[28%] left-[60%] w-52 h-30 bg-gradient-to-r from-yellow-300/40 via-amber-500/20 to-transparent blur-xl"
          />

          {/* Active Bubble 4: Bubbling hot spot bottom */}
          <motion.div 
            animate={{ 
              scale: [0.8, 1.15, 0.8], 
              opacity: [0.25, 0.75, 0.25] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            className="absolute top-[58%] left-[54%] w-40 h-24 bg-gradient-to-br from-yellow-400/35 via-red-500/10 to-transparent blur-2xl"
          />
        </div>

        {/* SVG Filter for Heat Waves / Shimmering Cheese (Tuned to keep details sharp) */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <filter id="oven-heat-shimmer">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.008" numOctaves="2" result="noise">
                <animate attributeName="baseFrequency" dur="18s" values="0.004 0.008;0.006 0.014;0.004 0.008" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* 2. DYNAMIC FIRE SPARKS / EMBERS OVERLAY */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden h-screen">
        {[...Array(18)].map((_, i) => {
          const size = Math.random() * 4 + 2; // 2px to 6px
          const left = Math.random() * 100; // random offset
          const duration = Math.random() * 7 + 5; // 5s to 12s
          const delay = Math.random() * 6;
          return (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-gradient-to-t from-primary to-accent rounded-full opacity-40 blur-[0.5px]"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
              }}
              animate={{
                y: ['105vh', '-10vh'],
                x: [0, Math.sin(i) * 60 + (Math.random() * 40 - 20), 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      {/* 2. DYNAMIC MESH GLOWS */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px]"
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px]"
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 min-h-screen flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-20 w-full">
          
          {/* LEWA STRONA: Narracja Brandu (uFisza Premium) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-[1.6] text-center lg:text-left space-y-16"
          >
            <div className="space-y-10">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-3 bg-white/[0.03] backdrop-blur-2xl px-6 py-3 rounded-full border border-white/5 shadow-2xl shadow-black"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#ff4d00]" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                  Mistrzowska Receptura 2026
                </span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1 
                  variants={itemVariants}
                  className="text-[14vw] lg:text-[13rem] font-black text-white leading-[0.7] tracking-[-0.08em] uppercase"
                >
                  OGIEŃ <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary relative inline-block">
                    I DUSZA
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                      className="absolute -bottom-4 left-0 h-2 bg-primary/30 rounded-full"
                    />
                  </span>
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-5xl text-white/40 max-w-3xl mx-auto lg:mx-0 font-medium leading-[0.95] tracking-tight italic"
                >
                  Nie serwujemy pizzy. <br /> 
                  <span className="text-white not-italic font-black">Kreujemy doświadczenie,</span> <br />
                  które zostaje w pamięci.
                </motion.p>
              </div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4"
            >
              <Link 
                to="/menu" 
                className="group relative bg-primary text-white px-14 py-8 rounded-2xl font-black text-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(255,77,0,0.3)] flex items-center justify-center gap-6"
              >
                <div className="relative z-10 flex items-center gap-4">
                  ODKRYJ KARTĘ
                  <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#ff6a00] to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              
              <Link 
                to="/builder" 
                className="group glass-premium px-14 py-8 rounded-2xl font-black text-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 shadow-2xl"
              >
                KREATOR 3D
                <Play size={20} className="fill-current" />
              </Link>
            </motion.div>
          </motion.div>

          {/* PRAWA STRONA: Obracająca się Pizza z Pływającymi Tagi (Bento/Hero) */}
          <div className="flex-1 flex items-center justify-center w-full relative min-h-[500px]">
            {/* Tło - Ciepły neonowy blask pomarańczowy */}
            <div className="absolute w-[80%] h-[80%] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            
            {/* Główny kontener pizzy z efektem parallax */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center cursor-pointer"
            >
              {/* Obracająca się Pizza */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="w-full h-full relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=98" 
                  className="w-full h-full object-cover rounded-full border-[18px] border-[#1c1c1e] shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-2 ring-white/10"
                  alt="Mistrzowska Pizza" 
                />
              </motion.div>
              
              {/* Pływający Tag 1: Temperatura (Góra Lewo) */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 -left-6 glass-premium px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border-white/10"
              >
                <Flame size={20} className="text-primary fill-current" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Temperatura</p>
                  <p className="font-black text-white text-sm">450°C</p>
                </div>
              </motion.div>

              {/* Pływający Tag 2: Standard D.O.P. (Dół Prawo) */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 -right-6 glass-premium px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border-white/10"
              >
                <ShieldCheck size={20} className="text-accent" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Certyfikat</p>
                  <p className="font-black text-white text-sm">D.O.P. Gold</p>
                </div>
              </motion.div>

              {/* Pływający Tag 3: Pieczona na drewnie (Środek Prawa) */}
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-1/2 -translate-y-1/2 -right-12 bg-white text-black px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl"
              >
                <Sparkles size={16} className="text-primary fill-current" />
                <span className="font-black text-[9px] uppercase tracking-widest">Drewno Bukowe</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>      {/* Interactive Pizza Maker Workshop (Refined Midnight) */}
      <section className="bg-gradient-to-b from-[#0a0a0b] via-[#1a0c06] to-[#050506] py-32 relative overflow-hidden z-20 border-t border-white/[0.03]">
        {/* Glow grid floor representing hot oven brick joints - much more visible */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,146,60,0.08)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(251,146,60,0.08)_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] opacity-100 pointer-events-none" />
        
        {/* Dynamic Brick-crack glow under pizza - warm oven glow base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.22)_0%,transparent_60%)] opacity-100 pointer-events-none" />

        {/* Shifting warm heat spots inside the oven - fixed 0px height issue by using pixel dimensions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 0.95, 1.1, 1],
              x: [0, 40, -30, 20, 0],
              y: [0, -30, 30, -20, 0],
              opacity: [0.15, 0.35, 0.2, 0.3, 0.15]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-[#ff4d00]/20 rounded-full blur-[90px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 0.9, 1.15, 1, 1],
              x: [0, -40, 20, -10, 0],
              y: [0, 30, -20, 15, 0],
              opacity: [0.1, 0.25, 0.15, 0.2, 0.1]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
            className="absolute bottom-1/4 right-10 w-[380px] h-[380px] bg-[#ffb800]/15 rounded-full blur-[100px]"
          />
          {/* Baking Oven Heat Blow - flares up intensely when isBaking is true */}
          <motion.div 
            animate={{ 
              opacity: isBaking ? [0.35, 0.8, 0.45, 0.9, 0.35] : [0.12, 0.25, 0.12],
              scale: isBaking ? [1, 1.15, 0.98, 1.1, 1] : [1, 1.05, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#ffb800]/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Floating Ash & Oven Embers - fixed 105vh viewport issue by animating inside container */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 4 + 2; // 2px to 6px
            const left = Math.random() * 100;
            const duration = Math.random() * 8 + 6;
            const delay = Math.random() * 5;
            return (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-t from-[#ff4d00] via-[#ffb800] to-transparent rounded-full blur-[0.3px]"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  bottom: '-20px',
                }}
                animate={{
                  y: [0, -800],
                  x: [0, Math.sin(i) * 60 + (Math.random() * 40 - 20), 0],
                  opacity: [0, 0.95, 0],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Interaktywny Warsztat</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">ZAPROJEKTUJ SWÓJ WYPIEK</h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm md:text-base">
              Wybierz składnik i klikaj na ciasto, aby go rozłożyć. Upiecz pizzę w piecu o temperaturze 450°C i przekonaj się, jak smakuje po przekrojeniu z ciągnącym się serem!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Lewy Panel: Sterowanie i Składniki */}
            <div className="flex-1 space-y-8 w-full max-w-md">
              <div className="glass-premium p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-lg text-white uppercase tracking-wider">Krok 1: Wybierz składnik</h3>
                  {/* Toppings counts dashboard */}
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Razem: {toppings.length} szt.
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'pepperoni', label: 'Pepperoni', emoji: '🍕', count: toppings.filter(t=>t.type==='pepperoni').length, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
                    { id: 'mushroom', label: 'Pieczarki', emoji: '🍄', count: toppings.filter(t=>t.type==='mushroom').length, color: 'bg-amber-100/10 text-amber-200 border-amber-100/20' },
                    { id: 'basil', label: 'Bazylia', emoji: '🌿', count: toppings.filter(t=>t.type==='basil').length, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                    { id: 'olive', label: 'Oliwki', emoji: '🫒', count: toppings.filter(t=>t.type==='olive').length, color: 'bg-zinc-800 text-zinc-300 border-zinc-700/50' },
                    { id: 'chili', label: 'Chili', emoji: '🌶️', count: toppings.filter(t=>t.type==='chili').length, color: 'bg-red-600/10 text-red-500 border-red-600/20' },
                  ].map((topping) => (
                    <button
                      key={topping.id}
                      onClick={() => setSelectedTopping(topping.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                        selectedTopping === topping.id
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,77,0,0.25)]'
                          : `${topping.color} hover:bg-white/[0.03]`
                      }`}
                    >
                      <span className="text-2xl">{topping.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">{topping.label}</span>
                      {topping.count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border border-black animate-scaleIn">
                          {topping.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Krok 2: Akcje (Piecz, Krój, Reset) */}
              <div className="glass-premium p-6 rounded-2xl border border-white/5 space-y-6">
                <h3 className="font-black text-lg text-white uppercase tracking-wider">Krok 2: Wypiek i Porcjowanie</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Bake Button */}
                  <button
                    disabled={isBaking || isBaked}
                    onClick={startBaking}
                    className={`flex-1 group py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 ${
                      isBaked
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed'
                        : 'bg-primary text-white shadow-[0_10px_30px_rgba(255,77,0,0.25)] hover:shadow-[0_15px_40px_rgba(255,77,0,0.4)]'
                    }`}
                  >
                    <Flame size={16} className={isBaking ? "animate-bounce" : ""} />
                    {isBaking ? `PIECZENIE... (${bakeProgress}%)` : isBaked ? 'UPIECZONA!' : 'UPIECZ PIZZĘ'}
                  </button>

                  {/* Slice Button */}
                  <button
                    disabled={!isBaked || isSliced}
                    onClick={() => setIsSliced(true)}
                    className={`flex-1 py-4 px-6 rounded-xl border font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 ${
                      !isBaked
                        ? 'border-white/5 text-white/20 cursor-not-allowed'
                        : isSliced
                        ? 'border-green-500/30 text-green-400 bg-green-500/5'
                        : 'border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    <Scissors size={16} />
                    {isSliced ? 'POKROJONA!' : 'POKRÓJ PIZZĘ'}
                  </button>
                </div>

                {/* Operations bar (Undo & Reset) */}
                <div className="flex gap-4">
                  <button
                    disabled={toppings.length === 0 || isSliced || isBaking}
                    onClick={handleUndo}
                    className="flex-1 py-3 border border-white/5 hover:border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    COFNIJ (SKŁADNIK)
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border border-white/5 hover:border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={12} />
                    RESETUJ WARSZTAT
                  </button>
                </div>
              </div>

              {/* Pizza Quality / Composition Meter */}
              <motion.div 
                layout
                className="glass-premium p-6 rounded-2xl border border-white/5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">Ocena Kompozycji</h4>
                  <span className="text-sm font-bold text-yellow-400">{getQualityText().rating}</span>
                </div>
                <div>
                  <p className="font-black text-white text-base">{getQualityText().title}</p>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{getQualityText().desc}</p>
                </div>
              </motion.div>
            </div>

            {/* Prawa strona: Interaktywna Pizza (DOUGH & LAYERS) */}
            <div className="flex-1 flex justify-center items-center w-full max-w-[500px]">
              <div 
                ref={pizzaRef}
                onClick={handlePizzaClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative w-full aspect-square max-w-[400px] select-none rounded-full cursor-crosshair overflow-visible ${
                  isSliced ? 'pointer-events-none' : ''
                }`}
              >
                {/* Background Shadow & Glow */}
                <div className="absolute inset-0 bg-black/40 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] -z-10" />
                
                {/* Baking Progress Ring */}
                {isBaking && (
                  <svg className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] rotate-[-90deg] -z-10">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="48%"
                      stroke="#ff4d00"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="301.6%"
                      strokeDashoffset={`${301.6 - (301.6 * bakeProgress) / 100}%`}
                      className="transition-all duration-100"
                    />
                  </svg>
                )}

                {/* Hot steam particles rising when baked */}
                {isBaked && !isBaking && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-20">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 250, x: 100 + i * 60, opacity: 0, scale: 0.8 }}
                        animate={{
                          y: [220, 20],
                          x: [100 + i * 60, 80 + i * 60 + Math.sin(i) * 20, 110 + i * 60],
                          opacity: [0, 0.35, 0],
                          scale: [0.8, 1.4, 2]
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: i * 0.8
                        }}
                        className="absolute w-20 h-20 bg-white/5 rounded-full blur-2xl pointer-events-none"
                      />
                    ))}
                  </div>
                )}

                {/* Slices Rendering */}
                <div className="w-full h-full relative overflow-visible">
                  {[...Array(6)].map((_, index) => {
                    const angleDeg = index * 60;
                    const angleRad = (angleDeg + 30) * Math.PI / 180;
                    const offsetX = isSliced ? Math.cos(angleRad) * 18 : 0;
                    const offsetY = isSliced ? Math.sin(angleRad) * 18 : 0;

                    const sliceToppings = toppings.filter((t) => {
                      const dx = t.x - 50;
                      const dy = t.y - 50;
                      const rad = Math.atan2(dy, dx);
                      const deg = (rad * 180 / Math.PI + 360) % 360;
                      const sliceIdx = Math.floor(deg / 60);
                      return sliceIdx === index;
                    });

                    return (
                      <motion.div
                        key={index}
                        animate={{ x: offsetX, y: offsetY }}
                        transition={{ type: "spring", stiffness: 220, damping: 17 }}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + Math.cos((angleDeg * Math.PI) / 180) * 100}% ${50 + Math.sin((angleDeg * Math.PI) / 180) * 100}%, ${50 + Math.cos(((angleDeg + 60) * Math.PI) / 180) * 100}% ${50 + Math.sin(((angleDeg + 60) * Math.PI) / 180) * 100}%)`,
                          pointerEvents: isSliced ? 'none' : 'auto'
                        }}
                      >
                        {/* Pizza slice dough */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                          {/* Crust */}
                          <div 
                            className={`absolute inset-0 rounded-full border-[18px] transition-all duration-[1200ms] ${
                              isBaked 
                                ? 'border-[#8B5A2B] bg-[#d97706]/10' 
                                : isBaking 
                                ? 'border-[#b59a7f] bg-[#f59e0b]/5'
                                : 'border-[#d8ccbe] bg-transparent'
                            }`}
                          />
                          {/* Cheese / Sauce base */}
                          <div 
                            className={`absolute inset-[18px] rounded-full transition-all duration-[1200ms] ${
                              isBaked 
                                ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-red-500/80 shadow-inner' 
                                : isBaking
                                ? 'bg-gradient-to-br from-[#fee2e2] via-[#fef08a] to-[#fee2e2]'
                                : 'bg-gradient-to-br from-white via-[#fef9c3] to-white'
                            }`}
                          >
                            {/* Bubbles during baking */}
                            {isBaked && (
                              <div className="absolute inset-0 opacity-80 mix-blend-overlay">
                                <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-500 rounded-full blur-[1px] animate-pulse" />
                                <div className="absolute top-1/2 left-2/3 w-8 h-8 bg-amber-500 rounded-full blur-[2px] animate-pulse delay-75" />
                                <div className="absolute top-2/3 left-1/4 w-7 h-5 bg-red-600 rounded-full blur-[1px] animate-pulse delay-150" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Render toppings for this slice */}
                        {sliceToppings.map((topping) => (
                          <motion.div
                            key={topping.id}
                            initial={{ scale: 0, rotate: topping.rotation }}
                            animate={{ scale: topping.scale, rotate: topping.rotation }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="absolute pointer-events-none z-10"
                            style={{
                              left: `${topping.x}%`,
                              top: `${topping.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            {/* Topping visuals */}
                            {topping.type === 'pepperoni' && (
                              <div className={`w-9 h-9 rounded-full border-[3px] shadow-md transition-all duration-1000 ${
                                isBaked 
                                  ? 'bg-red-700 border-red-900 scale-[0.9] brightness-[0.7]' 
                                  : 'bg-red-500 border-red-700'
                              }`} />
                            )}
                            {topping.type === 'mushroom' && (
                              <div className={`w-8 h-7 flex flex-col items-center justify-center transition-all duration-1000 ${
                                isBaked ? 'brightness-[0.7]' : ''
                              }`}>
                                <div className="w-8 h-4 bg-amber-100 rounded-t-full border border-amber-300/40" />
                                <div className="w-2.5 h-3 bg-amber-100/80 -mt-0.5 border-x border-b border-amber-300/40" />
                              </div>
                            )}
                            {topping.type === 'basil' && (
                              <div className={`w-8 h-5 bg-green-500 rounded-full border border-green-700/50 shadow-sm transition-all duration-1000 ${
                                isBaked 
                                  ? 'bg-green-800 brightness-[0.6] rotate-[15deg]' 
                                  : 'rotate-[-10deg]'
                              }`} />
                            )}
                            {topping.type === 'olive' && (
                              <div className="w-5 h-5 rounded-full border-[2.5px] border-zinc-950 bg-zinc-900 shadow-sm flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-zinc-700" />
                              </div>
                            )}
                            {topping.type === 'chili' && (
                              <div className={`w-8 h-3 bg-red-600 rounded-full border border-red-800 shadow-sm skew-x-12 transition-all duration-1000 ${
                                isBaked ? 'bg-red-800 brightness-[0.7]' : ''
                              }`} />
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>

                {/* SVG Cheese Pull Strings */}
                {isSliced && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    {[...Array(6)].map((_, index) => {
                      const angleDeg = index * 60;
                      const angleRad = (angleDeg + 30) * Math.PI / 180;
                      
                      const ox = Math.cos(angleRad) * 18;
                      const oy = Math.sin(angleRad) * 18;
                      
                      const startX = 50;
                      const startY = 50;
                      const endX = 50 + ox;
                      const endY = 50 + oy;

                      const ctrlX1 = 50 + ox / 3 + Math.sin(index) * 2;
                      const ctrlY1 = 50 + oy / 3 + Math.cos(index) * 2;
                      const ctrlX2 = 50 + (ox * 2) / 3 - Math.sin(index) * 2;
                      const ctrlY2 = 50 + (oy * 2) / 3 - Math.cos(index) * 2;

                      return (
                        <g key={index}>
                          {/* Cheese string 1 */}
                          <path
                            d={`M ${startX}% ${startY}% C ${ctrlX1}% ${ctrlY1}%, ${ctrlX2}% ${ctrlY2}%, ${endX}% ${endY}%`}
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            opacity={0.8}
                            className="drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"
                          />
                          {/* Cheese string 2 (thin) */}
                          <path
                            d={`M ${startX - 1}% ${startY + 1}% Q ${(startX + endX)/2 + 2}% ${(startY + endY)/2 - 2}% ${endX - 1}% ${endY + 1}%`}
                            stroke="#fbbf24"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            fill="none"
                            opacity={0.7}
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* Slicing lines helper overlays */}
                {isSliced && (
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    <div className="absolute top-0 bottom-0 left-[50%] w-[1.5px] bg-[#0a0a0b]/80" />
                    <div className="absolute left-0 right-0 top-[50%] h-[1.5px] bg-[#0a0a0b]/80" />
                    <div className="absolute inset-0 w-full h-full border border-dashed border-white/5 rounded-full" />
                  </div>
                )}

                {/* Click spark particles */}
                {particles.map((p) => (
                  <div key={p.id} className="absolute inset-0 pointer-events-none z-30">
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 60 * Math.PI) / 180;
                      const dist = 25 + Math.random() * 20;
                      return (
                        <motion.div
                          key={i}
                          initial={{ 
                            left: `${p.x}%`, 
                            top: `${p.y}%`, 
                            scale: 1, 
                            opacity: 1 
                          }}
                          animate={{ 
                            left: `${p.x + Math.cos(angle) * dist}%`, 
                            top: `${p.y + Math.sin(angle) * dist}%`, 
                            scale: 0.2, 
                            opacity: 0 
                          }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                          className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-primary shadow-[0_0_6px_#ff4d00]"
                          style={{ transform: 'translate(-50%, -50%)' }}
                        />
                      );
                    })}
                  </div>
                ))}

                {/* Topping placement preview */}
                {preview.show && (
                  <div 
                    className="absolute pointer-events-none z-40 opacity-40 scale-100"
                    style={{
                      left: `${preview.x}%`,
                      top: `${preview.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {selectedTopping === 'pepperoni' && (
                      <div className="w-9 h-9 rounded-full border-[3px] border-red-700 bg-red-500" />
                    )}
                    {selectedTopping === 'mushroom' && (
                      <div className="w-8 h-7 flex flex-col items-center justify-center">
                        <div className="w-8 h-4 bg-amber-100 rounded-t-full border border-amber-300/40" />
                        <div className="w-2.5 h-3 bg-amber-100/80 -mt-0.5 border-x border-b border-amber-300/40" />
                      </div>
                    )}
                    {selectedTopping === 'basil' && (
                      <div className="w-8 h-5 bg-green-500 rounded-full border border-green-700/50 rotate-[-10deg]" />
                    )}
                    {selectedTopping === 'olive' && (
                      <div className="w-5 h-5 rounded-full border-[2.5px] border-zinc-950 bg-zinc-900 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-zinc-700" />
                      </div>
                    )}
                    {selectedTopping === 'chili' && (
                      <div className="w-8 h-3 bg-red-600 rounded-full border border-red-800 skew-x-12" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
