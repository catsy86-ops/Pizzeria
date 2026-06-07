import { NavLink, Link } from 'react-router-dom';
import { Home, UtensilsCrossed, Pizza as PizzaIcon, ShoppingBag, MapPin } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Start' },
    { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/builder', icon: PizzaIcon, label: 'Kreator' },
    { to: '/order', icon: MapPin, label: 'Status' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-8 pointer-events-none font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo uFisza Midnight */}
        <Link to="/" className="pointer-events-auto group">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-premium px-6 py-4 flex items-center gap-4 shadow-2xl rounded-3xl"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <PizzaIcon className="h-8 w-8 text-primary" strokeWidth={2.5} />
              </motion.div>
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-white">
              u<span className="text-primary">Fisza</span>
            </span>
          </motion.div>
        </Link>

        {/* Nawigacja Desktop (Midnight Dock) */}
        <nav className="
          pointer-events-auto
          hidden md:flex
          glass-premium
          rounded-full
          px-3 py-2
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        ">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 group
                  ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 transition-transform duration-500 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active-pill-desktop"
                        className="absolute inset-0 bg-white/[0.05] rounded-full -z-10 border border-white/5"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Akcje Prawy Rog (Midnight Style) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-4">
           <Link to="/cart" className="relative group">
              <div className="glass-premium p-4 rounded-2xl group-hover:bg-white transition-all group-hover:text-black shadow-2xl">
                 <ShoppingBag className="h-6 w-6" />
              </div>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-[#0a0a0b] shadow-xl animate-neon"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
           </Link>
        </div>

        {/* Mobile (Simplified uFisza Style) */}
        <div className="md:hidden flex gap-3 pointer-events-auto">
          <Link to="/cart" className="relative glass-premium p-4 rounded-2xl shadow-2xl">
            <ShoppingBag className="h-6 w-6 text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-[#0a0a0b] animate-neon">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
