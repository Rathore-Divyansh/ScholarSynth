import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PaperAnalysis, ChatMessage } from '../types';
import { Target, Search, Database, Cpu, BarChart2, AlertTriangle, ArrowLeft, Download, FileText, Code, Layers, MessageSquare, Globe, Play, Pause, Quote, X, Check, GraduationCap, Calculator, HelpCircle, ChevronRight, Zap, Sigma, Maximize2, MousePointerClick } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { RelatedPapers } from './RelatedPapers';
import { generateAudioOverview } from '../services/geminiService';
import { Chat } from '@google/genai';
import katex from 'katex';

interface AnalysisDashboardProps {
  analysis: PaperAnalysis;
  file: File;
  onNewAnalysis: () => void;
}

// Wrapper for KaTeX rendering using imported module
const LatexEquation: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
        let cleanLatex = children || '';
        cleanLatex = cleanLatex.trim();
        
        // Strip markdown code block delimiters if present
        cleanLatex = cleanLatex.replace(/^```latex/, '').replace(/^```/, '').replace(/```$/, '');
        
        // Strip wrapping delimiters if present
        if (cleanLatex.startsWith('$$') && cleanLatex.endsWith('$$')) {
            cleanLatex = cleanLatex.slice(2, -2);
        } else if (cleanLatex.startsWith('$') && cleanLatex.endsWith('$')) {
            cleanLatex = cleanLatex.slice(1, -1);
        }
        
        const rendered = katex.renderToString(cleanLatex, {
            throwOnError: false,
            displayMode: true,
            output: 'html',
            fleqn: false,
            trust: true
        });
        
        setHtml(rendered);
        setError(false);
    } catch (e) {
        console.warn("KaTeX render failed:", e);
        setError(true);
    }
  }, [children]);

  if (error) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg overflow-x-auto">
            <p className="text-xs text-red-500 dark:text-red-400 font-bold mb-1 uppercase tracking-wide">Equation Render Failed</p>
            <code className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre">{children}</code>
        </div>
      );
  }

  if (!html) {
      return <div className="h-12 w-full" />;
  }

  return (
    <div 
        className={`w-full overflow-x-auto overflow-y-hidden py-6 text-center text-slate-800 dark:text-slate-200 ${className || 'text-lg md:text-xl'}`}
        dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

// Component for Interactive Equation Card
const InteractiveEquationCard: React.FC<{ eq: PaperAnalysis['studyGuide']['equations'][0], index: number, delay: number }> = ({ eq, index, delay }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeVar, setActiveVar] = useState<number | null>(null);

    return (
        <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors relative flex flex-col h-full animate-fade-in-up opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            {/* Header */}
            <div className="px-6 pt-5 pb-2 flex justify-between items-start">
                 <div className="flex items-center gap-2 mb-2">
                    <Sigma className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{eq.name || `Equation ${index+1}`}</h4>
                </div>
                <button 
                    onClick={() => setIsZoomed(true)} 
                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800" 
                    title="Zoom Equation"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {/* Equation */}
            <div className="bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 px-4 py-8 flex items-center justify-center relative min-h-[8rem]">
                 <div className="w-full max-w-full">
                    <LatexEquation>{eq.equation}</LatexEquation>
                 </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-6">
                    <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Explanation</h5>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{eq.description}</p>
                </div>

                {/* Interactive Variables */}
                <div className="mt-auto">
                     <div className="flex items-center gap-2 mb-3">
                        <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Interactive Variables</h5>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full font-bold border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> Click symbols
                        </span>
                     </div>
                     
                     <div className="flex flex-wrap gap-2 mb-4">
                        {eq.variables.map((v, i) => (
                            <button 
                                key={i}
                                onClick={() => setActiveVar(activeVar === i ? null : i)}
                                className={`
                                    min-w-[2.5rem] h-10 px-3 rounded-lg font-mono font-bold text-sm border shadow-sm transition-all
                                    ${activeVar === i 
                                        ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900 transform scale-105' 
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }
                                `}
                            >
                                {v.symbol}
                            </button>
                        ))}
                     </div>

                     <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 min-h-[4.5rem] flex items-center shadow-inner">
                        {activeVar !== null && eq.variables[activeVar] ? (
                             <div className="animate-fade-in w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 rounded text-sm">{eq.variables[activeVar].symbol}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide font-bold">Definition</span>
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 font-medium block leading-snug">{eq.variables[activeVar].meaning}</span>
                             </div>
                        ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-sm italic flex items-center gap-2">
                                <MousePointerClick className="w-4 h-4 opacity-50" />
                                Click a variable symbol above to see its definition.
                            </span>
                        )}
                     </div>
                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsZoomed(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <Sigma className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{eq.name}</h3>
                            </div>
                            <button onClick={() => setIsZoomed(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                                <X className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                            </button>
                        </div>
                        
                        <div className="py-12 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 mb-8 flex items-center justify-center overflow-x-auto shadow-inner">
                             <div className="w-full px-8">
                                <LatexEquation className="text-2xl md:text-4xl">{eq.equation}</LatexEquation>
                             </div>
                        </div>
                        
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                             <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Detailed Breakdown</h4>
                             <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{eq.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// Modern Card Component
const Card: React.FC<{ 
    title: string; 
    icon?: React.ElementType; 
    children: React.ReactNode; 
    className?: string;
    action?: React.ReactNode;
    color?: 'blue' | 'indigo' | 'slate' | 'emerald' | 'rose';
    delay?: number;
}> = ({ title, icon: Icon, children, className = "", action, color = 'indigo', delay = 0 }) => {
    
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    };

    return (
        <div 
            className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col opacity-0 animate-fade-in-up ${className}`}
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">{title}</h3>
                </div>
                {action}
            </div>
            <div className="p-6 text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
                {children}
            </div>
        </div>
    );
};

