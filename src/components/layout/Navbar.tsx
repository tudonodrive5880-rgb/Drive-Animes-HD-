import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Animes', path: '/catalog/anime' },
    { name: 'Filmes', path: '/catalog/movie' },
    { name: 'Séries', path: '/catalog/series' },
    { name: 'Lançamentos', path: '#' }
  ];

  const libLinks = [
    { name: 'Favoritos', path: '/mylist' },
    { name: 'Assistir Mais Tarde', path: '#' },
    { name: 'Histórico', path: '#' },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 w-full h-[60px] bg-dark-bg/90 z-50 flex items-center justify-between px-4 border-b border-border backdrop-blur-md">
        <Link to="/" className="text-[18px] font-extrabold text-primary tracking-tight">DRIVE ANIMES HD</Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}><Menu /></button>
      </div>

      <aside className={cn(
        "fixed left-0 top-0 w-[220px] h-screen bg-sidebar border-r border-border flex flex-col z-50 transition-transform",
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-[30px] text-[20px] font-extrabold text-primary tracking-tight mb-2">
          DRIVE ANIMES HD
        </div>

        <div className="flex flex-col gap-[30px] overflow-y-auto px-[20px] pb-6 hide-scrollbar">
          <nav className="flex flex-col">
            <span className="text-[11px] uppercase text-muted tracking-[1px] mb-[15px] block">Menu Principal</span>
            {navLinks.map(l => (
              <Link key={l.name} to={l.path} onClick={() => setIsMobileOpen(false)} className={cn(
                "flex items-center px-3 py-2.5 rounded-md text-[14px] transition-colors mb-1",
                location.pathname === l.path || (l.path !== '/' && location.pathname.startsWith(l.path)) ? "bg-primary/10 text-primary font-semibold" : "text-[#c9d1d9] hover:bg-white/5"
              )}>
                {l.name}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col">
            <span className="text-[11px] uppercase text-muted tracking-[1px] mb-[15px] block">Minha Biblioteca</span>
            {libLinks.map(l => (
              <Link key={l.name} to={l.path} onClick={() => setIsMobileOpen(false)} className={cn(
                "flex items-center px-3 py-2.5 rounded-md text-[14px] transition-colors mb-1",
                location.pathname === l.path ? "bg-primary/10 text-primary font-semibold" : "text-[#c9d1d9] hover:bg-white/5"
              )}>
                {l.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <header className="fixed top-0 left-0 md:left-[220px] right-0 h-[60px] bg-[#050608]/80 backdrop-blur-[10px] hidden md:flex items-center justify-between px-[30px] z-40 border-b border-transparent">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar animes, filmes ou séries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-surface border border-border rounded-full py-2 px-5 w-[350px] text-[13px] text-white placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </form>

        <div className="flex items-center gap-[15px]">
          <span className="text-[13px] font-medium text-white">Premium</span>
          <div className="w-[32px] h-[32px] rounded-full bg-border flex items-center justify-center overflow-hidden">
            <User size={16} className="text-muted" />
          </div>
        </div>
      </header>
    </>
  );
}
