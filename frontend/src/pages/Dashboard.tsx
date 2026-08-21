import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  ArrowUpRight,
  Clock,
  Zap,
  Wallet,
  Plus
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardData {
  recentActivity: Array<{
    id: string;
    toolUsed: string;
    createdAt: string;
  }>;
  metrics: {
    totalDocs: number;
    totalProjects: number;
    totalTasks: number;
  };
  usageSummary: Array<{
    toolUsed: string;
    requestsCount?: number;
    creditsUsed?: number;
  }>;
}

const getStoredCache = (): DashboardData | null => {
  try {
    const raw = sessionStorage.getItem('SF_DASHBOARD_CACHE');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const initialCache = getStoredCache();
  const [data, setData] = useState<DashboardData | null>(initialCache);
  const [loading, setLoading] = useState(!initialCache);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/workspace/dashboard-stats');
      setData(response.data);
      sessionStorage.setItem('SF_DASHBOARD_CACHE', JSON.stringify(response.data));
    } catch (error) {
      console.warn('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-2xl bg-[#121212] shimmer-effect" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#121212] shimmer-effect" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-[#121212] shimmer-effect" />
          <div className="h-72 rounded-2xl bg-[#121212] shimmer-effect" />
        </div>
      </div>
    );
  }

  const trendData = [
    { month: 'Mar', calls: 0, workload: 0 },
    { month: 'Apr', calls: 0, workload: 0 },
    { month: 'May', calls: 0, workload: 0 },
    { month: 'Jun', calls: 200, workload: 100 },
    { month: 'Jul', calls: 70000, workload: 40000 },
    { month: 'Aug', calls: 70000, workload: 25000 },
  ];

  const categoryData = [
    { name: 'AI Writing & Tools', value: 100, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
            Good Morning, {user?.name || 'Sparsh'}!
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Here's your productivity overview for August 2026
          </p>
        </div>

        <button
          onClick={() => navigate('/tools')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs md:text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Transaction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tools')}
          className="p-5 rounded-2xl bg-[#121212] border border-[#222222] transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Balance</span>
            <div className="w-9 h-9 rounded-xl bg-[#1a2332] border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-white">₹75,000</span>
            <p className="text-xs text-slate-500 mt-1">Lifetime net balance</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/documents')}
          className="p-5 rounded-2xl bg-[#091526] border border-blue-500/30 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Monthly Income</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-blue-400">₹70,000</span>
            <p className="text-xs text-slate-400 mt-1">This month</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-[#1c0a0e] border border-red-500/30 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Monthly Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingDown className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-red-400">₹25,000</span>
            <p className="text-xs text-slate-400 mt-1">This month</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-[#091526] border border-blue-500/30 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Monthly Savings</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-blue-400">₹45,000</span>
            <p className="text-xs text-slate-400 mt-1">Income - Expenses</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white font-heading">Income vs Expenses</h3>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseRedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#666666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="Income"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeBlueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="workload"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseRedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-heading">Spending by Category</h3>
            <span className="text-xs text-slate-500">This month</span>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121212" strokeWidth={3} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white font-heading">100%</span>
              <span className="text-[10px] text-slate-400">AI Modules</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
