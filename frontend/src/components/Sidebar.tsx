import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  MessageSquare,
  Wand2,
  KanbanSquare,
  FileText,
  CreditCard,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat Hub', path: '/chat', icon: MessageSquare },
    { name: 'AI Writing Tools', path: '/tools', icon: Wand2 },
    { name: 'Study & Careers', path: '/careers', icon: BookOpen },
    { name: 'Tasks & Kanban', path: '/tasks', icon: KanbanSquare },
    { name: 'Documents Hub', path: '/documents', icon: FileText },
    { name: 'Billing & Pricing', path: '/billing', icon: CreditCard },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '72px' : '260px' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-screen glass-panel border-r shrink-0 select-none relative z-30"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 dark:border-white/5 border-black/5">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 cursor-pointer font-bold font-heading text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent"
              onClick={() => navigate('/dashboard')}
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>SkillForge AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="mx-auto cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-white/5 border border-white/5 transition-colors absolute -right-3 top-5 bg-slate-900 dark:bg-slate-900 light:bg-white light:border-black/5 text-slate-400 hover:text-indigo-400 shadow-md"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative z-10 ${
                  isActive
                    ? 'text-indigo-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`
              }
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/12 to-purple-500/4 border-l-2 border-indigo-500 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Credit Counter */}
      {!isCollapsed && user && (
        <div className="mx-4 my-2 p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Credits Remaining</span>
            <span className="font-semibold text-indigo-400">{user.credits}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
              style={{ width: `${Math.min((user.credits / 100) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Plan: {user.plan}
            </span>
            {user.plan === 'FREE' && (
              <button
                onClick={() => navigate('/billing')}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Upgrade 🚀
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Profile Controls */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        {/* Theme Toggle & Logout */}
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/5 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded-md text-slate-400 hover:text-rose-400 transition-colors ${
              isCollapsed ? 'w-full' : 'bg-white/5 border border-white/5'
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 mt-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-indigo-500/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate text-slate-200">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
