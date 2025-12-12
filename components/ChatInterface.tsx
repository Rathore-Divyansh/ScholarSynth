import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Chat } from '@google/genai';
import { createPaperChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  file: File;
  chatSession: Chat | null;
  setChatSession: (session: Chat) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  file, 
  chatSession, 
  setChatSession, 
  messages, 
  setMessages 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession) {
        const initChat = async () => {
        try {
            const session = await createPaperChatSession(file);
            setChatSession(session);
            if (messages.length === 0) {
              setMessages([{ role: 'model', text: 'I\'ve analyzed the paper fully. Ask me about specific methodologies, results, or equations!' }]);
            }
        } catch (e) {
            console.error("Failed to init chat", e);
            setMessages([{ role: 'model', text: 'Error connecting to the paper context. Please try again.' }]);
        }
        };
        initChat();
    }
  }, [file, chatSession, setChatSession, setMessages, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
            fullResponse += chunkText;
            setMessages(prev => {
                const newArr = [...prev];
                const lastIdx = newArr.length - 1;
                newArr[lastIdx] = { ...newArr[lastIdx], text: fullResponse };
                return newArr;
            });
        }
      }
      
      setMessages(prev => {
        const newArr = [...prev];
        const lastIdx = newArr.length - 1;
        newArr[lastIdx] = { ...newArr[lastIdx], isStreaming: false };
        return newArr;
      });

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error responding to that.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  }

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 min-h-[1em]">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[700px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-primary-500" />
              AI Research Assistant
          </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
              </div>

              <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                ) : (
                  <div className="markdown-content">
                    {formatMessageText(msg.text)}
                  </div>
                )}
                {msg.isStreaming && (
                    <div className="flex gap-1 mt-2 h-2 items-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the paper..."
            disabled={isLoading || !chatSession}
            className="flex-grow px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim() || !chatSession}
            className="p-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-900 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};