import './RoomPage.scss';
import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { RoomSettings } from '@components/features/roomSettings/RoomSettings.tsx';
import { Lobby } from '@components/features/lobby/Lobby.tsx';
import PlayerAvatar from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';
import { Minigame } from '@components/minigames/Minigame.tsx';
import { RoomLayout } from '@components/features/roomLayout/RoomLayout.tsx';
import { RoomSettingsType } from '@frontend-types/RoomSettingsType.ts';
import { GameStateType, MinigameNamesEnum, PlayerType, TurnType } from '@shared/types';
import { MAX_PLAYERS } from '@shared/constants/gameRules.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomStore } from '@stores/roomStore.ts';
import { v4 as uuid4 } from 'uuid';
import { useTurnStore } from '@stores/turnStore.ts';

export const RoomPage = () => {
  const { setRoomSettings, fetchRoomData } = useRoomStore();
  const [minigameName, setMinigameName] = useState<MinigameNamesEnum | null>(null);
  const [minigameId, setMinigameId] = useState<string>('');
  const [areRoomSettingsUpToDate, setAreRoomSettingsUpToDate] = useState<boolean>(true);

  const players = usePlayersStore((state) => state.players);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const setTurn = useTurnStore((state) => state.setTurn);
  const setTurnEndAt = useTurnStore((state) => state.setTurnEndAt);

  const { sessionData } = useSocketConnection();
  const toast = useToast();

  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.gameState === GameStateType.lobby) {
      setRoomSettings(sessionData.roomSettings);
    } else if (sessionData.gameState === GameStateType.playing) {
      setMinigameId(sessionData.minigameId);
      setMinigameName(sessionData.minigameName);
    }
  }, [sessionData]);

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    socket.on('started_minigame', (minigameName: MinigameNamesEnum, turn: TurnType, turnEndAt) => {
      setMinigameName(minigameName);
      setMinigameId(uuid4());
      fetchRoomData();
      setTurn(turn);
      setTurnEndAt(turnEndAt);
    });

    socket.on('updated_room_settings', (roomSettings: RoomSettingsType) => {
      toast.info({ message: 'Host changed room settings', duration: 3 });
      setRoomSettings(roomSettings);
    });

    socket.on('got_players', (players: PlayerType[]) => {
      setPlayers(players);
    });

    return () => {
      socket.off('player_join_toast');
      socket.off('started_minigame');
      socket.off('updated_room_settings');
      socket.off('got_players');
    };
  }, [socket]);

  const slots = [...players, ...Array(MAX_PLAYERS - players.length).fill(null)];

  return minigameName ? (
    <RoomLayout players={players}>{minigameName ? <Minigame minigameId={minigameId} minigameName={minigameName} /> : <></>}</RoomLayout>
  ) : (
    <div className="lobby-page">
      <div className="lobby-page__content">
        <RoomSettings setAreRoomSettingsUpToDate={setAreRoomSettingsUpToDate} />
        <Lobby areRoomSettingsUpToDate={areRoomSettingsUpToDate} />
      </div>
      <div className="lobby-page__players">
        {slots.map((player, index) =>
          player !== null ? <PlayerAvatar key={index} player={player} inLobby={true} ready={player.ready} /> : <EmptySlot key={index} />,
        )}
      </div>
    </div>
  );
};
