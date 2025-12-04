import './AvatarPicker.scss';
import { Button } from '@components/ui/button/Button.tsx';

export const AvatarPicker = () => {
  return (
    <>
      <div className="avatar-picker__overlay">
        <div className="avatar-picker">
          <div className="avatar-picker__avatars">
            <Avatar />
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

const Avatar = () => {
  return (
    <div className="avatar">
      <div className="avatar__svg"></div>
      <div className="avatar__name">Avatar</div>
    </div>
  );
};
