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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">        {/* Upload Card */}
        <div className="p-6 rounded-2xl glass-panel card-blue flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
              <span>Upload Document</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Extract textual vectors for contextual Q&A interactions.</p>
          </div>

          <label className="border-2 border-dashed border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-8 text-center cursor-pointer transition-all bg-blue-500/5 hover:bg-blue-500/10 block group">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="space-y-3">
                <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                <span className="text-xs font-mono text-blue-300">Extracting text records...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 w-fit mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">Click to upload document</div>
                <div className="text-[10px] text-slate-400">PDF, DOCX, TXT up to 10MB</div>
              </div>
            )}
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Files Grid List */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel card-purple flex flex-col justify-between min-h-[400px] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
              <span>Documents Library</span>
            </h3>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 focus:border-purple-500 rounded-xl py-2 pl-9 pr-4 text-white placeholder-slate-500 text-xs outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
            {loading && documents.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between shimmer-effect"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10" />
                      <div className="space-y-1.5">
                        <div className="w-48 h-3.5 bg-white/10 rounded" />
                        <div className="w-24 h-2.5 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-7 bg-white/5 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isPdf = doc.fileType.toLowerCase().includes('pdf') || doc.name.endsWith('.pdf');
                const isDocx = doc.fileType.toLowerCase().includes('docx') || doc.name.endsWith('.docx') || doc.name.endsWith('.doc');
                const iconColor = isPdf ? 'text-rose-400 bg-rose-500/15 border-rose-500/30' : isDocx ? 'text-blue-400 bg-blue-500/15 border-blue-500/30' : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
                const tagColor = isPdf ? 'text-rose-300 bg-rose-500/15' : isDocx ? 'text-blue-300 bg-blue-500/15' : 'text-emerald-300 bg-emerald-500/15';
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-white/10 bg-slate-950/60 flex items-center justify-between group hover:border-purple-500/40 transition-all text-xs shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${iconColor}`}>
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white pr-4 line-clamp-1 group-hover:text-purple-300 transition-colors">{doc.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className={`uppercase font-bold px-1.5 py-0.5 rounded ${tagColor}`}>{doc.fileType.split('/')[1] || doc.fileType}</span>
                          <span>•</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate('/chat')}
                        className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all cursor-pointer"
                        title="Chat with Document"
                      >
                        <MessageSquare className="w-4.5 h-4.5" />
                      </button>
                      {doc.url.startsWith('http') && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 transition-all inline-block cursor-pointer"
                          title="Open Raw File"
                        >
                          <ExternalLink className="w-4.5 h-4.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete document"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Documents;
