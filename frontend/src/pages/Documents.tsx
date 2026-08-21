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
        
        {/* Upload Card */}
        <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Upload New File</h3>
            <p className="text-xs text-zinc-400 mb-6">Attach files to question-answer with Gemini 1.5 context engine.</p>
          </div>

          <label
            htmlFor="doc-upload"
            className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl bg-[#11141c] hover:bg-[#141822] cursor-pointer transition-all text-center group min-h-[220px]"
          >
            <input
              id="doc-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="space-y-3">
                <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                <span className="text-xs font-mono text-zinc-400">Extracting text records...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors mx-auto" />
                <div className="text-xs font-semibold text-zinc-300">Click to upload document</div>
                <div className="text-[10px] text-zinc-500">PDF, DOCX, TXT up to 10MB</div>
              </div>
            )}
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Files Grid List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d1017] border border-white/5 flex flex-col justify-between min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
            <h3 className="text-sm font-bold text-white">Documents Library</h3>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11141c] border border-white/10 focus:border-blue-500/50 rounded-xl py-2 pl-9 pr-4 text-white placeholder-zinc-500 text-xs outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
            {loading && documents.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/5 bg-[#12151e] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5" />
                      <div className="space-y-1.5">
                        <div className="w-48 h-3.5 bg-white/5 rounded" />
                        <div className="w-24 h-2.5 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-7 bg-white/5 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-zinc-600" />
                <span>No documents match your query.</span>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-white/5 bg-[#12151e] flex items-center justify-between group hover:border-blue-500/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {doc.name}
                      </h4>
                      <span className="text-[10px] text-zinc-500 block">
                        {(doc.size / 1024).toFixed(1)} KB • {doc.fileType.toUpperCase()} •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/chat?docId=${doc.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
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
