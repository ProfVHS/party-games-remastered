import './SettingsButton.scss';
import { SVGProps } from 'react';
import { Icon } from '@assets/icon';
import { ClassNames } from '@utils';

type SettingsButtonProps = {
  onClick: () => void;
  className?: string;
  props?: SVGProps<SVGSVGElement>;
};

export const SettingsButton = ({ onClick, className, props }: SettingsButtonProps) => {
  return (
    <button className={ClassNames('settings-button', className)} onClick={onClick}>
      <Icon icon="Settings" {...props} />
    </button>
  );
};
