import { Socket } from 'socket.io';
import * as roomRepository from '@roomRepository';
import { ClickTheBombDataType } from '@shared/types';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;
    const roomData = (await roomRepository.getMinigameData(roomCode)) as ClickTheBombDataType;

    //updating click count in redis
    await roomRepository.incrementClickCount(roomCode);
  });
};
