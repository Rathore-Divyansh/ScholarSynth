import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { analyzePaper } from '../services/geminiService';
import { FileUpload } from './FileUpload';
import { AnalysisDashboard } from './AnalysisDashboard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export const Home: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus('analyzing');
    setCurrentFile(file);
    setErrorMsg('');
    setAnalysis(null);

    try {
      const result = await analyzePaper(file);
      setAnalysis(result);
      setStatus('success');
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setStatus('error');
      setErrorMsg(err.message || "Failed to analyze the paper. Please ensure the API key is valid and the file is a readable PDF.");
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setAnalysis(null);
    setCurrentFile(null);
    setErrorMsg('');
  };

  return (
    <div className="animate-fade-in">
        {status === 'idle' && (
          <div className="max-w-4xl mx-auto text-center space-y-10 pt-10 pb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-primary-600 dark:text-primary-400 shadow-sm mb-4 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Powered by Gemini 2.5 Flash
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight animate-scale-in" style={{ animationDelay: '100ms' }}>
                Research papers, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                  simplified instantly.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                Upload any PDF to extract objectives, methodologies, gaps, and prototypes. 
                Turn dense academic text into clear, actionable insights.
              </p>
            </div>
            <div className="mt-12 animate-pop-in opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                {['Interactive Chat', 'Study Guide Generator', 'Code Extraction', 'Audio Summary'].map((feature, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${700 + (i * 100)}ms`, animationFillMode: 'forwards' }}
                    >
                        {feature}
                    </span>
                ))}
            </div>
          </div>
        )}

        {status === 'analyzing' && currentFile && (
          <LoadingState fileName={currentFile.name} />
        )}

        {status === 'error' && (
          <ErrorState message={errorMsg} onRetry={handleReset} />
        )}

        {status === 'success' && analysis && currentFile && (
          <AnalysisDashboard analysis={analysis} file={currentFile} onNewAnalysis={handleReset} />
        )}
    </div>
  );
};