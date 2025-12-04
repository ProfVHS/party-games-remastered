import './AvatarPicker.scss';
import { createElement, ReactNode } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';

export const AvatarPicker = () => {
  return (
    <>
      <div className="avatar-picker__overlay">
        <div className="avatar-picker">
          <div className="avatar-picker__avatars">
            {Object.entries(avatarList).map(([name, data]) => (
              <Avatar key={name} name={name}>
                {createElement(data.idle)}
              </Avatar>
            ))}
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
  name: string;
  children?: ReactNode;
};

const Avatar = ({ name, children }: AvatarProps) => {
  return (
    <div className="avatar">
      <div className="avatar__svg">{children}</div>
      <div className="avatar__name">{name}</div>
    </div>
  );
};
