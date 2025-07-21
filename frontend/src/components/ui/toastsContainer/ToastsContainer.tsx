import { ToastsType } from '../../../types';
import { Toast } from '../toast/Toast.tsx';
import './ToastsContainer.scss';

export const ToastsContainer = ({ toasts }: { toasts: ToastsType[] }) => {

  return (
    <div className="toasts-container">
      {toasts.map((t) => (
        <Toast {...t} key={t.id} />
      ))}
    </div>
  );
};
