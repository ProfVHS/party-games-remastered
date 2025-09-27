import './LobbyContent.scss';
import { Button } from '@components/ui/button/Button';
import { useState } from 'react';
import { socket } from '@socket';

import { LobbySettingsType, MinigameEntryType } from '@frontend-types/index';
import { MinigameNamesEnum } from '@shared/types';
import { useToast } from '@hooks/useToast.ts';
import { useLobbyToggle } from '@hooks/useLobbyToggle.ts';
import { useLobbyFetch } from '@hooks/useLobbyFetch.ts';
import { useLobbyStart } from '@hooks/useLobbyStart.ts';

type LobbyContentProps = {
  lobbySettings: LobbySettingsType
}

export const LobbyContent = ({ lobbySettings }: LobbyContentProps) => {
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const roomCode = localStorage.getItem('roomCode');

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
    minigames: convertToMinigameEnums(lobbySettings.minigames),
    numberOfMinigames: lobbySettings.numberOfMinigames,
    setReady
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
      navigator.clipboard.writeText(roomCode).then(() =>
        toast.info({ message: 'Room code copied!', duration: 5 }));
    }
  };

  return (
    <div className="lobby-content">
      {countdown === null ? (
        <>
          <span className="lobby-content__title">
            Room Code:
            <span className="lobby-content__code" onClick={handleCopyRoomCode}>
              {roomCode}
            </span>
          </span>
          <div className="lobby-content__info">
            <span className="lobby-content__players">{playersReady}</span>
            <span className="lobby-content__text">Players ready</span>
          </div>
          <Button isDisabled={isLoading} style={{ width: '75%' }} onClick={toggleReady}>
            {ready ? 'Unready' : 'Ready'}
          </Button>
        </>
      ) : (
        <>
          <span className="lobby-content__countdown">{countdown}</span>
          <span className="lobby-content__countdown-text">Get ready to rumble!</span>
        </>
      )}
    </div>
  );
};
