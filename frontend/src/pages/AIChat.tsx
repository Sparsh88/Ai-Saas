import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Send,
  Bot,
  User,
  BookMarked,
  FileText,
  AlertCircle,
  BrainCircuit,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  fileType: string;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your SkillForge AI Assistant. Ask me any coding questions, request resume improvements, brainstorm strategies, or upload a document in the Documents Hub and toggle it below to chat directly with its content." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Document attachments
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load user files to attach
  const fetchUserFiles = async () => {
    try {
      const res = await axios.get('/api/documents');
      setDocuments(res.data);
    } catch (e) {
      console.warn('Failed to load documents for selector:', e);
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let response;
      if (selectedDocId) {
        // Chat with PDF endpoint
        response = await axios.post('/api/ai/chat-document', {
          documentId: selectedDocId,
          messages: [...messages, userMessage],
        });
      } else {
        // Standard chat endpoint
        response = await axios.post('/api/ai/chat', {
          messages: [...messages, userMessage],
        });
      }

      const botMessage: Message = { role: 'assistant', content: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'AI parsing error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectPromptTemplate = (prompt: string) => {
    setInput(prompt);
  };

  const templates = [
    { text: 'Mock code review', prompt: 'Perform a detailed review of this TypeScript code block, checking for performance anomalies, memory leaks, and readability:\n\n```typescript\n\n```' },
    { text: 'Analyze tech stack', prompt: 'What are the pros and cons of using Vite + React 19 + Tailwind v4 + PostgreSQL Neon for an AI SaaS startup?' },
    { text: 'Draft cover letter', prompt: 'Write a modern, premium cover letter for a Frontend Engineer position at a high-growth fintech startup. Target keywords: React, state engines, design systems.' }
  ];

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)] flex flex-col justify-between max-w-4xl mx-auto rounded-2xl bg-[#0d0d0d] border border-[#1c1c1c] overflow-hidden shadow-xl relative">
      
      {/* Header Panel */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-[#1c1c1c] flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#000000]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#a855f7] flex items-center justify-center">
            <BrainCircuit className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-heading">Interactive Workspace</h2>
            <p className="text-[11px] text-slate-400">Ask coding prompts or load PDF records</p>
          </div>
        </div>

        {/* PDF selector attachment */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Chat context:</span>
          </span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="text-xs bg-[#111111] border border-[#222222] text-slate-300 rounded-xl px-2.5 py-1.5 outline-none max-w-[180px] focus:border-blue-500/50"
          >
            <option value="">General (No Context)</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            key={index}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-md ${
              msg.role === 'user'
                ? 'bg-[#3b82f6] text-white shadow-blue-500/30'
                : 'bg-[#180d29] text-[#a855f7] border border-[#301654]'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#3b82f6] text-white font-medium rounded-tr-none shadow-md shadow-blue-500/20'
                : 'bg-[#111111] text-slate-200 rounded-tl-none border border-[#222222]'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[85%]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#180d29] border border-[#301654] flex items-center justify-center text-[#a855f7] shrink-0 shadow-inner">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] rounded-tl-none flex items-center gap-2">
              <Loader className="w-4 h-4 text-[#a855f7] animate-spin" />
              <span className="text-xs text-slate-400 font-mono">SkillForge AI is generating response...</span>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Templates Prompt Row */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-2.5 border-t border-[#1c1c1c] bg-[#000000]/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-[#eab308]" />
            <span className="text-slate-400">Suggested Prompts</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map((t, i) => {
              const chipStyles = [
                'hover:border-blue-500/40 hover:text-blue-400',
                'hover:border-purple-500/40 hover:text-purple-400',
                'hover:border-yellow-500/40 hover:text-yellow-400',
                'hover:border-red-500/40 hover:text-red-400'
              ];
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectPromptTemplate(t.prompt)}
                  className={`text-[11px] font-medium text-slate-300 border border-[#222222] bg-[#111111] rounded-xl py-1.5 px-3 transition-all cursor-pointer ${chipStyles[i % chipStyles.length]}`}
                >
                  {t.text}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="px-4 py-3 md:px-6 md:py-4 border-t border-[#1c1c1c] bg-[#000000] flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedDocId ? "Ask a question about this file..." : "Type your message or prompt here..."}
          className="flex-1 bg-[#111111] hover:bg-[#141414] focus:bg-[#141414] border border-[#222222] focus:border-blue-500/50 rounded-xl py-3 px-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
