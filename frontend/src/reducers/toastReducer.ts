import { ToastsType } from '../types';
import React from 'react';

type ToastsState = {
  toasts: ToastsType[];
};

type ToastsAction = { type: 'ADD_TOAST'; payload: ToastsType } | { type: 'REMOVE_TOAST'; payload: number };

export const toastReducer: React.Reducer<ToastsState, ToastsAction> = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST': {
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    }
    case 'REMOVE_TOAST': {
      const updatedToasts = state.toasts.filter((toast: ToastsType) => toast.id !== action.payload);
      return {
        ...state,
        toasts: updatedToasts
      };
    }
    default:
      return state;
  }
};
