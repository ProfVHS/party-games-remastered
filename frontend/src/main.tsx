import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { AppRoutes } from './AppRoutes.tsx';
import ToastProvider from './context/toast/ToastProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </React.StrictMode>,
);
