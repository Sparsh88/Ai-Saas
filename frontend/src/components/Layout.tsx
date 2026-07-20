import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../store/authStore';

export const Layout: React.FC = () => {
  const { token, initializeAuth } = useAuthStore();
  const navigate = useNavigate();

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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        <Header />
        
        {/* Child Router View */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Subtle light leak for modern styling */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
