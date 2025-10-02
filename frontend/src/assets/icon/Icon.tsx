import classNames from 'classnames';
import { createElement } from 'react';
import { icons } from './icons.ts';
import "./Icon.scss"

export type IconNames = keyof typeof icons;

type IconProps = {
  icon: IconNames;
  className?: string;
};
export const Icon = ({ icon, className }: IconProps) => {
  return (
    <div className={classNames('icon', [className])}>
      {createElement(icons[icon], {
        style: { width: '100%', height: '100%' },
      })}
    </div>
  );
};
