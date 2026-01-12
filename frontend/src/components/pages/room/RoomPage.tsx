import './RoomPage.scss';
import { useEffect, useState } from 'react';
import { socket } from '@socket';
import { RoomSettings } from '@components/features/roomSettings/RoomSettings.tsx';
import { Lobby } from '@components/features/lobby/Lobby.tsx';
import { PlayerAvatar } from '@components/features/playerAvatar/PlayerAvatar.tsx';
import { EmptySlot } from '@components/features/emptySlot/EmptySlot.tsx';
import { Minigame } from '@components/minigames/Minigame.tsx';
import { RoomLayout } from '@components/features/roomLayout/RoomLayout.tsx';
import { RoomSettingsType } from '@frontend-types/RoomSettingsType.ts';
import { MinigameDataType, MinigameNamesEnum, PlayerType, GameStateType } from '@shared/types';
import { MAX_PLAYERS } from '@shared/constants/gameRules.ts';
import { useSocketConnection } from '@hooks/useSocketConnection.ts';
import { useToast } from '@hooks/useToast.ts';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomStore } from '@stores/roomStore.ts';
import { v4 as uuidv4 } from 'uuid';

export const RoomPage = () => {
  const { setRoomSettings, fetchRoomData } = useRoomStore();
  const [minigameName, setMinigameName] = useState<MinigameNamesEnum | null>(null);
  const [minigameId, setMinigameId] = useState<string>('');
  const [playerIdsReady, setPlayerIdsReady] = useState<string[]>([]);
  const [areRoomSettingsUpToDate, setAreRoomSettingsUpToDate] = useState<boolean>(true);

  const { setPlayers } = usePlayersStore();
  const { sessionData } = useSocketConnection();
  const toast = useToast();

  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.gameState === GameStateType.lobby) {
      setRoomSettings(sessionData.roomSettings);
      setPlayerIdsReady(sessionData.playerIdsReady);
    } else if (sessionData.gameState === GameStateType.playing) {
      setMinigameId(sessionData.minigameId);
      setMinigameName(sessionData.minigameName);
    }
  }, [sessionData]);

  useEffect(() => {
    socket.on('player_join_toast', (nickname: string) => {
      toast.info({ message: `Player ${nickname} joined the room!`, duration: 3 });
    });

    socket.on('started_minigame', (minigameData: MinigameDataType) => {
      setMinigameName(minigameData.minigameName);
      setMinigameId(uuidv4());
      fetchRoomData();
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

  const { players } = usePlayersStore();

  const slots = [...players, ...Array(MAX_PLAYERS - players.length).fill(null)];

  return minigameName ? (
    <RoomLayout players={players}>{minigameName ? <Minigame minigameId={minigameId} minigameName={minigameName} /> : <></>}</RoomLayout>
  ) : (
    <div className="lobby-page">
      <div className="lobby-page__content">
        <RoomSettings playerIdsReady={playerIdsReady} setAreRoomSettingsUpToDate={setAreRoomSettingsUpToDate} />
        <Lobby playerIdsReady={playerIdsReady} setPlayerIdsReady={setPlayerIdsReady} areRoomSettingsUpToDate={areRoomSettingsUpToDate} />
      </div>
      <div className="lobby-page__players">
        {slots.map((player, index) =>
          player !== null ? <PlayerAvatar key={index} player={player} inLobby={true} ready={playerIdsReady.includes(player.id)} /> : <EmptySlot key={index} />,
        )}
      </div>
    </div>
  );
};
