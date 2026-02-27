import './AvatarPicker.scss';
import { createElement, useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button.tsx';
import { Avatar } from '@components/features/avatarPicker/Avatar.tsx';
import { Icon } from '@assets/icon';
import { useToast } from '@hooks/useToast.ts';
import { ReturnDataType } from '@shared/types';
import { socket } from '@socket';
import { avatarList } from '@components/features/playerAvatar/avatarList.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { Modal } from '@components/ui/modal/Modal.tsx';

type AvatarPickerProps = {
  onClose: () => void;
};

export const AvatarPicker = ({ onClose }: AvatarPickerProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [freeAvatars, setFreeAvatars] = useState<string[] | null>(null);
  const players = usePlayersStore((state) => state.players);
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);
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
        onClose();
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
    <Modal onClose={() => onClose()}>
      <div className="avatar-picker">
        <div className="avatar-picker__header">Pick your Avatar</div>
        <div className="avatar-picker__avatars">
          <Avatar name="Random" selected={selectedAvatar === 'random'} onClick={() => setSelectedAvatar('random')}>
            <Icon icon={'Random'} className="avatar__random" />
          </Avatar>
          {Object.entries(avatarList).map(([name, data]) =>
            name !== 'default' ? (
              <Avatar
                key={name}
                name={name}
                selected={selectedAvatar === name || (currentPlayer?.avatar === name && !selectedAvatar)}
                locked={!freeAvatars?.includes(name) && currentPlayer?.avatar !== name}
                onClick={() => setSelectedAvatar(name)}
              >
                {createElement(data.idle)}
              </Avatar>
            ) : null,
          )}
        </div>
        <div className="avatar-picker__buttons">
          <Button size="small" onClick={handleConfirmAvatar}>
            Confirm
          </Button>
          <Button color="remove" size="small" onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
