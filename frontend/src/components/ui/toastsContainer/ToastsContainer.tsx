import './ToastsContainer.scss';
import { ToastsType } from '@frontend-types/index';
import { Toast } from '@components/ui/toast/Toast.tsx';

export const ToastsContainer = ({ toasts }: { toasts: ToastsType[] }) => {
  return (
    <div className="toasts-container">
      {toasts.map((t) => (
        <Toast {...t} key={t.id} />
      ))}
    </div>
  );
};
