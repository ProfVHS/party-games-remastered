import classNames from 'classnames';
import { createElement } from 'react';
import { minigameIcons } from './minigameIcons.ts';

export type MinigameIconNames = keyof typeof minigameIcons;

type MinigameIconProps = {
  minigameIcon: MinigameIconNames;
  className?: string;
};
export const MinigameIcon = ({ minigameIcon, className }: MinigameIconProps) => {
  return (
    <div className={classNames('minigame-icon', [className])}>
      {createElement(minigameIcons[minigameIcon], {
        style: { width: '100%', height: '100%' },
      })}
    </div>
  );
};
