import './RoomSettings.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@components/ui/button/Button';
import { AnimatePresence } from 'framer-motion';
import { RoomSettingsType } from '@shared/types';
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

type RoomSettingsProps = {
  roomSettings: RoomSettingsType;
  setAreRoomSettingsUpToDate: Dispatch<SetStateAction<boolean>>;
};

export const RoomSettings = ({ roomSettings, setAreRoomSettingsUpToDate }: RoomSettingsProps) => {
  const setRoomSettings = useRoomStore((state) => state.setRoomSettings);

  const [minigamesModal, setMinigamesModal] = useState<boolean>(false);
  const [newRoomSettings, setNewRoomSettings] = useState<RoomSettingsType>(roomSettings);

  const { currentPlayer } = usePlayersStore();

  const isHost = currentPlayer?.isHost || false;
  const currentRoomSettings = isHost ? newRoomSettings : roomSettings;

  const toast = useToast();

  const handleRoomSettingsChange = (field: string, value: unknown) => {
    if (currentPlayer?.ready) {
      socket.emit('toggle_player_ready');
    }

    setNewRoomSettings((prev) => {
      switch (field) {
        case 'isRandomMinigames':
          return { ...prev, isRandomMinigames: value as boolean };
        case 'numberOfMinigames':
          return { ...prev, numberOfMinigames: value as number };
        case 'isTutorialsEnabled':
          return { ...prev, isTutorialsEnabled: value as boolean };
        case 'minigames':
          return { ...prev, minigames: value as MinigameEntryType[] };
        default:
          console.warn(`Unknown room setting field: ${field}`);
          return prev;
      }
    });
  };

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
    setNewRoomSettings(roomSettings);
  };

  useEffect(() => {
    if (!isHost) return;

    if (_.isEqual(roomSettings, newRoomSettings)) {
      setAreRoomSettingsUpToDate(true);
    } else {
      setAreRoomSettingsUpToDate(false);
    }
  }, [roomSettings, newRoomSettings]);

  return (
    <div className="lobby-settings">
      <span className="lobby-settings__title">Minigames Settings</span>

      <SettingRow
        isHost={isHost}
        label="Random mode"
        value={currentRoomSettings.isRandomMinigames}
        onChange={(value) => handleRoomSettingsChange('isRandomMinigames', value)}
        type="switch"
      />

      {currentRoomSettings.isRandomMinigames ? (
        <SettingRow
          isHost={isHost}
          label="Number of games"
          value={currentRoomSettings.numberOfMinigames}
          onChange={(value) => handleRoomSettingsChange('numberOfMinigames', value)}
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
        onChange={(value) => handleRoomSettingsChange('isTutorialsEnabled', value)}
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
              onSave={(minigames: MinigameEntryType[]) => handleRoomSettingsChange('minigames', minigames)}
              minigames={currentRoomSettings.minigames || []}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
