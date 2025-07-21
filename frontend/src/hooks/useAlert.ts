import { useContext } from 'react';
import { AlertContext } from '../context/alert/AlertContext.ts';

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used in a AlertProvider');
  }
  return context;
}
