import './Lobby.scss';
import { Button } from '@components/ui/button/Button';
import { useContext, useEffect, useState } from 'react';
import { socket } from '@socket';

import { useToast } from '@hooks/useToast.ts';
import { useLobbyToggle } from '@hooks/useLobbyToggle.ts';
import { useLobbyStart } from '@hooks/useLobbyStart.ts';
import { AvatarPicker } from '@components/features/avatarPicker/AvatarPicker.tsx';

import { usePlayersStore } from '@stores/playersStore.ts';
import { AvatarPickerContext } from '@context/avatarPicker/AvatarPickerContext.ts';

type LobbyProps = {
  areRoomSettingsUpToDate: boolean;
};

export const Lobby = ({ areRoomSettingsUpToDate }: LobbyProps) => {
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const roomCode = localStorage.getItem('roomCode');
  const currentPlayer = usePlayersStore((state) => state.currentPlayer);
  const players = usePlayersStore((state) => state.players);
  const { showAvatarPicker } = useContext(AvatarPickerContext);
  const toast = useToast();

  useLobbyToggle({ setIsLoading });
  const { countdown } = useLobbyStart({ setReady });

  const toggleReady = () => {
    if (!areRoomSettingsUpToDate) return;

    if (roomCode) {
      setIsLoading(true);
      socket.emit('toggle_player_ready');
    } else {
      toast.error({ message: 'Oops! Something went wrong while setting your ready status', duration: 3 });
    }
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      const inviteLink = `${window.location.origin}/${roomCode}`;
      navigator.clipboard.writeText(inviteLink).then(() => toast.info({ message: 'Room code copied!', duration: 5 }));
    }
  };

  useEffect(() => {
    if (!currentPlayer) return;

    setReady(currentPlayer.ready);
  }, [players]);

  return (
    <div className="lobby">
      {showAvatarPicker && <AvatarPicker />}
      {countdown === null ? (
        <>
          <span className="lobby__title">
            Room Code:
            <span className="lobby__code" onClick={handleCopyRoomCode}>
              {roomCode}
            </span>
          </span>
          <div className="lobby__info">
            <span className="lobby__players">{players.filter((p) => p.ready).length}</span>
            <span className="lobby__text">Players ready</span>
          </div>
          <Button isDisabled={isLoading || !areRoomSettingsUpToDate} style={{ width: '75%' }} onClick={toggleReady}>
            {ready ? 'Unready' : 'Ready'}
          </Button>
        </>
      ) : (
        <>
          <span className="lobby__countdown">{countdown}</span>
          <span className="lobby__countdown-text">Get ready to rumble!</span>
        </>
      )}
    </div>
  );
};
