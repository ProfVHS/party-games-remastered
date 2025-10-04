import './LobbySettings.scss';
import { useState } from 'react';
import { Button } from '@components/ui/button/Button';
import { AnimatePresence } from 'framer-motion';
import { MinigameEntryType, RoomSettingsType } from '@frontend-types/index';
import { Modal } from '@components/ui/modal/Modal.tsx';
import { MinigamesList } from '@components/features/minigamesList/MinigamesList.tsx';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import * as _ from 'lodash';
import { Icon } from '@assets/icon';
import { socket } from '@socket';
import { SettingRow } from '@components/features/lobbySettings/SettingRow.tsx';

type LobbySettingsProps = {
  setLobbySettings: (settings: RoomSettingsType) => void;
  currentRoomSettings: RoomSettingsType;
}

export const LobbySettings = ({ setLobbySettings, currentRoomSettings }: LobbySettingsProps) => {
  const [minigamesModal, setMinigamesModal] = useState(false);
  const [newRoomSettings, setNewRoomSettings] = useState<RoomSettingsType>(currentRoomSettings);

  const { currentPlayer } = usePlayersStore();

  const isHost = currentPlayer?.isHost === 'true';
  const roomSettings = isHost ? newRoomSettings : currentRoomSettings;

  const toast = useToast();

  const handleSave = () => {
    if (!newRoomSettings.isRandomMinigames) {
      if (newRoomSettings.minigames === null || newRoomSettings.minigames!.length < 2) {
        toast.error({
          message: 'Please select at least two minigame',
          duration: 5
        });
        return;
      }
    }
    setLobbySettings(newRoomSettings);
    socket.emit('update_room_settings', JSON.stringify(newRoomSettings));
  };

  const resetLobbySettings = () => {
    setNewRoomSettings(currentRoomSettings);
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Minigames Settings</span>

      <SettingRow isHost={isHost} label="Random mode" value={roomSettings.isRandomMinigames}
                  onChange={(value) => setNewRoomSettings(prev => ({ ...prev, isRandomMinigames: value as boolean }))}
                  type="Switch" />

      {roomSettings.isRandomMinigames ? (
        <SettingRow isHost={isHost} label="Number of games" value={roomSettings.numberOfMinigames}
                    onChange={(value) => setNewRoomSettings(prev => ({ ...prev, numberOfMinigames: value as number }))}
                    type="NumberPicker" />
      ) : (
        <SettingRow isHost={isHost} label="Minigames" value={roomSettings.numberOfMinigames}
                    onChange={() => setMinigamesModal(true)}
                    type="Button" text="Open List" />
      )}

      <SettingRow isHost={isHost} label="Tutorial before minigames?" value={roomSettings.isTutorialsEnabled}
                  onChange={(value) => setNewRoomSettings(prev => ({ ...prev, isTutorialsEnabled: value as boolean }))}
                  type="Switch" />

      <div className="lobby-settings__buttons">
        {currentPlayer?.isHost === 'true' && !_.isEqual(currentRoomSettings, newRoomSettings) && (
          <>
            <Button variant="icon" size="small" onClick={handleSave}>
              <Icon icon="Save" />
            </Button>
            <Button variant="icon" size="small" color="remove" onClick={resetLobbySettings}>
              <Icon icon="Trash" />
            </Button>
          </>
        )}
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)} transparentBg>
            <MinigamesList
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: MinigameEntryType[]) => setNewRoomSettings(prev => ({ ...prev, minigames }))}
              minigames={newRoomSettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
