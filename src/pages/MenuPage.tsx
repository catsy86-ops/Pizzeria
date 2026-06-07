import { useState } from 'react';
import { MENU_PIZZAS } from '../utils/mockData';
import { useCartStore } from '../store/useCartStore';
import { Plus, Star, Leaf, Flame, ShieldCheck, Check } from 'lucide-react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import type { Pizza } from '../types';

const PIZZA_TAGS: Record<string, ('MEAT' | 'VEGGIE' | 'SPICY')[]> = {
  m1: ['VEGGIE'],
  m2: ['MEAT', 'SPICY'],
  m3: ['VEGGIE'],
  m4: ['MEAT'],
  m5: ['MEAT'],
  m6: ['MEAT', 'SPICY'],
  m7: ['VEGGIE'],
  m8: ['MEAT'],
  m9: ['VEGGIE'],
};

interface PizzaCardProps {
  pizza: Pizza;
  tags: ('MEAT' | 'VEGGIE' | 'SPICY')[];
  onAddToCart: (pizza: Pizza) => void;
  cardVariants: Variants;
}

function PizzaCard({ pizza, tags, onAddToCart, cardVariants }: PizzaCardProps) {
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [crust, setCrust] = useState<'THIN' | 'CLASSIC' | 'THICK'>('CLASSIC');
  const [added, setAdded] = useState(false);

  // Price adjustments
  const sizeAdjustment = size === 'S' ? -4 : size === 'M' ? 0 : 8;
  const crustAdjustment = crust === 'THICK' ? 3 : 0;
  const finalPrice = pizza.price + sizeAdjustment + crustAdjustment;

  // Estimation macros
  const rating = (4.7 + ((parseInt(pizza.id.replace(/\D/g, '')) || 1) % 3) * 0.1).toFixed(1);
  const reviewsCount = 42 + (((parseInt(pizza.id.replace(/\D/g, '')) || 1) * 17) % 130);
  const kcal = 720 + (size === 'S' ? -180 : size === 'M' ? 0 : 260) + (crust === 'THICK' ? 90 : 0);

  const handleAdd = () => {
    const sizeLabel = size === 'S' ? 'Mała (30cm)' : size === 'M' ? 'Średnia (40cm)' : 'Duża (50cm)';
    const crustLabel = crust === 'THIN' ? 'cienkie ciasto' : crust === 'CLASSIC' ? 'klasyczne ciasto' : 'grube ciasto';
    
    const configuredPizza: Pizza = {
      ...pizza,
      id: `${pizza.id}-${size}-${crust}-${Date.now()}`,
      description: `${pizza.description} (${sizeLabel}, ${crustLabel})`,
      price: finalPrice,
      isCustom: true,
    };
    
    onAddToCart(configuredPizza);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div 
      variants={cardVariants}
      layout
      className="group relative flex flex-col"
    >
      <div className="absolute -inset-1 bg-primary/20 rounded-[2rem] sm:rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative bg-[#141416] rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden border border-white/[0.03] shadow-2xl flex flex-col h-full transition-all duration-500 group-hover:-translate-y-2">
        
        {/* Image Area */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img 
            src={pizza.image} 
            alt={pizza.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-90 group-hover:brightness-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-70" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 glass-premium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1 sm:gap-1.5 shadow-xl border-white/5">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-accent text-accent" />
            <span className="text-[9px] sm:text-[10px] font-black text-white">{rating}</span>
            <span className="text-[8px] sm:text-[9px] font-medium text-white/40">({reviewsCount})</span>
          </div>

          {/* Tags */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1.5">
            {tags.includes('VEGGIE') && (
              <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-400 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-emerald-500/30 flex items-center gap-1 sm:gap-1.5 shadow-lg">
                <Leaf size={12} />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">VEGE</span>
              </span>
            )}
            {tags.includes('SPICY') && (
              <span className="bg-red-500/20 backdrop-blur-md text-red-400 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-red-500/30 flex items-center gap-1 sm:gap-1.5 shadow-lg">
                <Flame size={12} className="fill-current" />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">OSTRE</span>
              </span>
            )}
            {tags.includes('MEAT') && !tags.includes('SPICY') && (
              <span className="bg-amber-500/20 backdrop-blur-md text-amber-400 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-amber-500/30 flex items-center gap-1 sm:gap-1.5 shadow-lg">
                <ShieldCheck size={12} />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">MIĘSO</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-8 flex flex-col flex-grow">
          
          {/* Pizza Header & Info */}
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase group-hover:text-primary transition-colors duration-300">
                {pizza.name}
              </h3>
              <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 sm:mt-1">
                {kcal} Kcal | Rzemieślnicza
              </p>
            </div>
            <div className="text-right">
              <span className="block text-xl sm:text-2xl font-black text-white">{finalPrice.toFixed(0)}</span>
              <span className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-widest">PLN</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 text-xs font-medium leading-relaxed mb-4 sm:mb-6 italic min-h-[36px]">
            {pizza.description}
          </p>

          {/* Configurators */}
          <div className="space-y-3 pt-3.5 border-t border-white/[0.03] mb-4 sm:mb-6">
            {/* Size Selector */}
            <div className="flex items-center justify-between">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/30">Rozmiar:</span>
              <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                {[
                  { id: 'S', label: 'Mała' },
                  { id: 'M', label: 'Średnia' },
                  { id: 'L', label: 'Duża' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id as any)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all cursor-pointer ${
                      size === s.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crust Selector */}
            <div className="flex items-center justify-between">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/30">Ciasto:</span>
              <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                {[
                  { id: 'THIN', label: 'Cienkie' },
                  { id: 'CLASSIC', label: 'Klasyk' },
                  { id: 'THICK', label: 'Grube' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCrust(c.id as any)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all cursor-pointer ${
                      crust === c.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAdd} 
            className={`w-full relative overflow-hidden py-3 sm:py-4 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-all active:scale-98 cursor-pointer ${
              added 
                ? 'bg-emerald-600 text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)]' 
                : 'bg-white text-black hover:bg-primary hover:text-white hover:shadow-[0_12px_30px_rgba(255,77,0,0.35)]'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[4px]" />
                  Dodano!
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 stroke-[4px]" />
                  Do Koszyka
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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
      transition: { duration: 0.6, ease: "easeOut" } 
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

      <section className="relative pt-16 pb-12 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 glass-premium px-5 py-2 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-primary mb-6 animate-neon"
        >
          <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
          Karta Mistrzów
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter uppercase leading-none"
        >
          SMAKI <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-accent">uFISZA</span>
        </motion.h2>
      </section>

      {/* Filter Tabs - Horizontally scrollable on mobile */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex gap-3 overflow-x-auto no-scrollbar pb-3 justify-start md:justify-center relative z-10">
        {[
          { id: 'ALL', label: 'Wszystkie' },
          { id: 'MEAT', label: 'Mięsne' },
          { id: 'VEGGIE', label: 'Wegetariańskie' },
          { id: 'SPICY', label: 'Ostre' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-6 py-3.5 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all cursor-pointer flex-shrink-0 relative ${
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredPizzas.map((pizza) => {
              const tags = PIZZA_TAGS[pizza.id] || [];
              return (
                <PizzaCard 
                  key={pizza.id}
                  pizza={pizza}
                  tags={tags}
                  onAddToCart={addItem}
                  cardVariants={cardVariants}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
