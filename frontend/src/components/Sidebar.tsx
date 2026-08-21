import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  MessageSquare,
  Wand2,
  KanbanSquare,
  CheckSquare,
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
  const { user, logout } = useAuthStore();
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
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Task Manager', path: '/tasks', icon: CheckSquare },
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
        className="flex flex-col h-screen bg-[#000000] border-r border-[#1c1c1c] shrink-0 select-none relative"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1c1c1c]">
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
                  <span className="font-bold font-heading text-sm text-white tracking-tight">SkillForge</span>
                  <span className="text-[10px] font-medium text-slate-400">Smart Workspace</span>
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
            className="w-6 h-6 rounded-full bg-[#111111] border border-[#222222] hover:border-blue-500/50 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all absolute -right-3 top-5 shadow-lg hidden md:flex cursor-pointer z-20"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#111111] border border-[#222222] text-slate-400 hover:text-white md:hidden cursor-pointer"
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
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 transition-colors'}`} />
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
        <div className="p-4 border-t border-[#1c1c1c] flex flex-col gap-2.5">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 bg-[#111111] border border-[#222222] transition-colors cursor-pointer w-full`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Log Out</span>}
          </button>

          {/* User Card */}
          {user && (
            <div className="flex items-center gap-3 mt-1 p-1 rounded-xl">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#3b82f6] flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-blue-500/20 text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold truncate text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
};
