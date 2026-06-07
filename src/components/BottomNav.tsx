import { NavLink } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Home, UtensilsCrossed, Pizza as PizzaIcon, ShoppingBag, MapPin } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function BottomNav() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Start' },
    { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/builder', icon: PizzaIcon, label: 'Kreator' },
    { to: '/cart', icon: ShoppingBag, label: 'Koszyk', badge: itemCount },
    { to: '/order', icon: MapPin, label: 'Status' },
  ];

  const containerVariants: Variants = {
    hidden: { y: 100 },
    visible: { y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <motion.nav 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="md:hidden fixed bottom-6 left-6 right-6 z-[100]"
    >
      <div className="glass-premium rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-2">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center w-full h-full group
                ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[#141416] shadow-lg animate-neon">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-2 transition-colors ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active-pill-mobile"
                      className="absolute bottom-1.5 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#ff4d00]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
