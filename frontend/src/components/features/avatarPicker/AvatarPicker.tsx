import './AvatarPicker.scss';
import { createElement, ReactNode, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';
import { Icon } from '@assets/icon';
import HandDrawnCircle from '@assets/textures/hand-drawn-circle.svg?react';

export const AvatarPicker = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <>
      <div className="avatar-picker__overlay">
        <div className="avatar-picker">
          <div className="avatar-picker__avatars">
            <Avatar name="Random" selected={selectedAvatar === 'random'} onClick={() => setSelectedAvatar('random')}>
              <Icon icon={'Random'} className="avatar__random" />
            </Avatar>
            {Object.entries(avatarList).map(([name, data]) =>
              name !== 'default' ? (
                <Avatar key={name} name={name} selected={selectedAvatar === name} onClick={() => setSelectedAvatar(name)}>
                  {createElement(data.idle)}
                </Avatar>
              ) : null,
            )}
          </div>
          <div className="avatar-picker__buttons">
            <Button>Confirm</Button>
            <Button color="remove">Cancel</Button>
          </div>
        </div>
      </div>
    </>
  );
};

type AvatarProps = {
  children?: ReactNode;
  name: string;
  selected: boolean;
  onClick: (name: string) => void;
};

const Avatar = ({ children, name, selected, onClick }: AvatarProps) => {
  return (
    <div className="avatar" onClick={() => onClick(name)}>
      {selected && (
        <div className="avatar__selected">
          <HandDrawnCircle />
        </div>
      )}
      <div className="avatar__svg">{children}</div>
      <div className="avatar__name">{name}</div>
    </div>
  );
};
