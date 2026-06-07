import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/useCartStore';
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, 
  MapPin, Clock, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StripeCheckoutForm from '../components/StripeCheckoutForm';
import { useState } from 'react';

// W realnej aplikacji ten klucz powinien być w .env
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export default function CartPage() {
  const { 
    items, removeItem, updateQuantity, getTotal,
    paymentMethod, setPaymentMethod, deliveryAddress, setAddress 
  } = useCartStore();
  const navigate = useNavigate();
  const total = getTotal();
  const [showStripe, setShowStripe] = useState(false);

  const handlePaymentSuccess = () => {
    navigate('/order');
  };

  if (items.length === 0) {
    return (
      <div className="py-24 px-4 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-premium p-16 rounded-[3rem] shadow-2xl inline-block text-white">
          <ShoppingBag className="h-20 w-20 text-white/40 mx-auto mb-8" />
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Twój koszyk jest pusty</h2>
          <Link to="/menu" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#ff6a00] transition-all hover:shadow-[0_15px_40px_rgba(255,77,0,0.4)] shadow-2xl">
            Wybierz Pizzę
            <ArrowRight className="h-6 w-6" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto font-sans text-white">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LEWA STRONA: Produkty i Detale Dostawy */}
        <div className="flex-[1.5] w-full space-y-8">
          
          {/* Adres Dostawy */}
          <div className="glass-premium p-10 rounded-[3rem] shadow-2xl border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
             
             <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Logistyka Dostawy</h3>
                <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30 shadow-lg">Dostawa Express</span>
             </div>
             
             <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-8 p-6 bg-white/[0.03] rounded-[2rem] border border-white/10 group cursor-pointer hover:bg-white/[0.06] hover:shadow-2xl transition-all duration-500">
                   <div className="w-16 h-16 glass-premium rounded-2xl shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <MapPin className="h-7 w-7 text-primary" />
                   </div>
                   <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Twój Adres</p>
                      <input 
                         type="text" 
                         value={deliveryAddress}
                         onChange={(e) => setAddress(e.target.value)}
                         className="w-full bg-transparent font-black text-white outline-none text-lg truncate border-b border-transparent focus:border-primary/50 transition-colors pb-1"
                      />
                   </div>
                   <ChevronRight className="h-6 w-6 text-white/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-6 p-6 bg-white/[0.03] rounded-[2rem] border border-white/10">
                       <div className="w-14 h-14 glass-premium rounded-2xl shadow-md flex items-center justify-center text-white">
                          <Clock className="h-6 w-6 text-orange-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Czas</p>
                          <p className="font-black text-white">~ 25 min</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20">
                       <div className="w-14 h-14 glass-premium rounded-2xl shadow-md flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                          <p className="font-black text-emerald-300 uppercase text-xs">Piekarnik gotowy</p>
                       </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Lista Produktów */}
          <div className="glass-premium p-10 rounded-[3rem] shadow-2xl border-white/5">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-10 text-white">Twoje Przedmioty</h3>
            <div className="divide-y divide-white/10">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 flex flex-col sm:flex-row items-center gap-8 group"
                  >
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shrink-0 group-hover:rotate-3 transition-transform duration-500 ring-4 ring-white/10">
                      <img src={item.pizza.image} className="w-full h-full object-cover" alt={item.pizza.name} />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="font-black text-white uppercase text-lg tracking-tight">{item.pizza.name}</h4>
                      <p className="text-gray-300 text-sm mt-1 line-clamp-1 italic font-medium">{item.pizza.description}</p>
                      <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                        <div className="flex items-center bg-white/[0.03] rounded-2xl p-1.5 border border-white/10 shadow-inner">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center glass-premium rounded-xl shadow-md hover:text-primary transition-all active:scale-90 font-bold cursor-pointer"><Minus size={18}/></button>
                          <span className="w-12 text-center font-black text-xl">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center glass-premium rounded-xl shadow-md hover:text-primary transition-all active:scale-90 font-bold cursor-pointer"><Plus size={18}/></button>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Cena</p>
                           <span className="font-black text-2xl text-white">{(item.pizza.price * item.quantity).toFixed(2)} zł</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-primary transition-colors p-3 hover:bg-white/5 rounded-2xl cursor-pointer">
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA: Płatność i Podsumowanie */}
        <div className="flex-1 w-full lg:sticky lg:top-32 space-y-8">
          
          {/* Wybór Metody */}
          {!showStripe && (
            <div className="glass-premium p-10 rounded-[3rem] shadow-2xl border-white/5">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-gray-400">Płatność</h3>
                <div className="space-y-4">
                {[
                    { id: 'CARD', label: 'Karta (Szybka)', icon: '💳' },
                    { id: 'APPLE_PAY', label: 'Apple Pay', icon: '🍎' },
                    { id: 'CASH', label: 'Gotówka', icon: '💵' },
                ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all duration-300 cursor-pointer ${
                          paymentMethod === method.id 
                          ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]' 
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                    >
                    <div className="flex items-center gap-5">
                        <span className="text-2xl">{method.icon}</span>
                        <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === method.id ? 'text-white font-extrabold' : 'text-gray-300'}`}>
                        {method.label}
                        </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-4 transition-colors ${paymentMethod === method.id ? 'border-primary bg-white' : 'border-white/20 bg-transparent'}`} />
                    </button>
                ))}
                </div>
            </div>
          )}

          {/* Podsumowanie i Stripe */}
          <div className="bg-[#141416] p-10 rounded-[3.5rem] text-white shadow-3xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
             
             {!showStripe ? (
               <>
                 <div className="space-y-5 mb-10">
                    <div className="flex justify-between text-gray-300 font-bold uppercase text-[11px] tracking-[0.2em]">
                      <span>Koszyk</span>
                      <span className="text-white">{total.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between text-gray-300 font-bold uppercase text-[11px] tracking-[0.2em]">
                      <span>Dostawa</span>
                      <span className="text-emerald-400 font-black">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-gray-300 font-bold uppercase text-[11px] tracking-[0.2em] border-b border-white/5 pb-6">
                      <span>Opłata serwisowa</span>
                      <span className="text-white">2.50 zł</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                       <span className="text-xl font-black uppercase tracking-tighter italic text-primary">Razem</span>
                       <span className="text-5xl font-black tracking-tighter">{(total + 2.5).toFixed(2)} <span className="text-lg opacity-40">zł</span></span>
                    </div>
                 </div>

                 <button
                  onClick={() => setShowStripe(true)}
                  className="w-full bg-primary text-white py-8 rounded-[2rem] font-black text-2xl hover:bg-[#ff6a00] hover:shadow-[0_15px_40px_rgba(255,77,0,0.4)] transition-all shadow-2xl shadow-black/50 flex items-center justify-center gap-6 active:scale-95 group cursor-pointer"
                >
                  PRZEJDŹ DO KASY
                  <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform" />
                </button>
               </>
             ) : (
               <div className="space-y-8">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Bezpieczna Kasa</h3>
                    <button onClick={() => setShowStripe(false)} className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest cursor-pointer">Anuluj</button>
                 </div>
                 
                 <Elements stripe={stripePromise}>
                    <StripeCheckoutForm 
                      amount={total + 2.5} 
                      onSuccess={handlePaymentSuccess} 
                    />
                 </Elements>
               </div>
             )}
             
             <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 grayscale opacity-30">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="stripe" className="h-4" />
                <div className="h-4 w-[1px] bg-white/20" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">PCI Compliant</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
