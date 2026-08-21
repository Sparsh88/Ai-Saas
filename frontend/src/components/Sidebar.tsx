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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat Hub', path: '/chat', icon: MessageSquare },
    { name: 'AI Writing Tools', path: '/tools', icon: Wand2 },
    { name: 'Study & Careers', path: '/careers', icon: BookOpen },
    { name: 'Tasks & Kanban', path: '/tasks', icon: KanbanSquare },
    { name: 'Documents Hub', path: '/documents', icon: FileText },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-35 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <motion.aside
        animate={{ width: isCollapsed ? '76px' : '260px' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col h-screen glass-panel border-r border-white/5 shrink-0 select-none relative bg-[#0d111a]"
      >
        {/* Brand Header & Logo matching screenshot */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => handleNavClick('/dashboard')}
              >
                {/* Logo Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold font-heading text-base text-white tracking-tight leading-tight">SkillForge</span>
                  <span className="text-[11px] font-medium text-slate-400 leading-tight">Smart AI Hub</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div
              className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 cursor-pointer"
              onClick={() => handleNavClick('/dashboard')}
              title="SkillForge AI"
            >
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          {/* Collapse button on desktop, Close button on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center absolute -right-3.5 top-6 shadow-md shadow-blue-600/30 transition-all hover:scale-105 hidden md:flex cursor-pointer z-20"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 border border-white/5 transition-colors text-slate-400 hover:text-white md:hidden cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group relative z-10 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-white/5 flex flex-col gap-2 bg-black/20">
          {/* User Card */}
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-blue-600/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">{user.email}</p>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle & Logout */}
          <div className="flex items-center justify-between gap-1.5 mt-1">
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer ${
                isCollapsed ? 'w-full' : ''
              }`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
};
