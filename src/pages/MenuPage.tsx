import { useState } from 'react';
import { MENU_PIZZAS } from '../utils/mockData';
import { useCartStore } from '../store/useCartStore';
import { Plus, Star, Leaf, Flame, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';

const PIZZA_TAGS: Record<string, ('MEAT' | 'VEGGIE' | 'SPICY')[]> = {
  m1: ['VEGGIE'],
  m2: ['MEAT', 'SPICY'],
  m3: ['VEGGIE'],
  m4: ['MEAT'],
  m5: ['MEAT'],
};

export default function MenuPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MEAT' | 'VEGGIE' | 'SPICY'>('ALL');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const filteredPizzas = MENU_PIZZAS.filter(pizza => {
    if (activeCategory === 'ALL') return true;
    const tags = PIZZA_TAGS[pizza.id] || [];
    return tags.includes(activeCategory);
  });

  return (
    <div className="bg-[#0a0a0b] min-h-screen pb-40 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 glass-premium px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] text-primary mb-8 animate-neon"
        >
          <Flame className="h-3.5 w-3.5 fill-current" />
          Karta Mistrzów
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-none"
        >
          SMAKI <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-accent">uFISZA</span>
        </motion.h2>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-16 flex justify-center flex-wrap gap-4 relative z-10">
        {[
          { id: 'ALL', label: 'Wszystkie' },
          { id: 'MEAT', label: 'Mięsne' },
          { id: 'VEGGIE', label: 'Wegetariańskie' },
          { id: 'SPICY', label: 'Ostre' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all cursor-pointer relative ${
              activeCategory === cat.id
                ? 'bg-primary text-white shadow-[0_10px_30px_rgba(255,77,0,0.3)] scale-105'
                : 'glass-premium text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredPizzas.map((pizza) => {
              const tags = PIZZA_TAGS[pizza.id] || [];
              return (
                <motion.div 
                  key={pizza.id}
                  variants={cardVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative bg-[#141416] rounded-[2.8rem] overflow-hidden border border-white/[0.03] shadow-2xl flex flex-col h-full transition-transform duration-700 group-hover:-translate-y-4">
                    <div className="relative h-80 overflow-hidden">
                      <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-60" />
                      <button className="absolute top-6 right-6 w-14 h-14 glass-premium rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-2xl">
                         <ArrowUpRight size={24} />
                      </button>
                      <div className="absolute top-6 left-6 flex gap-2">
                        {tags.includes('VEGGIE') && (
                          <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-1 shadow-lg">
                            <Leaf size={18} />
                            <span className="text-[9px] font-black uppercase tracking-wider">VEGE</span>
                          </span>
                        )}
                        {tags.includes('SPICY') && (
                          <span className="bg-red-500/20 backdrop-blur-md text-red-400 p-2.5 rounded-xl border border-red-500/30 flex items-center gap-1 shadow-lg">
                            <Flame size={18} className="fill-current" />
                            <span className="text-[9px] font-black uppercase tracking-wider">OSTRE</span>
                          </span>
                        )}
                        {tags.includes('MEAT') && !tags.includes('SPICY') && (
                          <span className="bg-amber-500/20 backdrop-blur-md text-amber-400 p-2.5 rounded-xl border border-amber-500/30 flex items-center gap-1 shadow-lg">
                            <ShieldCheck size={18} />
                            <span className="text-[9px] font-black uppercase tracking-wider">MIĘSO</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-10 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-3xl font-black text-white tracking-tight uppercase group-hover:text-primary transition-colors duration-500">{pizza.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rzemieślnicza</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-3xl font-black text-white">{pizza.price.toFixed(0)}</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">PLN</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm font-medium leading-relaxed mb-10 flex-grow italic">{pizza.description}</p>
                      <button onClick={() => addItem(pizza)} className="w-full relative overflow-hidden bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-primary hover:text-white hover:shadow-[0_15px_40px_rgba(255,77,0,0.4)] active:scale-95 group/btn">
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <Plus className="h-4 w-4 stroke-[4px]" />
                          Do Koszyka
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
