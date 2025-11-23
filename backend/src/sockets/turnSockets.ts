import { Socket } from 'socket.io';
import * as roomRepository from '@roomRepository';

import { snakeCase } from 'lodash';
import { minigameRegistry } from '../engine/minigameRegistry';
import { TurnBasedMinigame } from '../engine/turnBasedMinigame';

export const turnSockets = (socket: Socket) => {
  socket.on('get_turn', async () => {
    const roomCode = socket.data.roomCode;
    const minigame = await getMinigame(roomCode);

    const turn = await minigame.getTurn();
    socket.nsp.to(roomCode).emit('got_turn', turn);
  });

  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;
    const minigame = await getMinigame(roomCode);
    const newTurnData = await minigame.nextTurn();
    socket.nsp.to(roomCode).emit('changed_turn', newTurnData);
  });
};

const getMinigame = async (roomCode: string) => {
  const roomSettings = await roomRepository.getRoomSettings(roomCode);
  const roomData = await roomRepository.getRoomData(roomCode);

  if (!roomData) {
    throw new Error(`Couldn't find roomData for room ${roomCode} when starting a game`);
  }

  const currentMinigame = (roomSettings?.minigames ?? [])[roomData?.minigameIndex]?.name;
  const minigame = minigameRegistry.create(snakeCase(currentMinigame), roomCode);
  if (minigame instanceof TurnBasedMinigame) {
    return minigame;
  } else {
    throw new Error(`${currentMinigame} is not a valid turn based minigame`);
  }
};
