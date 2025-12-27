import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './AppRoutes.tsx';
import ToastProvider from '@context/toast/ToastProvider.tsx';
import { ThemeProvider } from '@context/theme/ThemeProvider.tsx';
import { AlertProvider } from '@context/alert/AlertProvider.tsx';
import { AvatarPickerProvider } from '@context/avatarPicker/AvatarPickerProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AlertProvider>
      <ToastProvider>
        <ThemeProvider>
          <AvatarPickerProvider>
            <AppRoutes />
          </AvatarPickerProvider>
        </ThemeProvider>
      </ToastProvider>
    </AlertProvider>
  </React.StrictMode>,
);
