import './Lobby.scss';
import { Button } from '@components/ui/button/Button';
import { useState } from 'react';
import { socket } from '@socket';

import { MinigameEntryType } from '@frontend-types/index';
import { MinigameNamesEnum } from '@shared/types';
import { useToast } from '@hooks/useToast.ts';
import { useLobbyToggle } from '@hooks/useLobbyToggle.ts';
import { useLobbyFetch } from '@hooks/useLobbyFetch.ts';
import { useLobbyStart } from '@hooks/useLobbyStart.ts';
import { useRoomStore } from '@stores/roomStore.ts';

export const Lobby = () => {
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const roomCode = localStorage.getItem('roomCode');

  const { roomSettings } = useRoomStore();

  const convertToMinigameEnums = (minigameList: MinigameEntryType[]): MinigameNamesEnum[] => {
    return minigameList
      .map((minigame) => {
        const match = Object.values(MinigameNamesEnum).find((val) => val === minigame.name);
        return match as MinigameNamesEnum | undefined;
      })
      .filter((val): val is MinigameNamesEnum => val !== undefined);
  };

  useLobbyToggle({ setPlayersReady, setIsLoading });
  useLobbyFetch({ setPlayersReady });
  const { countdown } = useLobbyStart({
    playersReady,
    minigames: convertToMinigameEnums(roomSettings.minigames),
    numberOfMinigames: roomSettings.numberOfMinigames,
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
      navigator.clipboard.writeText(roomCode).then(() => toast.info({ message: 'Room code copied!', duration: 5 }));
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
