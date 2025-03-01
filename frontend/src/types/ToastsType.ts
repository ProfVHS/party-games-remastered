export type ToastsType = {
  id: number;
  message: string;
  type: 'error' | 'info' | 'warning' | 'success';
  duration?: number;
};
