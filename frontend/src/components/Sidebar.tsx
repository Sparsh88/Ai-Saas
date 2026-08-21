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
        className="flex flex-col h-screen bg-[#07090e] dark:bg-[#07090e] border-r border-white/5 shrink-0 select-none relative"
      >
        {/* Brand Header with MoneyMate-style Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleNavClick('/dashboard')}
              >
                {/* Logo Rounded Box */}
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base tracking-tight leading-tight">
                    SkillForge
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium tracking-normal">
                    Smart AI Workspace
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="mx-auto cursor-pointer" onClick={() => handleNavClick('/dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Collapse button on desktop, Close button on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all absolute -right-3.5 top-5 shadow-lg shadow-blue-600/30 hidden md:flex cursor-pointer border border-blue-400/30 active:scale-95"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white md:hidden cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
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
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-blue-400 transition-colors'}`} />
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
        <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-[#07090e]">
          {/* Theme Toggle & Logout */}
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors ${
                isCollapsed ? 'w-full' : 'bg-white/5'
              }`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>

          {/* User Card */}
          {user && (
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-blue-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-sm font-semibold truncate text-white">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
};
