import { useContext } from 'react';
import { ToastContextType } from '@frontend-types/index';
import { ToastContext } from '@context/toast/ToastContext.ts';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used in a ToastProvider');
  }
  return context;
};
