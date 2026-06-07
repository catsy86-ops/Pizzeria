import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
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
      
      {/* 1. ATMOSPHERIC BACKGROUND (CINEMATIC ART) */}
      <div className="absolute inset-0 z-0 h-screen overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=2000&q=95" 
            alt="Artisanal Pizzeria" 
            className="w-full h-full object-cover grayscale-[30%] brightness-[0.4]"
          />
          {/* Rim Lighting Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/80" />
        </motion.div>
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

          {/* PRAWA STRONA: Luksusowe Bento Badges */}
          <div className="flex-1 flex flex-col gap-8 w-full max-w-sm relative">
            {/* Background rim light for badges */}
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] -z-10" />

            <motion.div 
              variants={itemVariants}
              whileHover={{ x: -10, rotate: -1 }}
              className="glass-premium p-12 rounded-[4rem] shadow-2xl flex items-center gap-10 group"
            >
              <div className="p-6 bg-primary rounded-3xl shadow-[0_0_40px_rgba(255,77,0,0.4)] group-hover:rotate-12 transition-transform">
                <Flame size={44} className="text-white fill-current animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Temperatura</p>
                <p className="font-black text-white text-3xl leading-none">450°C</p>
                <p className="text-[9px] font-bold text-white/20 mt-3 uppercase tracking-widest leading-none">Drewno bukowe</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ x: -10, rotate: 1 }}
              className="bg-white p-12 rounded-[4rem] shadow-2xl flex items-center gap-10 group"
            >
              <div className="p-6 bg-[#0a0a0b] rounded-3xl shadow-xl transition-transform group-hover:-rotate-12">
                <ShieldCheck size={44} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Standard</p>
                <p className="font-black text-[#0a0a0b] text-3xl leading-none uppercase">D.O.P. Gold</p>
                <p className="text-[9px] font-bold text-gray-400 mt-3 uppercase tracking-widest leading-none">Certyfikat jakości</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Cinematic Marquee Section (Refined Midnight) */}
      <section className="bg-black py-48 relative overflow-hidden z-20 border-t border-white/[0.03]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] invert" />
        <div className="max-w-[100vw] overflow-hidden relative z-10">
           <motion.div 
             animate={{ x: [0, -3000] }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
             className="flex gap-40 whitespace-nowrap items-center"
           >
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-32">
                  <span className="text-[12rem] md:text-[20rem] font-black text-white/[0.02] uppercase italic tracking-tighter">uFisza</span>
                  <div className="w-24 h-24 bg-primary rotate-45 rounded-[2rem] shadow-[0_0_100px_rgba(255,77,0,0.4)] flex items-center justify-center border-8 border-white/5">
                      <Sparkles size={48} className="text-white" />
                  </div>
                  <span className="text-[12rem] md:text-[20rem] font-black text-white/[0.02] uppercase italic tracking-tighter">Eccellenza</span>
                  <div className="w-10 h-10 bg-primary rounded-full shadow-[0_0_50px_rgba(255,77,0,0.6)]" />
                  <span className="text-[12rem] md:text-[20rem] font-black text-white/[0.02] uppercase italic tracking-tighter">Passione</span>
                  <div className="w-4 h-80 bg-white/[0.02] -rotate-12" />
                </div>
              ))}
           </motion.div>
        </div>
      </section>
    </div>
  );
}
