import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../store/authStore';

export const Layout: React.FC = () => {
  const { token, initializeAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Redirect to login if token is missing
  useEffect(() => {
    const activeToken = localStorage.getItem('SF_TOKEN');
    if (!activeToken) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Mobile Sidebar backdrop overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        <Header onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        
        {/* Child Router View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {/* Subtle light leak for modern styling */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
