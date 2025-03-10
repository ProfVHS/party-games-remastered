import { useContext } from 'react';
import { ToastContextType } from '../types';
import { ToastContext } from '../context/Toast/ToastContext.ts';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if(!context) {
    throw new Error('useToast must be used in a ToastProvider');
  }
  return context;
};
