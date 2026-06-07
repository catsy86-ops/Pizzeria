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
          <div className="relative aspect-square rounded-[4rem] bg-[#141416] border border-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden p-12 group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="absolute -inset-10 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="relative w-full h-full max-w-[500px] aspect-square flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                className={`relative w-full h-full transition-all duration-500 ${
                  pizzaSize === 'S' ? 'scale-90' : pizzaSize === 'M' ? 'scale-100' : 'scale-110'
                }`}
              >
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=98" 
                  className={`w-full h-full object-cover rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] ring-2 ring-white/5 transition-all duration-500 ${
                    crustType === 'THIN' ? 'border-[8px]' : crustType === 'CLASSIC' ? 'border-[16px]' : 'border-[24px]'
                  } border-[#1c1c1e]`}
                  alt="Baza pizzy" 
                />
                
                <AnimatePresence>
                  {selectedToppings.map((t, idx) => (
                    <motion.div
                      key={t.id}
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ rotate: `${(idx * 45) + (Math.random() * 10)}deg` }}
                    >
                      <div className="w-16 h-16 glass-premium text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-2xl border border-white/10 translate-x-32 md:translate-x-48">
                        {t.name[0]}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
              <motion.div 
                layout
                className="glass-premium p-10 rounded-[3rem] text-white flex items-center justify-between shadow-3xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-30" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Wartość Twojego Dzieła</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{totalPrice.toFixed(0)}</span>
                    <span className="text-sm font-black text-primary uppercase tracking-widest">PLN</span>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-[#ff6a00] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-primary/30 cursor-pointer"
                >
                  GOTOWE
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Prawy Panel: Składniki i Konfiguracja */}
        <div className="flex-1 space-y-16">
          
          {/* Rozmiar i Ciasto */}
          <div className="glass-premium p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">1. Wybierz Rozmiar</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'S', label: 'Mała', desc: '30cm', price: '+0 PLN' },
                  { id: 'M', label: 'Średnia', desc: '40cm', price: '+8 PLN' },
                  { id: 'L', label: 'Duża', desc: '50cm', price: '+15 PLN' },
                ].map(sizeOpt => (
                  <button
                    key={sizeOpt.id}
                    onClick={() => setPizzaSize(sizeOpt.id as any)}
                    className={`p-6 rounded-[1.8rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      pizzaSize === sizeOpt.id
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-xs uppercase tracking-wider">{sizeOpt.label}</span>
                    <span className="text-[10px] font-bold mt-1 opacity-70">{sizeOpt.desc}</span>
                    <span className="text-[9px] font-black text-primary mt-2">{sizeOpt.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">2. Wybierz Ciasto</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'THIN', label: 'Cienkie', desc: 'Cienkie', price: '+0 PLN' },
                  { id: 'CLASSIC', label: 'Klasyczne', desc: 'Klasyczne', price: '+0 PLN' },
                  { id: 'THICK', label: 'Grube', desc: 'Puszyste', price: '+4 PLN' },
                ].map(crustOpt => (
                  <button
                    key={crustOpt.id}
                    onClick={() => setCrustType(crustOpt.id as any)}
                    className={`p-6 rounded-[1.8rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      crustType === crustOpt.id
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-xs uppercase tracking-wider">{crustOpt.label}</span>
                    <span className="text-[10px] font-bold mt-1 opacity-70">{crustOpt.desc}</span>
                    <span className="text-[9px] font-black text-primary mt-2">{crustOpt.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wybór Dodatków */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">3. Dobierz Składniki</h4>
            <div className="flex flex-wrap gap-4">
            {['ALL', 'MEAT', 'VEGGIE', 'EXTRA'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
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
            
            <PizzaIcon className="absolute -right-16 -bottom-16 w-64 h-64 text-primary opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
