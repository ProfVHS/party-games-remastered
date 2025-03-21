import React, { useReducer } from 'react';
import { addToastProps, ToastsType } from '../../types';
import { toastReducer } from '../../reducers/toastReducer.ts';
import { ToastsContainer } from '../../components/ui/toastsContainer/ToastsContainer.tsx';
import { ToastContext } from './ToastContext.ts';

const initialState = {
  toasts: [],
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  type addToastType = Omit<ToastsType, 'id'>;
  const addToast = (toast: addToastType) => {
    const id = Math.floor(Math.random() * 1000000);
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id,
        message: toast.message,
        type: toast.type,
        duration: toast.duration,
      },
    });
  };

  const success = ({ message, duration }: addToastProps) => addToast({ message, duration, type: 'success' });
  const info = ({ message, duration }: addToastProps) => addToast({ message, duration, type: 'info' });
  const error = ({ message, duration }: addToastProps) => addToast({ message, duration, type: 'error' });
  const warning = ({ message, duration }: addToastProps) => addToast({ message, duration, type: 'warning' });
  const remove = (id: number) => dispatch({ type: 'REMOVE_TOAST', payload: id });

  const value = { success, info, warning, error, remove };

  return (
    <ToastContext.Provider value={value}>
      <ToastsContainer toasts={state.toasts} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
