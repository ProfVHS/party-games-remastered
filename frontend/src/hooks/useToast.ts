import { ToastProvider } from '../context/Toast/ToastProvider.tsx';
import { useContext } from 'react';
import { ToastContextType } from '../types';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastProvider);
  if(!context) {
    throw new Error('useToast must be used in a ToastProvider');
  }
  return context;
};
