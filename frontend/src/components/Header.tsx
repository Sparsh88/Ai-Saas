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

  // Fetch notifications with request deduplication
  const lastFetchRef = React.useRef<number>(0);
  const fetchNotifications = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 15000) {
      return;
    }
    lastFetchRef.current = now;
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
    if (user?.id) {
      fetchNotifications();
      // Poll notifications every 60s
      const interval = setInterval(() => fetchNotifications(true), 60000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);


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
  ];

  const filteredSearch = searchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 border-b border-white/5 bg-[#07090e] dark:bg-[#07090e] px-4 md:px-6 flex items-center justify-between shrink-0 relative z-20">
      {/* Toggle Sidebar & Mobile Brand & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors md:hidden active:scale-95 cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Search Input Bar (desktop only) */}
      <div className="relative w-80 max-w-lg hidden md:block">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#11141c] border border-white/10 hover:border-white/20 text-left text-xs text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search workspace, tools...</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              fetchNotifications(true);
            }}
            className="w-9 h-9 rounded-xl bg-[#11141c] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#07090e]" />
            )}
          </button>

          {/* Notifications Flyout */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-[#0e111a] shadow-2xl p-4 border border-white/10 z-50 divide-y divide-white/5"
              >
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </h3>
                  <span className="text-[10px] text-blue-400 font-semibold">
                    {notifications.filter((n) => !n.read).length} Unread
                  </span>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
                    <Inbox className="w-6 h-6 text-zinc-600" />
                    <span>No notifications yet.</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`py-3 first:pt-3 transition-colors relative ${
                        !notif.read ? 'bg-blue-500/10 -mx-4 px-4' : ''
                      }`}
                    >
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          title="Mark read"
                          className="absolute right-4 top-4 text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          <CircleDot className="w-3 h-3" />
                        </button>
                      )}
                      <h4 className="text-xs font-semibold text-white pr-4">{notif.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{notif.message}</p>
                      <span className="text-[9px] text-zinc-500 block mt-1.5">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Quick Avatar Badge */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <span className="text-[10px] text-blue-400 tracking-wider font-semibold">
                ● Active
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-400/30 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/25 cursor-pointer"
            >
              {user.name.charAt(0).toUpperCase()}
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
