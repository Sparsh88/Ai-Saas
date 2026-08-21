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
  Wand2,
  Plus,
  ArrowUpRight,
  Clock,
  Layers,
  PieChart as PieIcon,
  Bot
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const chartData =
    data?.usageSummary && data.usageSummary.length > 0
      ? data.usageSummary.map((item) => ({
          name: item.toolUsed.length > 12 ? item.toolUsed.substring(0, 10) + '..' : item.toolUsed,
          fullName: item.toolUsed,
          count: item.requestsCount || item.creditsUsed || 1,
        }))
      : [
          { name: 'AI Chat', fullName: 'AI Chat Hub', count: 12 },
          { name: 'Resume Scorer', fullName: 'ATS Resume Scorer', count: 8 },
          { name: 'Roadmap', fullName: 'Career Roadmap', count: 6 },
          { name: 'Code Gen', fullName: 'AI Code Generator', count: 15 },
          { name: 'Docs Q&A', fullName: 'Document Assistant', count: 9 }
        ];

  const pieData =
    chartData.length > 0
      ? chartData.slice(0, 4).map((item) => ({
          name: item.name,
          value: item.count,
        }))
      : [{ name: 'AI Tools', value: 100 }];

  const BLUE_PALETTE = ['#3b82f6', '#60a5fa', '#2563eb', '#93c5fd', '#1d4ed8'];

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Skeleton */}
        <div className="flex items-center justify-between p-2 h-20">
          <div className="space-y-2">
            <div className="w-56 h-7 bg-white/10 rounded-lg animate-pulse" />
            <div className="w-72 h-4 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="w-36 h-10 bg-white/10 rounded-full animate-pulse hidden sm:block" />
        </div>

        {/* 4 Metric Cards Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/5 bg-[#111724] h-32 flex flex-col justify-between animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="w-24 h-3 bg-white/10 rounded" />
                <div className="w-8 h-8 rounded-xl bg-white/10" />
              </div>
              <div className="w-16 h-7 bg-white/15 rounded" />
              <div className="w-28 h-2.5 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* Top Greeting Header with Action Button matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Here's your productivity & AI overview for {currentMonthYear}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Launch AI Tool</span>
        </motion.button>
      </div>

      {/* 4 Metric Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: AI Suite */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tools')}
          className="p-5 rounded-2xl bg-[#111724] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Writing Suite</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Wand2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white">25+</span>
            <p className="text-[11px] text-slate-400 mt-1">Free tools & models</p>
          </div>
        </motion.div>

        {/* Card 2: Documents */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/documents')}
          className="p-5 rounded-2xl bg-[#111724] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Documents Hub</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white">{data?.metrics.totalDocs || 0}</span>
            <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX parsed</p>
          </div>
        </motion.div>

        {/* Card 3: Projects */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-[#111724] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Workspace</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white">{data?.metrics.totalProjects || 0}</span>
            <p className="text-[11px] text-slate-400 mt-1">Kanban projects</p>
          </div>
        </motion.div>

        {/* Card 4: Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-[#111724] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tasks Pending</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white">{data?.metrics.totalTasks || 0}</span>
            <p className="text-[11px] text-slate-400 mt-1">Active items tracked</p>
          </div>
        </motion.div>
      </div>

      {/* Analytics & Distribution Row matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card (2 Cols): Area Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111724] border border-white/5 flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">AI Activity & Invocations</h3>
              <p className="text-[11px] text-slate-400">Weekly usage distribution across modules</p>
            </div>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              Live Telemetry
            </span>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d111a',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Generations"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card (1 Col): Donut Distribution Chart matching screenshot */}
        <div className="p-6 rounded-2xl bg-[#111724] border border-white/5 flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Usage by Feature</h3>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d111a',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_PALETTE[index % BLUE_PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xs font-bold text-white">100%</span>
              <span className="text-[9px] text-slate-400">Total</span>
            </div>
          </div>

          {/* Breakdown labels */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: BLUE_PALETTE[idx % BLUE_PALETTE.length] }}
                  />
                  <span className="text-slate-300 truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-400">{item.value} runs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
