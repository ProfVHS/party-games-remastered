import { SVGProps } from 'react';
import './SettingsButton.scss';
import { Icon } from '../../../assets/icon';
import { ClassNames } from '../../../utils.ts';

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
