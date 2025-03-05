import { SVGProps } from 'react';
import './SettingsButton.scss';
import classNames from 'classnames';
import { Icon } from '../../../assets/icon';

type SettingsButtonProps = {
  onClick: () => void;
  className?: string;
  props?: SVGProps<SVGSVGElement>;
};
export const SettingsButton = ({ onClick, className, props }: SettingsButtonProps) => {
  return (
    <button className={classNames('settings-button', [className])} onClick={onClick}>
      <Icon icon="Settings" {...props} />
    </button>
  );
};
