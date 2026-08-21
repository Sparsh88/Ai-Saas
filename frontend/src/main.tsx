import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';

// Set production API URL for Render backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://skillforge-ai-api.onrender.com';

// Initialize theme class immediately from localStorage
const savedTheme = localStorage.getItem('SF_THEME') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
} else {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
