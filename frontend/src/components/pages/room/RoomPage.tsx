import './LobbyPage.scss';
import { Minigame } from '@components/minigames/Minigame.tsx';
import { RoomLayout } from '@components/features/roomLayout/RoomLayout.tsx';
import { usePlayersStore } from '@stores/playersStore.ts';
import { useRoomSocket } from '@sockets/roomSocket.ts';
import { EndGame } from '@components/features/endGame/EndGame.tsx';
import { useRoomStore } from '@stores/roomStore.ts';
import { GameStateType } from '@shared/types';
import { Loading } from '@components/ui/loading/Loading.tsx';
import { Scoreboard } from '@components/features/leaderboard/Scoreboard.tsx';
import { LobbyPage } from '@components/pages/room/LobbyPage.tsx';

export const RoomPage = () => {
  const { minigame } = useRoomSocket();
  const players = usePlayersStore((state) => state.players);
  const roomData = useRoomStore((state) => state.roomData);

  const isMinigame =
    roomData &&
    minigame &&
    (roomData.gameState === GameStateType.Minigame ||
      roomData.gameState === GameStateType.MinigameIntro ||
      roomData.gameState === GameStateType.MinigameOutro ||
      roomData.gameState === GameStateType.Tutorial);

  const isLeaderboard = roomData && roomData.gameState === GameStateType.Leaderboard;
  const isEndGame = roomData && roomData.gameState === GameStateType.Finished;

  const isStarted = isLeaderboard || isMinigame;

  return roomData ? (
    <>
      {roomData.gameState === GameStateType.Lobby && <LobbyPage />}
      {isStarted && (
        <RoomLayout players={players}>
          {isMinigame && <Minigame key={minigame.id} minigameName={minigame.name} />}
          {isLeaderboard && <Scoreboard />}
        </RoomLayout>
      )}
      {isEndGame && <EndGame />}
    </>
  ) : (
    <Loading />
  );
};