const ListItems: React.FC<{ items: string[]; emptyText?: string }> = ({ items, emptyText = "None identified." }) => {
    if (!items || items.length === 0) return <p className="text-slate-400 dark:text-slate-500 italic">{emptyText}</p>;
    
    return (
        <ul className="space-y-3">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, file, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'methodology' | 'study' | 'chat'>('insights');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio when url changes
  useEffect(() => {
    if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  const toggleAudio = async () => {
      if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
      } else {
          if (!audioUrl) {
              setIsGeneratingAudio(true);
              try {
                  const summaryText = `Analysis of ${analysis.title}. ${analysis.objectivesEli5}. ${analysis.conclusion.summaryEli5}`;
                  const base64Audio = await generateAudioOverview(summaryText);
                  const blob = await (await fetch(`data:audio/mp3;base64,${base64Audio}`)).blob();
                  const url = URL.createObjectURL(blob);
                  setAudioUrl(url);
                  // Need to wait a tick for useEffect to create audioRef
                  setTimeout(() => {
                    audioRef.current?.play();
                    setIsPlaying(true);
                  }, 100);
              } catch (e) {
                  console.error("Audio generation failed", e);
                  alert("Failed to generate audio summary.");
              } finally {
                  setIsGeneratingAudio(false);
              }
          } else {
              audioRef.current?.play();
              setIsPlaying(true);
          }
      }
  };

  const tabs = [
    { id: 'insights', label: 'Key Insights', icon: Zap },
    { id: 'methodology', label: 'Methodology & Code', icon: Layers },
    { id: 'study', label: 'Study Guide', icon: GraduationCap },
    { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-2 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
         
         <button 
            onClick={onNewAnalysis}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
         >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Upload New</span>
         </button>

         <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto max-w-full no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        data-state={isActive ? 'active' : 'inactive'}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300 relative
                            ${isActive 
                                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                            }
                        `}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        {tab.label}
                    </button>
                );
            })}
         </div>

         <div className="flex items-center gap-2">
            <button 
                onClick={toggleAudio}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                    ${isPlaying 
                        ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                `}
            >
                {isGeneratingAudio ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                ) : (
                    <Play className="w-4 h-4 fill-current" />
                )}
                <span className="hidden sm:inline">{isPlaying ? 'Playing Summary' : 'Listen'}</span>
            </button>
         </div>
      </div>

      {/* Header Info */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-900 dark:to-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden animate-scale-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/10">
                    {analysis.citation.publicationDate}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/10">
                    {analysis.citation.journalOrConference}
                </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight max-w-4xl">
                {analysis.title}
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl font-medium leading-relaxed mb-8">
                By {analysis.authors.join(", ")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                        <Target className="w-4 h-4" />
                        Objective (Simplified)
                    </div>
                    <p className="text-sm md:text-base leading-relaxed">
                        {analysis.objectivesEli5}
                    </p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                        <Quote className="w-4 h-4" />
                        Bottom Line
                    </div>
                    <p className="text-sm md:text-base leading-relaxed">
                        {analysis.conclusion.summaryEli5}
                    </p>
                 </div>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        
        {/* TAB 1: KEY INSIGHTS */}
        {activeTab === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Core Analysis */}
                <div className="lg:col-span-8 space-y-6 animate-slide-in-left opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Key Objectives" icon={Target} color="blue" delay={400}>
                            <ListItems items={analysis.objectives} />
                        </Card>
                        <Card title="Gaps Addressed" icon={AlertTriangle} color="rose" delay={500}>
                            <ListItems items={analysis.gaps.fulfilled} emptyText="No specific gap fulfillment explicitly stated." />
                        </Card>
                    </div>

                    <Card title="Results & Evaluation" icon={BarChart2} color="emerald" delay={600}>
                        <p className="mb-6 font-medium text-slate-700 dark:text-slate-300">{analysis.evaluation.resultsSummary}</p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/30">
                            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">Key Metrics</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.evaluation.metrics.length > 0 ? (
                                    analysis.evaluation.metrics.map((m, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                            {m}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-emerald-600/70 dark:text-emerald-400/70 italic">No specific metrics extracted.</span>
                                )}
                            </div>
                        </div>
                    </Card>

                     <Card title="Future Work & Limitations" icon={ChevronRight} color="slate" delay={700}>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Limitations
                                </h4>
                                <ListItems items={analysis.conclusion.drawbacks} />
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div>
                                <h4 className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> Future Directions
                                </h4>
                                <ListItems items={analysis.conclusion.futureWork} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Context */}
                <div className="lg:col-span-4 space-y-6 animate-slide-in-right opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                    <Card title="Datasets Used" icon={Database} color="indigo" delay={800}>
                        <ListItems items={analysis.datasets} emptyText="No specific datasets mentioned." />
                    </Card>

                    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-lg animate-fade-in-up opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-bold text-lg">Related Research</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">Found on the web based on analysis.</p>
                        <RelatedPapers analysis={analysis} />
                    </div>
                </div>
            </div>
        )}


        {/* TAB 2: METHODOLOGY */}
        {activeTab === 'methodology' && (
            <div className="space-y-8 animate-fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Proposed Method" icon={Cpu} className="h-full" delay={100}>
                        <div className="space-y-6">
                             <div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Architecture Name</span>
                                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.methodology.approachName}</p>
                             </div>
                             <div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Description</span>
                                <p className="leading-relaxed">{analysis.methodology.description}</p>
                             </div>
                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">Key Algorithms</span>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.methodology.keyAlgorithms.map((alg, i) => (
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-600">
                                            {alg}
                                        </span>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </Card>

                     <Card title="Implementation Steps" icon={Layers} className="h-full" delay={200}>
                        <div className="relative pl-4 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                            {analysis.implementation.steps.map((step, i) => (
                                <div key={i} className="relative pl-6 group">
                                    <div className="absolute left-[-21px] top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-500 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center font-bold text-sm transition-all shadow-sm">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors pt-1">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                 </div>

                 <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-[#1e1e1e] animate-scale-in opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                    <div className="bg-[#2d2d2d] px-6 py-3 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-indigo-400" />
                            <span className="font-bold text-slate-200">Prototype Implementation</span>
                        </div>
                        <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed text-indigo-100">
                            <code>{analysis.implementation.codeSnippet}</code>
                        </pre>
                    </div>
                 </div>
            </div>
        )}

        {/* TAB 3: STUDY GUIDE */}
        {activeTab === 'study' && (
             <div className="space-y-12 animate-fade-in">
                
                {/* Equations Section */}
                <div>
                     <div className="flex items-center gap-3 mb-6 animate-slide-in-left opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Core Equations</h2>
                            <p className="text-slate-500 dark:text-slate-400">Interactive breakdown of the math behind the paper.</p>
                        </div>
                     </div>
                     
                     {analysis.studyGuide.equations.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                            {analysis.studyGuide.equations.map((eq, i) => (
                                <InteractiveEquationCard key={i} eq={eq} index={i} delay={200 + (i * 100)} />
                            ))}
                        </div>
                     ) : (
                         <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 animate-fade-in-up">
                             <p className="text-slate-400 dark:text-slate-500">No complex equations extracted from this paper.</p>
                         </div>
                     )}
                </div>
                
                {/* Quiz Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6 animate-slide-in-left opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                            <HelpCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        </div>
                         <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Check</h2>
                            <p className="text-slate-500 dark:text-slate-400">Test your understanding of the core concepts.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysis.studyGuide.quiz.map((q, i) => (
                            <QuizCard key={i} question={q} index={i} delay={500 + (i * 100)} />
                        ))}
                    </div>
                </div>
             </div>
        )}

        {/* TAB 4: CHAT */}
        {activeTab === 'chat' && (
            <div className="animate-scale-in h-full opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <ChatInterface 
                    file={file} 
                    chatSession={chatSession} 
                    setChatSession={setChatSession}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                />
            </div>
        )}

      </div>
    </div>
  );
};

// Sub-component for Quiz to manage individual state
const QuizCard: React.FC<{ question: PaperAnalysis['studyGuide']['quiz'][0], index: number, delay: number }> = ({ question, index, delay }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const isCorrect = selected === question.correctAnswerIndex;

    const handleSelect = (idx: number) => {
        if (selected !== null) return; // Prevent changing answer
        setSelected(idx);
        setShowExplanation(true);
    };

    return (
        <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Question {index + 1}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-6 leading-snug">{question.question}</h4>
            
            <div className="space-y-3 mb-6">
                {question.options.map((opt, optIdx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border transition-all relative ";
                    if (selected === null) {
                        btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800";
                    } else if (optIdx === question.correctAnswerIndex) {
                        btnClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold";
                    } else if (selected === optIdx) {
                        btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400 opacity-60";
                    } else {
                        btnClass += "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed";
                    }

                    return (
                        <button 
                            key={optIdx}
                            onClick={() => handleSelect(optIdx)}
                            disabled={selected !== null}
                            className={btnClass}
                        >
                            <span className="mr-3 font-mono text-sm opacity-50">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                            {selected !== null && optIdx === question.correctAnswerIndex && (
                                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            )}
                             {selected === optIdx && optIdx !== question.correctAnswerIndex && (
                                <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </button>
                    );
                })}
            </div>

            {showExplanation && (
                 <div className={`p-4 rounded-xl text-sm leading-relaxed border animate-fade-in ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <span className="font-bold block mb-1">{isCorrect ? 'Correct!' : 'Explanation:'}</span>
                    {question.explanation}
                 </div>
            )}
        </div>
    );
};