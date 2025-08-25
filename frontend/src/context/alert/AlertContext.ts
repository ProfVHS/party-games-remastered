import { createContext } from 'react';

export type AlertContextType = {
  success: (message: string, onAccept: () => void) => void;
  info: (message: string, onAccept: () => void) => void;
  warning: (message: string, onAccept: () => void) => void;
  error: (message: string, onAccept: () => void) => void;
  hide: () => void;
};

export const AlertContext = createContext<AlertContextType | null>(null);
