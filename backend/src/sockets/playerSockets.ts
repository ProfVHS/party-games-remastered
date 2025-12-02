import { Socket } from 'socket.io';
import { getAllPlayers } from '@roomRepository';
import { PlayerType } from '@shared/types';

export const sendAllPlayers = async (socket: Socket, roomCode: string, players?: PlayerType[]) => {
  if (!players) {
    players = await getAllPlayers(roomCode);
  }

  socket.nsp.to(roomCode).emit('got_players', players);
};
