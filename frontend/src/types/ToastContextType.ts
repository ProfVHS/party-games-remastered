import { addToastProps } from './AddToastPropsType.ts';

export type ToastContextType = {
  success: ({ message, duration }: addToastProps) => void;
  info: ({ message, duration }: addToastProps) => void;
  warning: ({ message, duration }: addToastProps) => void;
  error: ({ message, duration }: addToastProps) => void;
  remove: (id: number) => void;
}
