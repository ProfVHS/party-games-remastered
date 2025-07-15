import { AlertType } from '../types/AlertType.ts';
import React from 'react';

type AlertState = {
  alert: AlertType | null;
}

type AlertActionType = { type: 'SHOW_ALERT', payload: AlertType } | { type: 'HIDE_ALERT' }

export const alertReducer: React.Reducer<AlertState, AlertActionType> = (state, action) => {
  switch (action.type) {
    case 'SHOW_ALERT': {
      return {
        ...state,
        alert: action.payload
      };
    }
    case 'HIDE_ALERT': {
      return {...state, alert: null}
    }
    default:
      return state;
  }
};
