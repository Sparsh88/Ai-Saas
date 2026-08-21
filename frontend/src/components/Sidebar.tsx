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
        className="flex flex-col h-screen glass-panel border-r shrink-0 select-none relative"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 dark:border-white/5 border-black/5">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 cursor-pointer font-bold font-heading text-base text-slate-100 tracking-tight hover:text-white transition-colors"
                onClick={() => handleNavClick('/dashboard')}
              >
                <Sparkles className="w-4 h-4 text-slate-300" />
                <span>SkillForge AI</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="mx-auto cursor-pointer" onClick={() => handleNavClick('/dashboard')}>
              <Sparkles className="w-5 h-5 text-slate-300" />
            </div>
          )}

          {/* Collapse button on desktop, Close button on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-white/5 border border-white/5 transition-colors absolute -right-3 top-5 bg-slate-900 dark:bg-slate-900 light:bg-white light:border-black/5 text-slate-400 hover:text-indigo-400 shadow-md hidden md:block cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 border border-white/5 transition-colors text-slate-400 hover:text-indigo-400 md:hidden cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
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
                onClick={() => {
                  if (onClose) onClose();
                }}
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
    </div>
  );
};
