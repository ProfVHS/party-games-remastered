import React, { useReducer } from 'react';
import { AlertContext } from './AlertContext.ts';
import { alertReducer } from '../../reducers/alertReducer.ts';
import { AlertType } from '../../types/AlertType.ts';
import { AlertContainer } from '../../components/ui/alertContainer/AlertContainer.tsx';

type alertProviderProps = {
  children: React.ReactNode
}

const initialState = {
  alert: null
};

export const AlertProvider = ({ children }: alertProviderProps) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const showAlert = (alert: AlertType) => {
    dispatch({
      type: 'SHOW_ALERT',
      payload: {
        message: alert.message,
        onConfirm: alert.onConfirm,
        type: alert.type
      }
    });
  };

  const success = (message: string, onConfirm: () => void) => showAlert({ message: message, onConfirm: onConfirm, type: 'success' });
  const info = (message: string, onConfirm: () => void) => showAlert({ message: message, onConfirm: onConfirm, type: 'info' });
  const error = (message: string, onConfirm: () => void) => showAlert({ message: message, onConfirm: onConfirm, type: 'error' });
  const warning = (message: string, onConfirm: () => void) => showAlert({ message: message, onConfirm: onConfirm, type: 'warning' });
  const hide = () => dispatch({ type: 'HIDE_ALERT' });

  const value = { success, info, error, warning, hide };

  return (
    <AlertContext.Provider value={value}>
      <AlertContainer alert={state.alert} />
      {children}
    </AlertContext.Provider>
  );
};
