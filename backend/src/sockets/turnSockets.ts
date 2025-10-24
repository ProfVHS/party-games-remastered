import { Socket } from 'socket.io';
import { changeTurnService } from '@minigameService';
import * as roomRepository from '@roomRepository';

export const turnSockets = (socket: Socket) => {
  socket.on('get_turn', async () => {
    const roomCode = socket.data.roomCode;

    const roomData = await roomRepository.getRoomData(roomCode);

    socket.nsp.to(roomCode).emit('got_turn', roomData?.currentTurn);
  });

  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;

    const newTurnData = await changeTurnService(roomCode);

    socket.nsp.to(roomCode).emit('changed_turn', newTurnData);
  });
};
