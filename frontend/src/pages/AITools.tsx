import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Wand2,
  FileSearch,
  FileCode,
  FileEdit,
  Mail,
  FileSignature,
  Code2,
  Database,
  Grid,
  CheckCircle,
  Copy,
  Download,
  AlertCircle,
  Loader,
  Brain
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: 'CAREER' | 'WRITING' | 'CODING' | 'CREATIVE';
  icon: React.ComponentType<any>;
  cost: number;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: string[];
  }>;
}

export const AITools: React.FC = () => {
  const { updateUserCredits } = useAuthStore();
  const [selectedToolId, setSelectedToolId] = useState('resume-analyzer');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tools: Tool[] = [
    // Career Group
    {
      id: 'resume-analyzer',
      name: 'ATS Resume Scorer',
      category: 'CAREER',
      icon: FileSearch,
      cost: 2,
      description: 'Analyze your resume for formatting and key match ratios.',
      fields: [
        { name: 'resumeText', label: 'Paste Resume Content', type: 'textarea', placeholder: 'Paste your raw resume text here...' }
      ]
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter Maker',
      category: 'CAREER',
      icon: FileSignature,
      cost: 2,
      description: 'Draft a tailored cover letter mapping your experiences to a job specification.',
      fields: [
        { name: 'resumeText', label: 'Resume Content', type: 'textarea', placeholder: 'Paste your experience details...' },
        { name: 'jobDescription', label: 'Target Job Description', type: 'textarea', placeholder: 'Paste the target job role requirement...' }
      ]
    },
    {
      id: 'linkedin-optimizer',
      name: 'LinkedIn Optimizer',
      category: 'CAREER',
      icon: Wand2,
      cost: 2,
      description: 'Boost search rankings with keywords in your LinkedIn profile.',
      fields: [
        { name: 'profileText', label: 'Profile Summary', type: 'textarea', placeholder: 'Paste your current summary or skills...' }
      ]
    },
    // Writing Group
    {
      id: 'email-writer',
      name: 'AI Email Writer',
      category: 'WRITING',
      icon: Mail,
      cost: 1,
      description: 'Compose high-impact emails with professional phrasing.',
      fields: [
        { name: 'subject', label: 'Email Subject / Objective', type: 'text', placeholder: 'e.g., Requesting meeting reschedule' },
        { name: 'prompt', label: 'Details to include', type: 'textarea', placeholder: 'Mention availability on Tuesday afternoon...' }
      ]
    },
    {
      id: 'grammar-checker',
      name: 'Grammar Checker',
      category: 'WRITING',
      icon: FileEdit,
      cost: 1,
      description: 'Correct punctuation and sentence flows instantly.',
      fields: [
        { name: 'text', label: 'Enter Text to Correct', type: 'textarea', placeholder: 'Paste text with spelling or grammatical errors...' }
      ]
    },
    // Coding Group
    {
      id: 'code-generator',
      name: 'AI Code Generator',
      category: 'CODING',
      icon: Code2,
      cost: 1,
      description: 'Generate clean, documented functions in multiple languages.',
      fields: [
        { name: 'prompt', label: 'What should the code do?', type: 'textarea', placeholder: 'e.g., A function that merges overlapping intervals' },
        { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'C++', 'Java'] }
      ]
    },
    {
      id: 'sql-generator',
      name: 'AI SQL Generator',
      category: 'CODING',
      icon: Database,
      cost: 1,
      description: 'Translate plain English queries into production SQL queries.',
      fields: [
        { name: 'prompt', label: 'Describe database query', type: 'textarea', placeholder: 'e.g., Get total payments per customer sorted by revenue' }
      ]
    },
    {
      id: 'code-bugfix',
      name: 'Bug Fix Suggestions',
      category: 'CODING',
      icon: FileCode,
      cost: 1,
      description: 'Identify syntax issues, potential overflows, and refactor blocks.',
      fields: [
        { name: 'code', label: 'Paste buggy code block', type: 'textarea', placeholder: 'Paste code block...' }
      ]
    }
  ];

  const currentTool = tools.find((t) => t.id === selectedToolId) || tools[0];

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleRunTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await axios.post('/api/ai/tool', {
        toolName: selectedToolId,
        payload: formData,
      });

      setResult(response.data.result);
      updateUserCredits(response.data.creditsRemaining);
    } catch (err: any) {
      setError(err.response?.data?.error || 'AI request execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedToolId}_response.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
      {/* Sidebar Tool Selector */}
      <div className="lg:col-span-1 space-y-4">
        {/* Mobile Selector Dropdown */}
        <div className="lg:hidden p-4 rounded-xl glass-panel border border-white/5 bg-slate-900/50">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Select AI Tool
          </label>
          <select
            value={selectedToolId}
            onChange={(e) => {
              setSelectedToolId(e.target.value);
              setResult('');
              setFormData({});
              setError(null);
            }}
            className="w-full bg-slate-950 border border-white/10 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500/50"
          >
            {tools.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.cost} credits)
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Selector Panel */}
        <div className="hidden lg:block p-4 rounded-xl glass-panel border border-white/5 bg-slate-900/50">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-indigo-400" />
            <span>AI Tool Sets</span>
          </h2>
          <div className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
            {tools.map((t) => {
              const Icon = t.icon;
              const isSelected = t.id === selectedToolId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedToolId(t.id);
                    setResult('');
                    setFormData({});
                    setError(null);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative z-10 ${
                    isSelected
                      ? 'text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeToolPill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 to-purple-500/5 border-l-2 border-indigo-500 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded shrink-0">
                    {t.cost} cr
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inputs Form and Results Terminal */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Input Panel */}
        <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
          <form onSubmit={handleRunTool} className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-200">{currentTool.name}</h3>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  Charges {currentTool.cost} credits
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">{currentTool.description}</p>

              {/* Dynamic Fields */}
              <div className="space-y-4">
                {currentTool.fields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {f.label}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        required
                        rows={6}
                        placeholder={f.placeholder}
                        value={formData[f.name] || ''}
                        onChange={(e) => handleInputChange(f.name, e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-600 text-xs outline-none transition-all resize-none"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        required
                        value={formData[f.name] || ''}
                        onChange={(e) => handleInputChange(f.name, e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-600 text-xs outline-none transition-all"
                      >
                        <option value="">Choose item...</option>
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        required
                        type="text"
                        placeholder={f.placeholder}
                        value={formData[f.name] || ''}
                        onChange={(e) => handleInputChange(f.name, e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-600 text-xs outline-none transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl py-3 font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Analyzing parameters...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Execute SkillForge AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel Terminal */}
        <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/60 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>AI Output Stream</span>
            </span>

            {/* Quick Export Controls */}
            {result && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-indigo-400 transition-all text-xs"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-indigo-400 transition-all text-xs"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-text pr-1 bg-slate-950/45 p-4 rounded-xl border border-white/2 max-h-[420px]">
            {result ? (
              // If JSON, try to print formatted JSON
              (() => {
                try {
                  const parsed = JSON.parse(result);
                  return (
                    <div className="space-y-3 font-sans">
                      {parsed.score !== undefined && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-500/10 bg-indigo-500/5">
                          <span className="text-slate-400 text-xs">ATS Match Score:</span>
                          <span className="text-lg font-black text-indigo-400">{parsed.score}%</span>
                        </div>
                      )}
                      
                      {Object.keys(parsed).map((key) => {
                        if (key === 'score') return null;
                        const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
                        const val = parsed[key];

                        return (
                          <div key={key} className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">{label}</span>
                            {Array.isArray(val) ? (
                              <div className="flex flex-wrap gap-1.5">
                                {val.map((item, i) => (
                                  <span key={i} className="text-[11px] px-2 py-0.5 bg-white/5 rounded border border-white/5 text-slate-350">{item}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-300 whitespace-pre-line">{val}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                } catch {
                  return result;
                }
              })()
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-650 py-16 gap-3 font-sans">
                <Wand2 className="w-8 h-8 text-slate-700 animate-pulse" />
                <span className="max-w-xs">Fill the input parameters on the left and click execute to query SkillForge AI.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default AITools;
