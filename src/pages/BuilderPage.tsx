import { useState } from 'react';
import { TOPPINGS } from '../utils/mockData';
import { useCartStore } from '../store/useCartStore';
import type { Topping, Pizza } from '../types';
import { Check, Pizza as PizzaIcon, Sparkles, ChefHat, Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_PRICE = 25.00;

const TOPPING_CATEGORIES = {
  MEAT: ['Pepperoni', 'Salami', 'Boczek'],
  VEGGIE: ['Pieczarki', 'Cebula', 'Zielona Papryka', 'Czarne Oliwki', 'Ananas', 'Szpinak'],
  EXTRA: ['Extra Ser']
};

const TOPPING_OFFSETS: Record<string, { r: number; a: number }[]> = {
  'Pepperoni': [
    { r: 0.3, a: 15 }, { r: 0.5, a: 75 }, { r: 0.7, a: 135 },
    { r: 0.4, a: 195 }, { r: 0.6, a: 255 }, { r: 0.5, a: 315 },
    { r: 0.2, a: 180 }, { r: 0.65, a: 45 }
  ],
  'Salami': [
    { r: 0.35, a: 45 }, { r: 0.55, a: 105 }, { r: 0.65, a: 165 },
    { r: 0.45, a: 225 }, { r: 0.6, a: 285 }, { r: 0.25, a: 345 }
  ],
  'Pieczarki': [
    { r: 0.25, a: 60 }, { r: 0.45, a: 120 }, { r: 0.65, a: 180 },
    { r: 0.35, a: 240 }, { r: 0.55, a: 300 }, { r: 0.6, a: 0 },
    { r: 0.7, a: 90 }
  ],
  'Cebula': [
    { r: 0.3, a: 90 }, { r: 0.5, a: 150 }, { r: 0.7, a: 210 },
    { r: 0.4, a: 270 }, { r: 0.6, a: 330 }, { r: 0.55, a: 30 }
  ],
  'Boczek': [
    { r: 0.4, a: 30 }, { r: 0.6, a: 110 }, { r: 0.5, a: 190 },
    { r: 0.65, a: 270 }, { r: 0.3, a: 350 }
  ],
  'Czarne Oliwki': [
    { r: 0.2, a: 0 }, { r: 0.4, a: 60 }, { r: 0.6, a: 120 },
    { r: 0.3, a: 180 }, { r: 0.5, a: 240 }, { r: 0.7, a: 300 },
    { r: 0.45, a: 340 }, { r: 0.65, a: 40 }
  ],
  'Zielona Papryka': [
    { r: 0.3, a: 100 }, { r: 0.5, a: 160 }, { r: 0.7, a: 220 },
    { r: 0.4, a: 280 }, { r: 0.65, a: 340 }, { r: 0.55, a: 40 }
  ],
  'Ananas': [
    { r: 0.25, a: 20 }, { r: 0.45, a: 80 }, { r: 0.65, a: 140 },
    { r: 0.35, a: 200 }, { r: 0.55, a: 260 }, { r: 0.6, a: 320 }
  ],
  'Szpinak': [
    { r: 0.3, a: 80 }, { r: 0.5, a: 140 }, { r: 0.7, a: 200 },
    { r: 0.4, a: 260 }, { r: 0.6, a: 320 }, { r: 0.5, a: 20 }
  ],
  'Extra Ser': [
    { r: 0.15, a: 0 }, { r: 0.35, a: 90 }, { r: 0.45, a: 180 },
    { r: 0.3, a: 270 }, { r: 0.5, a: 45 }, { r: 0.6, a: 225 }
  ],
};

const renderToppingVisual = (name: string) => {
  switch (name) {
    case 'Pepperoni':
      return <div className="w-8 h-8 sm:w-11 sm:h-11 bg-red-600 rounded-full border-[3px] border-red-800 shadow-md flex items-center justify-center scale-90" />;
    case 'Salami':
      return <div className="w-8 h-8 sm:w-11 sm:h-11 bg-red-700 rounded-full border-[2px] border-red-950 shadow-md flex items-center justify-center scale-95 opacity-90" />;
    case 'Pieczarki':
      return (
        <div className="w-7 h-6 sm:w-9 sm:h-8 flex flex-col items-center justify-center">
          <div className="w-7 h-3.5 bg-amber-100/90 rounded-t-full border border-amber-300/40" />
          <div className="w-2 h-2.5 bg-amber-100/80 -mt-0.5 border-x border-b border-amber-300/40" />
        </div>
      );
    case 'Cebula':
      return <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 sm:border-3 border-purple-500 bg-transparent opacity-85 shadow-sm" />;
    case 'Boczek':
      return <div className="w-4 h-9 sm:w-6 sm:h-13 bg-gradient-to-r from-red-700 via-amber-100 to-red-800 rounded-sm shadow-sm rotate-[15deg]" />;
    case 'Czarne Oliwki':
      return <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[4px] sm:border-[5px] border-zinc-950 bg-transparent shadow-md" />;
    case 'Zielona Papryka':
      return <div className="w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-green-600 rounded-tl-full opacity-80" />;
    case 'Ananas':
      return <div className="w-5 h-4 sm:w-7 sm:h-6 bg-amber-400 border border-amber-600/30 rounded-md shadow-sm skew-x-6" />;
    case 'Szpinak':
      return <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-800 rounded-full rounded-tr-[1.5rem] opacity-75 shadow-sm rotate-[25deg]" />;
    case 'Extra Ser':
      return <div className="w-8 h-8 sm:w-11 sm:h-11 bg-yellow-200/50 rounded-full blur-[4px] border border-yellow-300/30" />;
    default:
      return (
        <div className="w-7 h-7 sm:w-9 sm:h-9 glass-premium text-white rounded-full flex items-center justify-center font-black text-[9px] sm:text-xs shadow-2xl border border-white/10">
          {name[0]}
        </div>
      );
  }
};

export default function BuilderPage() {
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [pizzaSize, setPizzaSize] = useState<'S' | 'M' | 'L'>('M');
  const [crustType, setCrustType] = useState<'THIN' | 'CLASSIC' | 'THICK'>('CLASSIC');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MEAT' | 'VEGGIE' | 'EXTRA'>('ALL');
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const sizePriceAdjustment = pizzaSize === 'S' ? 0 : pizzaSize === 'M' ? 8 : 15;
  const crustPriceAdjustment = crustType === 'THICK' ? 4 : 0;
  const totalPrice = BASE_PRICE + sizePriceAdjustment + crustPriceAdjustment + selectedToppings.reduce((sum, t) => sum + t.price, 0);

  const filteredToppings = activeCategory === 'ALL' 
    ? TOPPINGS 
    : TOPPINGS.filter(t => TOPPING_CATEGORIES[activeCategory].includes(t.name));

  const handleAddToCart = () => {
    const sizeLabel = pizzaSize === 'S' ? 'Mała (30cm)' : pizzaSize === 'M' ? 'Średnia (40cm)' : 'Duża (50cm)';
    const crustLabel = crustType === 'THIN' ? 'Cienkie ciasto' : crustType === 'CLASSIC' ? 'Klasyczne ciasto' : 'Grube ciasto';

    const customPizza: Pizza = {
      id: `custom-${Date.now()}`,
      name: 'Własna Kompozycja',
      description: `${sizeLabel}, ${crustLabel}. Składniki: ${selectedToppings.map(t => t.name).join(', ') || 'Tylko Ser'}`,
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      toppings: selectedToppings,
      isCustom: true,
    };
    addItem(customPizza);
    navigate('/cart');
  };

  return (
    <div className="bg-[#0a0a0b] min-h-screen pb-40">
      {/* Intro Header */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 glass-premium px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] text-primary mb-10"
        >
          <ChefHat className="h-4 w-4" />
          Zostań Mistrzem Kuchni
        </motion.div>
        
        <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]">
          ZBUDUJ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">WŁASNĄ</span>
        </h2>
      </section>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20">
          {/* Lewy Panel: Wizualizacja (Midnight Studio) */}
        <div className="flex-1 lg:sticky lg:top-32 h-fit">
          <div className="relative aspect-[4/3] sm:aspect-square rounded-[2rem] md:rounded-[4rem] bg-[#141416] border border-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden p-6 md:p-12 group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="absolute -inset-10 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="relative w-full h-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] aspect-square flex items-center justify-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: pizzaSize === 'S' ? 0.85 : pizzaSize === 'M' ? 1.0 : 1.1
                }}
                transition={{ 
                  rotate: { duration: 180, repeat: Infinity, ease: "linear" },
                  scale: { type: "spring", stiffness: 100, damping: 15 }
                }}
                className="relative w-full h-full"
              >
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=98" 
                  className={`w-full h-full object-cover rounded-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] ring-2 ring-white/5 transition-all duration-500 ${
                    crustType === 'THIN' ? 'border-[4px] sm:border-[8px]' : crustType === 'CLASSIC' ? 'border-[8px] sm:border-[16px]' : 'border-[12px] sm:border-[24px]'
                  } border-[#1c1c1e]`}
                  alt="Baza pizzy" 
                />
                
                <AnimatePresence>
                  {selectedToppings.flatMap((t, toppingIdx) => {
                    const offsets = TOPPING_OFFSETS[t.name] || [{ r: 0.4, a: toppingIdx * 45 }];
                    return offsets.map((offset, idx) => {
                      const x = Math.cos((offset.a * Math.PI) / 180) * offset.r * 100;
                      const y = Math.sin((offset.a * Math.PI) / 180) * offset.r * 100;
                      return (
                        <motion.div
                          key={`${t.id}-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 150, damping: 15, delay: idx * 0.03 }}
                          className="absolute pointer-events-none z-10"
                          style={{
                            left: `calc(50% + ${x * 0.75}%)`,
                            top: `calc(50% + ${y * 0.75}%)`,
                          }}
                        >
                          <div style={{ transform: 'translate(-50%, -50%)' }}>
                            {renderToppingVisual(t.name)}
                          </div>
                        </motion.div>
                      );
                    });
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
 
            <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 z-20">
              <motion.div 
                layout
                className="glass-premium p-4 sm:p-10 rounded-[1.8rem] sm:rounded-[3rem] text-white flex items-center justify-between shadow-3xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-30" />
                <div>
                  <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1 sm:mb-3">Suma</p>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-2xl sm:text-5xl font-black text-white">{totalPrice.toFixed(0)}</span>
                    <span className="text-[8px] sm:text-sm font-black text-primary uppercase tracking-widest">PLN</span>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-[#ff6a00] text-white px-5 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-primary/30 cursor-pointer"
                >
                  DODAJ
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Prawy Panel: Składniki i Konfiguracja */}
        <div className="flex-1 space-y-16">
          
          {/* Rozmiar i Ciasto */}
          <div className="glass-premium p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/5 space-y-8 sm:space-y-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">1. Wybierz Rozmiar</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { id: 'S', label: 'Mała', desc: '30cm', price: '+0 PLN' },
                  { id: 'M', label: 'Średnia', desc: '40cm', price: '+8 PLN' },
                  { id: 'L', label: 'Duża', desc: '50cm', price: '+15 PLN' },
                ].map(sizeOpt => (
                  <button
                    key={sizeOpt.id}
                    onClick={() => setPizzaSize(sizeOpt.id as any)}
                    className={`p-3 sm:p-6 rounded-2xl sm:rounded-[1.8rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      pizzaSize === sizeOpt.id
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider">{sizeOpt.label}</span>
                    <span className="text-[8px] sm:text-[10px] font-bold mt-0.5 sm:mt-1 opacity-70">{sizeOpt.desc}</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-primary mt-1 sm:mt-2">{sizeOpt.price}</span>
                  </button>
                ))}
              </div>
            </div>
 
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">2. Wybierz Ciasto</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { id: 'THIN', label: 'Cienkie', desc: 'Cienkie', price: '+0 PLN' },
                  { id: 'CLASSIC', label: 'Klasyczne', desc: 'Klasyczne', price: '+0 PLN' },
                  { id: 'THICK', label: 'Grube', desc: 'Puszyste', price: '+4 PLN' },
                ].map(crustOpt => (
                  <button
                    key={crustOpt.id}
                    onClick={() => setCrustType(crustOpt.id as any)}
                    className={`p-3 sm:p-6 rounded-2xl sm:rounded-[1.8rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      crustType === crustOpt.id
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider">{crustOpt.label}</span>
                    <span className="text-[8px] sm:text-[10px] font-bold mt-0.5 sm:mt-1 opacity-70">{crustOpt.desc}</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-primary mt-1 sm:mt-2">{crustOpt.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {/* Wybór Dodatków */}
          <div className="space-y-6 sm:space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">3. Dobierz Składniki</h4>
            <div className="flex flex-wrap gap-2 sm:gap-4">
            {['ALL', 'MEAT', 'VEGGIE', 'EXTRA'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-[0_10px_30px_rgba(255,77,0,0.3)] scale-105' 
                    : 'glass-premium text-white/40 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat === 'ALL' ? 'Wszystkie' : cat === 'MEAT' ? 'Mięsne' : cat === 'VEGGIE' ? 'Warzywne' : 'Dodatki'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredToppings.map((topping) => {
                const isSelected = selectedToppings.find(t => t.id === topping.id);
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`group flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-2xl' 
                        : 'border-white/5 bg-[#141416] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
                        isSelected ? 'bg-primary text-white rotate-12 scale-110 shadow-lg' : 'bg-white/[0.03] text-white/20'
                      }`}>
                        {topping.name[0]}
                      </div>
                      <div className="text-left">
                        <span className={`block font-black uppercase text-xs tracking-[0.1em] ${isSelected ? 'text-white' : 'text-white/60'}`}>
                          {topping.name}
                        </span>
                        <span className="text-[10px] font-black text-primary/60 mt-1 block">+{topping.price.toFixed(2)} PLN</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {isSelected ? (
                        <div className="bg-primary p-2 rounded-full shadow-lg">
                          <Check className="h-3.5 w-3.5 text-white stroke-[5px]" />
                        </div>
                      ) : (
                        <div className="bg-white/[0.03] p-2 rounded-full border border-white/5 group-hover:border-primary/50 transition-colors">
                          <Plus className="h-3.5 w-3.5 text-white/10 group-hover:text-primary transition-colors" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="bg-primary/5 border border-primary/10 p-12 rounded-[4rem] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Twoja Kompozycja</h4>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-12 min-h-[60px]">
                {selectedToppings.length > 0 ? (
                  selectedToppings.map(t => (
                    <span key={t.id} className="bg-white/5 px-5 py-2.5 rounded-full text-[10px] font-black text-primary border border-primary/20 shadow-xl uppercase tracking-widest">
                      {t.name}
                    </span>
                  ))
                ) : (
                  <span className="text-white/20 italic text-sm font-medium">Czekamy na Twoją inwencję...</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                 <div className="flex items-center gap-4 px-6 py-4 glass-premium rounded-3xl">
                    <Zap size={20} className="text-[#ffb800] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Wypiek: 90 sekund</span>
                 </div>
                 <button
                  onClick={handleAddToCart}
                  className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-primary hover:text-white active:scale-95 shadow-3xl shadow-white/5"
                >
                  Dodaj do Koszyka
                </button>
            </div>
            
             <PizzaIcon className="absolute -right-16 -bottom-16 w-64 h-64 text-primary opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-45 pointer-events-none" />
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
