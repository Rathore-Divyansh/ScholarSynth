import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    onNavigate: (page: string) => void;
    currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'Use Cases', id: 'use-cases' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Docs', id: 'docs' },
  ];

  const handleNavClick = (id: string) => {
      onNavigate(id);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
            isScrolled 
                ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 py-3' 
                : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div onClick={() => handleNavClick('home')} className="flex items-center gap-2 group cursor-pointer z-50">
                <div className="relative bg-gradient-to-br from-primary-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-105 duration-300">
                    <BookOpen className="w-5 h-5 text-white" />
                    <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                    </div>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    Scholar<span className="text-primary-600 dark:text-primary-400">Synth</span>
                </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                {navLinks.filter(l => l.id !== 'home').map((link) => (
                    <button 
                        key={link.id} 
                        onClick={() => handleNavClick(link.id)}
                        className={`text-sm font-medium transition-colors relative group ${
                            currentPage === link.id 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                    >
                        {link.name}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 ${currentPage === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </button>
                ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button onClick={() => handleNavClick('home')} className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5">
                    Get Started
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden z-50 p-2 text-slate-600 dark:text-slate-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-40 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
                <button 
                    key={link.id} 
                    onClick={() => handleNavClick(link.id)}
                    className={`text-2xl font-bold hover:text-primary-600 dark:hover:text-primary-400 ${
                        currentPage === link.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-slate-100'
                    }`}
                >
                    {link.name}
                </button>
            ))}
            <div className="h-px w-24 bg-slate-200 dark:bg-slate-800 my-4"></div>
            <button
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-400"
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
      </div>
    </header>
  );
};