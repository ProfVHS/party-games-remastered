import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import { getAllPlayers, getReadyPlayersCount, setMinigames, toggleReady, updateRoomData } from '@roomRepository';
import { client } from '@config/db';

const startMinigame = async (roomCode: string, socket: Socket) => {
  const response = await startMinigameService(roomCode, MinigameNamesEnum.cards);

  if (!response.success) {
    socket.nsp.to(roomCode).emit('failed_to_start_minigame');
    return;
  }

  //TODO: Is it necessary to send roomData?
  // Payload: { roomData, minigameData }
  socket.nsp.to(roomCode).emit('started_minigame', response.payload);
};

export const minigameSockets = async (socket: Socket) => {
  socket.on('set_minigames', async (minigames: MinigameNamesEnum[]) => {
    const roomCode = socket.data.roomCode;
    await setMinigames(roomCode, minigames);
  });

  socket.on('start_minigame', async () => {
    const roomCode = socket.data.roomCode;
    await startMinigame(roomCode, socket);
  });

  socket.on('start_minigame_queue', async () => {
    const roomCode = socket.data.roomCode;

    await toggleReady(roomCode, socket.id);
    const playersReady = await getReadyPlayersCount(roomCode);
    const players = await getAllPlayers(roomCode);

    if (playersReady == players.length) {
      //TODO: Add file for this key functions
      const started = await client.setnx(`room:${roomCode}:started`, '1');

      if (started) {
        await updateRoomData(roomCode, { status: RoomStatusEnum.game });
        await startMinigame(roomCode, socket);
      }
    }
  });
};
