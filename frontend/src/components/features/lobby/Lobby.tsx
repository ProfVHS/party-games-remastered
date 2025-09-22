import './Lobby.scss';
import { Button } from '@components/ui/button/Button';
import { useState } from 'react';
import { LobbySettings } from '@components/features/lobbySettings/LobbySettings';
import { socket } from '@socket';

import { AnimatePresence, motion } from 'framer-motion';

import { LobbySettingsType, MinigameEntryType } from '@frontend-types/index';
import { MinigameNamesEnum } from '@shared/types';

import { SettingsButton } from '@components/ui/settingsButton/SettingsButton.tsx';
import { useToast } from '@hooks/useToast.ts';
import { useLobbyToggle } from '@hooks/useLobbyToggle.ts';
import { useLobbyFetch } from '@hooks/useLobbyFetch.ts';
import { useLobbyStart } from '@hooks/useLobbyStart.ts';
import { usePlayersStore } from '@stores/playersStore.ts';

export const Lobby = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { currentPlayer } = usePlayersStore();

  const [lobbySettings, setLobbySettings] = useState<LobbySettingsType>({
    isRandomMinigames: true,
    isTutorialsEnabled: true,
    minigames: [],
  });

  /**
   * Converts a list of minigame entries (with string names)
   * into a valid array of PossibleMinigamesEnum enum values.
   *
   * Filters out any invalid or unrecognized names that don't exist in the enum.
   *
   * Example:
   * Input:  [{ name: 'Click the Bomb' }, { name: 'none' }, { name: 'invalid' }]
   * Output: [PossibleMinigamesEnum.clickTheBomb, PossibleMinigamesEnum.none]
   */
  const convertToMinigameEnums = (minigameList: MinigameEntryType[]): MinigameNamesEnum[] => {
    return minigameList
      .map((minigame) => {
        const match = Object.values(MinigameNamesEnum).find((val) => val === minigame.name);
        return match as MinigameNamesEnum | undefined;
      })
      .filter((val): val is MinigameNamesEnum => val !== undefined);
  };

  const toggleLobbySettings = () => setIsSettingsOpen((prev) => !prev);
  return (
    <>
      <div className="lobby">
        <AnimatePresence mode="wait" initial={false}>
          {isSettingsOpen ? (
            <motion.div
              key={'1'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.2, duration: 0.2 }}
              style={{ height: '100%' }}
            >
              <LobbySettings onCancel={() => setIsSettingsOpen(false)} lobbySettings={lobbySettings} setLobbySettings={setLobbySettings} />
            </motion.div>
          ) : (
            <motion.div
              className="lobby__content"
              key={'2'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <LobbyContent minigames={convertToMinigameEnums(lobbySettings.minigames)} numberOfMinigames={lobbySettings.numberOfMinigames} />
              {currentPlayer?.isHost === 'true' && <SettingsButton className="lobby__settingsbutton" onClick={() => toggleLobbySettings()} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const LobbyContent = ({ minigames, numberOfMinigames }: { minigames: MinigameNamesEnum[]; numberOfMinigames?: number }) => {
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const roomCode = localStorage.getItem('roomCode');

  useLobbyToggle({ setPlayersReady, setIsLoading });
  useLobbyFetch({ setPlayersReady });
  const { countdown } = useLobbyStart({ playersReady, minigames, numberOfMinigames, setReady });

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
      navigator.clipboard.writeText(roomCode);
      toast.info({ message: 'Room code copied!', duration: 5 });
    }
  };

  return (
    <>
      {countdown !== null ? (
        <>
          <span className="lobby__countdown">{countdown}</span>
          <span className="lobby__countdown-text">Get ready to rumble!</span>
        </>
      ) : (
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
      )}
    </>
  );
};
