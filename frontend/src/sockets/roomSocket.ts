import { socket } from '@socket';
import { useEffect, useState } from 'react';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useToast } from '@hooks/useToast.ts';
import { GameStateResponse, GameStateType, PlayerType } from '@shared/types';
import { MinigameEntryType, RoomSettingsType } from '@shared/types/RoomSettingsType.ts';
import { MAX_PLAYERS } from '@shared/constants/gameRules.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { useRoomStore } from '@stores/roomStore.ts';
import { useGameStore } from '@stores/gameStore.ts';
import { useNavigate } from 'react-router-dom';
import { SlotType } from '@frontend-types/SlotType.ts';

export const useRoomSocket = () => {
  const [minigame, setMinigame] = useState<MinigameEntryType | null>(null);
  const [areRoomSettingsUpToDate, setAreRoomSettingsUpToDate] = useState<boolean>(true);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const updateGameState = useRoomStore((state) => state.updateGameState);
  const updateEndAt = useRoomStore((state) => state.updateEndAt);
  const setRoomSettings = useRoomStore((state) => state.setRoomSettings);
  const setRound = useGameStore((state) => state.setRound);
  const setTurn = useGameStore((state) => state.setTurn);
  const setConfig = useGameStore((state) => state.setConfig);
  const setGameType = useGameStore((state) => state.setType);
  const setDurationRoundOrTurn = useGameStore((state) => state.setDurationRoundOrTurn);
  const navigate = useNavigate();

  const players = usePlayersStore((state) => state.players);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const { sessionData } = useSocketConnection();

  const toast = useToast();

  const slots: SlotType = [...players, ...Array(MAX_PLAYERS - players.length).fill(null)];

  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.gameState === GameStateType.Lobby) {
      setRoomData({ roomCode: sessionData.roomCode, gameState: GameStateType.Lobby, endAt: 0 });
    }
  }, [sessionData]);

  useEffect(() => {
    socket.on('player_join_toast', handlePlayerJoinToast);
    socket.on('got_players', handleGotPlayers);
    socket.on('updated_room_settings', handleUpdateRoomSettings);
    socket.on('update_game_state', handleUpdateGameState);
    socket.on('end_game', handleEndGame);

    return () => {
      socket.off('player_join_toast', handlePlayerJoinToast);
      socket.off('got_players', handleGotPlayers);
      socket.off('updated_room_settings', handleUpdateRoomSettings);
      socket.off('update_game_state', handleUpdateGameState);
      socket.off('end_game', handleEndGame);
    };
  }, []);

  const handleUpdateGameState = (response: GameStateResponse) => {
    if (!response) return;

    updateGameState(response.gameState);
    updateEndAt(response.endAt);

    if (response.gameState === GameStateType.Leaderboard) {
      setTurn(null);
    }

    switch (response.event) {
      case 'MINIGAME_UPDATE':
        setMinigame(response.payload.minigame);
        setGameType(response.payload.type);
        setDurationRoundOrTurn(response.payload.durationMs);

        if (response.payload.type === 'ROUND' && response.payload.value) {
          setRound(response.payload.value);
          setConfig(response.payload.config);
        } else if (response.payload.type === 'TURN' && response.payload.value) {
          setTurn(response.payload.value);
        }
        break;
      case 'ANIMATION_UPDATE':
        if (response.payload.type === 'ROUND' && response.payload.value) {
          setRound(response.payload.value);
          setConfig(response.payload.config);
        } else if (response.payload.type === 'TURN' && response.payload.value) {
          setTurn(response.payload.value);
        }
        break;
      case 'PLAYERS_UPDATE':
        setPlayers(response.payload);
        break;
      default:
        break;
    }
  };

  const handlePlayerJoinToast = (nickname: string) => {
    toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
  };

  const handleUpdateRoomSettings = (settings: RoomSettingsType) => {
    toast.info({ message: 'Host changed room settings', duration: 3 });
    setRoomSettings(settings);
  };

  const handleGotPlayers = (players: PlayerType[]) => {
    setPlayers(players);
  };

  const handleEndGame = () => {
    navigate('/');
  };

  return { minigame, slots, areRoomSettingsUpToDate, setAreRoomSettingsUpToDate };
};
