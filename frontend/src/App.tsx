import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AIChat } from './pages/AIChat';
import { AITools } from './pages/AITools';
import { StudyPlanner } from './pages/StudyPlanner';
import { TaskManager } from './pages/TaskManager';
import { Documents } from './pages/Documents';
import { Billing } from './pages/Billing';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Workspace Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<AIChat />} />
          <Route path="tools" element={<AITools />} />
          <Route path="careers" element={<StudyPlanner />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="documents" element={<Documents />} />
          <Route path="billing" element={<Billing />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
