import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#000000] text-slate-800 dark:text-slate-100 relative">
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
        <main className="flex-1 overflow-y-auto flex flex-col justify-between p-4 md:p-6 relative">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default Layout;
