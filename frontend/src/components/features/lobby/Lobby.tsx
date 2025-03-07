import './Lobby.scss';
import { Button } from '../../ui/button/Button';
import { useState } from 'react';
import { LobbySettings } from '../lobbySettings/LobbySettings';
import { socket } from '../../../socket.ts';

import { AnimatePresence, motion } from 'framer-motion';

import { SettingsButton } from '../../ui/settingsButton/SettingsButton.tsx';
import { LobbySettingsType } from '../../../types';
import { useToast } from '../../../hooks/useToast.ts';
import { useRoomToggle } from '../../../hooks/useRoomToggle.ts';
import { useRoomFetch } from '../../../hooks/useRoomFetch.ts';

export const Lobby = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [lobbySettings, setLobbySettings] = useState<LobbySettingsType>({
    isRandomMinigames: true,
    isTutorialsEnabled: true,
    minigames: [],
  });

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
              <LobbyContent />
              <SettingsButton className="lobby__settingsbutton" onClick={() => toggleLobbySettings()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const LobbyContent = () => {
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useRoomToggle({ setPlayersReady, setIsLoading });
  useRoomFetch({ setPlayersReady });

  const toast = useToast();

  const toggleReady = () => {
    setIsLoading(true);
    const nickname = sessionStorage.getItem('nickname');
    const roomCode = sessionStorage.getItem('roomCode');

    setReady((prevReady) => !prevReady);

    if (nickname && roomCode) {
      socket.emit('toggle_player_ready', roomCode, nickname);
    }
  };

  const handleCopyRoomCode = () => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.info({ message: 'Room code copied!', duration: 5 });
    }
  };

  const tempFunction = () => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (roomCode) {
      socket.emit('start_minigame', roomCode, 'Click the Bomb');
    }
  };

  socket.on('started_minigame', () => {
    console.log('Minigame started1!!!!!!!');
  });

  return (
    <>
      <span className="lobby__title">
        Room Code:{' '}
        <span className="lobby__code" onClick={handleCopyRoomCode}>
          {sessionStorage.getItem('roomCode')}
        </span>
      </span>
      <div className="lobby__info">
        <span className="lobby__players">{playersReady}</span>
        <span className="lobby__text">Players ready</span>
      </div>
      <Button isDisabled={isLoading} style={{ width: '75%' }} onClick={toggleReady}>
        {ready ? 'Unready' : 'Ready'}
      </Button>
      <button onClick={tempFunction}>Start Minigame</button>
    </>
  );
};
