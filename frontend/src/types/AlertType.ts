export type AlertType = {
  message: string;
  onConfirm: () => void;
  type: 'error' | 'info' | 'warning' | 'success';
};
