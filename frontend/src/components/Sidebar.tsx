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
        animate={{ width: isCollapsed ? '72px' : '260px' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col h-screen bg-white dark:bg-[#000000] border-r border-slate-200 dark:border-[#1c1c1c] shrink-0 select-none relative transition-colors duration-200"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1c1c]">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNavClick('/dashboard')}
              >
                <div className="w-9 h-9 rounded-xl bg-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold font-heading text-sm text-slate-900 dark:text-white tracking-tight">SkillForge</span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Smart Workspace</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div
              className="mx-auto cursor-pointer w-9 h-9 rounded-xl bg-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-blue-500/25"
              onClick={() => handleNavClick('/dashboard')}
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
          )}

          {/* Collapse button on desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] hover:border-blue-500/50 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all absolute -right-3 top-5 shadow-sm hidden md:flex cursor-pointer z-20"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white md:hidden cursor-pointer"
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative z-10 ${
                    isActive
                      ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors'}`} />
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

        {/* Footer Profile Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1c1c1c] flex flex-col gap-2.5">
          {/* Theme Toggle & Logout */}
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-xl text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer ${
                isCollapsed ? 'w-full' : 'bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#222222]'
              }`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Log Out</span>}
            </button>
          </div>

          {/* User Card */}
          {user && (
            <div className="flex items-center gap-3 mt-1 p-1 rounded-xl">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#3b82f6] flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-blue-500/20 text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
};
