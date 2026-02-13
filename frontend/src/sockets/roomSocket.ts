import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useToast } from '@hooks/useToast.ts';
import { GameStateType, PlayerType } from '@shared/types';
import { MinigameEntryType, RoomSettingsType } from '@shared/types/RoomSettingsType.ts';
import { MAX_PLAYERS } from '@shared/constants/gameRules.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { useRoomStore } from '@stores/roomStore.ts';

export const useRoomSocket = () => {
  const { setRoomSettings } = useRoomStore();
  const [minigame, setMinigame] = useState<MinigameEntryType | null>(null);
  const [areRoomSettingsUpToDate, setAreRoomSettingsUpToDate] = useState<boolean>(true);
  const [tutorialsEnabled, setTutorialsEnabled] = useState<boolean>(false);

  const players = usePlayersStore((state) => state.players);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const { sessionData } = useSocketConnection();

  const toast = useToast();

  const slots = [...players, ...Array(MAX_PLAYERS - players.length).fill(null)];

  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.gameState === GameStateType.lobby) {
      setRoomSettings(sessionData.roomSettings);
    }
  }, [sessionData]);

  useEffect(() => {
    socket.on('player_join_toast', handlePlayerJoinToast);
    socket.on('started_minigame', handleStartedMinigame);
    socket.on('updated_room_settings', handleUpdateRoomSettings);
    socket.on('got_players', handleGotPlayers);

    return () => {
      socket.off('player_join_toast', handlePlayerJoinToast);
      socket.off('started_minigame', handleStartedMinigame);
      socket.off('updated_room_settings', handleUpdateRoomSettings);
      socket.off('got_players', handleGotPlayers);
    };
  }, []);

  const handlePlayerJoinToast = (nickname: string) => {
    toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
  };

  const handleStartedMinigame = (minigame: MinigameEntryType, tutorialsEnabled: boolean) => {
    setMinigame(minigame);
    setTutorialsEnabled(tutorialsEnabled);
  };

  const handleUpdateRoomSettings = (roomSettings: RoomSettingsType) => {
    toast.info({ message: 'Host changed room settings', duration: 3 });
    setRoomSettings(roomSettings);
  };

  const handleGotPlayers = (players: PlayerType[]) => {
    setPlayers(players);
  };

  return { minigame, tutorialsEnabled, slots, areRoomSettingsUpToDate, setAreRoomSettingsUpToDate };
};
