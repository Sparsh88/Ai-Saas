import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FileText,
  UploadCloud,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  url: string;
  fileType: string;
  createdAt: string;
}

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (err) {
      console.warn('Failed to retrieve documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB threshold limit.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Document parsed and registered successfully!');
      setDocuments((prev) => [response.data.document, ...prev]);
      
      // Clear success notification
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Document processing failure. Verify your file format.');
    } finally {
      setUploading(false);
      // Reset input element
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      setError('Failed to delete document.');
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Zone & Title */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-bold text-slate-200">Upload Documents</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload PDF, DOCX, TXT, or MD documents. Our extractor parses raw text, allowing you to ask questions contextually in the AI Chat.
            </p>
          </div>

          {/* Interactive Drag & Drop Box */}
          <label className="border-2 border-dashed border-white/10 hover:border-indigo-500/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/45 hover:bg-indigo-500/5 transition-all group min-h-[180px]">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="space-y-3">
                <Loader className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                <span className="text-xs font-mono text-slate-400">Extracting text records...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors mx-auto" />
                <div className="text-xs font-semibold text-slate-350">Click to upload document</div>
                <div className="text-[10px] text-slate-550">PDF, DOCX, TXT up to 10MB</div>
              </div>
            )}
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Files Grid List */}
        <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/60 flex flex-col justify-between min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-200">Documents Library</h3>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
            {loading && documents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Syncing database records...
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-slate-700" />
                <span>No documents match your query.</span>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between group hover:border-indigo-500/25 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-250 pr-4 line-clamp-1">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-550 mt-0.5">
                        <span className="uppercase">{doc.fileType.split('/')[1] || doc.fileType}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate('/chat')}
                      className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/20 text-slate-450 hover:text-indigo-400 transition-all"
                      title="Chat with Document"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                    </button>
                    {doc.url.startsWith('http') && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/20 text-slate-450 hover:text-indigo-400 transition-all inline-block"
                        title="Open Raw File"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-rose-500/20 text-slate-455 hover:text-rose-400 transition-all"
                      title="Delete document"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Documents;
