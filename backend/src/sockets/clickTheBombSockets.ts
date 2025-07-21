import { Socket } from 'socket.io';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {});
};
