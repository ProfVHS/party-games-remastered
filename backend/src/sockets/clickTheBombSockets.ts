import { Socket } from 'socket.io';
import { getGameRoom, setGameRoom, updateMinigameData } from '../repositories/roomRepository/gameRoomTable';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;

    const response = await getGameRoom(roomCode);

    if (!response) {
      console.error(`Game data not found`);
      return;
    }
    response.currentMinigameData.clickCount += 1;
    await updateMinigameData(roomCode, response.currentMinigameData);

    socket.nsp.to(roomCode).emit('received_updated_clicks', response.currentMinigameData.clickCount);
  });
};
