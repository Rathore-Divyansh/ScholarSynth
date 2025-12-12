import React, { useEffect, useState } from 'react';
import { PaperAnalysis, RelatedPaper } from '../types';
import { findRelatedPapers } from '../services/geminiService';
import { ExternalLink, Search, Book, Loader2 } from 'lucide-react';

interface RelatedPapersProps {
  analysis: PaperAnalysis;
}

export const RelatedPapers: React.FC<RelatedPapersProps> = ({ analysis }) => {
  const [papers, setPapers] = useState<RelatedPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      const results = await findRelatedPapers(analysis.title, analysis.objectives);
      setPapers(results);
      setLoading(false);
    };

    fetchPapers();
  }, [analysis.title]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p>Searching for related research papers...</p>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-3">
        <Search className="w-10 h-10" />
        <p>No related papers found. Try checking the references in the original PDF.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {papers.map((paper, idx) => (
        <a 
          key={idx} 
          href={paper.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">
                <Book className="w-3 h-3" />
                <span>{paper.source}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-400">
            {paper.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 truncate">
            {paper.uri}
          </p>
        </a>
      ))}
    </div>
  );
};