import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { FeaturesPage, UseCasesPage, PricingPage, DocsPage } from './components/StaticPages';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderPage = () => {
      switch(currentPage) {
          case 'features': return <FeaturesPage />;
          case 'use-cases': return <UseCasesPage />;
          case 'pricing': return <PricingPage />;
          case 'docs': return <DocsPage />;
          case 'home': 
          default: 
            return <Home />;
      }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header 
        isDark={isDarkMode} 
        toggleTheme={toggleTheme} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-20 max-w-7xl relative z-10 min-h-screen">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;