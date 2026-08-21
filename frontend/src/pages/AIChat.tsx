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
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)] flex flex-col justify-between max-w-4xl mx-auto rounded-2xl bg-[#111724] border border-white/5 overflow-hidden shadow-2xl relative">
      
      {/* Header Panel */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#0d111a]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Interactive Workspace</h2>
            <p className="text-[11px] text-slate-400">Ask coding prompts or load PDF records</p>
          </div>
        </div>

        {/* PDF selector attachment */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Chat context:</span>
          </span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="text-xs bg-[#080b11] border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 outline-none max-w-[180px] focus:border-blue-500/50"
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 shadow-md ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white shadow-blue-600/30'
                : 'bg-[#0d111a] text-blue-400 border border-white/5'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-md shadow-blue-600/20'
                : 'bg-[#0d111a] text-slate-200 rounded-tl-none border border-white/5'
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
            <div className="w-8 h-8 rounded-full bg-[#0d111a] border border-white/5 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0d111a] border border-white/5 rounded-tl-none flex items-center gap-2">
              <Loader className="w-4 h-4 text-blue-400 animate-spin" />
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
        <div className="px-6 py-2.5 border-t border-white/5 bg-[#0d111a]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-slate-400" />
            <span>Select a template prompt</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map((t, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectPromptTemplate(t.prompt)}
                className="text-[11px] font-medium text-slate-300 hover:text-white border border-white/5 bg-[#111724] hover:border-blue-500/40 rounded-xl py-1.5 px-3 transition-colors cursor-pointer"
              >
                {t.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="px-4 py-3 md:px-6 md:py-4 border-t border-white/5 bg-[#0d111a] flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedDocId ? "Ask a question about this file..." : "Type your message or prompt here..."}
          className="flex-1 bg-[#111724] border border-white/5 focus:border-blue-500/50 rounded-xl py-3 px-4 text-white placeholder-slate-500 text-sm outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
