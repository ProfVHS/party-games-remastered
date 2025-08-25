import { createContext } from 'react';
import { ToastContextType } from '@frontend-types/index';

export const ToastContext = createContext<ToastContextType | null>(null);
