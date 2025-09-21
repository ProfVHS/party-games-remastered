import './AlertBox.scss';
import { Icon } from '@assets/icon';
import { ClassNames } from '@utils';
import { Button } from '@components/ui/button/Button.tsx';
import { capitalize } from 'lodash';

type AlertBoxProps = {
  type: 'error' | 'info' | 'warning' | 'success';
  onConfirm?: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  message: string;
};

export const AlertBox = ({ type, onConfirm, onClose, confirmText, cancelText, message }: AlertBoxProps) => {
  return (
    <div className="alert-box">
      <div className={ClassNames('alert-box__icon', [type])}>
        {type === 'success' && <Icon icon="Success" />}
        {type === 'error' && <Icon icon="Error" />}
        {type === 'warning' && <Icon icon="Warning" />}
        {type === 'info' && <Icon icon="Info" />}
      </div>
      <span className="alert-box__title">{capitalize(type)}</span>
      <span className="alert-box__message">{message}?</span>
      <div className="alert-box__buttons">
        <Button color="primary" size="small" className="alert-box__button" onClick={onConfirm}>
          {confirmText || 'Yes'}
        </Button>
        <Button color="remove" size="small" className="alert-box__button" onClick={onClose}>
          {cancelText || 'No'}
        </Button>
      </div>
    </div>
  );
};
