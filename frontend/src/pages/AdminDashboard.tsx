import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Users,
  Coins,
  TrendingUp,
  Award,
  Trash2,
  Edit3,
  Loader,
  AlertCircle,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdminStats {
  metrics: {
    totalUsers: number;
    totalRevenue: number;
    activeSubscriptions: number;
    totalAIRequests: number;
  };
  popularTools: Array<{ name: string; requests: number }>;
  dailyRequests: Array<{ date: string; count: number }>;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  credits: number;
  createdAt: string;
  plan: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit credits state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editCreditsVal, setEditCreditsVal] = useState<number>(0);

  const fetchAdminStats = async () => {
    try {
      const statsRes = await axios.get('/api/admin/stats');
      const usersRes = await axios.get('/api/admin/users');
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.warn('Failed to load admin stats:', err);
      setError('Access denied. Admin authorization is required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;

    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // Refresh statistics counters
      fetchAdminStats();
    } catch (e) {
      alert('Delete failed.');
    }
  };

  const handleUpdateCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    try {
      await axios.put('/api/admin/users/credits', {
        userId: editingUserId,
        credits: editCreditsVal,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? { ...u, credits: editCreditsVal } : u))
      );
      setEditingUserId(null);
    } catch (e) {
      alert('Failed to update credits.');
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <Loader className="w-6 h-6 animate-spin text-indigo-400 mr-2" />
        <span>Loading admin metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs max-w-md mx-auto mt-16 text-center space-y-4 shadow-xl">
        <div className="flex items-center justify-center gap-2 font-semibold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Your current session token lacks administrator permissions. Please log in with the admin credentials (<code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">admin@skillforge.ai</code>) to access the system metrics.
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Log In as Administrator</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-white/5">
        <ShieldCheck className="w-6 h-6 text-indigo-400 animate-pulse" />
        <h2 className="text-lg font-bold font-heading text-slate-200">System Administration Console</h2>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-5 rounded-xl border border-white/5 bg-slate-900/20">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-slate-100">{stats?.metrics.totalUsers}</span>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-xl border border-white/5 bg-slate-900/20">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-slate-100">₹{stats?.metrics.totalRevenue}</span>
        </div>

        {/* Premium Subs */}
        <div className="p-5 rounded-xl border border-white/5 bg-slate-900/20">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Premium Members</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-slate-100">{stats?.metrics.activeSubscriptions}</span>
        </div>

        {/* Daily Requests */}
        <div className="p-5 rounded-xl border border-white/5 bg-slate-900/20">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total AI Logs</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-black text-slate-100">{stats?.metrics.totalAIRequests}</span>
        </div>
      </div>

      {/* Analytics Chart & Popular tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily requests chart */}
        <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Daily System Invocations</h3>
          
          <div className="h-64 w-full">
            {stats?.dailyRequests.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No activity statistics found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.dailyRequests || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Popular tools breakdown */}
        <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Popular AI Modules</h3>
          
          <div className="space-y-4 flex-1">
            {stats?.popularTools.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No telemetry recordings.
              </div>
            ) : (
              stats?.popularTools.map((tool) => (
                <div key={tool.name} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>{tool.name}</span>
                    <span>{tool.requests} calls</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (tool.requests / (stats?.metrics.totalAIRequests || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Users management table */}
      <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">User Accounts Registry</h3>
        
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="py-2.5">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Plan</th>
                <th>Credits</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/2 text-slate-350 hover:bg-white/2 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      u.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      u.plan === 'PREMIUM' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="font-bold text-slate-300">{u.credits}</td>
                  <td className="text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingUserId(u.id);
                        setEditCreditsVal(u.credits);
                      }}
                      className="p-1 rounded bg-white/5 text-slate-450 hover:text-indigo-400 hover:bg-white/10"
                      title="Adjust credits"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1 rounded bg-white/5 text-slate-450 hover:text-rose-455 hover:bg-white/10"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust credits modal */}
      {editingUserId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-indigo-400" />
              <span>Modify User Credits</span>
            </h3>

            <form onSubmit={handleUpdateCredits} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Credits Amount</label>
                <input
                  type="number"
                  required
                  value={editCreditsVal}
                  onChange={(e) => setEditCreditsVal(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl py-2.5 px-3 text-slate-100 text-xs outline-none transition-all"
                />
              </div>

              <div className="flex gap-2 justify-end border-t border-white/5 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  Save Credits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
