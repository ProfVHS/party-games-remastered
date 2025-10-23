import './RoomSettings.scss';
import { useState } from 'react';
import { Button } from '@components/ui/button/Button';
import { AnimatePresence } from 'framer-motion';
import { RoomSettingsType } from '@frontend-types/index';
import { Modal } from '@components/ui/modal/Modal.tsx';
import { MinigamesList } from '@components/features/minigamesList/MinigamesList.tsx';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import * as _ from 'lodash';
import { Icon } from '@assets/icon';
import { socket } from '@socket';
import { SettingRow } from '@components/features/roomSettings/SettingRow.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { MinigameEntryType } from '@shared/types/RoomSettingsType.ts';

export const RoomSettings = () => {
  const { roomSettings, setRoomSettings } = useRoomStore();

  const [minigamesModal, setMinigamesModal] = useState(false);
  const [newRoomSettings, setNewRoomSettings] = useState<RoomSettingsType>(roomSettings);

  const { currentPlayer } = usePlayersStore();

  const isHost = currentPlayer?.isHost || false;
  const currentRoomSettings = isHost ? newRoomSettings : roomSettings;

  const toast = useToast();

  const handleSave = () => {
    if (!newRoomSettings.isRandomMinigames) {
      if (newRoomSettings.minigames === null || newRoomSettings.minigames!.length < 2) {
        toast.error({
          message: 'Please select at least two minigame',
          duration: 3,
        });
        return;
      }
    }
    setRoomSettings(newRoomSettings);
    socket.emit('update_room_settings', newRoomSettings, () => {
      toast.success({ message: 'Successfully updated room settings', duration: 3 });
    });
  };

  const resetSettings = () => {
    setNewRoomSettings(currentRoomSettings);
  };

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Minigames Settings</span>

      <SettingRow
        isHost={isHost}
        label="Random mode"
        value={currentRoomSettings.isRandomMinigames}
        onChange={(value) => setNewRoomSettings((prev) => ({ ...prev, isRandomMinigames: value as boolean }))}
        type="switch"
      />

      {currentRoomSettings.isRandomMinigames ? (
        <SettingRow
          isHost={isHost}
          label="Number of games"
          value={currentRoomSettings.numberOfMinigames}
          onChange={(value) => setNewRoomSettings((prev) => ({ ...prev, numberOfMinigames: value as number }))}
          type="number-picker"
        />
      ) : (
        <SettingRow
          isHost={isHost}
          label="Minigames"
          value={currentRoomSettings.numberOfMinigames}
          onChange={() => setMinigamesModal(true)}
          type="button"
          text="Open List"
        />
      )}

      <SettingRow
        isHost={isHost}
        label="Tutorial before minigames?"
        value={currentRoomSettings.isTutorialsEnabled}
        onChange={(value) => setNewRoomSettings((prev) => ({ ...prev, isTutorialsEnabled: value as boolean }))}
        type="switch"
      />

      <div className="lobby-settings__buttons">
        {isHost && !_.isEqual(roomSettings, newRoomSettings) && (
          <>
            <Button variant="icon" size="small" onClick={handleSave}>
              <Icon icon="Save" />
            </Button>
            <Button variant="icon" size="small" color="remove" onClick={resetSettings}>
              <Icon icon="Trash" />
            </Button>
          </>
        )}
      </div>
      <AnimatePresence>
        {minigamesModal && (
          <Modal onClose={() => setMinigamesModal(false)} transparentBg>
            <MinigamesList
              isHost={isHost}
              onCancel={() => setMinigamesModal(false)}
              onSave={(minigames: MinigameEntryType[]) => setNewRoomSettings((prev) => ({ ...prev, minigames }))}
              minigames={currentRoomSettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
