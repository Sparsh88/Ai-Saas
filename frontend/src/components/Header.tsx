import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  Bell,
  Search,
  Command,
  Sparkles,
  Inbox,
  User,
  Shield,
  CircleDot,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/workspace/notifications');
      setNotifications(res.data);
      const unread = res.data.filter((n: Notification) => !n.read).length;
      useAuthStore.getState().setNotificationsCount(unread);
    } catch (e) {
      console.warn('Failed to retrieve notifications:', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 45s
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/api/workspace/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      const unreadCount = notifications.filter((n) => !n.read && n.id !== id).length;
      useAuthStore.getState().setNotificationsCount(unreadCount);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Search links mapping
  const searchItems = [
    { title: 'AI Chat Assistant', category: 'AI Tools', path: '/chat' },
    { title: 'Resume Optimizer & ATS Score', category: 'AI Tools', path: '/tools' },
    { title: 'LinkedIn Profile Optimizer', category: 'AI Tools', path: '/tools' },
    { title: 'Study Planner & Roads', category: 'Learning', path: '/careers' },
    { title: 'Mock Coding Interviews', category: 'Interviews', path: '/careers' },
    { title: 'Kanban Task Management', category: 'Workspace', path: '/tasks' },
    { title: 'Billing, Invoices & Credits', category: 'Billing', path: '/billing' },
  ];

  const filteredSearch = searchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 border-b border-white/5 dark:border-white/5 border-black/5 px-4 md:px-6 flex items-center justify-between shrink-0 glass-panel relative z-20">
      {/* Toggle Sidebar & Mobile Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors md:hidden active:scale-95 cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="md:hidden flex items-center gap-2 cursor-pointer font-bold" onClick={() => navigate('/dashboard')}>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-heading text-sm">SkillForge AI</span>
        </div>
      </div>

      {/* Search Input Bar (desktop only) */}
      <div className="relative w-72 max-w-lg hidden md:block">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-left text-sm text-slate-400 hover:text-slate-300 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search features...</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>


      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Credit Badge */}
        {user && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/billing')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/15 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{user.credits} credits</span>
          </motion.div>
        )}

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSearch(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors relative active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto rounded-xl bg-slate-900 border border-white/5 shadow-2xl text-slate-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="text-xs text-indigo-400 cursor-pointer hover:underline" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Mark all read</span>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <Inbox className="w-6 h-6 text-slate-600" />
                    <span>All caught up!</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors relative ${
                        !notif.read ? 'bg-indigo-500/5' : ''
                      }`}
                    >
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          title="Mark read"
                          className="absolute right-4 top-4 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          <CircleDot className="w-3 h-3" />
                        </button>
                      )}
                      <h4 className="text-xs font-semibold text-slate-200 pr-4">{notif.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{notif.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1.5">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-slate-200">{user.name}</p>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {user.role}
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="w-8.5 h-8.5 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 shadow-inner cursor-pointer"
            >
              {user.role === 'ADMIN' ? <Shield className="w-4 h-4 text-indigo-400" /> : <User className="w-4 h-4" />}
            </motion.div>
          </div>
        )}
      </div>

      {/* Global Search Dialog Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm flex items-start justify-center pt-24 px-4 z-50"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Where would you like to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-slate-100 text-sm placeholder-slate-500"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-400 hover:bg-white/10"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredSearch.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    No matching features found. Try "Resume" or "Chat".
                  </div>
                ) : (
                  filteredSearch.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      onClick={() => {
                        navigate(item.path);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-slate-300 transition-colors"
                    >
                      <span>{item.title}</span>
                      <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
