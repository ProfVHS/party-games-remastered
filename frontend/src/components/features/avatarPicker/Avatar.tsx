import { ReactNode } from 'react';
import { Icon } from '@assets/icon';
import HandDrawnCircle from '@assets/textures/hand-drawn-circle.svg?react';

type AvatarProps = {
  children?: ReactNode;
  name: string;
  selected?: boolean;
  locked?: boolean;
  onClick: (name: string) => void;
};

export const Avatar = ({ children, name, selected, locked, onClick }: AvatarProps) => {
  return (
    <div className="avatar" onClick={() => onClick(name)}>
      {locked ? (
        <div className="avatar__locked">
          <Icon icon="Lock" />
        </div>
      ) : selected ? (
        <div className="avatar__selected">
          <HandDrawnCircle />
        </div>
      ) : null}
      <div className="avatar__svg">{children}</div>
      <div className="avatar__name">{name}</div>
    </div>
  );
};
