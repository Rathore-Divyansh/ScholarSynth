import React from 'react';
import { Zap, BookOpen, Code, MessageSquare, GraduationCap, Headphones, Check, Terminal, FileText, Layers, Shield, Globe, X } from 'lucide-react';

export const FeaturesPage: React.FC = () => {
    const features = [
        { icon: Zap, title: "Instant Analysis", desc: "Extract objectives, methodologies, and gaps in seconds using Gemini 2.5 Flash." },
        { icon: Code, title: "Code Prototypes", desc: "Automatically generate Python implementation snippets based on the paper's algorithms." },
        { icon: GraduationCap, title: "Study Guides", desc: "Interactive equations and generated quizzes to test your understanding." },
        { icon: Headphones, title: "Audio Summaries", desc: "Listen to research on the go with high-quality AI-generated podcasts." },
        { icon: MessageSquare, title: "Contextual Chat", desc: "Ask deep questions about the paper and get answers cited from the text." },
        { icon: Globe, title: "Related Research", desc: "Discover connected papers from the web to expand your literature review." }
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 animate-fade-in">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Powerful features for <br/> <span className="text-primary-600 dark:text-primary-400">modern researchers</span>.
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    ScholarSynth goes beyond simple summarization. We deconstruct papers into actionable knowledge blocks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="w-14 h-14 bg-primary-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors text-primary-600 dark:text-primary-400">
                            <f.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const UseCasesPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 animate-fade-in">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Who is this for?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    From undergrads to PhDs, ScholarSynth adapts to your workflow.
                </p>
            </div>

            <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            For Students
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ace your literature reviews</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Quickly scan dozens of papers to find the ones that matter. Use the Study Guide feature to prepare for exams by breaking down complex math and verifying your knowledge with quizzes.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-emerald-500" /> Explain-Like-I'm-5 summaries</li>
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-emerald-500" /> Key concept extraction</li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 h-64 bg-emerald-100 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-center">
                         <GraduationCap className="w-24 h-24 text-emerald-500/50" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            For Developers
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">From paper to code, faster</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Stop struggling to translate mathematical notation into Python. ScholarSynth identifies the methodology and generates a starter code prototype so you can begin implementation immediately.
                        </p>
                         <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-indigo-500" /> Python architecture generation</li>
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-indigo-500" /> Library identification</li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 h-64 bg-indigo-100 dark:bg-indigo-900/10 rounded-2xl flex items-center justify-center">
                         <Terminal className="w-24 h-24 text-indigo-500/50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PricingPage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 animate-fade-in">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Simple, transparent pricing
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Invest in your knowledge. Cancel anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Free Tier */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Researcher</h3>
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">$0</div>
                    <p className="text-sm text-slate-500 mb-8">Perfect for students and casual reading.</p>
                    <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Get Started</button>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-slate-900 dark:text-white" /> 5 Papers / mo</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-slate-900 dark:text-white" /> Basic Summaries</div>
                        <div className="flex items-center gap-3 text-sm text-slate-400"><X className="w-4 h-4" /> No Code Generation</div>
                    </div>
                </div>

                {/* Pro Tier */}
                <div className="bg-slate-900 dark:bg-white p-8 rounded-3xl border border-slate-900 dark:border-white shadow-2xl relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                    <h3 className="text-lg font-bold text-white dark:text-slate-900 mb-2">Professional</h3>
                    <div className="text-4xl font-extrabold text-white dark:text-slate-900 mb-6">$19<span className="text-lg font-medium opacity-60">/mo</span></div>
                    <p className="text-sm text-slate-300 dark:text-slate-600 mb-8">For serious researchers and devs.</p>
                    <button className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">Start Free Trial</button>
                    <div className="mt-8 space-y-4 text-white dark:text-slate-900">
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4" /> Unlimited Papers</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4" /> Code Generation</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4" /> Audio Overviews</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4" /> Priority Support</div>
                    </div>
                </div>

                 {/* Team Tier */}
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lab Team</h3>
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">$49<span className="text-lg font-medium opacity-60">/mo</span></div>
                    <p className="text-sm text-slate-500 mb-8">Collaborative features for labs.</p>
                    <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-slate-900 dark:text-white" /> 5 Team Members</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-slate-900 dark:text-white" /> Shared Library</div>
                        <div className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-slate-900 dark:text-white" /> API Access</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DocsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-fade-in flex gap-12">
            <div className="hidden md:block w-64 flex-shrink-0">
                <div className="sticky top-32 space-y-8">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Getting Started</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li className="text-primary-600 font-medium cursor-pointer">Introduction</li>
                            <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Quick Start</li>
                            <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Uploading Papers</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Analysis Engine</li>
                            <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Code Gen</li>
                            <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Chat API</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex-grow space-y-12">
                <div className="space-y-6">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Introduction to ScholarSynth</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        ScholarSynth is an advanced AI-powered tool designed to accelerate the research process. 
                        By leveraging multimodal large language models (Gemini 3 Pro), it parses PDF structures to extract structured data, 
                        math, and code.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Data Privacy
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                            We do not train models on your uploaded papers. Files are processed in memory and discarded after the session ends.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Start</h2>
                    <div className="prose dark:prose-invert">
                        <p className="text-slate-600 dark:text-slate-400">
                            To get started, simply drag and drop a PDF file onto the home page upload zone. The file must be:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mt-4">
                            <li>Under 20MB in size</li>
                            <li>A valid text-based or scanned PDF</li>
                            <li>In English (multi-language support coming soon)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};