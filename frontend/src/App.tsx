import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageSkeleton } from './components/PageSkeleton';

// Code-split route components to minimize initial bundle size
const Login = lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const AIChat = lazy(() => import('./pages/AIChat').then((m) => ({ default: m.AIChat })));
const AITools = lazy(() => import('./pages/AITools').then((m) => ({ default: m.AITools })));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner').then((m) => ({ default: m.StudyPlanner })));
const TaskManager = lazy(() => import('./pages/TaskManager').then((m) => ({ default: m.TaskManager })));
const Documents = lazy(() => import('./pages/Documents').then((m) => ({ default: m.Documents })));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
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
            <Route path="billing" element={<Navigate to="/dashboard" replace />} />
            <Route path="admin" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

