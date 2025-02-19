import './Lobby.scss';
import { Button } from '../../ui/button/Button';
import { useState } from 'react';
import { LobbySettings } from '../lobbySettings/LobbySettings';

import { AnimatePresence, motion } from 'framer-motion';

import { SettingsButton } from '../../ui/settingsButton/SettingsButton.tsx';
import { LobbySettingsType } from '../../../types';

export const Lobby = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [lobbySettings, setLobbySettings] = useState<LobbySettingsType>({
    isRandomMinigames: true,
    isTutorialsEnabled: true,
    minigames: []
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
              <LobbySettings
                onCancel={() => setIsSettingsOpen(false)}
                lobbySettings={lobbySettings}
                setLobbySettings={setLobbySettings}
              />
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
              <SettingsButton
                className="lobby__settingsbutton"
                onClick={() => toggleLobbySettings()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const LobbyContent = () => {
  const [ready, setReady] = useState(false);

  const toggleReady = () => {
    setReady((prevReady) => !prevReady);
  };

  const CopyRoomCode = () => {
    navigator.clipboard.writeText('ABCDE');
  };

  return (
    <>
      <span className="lobby__title" onClick={CopyRoomCode}>
        Room Code: ABCDE
      </span>
      <div className="lobby__info">
        <span className="lobby__players">0</span>
        <span className="lobby__text">Players ready</span>
      </div>
      <Button style={{ width: '75%' }} onClick={toggleReady}>
        {ready ? 'Unready' : 'Ready'}
      </Button>
    </>
  );
};
