import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col font-sans antialiased text-white selection:bg-primary selection:text-white">
      {/* Branding & Nav u góry */}
      <TopNav />
      
      {/* Treść Główna - odsunięta od góry i dołu (na mobile) */}
      <main className="flex-grow pt-24 md:pt-32 pb-36 md:pb-0 px-2 sm:px-4 md:px-0">
        <Outlet />
      </main>

      <footer className="hidden md:block bg-[#050505] text-white/20 py-32 relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-10 opacity-40">
            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
              <span className="text-white font-black">F</span>
            </div>
            <span className="text-white font-black text-3xl tracking-tighter uppercase italic">uFisza</span>
          </div>
          <p className="font-black text-[10px] tracking-[0.5em] uppercase opacity-30 max-w-md mx-auto leading-relaxed">
            Mistrzowska Pizza Rzemieślnicza. <br /> Projektujemy smak od 2026 roku.
          </p>
          <div className="mt-16 pt-10 border-t border-white/[0.03] flex justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] opacity-20">
             <span>Prywatność</span>
             <span>Regulamin</span>
             <span>Kontakt</span>
          </div>
        </div>
      </footer>

      {/* Natywna nawigacja dolna na mobile (Midnight Style) */}
      <BottomNav />
    </div>
  );
}
