import './AvatarPicker.scss';
import { createElement, useContext, useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import { Avatar } from '@components/features/avatarPicker/Avatar.tsx';
import { Icon } from '@assets/icon';
import { useToast } from '@hooks/useToast.ts';
import { ReturnDataType } from '@shared/types';
import { socket } from '@socket';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { AvatarPickerContext } from '@context/avatarPicker/AvatarPickerContext.ts';
import { Modal } from '@components/ui/modal/Modal.tsx';

export const AvatarPicker = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [freeAvatars, setFreeAvatars] = useState<string[] | null>(null);
  const { setShowAvatarPicker } = useContext(AvatarPickerContext);
  const { players } = usePlayersStore();
  const toast = useToast();

  const handleConfirmAvatar = () => {
    let avatar = selectedAvatar;

    if (selectedAvatar === null) {
      toast.warning({ message: 'You need to select an avatar.', duration: 3 });
      return;
    }

    if (selectedAvatar === 'random') {
      if (!freeAvatars) return;

      avatar = freeAvatars[Math.floor(Math.random() * freeAvatars.length)];
    }

    socket.emit('choose_avatar', avatar, (response: ReturnDataType) => {
      if (response.success) {
        setShowAvatarPicker(false);
      } else {
        toast.error({ message: response.payload || 'Selection failed. Try again.', duration: 3 });
      }
    });
  };

  useEffect(() => {
    const takenAvatars = players.map((p) => p.avatar);

    setFreeAvatars(Object.keys(avatarList).filter((key) => !takenAvatars.includes(key)));
  }, [players]);

  return (
    <Modal onClose={() => setShowAvatarPicker(false)}>
      <div className="avatar-picker">
        <div className="avatar-picker__avatars">
          <Avatar name="Random" selected={selectedAvatar === 'random'} onClick={() => setSelectedAvatar('random')}>
            <Icon icon={'Random'} className="avatar__random" />
          </Avatar>
          {Object.entries(avatarList).map(([name, data]) =>
            name !== 'default' ? (
              <Avatar key={name} name={name} selected={selectedAvatar === name} locked={!freeAvatars?.includes(name)} onClick={() => setSelectedAvatar(name)}>
                {createElement(data.idle)}
              </Avatar>
            ) : null,
          )}
        </div>
        <div className="avatar-picker__buttons">
          <Button onClick={handleConfirmAvatar}>Confirm</Button>
          <Button color="remove" onClick={() => setShowAvatarPicker(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
