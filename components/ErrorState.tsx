import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        {message}
      </p>

      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
};