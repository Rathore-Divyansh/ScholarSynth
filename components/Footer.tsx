import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Brand */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                        Scholar<span className="text-primary-600 dark:text-primary-400">Synth</span>
                    </span>
                </div>
                
                <p className="hidden md:block text-slate-400 dark:text-slate-500 text-sm border-l border-slate-200 dark:border-slate-800 pl-6 h-5 flex items-center">
                    Accelerating research with AI.
                </p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a 
                    key={i} 
                    href="#" 
                    className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                    <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <p>
                © {new Date().getFullYear()} ScholarSynth AI. All rights reserved.
            </p>
            <div className="flex gap-6 font-medium">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};