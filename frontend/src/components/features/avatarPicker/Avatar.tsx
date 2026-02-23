import { ReactNode } from 'react';
import { Icon } from '@assets/icon';
import HandDrawnCircle from '@assets/textures/hand-drawn-circle.svg?react';
import { ClassNames } from '@utils';
import './Avatar.scss';

type AvatarProps = {
  children?: ReactNode;
  name: string;
  selected?: boolean;
  locked?: boolean;
  onClick: (name: string) => void;
};

export const Avatar = ({ children, name, selected, locked, onClick }: AvatarProps) => {
  const handleSelectAvatar = () => {
    if (locked) return;
    onClick(name);
  };

  return (
    <div className="avatar" onClick={handleSelectAvatar}>
      <div className="avatar__svg">
        {locked ? (
          <div className="avatar__locked">
            <Icon icon="Lock" />
          </div>
        ) : selected ? (
          <div className="avatar__selected">
            <HandDrawnCircle />
          </div>
        ) : null}
        {children}
      </div>
      <div className={ClassNames('avatar__name', { locked: locked })}>{name}</div>
    </div>
  );
};
