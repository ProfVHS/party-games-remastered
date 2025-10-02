import { Socket } from 'socket.io';
import * as roomService from '@roomService';
import { getReadyPlayersCount, getAllPlayers } from '@roomRepository';
import { PlayerType } from '@shared/types';

export const playerSockets = (socket: Socket) => {
  socket.on('toggle_player_ready', async () => {
    const roomCode = socket.data.roomCode;
    const response = await roomService.toggleReadyService(socket);

    if (!response.success) {
      socket.nsp.to(socket.id).emit('failed_to_toggle');
      return;
    }

    // Payload: number of players ready
    socket.nsp.in(roomCode).emit('toggled_player_ready', response.payload);
  });

  socket.on('get_players', async () => {
    const roomCode = socket.data.roomCode;
    const response = await getAllPlayers(roomCode);

    socket.nsp.to(roomCode).emit('got_players', response);
  });

  socket.on('fetch_ready_players', async () => {
    const roomCode = socket.data.roomCode;

    const playersReady = await getReadyPlayersCount(roomCode);
    socket.nsp.to(roomCode).emit('fetched_ready_players', playersReady);
  });
};

//TODO: Consider adding option to pass only 1 player data and then change it in frontend (helpfull if just one player changed one value e.g. isAlive)
export const sendAllPlayers = async (socket: Socket, roomCode: string, players?: PlayerType[]) => {
  if (!players) {
    players = await getAllPlayers(roomCode);
  }

  socket.nsp.to(roomCode).emit('got_players', players);
};
