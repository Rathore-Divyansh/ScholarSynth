import React from 'react';
import { Loader2, FileText, Sparkles, BrainCircuit } from 'lucide-react';

export const LoadingState: React.FC<{ fileName: string }> = ({ fileName }) => {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center space-y-10 animate-fade-in relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/20 dark:bg-primary-900/20 rounded-full blur-[80px] -z-10 animate-pulse-slow"></div>

      <div className="relative animate-pop-in">
        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-2xl animate-float">
          <BrainCircuit className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="absolute -top-3 -right-3">
            <span className="flex h-6 w-6 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-primary-500 border-2 border-white dark:border-slate-900"></span>
            </span>
        </div>
      </div>

      <div className="space-y-4 max-w-md animate-slide-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Synthesizing Research
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Reading <span className="font-semibold text-slate-800 dark:text-slate-200">"{fileName}"</span> <br/>
          Extracting knowledge with Gemini 2.5...
        </p>
      </div>

      <div className="flex flex-col gap-3 w-72">
        {['Parsing PDF Structure', 'Extracting Key Objectives', 'Analyzing Methodology', 'Generating Study Guide'].map((step, i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 text-sm font-medium text-slate-400 dark:text-slate-500 animate-slide-in-left opacity-0" 
            style={{ animationDelay: `${400 + (i * 200)}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            {step}...
          </div>
        ))}
      </div>

    </div>
  );
};