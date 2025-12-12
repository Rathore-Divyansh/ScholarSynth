import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, ArrowUp } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setError("File size exceeds 20MB limit.");
        return;
    }
    setError(null);
    onFileSelect(file);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
            relative group cursor-pointer flex flex-col items-center justify-center w-full h-72 rounded-[2rem] border-2 border-dashed transition-all duration-500 ease-out
            ${dragActive 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105 shadow-xl shadow-primary-500/10' 
                : 'border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:-translate-y-1'
            }
        `}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative z-10">
            {/* Icon Circle */}
          <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500
                ${dragActive 
                    ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md' 
                    : 'bg-primary-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-primary-500/30 group-hover:shadow-lg'
                }
            `}>
            {dragActive ? (
                <ArrowUp className="w-8 h-8 animate-bounce" />
            ) : (
                <UploadCloud className="w-8 h-8" />
            )}
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            {dragActive ? 'Drop it like it\'s hot' : 'Upload Research Paper'}
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
            Drag & drop your PDF here, or <span className="font-semibold text-primary-600 dark:text-primary-400 underline decoration-2 underline-offset-2">browse files</span>
          </p>
          
          <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
             PDF up to 20MB
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/60 dark:border-red-800/60 rounded-xl flex items-center justify-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};