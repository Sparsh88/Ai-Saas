import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';

// Set production API URL for Render backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://skillforge-ai-api.onrender.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
