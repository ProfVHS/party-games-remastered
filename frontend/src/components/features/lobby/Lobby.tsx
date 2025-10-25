import './Lobby.scss';
import { Button } from '@components/ui/button/Button';
import { useState } from 'react';
import { socket } from '@socket';

import { useToast } from '@hooks/useToast.ts';
import { useLobbyToggle } from '@hooks/useLobbyToggle.ts';
import { useLobbyFetch } from '@hooks/useLobbyFetch.ts';
import { useLobbyStart } from '@hooks/useLobbyStart.ts';

export const Lobby = () => {
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const roomCode = localStorage.getItem('roomCode');

  useLobbyToggle({ setPlayersReady, setIsLoading });
  useLobbyFetch({ setPlayersReady });
  const { countdown } = useLobbyStart({
    playersReady,
    setReady,
  });

  const toast = useToast();

  const toggleReady = () => {
    setIsLoading(true);

    setReady((prevReady) => !prevReady);

    if (roomCode) {
      socket.emit('toggle_player_ready');
    }
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      const inviteLink = `${window.location.origin}/${roomCode}`;
      navigator.clipboard.writeText(inviteLink).then(() => toast.info({ message: 'Room code copied!', duration: 5 }));
    }
  };

  return (
    <div className="lobby">
      {countdown === null ? (
        <>
          <span className="lobby__title">
            Room Code:
            <span className="lobby__code" onClick={handleCopyRoomCode}>
              {roomCode}
            </span>
          </span>
          <div className="lobby__info">
            <span className="lobby__players">{playersReady}</span>
            <span className="lobby__text">Players ready</span>
          </div>
          <Button isDisabled={isLoading} style={{ width: '75%' }} onClick={toggleReady}>
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
