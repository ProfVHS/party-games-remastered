import { avatars } from '../../../shared/constants/avatars';
import * as roomRepository from '../repositories/roomRepository/roomRepository';

export const randomAvatars = async (roomCode: string = "") => {
  if (roomCode) {
    const players = await roomRepository.getAllPlayers(roomCode);
    const existingAvatars = players.map(p => p.avatar);
    const availableAvatars =  avatars.filter(avatar => !existingAvatars.includes(avatar));

    const randomIndex = Math.floor(Math.random() * availableAvatars.length);

    return availableAvatars[randomIndex];
  }else{
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
  }
}
